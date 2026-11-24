# SCORM-AutorenStudio: Kurse und Übungen erstellen und als Lernpaket ausgeben

**Ersteller:** Sven-Michael Kern · **mit KI erstellt** · freie Software (Open Source) unter der **EUPL 1.2** – siehe [Lizenz](Lizenz.md)

Das SCORM-AutorenStudio ist **ein Programm für alles**:

1. **Kurse anlegen und bearbeiten:** Module, Seiten, Schritte, Texte, Bilder, Videos, Tonaufnahmen und Dateien zum Herunterladen. Programmieren musst du dafür nicht.
2. **Fragen in Kursseiten:** Single-Choice, Multiple-Choice, Wahr/Falsch, Drag & Drop (auch auf einem Bild), Reihenfolge, Lückentext, Zahl, Klick ins Bild, Umfrage, Antwort-Pool, Freitext, Lückentext mit Auswahl, Richtige herausziehen, Wort aus Buchstaben, Objekt ins Bild ziehen, Bereiche im Bild wählen und Bereiche der Reihe nach. Auf Wunsch als **Pflichtfrage**: Dann geht es erst weiter, wenn die Antwort richtig ist.
3. **Übungen nach dem Leitner-Prinzip:** Fragenpools mit denselben Fragearten (ohne Umfrage).
4. **Layout wählen und wechseln:** Wie die Seiten aussehen, steht in einer **Layout-Datei**. Neue Layouts lädst du einfach hinein.
5. **Kurs steuern:** Kursbild, Module der Reihe nach freischalten, Bestehen über Fragen, **🏁 Abschlusstest** mit Fragenpool, Bestehensgrenze und Versuchen, Teilnahmebestätigung zum Drucken.
6. **Werkzeuge:** Prüfung & Statistik, Medienverwaltung, Suchen & Ersetzen, Druckansicht/PDF, Sicherungen.
7. **Lernpaket erzeugen:** Ein Klick erzeugt das SCORM-Paket (.zip) für Moodle. Darin sind alle Bilder, Videos und Fragen, und es funktioniert auch offline.

```
                 ┌──────────────── SCORM-AutorenStudio ────────────────┐
 Layout-Datei ─► │ 🎨 Layout   ✎ Kurs / 🧠 Übung   ❓ Fragen   📦 Paket │ ─► Lernpaket.zip ─► Moodle
 (*.layout.html) │ 🩺 Prüfung  🖼 Medien  🔎 Suchen  🖨 Druck  🛟 Sicherung │
                 └─────────────────────────┬───────────────────────────┘
                                           ▼
         Kursordner (kurs.json, fragen.json, seiten/, medien/, layout/)   oder   Übungsordner (uebung.json, medien/, layout/)
```

---

## Inhalt

1. [Was brauche ich? (Ordner und Dateien)](#1-was-brauche-ich-ordner-und-dateien)
2. [Starten](#2-starten)
3. [Einen Kurs oder eine Übung öffnen](#3-einen-kurs-oder-eine-übung-öffnen)
4. [Einen neuen Kurs anlegen](#4-einen-neuen-kurs-anlegen)
5. [Die Oberfläche](#5-die-oberfläche)
6. [Module und Seiten verwalten](#6-module-und-seiten-verwalten)
7. [Eine Seite bearbeiten](#7-eine-seite-bearbeiten)
8. [Texte schreiben und gestalten](#8-texte-schreiben-und-gestalten) · [🎨 Freie Folie](#freie-folie)
9. [Fragen auf Kursseiten](#9-fragen-auf-kursseiten)
10. [Die Fragearten](#10-die-fragearten)
11. [Bilder, Videos, Ton und Dateien](#11-bilder-videos-ton-und-dateien)
12. [Speichern und Vorschau](#12-speichern-und-vorschau)
13. [Übungen nach dem Leitner-Prinzip](#13-übungen-nach-dem-leitner-prinzip)
14. [Layouts: wählen, wechseln, neu hinzufügen](#14-layouts-wählen-wechseln-neu-hinzufügen)
15. [Lernpaket für Moodle erstellen](#15-lernpaket-für-moodle-erstellen)
16. [Kurs-Einstellungen: Ablauf, Abschluss, Teilnahmebestätigung](#16-kurs-einstellungen-ablauf-abschluss-teilnahmebestätigung) · [🏁 Abschlusstest](#abschlusstest)
17. [Werkzeuge](#17-werkzeuge)
18. [Zusammenarbeit mit VS Code](#18-zusammenarbeit-mit-vs-code)
19. [Gut zu wissen und Grenzen](#19-gut-zu-wissen-und-grenzen)
20. [Häufige Fragen und Probleme](#20-häufige-fragen-und-probleme)
21. [Version, Ersteller, KI-Hinweis](#21-version-ersteller-ki-hinweis)
22. [Für Fortgeschrittene: Was steckt dahinter?](#22-für-fortgeschrittene-was-steckt-dahinter)
23. [Wörterbuch](#23-wörterbuch)

---

## 1. Was brauche ich? (Ordner und Dateien)

**Du brauchst nur eine Datei: `SCORM-AutorenStudio.html`.** Sie enthält alles: alle Layouts, den Kurs-Player, den Leitner-Test und diese Anleitung. Du kannst sie überallhin kopieren, z. B. auf den Desktop. Sie funktioniert auch ohne die anderen Ordner.

So sieht der Ordner aus, in dem das Programm geliefert wird:

```
SCORM-AutorenStudio\
  SCORM-AutorenStudio.html        ← das Programm (Doppelklick). Mehr braucht man zum Arbeiten nicht.
  SCORM-AutorenStudio-Lite.html   ← die vereinfachte Ausgabe (ein Lernpaket in drei Schritten)
  LIESMICH.txt                    ← kurze Einführung
  LIZENZ.txt                      ← die Lizenz (EUPL 1.2): Das Programm ist freie Software.
  LICENSE                         ← dieselbe Lizenz in der englischen Fassung
  LIZENZ-HINWEISE.txt             ← Urheber, Erlaubnis für Lernpakete, fremde Software, KI-Hinweis
  README.md, Bilder\              ← Übersichtsseite mit Bildern (für die Veröffentlichung im Internet)
  Quellen\                        ← lesbare Bausteine – nur nötig, um das Programm zu verändern
```

Deine Kurse und Lernpakete legst du ab, wo du möchtest. Bewährt haben sich zwei eigene Ordner:

| Ordner | Wofür | Darf ich etwas löschen? |
|---|---|---|
| `Kurse\<Name>` | ein Kurs bzw. eine Übung. Darin liegt eine `LIESMICH`-Datei, die den Ordner erklärt. | Nein, nur über das Studio. Fehlt doch einmal etwas, repariert das Studio den Ordner beim Öffnen so weit wie möglich selbst (Kapitel 20). |
| `Lernpakete\` | fertige Lernpakete zum Hochladen | ja, sie lassen sich jederzeit neu erstellen |
| `Quellen\` | die Bausteine, aus denen das Programm zusammengesetzt ist, und das Werkzeug `bauen.ps1` (Kapitel 22) | Zum Arbeiten wird der Ordner nicht gebraucht. Wer das Programm weitergibt, gibt ihn aber mit (siehe [Lizenz](Lizenz.md)). |

---

## 2. Starten

1. `SCORM-AutorenStudio.html` **doppelklicken**.
2. Am besten in **Google Chrome** oder **Microsoft Edge** öffnen. Nur diese beiden Browser können direkt in deinen Ordner speichern.
   Falls ein anderer Browser aufgeht: Rechtsklick auf die Datei → **Öffnen mit** → Chrome oder Edge.

**Zurück zum Hauptmenü** kommst du jederzeit oben links: über das **Haus ⌂** oder über das Zeichen **S** mit dem Namen des Studios. Ein geöffneter Kurs bleibt dabei offen, und ungespeicherte Änderungen gehen nicht verloren.

**Hilfe:** oben rechts **? Hilfe** oder Taste **F1**. Dort stehen diese Anleitung (mit Inhaltsverzeichnis und Suche), die Anleitung für VS Code, die Hinweise zur Sicherheit und die Lizenz.

---

## 3. Einen Kurs oder eine Übung öffnen

1. Oben auf **📂 Öffnen** klicken.
2. Den **Ordner** wählen, z. B. `D:\Kurse\Erste-Hilfe`. Das Studio erkennt selbst, ob es ein Kurs (Ordner `seiten`) oder eine Übung (`uebung.json`) ist.
3. Der Browser fragt, ob das Studio Dateien bearbeiten darf → **Dateien bearbeiten / Zulassen**.

**Kurs aus einer Datei laden:** Hat dir jemand einen Kurs als eine Datei geschickt (`….kurs.zip` oder `….uebung.zip`), dann auf der Startseite **📦 Aus Datei laden** wählen. Danach einen **leeren Ordner** wählen, in den der Kurs ausgepackt wird.

---

## 4. Einen neuen Kurs anlegen

1. Im Windows-Explorer einen **leeren Ordner** anlegen, z. B. `Kurse\Brandschutz`.
2. Im Studio auf **✚ Neuer Kurs** klicken und den Kursnamen eingeben.
3. **Layout wählen** (👁 zeigt eine Beispielseite) → **Dieses Layout wählen**.
4. Den leeren Ordner auswählen und das Bearbeiten erlauben.

```
Brandschutz/
  kurs.json                          Kursname, Kurs-ID, Layout, Reihenfolge, Einstellungen
  fragen.json                        Fragen der Kursseiten mit Lösungen (entsteht mit der ersten Frage)
  seiten/Modul01_1_Einfuehrung.html  erste Seite
  medien/bilder/ videos/ audio/ dateien/   Bilder, Videos, Tonaufnahmen, Dateien zum Herunterladen
  layout/<layout>.layout.html        Kopie des gewählten Layouts
  .sicherungen/                      frühere Stände (Kapitel 17)
  .vscode/                           Einstellungen für VS Code
  LIESMICH - mit SCORM-AutorenStudio öffnen.txt   erklärt den Ordner in zwei Sätzen
```

---

## 5. Die Oberfläche

Das Studio ist bewusst **ruhig und neutral** gehalten. Farbig sind nur die Inhalte, also Textfelder, Vorschauen und Fragen. Sie zeigen die Farben des jeweiligen **Layouts**. Beim ersten Start ist das Studio hell. Wer es lieber dunkel mag, schaltet oben rechts mit dem Knopf **☀ / ☾** (Sonne oder Mond) um. Das Studio merkt sich die Wahl.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ◧ ⌂ S SCORM AutorenStudio  v3.47.0 │ Erste Hilfe  📂 Öffnen  ✚ Neues Lernpaket  💾 Speichern  ? Hilfe  ☀ │
├────────────────────────┬─────────────────────────────────────────────────────────────────────────────────┤
│ ⚙ Lernpaket: Erste H.  │                                                                                 │
│ 🎨 Layout: …           │   Rechts wird bearbeitet, was links gewählt ist                                │
│ 📦 Lernpaket erstellen │                                                                                 │
│ WERKZEUGE              │                                                                                 │
│ 🩺 Prüfung & Statistik │                                                                                 │
│ 🖼 Medien              │                                                                                 │
│ 🔎 Suchen & Ersetzen   │                                                                                 │
│ 💬 Kommentare          │                                                                                 │
│ 🖨 Druckansicht        │                                                                                 │
│ 🛟 Sicherungen         │                                                                                 │
│ MODULE UND SEITEN      │                                                                                 │
│ 1 Trainingsgrundlagen  │                                                                                 │
│   │ Trainingsinfo      │                                                                                 │
├────────────────────────┴─────────────────────────────────────────────────────────────────────────────────┤
│ Statusmeldungen …                                                   © Sven-Michael Kern  mit KI erstellt │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Die Kopfleiste oben, von links nach rechts:**

- **◧** blendet das Seitenmenü aus und wieder ein. Das schafft Platz auf kleinen Bildschirmen.
- **⌂** (das Haus) und das Zeichen **S** mit dem Namen führen zum Hauptmenü.
- Die **Versionsnummer** öffnet beim Anklicken die Versionsgeschichte (Kapitel 21).
- Daneben steht der Name des geöffneten Lernpakets.
- **💾 Speichern** ist grau, solange es nichts zu speichern gibt. Sobald du etwas geändert hast, wird der Knopf farbig.
- **☀ / ☾** wechselt zwischen dunklem und hellem Erscheinungsbild.

**Das Seitenmenü links:**

- Der gewählte Eintrag ist farbig hinterlegt.
- Unter jedem Modul stehen eingerückt seine Seiten.
- Die kleinen Pfeile **▲ ▼** rechts verschieben ein Modul oder eine Seite. Sie sind blass, bis die Maus auf der Zeile steht.
- **Ziehen geht auch:** Seite oder Modul mit gedrückter Maustaste an die neue Stelle ziehen – eine farbige Linie zeigt, wo sie landet. Seiten lassen sich so auch in ein anderes Modul ziehen. In einer Übung genauso mit den Fragen.
- **●** hinter einem Namen bedeutet: geändert, aber noch nicht gespeichert.
- **🔒** vor einer Seite bedeutet: Diese Seite hat keinen Layout-Aufbau und lässt sich nur in VS Code bearbeiten.

**Meldungen** stehen unten links in der Statusleiste (z. B. „Gespeichert“). Wichtige Meldungen erscheinen zusätzlich für ein paar Sekunden als Kärtchen unten in der Mitte. Fehler sind rot markiert und bleiben länger stehen. Mit **✕** schließt du ein Kärtchen sofort.

**Eigene Akzentfarbe:** Die Farbe der Hauptknöpfe und der Auswahl (im Lieferzustand Blau) lässt sich ändern: links **⚙ Lernpaket** wählen, ganz unten bei **Studio-Einstellungen**. Das betrifft nur das Studio selbst, nicht die Lernpakete.

| Begriff | Was ist das? | Im Kurs zu sehen als … |
|---|---|---|
| **Kurs** | das ganze Lernpaket | Kursübersicht mit allen Modulen |
| **Modul** | ein Kapitel, z. B. *Hygiene* | Karte in der Übersicht (mit Beschreibung und Lerndauer) |
| **Seite** | eine Datei in `seiten/` | Seite mit Titel (und je nach Layout mit Kopfbild) |
| **Schritt** | Abschnitt einer Seite | zum Blättern (Knöpfe, Reiter, *Weiter*) |

---

## 6. Module und Seiten verwalten

| Aufgabe | So geht's |
|---|---|
| **Modul hinzufügen** | ganz unten **＋ Modul hinzufügen** → Titel eingeben. Das Modul bekommt automatisch eine erste Seite. |
| **Seite hinzufügen** | im Modul **＋ Seite hinzufügen** → Titel eingeben |
| **Seite duplizieren** | Seite öffnen → **⧉ Duplizieren**. Die Kopie steht direkt dahinter. Fragen werden mitkopiert und bekommen eine neue Kennung. |
| **Reihenfolge ändern** | Modul oder Seite mit gedrückter Maustaste an die neue Stelle **ziehen** – oder **▲ ▼** daneben. Ganz oben bzw. unten wandert die Seite ins vorherige bzw. nächste Modul. |
| **Etwas rückgängig machen** | **↶** oben (Strg + Z) – Schritt für Schritt zurück; **↷** (Strg + Y) wieder vorwärts. |
| **Modul bearbeiten** | Modul anklicken. Dort gibt es *Modultitel*, *Kurzbeschreibung* und *Lerndauer* (leer = das Studio schätzt sie, 0 = keine Angabe). |
| **Seite / Modul löschen** | anklicken → **löschen**. Beim Speichern wandern die Dateien nach `seiten/.papierkorb`. |

**Dateinamen** vergibt das Studio selbst und ändert sie danach **nie** mehr. Moodle erkennt die Seiten am Dateinamen wieder. So bleibt der Fortschritt der Teilnehmenden erhalten.

### PowerPoint übernehmen

Aus einer fertigen PowerPoint-Präsentation (`.pptx`) übernimmt das Studio wahlweise
- **nur den Inhalt** – das Aussehen kommt danach aus dem Layout des Kurses (am besten lesbar auf dem Handy), oder
- die **Original-Anordnung** – jede Folie wird eine [🎨 Freie Folie](#freie-folie), die so aussieht wie in PowerPoint (Lage, Farben aus dem Design, Schriften und -größen, Formen, Linien und Pfeile, Tabellen, zugeschnittene Bilder, Hintergründe, Logos und Gestaltung aus Folienmaster und -layout). Danach lässt sich jede Folie frei weiterbearbeiten. EMF/WMF-Grafiken erscheinen als grauer Platzhalter mit Hinweis.

Die Wahl steht im Dialog unter **„Aussehen der Folien“**.

1. Auf der Startseite die Kachel **📊 Aus PowerPoint** wählen. Damit entsteht direkt ein **neuer Kurs**: Titel eingeben, dann Layout und einen leeren Ordner wählen.
   In einen **schon geöffneten Kurs** geht es links ganz unten über **📥 PowerPoint übernehmen** oder im Modul über **📥 Folien aus PowerPoint anhängen**.
2. Die Präsentation hineinziehen oder wählen. Das Studio zeigt, was es gefunden hat.
3. Einstellen:
   - **Wohin?** Neuer Kurs, neues Modul im geöffneten Kurs oder ans Ende eines vorhandenen Moduls.
   - **Aufteilung:**
     - eine Seite pro PowerPoint-Abschnitt,
     - alle Folien auf eine Seite (ab 10 Folien automatisch in Teile),
     - oder jede Folie als eigene Seite.

     Jede Folie wird ein **Schritt**.
   - **Sprechernotizen** als Aufklappbereich „Erläuterung“, als Text oder weglassen.
4. **Übernehmen**, alles prüfen und **💾 Speichern**.

| Aus der PowerPoint | wird im Kurs |
|---|---|
| Folientitel (oder die oberste kurze Zeile) | Überschrift des Schritts |
| Text, Aufzählungen (auch mehrstufig), nummerierte Listen, Fett/Kursiv/Unterstrichen | Text im Layout-Aussehen |
| Links (https, mailto) | Links |
| Tabellen | Tabellen |
| größtes Bild der Folie | Bild zum Schritt |
| weitere Bilder | Bilder im Text (große Bilder werden verkleinert) |
| eingebettete Tonaufnahmen und Videos | Ton bzw. Video im Text |
| SmartArt | Aufzählung mit den Texten |
| Sprechernotizen | je nach Wahl |

Die Tabelle gilt für **„Nur den Inhalt“**. Bei der Original-Anordnung bleibt jede Folie als Ganzes erhalten.

**Nicht übernommen werden** (bei „Nur den Inhalt“):
- Farben, Schriften, Hintergründe, Folienmaster und die Anordnung auf der Folie – dafür gibt es die Original-Anordnung.
- Fußzeile, Datum und Foliennummer.
- Elemente, die auf vielen Folien gleich sind, z. B. Logos und Kennzeichnungen.
- Ausgeblendete Folien, außer du wählst sie aus.
- Diagramme: bitte als Bild einfügen.
- EMF/WMF-Grafiken: Browser können sie nicht anzeigen. Bitte in PowerPoint als PNG speichern und unter 🖼 Medien ersetzen.
- Animationen (in beiden Arten; in der Freien Folie lassen sie sich danach neu einstellen).

Alte `.ppt`-Dateien bitte in PowerPoint als `.pptx` speichern. Präsentationen mit Makros (`.pptm`) werden aus Sicherheitsgründen nicht gelesen.

---

## 7. Eine Seite bearbeiten

| Feld | Bedeutung |
|---|---|
| **Titel der Seite** | große Überschrift |
| **Einleitung** | kurzer Text unter dem Titel. **Leer** = automatisch: *„In diesem Abschnitt: Schritt 1 · Schritt 2 …“* |
| **Kopfbild** | großes Bild oben (wie groß, bestimmt das Layout) |
| **Icon** | kleines Bild neben den Schritt-Überschriften (wenn das Layout eins zeigt) |

**Darunter stehen die Schritte.** Jeder Schritt hat:
- eine **Überschrift**
- **▲ ▼** zum Verschieben, **⧉** zum Duplizieren und **Löschen**
- optional **ein Bild oder Video** zum Schritt. Bei einem Bild gibt es darunter das Feld **Bildbeschreibung**.
- den **Text** mit Werkzeugleiste

**Bildbeschreibung (Alternativtext):** Hier steht in einem Satz, was auf dem Bild zu sehen ist. Menschen mit Sehbehinderung lassen sich diesen Text vorlesen. Bei Bildern **im Text** genügt ein **Doppelklick auf das Bild**. Reine Schmuckbilder bleiben leer.

Knöpfe, Zähler und *Weiter/Zurück* passt das Studio automatisch an.

---

## 8. Texte schreiben und gestalten

| Knopf | Wirkung |
|---|---|
| **F / K / U** | fett / kursiv / unterstrichen (`Strg + B / I / U`) |
| **Überschrift** / **Absatz** | Zwischenüberschrift bzw. wieder normaler Text |
| **✓ Liste** / **1. Liste** | Aufzählung / nummerierte Liste |
| **▭ Infokasten** / **❗ Merke** | Kasten mit Rahmen / hervorgehobener Hinweis |
| **⚠ Warnung** | roter Warnhinweis, z. B. für Gefahren |
| **⌄ Aufklappen** | Überschrift ist sichtbar, der Inhalt erst nach einem Klick. Gut für Zusatzwissen und Lösungen. Im Editor ist der Bereich immer offen. |
| **⊞ Tabelle** | fragt nach Spalten und Zeilen. Danach lässt sich die Tabelle jederzeit weiter bearbeiten (siehe [Tabellen bearbeiten](#tabellen-bearbeiten)). |
| **― Linie** | Trennlinie |
| **😊 Emoji** | Emoji an der Schreibstelle einfügen. Die Emojis sind wie am Handy nach Gruppen sortiert: Oben wählst du den Reiter (🕘 Zuletzt verwendet, ⚕️ Medizin & Erste Hilfe, 😀 Smileys & Personen, 🐻 Tiere & Natur, 🍔 Essen, ⚽ Aktivitäten, 🚗 Reisen, 💡 Objekte, ❤️ Symbole), darunter erscheinen nur die Emojis dieser Gruppe. Das Fenster bleibt offen, bis du daneben klickst oder **Esc** drückst. Wie ein Emoji im Text aussieht, hängt vom Gerät der Lernenden ab – soll es überall gleich aussehen, nimm eine **Bildkarte** (siehe Kapitel 11). |
| **🖼 Bild** / **🎬 Video** | Bild bzw. Video mitten in den Text |
| **▶ YouTube** | YouTube-Video einbetten: Adresse aus dem Browser einfügen (`youtube.com/watch?v=…` oder `youtu.be/…`). Das ist die einzige erlaubte Internet-Quelle (siehe Kapitel 19). Im Studio zeigt YouTube das Video eventuell nicht an, im Lernpaket in Moodle schon. |
| **🔊 Audio** | Tonaufnahme (z. B. MP3) mit Abspiel-Leiste |
| **📎 Datei** | Datei zum Herunterladen, z. B. ein PDF-Merkblatt |
| **🔗 Link** | Text markieren → Knopf → Adresse |
| **❓ Frage** | Frage einfügen (Kapitel 9) |
| **🧩 Baustein** | interaktiven Baustein einfügen (siehe unten) |
| **🎨 Freie Folie** | Folie einfügen, auf der du Texte, Bilder und farbige Kästen frei anordnest – wie in PowerPoint (siehe [Freie Folie](#freie-folie)) |
| **⌫ Format** | Formatierung entfernen |
| **↶ ↷** | rückgängig / wiederholen |

- **Rechtschreibung:** Fehler sind rot unterstrichen. Rechtsklick → Vorschlag wählen.
- **Text aus Word einfügen:** einfach `Strg + V`. Fremde Schriften und Farben fallen dabei weg.
- Im Editor legst du nur fest, *was* etwas ist (Überschrift, Liste, Warnung). *Wie* es aussieht, bestimmt das Layout.

### Elemente anordnen

Zeigt die Maus auf ein Element im Text – Absatz, Tabelle, Kasten, Bild, Frage, Baustein –, erscheint darüber ein kleiner Griff:

| Knopf | Wirkung |
|---|---|
| **⠿** | mit gedrückter Maustaste **ziehen**: Ein blauer Strich zeigt, wo das Element landet – auch in einer Spalte. **Esc** bricht ab. |
| **↑ ↓** | eine Stelle nach oben bzw. unten |
| **⫼ Nebeneinander** | stellt das Element und das nächste **nebeneinander in Spalten**. Steht es schon in Spalten, kommt eine Spalte dazu (höchstens vier). |
| **⊟** | Spalten auflösen: alles steht wieder untereinander |
| **🗑** | Element löschen |

- In jeder Spalte kannst du schreiben und mit der Werkzeugleiste weitere Elemente einfügen. Im Editor sind Spalten gestrichelt umrandet.
- **Im Lernpaket** stehen die Spalten nebeneinander, solange der Platz reicht. Auf dem Handy rutschen sie automatisch untereinander.
- **Rückgängig:** `Strg + Z` oder **↶** nimmt Verschieben und Tabellen-Änderungen zurück, solange du danach noch nichts getippt hast.

### Tabellen bearbeiten

Steht der Cursor in einer Tabelle, erscheint darunter die **Tabellen-Leiste**:

| Knopf | Wirkung |
|---|---|
| **＋ Zeile ↑ / ↓**, **− Zeile** | Zeile darüber oder darunter einfügen, Zeile löschen |
| **＋ Spalte ← / →**, **− Spalte** | Spalte links oder rechts einfügen, Spalte löschen |
| **⊞ Verbinden** / **⊟ Teilen** | Mehrere Zellen markieren (mit gedrückter Maustaste darüberziehen oder **Umschalt + Klick**) und zu einer Zelle verbinden – oder eine verbundene Zelle wieder teilen |
| **🎨 Farbe** | Hintergrundfarbe der Zelle bzw. der markierten Zellen. Bei dunklen Farben wird die Schrift automatisch weiß. |
| **⇤ ↔ ⇥** | Text links, mittig oder rechts |
| **▤ Kopfzeile** | erste Zeile als hervorgehobene Kopfzeile ein- oder ausschalten |
| **⇹ Gleich breit** | Spaltenbreiten zurücksetzen |
| **🗑 Tabelle** | ganze Tabelle löschen |

**Spaltenbreite ändern:** mit der Maus auf den Rand zwischen zwei Spalten gehen (der Zeiger wird zum Doppelpfeil) und ziehen.

### Interaktive Bausteine

Mit **🧩 Baustein** kommt Bewegung in die Seite. Eine Auswahl zeigt alle Arten mit kurzer Erklärung:

| Baustein | Was die Lernenden tun | Gut für |
|---|---|---|
| 🗂 **Reiter** | zwischen Reitern wechseln | Themen nebeneinander, z. B. Erkennen · Handeln · Betreuen |
| 🃏 **Klappkarten** | Karte antippen, Rückseite lesen | Begriffe lernen, sich selbst abfragen |
| 📍 **Bild mit Info-Punkten** | Punkte im Bild antippen | Ausrüstung, Körperstellen, Fahrzeuge erklären |
| 🪜 **Ablauf / Zeitstrahl** | Schritt für Schritt weiterklicken, oder alles als Zeitstrahl lesen | Abläufe, Rettungskette, Geschichte |
| 🖼 **Bildergalerie** | Bilder durchblättern | Bildserien, Beispiele |
| ↔️ **Vorher / Nachher** | Schieberegler ziehen | richtig/falsch, vorher/nachher (z. B. Verband) |
| 📖 **Glossar** | Begriffe suchen | Fachbegriffe eines Moduls |
| 🔀 **Fallszenario** | in einer Geschichte entscheiden, die Folgen erleben | Notfälle, Gespräche, Entscheidungen unter Druck |

**So geht's:**
1. Im Text an die gewünschte Stelle klicken, dann **🧩 Baustein** wählen.
2. Eine Art wählen. Jeder Baustein startet mit einem **Beispiel**, damit du sofort siehst, wie er funktioniert.
3. Links Texte und Bilder ändern, Einträge mit **＋** hinzufügen und mit **▲ ▼ ✕** sortieren oder löschen. Rechts in der **Vorschau** kannst du gleich ausprobieren.
4. Beim *Bild mit Info-Punkten* einfach **ins Bild klicken**, um einen Punkt zu setzen. Punkte lassen sich mit der Maus verschieben.
5. **Übernehmen.** Im Text steht danach ein Kasten mit **✎ Bearbeiten** und **🗑**.

Ohne Technik, z. B. in der Druckansicht, steht der Inhalt eines Bausteins einfach untereinander. So geht nichts verloren.

**Fallszenario: eine Geschichte mit Entscheidungen**

Das Beispiel (Unfall auf der Landstraße) zeigt alles Wichtige. So baust du ein eigenes Szenario:

1. **Szene 1 ist der Start.** Jede Szene hat eine Überschrift, einen Text, auf Wunsch ein Bild und eine Person, die spricht (*„Wer spricht?“*, z. B. „Patient“).
2. Unter **Entscheidungen** trägst du ein, was die Lernenden wählen können. Bei jeder Entscheidung stellst du ein:
   - **führt zu**: die Szene, die danach kommt. Mit **＋ neue Szene anlegen** entsteht sie direkt.
   - **Bewertung**: ✓ gut, – neutral oder ✗ schlecht
   - **Rückmeldung** (optional): erscheint nach der Wahl, z. B. „Eigenschutz geht vor.“
3. Szenen ohne Entscheidungen markierst du unter **„Diese Szene ist …“** als **Ende** (gut, neutral oder schlecht).
4. Oben zeigt **„Ablauf auf einen Blick“**, welche Szene wohin führt. Gelb markiert sind Szenen, die nie erreicht werden.

Die Lernenden sehen immer nur eine Szene und klicken sich durch. Am Ende steht, wie es ausgegangen ist und wie viele Entscheidungen gut oder schlecht waren. Mit **↺ Noch einmal von vorn** probieren sie einen anderen Weg. Der gegangene Weg und das Ende gehen an Moodle (**Berichte → Interaktionen**).

### Freie Folie

Mit der **🎨 Freien Folie** gestaltest du eine Seite **wie in PowerPoint**: Texte, Bilder und farbige Kästen liegen genau da, wo du sie hinziehst.

**So kommst du hin:**
- links im Modul **＋ 🎨 Freie Folie** – das legt eine neue Seite an, die nur aus einer Folie besteht, und öffnet gleich den Folien-Editor;
- oder im Text eines Schritts der Knopf **🎨 Freie Folie** (dann steht die Folie mitten im Text);
- eine vorhandene Folie öffnest du mit **✎ Folie bearbeiten**.

**Im Folien-Editor:**

| Was | Wie |
|---|---|
| **📚 Folienbibliothek** | oben rechts: 20 fertige Folien – Titelfolie, Zwischencharts, Aufzählung, zwei und drei Spalten mit Kopf, Kernaussage mit fünf Punkten, vier Felder mit Mitte, Haus, Prozess, Ablauf, Gliederung, Kreislauf, Zeitleiste, Meilensteine u. a. Schlicht gestaltet, in der Hauptfarbe des Layouts: farbiges Kopfband, schmale Fußleiste, ruhige Grautöne. Die Vorlage ersetzt die aktuelle Folie (Strg+Z macht das rückgängig); danach ist jedes Element frei bearbeitbar. Die Fußzeile (Titel, Name, Datum) bitte anpassen. |
| **⭐ Eigene Vorlagen** | **⭐ Als Vorlage** (oben) legt die aktuelle Folie in die Folienbibliothek unter **Eigene Vorlagen** – mit allen Bildern; sie steht dann in **allen** Kursen bereit. **📥 Folienmaster aus PowerPoint übernehmen** (in der Folienbibliothek) liest die Folienlayouts aus dem Folienmaster einer PowerPoint-Datei (.pptx) oder -Vorlage (.potx): Hintergrund, Logos, Formen und Platzhalter für Titel, Text und Bild. Nicht benötigte Layouts vorher abwählen. Auf einer eigenen Vorlage: **✎** umbenennen oder in eine andere Gruppe schieben, **🗑** löschen. **Bearbeiten:** Vorlage übernehmen, ändern, dann mit **⭐ Als Vorlage** die alte ersetzen. **Weitergeben:** **💾 Eigene Vorlagen als Datei speichern** erzeugt `Meine-Vorlagen.folienbibliothek.json`; andere laden sie mit **📂 Vorlagen-Datei laden**. Die eigenen Vorlagen liegen im Browser – bei einem anderen Browser oder Rechner die Datei laden. |
| **Einfügen** | oben **𝐓 Textfeld**, **▭ Kasten mit Text** (farbig hinterlegt), **◆ Form** (Rechteck, abgerundet, Kreis, Dreieck, Raute, Blockpfeile, Chevron, Sechseck, Stern, Sprechblase, Plus, Kasten mit Spitze unten), **🖼 Bild**, **🔖 Icon**, **🎬 Video**, **╱ Linie**, **➝ Pfeil** |
| **Verschieben** | Element ziehen. Rosa Hilfslinien zeigen, wann es bündig mit der Folienmitte, dem Rand oder anderen Elementen ist. **Alt** = ohne Einrasten, **Umschalt** = nur waagrecht/senkrecht. Pfeiltasten = fein verschieben (mit Umschalt weiter). |
| **Größe und Drehung** | an den weißen Griffen ziehen; der runde Griff oben dreht (Umschalt = 15°-Schritte). Bilder behalten an den Ecken ihr Seitenverhältnis. Bei Linien und Pfeilen zieht man die beiden Enden. |
| **Text schreiben** | **Doppelklick** auf einen Kasten oder ein Textfeld. Text markieren und rechts Schriftart, Größe, Farbe, **fett/kursiv/unterstrichen** oder Listen wählen. **Esc** beendet die Eingabe. |
| **Aussehen** | rechts: Füllfarbe mit Deckkraft, Rahmenfarbe und -stärke, Eckenrundung, Schatten, Ausrichtung des Textes (waagrecht und senkrecht), Innenabstand, „Text am Rand umbrechen“. Farben aus dem Layout stehen vorne in der Farbauswahl, danach vier ruhige Grautöne. |
| **Mehrere Elemente** | Rahmen aufziehen oder Umschalt+Klick. Dann gemeinsam verschieben, ausrichten (⇤ ↔ ⇥ ⤒ ↕ ⤓), gleichmäßig verteilen (⇹ ⇳), gleich groß machen (⬌ ⬍) oder einfärben. Ein einzelnes Element richtet sich an der Folie aus. |
| **Ebenen** | ⬆ ⬇ eine Ebene nach vorne/hinten, ⏫ ⏬ ganz nach vorne/hinten – oder rechts unten in der Liste **Elemente** mit ▲ ▼. |
| **Tastatur** | Strg+Z / Strg+Y rückgängig/wiederholen · Strg+C / Strg+V kopieren/einfügen (auch in eine andere Folie) · Strg+D duplizieren · Entf löschen · Strg+A alles wählen · Enter oder F2 = Text schreiben |
| **Folie** | wenn nichts gewählt ist: Format (16:9, 4:3, 16:10), Hintergrundfarbe, Hintergrundbild |
| **⏱ Zeitleiste** (nur SCORM-AutorenStudio) | oben „⏱ Zeitleiste“, dann **Zeitleiste für diese Folie verwenden**. Jedes Element bekommt **Beginn** und **Dauer** in Sekunden (oder „bis Folienende“); die Folie zeigt zu jedem Zeitpunkt genau die Elemente, deren Zeitspanne ihn enthält. Unten: Zeitskala mit Zoom und Abspielkopf (auf die Skala klicken = diesen Moment auf der Folie zeigen), eine Zeile je Element (vorne liegt oben). **Balken ziehen** = früher/später, **Rand ziehen** = Beginn oder Ende, **⋮⋮ ziehen** = Ebene ändern, Umschalt+Klick = mehrere (dann „gleicher Beginn“, „gleiche Dauer“). Einrasten am Abspielkopf, an anderen Balken und im 0,1-s-Raster. 👁 und 🔒 blenden nur beim Bearbeiten aus bzw. sperren das Element. Rechtsklick: bis Folienende, am Abspielkopf beginnen/enden, Pausenpunkt, sperren, duplizieren, löschen. Leertaste = abspielen. **🔊 Ton wählen** legt eine Tonspur mit Wellenform darunter; die Foliendauer lässt sich an die Tonlänge anpassen. Rechts beim Element: Ein- und Ausblend-Effekt mit eigener Dauer und **Pausenpunkt** – die Uhr hält nach dem Einblenden an, bis die Lernenden auf dieses Element klicken (oder Enter drücken). Im Lernpaket steht unter der Folie eine Abspielleiste (▶/❚❚, Zeitregler); man kann zurückspringen, aber nicht über einen offenen Pausenpunkt hinaus. Auf einer Folie mit Zeitleiste gelten die Klick-Animationen nicht. Das SCORM-AutorenStudio Lite spielt solche Folien ab, bearbeitet die Zeiten aber nicht. |
| **Raster** | oben **Raster und einrasten** – Elemente springen auf ein gleichmäßiges Raster |
| **Animationen** | Element wählen → rechts **Animation**: Einblenden, Hereinfliegen (von links/rechts/oben/unten), Vergrößern, Wischen. **Start:** bei Klick, mit vorheriger oder nach vorheriger; dazu Verzögerung und Dauer. Die Lernenden sehen einen ▶-Knopf auf der Folie (oder klicken auf die Folie). **▶ Vorschau mit Animationen** zeigt den Ablauf. |

**Gut zu wissen:**
- Die Folie wächst und schrumpft mit der Bildschirmbreite – alles bleibt an seinem Platz. Auf dem **Handy** wird sie dadurch klein; Texte, die man auch unterwegs gut lesen soll, besser auf normale Seiten schreiben.
- **Barrierefreiheit:** Bei Bildern rechts die **Bildbeschreibung** ausfüllen. Die Reihenfolge in der Liste **Elemente** ist die Reihenfolge, in der Screenreader und der Knopf „🔊 Vorlesen“ die Folie lesen – und die Reihenfolge der Animationen.
- **Schritt-Überschrift ausblenden:** Hat die Folie einen eigenen Titel, blendet das Lernpaket die Überschrift darüber aus (Einstellung bei „Folie“, ohne Auswahl). Für Screenreader bleibt sie erhalten.
- Unter die Folie darf weiterer Text: Er erscheint im Lernpaket unter der Folie, z. B. als Erläuterung.

---

## 9. Fragen auf Kursseiten

1. Im Text eines Schritts an die gewünschte Stelle klicken.
2. In der Werkzeugleiste auf **❓ Frage** klicken. Der **Fragen-Editor** öffnet sich.
3. Oben die **Frageart** wählen (Kapitel 10), dann Frage und Antworten eintragen.
4. Rechts in der **Vorschau** kannst du die Frage sofort selbst ausprobieren.
5. Bei Bedarf **Pflichtfrage** anhaken. Dann können die Lernenden erst weiterblättern, wenn die Frage richtig beantwortet ist.
6. **Übernehmen.** Im Text erscheint ein Platzhalter-Kasten mit **✎ Bearbeiten** und **🗑**.
7. **💾 Speichern.**

**So erleben es die Lernenden:**
- Sie beantworten die Frage und klicken auf **Antwort prüfen**. Bei einer falschen Antwort dürfen sie es noch einmal versuchen.
- Bei einer **Pflichtfrage** sind *Weiter*, die Schritt-Knöpfe und der Pfeil in der Leiste gesperrt, bis die Antwort stimmt. Ein Hinweis erklärt das.
- Richtig gelöste Fragen merkt sich Moodle. Beim nächsten Besuch steht dort „✓ bereits richtig beantwortet“.

**Wo stehen die Lösungen?**
- **Im Lernpaket** stehen die richtigen Antworten nicht im Klartext, sondern nur als Prüfsumme. Ein Blick in den Quelltext verrät die Lösung also nicht.
- **Im Kursordner** stehen die Fragen mit Lösungen in `fragen.json`. Diese Datei kommt **nicht** ins Lernpaket.

> Fragen bitte immer im Studio bearbeiten, nicht in VS Code.

---

## 10. Die Fragearten

| Frageart | So legst du sie an | So beantworten es die Lernenden |
|---|---|---|
| **◉ Single-Choice** | Antworten eintragen, die richtige anklicken (zu jeder Antwort geht auch ein **🖼 Bild**) | eine Antwort wählen |
| **☑ Multiple-Choice** | alle richtigen Antworten anhaken | alle richtigen wählen |
| **⚖ Wahr / Falsch** | eine Aussage schreiben, dann „wahr“ oder „falsch“ wählen | entscheiden: wahr oder falsch |
| **⇄ Drag & Drop** | Felder anlegen und Begriffe zuordnen (siehe unten) | Begriffe auf die Felder ziehen oder erst einen Begriff und dann ein Feld antippen |
| **↕ Reihenfolge** | Einträge in der **richtigen** Reihenfolge eintragen; zu jedem Eintrag geht auch ein **🖼 Bild** (mit oder ohne Text) | Einträge ziehen oder mit ▲ ▼ in die richtige Reihenfolge bringen (sie erscheinen gemischt) |
| **▭ Lückentext** | Text schreiben, Lücken in `[[doppelte eckige Klammern]]` setzen | Lücken ausfüllen |
| **# Zahl** | richtige Zahl, optional erlaubte Abweichung (±) und Einheit | eine Zahl eintippen, Komma oder Punkt |
| **🎯 Klick ins Bild** | Bild wählen, richtige Bereiche ins Bild setzen (siehe unten) | im Bild auf die richtige Stelle klicken |
| **📊 Umfrage** | Antwortmöglichkeiten (oder freier Text), kein Richtig/Falsch | Meinung abgeben, **Absenden** |
| **🔀 Antwort-Pool** | wie Multiple-Choice, aber mehr Antworten eintragen und festlegen, wie viele **jeweils gezeigt** werden | bei jedem Aufruf eine neue Auswahl – alle richtigen davon wählen |
| **✍ Freitext** | Frage und **Musterlösung** schreiben | Antwort frei aufschreiben, Musterlösung ansehen, selbst angeben: „hatte ich richtig“ oder „noch nicht“ |
| **▾ Lückentext mit Auswahl** | Text schreiben, je Lücke die Möglichkeiten in `[[ ]]`, getrennt durch einen senkrechten Strich – die richtige mit einem Sternchen `*` davor (Beispiel unten) | je Lücke eine Möglichkeit aus der Liste wählen |
| **🧺 Richtige herausziehen** | Antworten (Text oder Bild) eintragen, die richtigen anhaken; Lösungsfeld unter den Antworten **oder** als Ablagezone auf einem Bild | die passenden Antworten ins Lösungsfeld ziehen oder antippen – falsche bleiben liegen |
| **🔤 Wort aus Buchstaben** | gesuchtes Wort und optional ein **Füllwort** (liefert zusätzliche Buchstaben) | das Wort aus den Buchstaben zusammensetzen (antippen) |
| **✋ Objekt ins Bild ziehen** | Bild wählen, **Stellen** ins Bild setzen, richtige anhaken; optional ein Ziehobjekt und je Stelle ein **Austauschbild** | das Objekt an die richtige Stelle ziehen (oder die Stelle antippen) |
| **▦ Bereiche im Bild wählen** | Bild wählen (oder nur Teilbilder), Bereiche setzen oder ein **Raster** wählen, richtige anhaken | alle richtigen Bereiche antippen |
| **🔢 Bereiche der Reihe nach** | wie oben; die **Reihenfolge der Liste** (▲ ▼) ist die Lösung | die Bereiche in der richtigen Reihenfolge antippen |

Unter den Fragearten steht im Editor immer ein Satz, wofür die gewählte Art gedacht ist. Fährst du mit der Maus über einen Knopf, steht es dort auch.

**Zahl, Beispiel:** richtige Zahl `12,5`, Abweichung `0,5`, Einheit `cm`. Dann ist alles von 12,0 bis 13,0 richtig. Der Editor zeigt unter den Feldern an, welcher Bereich gilt.

**Klick ins Bild:** Nach **Bild wählen** setzt du die **richtigen Bereiche** wie bei Drag & Drop auf das Bild: **ins Bild klicken** = neuer Bereich, **ziehen** = verschieben, **Ecke ◢** = Größe, **✕** = löschen. Mehrere Bereiche sind möglich. Richtig ist ein Klick, der in einem davon liegt.

**Umfrage:** Zählt nie für das Bestehen und gibt es nur auf Kursseiten (nicht in Übungen und nicht im Abschlusstest). Mit **Vorlage: Skala mit 5 Stufen** bekommst du sofort „trifft voll zu … trifft gar nicht zu“. Die Antworten der Lernenden stehen in Moodle in der SCORM-Aktivität unter **Berichte → Interaktionen**.

**Antwort-Pool:** Trag deutlich mehr Antworten ein, als gezeigt werden – am besten mehrere richtige und mehrere falsche. Jede Antwort muss für sich allein verständlich sein, denn nie sind alle gleichzeitig zu sehen. Mindestens eine richtige ist immer dabei.

**Freitext:** Es gibt keine automatische Bewertung – die Lernenden vergleichen selbst mit der Musterlösung. Darum steht der Freitext **nicht im Abschlusstest** zur Wahl. In Übungen passt er gut (wie eine Karteikarte). Beim Export als Moodle-XML wird daraus eine Moodle-Freitext-Aufgabe mit der Musterlösung als Bewertungshinweis.

**Lückentext mit Auswahl, Beispiel:** `Der Notruf ist die [[*112|110|116 117]].` – die Lernenden sehen eine Auswahlliste mit „110“, „112“ und „116 117“ (gemischt). Sind mehrere Möglichkeiten richtig, bekommt jede ein Sternchen `*`. Unter dem Textfeld zeigt der Editor für jede Lücke, was als richtig gilt.

**Wort aus Buchstaben:** Gut für Abkürzungen und Fachbegriffe. Die Buchstaben erscheinen in Großbuchstaben und gemischt. Das Füllwort wird nie angezeigt – es macht nur den Pool größer, damit man die Lösung nicht einfach ablesen kann.

**Objekt ins Bild ziehen:** Ein Austauschbild sollte genau so groß sein wie das Bild und das Ergebnis zeigen (z. B. das Objekt an genau dieser Stelle). Ohne Austauschbild bleibt das Objekt einfach dort liegen. Ohne eigenes Ziehobjekt ziehen die Lernenden eine Markierung 📍.

**Bereiche im Bild:** Statt jeden Bereich einzeln aufzuziehen, gibt es fertige **Raster** (4 × 4, 4 × 3, 4 × 2, 3 × 3, 2 × 2 und drei Raster mit einer großen Szene darüber). Jeder Bereich kann ein eigenes **Teilbild** bekommen – so stellst du z. B. vier Bilder zur Wahl. **Inaktive** Bereiche (grau) zählen nicht als Antwort, sie tragen nur ein Bild, z. B. die große Szene. Ohne eigenes Bild ist der Hintergrund eine leere Fläche, die Teilbilder füllen dann die Bereiche.

**Drag & Drop gibt es in zwei Varianten:**
- **Felder mit Überschrift:** z. B. „Obst“ und „Gemüse“. Die Begriffe werden in die passende Spalte gezogen.
- **Felder auf einem Bild:** Unter *Felder (Ziele)* **„Felder auf einem Bild“** wählen, dann **Bild wählen**. Ist schon ein *Bild zur Frage* gewählt, nimmt das Studio dieses Bild. Danach platzierst du die Felder direkt auf dem Bild:

  | Was | So geht's |
  |---|---|
  | neues Feld | **ins Bild klicken** (oder **＋ Feld**) |
  | verschieben | Feld mit der Maus **ziehen** |
  | Größe ändern | gelbe **Ecke ◢** unten rechts ziehen. Jedes Feld kann eine eigene Größe haben. |
  | löschen | rotes **✕** am Feld |
  | alle gleich groß | Regler *Breite* / *Höhe* unter dem Bild |

  Danach jedem Begriff sein Feld zuordnen. Die Vorschau rechts zeigt die Felder genau so, wie die Lernenden sie sehen.
- In beiden Varianten gilt: Begriffe mit **„keinem Feld (Ablenker)“** gehören nirgends hin und sollen liegen bleiben.

**Lückentext, Beispiele:**
- `Der Notruf ist die [[112]].`
- `[[Puls|Herzschlag]]`: Beide Schreibweisen gelten als richtig.
- Groß-/Kleinschreibung wird nur beachtet, wenn du das Häkchen setzt.

Jede Frage kann ein **Bild zur Frage** und eine **Rückmeldung** bekommen, z. B. eine Erklärung, die nach dem Antworten erscheint. Solange etwas fehlt, zeigt der Editor gelb an, was noch nicht fertig ist.

---

## 11. Bilder, Videos, Ton und Dateien

Alle Medien liegen im Kursordner:

| Ordner | Inhalt |
|---|---|
| `medien/bilder` | Bilder |
| `medien/videos` | Videos |
| `medien/audio` | Tonaufnahmen |
| `medien/dateien` | Dateien zum Herunterladen, z. B. PDF |

Ins Lernpaket kommen nur die Dateien, die wirklich verwendet werden.

**Erlaubte Dateitypen (Sicherheit):**
- Bilder: JPG, PNG, GIF, WebP
- Videos: MP4, WebM
- Ton: MP3, M4A, WAV, OGG
- Downloads: PDF, Word, Excel, PowerPoint, OpenOffice, TXT, CSV

HTML-, SVG-, Skript- und Programmdateien sowie ZIP-Archive nimmt das Studio nicht an.

**Keine Bilder oder Videos von Internet-Adressen:** Alles muss im Kursordner liegen. Einzige Ausnahme sind YouTube-Videos über **▶ YouTube**.

**Bild wählen** (bzw. Video, Audio, Datei) öffnet eine Galerie:
- Eine vorhandene Datei anklicken.
- Eine neue Datei hineinziehen oder **vom Computer wählen**. Das Studio kopiert sie **sofort** mit einem sicheren Namen in den Ordner (`Übung Nr 2.JPG` → `uebung-nr-2.jpg`).
- **😊 Bildkarte aus Emoji** (nur bei Bildern): Emoji aussuchen, auf Wunsch einen Text dazuschreiben, Hintergrundfarbe (auch **durchsichtig**, z. B. für ein Ziehobjekt) und Format wählen. Rechts siehst du sofort die fertige Karte. **✓ Bildkarte speichern und verwenden** legt sie als PNG unter `medien/bilder` ab. So lassen sich z. B. Teilbilder für „Bereiche im Bild wählen“ in einer Minute bauen.
- **Große Bilder werden automatisch verkleinert**, standardmäßig auf 1600 Pixel an der längsten Seite. Das spart viel Platz im Lernpaket. Den Wert stellst du unter **🖼 Medien** oder in den Studio-Einstellungen ein (0 = nie verkleinern).

Bilder bitte immer über die Knöpfe einfügen, nicht per `Strg + V`. Nur dann landen sie im Ordner.

**Empfehlungen:**
- Bilder etwa 840 × 630 Pixel, Kopfbilder etwa 1600 × 600.
- Videos als MP4 in 720p, Ton als MP3.

---

## 12. Speichern und Vorschau

**💾 Speichern** (`Strg + S`) schreibt alle geänderten Seiten, `kurs.json` und `fragen.json` (bei Übungen `uebung.json`).

- **Automatisch speichern:** In den **Studio-Einstellungen** (unten unter ⚙ Kurs bzw. ⚙ Übung) trägst du ein, alle wie viele Minuten das Studio von selbst speichert. 0 = aus. Während ein Fragen-Editor offen ist, wartet das Studio damit.
- **Beim ersten Speichern nach dem Öffnen** legt das Studio vorher automatisch eine **Sicherung** an (Kapitel 17).
- **↶ Schritt zurück / ↷ Schritt vorwärts** (oben neben Speichern, `Strg + Z` / `Strg + Y`, solange kein Textfeld angeklickt ist): nimmt die letzten Änderungen am Lernpaket zurück bzw. holt sie wieder. Das gilt für Texte, neue, gelöschte oder verschobene Seiten und Module, Fragen und Einstellungen. Zusammenhängendes Tippen zählt als ein Schritt. Nicht zurückgenommen werden Mediendateien (z. B. gelöschte Bilder unter 🖼 Medien) und ein Layoutwechsel. Im Textfeld selbst gilt weiter dessen eigenes ↶ ↷.
- **📁 Speichern unter …** (`Strg + Umschalt + S`) speichert den Kurs bzw. die Übung mit allen Seiten, Fragen und Medien in einen **anderen, leeren Ordner**. Im Auswahlfenster legst du ihn mit **Neuer Ordner** an, z. B. unter `Kurse`. Danach arbeitest du im neuen Ordner weiter. Der bisherige Ordner bleibt so, wie er zuletzt gespeichert wurde, mit seinen Sicherungen. Ungespeicherte Änderungen landen nur im neuen Ordner.
  - **Als eigenes, neues Lernpaket führen** (Häkchen im Fenster): Die Kopie bekommt eine **neue Kennung für Moodle**. Das brauchst du, wenn daraus eine eigene Moodle-Aktivität wird, z. B. eine abgewandelte Fassung für eine andere Zielgruppe. **Ohne Häkchen** bleibt es dasselbe Lernpaket. Lädst du es in Moodle bei der bestehenden Aktivität hoch, behalten alle ihren Fortschritt.
  - Browser ohne Ordnerzugriff (z. B. Firefox) sichern stattdessen **als eine Datei** (Kapitel 16).
- **👁 Vorschau** (auf jeder Seite) zeigt die Seite so, wie sie im Kurs aussieht, mit funktionierenden Fragen.
- **📦 Lernpaket → 👁 Ganzen Kurs ansehen** zeigt den kompletten Kurs mit Übersicht und Fortschritt.

Wenn nichts erscheint: Pop-ups für die Datei erlauben (Symbol rechts in der Adresszeile).

---

## 13. Übungen nach dem Leitner-Prinzip

Eine **Übung** ist ein Fragenpool. Jede Frage muss mehrmals **hintereinander** richtig beantwortet werden. Falsch beantwortete Fragen kommen öfter dran, richtig beantwortete seltener. Das ist das Prinzip der Lernkartei nach Sebastian Leitner – hier mit allen Fragearten außer der Umfrage.

### Neue Übung anlegen
1. Einen leeren Ordner anlegen, z. B. `Uebungen\Erste-Hilfe-Uebung`.
2. **🧠 Neue Übung** → Titel → Layout (bestimmt die Farben) → Ordner wählen.
3. Links erscheint die **Fragenliste**, rechts der Fragen-Editor. Mit **＋ Frage hinzufügen** eine Frage anlegen, ausfüllen und speichern.

### Links in der Übung
| Eintrag | Inhalt |
|---|---|
| **⚙ Übung** | Titel, Einleitung, *so oft richtig* (z. B. 3×), *bestanden ab* (z. B. 80 %), *Fragen pro Person* (z. B. 50 aus 400), Mischen, Lösung zeigen, Zurücksetzen erlauben, **Test-ID und Schlüssel** |
| **📥 Fragen importieren / sichern** | Fragen aus **Moodle-XML**, **GIFT** oder einem **bisherigen Leitner-Lernpaket** übernehmen; den Fragenpool als Moodle-XML sichern |
| **Werkzeuge** | wie beim Kurs (Kapitel 17) |
| **Fragenliste** | mit Suchfeld; ⚠ = Frage unvollständig (kommt nicht ins Lernpaket) |

### Bestehenden Leitner-Test übernehmen
1. Eine neue Übung anlegen.
2. **📥 Fragen importieren** → das zuletzt hochgeladene Leitner-Lernpaket (.zip) hineinziehen.
3. Die Frage „Auch seine Einstellungen übernehmen?“ mit **OK** beantworten. Damit sind Test-ID und Schlüssel übernommen.
4. Speichern, Lernpaket erstellen und in Moodle die Paketdatei **ersetzen**. Der Lernfortschritt bleibt erhalten.

### Import aus Moodle
| Moodle-Fragetyp | wird zu |
|---|---|
| Multiple-Choice | Single-/Multiple-Choice |
| Wahr/Falsch | Wahr / Falsch |
| Numerisch (eine Zahl, evtl. mit Toleranz) | Zahl |
| Zuordnung | Drag & Drop mit Feldern |
| Lückentext (Cloze mit Kurzantworten), „Drag and drop into text“, „Select missing words“ | Lückentext |

Andere Fragetypen werden übersprungen. Das Studio sagt dir, welche.

---

## 14. Layouts: wählen, wechseln, neu hinzufügen

**Alle Standard-Layouts sind im Programm eingebaut.** Sie haben denselben Aufbau, nur die Hauptfarbe ist verschieden:

| Layout | Hauptfarbe (sRGB) |
|---|---|
| **Ozeanblau** (Standard) | 31 \| 95 \| 191 |
| **Nachtblau** | 30 \| 58 \| 95 |
| **Waldgrün** | 47 \| 111 \| 62 |
| **Bernstein** | 180 \| 83 \| 9 |
| **Weinrot** | 143 \| 29 \| 58 |
| **Violett** | 109 \| 40 \| 217 |
| **Schiefer** | 71 \| 85 \| 105 |
| Kompakt Hell | Beispiel für einen anderen Aufbau (Petrol) |

Passt keine dieser Farben zu deiner Einrichtung? Mit dem Assistenten weiter unten erzeugst du in einer Minute ein Layout in deiner eigenen Hauptfarbe.

**Schmuckfarben:** Flächen, Linien und Rahmen kommen in allen Standard-Layouts aus denselben drei ruhigen Blaugrau-Tönen, jeweils voll oder aufgerastert mit 56 % bzw. 13 %:
- Schmuckfarbe 1: sRGB 198 | 214 | 222
- Schmuckfarbe 2: sRGB 166 | 184 | 195
- Schmuckfarbe 3: sRGB 100 | 123 | 138

**Lesbarkeit:** Das Studio prüft bei jedem Layout den Kontrast. Ist die Hauptfarbe für Schrift zu hell oder auf dunklem Grund zu dunkel, nimmt es dort automatisch eine etwas dunklere bzw. hellere Variante. Ein Beispiel: Bei der Hauptfarbe #2F84B0 (ein helles Blau) wird für Überschriften #2D7EA8 verwendet.

### Neues Layout erstellen (Assistent)
1. Links auf **🎨 Layout** klicken (oder auf der Startseite **Layouts verwalten**).
2. Unter **Neues Layout erstellen** einen **Namen** und die **Hauptfarbe** eingeben, z. B. `0 | 94 | 146`. Alternativ die Farbe mit dem Farbfeld wählen.
3. Das Studio zeigt sofort alle berechneten Farben mit Kontrastwerten.
4. **👁 Beispielseite** zum Ansehen, dann **✔ Erstellen und in die Liste aufnehmen**. Das Layout steht danach bei neuen Kursen und unter *Für diesen Kurs verwenden* zur Wahl.
5. **⬇ Als Datei speichern**, wenn das Layout für alle Rechner fest eingebaut werden soll. Dazu die Datei in den Ordner `Quellen\Layouts` legen und `Quellen\werkzeuge\bauen.ps1` ausführen (Kapitel 22).

> Ein selbst erstelltes Layout ist zunächst nur in diesem Browser gespeichert (und in jedem Kursordner, der es verwendet). Für andere Rechner: Datei speichern und weitergeben bzw. fest einbauen.

**Bestehende Kurse** behalten ihr bisheriges Aussehen, bis du unter 🎨 Layout **„Diese Fassung übernehmen“** wählst und speicherst.

Links auf **🎨 Layout** klicken. Für jedes Layout gibt es diese Knöpfe:

| Knopf | Wirkung |
|---|---|
| **👁 Beispielseite** | zeigt eine Beispielseite in diesem Layout |
| **✔ Prüfen** | kontrolliert, ob das Layout alle Regeln erfüllt |
| **⬇ Datei** | lädt die Layout-Datei herunter |
| **Für diesen Kurs / diese Übung verwenden** | wechselt das Layout |
| **Aus Liste entfernen** | vergisst das Layout |

**Layout eines Kurses wechseln:**
1. Unter **🛟 Sicherungen** auf **Jetzt sichern** klicken.
2. **Für diesen Kurs verwenden**.
3. **💾 Speichern.** Alle Seiten werden neu erstellt. Texte, Bilder, Fragen und Schritte bleiben erhalten.

**Neues Layout mit anderem Aufbau** (nicht nur andere Farbe):
1. Die Layout-Datei nach den Regeln in `Quellen\Layouts\LAYOUT-FORMAT.md` schreiben – oder schreiben lassen, z. B. von einem KI-Assistenten: *„Erstelle nach LAYOUT-FORMAT.md ein neues Layout für …“*.
2. Die Datei unter **🎨 Layout** in das Feld **„Neues Layout hinzufügen“** ziehen.
3. Das Studio prüft die Datei automatisch.
4. Soll das Layout für alle fest eingebaut sein, die Datei in den Ordner `Quellen\Layouts` legen und `Quellen\werkzeuge\bauen.ps1` ausführen (Kapitel 22).

**Ein Layout verbessern:** In der Datei die `version` erhöhen und neu laden. Bei Kursen mit der alten Fassung erscheint dann **„Diese Fassung übernehmen“**.

---

## 15. Lernpaket für Moodle erstellen

1. Links auf **📦 Lernpaket erstellen** klicken. Das Studio prüft:
   - beim Kurs: Module, Seiten, Fragen und Medien
   - bei der Übung: wie viele Fragen vollständig sind
   - Größe des Pakets und fehlende Dateien
   Tipp: Vorher **🩺 Prüfung & Statistik** öffnen (Kapitel 17).
2. Beim Kurs die **Art wählen**: ein Paket für den ganzen Kurs (empfohlen) oder eins pro Modul.
3. Optional **👁 ansehen**, dann **📦 Lernpaket erstellen und speichern** → Speicherort wählen.
4. In Moodle:
   - **neu:** *Aktivität anlegen → Lernpaket (SCORM)* → ZIP hochladen
   - **Änderung:** SCORM-Aktivität → *Einstellungen* → *Paketdatei* ersetzen. **Der Fortschritt bleibt erhalten.**
   - **Offline (Moodle-App):** „Paketdownloads schützen“ ausschalten

**Größen:**
- Wie groß ein Lernpaket höchstens sein darf, legt euer Moodle fest. Im Zweifel dort nachfragen, wer das Moodle betreut.
- Ab 500 MB weist das Studio auf den Offline-Download hin.
- Über 4 GB passt es nicht in ein Paket. Dann „ein Paket pro Modul“ wählen.

**Fester Rahmen am Computer:** Am Computer und auf dem Tablet bleibt der Rahmen einer Seite stehen: die Leiste oben, die Kopfzeile mit Titel, die Schritt-Knöpfe und „Zurück“/„Weiter“. Ist ein Schritt länger als der Platz, rollt nur sein Inhalt. Sobald man darin nach unten rollt, wird der Titelbereich flacher (ohne Einleitung). Beim nächsten Schritt ist er wieder vollständig da. Auch das gilt für alle Layouts. In Übersicht und Abschlusstest rollt die Seite wie gewohnt.

**Handy und Tablet:** Das Lernpaket passt sich von selbst an die Bildschirmgröße an. Dafür musst du nichts einstellen, es gilt für alle Layouts.
- Die Leiste oben bleibt einzeilig. Auf dem Handy zeigt sie nur Zeichen (☰, 🔊, ‹ ›), der Fortschritt ist ein dünner Strich darunter.
- Schritt-Knöpfe, die am Computer links neben dem Inhalt stehen, rücken auf dem Handy als Reihe über den Inhalt. Reiter stehen in einer Zeile, die man seitlich wischen kann.
- „Zurück“ und „Weiter“ stehen nebeneinander.
- Breite Tabellen rollen für sich, Bilder und Videos werden nie breiter als der Bildschirm.
- Nach dem Blättern springt die Ansicht an den Anfang der Seite, auch in der Moodle-App.

Ältere Pakete bekommen das erst, wenn du sie neu erstellst und in Moodle ersetzt.

---

## 16. Kurs-Einstellungen: Ablauf, Abschluss, Teilnahmebestätigung

Links auf **⚙ Kurs** klicken.

| Bereich | Einstellung | Wirkung im Lernpaket |
|---|---|---|
| Allgemein | Kurstitel, Kategorie-Zeile, Einleitungstext | Kopf der Kursübersicht |
| | *Abgeschlossen ab … %* | Anteil der Seiten, die angesehen sein müssen |
| | **Kursbild** | großes Bild im Kopf der Kursübersicht |
| | **Kurs-ID** | siehe unten |
| Ablauf und Abschluss | **Module der Reihe nach freischalten** | Ein Modul öffnet sich erst, wenn das vorherige ganz angesehen ist. Gesperrte Module zeigen 🔒. |
| | **Bestanden erst ab … % richtiger Fragen** | Zusätzlich zu den Seiten muss dieser Anteil aller Fragen richtig beantwortet sein. 0 = Fragen zählen nicht. Moodle bekommt dann den Fragen-Anteil als Bewertung. |
| | **Teilnahmebestätigung zum Drucken** | Nach dem Abschluss erscheint der Knopf **🎓 Teilnahmebestätigung** mit Name (aus Moodle), Kurstitel und Datum. Optional mit Zusatztext und Aussteller. Ausdrucken oder als PDF speichern. |
| Studio-Einstellungen | Automatisch speichern, Bilder verkleinern | gelten nur auf diesem Computer |

Bei jedem **Modul** gibt es zusätzlich **Kurzbeschreibung** und **Lerndauer**. Beides erscheint auf der Modul-Karte in der Kursübersicht (*„⏱ ca. 12 Min.“*).

**Kurs-ID** (bei Übungen: Test-ID und Schlüssel): Moodle behält die Speicherstände beim Ersetzen nur, wenn diese Werte gleich bleiben.
- **Neue Kurse/Übungen:** Die Werte entstehen automatisch.
- **Vorhandene Kursordner:** Die ID steht schon in `kurs.json`.
- **Ältere Pakete ohne Studio-Ordner:** **„… aus bisherigem Lernpaket übernehmen“** nutzen.

> **Achtung bei laufenden Kursen:** Wer *Module der Reihe nach* oder *Bestehen über Fragen* nachträglich einschaltet, verändert die Regeln für alle, die schon angefangen haben. Bereits Gesehenes bleibt aber erhalten.

**Kurs weitergeben oder archivieren:** Unter ⚙ Kurs (bzw. ⚙ Übung) gibt es **⬇ Kurs als eine Datei sichern**. Das packt den ganzen Ordner (Seiten, Fragen, Medien, Layout) in eine Datei `….kurs.zip`. Laden geht über die Startseite → **📦 Aus Datei laden**. Das ist **nicht** das Lernpaket für Moodle.

### Abschlusstest

Ein Test am Ende des Kurses, wie in Moodle-Tests oder iSpring: Fragen aus einem **Fragenpool**, zufällig gezogen, mit **Bestehensgrenze** und **Versuchen**. Links unter den Modulen auf **🏁 Abschlusstest** klicken.

1. **Abschlusstest im Lernpaket verwenden** anhaken.
2. Einstellungen wählen (siehe Tabelle). Darunter steht in einem grünen Kasten in einem Satz, **wie es die Lernenden erleben**.
3. Fragen in den Pool bringen:
   - **＋ Neue Frage**: derselbe Fragen-Editor wie auf den Kursseiten (alle Fragearten außer Umfrage und Freitext)
   - **📋 Aus Kursseiten übernehmen**: Fragen von den Seiten ankreuzen, sie werden als **Kopie** übernommen
   - **📥 Importieren**: Moodle-XML oder GIFT (z. B. aus einer Moodle-Fragensammlung)
4. **👁 Test ausprobieren** öffnet die Vorschau direkt beim Test.
5. **💾 Speichern**, dann wie gewohnt **📦 Lernpaket erstellen**.

| Einstellung | Bedeutung |
|---|---|
| **Fragen pro Versuch** | so viele Fragen werden zufällig aus dem Pool gezogen. 0 = alle. Tipp: mehr Fragen im Pool als pro Versuch, dann sieht jeder Versuch anders aus. |
| **Bestanden ab … % richtig** | z. B. 80 % bei 10 Fragen = mindestens 8 richtig |
| **Anzahl Versuche** | 0 = unbegrenzt. Ein Versuch zählt, sobald er gestartet ist. |
| **Rückmeldung** | **Erst am Ende** (wie eine Prüfung: danach eine Liste mit ✓/✗ je Frage) oder **nach jeder Frage** (mit Lösung, eher zum Üben) |
| **Erst freischalten, wenn alle Module abgeschlossen sind** | Vorher zeigt die Testkarte 🔒. In der Vorschau des Studios ist der Test immer offen. |

**So erleben es die Lernenden:** In der Kursübersicht steht unter den Modulen die Karte **🏁 Abschlusstest** mit dem Stand (z. B. *„noch nicht bestanden – bestes Ergebnis 60 % · noch 1 Versuch“*). Sind die Module fertig, führt auch der große Knopf oben direkt zum Test. Jede Frage wird mit **Antwort abgeben** beantwortet. Eine abgegebene Antwort lässt sich nicht mehr ändern. Am Ende stehen Prozent, *bestanden / nicht bestanden* und die Liste der Fragen.

**Was Moodle bekommt:**
- **Bewertung** = bestes Testergebnis in Prozent (in Moodle bei *Bewertungsmethode* „Höchste Bewertung“ wählen)
- **Status** = *bestanden*, wenn Test bestanden **und** die nötigen Seiten angesehen. *Nicht bestanden*, wenn alle Versuche verbraucht sind.
- **Ergebnis jeder Frage** (auch der Fragen auf den Kursseiten und der Umfragen): in der SCORM-Aktivität unter **Berichte → Interaktionen**

> Der Test ist nur im **Lernpaket für den ganzen Kurs** enthalten, nicht in den Paketen pro Modul. Die Lösungen stehen wie bei allen Fragen nur als Prüfsumme im Lernpaket.

---

## 17. Werkzeuge

Links unter **WERKZEUGE**. Diese Einträge gibt es bei Kursen und bei Übungen.

### 🩺 Prüfung & Statistik
Prüft den ganzen Kurs auf einen Klick und zeigt **Zahlen**: Module, Seiten, Schritte, Wörter, **geschätzte Lerndauer** (150 Wörter pro Minute plus 1 Minute je Video und Frage), Fragen nach Art und Größe der Medien.

Die Liste darunter ist nach Wichtigkeit sortiert:

| Zeichen | Bedeutung | Beispiele |
|---|---|---|
| ⛔ Fehler | sollte vor dem Hochladen behoben werden | Datei fehlt, Frage unvollständig, Seite ohne Titel, „Bestehen über Fragen“ ohne Fragen |
| ⚠ Warnung | besser beheben | leerer Schritt, sehr großes Bild, unsicherer Link (`http://`), Link ohne Text |
| ℹ Hinweis | zur Kenntnis | Bild ohne Bildbeschreibung, sehr langer Schritt (über 350 Wörter), unbenutzte Medien |

Mit **öffnen →** springst du direkt an die Stelle.

### 🖼 Medien
Alle Dateien im Kursordner nach Art (Bilder, Videos, Audio, Dateien), mit Größe und **wo sie verwendet werden**.
- **⇄ ersetzen:** neue Datei unter demselben Namen ablegen. Alle Stellen im Kurs zeigen sofort die neue Fassung, z. B. ein aktualisiertes Foto.
- **🗑** (nur bei unbenutzten Dateien) bzw. **Alle unbenutzten in den Papierkorb:** räumt auf. Die Dateien landen in `medien/.papierkorb` und lassen sich unten mit **zurückholen** wiederherstellen.
- **Vorhandene große Bilder jetzt verkleinern:** verkleinert alle Bilder über der eingestellten Pixelzahl.
- Ein Klick auf den Dateinamen zeigt die Datei groß an.

### 🔎 Suchen & Ersetzen
Durchsucht Kurstitel, Modultitel und -beschreibungen, Seitentitel, Einleitungen, Schritt-Überschriften, **alle Texte** und **alle Fragen** (Fragetext, Antworten, Begriffe, Lückentext, Rückmeldung).
- Optionen: *Groß-/Kleinschreibung beachten*, *nur ganze Wörter*
- Jeder Treffer zeigt eine Textstelle mit Markierung, **ersetzen** (nur hier) und **öffnen →**.
- **Alle ersetzen** ersetzt alles auf einmal. Danach **💾 Speichern**.

Tipp: Vorher unter 🛟 Sicherungen **Jetzt sichern**.

### 🖨 Druckansicht
Der ganze Kurs (bzw. der ganze Fragenpool) auf einer langen Seite, zum **Korrekturlesen**, zum Abstimmen mit Fachleuten oder **als PDF**.
- *Lösungen zeigen*: richtige Antworten ✔ in Grün, Lücken ausgefüllt, Zuordnungen, Rückmeldungen. **Diese Fassung nicht an Lernende geben.**
- *Bilder zeigen* und *Dateinamen zeigen* lassen sich abschalten.
- Im neuen Fenster auf **🖨 Drucken / als PDF speichern** klicken. Für ein PDF wählst du im Druckfenster als Drucker **„Als PDF speichern“**.

### 🛟 Sicherungen
Frühere Stände des Kurses, falls einmal etwas schiefgeht.
- **Was wird gesichert?** Alle Seiten, `kurs.json`, `fragen.json` und das Layout (bei Übungen `uebung.json`) im Ordner `.sicherungen`. **Medien werden nicht gesichert**, weil sie zu groß wären. Gelöschte Medien liegen ohnehin im Papierkorb.
- **Automatisch:** beim ersten Speichern nach dem Öffnen (die letzten 15 bleiben erhalten) und vor jedem Wiederherstellen.
- **Jetzt sichern:** vor größeren Umbauten, mit einer kurzen Notiz.
- **↺ wiederherstellen:** holt den alten Stand zurück. Der aktuelle Stand wird vorher ebenfalls gesichert, damit nichts verloren geht.

---

## 18. Zusammenarbeit mit VS Code

Studio und VS Code arbeiten mit **denselben Dateien**:
- **Studio:** Struktur, Inhalte, Fragen, Layout, Werkzeuge, Lernpaket
- **VS Code:** schnelle Tippfehler direkt im Code

Die Anleitung dafür findest du unter **? Hilfe → [Seiten in VS Code bearbeiten](Seiten_in_VS_Code_bearbeiten.md)**. Neue Bausteine in VS Code: `lm-warnung`, `lm-aufklapp`, `lm-linie`, `lm-audio`, `lm-datei`. Ordner `.sicherungen` und `.papierkorb` werden bei der VS-Code-Suche übersprungen.

Regel: erst im einen Programm speichern, dann im anderen weitermachen.

---

## 19. Gut zu wissen und Grenzen

- **Seiten ohne Layout-Aufbau** (🔒) kann das Studio verschieben und ins Paket packen, aber nicht bearbeiten.
- **Fragen** nur im Studio bearbeiten. In VS Code den Bereich `data-frage` nicht verändern.
- **Andere Browser (z. B. Firefox):** Ordner auf die Startseite ziehen. Zum Sichern oben auf **⬇ Als Datei sichern** klicken.
- **Mehrere Personen:** Immer nur eine Person gleichzeitig am selben Ordner arbeiten lassen.
- **Sicherungen** ersetzen keine echte Datensicherung (z. B. Netzlaufwerk). Den Kursordner regelmäßig zusätzlich kopieren.
- **Sicherheit:** Das Studio lädt nichts aus dem Internet und sendet keine Daten. Einzige Ausnahme sind YouTube-Videos, die du selbst einbettest: Beim Abspielen verbindet sich der Browser mit YouTube. Fremde Dateien (Importe, Layouts, Lernpakete) werden entschärft. Ob die Programmdateien unverändert sind, zeigen die Prüfsummen in `Quellen\PRUEFSUMMEN.txt`. Alle Details stehen unter **? Hilfe → [Sicherheit](Sicherheit.md)**.

---

## 20. Häufige Fragen und Probleme

| Problem | Lösung |
|---|---|
| **„Öffnen“ geht nicht** | Chrome oder Edge verwenden |
| **„weder ein Kurs noch eine Übung“** | den richtigen Ordner wählen (den mit `seiten` bzw. `uebung.json`) |
| **Browser fragt jedes Mal nach Erlaubnis** | Das ist normal und dient der Sicherheit. |
| **Vorschau zeigt keine Bilder** | Studio neu laden (F5) |
| **Frage lässt sich nicht übernehmen** | Der Editor zeigt gelb an, was fehlt (z. B. keine richtige Antwort markiert). |
| **Lernende kommen nicht weiter** | Eine Pflichtfrage ist noch nicht richtig beantwortet. Das ist gewollt. Die Pflicht kann im Fragen-Editor abgewählt werden. |
| **Modul ist gesperrt (🔒)** | *Module der Reihe nach* ist eingeschaltet. Erst das vorherige Modul ganz ansehen. |
| **Kurs gilt nicht als bestanden** | Bei *Bestehen über Fragen* müssen genug Fragen richtig beantwortet sein. Die Übersicht zeigt den Stand. |
| **Etwas kaputt gemacht** | **🛟 Sicherungen** → älteren Stand **wiederherstellen** |
| **Im Kursordner versehentlich etwas gelöscht** | Kurs einfach im Studio öffnen. Es prüft den Ordner und holt Fehlendes aus dem Papierkorb oder der neuesten Sicherung zurück (`kurs.json`, `fragen.json`, Seiten, Layout-Kopie). Unter ⚙ Kurs steht, was repariert wurde. Gelöschte Bilder meldet **🩺 Prüfung**. |
| **Programmdatei weg oder kaputt** | Die Programmdatei noch einmal von dort holen, wo du sie bekommen hast, oder aus einer eigenen Sicherungskopie. Sie funktioniert für sich allein. |
| **Kurs an jemand anderen geben** | ⚙ Kurs → **⬇ Kurs als eine Datei sichern**. Die andere Person: Startseite → **📦 Aus Datei laden**. |
| **Kopie eines Kurses als Ausgangspunkt** | **📁 Speichern unter …** → leeren Ordner wählen. Soll die Kopie in Moodle eine eigene Aktivität werden, das Häkchen **Als eigenes, neues Lernpaket führen** setzen (Kapitel 12). |
| **Lernpaket zu groß** | **🖼 Medien** → *große Bilder verkleinern*, unbenutzte Dateien aufräumen |
| **Übung: Frage fehlt im Lernpaket** | Die Frage ist unvollständig (⚠ in der Liste). |
| **Layout-Datei wird nicht aufgenommen** | Die Prüfung zeigt, welche Regel fehlt (✘). Die Datei danach berichtigen (Regeln: `Quellen\Layouts\LAYOUT-FORMAT.md`). |
| **Fortschritt nach Update verloren** | Wurde die Kurs-ID bzw. Test-ID/Schlüssel geändert? Den alten Wert wieder eintragen und das Paket neu ersetzen. |

---

## 21. Version, Ersteller, KI-Hinweis

- **Version:** steht oben links neben dem Namen des Studios (z. B. `v3.47.0`). Ein Klick darauf zeigt die **Versionsgeschichte**. So siehst du immer, ob du die aktuelle Fassung verwendest.
  - Neue Fassungen bekommen eine höhere Nummer.
  - Die Version steht auch in jeder gespeicherten `kurs.json` / `uebung.json` (`studioVersion`) und unsichtbar in jedem Lernpaket.
- **Ersteller:** *Sven-Michael Kern*, unten rechts in der Statusleiste und im Versionsfenster.
- **KI-Hinweis:** Ganz unten rechts steht klein **„mit KI erstellt“**. Wenn man mit der Maus darüberfährt, erscheint: *„Transparenzhinweis: Dieses Programm wurde von Sven-Michael Kern mit Unterstützung künstlicher Intelligenz (Claude, Anthropic) entwickelt.“* Derselbe Hinweis steht im Versionsfenster, im Kopf der Programmdatei und in den Dateien `LIESMICH.txt` und `LIZENZ-HINWEISE.txt`. Das Programm selbst enthält keine künstliche Intelligenz und nutzt keine KI-Dienste.
- **Lizenz:** Das Programm ist **freie Software (Open Source)** unter der **EUPL 1.2**. Du darfst es kostenlos nutzen, weitergeben und verändern. Wer es verändert weitergibt, gibt den Quelltext unter derselben Lizenz mit. **Lernpakete, die du damit erstellst, gehören dir** – für sie gelten keine Lizenzpflichten. Der Lizenztext steht unter **? Hilfe → [Lizenz](Lizenz.md)**.

---

## 22. Für Fortgeschrittene: Was steckt dahinter?

Das Programm ist **eine einzige HTML-Datei**. Sie ist zugleich der lesbare Quelltext: Öffne sie in einem Editor (z. B. VS Code), und du siehst alles, durchgehend erklärt. Einige Bausteine sind darin eingebettet. In lesbarer Form liegen sie im Ordner `Quellen`:

| Datei / Ordner in `Quellen` | Wofür |
|---|---|
| `bausteine\fragen-engine.js` | macht Fragen bedienbar und prüft Antworten über Prüfsummen (steckt im Kurs-Player, im Leitner-Test und in den Vorschauen) |
| `bausteine\pdf-engine\` | PDF.js von Mozilla (fremde Software, Apache-Lizenz 2.0): liest PDF-Dateien für „PDF übernehmen“ |
| `Kurs_SCORM\Vorlage_Kurs.html` | der Kurs-Player (Rahmen des Lernpakets) |
| `Leitner_SCORM\Vorlage.html` | der Leitner-Test |
| `Layouts\` | alle Layout-Dateien, die Grundlage für den Layout-Assistenten und `LAYOUT-FORMAT.md` (Regeln für neue Layouts) |
| `Dokumente\` | diese Anleitung, die VS-Code-Anleitung, die Hinweise zur Sicherheit und die Lizenz (kommen als **? Hilfe** ins Programm) |
| `Lite\Lite-Zusatz.html` | die vereinfachte Oberfläche der Lite-Ausgabe |
| `Marke\` | die Symbole für den Browser-Tab |
| `werkzeuge\bauen.ps1` | bringt Engine, Layouts, Player, Leitner-Test und Hilfe ins Programm, erzeugt die Lite-Ausgabe und schreibt `PRUEFSUMMEN.txt` |
| `LIESMICH.txt` | erklärt den Ordner und das Zusammenbauen |

- **Lernstand:** Der Kurs-Player speichert angesehene Seiten, gelöste Fragen und das Abschlussdatum (für die Teilnahmebestätigung) im Moodle-Lernstand.
- **Seitenaufbau:** unsichtbare Markierungen (`data-lm="…"`). Die Regeln stehen in `Quellen\Layouts\LAYOUT-FORMAT.md`.
- **Neue Bausteine** (Warnung, Aufklappen, Linie, Audio, Datei) sehen ohne eigene Angaben im Layout ordentlich aus. Ein Layout kann sie über `stile` selbst gestalten.
- **Das Programm verändern:** Die Oberfläche und alles, was nicht eingebettet ist, änderst du direkt in `SCORM-AutorenStudio.html`. Einen Baustein änderst du im Ordner `Quellen`. Danach `Quellen\werkzeuge\bauen.ps1` ausführen (Rechtsklick → *Mit PowerShell ausführen*) und testen. `SCORM-AutorenStudio-Lite.html` nie von Hand ändern – die Datei entsteht bei jedem Bauen neu.
- **Eine veränderte Fassung weitergeben:** Vorher `STUDIO_VERSION` im Programm anpassen, die Änderung in der Liste `VERSIONEN` eintragen und deutlich machen, dass es eine veränderte Fassung ist. Den ganzen Ordner mit Lizenz und Quellen weitergeben. So verlangt es die [Lizenz](Lizenz.md).
- **Gemerkte Layouts und Studio-Einstellungen** liegen im Browser-Speicher. Jeder Ordner behält zusätzlich seine Kopie des Layouts in `layout/`.

---

## 23. Wörterbuch

| Wort | Bedeutung |
|---|---|
| **Kursordner / Übungsordner** | Ordner mit allen Dateien eines Kurses bzw. einer Übung |
| **kurs.json / uebung.json** | Steckbrief: Name, ID, Layout, Einstellungen, Reihenfolge bzw. Fragen |
| **fragen.json** | Fragen der Kursseiten mit Lösungen (nicht im Lernpaket) |
| **Pflichtfrage** | muss richtig beantwortet werden, bevor es weitergeht |
| **Leitner-Prinzip** | Lernen mit Fächern: richtig → seltener, falsch → öfter |
| **Prüfsumme (Hash)** | „Fingerabdruck“ der Lösung; die Lösung lässt sich daraus nicht zurückrechnen |
| **Alternativtext / Bildbeschreibung** | kurzer Text, der beschreibt, was auf einem Bild zu sehen ist (für Screenreader) |
| **Sicherung** | Kopie eines früheren Stands im Ordner `.sicherungen` |
| **Papierkorb** | `seiten/.papierkorb` bzw. `medien/.papierkorb`: gelöschte Dateien zum Zurückholen |
| **Layout / Layout-Datei** | bestimmt das Aussehen. Datei `*.layout.html` |
| **Lernpaket / SCORM** | die ZIP-Datei für Moodle |
| **Player** | der Rahmen im Lernpaket: Übersicht, Leiste, Fortschritt, Teilnahmebestätigung |
