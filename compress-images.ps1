# Image compression script for Portfolio
# Requires: npm install -g sharp-cli  (run this first)
# Or uses built-in PowerShell to show file sizes before and after

Write-Host "=== Portfolio Image Size Report ===" -ForegroundColor Cyan
Write-Host ""

$images = @(
    "me.webp",
    "tram.png",
    "VentureIQ.png",
    "dal-lake-kashmir-in-winter.jpg",
    "paper_thesis.png",
    "Champion.webp",
    "unnamed.png",
    "Fitness Hive.webp",
    "result_logo.png",
    "rock-paper-scissors-neon-icons.jpg",
    "android-chrome-512x512.png",
    "android-chrome-192x192.png"
)

$totalBefore = 0
foreach ($img in $images) {
    if (Test-Path $img) {
        $size = (Get-Item $img).Length
        $totalBefore += $size
        $sizeKB = [math]::Round($size / 1KB, 1)
        $status = if ($size -gt 500KB) { "❌ TOO LARGE" } elseif ($size -gt 200KB) { "⚠️  Large" } else { "✅ OK" }
        Write-Host "$status  $img  ($sizeKB KB)" -ForegroundColor $(if ($size -gt 500KB) { "Red" } elseif ($size -gt 200KB) { "Yellow" } else { "Green" })
    }
}

Write-Host ""
Write-Host "Total image payload: $([math]::Round($totalBefore / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== RECOMMENDED ACTIONS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install sharp-cli (one-time):" -ForegroundColor White
Write-Host "   npm install -g sharp-cli" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Compress each large image (run in this folder):" -ForegroundColor White
Write-Host "   sharp -i tram.png -o tram.webp --webp-quality 80 --resize 800" -ForegroundColor Gray
Write-Host "   sharp -i 'me.webp' -o 'me-opt.webp' --webp-quality 82 --resize 600" -ForegroundColor Gray
Write-Host "   sharp -i 'VentureIQ.png' -o 'VentureIQ.webp' --webp-quality 80 --resize 800" -ForegroundColor Gray
Write-Host "   sharp -i 'dal-lake-kashmir-in-winter.jpg' -o 'dal-lake.webp' --webp-quality 78 --resize 800" -ForegroundColor Gray
Write-Host "   sharp -i 'paper_thesis.png' -o 'paper_thesis.webp' --webp-quality 80 --resize 800" -ForegroundColor Gray
Write-Host ""
Write-Host "3. OR use Squoosh (free online tool, no install needed):" -ForegroundColor White
Write-Host "   https://squoosh.app" -ForegroundColor Blue
Write-Host "   - Drag and drop each image" -ForegroundColor Gray
Write-Host "   - Select WebP format, quality 75-85" -ForegroundColor Gray
Write-Host "   - Resize to max 800px width" -ForegroundColor Gray
Write-Host "   - Download and replace original files" -ForegroundColor Gray
Write-Host ""
Write-Host "Target: Each image should be under 150KB for good performance." -ForegroundColor Green
