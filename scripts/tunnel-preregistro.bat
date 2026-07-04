@echo off
REM REDEOBRAS — expoe a landing de pre-registro via Cloudflare Tunnel (maquina local)
set ROOT=%~dp0..
set CLOUDFLARED="C:\Program Files (x86)\cloudflared\cloudflared.exe"
if not exist %CLOUDFLARED% set CLOUDFLARED=cloudflared

echo.
echo [1/3] Backend pre-registro (porta 8000)...
start "REDEOBRAS API" cmd /k "cd /d %ROOT%\backend && venv\Scripts\python.exe run_preregistro.py"

timeout /t 3 /nobreak >nul

echo [2/3] Frontend pre-registro (porta 5174)...
start "REDEOBRAS Frontend" cmd /k "cd /d %ROOT%\frontend && npm run dev:preregistro"

timeout /t 5 /nobreak >nul

echo [3/3] Cloudflare Tunnel...
echo.
echo Aguarde a URL publica (https://....trycloudflare.com) abaixo:
echo.
%CLOUDFLARED% tunnel --url http://localhost:5174
