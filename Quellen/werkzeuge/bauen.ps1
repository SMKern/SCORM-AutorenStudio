# ════════════════════════════════════════════════════════════════════════════
#  bauen.ps1 – setzt alle Bausteine in das Programm SCORM-AutorenStudio.html ein
#
#  Wann brauche ich das?
#    Nur wenn du im Ordner Quellen\ etwas geändert hast (ein Layout, den
#    Kurs-Player, die Anleitung …). Wer das Programm nur benutzt, braucht
#    dieses Skript nie.
#
#  Was macht es?
#    1. Fragen-Engine  Quellen\bausteine\fragen-engine.js
#         → in Quellen\Kurs_SCORM\Vorlage_Kurs.html und Quellen\Leitner_SCORM\Vorlage.html
#    2. In SCORM-AutorenStudio.html eingebettet (als Base64):
#         alle Layouts     Quellen\Layouts\*.layout.html
#         Layout-Grundlage Quellen\Layouts\*.layout-vorlage.html
#         Hilfe            Quellen\Dokumente\*.md  (erscheint im Programm unter „? Hilfe“)
#         PDF-Engine       Quellen\bausteine\pdf-engine\  (PDF.js, Apache-Lizenz 2.0)
#         Kurs-Player      Quellen\Kurs_SCORM\Vorlage_Kurs.html
#         Leitner-Test     Quellen\Leitner_SCORM\Vorlage.html
#         Symbol im Browser-Tab  Quellen\Marke\favicon.svg
#    3. SCORM-AutorenStudio-Lite.html = das Programm + Quellen\Lite\Lite-Zusatz.html
#    4. Prüfsummen (SHA-256) aller Dateien → Quellen\PRUEFSUMMEN.txt
#
#  Das Programm selbst (alles, was nicht eingebettet ist) änderst du direkt in
#  SCORM-AutorenStudio.html. Die Lite-Ausgabe nie direkt ändern – sie wird hier
#  jedes Mal neu erzeugt.
#
#  Ausführen: Rechtsklick auf diese Datei → „Mit PowerShell ausführen“
#
#  Copyright (c) 2026 Sven-Michael Kern · Lizenziert unter der EUPL, Version 1.2 oder neuer
# ════════════════════════════════════════════════════════════════════════════
param([switch]$OhnePause)
$ErrorActionPreference = 'Stop'
$quellen = Split-Path -Parent $PSScriptRoot
$projekt = Split-Path -Parent $quellen
$utf8 = New-Object Text.UTF8Encoding($false)
$studio    = Join-Path $projekt 'SCORM-AutorenStudio.html'
$lite      = Join-Path $projekt 'SCORM-AutorenStudio-Lite.html'
$engine    = Join-Path $quellen 'bausteine\fragen-engine.js'
$pdfEngine = Join-Path $quellen 'bausteine\pdf-engine'
$layouts   = Join-Path $quellen 'Layouts'
$player    = Join-Path $quellen 'Kurs_SCORM\Vorlage_Kurs.html'
$leitner   = Join-Path $quellen 'Leitner_SCORM\Vorlage.html'
$dokumente = Join-Path $quellen 'Dokumente'
$zusatz    = Join-Path $quellen 'Lite\Lite-Zusatz.html'
$favicon   = Join-Path $quellen 'Marke\favicon.svg'
$favLite   = Join-Path $quellen 'Marke\favicon-lite.svg'

# ── Hier einstellen ─────────────────────────────────────────────────────────
# Reihenfolge der Layouts im Programm (Dateiname ohne „.layout.html“). Weitere Layouts folgen nach dem Abc.
$reihenfolge = @('Ozeanblau', 'Nachtblau', 'Waldgruen', 'Bernstein', 'Weinrot', 'Violett', 'Schiefer')
# Reihenfolge und Titel der Hilfe-Dokumente im Programm
$hilfe = @(
  @('Anleitung.md', 'Anleitung'),
  @('Seiten_in_VS_Code_bearbeiten.md', 'Seiten in VS Code bearbeiten'),
  @('Sicherheit.md', 'Sicherheit'),
  @('Lizenz.md', 'Lizenz')
)
# ────────────────────────────────────────────────────────────────────────────

foreach ($d in @($studio, $engine, $player, $leitner, $zusatz, $favicon, $favLite)) { if (-not (Test-Path $d)) { throw "Datei fehlt: $d" } }

# 1) Fragen-Engine in die beiden Vorlagen kopieren (zwischen den Markierungen)
$code = [IO.File]::ReadAllText($engine, [Text.Encoding]::UTF8).Trim()
foreach ($ziel in @($player, $leitner)) {
  $t = [IO.File]::ReadAllText($ziel, [Text.Encoding]::UTF8)
  $a = $t.IndexOf('/* >>> FRAGEN-ENGINE-ANFANG')
  $eMarke = '/* <<< FRAGEN-ENGINE-ENDE */'
  $e = $t.IndexOf($eMarke)
  if ($a -lt 0 -or $e -lt $a) { throw "Markierungen FRAGEN-ENGINE fehlen in $ziel" }
  $t = $t.Substring(0, $a) + $code + $t.Substring($e + $eMarke.Length)
  [IO.File]::WriteAllText($ziel, $t, $utf8)
  Write-Host ("Fragen-Engine eingesetzt in {0}" -f (Split-Path -Leaf $ziel))
}

# 2) Bausteine als Base64 in SCORM-AutorenStudio.html
$html = [IO.File]::ReadAllText($studio, [Text.Encoding]::UTF8)
function B64($datei) { [Convert]::ToBase64String([IO.File]::ReadAllBytes($datei)) }
function Bereich($html, $name, $inhalt) {
  $anf = "<!-- >>> $name-ANFANG -->"
  $a = $html.IndexOf($anf); $e = $html.IndexOf("<!-- <<< $name-ENDE -->")
  if ($a -lt 0 -or $e -lt $a) { throw "Markierung $name fehlt in SCORM-AutorenStudio.html" }
  $a += $anf.Length
  return $html.Substring(0, $a) + "`n" + $inhalt + $html.Substring($e)
}
# 2a) alle Layouts – in dieser Reihenfolge erscheinen sie im Programm
$liste = @(Get-ChildItem $layouts -Filter *.layout.html | Sort-Object { $i = [array]::IndexOf($reihenfolge, $_.Name -replace '\.layout\.html$', ''); if ($i -lt 0) { 99 } else { $i } }, Name)
if (-not $liste.Count) { throw "Keine Layouts in $layouts gefunden." }
# Jedes Layout braucht eine eigene Kennung ("id"). Zwei Dateien mit derselben Kennung würden sich im Programm gegenseitig verdrängen.
$kennungen = @{}
foreach ($l in $liste) {
  $m = [regex]::Match([IO.File]::ReadAllText($l.FullName, [Text.Encoding]::UTF8), '"id"\s*:\s*"([^"]+)"')
  if (-not $m.Success) { throw "In $($l.Name) fehlt die Kennung (`"id`")." }
  $k = $m.Groups[1].Value
  if ($kennungen.ContainsKey($k)) { throw "Die Layouts $($kennungen[$k]) und $($l.Name) haben dieselbe Kennung `"$k`". Bitte eine der beiden Dateien aus Quellen\Layouts entfernen." }
  $kennungen[$k] = $l.Name
}
$teile = ''
foreach ($l in $liste) { $teile += "<script type=`"application/octet-stream`" class=`"eingebettet-layout`" data-datei=`"$($l.Name)`">$(B64 $l.FullName)</script>`n"; Write-Host "Layout eingebettet: $($l.Name)" }
$html = Bereich $html 'LAYOUTS' $teile
# 2b) Grundlage für den Layout-Assistenten (gleicher Aufbau, Farben als Rollen %%…%%)
$grundlagen = @(Get-ChildItem $layouts -Filter *.layout-vorlage.html)
$teile = ''
foreach ($g in $grundlagen) { $teile += "<script type=`"application/octet-stream`" class=`"eingebettet-grundlage`" data-datei=`"$($g.Name)`">$(B64 $g.FullName)</script>`n"; Write-Host "Grundlage eingebettet: $($g.Name)" }
$html = Bereich $html 'GRUNDLAGE' $teile
# 2c) Hilfe-Dokumente
$teile = ''
foreach ($h in $hilfe) {
  $d = Join-Path $dokumente $h[0]
  if (-not (Test-Path $d)) { throw "Hilfe-Dokument fehlt: $d" }
  $teile += "<script type=`"application/octet-stream`" class=`"eingebettet-hilfe`" data-datei=`"$($h[0])`" data-titel=`"$($h[1])`">$(B64 $d)</script>`n"; Write-Host "Hilfe eingebettet: $($h[0])"
}
$html = Bereich $html 'HILFE' $teile
# 2d) PDF-Engine (PDF.js): liest PDF-Dateien ohne Internet für „PDF übernehmen“
$teile = ''
foreach ($paar in @(@('eingebettet-pdfjs-haupt', 'pdf.min.mjs'), @('eingebettet-pdfjs-worker', 'pdf.worker.min.mjs'))) {
  $id = $paar[0]; $datei = $paar[1]; $d = Join-Path $pdfEngine $datei
  if (-not (Test-Path $d)) { throw "PDF-Engine-Datei fehlt: $d" }
  $teile += "<script type=`"application/octet-stream`" id=`"$id`" data-datei=`"$datei`">$(B64 $d)</script>`n"
  Write-Host "PDF-Engine eingebettet: $datei"
}
$html = Bereich $html 'PDFJS' $teile
# 2e) Bilder der Folienbibliothek: Diese Ausgabe liefert keine mit – der Bereich bleibt leer
$html = Bereich $html 'FOLIENBILDER' ''
# 2f) Kurs-Player und Leitner-Test
foreach ($paar in @(@('eingebettet-player', $player), @('eingebettet-leitner', $leitner))) {
  $id = $paar[0]; $datei = $paar[1]
  $start = $html.IndexOf("id=`"$id`">")
  if ($start -lt 0) { throw "Markierung $id nicht gefunden" }
  $start += ("id=`"$id`">").Length
  $ende = $html.IndexOf('</script>', $start)
  $html = $html.Substring(0, $start) + (B64 $datei) + $html.Substring($ende)
  Write-Host ("{0}: {1} eingebettet" -f $id, (Split-Path -Leaf $datei))
}
# 2g) Symbol im Browser-Tab
$favMuster = '<link rel="icon" type="image/svg\+xml" id="favicon" href="[^"]*">'
if (-not [regex]::IsMatch($html, $favMuster)) { throw 'Markierung für das Symbol im Browser-Tab (link id="favicon") nicht gefunden.' }
$html = [regex]::Replace($html, $favMuster, ('<link rel="icon" type="image/svg+xml" id="favicon" href="data:image/svg+xml;base64,' + (B64 $favicon) + '">'), 1)
Write-Host 'Symbol eingebettet: favicon.svg'
# 2h) Sicherheitsnetz: Gibt es im Programm einen eingebetteten Baustein, den dieses Skript nicht kennt?
$bekannt = @('eingebettet-layout', 'eingebettet-grundlage', 'eingebettet-hilfe', 'eingebettet-pdfjs-haupt', 'eingebettet-pdfjs-worker', 'eingebettet-leitner', 'eingebettet-player')
foreach ($m in [regex]::Matches($html, '<script type="application/octet-stream" (?:class|id)="([^"]+)"')) {
  if ($bekannt -notcontains $m.Groups[1].Value) { throw "Unbekannter eingebetteter Baustein im Programm: $($m.Groups[1].Value) – bitte bauen.ps1 ergänzen." }
}
[IO.File]::WriteAllText($studio, $html, $utf8)
Write-Host 'Fertig. SCORM-AutorenStudio.html ist aktualisiert.'

# 3) Lite-Ausgabe: das Programm + die vereinfachte Oberfläche aus Quellen\Lite\Lite-Zusatz.html
$z = [IO.File]::ReadAllText($zusatz, $utf8).TrimStart([char]0xFEFF)
$titel = '<title>SCORM-AutorenStudio</title>'
$i = $html.IndexOf($titel)
if ($i -lt 0) { throw 'Titel in SCORM-AutorenStudio.html nicht gefunden.' }
$l = $html.Substring(0, $i) + '<title>SCORM-AutorenStudio Lite</title>' + $html.Substring($i + $titel.Length)
$l = [regex]::Replace($l, $favMuster, ('<link rel="icon" type="image/svg+xml" id="favicon" href="data:image/svg+xml;base64,' + (B64 $favLite) + '">'), 1)
$ende = $l.LastIndexOf('</body>')
if ($ende -lt 0) { throw '</body> in SCORM-AutorenStudio.html nicht gefunden.' }
$l = $l.Substring(0, $ende) + "<!-- >>> LITE-ANFANG (aus Quellen\Lite\Lite-Zusatz.html) -->`n" + $z + "`n<!-- <<< LITE-ENDE -->`n" + $l.Substring($ende)
[IO.File]::WriteAllText($lite, $l, $utf8)
Write-Host 'Fertig. SCORM-AutorenStudio-Lite.html ist aktualisiert.'

# 4) Prüfsummen (SHA-256): Damit lässt sich später zeigen, ob eine Datei verändert wurde
$alle = @($studio, $lite, $zusatz, $favicon, $favLite, $engine, $player, $leitner) + @($liste | ForEach-Object FullName) + @($grundlagen | ForEach-Object FullName) + @(Get-ChildItem $dokumente -Filter *.md | Sort-Object Name | ForEach-Object FullName) + @((Join-Path $pdfEngine 'pdf.min.mjs'), (Join-Path $pdfEngine 'pdf.worker.min.mjs')) + @(Get-ChildItem $PSScriptRoot -Filter *.ps1 | Sort-Object Name | ForEach-Object FullName)
$zeilen = @("# Prüfsummen (SHA-256) der Dateien des SCORM-AutorenStudios · nicht von Hand ändern")
foreach ($d in ($alle | Select-Object -Unique)) { $zeilen += ('{0}  {1}' -f (Get-FileHash $d -Algorithm SHA256).Hash.ToLower(), $d.Substring($projekt.Length + 1)) }
[IO.File]::WriteAllLines((Join-Path $quellen 'PRUEFSUMMEN.txt'), $zeilen, $utf8)
Write-Host 'Prüfsummen geschrieben: Quellen\PRUEFSUMMEN.txt'
if (-not $OhnePause) { Read-Host 'Enter zum Beenden' | Out-Null }
