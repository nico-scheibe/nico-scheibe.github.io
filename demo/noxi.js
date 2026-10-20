/* =========================================================
   Noxi – interaktive Demo
   Persönliche Alltags-App: Heute, Kalender, Aufgaben,
   Lernen mit Lernkarten und KI-Assistent.
   Alle Inhalte sind Beispieldaten. Neu laden setzt alles zurück.
   ========================================================= */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function md(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); }
  function uid() { return Math.random().toString(36).slice(2, 9); }

  var ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    checks: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9"/>',
    cards: '<rect x="3" y="7" width="14" height="14" rx="3"/><path d="M7 3h11a3 3 0 0 1 3 3v11"/>',
    sparkles: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 22c4 0 7-2.7 7-6.8 0-3.7-2.6-6-4.4-8.2-.6 2-1.6 3.2-3 3.7.4-3.4-.9-6.2-3.6-8.7.3 3.8-4 6.4-4 11.6C4 19.3 7.6 22 12 22z"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h8"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    network: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/>'
  };
  function ic(n, c) { return '<svg class="i ' + (c || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || "") + "</svg>"; }

  /* ---------- Zeit & Datum ---------- */
  var NOW = 14 * 60 + 20; // Demo-Uhrzeit 14:20
  var DAYNAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  var TODAY = (new Date().getDay() + 6) % 7;
  var MONDAY = new Date(); MONDAY.setDate(MONDAY.getDate() - TODAY);
  function dateOf(i) { var d = new Date(MONDAY); d.setDate(MONDAY.getDate() + i); return d; }
  function longDate(i) { return dateOf(i).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }); }
  function mins(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function hhmm(m) { var h = Math.floor(m / 60), r = m % 60; return (h < 10 ? "0" : "") + h + ":" + (r < 10 ? "0" : "") + r; }

  var TYPES = {
    termin: { label: "Termin", c: "var(--teal)" },
    lernen: { label: "Lernen", c: "var(--violet)" },
    fokus: { label: "Fokus", c: "var(--sky)" },
    sport: { label: "Sport", c: "var(--green)" },
    privat: { label: "Privat", c: "var(--amber)" }
  };
  var LISTS = { Persönlich: "var(--amber)", Lernen: "var(--violet)", Projekte: "var(--sky)" };

  /* ---------- Beispieldaten ---------- */
  function ev(t, s, e, type) { return { id: uid(), t: t, s: s, e: e, type: type }; }
  function card(q, a) { return { q: q, a: a }; }
  function seed() {
    var events = {};
    for (var i = 0; i < 7; i++) events[i] = [];
    var work = [ev("Morgenroutine", "07:00", "07:30", "privat"), ev("Arbeit", "08:00", "12:00", "termin"), ev("Mittagspause", "12:15", "13:00", "privat"), ev("Arbeit", "13:00", "16:00", "termin")];
    for (var d = 0; d < 5; d++) if (d !== TODAY) events[d] = work.map(function (e) { return ev(e.t, e.s, e.e, e.type); });
    events[(TODAY + 1) % 7].push(ev("Swift-Projekt: Noxi", "17:00", "18:30", "fokus"), ev("Englisch-Vokabeln", "19:00", "19:20", "lernen"));
    events[(TODAY + 2) % 7].push(ev("Training", "18:00", "19:30", "sport"));
    events[(TODAY + 3) % 7].push(ev("Netzwerktechnik lernen", "17:30", "18:30", "lernen"), ev("Kino mit Freunden", "20:00", "22:00", "privat"));
    events[(TODAY + 5) % 7].push(ev("Ausschlafen & Brunch", "10:00", "11:30", "privat"), ev("Noxi: neue Funktion", "14:00", "16:00", "fokus"));
    events[TODAY] = [
      ev("Morgenroutine", "07:00", "07:30", "privat"),
      ev("Arbeit", "08:00", "12:00", "termin"),
      ev("Mittagspause", "12:15", "13:00", "privat"),
      ev("Swift-Projekt: Noxi", "14:00", "15:00", "fokus"),
      ev("Englisch-Vokabeln", "15:30", "16:00", "lernen"),
      ev("Training", "18:30", "19:30", "sport"),
      ev("Netzwerktechnik lernen", "20:00", "20:45", "lernen")
    ];
    return {
      route: "today",
      day: TODAY,
      events: events,
      suggestion: "open",
      tasks: [
        { id: uid(), t: "Bewerbungsunterlagen aktualisieren", list: "Persönlich", due: "Heute", prio: true, done: false },
        { id: uid(), t: "Subnetting-Aufgaben üben", list: "Lernen", due: "Heute", prio: false, done: false },
        { id: uid(), t: "Noxi: Kalender-Sync testen", list: "Projekte", due: "Heute", prio: true, done: false },
        { id: uid(), t: "20 Englisch-Vokabeln", list: "Lernen", due: "Heute", prio: false, done: true },
        { id: uid(), t: "Einkaufen", list: "Persönlich", due: "Heute", prio: false, done: true },
        { id: uid(), t: "Portfolio-Texte prüfen", list: "Projekte", due: "Morgen", prio: false, done: false },
        { id: uid(), t: "Noxi: Lernkarten exportieren", list: "Projekte", due: "Fr.", prio: false, done: false },
        { id: uid(), t: "Sportschuhe bestellen", list: "Persönlich", due: "Sa.", prio: false, done: false }
      ],
      filter: "Alle",
      decks: [
        { id: "net", name: "Netzwerktechnik", icon: "network", c: "var(--teal)", cards: [
          card("Wofür steht DHCP?", "Dynamic Host Configuration Protocol – vergibt IP-Adressen automatisch an Geräte im Netzwerk."),
          card("Wie viele Schichten hat das OSI-Modell?", "Sieben: Bitübertragung, Sicherung, Vermittlung, Transport, Sitzung, Darstellung und Anwendung."),
          card("Was macht DNS?", "Es übersetzt Domainnamen wie example.com in IP-Adressen."),
          card("Wie viele nutzbare Hosts hat ein /24-Netz?", "254 – von 256 Adressen gehen Netz- und Broadcast-Adresse ab."),
          card("Unterschied zwischen TCP und UDP?", "TCP ist verbindungsorientiert und sichert die Zustellung. UDP ist verbindungslos und schneller, aber ohne Garantie."),
          card("Standard-Port von HTTPS?", "Port 443.")
        ], learned: 2 },
        { id: "en", name: "Englisch – Vokabeln", icon: "globe", c: "var(--amber)", cards: [
          card("zuverlässig", "reliable"), card("Herausforderung", "challenge"), card("Erfahrung", "experience"),
          card("Bewerbung", "application"), card("Fähigkeit", "skill / ability"), card("Verantwortung", "responsibility")
        ], learned: 4 },
        { id: "swift", name: "Swift Grundlagen", icon: "code", c: "var(--green)", cards: [
          card("Was ist ein Optional?", "Ein Typ, der entweder einen Wert oder nil enthält, z. B. String?"),
          card("Unterschied zwischen let und var?", "let ist eine Konstante, var eine veränderbare Variable."),
          card("Was ist eine struct?", "Ein Werttyp, der Daten und Funktionen bündelt. Beim Zuweisen wird er kopiert."),
          card("Wozu dient guard?", "Zum frühen Verlassen einer Funktion, wenn eine Bedingung nicht erfüllt ist.")
        ], learned: 1 },
        { id: "it", name: "IT-Support Basics", icon: "wrench", c: "var(--sky)", cards: [
          card("Was ist ein Ticketsystem?", "Ein Werkzeug, um Support-Anfragen zu erfassen, zu priorisieren und nachzuverfolgen."),
          card("Wofür steht RDP?", "Remote Desktop Protocol – Fernzugriff auf einen Windows-Rechner."),
          card("Was zeigt „ipconfig /all“?", "Alle Netzwerkadapter mit IP-Adresse, Gateway, DNS-Servern und MAC-Adresse.")
        ], learned: 0 }
      ],
      study: null,
      goal: { done: 12, total: 20 },
      streak: 6,
      chat: [{ from: "ai", text: "Hey Nico! Ich bin dein Noxi-Assistent. Ich kenne deinen Kalender, deine Aufgaben und Lernkarten. Wobei kann ich helfen?" }]
    };
  }
  var S = seed();

  /* ---------- Navigation ---------- */
  var TABS = [["today", "Heute", "sun"], ["calendar", "Kalender", "calendar"], ["tasks", "Aufgaben", "checks"], ["learn", "Lernen", "cards"], ["ai", "KI", "sparkles"]];
  function openTasks() { return S.tasks.filter(function (t) { return !t.done && t.due === "Heute"; }).length; }
  function sidebar() {
    return '<div class="brand"><span class="appicon">N</span>Noxi</div>' + TABS.map(function (t) {
      var on = S.route === t[0] || (t[0] === "learn" && S.route === "study");
      var badge = t[0] === "tasks" && openTasks() ? '<span class="badge">' + openTasks() + "</span>" : "";
      return '<button class="nav ' + (on ? "on" : "") + '" data-act="go" data-r="' + t[0] + '">' + ic(t[2]) + (t[0] === "ai" ? "KI-Assistent" : t[1]) + badge + "</button>";
    }).join("") + '<div class="side__foot"><div class="row"><span class="dot"></span><b>Noxi KI ist bereit</b></div><p class="small dim" style="margin-top:6px">Läuft auf iPhone und Mac.</p></div>';
  }
  function tabbar() {
    return TABS.map(function (t) {
      var on = S.route === t[0] || (t[0] === "learn" && S.route === "study");
      return '<button class="tab ' + (on ? "on" : "") + '" data-act="go" data-r="' + t[0] + '">' + ic(t[2]) + t[1] + "</button>";
    }).join("");
  }

  /* =========================================================
     ANSICHTEN
     ========================================================= */
  var V = {};

  function sortEv(list) { return list.slice().sort(function (a, b) { return mins(a.s) - mins(b.s); }); }

  V.today = function () {
    var evs = sortEv(S.events[TODAY]);
    var next = evs.filter(function (e) { return mins(e.s) > NOW; })[0];
    var cur = evs.filter(function (e) { return mins(e.s) <= NOW && mins(e.e) > NOW; })[0];
    var todayTasks = S.tasks.filter(function (t) { return t.due === "Heute"; });
    var doneT = todayTasks.filter(function (t) { return t.done; }).length;
    var gp = Math.round(S.goal.done / S.goal.total * 100);
    var html = '<div class="head"><div><div class="eyebrow">' + esc(longDate(TODAY)) + '</div><h1>Hallo Nico</h1><p>Du hast heute ' + evs.length + " Termine und " + (todayTasks.length - doneT) + ' offene Aufgaben.</p></div><button class="btn pri" data-act="newEvent">' + ic("plus") + "Neu</button></div>";
    html += '<div class="grid today"><div class="stats3 span-12">' +
      '<div class="card"><div class="stat"><span class="ico">' + ic("calendar") + "</span><div><b>" + evs.length + "</b><span>Termine heute</span></div></div></div>" +
      '<div class="card"><div class="stat"><span class="ico" style="background:rgba(74,222,128,.13);color:var(--green)">' + ic("checks") + "</span><div><b>" + doneT + "/" + todayTasks.length + "</b><span>Aufgaben erledigt</span></div></div></div>" +
      '<div class="card"><div class="stat"><span class="ico" style="background:rgba(167,139,250,.14);color:var(--violet)">' + ic("cards") + "</span><div><b>" + S.goal.done + "/" + S.goal.total + "</b><span>Lernkarten heute</span></div></div></div></div>";
    if (next) {
      var inMin = mins(next.s) - NOW;
      html += '<div class="card next span-7"><div class="when">' + (cur ? "Gerade: " + esc(cur.t) + " · " : "") + "Als Nächstes in " + (inMin >= 60 ? Math.floor(inMin / 60) + " Std. " + (inMin % 60 ? (inMin % 60) + " Min." : "") : inMin + " Min.") + "</div><h2>" + esc(next.t) + '</h2><p class="muted">' + next.s + " – " + next.e + " · " + TYPES[next.type].label + '</p><div class="row" style="margin-top:16px"><button class="btn sm" data-act="go" data-r="calendar">' + ic("calendar", "sm") + 'Im Kalender</button>' + (next.type === "lernen" ? '<button class="btn sm pri" data-act="studyDeck" data-id="en">' + ic("play", "sm") + "Jetzt lernen</button>" : "") + "</div></div>";
    }
    html += '<div class="card span-5"><div class="card-t">' + ic("target") + 'Lernziel heute</div><div class="row" style="gap:18px"><div class="ring lg" style="--p:' + gp + '"><span>' + gp + ' %<small>' + S.goal.done + " von " + S.goal.total + '</small></span></div><div class="grow"><p class="muted small">Noch ' + (S.goal.total - S.goal.done) + ' Karten bis zu deinem Tagesziel.</p><div class="row" style="margin-top:12px;gap:6px">' + ic("flame", "sm") + '<b style="color:var(--amber)">' + S.streak + ' Tage Lernserie</b></div><button class="btn sm pri" style="margin-top:14px" data-act="studyDeck" data-id="net">' + ic("play", "sm") + "Weiterlernen</button></div></div></div>";
    if (S.suggestion === "open") {
      html += '<div class="card suggest span-12"><span class="ai-ico">' + ic("sparkles") + '</span><div class="grow"><b>Noxi schlägt vor</b><p class="muted" style="margin:4px 0 12px">Zwischen 16:00 und 18:30 hast du frei. Soll ich 30 Minuten <b style="color:var(--text)">Netzwerktechnik wiederholen</b> einplanen? 4 Karten sind fällig.</p><div class="row"><button class="btn sm pri" data-act="acceptSuggestion">' + ic("check", "sm") + 'Übernehmen</button><button class="btn sm" data-act="dismissSuggestion">Nicht jetzt</button></div></div></div>';
    } else if (S.suggestion === "taken") {
      html += '<div class="card suggest span-12"><span class="ai-ico">' + ic("check") + '</span><div class="grow"><b>Eingeplant!</b><p class="muted" style="margin-top:4px">16:30 – 17:00 · Netzwerktechnik wiederholen steht jetzt in deinem Kalender.</p></div></div>';
    }
    html += '<div class="card span-7"><div class="card-t">' + ic("clock") + 'Dein Tag<button class="more" data-act="go" data-r="calendar">Kalender ' + ic("right", "sm") + '</button></div><div class="tl">' + evs.map(function (e) {
      var past = mins(e.e) <= NOW, now = mins(e.s) <= NOW && mins(e.e) > NOW;
      return '<div class="tl-i ' + (past ? "past" : "") + (now ? " now" : "") + '" style="--c:' + TYPES[e.type].c + '"><time>' + e.s + '</time><div class="grow"><b>' + esc(e.t) + '</b><span class="small dim">' + e.s + " – " + e.e + (now ? ' · <span style="color:var(--teal)">läuft gerade</span>' : "") + "</span></div></div>";
    }).join("") + "</div></div>";
    html += '<div class="card span-5"><div class="card-t">' + ic("checks") + 'Aufgaben heute<button class="more" data-act="go" data-r="tasks">Alle ' + ic("right", "sm") + "</button></div>" + todayTasks.map(taskRow).join("") + "</div></div>";
    return html;
  };

  function taskRow(t) {
    return '<div class="task ' + (t.done ? "done" : "") + (t.fresh ? " fresh" : "") + '"><button class="tick ' + (t.done ? "on" : "") + '" data-act="toggleTask" data-id="' + t.id + '" aria-label="Erledigt">' + ic("check") + '</button><div class="grow"><div class="t">' + esc(t.t) + '</div><div class="m"><span class="dotc" style="--c:' + LISTS[t.list] + '"></span>' + esc(t.list) + " · " + esc(t.due) + "</div></div>" + (t.prio ? '<span class="flag" title="Wichtig">!</span>' : "") + '<button class="del" data-act="delTask" data-id="' + t.id + '" aria-label="Löschen">' + ic("trash", "sm") + "</button></div>";
  }

  V.calendar = function () {
    var evs = sortEv(S.events[S.day]);
    var html = '<div class="head"><div><div class="eyebrow">Kalender</div><h1>' + esc(longDate(S.day)) + '</h1></div><button class="btn pri add-lbl" data-act="newEvent">' + ic("plus") + '<span class="lbl">Termin</span></button></div>';
    html += '<div class="week">' + DAYNAMES.map(function (n, i) {
      return '<button class="day ' + (i === S.day ? "on " : "") + (i === TODAY ? "today " : "") + (S.events[i].length ? "has" : "") + '" data-act="pickDay" data-i="' + i + '"><small>' + n + "</small><b>" + dateOf(i).getDate() + "</b><i></i></button>";
    }).join("") + "</div>";
    html += '<div class="legend" style="margin-bottom:12px">' + Object.keys(TYPES).map(function (k) { return '<span><span class="dotc" style="--c:' + TYPES[k].c + '"></span>' + TYPES[k].label + "</span>"; }).join("") + "</div>";
    var start = 7, end = 23, H = 56;
    html += '<div class="card" style="padding:12px 14px 12px 4px"><div class="cal">';
    for (var h = start; h < end; h++) html += '<div class="hour"><span>' + (h < 10 ? "0" : "") + h + ":00</span></div>";
    // Überlappende Termine nebeneinander statt übereinander anordnen
    var cols = [], group = [], groupEnd = -1;
    function closeGroup() { group.forEach(function (g) { g.n = group.reduce(function (m, x) { return Math.max(m, x.col + 1); }, 1); }); group = []; }
    evs.forEach(function (e) {
      var s0 = mins(e.s), e0 = mins(e.e);
      if (s0 >= groupEnd) { closeGroup(); cols = []; }
      var col = 0;
      while (cols[col] !== undefined && cols[col] > s0) col++;
      cols[col] = e0;
      var item = { e: e, col: col };
      group.push(item);
      groupEnd = Math.max(groupEnd, e0);
      e._layout = item;
    });
    closeGroup();
    evs.forEach(function (e) {
      var L = e._layout;
      var top = (mins(e.s) - start * 60) / 60 * H + 8;
      var height = Math.max(24, (mins(e.e) - mins(e.s)) / 60 * H - 4);
      var short = height < 44;
      var pos = "left:calc(62px + (100% - 68px) * " + L.col + " / " + L.n + ");width:calc((100% - 68px) / " + L.n + " - 4px);";
      html += '<button class="ev ' + (short ? "short " : "") + (e.fresh ? "new" : "") + '" style="top:' + top + "px;height:" + height + "px;" + pos + "--c:" + TYPES[e.type].c + '" data-act="openEvent" data-id="' + e.id + '" title="' + esc(e.t) + " · " + e.s + " – " + e.e + '"><b class="ell">' + esc(e.t) + "</b><span" + (short ? ' class="ell"' : "") + ">" + e.s + (short ? "" : " – " + e.e) + "</span></button>";
      e.fresh = false;
      delete e._layout;
    });
    if (S.day === TODAY) html += '<div class="nowline" style="top:' + ((NOW - start * 60) / 60 * H + 8) + 'px" aria-label="Jetzt"></div>';
    html += "</div></div>";
    if (!evs.length) html += '<p class="muted" style="text-align:center;margin-top:14px">Noch nichts geplant. Ein freier Tag!</p>';
    return html;
  };

  // Filter: welche Aufgaben gehören zu welchem Filter?
  var FILTERS = ["Alle", "Heute", "Lernen", "Projekte", "Persönlich", "Erledigt"];
  function inFilter(t, f) {
    if (f === "Alle" || f === "Erledigt") return true;
    if (f === "Heute") return t.due === "Heute";
    return t.list === f;
  }
  function byPrio(a, b) { return (b.fresh ? 1 : 0) - (a.fresh ? 1 : 0) || (b.prio - a.prio); }
  V.tasks = function () {
    var f = S.filter;
    var matching = S.tasks.filter(function (t) { return inFilter(t, f); });
    var open = matching.filter(function (t) { return !t.done; }).sort(byPrio);
    var done = matching.filter(function (t) { return t.done; });
    var total = matching.length;
    var pct = total ? Math.round(done.length / total * 100) : 0;
    var label = f === "Alle" ? "Alle Listen" : f === "Erledigt" ? "Erledigt" : f;
    var sub = f === "Erledigt" ? done.length + " erledigte Aufgaben" : open.length + " offen · " + done.length + " erledigt";
    var html = '<div class="head"><div><div class="eyebrow">Aufgaben · ' + esc(label) + '</div><h1>To-dos</h1><p>' + sub + '</p></div><div style="min-width:160px"><div class="row small" style="margin-bottom:6px"><span class="grow dim">Fortschritt</span><b>' + pct + ' %</b></div><div class="bar"><span style="width:' + pct + '%"></span></div></div></div>';
    var defList = LISTS[f] ? f : "Persönlich";
    html += '<form class="card" data-form="task" style="margin-bottom:16px;padding:12px"><div class="row" style="flex-wrap:wrap"><input class="input grow" name="t" placeholder="Neue Aufgabe … z. B. „Vokabeln lernen“" autocomplete="off" style="min-width:180px"><select class="input" name="list" style="width:auto">' + Object.keys(LISTS).map(function (l) { return "<option" + (l === defList ? " selected" : "") + ">" + l + "</option>"; }).join("") + '</select><select class="input" name="due" style="width:auto"><option>Heute</option><option>Morgen</option><option>Diese Woche</option></select><label class="chip" style="cursor:pointer"><input type="checkbox" name="prio" style="accent-color:var(--teal)"> Wichtig</label><button class="btn pri round" aria-label="Hinzufügen">' + ic("plus") + "</button></div></form>";
    html += '<div class="chips" style="margin-bottom:12px" role="tablist" aria-label="Filter">' + FILTERS.map(function (x) {
      var n = x === "Erledigt" ? S.tasks.filter(function (t) { return t.done; }).length : S.tasks.filter(function (t) { return !t.done && inFilter(t, x); }).length;
      return '<button class="chip ' + (f === x ? "on" : "") + '" role="tab" aria-selected="' + (f === x) + '" data-act="filter" data-v="' + x + '">' + (LISTS[x] ? '<span class="dotc" style="--c:' + LISTS[x] + '"></span>' : "") + x + '<span class="cnt">' + n + "</span></button>";
    }).join("") + "</div>";
    html += '<div class="card tasklist" style="padding:6px 16px">';
    if (f === "Erledigt") {
      html += done.length ? done.map(taskRow).join("") : '<p class="muted empty-t">Noch nichts erledigt – leg los!</p>';
    } else {
      html += open.length ? open.map(taskRow).join("") : '<p class="muted empty-t">Alles erledigt in „' + esc(label) + '“ – stark!</p>';
      if (done.length) html += '<div class="done-h">' + ic("check", "sm") + "Erledigt · " + done.length + "</div>" + done.map(taskRow).join("");
    }
    return html + "</div>";
  };

  function deckDue(d) { return Math.max(0, d.cards.length - d.learned); }
  V.learn = function () {
    var gp = Math.round(S.goal.done / S.goal.total * 100);
    var html = '<div class="head"><div><div class="eyebrow">Lernen</div><h1>Lernkarten</h1><p>Wiederhole, was fällig ist – Noxi plant den Rest.</p></div></div>';
    html += '<div class="grid learn-top"><div class="card streak"><span class="flame">' + ic("flame") + '</span><div><b style="font-size:20px">' + S.streak + ' Tage Lernserie</b><p class="small muted">Weiter so! Heute noch ' + (S.goal.total - S.goal.done) + ' Karten.</p><div class="days7">' + DAYNAMES.map(function (n, i) { return '<span class="' + (i <= TODAY ? "on" : "") + '">' + n.charAt(0) + "</span>"; }).join("") + '</div></div></div><div class="card row" style="gap:18px"><div class="ring lg" style="--p:' + gp + '"><span>' + gp + ' %<small>Tagesziel</small></span></div><div class="grow"><b>' + S.goal.done + " von " + S.goal.total + ' Karten</b><p class="small muted" style="margin-top:4px">Fällig: ' + S.decks.reduce(function (n, d) { return n + deckDue(d); }, 0) + ' Karten in ' + S.decks.length + ' Stapeln</p><button class="btn sm pri" style="margin-top:12px" data-act="studyAll">' + ic("play", "sm") + "Alles Fällige lernen</button></div></div></div>";
    html += '<div class="grid decks">' + S.decks.map(function (d) {
      var p = Math.round(d.learned / d.cards.length * 100);
      return '<div class="card deck" style="--c:' + d.c + '"><div class="row"><span class="deck-ico">' + ic(d.icon) + '</span><div class="grow"><h3 class="ell">' + esc(d.name) + '</h3><span class="small dim">' + d.cards.length + ' Karten</span></div></div><div><div class="row small" style="margin-bottom:6px"><span class="grow dim">Gelernt</span><b>' + p + ' %</b></div><div class="bar"><span style="width:' + p + "%;background:" + d.c + '"></span></div></div><div class="row"><span class="due grow">' + (deckDue(d) ? deckDue(d) + " fällig" : "Alles wiederholt ✓") + '</span><button class="btn sm" data-act="studyDeck" data-id="' + d.id + '">' + ic("play", "sm") + "Lernen</button></div></div>";
    }).join("") +
      '<form class="card gen" data-form="gen"><div class="card-t">' + ic("sparkles") + 'Karten mit KI erstellen</div><p class="small muted" style="margin-bottom:10px">Füge Lernstoff ein – Noxi macht Karteikarten daraus.</p><textarea class="input" name="text" rows="3" placeholder="z. B. Notizen zu Subnetting …">Subnetting: Ein /24-Netz hat die Maske 255.255.255.0. Ein /26-Netz hat 64 Adressen, ein /30-Netz 4 Adressen.</textarea><button class="btn pri" style="margin-top:10px;width:100%">' + ic("sparkles") + "Karten erstellen</button></form></div>";
    return html;
  };

  V.study = function () {
    var st = S.study, d = deck(st.deck);
    if (st.pos >= st.queue.length) {
      var good = st.res.good + st.res.easy, total = st.res.again + st.res.hard + good;
      var p = total ? Math.round(good / total * 100) : 0;
      return '<div class="study"><div class="card finish" style="--c:' + d.c + '"><div class="ring lg" style="--p:' + p + ";--c:" + d.c + '"><span>' + p + ' %<small>gewusst</small></span></div><h2>Stapel geschafft!</h2><p class="muted">' + esc(d.name) + " · " + total + " Antworten · " + st.res.again + " × nochmal</p>" + '<div class="row" style="justify-content:center;margin-top:20px"><button class="btn" data-act="studyDeck" data-id="' + d.id + '">' + ic("refresh", "sm") + 'Nochmal</button><button class="btn pri" data-act="go" data-r="learn">Fertig</button></div></div></div>';
    }
    var c = d.cards[st.queue[st.pos]];
    var prog = Math.round(st.pos / st.queue.length * 100);
    return '<div class="study" style="--c:' + d.c + '"><div class="study-top"><button class="btn round" data-act="go" data-r="learn" aria-label="Zurück">' + ic("left") + '</button><div class="grow"><b>' + esc(d.name) + '</b><div class="bar" style="margin-top:6px"><span style="width:' + prog + "%;background:" + d.c + '"></span></div></div><span class="chip">' + (st.pos + 1) + " / " + st.queue.length + "</span></div>" +
      '<div class="flip ' + (st.flipped ? "on" : "") + '" data-act="flip" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-in"><div class="face front"><small>Frage</small><h2>' + esc(c.q) + '</h2><span class="hint">Tippen oder Leertaste zum Umdrehen</span></div><div class="face back"><small>Antwort</small><p>' + esc(c.a) + "</p></div></div></div>" +
      (st.flipped ? '<div class="rate"><button class="r1" data-act="rate" data-v="again">Nochmal<small>&lt; 1 Min.</small></button><button class="r2" data-act="rate" data-v="hard">Schwer<small>6 Min.</small></button><button class="r3" data-act="rate" data-v="good">Gut<small>1 Tag</small></button><button class="r4" data-act="rate" data-v="easy">Leicht<small>4 Tage</small></button></div>' : '<button class="btn pri" data-act="flip" style="height:48px">Antwort zeigen</button>') +
      '<p class="small dim" style="text-align:center">Tasten: Leertaste umdrehen · 1–4 bewerten</p></div>';
  };

  V.ai = function () {
    var html = '<div class="chat-h"><span class="ai-ico">' + ic("sparkles") + '</span><div class="grow"><h1>Noxi KI</h1><span class="small dim">Kennt deinen Kalender, deine Aufgaben und Lernkarten</span></div><button class="btn sm" data-act="resetChat">' + ic("refresh", "sm") + "Neu</button></div>";
    html += '<div class="msgs" id="msgs">' + S.chat.map(function (m) {
      if (m.from === "me") return '<div class="msg me"><div class="bub">' + esc(m.text) + "</div></div>";
      if (m.typing) return '<div class="msg"><span class="ai-ico">' + ic("sparkles") + '</span><div class="bub"><span class="typing"><span></span><span></span><span></span></span></div></div>';
      var acts = (m.acts || []).map(function (a) { return '<button class="btn sm ' + (a.done ? "" : "pri") + '" data-act="chatAct" data-a="' + a.a + '"' + (a.done ? " disabled" : "") + ">" + (a.done ? ic("check", "sm") + "Erledigt" : esc(a.label)) + "</button>"; }).join("");
      return '<div class="msg"><span class="ai-ico">' + ic("sparkles") + '</span><div class="bub">' + md(m.text) + (acts ? '<div class="acts">' + acts + "</div>" : "") + "</div></div>";
    }).join("") + "</div>";
    html += '<div class="sugs">' + ["Plane meinen Nachmittag", "Erklär mir das OSI-Modell", "Erstelle Lernkarten zu Subnetting", "Frag mich Netzwerktechnik ab", "Was steht heute an?"].map(function (s) { return '<button class="chip" data-act="ask" data-q="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + "</div>";
    html += '<form class="composer" data-form="chat"><input class="input" id="chatIn" name="text" placeholder="Frag Noxi …" autocomplete="off"><button class="btn pri" aria-label="Senden">' + ic("send") + "</button></form>";
    return html;
  };

  /* ---------- KI-Antworten (Beispiele) ---------- */
  function aiAnswer(q) {
    var l = q.toLowerCase();
    if (/nachmittag|plan|tag planen|woche/.test(l)) return { text: "Hier ist mein Vorschlag für deinen Nachmittag:\n\n**15:30 – 16:00** Englisch-Vokabeln (steht schon drin)\n**16:30 – 17:00** Netzwerktechnik wiederholen – 4 Karten sind fällig\n**17:15 – 17:45** Bewerbungsunterlagen aktualisieren (wichtig!)\n**18:30** Training\n\nSoll ich die neuen Blöcke in deinen Kalender eintragen?", acts: [{ a: "plan", label: "In Kalender übernehmen" }] };
    if (/osi/.test(l)) return { text: "Das **OSI-Modell** beschreibt in 7 Schichten, wie Daten durch ein Netzwerk wandern:\n\n**7 Anwendung** – z. B. HTTP, DNS\n**6 Darstellung** – Formate, Verschlüsselung\n**5 Sitzung** – Verbindungen steuern\n**4 Transport** – TCP/UDP, Ports\n**3 Vermittlung** – IP-Adressen, Routing\n**2 Sicherung** – MAC-Adressen, Switches\n**1 Bitübertragung** – Kabel, Funk, Signale\n\nMerksatz von oben nach unten: „**A**lle **D**eutschen **S**chüler **T**rinken **V**erschiedene **S**orten **B**ier“.", acts: [{ a: "studyNet", label: "Netzwerktechnik abfragen" }] };
    if (/lernkarten|karten|subnet/.test(l)) return { text: "Ich habe dir **3 Lernkarten zu Subnetting** erstellt:\n\n• /24 – welche Subnetzmaske?\n• /26 – wie viele Adressen pro Subnetz?\n• Wofür wird ein /30-Netz oft genutzt?\n\nSie liegen jetzt im Stapel **„Subnetting (KI)“**.", acts: [{ a: "studySub", label: "Jetzt lernen" }], effect: "subdeck" };
    if (/abfrag|frag mich|quiz|test/.test(l)) return { text: "Gern! Ich starte eine Lernsession mit **Netzwerktechnik**. Dreh jede Karte um und bewerte, wie gut du sie wusstest – ich plane die Wiederholungen danach.", acts: [{ a: "studyNet", label: "Abfrage starten" }] };
    if (/heute|ansteht|steht an/.test(l)) {
      var evs = sortEv(S.events[TODAY]).filter(function (e) { return mins(e.s) > NOW; });
      var open = S.tasks.filter(function (t) { return t.due === "Heute" && !t.done; });
      return { text: "Heute steht noch an:\n\n" + evs.map(function (e) { return "**" + e.s + "** " + e.t; }).join("\n") + "\n\nOffene Aufgaben: " + (open.length ? open.map(function (t) { return t.t; }).join(", ") : "keine – stark!") + "." };
    }
    if (/^(hallo|hi|hey|servus|moin)\b/.test(l)) return { text: "Hey! Ich kann deinen Tag planen, Lernstoff erklären, Karteikarten erstellen oder dich abfragen. Was darf's sein?" };
    return { text: "Gute Frage! In dieser Demo antworte ich mit vorbereiteten Beispielen. Probier mal **„Plane meinen Nachmittag“**, **„Erklär mir das OSI-Modell“** oder **„Erstelle Lernkarten zu Subnetting“**." };
  }

  /* =========================================================
     RENDERN
     ========================================================= */
  function render() {
    $("#side").innerHTML = sidebar();
    $("#tabbar").innerHTML = tabbar();
    var v = $("#view");
    v.className = "view" + (S.route === "ai" ? " chatv" : "");
    v.innerHTML = V[S.route]();
    var m = $("#msgs");
    if (m) m.scrollTop = m.scrollHeight;
  }
  // Nur beim Wechsel des Bereichs einblenden – nicht bei jedem Klick (verhindert Flackern)
  function go(r) {
    S.route = r; closeLayer(); render();
    var v = $("#view");
    v.scrollTop = 0;
    v.classList.remove("enter"); void v.offsetWidth; v.classList.add("enter");
  }
  function rerender() { var v = $("#view"), y = v.scrollTop; render(); v.scrollTop = y; }
  function toast(msg, icon) {
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = ic(icon || "check") + "<span>" + esc(msg) + "</span>";
    $("#toasts").appendChild(t);
    setTimeout(function () { t.classList.add("out"); }, 2500);
    setTimeout(function () { t.remove(); }, 2850);
  }
  function closeLayer() { $("#layer").innerHTML = ""; }
  function sheet(title, body, foot) {
    $("#layer").innerHTML = '<div class="overlay" data-act="overlay"><div class="sheet" role="dialog" aria-modal="true">' + (title ? '<div class="sheet-h"><h2>' + title + '</h2><button class="x" data-act="close" aria-label="Schließen">' + ic("x", "sm") + "</button></div>" : "") + body + (foot || "") + "</div></div>";
    var f = $("#layer [autofocus]"); if (f) f.focus();
  }
  function deck(id) { return S.decks.filter(function (d) { return d.id === id; })[0]; }
  function startStudy(id) {
    var d = deck(id);
    var order = d.cards.map(function (c, i) { return i; });
    S.study = { deck: id, queue: order, pos: 0, flipped: false, res: { again: 0, hard: 0, good: 0, easy: 0 } };
    go("study");
  }
  function addEvent(day, t, s, e, type) {
    var dup = S.events[day].filter(function (o) { return o.t === t && o.s === s; })[0];
    if (dup) return dup;
    var x = ev(t, s, e, type); x.fresh = true;
    S.events[day].push(x);
    return x;
  }
  function addSubDeck() {
    if (deck("sub")) return;
    S.decks.push({ id: "sub", name: "Subnetting (KI)", icon: "sparkles", c: "var(--violet)", learned: 0, cards: [
      card("/24 entspricht welcher Subnetzmaske?", "255.255.255.0"),
      card("Wie viele Adressen hat ein /26-Subnetz?", "64 Adressen – davon 62 nutzbare Hosts."),
      card("Wofür wird ein /30-Netz oft genutzt?", "Für Punkt-zu-Punkt-Verbindungen, z. B. zwischen zwei Routern (2 nutzbare Hosts).")
    ] });
  }
  function welcome() {
    var links = [["today", "Heute", "sun"], ["calendar", "Kalender", "calendar"], ["tasks", "Aufgaben", "checks"], ["learn", "Lernkarten", "cards"]];
    sheet("", '<div class="welcome"><span class="appicon">N</span><h2>Willkommen bei Noxi</h2><p class="muted">Meine persönliche Alltags-App für iPhone und Mac – mit KI-Assistent, der beim Planen und Lernen hilft. Das hier ist eine Demo mit Beispieldaten.</p><div class="wgrid">' + links.map(function (l) { return '<button data-act="go" data-r="' + l[0] + '">' + ic(l[2]) + l[1] + "</button>"; }).join("") + '</div><button class="btn pri" data-act="go" data-r="ai" style="width:100%;height:46px">' + ic("sparkles") + 'Mit dem KI-Assistenten starten</button><button class="btn ghost" data-act="close" style="margin-top:8px">Einfach umschauen</button></div>');
  }
  function sendChat(text) {
    S.chat.push({ from: "me", text: text });
    var typing = { from: "ai", typing: true };
    S.chat.push(typing);
    if (S.route !== "ai") go("ai"); else rerender();
    setTimeout(function () {
      var a = aiAnswer(text);
      typing.typing = false; typing.text = a.text; typing.acts = a.acts;
      if (a.effect === "subdeck") addSubDeck();
      if (S.route === "ai") { rerender(); var i = $("#chatIn"); if (i) i.focus(); }
    }, 1000 + Math.random() * 600);
  }
  function markAct(name) { S.chat.forEach(function (m) { (m.acts || []).forEach(function (a) { if (a.a === name) a.done = true; }); }); }

  /* ---------- Aktionen ---------- */
  var A = {
    go: function (el) { go(el.dataset.r); },
    close: function () { closeLayer(); },
    overlay: function (el, e) { if (e.target === el) closeLayer(); },
    acceptSuggestion: function () { addEvent(TODAY, "Netzwerktechnik wiederholen", "16:30", "17:00", "lernen"); S.suggestion = "taken"; toast("16:30 Netzwerktechnik eingeplant", "calendar"); rerender(); },
    dismissSuggestion: function () { S.suggestion = "gone"; rerender(); },
    toggleTask: function (el) {
      S.tasks.forEach(function (t) { if (t.id === el.dataset.id) { t.done = !t.done; if (t.done) toast("Erledigt: " + t.t); } });
      rerender();
    },
    delTask: function (el) { S.tasks = S.tasks.filter(function (t) { return t.id !== el.dataset.id; }); toast("Aufgabe gelöscht", "trash"); rerender(); },
    filter: function (el) {
      S.filter = el.dataset.v; rerender();
      var l = $(".tasklist"); if (l) { l.classList.remove("swap"); void l.offsetWidth; l.classList.add("swap"); }
    },
    pickDay: function (el) { S.day = +el.dataset.i; rerender(); },
    newEvent: function () {
      sheet("Neuer Termin", '<form data-form="event"><div class="sheet-b"><div class="field"><label for="et">Titel</label><input class="input" id="et" name="t" placeholder="z. B. Lernen für die Prüfung" required autofocus></div><div class="row"><div class="field grow"><label for="es">Beginn</label><input class="input" id="es" type="time" name="s" value="17:00" required></div><div class="field grow"><label for="ee">Ende</label><input class="input" id="ee" type="time" name="e" value="18:00" required></div></div><div class="field"><label for="ed">Tag</label><select class="input" id="ed" name="d">' + DAYNAMES.map(function (n, i) { return '<option value="' + i + '"' + (i === S.day ? " selected" : "") + ">" + esc(longDate(i)) + "</option>"; }).join("") + '</select></div><div class="field"><label>Art</label><div class="chips">' + Object.keys(TYPES).map(function (k, i) { return '<label class="chip" style="cursor:pointer"><input type="radio" name="type" value="' + k + '"' + (i === 1 ? " checked" : "") + ' style="accent-color:var(--teal)"><span class="dotc" style="--c:' + TYPES[k].c + '"></span>' + TYPES[k].label + "</label>"; }).join("") + '</div></div></div><div class="sheet-f"><button type="button" class="btn" data-act="close">Abbrechen</button><button class="btn pri">' + ic("plus") + "Hinzufügen</button></div></form>");
    },
    openEvent: function (el) {
      var e = S.events[S.day].filter(function (x) { return x.id === el.dataset.id; })[0];
      sheet(esc(e.t), '<div class="sheet-b"><div class="row" style="margin-bottom:10px"><span class="dotc" style="--c:' + TYPES[e.type].c + '"></span><b>' + TYPES[e.type].label + '</b></div><p class="muted">' + esc(longDate(S.day)) + "<br>" + e.s + " – " + e.e + " (" + (mins(e.e) - mins(e.s)) + " Min.)</p></div>", '<div class="sheet-f"><button class="btn" data-act="delEvent" data-id="' + e.id + '" style="color:var(--rose)">' + ic("trash", "sm") + 'Löschen</button><button class="btn pri" data-act="close">Fertig</button></div>');
    },
    delEvent: function (el) { S.events[S.day] = S.events[S.day].filter(function (x) { return x.id !== el.dataset.id; }); closeLayer(); toast("Termin gelöscht", "trash"); rerender(); },
    studyDeck: function (el) { startStudy(el.dataset.id); },
    studyAll: function () {
      var d = S.decks.filter(function (x) { return deckDue(x) > 0; })[0] || S.decks[0];
      startStudy(d.id);
    },
    flip: function () { if (S.study && S.study.pos < S.study.queue.length) { S.study.flipped = !S.study.flipped; rerender(); } },
    rate: function (el) {
      var st = S.study, v = el.dataset.v, d = deck(st.deck);
      st.res[v]++;
      if (v === "again") st.queue.push(st.queue[st.pos]);
      else { S.goal.done = Math.min(S.goal.total, S.goal.done + 1); d.learned = Math.min(d.cards.length, d.learned + 1); }
      st.pos++; st.flipped = false;
      if (st.pos >= st.queue.length) toast("Stapel „" + d.name + "“ geschafft!", "flame");
      rerender();
    },
    ask: function (el) { sendChat(el.dataset.q); },
    resetChat: function () { S.chat = [{ from: "ai", text: "Neuer Chat! Wobei kann ich dir helfen?" }]; rerender(); },
    chatAct: function (el) {
      var a = el.dataset.a;
      if (a === "plan") {
        addEvent(TODAY, "Netzwerktechnik wiederholen", "16:30", "17:00", "lernen");
        addEvent(TODAY, "Bewerbungsunterlagen", "17:15", "17:45", "fokus");
        S.suggestion = "taken";
        markAct("plan"); toast("2 Blöcke in den Kalender übernommen", "calendar"); rerender();
      }
      if (a === "studyNet") { markAct("studyNet"); startStudy("net"); }
      if (a === "studySub") { addSubDeck(); markAct("studySub"); startStudy("sub"); }
    }
  };

  var FORMS = {
    task: function (f, d) {
      var t = (d.get("t") || "").trim();
      if (!t) { var inp = f.querySelector('[name="t"]'); if (inp) { inp.focus(); inp.classList.add("shake"); setTimeout(function () { inp.classList.remove("shake"); }, 400); } return; }
      var task = { id: uid(), t: t, list: d.get("list"), due: d.get("due"), prio: !!d.get("prio"), done: false, fresh: true };
      S.tasks.unshift(task);
      // Neue Aufgabe muss sichtbar sein: passt sie nicht zum Filter, auf „Alle“ wechseln
      if (S.filter === "Erledigt" || !inFilter(task, S.filter)) S.filter = "Alle";
      toast("Aufgabe hinzugefügt: " + t, "checks"); rerender();
      task.fresh = false;
      var row = $(".task.fresh"); if (row) row.scrollIntoView({ block: "nearest" });
      var i = $('[data-form="task"] [name="t"]'); if (i) i.focus();
    },
    event: function (f, d) {
      var s = d.get("s"), e = d.get("e");
      if (mins(e) <= mins(s)) e = hhmm(Math.min(23 * 60 + 59, mins(s) + 30));
      var day = +d.get("d");
      addEvent(day, d.get("t"), s, e, d.get("type") || "lernen");
      S.day = day; closeLayer(); toast("Termin eingetragen", "calendar");
      if (S.route !== "calendar") go("calendar"); else rerender();
    },
    chat: function (f, d) { var t = (d.get("text") || "").trim(); if (t) sendChat(t); },
    gen: function (f) {
      var card_ = f; card_.classList.add("busy");
      var btn = f.querySelector(".btn"); btn.innerHTML = '<span class="typing"><span></span><span></span><span></span></span> Noxi erstellt Karten …';
      setTimeout(function () { addSubDeck(); toast("3 Lernkarten erstellt", "sparkles"); rerender(); }, 1400);
    }
  };

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (el && A[el.dataset.act]) A[el.dataset.act](el, e);
  });
  document.addEventListener("submit", function (e) {
    var f = e.target.closest("form[data-form]");
    if (!f) return;
    e.preventDefault();
    FORMS[f.dataset.form](f, new FormData(f));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeLayer(); return; }
    if (S.route !== "study" || /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); A.flip(); }
    var map = { "1": "again", "2": "hard", "3": "good", "4": "easy" };
    if (map[e.key] && S.study.flipped) A.rate({ dataset: { v: map[e.key] } });
  });

  /* ---------- Start ---------- */
  var PREVIEW = /[?&]preview=1/.test(location.search);
  render();
  if (PREVIEW) {
    // Vorschau-Modus für die Portfolio-Projektkarte: läuft von selbst durch die Bereiche
    document.documentElement.classList.add("preview");
    toast = function () {};
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var steps = [
      function () { go("today"); },
      function () { go("calendar"); },
      function () { go("learn"); },
      function () { startStudy("net"); setTimeout(function () { if (S.route === "study") A.flip(); }, 1600); },
      function () { go("ai"); }
    ];
    var n = 0;
    if (!still) setInterval(function () { n = (n + 1) % steps.length; steps[n](); }, 4500);
  } else {
    setTimeout(welcome, 250);
  }
})();
