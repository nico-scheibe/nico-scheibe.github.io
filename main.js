/* =========================================================
   Seiten-Logik: Projektkarten, Menü, Scroll-Animationen
   (Projekte selbst bearbeitest du in projects.js)
   ========================================================= */

(function () {
  "use strict";

  // Text sicher in HTML einsetzen
  function esc(str) {
    return String(str ?? "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Projektkarten ----------
  function renderMedia(p) {
    var m = p.media;
    if (m && m.type === "video" && m.src) {
      return '<video src="' + esc(m.src) + '"' + (m.poster ? ' poster="' + esc(m.poster) + '"' : "") +
        ' autoplay muted loop playsinline preload="metadata" aria-label="Video: ' + esc(p.title) + '"></video>';
    }
    if (m && m.type === "preview" && m.src) {
      // Verkleinerte, nicht klickbare Live-Ansicht einer App (z. B. der Xyntal-Demo)
      return '<div class="project__preview" role="img" aria-label="' + esc(m.alt || "Live-Vorschau von " + p.title) + '">' +
        '<iframe src="' + esc(m.src) + '" title="' + esc(p.title) + ' Vorschau" tabindex="-1" loading="lazy" aria-hidden="true"></iframe>' +
        '<span class="project__live"><span class="dot" aria-hidden="true"></span>Live-Vorschau</span></div>';
    }
    if (m && m.type === "image" && m.src) {
      return '<img src="' + esc(m.src) + '" alt="' + esc(m.alt || "Screenshot von " + p.title) + '" loading="lazy">';
    }
    return '<div class="project__placeholder">' +
      '<span class="project__placeholder-icon">' + esc(p.title.charAt(0)) + '</span>' +
      '<span>[Screenshot / Video folgt]</span></div>';
  }

  function renderLink(p) {
    // Links, die noch in [eckigen Klammern] stehen, gelten als Platzhalter
    if (p.link && p.link.url && p.link.url.charAt(0) !== "[") {
      // Eigene Unterseite (z. B. "xyntal.html") → Button im selben Tab
      if (!/^https?:\/\//.test(p.link.url)) {
        return '<a class="btn btn--primary project__btn" href="' + esc(p.link.url) + '">' +
          esc(p.link.label || "Mehr erfahren") + ' <span aria-hidden="true">→</span></a>';
      }
      return '<a class="project__link" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' +
        esc(p.link.label || "Ansehen") + ' <span aria-hidden="true">↗</span></a>';
    }
    return '<span class="project__link project__link--disabled">Link folgt</span>';
  }

  // App-Vorschauen werden in Desktop-Größe geladen und passend verkleinert
  function fitPreviews() {
    var boxes = document.querySelectorAll(".project__preview");
    if (!boxes.length) return;
    var fit = function (box) {
      var frame = box.querySelector("iframe");
      var scale = Math.max(box.clientWidth / 1280, box.clientHeight / 800);
      frame.style.transform = "scale(" + scale + ")";
    };
    boxes.forEach(fit);
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { fit(e.target); }); });
      boxes.forEach(function (b) { ro.observe(b); });
    } else {
      window.addEventListener("resize", function () { boxes.forEach(fit); });
    }
  }

  function renderProjects() {
    var list = document.getElementById("projectList");
    var projects = window.PROJECTS || [];
    if (!list) return;

    list.innerHTML = projects.map(function (p) {
      var tags = (p.tools || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      return '<article class="project reveal">' +
        '<div class="project__media">' + renderMedia(p) + '</div>' +
        '<div class="project__body">' +
          '<div class="project__top"><h3 class="project__title">' + esc(p.title) + '</h3>' +
            (p.status ? '<span class="badge">' + esc(p.status) + '</span>' : "") + '</div>' +
          (p.platform ? '<p class="project__platform">' + esc(p.platform) + '</p>' : "") +
          '<p class="project__desc">' + esc(p.description) + '</p>' +
          (tags ? '<ul class="project__tags" aria-label="Verwendete Tools">' + tags + '</ul>' : "") +
          renderLink(p) +
        '</div></article>';
    }).join("");
  }

  // ---------- Mobiles Menü ----------
  function initNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    }
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Hell/Dunkel-Schalter ----------
  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById("themeToggle");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!btn) return;

    function apply(theme) {
      root.setAttribute("data-theme", theme);
      var light = theme === "light";
      btn.setAttribute("aria-label", light ? "Zum dunklen Modus wechseln" : "Zum hellen Modus wechseln");
      btn.setAttribute("title", light ? "Dunkler Modus" : "Heller Modus");
      if (meta) meta.setAttribute("content", light ? "#dcdde0" : "#17181b");
    }
    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");

    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.classList.add("theme-anim");
      apply(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      setTimeout(function () { root.classList.remove("theme-anim"); }, 400);
    });
  }

  // ---------- Kontakt: E-Mail/Telefon kopieren & Lichtschein ----------
  function initContact() {
    document.querySelectorAll(".mailbox__copy").forEach(function (btn) {
      var label = btn.querySelector(".mailbox__copy-label");
      var value = btn.getAttribute("data-copy");
      var name = btn.getAttribute("data-name") || "Text";
      btn.addEventListener("click", function () {
        var done = function () {
          btn.classList.add("is-copied");
          if (label) label.textContent = "Kopiert ✓";
          btn.setAttribute("aria-label", name + " kopiert");
          setTimeout(function () {
            btn.classList.remove("is-copied");
            if (label) label.textContent = "Kopieren";
            btn.setAttribute("aria-label", name + " kopieren");
          }, 1800);
        };
        // Ersatzweg für ältere Browser oder wenn die Zwischenablage blockiert ist
        var fallback = function () {
          var ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          var ok = false;
          try { ok = document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
          if (ok) done();
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(done, fallback);
        } else {
          fallback();
        }
      });
    });

    // Lichtschein folgt der Maus (nur Geräte mit Maus)
    var card = document.getElementById("contactCard");
    if (card && window.matchMedia("(hover: hover)").matches) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    }
  }

  // ---------- Live-Demo (Qt WebAssembly) & Download ----------
  function initDemo() {
    // Download-Buttons, deren Link noch in [eckigen Klammern] steht, als "folgt" anzeigen
    document.querySelectorAll(".js-download").forEach(function (a) {
      if ((a.getAttribute("href") || "").charAt(0) === "[") {
        a.removeAttribute("href");
        a.classList.add("is-disabled");
        a.innerHTML = "Download folgt";
      }
    });

    var demo = document.getElementById("demo");
    if (!demo) return;
    var screen = demo.querySelector(".demo__screen");
    var start = demo.querySelector(".demo__start");
    var status = demo.querySelector(".demo__status");
    var src = demo.getAttribute("data-src");

    function showStatus(html) {
      status.innerHTML = html;
      status.hidden = false;
      start.hidden = true;
    }
    function reset() {
      var frame = screen.querySelector(".demo__device") || screen.querySelector("iframe");
      if (frame) frame.remove();
      status.hidden = true;
      start.hidden = false;
    }
    function launch() {
      showStatus('<span class="demo__spinner" aria-hidden="true"></span><span>Demo wird geladen …</span>');
      fetch(src, { method: "HEAD", cache: "no-store" }).then(function (res) {
        if (!res.ok) throw new Error("missing");
        var wrap = document.createElement("div");
        wrap.className = "demo__device";
        var frame = document.createElement("iframe");
        frame.src = src;
        frame.title = (demo.querySelector(".demo__app") || {}).textContent || "Live-Demo";
        frame.setAttribute("allow", "fullscreen; clipboard-write");
        frame.addEventListener("load", function () {
          status.hidden = true;
          try { frame.focus(); } catch (e) {}
        });
        wrap.appendChild(frame);
        screen.appendChild(wrap);
        fitPhone();
      }).catch(function () {
        showStatus('<strong>Demo folgt bald</strong><span>Die Browser-Version ist gerade in Arbeit.</span>' +
          '<button class="btn btn--ghost" type="button" data-demo="reset">Zurück</button>');
      });
    }

    // iPhone-Rahmen passend in das Fenster skalieren
    function fitPhone() {
      var scale = Math.min(1, (screen.clientHeight - 36) / 868, (screen.clientWidth - 24) / 414);
      demo.style.setProperty("--ps", Math.max(.3, scale).toFixed(3));
    }
    window.addEventListener("resize", fitPhone);
    document.addEventListener("fullscreenchange", function () { setTimeout(fitPhone, 50); });

    demo.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-demo]");
      if (!btn) return;
      var action = btn.getAttribute("data-demo");
      if (action === "start") launch();
      if (action === "device") {
        var phone = btn.getAttribute("data-v") === "phone";
        demo.classList.toggle("is-phone", phone);
        demo.querySelectorAll('[data-demo="device"]').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", String(on));
        });
        fitPhone();
      }
      if (action === "reset") reset();
      if (action === "fullscreen") {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (demo.requestFullscreen) demo.requestFullscreen();
      }
    });
  }

  // ---------- Scroll-Animationen ----------
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el, i) {
      // Elemente im selben Bereich leicht versetzt einblenden
      el.style.transitionDelay = Math.min((i % 4) * 70, 210) + "ms";
      io.observe(el);
    });
  }

  renderProjects();
  fitPreviews();
  initNav();
  initTheme();
  initContact();
  initDemo();
  initReveal();
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
