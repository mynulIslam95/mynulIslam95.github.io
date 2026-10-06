(function () {
  var nav = document.querySelector(".site-header");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 12); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var toggle = document.getElementById("nav-toggle");
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (toggle) toggle.checked = false;
    });
  });

  var i18n = {
    en: {
      "nav.queue": "Projects",
      "nav.stack": "Stack",
      "nav.closed": "Closed work",
      "nav.runbooks": "Runbooks",
      "nav.escalate": "Escalate",
      "hero.kicker": "Shift handover · Hamburg desk",
      "hero.title": "Notes for the next person on the queue.",
      "hero.chip1": "Desk: Hamburg",
      "hero.chip2": "6 projects",
      "hero.chip3": "English fluent · German B1",
      "hero.chip4": "Open to relocate",
      "hero.lede": "I keep the queue honest. Take the ticket, reproduce the fault, write the handover, close after retest. Windows and access on the desk. Linux, Azure, Terraform, Docker and CI in GitHub: infrastructure as code, pipelines, containers. Open to relocate for a full-time DevOps or cloud job.",
      "hero.cta": "See the projects",
      "duty.loc": "Location",
      "duty.role": "On duty",
      "duty.roleval": "DevOps, cloud, IT operations",
      "duty.prev": "Last desks",
      "duty.lang": "Languages",
      "duty.langval": "English fluent · German B1 · Bengali native",
      "queue.kicker": "GitHub",
      "queue.title": "Projects",
      "t.open": "open in git",
      "t.note": "Handover note",
      "p1": "Windows inventory, Linux health check, five tickets with verification, backup restore, Ansible, Active Directory and Entra procedures.",
      "p2": "Terraform for a resource group, VNet, NSG, storage and Log Analytics. CI formats and validates. No deploy until a subscription apply.",
      "p3": "Status HTTP service with Compose, Prometheus, Grafana, tests, CI health check, failure drill, rollback and Kubernetes probes.",
      "p4": "Shift toolkit: HTTP health poll, ERROR/WARN log scan, duty checklist, runbook when /health is down.",
      "p5": "FastAPI with pytest on every push, Docker image, Jenkinsfile, Kubernetes Deployment with live and ready probes.",
      "p6": "TypeScript Azure Functions API, tests, Bicep for Storage, App Insights and Function App, GitHub Actions for typecheck and lint.",
      "stack.kicker": "On the desk",
      "stack.title": "Tools I actually use.",
      "stack.s1": "Systems and support",
      "stack.s2": "Cloud and identity",
      "stack.s3": "Automation and delivery",
      "sk.inc": "Incident and tickets",
      "sk.acc": "Access administration",
      "sk.net": "Networking",
      "closed.kicker": "Closed work",
      "closed.title": "What already left the queue.",
      "job.ws": "Working student",
      "job.m.title": "IT Operations, Mondia Group",
      "job.m.dates": "Hamburg · June 2024 - July 2026",
      "job.m.body": "Incident intake, reproduce, follow-up and close after retest. Handover notes for the next shift. User accounts and access rights. First-line support by email and on site.",
      "job.mo.title": "Operations, Motion E-Commerce GmbH",
      "job.mo.dates": "Hamburg · November 2021 - September 2023",
      "job.mo.body": "Production failures tracked to close. Excel control reports and operating notes for the team.",
      "edu.kicker": "Education runbooks",
      "edu.title": "Two degrees. Separate notes.",
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
      "esc.kicker": "Escalate",
      "esc.title": "How to reach the desk.",
      "esc.body": "Hamburg, hybrid, or relocate. English for daily work. German B1. Open to a full-time DevOps or cloud role.",
      "foot": "Mynul Islam · Hamburg · handover, not a pitch deck"
    },
    de: {
      "nav.queue": "Projekte",
      "nav.stack": "Stack",
      "nav.closed": "Erledigt",
      "nav.runbooks": "Runbooks",
      "nav.escalate": "Eskalation",
      "hero.kicker": "Schichtübergabe · Schreibtisch Hamburg",
      "hero.title": "Notizen für die nächste Person in der Queue.",
      "hero.chip1": "Schreibtisch: Hamburg",
      "hero.chip2": "6 Projekte",
      "hero.chip3": "Englisch fließend · Deutsch B1",
      "hero.chip4": "Umzug möglich",
      "hero.lede": "Ich halte die Queue ehrlich. Ticket aufnehmen, Störung nachstellen, Übergabe schreiben, nach Retest schließen. Windows und Rechte am Platz. Linux, Azure, Terraform, Docker und CI auf GitHub: Infrastruktur als Code, Pipelines, Container. Offen für Umzug für eine Vollzeitstelle in DevOps oder Cloud.",
      "hero.cta": "Projekte ansehen",
      "duty.loc": "Ort",
      "duty.role": "Im Dienst",
      "duty.roleval": "DevOps, Cloud, IT-Betrieb",
      "duty.prev": "Letzte Desks",
      "duty.lang": "Sprachen",
      "duty.langval": "Englisch fließend · Deutsch B1 · Bengalisch Muttersprache",
      "queue.kicker": "GitHub",
      "queue.title": "Projekte",
      "t.open": "offen in git",
      "t.note": "Übergabenotiz",
      "p1": "Windows-Inventar, Linux-Check, fünf Tickets mit Prüfung, Backup/Restore, Ansible, Active Directory und Entra-Abläufe.",
      "p2": "Terraform für Ressourcengruppe, VNet, NSG, Storage und Log Analytics. CI prüft Format und Validate. Deploy erst nach Freigabe im Abo.",
      "p3": "Status-HTTP-Dienst mit Compose, Prometheus, Grafana, Tests, CI-Check, Störungsübung, Rollback und Kubernetes-Probes.",
      "p4": "Schichtwerkzeug: HTTP-Health, ERROR/WARN-Logscan, Checkliste, Runbook wenn /health down ist.",
      "p5": "FastAPI mit pytest bei jedem Push, Docker-Image, Jenkinsfile, Kubernetes-Deployment mit Live- und Ready-Probes.",
      "p6": "TypeScript Azure Functions API, Tests, Bicep für Storage, App Insights und Function App, GitHub Actions für Typecheck und Lint.",
      "stack.kicker": "Auf dem Schreibtisch",
      "stack.title": "Was ich wirklich benutze.",
      "stack.s1": "Systeme und Support",
      "stack.s2": "Cloud und Identität",
      "stack.s3": "Automatisierung und Delivery",
      "sk.inc": "Störungen und Tickets",
      "sk.acc": "Zugriffsverwaltung",
      "sk.net": "Netzwerk",
      "closed.kicker": "Erledigte Arbeit",
      "closed.title": "Was die Queue schon verlassen hat.",
      "job.ws": "Werkstudent",
      "job.m.title": "IT Operations, Mondia Group",
      "job.m.dates": "Hamburg · Juni 2024 - Juli 2026",
      "job.m.body": "Störungsaufnahme, nachstellen, nachhalten, nach Retest schließen. Übergaben. Konten und Rechte. First-Level per E-Mail und vor Ort.",
      "job.mo.title": "Operations, Motion E-Commerce GmbH",
      "job.mo.dates": "Hamburg · November 2021 - September 2023",
      "job.mo.body": "Fehlgeschlagene Produktionsläufe bis zum Abschluss. Excel-Kontrollberichte und kurze Betriebsnotizen.",
      "edu.kicker": "Ausbildungs-Runbooks",
      "edu.title": "Zwei Abschlüsse. Getrennte Notizen.",
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
      "esc.kicker": "Eskalation",
      "esc.title": "So erreicht ihr den Schreibtisch.",
      "esc.body": "Hamburg, hybrid oder Umzug. Englisch im Alltag. Deutsch B1. Offen für eine Vollzeitstelle in DevOps oder Cloud.",
      "foot": "Mynul Islam · Hamburg · Übergabe, kein Pitch"
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
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });

  var start = "en";
  try { start = localStorage.getItem("mynul-lang") || "en"; } catch (e) {}
  applyLang(start);
})();
