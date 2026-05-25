<#
.SYNOPSIS
  Restaura el proyecto ACAR desde un tag de Git o desde un archivo ZIP de backup.
.DESCRIPTION
  Con -Tag restaura el tag especificado via git checkout.
  Con -Source restaura desde un ZIP generado por backup.ps1.
.PARAMETER Tag
  Nombre del tag de Git a restaurar (ej: v1.0-estable).
.PARAMETER Source
  Ruta al archivo ZIP de backup.
.PARAMETER Force
  Sobrescribir cambios locales sin confirmar.
.EXAMPLE
  .\tools\recovery.ps1 -Tag v1.0-estable
  .\tools\recovery.ps1 -Source .\backups\ACAR_backup_2026-05-25_113000.zip
  .\tools\recovery.ps1 -Tag v1.0-estable -Force
#>

param(
  [string]$Tag,
  [string]$Source,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

function Write-Step { param([string]$Msg) Write-Host "`n>> $Msg" -ForegroundColor Yellow }
function Write-OK   { Write-Host "  OK" -ForegroundColor Green }
function Write-Err  { param([string]$Msg) Write-Host "  ERROR: $Msg" -ForegroundColor Red }

Write-Host "=== ACAR Recovery Tool ===" -ForegroundColor Cyan
Write-Host "Project : $ProjectRoot"

if (-not $Tag -and -not $Source) {
  Write-Err "Debes especificar -Tag o -Source"
  Write-Host "Ejemplos:" -ForegroundColor Magenta
  Write-Host "  .\tools\recovery.ps1 -Tag v1.0-estable"
  Write-Host "  .\tools\recovery.ps1 -Source .\backups\ACAR_backup_*.zip"
  exit 1
}

# --- Restore from Git tag ---
if ($Tag) {
  Write-Step "Restaurando desde tag Git: $Tag"

  # Check if tag exists
  $tagExists = git -C $ProjectRoot tag -l $Tag
  if (-not $tagExists) {
    Write-Err "El tag '$Tag' no existe. Tags disponibles:"
    git -C $ProjectRoot tag -l | ForEach-Object { Write-Host "  - $_" }
    exit 1
  }

  # Stash or discard local changes
  $hasChanges = git -C $ProjectRoot status --porcelain
  if ($hasChanges) {
    if ($Force) {
      Write-Host "  Descartando cambios locales (--Force)..." -ForegroundColor DarkYellow
      git -C $ProjectRoot stash --include-untracked 2>$null
      Write-OK
    } else {
      Write-Err "Hay cambios sin confirmar. Usa -Force para descartarlos o confírmalos primero."
      exit 1
    }
  }

  # Checkout tag
  git -C $ProjectRoot checkout $Tag 2>&1 | Out-Null
  if (-not $?) { Write-Err "Git checkout falló"; exit 1 }
  Write-OK

  # Restore node_modules
  Write-Step "Instalando dependencias..."
  npm --prefix $ProjectRoot install 2>&1 | Out-Null
  if ($?) { Write-OK } else { Write-Err "npm install falló (puedes ejecutarlo manualmente)" }
}

# --- Restore from ZIP ---
if ($Source) {
  if (-not (Test-Path $Source)) { Write-Err "Archivo no encontrado: $Source"; exit 1 }

  Write-Step "Restaurando desde ZIP: $Source"

  # Backup current just in case
  $rollbackDir = Join-Path $ProjectRoot "..\_rollback_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
  Write-Host "  Creando respaldo del estado actual en: $rollbackDir" -ForegroundColor DarkYellow
  New-Item -ItemType Directory -Path $rollbackDir -Force | Out-Null
  Copy-Item -Path (Join-Path $ProjectRoot '*') -Destination $rollbackDir -Recurse -Exclude @('node_modules','dist','.vercel\cache') 2>$null

  # Extract
  if ($Source -like '*.tar.gz') {
    tar -xzf $Source -C $ProjectRoot 2>$null
  } else {
    Expand-Archive -Path $Source -DestinationPath $ProjectRoot -Force
  }
  if (-not $?) { Write-Err "Extracción falló"; exit 1 }
  Write-OK

  # Restore node_modules
  Write-Step "Instalando dependencias..."
  npm --prefix $ProjectRoot install 2>&1 | Out-Null
  if ($?) { Write-OK } else { Write-Err "npm install falló" }
}

Write-Step "Recovery completado!"
Write-Host "Sugerencia: ejecuta 'npm run dev' para verificar que todo funciona." -ForegroundColor Magenta
