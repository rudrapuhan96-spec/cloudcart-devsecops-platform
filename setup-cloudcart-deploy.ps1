$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
if (!(Test-Path (Join-Path $root "infra\eks.tf")) -or !(Test-Path (Join-Path $root "app\backend\Dockerfile"))) {
    throw "Run this setup script from the CloudCart repository root."
}

# Keep originals before making the small production-routing change.
$nginxPath = Join-Path $root "app\frontend\nginx.conf"
$nginxBackup = "$nginxPath.before-cloudcart-deploy.bak"
if (!(Test-Path $nginxBackup)) { Copy-Item $nginxPath $nginxBackup }

@'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://cloudcart-backend:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
    }
}
'@ | Set-Content -Encoding utf8 $nginxPath

$dockerfile = Join-Path $root "app\frontend\Dockerfile"
$dockerText = Get-Content $dockerfile -Raw
if ($dockerText -notmatch 'ARG VITE_API_BASE_URL') {
    $dockerText = [regex]::Replace(
        $dockerText,
        '(?m)^RUN npm run build\s*$',
        "ARG VITE_API_BASE_URL=/api`r`nENV VITE_API_BASE_URL=`$VITE_API_BASE_URL`r`nRUN npm run build",
        1
    )
    Set-Content -Encoding utf8 $dockerfile $dockerText
}

$k8sDir = Join-Path $root "k8s"
New-Item -ItemType Directory -Force -Path $k8sDir | Out-Null

@'
apiVersion: v1
kind: Namespace
metadata:
  name: cloudcart
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cloudcart-mysql-init
  namespace: cloudcart
data:
  01-schema.sql: |
__SCHEMA__
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudcart-mysql
  namespace: cloudcart
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: cloudcart-mysql
  template:
    metadata:
      labels:
        app: cloudcart-mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.4
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_DATABASE
              value: cloudcart
            - name: MYSQL_USER
              value: cloudcart
            - name: MYSQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: cloudcart-secrets
                  key: DB_PASSWORD
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: cloudcart-secrets
                  key: MYSQL_ROOT_PASSWORD
          readinessProbe:
            exec:
              command: ["sh", "-c", "mysqladmin ping -h 127.0.0.1 -u root -p\"$MYSQL_ROOT_PASSWORD\""]
            initialDelaySeconds: 20
            periodSeconds: 10
          livenessProbe:
            exec:
              command: ["sh", "-c", "mysqladmin ping -h 127.0.0.1 -u root -p\"$MYSQL_ROOT_PASSWORD\""]
            initialDelaySeconds: 60
            periodSeconds: 20
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
            - name: init-schema
              mountPath: /docker-entrypoint-initdb.d/01-schema.sql
              subPath: 01-schema.sql
      volumes:
        - name: mysql-data
          emptyDir: {}
        - name: init-schema
          configMap:
            name: cloudcart-mysql-init
---
apiVersion: v1
kind: Service
metadata:
  name: cloudcart-mysql
  namespace: cloudcart
spec:
  selector:
    app: cloudcart-mysql
  ports:
    - name: mysql
      port: 3306
      targetPort: 3306
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudcart-backend
  namespace: cloudcart
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloudcart-backend
  template:
    metadata:
      labels:
        app: cloudcart-backend
    spec:
      containers:
        - name: backend
          image: __BACKEND_IMAGE__
          imagePullPolicy: Always
          ports:
            - containerPort: 4000
          env:
            - name: NODE_ENV
              value: production
            - name: PORT
              value: "4000"
            - name: DB_HOST
              value: cloudcart-mysql
            - name: DB_PORT
              value: "3306"
            - name: DB_USER
              value: cloudcart
            - name: DB_NAME
              value: cloudcart
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: cloudcart-secrets
                  key: DB_PASSWORD
            - name: ADMIN_API_KEY
              valueFrom:
                secretKeyRef:
                  name: cloudcart-secrets
                  key: ADMIN_API_KEY
          readinessProbe:
            httpGet:
              path: /api/health
              port: 4000
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /api/health
              port: 4000
            initialDelaySeconds: 25
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: cloudcart-backend
  namespace: cloudcart
spec:
  selector:
    app: cloudcart-backend
  ports:
    - name: http
      port: 4000
      targetPort: 4000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudcart-frontend
  namespace: cloudcart
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloudcart-frontend
  template:
    metadata:
      labels:
        app: cloudcart-frontend
    spec:
      containers:
        - name: frontend
          image: __FRONTEND_IMAGE__
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: cloudcart-frontend
  namespace: cloudcart
spec:
  type: LoadBalancer
  selector:
    app: cloudcart-frontend
  ports:
    - name: http
      port: 80
      targetPort: 80
'@ | Set-Content -Encoding utf8 (Join-Path $k8sDir "cloudcart.yaml.template")

$deploy = @'
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
    terraform -chdir=infra plan -out=cloudcart-deployment.tfplan
    if ($LASTEXITCODE -ne 0) { throw "Terraform plan failed." }
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

aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$Account.dkr.ecr.$Region.amazonaws.com"
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
'@
Set-Content -Encoding utf8 (Join-Path $root "deploy.ps1") $deploy

Write-Host "`nCreated:" -ForegroundColor Green
Write-Host "  deploy.ps1"
Write-Host "  k8s\cloudcart.yaml.template"
Write-Host "Updated frontend nginx.conf to proxy /api to the backend service."
Write-Host "Updated frontend Dockerfile to build with VITE_API_BASE_URL=/api."
Write-Host "`nNext run: .\deploy.ps1 -PlanOnly"
