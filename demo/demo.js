/* =========================================================
   Xyntal – interaktive Demo
   Alle Inhalte sind Beispieldaten. Nichts wird gespeichert
   oder verschickt; ein Neuladen setzt die Demo zurück.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Helfer ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function md(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); }
  function now() { return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); }

  var ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    sparkles: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9 17h6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    settings: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>',
    crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
    heart: '<path d="M12 20s-7.5-4.5-9-9.5C2 7 4.5 4.5 7.5 4.5c2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3 0 5.5 2.5 4.5 6-1.5 5-9 9.5-9 9.5z"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6H3v-6z"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1-4 4.5-8.5 12-9-.5 7.5-5 11-9 12z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  function ic(n, c) { return '<svg class="i ' + (c || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || "") + "</svg>"; }

  var COLORS = ["#7b84ff", "#a68bff", "#3ccf8e", "#f5b454", "#ff6b81", "#4fd1e8", "#f08bd0", "#8bd450"];
  var ME = { id: "me", name: "Nico Scheibe", color: "#7b84ff" };
  function initials(name) { return name.split(" ").map(function (w) { return w.charAt(0); }).join("").slice(0, 2); }
  function avatar(p, size) { return '<span class="av ' + (size || "") + '" style="--c:' + p.color + '">' + esc(initials(p.name)) + "</span>"; }
  function aiAvatar(size) { return '<span class="av ai ' + (size || "") + '">' + ic("sparkles") + "</span>"; }

  /* ---------- Beispieldaten ---------- */
  function seed() {
    var people = [
      { id: "lena", name: "Lena Hoffmann", role: "Gründerin · FlowDesk", city: "München", score: 94, skills: ["Product", "UX", "Fundraising"], cats: ["Design", "Finanzen"], type: "Mentor", avail: "Wenige Std./Woche", mode: "Remote", why: "Erfahrene Gründerin · bietet Mentoring · ähnliche Branche", about: "Hat FlowDesk von der Idee bis zu 40 Mitarbeitenden aufgebaut. Hilft jungen Gründern bei Produkt, Pitch und Finanzierung.", seeks: "Engagierte Gründer, die sie begleiten kann", offers: "Mentoring, Pitch-Feedback, Kontakte zu Investoren", color: COLORS[1] },
      { id: "jonas", name: "Jonas Weber", role: "Full-Stack-Entwickler · Freelancer", city: "Regensburg", score: 88, skills: ["React", "Node.js", "PostgreSQL"], cats: ["Entwicklung"], type: "Mitgründer", avail: "Teilzeit", mode: "Hybrid", why: "Ergänzt deine Skills · gleiche Stadt · sucht Mitgründer", about: "Baut seit fünf Jahren Web-Apps für Startups und sucht jetzt ein eigenes Projekt mit Sinn.", seeks: "Ein Startup, bei dem er als technischer Mitgründer einsteigt", offers: "Backend, Datenbanken, schnelle Prototypen", color: COLORS[2] },
      { id: "max", name: "Max Schreiber", role: "KI-Engineer · Startup aus Berlin", city: "Berlin", score: 90, skills: ["LLMs", "Python", "Automatisierung"], cats: ["KI", "Entwicklung"], type: "Austausch", avail: "Teilzeit", mode: "Remote", why: "Gleiche Interessen: KI & Automatisierung", about: "Entwickelt KI-Agenten für Kundenservice und tauscht sich gern über neue Modelle und Tools aus.", seeks: "Austausch mit anderen KI-Buildern", offers: "Know-how zu LLMs, Prompting und Agents", color: COLORS[0] },
      { id: "elif", name: "Elif Yilmaz", role: "Data Analyst & Indie-Hackerin", city: "Regensburg", score: 86, skills: ["SQL", "Python", "No-Code"], cats: ["KI", "Entwicklung"], type: "Austausch", avail: "Teilzeit", mode: "Hybrid", why: "Gleiche Stadt · baut ebenfalls eigene Apps", about: "Analysiert tagsüber Daten und baut abends kleine Tools mit No-Code und Python.", seeks: "Leute zum gemeinsamen Bauen und für Feedback", offers: "Datenanalyse, Dashboards, Growth-Experimente", color: COLORS[6] },
      { id: "aylin", name: "Aylin Demir", role: "Growth-Marketing · selbstständig", city: "Nürnberg", score: 85, skills: ["Performance Marketing", "Branding", "Social Media"], cats: ["Marketing"], type: "Mentor", avail: "Wenige Std./Woche", mode: "Remote", why: "Mentorin für Marketing · Fokus auf junge Gründer", about: "Hat über 30 junge Marken beim Start begleitet und teilt ihr Wissen gern weiter.", seeks: "Gründer mit spannenden Produkten", offers: "Marketing-Strategie, Launch-Planung, Branding", color: COLORS[3] },
      { id: "mia", name: "Mia Lorenz", role: "UI/UX-Designerin", city: "Regensburg", score: 83, skills: ["Figma", "Design Systems", "Prototyping"], cats: ["Design"], type: "Mitgründer", avail: "Teilzeit", mode: "Vor Ort", why: "Design-Skills, die dir noch fehlen · gleiche Stadt", about: "Gestaltet Apps, die sich gut anfühlen. Sucht ein Team, in dem Design von Anfang an mitdenkt.", seeks: "Ein Startup mit Design-Fokus", offers: "UI/UX, Design-Systeme, Nutzertests", color: COLORS[4] },
      { id: "tim", name: "Tim Bauer", role: "BWL-Student · gründet Snackbox", city: "Passau", score: 81, skills: ["Businessplan", "Vertrieb", "Food"], cats: ["Vertrieb", "Finanzen"], type: "Mitgründer", avail: "Vollzeit", mode: "Hybrid", why: "Ähnliche Phase · sucht einen Tech-Partner", about: "Studiert BWL und baut gerade ein Abo für gesunde Snacks im Büro auf.", seeks: "Tech-Partner für Website und App", offers: "Businessplan, Vertrieb, Finanzen", color: COLORS[7] },
      { id: "sophie", name: "Sophie Krämer", role: "Seriengründerin & Business Angel", city: "Hamburg", score: 79, skills: ["Strategie", "Finanzierung", "Netzwerk"], cats: ["Finanzen"], type: "Mentor", avail: "Wenige Std./Woche", mode: "Remote", why: "Erfahrung mit drei Gründungen · investiert in junge Teams", about: "Hat drei Unternehmen gegründet und unterstützt heute junge Gründer als Mentorin.", seeks: "Ambitionierte Teams in frühen Phasen", offers: "Strategie, Finanzierung, Netzwerk", color: COLORS[5] },
      { id: "david", name: "David Klein", role: "B2B-Sales · SaaS", city: "Ingolstadt", score: 76, skills: ["Vertrieb", "Verhandlung", "CRM"], cats: ["Vertrieb"], type: "Austausch", avail: "Teilzeit", mode: "Hybrid", why: "Vertriebswissen für deinen Launch", about: "Verkauft Software an Mittelständler und hilft gern bei den ersten Kunden.", seeks: "Austausch mit Gründern", offers: "Vertrieb, Preisgestaltung, erste Kunden", color: COLORS[0] }
    ];
    var discoverProjects = [
      { id: "greenroute", name: "GreenRoute", desc: "Nachhaltige Lieferrouten für lokale Händler.", owner: "Paul Neumann", stage: "Prototyp", needs: ["Backend-Entwicklung", "KI"], cats: ["Entwicklung", "KI"], score: 89, color: COLORS[2], members: 3 },
      { id: "lernwerk", name: "Lernwerk", desc: "KI-Lernplattform für Auszubildende.", owner: "Sara Wolf", stage: "Idee", needs: ["UI/UX-Design", "Prompting"], cats: ["Design", "KI"], score: 84, color: COLORS[0], members: 2 },
      { id: "snackbox", name: "Snackbox", desc: "Gesunde Snacks im Abo für Büros.", owner: "Tim Bauer", stage: "Konzept", needs: ["Tech-Partner", "Marketing"], cats: ["Marketing", "Entwicklung"], score: 81, color: COLORS[7], members: 1 },
      { id: "pulsefit", name: "Pulsefit", desc: "Fitness-App mit persönlichem KI-Trainer.", owner: "Leon Hartmann", stage: "Beta", needs: ["App-Entwicklung", "Design"], cats: ["Entwicklung", "Design"], score: 78, color: COLORS[4], members: 4 }
    ];
    function tasks(list) { return list.map(function (t) { return { id: uid(), t: t[0], s: t[1], who: t[2] || "me" }; }); }
    return {
      route: "dashboard",
      layout: "grid",
      editing: false,
      widgets: [
        { id: "focus", on: true }, { id: "matches", on: true }, { id: "activity", on: true },
        { id: "projects", on: true }, { id: "ai", on: true }, { id: "stats", on: true }, { id: "events", on: true }
      ],
      people: people,
      dProjects: discoverProjects,
      dTab: "people",
      dq: "",
      dSkills: [],
      dType: "",
      dAvail: "",
      dMode: "",
      rejected: [],
      learned: {},
      conn: {},
      interest: {},
      projects: [
        { id: "xyntal", name: "Xyntal Launch", desc: "Beta vorbereiten und erste Nutzer gewinnen.", color: COLORS[0], members: ["me", "jonas", "mia"], due: "15. Dez.", tasks: tasks([["Onboarding-Flow testen", "todo"], ["Landingpage-Texte schreiben", "todo", "mia"], ["Matching-Algorithmus v2", "doing", "jonas"], ["Pitch-Deck überarbeiten", "doing"], ["Logo finalisieren", "done", "mia"], ["Datenbank-Schema", "done", "jonas"], ["Nutzerinterviews auswerten", "done"]]) },
        { id: "portfolio", name: "Portfolio-Relaunch", desc: "Eigene Website mit Projekten und Live-Demo.", color: COLORS[2], members: ["me"], due: "30. Okt.", tasks: tasks([["Demo einbinden", "doing"], ["Texte prüfen", "todo"], ["Design hell/dunkel", "done"], ["Projektseiten", "done"]]) },
        { id: "lern", name: "KI-Lernassistent", desc: "Lernkarten und Abfragen mit KI.", color: COLORS[3], members: ["me", "max"], due: "Jan.", tasks: tasks([["Prompt-Konzept", "doing", "max"], ["Lernkarten-Ansicht", "todo"], ["API-Anbindung", "todo"], ["Idee & Ziele", "done"]]) }
      ],
      ws: "xyntal",
      wsTab: "tasks",
      communities: [
        { id: "c1", name: "Gründer Regensburg", members: 412, joined: true, color: COLORS[0], desc: "Lokales Netzwerk für alle, die in und um Regensburg gründen.", event: "Stammtisch · Do., 19:00 Uhr", posts: [
          { id: uid(), who: "lena", text: "Wer kommt Donnerstag zum Stammtisch? Ich bringe ein paar Learnings aus unserer letzten Finanzierungsrunde mit.", when: "vor 2 Std.", likes: 14, liked: false },
          { id: uid(), who: "jonas", text: "Suche noch 2–3 Leute, die ein neues Onboarding testen wollen. Dauert 10 Minuten, Kaffee geht auf mich!", when: "gestern", likes: 8, liked: false }
        ] },
        { id: "c2", name: "KI-Builder DACH", members: 2380, joined: true, color: COLORS[1], desc: "Austausch rund um KI-Tools, Agents und Automatisierung.", event: "Online-Demo-Day · Mi., 18:00 Uhr", posts: [
          { id: uid(), who: "max", text: "Kleiner Tipp: Agents mit klar begrenzten Aufgaben funktionieren viel zuverlässiger als ein Agent, der alles kann.", when: "vor 5 Std.", likes: 31, liked: false }
        ] },
        { id: "c3", name: "Indie-Hacker Deutschland", members: 1105, joined: false, color: COLORS[2], desc: "Eigene Produkte bauen, launchen und davon leben.", event: "Launch-Feedback · Fr., 17:00 Uhr", posts: [
          { id: uid(), who: "elif", text: "Mein Side-Project hat gerade die ersten 100 Nutzer erreicht. Was waren eure besten Kanäle am Anfang?", when: "vor 1 Tag", likes: 22, liked: false }
        ] },
        { id: "c4", name: "Design & Product", members: 864, joined: false, color: COLORS[4], desc: "Für alle, die Produkte gestalten, die Menschen lieben.", event: "Portfolio-Review · Di., 19:00 Uhr", posts: [
          { id: uid(), who: "mia", text: "Teilt gern eure liebsten Onboarding-Beispiele, ich sammle gerade Inspiration!", when: "vor 3 Std.", likes: 12, liked: false }
        ] },
        { id: "c5", name: "Junge Selbstständige Bayern", members: 593, joined: false, color: COLORS[3], desc: "Erfahrungen, Fragen und Kontakte rund um die Selbstständigkeit.", event: "Steuer-Basics · Mo., 18:30 Uhr", posts: [
          { id: uid(), who: "aylin", text: "Frage in die Runde: Wie findet ihr eure ersten Kunden ohne Werbebudget?", when: "vor 6 Std.", likes: 17, liked: false }
        ] }
      ],
      comm: "c1",
      files: [
        { id: "f1", name: "Pitch-Deck_v3.pdf", kind: "pdf", size: "4,2 MB", updated: "vor 2 Std.", owner: "me", project: "xyntal",
          versions: [{ v: 3, who: "me", when: "vor 2 Std.", note: "Folie 5 mit neuen Zahlen" }, { v: 2, who: "lena", when: "gestern", note: "Feedback eingearbeitet" }, { v: 1, who: "me", when: "vor 1 Woche", note: "Erste Version" }],
          comments: [{ who: "lena", text: "Folie 5: Kannst du noch eine Zahl zur Zielgruppe ergänzen?", when: "vor 3 Std." }, { who: "jonas", text: "Die Demo-Folie ist richtig stark!", when: "gestern" }],
          shares: [{ who: "lena", perm: "Kommentieren" }, { who: "jonas", perm: "Bearbeiten" }], link: false,
          log: ["Nico hat Version 3 hochgeladen · vor 2 Std.", "Lena hat kommentiert · vor 3 Std.", "Jonas hat Bearbeitungsrechte erhalten · gestern", "Lena hat Version 2 hochgeladen · gestern"] },
        { id: "f2", name: "Roadmap_Q1.xlsx", kind: "xls", size: "312 KB", updated: "gestern", owner: "jonas", project: "xyntal",
          versions: [{ v: 2, who: "jonas", when: "gestern", note: "Sprint 3 ergänzt" }, { v: 1, who: "me", when: "vor 5 Tagen", note: "Erste Version" }],
          comments: [{ who: "me", text: "Matching v2 bitte eine Woche früher einplanen.", when: "gestern" }],
          shares: [{ who: "jonas", perm: "Bearbeiten" }, { who: "mia", perm: "Ansehen" }], link: false,
          log: ["Jonas hat Version 2 hochgeladen · gestern", "Nico hat kommentiert · gestern"] },
        { id: "f3", name: "Logo_final.svg", kind: "img", size: "48 KB", updated: "vor 3 Tagen", owner: "mia", project: "xyntal",
          versions: [{ v: 4, who: "mia", when: "vor 3 Tagen", note: "Finale Farben" }, { v: 3, who: "mia", when: "vor 1 Woche", note: "Neue Schrift" }],
          comments: [], shares: [{ who: "mia", perm: "Bearbeiten" }], link: true, log: ["Mia hat Version 4 hochgeladen · vor 3 Tagen"] },
        { id: "f4", name: "Nutzerinterviews.docx", kind: "doc", size: "1,1 MB", updated: "vor 4 Tagen", owner: "me", project: "xyntal",
          versions: [{ v: 1, who: "me", when: "vor 4 Tagen", note: "8 Interviews zusammengefasst" }], comments: [], shares: [], link: false, log: ["Nico hat die Datei erstellt · vor 4 Tagen"] },
        { id: "f5", name: "Matching-Konzept.pdf", kind: "pdf", size: "860 KB", updated: "vor 1 Woche", owner: "me", project: "xyntal",
          versions: [{ v: 2, who: "me", when: "vor 1 Woche", note: "Gewichtung der Kriterien" }, { v: 1, who: "me", when: "vor 2 Wochen", note: "Erste Version" }], comments: [{ who: "max", text: "Feedback-Schleife für abgelehnte Vorschläge wäre spannend!", when: "vor 6 Tagen" }], shares: [{ who: "max", perm: "Kommentieren" }], link: false, log: ["Max hat kommentiert · vor 6 Tagen"] }
      ],
      file: null,
      fileTab: "versions",
      fq: "",
      convs: [
        { id: "a1", title: "Pitch-Deck verbessern", when: "Heute", msgs: [
          { from: "me", text: "Wie mache ich meinen Pitch für Xyntal stärker?" },
          { from: "ai", text: AI.pitch }
        ] },
        { id: "a2", title: "Wochenplanung", when: "Gestern", msgs: [
          { from: "me", text: "Plane meine Woche." },
          { from: "ai", text: AI.plan }
        ] },
        { id: "a3", title: "Marktanalyse Networking-Apps", when: "Montag", msgs: [
          { from: "me", text: "Wie sieht der Markt für Networking-Apps aus?" },
          { from: "ai", text: AI.market }
        ] }
      ],
      conv: "a1",
      memories: ["Arbeitet an der Networking-App Xyntal", "Ziel: Beta-Launch im Dezember", "Bevorzugt kurze, konkrete Antworten", "Sucht einen Co-Founder für Marketing"],
      agents: [
        { id: "g1", name: "Match-Scout", desc: "Sucht täglich neue passende Kontakte und Projekte für dich.", icon: "compass", on: true, last: "heute, 07:00", runs: 128, state: "idle", log: [] },
        { id: "g2", name: "Meeting-Zusammenfasser", desc: "Fasst Gespräche im Workspace zusammen und erstellt Aufgaben.", icon: "message", on: true, last: "gestern, 16:40", runs: 34, state: "idle", log: [] },
        { id: "g3", name: "Wochenreport", desc: "Schickt dir jeden Freitag einen Bericht über deinen Fortschritt.", icon: "chart", on: false, last: "letzten Freitag", runs: 9, state: "idle", log: [] },
        { id: "g4", name: "Follow-up-Erinnerer", desc: "Erinnert dich an offene Kontaktanfragen und Antworten.", icon: "bell", on: true, last: "heute, 09:15", runs: 57, state: "idle", log: [] }
      ],
      rules: [
        { id: uid(), when: "Neues Match über 90 %", then: "Benachrichtigung senden", on: true },
        { id: uid(), when: "Datei wird kommentiert", then: "Aufgabe im Workspace erstellen", on: true },
        { id: uid(), when: "Aufgabe ist überfällig", then: "Erinnerung im Fokus-Assistenten", on: false }
      ],
      threads: [
        { id: "t1", who: "lena", unread: 1, msgs: [
          { from: "lena", text: "Hey Nico! Ich habe mir dein Pitch-Deck angeschaut – richtig starke Idee.", t: "09:12" },
          { from: "me", text: "Danke dir! Hast du Tipps, wie ich die Zielgruppe noch klarer mache?", t: "09:20" },
          { from: "lena", text: "Ja! Lass uns Donnerstag kurz telefonieren, dann gehen wir das zusammen durch.", t: "09:31" }
        ] },
        { id: "t2", who: "jonas", unread: 0, msgs: [
          { from: "jonas", text: "Matching v2 läuft lokal. Magst du morgen drüberschauen?", t: "gestern" },
          { from: "me", text: "Klar, schick mir den Branch!", t: "gestern" }
        ] },
        { id: "t3", who: "max", unread: 0, msgs: [
          { from: "max", text: "Hast du schon mal Agents mit festen Rollen ausprobiert? Funktioniert bei uns super.", t: "Mo." }
        ] }
      ],
      thread: null,
      notifs: [
        { id: uid(), icon: "compass", text: "Neues Match: Elif Yilmaz (86 %)", when: "vor 5 Min.", read: false, go: "discover" },
        { id: uid(), icon: "file", text: "Lena hat Pitch-Deck_v3.pdf kommentiert", when: "vor 3 Std.", read: false, go: "files" },
        { id: uid(), icon: "users", text: "Gründer Regensburg: Stammtisch am Donnerstag", when: "vor 5 Std.", read: true, go: "communities" },
        { id: uid(), icon: "bot", text: "Match-Scout hat 4 neue Vorschläge gefunden", when: "heute, 07:00", read: true, go: "agents" }
      ],
      activity: [
        { icon: "file", text: "Lena hat dein Pitch-Deck kommentiert", when: "vor 3 Std." },
        { icon: "check", text: "Mia hat „Logo finalisieren“ erledigt", when: "vor 4 Std." },
        { icon: "users", text: "Neuer Beitrag in KI-Builder DACH", when: "vor 5 Std." },
        { icon: "compass", text: "Match-Scout hat 4 neue Vorschläge gefunden", when: "heute, 07:00" }
      ],
      focus: {
        now: [{ id: uid(), t: "Pitch-Deck Folie 5 überarbeiten", s: "Xyntal Launch · 30 Min.", done: false }],
        next: [{ id: uid(), t: "Jonas wegen Matching v2 antworten", s: "Nachrichten · 10 Min.", done: false }, { id: uid(), t: "Roadmap Q1 prüfen", s: "Dateien · 20 Min.", done: false }],
        know: [{ id: uid(), t: "Lena hat dein Deck kommentiert", s: "vor 3 Std." }, { id: uid(), t: "Stammtisch Gründer Regensburg", s: "Do., 19:00 Uhr" }]
      },
      queue: [
        { id: uid(), t: "Onboarding-Flow testen", est: "45 Min.", done: false },
        { id: uid(), t: "Landingpage-Texte gegenlesen", est: "20 Min.", done: false },
        { id: uid(), t: "Interview mit Tim vorbereiten", est: "15 Min.", done: false },
        { id: uid(), t: "Wochenreport lesen", est: "5 Min.", done: true }
      ],
      timer: { total: 1500, left: 1500, running: false },
      settings: { start: "09:00", end: "17:00", days: [true, true, true, true, true, false, false], rec: 6, notif: { matches: true, messages: true, community: false, agents: true }, focusLen: 25 },
      tickets: [
        { id: "t1042", no: 1042, subject: "Datei-Upload bleibt bei 90 % hängen", cat: "Technik", status: "open", when: "heute", msgs: [{ from: "me", text: "Beim Hochladen größerer PDFs bleibt der Fortschritt bei 90 % stehen." }, { from: "support", text: "Danke für die Meldung! Wir schauen uns das an. Tritt das bei allen Dateien auf oder nur über 10 MB?" }] },
        { id: "t1038", no: 1038, subject: "Frage zum Pulse-Plan", cat: "Abo & Zahlung", status: "done", when: "vor 3 Tagen", msgs: [{ from: "me", text: "Was ist im Pulse-Plan alles enthalten?" }, { from: "support", text: "Pulse enthält unbegrenzte Matches, mehr Workspaces und mehr KI-Nachrichten. Alle Details findest du unter Abo." }] },
        { id: "t1031", no: 1031, subject: "Profil-Verifizierung", cat: "Konto", status: "prog", when: "vor 1 Woche", msgs: [{ from: "me", text: "Wie kann ich mein Profil als Mentor verifizieren?" }, { from: "support", text: "Wir prüfen gerade deine Angaben und melden uns in den nächsten Tagen." }] }
      ],
      ticket: "t1042",
      supTab: "tickets",
      archive: [
        { id: uid(), kind: "Projekt", name: "Nachhilfe-App (Idee)", when: "vor 3 Monaten" },
        { id: uid(), kind: "Datei", name: "Pitch-Deck_v1.pdf", when: "vor 2 Monaten" },
        { id: uid(), kind: "KI-Chat", name: "Namensideen für Xyntal", when: "vor 2 Monaten" },
        { id: uid(), kind: "Community", name: "Startup Weekend 2025", when: "vor 1 Monat" }
      ],
      users: [
        { name: "Lena Hoffmann", role: "Mentor", status: "Aktiv", joined: "März 2026", color: COLORS[1] },
        { name: "Jonas Weber", role: "Nutzer", status: "Aktiv", joined: "Juni 2026", color: COLORS[2] },
        { name: "Mia Lorenz", role: "Moderator", status: "Aktiv", joined: "Mai 2026", color: COLORS[4] },
        { name: "crypto_gains99", role: "Nutzer", status: "Gemeldet", joined: "gestern", color: COLORS[3] },
        { name: "Elif Yilmaz", role: "Nutzer", status: "Aktiv", joined: "Aug. 2026", color: COLORS[6] }
      ],
      reports: [
        { id: uid(), text: "Spam-Verdacht beim Profil „crypto_gains99“", when: "vor 1 Std.", done: false },
        { id: uid(), text: "Unpassender Beitrag in „Indie-Hacker Deutschland“", when: "vor 6 Std.", done: false }
      ],
      plan: "Free",
      meHeadline: "Baut Xyntal · KI-Entwicklung & Prototyping",
      meAbout: "Ich baue Apps mit KI-Tools und bringe Menschen zusammen, die etwas Eigenes aufbauen wollen. Aktuell entwickle ich Xyntal.",
      meSkills: ["Qt 6 & QML", "C++", "KI-Tools", "Prototyping", "Produktdesign", "IT & Netzwerke"]
    };
  }

  /* ---------- KI-Antworten (Beispiele) ---------- */
  var AI = {
    pitch: "Drei Hebel für einen stärkeren Pitch:\n\n**1. Problem zuerst:** Starte mit einer echten Geschichte – jemand mit großer Idee, aber ohne passendes Netzwerk.\n**2. Klarer Unterschied:** Zeig, dass Xyntal nicht nur vernetzt, sondern mit Workspaces direkt die Zusammenarbeit startet.\n**3. Beweis:** Ergänze erste Zahlen, z. B. Anmeldungen auf der Warteliste oder Zitate aus Nutzerinterviews.\n\nSoll ich dir eine Gliederung für 10 Folien erstellen?",
    plan: "Hier ist ein Vorschlag für deine Woche:\n\n**Mo–Di:** Matching v2 fertigstellen (Fokusblöcke am Vormittag)\n**Mi:** Pitch-Deck mit Lenas Feedback überarbeiten\n**Do:** Nutzerinterviews auswerten · abends Stammtisch Gründer Regensburg\n**Fr:** Wochenreport lesen und nächste Woche planen\n\nIch kann die Aufgaben direkt in deinen Fokus-Assistenten übernehmen.",
    market: "Kurzer Überblick:\n\n**Große Business-Netzwerke** sind breit, aber wenig persönlich.\n**Mentoring-Plattformen** bringen Leute zusammen, bieten aber keine gemeinsamen Arbeitsräume.\n**Die Chance für Xyntal:** Matching und Zusammenarbeit an einem Ort – speziell für junge Gründer und Selbstständige.\n\nTipp: Sprich mit 5–10 Leuten aus deiner Zielgruppe, um das zu bestätigen.",
    match: "Zu deinem Profil passen gerade besonders gut:\n\n**Lena Hoffmann (94 %)** – erfahrene Gründerin, bietet Mentoring\n**Jonas Weber (88 %)** – Full-Stack-Entwickler, sucht Mitgründer, auch in Regensburg\n**Elif Yilmaz (86 %)** – Daten & KI, offen für Austausch\n\nDu findest alle drei unter Discover.",
    greet: "Hey Nico! Wobei kann ich dir heute helfen? Ich kenne deine Projekte, Dateien und Ziele und kann zum Beispiel planen, Texte verbessern oder passende Kontakte vorschlagen.",
    fallback: "Gute Frage! In dieser Demo antworte ich mit vorbereiteten Beispielen. In der echten App greife ich auf deine Projekte, Dateien und Erinnerungen zu und antworte individuell.\n\nProbier mal: **„Wie verbessere ich meinen Pitch?“** oder **„Plane meine Woche“**."
  };
  function aiReply(q) {
    var l = q.toLowerCase();
    var m = q.match(/merk(?:e)? dir[:,]?\s*(.+)/i);
    if (m) {
      var mem = m[1].replace(/[.!]+$/, "");
      S.memories.unshift(mem.charAt(0).toUpperCase() + mem.slice(1));
      return "Alles klar, ich habe mir gemerkt: **„" + mem + "“**. Du findest es unter Erinnerungen.";
    }
    if (/pitch|deck|präsentation|investor/.test(l)) return AI.pitch;
    if (/woche|plan|zeit|fokus|organis/.test(l)) return AI.plan;
    if (/markt|konkurrenz|wettbewerb|analyse/.test(l)) return AI.market;
    if (/match|kontakt|mentor|netzwerk|partner|mitgründer/.test(l)) return AI.match;
    if (/^(hallo|hi|hey|servus|moin)\b/.test(l)) return AI.greet;
    return AI.fallback;
  }

  var S = seed();
  var DRAG = null;
  var TRIGGERS = ["Neues Match über 90 %", "Neue Nachricht von einem Kontakt", "Datei wird kommentiert", "Aufgabe ist überfällig", "Jeden Freitag um 16 Uhr", "Neues Mitglied im Workspace"];
  var ACTIONS = ["Benachrichtigung senden", "Aufgabe im Workspace erstellen", "Erinnerung im Fokus-Assistenten", "KI-Zusammenfassung erstellen", "E-Mail-Report senden"];
  var DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  var PLANS = [
    { name: "Free", icon: "user", color: "var(--text-2)", tag: "Zum Start", feats: ["Profil & Discover", "5 Matches pro Woche", "1 Workspace", "KI-Center Basis"] },
    { name: "Pulse", icon: "zap", color: "var(--cyan)", tag: "Für Macher", feats: ["Unbegrenzte Matches", "3 Workspaces", "Mehr KI-Nachrichten", "Nachrichten & Benachrichtigungen"] },
    { name: "Nexus", icon: "share", color: "var(--accent)", tag: "Beliebt", feats: ["Alles aus Pulse", "Agents & Automationen", "Fokus-Assistent", "10 GB Dateien mit Versionen"] },
    { name: "Ascend", icon: "rocket", color: "var(--accent-2)", tag: "Für Teams", feats: ["Alles aus Nexus", "Unbegrenzte Workspaces", "Hervorgehobenes Mentor-Profil", "Priorisierter Support"] }
  ];

  /* ---------- Navigation ---------- */
  var NAV = [
    { group: "Übersicht", items: [["dashboard", "Dashboard", "grid"], ["discover", "Discover", "compass"], ["messages", "Nachrichten", "message", true]] },
    { group: "Zusammenarbeit", items: [["projects", "Projekte & Workspaces", "folder"], ["communities", "Communities", "users"], ["files", "Dateien", "file"]] },
    { group: "KI", items: [["ai", "KI-Center", "sparkles"], ["agents", "Agents & Automationen", "bot"], ["focus", "Fokus-Assistent", "target", true]] },
    { group: "Konto", items: [["support", "Support & Archiv", "lifebuoy"], ["admin", "Admin", "shield"], ["plans", "Abo", "crown", true], ["settings", "Einstellungen", "settings", true]] }
  ];
  var TITLES = { dashboard: "Dashboard", discover: "Discover", messages: "Nachrichten", projects: "Projekte & Workspaces", workspace: "Workspace", communities: "Communities", community: "Community", files: "Dateien", ai: "KI-Center", agents: "Agents & Automationen", focus: "Fokus-Assistent", support: "Support & Archiv", admin: "Admin", plans: "Abo", settings: "Einstellungen", me: "Mein Profil" };
  var FULL = ["messages", "ai"];
  var SOON = { messages: 1, focus: 1, plans: 1, settings: 1 };

  function person(id) { return id === "me" ? ME : S.people.filter(function (p) { return p.id === id; })[0]; }
  function pname(id) { return id === "me" ? "Du" : person(id).name.split(" ")[0]; }
  function project(id) { return S.projects.filter(function (p) { return p.id === id; })[0]; }
  function progress(p) { var d = p.tasks.filter(function (t) { return t.s === "done"; }).length; return p.tasks.length ? Math.round(d / p.tasks.length * 100) : 0; }
  function unreadMsgs() { return S.threads.reduce(function (n, t) { return n + t.unread; }, 0); }
  function soonBanner(text) { return '<div class="banner">' + ic("rocket") + "<span><b>Bald verfügbar.</b> " + text + "</span></div>"; }

  function sidebar() {
    var unread = unreadMsgs();
    var html = '<div class="side__brand"><span class="logo">X</span>Xyntal</div><nav class="side__nav">';
    NAV.forEach(function (g) {
      html += '<div class="nav-group"><div class="nav-group__t">' + g.group + "</div>";
      g.items.forEach(function (it) {
        var r = it[0];
        var on = S.route === r || (r === "projects" && S.route === "workspace") || (r === "communities" && S.route === "community");
        var extra = r === "messages" && unread ? '<span class="cnt">' + unread + "</span>" : it[3] ? '<span class="soon">Bald</span>' : "";
        html += '<button class="nav-i ' + (on ? "on" : "") + '" data-act="go" data-r="' + r + '">' + ic(it[2]) + '<span class="lbl">' + it[1] + "</span>" + extra + "</button>";
      });
      html += "</div>";
    });
    html += '</nav><button class="side__me" data-act="go" data-r="me">' + avatar(ME) + '<span class="grow"><b>Nico Scheibe</b><small>' + S.plan + "-Plan</small></span>" + ic("settings", "sm dim") + "</button>";
    return html;
  }

  /* =========================================================
     ANSICHTEN
     ========================================================= */
  var V = {};

  /* ---------- Dashboard ---------- */
  var WIDGETS = {
    focus: { t: "Fokus heute", i: "target", body: function () {
      var items = S.focus.now.concat(S.focus.next).slice(0, 4);
      return items.map(function (f) {
        return '<div class="li ' + (f.done ? "done" : "") + '"><button class="check ' + (f.done ? "on" : "") + '" data-act="focusToggle" data-id="' + f.id + '" aria-label="Erledigt">' + ic("check") + '</button><div class="grow"><div class="t">' + esc(f.t) + '</div><div class="s">' + esc(f.s) + "</div></div></div>";
      }).join("") + '<button class="btn sm ghost mt-s w-more" data-act="go" data-r="focus">Fokus-Assistent öffnen ' + ic("right") + "</button>";
    } },
    matches: { t: "Neue Matches", i: "compass", body: function () {
      var list = S.people.filter(function (p) { return !S.conn[p.id] && S.rejected.indexOf(p.id) < 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 3);
      if (!list.length) return '<p class="muted small">Alle Vorschläge angesehen. Neue kommen morgen früh.</p>';
      return list.map(function (p) {
        return '<div class="li click" data-act="openProfile" data-id="' + p.id + '">' + avatar(p) + '<div class="grow"><div class="t ell">' + esc(p.name) + '</div><div class="s ell">' + esc(p.role) + '</div></div><div class="score sm" style="--p:' + p.score + '"><span>' + p.score + "</span></div></div>";
      }).join("") + '<button class="btn sm ghost mt-s w-more" data-act="go" data-r="discover">Alle in Discover ' + ic("right") + "</button>";
    } },
    activity: { t: "Aktivität", i: "history", body: function () {
      return '<div class="feed">' + S.activity.slice(0, 5).map(function (a) {
        return '<div class="li">' + ic(a.icon) + '<div class="grow t" style="font-weight:500">' + esc(a.text) + '</div><span class="s">' + esc(a.when) + "</span></div>";
      }).join("") + "</div>";
    } },
    projects: { t: "Projekte", i: "folder", body: function () {
      return S.projects.map(function (p) {
        var pr = progress(p);
        return '<div class="li click" data-act="openWs" data-id="' + p.id + '"><div class="grow"><div class="row"><span class="t grow ell">' + esc(p.name) + '</span><span class="s">' + pr + ' %</span></div><div class="bar mt-s"><span style="width:' + pr + '%"></span></div></div></div>';
      }).join("");
    } },
    ai: { t: "KI-Tipp des Tages", i: "sparkles", body: function () {
      return '<div class="tip"><b>Lena hat dein Deck kommentiert.</b> Wenn du ihre Anmerkung zu Folie 5 heute umsetzt, kannst du es Donnerstag beim Stammtisch zeigen.</div><button class="btn sm" data-act="aiAsk" data-q="Wie mache ich meinen Pitch stärker?">' + ic("sparkles") + " Mit KI besprechen</button>";
    } },
    stats: { t: "Deine Woche", i: "chart", body: function () {
      var c = Object.keys(S.conn).filter(function (k) { return S.conn[k] === "connected"; }).length;
      return '<div class="stats"><div class="stat"><b>' + (23 + c) + '</b><span>Kontakte</span></div><div class="stat"><b>' + S.projects.length + '</b><span>Projekte</span></div><div class="stat"><b>92 %</b><span>Antwortrate</span></div></div>';
    } },
    events: { t: "Community-Events", i: "calendar", body: function () {
      var js = S.communities.filter(function (c) { return c.joined; });
      if (!js.length) return '<p class="muted small">Tritt Communities bei, um Events zu sehen.</p>';
      return js.map(function (c) {
        return '<div class="li click" data-act="openComm" data-id="' + c.id + '"><div class="grow"><div class="t ell">' + esc(c.event) + '</div><div class="s ell">' + esc(c.name) + "</div></div>" + ic("right", "sm dim") + "</div>";
      }).join("");
    } }
  };

  V.dashboard = function () {
    var h = new Date().getHours();
    var greet = h < 11 ? "Guten Morgen" : h < 18 ? "Hallo" : "Guten Abend";
    var date = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
    var open = S.focus.now.concat(S.focus.next).filter(function (f) { return !f.done; }).length;
    var layouts = [["grid", "Raster", "grid"], ["compact", "Kompakt", "layout"], ["focus", "Fokus", "target"]];
    var html = '<div class="ph"><div><h1>' + greet + ', Nico</h1><p>' + date + " · " + open + " Aufgaben im Fokus · " + S.people.filter(function (p) { return !S.conn[p.id]; }).length + ' Vorschläge in Discover</p></div><div class="row">' +
      '<div class="seg" role="group" aria-label="Layout">' + layouts.map(function (l) { return '<button class="' + (S.layout === l[0] ? "on" : "") + '" data-act="layout" data-v="' + l[0] + '">' + ic(l[2], "sm") + l[1] + "</button>"; }).join("") + "</div>" +
      '<button class="btn ' + (S.editing ? "pri" : "") + '" data-act="editWidgets">' + ic(S.editing ? "check" : "edit") + (S.editing ? "Fertig" : "Anpassen") + "</button></div></div>";
    if (S.editing) html += '<div class="banner acc">' + ic("grip") + "<span>Ziehe Widgets an eine neue Position oder blende sie mit dem Auge aus und ein.</span></div>";
    html += '<div class="widgets layout-' + S.layout + (S.editing ? " editing" : "") + '">';
    S.widgets.forEach(function (w) {
      if (!w.on && !S.editing) return;
      var def = WIDGETS[w.id];
      html += '<section class="card w w-' + w.id + (w.on ? "" : " off") + '" data-drop="widget" data-id="' + w.id + '"' + (S.editing ? ' draggable="true" data-drag="widget"' : "") + ">" +
        '<div class="w-h">' + ic(def.i) + "<h3>" + def.t + '</h3><div class="w-edit">' + ic("grip", "sm dim") + '<button class="ibtn sm plain" data-act="toggleWidget" data-id="' + w.id + '" aria-label="Ein- oder ausblenden">' + ic(w.on ? "eye" : "eyeOff", "sm") + "</button></div></div>" + def.body() + "</section>";
    });
    return html + "</div>";
  };

  /* ---------- Discover ---------- */
  function discoverList() {
    var q = S.dq.toLowerCase();
    var src = S.dTab === "people" ? S.people : S.dProjects;
    var list = src.filter(function (x) {
      if (S.dTab === "people" && S.rejected.indexOf(x.id) >= 0) return false;
      if (S.dSkills.length && !S.dSkills.some(function (s) { return x.cats.indexOf(s) >= 0; })) return false;
      if (S.dTab === "people") {
        if (S.dType && x.type !== S.dType) return false;
        if (S.dAvail && x.avail !== S.dAvail) return false;
        if (S.dMode && x.mode !== S.dMode) return false;
      }
      if (q) {
        var hay = (x.name + " " + (x.role || x.desc) + " " + (x.skills || x.needs).join(" ") + " " + (x.city || "")).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    // Abgelehnte Kategorien senken den Score leicht (intelligenteres Matching)
    list = list.map(function (x) {
      var pen = 0;
      x.cats.forEach(function (c) { pen += (S.learned[c] || 0) * 3; });
      return { x: x, s: Math.max(40, x.score - pen) };
    }).sort(function (a, b) { return b.s - a.s; });
    return list.slice(0, S.settings.rec);
  }
  function personCard(o) {
    var p = o.x;
    var st = S.conn[p.id];
    var act = st === "connected" ? '<button class="btn grow-btn ok" data-act="msgPerson" data-id="' + p.id + '">' + ic("message") + "Nachricht</button>"
      : st === "pending" ? '<button class="btn grow-btn" disabled>' + ic("clock") + "Anfrage gesendet</button>"
      : '<button class="btn" data-act="reject" data-id="' + p.id + '" aria-label="Ablehnen">' + ic("x") + '</button><button class="btn pri grow-btn" data-act="connect" data-id="' + p.id + '">' + ic("plus") + "Verbinden</button>";
    return '<article class="card pcard" data-act="openProfile" data-id="' + p.id + '"><div class="pcard__top">' + avatar(p, "lg") + '<div class="grow"><div class="pcard__name ell">' + esc(p.name) + '</div><div class="small muted ell">' + esc(p.role) + '</div><div class="xs dim row" style="gap:4px;margin-top:2px">' + ic("pin", "sm") + esc(p.city) + '</div></div><div class="score" style="--p:' + o.s + '"><span>' + o.s + " %</span></div></div>" +
      '<div class="why">' + ic("sparkles") + "<span>" + esc(p.why) + '</span></div><div class="tags">' + p.skills.map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + '</div><div class="pcard__meta"><span class="chip acc">' + esc(p.type) + '</span><span class="chip">' + esc(p.avail) + '</span><span class="chip">' + esc(p.mode) + '</span></div><div class="pcard__act">' + act + "</div></article>";
  }
  function projectCard(o) {
    var p = o.x;
    var done = S.interest[p.id];
    return '<article class="card pcard"><div class="pcard__top"><span class="proj-ico" style="background:' + p.color + '">' + esc(p.name.charAt(0)) + '</span><div class="grow"><div class="pcard__name">' + esc(p.name) + '</div><div class="small muted">von ' + esc(p.owner) + ' · ' + p.members + ' Mitglieder</div></div><div class="score" style="--p:' + o.s + '"><span>' + o.s + " %</span></div></div>" +
      '<p class="muted">' + esc(p.desc) + '</p><div><div class="xs dim" style="margin-bottom:6px">SUCHT</div><div class="tags">' + p.needs.map(function (n) { return '<span class="chip acc">' + esc(n) + "</span>"; }).join("") + '</div></div><div class="pcard__meta"><span class="chip green">' + esc(p.stage) + '</span></div><div class="pcard__act">' +
      (done ? '<button class="btn grow-btn ok" disabled>' + ic("check") + "Interesse gesendet</button>" : '<button class="btn pri grow-btn" data-act="interest" data-id="' + p.id + '">' + ic("star") + "Interesse zeigen</button>") + "</div></article>";
  }
  function discoverGrid() {
    var list = discoverList();
    if (!list.length) return '<div class="card empty">' + ic("search") + "<b>Keine Treffer</b>Passe die Filter an oder setze sie zurück.<br><button class=\"btn sm mt\" data-act=\"resetFilters\">Filter zurücksetzen</button></div>";
    return '<div class="grid-cards">' + list.map(S.dTab === "people" ? personCard : projectCard).join("") + "</div>";
  }
  V.discover = function () {
    var skills = ["Design", "Entwicklung", "Marketing", "KI", "Vertrieb", "Finanzen"];
    function sel(key, label, opts) {
      return '<select class="input auto" data-chg="filter" data-k="' + key + '" aria-label="' + label + '"><option value="">' + label + ": alle</option>" + opts.map(function (o) { return '<option ' + (S[key] === o ? "selected" : "") + ">" + o + "</option>"; }).join("") + "</select>";
    }
    var learnedKeys = Object.keys(S.learned).filter(function (k) { return S.learned[k] > 0; });
    var html = '<div class="ph"><div><h1>Discover</h1><p>Menschen und Projekte, die zu deinen Fähigkeiten, Interessen und deiner Arbeitsweise passen.</p></div>' +
      '<div class="seg"><button class="' + (S.dTab === "people" ? "on" : "") + '" data-act="set" data-k="dTab" data-v="people">' + ic("users", "sm") + 'Menschen</button><button class="' + (S.dTab === "projects" ? "on" : "") + '" data-act="set" data-k="dTab" data-v="projects">' + ic("folder", "sm") + "Projekte</button></div></div>";
    html += '<div class="toolbar"><div class="input-icon">' + ic("search") + '<input class="input" id="dq" data-in="dq" placeholder="Name, Fähigkeit, Stadt …" value="' + esc(S.dq) + '"></div>';
    if (S.dTab === "people") html += sel("dType", "Rolle", ["Mentor", "Mitgründer", "Austausch"]) + sel("dAvail", "Verfügbarkeit", ["Wenige Std./Woche", "Teilzeit", "Vollzeit"]) + sel("dMode", "Arbeitsweise", ["Remote", "Hybrid", "Vor Ort"]);
    html += "</div>";
    html += '<div class="toolbar">' + skills.map(function (s) { return '<button class="chip ' + (S.dSkills.indexOf(s) >= 0 ? "on" : "") + '" data-act="skill" data-v="' + s + '">' + s + "</button>"; }).join("") + '<span class="xs dim" style="margin-left:auto">' + S.settings.rec + ' Empfehlungen · <button class="like" style="color:var(--accent)" data-act="go" data-r="settings">ändern</button></span></div>';
    if (S.rejected.length) {
      html += '<div class="banner acc">' + ic("sparkles") + '<span class="grow"><b>Matching lernt mit</b> <span class="soon">Bald</span><br>Du hast ' + S.rejected.length + " Vorschlag" + (S.rejected.length > 1 ? "e" : "") + " abgelehnt. Wir zeigen dir etwas weniger aus: " + learnedKeys.map(function (k) { return '<span class="chip" style="margin:2px">' + k + "</span>"; }).join("") + '</span><button class="btn sm" data-act="undoReject">Zurücksetzen</button></div>';
    }
    return html + '<div id="dgrid">' + discoverGrid() + "</div>";
  };

  /* ---------- Profil (Drawer) ---------- */
  function profileHtml(p) {
    var st = S.conn[p.id];
    var btn = st === "connected" ? '<button class="btn ok" data-act="msgPerson" data-id="' + p.id + '">' + ic("message") + "Nachricht schreiben</button>"
      : st === "pending" ? '<button class="btn" disabled>' + ic("clock") + "Anfrage gesendet</button>"
      : '<button class="btn pri" data-act="connect" data-id="' + p.id + '">' + ic("plus") + "Verbinden</button>";
    return '<div class="cover" style="--c:' + p.color + '"></div><div class="prof-h"><div class="row" style="align-items:flex-end">' + avatar(p, "xl") + '<div class="grow"></div><div class="score" style="--p:' + p.score + '"><span>' + p.score + ' %</span></div></div><h2 style="font:700 21px var(--head);margin-top:10px">' + esc(p.name) + '</h2><p class="muted">' + esc(p.role) + '</p><p class="small dim row" style="gap:5px;margin-top:4px">' + ic("pin", "sm") + esc(p.city) + '</p><div class="row mt">' + btn + '<button class="btn" data-act="toast" data-msg="Profil gespeichert">' + ic("bookmark") + "Merken</button></div></div>" +
      '<div class="prof-b"><div class="why">' + ic("sparkles") + "<span><b>Warum ihr passt:</b> " + esc(p.why) + "</span></div><h4>Über " + esc(p.name.split(" ")[0]) + '</h4><p class="muted">' + esc(p.about) + '</p><h4>Fähigkeiten</h4><div class="tags">' + p.skills.map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + '</div><h4>Sucht</h4><p class="muted">' + esc(p.seeks) + '</p><h4>Bietet</h4><p class="muted">' + esc(p.offers) + '</p><h4>Arbeitsweise</h4><div class="kv"><div><span>Rolle</span><b>' + esc(p.type) + '</b></div><div><span>Verfügbarkeit</span><b>' + esc(p.avail) + '</b></div><div><span>Arbeitsweise</span><b>' + esc(p.mode) + '</b></div><div><span>Antwortet</span><b>meist am selben Tag</b></div></div></div>';
  }

  /* ---------- Mein Profil ---------- */
  V.me = function () {
    return '<div class="card me-page"><div class="cover" style="--c:#7b84ff;height:150px"></div><div class="prof-h"><div class="row" style="align-items:flex-end">' + avatar(ME, "xl") + '<div class="grow"></div><button class="btn" data-act="editMe">' + ic("edit") + "Profil bearbeiten</button></div><h2 style=\"font:700 24px var(--head);margin-top:10px\">Nico Scheibe</h2><p class=\"muted\">" + esc(S.meHeadline) + '</p><p class="small dim row" style="gap:5px;margin-top:4px">' + ic("pin", "sm") + 'Regensburg · <span class="chip acc">' + S.plan + "-Plan</span></p></div>" +
      '<div class="prof-b"><div class="card pad" style="background:var(--panel-2)"><div class="row"><b class="grow">Profil zu 80 % vollständig</b><span class="small dim">Ergänze deine Verfügbarkeit für bessere Matches</span></div><div class="bar mt-s"><span style="width:80%"></span></div></div><h4>Über mich</h4><p class="muted">' + esc(S.meAbout) + '</p><h4>Fähigkeiten</h4><div class="tags">' + S.meSkills.map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + '</div><h4>Sucht</h4><p class="muted">Mitgründer für Marketing, Mentoren mit Gründungserfahrung, erste Beta-Tester</p><h4>Bietet</h4><p class="muted">Schnelle Prototypen mit KI, App-Entwicklung, IT-Know-how</p><h4>Projekte</h4><div class="tags">' + S.projects.map(function (p) { return '<button class="chip" data-act="openWs" data-id="' + p.id + '">' + ic("folder") + esc(p.name) + "</button>"; }).join("") + "</div></div></div>";
  };

  /* ---------- Nachrichten ---------- */
  V.messages = function () {
    var t = S.threads.filter(function (x) { return x.id === S.thread; })[0];
    var list = S.threads.map(function (th) {
      var p = person(th.who);
      var last = th.msgs[th.msgs.length - 1];
      return '<button class="thread ' + (th.id === S.thread ? "on" : "") + '" data-act="openThread" data-id="' + th.id + '">' + avatar(p) + '<span class="grow"><span class="row"><span class="nm grow ell">' + esc(p.name) + '</span><span class="xs dim">' + esc(last.t) + '</span></span><span class="pv ell" style="display:block">' + (last.from === "me" ? "Du: " : "") + esc(last.text) + "</span></span>" + (th.unread ? '<span class="ndot"></span>' : "") + "</button>";
    }).join("");
    var chat;
    if (t) {
      var p = person(t.who);
      chat = '<div class="pane-h"><button class="ibtn sm plain back-chat" data-act="closeThread" aria-label="Zurück">' + ic("left") + "</button>" + avatar(p) + '<div class="grow"><b>' + esc(p.name) + '</b><div class="xs dim">' + esc(p.role) + '</div></div><button class="btn sm" data-act="openProfile" data-id="' + p.id + '">Profil</button></div><div class="msgs" id="msgs"><span class="daysep">Heute</span>' +
        t.msgs.map(function (m) {
          if (m.typing) return '<div class="msg">' + avatar(p, "sm") + '<div class="bubble"><span class="typing"><span></span><span></span><span></span></span></div></div>';
          var mine = m.from === "me";
          return '<div class="msg ' + (mine ? "me" : "") + '">' + (mine ? "" : avatar(p, "sm")) + '<div><div class="bubble">' + md(m.text) + '</div><div class="msg-t">' + esc(m.t) + "</div></div></div>";
        }).join("") + '</div><form class="composer" data-form="msg"><textarea class="input" name="text" rows="1" placeholder="Nachricht an ' + esc(p.name.split(" ")[0]) + ' …" data-enter></textarea><button class="btn pri" aria-label="Senden">' + ic("send") + "</button></form>";
    } else {
      chat = '<div class="ai-hero"><span class="logo">' + ic("message", "lg") + '</span><h2>Deine Nachrichten</h2><p class="muted">Wähle links eine Unterhaltung aus. Wenn du dich in Discover mit jemandem verbindest, erscheint der Kontakt hier.</p></div>';
    }
    return '<div class="split ' + (t ? "show-chat" : "") + '"><div class="pane"><div class="pane-h"><h2>Nachrichten</h2><span class="soon">Bald</span></div><div class="pane-b">' + list + '</div><div style="padding:10px;border-top:1px solid var(--border)"><p class="xs dim">Nachrichten sind in Entwicklung. In der Demo antworten Kontakte automatisch.</p></div></div><div class="chat">' + chat + "</div></div>";
  };

  /* ---------- Projekte & Workspaces ---------- */
  V.projects = function () {
    return '<div class="ph"><div><h1>Projekte & Workspaces</h1><p>Plane, teile Dateien und arbeite mit deinem Team in einem Workspace.</p></div><button class="btn pri" data-act="newProject">' + ic("plus") + "Neues Projekt</button></div>" +
      '<div class="grid-cards">' + S.projects.map(function (p) {
        var pr = progress(p);
        var open = p.tasks.filter(function (t) { return t.s !== "done"; }).length;
        return '<article class="card wscard" data-act="openWs" data-id="' + p.id + '"><div class="row"><span class="proj-ico" style="background:' + p.color + '">' + esc(p.name.charAt(0)) + '</span><div class="grow"><b>' + esc(p.name) + '</b><div class="small muted ell">' + esc(p.desc) + '</div></div></div><div><div class="row small"><span class="grow muted">Fortschritt</span><b>' + pr + ' %</b></div><div class="bar mt-s"><span style="width:' + pr + '%"></span></div></div><div class="row"><div class="stack grow">' + p.members.map(function (m) { return avatar(person(m), "sm"); }).join("") + '</div><span class="chip">' + ic("check") + open + ' offen</span><span class="chip">' + ic("calendar") + esc(p.due) + "</span></div></article>";
      }).join("") + "</div>";
  };
  V.workspace = function () {
    var p = project(S.ws);
    if (!p) { S.route = "projects"; return V.projects(); }
    var pr = progress(p);
    var tabs = [["overview", "Übersicht"], ["tasks", "Aufgaben"], ["files", "Dateien"], ["members", "Mitglieder"]];
    var html = '<button class="back" data-act="go" data-r="projects">' + ic("left", "sm") + 'Alle Projekte</button><div class="ws-head"><span class="proj-ico" style="background:' + p.color + '">' + esc(p.name.charAt(0)) + '</span><div class="grow"><h1>' + esc(p.name) + '</h1><p class="muted">' + esc(p.desc) + '</p></div><div style="min-width:180px"><div class="row small"><span class="grow muted">Fortschritt</span><b>' + pr + ' %</b></div><div class="bar mt-s"><span style="width:' + pr + '%"></span></div></div><div class="stack">' + p.members.map(function (m) { return avatar(person(m)); }).join("") + '</div><button class="btn" data-act="invite">' + ic("plus") + "Einladen</button></div>";
    html += '<div class="tabs">' + tabs.map(function (t) { return '<button class="' + (S.wsTab === t[0] ? "on" : "") + '" data-act="set" data-k="wsTab" data-v="' + t[0] + '">' + t[1] + "</button>"; }).join("") + "</div>";
    if (S.wsTab === "tasks") {
      var cols = [["todo", "Offen", "var(--text-3)"], ["doing", "In Arbeit", "var(--amber)"], ["done", "Erledigt", "var(--green)"]];
      html += '<p class="small dim" style="margin-bottom:12px">Tipp: Ziehe Aufgaben zwischen die Spalten.</p><div class="kanban">' + cols.map(function (c) {
        var ts = p.tasks.filter(function (t) { return t.s === c[0]; });
        return '<div class="col" data-drop="task" data-col="' + c[0] + '"><div class="col-h"><span class="c" style="background:' + c[2] + '"></span>' + c[1] + '<span class="n">' + ts.length + "</span></div>" +
          ts.map(function (t) { return '<div class="task" draggable="true" data-drag="task" data-id="' + t.id + '"><div class="t">' + esc(t.t) + '</div><div class="row">' + avatar(person(t.who), "sm") + '<span class="xs dim grow">' + esc(pname(t.who)) + "</span>" + (c[0] !== "done" ? '<button class="ibtn sm plain" data-act="taskDone" data-id="' + t.id + '" aria-label="Als erledigt markieren">' + ic("check", "sm") + "</button>" : "") + "</div></div>"; }).join("") +
          (c[0] === "todo" ? '<form class="add-task" data-form="task"><input class="input" name="t" placeholder="Neue Aufgabe …" autocomplete="off"><button class="btn sm pri" aria-label="Hinzufügen">' + ic("plus") + "</button></form>" : "") + "</div>";
      }).join("") + "</div>";
    } else if (S.wsTab === "overview") {
      var nextT = p.tasks.filter(function (t) { return t.s !== "done"; }).slice(0, 4);
      html += '<div class="two"><div class="card pad"><div class="card-h">' + ic("check") + "<h3>Als Nächstes</h3></div>" + (nextT.length ? nextT.map(function (t) { return '<div class="li"><button class="check" data-act="taskDone" data-id="' + t.id + '">' + ic("check") + '</button><div class="grow t">' + esc(t.t) + '</div><span class="chip ' + (t.s === "doing" ? "amber" : "") + '">' + (t.s === "doing" ? "In Arbeit" : "Offen") + "</span></div>"; }).join("") : '<p class="muted">Alles erledigt!</p>') +
        '</div><div class="card pad"><div class="card-h">' + ic("sparkles") + '<h3>KI-Zusammenfassung</h3></div><p class="muted small">Das Team ist gut im Plan. ' + p.tasks.filter(function (t) { return t.s === "done"; }).length + " Aufgaben sind erledigt, " + p.tasks.filter(function (t) { return t.s === "doing"; }).length + ' laufen gerade. Größtes Risiko: Das Matching v2 ist noch nicht getestet.</p><button class="btn sm mt" data-act="aiAsk" data-q="Was sollte ich im Projekt ' + esc(p.name) + ' als Nächstes tun?">' + ic("sparkles") + "Im KI-Center vertiefen</button></div></div>";
    } else if (S.wsTab === "files") {
      var fs = S.files.filter(function (f) { return f.project === p.id; });
      html += '<div class="card tbl-wrap">' + (fs.length ? fileTable(fs) : '<div class="empty">' + ic("file") + "<b>Noch keine Dateien</b></div>") + "</div>";
    } else {
      html += '<div class="card pad">' + p.members.map(function (m) {
        var pp = person(m);
        return '<div class="li">' + avatar(pp) + '<div class="grow"><div class="t">' + esc(pp.name) + (m === "me" ? " (du)" : "") + '</div><div class="s">' + esc(m === "me" ? "Gründer · Idee & Entwicklung" : pp.role) + '</div></div><span class="chip ' + (m === "me" ? "acc" : "") + '">' + (m === "me" ? "Admin" : "Mitglied") + "</span></div>";
      }).join("") + "</div>";
    }
    return html;
  };

  /* ---------- Communities ---------- */
  V.communities = function () {
    return '<div class="ph"><div><h1>Communities</h1><p>Finde Gleichgesinnte, tausche dich aus und entdecke Events.</p></div></div><div class="grid-cards">' + S.communities.map(function (c) {
      return '<article class="card ccard" data-act="openComm" data-id="' + c.id + '"><div class="cover" style="--c:' + c.color + '"></div><div class="body"><b style="font-size:15px">' + esc(c.name) + '</b><p class="small muted">' + esc(c.desc) + '</p><div class="row small dim">' + ic("users", "sm") + c.members.toLocaleString("de-DE") + " Mitglieder</div><div class=\"row small dim\">" + ic("calendar", "sm") + esc(c.event) + '</div><button class="btn ' + (c.joined ? "ok" : "pri") + ' mt-s" data-act="join" data-id="' + c.id + '">' + ic(c.joined ? "check" : "plus") + (c.joined ? "Beigetreten" : "Beitreten") + "</button></div></article>";
    }).join("") + "</div>";
  };
  V.community = function () {
    var c = S.communities.filter(function (x) { return x.id === S.comm; })[0];
    var html = '<button class="back" data-act="go" data-r="communities">' + ic("left", "sm") + 'Alle Communities</button><div class="card" style="overflow:hidden;margin-bottom:16px"><div class="cover" style="--c:' + c.color + ';height:90px"></div><div class="m-b row wrap"><div class="grow"><h1 style="font:700 22px var(--head)">' + esc(c.name) + '</h1><p class="muted small">' + esc(c.desc) + " · " + c.members.toLocaleString("de-DE") + ' Mitglieder</p></div><span class="chip acc">' + ic("calendar") + esc(c.event) + '</span><button class="btn ' + (c.joined ? "ok" : "pri") + '" data-act="join" data-id="' + c.id + '">' + ic(c.joined ? "check" : "plus") + (c.joined ? "Beigetreten" : "Beitreten") + "</button></div></div>";
    html += '<div class="two"><div>';
    if (c.joined) html += '<form class="card pad" style="margin-bottom:12px" data-form="post"><div class="row" style="align-items:flex-start">' + avatar(ME) + '<textarea class="input" name="text" rows="2" placeholder="Teile etwas mit der Community …"></textarea></div><div class="row mt-s"><span class="grow"></span><button class="btn pri sm">' + ic("send") + "Posten</button></div></form>";
    else html += '<div class="banner acc">' + ic("users") + "<span>Tritt der Community bei, um Beiträge zu schreiben.</span></div>";
    html += c.posts.map(function (p) {
      var a = person(p.who);
      return '<article class="card post"><div class="row">' + avatar(a) + '<div class="grow"><b>' + esc(a.name) + '</b><div class="xs dim">' + esc(p.when) + '</div></div></div><p class="txt">' + md(p.text) + '</p><button class="like ' + (p.liked ? "on" : "") + '" data-act="like" data-id="' + p.id + '">' + ic("heart") + p.likes + "</button></article>";
    }).join("");
    html += '</div><div class="card pad"><div class="card-h">' + ic("users") + '<h3>Aktive Mitglieder</h3></div>' + S.people.slice(0, 5).map(function (p) { return '<div class="li click" data-act="openProfile" data-id="' + p.id + '">' + avatar(p, "sm") + '<span class="grow small ell">' + esc(p.name) + "</span></div>"; }).join("") + "</div></div>";
    return html;
  };

  /* ---------- Dateien ---------- */
  function fileTable(list) {
    return '<table class="tbl"><thead><tr><th>Name</th><th class="hide-sm">Geändert</th><th class="hide-md">Besitzer</th><th class="hide-sm">Größe</th></tr></thead><tbody>' + list.map(function (f) {
      if (f.uploading) return '<tr><td><div class="row"><span class="ftype ' + f.kind + '">' + f.kind.toUpperCase() + '</span><div><b>' + esc(f.name) + '</b><div class="uprog"><span id="up-' + f.id + '" style="width:' + f.p + '%"></span></div></div></div></td><td class="hide-sm dim">wird hochgeladen …</td><td class="hide-md"></td><td class="hide-sm"></td></tr>';
      return '<tr class="rowc ' + (S.file === f.id ? "sel" : "") + '" data-act="openFile" data-id="' + f.id + '"><td><div class="row"><span class="ftype ' + f.kind + '">' + f.kind.toUpperCase() + '</span><div style="min-width:0"><b class="ell" style="display:block">' + esc(f.name) + '</b><span class="xs dim">v' + f.versions[0].v + " · " + f.comments.length + ' Kommentare</span></div></div></td><td class="hide-sm muted">' + esc(f.updated) + '</td><td class="hide-md"><div class="row">' + avatar(person(f.owner), "sm") + '<span class="small">' + esc(pname(f.owner)) + '</span></div></td><td class="hide-sm muted">' + esc(f.size) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }
  V.files = function () {
    var q = S.fq.toLowerCase();
    var list = S.files.filter(function (f) { return !q || f.name.toLowerCase().indexOf(q) >= 0; });
    var f = S.files.filter(function (x) { return x.id === S.file; })[0];
    var html = '<div class="ph"><div><h1>Dateien</h1><p>Mit Versionen, Kommentaren, Freigaben und nachvollziehbaren Änderungen.</p></div><div class="row"><div class="input-icon">' + ic("search") + '<input class="input" data-in="fq" id="fq" placeholder="Dateien suchen …" value="' + esc(S.fq) + '"></div><button class="btn pri" data-act="upload">' + ic("upload") + "Hochladen</button></div></div>";
    html += '<div class="files ' + (f ? "" : "nosel") + '"><div class="card tbl-wrap" id="ftable">' + (list.length ? fileTable(list) : '<div class="empty">' + ic("search") + "<b>Keine Datei gefunden</b></div>") + "</div>";
    if (f) {
      var tabs = [["versions", "Versionen"], ["comments", "Kommentare"], ["shares", "Freigaben"], ["log", "Verlauf"]];
      html += '<aside class="card fpanel"><div class="row" style="margin-bottom:12px"><b class="grow ell">' + esc(f.name) + '</b><button class="ibtn sm plain" data-act="closeFile" aria-label="Schließen">' + ic("x") + '</button></div><div class="ftype lg ' + f.kind + '">' + f.kind.toUpperCase() + '</div><div class="row small dim mt-s"><span class="grow">' + esc(f.size) + " · " + esc(f.updated) + '</span><button class="btn sm" data-act="toast" data-msg="Download startet in der echten App">Öffnen</button></div><div class="tabs mt">' + tabs.map(function (t) { return '<button class="' + (S.fileTab === t[0] ? "on" : "") + '" data-act="set" data-k="fileTab" data-v="' + t[0] + '">' + t[1] + "</button>"; }).join("") + "</div>";
      if (S.fileTab === "versions") {
        html += f.versions.map(function (v, i) { return '<div class="ver"><span class="vtag ' + (i === 0 ? "cur" : "") + '">v' + v.v + '</span><div class="grow"><div class="small b">' + esc(v.note) + '</div><div class="xs dim">' + esc(pname(v.who)) + " · " + esc(v.when) + "</div></div>" + (i === 0 ? '<span class="xs" style="color:var(--green)">Aktuell</span>' : '<button class="btn sm" data-act="restoreVer" data-v="' + v.v + '">' + ic("refresh") + "Wiederherstellen</button>") + "</div>"; }).join("");
      } else if (S.fileTab === "comments") {
        html += (f.comments.length ? f.comments.map(function (c) { var p = person(c.who); return '<div class="cmt">' + avatar(p, "sm") + '<div class="grow"><div class="small"><b>' + esc(p.name) + '</b> <span class="dim xs">' + esc(c.when) + '</span></div><div class="small muted">' + esc(c.text) + "</div></div></div>"; }).join("") : '<p class="small dim">Noch keine Kommentare.</p>') +
          '<form class="row mt" data-form="comment"><input class="input" name="text" placeholder="Kommentar schreiben …" autocomplete="off"><button class="btn pri" aria-label="Senden">' + ic("send") + "</button></form>";
      } else if (S.fileTab === "shares") {
        html += '<div class="set-row"><div><div class="small b">Freigabe-Link</div><div class="xs dim">Jeder mit dem Link kann ansehen</div></div><button class="sw ' + (f.link ? "on" : "") + '" data-act="toggleLink" role="switch" aria-checked="' + f.link + '" aria-label="Freigabe-Link"></button></div>' + (f.link ? '<div class="row mt-s"><input class="input" readonly value="xyntal.app/f/' + f.id + 'k29x"><button class="btn sm" data-act="toast" data-msg="Link kopiert">' + ic("link") + "</button></div>" : "") +
          '<div style="margin-top:10px">' + f.shares.map(function (s, i) { var p = person(s.who); return '<div class="li">' + avatar(p, "sm") + '<span class="grow small">' + esc(p.name) + '</span><select class="input auto" style="height:30px;font-size:12px" data-chg="perm" data-i="' + i + '">' + ["Ansehen", "Kommentieren", "Bearbeiten"].map(function (o) { return "<option " + (s.perm === o ? "selected" : "") + ">" + o + "</option>"; }).join("") + "</select></div>"; }).join("") + "</div>" +
          '<form class="row mt" data-form="share"><select class="input" name="who">' + S.people.filter(function (p) { return !f.shares.some(function (s) { return s.who === p.id; }); }).map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + "</option>"; }).join("") + '</select><button class="btn pri sm">Teilen</button></form>';
      } else {
        html += '<div class="log">' + f.log.map(function (l) { return "<div>" + esc(l) + "</div>"; }).join("") + "</div>";
      }
      html += "</aside>";
    }
    return html + "</div>";
  };

  /* ---------- KI-Center ---------- */
  V.ai = function () {
    var c = S.convs.filter(function (x) { return x.id === S.conv; })[0];
    var list = S.convs.map(function (cv) {
      return '<button class="thread ' + (cv.id === S.conv ? "on" : "") + '" data-act="openConv" data-id="' + cv.id + '">' + ic("message", "dim") + '<span class="grow"><span class="nm ell" style="display:block">' + esc(cv.title) + '</span><span class="pv">' + esc(cv.when) + "</span></span></button>";
    }).join("");
    var body;
    if (!c || !c.msgs.length) {
      body = '<div class="msgs"><div class="ai-hero"><span class="logo">X</span><h2>Wie kann ich helfen?</h2><p class="muted" style="margin-bottom:16px">Ich kenne deine Projekte, Dateien und Ziele. Probier eine dieser Fragen:</p><div class="sugs">' + ["Wie verbessere ich meinen Pitch?", "Plane meine Woche", "Wer passt als Mitgründer zu mir?", "Merk dir: Ich arbeite am liebsten vormittags"].map(function (s) { return '<button class="chip" data-act="aiSuggest" data-q="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + "</div></div></div>";
    } else {
      body = '<div class="msgs" id="msgs">' + c.msgs.map(function (m) {
        if (m.from === "me") return '<div class="msg me"><div class="bubble">' + md(m.text) + "</div></div>";
        if (m.typing) return '<div class="msg">' + aiAvatar("sm") + '<div class="bubble"><span class="typing"><span></span><span></span><span></span></span></div></div>';
        return '<div class="msg">' + aiAvatar("sm") + '<div><div class="bubble">' + md(m.text) + '</div><div class="row" style="gap:4px;margin-top:4px"><button class="ibtn sm plain" data-act="toast" data-msg="Antwort kopiert" aria-label="Kopieren">' + ic("file", "sm") + '</button><button class="ibtn sm plain" data-act="toast" data-msg="Danke für dein Feedback!" aria-label="Hilfreich">' + ic("star", "sm") + "</button></div></div></div>";
      }).join("") + "</div>";
    }
    var mem = '<div class="pane-h"><h2>Erinnerungen</h2><span class="chip">' + S.memories.length + '</span></div><div class="pane-b">' + memList() + "</div>";
    return '<div class="split three ' + (S.aiList ? "" : "show-chat") + '"><div class="pane"><div class="pane-h"><h2>KI-Center</h2><button class="btn sm pri" data-act="newConv">' + ic("plus") + 'Neu</button></div><div class="pane-b">' + list + '</div></div><div class="chat"><div class="pane-h"><button class="ibtn sm plain back-chat" data-act="aiList" aria-label="Chats">' + ic("menu") + "</button>" + aiAvatar() + '<div class="grow"><b>' + esc(c ? c.title : "Neuer Chat") + '</b><div class="xs dim">Xyntal KI · kennt deinen Kontext</div></div><button class="btn sm mem-toggle" data-act="memModal">' + ic("bookmark") + 'Erinnerungen</button></div>' + body +
      '<form class="composer" data-form="ai"><textarea class="input" name="text" id="aiIn" rows="1" placeholder="Frag die KI … (Enter zum Senden)" data-enter></textarea><button class="btn pri" aria-label="Senden">' + ic("send") + '</button></form></div><div class="pane r">' + mem + "</div></div>";
  };
  function memList() {
    return '<p class="xs dim" style="padding:2px 4px 10px">Das merkt sich die KI über dich. Du behältst die Kontrolle.</p>' + S.memories.map(function (m, i) {
      return '<div class="mem">' + ic("bookmark") + '<span class="grow">' + esc(m) + '</span><button class="ibtn" data-act="delMem" data-i="' + i + '" aria-label="Löschen">' + ic("x", "sm") + "</button></div>";
    }).join("") + '<form class="row mt-s" data-form="mem"><input class="input" name="text" placeholder="Neue Erinnerung …" autocomplete="off"><button class="btn sm pri" aria-label="Hinzufügen">' + ic("plus") + "</button></form>";
  }

  /* ---------- Agents & Automationen ---------- */
  V.agents = function () {
    var html = '<div class="ph"><div><h1>Agents & Automationen</h1><p>Lass wiederkehrende Aufgaben automatisch im Hintergrund erledigen.</p></div><button class="btn pri" data-act="newRule">' + ic("plus") + "Neue Automation</button></div>";
    html += '<div class="grid-cards">' + S.agents.map(function (a) {
      var running = a.state === "running";
      return '<article class="card agent ' + (running ? "running" : "") + '"><div class="row"><span class="agent-ico">' + ic(a.icon) + '</span><div class="grow"><b>' + esc(a.name) + '</b><div class="xs dim">' + (a.on ? '<span style="color:var(--green)">● Aktiv</span>' : "○ Pausiert") + " · " + a.runs + ' Läufe</div></div><button class="sw ' + (a.on ? "on" : "") + '" data-act="toggleAgent" data-id="' + a.id + '" role="switch" aria-checked="' + a.on + '" aria-label="Agent aktiv"></button></div><p class="small muted">' + esc(a.desc) + '</p><div class="row"><span class="xs dim grow">' + ic("clock", "sm") + " Zuletzt: " + esc(a.last) + '</span><button class="btn sm ' + (running ? "" : "pri") + '" data-act="runAgent" data-id="' + a.id + '"' + (running ? " disabled" : "") + ">" + (running ? '<span class="spin"></span>Läuft …' : ic("play") + "Jetzt ausführen") + "</button></div>" +
        (a.log.length ? '<div class="alog">' + a.log.map(function (l) { return "<div" + (l.ok ? ' class="ok"' : "") + ">" + esc(l.t) + "</div>"; }).join("") + "</div>" : "") + "</article>";
    }).join("") + "</div>";
    html += '<h2 class="section-t">' + ic("zap") + 'Automationen</h2><div class="card">' + (S.rules.length ? S.rules.map(function (r) {
      return '<div class="rule"><span class="kw">WENN</span><span class="chip">' + esc(r.when) + '</span><span class="arrow">' + ic("right", "sm") + '</span><span class="kw">DANN</span><span class="chip acc">' + esc(r.then) + '</span><span class="grow"></span><button class="sw ' + (r.on ? "on" : "") + '" data-act="toggleRule" data-id="' + r.id + '" role="switch" aria-checked="' + r.on + '" aria-label="Automation aktiv"></button><button class="ibtn sm plain" data-act="delRule" data-id="' + r.id + '" aria-label="Löschen">' + ic("trash", "sm") + "</button></div>";
    }).join("") : '<div class="empty">' + ic("zap") + "<b>Noch keine Automationen</b></div>") + "</div>";
    return html;
  };

  /* ---------- Fokus-Assistent ---------- */
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r; }
  var RING = 2 * Math.PI * 70;
  V.focus = function () {
    var T = S.timer;
    var off = RING * (1 - T.left / T.total);
    function fitem(f, col) {
      var b = col === "now" ? '<button class="btn sm ok" data-act="focusToggle" data-id="' + f.id + '">' + ic("check") + (f.done ? "Erledigt" : "Abhaken") + '</button><button class="btn sm ghost" data-act="focusMove" data-id="' + f.id + '" data-to="next">Später</button>'
        : col === "next" ? '<button class="btn sm" data-act="focusMove" data-id="' + f.id + '" data-to="now">' + ic("play") + "Jetzt starten</button>" : '<button class="btn sm ghost" data-act="focusMove" data-id="' + f.id + '" data-to="gone">' + ic("check") + "Gelesen</button>";
      return '<div class="fitem ' + (f.done ? "done" : "") + '"><div class="t">' + esc(f.t) + '</div><div class="s">' + esc(f.s) + '</div><div class="row">' + b + "</div></div>";
    }
    var cols = [["now", "Jetzt", "var(--accent)"], ["next", "Danach", "var(--amber)"], ["know", "Gut zu wissen", "var(--cyan)"]];
    var html = '<div class="ph"><div><h1>Fokus-Assistent</h1><p>Empfehlungen, was jetzt wichtig ist – mit Aufgabenwarteschlange und Fokusblöcken.</p></div></div>' + soonBanner("Der Fokus-Assistent wird gerade entwickelt. So soll er aussehen.");
    html += '<div class="focus-top"><div class="card timer"><b style="font:600 14px var(--head)">Fokusblock</b><div class="ring"><svg viewBox="0 0 160 160"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#7b84ff"/><stop offset="1" stop-color="#a68bff"/></linearGradient></defs><circle class="bg" cx="80" cy="80" r="70"/><circle class="fg" id="tRing" cx="80" cy="80" r="70" stroke-dasharray="' + RING.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg><div class="val"><b id="tTime">' + fmt(T.left) + '</b><span>' + (T.running ? "Fokus läuft" : T.left === T.total ? "Bereit" : "Pausiert") + '</span></div></div><div class="row">' +
      (T.running ? '<button class="btn" data-act="timer" data-v="pause">' + ic("pause") + "Pause</button>" : '<button class="btn pri" data-act="timer" data-v="start">' + ic("play") + (T.left === T.total ? "Starten" : "Weiter") + "</button>") + '<button class="ibtn" data-act="timer" data-v="reset" aria-label="Zurücksetzen">' + ic("refresh") + '</button></div><div class="seg">' + [[1, "1 Min. (Demo)"], [25, "25"], [50, "50"]].map(function (l) { return '<button class="' + (T.total === l[0] * 60 ? "on" : "") + '" data-act="timerLen" data-v="' + l[0] + '">' + l[1] + "</button>"; }).join("") + "</div></div>";
    html += '<div class="card pad"><div class="card-h">' + ic("inbox") + '<h3>Aufgabenwarteschlange</h3><span class="chip">' + S.queue.filter(function (q) { return !q.done; }).length + " offen</span></div>" + S.queue.map(function (q, i) {
      return '<div class="q ' + (q.done ? "done" : "") + '"><span class="n">' + (i + 1) + '</span><button class="check ' + (q.done ? "on" : "") + '" data-act="queueToggle" data-i="' + i + '">' + ic("check") + '</button><span class="grow small" style="' + (q.done ? "text-decoration:line-through;color:var(--text-3)" : "") + '">' + esc(q.t) + '</span><span class="xs dim">' + esc(q.est) + '</span><button class="ibtn sm plain" data-act="queueMove" data-i="' + i + '" data-d="-1" aria-label="Nach oben">' + ic("up", "sm") + '</button><button class="ibtn sm plain" data-act="queueMove" data-i="' + i + '" data-d="1" aria-label="Nach unten">' + ic("down", "sm") + "</button></div>";
    }).join("") + '<form class="row mt" data-form="queue"><input class="input" name="t" placeholder="Aufgabe zur Warteschlange hinzufügen …" autocomplete="off"><button class="btn pri" aria-label="Hinzufügen">' + ic("plus") + "</button></form></div></div>";
    html += '<div class="fcols">' + cols.map(function (c) {
      var items = S.focus[c[0]];
      return '<div class="fcol"><h3><span class="c" style="background:' + c[2] + '"></span>' + c[1] + '<span class="chip">' + items.length + "</span></h3>" + (items.length ? items.map(function (f) { return fitem(f, c[0]); }).join("") : '<div class="card empty small">Nichts hier</div>') + "</div>";
    }).join("") + "</div>";
    return html;
  };
  function updTimer() {
    var T = S.timer, el = $("#tTime"), ring = $("#tRing");
    if (el) el.textContent = fmt(T.left);
    if (ring) ring.setAttribute("stroke-dashoffset", (RING * (1 - T.left / T.total)).toFixed(1));
  }

  /* ---------- Einstellungen ---------- */
  V.settings = function () {
    var s = S.settings;
    var n = [["matches", "Neue Matches"], ["messages", "Nachrichten"], ["community", "Community-Beiträge"], ["agents", "Agents & Automationen"]];
    return '<div class="ph"><div><h1>Einstellungen</h1><p>Lege fest, wann und wie viel Xyntal dir vorschlägt.</p></div><span class="saved" id="saved">' + ic("check", "sm") + "Gespeichert</span></div>" + soonBanner("Persönliche Einstellungen werden gerade ausgebaut.") +
      '<div class="set-grid"><div class="card pad"><div class="card-h">' + ic("clock") + '<h3>Arbeitszeiten</h3></div><div class="row"><div class="field grow"><label for="st">Beginn</label><input class="input" id="st" type="time" value="' + s.start + '" data-chg="setting" data-k="start"></div><div class="field grow"><label for="en">Ende</label><input class="input" id="en" type="time" value="' + s.end + '" data-chg="setting" data-k="end"></div></div><div class="field"><label>Arbeitstage</label><div class="days">' + DAYS.map(function (d, i) { return '<button class="' + (s.days[i] ? "on" : "") + '" data-act="day" data-i="' + i + '">' + d + "</button>"; }).join("") + '</div></div><p class="xs dim">Außerhalb deiner Arbeitszeit pausieren Empfehlungen und Benachrichtigungen.</p></div>' +
      '<div class="card pad"><div class="card-h">' + ic("compass") + '<h3>Empfehlungen</h3></div><div class="row"><span class="grow muted small">Vorschläge in Discover</span><span class="rng-val" id="recVal">' + s.rec + '</span></div><input type="range" min="2" max="12" value="' + s.rec + '" data-in="rec" data-chg="recDone" aria-label="Anzahl der Empfehlungen"><div class="row xs dim"><span class="grow">Weniger, dafür passender</span><span>Mehr Auswahl</span></div><div class="field mt"><label for="fl">Standard-Länge für Fokusblöcke</label><select class="input" id="fl" data-chg="setting" data-k="focusLen">' + [25, 50, 90].map(function (m) { return "<option " + (s.focusLen == m ? "selected" : "") + ' value="' + m + '">' + m + " Minuten</option>"; }).join("") + "</select></div></div>" +
      '<div class="card pad"><div class="card-h">' + ic("bell") + "<h3>Benachrichtigungen</h3></div>" + n.map(function (x) { return '<div class="set-row"><span class="small">' + x[1] + '</span><button class="sw ' + (s.notif[x[0]] ? "on" : "") + '" data-act="notifSet" data-k="' + x[0] + '" role="switch" aria-checked="' + s.notif[x[0]] + '" aria-label="' + x[1] + '"></button></div>'; }).join("") + "</div>" +
      '<div class="card pad"><div class="card-h">' + ic("lock") + '<h3>Konto & Datenschutz</h3></div><div class="set-row"><span class="small">Profil in Discover sichtbar</span><button class="sw on" data-act="swToggle" role="switch" aria-label="Profil sichtbar"></button></div><div class="set-row"><span class="small">KI darf Erinnerungen speichern</span><button class="sw on" data-act="swToggle" role="switch" aria-label="Erinnerungen"></button></div><div class="set-row"><span class="small">Sprache</span><select class="input auto" style="height:32px"><option>Deutsch</option><option>English</option></select></div></div></div>';
  };

  /* ---------- Support & Archiv ---------- */
  var STATUS = { open: ["Offen", "open"], prog: ["In Bearbeitung", "prog"], done: ["Gelöst", "done"] };
  V.support = function () {
    var html = '<div class="ph"><div><h1>Support & Archiv</h1><p>Anfragen verfolgen und archivierte Inhalte wiederherstellen.</p></div><button class="btn pri" data-act="newTicket">' + ic("plus") + 'Neues Ticket</button></div><div class="tabs"><button class="' + (S.supTab === "tickets" ? "on" : "") + '" data-act="set" data-k="supTab" data-v="tickets">' + ic("inbox", "sm") + 'Tickets <span class="soon">Bald</span></button><button class="' + (S.supTab === "archive" ? "on" : "") + '" data-act="set" data-k="supTab" data-v="archive">' + ic("archive", "sm") + "Archiv <span class=\"soon\">Bald</span></button></div>";
    if (S.supTab === "tickets") {
      var t = S.tickets.filter(function (x) { return x.id === S.ticket; })[0];
      html += '<div class="two"><div class="card">' + S.tickets.map(function (k) {
        return '<div class="li click" style="margin:0;padding:13px 16px;border-radius:0;border-bottom:1px solid var(--border);' + (k.id === S.ticket ? "background:var(--accent-soft)" : "") + '" data-act="openTicket" data-id="' + k.id + '"><div class="grow"><div class="t ell">#' + k.no + " · " + esc(k.subject) + '</div><div class="s">' + esc(k.cat) + " · " + esc(k.when) + '</div></div><span class="status ' + STATUS[k.status][1] + '">' + STATUS[k.status][0] + "</span></div>";
      }).join("") + "</div>";
      if (t) {
        html += '<div class="card pad"><div class="row" style="margin-bottom:12px"><div class="grow"><b>#' + t.no + " · " + esc(t.subject) + '</b><div class="xs dim">' + esc(t.cat) + '</div></div><span class="status ' + STATUS[t.status][1] + '">' + STATUS[t.status][0] + "</span></div>" + t.msgs.map(function (m) {
          var mine = m.from === "me";
          return '<div class="cmt">' + (mine ? avatar(ME, "sm") : '<span class="av sm ai">' + ic("lifebuoy") + "</span>") + '<div class="grow"><div class="small b">' + (mine ? "Du" : "Xyntal Support") + '</div><div class="small muted">' + md(m.text) + "</div></div></div>";
        }).join("") + (t.status !== "done" ? '<form class="row mt" data-form="ticketReply"><input class="input" name="text" placeholder="Antwort schreiben …" autocomplete="off"><button class="btn pri" aria-label="Senden">' + ic("send") + '</button></form><button class="btn sm ghost mt-s" data-act="closeTicket">' + ic("check") + "Als gelöst markieren</button>" : "") + "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="card">' + (S.archive.length ? S.archive.map(function (a) {
        var icn = { Projekt: "folder", Datei: "file", "KI-Chat": "sparkles", Community: "users" }[a.kind];
        return '<div class="li" style="padding:13px 16px">' + '<span class="nicon">' + ic(icn) + '</span><div class="grow"><div class="t">' + esc(a.name) + '</div><div class="s">' + a.kind + " · archiviert " + esc(a.when) + '</div></div><button class="btn sm" data-act="restore" data-id="' + a.id + '">' + ic("refresh") + "Wiederherstellen</button></div>";
      }).join("") : '<div class="empty">' + ic("archive") + "<b>Archiv ist leer</b>Alles wiederhergestellt.</div>") + "</div>";
    }
    return html;
  };

  /* ---------- Admin ---------- */
  V.admin = function () {
    var days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], vals = [12, 18, 9, 22, 27, 19, 31], max = 31;
    var openT = S.tickets.filter(function (t) { return t.status !== "done"; }).length;
    var openR = S.reports.filter(function (r) { return !r.done; }).length;
    return '<div class="ph"><div><h1>Admin</h1><p>Überblick über Nutzer, Aktivität, Meldungen und Support.</p></div><span class="chip">' + ic("shield") + "Admin-Ansicht · Beispieldaten</span></div>" +
      '<div class="kpis"><div class="card kpi"><span>' + ic("users", "sm") + 'Nutzer gesamt</span><b>1.284</b><em>+138 diesen Monat</em></div><div class="card kpi"><span>' + ic("zap", "sm") + 'Heute aktiv</span><b>312</b><em>+8 %</em></div><div class="card kpi"><span>' + ic("compass", "sm") + 'Matches (7 Tage)</span><b>87</b><em>+12 %</em></div><div class="card kpi"><span>' + ic("inbox", "sm") + 'Offene Tickets</span><b>' + openT + '</b><em style="color:var(--text-3)">' + openR + " Meldungen offen</em></div></div>" +
      '<div class="two"><div class="card pad"><div class="card-h">' + ic("chart") + '<h3>Neue Registrierungen</h3><span class="xs dim">letzte 7 Tage</span></div><div class="chart">' + vals.map(function (v, i) { return '<div><i data-v="' + v + '" style="height:' + Math.round(v / max * 100) + '%"></i><span>' + days[i] + "</span></div>"; }).join("") + '</div></div><div class="card pad"><div class="card-h">' + ic("flag") + "<h3>Meldungen</h3></div>" + S.reports.map(function (r) {
        return '<div class="li"><div class="grow"><div class="t small">' + esc(r.text) + '</div><div class="s">' + esc(r.when) + "</div></div>" + (r.done ? '<span class="status done">Erledigt</span>' : '<button class="btn sm" data-act="resolveReport" data-id="' + r.id + '">Prüfen</button>') + "</div>";
      }).join("") + "</div></div>" +
      '<h2 class="section-t">' + ic("users") + 'Nutzerverwaltung</h2><div class="card tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th class="hide-sm">Seit</th><th>Rolle</th><th>Status</th><th></th></tr></thead><tbody>' + S.users.map(function (u, i) {
        var stc = u.status === "Aktiv" ? "done" : u.status === "Gesperrt" ? "ban" : "open";
        return '<tr><td><div class="row"><span class="av sm" style="--c:' + u.color + '">' + esc(initials(u.name)) + '</span><b class="small">' + esc(u.name) + '</b></div></td><td class="hide-sm muted">' + esc(u.joined) + '</td><td><select class="input auto" style="height:30px;font-size:12px" data-chg="role" data-i="' + i + '">' + ["Nutzer", "Mentor", "Moderator", "Admin"].map(function (r) { return "<option " + (u.role === r ? "selected" : "") + ">" + r + "</option>"; }).join("") + '</select></td><td><span class="status ' + stc + '">' + u.status + '</span></td><td><button class="btn sm ' + (u.status === "Gesperrt" ? "" : "danger") + '" data-act="ban" data-i="' + i + '">' + (u.status === "Gesperrt" ? "Entsperren" : "Sperren") + "</button></td></tr>";
      }).join("") + "</tbody></table></div>";
  };

  /* ---------- Abo ---------- */
  V.plans = function () {
    return '<div class="ph"><div><h1>Abo</h1><p>Wähle die Stufe, die zu dir passt. Du kannst jederzeit wechseln.</p></div></div>' + soonBanner("Das Abo-Modell ist geplant. Die Inhalte der Stufen sind Beispiele, in der Demo wird nichts gekauft.") +
      '<div class="plans">' + PLANS.map(function (p, i) {
        var cur = S.plan === p.name;
        return '<article class="card plan ' + (cur ? "cur " : "") + (i === 3 ? "best" : "") + '"><span class="chip ptag ' + (i === 2 ? "acc" : "") + '">' + p.tag + '</span><span class="plan-ico" style="background:color-mix(in srgb,' + p.color + ' 16%,transparent);color:' + p.color + '">' + ic(p.icon) + "</span><h3>" + p.name + "</h3><ul>" + p.feats.map(function (f) { return "<li>" + ic("check") + "<span>" + f + "</span></li>"; }).join("") + "</ul>" +
          (cur ? '<button class="btn ok" disabled>' + ic("check") + "Dein aktueller Plan</button>" : '<button class="btn ' + (i >= 2 ? "pri" : "") + '" data-act="choosePlan" data-v="' + p.name + '">' + p.name + " wählen</button>") + "</article>";
      }).join("") + "</div>";
  };

  /* =========================================================
     RENDERN & NAVIGATION
     ========================================================= */
  function render() {
    $("#side").innerHTML = sidebar();
    $("#topTitle").textContent = TITLES[S.route] || "";
    var v = $("#view");
    v.className = "view" + (FULL.indexOf(S.route) >= 0 ? " full" : "");
    v.innerHTML = V[S.route]();
    $("#bellDot").hidden = !S.notifs.some(function (n) { return !n.read; });
    var m = $("#msgs");
    if (m) m.scrollTop = m.scrollHeight;
  }
  function go(r, opts) {
    if (opts) Object.keys(opts).forEach(function (k) { S[k] = opts[k]; });
    S.route = r;
    if (r === "messages" && S.thread) markRead(S.thread);
    $("#app").classList.remove("nav-open");
    closeLayer();
    render();
    $("#view").scrollTop = 0;
  }
  function rerender() {
    var v = $("#view"), y = v.scrollTop;
    render();
    v.scrollTop = y;
  }
  function markRead(id) { S.threads.forEach(function (t) { if (t.id === id) t.unread = 0; }); }

  /* ---------- Overlays ---------- */
  function closeLayer() { $("#layer").innerHTML = ""; }
  function modal(html, cls) { $("#layer").innerHTML = '<div class="overlay" data-act="overlay"><div class="modal ' + (cls || "") + '" role="dialog" aria-modal="true">' + html + "</div></div>"; var f = $("#layer [autofocus]"); if (f) f.focus(); }
  function drawer(html) { $("#layer").innerHTML = '<div class="overlay right" data-act="overlay"><div class="drawer" role="dialog" aria-modal="true"><button class="ibtn sm close-x" data-act="close" aria-label="Schließen">' + ic("x") + "</button>" + html + "</div></div>"; }
  function mh(title) { return '<div class="m-h"><h2>' + title + '</h2><button class="ibtn sm plain" data-act="close" aria-label="Schließen">' + ic("x") + "</button></div>"; }
  function pop(anchor, html) {
    var r = anchor.getBoundingClientRect();
    var w = Math.min(340, window.innerWidth - 16);
    var left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8));
    $("#layer").innerHTML = '<div class="backdrop" data-act="close"></div><div class="pop" style="top:' + (r.bottom + 8) + "px;left:" + left + "px;width:" + w + 'px">' + html + "</div>";
  }
  function toast(msg, icon) {
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = ic(icon || "check") + "<span>" + esc(msg) + "</span>";
    $("#toasts").appendChild(t);
    setTimeout(function () { t.classList.add("out"); }, 2600);
    setTimeout(function () { t.remove(); }, 2900);
  }
  function notify(text, icon, route) {
    S.notifs.unshift({ id: uid(), icon: icon, text: text, when: "gerade eben", read: false, go: route });
    $("#bellDot").hidden = false;
  }
  function activity(text, icon) { S.activity.unshift({ icon: icon, text: text, when: "gerade eben" }); }

  function welcome() {
    var links = [["dashboard", "Dashboard", "grid"], ["discover", "Matching", "compass"], ["ai", "KI-Center", "sparkles"], ["workspace", "Workspace", "folder"], ["agents", "Agents", "bot"], ["focus", "Fokus", "target"]];
    modal('<div class="welcome"><span class="logo">X</span><h2>Willkommen bei Xyntal</h2><p>Das ist eine interaktive Demo mit Beispieldaten. Klick dich frei durch alle Funktionen – nichts wird gespeichert oder verschickt.</p><div class="wgrid">' + links.map(function (l) { return '<button data-act="welcomeGo" data-r="' + l[0] + '">' + ic(l[2]) + l[1] + "</button>"; }).join("") + '</div><button class="btn pri" data-act="close" style="width:100%;height:42px">Los geht\'s ' + ic("right") + '</button><p class="xs dim mt">Tipp: <b>Strg + K</b> öffnet die Suche mit Schnellaktionen.</p></div>');
  }

  /* ---------- Suche & Schnellaktionen ---------- */
  var PAL = { items: [], sel: 0 };
  function palItems(q) {
    q = q.toLowerCase();
    var out = [];
    function add(g, label, sub, icon, run) { if (!q || (label + " " + sub).toLowerCase().indexOf(q) >= 0) out.push({ g: g, label: label, sub: sub, icon: icon, run: run }); }
    add("Aktionen", "Neues Projekt erstellen", "Workspace", "plus", function () { A.newProject(); });
    add("Aktionen", "Neuen KI-Chat starten", "KI-Center", "sparkles", function () { newConv(); });
    add("Aktionen", "Datei hochladen", "Dateien", "upload", function () { go("files"); startUpload(); });
    add("Aktionen", "Fokusblock starten", "Fokus-Assistent", "target", function () { S.timer.running = true; go("focus"); });
    add("Aktionen", "Neues Support-Ticket", "Support", "lifebuoy", function () { go("support", { supTab: "tickets" }); A.newTicket(); });
    NAV.forEach(function (g) { g.items.forEach(function (it) { add("Seiten", it[1], g.group, it[2], function () { go(it[0]); }); }); });
    S.people.forEach(function (p) { add("Menschen", p.name, p.role, "user", function () { closeLayer(); openProfile(p.id); }); });
    S.projects.forEach(function (p) { add("Projekte", p.name, p.desc, "folder", function () { go("workspace", { ws: p.id, wsTab: "overview" }); }); });
    S.dProjects.forEach(function (p) { add("Projekte", p.name, "Discover · " + p.desc, "compass", function () { go("discover", { dTab: "projects", dq: p.name }); }); });
    S.files.forEach(function (f) { add("Dateien", f.name, f.size + " · " + f.updated, "file", function () { go("files", { file: f.id }); }); });
    S.communities.forEach(function (c) { add("Communities", c.name, c.members + " Mitglieder", "users", function () { go("community", { comm: c.id }); }); });
    return q ? out.slice(0, 14) : out.filter(function (o) { return o.g === "Aktionen" || o.g === "Seiten"; }).slice(0, 11);
  }
  function renderPal() {
    var html = "", last = "";
    PAL.items.forEach(function (it, i) {
      if (it.g !== last) { html += '<div class="pal-g">' + it.g + "</div>"; last = it.g; }
      html += '<button class="pop-i ' + (i === PAL.sel ? "sel" : "") + '" data-act="palRun" data-i="' + i + '">' + ic(it.icon) + '<span class="grow" style="min-width:0"><span class="ell" style="display:block;font-weight:550">' + esc(it.label) + '</span><span class="xs dim ell" style="display:block">' + esc(it.sub) + "</span></span>" + (i === PAL.sel ? ic("right", "sm dim") : "") + "</button>";
    });
    $("#palRes").innerHTML = html || '<div class="empty small">' + ic("search") + "<b>Nichts gefunden</b></div>";
    var s = $("#palRes .sel");
    if (s) s.scrollIntoView({ block: "nearest" });
  }
  function openPalette() {
    $("#layer").innerHTML = '<div class="overlay top" data-act="overlay"><div class="palette" role="dialog" aria-label="Suche"><div class="pal-in">' + ic("search") + '<input id="palIn" placeholder="Suche nach Menschen, Projekten, Dateien oder Aktionen …" autocomplete="off"></div><div class="pal-res" id="palRes"></div><div class="pal-foot"><span>↑↓ auswählen</span><span>Enter öffnen</span><span>Esc schließen</span></div></div></div>';
    PAL.items = palItems(""); PAL.sel = 0; renderPal();
    $("#palIn").focus();
  }

  function openProfile(id) { drawer(profileHtml(person(id))); }
  function newConv() {
    var c = { id: uid(), title: "Neuer Chat", when: "Gerade eben", msgs: [] };
    S.convs.unshift(c);
    go("ai", { conv: c.id, aiList: false });
    setTimeout(function () { var i = $("#aiIn"); if (i) i.focus(); }, 30);
  }
  function sendAi(text) {
    var c = S.convs.filter(function (x) { return x.id === S.conv; })[0];
    if (!c) { newConv(); c = S.convs[0]; }
    if (!c.msgs.length) c.title = text.length > 34 ? text.slice(0, 32) + " …" : text;
    c.msgs.push({ from: "me", text: text });
    var typing = { from: "ai", typing: true };
    c.msgs.push(typing);
    if (S.route !== "ai") go("ai"); else rerender();
    setTimeout(function () {
      typing.typing = false;
      typing.text = aiReply(text);
      if (S.route === "ai") { rerender(); var i = $("#aiIn"); if (i) i.focus(); }
    }, 1100 + Math.random() * 600);
  }
  var REPLIES = {
    lena: ["Klingt gut! Donnerstag 18 Uhr passt mir.", "Schick mir gern die neue Version, ich schaue heute Abend drüber.", "Das wird richtig gut, bleib dran!"],
    jonas: ["Top, ich pushe den Branch gleich.", "Lass uns morgen kurz callen, dann zeige ich dir die Änderungen.", "Hab noch eine Idee fürs Ranking – erzähl ich dir morgen."],
    max: ["Ja, mit klaren Rollen sind Agents viel stabiler.", "Ich kann dir mal unser Setup zeigen, wenn du magst.", "Spannend! Halt mich auf dem Laufenden."]
  };
  function replyFor(who, i) { var r = REPLIES[who] || ["Danke für deine Nachricht! Ich melde mich bald.", "Klingt super, lass uns das angehen!", "Gute Idee!"]; return r[i % r.length]; }
  function startUpload() {
    var f = { id: uid(), name: "Wettbewerbsanalyse.pdf", kind: "pdf", size: "2,3 MB", updated: "gerade eben", owner: "me", project: "xyntal", uploading: true, p: 0,
      versions: [{ v: 1, who: "me", when: "gerade eben", note: "Hochgeladen" }], comments: [], shares: [], link: false, log: ["Nico hat die Datei hochgeladen · gerade eben"] };
    S.files.unshift(f);
    if (S.route === "files") rerender();
    var iv = setInterval(function () {
      f.p = Math.min(100, f.p + 9 + Math.random() * 14);
      var bar = document.getElementById("up-" + f.id);
      if (bar) bar.style.width = f.p + "%";
      if (f.p >= 100) {
        clearInterval(iv);
        f.uploading = false;
        activity("Du hast Wettbewerbsanalyse.pdf hochgeladen", "upload");
        toast("Wettbewerbsanalyse.pdf hochgeladen", "upload");
        if (S.route === "files") rerender();
      }
    }, 280);
  }

  /* =========================================================
     AKTIONEN
     ========================================================= */
  var A = {
    go: function (el) { go(el.dataset.r); },
    nav: function () { $("#app").classList.toggle("nav-open"); },
    overlay: function (el, e) { if (e.target === el) closeLayer(); },
    close: function () { closeLayer(); },
    toast: function (el) { toast(el.dataset.msg); },
    set: function (el) { S[el.dataset.k] = el.dataset.v; rerender(); },
    welcomeGo: function (el) { var r = el.dataset.r; if (r === "workspace") go("workspace", { ws: "xyntal", wsTab: "tasks" }); else go(r); },

    /* Dashboard */
    layout: function (el) { S.layout = el.dataset.v; rerender(); toast("Layout „" + el.textContent.trim() + "“ aktiviert", "layout"); },
    editWidgets: function () { S.editing = !S.editing; rerender(); if (!S.editing) toast("Dashboard gespeichert"); },
    toggleWidget: function (el) { S.widgets.forEach(function (w) { if (w.id === el.dataset.id) w.on = !w.on; }); rerender(); },
    focusToggle: function (el) {
      ["now", "next"].forEach(function (k) { S.focus[k].forEach(function (f) { if (f.id === el.dataset.id) { f.done = !f.done; if (f.done) { toast("Erledigt: " + f.t); activity("Du hast „" + f.t + "“ erledigt", "check"); } } }); });
      rerender();
    },

    /* Discover */
    skill: function (el) { var v = el.dataset.v, i = S.dSkills.indexOf(v); if (i >= 0) S.dSkills.splice(i, 1); else S.dSkills.push(v); rerender(); },
    resetFilters: function () { S.dq = ""; S.dSkills = []; S.dType = S.dAvail = S.dMode = ""; rerender(); },
    reject: function (el) {
      var p = person(el.dataset.id);
      S.rejected.push(p.id);
      p.cats.forEach(function (c) { S.learned[c] = (S.learned[c] || 0) + 1; });
      toast("Verstanden – wir zeigen dir weniger Profile wie " + p.name.split(" ")[0], "sparkles");
      rerender();
    },
    undoReject: function () { S.rejected = []; S.learned = {}; rerender(); toast("Matching-Feedback zurückgesetzt", "refresh"); },
    connect: function (el) {
      var p = person(el.dataset.id);
      S.conn[p.id] = "pending";
      toast("Anfrage an " + p.name + " gesendet", "send");
      if ($(".drawer")) drawer(profileHtml(p));
      rerender();
      setTimeout(function () {
        S.conn[p.id] = "connected";
        if (!S.threads.some(function (t) { return t.who === p.id; })) S.threads.unshift({ id: uid(), who: p.id, unread: 1, msgs: [{ from: p.id, text: "Hey Nico, danke fürs Verbinden! Erzähl mal, woran arbeitest du gerade?", t: now() }] });
        notify(p.name + " hat deine Anfrage angenommen", "users", "messages");
        activity("Du bist jetzt mit " + p.name + " verbunden", "users");
        toast(p.name.split(" ")[0] + " hat angenommen und dir geschrieben", "message");
        if (!$(".overlay")) rerender(); else $("#side").innerHTML = sidebar();
      }, 2600);
    },
    openProfile: function (el) { openProfile(el.dataset.id); },
    interest: function (el) { var p = S.dProjects.filter(function (x) { return x.id === el.dataset.id; })[0]; S.interest[p.id] = true; toast("Interesse an " + p.name + " gesendet", "star"); rerender(); },
    msgPerson: function (el) {
      var t = S.threads.filter(function (x) { return x.who === el.dataset.id; })[0];
      if (!t) { t = { id: uid(), who: el.dataset.id, unread: 0, msgs: [] }; S.threads.unshift(t); }
      go("messages", { thread: t.id });
    },

    /* Nachrichten */
    openThread: function (el) { S.thread = el.dataset.id; markRead(S.thread); rerender(); var i = $(".composer textarea"); if (i) i.focus(); },
    closeThread: function () { S.thread = null; rerender(); },

    /* Projekte */
    openWs: function (el) { go("workspace", { ws: el.dataset.id, wsTab: S.route === "workspace" ? S.wsTab : "overview" }); },
    taskDone: function (el) { var p = project(S.ws); p.tasks.forEach(function (t) { if (t.id === el.dataset.id) { t.s = "done"; toast("Aufgabe erledigt: " + t.t); activity("Du hast „" + t.t + "“ erledigt", "check"); } }); rerender(); },
    newProject: function () {
      modal(mh("Neues Projekt") + '<form data-form="project"><div class="m-b"><div class="field"><label for="pn">Name</label><input class="input" id="pn" name="name" placeholder="z. B. Mein Startup" required autofocus></div><div class="field"><label for="pd">Worum geht es?</label><textarea class="input" id="pd" name="desc" rows="3" placeholder="Kurze Beschreibung"></textarea></div><div class="field"><label>Mitglieder einladen</label><div class="tags">' + S.people.slice(0, 5).map(function (p) { return '<label class="chip" style="cursor:pointer"><input type="checkbox" name="m" value="' + p.id + '" style="accent-color:var(--accent)"> ' + esc(p.name) + "</label>"; }).join("") + '</div></div></div><div class="m-f"><button type="button" class="btn" data-act="close">Abbrechen</button><button class="btn pri">' + ic("plus") + "Erstellen</button></div></form>");
    },
    invite: function () {
      var p = project(S.ws);
      var avail = S.people.filter(function (x) { return p.members.indexOf(x.id) < 0; });
      modal(mh("Zum Workspace einladen") + '<div class="m-b">' + avail.slice(0, 6).map(function (x) { return '<div class="li">' + avatar(x, "sm") + '<div class="grow"><div class="t small">' + esc(x.name) + '</div><div class="s">' + esc(x.role) + '</div></div><button class="btn sm pri" data-act="inviteP" data-id="' + x.id + '">Einladen</button></div>'; }).join("") + "</div>");
    },
    inviteP: function (el) { var p = project(S.ws); p.members.push(el.dataset.id); closeLayer(); toast(person(el.dataset.id).name + " wurde eingeladen", "users"); rerender(); },

    /* Communities */
    openComm: function (el) { go("community", { comm: el.dataset.id }); },
    join: function (el) {
      var c = S.communities.filter(function (x) { return x.id === el.dataset.id; })[0];
      c.joined = !c.joined; c.members += c.joined ? 1 : -1;
      toast(c.joined ? "Willkommen in „" + c.name + "“!" : "Du hast „" + c.name + "“ verlassen", "users");
      rerender();
    },
    like: function (el) { S.communities.forEach(function (c) { c.posts.forEach(function (p) { if (p.id === el.dataset.id) { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; } }); }); rerender(); },

    /* Dateien */
    openFile: function (el) { S.file = el.dataset.id; S.fileTab = S.fileTab || "versions"; rerender(); },
    closeFile: function () { S.file = null; rerender(); },
    upload: function () { startUpload(); },
    restoreVer: function (el) {
      var f = S.files.filter(function (x) { return x.id === S.file; })[0];
      var v = +el.dataset.v, nv = f.versions[0].v + 1;
      f.versions.unshift({ v: nv, who: "me", when: "gerade eben", note: "Wiederhergestellt aus v" + v });
      f.log.unshift("Nico hat v" + v + " als v" + nv + " wiederhergestellt · gerade eben");
      f.updated = "gerade eben";
      toast("Version " + v + " wiederhergestellt", "refresh");
      rerender();
    },
    toggleLink: function () { var f = S.files.filter(function (x) { return x.id === S.file; })[0]; f.link = !f.link; f.log.unshift("Nico hat den Freigabe-Link " + (f.link ? "aktiviert" : "deaktiviert") + " · gerade eben"); rerender(); },

    /* KI */
    openConv: function (el) { S.conv = el.dataset.id; S.aiList = false; rerender(); },
    newConv: function () { newConv(); },
    aiList: function () { S.aiList = true; rerender(); },
    aiSuggest: function (el) { sendAi(el.dataset.q); },
    aiAsk: function (el) { newConv(); sendAi(el.dataset.q); },
    delMem: function (el) { S.memories.splice(+el.dataset.i, 1); toast("Erinnerung gelöscht", "trash"); if ($(".modal")) A.memModal(); rerender(); },
    memModal: function () { modal(mh("Erinnerungen") + '<div class="m-b">' + memList() + "</div>"); },

    /* Agents */
    toggleAgent: function (el) { S.agents.forEach(function (a) { if (a.id === el.dataset.id) { a.on = !a.on; toast(a.name + (a.on ? " aktiviert" : " pausiert"), "bot"); } }); rerender(); },
    runAgent: function (el) {
      var a = S.agents.filter(function (x) { return x.id === el.dataset.id; })[0];
      var steps = {
        g1: ["Lade dein Profil und deine Ziele …", "Analysiere 1.284 Profile …", "Gewichte Fähigkeiten, Verfügbarkeit, Arbeitsweise …", "✓ 3 neue Vorschläge über 85 % gefunden"],
        g2: ["Lese letzte Workspace-Gespräche …", "Erstelle Zusammenfassung …", "✓ Zusammenfassung erstellt · 2 Aufgaben angelegt"],
        g3: ["Sammle Fortschritt aus 3 Projekten …", "Berechne Wochenstatistik …", "✓ Wochenreport bereit"],
        g4: ["Prüfe offene Anfragen …", "✓ 2 Erinnerungen in den Fokus-Assistenten gelegt"]
      }[a.id];
      a.state = "running"; a.log = [];
      rerender();
      steps.forEach(function (s, i) {
        setTimeout(function () {
          a.log.push({ t: s, ok: s.charAt(0) === "✓" });
          if (i === steps.length - 1) {
            a.state = "idle"; a.runs++; a.last = "gerade eben";
            toast(a.name + " fertig", "bot");
            notify(a.name + ": " + s.replace("✓ ", ""), "bot", "agents");
            activity(a.name + " wurde ausgeführt", "bot");
          }
          if (S.route === "agents") rerender();
        }, 700 * (i + 1));
      });
    },
    toggleRule: function (el) { S.rules.forEach(function (r) { if (r.id === el.dataset.id) r.on = !r.on; }); rerender(); },
    delRule: function (el) { S.rules = S.rules.filter(function (r) { return r.id !== el.dataset.id; }); toast("Automation gelöscht", "trash"); rerender(); },
    newRule: function () {
      modal(mh("Neue Automation") + '<form data-form="rule"><div class="m-b"><div class="field"><label for="rw">Wenn …</label><select class="input" id="rw" name="when">' + TRIGGERS.map(function (t) { return "<option>" + t + "</option>"; }).join("") + '</select></div><div class="row" style="justify-content:center;color:var(--text-3);margin:-4px 0 10px">' + ic("down") + '</div><div class="field"><label for="rt">… dann</label><select class="input" id="rt" name="then">' + ACTIONS.map(function (t) { return "<option>" + t + "</option>"; }).join("") + '</select></div></div><div class="m-f"><button type="button" class="btn" data-act="close">Abbrechen</button><button class="btn pri">' + ic("zap") + "Automation erstellen</button></div></form>");
    },

    /* Fokus */
    focusMove: function (el) {
      var id = el.dataset.id, to = el.dataset.to, item = null;
      ["now", "next", "know"].forEach(function (k) { S.focus[k] = S.focus[k].filter(function (f) { if (f.id === id) { item = f; return false; } return true; }); });
      if (item && to !== "gone") { S.focus[to].push(item); toast(to === "now" ? "„" + item.t + "“ ist jetzt im Fokus" : "Auf später verschoben", "target"); }
      rerender();
    },
    timer: function (el) {
      var T = S.timer, v = el.dataset.v;
      if (v === "start") { T.running = true; toast("Fokusblock gestartet – Benachrichtigungen pausiert", "target"); }
      if (v === "pause") T.running = false;
      if (v === "reset") { T.running = false; T.left = T.total; }
      rerender();
    },
    timerLen: function (el) { var T = S.timer; T.total = T.left = +el.dataset.v * 60; T.running = false; rerender(); },
    queueToggle: function (el) { var q = S.queue[+el.dataset.i]; q.done = !q.done; rerender(); },
    queueMove: function (el) {
      var i = +el.dataset.i, j = i + +el.dataset.d;
      if (j < 0 || j >= S.queue.length) return;
      var t = S.queue[i]; S.queue[i] = S.queue[j]; S.queue[j] = t;
      rerender();
    },

    /* Einstellungen */
    day: function (el) { var i = +el.dataset.i; S.settings.days[i] = !S.settings.days[i]; rerender(); saved(); },
    notifSet: function (el) { var k = el.dataset.k; S.settings.notif[k] = !S.settings.notif[k]; rerender(); saved(); },
    swToggle: function (el) { el.classList.toggle("on"); saved(); },

    /* Support */
    newTicket: function () {
      modal(mh("Neues Support-Ticket") + '<form data-form="ticket"><div class="m-b"><div class="field"><label for="ts">Betreff</label><input class="input" id="ts" name="subject" placeholder="Worum geht es?" required autofocus></div><div class="field"><label for="tc">Kategorie</label><select class="input" id="tc" name="cat"><option>Technik</option><option>Konto</option><option>Abo & Zahlung</option><option>Feedback</option></select></div><div class="field"><label for="tt">Beschreibung</label><textarea class="input" id="tt" name="text" rows="4" placeholder="Beschreibe dein Anliegen …" required></textarea></div></div><div class="m-f"><button type="button" class="btn" data-act="close">Abbrechen</button><button class="btn pri">' + ic("send") + "Absenden</button></div></form>");
    },
    openTicket: function (el) { S.ticket = el.dataset.id; rerender(); },
    closeTicket: function () { S.tickets.forEach(function (t) { if (t.id === S.ticket) t.status = "done"; }); toast("Ticket als gelöst markiert"); rerender(); },
    restore: function (el) {
      var a = S.archive.filter(function (x) { return x.id === el.dataset.id; })[0];
      S.archive = S.archive.filter(function (x) { return x !== a; });
      if (a.kind === "Projekt") S.projects.push({ id: uid(), name: a.name, desc: "Wiederhergestellt aus dem Archiv.", color: COLORS[6], members: ["me"], due: "offen", tasks: [{ id: uid(), t: "Idee neu bewerten", s: "todo", who: "me" }] });
      if (a.kind === "Datei") S.files.push({ id: uid(), name: a.name, kind: "pdf", size: "3,1 MB", updated: "wiederhergestellt", owner: "me", project: "xyntal", versions: [{ v: 1, who: "me", when: "vor 2 Monaten", note: "Erste Version" }], comments: [], shares: [], link: false, log: ["Nico hat die Datei aus dem Archiv wiederhergestellt · gerade eben"] });
      if (a.kind === "KI-Chat") S.convs.push({ id: uid(), title: a.name, when: "Archiv", msgs: [{ from: "me", text: "Gib mir Namensideen für eine Networking-App." }, { from: "ai", text: "Ein paar Ideen: **Xyntal**, Linkora, Nexa, Kollektiv, Mentorly. Mein Favorit: **Xyntal** – kurz, einzigartig und gut als Marke schützbar." }] });
      if (a.kind === "Community") S.communities.push({ id: uid(), name: a.name, members: 86, joined: true, color: COLORS[5], desc: "Wiederhergestellte Community.", event: "Kein Event geplant", posts: [] });
      toast("„" + a.name + "“ wiederhergestellt", "refresh");
      activity("„" + a.name + "“ aus dem Archiv wiederhergestellt", "archive");
      rerender();
    },

    /* Admin */
    ban: function (el) { var u = S.users[+el.dataset.i]; u.status = u.status === "Gesperrt" ? "Aktiv" : "Gesperrt"; toast(u.name + (u.status === "Gesperrt" ? " gesperrt" : " entsperrt"), "shield"); rerender(); },
    resolveReport: function (el) { S.reports.forEach(function (r) { if (r.id === el.dataset.id) r.done = true; }); toast("Meldung geprüft und erledigt", "flag"); rerender(); },

    /* Abo */
    choosePlan: function (el) {
      var p = el.dataset.v;
      modal(mh("Zu " + p + " wechseln?") + '<div class="m-b"><p class="muted">In der echten App würdest du hier zur Zahlung weitergeleitet. <b>In der Demo wird nichts gekauft</b> – der Plan wird nur zur Ansicht gewechselt.</p></div><div class="m-f"><button class="btn" data-act="close">Abbrechen</button><button class="btn pri" data-act="confirmPlan" data-v="' + p + '">' + ic("check") + p + " aktivieren</button></div>");
    },
    confirmPlan: function (el) { S.plan = el.dataset.v; closeLayer(); toast("Du bist jetzt im " + S.plan + "-Plan (Demo)", "crown"); rerender(); },

    /* Profil */
    editMe: function () {
      modal(mh("Profil bearbeiten") + '<form data-form="me"><div class="m-b"><div class="field"><label for="mh">Überschrift</label><input class="input" id="mh" name="h" value="' + esc(S.meHeadline) + '" autofocus></div><div class="field"><label for="ma">Über mich</label><textarea class="input" id="ma" name="a" rows="4">' + esc(S.meAbout) + '</textarea></div></div><div class="m-f"><button type="button" class="btn" data-act="close">Abbrechen</button><button class="btn pri">' + ic("check") + "Speichern</button></div></form>");
    },

    /* Topbar */
    palette: function () { openPalette(); },
    palRun: function (el) { var it = PAL.items[+el.dataset.i]; closeLayer(); it.run(); },
    newMenu: function (el) {
      var items = [["newProject", "Neues Projekt", "folder"], ["newConv", "Neuer KI-Chat", "sparkles"], ["upload", "Datei hochladen", "upload"], ["newRule", "Neue Automation", "zap"], ["newTicket", "Support-Ticket", "lifebuoy"]];
      pop(el, '<div class="pop-h"><b>Neu erstellen</b></div>' + items.map(function (i) { return '<button class="pop-i" data-act="newRun" data-v="' + i[0] + '">' + ic(i[2]) + "<span>" + i[1] + "</span></button>"; }).join(""));
    },
    newRun: function (el) {
      var v = el.dataset.v;
      closeLayer();
      if (v === "upload") { go("files"); startUpload(); }
      else if (v === "newRule") { go("agents"); A.newRule(); }
      else if (v === "newTicket") { go("support", { supTab: "tickets" }); A.newTicket(); }
      else if (v === "newProject") { go("projects"); A.newProject(); }
      else A[v]();
    },
    bell: function (el) {
      pop(el, '<div class="pop-h"><b>Benachrichtigungen</b><span class="soon">Bald</span><span class="grow"></span><button class="btn sm ghost" data-act="readAll">Alle gelesen</button></div>' + S.notifs.slice(0, 7).map(function (n) {
        return '<button class="pop-i ' + (n.read ? "" : "unread") + '" data-act="notifGo" data-id="' + n.id + '"><span class="nicon">' + ic(n.icon) + '</span><span class="grow"><span style="display:block;font-size:13px;font-weight:' + (n.read ? 450 : 600) + '">' + esc(n.text) + '</span><span class="xs dim">' + esc(n.when) + "</span></span>" + (n.read ? "" : '<span class="ndot"></span>') + "</button>";
      }).join(""));
    },
    readAll: function () { S.notifs.forEach(function (n) { n.read = true; }); $("#bellDot").hidden = true; A.bell($('[data-act="bell"]')); },
    notifGo: function (el) { var n = S.notifs.filter(function (x) { return x.id === el.dataset.id; })[0]; n.read = true; go(n.go); }
  };
  function saved() { var s = $("#saved"); if (!s) return; s.classList.add("show"); clearTimeout(saved.t); saved.t = setTimeout(function () { s.classList.remove("show"); }, 1400); }

  /* ---------- Formulare ---------- */
  var FORMS = {
    msg: function (f, d) {
      var text = (d.get("text") || "").trim(); if (!text) return;
      var t = S.threads.filter(function (x) { return x.id === S.thread; })[0];
      t.msgs.push({ from: "me", text: text, t: now() });
      t.n = (t.n || 0) + 1;
      var typing = { from: t.who, typing: true };
      t.msgs.push(typing);
      rerender(); var i = $(".composer textarea"); if (i) i.focus();
      setTimeout(function () {
        typing.typing = false; typing.text = replyFor(t.who, t.n - 1); typing.t = now();
        if (S.route === "messages" && S.thread === t.id) { rerender(); var j = $(".composer textarea"); if (j) j.focus(); }
        else { t.unread++; $("#side").innerHTML = sidebar(); }
      }, 1500);
    },
    ai: function (f, d) { var text = (d.get("text") || "").trim(); if (text) sendAi(text); },
    mem: function (f, d) { var text = (d.get("text") || "").trim(); if (!text) return; S.memories.unshift(text); toast("Erinnerung gespeichert", "bookmark"); if ($(".modal")) A.memModal(); rerender(); },
    task: function (f, d) {
      var text = (d.get("t") || "").trim(); if (!text) return;
      project(S.ws).tasks.push({ id: uid(), t: text, s: "todo", who: "me" });
      rerender(); var i = $(".add-task .input"); if (i) i.focus();
    },
    project: function (f, d) {
      var name = (d.get("name") || "").trim(); if (!name) return;
      var p = { id: uid(), name: name, desc: (d.get("desc") || "").trim() || "Neues Projekt", color: COLORS[Math.floor(Math.random() * COLORS.length)], members: ["me"].concat(d.getAll("m")), due: "offen", tasks: [{ id: uid(), t: "Ziele festlegen", s: "todo", who: "me" }, { id: uid(), t: "Team einladen", s: "todo", who: "me" }] };
      S.projects.push(p);
      closeLayer();
      activity("Du hast das Projekt „" + name + "“ erstellt", "folder");
      toast("Projekt „" + name + "“ erstellt", "folder");
      go("workspace", { ws: p.id, wsTab: "tasks" });
    },
    post: function (f, d) {
      var text = (d.get("text") || "").trim(); if (!text) return;
      var c = S.communities.filter(function (x) { return x.id === S.comm; })[0];
      c.posts.unshift({ id: uid(), who: "me", text: text, when: "gerade eben", likes: 0, liked: false });
      toast("Beitrag veröffentlicht", "send");
      rerender();
    },
    comment: function (f, d) {
      var text = (d.get("text") || "").trim(); if (!text) return;
      var file = S.files.filter(function (x) { return x.id === S.file; })[0];
      file.comments.push({ who: "me", text: text, when: "gerade eben" });
      file.log.unshift("Nico hat kommentiert · gerade eben");
      rerender();
    },
    share: function (f, d) {
      var file = S.files.filter(function (x) { return x.id === S.file; })[0];
      var who = d.get("who"); if (!who) return;
      file.shares.push({ who: who, perm: "Ansehen" });
      file.log.unshift("Nico hat die Datei mit " + person(who).name + " geteilt · gerade eben");
      toast("Mit " + person(who).name + " geteilt", "share");
      rerender();
    },
    rule: function (f, d) { S.rules.push({ id: uid(), when: d.get("when"), then: d.get("then"), on: true }); closeLayer(); toast("Automation erstellt und aktiv", "zap"); rerender(); },
    queue: function (f, d) { var text = (d.get("t") || "").trim(); if (!text) return; S.queue.push({ id: uid(), t: text, est: "15 Min.", done: false }); rerender(); var i = $('[data-form="queue"] .input'); if (i) i.focus(); },
    ticket: function (f, d) {
      var no = Math.max.apply(null, S.tickets.map(function (t) { return t.no; })) + 1;
      var t = { id: "t" + no, no: no, subject: d.get("subject"), cat: d.get("cat"), status: "open", when: "gerade eben", msgs: [{ from: "me", text: d.get("text") }] };
      S.tickets.unshift(t); S.ticket = t.id; S.supTab = "tickets";
      closeLayer(); toast("Ticket #" + no + " erstellt", "inbox"); rerender();
      setTimeout(function () {
        t.msgs.push({ from: "support", text: "Danke für deine Nachricht! Wir haben dein Ticket erhalten und melden uns schnellstmöglich." });
        t.status = "prog";
        notify("Support hat auf Ticket #" + no + " geantwortet", "lifebuoy", "support");
        if (S.route === "support") rerender();
      }, 2200);
    },
    ticketReply: function (f, d) {
      var text = (d.get("text") || "").trim(); if (!text) return;
      var t = S.tickets.filter(function (x) { return x.id === S.ticket; })[0];
      t.msgs.push({ from: "me", text: text });
      rerender();
      setTimeout(function () { t.msgs.push({ from: "support", text: "Danke für die Info! Wir kümmern uns darum." }); if (S.route === "support") rerender(); }, 1600);
    },
    me: function (f, d) { S.meHeadline = d.get("h"); S.meAbout = d.get("a"); closeLayer(); toast("Profil gespeichert"); rerender(); }
  };

  var INPUT = {
    dq: function (el) { S.dq = el.value; $("#dgrid").innerHTML = discoverGrid(); },
    fq: function (el) {
      S.fq = el.value;
      var q = S.fq.toLowerCase();
      var list = S.files.filter(function (f) { return !q || f.name.toLowerCase().indexOf(q) >= 0; });
      $("#ftable").innerHTML = list.length ? fileTable(list) : '<div class="empty">' + ic("search") + "<b>Keine Datei gefunden</b></div>";
    },
    rec: function (el) { S.settings.rec = +el.value; $("#recVal").textContent = el.value; }
  };
  var CHG = {
    filter: function (el) { S[el.dataset.k] = el.value; rerender(); },
    perm: function (el) { var f = S.files.filter(function (x) { return x.id === S.file; })[0]; var s = f.shares[+el.dataset.i]; s.perm = el.value; f.log.unshift(person(s.who).name + " darf jetzt: " + el.value + " · gerade eben"); toast("Berechtigung geändert", "lock"); },
    setting: function (el) { S.settings[el.dataset.k] = el.value; saved(); },
    recDone: function () { saved(); toast(S.settings.rec + " Empfehlungen in Discover", "compass"); },
    role: function (el) { var u = S.users[+el.dataset.i]; u.role = el.value; toast(u.name + " ist jetzt " + el.value, "shield"); }
  };

  /* ---------- Ereignisse ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (!el) return;
    var fn = A[el.dataset.act];
    if (fn) fn(el, e);
  });
  document.addEventListener("submit", function (e) {
    var f = e.target.closest("form[data-form]");
    if (!f) return;
    e.preventDefault();
    FORMS[f.dataset.form](f, new FormData(f));
  });
  document.addEventListener("input", function (e) {
    var el = e.target.closest("[data-in]");
    if (el) INPUT[el.dataset.in](el, e);
    if (e.target.id === "palIn") { PAL.items = palItems(e.target.value); PAL.sel = 0; renderPal(); }
    if (e.target.matches(".composer textarea")) { e.target.style.height = "42px"; e.target.style.height = Math.min(120, e.target.scrollHeight) + "px"; }
  });
  document.addEventListener("change", function (e) {
    var el = e.target.closest("[data-chg]");
    if (el) CHG[el.dataset.chg](el, e);
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
    if (e.key === "Escape") { closeLayer(); $("#app").classList.remove("nav-open"); return; }
    if (e.target.id === "palIn") {
      if (e.key === "ArrowDown") { e.preventDefault(); PAL.sel = Math.min(PAL.items.length - 1, PAL.sel + 1); renderPal(); }
      if (e.key === "ArrowUp") { e.preventDefault(); PAL.sel = Math.max(0, PAL.sel - 1); renderPal(); }
      if (e.key === "Enter" && PAL.items[PAL.sel]) { e.preventDefault(); var it = PAL.items[PAL.sel]; closeLayer(); it.run(); }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && e.target.matches("textarea[data-enter]")) { e.preventDefault(); e.target.form.requestSubmit(); }
  });

  /* Drag & Drop für Widgets und Aufgaben */
  document.addEventListener("dragstart", function (e) {
    var w = e.target.closest && e.target.closest("[data-drag]");
    if (!w) return;
    DRAG = { kind: w.dataset.drag, id: w.dataset.id };
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", w.dataset.id); } catch (err) {}
    setTimeout(function () { w.classList.add("dragging"); }, 0);
  });
  document.addEventListener("dragend", function () {
    $$(".dragging, .drag-over").forEach(function (x) { x.classList.remove("dragging", "drag-over"); });
    DRAG = null;
  });
  document.addEventListener("dragover", function (e) {
    if (!DRAG) return;
    var t = e.target.closest && e.target.closest('[data-drop="' + DRAG.kind + '"]');
    if (!t) return;
    e.preventDefault();
    $$(".drag-over").forEach(function (x) { if (x !== t) x.classList.remove("drag-over"); });
    t.classList.add("drag-over");
  });
  document.addEventListener("drop", function (e) {
    if (!DRAG) return;
    var t = e.target.closest && e.target.closest('[data-drop="' + DRAG.kind + '"]');
    if (!t) return;
    e.preventDefault();
    if (DRAG.kind === "widget" && t.dataset.id !== DRAG.id) {
      var from = S.widgets.map(function (w) { return w.id; }).indexOf(DRAG.id);
      var item = S.widgets.splice(from, 1)[0];
      var to = S.widgets.map(function (w) { return w.id; }).indexOf(t.dataset.id);
      S.widgets.splice(from <= to ? to + 1 : to, 0, item);
    }
    if (DRAG.kind === "task") {
      project(S.ws).tasks.forEach(function (x) {
        if (x.id === DRAG.id && x.s !== t.dataset.col) {
          x.s = t.dataset.col;
          if (x.s === "done") { toast("Aufgabe erledigt: " + x.t); activity("Du hast „" + x.t + "“ erledigt", "check"); }
        }
      });
    }
    DRAG = null;
    rerender();
  });

  /* Fokus-Timer */
  setInterval(function () {
    var T = S.timer;
    if (!T.running) return;
    T.left = Math.max(0, T.left - 1);
    if (T.left === 0) {
      T.running = false;
      toast("Fokusblock geschafft! Zeit für eine kurze Pause.", "target");
      notify("Fokusblock abgeschlossen", "target", "focus");
      if (S.route === "focus") rerender();
      return;
    }
    if (S.route === "focus") updTimer();
  }, 1000);

  /* ---------- Start ---------- */
  var PREVIEW = /[?&]preview=1/.test(location.search);
  render();
  if (PREVIEW) {
    // Vorschau-Modus für die Projektkarte: kein Willkommensfenster, keine Hinweise,
    // die Ansicht wechselt von selbst zwischen einigen Bereichen.
    document.documentElement.classList.add("preview");
    toast = function () {};
    var tour = [["dashboard"], ["discover"], ["ai"], ["workspace", { ws: "xyntal", wsTab: "tasks" }], ["agents"], ["focus"]];
    var step = 0;
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) setInterval(function () { step = (step + 1) % tour.length; go(tour[step][0], tour[step][1]); }, 4500);
  } else {
    setTimeout(welcome, 250);
  }
})();
