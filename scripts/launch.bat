@echo off
REM ==========================================================
REM Venezuela Solidaria · Launcher (Windows nativo)
REM ==========================================================
REM Uso: doble click en scripts\launch.bat
REM ==========================================================

echo.
echo  ==========================================
echo   VENEZUELA SOLIDARIA - LAUNCHER (Windows)
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js no encontrado.
  echo Instala Node.js 20+ desde https://nodejs.org
  pause
  exit /b 1
)

echo [OK] Node:
node --version

if not exist "node_modules" (
  echo [..] Instalando dependencias (puede tardar)...
  call npm install
) else (
  echo [OK] Dependencias instaladas
)

if not exist ".env.local" (
  echo [..] Creando .env.local...
  copy /Y .env.example .env.local >nul
)

REM Detectar modo SQLite
findstr /C:"postgresql" .env.local >nul 2>nul
if errorlevel 1 (
  echo [..] Modo DEMO con SQLite activado
  set USE_SQLITE=1
)

if "%USE_SQLITE%"=="1" (
  REM Backup schema y crear versión SQLite
  if exist "prisma\schema.prisma.bak" del "prisma\schema.prisma.bak"
  copy /Y prisma\schema.prisma prisma\schema.prisma.bak >nul

  REM Usar PowerShell para escribir el schema SQLite (evita problemas con heredoc en .bat)
  powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\switch-to-sqlite.ps1"
)

echo [..] Generando cliente Prisma...
call npx prisma generate

if "%USE_SQLITE%"=="1" (
  if not exist "prisma\dev.db" (
    echo [..] Creando base de datos SQLite...
    call npx prisma db push --skip-generate
  )
  echo [..] Sembrando datos demo...
  call npx tsx prisma/seed-sqlite.ts
)

echo.
echo [OK] Todo listo. Abriendo navegador en http://localhost:3000
echo.
start "" http://localhost:3000
call npm run dev
pause