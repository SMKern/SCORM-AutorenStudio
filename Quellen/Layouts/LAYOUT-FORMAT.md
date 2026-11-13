# Layout-Dateien für das SCORM-AutorenStudio (Format `kurs-layout-1`)

Ein **Layout** legt fest, wie die Kursseiten aussehen. Die Inhalte (Titel, Schritte, Texte, Bilder) kommen aus dem SCORM-AutorenStudio, das Layout liefert nur die „Hülle“. Deshalb kann ein Kurs jederzeit das Layout wechseln, ohne dass Inhalte verloren gehen.

Jedes Layout ist **eine einzige Datei** mit der Endung `.layout.html`. Beispiele in diesem Ordner:

| Datei | Aufbau |
|---|---|
| `Ozeanblau.layout.html` (Kennung `ozeanblau`), `Nachtblau`, `Waldgruen`, `Bernstein`, `Weinrot`, `Violett`, `Schiefer` | die sieben Standard-Layouts, **alle aus der Grundlage erzeugt** (siehe unten): dunkle Kopfzeile mit Modul-Menü, großes Kopfbild, runde Schritt-Knöpfe links, Bild links neben dem Text |
| `Grundlage.layout-vorlage.html` | die **Grundlage** dieser Layouts. Statt Farben stehen dort Farbrollen (`%%akzent%%` …). |
| `Kompakt_Hell.layout.html` | helles Layout mit anderem Aufbau: schmales Kopfbild, Schritte als Reiter oben, Bild über dem Text, Zähler „Schritt 2 von 4“ |

## 0. Gleicher Aufbau, andere Farbe: Grundlage und Farbrollen

Für ein Layout, das nur eine andere **Hauptfarbe** hat, braucht man keine Datei zu schreiben. Das erledigt der **Layout-Assistent** im Studio (🎨 Layouts → *Neues Layout erstellen*). Er füllt die Grundlage mit Farben:

| Rolle | Bedeutung | Berechnung |
|---|---|---|
| `akzent` | Flächen mit weißer Schrift (Häkchen, Merke-Rand, Weiter-Knopf, Seitenpunkte) | Hauptfarbe, falls nötig abgedunkelt auf ≥ 3 : 1 zu Weiß |
| `akzentText` | Schrift auf Weiß (Überschriften, Links) | Hauptfarbe, falls nötig abgedunkelt auf ≥ 4,5 : 1 |
| `aktiv` | aktive Knöpfe auf dunklem Grund | aufgehellt, bis ≥ 2,2 : 1 zum Grund, ohne die weiße Schrift unter 3 : 1 zu drücken |
| `aufDunkel` | Akzentschrift auf dunklem Grund (Kategorie-Zeile, Menü-Link) | aufgehellt auf ≥ 4,5 : 1 |
| `akzentDunkel`, `akzentHell` | Verläufe, Icon-Kachel | Helligkeit × 0,75 bzw. + 10 % |
| `d0` … `d6` | dunkle Flächen (Kopf, Seite, Menü, inaktive Knöpfe) | Farbton der Hauptfarbe, Sättigung ≤ 25 %, Helligkeit 7,5–20 % |
| `text` | Fließtext | Farbton der Hauptfarbe, Helligkeit 24 % |
| `s1`, `s2`, `s3` (+ `_56`, `_13`) | Schmuckfarben 1–3 voll, mit 56 % und 13 % Raster: Linien, Rahmen, helle Flächen, gedämpfte Schrift auf Dunkel | fest: 198\|214\|222 · 166\|184\|195 · 100\|123\|138 |
| `…_rgb` | dieselbe Farbe als `r,g,b` für `rgba(…)` | |

Platzhalter in der Grundlage: `%%ID%%`, `%%NAME%%`, `%%NAME_JSON%%`, `%%VERSION%%`, `%%BESCHREIBUNG_JSON%%`, `%%HAUPTFARBE%%`, `%%FARBTABELLE%%` und alle Rollen. Ändert man den **Aufbau** der Grundlage, müssen alle Standard-Layouts neu erzeugt werden. Wie das geht, steht in `Quellen\LIESMICH.txt`.

> **Ein neues Layout mit anderem Aufbau erstellen lassen:** Diese Datei einem KI-Assistenten oder einer Fachkraft für Webseiten geben, z. B. mit der Bitte
> *„Erstelle nach Quellen/Layouts/LAYOUT-FORMAT.md ein neues Layout für unsere Brandschutz-Kurse: rot, Kopfbild oben, Schritte als nummerierte Kreise oben.“*
> Danach im SCORM-AutorenStudio unter **🎨 Layout** die Datei laden. Das Studio prüft sie automatisch (✔ Prüfen) und nimmt sie nur auf, wenn alle Regeln erfüllt sind.
>
> **Am einfachsten:** eine der Beispieldateien kopieren und abwandeln.

---

## 1. Aufbau einer Layout-Datei

```html
<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><title>Layout: Mein Layout</title></head>
<body>
<p>Erklärtext (wird nur angezeigt, wenn man die Datei direkt im Browser öffnet).</p>

<!-- 1) Steckbrief und Text-Stile (JSON) -->
<script type="application/json" id="layout-info"> { … } </script>

<!-- 2) Vorlagen: die ganze Seite und ihre Bausteine -->
<script type="text/x-vorlage" data-name="seite"> … </script>
<script type="text/x-vorlage" data-name="schritt"> … </script>
<script type="text/x-vorlage" data-name="blaettern"> … </script>

<!-- 3) optional: Farben des Lernpaket-Rahmens -->
<script type="text/x-vorlage" data-name="player-css"> … </script>
</body></html>
```

Die `<script type="text/x-vorlage">`-Bereiche führt der Browser nicht aus. Sie sind nur Textbehälter.
**Darin darf nie `</script>` vorkommen.**

---

## 2. `layout-info` (JSON)

```json
{
  "format": "kurs-layout-1",
  "id": "brandschutz-rot",
  "name": "Brandschutz (rot)",
  "version": "1.0",
  "beschreibung": "Ein Satz, wie das Layout aussieht.",
  "farben": { "akzent": "#c62828", "hell": "#fdecea", "text": "#3b3b3b", "linie": "#f1c9c5" },
  "stile": { … siehe unten … }
}
```

| Feld | Bedeutung |
|---|---|
| `format` | immer `kurs-layout-1` |
| `id` | eindeutige Kennung, nur `a–z`, `0–9`, `-`. **Nie mehr ändern**, denn Kurse merken sich das Layout daran. |
| `name`, `beschreibung` | Anzeige im Studio |
| `version` | Bei Änderungen an einem bereits verwendeten Layout erhöhen (`1.0` → `1.1`). Das Studio bietet dann „Diese Fassung übernehmen“ an. |
| `farben` | nur für die Text-Vorschau im Editor des Studios (`akzent` = Überschriften/Häkchen, `hell` = Merke-Hintergrund, `text` = Fließtext, `linie` = Rahmen) |
| `stile` | Aussehen der Elemente **im Text** eines Schritts (Abschnitt 3) |

---

## 3. `stile`: Aussehen der Texte

Im Studio schreibt man Texte ohne Gestaltung (Absätze, Listen, Kästen …). Beim Speichern bekommt jedes Element den Inline-Stil aus dieser Liste. Alle Werte sind CSS-Texte für `style="…"`, mit `;` getrennt. Fehlt ein Eintrag, bleibt das Element ungestaltet.

| Schlüssel | gilt für |
|---|---|
| `ueberschrift` | Zwischenüberschriften `h3`/`h4` |
| `absatz` | (optional) jeden Absatz `p` |
| `ul`, `li` | Aufzählung und ihre Punkte |
| `listenpunkt` | **HTML-Vorlage** für den Inhalt jedes Aufzählungspunkts, siehe unten |
| `ol` | nummerierte Liste |
| `infokasten`, `merke` | die beiden Kästen aus der Werkzeugleiste |
| `bild`, `video`, `iframe` | Bilder/Videos **im Text** |
| `tabelle`, `zelle`, `kopfzelle` | Tabelle, `td`, `th` |
| `link` | Links `a` |
| `mediumBild`, `mediumVideo` | das Bild/Video **zum Schritt** (Platz im Layout, z. B. links neben dem Text) |

**Optional (ab SCORM-AutorenStudio 3.0):** Fehlen diese Einträge, nimmt das Studio ein neutrales Standard-Aussehen (`STIL_STANDARD` im Studio). Eigene Werte lohnen sich, damit alles zu den Layout-Farben passt.

| Schlüssel | gilt für | Markierung im HTML |
|---|---|---|
| `warnung` | roter Warnkasten (⚠ Warnung) | `<div data-lm-box="warnung">` |
| `aufklapp`, `aufklappTitel` | Aufklappbereich und seine sichtbare Überschrift | `<details data-lm-box="aufklapp"><summary>` |
| `trenner` | Trennlinie | `<hr>` |
| `audio` | Tonaufnahme mit Abspiel-Leiste | `<audio controls>` |
| `datei` | Link zum Herunterladen einer Datei | `<a data-lm-datei>` |

Der Aufklappbereich ist ein normales `<details>`-Element. Er funktioniert ohne Programmcode, auch im Moodle-Editor und offline.

**`listenpunkt`**: Damit lassen sich eigene Aufzählungszeichen bauen. `{{{inhalt}}}` ist der Text des Punkts.
- Schmuck (Häkchen, Quadrat …) muss `aria-hidden="true"` tragen.
- Der Text muss in einem Element mit `data-lm-li` stehen.

Nur so kann das Studio die Liste beim Bearbeiten wieder sauber zurücklesen.

```json
"listenpunkt": "<span aria-hidden=\"true\" style=\"…\">✓</span><span data-lm-li style=\"flex:1;\">{{{inhalt}}}</span>"
```

(Anführungszeichen im JSON als `\"` schreiben.)

---

## 4. Vorlagen und Platzhalter

Die Vorlage **`seite`** ist Pflicht. Sie ergibt den kompletten Inhalt einer Seitendatei (`seiten/….html`). Weitere Vorlagen sind frei benannte **Bausteine**.

### Schreibweise der Platzhalter

| Schreibweise | Wirkung |
|---|---|
| `{{name}}` | Wert als Text (Sonderzeichen werden sicher maskiert). Für Titel, Pfade, Zahlen. |
| `{{{name}}}` | Wert als HTML, unverändert. Nur für `text` und `medium`. |
| `{{#name}} … {{/name}}` | Bei einer Liste: für **jeden Eintrag** wiederholen. Bei Ja/Nein oder Text: nur anzeigen, wenn vorhanden bzw. wahr. |
| `{{^name}} … {{/name}}` | nur anzeigen, wenn **nicht** vorhanden, falsch oder leer |
| `{{> baustein}}` | andere Vorlage hier einsetzen (z. B. `{{> schritt}}`) |

Innerhalb von `{{#schritte}}…{{/schritte}}` beziehen sich Namen zuerst auf den aktuellen Schritt, danach auf die Seite.

### Verfügbare Werte

**Seite**

| Name | Inhalt |
|---|---|
| `kursTitel` | Name des Kurses |
| `modulNr`, `modulTitel`, `modulTitelGross` | Nummer und Titel des Moduls (Gross = in Großbuchstaben) |
| `teilNr` | Nummer der Seite im Modul |
| `datei` | Dateiname der Seite |
| `titel`, `seitenTitel`, `seitenTitelGross` | Seitentitel (`seitenTitel` ist auch innerhalb eines Schritts eindeutig) |
| `einleitung` | Einleitungstext (eigener Text oder automatisch „In diesem Abschnitt: …“) |
| `kopfbild` | Pfad des Kopfbilds, z. B. `../medien/bilder/x.jpg` (leer, wenn keins) |
| `icon` | Pfad des Icons (leer, wenn keins) |
| `anzahl` | Anzahl der Schritte |
| `einSchritt`, `mehrereSchritte` | wahr/falsch, z. B. Fußleiste bei nur einem Schritt ausblenden |
| `module` | Liste aller Module: je `nr`, `titel`, `aktiv` (wahr beim aktuellen Modul) |
| `schritte` | Liste der Schritte (siehe unten) |

**Je Schritt** (in `{{#schritte}}`)

| Name | Inhalt |
|---|---|
| `nr` | 1, 2, 3 … |
| `titel` | Überschrift des Schritts |
| `text` | fertig gestalteter Text (HTML) → immer `{{{text}}}` |
| `medium` | fertiges `<img>`/`<video>` zum Schritt (HTML) → `{{{medium}}}` |
| `hatMedium` | wahr, wenn ein Bild/Video gewählt ist |
| `erster`, `letzter` | wahr beim ersten bzw. letzten Schritt |

---

## 5. Pflicht-Markierungen (sonst funktioniert es nicht)

Das Studio liest gespeicherte Seiten wieder ein, und das Lernpaket blättert und merkt sich den Fortschritt. Beides geht nur über diese Markierungen:

| Wo | Markierung | Wofür |
|---|---|---|
| äußerstes Element der Seite | `data-lm-layout="<id>" data-lm-kopfbild="{{kopfbild}}" data-lm-icon="{{icon}}" data-current="1"` | Studio erkennt Layout, Kopfbild, Icon |
| Seitentitel | `data-lm="titel"` | Studio |
| Einleitung | `data-lm="einleitung"` | Studio |
| Modultitel (optional) | `data-lm="modul-titel"` | Studio |
| jeder Schritt | `data-panel="{{nr}}"`; sichtbar nur der erste (`{{#erster}}…{{/erster}}`), die anderen `display:none` | **Lernpaket**: erkennt angesehene Schritte an der Sichtbarkeit |
| Überschrift des Schritts | `data-lm="schritt-titel"` | Studio |
| Textbereich des Schritts | `data-lm="text"` mit `{{{text}}}` darin, **sonst nichts** | Studio |
| Bild/Video zum Schritt | Behälter `data-lm="medium"` mit `{{{medium}}}`, nur in `{{#hatMedium}}` | Studio |
| Blättern | für jeden Schritt ein klickbares Element `data-go="{{nr}}"` (Knopf, Reiter, Punkt …); dazu `data-go="next"` / `data-go="back"` | **Lernpaket** springt beim Fortsetzen per Klick auf `data-go="N"` |

### Blättern: nur per `onclick`

- **Kein `<script>`** in der Seite. Moodle und das Lernpaket entfernen Skripte aus den Seiten.
- Das Umschalten der Schritte steht daher in `onclick="…"`, am besten als Baustein (`{{> blaettern}}`), damit es nur einmal in der Datei steht.
- Im `onclick` nur `'` als Anführungszeichen verwenden, nie `"`.

Bewährtes Muster:
1. `this.closest('[data-lm-layout]')` sucht das äußerste Element.
2. `data-current` wird hochgezählt.
3. Alle `[data-panel]` werden ein- bzw. ausgeblendet.
4. Knöpfe und Zähler werden angepasst.

Siehe `blaettern` in beiden Beispielen.

### Modul-Menü (optional)

Soll die Seite ein eigenes Modul-Menü haben (wie in den Standard-Layouts ☰):
- Behälter `data-menu-wrap`, Knopf `data-menu-btn`, Menü `data-modulmenu`.
- Darin Links `<a href="#">`, deren Text mit der **Modulnummer** beginnt (`{{#module}}…{{nr}}…{{titel}}…{{/module}}`).
- Ein Link ohne Zahl führt zur Kursübersicht.

Das Lernpaket macht diese Links automatisch funktionsfähig. Ohne Menü navigiert man über die Leiste des Lernpakets.

---

## 6. Gestaltungsregeln

- **Nur Inline-Stile** (`style="…"`) in den Vorlagen. Kein `<style>`, keine Klassen, keine externen Schriften oder Dateien.
- Bilder im Layout (z. B. ein Logo) als `data:`-Adresse einbetten oder aus `../medien/bilder/` nehmen.
- Breite flexibel halten (`max-width`, `flex-wrap`, `%`), damit es auf dem Handy (Moodle-App) funktioniert.
- Handy-Anpassung im Lernpaket (ab SCORM-AutorenStudio 3.45): Der Player stellt schmaler als 600 Pixel einiges von selbst um, ohne dass das Layout etwas dafür tun muss. Er erkennt die Bausteine an diesen Merkmalen:
  - **Schritt-Knöpfe:** die `data-step`-Knöpfe als direkte Kinder eines Behälters. Hat der Behälter `flex-direction:column` im Inline-Stil, wird aus der Spalte eine Reihe über dem Inhalt. Sonst wird die Reihe einzeilig und seitlich wischbar.
  - **Fußleiste:** der direkte Eltern-Behälter von `data-go="back"` und `data-go="next"`. Alles andere darin (Seitenpunkte, Zähler) kommt in eine eigene Zeile darüber.
- Einen Kommentar `<!-- … -->` an den Anfang von `seite` setzen, der den Aufbau für VS Code erklärt (siehe Beispiele).

## 7. `player-css` (optional)

CSS, das ins Lernpaket (`index.html`) eingefügt wird. Damit passen Kursübersicht, Leiste und Fortschrittsbalken farblich zum Layout. Wichtige Variablen des Players:

```css
:root { --hauptfarbe: #c62828; --hauptfarbe-hell: #fdecea; --akzent: #ff8a80; --dunkel: #3b0d0c;
        --seite: #faf5f5; --text: #1f1f1f; --text-blass: #6b6b6b; --linie: #f1c9c5; }
.leiste { background: linear-gradient(110deg, #2b0908, #4a1110); }
.uebersicht { background: radial-gradient(circle at 85% 0%, rgba(198,40,40,.4), transparent 480px), var(--dunkel); }
.balken > span { background: linear-gradient(90deg, #8e1c1c, var(--hauptfarbe)); }
```

### `leitner-css` (optional)

Wird zusätzlich zu `player-css` in **Übungen** (Leitner-Test) eingefügt. Für Elemente, die nur dort vorkommen, z. B. `.leitner`, `.kopf`, `.karte`, `.balken`, `.fach`, `.antwort`, `.punkt`. Beispiel: `Ozeanblau.layout.html`.

### Fragen

Fragen (Single-/Multiple-Choice, Drag & Drop, Lückentext) gestaltet die **Fragen-Engine** selbst. Das Layout muss dafür nichts liefern. Die Engine nimmt ihre Farbe aus `--hauptfarbe`, also aus `player-css`. Fragen stehen innerhalb des Textbereichs `data-lm="text"` und werden vom Studio beim Gestalten nicht verändert.

## 8. Prüfen

Im SCORM-AutorenStudio unter **🎨 Layout** die Datei laden. Die automatische Prüfung kontrolliert:
- Markierungen, Blättern und Einlesen
- dass erneutes Speichern nichts verändert (Rundlauf)
- Seiten mit nur einem Schritt

Danach **👁 Beispielseite** ansehen und für einen Testkurs **„Für diesen Kurs verwenden“** wählen. Zum Schluss unter **📦 Lernpaket → Ganzen Kurs ansehen** durchklicken.
