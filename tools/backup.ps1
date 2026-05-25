<#
.SYNOPSIS
  Crea un backup completo del proyecto ACAR (código fuente + configuración).
.DESCRIPTION
  Genera un archivo ZIP con timestamp en la carpeta backups/ y, opcionalmente,
  exporta la base de datos de Firebase Realtime Database como JSON.
.PARAMETER SkipFirebase
  Omitir exportación de Firebase incluso si FIREBASE_SECRET está configurado.
.PARAMETER OutputDir
  Directorio donde guardar el backup (default: ../backups)
.EXAMPLE
  .\tools\backup.ps1
  .\tools\backup.ps1 -SkipFirebase
#>

param(
  [switch]$SkipFirebase,
  [string]$OutputDir = (Join-Path $PSScriptRoot '..\backups')
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$Timestamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$ZipName = "ACAR_backup_$Timestamp.zip"
$ZipPath = Join-Path $OutputDir $ZipName

# Ensure output dir exists
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }

Write-Host "=== ACAR Backup Tool ===" -ForegroundColor Cyan
Write-Host "Project : $ProjectRoot"
Write-Host "Output  : $ZipPath"

# --- Code backup (exclude node_modules, dist, .vercel) ---
Write-Host "`n[1/2] Empaquetando código fuente..." -ForegroundColor Yellow
try {
  Compress-Archive -Path (Join-Path $ProjectRoot '*') -DestinationPath $ZipPath -CompressionLevel Optimal
  Write-Host "  OK -> $ZipPath" -ForegroundColor Green
} catch {
  # If Compress-Archive fails on long paths, try with 7z if available
  Write-Host "  Fallback: usando tar..." -ForegroundColor Yellow
  $tarPath = "$ZipName.tar.gz"
  $excludes = @('--exclude=node_modules', '--exclude=dist', '--exclude=.vercel/cache', '--exclude=backups')
  & tar -czf "$OutputDir\$tarPath" $excludes -C $ProjectRoot .
  Write-Host "  OK -> $OutputDir\$tarPath" -ForegroundColor Green
}

# --- Firebase DB export (optional) ---
if (-not $SkipFirebase) {
  $secret = $env:FIREBASE_SECRET
  $projectId = $env:FIREBASE_PROJECT_ID
  if (-not $secret -or -not $projectId) {
    Write-Host "`n[2/2] Firebase export SKIPPED — set FIREBASE_SECRET & FIREBASE_PROJECT_ID env vars" -ForegroundColor DarkYellow
  } else {
    Write-Host "`n[2/2] Exportando Firebase Realtime Database..." -ForegroundColor Yellow
    $jsonPath = Join-Path $OutputDir "ACAR_firebase_$Timestamp.json"
    try {
      $url = "https://$projectId-default-rtdb.firebaseio.com/.json?auth=$secret"
      Invoke-WebRequest -Uri $url -OutFile $jsonPath
      Write-Host "  OK -> $jsonPath" -ForegroundColor Green
    } catch {
      Write-Host "  ERROR: No se pudo exportar Firebase: $_" -ForegroundColor Red
    }
  }
}

Write-Host "`n=== Backup completado ===" -ForegroundColor Cyan
Write-Host "Para restaurar: .\tools\recovery.ps1 -Source `"$ZipPath`"" -ForegroundColor Magenta
