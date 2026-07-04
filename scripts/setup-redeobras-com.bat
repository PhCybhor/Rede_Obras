@echo off
setlocal EnableDelayedExpansion
set ROOT=%~dp0..
set CF="C:\Program Files (x86)\cloudflared\cloudflared.exe"
if not exist %CF% set CF=cloudflared

echo ============================================
echo   REDEOBRAS - redeobras.com
echo ============================================
echo.

if not exist "%USERPROFILE%\.cloudflared\cert.pem" (
  echo [AUTH] Faca login na Cloudflare no navegador que vai abrir...
  %CF% tunnel login
  if errorlevel 1 (
    echo ERRO: login falhou. Tente novamente.
    pause
    exit /b 1
  )
)

echo [TUNNEL] Criando tunnel se nao existir...
%CF% tunnel list 2>nul | findstr /i "redeobras-preregistro" >nul
if errorlevel 1 (
  %CF% tunnel create redeobras-preregistro
)

echo [TUNNEL] Obtendo ID...
for /f "tokens=*" %%i in ('%CF% tunnel list ^| findstr /i "redeobras-preregistro"') do set TLINE=%%i
for /f "tokens=1" %%a in ("!TLINE!") do set TUNNEL_ID=%%a
echo Tunnel ID: !TUNNEL_ID!

(
echo tunnel: redeobras-preregistro
echo credentials-file: %USERPROFILE%\.cloudflared\!TUNNEL_ID!.json
echo.
echo ingress:
echo   - hostname: redeobras.com
echo     service: http://localhost:5174
echo   - hostname: www.redeobras.com
echo     service: http://localhost:5174
echo   - hostname: cadastro.redeobras.com
echo     service: http://localhost:5174
echo   - service: http_status:404
) > "%USERPROFILE%\.cloudflared\config.yml"

echo [DNS] Apontando subdominios...
%CF% tunnel route dns redeobras-preregistro redeobras.com 2>nul
%CF% tunnel route dns redeobras-preregistro www.redeobras.com 2>nul
%CF% tunnel route dns redeobras-preregistro cadastro.redeobras.com 2>nul

echo [SERVICOS] Iniciando backend e frontend...
start "REDEOBRAS API" /min cmd /c "cd /d %ROOT%\backend && venv\Scripts\python.exe run_preregistro.py"
timeout /t 3 /nobreak >nul
start "REDEOBRAS Frontend" /min cmd /c "cd /d %ROOT%\frontend && npm run dev:preregistro"
timeout /t 5 /nobreak >nul

echo [TUNNEL] Instalando servico Windows...
%CF% service install 2>nul
%CF% service start 2>nul

echo.
echo ============================================
echo   PRONTO!
echo   https://redeobras.com
echo   https://www.redeobras.com
echo   https://cadastro.redeobras.com
echo ============================================
echo.
echo IMPORTANTE: Na GoDaddy, troque os nameservers
echo para os da Cloudflare (painel dash.cloudflare.com)
echo.
pause
