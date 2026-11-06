# Sincroniza los catálogos comunitarios de skills en .agents/vendor/ (no versionados).
# Uso: powershell -File .agents/sync-vendor.ps1
# Los commits están fijados para que todos usen exactamente la misma versión revisada.
$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'vendor'
$repos = @(
  @{ name = 'antigravity-awesome-skills'; url = 'https://github.com/sickn33/antigravity-awesome-skills.git'; commit = '828257c3037dc7c3c3ec987decc5a603025a0ce5' },
  @{ name = 'vibes-plug';                 url = 'https://github.com/roedyrustam/vibes-plug.git';             commit = 'c1ebe24db7a7c9d4c3964b8c0806734b90cbe1ff' },
  @{ name = 'antigravity-skills';         url = 'https://github.com/rmyndharis/antigravity-skills.git';      commit = '364ea63c190fcf7cac035f7fa91f0406fa392584' }
)
$tmp = Join-Path ([IO.Path]::GetTempPath()) "agy-vendor-$(Get-Random)"
New-Item -ItemType Directory -Force $tmp, $root | Out-Null
try {
  foreach ($r in $repos) {
    $src = Join-Path $tmp $r.name
    git init -q $src
    git -C $src fetch -q --depth 1 $r.url $r.commit
    git -C $src checkout -q FETCH_HEAD
    $dst = Join-Path $root $r.name
    if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
    New-Item -ItemType Directory -Force $dst | Out-Null
    foreach ($x in 'skills', 'agents', 'LICENSE', 'README.md', 'CATALOG.md') {
      if (Test-Path (Join-Path $src $x)) { Copy-Item -Recurse -Force (Join-Path $src $x) $dst }
    }
    Write-Host "OK $($r.name) @ $($r.commit.Substring(0,7))"
  }
} finally {
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}
