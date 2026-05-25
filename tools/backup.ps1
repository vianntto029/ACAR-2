<#
.SYNOPSIS
  Crea un backup completo del proyecto ACAR (codigo fuente + configuracion).
.PARAMETER SkipFirebase
  Omitir exportacion de Firebase.
#>

param(
  [switch]$SkipFirebase,
  [string]$OutputDir = (Join-Path $PSScriptRoot '..\backups')
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$Timestamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$ZipName = "ACAR_backup_$Timestamp.tar.gz"
$ZipPath = Join-Path $OutputDir $ZipName

if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }

Write-Host '=== ACAR Backup Tool ===' -ForegroundColor Cyan
Write-Host "Project : $ProjectRoot"
Write-Host "Output  : $ZipPath"

Write-Host ''
Write-Host '[1/2] Empaquetando codigo fuente...' -ForegroundColor Yellow

$excludes = @(
  '--exclude=node_modules',
  '--exclude=dist',
  '--exclude=.vercel',
  '--exclude=backups',
  '--exclude=.git'
)

& tar -czf $ZipPath $excludes -C $ProjectRoot .
if ($LASTEXITCODE -eq 0) {
  Write-Host '  OK' -ForegroundColor Green
} else {
  Write-Host '  ERROR: tar fallo' -ForegroundColor Red
  exit 1
}

if (-not $SkipFirebase) {
  $secret = $env:FIREBASE_SECRET
  $projectId = $env:FIREBASE_PROJECT_ID
  if (-not $secret -or -not $projectId) {
    Write-Host ''
    Write-Host '[2/2] Firebase SKIPPED' -ForegroundColor DarkYellow
  } else {
    Write-Host ''
    Write-Host '[2/2] Exportando Firebase...' -ForegroundColor Yellow
    $jsonPath = Join-Path $OutputDir "ACAR_firebase_$Timestamp.json"
    try {
      $url = "https://$projectId-default-rtdb.firebaseio.com/.json?auth=$secret"
      Invoke-WebRequest -Uri $url -OutFile $jsonPath
      Write-Host '  OK' -ForegroundColor Green
    } catch {
      Write-Host "  ERROR: $_" -ForegroundColor Red
    }
  }
}

Write-Host ''
Write-Host '=== Backup completado ===' -ForegroundColor Cyan
Write-Host "Para restaurar: .\tools\recovery.ps1 -Source `"$ZipPath`"" -ForegroundColor Magenta
