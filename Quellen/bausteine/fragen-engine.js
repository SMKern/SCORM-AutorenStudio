/* >>> FRAGEN-ENGINE-ANFANG · Version 1 · Quelle: Quellen/bausteine/fragen-engine.js
   ════════════════════════════════════════════════════════════════════════════
   FRAGEN-ENGINE: macht Fragen in Kursseiten und Übungen bedienbar.
   Wird von werkzeuge/bauen.ps1 automatisch in den Kurs-Player und in die
   Leitner-Vorlage kopiert. Bitte nur in der Quelldatei ändern.

   Fragearten (data-typ):  single (auch Wahr/Falsch mit data-wf="1") · multi ·
   zuordnen (Drag & Drop, auch auf einem Bild) · luecken (Lückentext) ·
   reihenfolge · zahl · bildklick (Klick ins Bild) · umfrage (ohne Richtig/Falsch) ·
   variation (wechselnde Auswahl aus einem Antwort-Pool) · freitext (Musterlösung,
   Selbstkontrolle) · auswahl (Lückentext mit Auswahllisten) · sammeln (richtige
   Antworten in ein Lösungsfeld ziehen, auch auf ein Bild) · buchstaben (Wort aus
   Buchstaben legen) · bildziehen (Objekt an die richtige Stelle im Bild ziehen) ·
   bildwahl (Bereiche im Bild anwählen) · bildfolge (Bereiche der Reihe nach antippen)
   Die richtigen Antworten stehen NICHT im Klartext in der Seite, sondern nur
   als Prüfsumme (Hash). Die Engine prüft eine Antwort, indem sie ihre
   Prüfsumme berechnet und vergleicht.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.FRAGEN) return;

  // ── Texte, die Lernende sehen ──────────────────────────────────────────────
  var T = {
    pruefen: 'Antwort prüfen', nochmal: 'Nochmal versuchen',
    richtig: '<b>Richtig!</b>', falschNochmal: '<b>Noch nicht ganz richtig.</b> Versuch es noch einmal.',
    falsch: '<b>Leider falsch.</b>', loesungIst: 'Richtig wäre:',
    pflicht: 'Pflichtfrage – bitte richtig beantworten, um weiterzumachen.',
    gesperrt: 'Bitte beantworte zuerst die Frage richtig, dann geht es weiter.',
    schonGeloest: '✓ Diese Frage hast du bereits richtig beantwortet.',
    hSingle: 'Wähle eine Antwort.', hMulti: 'Mehrere Antworten können richtig sein. Wähle alle richtigen aus.',
    hZuordnen: 'Ziehe die Begriffe auf die passenden Felder – oder tippe erst einen Begriff und dann ein Feld an.',
    hLuecken: 'Fülle die Lücken aus.', ablage: 'Begriffe', unvollstaendig: 'Bitte zuerst alles ausfüllen bzw. zuordnen.',
    hWahr: 'Ist die Aussage richtig oder falsch?',
    hReihe: 'Bring die Einträge in die richtige Reihenfolge: ziehen oder mit ▲ ▼ verschieben.',
    hZahl: 'Gib eine Zahl ein.', keineZahl: 'Bitte eine Zahl eingeben (z. B. 12,5).',
    hKlick: 'Klicke im Bild auf die richtige Stelle.', erstKlicken: 'Bitte zuerst ins Bild klicken.',
    hUmfrage: 'Deine Meinung ist gefragt – hier gibt es kein Richtig oder Falsch.', hUmfrageMehr: 'Deine Meinung ist gefragt – mehrere Antworten sind möglich.',
    hFrei: 'Schreib deine Antwort in das Feld.', absenden: 'Absenden',
    danke: '<b>Danke!</b> Deine Antwort wurde gespeichert.', schonTeilgenommen: '✓ Du hast hier schon geantwortet. Danke!',
    gespeichert: 'Antwort gespeichert.', platz: 'Platz',
    hFreitext: 'Schreib deine Antwort auf und vergleiche sie dann mit der Musterlösung.', musterZeigen: 'Musterlösung zeigen', muster: 'Musterlösung',
    selbstFrage: 'Stimmt deine Antwort mit der Musterlösung überein?', selbstJa: '✓ Ja, hatte ich richtig', selbstNein: '✗ Nein, noch nicht',
    hAuswahl: 'Wähle für jede Lücke die passende Möglichkeit aus.', bitteWaehlen: '– bitte wählen –',
    hSammeln: 'Ziehe alle passenden Antworten in das Lösungsfeld – oder tippe sie an. Unpassende bleiben liegen.',
    loesungsfeld: 'Lösungsfeld', antwortenPool: 'Antworten', erstSammeln: 'Bitte zuerst mindestens eine Antwort in das Lösungsfeld ziehen.',
    hBuchst: 'Setze das gesuchte Wort aus den Buchstaben zusammen: Buchstaben antippen. Ein Buchstabe in deiner Antwort geht beim Antippen zurück.',
    erstBuchst: 'Bitte zuerst Buchstaben antippen.', zuruecksetzen: '↺ Zurücksetzen',
    hBildziehen: 'Ziehe das Objekt an die richtige Stelle im Bild – oder tippe die Stelle an.', erstZiehen: 'Bitte zuerst das Objekt an eine Stelle im Bild ziehen.',
    hBildwahl: 'Tippe alle passenden Bereiche im Bild an. Noch einmal antippen = abwählen.', erstWaehlen: 'Bitte zuerst mindestens einen Bereich antippen.',
    hBildfolge: 'Tippe die Bereiche in der richtigen Reihenfolge an. Ein nummerierter Bereich geht beim Antippen zurück (mit allen danach).',
    alleFolge: 'Bitte alle Bereiche der Reihe nach antippen.'
  };

  // ── Prüfsumme (cyrb53) – dieselbe Funktion wie im SCORM-AutorenStudio ──────────────
  function h53(str, seed) {
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed, i, ch;
    for (i = 0; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  // Schreibweise vereinheitlichen (Lückentext): Leerzeichen, Groß/klein
  function norm(s, gross) { s = String(s || '').replace(/\s+/g, ' ').trim(); return gross ? s : s.toLowerCase(); }
  // Verschleierte Lösungen (nur zum Anzeigen nach einer falschen Antwort)
  function entschleiern(b64, schluessel) {
    try {
      var roh = atob(b64), aus = '';
      for (var i = 0; i < roh.length; i++) aus += String.fromCharCode(roh.charCodeAt(i) ^ schluessel.charCodeAt(i % schluessel.length));
      return JSON.parse(decodeURIComponent(escape(aus)));
    } catch (e) { return null; }
  }
  function mischen(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(tag, klasse, html) { var e = document.createElement(tag); if (klasse) e.className = klasse; if (html != null) e.innerHTML = html; return e; }
  function alle(w, s) { return Array.prototype.slice.call(w.querySelectorAll(s)); }
  // Text eines Eintrags für die Antwort-Protokollierung; ein Eintrag nur aus Bild liefert dessen Bildtext
  function eintragText(e) { var t = e.textContent.replace(/\s+/g, ' ').trim(); if (t) return t; var i = e.querySelector('img'); return i ? (i.getAttribute('alt') || 'Bild') : ''; }
  function kinderMit(w, attr) { return Array.prototype.filter.call(w.children, function (k) { return k.hasAttribute(attr); }); }

  // ── Aussehen (Farbe kommt aus --hauptfarbe des Lernpakets bzw. Layouts) ─────
  var CSS =
    '.fe-ui{--fe-a:var(--hauptfarbe,#2b5d8a);font-family:inherit;margin-top:10px}' +
    '.lm-frage.fe-aktiv>[data-opts],.lm-frage.fe-aktiv>[data-ziele],.lm-frage.fe-aktiv>[data-begriffe],.lm-frage.fe-aktiv>[data-lt]{display:none!important}' +
    '.fe-hinweis{font-size:13px;color:#666;margin:6px 0 10px}.fe-pflicht{display:inline-block;font-size:12px;font-weight:700;color:var(--fe-a);border:1px solid currentColor;border-radius:999px;padding:1px 9px;margin:0 0 8px}' +
    '.fe-opts{display:flex;flex-direction:column;gap:8px}' +
    '.fe-opt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font:inherit;font-size:15px;color:#222;background:#fff;border:2px solid #ddd;border-radius:12px;padding:10px 14px;cursor:pointer}' +
    '.fe-opt:hover{border-color:var(--fe-a)}.fe-opt .fe-m{flex:none;width:20px;height:20px;border:2px solid #aaa;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;color:#fff;font-weight:700}' +
    '.fe-opt.eckig .fe-m{border-radius:5px}.fe-opt.an{border-color:var(--fe-a);background:#f6f6f6}.fe-opt.an .fe-m{background:var(--fe-a);border-color:var(--fe-a)}' +
    '.fe-opt.ok{border-color:#1d7a4a;background:#e3f3ea}.fe-opt.ok .fe-m{background:#1d7a4a;border-color:#1d7a4a}.fe-opt.nok{border-color:#b3261e;background:#fbe8e7}.fe-opt.nok .fe-m{background:#b3261e;border-color:#b3261e}' +
    '.fe-opt.loes{border-style:dashed;border-color:#1d7a4a}.fe-opt[disabled]{cursor:default}' +
    '.fe-knoepfe{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}' +
    '.fe-knopf{font:inherit;font-weight:700;font-size:15px;color:#fff;background:var(--fe-a);border:2px solid var(--fe-a);border-radius:999px;padding:9px 20px;cursor:pointer}.fe-knopf.zweit{color:var(--fe-a);background:#fff}.fe-knopf[disabled]{opacity:.45;cursor:default}' +
    '.fe-meldung{border-radius:12px;padding:10px 14px;margin-top:12px;font-size:15px}.fe-meldung.ok{background:#e3f3ea;color:#14542f;border-left:5px solid #1d7a4a}.fe-meldung.nok{background:#fbe8e7;color:#7d1a14;border-left:5px solid #b3261e}.fe-meldung.info{background:#fff4dc;color:#6a4500;border-left:5px solid #c08a00}' +
    '.fe-pool,.fe-ablage{display:flex;flex-wrap:wrap;gap:8px;min-height:44px;align-items:center}' +
    '.fe-pool{border:2px dashed #ccc;border-radius:12px;padding:10px;margin:10px 0;background:#fafafa}.fe-pool-titel{width:100%;font-size:12px;font-weight:700;color:#777;letter-spacing:.4px}' +
    '.fe-chip{font:inherit;font-size:14px;color:#222;background:#fff;border:2px solid var(--fe-a);border-radius:999px;padding:6px 14px;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}' +
    '.fe-chip:has(img[data-bbild]){border-radius:12px;padding:6px 10px;text-align:center}.fe-chip img[data-bbild]{display:block;max-width:76px;max-height:56px;object-fit:contain;margin:0 auto 3px;border-radius:6px;pointer-events:none}' +
    '.fe-chip.gewaehlt{background:var(--fe-a);color:#fff}.fe-chip.ok{border-color:#1d7a4a;background:#e3f3ea}.fe-chip.nok{border-color:#b3261e;background:#fbe8e7}.fe-chip .fe-l{font-size:12px;color:#1d7a4a;font-weight:700;margin-left:6px}' +
    '.fe-geist{position:fixed;z-index:99999;pointer-events:none;opacity:.9;box-shadow:0 8px 20px rgba(0,0,0,.25)}' +
    '.fe-zielliste{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}' +
    '.fe-ziel{border:2px solid #ddd;border-radius:12px;background:#fff;padding:8px 10px}.fe-ziel.ueber{border-color:var(--fe-a);background:#f4f4f4}.fe-ziel-name{font-weight:700;font-size:14px;margin-bottom:6px}' +
    '.fe-bild{position:relative;display:inline-block;max-width:100%;line-height:0}.fe-bild img{display:block;max-width:100%;height:auto;border-radius:10px}' +
    '.fe-bild .fe-ziel{position:absolute;padding:2px;border:2px dashed var(--fe-a);background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;line-height:1.2;border-radius:8px}' +
    '.fe-bild .fe-ziel .fe-ablage{min-height:0;justify-content:center}.fe-bild .fe-chip{font-size:12px;padding:3px 9px}.fe-zielnr{position:absolute;top:-10px;left:-10px;width:20px;height:20px;border-radius:50%;background:var(--fe-a);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}' +
    '.fe-lt{line-height:2.2;font-size:15px}.fe-luecke{font:inherit;font-size:15px;border:none;border-bottom:2px solid var(--fe-a);background:#f6f6f6;border-radius:6px 6px 0 0;padding:2px 6px;margin:0 3px;width:9em}' +
    '.fe-luecke.ok{border-color:#1d7a4a;background:#e3f3ea}.fe-luecke.nok{border-color:#b3261e;background:#fbe8e7}.fe-loes{font-size:12px;color:#1d7a4a;font-weight:700;margin-right:4px}' +
    '.lm-frage.fe-erinnern{animation:fe-blink 1s 2}@keyframes fe-blink{50%{box-shadow:0 0 0 4px var(--hauptfarbe,#2b5d8a)}}' +
    '.lm-frage.fe-aktiv>[data-reihe],.lm-frage.fe-aktiv>[data-zahl],.lm-frage.fe-aktiv>[data-klick],.lm-frage.fe-aktiv>[data-frei]{display:none!important}' +
    // Reihenfolge
    '.fe-reihe{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;counter-reset:fe-r}' +
    '.fe-r{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #ddd;border-radius:12px;padding:8px 10px;font-size:15px;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;counter-increment:fe-r}' +
    '.fe-r::before{content:counter(fe-r);flex:none;width:24px;height:24px;border-radius:50%;background:var(--fe-a);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}' +
    '.fe-r .fe-griff{color:#aaa;letter-spacing:-2px}.fe-r .fe-r-text{flex:1}.fe-r.zieht{border-color:var(--fe-a);box-shadow:0 6px 16px rgba(0,0,0,.18)}' +
    // Bilder in Antworten und Reihenfolge-Einträgen (data-bbild): Bild links bzw. oben, Text daneben; nie selbst ziehbar
    '.fe-r .fe-r-text:has(img[data-bbild]){display:flex;align-items:center;gap:12px;flex-wrap:wrap}' +
    '.fe-r img[data-bbild]{flex:none;display:block;max-width:min(150px,40vw);max-height:110px;object-fit:contain;border-radius:8px;pointer-events:none;-webkit-user-drag:none}' +
    '.fe-opt img[data-bbild]{display:block;max-width:min(240px,100%);max-height:170px;object-fit:contain;border-radius:8px;margin:2px 0 6px;pointer-events:none;-webkit-user-drag:none}' +
    '.fe-r-k{font:inherit;font-size:12px;color:var(--fe-a);background:#fff;border:1px solid #ccc;border-radius:8px;width:30px;height:28px;cursor:pointer}.fe-r-k[disabled]{opacity:.35;cursor:default}' +
    '.fe-r.ok{border-color:#1d7a4a;background:#e3f3ea}.fe-r.nok{border-color:#b3261e;background:#fbe8e7}' +
    // Zahl
    '.fe-zahl{display:flex;align-items:center;gap:8px;font-size:15px}.fe-zahl .fe-luecke{width:9em}.fe-einheit{font-weight:700}' +
    // Klick ins Bild
    '.fe-klick{cursor:crosshair}.fe-marke{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:3px solid var(--fe-a);background:rgba(255,255,255,.5);box-shadow:0 0 0 2px #fff;pointer-events:none}' +
    '.fe-marke.ok{border-color:#1d7a4a;background:rgba(29,122,74,.35)}.fe-marke.nok{border-color:#b3261e;background:rgba(179,38,30,.3)}' +
    '.fe-loes-feld{position:absolute;border:3px dashed #1d7a4a;background:rgba(29,122,74,.15);border-radius:8px;pointer-events:none}' +
    // Umfrage mit freiem Text
    '.fe-frei{width:100%;box-sizing:border-box;min-height:90px;font:inherit;font-size:15px;border:2px solid #ddd;border-radius:12px;padding:10px 12px}.fe-frei:focus{outline:none;border-color:var(--fe-a)}' +
    // Neuere Fragearten: Quellen ausblenden, sobald die Engine die Frage darstellt
    '.lm-frage.fe-aktiv>[data-muster],.lm-frage.fe-aktiv>[data-sammel],.lm-frage.fe-aktiv>[data-buchst],.lm-frage.fe-aktiv>[data-ziehbild],.lm-frage.fe-aktiv>[data-wahlbild]{display:none!important}' +
    // Freitext mit Musterlösung
    '.fe-ui textarea.fe-frei{background:#fff;color:#222}' +
    '.fe-musterloesung{border:2px dashed #1d7a4a;border-radius:12px;background:#f3faf6;color:#222;padding:10px 14px;margin-top:10px;font-size:15px}.fe-musterloesung-titel{font-size:12px;font-weight:700;color:#1d7a4a;letter-spacing:.4px;margin-bottom:4px;text-transform:uppercase}' +
    '.fe-selbst{display:flex;flex-wrap:wrap;gap:10px;align-items:center;width:100%;font-size:14px;font-weight:700;color:#444}' +
    // Lückentext mit Auswahl
    '.fe-wahl{width:auto;min-width:7em;max-width:100%;cursor:pointer;color:#222;background-color:#f6f6f6}.fe-wahl option{color:#222;background:#fff}' +
    // Lösungsfeld / Ablagezone
    '.fe-sammelfeld{border:2px solid var(--fe-a);min-height:70px}.fe-sammelfeld .fe-ablage{min-height:44px}' +
    '.fe-bild .fe-sammelzone{align-items:flex-start;justify-content:flex-start;overflow:auto}.fe-bild .fe-sammelzone .fe-ablage{flex-wrap:wrap;gap:4px;justify-content:center;width:100%}' +
    '.fe-sammelzone .fe-chip img[data-bbild]{max-width:44px;max-height:34px}' +
    // Buchstaben
    '.fe-wort,.fe-bpool{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.fe-wort{min-height:48px;padding:8px;border:2px solid var(--fe-a);border-radius:12px;background:#fff;margin-bottom:10px}' +
    '.fe-bpool{padding:8px;border:2px dashed #ccc;border-radius:12px;background:#fafafa;min-height:48px}' +
    '.fe-stein{font:inherit;font-size:18px;font-weight:700;width:40px;height:40px;border-radius:8px;border:2px solid var(--fe-a);background:#fff;color:#222;cursor:pointer;padding:0}.fe-stein[disabled]{cursor:default}' +
    '.fe-slot{width:40px;height:40px;border-radius:8px;border:2px dashed #ccc;box-sizing:border-box}' +
    '.fe-wort.ok{border-color:#1d7a4a;background:#e3f3ea}.fe-wort.nok{border-color:#b3261e;background:#fbe8e7}' +
    // Bereiche auf einem Bild (Objekt ziehen, Bereiche wählen, Reihenfolge)
    '.fe-bild .fe-bereich{position:absolute;box-sizing:border-box;border:2px solid rgba(255,255,255,.95);box-shadow:0 0 0 1px rgba(0,0,0,.4);border-radius:6px;cursor:pointer;line-height:1.2}' +
    '.fe-bild .fe-bereich:hover{box-shadow:0 0 0 2px var(--fe-a)}.fe-bild .fe-bereich.ziel{border:2px dashed var(--fe-a);background:rgba(255,255,255,.3)}' +
    '.fe-bild .fe-bereich.an{border-color:var(--fe-a);box-shadow:0 0 0 3px var(--fe-a);background:rgba(255,255,255,.25)}' +
    '.fe-bild .fe-bereich.ok{border-color:#1d7a4a;box-shadow:0 0 0 3px #1d7a4a;background:rgba(29,122,74,.25)}.fe-bild .fe-bereich.nok{border-color:#b3261e;box-shadow:0 0 0 3px #b3261e;background:rgba(179,38,30,.22)}' +
    '.fe-bild .fe-bereich.inaktiv{cursor:default;border:none;box-shadow:none;background:none}' +
    '.fe-bild .fe-teil{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;object-fit:cover;border-radius:4px;pointer-events:none}' +
    '.fe-bereich .fe-zielnr{top:-10px;left:-10px;z-index:2}.fe-bereich .fe-zielnr.loes{left:auto;right:-10px;background:#1d7a4a}' +
    '.fe-objekt{display:inline-flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;font-size:30px;line-height:1}' +
    '.fe-objekt img{max-width:110px;max-height:90px;pointer-events:none;border-radius:0}.fe-objekt-platz{display:flex;align-items:center;gap:10px;margin:10px 0;padding:8px 12px;border:2px dashed #ccc;border-radius:12px;background:#fafafa;min-height:50px;font-size:12px;font-weight:700;color:#777}' +
    '.fe-bereich .fe-objekt{position:absolute;left:0;top:0;width:100%;height:100%}.fe-bereich .fe-objekt img{max-width:100%;max-height:100%}';
  function stilEinfuegen() {
    if (document.getElementById('fe-stil')) return;
    var s = document.createElement('style'); s.id = 'fe-stil'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s);
  }

  // ── Hilfen für die neueren Fragearten ──────────────────────────────────────
  // Element ziehbar machen (Maus und Finger). Ohne Ziehen zählt es als Antippen.
  // o: { gesperrt(), zielUnter(x, y) → Ziel oder null, ablegen(ziel), tippen() }
  function ziehbarMachen(c, o) {
    c.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); o.tippen(); } });
    c.addEventListener('pointerdown', function (ev) {
      if (o.gesperrt() || ev.button > 0) return;
      ev.preventDefault(); ev.stopPropagation();
      var sx = ev.clientX, sy = ev.clientY, geist = null, ueber = null;
      var bewegen = function (e) {
        if (!geist && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < 6) return;
        if (!geist) { geist = c.cloneNode(true); geist.classList.add('fe-geist'); geist.style.width = c.offsetWidth + 'px'; geist.style.height = c.offsetHeight + 'px'; document.body.appendChild(geist); }
        geist.style.left = (e.clientX - 20) + 'px'; geist.style.top = (e.clientY - 16) + 'px';
        var z = o.zielUnter(e.clientX, e.clientY);
        if (z !== ueber) { if (ueber) ueber.classList.remove('ueber'); ueber = z; if (z) z.classList.add('ueber'); }
      };
      var los = function (e) {
        document.removeEventListener('pointermove', bewegen); document.removeEventListener('pointerup', los); document.removeEventListener('pointercancel', los);
        if (ueber) ueber.classList.remove('ueber');
        if (geist) { geist.remove(); var z = o.zielUnter(e.clientX, e.clientY); if (z) o.ablegen(z); }
        else if (e.type === 'pointerup') o.tippen();
      };
      document.addEventListener('pointermove', bewegen); document.addEventListener('pointerup', los); document.addEventListener('pointercancel', los);
    });
  }
  // Welches der Elemente in liste liegt unter dem Punkt x/y?
  function treffer(x, y, liste) {
    var e = document.elementFromPoint(x, y);
    while (e && e !== document.body) { if (liste.indexOf(e) >= 0) return e; e = e.parentNode; }
    return null;
  }
  // Lage eines Bereichs (Mitte x/y, Größe b/h in % des Bildes) übernehmen
  function lageSetzen(d, z) {
    var x = parseFloat(z.getAttribute('data-x')) || 0, y = parseFloat(z.getAttribute('data-y')) || 0;
    var b = parseFloat(z.getAttribute('data-b')) || 16, h = parseFloat(z.getAttribute('data-h')) || 12;
    d.style.left = (x - b / 2) + '%'; d.style.top = (y - h / 2) + '%'; d.style.width = b + '%'; d.style.height = h + '%';
  }
  // Bild mit Bereichen aufbauen. quelle enthält img[data-zbild] und je Bereich ein [data-z]
  // (darin optional img[data-teil] = Teilbild, img[data-tausch] = Austauschbild; data-inaktiv = nur Bebilderung).
  function bildFlaeche(quelle) {
    var fl = el('div', 'fe-bild'), q = quelle && quelle.querySelector('img[data-zbild]'), img = document.createElement('img');
    img.src = q ? q.getAttribute('src') : ''; img.alt = q ? q.getAttribute('alt') || '' : ''; img.draggable = false;
    fl.appendChild(img);
    var bereiche = (quelle ? alle(quelle, '[data-z]') : []).map(function (z, t) {
      var d = el('div', 'fe-bereich'); d.feT = t; lageSetzen(d, z);
      var teil = z.querySelector('img[data-teil]'), tausch = z.querySelector('img[data-tausch]');
      if (teil) { var ti = document.createElement('img'); ti.src = teil.getAttribute('src'); ti.alt = teil.getAttribute('alt') || ''; ti.draggable = false; ti.className = 'fe-teil'; d.appendChild(ti); }
      d.feTausch = tausch ? tausch.getAttribute('src') : '';
      if (z.hasAttribute('data-inaktiv')) d.classList.add('inaktiv');
      fl.appendChild(d);
      return d;
    });
    return { flaeche: fl, bild: img, bereiche: bereiche };
  }

  // ── Eine Frage bedienbar machen ────────────────────────────────────────────
  // opt: { salz, einmal (true = nur ein Versuch, z. B. Leitner), loesungZeigen,
  //        mischen, geloest (true = schon früher gelöst), ohneMeldung (keine eigene
  //        Rückmeldung anzeigen), verdeckt (Abschlusstest: Antwort nur speichern,
  //        NICHT zeigen, ob sie richtig war), knopfText, onErgebnis(richtig, ctrl) }
  // ctrl.antwort() liefert die gegebene Antwort als lesbaren Text (für Moodle).
  // Bei einer Umfrage ist „richtig“ immer null (es gibt kein Richtig oder Falsch).
  function einzeln(f, opt) {
    opt = opt || {};
    if (f.feCtrl) return f.feCtrl;
    stilEinfuegen();
    var id = f.getAttribute('data-frage'), typ = f.getAttribute('data-typ') || 'single';
    var salz = opt.salz || '', H = function (s) { return h53(salz + '|' + id + '|' + s, 1); };
    var hashes = (f.getAttribute('data-h') || '').split(' ');
    var umfrage = typ === 'umfrage';
    var mitMischen = opt.mischen !== false && f.getAttribute('data-mischen') !== '0' && !umfrage;
    var zeigen = !opt.verdeckt;          // richtig/falsch farbig zeigen?
    var loesungDa = opt.einmal && opt.loesungZeigen !== false && zeigen;
    var ui = el('div', 'fe-ui'), ctrl = { el: f, geloest: !!opt.geloest, gesperrt: false, typ: typ, antwort: function () { return ''; } };
    if (typ === 'single' && f.getAttribute('data-wf') === '1') ctrl.typ = 'wahrfalsch';
    f.feCtrl = ctrl;
    f.classList.add('fe-aktiv');
    if (f.getAttribute('data-pflicht') === '1' && !opt.einmal) ui.appendChild(el('div', 'fe-pflicht', T.pflicht));
    var hinweis = el('div', 'fe-hinweis'); ui.appendChild(hinweis);
    var feld = el('div', ''); ui.appendChild(feld);
    var knoepfe = el('div', 'fe-knoepfe'), pruefKnopf = el('button', 'fe-knopf', opt.knopfText || (umfrage ? T.absenden : T.pruefen));
    pruefKnopf.type = 'button'; knoepfe.appendChild(pruefKnopf); ui.appendChild(knoepfe);
    var meldung = el('div', ''); ui.appendChild(meldung);
    var fb = kinderMit(f, 'data-fb')[0];
    var fbEl = kinderMit(f, 'data-ft')[0];
    if (fbEl && fbEl.nextSibling) f.insertBefore(ui, fbEl.nextSibling); else f.appendChild(ui);
    if (fb) fb.hidden = true;
    var loesung = function () { return entschleiern(f.getAttribute('data-loes') || '', h53('loes|' + id, 9)); };

    function melden(art, html) { meldung.className = 'fe-meldung ' + art; meldung.innerHTML = html; }
    function leeren() { meldung.className = ''; meldung.innerHTML = ''; }
    function ergebnis(richtig, loesungHtml) {
      if (opt.verdeckt) {                  // Abschlusstest: nur speichern, nichts verraten
        ctrl.gesperrt = true; pruefKnopf.disabled = true; if (richtig) ctrl.geloest = true;
        melden('info', T.gespeichert);
        if (opt.onErgebnis) opt.onErgebnis(richtig, ctrl);
        return;
      }
      if (richtig === null) {              // Umfrage: gilt als beantwortet
        ctrl.geloest = true; ctrl.gesperrt = true; pruefKnopf.disabled = true;
        if (!opt.ohneMeldung) melden('ok', T.danke + (fb ? '<div style="margin-top:6px">' + fb.innerHTML + '</div>' : ''));
        if (opt.onErgebnis) opt.onErgebnis(null, ctrl);
        return;
      }
      if (opt.ohneMeldung) {               // z. B. Leitner-Test: zeigt seine eigene Rückmeldung
        ctrl.gesperrt = true; pruefKnopf.disabled = true; if (richtig) ctrl.geloest = true;
        if (opt.onErgebnis) opt.onErgebnis(richtig, ctrl);
        return;
      }
      if (richtig) {
        ctrl.geloest = true; ctrl.gesperrt = true; pruefKnopf.disabled = true;
        melden('ok', T.richtig + (fb ? '<div style="margin-top:6px">' + fb.innerHTML + '</div>' : ''));
      } else if (opt.einmal) {
        ctrl.gesperrt = true; pruefKnopf.disabled = true;
        melden('nok', T.falsch + (loesungHtml ? ' ' + loesungHtml : '') + (fb ? '<div style="margin-top:6px">' + fb.innerHTML + '</div>' : ''));
      } else {
        melden('nok', T.falschNochmal);
      }
      if (opt.onErgebnis) opt.onErgebnis(richtig, ctrl);
    }

    // ── Single-/Multiple-Choice, Wahr/Falsch, Umfrage mit Auswahl ──
    if (typ === 'single' || typ === 'multi' || (umfrage && f.getAttribute('data-frei') !== '1')) {
      var multi = typ === 'multi' || (umfrage && f.getAttribute('data-mehrfach') === '1'), quellen = alle(f, '[data-opts] > [data-o]'), wahl = [];
      hinweis.textContent = umfrage ? (multi ? T.hUmfrageMehr : T.hUmfrage) : multi ? T.hMulti : ctrl.typ === 'wahrfalsch' ? T.hWahr : T.hSingle;
      ctrl.antwort = function () { return wahl.slice().sort(function (x, y) { return x - y; }).map(function (nr) { return eintragText(quellen[nr]); }).join('; '); };
      var liste = el('div', 'fe-opts'), knoepfeO = [];
      var reihe = quellen.map(function (q, i) { return i; });
      if (mitMischen) mischen(reihe);
      reihe.forEach(function (nr) {
        var b = el('button', 'fe-opt' + (multi ? ' eckig' : ''), '<span class="fe-m"></span><span>' + quellen[nr].innerHTML + '</span>');
        b.type = 'button'; b.setAttribute('role', multi ? 'checkbox' : 'radio'); b.setAttribute('aria-checked', 'false');
        b.addEventListener('click', function () {
          if (ctrl.gesperrt) return;
          meldung.className = ''; meldung.innerHTML = '';
          var p = wahl.indexOf(nr);
          if (multi) { if (p >= 0) wahl.splice(p, 1); else wahl.push(nr); } else wahl = [nr];
          zeichnen();
        });
        knoepfeO.push({ b: b, nr: nr }); liste.appendChild(b);
      });
      feld.appendChild(liste);
      var zeichnen = function (loes) {
        knoepfeO.forEach(function (o) {
          var an = wahl.indexOf(o.nr) >= 0, m = o.b.querySelector('.fe-m');
          o.b.className = 'fe-opt' + (multi ? ' eckig' : '') + (an ? ' an' : '');
          o.b.setAttribute('aria-checked', an ? 'true' : 'false'); m.textContent = an && multi ? '✓' : '';
          if (loes) {
            if (an) { o.b.className += loes.richtig ? ' ok' : (loes.liste && loes.liste.indexOf(o.nr) >= 0 ? ' ok' : ' nok'); m.textContent = loes.richtig || (loes.liste && loes.liste.indexOf(o.nr) >= 0) ? '✓' : '✕'; }
            else if (loes.liste && loes.liste.indexOf(o.nr) >= 0) { o.b.className += ' loes'; m.textContent = ''; }
          }
          if (ctrl.gesperrt) o.b.disabled = true;
        });
        pruefKnopf.disabled = ctrl.gesperrt || !wahl.length;
      };
      var passt = function (a) { return hashes.indexOf(H(a.slice().sort(function (x, y) { return x - y; }).join(','))) >= 0; };
      var loesungSuchen = function () {
        var n = quellen.length, i, m, a;
        if (!multi) { for (i = 0; i < n; i++) if (passt([i])) return [i]; return null; }
        if (n > 16) return null;
        for (m = 1; m < (1 << n); m++) { a = []; for (i = 0; i < n; i++) if (m & (1 << i)) a.push(i); if (passt(a)) return a; }
        return null;
      };
      pruefKnopf.addEventListener('click', function () {
        if (!wahl.length || ctrl.gesperrt) return;
        if (umfrage) { ergebnis(null); zeichnen(); return; }
        var richtig = passt(wahl);
        var loes = { richtig: richtig, liste: null };
        if (!richtig && loesungDa) loes.liste = loesungSuchen();
        ergebnis(richtig, null);
        zeichnen(zeigen ? loes : null);
        if (!richtig && !opt.einmal) wahl = wahl.slice();
      });
      zeichnen();
    }

    // ── Zuordnen (Drag & Drop, auf Textfelder oder Bildbereiche) ──
    else if (typ === 'zuordnen') {
      hinweis.textContent = T.hZuordnen;
      var zielQuelle = kinderMit(f, 'data-ziele')[0], begriffe = alle(f, '[data-begriffe] > [data-b]');
      var bildQ = zielQuelle && zielQuelle.querySelector('img[data-zbild]');
      var zb = parseFloat(zielQuelle && zielQuelle.getAttribute('data-zb')) || 18, zh = parseFloat(zielQuelle && zielQuelle.getAttribute('data-zh')) || 12;
      var ziele = zielQuelle ? alle(zielQuelle, '[data-z]') : [];
      var zielEls = [], chips = [], gewaehlt = null;
      var flaeche;
      if (bildQ) {
        flaeche = el('div', 'fe-bild');
        var bild = document.createElement('img'); bild.src = bildQ.getAttribute('src'); bild.alt = bildQ.getAttribute('alt') || '';
        flaeche.appendChild(bild);
        ziele.forEach(function (z, t) {
          var x = parseFloat(z.getAttribute('data-x')) || 0, y = parseFloat(z.getAttribute('data-y')) || 0;
          // eigene Größe des Feldes (data-b/data-h), sonst die gemeinsame Größe
          var b = parseFloat(z.getAttribute('data-b')) || zb, h = parseFloat(z.getAttribute('data-h')) || zh;
          var d = el('div', 'fe-ziel'); d.setAttribute('data-t', t); d.title = z.textContent;
          d.style.left = (x - b / 2) + '%'; d.style.top = (y - h / 2) + '%'; d.style.width = b + '%'; d.style.height = h + '%';
          d.appendChild(el('span', 'fe-zielnr', String(t + 1)));
          var a = el('div', 'fe-ablage'); d.appendChild(a); d.fePlatz = a; d.feEins = true;
          flaeche.appendChild(d); zielEls.push(d);
        });
      } else {
        flaeche = el('div', 'fe-zielliste');
        ziele.forEach(function (z, t) {
          var d = el('div', 'fe-ziel'); d.setAttribute('data-t', t);
          d.appendChild(el('div', 'fe-ziel-name', z.innerHTML));
          var a = el('div', 'fe-ablage'); d.appendChild(a); d.fePlatz = a;
          flaeche.appendChild(d); zielEls.push(d);
        });
      }
      var pool = el('div', 'fe-pool'); pool.appendChild(el('div', 'fe-pool-titel', T.ablage)); pool.fePlatz = pool; pool.setAttribute('data-t', '-1');
      var reiheB = begriffe.map(function (b, i) { return i; }); mischen(reiheB);
      reiheB.forEach(function (i) {
        var c = el('span', 'fe-chip', begriffe[i].innerHTML); c.feI = i; c.tabIndex = 0; c.setAttribute('role', 'button');
        chips.push(c); pool.appendChild(c); ziehbar(c);
      });
      feld.appendChild(flaeche); feld.appendChild(pool);
      var ablegen = function (c, ziel) {
        if (ctrl.gesperrt) return;
        meldung.className = ''; meldung.innerHTML = '';
        chips.forEach(function (x) { x.classList.remove('ok', 'nok'); var l = x.querySelector('.fe-l'); if (l) l.remove(); });
        if (ziel.feEins) alle(ziel.fePlatz, '.fe-chip').forEach(function (alt) { if (alt !== c) pool.appendChild(alt); });
        ziel.fePlatz.appendChild(c);
        waehlen(null);
      };
      function waehlen(c) { if (gewaehlt) gewaehlt.classList.remove('gewaehlt'); gewaehlt = c; if (c) c.classList.add('gewaehlt'); }
      [pool].concat(zielEls).forEach(function (z) {
        z.addEventListener('click', function (ev) { if (gewaehlt && !ev.target.closest('.fe-chip')) ablegen(gewaehlt, z); });
      });
      function zielUnter(x, y) {
        var e = document.elementFromPoint(x, y);
        while (e && e !== document.body) { if (e === pool || zielEls.indexOf(e) >= 0) return e; e = e.parentNode; }
        return null;
      }
      function ziehbar(c) {
        c.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); waehlen(gewaehlt === c ? null : c); } });
        c.addEventListener('pointerdown', function (ev) {
          if (ctrl.gesperrt || ev.button > 0) return;
          ev.preventDefault();
          var sx = ev.clientX, sy = ev.clientY, geist = null, ueber = null;
          var bewegen = function (e) {
            if (!geist && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < 6) return;
            if (!geist) { geist = c.cloneNode(true); geist.classList.add('fe-geist'); document.body.appendChild(geist); }
            geist.style.left = (e.clientX - 20) + 'px'; geist.style.top = (e.clientY - 16) + 'px';
            var z = zielUnter(e.clientX, e.clientY);
            if (z !== ueber) { if (ueber) ueber.classList.remove('ueber'); ueber = z; if (z) z.classList.add('ueber'); }
          };
          var los = function (e) {
            document.removeEventListener('pointermove', bewegen); document.removeEventListener('pointerup', los); document.removeEventListener('pointercancel', los);
            if (ueber) ueber.classList.remove('ueber');
            if (geist) { geist.remove(); var z = zielUnter(e.clientX, e.clientY); if (z) ablegen(c, z); }
            else waehlen(gewaehlt === c ? null : c);
          };
          document.addEventListener('pointermove', bewegen); document.addEventListener('pointerup', los); document.addEventListener('pointercancel', los);
        });
      }
      var zielVon = function (c) { var z = c.parentNode; while (z && !z.hasAttribute('data-t')) z = z.parentNode; return z ? Number(z.getAttribute('data-t')) : -1; };
      ctrl.antwort = function () {
        return chips.map(function (c) {
          var t = zielVon(c), q = begriffe[c.feI], txt = q.textContent.trim();
          if (!txt) { var img = q.querySelector('img[data-bbild]'); txt = img ? (img.getAttribute('alt') || 'Bild') : ''; }
          return txt + ' → ' + (t < 0 ? '–' : bildQ ? 'Feld ' + (t + 1) : ziele[t].textContent.trim());
        }).join('; ');
      };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        var alleRichtig = true;
        chips.forEach(function (c) {
          var ok = H('b' + c.feI + '>' + zielVon(c)) === hashes[c.feI];
          c.classList.remove('ok', 'nok'); if (zeigen) c.classList.add(ok ? 'ok' : 'nok');
          if (!ok) {
            alleRichtig = false;
            if (loesungDa) {
              for (var t = -1; t < zielEls.length; t++) if (H('b' + c.feI + '>' + t) === hashes[c.feI]) {
                c.appendChild(el('span', 'fe-l', '→ ' + (t < 0 ? '–' : (bildQ ? (t + 1) : ziele[t].textContent))));
                break;
              }
            }
          }
        });
        ergebnis(alleRichtig);
        if (ctrl.gesperrt) chips.forEach(function (c) { c.style.cursor = 'default'; });
      });
    }

    // ── Lückentext ──
    else if (typ === 'luecken') {
      hinweis.textContent = T.hLuecken;
      var lt = kinderMit(f, 'data-lt')[0], gross = f.getAttribute('data-gross') === '1';
      var gaps = hashes.map(function (h) { return h.split(','); });
      var box = el('div', 'fe-lt', lt ? lt.innerHTML : '');
      var felder = alle(box, '[data-l]').map(function (sp, i) {
        var inp = document.createElement('input'); inp.type = 'text'; inp.className = 'fe-luecke'; inp.setAttribute('aria-label', 'Lücke ' + (i + 1));
        inp.autocomplete = 'off'; inp.spellcheck = false;
        var w = parseInt(sp.getAttribute('data-w'), 10); if (w) inp.style.width = Math.max(4, Math.min(24, w + 2)) + 'em';
        inp.addEventListener('input', function () { inp.classList.remove('ok', 'nok'); meldung.className = ''; meldung.innerHTML = ''; });
        inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); pruefKnopf.click(); } });
        sp.parentNode.replaceChild(inp, sp);
        return inp;
      });
      feld.appendChild(box);
      ctrl.antwort = function () { return felder.map(function (x) { return x.value.trim(); }).join('; '); };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        if (felder.some(function (x) { return !x.value.trim(); })) { melden('info', T.unvollstaendig); return; }
        var alleRichtig = true;
        var loes = loesungDa ? loesung() : null;
        felder.forEach(function (x, i) {
          var ok = (gaps[i] || []).indexOf(H('l' + i + '=' + norm(x.value, gross))) >= 0;
          x.classList.remove('ok', 'nok'); if (zeigen) x.classList.add(ok ? 'ok' : 'nok');
          if (!ok) { alleRichtig = false; if (loes && loes[i] != null) { var s = el('span', 'fe-loes', '→ ' + loes[i]); x.parentNode.insertBefore(s, x.nextSibling); } }
        });
        ergebnis(alleRichtig);
        if (ctrl.gesperrt) felder.forEach(function (x) { x.readOnly = true; });
      });
    }

    // ── Reihenfolge: Einträge ziehen oder mit ▲ ▼ verschieben ──
    // In der Seite stehen die Einträge schon gemischt (data-r). Prüfsumme: H('r' + Nummern in richtiger Reihenfolge)
    else if (typ === 'reihenfolge') {
      hinweis.textContent = T.hReihe;
      var rq = alle(f, '[data-reihe] > [data-r]'), rl = el('ol', 'fe-reihe');
      var ord = rq.map(function (q, i) { return i; });
      if (mitMischen) for (var versuch = 0; versuch < 8; versuch++) { mischen(ord); if (ord.length < 2 || H('r' + ord.join(',')) !== hashes[0]) break; }
      var reiheJetzt = function () { return alle(rl, '.fe-r').map(function (li) { return li.feNr; }); };
      var knoepfeReihe = function () {
        var l = alle(rl, '.fe-r');
        l.forEach(function (li, i) { var k = li.querySelectorAll('.fe-r-k'); k[0].disabled = ctrl.gesperrt || i === 0; k[1].disabled = ctrl.gesperrt || i === l.length - 1; });
      };
      var geaendertR = function () { leeren(); alle(rl, '.fe-r').forEach(function (li) { li.classList.remove('ok', 'nok'); var s = li.querySelector('.fe-loes'); if (s) s.remove(); }); knoepfeReihe(); };
      var schieben = function (li, d) {
        if (ctrl.gesperrt) return;
        var n = d < 0 ? li.previousElementSibling : li.nextElementSibling; if (!n) return;
        if (d < 0) rl.insertBefore(li, n); else rl.insertBefore(n, li);
        geaendertR(); li.querySelectorAll('.fe-r-k')[d < 0 ? 0 : 1].focus();
      };
      ord.forEach(function (nr) {
        var li = el('li', 'fe-r', '<span class="fe-griff" aria-hidden="true">⋮⋮</span><span class="fe-r-text">' + rq[nr].innerHTML + '</span>'); li.feNr = nr;
        var hoch = el('button', 'fe-r-k', '▲'), runter = el('button', 'fe-r-k', '▼');
        hoch.type = runter.type = 'button'; hoch.setAttribute('aria-label', 'nach oben'); runter.setAttribute('aria-label', 'nach unten');
        hoch.onclick = function () { schieben(li, -1); }; runter.onclick = function () { schieben(li, 1); };
        li.appendChild(hoch); li.appendChild(runter); rl.appendChild(li);
        li.addEventListener('pointerdown', function (ev) {
          if (ctrl.gesperrt || ev.button > 0 || ev.target.closest('button')) return;
          ev.preventDefault(); li.classList.add('zieht');
          var bewegen = function (e) {
            var vor = null, l = alle(rl, '.fe-r');
            for (var i = 0; i < l.length; i++) { if (l[i] === li) continue; var r = l[i].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { vor = l[i]; break; } }
            if (vor) { if (li.nextElementSibling !== vor) { rl.insertBefore(li, vor); geaendertR(); } }
            else if (rl.lastElementChild !== li) { rl.appendChild(li); geaendertR(); }
          };
          var los = function () { li.classList.remove('zieht'); document.removeEventListener('pointermove', bewegen); document.removeEventListener('pointerup', los); document.removeEventListener('pointercancel', los); };
          document.addEventListener('pointermove', bewegen); document.addEventListener('pointerup', los); document.addEventListener('pointercancel', los);
        });
      });
      feld.appendChild(rl); knoepfeReihe();
      ctrl.antwort = function () { return reiheJetzt().map(function (nr) { return eintragText(rq[nr]); }).join(' → '); };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        var a = reiheJetzt(), richtig = H('r' + a.join(',')) === hashes[0];
        if (zeigen && !richtig && loesungDa) {
          var lr = loesung();        // richtige Reihenfolge (Nummern)
          if (lr) alle(rl, '.fe-r').forEach(function (li, i) {
            var platz = lr.indexOf(li.feNr), ok = platz === i;
            li.classList.add(ok ? 'ok' : 'nok');
            if (!ok) li.querySelector('.fe-r-text').appendChild(el('span', 'fe-loes', ' → ' + T.platz + ' ' + (platz + 1)));
          });
        } else if (zeigen && richtig) alle(rl, '.fe-r').forEach(function (li) { li.classList.add('ok'); });
        ergebnis(richtig);
        if (ctrl.gesperrt) { knoepfeReihe(); alle(rl, '.fe-r').forEach(function (li) { li.style.cursor = 'default'; }); }
      });
    }

    // ── Zahl: Antwort als Zahl, evtl. mit erlaubter Abweichung ──
    // data-d = Nachkommastellen · data-t="1" = Abweichung erlaubt (Eingabe wird gerundet) · Prüfsummen: H('z=' + Zahl)
    else if (typ === 'zahl') {
      hinweis.textContent = T.hZahl;
      var zq = kinderMit(f, 'data-zahl')[0], stellen = parseInt(zq && zq.getAttribute('data-d'), 10) || 0;
      var mitToleranz = !!zq && zq.getAttribute('data-t') === '1', einheit = zq ? zq.getAttribute('data-einheit') || '' : '';
      var zbox = el('div', 'fe-zahl'), zin = document.createElement('input');
      zin.type = 'text'; zin.className = 'fe-luecke'; zin.setAttribute('inputmode', 'decimal'); zin.autocomplete = 'off'; zin.spellcheck = false; zin.setAttribute('aria-label', 'Deine Antwort (Zahl)');
      zbox.appendChild(zin);
      if (einheit) { var eh = el('span', 'fe-einheit'); eh.textContent = einheit; zbox.appendChild(eh); }
      feld.appendChild(zbox);
      zin.addEventListener('input', function () { zin.classList.remove('ok', 'nok'); leeren(); });
      zin.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); pruefKnopf.click(); } });
      ctrl.antwort = function () { return zin.value.trim() + (einheit ? ' ' + einheit : ''); };
      var zahlLesen = function (s) {
        s = String(s).replace(/\s/g, '');
        if (/^[-+]?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '');   // 1.000,5 (Tausenderpunkte)
        s = s.replace(',', '.');
        return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
      };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        var n = zahlLesen(zin.value);
        if (isNaN(n)) { melden('info', T.keineZahl); return; }
        var r = n.toFixed(stellen); if (Number(r) === 0) r = (0).toFixed(stellen);
        var richtig = (mitToleranz || Math.abs(n - Number(r)) < 1e-9) && hashes.indexOf(H('z=' + r)) >= 0;
        zin.classList.remove('ok', 'nok'); if (zeigen) zin.classList.add(richtig ? 'ok' : 'nok');
        if (!richtig && loesungDa) { var lz = loesung(); if (lz) zbox.appendChild(el('span', 'fe-loes', '→ ' + String(lz).replace(/</g, '&lt;'))); }
        ergebnis(richtig);
        if (ctrl.gesperrt) zin.readOnly = true;
      });
    }

    // ── Klick ins Bild: richtig, wenn der Klick in einem der richtigen Bereiche liegt ──
    // Das Bild ist in 50 × 50 Felder geteilt; Prüfsumme je richtigem Feld: H('k' + Spalte + '.' + Zeile)
    else if (typ === 'bildklick') {
      hinweis.textContent = T.hKlick;
      var kq = kinderMit(f, 'data-klick')[0], kimg = kq && kq.querySelector('img');
      var kfl = el('div', 'fe-bild fe-klick'), kb = document.createElement('img');
      kb.src = kimg ? kimg.getAttribute('src') : ''; kb.alt = kimg ? kimg.getAttribute('alt') || '' : ''; kb.draggable = false;
      var marke = el('div', 'fe-marke'); marke.hidden = true;
      kfl.appendChild(kb); kfl.appendChild(marke); feld.appendChild(kfl);
      var punkt = null, G = 50;
      pruefKnopf.disabled = true;
      kfl.addEventListener('click', function (ev) {
        if (ctrl.gesperrt) return;
        var r = kb.getBoundingClientRect(); if (!r.width) return;
        var auf = function (v) { return Math.max(0, Math.min(99.99, v)); };
        punkt = { x: auf((ev.clientX - r.left) / r.width * 100), y: auf((ev.clientY - r.top) / r.height * 100) };
        marke.hidden = false; marke.className = 'fe-marke'; marke.style.left = punkt.x + '%'; marke.style.top = punkt.y + '%';
        leeren(); pruefKnopf.disabled = false;
      });
      ctrl.antwort = function () { return punkt ? 'Klick bei x ' + Math.round(punkt.x) + ' %, y ' + Math.round(punkt.y) + ' %' : ''; };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        if (!punkt) { melden('info', T.erstKlicken); return; }
        var richtig = hashes.indexOf(H('k' + Math.floor(punkt.x * G / 100) + '.' + Math.floor(punkt.y * G / 100))) >= 0;
        if (zeigen) marke.classList.add(richtig ? 'ok' : 'nok');
        if (!richtig && loesungDa) (loesung() || []).forEach(function (b) {
          var z = el('div', 'fe-loes-feld'); z.style.left = (b.x - b.b / 2) + '%'; z.style.top = (b.y - b.h / 2) + '%'; z.style.width = b.b + '%'; z.style.height = b.h + '%'; kfl.appendChild(z);
        });
        ergebnis(richtig);
        if (ctrl.gesperrt) kfl.style.cursor = 'default';
      });
    }

    // ── Antwort-Pool mit wechselnder Auswahl (wie Multiple-Choice) ──
    // data-zeigen = so viele Antworten werden gezeigt (mindestens eine richtige ist dabei).
    // Prüfsumme je RICHTIGER Antwort: H('v' + Nummer)
    else if (typ === 'variation') {
      hinweis.textContent = T.hMulti;
      var vq = alle(f, '[data-opts] > [data-o]');
      var vRichtig = vq.map(function (q, i) { return hashes.indexOf(H('v' + i)) >= 0; });
      var vZahl = Math.max(2, Math.min(vq.length, parseInt(f.getAttribute('data-zeigen'), 10) || 4));
      var vR = [], vF = [];
      vq.forEach(function (q, i) { (vRichtig[i] ? vR : vF).push(i); });
      mischen(vR);
      var vGezeigt = vR.length ? [vR.shift()] : [], vRest = mischen(vR.concat(vF));
      while (vGezeigt.length < vZahl && vRest.length) vGezeigt.push(vRest.shift());
      mischen(vGezeigt);
      var vWahl = [], vListe = el('div', 'fe-opts'), vKn = [];
      vGezeigt.forEach(function (nr) {
        var b = el('button', 'fe-opt eckig', '<span class="fe-m"></span><span>' + vq[nr].innerHTML + '</span>');
        b.type = 'button'; b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', 'false');
        b.addEventListener('click', function () {
          if (ctrl.gesperrt) return;
          leeren();
          var p = vWahl.indexOf(nr); if (p >= 0) vWahl.splice(p, 1); else vWahl.push(nr);
          vZeichnen();
        });
        vKn.push({ b: b, nr: nr }); vListe.appendChild(b);
      });
      feld.appendChild(vListe);
      var vZeichnen = function (loes) {
        vKn.forEach(function (o) {
          var an = vWahl.indexOf(o.nr) >= 0, m = o.b.querySelector('.fe-m');
          o.b.className = 'fe-opt eckig' + (an ? ' an' : '');
          o.b.setAttribute('aria-checked', an ? 'true' : 'false'); m.textContent = an ? '✓' : '';
          if (loes) {
            if (an && (loes.richtig || loes.zeigen)) { o.b.className += vRichtig[o.nr] ? ' ok' : ' nok'; m.textContent = vRichtig[o.nr] ? '✓' : '✕'; }
            else if (!an && loes.zeigen && vRichtig[o.nr]) o.b.className += ' loes';
          }
          if (ctrl.gesperrt) o.b.disabled = true;
        });
        pruefKnopf.disabled = ctrl.gesperrt || !vWahl.length;
      };
      ctrl.antwort = function () { return vWahl.map(function (nr) { return eintragText(vq[nr]); }).join('; '); };
      pruefKnopf.addEventListener('click', function () {
        if (!vWahl.length || ctrl.gesperrt) return;
        var richtig = vGezeigt.every(function (nr) { return (vWahl.indexOf(nr) >= 0) === vRichtig[nr]; });
        ergebnis(richtig);
        vZeichnen(zeigen ? { richtig: richtig, zeigen: !richtig && loesungDa } : null);
      });
      vZeichnen();
    }

    // ── Freitext: eigene Antwort schreiben, dann mit der Musterlösung vergleichen (Selbstkontrolle) ──
    else if (typ === 'freitext') {
      hinweis.textContent = T.hFreitext;
      var muster = kinderMit(f, 'data-muster')[0];
      var ftext = document.createElement('textarea'); ftext.className = 'fe-frei'; ftext.setAttribute('aria-label', 'Deine Antwort');
      feld.appendChild(ftext);
      var mBox = el('div', 'fe-musterloesung', '<div class="fe-musterloesung-titel">' + T.muster + '</div>' + (muster ? muster.innerHTML : '')); mBox.hidden = true;
      feld.appendChild(mBox);
      var selbst = el('div', 'fe-selbst'); selbst.hidden = true;
      selbst.appendChild(el('span', '', T.selbstFrage));
      var jaK = el('button', 'fe-knopf', T.selbstJa), neinK = el('button', 'fe-knopf zweit', T.selbstNein);
      jaK.type = neinK.type = 'button'; selbst.appendChild(jaK); selbst.appendChild(neinK);
      knoepfe.appendChild(selbst);
      if (!opt.knopfText) pruefKnopf.textContent = T.musterZeigen;
      ctrl.antwort = function () { return ftext.value.trim(); };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        leeren(); mBox.hidden = false; selbst.hidden = false; pruefKnopf.hidden = true;
      });
      var urteil = function (ok) {
        if (ctrl.gesperrt) return;
        ergebnis(ok);
        if (ctrl.gesperrt) { selbst.hidden = true; ftext.readOnly = true; }
      };
      jaK.addEventListener('click', function () { urteil(true); });
      neinK.addEventListener('click', function () { urteil(false); });
    }

    // ── Lückentext mit Auswahllisten ──
    // [data-l data-o='["…","…"]'] = Lücke mit ihren Möglichkeiten. Prüfsummen je Lücke: H('a' + Nr + '=' + richtige Möglichkeit)
    else if (typ === 'auswahl') {
      hinweis.textContent = T.hAuswahl;
      var alt = kinderMit(f, 'data-lt')[0];
      var aGaps = hashes.map(function (h) { return h.split(','); });
      var aBox = el('div', 'fe-lt', alt ? alt.innerHTML : '');
      var aListen = alle(aBox, '[data-l]').map(function (sp, i) {
        var s = document.createElement('select'); s.className = 'fe-luecke fe-wahl'; s.setAttribute('aria-label', 'Lücke ' + (i + 1));
        var moegl = []; try { moegl = JSON.parse(sp.getAttribute('data-o') || '[]'); } catch (e) { moegl = []; }
        if (mitMischen) mischen(moegl);
        s.appendChild(new Option(T.bitteWaehlen, ''));
        moegl.forEach(function (m) { s.appendChild(new Option(String(m), String(m))); });
        s.addEventListener('change', function () { s.classList.remove('ok', 'nok'); leeren(); });
        sp.parentNode.replaceChild(s, sp);
        return s;
      });
      feld.appendChild(aBox);
      ctrl.antwort = function () { return aListen.map(function (s) { return s.value; }).join('; '); };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        if (aListen.some(function (s) { return !s.value; })) { melden('info', T.unvollstaendig); return; }
        var alleRichtig = true, loes = loesungDa ? loesung() : null;
        alle(aBox, '.fe-loes').forEach(function (x) { x.remove(); });
        aListen.forEach(function (s, i) {
          var ok = (aGaps[i] || []).indexOf(H('a' + i + '=' + norm(s.value))) >= 0;
          s.classList.remove('ok', 'nok'); if (zeigen) s.classList.add(ok ? 'ok' : 'nok');
          if (!ok) { alleRichtig = false; if (loes && loes[i] != null) s.parentNode.insertBefore(el('span', 'fe-loes', '→ ' + String(loes[i]).replace(/</g, '&lt;')), s.nextSibling); }
        });
        ergebnis(alleRichtig);
        if (ctrl.gesperrt) aListen.forEach(function (s) { s.disabled = true; });
      });
    }

    // ── Richtige Antworten in ein Lösungsfeld ziehen (Text oder Bilder; Feld auch als Zone auf einem Bild) ──
    // Prüfsumme: H('s' + Nummern der richtigen Antworten, aufsteigend)
    else if (typ === 'sammeln') {
      hinweis.textContent = T.hSammeln;
      var sq = alle(f, '[data-opts] > [data-o]'), sQuelle = kinderMit(f, 'data-sammel')[0];
      var sBildQ = sQuelle && sQuelle.querySelector('img[data-zbild]'), sZoneQ = sQuelle && sQuelle.querySelector('[data-z]');
      var sZiel, sOben, sAblage = el('div', 'fe-ablage');
      if (sBildQ && sZoneQ) {
        sOben = el('div', 'fe-bild');
        var sImg = document.createElement('img'); sImg.src = sBildQ.getAttribute('src'); sImg.alt = sBildQ.getAttribute('alt') || ''; sImg.draggable = false;
        sOben.appendChild(sImg);
        sZiel = el('div', 'fe-ziel fe-sammelzone'); lageSetzen(sZiel, sZoneQ); sZiel.title = T.loesungsfeld;
        sZiel.appendChild(sAblage); sOben.appendChild(sZiel);
      } else {
        sOben = sZiel = el('div', 'fe-ziel fe-sammelfeld');
        sZiel.appendChild(el('div', 'fe-ziel-name', T.loesungsfeld)); sZiel.appendChild(sAblage);
      }
      var sPool = el('div', 'fe-pool'); sPool.appendChild(el('div', 'fe-pool-titel', T.antwortenPool));
      var sChips = [], sReihe = sq.map(function (q, i) { return i; });
      if (mitMischen) mischen(sReihe);
      var sDrin = function (c) { return c.parentNode === sAblage; };
      var sFarbenWeg = function () { sChips.forEach(function (x) { x.classList.remove('ok', 'nok', 'loes'); var l = x.querySelector('.fe-l'); if (l) l.remove(); }); };
      var sLegen = function (c, ziel) {
        if (ctrl.gesperrt) return;
        leeren(); sFarbenWeg();
        if (ziel === sZiel) sAblage.appendChild(c); else sPool.appendChild(c);
      };
      sReihe.forEach(function (i) {
        var c = el('span', 'fe-chip', sq[i].innerHTML); c.feI = i; c.tabIndex = 0; c.setAttribute('role', 'button');
        ziehbarMachen(c, {
          gesperrt: function () { return ctrl.gesperrt; },
          zielUnter: function (x, y) { return treffer(x, y, [sZiel, sPool]); },
          ablegen: function (z) { sLegen(c, z); },
          tippen: function () { sLegen(c, sDrin(c) ? sPool : sZiel); }
        });
        sChips.push(c); sPool.appendChild(c);
      });
      feld.appendChild(sOben); feld.appendChild(sPool);
      var sText = function (c) { var t = sq[c.feI].textContent.trim(); if (!t) { var im = sq[c.feI].querySelector('img'); t = im ? (im.getAttribute('alt') || 'Bild') : ''; } return t; };
      ctrl.antwort = function () { return sChips.filter(sDrin).map(sText).join('; '); };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        var gew = sChips.filter(sDrin).map(function (c) { return c.feI; }).sort(function (a, b) { return a - b; });
        if (!gew.length) { melden('info', T.erstSammeln); return; }
        var richtig = hashes.indexOf(H('s' + gew.join(','))) >= 0;
        sFarbenWeg();
        if (zeigen && richtig) sChips.filter(sDrin).forEach(function (c) { c.classList.add('ok'); });
        else if (zeigen && loesungDa) {
          var lsg = loesung() || [];
          sChips.forEach(function (c) {
            var soll = lsg.indexOf(c.feI) >= 0, ist = sDrin(c);
            if (ist) c.classList.add(soll ? 'ok' : 'nok');
            else if (soll) { c.classList.add('nok'); c.appendChild(el('span', 'fe-l', '→ ' + T.loesungsfeld)); }
          });
        }
        ergebnis(richtig);
        if (ctrl.gesperrt) sChips.forEach(function (c) { c.style.cursor = 'default'; });
      });
    }

    // ── Wort aus einem Buchstabenpool zusammensetzen ──
    // data-pool = alle Buchstaben (Lösung + Füllwort), data-n = Länge der Lösung. Prüfsumme: H('w=' + Wort)
    else if (typ === 'buchstaben') {
      hinweis.textContent = T.hBuchst;
      var bq = kinderMit(f, 'data-buchst')[0];
      var bVorrat = (bq ? bq.getAttribute('data-pool') || '' : '').split(''), bLaenge = parseInt(bq && bq.getAttribute('data-n'), 10) || 0;
      if (mitMischen) mischen(bVorrat);
      var bWort = el('div', 'fe-wort'), bPool = el('div', 'fe-bpool'), bSteine = [];
      bWort.setAttribute('aria-label', 'Deine Antwort'); bPool.setAttribute('aria-label', 'Buchstaben');
      var bLuecken = function () {
        alle(bWort, '.fe-slot').forEach(function (s) { s.remove(); });
        for (var k = bWort.children.length; k < bLaenge; k++) bWort.appendChild(el('span', 'fe-slot'));
      };
      var bIst = function () { return alle(bWort, '.fe-stein').map(function (s) { return s.textContent; }).join(''); };
      bVorrat.forEach(function (z) {
        var s = el('button', 'fe-stein'); s.type = 'button'; s.textContent = z;
        s.addEventListener('click', function () {
          if (ctrl.gesperrt) return;
          leeren(); bWort.classList.remove('ok', 'nok');
          if (s.parentNode === bPool) { if (bLaenge && alle(bWort, '.fe-stein').length >= bLaenge) return; var l1 = bWort.querySelector('.fe-slot'); if (l1) bWort.insertBefore(s, l1); else bWort.appendChild(s); }
          else bPool.appendChild(s);
          bLuecken();
        });
        bSteine.push(s); bPool.appendChild(s);
      });
      bLuecken();
      feld.appendChild(bWort); feld.appendChild(bPool);
      var bZurueck = el('button', 'fe-knopf zweit', T.zuruecksetzen); bZurueck.type = 'button';
      bZurueck.addEventListener('click', function () { if (ctrl.gesperrt) return; leeren(); bWort.classList.remove('ok', 'nok'); bSteine.forEach(function (s) { bPool.appendChild(s); }); bLuecken(); });
      knoepfe.appendChild(bZurueck);
      ctrl.antwort = bIst;
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        var w = bIst();
        if (!w) { melden('info', T.erstBuchst); return; }
        var richtig = H('w=' + w) === hashes[0];
        bWort.classList.remove('ok', 'nok'); if (zeigen) bWort.classList.add(richtig ? 'ok' : 'nok');
        if (zeigen && !richtig && loesungDa && loesung()) feld.appendChild(el('div', 'fe-loes', T.loesungIst + ' ' + String(loesung()).replace(/</g, '&lt;')));
        ergebnis(richtig);
        if (ctrl.gesperrt) { bSteine.forEach(function (s) { s.disabled = true; }); bZurueck.disabled = true; }
      });
    }

    // ── Objekt an die richtige Stelle im Bild ziehen (Austauschbild je Stelle möglich) ──
    // Prüfsumme je RICHTIGER Stelle: H('s' + Nummer)
    else if (typ === 'bildziehen') {
      hinweis.textContent = T.hBildziehen;
      var zQuelle = kinderMit(f, 'data-ziehbild')[0], zf = bildFlaeche(zQuelle), zOriginal = zf.bild.src;
      var objQ = zQuelle && zQuelle.querySelector('img[data-objekt]');
      var obj = el('div', 'fe-objekt'); obj.tabIndex = 0; obj.setAttribute('role', 'button'); obj.setAttribute('aria-label', 'Objekt zum Ziehen');
      if (objQ) { var oImg = document.createElement('img'); oImg.src = objQ.getAttribute('src'); oImg.alt = objQ.getAttribute('alt') || ''; oImg.draggable = false; obj.appendChild(oImg); }
      else obj.textContent = '📍';
      var objPlatz = el('div', 'fe-objekt-platz'); objPlatz.appendChild(obj);
      var zStelle = -1;
      zf.bereiche.forEach(function (d) { d.classList.add('ziel'); d.tabIndex = 0; d.setAttribute('role', 'button'); d.setAttribute('aria-label', 'Stelle ' + (d.feT + 1)); });
      var zSetzen = function (t) {
        if (ctrl.gesperrt || t < 0) return;
        leeren(); zStelle = t; objPlatz.hidden = true;   // Ablage unter dem Bild wird nicht mehr gebraucht
        zf.bereiche.forEach(function (d) { d.classList.remove('an', 'ok', 'nok'); });
        alle(zf.flaeche, '.fe-loes-feld').forEach(function (x) { x.remove(); });
        var d = zf.bereiche[t]; d.classList.add('an');
        if (d.feTausch) { zf.bild.src = d.feTausch; obj.hidden = true; objPlatz.appendChild(obj); }   // Austauschbild zeigt das Ergebnis
        else { zf.bild.src = zOriginal; obj.hidden = false; d.appendChild(obj); }
        pruefKnopf.disabled = false;
      };
      zf.bereiche.forEach(function (d) {
        d.addEventListener('click', function () { zSetzen(d.feT); });
        d.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); zSetzen(d.feT); } });
      });
      ziehbarMachen(obj, {
        gesperrt: function () { return ctrl.gesperrt; },
        zielUnter: function (x, y) { return treffer(x, y, zf.bereiche); },
        ablegen: function (d) { zSetzen(d.feT); },
        tippen: function () { }
      });
      feld.appendChild(zf.flaeche); feld.appendChild(objPlatz);
      pruefKnopf.disabled = true;
      ctrl.antwort = function () { return zStelle < 0 ? '' : 'Stelle ' + (zStelle + 1); };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        if (zStelle < 0) { melden('info', T.erstZiehen); return; }
        var richtig = hashes.indexOf(H('s' + zStelle)) >= 0;
        if (zeigen) zf.bereiche[zStelle].classList.add(richtig ? 'ok' : 'nok');
        if (zeigen && !richtig && loesungDa) zf.bereiche.forEach(function (d) {
          if (hashes.indexOf(H('s' + d.feT)) < 0) return;
          var z = el('div', 'fe-loes-feld'); z.style.left = d.style.left; z.style.top = d.style.top; z.style.width = d.style.width; z.style.height = d.style.height; zf.flaeche.appendChild(z);
        });
        ergebnis(richtig);
        if (ctrl.gesperrt) { obj.style.cursor = 'default'; zf.bereiche.forEach(function (d) { d.style.cursor = 'default'; }); }
      });
    }

    // ── Bereiche im Bild anwählen (bildwahl) bzw. der Reihe nach antippen (bildfolge) ──
    // Prüfsumme bildwahl: H('w' + Nummern der richtigen Bereiche, aufsteigend) · bildfolge: H('f' + Nummern in richtiger Reihenfolge)
    else if (typ === 'bildwahl' || typ === 'bildfolge') {
      var folge = typ === 'bildfolge';
      hinweis.textContent = folge ? T.hBildfolge : T.hBildwahl;
      var wf = bildFlaeche(kinderMit(f, 'data-wahlbild')[0]);
      var wAktiv = wf.bereiche.filter(function (d) { return !d.classList.contains('inaktiv'); });
      var wGew = [];
      var wZeichnen = function () {
        wf.bereiche.forEach(function (d) {
          var p = wGew.indexOf(d.feT);
          d.classList.toggle('an', p >= 0); d.classList.remove('ok', 'nok');
          alle(d, '.fe-zielnr').forEach(function (x) { x.remove(); });
          if (folge && p >= 0) d.appendChild(el('span', 'fe-zielnr', String(p + 1)));
          if (!folge && !d.classList.contains('inaktiv')) d.setAttribute('aria-checked', p >= 0 ? 'true' : 'false');
        });
        alle(wf.flaeche, '.fe-loes-feld').forEach(function (x) { x.remove(); });
        pruefKnopf.disabled = ctrl.gesperrt || !wGew.length;
      };
      wAktiv.forEach(function (d) {
        d.tabIndex = 0; d.setAttribute('role', folge ? 'button' : 'checkbox'); d.setAttribute('aria-label', 'Bereich ' + (d.feT + 1));
        var tun = function () {
          if (ctrl.gesperrt) return;
          leeren();
          var p = wGew.indexOf(d.feT);
          if (p >= 0) wGew.splice(p, folge ? wGew.length - p : 1); else wGew.push(d.feT);
          wZeichnen();
        };
        d.addEventListener('click', tun);
        d.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tun(); } });
      });
      feld.appendChild(wf.flaeche);
      if (folge) {
        var wZurueck = el('button', 'fe-knopf zweit', T.zuruecksetzen); wZurueck.type = 'button';
        wZurueck.addEventListener('click', function () { if (ctrl.gesperrt) return; leeren(); wGew = []; wZeichnen(); });
        knoepfe.appendChild(wZurueck);
      }
      ctrl.antwort = function () {
        return folge ? wGew.map(function (t) { return t + 1; }).join(' → ')
          : 'Bereiche ' + wGew.slice().sort(function (a, b) { return a - b; }).map(function (t) { return t + 1; }).join(', ');
      };
      pruefKnopf.addEventListener('click', function () {
        if (ctrl.gesperrt) return;
        if (!wGew.length) { melden('info', T.erstWaehlen); return; }
        if (folge && wGew.length < wAktiv.length) { melden('info', T.alleFolge); return; }
        var richtig = folge ? H('f' + wGew.join(',')) === hashes[0]
          : H('w' + wGew.slice().sort(function (a, b) { return a - b; }).join(',')) === hashes[0];
        var lsg = zeigen && !richtig && loesungDa ? loesung() : null;
        wf.bereiche.forEach(function (d) {
          var p = wGew.indexOf(d.feT);
          if (!zeigen) return;
          if (richtig) { if (p >= 0) d.classList.add('ok'); return; }
          if (!lsg) { if (p >= 0) d.classList.add('nok'); return; }
          if (folge) {
            var soll = lsg.indexOf(d.feT);
            if (p >= 0) d.classList.add(p === soll ? 'ok' : 'nok');
            if (soll >= 0 && p !== soll) d.appendChild(el('span', 'fe-zielnr loes', String(soll + 1)));
          } else {
            var sollW = lsg.indexOf(d.feT) >= 0;
            if (p >= 0) d.classList.add(sollW ? 'ok' : 'nok');
            else if (sollW) { var z = el('div', 'fe-loes-feld'); z.style.left = d.style.left; z.style.top = d.style.top; z.style.width = d.style.width; z.style.height = d.style.height; wf.flaeche.appendChild(z); }
          }
        });
        ergebnis(richtig);
        if (ctrl.gesperrt) { wf.bereiche.forEach(function (d) { d.style.cursor = 'default'; }); if (folge) wZurueck.disabled = true; }
      });
      wZeichnen();
    }

    // ── Umfrage mit freiem Text ──
    else if (umfrage) {
      hinweis.textContent = T.hFrei;
      var frei = document.createElement('textarea'); frei.className = 'fe-frei'; frei.maxLength = 250; frei.setAttribute('aria-label', 'Deine Antwort');
      feld.appendChild(frei);
      pruefKnopf.disabled = true;
      frei.addEventListener('input', function () { pruefKnopf.disabled = ctrl.gesperrt || !frei.value.trim(); });
      ctrl.antwort = function () { return frei.value.trim(); };
      pruefKnopf.addEventListener('click', function () { if (ctrl.gesperrt || !frei.value.trim()) return; ergebnis(null); frei.readOnly = true; });
    }

    if (ctrl.geloest && umfrage && !opt.einmal) {
      ctrl.gesperrt = true; pruefKnopf.disabled = true;
      alle(ui, 'button,textarea,input').forEach(function (x) { x.disabled = true; });
      melden('ok', T.schonTeilgenommen);
    }
    else if (ctrl.geloest && !opt.einmal) melden('ok', T.schonGeloest);
    return ctrl;
  }

  // ══ INTERAKTIVE BAUSTEINE ══════════════════════════════════════════════════
  // <div data-lm-ia="reiter|karten|hotspots|ablauf|galerie|vergleich|glossar|szenario|simulation"> … </div>
  // Ohne diese Engine bleibt der Inhalt vollständig lesbar (alles untereinander).
  // Mit der Engine wird er interaktiv. Es wird nichts kopiert, nur ein- und ausgeblendet.
  var B_CSS =
    '[data-lm-ia]{--ia-a:var(--hauptfarbe,#2b5d8a);margin:16px 0}.ia-knopf{font:inherit;font-weight:700;font-size:14px;color:var(--ia-a);background:#fff;border:2px solid var(--ia-a);border-radius:999px;padding:7px 16px;cursor:pointer}.ia-knopf.voll{color:#fff;background:var(--ia-a)}.ia-knopf[disabled]{opacity:.4;cursor:default}' +
    '.ia-hinweis{font-size:12px;color:#777;margin:0 0 8px}' +
    // Reiter
    '.ia-aktiv[data-lm-ia=reiter] [data-ia-titel]{display:none}.ia-reiter{display:flex;flex-wrap:wrap;gap:6px;border-bottom:2px solid #e3e3e3;margin-bottom:12px}.ia-tab{font:inherit;font-weight:700;font-size:14px;color:#555;background:none;border:0;border-bottom:3px solid transparent;margin-bottom:-2px;padding:8px 14px;cursor:pointer}.ia-tab.an{color:var(--ia-a);border-bottom-color:var(--ia-a)}' +
    // Klappkarten
    '.ia-aktiv[data-lm-ia=karten]>.ia-karten{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}.ia-karte{min-height:120px;border:2px solid var(--ia-a);border-radius:14px;padding:14px;background:#fff;cursor:pointer;display:flex;flex-direction:column;justify-content:center;text-align:center;transition:transform .25s}.ia-karte:hover{transform:translateY(-2px)}.ia-karte [data-ia-hinten]{display:none}.ia-karte.um{background:var(--ia-a);color:#fff}.ia-karte.um [data-ia-vorne]{display:none}.ia-karte.um [data-ia-hinten]{display:block}.ia-karte img{max-width:100%;max-height:110px;object-fit:contain;margin:0 auto 6px}.ia-karte [data-ia-vorne]{font-weight:700}' +
    // Info-Punkte
    '.ia-hs-bild{position:relative;display:inline-block;max-width:100%;line-height:0}.ia-hs-bild img{display:block;max-width:100%;height:auto;border-radius:10px}.ia-punkt{position:absolute;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;border:3px solid #fff;background:var(--ia-a);color:#fff;font:700 13px Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.35);animation:ia-puls 2s infinite}.ia-punkt.an{background:#fff;color:var(--ia-a);border-color:var(--ia-a);animation:none}@keyframes ia-puls{50%{box-shadow:0 0 0 7px rgba(255,255,255,.35)}}' +
    '.ia-hs-text{border-left:4px solid var(--ia-a);background:#f6f6f6;border-radius:10px;padding:10px 14px;margin-top:10px}.ia-aktiv[data-lm-ia=hotspots] [data-ia-nr]{display:none}' +
    '.ia-hs-text img[data-ia-teilbild]{display:block;max-width:100%;max-height:360px;width:auto;height:auto;border-radius:8px;margin:6px 0 8px}' +
    // Ablauf und Zeitstrahl
    '.ia-ablauf-kopf{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px;font-weight:700;color:var(--ia-a)}.ia-punkte{display:flex;gap:5px}.ia-punkte span{width:10px;height:10px;border-radius:50%;background:#ddd}.ia-punkte span.an{background:var(--ia-a)}.ia-ablauf-fuss{display:flex;justify-content:space-between;margin-top:12px}.ia-aktiv[data-lm-ia=ablauf]:not([data-art=zeitstrahl]) [data-ia-teil]{border:2px solid #e6e6e6;border-radius:14px;padding:14px 16px;background:#fff}' +
    '[data-lm-ia=ablauf][data-art=zeitstrahl] [data-ia-teil]{position:relative;padding:0 0 16px 30px;border-left:3px solid var(--ia-a);margin-left:10px}[data-lm-ia=ablauf][data-art=zeitstrahl] [data-ia-teil]:last-child{border-left-color:transparent}[data-lm-ia=ablauf][data-art=zeitstrahl] [data-ia-teil]::before{content:"";position:absolute;left:-10px;top:0;width:17px;height:17px;border-radius:50%;background:var(--ia-a);border:3px solid #fff;box-shadow:0 0 0 2px var(--ia-a)}' +
    // Galerie
    '.ia-gal{position:relative;text-align:center}.ia-aktiv[data-lm-ia=galerie] figure{margin:0}.ia-aktiv[data-lm-ia=galerie] img{max-width:100%;max-height:420px;border-radius:10px}.ia-gal-leiste{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:8px;font-size:13px;color:#666}' +
    // Vorher/Nachher
    '.ia-vgl{position:relative;display:inline-block;max-width:100%;line-height:0;user-select:none}.ia-vgl img{display:block;max-width:100%;height:auto;border-radius:10px}.ia-vgl .ia-oben{position:absolute;inset:0;overflow:hidden}.ia-vgl .ia-oben img{width:100%;height:100%;object-fit:cover}.ia-vgl .ia-linie{position:absolute;top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 4px rgba(0,0,0,.5);pointer-events:none}.ia-vgl .ia-marke{position:absolute;top:8px;font:700 12px Arial,sans-serif;color:#fff;background:rgba(0,0,0,.55);padding:3px 8px;border-radius:999px;line-height:1.3}.ia-vgl input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}' +
    '.ia-aktiv[data-lm-ia=vergleich]>figure{display:none}' +
    // Glossar
    '.ia-gl-suche{font:inherit;font-size:14px;width:100%;max-width:340px;padding:8px 12px;border:2px solid #ddd;border-radius:999px;margin-bottom:10px}[data-lm-ia=glossar] dt{font-weight:700;color:var(--ia-a);margin-top:10px}[data-lm-ia=glossar] dd{margin:2px 0 0 0;padding-left:12px;border-left:3px solid #e3e3e3}.ia-gl-leer{color:#888;font-size:14px}' +
    // Fallszenario
    '[data-lm-ia=szenario].ia-aktiv{border:2px solid var(--ia-a);border-radius:16px;padding:14px 16px;background:#fff}.ia-aktiv[data-lm-ia=szenario] [data-ia-wahl],.ia-aktiv[data-lm-ia=szenario] [data-ia-nr]{display:none}' +
    '[data-lm-ia=szenario] [data-person-zeile]{display:flex;align-items:center;gap:8px;margin-bottom:8px}[data-lm-ia=szenario] [data-person-name]{display:inline-block;font-size:13px;font-weight:700;background:#f1f1f1;border-radius:999px;padding:3px 10px}[data-lm-ia=szenario] [data-person-name]::before{content:"🗨 "}[data-lm-ia=szenario] img[data-person-bild]{width:30px;height:30px;border-radius:50%;object-fit:cover;flex:none;display:block}[data-lm-ia=szenario] img[data-ia-bild]{display:block;max-width:100%;max-height:360px;border-radius:10px;margin:6px 0}' +
    '.ia-sz-kopf{font-size:12px;font-weight:700;letter-spacing:.4px;color:var(--ia-a);text-transform:uppercase;margin-bottom:6px}.ia-sz-wahl{display:flex;flex-direction:column;gap:8px;margin-top:12px}.ia-sz-opt{text-align:left;border-radius:12px;padding:10px 14px;font-size:15px}.ia-sz-opt:hover{background:var(--ia-a);color:#fff}' +
    '.ia-sz-rueck{border-radius:12px;padding:10px 14px;margin-top:12px;border-left:5px solid #888;background:#f4f4f4}.ia-sz-rueck.gut,.ia-sz-ende.gut{border-left:5px solid #1d7a4a;background:#e3f3ea}.ia-sz-rueck.schlecht,.ia-sz-ende.schlecht{border-left:5px solid #b3261e;background:#fbe8e7}' +
    '.ia-sz-ende{border-radius:12px;padding:12px 14px;font-weight:700;border-left:5px solid #888;background:#f4f4f4}.ia-sz-bilanz{font-size:13px;color:#555;font-weight:400;margin-top:4px}' +
    // Software-Simulation
    '.ia-sim-bild{position:relative;display:inline-block;max-width:100%;line-height:0;cursor:crosshair}.ia-sim-bild img{display:block;max-width:100%;height:auto;border-radius:10px}' +
    '.ia-sim-marke{position:absolute;border:3px solid var(--ia-a);border-radius:8px;background:rgba(255,255,255,.18);pointer-events:none;animation:ia-sim-puls 1.6s infinite}' +
    '.ia-sim-marke.ia-sim-ok{border-color:#1d7a4a;background:rgba(29,122,74,.22);animation:none}.ia-sim-marke.ia-sim-falsch{border-color:#b3261e;animation:ia-sim-shake .4s}' +
    '.ia-sim-marke.ia-sim-geloest-falsch{border-color:#b3261e;background:rgba(179,38,30,.18);animation:none}' +
    '@keyframes ia-sim-puls{50%{background:rgba(255,255,255,.4)}}@keyframes ia-sim-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}' +
    '.ia-sim-ok-text{color:#1d7a4a;font-weight:700}.ia-sim-fehler-text{color:#b3261e;font-weight:700}' +
    // Freie Folie
    '[data-lm-ia=folie]{margin:8px 0}[data-lm-ia=folie] [data-folie-text] p,[data-lm-ia=folie] [data-folie-text] h3,[data-lm-ia=folie] [data-folie-text] h4{margin:0}[data-lm-ia=folie] [data-folie-text] ul,[data-lm-ia=folie] [data-folie-text] ol{margin:0;padding-left:1.3em}[data-lm-ia=folie] [data-folie-text] li{margin:0}[data-lm-ia=folie] [data-folie-text] table{border-collapse:collapse;width:100%}' +
    '[data-lm-ia=folie] .ia-fo-weg{visibility:hidden}.ia-fo-sr{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;margin:-1px!important;padding:0!important;border:0!important}' +
    '.ia-fo-weiter{position:absolute;right:1.5%;bottom:2.5%;z-index:50;font:inherit;font-size:max(13px,1.5cqw);font-weight:700;line-height:1;color:#fff;background:var(--ia-a);border:2px solid #fff;border-radius:999px;padding:.45em .95em;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}.ia-fo-weiter:focus-visible{outline:3px solid #000;outline-offset:2px}' +
    '@keyframes ia-fo-einblenden{from{opacity:0}}@keyframes ia-fo-links{from{opacity:0;translate:-40cqw 0}}@keyframes ia-fo-rechts{from{opacity:0;translate:40cqw 0}}@keyframes ia-fo-unten{from{opacity:0;translate:0 30cqw}}@keyframes ia-fo-oben{from{opacity:0;translate:0 -30cqw}}' +
    '@keyframes ia-fo-zoom{from{opacity:0;scale:.2}}@keyframes ia-fo-wischen{from{clip-path:inset(-60cqw 100% -60cqw -60cqw)}to{clip-path:inset(-60cqw -60cqw -60cqw -60cqw)}}' +
    // Freie Folie mit Zeitleiste: Abspielleiste unter der Folie, Pausenpunkt wartet auf Klick
    '.ia-fo-zl{--ia-a:var(--hauptfarbe,#2b5d8a);display:flex;align-items:center;gap:10px;margin:6px 0 2px;font-size:14px;line-height:1}.ia-fo-zl-knopf{flex:none;font:inherit;font-weight:700;min-width:2.6em;padding:.5em .75em;color:#fff;background:var(--ia-a);border:0;border-radius:6px;cursor:pointer}' +
    '.ia-fo-zl-knopf:focus-visible,.ia-fo-zl-regler:focus-visible{outline:3px solid #000;outline-offset:2px}.ia-fo-zl-regler{flex:1;min-width:80px;margin:0;accent-color:var(--ia-a)}.ia-fo-zl-zeit{flex:none;min-width:6.5em;text-align:right;font-variant-numeric:tabular-nums;color:#555}' +
    '[data-lm-ia=folie] .ia-fo-wartet{cursor:pointer;outline:3px solid var(--ia-a);outline-offset:3px;animation:ia-fo-puls 1.3s ease-in-out infinite}[data-lm-ia=folie] .ia-fo-wartet:focus-visible{outline-color:#000}@keyframes ia-fo-puls{50%{outline-color:transparent}}' +
    '@media (prefers-reduced-motion:reduce){[data-lm-ia=folie] [data-ia-teil]{animation-duration:.01s!important;animation-delay:0s!important}}';
  function bStil() {
    if (document.getElementById('ia-stil')) return;
    var s = document.createElement('style'); s.id = 'ia-stil'; s.textContent = B_CSS; (document.head || document.documentElement).appendChild(s);
  }
  function knopf(text, klasse, fn) { var b = el('button', 'ia-knopf' + (klasse ? ' ' + klasse : ''), text); b.type = 'button'; b.onclick = fn; return b; }
  var BAU = {
    reiter: function (b) {
      var teile = kinderMit(b, 'data-ia-teil'), leiste = el('div', 'ia-reiter'); leiste.setAttribute('role', 'tablist');
      var tabs = teile.map(function (t, i) {
        var ti = t.querySelector('[data-ia-titel]'), k = el('button', 'ia-tab', ti ? ti.innerHTML : 'Teil ' + (i + 1));
        k.type = 'button'; k.setAttribute('role', 'tab'); k.onclick = function () { zeige(i); }; leiste.appendChild(k); return k;
      });
      function zeige(i) { teile.forEach(function (t, j) { t.hidden = i !== j; tabs[j].classList.toggle('an', i === j); tabs[j].setAttribute('aria-selected', String(i === j)); }); }
      b.insertBefore(leiste, b.firstChild); zeige(0);
    },
    karten: function (b) {
      var gitter = el('div', 'ia-karten');
      b.appendChild(el('p', 'ia-hinweis', 'Karte antippen zum Umdrehen.'));
      kinderMit(b, 'data-ia-teil').forEach(function (t) {
        t.classList.add('ia-karte'); t.tabIndex = 0; t.setAttribute('role', 'button');
        var um = function () { t.classList.toggle('um'); };
        t.addEventListener('click', um); t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); um(); } });
        gitter.appendChild(t);
      });
      b.appendChild(gitter);
    },
    hotspots: function (b) {
      var img = b.querySelector('img[data-ia-bild]'); if (!img) return;
      var rahmen = el('div', 'ia-hs-bild'), text = el('div', 'ia-hs-text'), teile = kinderMit(b, 'data-ia-teil');
      img.parentNode.insertBefore(rahmen, img); rahmen.appendChild(img);
      b.insertBefore(el('p', 'ia-hinweis', 'Auf die Punkte im Bild tippen.'), rahmen);
      text.hidden = true; rahmen.parentNode.insertBefore(text, rahmen.nextSibling);
      var punkte = teile.map(function (t, i) {
        t.hidden = true; text.appendChild(t);
        var p = el('button', 'ia-punkt', String(i + 1)); p.type = 'button';
        var ti = t.querySelector('[data-ia-titel]'); p.title = ti ? ti.textContent : ''; p.setAttribute('aria-label', 'Punkt ' + (i + 1) + (p.title ? ': ' + p.title : ''));
        p.style.left = (parseFloat(t.getAttribute('data-x')) || 50) + '%'; p.style.top = (parseFloat(t.getAttribute('data-y')) || 50) + '%';
        p.onclick = function () { var offen = !t.hidden; teile.forEach(function (x, j) { x.hidden = true; punkte[j].classList.remove('an'); }); if (!offen) { t.hidden = false; p.classList.add('an'); } text.hidden = offen; };
        rahmen.appendChild(p); return p;
      });
    },
    ablauf: function (b) {
      if (b.getAttribute('data-art') === 'zeitstrahl') return;
      var teile = kinderMit(b, 'data-ia-teil'), n = teile.length, akt = 0; if (!n) return;
      var kopf = el('div', 'ia-ablauf-kopf'), zahl = el('span', ''), punkte = el('div', 'ia-punkte'), fuss = el('div', 'ia-ablauf-fuss');
      teile.forEach(function () { punkte.appendChild(el('span', '')); });
      kopf.appendChild(zahl); kopf.appendChild(punkte);
      var zur = knopf('← Zurück', '', function () { zeige(akt - 1); }), wei = knopf('Weiter →', 'voll', function () { zeige(akt + 1); });
      fuss.appendChild(zur); fuss.appendChild(wei);
      function zeige(i) { akt = Math.max(0, Math.min(n - 1, i)); teile.forEach(function (t, j) { t.hidden = j !== akt; punkte.children[j].className = j <= akt ? 'an' : ''; }); zahl.textContent = 'Schritt ' + (akt + 1) + ' von ' + n; zur.disabled = akt === 0; wei.disabled = akt === n - 1; }
      b.insertBefore(kopf, b.firstChild); b.appendChild(fuss); zeige(0);
    },
    // Software-Simulation: Screenshot je Schritt mit einem Klickziel. Modus steuert, ob geklickt werden muss
    // (zeigen = nein, üben/testen = ja) und ob bei Fehlversuchen geholfen wird (üben) oder nicht (testen).
    // Am Ende meldet der Baustein das Ergebnis als Ereignis „lm-simulation“ (der Kurs-Player gibt es an Moodle weiter).
    simulation: function (b) {
      var teile = kinderMit(b, 'data-ia-teil'), n = teile.length; if (!n) return;
      var modus = b.getAttribute('data-modus') || 'zeigen', akt = 0, richtig = teile.map(function () { return modus === 'zeigen'; });
      // Im Testen-Modus zählt nur der erste Klick je Schritt – ein Fehlklick gilt endgültig als „falsch“,
      // man kommt aber trotzdem weiter (sonst könnte man gar nicht durchfallen).
      var versucht = teile.map(function () { return false; });
      var kopf = el('div', 'ia-ablauf-kopf'), zahl = el('span', ''), punkte = el('div', 'ia-punkte'), hinweis = el('p', 'ia-hinweis', ''), fuss = el('div', 'ia-ablauf-fuss');
      teile.forEach(function () { punkte.appendChild(el('span', '')); });
      kopf.appendChild(zahl); kopf.appendChild(punkte);
      var zur = knopf('← Zurück', '', function () { zeige(akt - 1); }), wei = knopf('Weiter →', 'voll', weiter);
      fuss.appendChild(zur); fuss.appendChild(wei);
      b.insertBefore(kopf, b.firstChild); b.insertBefore(hinweis, teile[0]); b.appendChild(fuss);
      teile.forEach(function (t, i) {
        var img = t.querySelector('img[data-ia-bild]'); if (!img) return;
        var rahmen = el('div', 'ia-sim-bild');
        img.parentNode.insertBefore(rahmen, img); rahmen.appendChild(img);
        var x = parseFloat(t.getAttribute('data-x')) || 50, y = parseFloat(t.getAttribute('data-y')) || 50;
        var bw = parseFloat(t.getAttribute('data-b')) || 14, bh = parseFloat(t.getAttribute('data-h')) || 10;
        var marke = el('div', 'ia-sim-marke');
        marke.style.left = (x - bw / 2) + '%'; marke.style.top = (y - bh / 2) + '%'; marke.style.width = bw + '%'; marke.style.height = bh + '%';
        rahmen.appendChild(marke);
        rahmen.addEventListener('click', function (ev) {
          if (i !== akt || richtig[i]) return;
          if (modus === 'testen' && versucht[i]) return;   // im Testen-Modus ist der eine Versuch schon verbraucht
          var r = rahmen.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width * 100, py = (ev.clientY - r.top) / r.height * 100;
          var ok = px >= x - bw / 2 && px <= x + bw / 2 && py >= y - bh / 2 && py <= y + bh / 2;
          if (modus === 'testen') versucht[i] = true;
          if (ok) {
            richtig[i] = true; marke.classList.add('ia-sim-ok');
            hinweis.textContent = '✓ Richtig!'; hinweis.className = 'ia-hinweis ia-sim-ok-text';
            wei.disabled = false;
          } else {
            marke.classList.remove('ia-sim-falsch'); void marke.offsetWidth; marke.classList.add('ia-sim-falsch');
            hinweis.textContent = modus === 'testen' ? '✗ Das war nicht die richtige Stelle.' : '✗ Versuch es noch einmal – die markierte Stelle ist richtig.';
            hinweis.className = 'ia-hinweis ia-sim-fehler-text';
            if (modus === 'testen') { marke.classList.add('ia-sim-geloest-falsch'); wei.disabled = false; }
          }
        });
      });
      function zeige(i) {
        akt = Math.max(0, Math.min(n - 1, i));
        teile.forEach(function (t, j) { t.hidden = j !== akt; punkte.children[j].className = j <= akt ? 'an' : ''; });
        zahl.textContent = 'Schritt ' + (akt + 1) + ' von ' + n;
        zur.disabled = akt === 0;
        if (modus === 'testen' && versucht[akt]) {
          hinweis.textContent = richtig[akt] ? '✓ Richtig!' : '✗ Das war nicht die richtige Stelle.';
          hinweis.className = 'ia-hinweis ' + (richtig[akt] ? 'ia-sim-ok-text' : 'ia-sim-fehler-text');
        } else {
          hinweis.textContent = modus === 'zeigen' ? 'Beobachte die markierte Stelle.' : 'Klicke auf die markierte Stelle im Bild.';
          hinweis.className = 'ia-hinweis';
        }
        wei.textContent = akt === n - 1 ? 'Fertig' : 'Weiter →';
        wei.disabled = modus === 'testen' ? !(richtig[akt] || versucht[akt]) : !richtig[akt];
      }
      function weiter() {
        if (akt === n - 1) {
          var alleRichtig = richtig.every(function (x) { return x; }), titelEl = teile[0].querySelector('h4[data-ia-titel]');
          try { b.dispatchEvent(new CustomEvent('lm-simulation', { bubbles: true, detail: { titel: titelEl ? titelEl.textContent.replace(/^\d+\.\s*/, '') : 'Simulation', modus: modus, bestanden: alleRichtig } })); } catch (e) { }
          return;
        }
        zeige(akt + 1);
      }
      zeige(0);
    },
    galerie: function (b) {
      var bilder = kinderMit(b, 'data-ia-teil'), n = bilder.length, akt = 0; if (!n) return;
      var leiste = el('div', 'ia-gal-leiste'), zahl = el('span', '');
      var zur = knopf('‹', '', function () { zeige(akt - 1); }), wei = knopf('›', '', function () { zeige(akt + 1); });
      zur.setAttribute('aria-label', 'vorheriges Bild'); wei.setAttribute('aria-label', 'nächstes Bild');
      leiste.appendChild(zur); leiste.appendChild(zahl); leiste.appendChild(wei);
      function zeige(i) { akt = (i + n) % n; bilder.forEach(function (f, j) { f.hidden = j !== akt; }); zahl.textContent = (akt + 1) + ' / ' + n; }
      b.classList.add('ia-gal'); b.appendChild(leiste); zeige(0);
    },
    vergleich: function (b) {
      var vor = b.querySelector('[data-ia-vorher] img'), nach = b.querySelector('[data-ia-nachher] img'); if (!vor || !nach) return;
      var tv = b.querySelector('[data-ia-vorher] figcaption'), tn = b.querySelector('[data-ia-nachher] figcaption');
      var box = el('div', 'ia-vgl'), unten = nach.cloneNode(), oben = el('div', 'ia-oben'), linie = el('div', 'ia-linie'), regler = document.createElement('input');
      oben.appendChild(vor.cloneNode()); regler.type = 'range'; regler.min = 0; regler.max = 100; regler.value = 50; regler.setAttribute('aria-label', 'Vorher/Nachher verschieben');
      var mv = el('span', 'ia-marke', tv ? tv.textContent : 'Vorher'), mn = el('span', 'ia-marke', tn ? tn.textContent : 'Nachher'); mv.style.left = '8px'; mn.style.right = '8px';
      [unten, oben, linie, mv, mn, regler].forEach(function (x) { box.appendChild(x); });
      function setzen() { var p = regler.value + '%'; oben.style.clipPath = 'inset(0 ' + (100 - regler.value) + '% 0 0)'; linie.style.left = p; }
      regler.addEventListener('input', setzen); setzen();
      b.appendChild(el('p', 'ia-hinweis', 'Schieberegler im Bild nach links oder rechts ziehen.')); b.appendChild(box);
    },
    glossar: function (b) {
      var dl = b.querySelector('dl'); if (!dl) return;
      var suche = document.createElement('input'), leer = el('p', 'ia-gl-leer', 'Kein Begriff gefunden.');
      suche.type = 'search'; suche.className = 'ia-gl-suche'; suche.placeholder = 'Begriff suchen …'; leer.hidden = true;
      suche.addEventListener('input', function () {
        var q = suche.value.trim().toLowerCase(), treffer = 0;
        alle(dl, 'dt').forEach(function (dt) { var dd = dt.nextElementSibling, ok = !q || (dt.textContent + ' ' + (dd ? dd.textContent : '')).toLowerCase().indexOf(q) >= 0; dt.hidden = !ok; if (dd && dd.tagName === 'DD') dd.hidden = !ok; if (ok) treffer++; });
        leer.hidden = treffer > 0;
      });
      b.insertBefore(suche, dl); b.appendChild(leer);
    },
    // Fallszenario: eine Szene nach der anderen; jede Entscheidung führt zur Szene in data-ziel.
    // Am Ende meldet der Baustein das Ergebnis als Ereignis „lm-szenario“ (der Kurs-Player gibt es an Moodle weiter).
    szenario: function (b) {
      var teile = kinderMit(b, 'data-ia-teil'); if (!teile.length) return;
      var nachId = {}; teile.forEach(function (t) { nachId[t.getAttribute('data-id')] = t; });
      var kopf = el('div', 'ia-sz-kopf'), rueck = el('div', 'ia-sz-rueck'), wahlBox = el('div', 'ia-sz-wahl'), weg, bilanz;
      var WERT = { gut: 'Gute Entscheidung.', neutral: '', schlecht: 'Keine gute Entscheidung.' };
      var ENDE = { gut: '✓ Gut gelöst!', neutral: 'Ende des Szenarios.', schlecht: '✗ Das ist nicht gut ausgegangen.' };
      rueck.hidden = true;
      b.insertBefore(kopf, teile[0]); b.appendChild(rueck); b.appendChild(wahlBox);
      var titelVon = function (t) { var h = t.querySelector('[data-ia-titel]'); if (!h) return ''; var c = h.cloneNode(true); alle(c, '[data-ia-nr]').forEach(function (x) { x.remove(); }); return c.textContent.trim(); };
      function zeige(t) {
        teile.forEach(function (x) { x.hidden = x !== t; });
        weg.push(titelVon(t));
        kopf.textContent = weg.length === 1 ? '▶ Fallszenario' : 'Fallszenario · Entscheidung ' + (weg.length - 1);
        wahlBox.innerHTML = '';
        var ende = t.getAttribute('data-ende');
        if (ende) {
          var teile2 = []; if (bilanz.gut) teile2.push(bilanz.gut + ' gut'); if (bilanz.neutral) teile2.push(bilanz.neutral + ' neutral'); if (bilanz.schlecht) teile2.push(bilanz.schlecht + ' schlecht');
          var box = el('div', 'ia-sz-ende ' + ende, ENDE[ende] || ENDE.neutral);
          if (teile2.length) box.appendChild(el('div', 'ia-sz-bilanz', 'Deine Entscheidungen: ' + teile2.join(' · ')));
          wahlBox.appendChild(box);
          wahlBox.appendChild(knopf('↺ Noch einmal von vorn', '', start));
          try { b.dispatchEvent(new CustomEvent('lm-szenario', { bubbles: true, detail: { titel: titelVon(teile[0]), ende: ende, weg: weg.slice(), bilanz: bilanz } })); } catch (e) { }
          return;
        }
        alle(t, '[data-ia-wahl] > li').forEach(function (li) {
          var txt = li.querySelector('[data-ia-wahltext]');
          wahlBox.appendChild(knopf(txt ? txt.innerHTML : li.textContent, 'ia-sz-opt', function () {
            var w = WERT.hasOwnProperty(li.getAttribute('data-wert')) ? li.getAttribute('data-wert') : 'neutral', r = li.querySelector('[data-ia-rueck]'), ziel = nachId[li.getAttribute('data-ziel')];
            bilanz[w]++;
            if (r || WERT[w]) {
              rueck.className = 'ia-sz-rueck ' + w; rueck.innerHTML = (WERT[w] ? '<b>' + WERT[w] + '</b> ' : '') + (r ? r.innerHTML : ''); rueck.hidden = false;
              wahlBox.innerHTML = ''; var k = knopf('Weiter →', 'voll', function () { rueck.hidden = true; if (ziel) zeige(ziel); }); wahlBox.appendChild(k); k.focus();
            } else if (ziel) zeige(ziel);
          }));
        });
        try { if (weg.length > 1) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { }
      }
      function start() { weg = []; bilanz = { gut: 0, neutral: 0, schlecht: 0 }; rueck.hidden = true; zeige(teile[0]); }
      start();
    }
  };
  // Freie Folie mit Zeitleiste: Eine Uhr läuft von 0 bis zur Foliendauer. Sichtbar ist jedes Element mit
  // start ≤ t < start + dauer (dauer fehlt = bis Folienende). Der Zustand zu jedem Zeitpunkt wird direkt berechnet,
  // deshalb kann man mit dem Regler springen, ohne alles davor abzuspielen. Pausenpunkte halten die Uhr an,
  // bis die Lernenden auf das Element klicken (oder Enter drücken). Eine Tonspur läuft synchron mit.
  function folieZeitleiste(b, teile, props, zeit) {
    var fd = Math.max(1, +zeit.dauer || 10), ruhig = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var ton = kinderMit(b, 'data-folie-ton')[0] || null;
    var E = teile.map(function (t) {
      var z = props(t).z || {}, s = Math.min(fd, Math.max(0, +z.start || 0));
      var ende = z.dauer == null ? fd : Math.min(fd, s + Math.max(0.1, +z.dauer || 0));
      return { t: t, s: s, e: ende, ein: z.ein || '', einD: Math.max(0.05, +z.einD || 0.5), aus: z.aus || '', ausD: Math.max(0.05, +z.ausD || 0.5), pause: !!z.pause, o0: t.style.opacity || '' };
    });
    var pausen = E.filter(function (x) { return x.pause; }).map(function (x) { return { x: x, zeit: Math.min(x.e, x.s + (x.ein ? x.einD : 0)), frei: false }; })
      .sort(function (a, c) { return a.zeit - c.zeit; });
    var t = 0, laeuft = false, letzt = null, wartet = null, raf = 0;
    var anw = function (r, art, p, W) {
      var q = 1 - Math.pow(1 - Math.max(0, Math.min(1, p)), 3);
      if (art === 'wischen') { r.clip = 'inset(0 ' + ((1 - q) * 100).toFixed(1) + '% 0 0)'; return; }
      r.o *= q;
      if (art === 'links') r.dx -= 0.4 * W * (1 - q); else if (art === 'rechts') r.dx += 0.4 * W * (1 - q);
      else if (art === 'unten') r.dy += 0.3 * W * (1 - q); else if (art === 'oben') r.dy -= 0.3 * W * (1 - q);
      else if (art === 'zoom') r.sc *= 0.2 + 0.8 * q;
    };
    var zeigen = function () {
      var W = b.clientWidth;
      E.forEach(function (x) {
        var st = x.t.style;
        if (t < x.s || (t >= x.e && x.e < fd)) { st.visibility = 'hidden'; return; }
        var r = { o: 1, dx: 0, dy: 0, sc: 1, clip: '' };
        if (!ruhig) {
          if (x.ein && t < x.s + x.einD) anw(r, x.ein, (t - x.s) / x.einD, W);
          if (x.aus && t > x.e - x.ausD) anw(r, x.aus === 'ausblenden' ? 'einblenden' : x.aus, (x.e - t) / x.ausD, W);
        }
        st.visibility = '';
        st.opacity = r.o < 1 ? String((parseFloat(x.o0) || 1) * r.o) : x.o0;
        st.translate = r.dx || r.dy ? r.dx.toFixed(1) + 'px ' + r.dy.toFixed(1) + 'px' : '';
        st.scale = r.sc !== 1 ? r.sc.toFixed(3) : '';
        st.clipPath = r.clip;
      });
    };
    var leiste = el('div', 'ia-fo-zl'), knopf = el('button', 'ia-fo-zl-knopf'), regler = el('input', 'ia-fo-zl-regler'), anzeige = el('span', 'ia-fo-zl-zeit');
    knopf.type = 'button'; regler.type = 'range'; regler.min = '0'; regler.max = String(fd); regler.step = '0.1'; regler.value = '0';
    regler.setAttribute('aria-label', 'Zeit auf der Folie');
    leiste.appendChild(knopf); leiste.appendChild(regler); leiste.appendChild(anzeige);
    if (b.parentNode) b.parentNode.insertBefore(leiste, b.nextSibling);
    var uhr = function (s) { s = Math.floor(s + 0.0001); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); };
    var anzeigen = function () {
      var ende = t >= fd - 0.01, titel = laeuft ? 'Anhalten' : wartet ? 'Weiter' : ende ? 'Noch einmal abspielen' : 'Abspielen';
      knopf.textContent = laeuft ? '❚❚' : ende ? '↺' : '▶'; knopf.title = titel; knopf.setAttribute('aria-label', titel);
      regler.value = String(Math.round(t * 10) / 10); anzeige.textContent = uhr(t) + ' / ' + uhr(fd);
    };
    var setzen = function (v) { t = Math.max(0, Math.min(fd, v)); zeigen(); anzeigen(); };
    var grenze = function () { for (var i = 0; i < pausen.length; i++) if (!pausen[i].frei) return pausen[i]; return null; };
    var halten = function () { laeuft = false; cancelAnimationFrame(raf); if (ton) { try { ton.pause(); } catch (e) { } } anzeigen(); };
    var markieren = function (p, an) {
      var e = p.x.t; e.classList.toggle('ia-fo-wartet', an);
      if (an) { e.setAttribute('tabindex', '0'); e.setAttribute('role', 'button'); e.setAttribute('aria-label', 'Hier klicken, um weiterzumachen'); }
      else { e.removeAttribute('tabindex'); e.removeAttribute('role'); e.removeAttribute('aria-label'); }
    };
    var warten = function (p) { halten(); wartet = p; markieren(p, true); try { p.x.t.focus({ preventScroll: true }); } catch (e) { } anzeigen(); };
    var tick = function (ts) {
      if (!laeuft) return;
      if (letzt == null) letzt = ts;
      var neu = t + (ts - letzt) / 1000; letzt = ts;
      if (ton && !ton.paused && isFinite(ton.duration) && ton.currentTime < ton.duration - 0.05 && Math.abs(ton.currentTime - neu) < 1) neu = ton.currentTime;
      var g = grenze();
      if (g && neu >= g.zeit && t <= g.zeit + 1e-6) { setzen(g.zeit); return warten(g); }
      if (neu >= fd) { setzen(fd); return halten(); }
      setzen(neu); raf = requestAnimationFrame(tick);
    };
    var spielen = function () {
      if (wartet) { wartet.frei = true; markieren(wartet, false); wartet = null; }
      if (t >= fd - 0.01) { pausen.forEach(function (p) { p.frei = false; }); setzen(0); }
      laeuft = true; letzt = null; anzeigen();
      if (ton) {
        try {
          if (!isFinite(ton.duration) || t < ton.duration) { ton.currentTime = t; var pr = ton.play(); if (pr && pr.catch) pr.catch(function () { if (laeuft) halten(); }); }
        } catch (e) { }
      }
      raf = requestAnimationFrame(tick);
    };
    knopf.onclick = function (e) { e.stopPropagation(); if (laeuft) halten(); else spielen(); };
    regler.oninput = function () {
      var v = parseFloat(regler.value) || 0, war = laeuft;
      if (laeuft) halten();
      if (wartet) { markieren(wartet, false); wartet = null; }
      pausen.forEach(function (p) { if (p.zeit > v) p.frei = false; });
      var g = grenze(); if (g && v >= g.zeit) v = g.zeit;
      setzen(v);
      if (ton) { try { ton.currentTime = v; } catch (e) { } }
      if (g && v >= g.zeit) return warten(g);
      if (war) spielen();
    };
    b.addEventListener('click', function (e) { if (wartet && wartet.x.t.contains(e.target)) { e.stopPropagation(); spielen(); } });
    b.addEventListener('keydown', function (e) { if (wartet && (e.key === 'Enter' || e.key === ' ') && wartet.x.t.contains(e.target)) { e.preventDefault(); spielen(); } });
    setzen(0);
    // Erst abspielen, wenn die Folie zu sehen ist; wird sie verdeckt (Blättern), hält die Uhr an
    if (window.IntersectionObserver) {
      var erst = true;
      new IntersectionObserver(function (en) { if (en[0].isIntersecting) { if (erst) { erst = false; spielen(); } } else if (laeuft) halten(); }).observe(b);
    } else spielen();
  }
  // Freie Folie: Elemente sind schon fertig positioniert (das kann auch ganz ohne Programmcode angezeigt werden).
  // Hier kommen dazu: Animationen (Reihenfolge = Reihenfolge der Elemente; „Bei Klick“ → ▶-Knopf),
  // das optische Ausblenden der Schritt-Überschrift (bleibt für Screenreader) und für ältere Browser
  // ohne Container-Einheiten (cqw) die Umrechnung in Pixel.
  BAU.folie = function (b) {
    var teile = kinderMit(b, 'data-ia-teil');
    var props = function (t) { try { return JSON.parse(t.getAttribute('data-folie') || '{}') || {}; } catch (e) { return {}; } };
    if (!(window.CSS && CSS.supports && CSS.supports('width', '1cqw'))) {
      var mitCq = alle(b, '[style*="cqw"]').concat(/cqw/.test(b.getAttribute('style') || '') ? [b] : []);
      mitCq.forEach(function (e) { e.setAttribute('data-fo-stil', e.getAttribute('style')); });
      var umrechnen = function () { var w = b.clientWidth / 100; mitCq.forEach(function (e) { e.setAttribute('style', e.getAttribute('data-fo-stil').replace(/(-?[\d.]+)cqw/g, function (g, z) { return (parseFloat(z) * w).toFixed(2) + 'px'; })); }); };
      umrechnen();
      if (window.ResizeObserver) new ResizeObserver(umrechnen).observe(b); else window.addEventListener('resize', umrechnen);
    }
    if (b.getAttribute('data-titel-aus') === '1') {
      var tit = null, p = b.parentNode;
      while (p && p.nodeType === 1 && !tit) { tit = p.querySelector('[data-lm="schritt-titel"]'); if (p.hasAttribute('data-panel')) break; p = p.parentNode; }
      if (tit && !tit.contains(b)) { var zeile = tit; while (zeile.parentNode && !zeile.parentNode.contains(b)) zeile = zeile.parentNode; if (!zeile.contains(b)) zeile.classList.add('ia-fo-sr'); }
    }
    var zeit = null; try { zeit = JSON.parse(b.getAttribute('data-zeit') || 'null'); } catch (e) { }
    if (zeit && zeit.an) return folieZeitleiste(b, teile, props, zeit);
    var gruppen = [], akt = null, vorher = null;
    teile.forEach(function (t) {
      var q = props(t); if (!q.anim) return;
      var verz = +q.verz || 0, dauer = Math.max(0.1, +q.dauer || 0.6), beginn;
      if (q.start === 'klick' || !akt) { akt = { klick: q.start === 'klick', el: [] }; gruppen.push(akt); beginn = verz; }
      else if (q.start === 'nach') beginn = (vorher ? vorher.beginn + vorher.dauer : 0) + verz;
      else beginn = (vorher ? vorher.beginn : 0) + verz;
      vorher = { t: t, art: q.anim, beginn: beginn, dauer: dauer }; akt.el.push(vorher);
    });
    if (!gruppen.length) return;
    var naechste = 0, knopf = null;
    var verstecken = function () { gruppen.forEach(function (g) { g.el.forEach(function (x) { x.t.style.animation = ''; x.t.classList.add('ia-fo-weg'); }); }); naechste = 0; };
    var spielen = function () {
      var g = gruppen[naechste++]; if (!g) return;
      g.el.forEach(function (x) { x.t.classList.remove('ia-fo-weg'); x.t.style.animation = 'none'; void x.t.offsetWidth; x.t.style.animation = 'ia-fo-' + x.art + ' ' + x.dauer + 's ease-out ' + x.beginn + 's both'; });
      knopfSetzen();
    };
    var knopfSetzen = function () {
      var rest = naechste < gruppen.length;
      knopf.textContent = rest ? '▶' : '↺'; knopf.title = rest ? 'Weiter' : 'Folie noch einmal abspielen';
      knopf.setAttribute('aria-label', knopf.title);
    };
    knopf = el('button', 'ia-fo-weiter'); knopf.type = 'button';
    knopf.onclick = function (e) { e.stopPropagation(); if (naechste < gruppen.length) spielen(); else { verstecken(); start(); } };
    b.appendChild(knopf);
    b.addEventListener('click', function (e) { if (e.target.closest('a,button,video,audio,input')) return; if (naechste < gruppen.length && gruppen[naechste].klick) spielen(); });
    var start = function () { if (!gruppen[0].klick) spielen(); else knopfSetzen(); };
    verstecken();
    // Erst abspielen, wenn die Folie wirklich zu sehen ist (z. B. erst beim Blättern zu diesem Schritt)
    if (window.IntersectionObserver) { var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); start(); } }); io.observe(b); }
    else start();
  };
  function bausteineStarten(wurzel) {
    bStil();
    alle(wurzel || document, '[data-lm-ia]').forEach(function (b) {
      if (b.iaFertig) return; b.iaFertig = true;
      var f = BAU[b.getAttribute('data-lm-ia')];
      if (f) { try { f(b); b.classList.add('ia-aktiv'); } catch (e) { } }
    });
  }
  window.BAUSTEINE = { starten: bausteineStarten };

  // ── Alle Fragen in einem Bereich starten (Kursseiten) ───────────────────────
  // opt.geloest = { Frage-Kennung: 1 } · opt.onGeloest(id) wird nach richtiger Antwort gerufen
  // (bei einer Umfrage nach dem Absenden) · opt.onAntwort(id, richtig, ctrl) nach JEDER Antwort
  // Startet auch die interaktiven Bausteine im selben Bereich.
  function starten(wurzel, opt) {
    opt = opt || {};
    alle(wurzel || document, '[data-frage]').forEach(function (f) {
      var id = f.getAttribute('data-frage');
      einzeln(f, { salz: opt.salz || '', geloest: !!(opt.geloest && opt.geloest[id]), onErgebnis: function (r, ctrl) {
        if (opt.onAntwort) { try { opt.onAntwort(id, r, ctrl); } catch (e) { } }
        if ((r || r === null) && opt.onGeloest) opt.onGeloest(id);
      } });
    });
    bausteineStarten(wurzel);
  }
  // Gibt die erste noch offene Pflichtfrage im Bereich zurück (oder null)
  function offen(bereich) {
    if (!bereich) return null;
    var l = alle(bereich, '[data-frage][data-pflicht="1"]');
    for (var i = 0; i < l.length; i++) if (!(l[i].feCtrl && l[i].feCtrl.geloest)) return l[i];
    return null;
  }
  function erinnern(f) {
    try { f.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { }
    f.classList.remove('fe-erinnern'); void f.offsetWidth; f.classList.add('fe-erinnern');
    if (f.feCtrl) { var m = f.querySelector('.fe-ui > div:last-child'); if (m && !f.feCtrl.geloest) { m.className = 'fe-meldung info'; m.innerHTML = T.gesperrt; } }
  }
  // Blättern innerhalb einer Seite sperren, solange eine Pflichtfrage offen ist.
  // Fängt Klicks auf [data-go] ab, bevor das onclick der Seite sie ausführt.
  function sperreAnbinden(wurzel) {
    (wurzel || document).addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-go]');
      if (!b) return;
      var r = b.closest('[data-lm-layout],[data-lernmodul],[data-unfall-modul]');
      if (!r) return;
      var c = Number(r.getAttribute('data-current')) || 1, g = b.getAttribute('data-go');
      var ziel = g === 'next' ? c + 1 : g === 'back' ? c - 1 : Number(g);
      for (var n = c; n < ziel; n++) {
        var o = offen(r.querySelector('[data-panel="' + n + '"]'));
        if (o) { ev.preventDefault(); ev.stopImmediatePropagation(); erinnern(o); return; }
      }
    }, true);
  }

  window.FRAGEN = { version: 2, einzeln: einzeln, starten: starten, offen: offen, erinnern: erinnern, sperreAnbinden: sperreAnbinden, h53: h53, norm: norm, texte: T };
})();
/* <<< FRAGEN-ENGINE-ENDE */
