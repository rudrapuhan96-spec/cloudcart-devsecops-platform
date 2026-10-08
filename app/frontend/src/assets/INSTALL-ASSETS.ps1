$project = 'C:\Users\krish\Desktop\cloudcart-devsecops-platform'
$target = Join-Path $project 'app\frontend\src\assets'
$zip = Join-Path $env:TEMP 'CloudCart_Product_Assets.zip'
Write-Host "Extracting CloudCart assets to $target"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Expand-Archive -Path $zip -DestinationPath $target -Force
Write-Host 'Assets installed.'
Get-ChildItem (Join-Path $target 'products') | Select-Object Name, Length
