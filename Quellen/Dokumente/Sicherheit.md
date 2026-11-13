# Sicherheit und Datenschutz

Diese Seite erklärt in einfachen Worten, was das SCORM-AutorenStudio mit deinen Daten macht, wovor es schützt und wo seine Grenzen liegen.

Das Programm ist freie Software und wird ohne Gewährleistung bereitgestellt (siehe **? Hilfe → Lizenz**). Diese Seite ist eine Beschreibung, keine Zusicherung. Wer das Programm in einer Einrichtung mit besonderen Auflagen einsetzen will, lässt es vorher von der dort zuständigen Stelle prüfen. Der gesamte Quelltext liegt dafür offen.

---

## 1. Das Wichtigste

- **Keine Internetverbindung.** Das Studio lädt nichts aus dem Internet nach und sendet keine Daten: keine Statistik, keine Anmeldung, keine Schriften oder Bibliotheken von fremden Servern. Eine Sicherheitsregel des Browsers (Content-Security-Policy) verbietet dem Programm jede Netzwerkverbindung. Einzige Ausnahme sind YouTube-Videos, die du selbst über den Knopf **▶ YouTube** einbettest.
- **Keine Installation, kein Server, kein Benutzerkonto.** Das Studio ist eine einzelne HTML-Datei, die im Browser läuft.
- **Zugriff nur auf den Ordner, den du freigibst.** Der Browser fragt ausdrücklich, ob das Studio in dem gewählten Ordner Dateien bearbeiten darf. Auf andere Ordner hat es keinen Zugriff.
- **Deine Kurse bleiben bei dir.** Alles liegt als gewöhnliche Dateien in deinem Kursordner.

---

## 2. Welche Daten entstehen im Lernpaket?

Ein Lernpaket speichert in Moodle nur den Lernstand: angesehene Seiten, gelöste Fragen, Punkte und Abzeichen, das Ergebnis des Abschlusstests und das Abschlussdatum. Das geschieht über die übliche SCORM-Schnittstelle von Moodle.

Personenbezogen ist dabei nur der Name, den Moodle übergibt. Er erscheint auf der Teilnahmebestätigung am Bildschirm. Das Lernpaket selbst sendet keine Daten an andere Stellen.

Ohne Moodle (Vorschau im Studio) wird der Lernstand nur im Browser dieses Rechners gemerkt.

---

## 3. Wovor schützt das Studio?

| Gefahr | Schutz |
|---|---|
| Schadcode in fremden Dateien (Importe aus Moodle-XML oder GIFT, fremde Lernpakete, fremde Kursordner, PowerPoint, PDF) | Fremde Inhalte werden nur als Daten gelesen und entschärft: Skripte, Formulare, eingebettete Programme und gefährliche Adressen werden entfernt. Makro-Präsentationen (.pptm) werden abgelehnt. |
| Schadcode in Layout-Dateien | Jedes Layout wird beim Laden geprüft. Erlaubt ist nur das Blättern; Zugriffe auf Netzwerk, Speicher oder andere Fenster werden abgelehnt. |
| Schadcode, der über ein Lernpaket nach Moodle gelangt | Programmcode in Texten wird beim Speichern und beim Erstellen des Lernpakets entfernt. Titel und Texte werden so geschrieben, dass sie den vorgesehenen Bereich nicht verlassen können. |
| Lösungen der Fragen geraten ins Lernpaket | Ins Lernpaket kommen nur Dateien aus dem Ordner `medien/`. Die Datei mit den Lösungen (`fragen.json`), Sicherungen und der Papierkorb bleiben draußen. Im Paket stehen Lösungen nur als Prüfsumme oder verschleiert. |
| Inhalte von fremden Servern (Nachverfolgung) | Bilder, Videos, Ton und eingebettete Seiten von Internet-Adressen werden gesperrt. Links zum Anklicken bleiben erlaubt. Die Prüfung (🩺) zeigt gesperrte Stellen an. |
| Gefährliche Dateitypen | Hochladen lassen sich nur Bilder (JPG, PNG, GIF, WebP), Videos, Ton und übliche Dokumente (PDF, Office, Text). HTML, SVG, Skripte, Programme und ZIP werden abgelehnt. |
| Übergroße ZIP-Dateien | Beim Einlesen werden höchstens 64 MB entpackt. |

---

## 4. Grenzen – das solltest du wissen

| Grenze | Erklärung | Empfehlung |
|---|---|---|
| **Lösungen sind mit technischem Wissen ermittelbar** | Die Antworten werden im Browser der Lernenden geprüft, ohne Server. Die Lösungen stehen zwar nicht im Klartext im Paket, lassen sich aber herausfinden – bei vier Antworten genügt Ausprobieren. | Für Prüfungen mit Folgen (Noten, Zulassungen) die Moodle-Aktivität **Test** verwenden. Lernpakete dienen dem Lernen. |
| **Der Lernstand lässt sich fälschen** | Bei SCORM meldet der Browser selbst „bestanden“. Wer sich auskennt, kann das manipulieren. Das gilt für jedes SCORM-Paket, gleich aus welchem Programm. | wie oben |
| **Lernpakete laufen in Moodle mit den Rechten der Moodle-Seite** | Ein SCORM-Paket wird von Moodle ausgeliefert und kann dort Programmcode ausführen. | Nur Lernpakete hochladen, deren Herkunft du kennst. Das gilt für alle SCORM-Pakete. |
| **YouTube** | Beim Abspielen eines eingebetteten YouTube-Videos entsteht eine Verbindung zu YouTube/Google. Das Studio verwendet die datensparsame Adresse `youtube-nocookie.com`. | Nur verwenden, wenn das bei euch zulässig ist. Die Prüfung (🩺) zeigt jedes YouTube-Video an. |
| **Gemeinsamer Browser-Speicher** | Alle HTML-Dateien, die du lokal per Doppelklick öffnest, teilen sich im Browser einen Speicher. Dort merkt sich das Studio Einstellungen und selbst hinzugefügte Layouts. | Gemerkte Layouts prüft das Studio bei jedem Start erneut. Wer ganz sichergehen will, nutzt für das Studio ein eigenes Browser-Profil. |
| **Verändertes Programm** | Das Studio ist freie Software – jeder darf es verändern und weitergeben. Eine veränderte Fassung kann sich anders verhalten als hier beschrieben. | Das Programm nur aus einer Quelle beziehen, der du vertraust. In `Quellen\PRUEFSUMMEN.txt` stehen die Prüfsummen (SHA-256) aller Dateien des Originals. |

---

## 5. Empfehlungen

1. Ein aktuelles **Chrome** oder **Edge** verwenden.
2. **Importdateien** (Moodle-XML, GIFT, Lernpakete, Layouts, fremde Kursordner) nur aus bekannten Quellen übernehmen.
3. Vor dem Hochladen nach Moodle **🩺 Prüfung & Statistik** ausführen und Warnungen klären.
4. Die **Sicherungen** im Studio (🛟) ersetzen keine Datensicherung deines Rechners. Den Kursordner regelmäßig zusätzlich sichern.

---

## 6. Hinweis zur Entstehung

Dieses Programm wurde von Sven-Michael Kern mit Unterstützung künstlicher Intelligenz (Claude, Anthropic) entwickelt. Die beschriebenen Schutzmaßnahmen sind im Quelltext nachlesbar und wurden mit automatischen Tests geprüft. Eine unabhängige Sicherheitsprüfung durch Dritte hat nicht stattgefunden.
