# Servidor estático local para werclub-web (solo PowerShell, sin dependencias).
# Uso:  powershell -ExecutionPolicy Bypass -File .\serve.ps1 [-Port 8793]
# Luego abre http://localhost:8793/
param(
  [int]$Port = 8793,
  [string]$Root = $PSScriptRoot
)

$Root = (Resolve-Path -LiteralPath $Root).Path.TrimEnd('\')
$mime = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'
  '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'
  '.json'='application/json; charset=utf-8'; '.webmanifest'='application/manifest+json'
  '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.gif'='image/gif'; '.webp'='image/webp'; '.ico'='image/x-icon'
  '.woff'='font/woff'; '.woff2'='font/woff2'; '.txt'='text/plain; charset=utf-8'
  '.xml'='application/xml'; '.pdf'='application/pdf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() } catch {
  Write-Host "No se puede usar el puerto $Port. Quizá ya hay otro servidor abierto en http://localhost:$Port/." -ForegroundColor Red
  exit 1
}
Write-Host "Sirviendo $Root en http://localhost:$Port/  (Ctrl+C para parar)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    $status = 200
    try {
      $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/') -replace '/', '\'
      $path = [IO.Path]::GetFullPath((Join-Path $Root $rel))
      if (-not ($path -eq $Root -or $path.StartsWith($Root + '\'))) { $status = 403 }
      elseif (Test-Path -LiteralPath $path -PathType Container) {
        if (-not $req.Url.AbsolutePath.EndsWith('/')) {
          $status = 301; $res.RedirectLocation = $req.Url.AbsolutePath + '/' + $req.Url.Query
        } else { $path = Join-Path $path 'index.html' }
      }
      if ($status -eq 200 -and -not (Test-Path -LiteralPath $path -PathType Leaf)) { $status = 404 }

      $res.StatusCode = $status
      if ($status -eq 200) {
        $ext = [IO.Path]::GetExtension($path).ToLower()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $res.Headers['Cache-Control'] = 'no-store'
        $bytes = [IO.File]::ReadAllBytes($path)
        $res.ContentLength64 = $bytes.Length
        if ($req.HttpMethod -ne 'HEAD') { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      } elseif ($status -ne 301) {
        $msg = [Text.Encoding]::UTF8.GetBytes("$status")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
    } catch { try { $res.StatusCode = 500 } catch {} }
    finally {
      Write-Host ("{0} {1} {2}" -f $status, $req.HttpMethod, $req.Url.AbsolutePath)
      $res.Close()
    }
  }
} finally { $listener.Stop() }
