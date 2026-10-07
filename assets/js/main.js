(function () {
  var nav = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (toggle) toggle.checked = false;
    });
  });

  var i18n = {
    en: {
      "nav.queue": "Projects",
      "nav.stack": "Skills",
      "nav.closed": "Experience",
      "nav.runbooks": "Education",
      "nav.escalate": "Contact",
      "nav.deutsch": "German",
      "de.kicker": "Free German practice",
      "de.title": "Learn German A1 to B1, free.",
      "de.sub": "Short steps. One word at a time. Start here.",
      "hero.title": "Mynul Islam. Hamburg. Open to full-time work and relocation inside Germany for DevOps, cloud, IT operations and system administration.",
      "hero.place": "Based in Hamburg.",
      "term.ask": "Click the command",
      "hero.lede": "On the desk I run IT operations. A ticket comes in, I reproduce the fault, write a clear note for the next person, and close it only after retest. That daily work is Windows, user access and first-line support.",
      "hero.lede2": "In GitHub the same habit is DevOps and cloud: Azure networks and storage in Terraform, services in Docker, Kubernetes probes, and GitHub Actions that format, test and validate before anything is called done.",
      "hero.open": "Open to:",
      "hero.opennote": "Full-time work and relocation inside Germany",
      "hero.roles": "Job roles:",
      "role.devops": "DevOps",
      "role.cloud": "Cloud",
      "role.ops": "IT Operations",
      "role.sys": "System Administration",
      "hero.cta": "Projects",
      "duty.loc": "Location",
      "duty.lang": "Languages",
      "duty.en": "English : C1",
      "duty.de": "German : B1",
      "duty.bn": "Bengali : Native",
      "queue.kicker": "GitHub",
      "queue.title": "Projects",
      "t.open": "open in git",
      "t.note": "Case study",
      "p1": "Windows inventory, Linux health check, five tickets with verification, backup restore, Ansible, Active Directory and Entra procedures.",
      "p2": "Terraform for a resource group, VNet, NSG, storage and Log Analytics. CI formats and validates. No deploy until a subscription apply.",
      "p3": "Status HTTP service with Compose, Prometheus, Grafana, tests, CI health check, failure drill, rollback and Kubernetes probes.",
      "p4": "Shift toolkit: HTTP health poll, ERROR/WARN log scan, duty checklist, runbook when /health is down.",
      "p5": "FastAPI with pytest on every push, Docker image, Jenkinsfile, Kubernetes Deployment with live and ready probes.",
      "p6": "TypeScript Azure Functions API, tests, Bicep for Storage, App Insights and Function App, GitHub Actions for typecheck and lint.",
      "stack.kicker": "Skills",
      "stack.title": "Tools I use.",
      "stack.s1": "Systems and support",
      "stack.s2": "Cloud and identity",
      "stack.s3": "Automation and delivery",
      "sk.inc": "Incident and tickets",
      "sk.acc": "Access administration",
      "sk.net": "Networking",
      "closed.kicker": "Experience",
      "closed.title": "Work.",
      "job.ws": "Working student",
      "job.m.title": "IT Operations, Mondia Group",
      "job.m.dates": "Hamburg · June 2024 - July 2026",
      "job.m.body": "Incident intake, reproduce, follow-up and close after retest. Shift notes for the next person. User accounts and access rights. First-line support by email and on site.",
      "job.mo.title": "Operations, Motion E-Commerce GmbH",
      "job.mo.dates": "Hamburg · November 2021 - September 2023",
      "job.mo.body": "Production failures tracked to close. Excel control reports and operating notes for the team.",
      "edu.kicker": "Education",
      "edu.m.lvl": "Master of Science · in progress",
      "edu.m.dates": "April 2026 - present",
      "edu.m.body": "Started April 2026. Own graduate programme: information and communication systems, networks, digital infrastructure.",
      "edu.m.learn": "What I am studying",
      "edu.m.l1": "Information and communication systems",
      "edu.m.l2": "Communication networks and digital infrastructure",
      "edu.m.l3": "Engineering methods on top of the Information Engineering bachelor",
      "edu.b.lvl": "Bachelor of Science · completed",
      "edu.b.dates": "October 2023 - February 2026",
      "edu.b.body": "Completed undergraduate degree at HAW Hamburg, finished with a bachelor thesis.",
      "edu.b.learn": "What I studied",
      "edu.b.l1": "Operating systems",
      "edu.b.l2": "Computer networks",
      "edu.b.l3": "Software engineering",
      "edu.b.l4": "IT systems",
      "edu.b.l5": "Databases",
      "edu.b.l6": "Bachelor thesis: Python data pipelines for day-ahead renewable energy forecasting",
      "esc.kicker": "Contact",
      "esc.title": "Get in touch.",
      "foot": "Mynul Islam · Hamburg"
    },
    de: {
      "nav.queue": "Projekte",
      "nav.stack": "Skills",
      "nav.closed": "Erfahrung",
      "nav.runbooks": "Ausbildung",
      "nav.escalate": "Kontakt",
      "nav.deutsch": "Deutsch",
      "de.kicker": "Kostenlos Deutsch üben",
      "de.title": "Deutsch A1 bis B1, kostenlos.",
      "de.sub": "Kurze Schritte. Ein Wort nach dem anderen. Hier starten.",
      "hero.title": "Mynul Islam. Hamburg. Offen für Vollzeit und Umzug innerhalb Deutschlands für DevOps, Cloud, IT-Betrieb und Systemadministration.",
      "hero.place": "In Hamburg.",
      "term.ask": "Klick auf den Befehl",
      "hero.lede": "Am Schreibtisch mache ich IT-Betrieb. Ein Ticket kommt, ich stelle die Störung nach, schreibe eine klare Notiz für die nächste Person und schließe erst nach dem Retest. Der Alltag ist Windows, Zugriffsrechte und First-Level-Support.",
      "hero.lede2": "Auf GitHub ist dieselbe Arbeitsweise DevOps und Cloud: Azure-Netze und Storage in Terraform, Dienste in Docker, Kubernetes-Probes und GitHub Actions, die formatieren, testen und validieren, bevor etwas als fertig gilt.",
      "hero.open": "Offen für:",
      "hero.opennote": "Vollzeit und Umzug innerhalb Deutschlands",
      "hero.roles": "Jobrollen:",
      "role.devops": "DevOps",
      "role.cloud": "Cloud",
      "role.ops": "IT-Betrieb",
      "role.sys": "Systemadministration",
      "hero.cta": "Projekte",
      "duty.loc": "Ort",
      "duty.lang": "Sprachen",
      "duty.en": "Englisch : C1",
      "duty.de": "Deutsch : B1",
      "duty.bn": "Bengalisch : Native",
      "queue.kicker": "GitHub",
      "queue.title": "Projekte",
      "t.open": "offen in git",
      "t.note": "Fallstudie",
      "p1": "Windows-Inventar, Linux-Check, fünf Tickets mit Prüfung, Backup/Restore, Ansible, Active Directory und Entra-Abläufe.",
      "p2": "Terraform für Ressourcengruppe, VNet, NSG, Storage und Log Analytics. CI prüft Format und Validate. Deploy erst nach Freigabe im Abo.",
      "p3": "Status-HTTP-Dienst mit Compose, Prometheus, Grafana, Tests, CI-Check, Störungsübung, Rollback und Kubernetes-Probes.",
      "p4": "Schichtwerkzeug: HTTP-Health, ERROR/WARN-Logscan, Checkliste, Runbook wenn /health down ist.",
      "p5": "FastAPI mit pytest bei jedem Push, Docker-Image, Jenkinsfile, Kubernetes-Deployment mit Live- und Ready-Probes.",
      "p6": "TypeScript Azure Functions API, Tests, Bicep für Storage, App Insights und Function App, GitHub Actions für Typecheck und Lint.",
      "stack.kicker": "Skills",
      "stack.title": "Was ich benutze.",
      "stack.s1": "Systeme und Support",
      "stack.s2": "Cloud und Identität",
      "stack.s3": "Automatisierung und Delivery",
      "sk.inc": "Störungen und Tickets",
      "sk.acc": "Zugriffsverwaltung",
      "sk.net": "Netzwerk",
      "closed.kicker": "Erfahrung",
      "closed.title": "Arbeit.",
      "job.ws": "Werkstudent",
      "job.m.title": "IT Operations, Mondia Group",
      "job.m.dates": "Hamburg · Juni 2024 - Juli 2026",
      "job.m.body": "Störungsaufnahme, nachstellen, nachhalten, nach Retest schließen. Übergaben. Konten und Rechte. First-Level per E-Mail und vor Ort.",
      "job.mo.title": "Operations, Motion E-Commerce GmbH",
      "job.mo.dates": "Hamburg · November 2021 - September 2023",
      "job.mo.body": "Fehlgeschlagene Produktionsläufe bis zum Abschluss. Excel-Kontrollberichte und kurze Betriebsnotizen.",
      "edu.kicker": "Ausbildung",
      "edu.m.lvl": "Master of Science · laufend",
      "edu.m.dates": "April 2026 - heute",
      "edu.m.body": "Beginn April 2026. Eigenständiges Masterprogramm: Informations- und Kommunikationssysteme, Netze, digitale Infrastruktur.",
      "edu.m.learn": "Was ich studiere",
      "edu.m.l1": "Informations- und Kommunikationssysteme",
      "edu.m.l2": "Kommunikationsnetze und digitale Infrastruktur",
      "edu.m.l3": "Ingenieurmethoden auf dem Bachelor Information Engineering",
      "edu.b.lvl": "Bachelor of Science · abgeschlossen",
      "edu.b.dates": "Oktober 2023 - Februar 2026",
      "edu.b.body": "Abgeschlossenes Bachelorstudium an der HAW Hamburg, inklusive Abschlussarbeit.",
      "edu.b.learn": "Was ich studiert habe",
      "edu.b.l1": "Betriebssysteme",
      "edu.b.l2": "Rechnernetze",
      "edu.b.l3": "Software Engineering",
      "edu.b.l4": "IT-Systeme",
      "edu.b.l5": "Datenbanken",
      "edu.b.l6": "Bachelorarbeit: Python-Datenpipelines für die Prognose erneuerbarer Erzeugung am Vortag",
      "esc.kicker": "Kontakt",
      "esc.title": "Schreib mir.",
      "foot": "Mynul Islam · Hamburg"
    }
  };

  function applyLang(lang) {
    var pack = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (pack[key]) el.textContent = pack[key];
    });
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("mynul-lang", lang); } catch (e) {}
    if (window.__termLang) window.__termLang(lang);
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });

  var start = "en";
  try { start = localStorage.getItem("mynul-lang") || "en"; } catch (e) {}
  applyLang(start);

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ticking = false;
  var onMove = function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      if (nav) nav.classList.toggle("scrolled", y > 12);
      if (!reduce) {
        document.body.style.setProperty("--scroll-shift", String(Math.round(y * -0.14)) + "px");
        document.body.style.setProperty("--card-shift", String(Math.round(y * 0.05)) + "px");
      }
      ticking = false;
    });
  };
  window.addEventListener("scroll", onMove, { passive: true });
  onMove();

  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion");
    var revealSel = ".hero-grid > *, .ticket, .skill-groups > .panel, .job-card, .edu-card, .contact-card, section .section-kicker, section h2, .page-header, .prose";
    document.querySelectorAll(revealSel).forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  var termBtn = document.getElementById("term-run");
  if (termBtn) {
    var termLog = document.getElementById("term-log");
    var termLive = document.getElementById("term-live-cmd");
    var termOut = document.getElementById("term-out");
    var termNext = document.getElementById("term-next");
    var termCursor = document.querySelector(".term-cursor");
    var termBusy = false;
    var termTimer = null;
    var termLang = start;
    var termMode = "whoami";
    var whoamiOut = function () {
      var p = i18n[termLang] || i18n.en;
      return p["hero.lede"] + "\n\n" + p["hero.lede2"];
    };
    var stopType = function () {
      if (termTimer) { clearInterval(termTimer); termTimer = null; }
    };
    var typeOut = function (text, then) {
      stopType();
      if (!termOut) return;
      if (reduce) {
        termOut.textContent = text;
        if (then) then();
        return;
      }
      var i = 0;
      var step = text.length > 80 ? 4 : 1;
      var ms = text.length > 80 ? 10 : 16;
      termOut.textContent = "";
      termTimer = setInterval(function () {
        i += step;
        termOut.textContent = text.slice(0, i);
        var screen = document.getElementById("term-screen");
        if (screen) screen.scrollTop = screen.scrollHeight;
        if (i >= text.length) {
          termOut.textContent = text;
          stopType();
          if (then) then();
        }
      }, ms);
    };
    var setNext = function () {
      if (termNext) termNext.textContent = termMode;
      termBtn.classList.remove("is-lit");
      void termBtn.offsetWidth;
      termBtn.classList.add("is-lit");
    };
    var resetTerm = function () {
      stopType();
      if (termLog) termLog.innerHTML = "";
      if (termLive) termLive.textContent = "";
      if (termOut) termOut.textContent = "";
      if (termCursor) termCursor.style.display = "";
      var screen = document.getElementById("term-screen");
      if (screen) screen.scrollTop = 0;
      termMode = "whoami";
      setNext();
      termBusy = false;
      termBtn.disabled = false;
    };
    var runTerm = function () {
      if (termBusy) return;
      if (termMode === "clear") {
        resetTerm();
        return;
      }
      termBusy = true;
      termBtn.disabled = true;
      termBtn.classList.remove("is-lit");
      if (termLive) termLive.textContent = "whoami";
      typeOut(whoamiOut(), function () {
        if (termLog) {
          var done = document.createElement("div");
          done.className = "term-done";
          var line = document.createElement("p");
          line.className = "term-line";
          line.innerHTML = '<span class="term-prompt">mynul@IT ~ %</span> ';
          line.appendChild(document.createTextNode("whoami"));
          var out = document.createElement("p");
          out.className = "term-out";
          out.textContent = whoamiOut();
          done.appendChild(line);
          done.appendChild(out);
          termLog.appendChild(done);
        }
        if (termOut) termOut.textContent = "";
        if (termLive) termLive.textContent = "";
        termMode = "clear";
        setNext();
        termBusy = false;
        termBtn.disabled = false;
      });
    };
    window.__termLang = function (lang) {
      termLang = lang;
      setNext();
    };
    setNext();
    termBtn.addEventListener("click", runTerm);
  }
})();
