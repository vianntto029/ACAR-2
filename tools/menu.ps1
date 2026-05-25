<#
.SYNOPSIS
  Menú interactivo para backup, recovery y mantenimiento del proyecto ACAR.
#>

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

function Show-Menu {
  Clear-Host
  Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
  Write-Host "║       ACAR — Herramientas                ║" -ForegroundColor Cyan
  Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Cyan
  Write-Host "║  1. Backup completo (código + Firebase)  ║" -ForegroundColor White
  Write-Host "║  2. Backup rápido (solo código)          ║" -ForegroundColor White
  Write-Host "║  3. Restaurar desde tag Git              ║" -ForegroundColor White
  Write-Host "║  4. Restaurar desde archivo ZIP          ║" -ForegroundColor White
  Write-Host "║  5. Ver tags disponibles                 ║" -ForegroundColor White
  Write-Host "║  6. Ver backups disponibles              ║" -ForegroundColor White
  Write-Host "║  0. Salir                                ║" -ForegroundColor White
  Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Show-Backups {
  $backupDir = Join-Path $ProjectRoot 'backups'
  if (-not (Test-Path $backupDir)) { Write-Host "No hay carpeta de backups." -ForegroundColor Yellow; return }
  $files = Get-ChildItem $backupDir | Sort-Object LastWriteTime -Descending
  if ($files.Count -eq 0) { Write-Host "No hay backups disponibles." -ForegroundColor Yellow; return }
  Write-Host "`nBackups disponibles:" -ForegroundColor Cyan
  $files | ForEach-Object { Write-Host "  $($_.LastWriteTime.ToString('yyyy-MM-dd HH:mm'))  $($_.Name)  ($([math]::Round($_.Length/1KB,1)) KB)" }
}

do {
  Show-Menu
  $choice = Read-Host "`nSelecciona una opción"
  switch ($choice) {
    '1' {
      & "$PSScriptRoot\backup.ps1"
      Write-Host "`nPresiona Enter para continuar..." -NoNewline; $null = Read-Host
    }
    '2' {
      & "$PSScriptRoot\backup.ps1" -SkipFirebase
      Write-Host "`nPresiona Enter para continuar..." -NoNewline; $null = Read-Host
    }
    '3' {
      $tag = Read-Host "Nombre del tag (ej: v1.0-estable)"
      $force = Read-Host "¿Descartar cambios locales? (s/N)"
      if ($force -eq 's') {
        & "$PSScriptRoot\recovery.ps1" -Tag $tag -Force
      } else {
        & "$PSScriptRoot\recovery.ps1" -Tag $tag
      }
      Write-Host "`nPresiona Enter para continuar..." -NoNewline; $null = Read-Host
    }
    '4' {
      $source = Read-Host "Ruta completa al archivo ZIP o tar.gz"
      & "$PSScriptRoot\recovery.ps1" -Source $source
      Write-Host "`nPresiona Enter para continuar..." -NoNewline; $null = Read-Host
    }
    '5' {
      Write-Host "`nTags disponibles:" -ForegroundColor Cyan
      git -C $ProjectRoot tag -l | ForEach-Object { Write-Host "  $_" }
      Write-Host "`nPresiona Enter para continuar..." -NoNewline; $null = Read-Host
    }
    '6' {
      Show-Backups
      Write-Host "`nPresiona Enter para continuar..." -NoNewline; $null = Read-Host
    }
    '0' { Write-Host "¡Hasta luego!" -ForegroundColor Cyan }
    default { Write-Host "Opción inválida." -ForegroundColor Red; Start-Sleep 1 }
  }
} while ($choice -ne '0')
