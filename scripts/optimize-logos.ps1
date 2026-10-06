Add-Type -AssemblyName System.Drawing

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $baseDir
$assetsDir = Join-Path $projectRoot "src\assets"
$backupDir = Join-Path $assetsDir "original_backup"

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$backupFile = Join-Path $backupDir "logo_original.png"
if (!(Test-Path $backupFile)) {
    Copy-Item $srcFile $backupFile
}

$fileBytes = [System.IO.File]::ReadAllBytes($backupFile)
$ms = New-Object System.IO.MemoryStream(,$fileBytes)
$originalBmp = [System.Drawing.Bitmap]::FromStream($ms)
$origWidth = $originalBmp.Width
$origHeight = $originalBmp.Height

Write-Output "Original dimensions: $origWidth x $origHeight"

function Resize-And-Save {
    param (
        [System.Drawing.Bitmap]$source,
        [int]$targetWidth,
        [int]$targetHeight,
        [string]$outputPath
    )

    $targetBmp = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBmp)
    
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.DrawImage($source, 0, 0, $targetWidth, $targetHeight)
    $graphics.Dispose()

    if (Test-Path $outputPath) {
        Remove-Item $outputPath -Force
    }
    $targetBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()

    $sizeKB = [Math]::Round((Get-Item $outputPath).Length / 1024, 1)
    Write-Output "Saved $outputPath ($targetWidth x $targetHeight, $sizeKB KB)"
}

# 1x: ~200 x 247 (Crisp for standard navbar 50px/60px, portal, footer)
$w1 = 200
$h1 = [int][Math]::Round($w1 * $origHeight / $origWidth)
$out1 = Join-Path $assetsDir "1x\logo.png"
Resize-And-Save $originalBmp $w1 $h1 $out1

# 2x: ~400 x 495 (Crisp for Retina @2x screens)
$w2 = 400
$h2 = [int][Math]::Round($w2 * $origHeight / $origWidth)
$out2 = Join-Path $assetsDir "2x\logo@2x.png"
Resize-And-Save $originalBmp $w2 $h2 $out2

# 3x: ~600 x 742 (Crisp for Super Retina @3x screens, max mobile resolution)
$w3 = 600
$h3 = [int][Math]::Round($w3 * $origHeight / $origWidth)
$out3 = Join-Path $assetsDir "3x\logo@3x.png"
Resize-And-Save $originalBmp $w3 $h3 $out3

$originalBmp.Dispose()
Write-Output "Done optimizing logos!"
