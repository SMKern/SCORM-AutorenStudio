# Kursseiten in VS Code bearbeiten

Diese Anleitung gilt für **alle Kurse**, die du mit dem SCORM-AutorenStudio anlegst.

> **SCORM-AutorenStudio oder VS Code?**
> - **SCORM-AutorenStudio** (`SCORM-AutorenStudio.html`): für fast alles. Texte, Schritte, Seiten, Module, Bilder, Videos, Layout und Lernpaket gehen dort ohne HTML-Kenntnisse.
> - **VS Code**: für schnelle Korrekturen (Tippfehler, ein Wort ändern), für viele Stellen auf einmal (Suchen und Ersetzen über alle Seiten) und für Sonderfälle, die das Studio nicht kann.
>
> Beides passt zusammen: Was du in VS Code änderst, sieht das Studio beim nächsten Öffnen des Kurses, und umgekehrt.
>
> **Zum Layout:** Die Beispiele zeigen die Standard-Layouts (z. B. „Ozeanblau“). Bei einem anderen Layout sieht der Code anders aus. Die Regeln (Kapitel 4) und die Bausteine `lm-…` (Kapitel 7) gelten aber genauso, denn die Bausteine passen sich automatisch dem Layout des Kurses an. Am Anfang jeder Seite erklärt ein Kommentar ihren Aufbau.
> **Wichtig:** Nie beide gleichzeitig mit ungespeicherten Änderungen offen haben. Erst in einem Programm speichern, dann im anderen weiterarbeiten.

---

## Inhalt

1. [Einmalig einrichten](#1-einmalig-einrichten)
2. [Kursordner öffnen](#2-kursordner-öffnen)
3. [So ist eine Seite aufgebaut](#3-so-ist-eine-seite-aufgebaut)
4. [Die goldene Regel: nur zwischen > und <](#4-die-goldene-regel-nur-zwischen--und-)
5. [Rechtschreibfehler finden und ausbessern](#5-rechtschreibfehler-finden-und-ausbessern)
6. [Text in allen Seiten suchen und ersetzen](#6-text-in-allen-seiten-suchen-und-ersetzen)
7. [Etwas hinzufügen: die Bausteine (lm-…)](#7-etwas-hinzufügen-die-bausteine-lm-)
8. [Bilder und Videos austauschen oder ergänzen](#8-bilder-und-videos-austauschen-oder-ergänzen)
9. [Ansehen, bevor du hochlädst (Vorschau)](#9-ansehen-bevor-du-hochlädst-vorschau)
10. [Einen Schritt von Hand hinzufügen (für Fortgeschrittene)](#10-einen-schritt-von-hand-hinzufügen-für-fortgeschrittene)
11. [Danach: neues Lernpaket erzeugen](#11-danach-neues-lernpaket-erzeugen)
12. [Wenn etwas schiefgeht](#12-wenn-etwas-schiefgeht)
13. [Spickzettel](#13-spickzettel)

---

## 1) Einmalig einrichten

1. **VS Code** installieren (kostenlos: https://code.visualstudio.com), falls noch nicht vorhanden.
2. Den Kursordner öffnen (siehe Kapitel 2). Unten rechts erscheint dann meistens der Hinweis
   *„Möchten Sie die empfohlenen Erweiterungen installieren?“* → **Installieren** klicken.
   Kommt der Hinweis nicht: links auf das Symbol **Erweiterungen** (vier Quadrate) bzw. `Strg + Umschalt + X` und diese drei suchen und installieren:

   | Erweiterung | Wofür |
   |---|---|
   | **Live Preview** (von Microsoft) | Seite direkt in VS Code ansehen |
   | **Code Spell Checker** | Rechtschreibprüfung |
   | **German - Code Spell Checker** | deutsches Wörterbuch dazu |

3. Fertig. Alle weiteren Einstellungen bringt der Kursordner selbst mit (Ordner `.vscode`, siehe unten).

### Was steckt im Ordner `.vscode`?

Jeder Kursordner enthält einen (versteckten) Ordner `.vscode` mit drei Dateien:

| Datei | Was sie tut |
|---|---|
| `settings.json` | Lange Zeilen werden umgebrochen (kein seitliches Scrollen), Rechtschreibprüfung auf Deutsch, die technischen Teile (`style="…"`, `onclick="…"`) werden **nicht** auf Rechtschreibung geprüft, kein automatisches Umformatieren beim Speichern |
| `extensions.json` | die drei empfohlenen Erweiterungen |
| `layout.code-snippets` | die **Bausteine** `lm-…` (Kapitel 7), passend zum Layout des Kurses |

**Neuer Kurs:** Legt das SCORM-AutorenStudio automatisch an. Nach einem Layoutwechsel erneuert es die Bausteine.
**Älterer Kurs ohne `.vscode`:** Im SCORM-AutorenStudio unter *⚙ Kurs* auf **„VS-Code-Einrichtung in diesen Kursordner schreiben“** klicken.

---

## 2) Kursordner öffnen

**Immer den ganzen Kursordner öffnen**, nicht nur eine einzelne Datei. Nur dann funktionieren Bausteine, Vorschau und die Suche über alle Seiten.

- In VS Code: **Datei → Ordner öffnen …** → z. B. `D:\Kurse\Erste-Hilfe` → **Ordner auswählen**.
- Oder im Windows-Explorer: Rechtsklick auf den Kursordner → **Mit Code öffnen**.

Links siehst du dann:

```
Erste-Hilfe/
  .vscode/          Einstellungen (nicht anfassen)
  kurs.json         Reihenfolge der Module und Seiten (besser im SCORM-AutorenStudio ändern)
  layout/           Kopie der Layout-Datei (nicht anfassen)
  medien/
    bilder/         alle Bilder
    videos/         alle Videos
  seiten/
    Modul01_1_Trainingsinfo.html
    Modul01_2_Verhalten in Gefahrensituationen.html
    …
```

**Dateinamen:** `Modul02_3_Rettungsmaßnahmen….html` heißt *Modul 2, dritte Seite*.
**Dateien nicht umbenennen.** Moodle erkennt die Seiten am Namen wieder. Ein neuer Name bedeutet für Moodle eine neue Seite, und der bisherige Fortschritt der Teilnehmenden für diese Seite geht verloren.

**Datei schnell finden:** `Strg + P` drücken und einen Teil des Namens tippen, z. B. `notruf`.

---

## 3) So ist eine Seite aufgebaut

Jede Seite beginnt mit einem grauen **Kommentar** (`<!-- … -->`). Er beschreibt die Seite und wird im Kurs nicht angezeigt. In den Standard-Layouts folgen danach fünf Bereiche, jeweils mit einer Überschrift im Kommentar (andere Layouts haben eigene Bereiche, die der Kommentar oben nennt):

```
<!-- ① KOPFZEILE mit Modul-Menü -->      oben: ☰-Menü und „Modul 2 │ Titel“
<!-- ② HERO mit Kopfbild -->             großes Bild mit Seitentitel und Einleitung
<!-- ③ SCHRITT-KNÖPFE -->                die runden Knöpfe 1, 2, 3 … links
<!-- ④ INHALTSKARTE -->                  die weiße Karte mit dem eigentlichen Inhalt
   <!-- ══ SEITE 1: Grundsatz ══ -->         erster Schritt
   <!-- ══ SEITE 2: Schnelle Rettung … ══ --> zweiter Schritt
<!-- ⑤ FUSSLEISTE (Zurück · Seitenpunkte · Weiter) -->
```

**Für Textänderungen brauchst du fast immer nur Bereich ④.** Die Kommentare `SEITE 1`, `SEITE 2` usw. zeigen dir, wo welcher Schritt beginnt.

Innerhalb eines Schritts sieht es so aus (gekürzt):

```html
<h2 data-lm="schritt-titel" style="…">Schnelle Rettung aus Kraftfahrzeugen</h2>  ← Überschrift des Schritts
…
<div data-lm="text" style="…">  ← ab hier: der Text
<p>Ein weiteres, wichtiges Kriterium ist …</p>
<ul style="…">
<li style="…"><span …>✓</span><span style="…">Warnweste anlegen …</span></li>
</ul>
</div>                                                         ← Ende des Textes
```

**Tipp:** Lange `style="…"`-Teile machen den Code unübersichtlich. Du kannst sie einfach überlesen. Der eigentliche Text steht immer **nach** dem `>`.

**Tipp 2:** Klickst du im Kommentar oder Code auf ein `<div`, markiert VS Code das passende `</div>`. So siehst du, wo ein Bereich endet.

**Fragen** stehen in einem Bereich `<div class="lm-frage" data-frage="…">`. Dort bitte **nichts ändern**, denn die Lösungen sind darin verschlüsselt. Fragen bearbeitest du im SCORM-AutorenStudio über **✎ Bearbeiten**.

**Die `data-lm="…"`-Markierungen** (`titel`, `einleitung`, `schritt-titel`, `text`, `medium`) zeigen dem SCORM-AutorenStudio, wo was steht. Bitte nicht löschen. Text, den du **innerhalb** von `data-lm="text"` änderst, übernimmt das Studio beim nächsten Öffnen.

---

## 4) Die goldene Regel: nur zwischen > und <

```html
<p>Dieser Text darf geändert werden.</p>
   ↑                               ↑
   >  ……… hier darfst du schreiben …… <
```

| ✔ Darfst du ändern | ✘ Bitte nicht ändern |
|---|---|
| Text zwischen `>` und `<` | alles in `onclick="…"` |
| ganze Absätze `<p>…</p>` löschen oder kopieren | `data-…`-Angaben (`data-panel="2"`, `data-go="next"` …) |
| Listenpunkte `<li>…</li>` kopieren oder löschen (immer vollständig von `<li` bis `</li>`) | die Bereiche ①, ③ und ⑤ (außer du weißt genau, was du tust) |
| `alt="…"` bei Bildern (Bildbeschreibung) | Dateinamen der Seiten |
| Bausteine einfügen (Kapitel 7) | |

**Sonderzeichen im Text:** Umlaute (ä, ö, ü, ß) kannst du ganz normal tippen. Nur zwei Zeichen sind besonders:
- `<` als Text schreibst du als `&lt;` (z. B. `Kinder &lt; 8 Jahre`)
- `&` als Text schreibst du als `&amp;` (z. B. `Hygiene &amp; Schutz`)

**Fett, kursiv, Zeilenumbruch:**

```html
<strong>fett</strong>   <em>kursiv</em>   <u>unterstrichen</u>   Zeile 1<br>Zeile 2
```

**Speichern:** `Strg + S`. Ein weißer Punkt im Dateireiter oben zeigt: *noch nicht gespeichert*.
**Rückgängig:** `Strg + Z`, so oft wie nötig.

---

## 5) Rechtschreibfehler finden und ausbessern

Mit der Erweiterung *Code Spell Checker* sind unbekannte Wörter **blau gewellt unterstrichen**.

1. Mit dem Cursor in das unterstrichene Wort klicken.
2. `Strg + .` (Punkt) drücken, oder auf die erscheinende 💡-Glühbirne klicken.
3. Den richtigen Vorschlag wählen. Fertig.

Ist das Wort richtig, aber unbekannt (z. B. *Tourniquet*, *Defibrillator*, *Rettungsgasse*)?
→ `Strg + .` → **„Add: … to workspace settings“** (zum Kurs-Wörterbuch hinzufügen). Dann wird es in diesem Kurs nicht mehr angestrichen.

**Alle Fehler einer Seite auf einen Blick:** `Strg + Umschalt + M` öffnet die Liste *Probleme*. Ein Klick auf einen Eintrag springt zur Stelle.

> Die Prüfung ist eine Hilfe, keine Garantie: Sie findet falsch geschriebene Wörter, aber keine Grammatik- oder Kommafehler. Für den letzten Feinschliff lohnt es sich, die Seite in der Vorschau (Kapitel 9) noch einmal zu lesen.
>
> Im SCORM-AutorenStudio prüft übrigens der Browser die Rechtschreibung mit (rote Wellenlinie, Rechtsklick → Vorschlag).

---

## 6) Text in allen Seiten suchen und ersetzen

Ideal, wenn ein Begriff überall falsch oder veraltet ist.

1. `Strg + Umschalt + F` → links öffnet sich die **Suche über alle Dateien**.
2. Suchbegriff eingeben, z. B. `Erfierungen`. Darunter erscheinen alle Fundstellen in allen Seiten.
3. Zum Ersetzen auf den kleinen Pfeil **›** links neben dem Suchfeld klicken. Es erscheint ein zweites Feld *Ersetzen*.
4. Neuen Text eingeben, z. B. `Erfrierungen`.
5. **Einzeln prüfen und ersetzen:** Mit der Maus über eine Fundstelle fahren → Symbol *Ersetzen* klicken.
   **Alles auf einmal:** Symbol *Alle ersetzen* rechts neben dem Ersetzen-Feld (nur wenn du sicher bist).
6. Alle geänderten Dateien speichern: **Datei → Alle speichern** (`Strg + K`, dann `S`).

**Vorsicht bei kurzen Wörtern:** Wer `Arm` durch `Oberarm` ersetzt, ändert auch *Warm*, *Armband* usw. Deshalb:
- Die Schaltfläche **Aa** (Groß-/Kleinschreibung beachten) und **ab** (nur ganzes Wort) im Suchfeld einschalten.
- Unter *Einzuschließende Dateien* (über die `…` aufklappen) `seiten` eintragen, dann wird nur in den Seiten gesucht.

> **Ganz wichtig:** Ersetze **nie** Wörter, die auch im Code vorkommen, z. B. `display`, `style`, `flex`, `none`, `data`. Damit zerstörst du das Layout. Im Zweifel einzeln ersetzen.

---

## 7) Etwas hinzufügen: die Bausteine (lm-…)

Damit Neues genauso aussieht wie der Rest, musst du keine Stile abtippen. Im Kursordner gibt es fertige **Bausteine**:

1. Cursor an die Stelle im Text setzen, wo etwas Neues hin soll, am besten in eine **leere Zeile** zwischen zwei Absätzen (`</p>` ↵ hier ↵ `<p>`).
2. `lm-` tippen. Es erscheint eine Liste aller Bausteine.
3. Mit den Pfeiltasten auswählen → **Enter**.
4. Der Platzhaltertext ist schon markiert, also einfach lostippen. Mit **Tab** springst du zum nächsten Platzhalter.

Erscheint die Liste nicht: `Strg + Leertaste` drücken.

Die Bausteine sehen immer so aus wie im **Layout des Kurses** (die Beschreibungen unten gelten für die Standard-Layouts).

| Baustein | Ergebnis |
|---|---|
| `lm-absatz` | normaler Textabsatz |
| `lm-ueberschrift` | Zwischenüberschrift (in der Hauptfarbe) |
| `lm-liste` | Aufzählung (Häkchen ✓ in der Hauptfarbe, 2 Punkte) |
| `lm-punkt` | **ein weiterer** Listenpunkt (innerhalb einer vorhandenen Liste, zwischen zwei `</li>` und `<li`) |
| `lm-nummern` | nummerierte Liste 1., 2., 3. |
| `lm-kasten` | Infokasten mit Rahmen |
| `lm-merke` | hervorgehobener „Merke:“-Hinweis |
| `lm-warnung` | roter Warnhinweis „Achtung:“ |
| `lm-aufklapp` | Aufklappbereich (der Inhalt erscheint erst nach einem Klick auf die Überschrift) |
| `lm-linie` | Trennlinie |
| `lm-audio` | Tonaufnahme aus `medien/audio` |
| `lm-datei` | Datei zum Herunterladen aus `medien/dateien` (z. B. PDF) |
| `lm-bild` | Bild im einheitlichen 4:3-Rahmen |
| `lm-video` | Video mit Abspielleiste |
| `lm-link` | Link nach außen (öffnet neues Fenster) |
| `lm-tabelle` | Tabelle mit Kopfzeile (2 Spalten; weitere Zeilen: eine Zeile `<tr>…</tr>` kopieren) |
| `lm-fett` | **fetter** Text |

**Beispiel: einen Listenpunkt ergänzen**

```html
<li style="…"><span …>✓</span><span style="…">Warnweste anlegen</span></li>
                                                                       ← hier Enter, dann lm-punkt
<li style="…"><span …>✓</span><span style="…">Warndreieck aufstellen</span></li>
```

Noch einfacher: Eine vorhandene `<li …>…</li>`-Zeile **komplett kopieren** (`Strg + C`, `Strg + V`) und nur den Text darin ändern.

---

## 8) Bilder und Videos austauschen oder ergänzen

Alle Bilder liegen in `medien/bilder`, alle Videos in `medien/videos`. In den Seiten stehen sie so:

```html
<img src="../medien/bilder/warndreieck.jpg" alt="Warndreieck" style="…">
<video src="../medien/videos/helmabnahme.mp4" controls style="…"></video>
```

`../` heißt *eine Ordnerebene nach oben*, also vom Ordner `seiten` zurück in den Kursordner und dann in `medien`.

### Ein Bild durch ein besseres ersetzen (am einfachsten)
Die neue Datei **unter genau demselben Namen** in `medien/bilder` speichern und die alte damit überschreiben. Fertig, an der Seite muss nichts geändert werden.

### Ein neues Bild einfügen
1. Bilddatei in `medien/bilder` legen (einfach im Explorer oder per Ziehen in die VS-Code-Ordnerliste).
   **Dateiname ohne Leerzeichen und Umlaute**, z. B. `stabile-seitenlage-2.jpg` statt `Stabile Seitenlage (2).JPG`.
2. In der Seite an die gewünschte Stelle: `lm-bild` → Enter → Dateinamen eintippen → Tab → Bildbeschreibung.

### Ein Video einfügen
Genauso, nur mit `medien/videos` und `lm-video`. Format am besten **.mp4**.

### Kopfbild oder Icon ändern
Bitte **im SCORM-AutorenStudio** ändern (Seite öffnen → *Kopfbild* bzw. *Icon* → *Bild wählen*). Der Pfad steht in der Seite an mehreren Stellen (u. a. in `data-lm-kopfbild="…"` ganz oben). Wer es trotzdem in VS Code macht, muss **alle** Stellen mit dem alten Dateinamen ändern (`Strg + H`, *Alle ersetzen* in dieser Datei).

**Bildgröße:** In den Standard-Layouts werden alle Bilder im gleichen 4:3-Rahmen angezeigt. Ideal sind Bilder mit etwa **840 × 630 Pixeln**. Sehr große Fotos (z. B. 4000 Pixel vom Handy) vorher verkleinern, das spart Speicher im Lernpaket.

---

## 9) Ansehen, bevor du hochlädst (Vorschau)

**In VS Code (Live Preview):**
1. Seite öffnen.
2. Oben rechts auf das Symbol **Vorschau anzeigen** (Lupe mit Seite) klicken, oder Rechtsklick in den Code → **Show Preview**.
3. Rechts erscheint die Seite. Nach jedem **Speichern** aktualisiert sie sich automatisch.

Du kannst die Knöpfe (1, 2, 3, Weiter, Zurück, ☰) in der Vorschau anklicken. Sie funktionieren wie später in Moodle. Nur die Menü-Links zu anderen Modulen gehen erst im fertigen Lernpaket.

**Ohne VS Code:** Im SCORM-AutorenStudio auf der Seite **👁 Vorschau** klicken.

**Den ganzen Kurs** inklusive Kursübersicht und Fortschritt siehst du im SCORM-AutorenStudio unter **📦 Lernpaket → 👁 Ganzen Kurs ansehen**.

---

## 10) Einen Schritt von Hand hinzufügen (für Fortgeschrittene)

> **Empfehlung:** Neue Schritte, Seiten und Module **im SCORM-AutorenStudio** anlegen (*＋ Schritt hinzufügen*). Es erledigt alles Folgende automatisch und fehlerfrei, in jedem Layout.

Wer es trotzdem in VS Code machen möchte, muss in den Standard-Layouts **drei Stellen** ändern. Beispiel: Die Seite hat 2 Schritte, ein dritter kommt dazu.

**a) Inhalt: Schritt kopieren**
Im Bereich ④ den kompletten letzten Schritt markieren, von `<!-- ══ SEITE 2: … ══ -->` bis direkt vor den nächsten Kommentar (`<!-- ⑤ FUSSLEISTE` …). Kopieren und direkt dahinter einfügen. In der Kopie:
- im Kommentar `SEITE 2` → `SEITE 3`
- `data-panel="2"` → `data-panel="3"`
- `display:flex` bzw. `display:none` am Anfang dieser Zeile muss `display:none` sein (nur Schritt 1 ist am Anfang sichtbar)
- Überschrift (`<h2 …>…</h2>`) und Text ändern

**b) Schritt-Knopf**
Im Bereich ③ die letzte Zeile `<button … data-go="2" data-step="2" …>2</button>` kopieren, darunter einfügen und in der Kopie **dreimal** die 2 durch 3 ersetzen: `data-go="3"`, `data-step="3"`, `aria-label="Lernabschnitt 3"`, und die Zahl vor `</button>`.
Ist an der Kopie `aria-current="step"` dabei, dieses Stück löschen. Die Farben (`color:…;background:…`) müssen die eines **nicht** aktiven Knopfs sein – am besten von einem solchen Knopf abschauen.

**c) Seitenpunkt in der Fußleiste**
Im Bereich ⑤ die letzte Zeile `<button … data-go="2" data-dot="2" …></button>` kopieren und genauso 2 → 3 ändern (`data-go`, `data-dot`, `aria-label="Seite 3"`).

**Hatte die Seite vorher nur einen Schritt?** Dann ist die Fußleiste ausgeblendet. Im Bereich ⑤ steht dazu ein Kommentar. In der Zeile darunter `display:none` durch `display:flex` ersetzen und beim Weiter-Knopf `opacity:.45;` löschen.

**Prüfen:** Vorschau öffnen (Kapitel 9) und alle Knöpfe durchklicken.

---

## 11) Danach: neues Lernpaket erzeugen

Änderungen an den Seiten landen erst in Moodle, wenn du ein neues Lernpaket baust und hochlädst:

1. Alles speichern (`Strg + K`, dann `S`).
2. `SCORM-AutorenStudio.html` öffnen → **📂 Kurs öffnen** → Kursordner wählen.
3. Links **📦 Lernpaket erstellen** → **Lernpaket erstellen und speichern**.
4. In Moodle: SCORM-Aktivität → *Einstellungen bearbeiten* → bei *Paketdatei* die alte Datei durch die neue **ersetzen** → speichern.

Weil Dateinamen und Kurs-ID gleich bleiben, **behalten alle Teilnehmenden ihren Fortschritt** (Anleitung, Kapitel 15–16).

---

## 12) Wenn etwas schiefgeht

| Problem | Lösung |
|---|---|
| Seite sieht nach dem Bearbeiten kaputt aus | `Strg + Z` so oft drücken, bis es wieder stimmt. Meist fehlt ein `<`, `>` oder `"`, oder ein `</div>` wurde gelöscht. |
| Knöpfe reagieren nicht mehr | Wahrscheinlich wurde etwas in `onclick="…"` verändert. Mit `Strg + Z` zurück, oder die Zeile aus einer anderen Seite kopieren (die `onclick`-Texte sind überall gleich). |
| Bild wird nicht angezeigt | Dateiname in `src="…"` genau mit dem Namen in `medien/bilder` vergleichen (Groß-/Kleinschreibung, Endung `.jpg`/`.png`). |
| Bausteine `lm-…` erscheinen nicht | Wurde der **Kursordner** geöffnet (nicht nur die Datei)? Gibt es den Ordner `.vscode`? (Kapitel 1) |
| Rechtschreibprüfung streicht nichts an | Erweiterungen *Code Spell Checker* + *German* installiert? Unten in der Statusleiste muss „Spell“ stehen. |
| Datei versehentlich gelöscht | Windows-Papierkorb. Im SCORM-AutorenStudio gelöschte Seiten liegen in `seiten/.papierkorb`. |
| Alles verloren? | Erst den Kurs im SCORM-AutorenStudio öffnen: Es repariert, was es kann (Papierkorb, Sicherungen). Sonst unter 🛟 Sicherungen einen älteren Stand wiederherstellen. Notfalls enthält das zuletzt hochgeladene Lernpaket alle Seiten (im Studio auf der Startseite: **SCORM-Paket übernehmen**). |

**Sicherung:** Vor größeren Änderungen den ganzen Kursordner kopieren (z. B. `Erste-Hilfe_Sicherung_2026-10-15`).

---

## 13) Spickzettel

| Tasten | Wirkung |
|---|---|
| `Strg + S` | speichern |
| `Strg + K`, dann `S` | alles speichern |
| `Strg + Z` / `Strg + Y` | rückgängig / wiederholen |
| `Strg + P` | Datei nach Namen suchen |
| `Strg + F` | in der aktuellen Seite suchen |
| `Strg + H` | in der aktuellen Seite ersetzen |
| `Strg + Umschalt + F` | in **allen** Seiten suchen und ersetzen |
| `Strg + .` | Rechtschreibvorschläge |
| `Strg + Umschalt + M` | Liste aller Rechtschreibfehler |
| `lm-` + Enter | Baustein einfügen |
| `Strg + Leertaste` | Bausteinliste erzwingen |
| `Alt + Z` | Zeilenumbruch ein/aus |
| `Strg + /` | Zeile als Kommentar (unsichtbar) bzw. wieder sichtbar |
