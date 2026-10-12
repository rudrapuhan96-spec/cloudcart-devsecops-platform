[CmdletBinding()]
param(
    [switch]$PlanOnly,
    [switch]$SkipTerraform
)
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$Region = "ap-south-1"
$Cluster = "cloudcart-eks"
$Account = (aws sts get-caller-identity --query Account --output text).Trim()
if ($LASTEXITCODE -ne 0 -or !$Account) { throw "AWS CLI credentials not working. Run aws sts get-caller-identity first." }
$Root = $PSScriptRoot
Set-Location $Root

foreach ($cmd in @("terraform","aws","docker","kubectl")) {
    if (!(Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "Required command missing: $cmd" }
}
docker info | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Docker Desktop engine is not running." }

Write-Host "`n== CloudCart deployment ==" -ForegroundColor Cyan
Write-Host "AWS account: $Account | Region: $Region | EKS: $Cluster"

# Keep EKS public API access limited to the current public IPv4 address.
$publicIp = (Invoke-RestMethod -Uri "https://checkip.amazonaws.com").Trim()
if ($publicIp -notmatch '^\d{1,3}(\.\d{1,3}){3}$') { throw "Could not determine public IPv4 address for EKS API allow-list." }
$eksConfig = Join-Path $Root "infra\eks.tf"
$eksText = Get-Content $eksConfig -Raw
$updatedEksText = [regex]::Replace($eksText, '(?m)^\s*endpoint_public_access_cidrs\s*=\s*\[[^\]]*\]', "  endpoint_public_access_cidrs = [`"$publicIp/32`"]", 1)
if ($updatedEksText -eq $eksText -and $eksText -notmatch 'endpoint_public_access_cidrs') {
    throw "endpoint_public_access_cidrs was not found in infra\eks.tf; refusing to deploy with unknown API access."
}
if ($updatedEksText -ne $eksText) { Set-Content -Encoding utf8 $eksConfig $updatedEksText }

if (!$SkipTerraform) {
    terraform -chdir=infra init
    if ($LASTEXITCODE -ne 0) { throw "Terraform init failed." }
    terraform -chdir=infra validate
    if ($LASTEXITCODE -ne 0) { throw "Terraform validation failed." }
    Push-Location (Join-Path $Root "infra")
    try {
        terraform plan -out cloudcart-deployment.tfplan
        $planExit = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }
    if ($planExit -ne 0) { throw "Terraform plan failed." }
    if ($PlanOnly) { Write-Host "Plan saved to infra\cloudcart-deployment.tfplan. No infrastructure was created."; exit 0 }
    Write-Host "`nWARNING: EKS nodes, NAT Gateways, load balancers and other AWS resources incur charges." -ForegroundColor Yellow
    $approval = Read-Host "Type APPLY to create/update the infrastructure"
    if ($approval -cne "APPLY") { throw "Cancelled. No Terraform apply was run." }
    terraform -chdir=infra apply cloudcart-deployment.tfplan
    if ($LASTEXITCODE -ne 0) { throw "Terraform apply failed." }
}

# ECR repository names are created by infra/ecr.tf.
$BackendRepo = "$Account.dkr.ecr.$Region.amazonaws.com/cloudcart-backend"
$FrontendRepo = "$Account.dkr.ecr.$Region.amazonaws.com/cloudcart-frontend"
$tag = (Get-Date -Format "yyyyMMddHHmmss")
$BackendImage = "${BackendRepo}:$tag"
$FrontendImage = "${FrontendRepo}:$tag"

cmd.exe /c "aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 937383326491.dkr.ecr.ap-south-1.amazonaws.com"
if ($LASTEXITCODE -ne 0) { throw "ECR login failed." }

docker build -t $BackendImage .\app\backend
if ($LASTEXITCODE -ne 0) { throw "Backend image build failed." }
docker push $BackendImage
if ($LASTEXITCODE -ne 0) { throw "Backend image push failed." }

docker build --build-arg VITE_API_BASE_URL=/api -t $FrontendImage .\app\frontend
if ($LASTEXITCODE -ne 0) { throw "Frontend image build failed." }
docker push $FrontendImage
if ($LASTEXITCODE -ne 0) { throw "Frontend image push failed." }

aws eks update-kubeconfig --region $Region --name $Cluster
if ($LASTEXITCODE -ne 0) { throw "Could not configure kubectl for EKS." }

# Create private app secrets from locally configured .env without printing values.
$envFile = Join-Path $Root "app\backend\.env"
$adminKey = $null
$smtp = @{}
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*([^#=\s]+)\s*=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            if ($key -eq "ADMIN_API_KEY") { $adminKey = $value }
            if ($key -in @("SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASS","MAIL_FROM") -and $value) { $smtp[$key] = $value }
        }
    }
}
if (!$adminKey) { $adminKey = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N") }
$dbPassword = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
$rootPassword = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
$secretArgs = @(
    "create","secret","generic","cloudcart-secrets","-n","cloudcart",
    "--from-literal=DB_PASSWORD=$dbPassword",
    "--from-literal=MYSQL_ROOT_PASSWORD=$rootPassword",
    "--from-literal=ADMIN_API_KEY=$adminKey"
)
foreach ($key in $smtp.Keys) { $secretArgs += "--from-literal=$key=$($smtp[$key])" }
$secretArgs += @("--dry-run=client","-o","yaml")
$secretYaml = & kubectl @secretArgs
if ($LASTEXITCODE -ne 0) { throw "Could not build Kubernetes secret." }
$secretYaml | kubectl apply -f -
if ($LASTEXITCODE -ne 0) { throw "Could not apply Kubernetes secret." }

# Embed schema.sql as an indented ConfigMap block.
$schemaPath = Join-Path $Root "database\schema.sql"
if (!(Test-Path $schemaPath)) { throw "database\schema.sql not found; refusing to deploy an empty database schema." }
$schema = Get-Content $schemaPath -Raw
$indentedSchema = (($schema -split "`r?`n") | ForEach-Object { "    $_" }) -join "`n"
$template = Get-Content (Join-Path $Root "k8s\cloudcart.yaml.template") -Raw
$template = $template.Replace("__SCHEMA__", $indentedSchema)
$template = $template.Replace("__BACKEND_IMAGE__", $BackendImage)
$template = $template.Replace("__FRONTEND_IMAGE__", $FrontendImage)
$rendered = Join-Path $env:TEMP "cloudcart-k8s-$tag.yaml"
Set-Content -Encoding utf8 $rendered $template

kubectl apply -f $rendered
if ($LASTEXITCODE -ne 0) { throw "Kubernetes manifest apply failed." }
kubectl -n cloudcart rollout status deployment/cloudcart-mysql --timeout=300s
if ($LASTEXITCODE -ne 0) { throw "MySQL rollout failed. Inspect: kubectl -n cloudcart logs deploy/cloudcart-mysql" }
kubectl -n cloudcart rollout status deployment/cloudcart-backend --timeout=300s
if ($LASTEXITCODE -ne 0) { throw "Backend rollout failed. Inspect backend pod logs." }
kubectl -n cloudcart rollout status deployment/cloudcart-frontend --timeout=300s
if ($LASTEXITCODE -ne 0) { throw "Frontend rollout failed. Inspect frontend pod logs." }

Write-Host "`nWaiting for AWS LoadBalancer address..." -ForegroundColor Cyan
$url = $null
for ($i=0; $i -lt 60; $i++) {
    $hostName = (kubectl -n cloudcart get service cloudcart-frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>$null)
    if ($hostName) { $url = "http://$hostName"; break }
    Start-Sleep -Seconds 10
}
if (!$url) { throw "LoadBalancer URL is not ready yet. Check: kubectl -n cloudcart get svc cloudcart-frontend" }
Write-Host "`nCloudCart public URL: $url" -ForegroundColor Green
Write-Host "Health endpoint: $url/api/health"
Write-Host "Admin API key: $adminKey" -ForegroundColor Yellow
Write-Host "Save this key securely; it is needed for admin operations."





