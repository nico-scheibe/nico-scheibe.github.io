/* =========================================================
   PROJEKTE
   ---------------------------------------------------------
   Hier pflegst du alle Projekte. Jedes Projekt ist ein
   Block in geschweiften Klammern { ... }.
   Neues Projekt hinzufügen: Einen Block kopieren, unten
   einfügen (Komma dazwischen nicht vergessen!) und anpassen.

   Felder:
   - title:       Name des Projekts
   - status:      kleines Label neben dem Titel (oder "" für keins)
   - platform:    Plattform / Art der App
   - description: Kurzbeschreibung (1–3 Sätze)
   - tools:       Liste der verwendeten Tools/Technologien
   - media:       Bild oder Video – oder null für Platzhalter
                  Bild:  { type: "image", src: "assets/noxi.png", alt: "Beschreibung" }
                  Video: { type: "video", src: "assets/noxi.mp4", poster: "assets/noxi.png" }
                  Live-Vorschau (verkleinerte App, nicht klickbar):
                         { type: "preview", src: "demo/xyntal-demo.html?preview=1", alt: "Beschreibung" }
   - link:        { label: "Text", url: "https://..." } – externer Link (öffnet in neuem Tab)
                  { label: "Mehr darüber erfahren", url: "xyntal.html" } – eigene Unterseite (als Button)
                  oder null, wenn es (noch) keinen Link gibt
   ========================================================= */

window.PROJECTS = [
  {
    title: "Noxi",
    status: "Im Alltag im Einsatz",
    platform: "iPhone & Mac · native App",
    description:
      "Meine persönliche Alltags-App mit eingebautem KI-Assistenten. Noxi bündelt Kalender, " +
      "Aufgaben und Lernkarten an einem Ort und hilft mir beim Planen und Lernen – ich nutze sie jeden Tag.",
    tools: ["Swift", "Xcode", "Claude Code", "Cursor"],
    media: { type: "preview", src: "demo/noxi-demo.html?preview=1", alt: "Live-Vorschau der Noxi-App" },
    link: { label: "Mehr darüber erfahren", url: "noxi.html" }
  },
  {
    title: "Xyntal",
    status: "In Entwicklung",
    platform: "Networking-App",
    description:
      "Xyntal verbindet junge, ambitionierte Menschen – z. B. angehende Gründer und Selbstständige – " +
      "mit Leuten, die schon einen Schritt weiter sind. Mit Matching, Workspaces und KI-Center " +
      "finden sie Mentoren und Projektpartner und legen direkt gemeinsam los.",
    tools: ["Qt 6", "QML", "C++", "ChatGPT", "Claude"],
    media: { type: "preview", src: "demo/xyntal-demo.html?preview=1", alt: "Live-Vorschau der Xyntal-App" },
    link: { label: "Mehr darüber erfahren", url: "xyntal.html" }
  }

  // , {
  //   title: "Neues Projekt",
  //   status: "",
  //   platform: "Web-App",
  //   description: "Was macht das Projekt?",
  //   tools: ["Python", "Claude API"],
  //   media: { type: "image", src: "assets/neues-projekt.png", alt: "Screenshot von Neues Projekt" },
  //   link: { label: "Live ansehen", url: "https://..." }
  // }
];
