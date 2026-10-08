$ErrorActionPreference = 'Stop'

$project = 'C:\Users\krish\Desktop\cloudcart-devsecops-platform'
$storeCss = Join-Path $project 'app\frontend\src\pages\Store.css'
$assetsDir = Join-Path $project 'app\frontend\src\assets\products'

$required = @(
  'cloud-hoodie.webp',
  'devops-backpack.webp',
  'terminal-mug.webp',
  'kubernetes-tee.webp',
  'sticker-pack.webp',
  'desk-kit.webp'
)

if (-not (Test-Path $storeCss)) {
  throw "Store.css not found: $storeCss"
}

$missing = $required | Where-Object {
  -not (Test-Path (Join-Path $assetsDir $_))
}

if ($missing) {
  throw "Missing product asset(s): $($missing -join ', ')"
}

$css = Get-Content $storeCss -Raw
$marker = '/* CLOUDCART PRODUCT IMAGE OVERRIDE */'

if ($css -notmatch [regex]::Escape($marker)) {

  $block = @'

/* CLOUDCART PRODUCT IMAGE OVERRIDE */

.store-product-visual,
.store-product-image {
  background-color: #0a1018 !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

.store-product-visual::before,
.store-product-visual::after,
.store-product-image::before,
.store-product-image::after {
  display: none !important;
}

.store-product-visual > .store-product-mark,
.store-product-image > .store-product-mark,
.store-product-visual > span:not(.store-product-badge),
.store-product-image > span:not(.store-product-badge) {
  display: none !important;
}

.store-product:nth-child(1) .store-product-visual,
.store-product:nth-child(1) .store-product-image {
  background-image: url("../assets/products/cloud-hoodie.webp") !important;
}

.store-product:nth-child(2) .store-product-visual,
.store-product:nth-child(2) .store-product-image {
  background-image: url("../assets/products/devops-backpack.webp") !important;
}

.store-product:nth-child(3) .store-product-visual,
.store-product:nth-child(3) .store-product-image {
  background-image: url("../assets/products/terminal-mug.webp") !important;
}

.store-product:nth-child(4) .store-product-visual,
.store-product:nth-child(4) .store-product-image {
  background-image: url("../assets/products/kubernetes-tee.webp") !important;
}

.store-product:nth-child(5) .store-product-visual,
.store-product:nth-child(5) .store-product-image {
  background-image: url("../assets/products/sticker-pack.webp") !important;
}

.store-product:nth-child(6) .store-product-visual,
.store-product:nth-child(6) .store-product-image {
  background-image: url("../assets/products/desk-kit.webp") !important;
}
'@

  Add-Content -Path $storeCss -Value $block -Encoding utf8
  Write-Host 'Product image CSS added to Store.css.'
}
else {
  Write-Host 'Product image CSS is already present; nothing changed.'
}

Write-Host ''
Write-Host 'Verified product assets:' -ForegroundColor Cyan

$required | ForEach-Object {
  $p = Join-Path $assetsDir $_
  $f = Get-Item $p
  Write-Host ("  {0} ({1} KB)" -f $f.Name, [math]::Round($f.Length / 1KB, 1))
}