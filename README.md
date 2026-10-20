# Portfolio – Nico Scheibe

Persönliche Portfolio-Website (statisch: HTML, CSS, JavaScript). Kein Framework, kein Build-Schritt – einfach Dateien bearbeiten und hochladen.

## Dateien im Überblick

| Datei | Wofür? |
|---|---|
| `index.html` | Alle Texte der Seite (Hero, Über mich, Skills, Werdegang, Kontakt) |
| `xyntal.html` | Eigene Detailseite für das Projekt Xyntal |
| `noxi.html` | Eigene Detailseite für Noxi (Farbwelt Grün/Türkis) |
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten (in der Fußzeile verlinkt) |
| `404.html` | Fehlerseite, wenn jemand eine falsche Adresse aufruft |
| `i18n.js` | Englische Übersetzungen und Umschalter DE/EN |
| `assets/fonts/` | Lokal eingebundene Schriften (keine Verbindung zu Google) |
| `assets/og-image.jpg` | Vorschaubild beim Teilen des Links (1200 × 630 px) |
| `demo/` | Interaktive Demos: Xyntal (`xyntal-demo.html`, `demo.css`, `demo.js`) und Noxi (`noxi-demo.html`, `noxi.css`, `noxi.js`) |
| `projects.js` | **Deine Projekte** – hier fügst du neue Projekte hinzu |
| `style.css` | Design: Farben, Schriften, Abstände (Farben ganz oben als Variablen) |
| `main.js` | Technik: baut die Projektkarten, Menü, Scroll-Animationen – musst du normalerweise nicht anfassen |
| `assets/` | Ordner für Bilder, Videos und das Favicon |

> **Tipp:** Alle Stellen, die du noch anpassen solltest, sind mit **[eckigen Klammern]** markiert.
> Suche in VS Code/Cursor mit `Cmd + Shift + F` nach `[` um alle zu finden.

---

## 1. Seite lokal ansehen

**Variante A – am einfachsten:**
Doppelklick auf `index.html`. Die Seite öffnet sich im Browser.

**Variante B – mit lokalem Server (empfohlen, verhält sich wie online):**

1. Terminal öffnen und in den Projektordner wechseln:
   ```bash
   cd pfad/zu/deinem/portfolio
   ```
2. Server starten (Python ist auf dem Mac vorinstalliert):
   ```bash
   python3 -m http.server 8000
   ```
3. Im Browser öffnen: <http://localhost:8000>
4. Beenden mit `Ctrl + C`.

**Variante C – in Cursor / VS Code:** Erweiterung „Live Server“ installieren → Rechtsklick auf `index.html` → „Open with Live Server“. Die Seite lädt bei jeder Änderung automatisch neu.

Hell-/Dunkelmodus: Standard ist **dunkel**. Mit dem Sonne/Mond-Button oben rechts wechseln Besucher den Modus. Die Wahl wird in ihrem Browser gespeichert.

---

## 2. Screenshots, Videos und neue Projekte einfügen

### Screenshot oder Video zu einem Projekt hinzufügen

1. Datei in den Ordner `assets/` legen, z. B. `assets/noxi.png`.
   - Bilder: `.png`, `.jpg` oder `.webp` – ideal ca. **1600 × 1000 px** (Querformat 16:10).
   - Videos: `.mp4`, kurz (5–15 Sek.), ohne Ton, möglichst **unter 5 MB**.
   - iPhone-Screenshots wirken am besten, wenn du sie vorher auf einen Hintergrund setzt (z. B. mit [shots.so](https://shots.so) oder Figma).
2. In `projects.js` beim passenden Projekt `media: null` ersetzen:

   ```js
   // Bild
   media: { type: "image", src: "assets/noxi.png", alt: "Noxi auf iPhone und Mac" },

   // oder Video (poster = Vorschaubild, optional)
   media: { type: "video", src: "assets/noxi.mp4", poster: "assets/noxi.png" },

   // oder Live-Vorschau einer App (verkleinert, nicht klickbar – wie bei Xyntal)
   media: { type: "preview", src: "demo/xyntal-demo.html?preview=1", alt: "Live-Vorschau" },
   ```
3. Speichern, Browser neu laden – fertig.

> Achte auf exakte Dateinamen inkl. Groß-/Kleinschreibung. Online (GitHub Pages) ist `Noxi.png` ≠ `noxi.png`.

### Link zu einem Projekt

```js
link: { label: "Auf GitHub ansehen", url: "https://github.com/dein-name/noxi" },
```
Kein Link vorhanden? `link: null` – dann steht dort „Link folgt“. Links, die noch in `[eckigen Klammern]` stehen, werden ebenfalls als „Link folgt“ angezeigt.

### Neues Projekt hinzufügen

Öffne `projects.js` und kopiere einen kompletten Block `{ ... }`. Füge ihn **nach** dem letzten Projekt ein – mit einem **Komma** dazwischen:

```js
window.PROJECTS = [
  { title: "Noxi", ... },
  { title: "Xyntal", ... },   // ← Komma!
  {
    title: "Mein neues Projekt",
    status: "Neu",
    platform: "Web-App",
    description: "Was macht das Projekt und welches Problem löst es?",
    tools: ["Python", "Claude API", "Cursor"],
    media: { type: "image", src: "assets/neues-projekt.png", alt: "Screenshot" },
    link: { label: "Live ansehen", url: "https://..." }
  }
];
```

Die Karten erscheinen automatisch in der Reihenfolge der Liste. Wichtigstes Projekt nach oben.

### Eigene Unterseite für ein Projekt (wie bei Xyntal)

Xyntal hat eine eigene Seite: `xyntal.html`. Auf der Startseite führt der Button „Mehr darüber erfahren“ dorthin.

- **Inhalte ändern:** `xyntal.html` öffnen und die Texte anpassen. Platzhalter stehen in `[eckigen Klammern]`.
- **Screenshot einfügen:** In `xyntal.html` beim Kommentar „Screenshot oder Video“ den Platzhalter-Block
  `<div class="project__placeholder">…</div>` ersetzen durch
  `<img src="assets/xyntal.png" alt="Xyntal App">`.
- **Unterseite für ein anderes Projekt (z. B. Noxi):**
  1. `xyntal.html` kopieren und umbenennen, z. B. in `noxi.html`.
  2. Texte darin anpassen.
  3. In `projects.js` beim Projekt eintragen:
     `link: { label: "Mehr darüber erfahren", url: "noxi.html" }`
  Links ohne `https://` werden automatisch als Button angezeigt und öffnen im selben Tab.

### Xyntal-Demo zum Durchklicken

Auf der Xyntal-Seite gibt es ein App-Fenster mit „Demo starten“. Darin läuft eine **interaktive Demo im Dark-Design** mit Beispieldaten: Dashboard (Widgets verschieben, Layouts), Discover und Matching, Profile, Nachrichten, Projekte und Workspaces (Kanban), Communities, Dateien (Versionen, Kommentare, Freigaben, Verlauf), KI-Center (Chat und Erinnerungen), Agents und Automationen, Fokus-Assistent mit Timer, Einstellungen, Support und Archiv, Admin, Abo, dazu Suche mit **Strg + K** und Benachrichtigungen.

- Die Demo liegt im Ordner `demo/`. Direkt ansehen kannst du sie unter `http://localhost:8000/demo/xyntal-demo.html`.
- **Inhalte ändern** (Personen, Projekte, Dateien, KI-Antworten …): in `demo/demo.js` in der Funktion `seed()` und im Block `AI`.
- Es wird nichts gespeichert oder verschickt. Neu laden setzt die Demo zurück.
- Geplante Funktionen sind in der Demo mit **„Bald“** markiert.

### Noxi-Seite und Noxi-Demo

- **Seite:** `noxi.html`. Sie ist aufgebaut wie die Xyntal-Seite, nutzt aber die Farbwelt Grün/Türkis (`<body class="theme-noxi">`, Farben in `style.css` unter „Noxi-Seite“).
- **Demo:** `demo/noxi-demo.html`, direkt ansehen unter `http://localhost:8000/demo/noxi-demo.html`. Sie hat die Bereiche Heute, Kalender (Termine anlegen und löschen), Aufgaben, Lernen (Karteikarten umdrehen und bewerten, Karten mit KI erstellen) und den KI-Assistenten.
- **Mac / iPhone:** Im Demo-Fenster auf der Noxi-Seite schalten die Knöpfe „Mac“ und „iPhone“ die Ansicht um. Unter 760 px Breite zeigt die Demo automatisch die iPhone-Ansicht mit Tab-Leiste.
- **Inhalte ändern:** in `demo/noxi.js` in der Funktion `seed()` (Termine, Aufgaben, Lernkarten) und in `aiAnswer()` (KI-Antworten).

### Später: echte Qt-App im Browser (Qt for WebAssembly)

Qt kann deine echte App nach **WebAssembly** übersetzen. Dann kannst du die HTML-Demo durch die echte App ersetzen.

**Einmalig einrichten**
1. **Qt Maintenance Tool** öffnen → bei deiner Qt-Version den Punkt **„WebAssembly (single-threaded)“** installieren.
   *Single-threaded* ist wichtig, weil die Multi-Thread-Variante Server-Einstellungen braucht, die GitHub Pages nicht hat.
2. **Emscripten** installieren, in genau der Version, die zu deiner Qt-Version passt. Welche das ist, steht in der Qt-Doku unter „Qt for WebAssembly“.
   ```bash
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install VERSION
   ./emsdk activate VERSION
   source ./emsdk_env.sh
   ```

**Demo bauen** (im Xyntal-Projektordner, Pfad und Version an deine Installation anpassen)
```bash
~/Qt/6.x.x/wasm_singlethread/bin/qt-cmake -S . -B build-wasm -DCMAKE_BUILD_TYPE=Release
```
```bash
cmake --build build-wasm
```

**Auf die Website bringen**
1. Aus `build-wasm/` diese Dateien in den Ordner `demo/` kopieren: `xyntal.html`, `xyntal.js`, `xyntal.wasm`, `qtloader.js` und, falls vorhanden, `qtlogo.svg`.
2. In `xyntal.html` (Portfolio) beim Demo-Fenster `data-src="demo/xyntal-demo.html"` auf `data-src="demo/xyntal.html"` ändern. Heißt dein Programm anders, nimm diesen Dateinamen.
3. Lokal testen, und zwar **nur über den lokalen Server** (`python3 -m http.server 8000`). Per Doppelklick funktioniert WebAssembly nicht.

**Worauf du in der App achten solltest**
- **Demo-Modus:** Im Browser gibt es keinen eigenen Server. Login, Datenbank und Nachrichten am besten mit festen Demo-Daten füllen, z. B. über einen `#ifdef Q_OS_WASM`-Zweig im Code.
- **Keine API-Keys einbauen!** Alles in der `.wasm`-Datei kann jeder auslesen. Das KI-Center in der Demo also mit vorbereiteten Beispiel-Antworten zeigen.
- **Nicht alles läuft im Browser:** z. B. Qt WebEngine, echte Dateisystem-Zugriffe und manche Netzwerk-Funktionen. Solche Teile in der Demo ausblenden.
- **Größe:** Die `.wasm`-Datei ist oft 10–40 MB. Ein Release-Build und nur die nötigen Qt-Module halten sie klein. Jede Datei muss unter 100 MB bleiben (Grenze von GitHub).

### Windows-Version zum Download (GitHub Releases)

1. Windows-Build erstellen, z. B. mit `windeployqt` alle nötigen Qt-Dateien zusammensammeln und als `.zip` packen oder einen Installer bauen.
2. Auf GitHub in deinem Repository: **Releases → „Draft a new release“** → Version eintragen (z. B. `v0.3`) → Datei hochladen → **Publish**.
3. In `xyntal.html` beim Download-Button den Link in `[...]` ersetzen, z. B.
   `https://github.com/DEIN-NAME/xyntal/releases/latest`
4. Die Zeile „[Version, z. B. v0.3 · Größe]“ anpassen.

Hinweis: Nicht signierte `.exe`-Dateien lösen eine Windows-SmartScreen-Warnung aus. Darum ist die Browser-Demo für Personaler der wichtigere Weg.

### Texte & Design ändern

- **Texte:** direkt in `index.html` (Über mich, Skills, Werdegang …).
- **Ideen im Code-Fenster (Hero):** in `index.html` beim Kommentar „Ideen, wie ich im Team mitwirken kann“. Jede Zeile `<span class="ln">…</span>` ist eine Code-Zeile. Für eine neue Idee eine String-Zeile kopieren und den Text ändern. Die Zeilennummern zählen automatisch mit. Hinter jeder Idee außer der letzten steht ein Komma. Sehr lange Zeilen muss man am Handy seitlich scrollen, also Ideen am besten unter ~38 Zeichen halten.
- **Kontakt:** in `index.html` im Bereich „KONTAKT“. E-Mail und Telefonnummer stehen jeweils im Link (`mailto:` / `tel:`), im sichtbaren Text und im Kopieren-Button (`data-copy`). Wenn du etwas änderst, bitte überall.
- **Xyntal-Kurzinfos (Code-Block oben auf der Xyntal-Seite):** in `xyntal.html` beim Kommentar „Kurzinfos als animierter Code-Block“. Die Werte in den Anführungszeichen ändern. Im `aria-label` darüber stehen dieselben Infos für Screenreader, bitte mit anpassen.
- **Aktueller Stand (Xyntal):** in `xyntal.html` im `<ol class="stepper">`. Die Klassen `step--done` (grün), `step--now` (pulsiert) und `step--next` (gestrichelt) bestimmen das Aussehen. Wenn ein Schritt fertig ist, einfach die Klasse ändern.
- **Fußzeile:** ganz unten in `index.html` und `xyntal.html` (Bereich `<footer>`). Sie ist auf beiden Seiten gleich aufgebaut, Änderungen also in beiden Dateien machen.
- **Akzentfarbe:** in `style.css` ganz oben `--accent` und `--accent-2` ändern (im `:root`-Block für dunkel, im `:root[data-theme="light"]`-Block für hell).

---

### Sprache Deutsch / Englisch

- Oben rechts schaltet **DE | EN** die Sprache um. Die Wahl merkt sich der Browser.
- Der deutsche Text steht wie bisher direkt im HTML. Die englischen Übersetzungen stehen in `i18n.js` im Block `EN` – immer nach dem Muster `"Deutscher Text": "English text"`.
- **Wenn du einen deutschen Text änderst, musst du ihn auch in `i18n.js` anpassen** (links den neuen deutschen Text, rechts die Übersetzung). Sonst bleibt die Stelle im englischen Modus deutsch.
- Impressum und Datenschutz bleiben bewusst auf Deutsch (im englischen Modus erscheint ein Hinweis). Die Demos von Noxi und Xyntal sind ebenfalls auf Deutsch.

### Impressum & Datenschutz

- In `impressum.html` und `datenschutz.html` noch **[Straße und Hausnummer]** und **[PLZ]** eintragen.
- Wenn du später Cloudflare nutzt, in `datenschutz.html` einen Abschnitt zu Cloudflare ergänzen (Anbieter, verarbeitete Daten, Rechtsgrundlage).
- Die Texte sind eine solide Vorlage für eine private Bewerbungsseite, aber keine Rechtsberatung. Wenn du ganz sicher gehen willst, lass sie kurz prüfen (z. B. mit einem Generator wie e-recht24 vergleichen).

### Vorschaubild beim Teilen

- `assets/og-image.jpg` erscheint, wenn du den Link per WhatsApp, LinkedIn, E-Mail usw. teilst.
- Die Adresse der Seite (`https://nicoscheibe18-jpg.github.io/`) steht oben in `index.html`, `xyntal.html` und `noxi.html` (bei `og:url` und `og:image`). Wenn du später eine eigene Domain nutzt, ersetze sie dort.
- Testen kannst du die Vorschau danach z. B. mit dem LinkedIn Post Inspector.

### Schriften

Alle Schriften liegen in `assets/fonts/` und werden von deiner eigenen Seite geladen – es gibt keine Verbindung zu Google Fonts (wichtig für den Datenschutz).

## 3. Kostenlos online stellen mit GitHub Pages

### Einmalig: Konto & Repository

1. Kostenloses Konto auf <https://github.com> anlegen.
2. Oben rechts **„+“ → „New repository“**.
3. Name des Repositorys:
   - `DEIN-GITHUB-NAME.github.io` → Seite läuft später unter `https://DEIN-GITHUB-NAME.github.io` (**empfohlen**, schönste Adresse)
   - oder z. B. `portfolio` → Seite läuft unter `https://DEIN-GITHUB-NAME.github.io/portfolio`
4. **Public** auswählen → **„Create repository“**.

### Dateien hochladen – Variante A: im Browser (ohne Terminal)

1. Im neuen Repository auf **„uploading an existing file“** klicken.
2. Alle Dateien und den Ordner `assets` per Drag & Drop hineinziehen
   (alle Dateien und die Ordner `assets/` und `demo/`).
3. Unten **„Commit changes“** klicken.

### Dateien hochladen – Variante B: mit Git im Terminal

```bash
cd pfad/zu/deinem/portfolio
git init
git add .
git commit -m "Erste Version meines Portfolios"
git branch -M main
git remote add origin https://github.com/DEIN-GITHUB-NAME/DEIN-REPO.git
git push -u origin main
```

### GitHub Pages aktivieren

1. Im Repository: **Settings → Pages** (links im Menü).
2. Bei **„Source“**: **„Deploy from a branch“** wählen.
3. Branch: **`main`**, Ordner: **`/ (root)`** → **Save**.
4. 1–2 Minuten warten, Seite neu laden – oben erscheint der Link zu deiner Website. 🎉

### Eigene Domain mit Cloudflare

Ja, das geht – und ist eine gute Wahl. Es gibt zwei Wege:

**Weg A: Domain bei Cloudflare, Seite weiter auf GitHub Pages (empfohlen)**

1. Bei Cloudflare anmelden → **Domain Registration → Register Domains** → Wunsch-Domain kaufen.
   Hinweis: Cloudflare bietet nicht jede Endung an (z. B. `.de` nach meinem Wissensstand nicht). Dann entweder `.com`/`.dev` bei Cloudflare nehmen oder die `.de`-Domain bei einem anderen Anbieter kaufen und nur die Nameserver auf Cloudflare umstellen.
2. In GitHub: Repository → **Settings → Pages → Custom domain** → Domain eintragen (z. B. `nicoscheibe.de`) → **Save**.
3. In Cloudflare: deine Domain → **DNS → Records** → diese Einträge anlegen:

   | Typ | Name | Inhalt |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `DEIN-GITHUB-NAME.github.io` |

   Bei allen Einträgen **Proxy-Status auf „DNS only“ (graue Wolke)** stellen, damit GitHub das HTTPS-Zertifikat ausstellen kann.
4. Ein paar Minuten bis Stunden warten. Danach in GitHub unter Pages **„Enforce HTTPS“** anhaken.
5. In den drei Seiten `nicoscheibe18-jpg.github.io` durch deine neue Domain ersetzen (siehe „Vorschaubild beim Teilen“).

**Weg B: Alles bei Cloudflare (Cloudflare Pages)**

1. Cloudflare → **Workers & Pages → Erstellen → Pages → Mit Git verbinden** → dein GitHub-Repository wählen.
2. Framework: **Keins**, Build-Befehl: **leer lassen**, Ausgabeverzeichnis: **`/`** → **Speichern und bereitstellen**.
3. Unter **Benutzerdefinierte Domains** deine Domain hinzufügen – Cloudflare richtet alles automatisch ein.
4. Jeder `git push` aktualisiert die Seite automatisch.
5. In `datenschutz.html` den GitHub-Abschnitt durch einen Abschnitt zu Cloudflare ersetzen.

**Hinweis zur 404-Seite:** `404.html` nutzt Pfade, die mit `/` beginnen. Sie funktioniert deshalb, wenn die Seite direkt unter einer Domain oder `dein-name.github.io` liegt (nicht in einem Unterordner wie `dein-name.github.io/portfolio`).

### Später etwas ändern

- **Browser:** Datei im Repository anklicken → Stift-Symbol → bearbeiten → „Commit changes“. Für neue Bilder: „Add file → Upload files“ im Ordner `assets`.
- **Terminal:**
  ```bash
  git add .
  git commit -m "Neues Projekt hinzugefügt"
  git push
  ```

Nach jedem Hochladen dauert es ca. 1 Minute, bis die Änderung online ist. Wenn du die alte Version siehst: `Cmd + Shift + R` (Neuladen ohne Cache).

---

## Checkliste vor dem Bewerben

- [ ] Alle `[eckigen Klammern]` ersetzt (Suche nach `[`) 
- [ ] Auf dem Handy getestet (hell & dunkel, Deutsch & Englisch)
- [ ] Vorschaubild beim Teilen getestet (z. B. Link an dich selbst per WhatsApp)
- [ ] Keine dienstinternen Details (Einheiten, Standorte, Systemnamen) auf der Seite
- [ ] Link zur Seite in Lebenslauf und Anschreiben eingefügt
