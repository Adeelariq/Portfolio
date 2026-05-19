$ErrorActionPreference = "Continue"

$jobs = @(
    @{ in = "tram.png"; out = "tram.webp"; q = 75; w = 800 },
    @{ in = "me.webp"; out = "me_opt.webp"; q = 82; w = 600 },
    @{ in = "VentureIQ.png"; out = "VentureIQ.webp"; q = 78; w = 800 },
    @{ in = "dal-lake-kashmir-in-winter.jpg"; out = "dal-lake-kashmir-in-winter.webp"; q = 75; w = 800 },
    @{ in = "paper_thesis.png"; out = "paper_thesis.webp"; q = 78; w = 800 },
    @{ in = "unnamed.png"; out = "unnamed.webp"; q = 80; w = 800 }
)

foreach ($job in $jobs) {
    Write-Host "Compressing $($job.in) -> $($job.out)..." -ForegroundColor Cyan
    $result = & sharp -i $job.in -o $job.out -f webp -q $job.q resize $job.w 2>&1
    
    if (Test-Path $job.out) {
        $before = (Get-Item $job.in).Length
        $after  = (Get-Item $job.out).Length
        $saved  = [math]::Round((($before - $after) / $before) * 100, 1)
        $bKB    = [math]::Round($before / 1KB, 1)
        $aKB    = [math]::Round($after / 1KB, 1)
        Write-Host "  ✅ $bKB KB -> $aKB KB (saved $saved%)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Failed: $result" -ForegroundColor Red
    }
}

Write-Host "Done." -ForegroundColor Yellow
