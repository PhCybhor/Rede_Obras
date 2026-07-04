# Executar DEPOIS de autorizar o login Cloudflare (cert.pem existe)
# PowerShell: Set-ExecutionPolicy -Scope Process Bypass; .\scripts\finalizar-redeobras-com.ps1

$ErrorActionPreference = "Stop"
$Cf = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path $Root)) { $Root = "C:\Users\pedro\OneDrive\Desktop\REDEOBRAS" }
$CfDir = "$env:USERPROFILE\.cloudflared"

if (-not (Test-Path "$CfDir\cert.pem")) {
    Write-Host "ERRO: Faca login primeiro:" -ForegroundColor Red
    Write-Host "  & '$Cf' tunnel login"
    exit 1
}

Write-Host "=== Criando tunnel ===" -ForegroundColor Cyan
$existing = & $Cf tunnel list 2>$null | Select-String "redeobras-preregistro"
if (-not $existing) {
    & $Cf tunnel create redeobras-preregistro
}

$tunnelLine = (& $Cf tunnel list | Select-String "redeobras-preregistro").Line
$tunnelId = ($tunnelLine -split "\s+")[0]
Write-Host "Tunnel ID: $tunnelId"

$config = @"
tunnel: redeobras-preregistro
credentials-file: $CfDir\$tunnelId.json

ingress:
  - hostname: redeobras.com
    service: http://localhost:5174
  - hostname: www.redeobras.com
    service: http://localhost:5174
  - hostname: cadastro.redeobras.com
    service: http://localhost:5174
  - service: http_status:404
"@
$config | Set-Content "$CfDir\config.yml" -Encoding UTF8
Write-Host "config.yml salvo" -ForegroundColor Green

Write-Host "=== DNS ===" -ForegroundColor Cyan
@("redeobras.com", "www.redeobras.com", "cadastro.redeobras.com") | ForEach-Object {
    Write-Host "  -> $_"
    & $Cf tunnel route dns redeobras-preregistro $_ 2>$null
}

Write-Host "=== Servicos locais ===" -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd /d `"$Root\backend`" && venv\Scripts\python.exe run_preregistro.py" -WindowStyle Minimized
Start-Sleep 3
Start-Process cmd -ArgumentList "/k", "cd /d `"$Root\frontend`" && npm run dev:preregistro" -WindowStyle Minimized
Start-Sleep 5

Write-Host "=== Tunnel servico Windows ===" -ForegroundColor Cyan
& $Cf service install 2>$null
& $Cf service start 2>$null

Write-Host ""
Write-Host "PRONTO!" -ForegroundColor Green
Write-Host "  https://redeobras.com"
Write-Host "  https://www.redeobras.com"
Write-Host "  https://cadastro.redeobras.com"
Write-Host ""
Write-Host "Se ainda nao funcionar: troque nameservers GoDaddy -> Cloudflare" -ForegroundColor Yellow
