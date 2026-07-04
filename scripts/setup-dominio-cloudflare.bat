@echo off
REM Configurar dominio GoDaddy + Cloudflare Tunnel (executar UMA VEZ)
set CLOUDFLARED="C:\Program Files (x86)\cloudflared\cloudflared.exe"
if not exist %CLOUDFLARED% set CLOUDFLARED=cloudflared

echo.
echo === PASSO 1: Login na Cloudflare ===
echo Abrira o navegador para autorizar o cloudflared.
pause
%CLOUDFLARED% tunnel login

echo.
echo === PASSO 2: Criar tunnel nomeado ===
%CLOUDFLARED% tunnel create redeobras-preregistro

echo.
echo === PASSO 3: Copiar config ===
echo Edite scripts\cloudflared-config.example.yml com seu dominio
echo e copie para: C:\Users\pedro\.cloudflared\config.yml
echo Troque TUNNEL-ID pelo ID que apareceu acima.
pause

echo.
echo === PASSO 4: DNS (subdominio cadastro) ===
set /p DOMINIO="Digite seu dominio (ex: redeobras.com.br): "
%CLOUDFLARED% tunnel route dns redeobras-preregistro cadastro.%DOMINIO%

echo.
echo === PASSO 5: Instalar como servico Windows (inicia com o PC) ===
%CLOUDFLARED% service install
%CLOUDFLARED% service start

echo.
echo Pronto! Mantenha backend + frontend rodando localmente.
echo URL: https://cadastro.%DOMINIO%
pause
