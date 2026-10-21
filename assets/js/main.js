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
      "flow.open": "Open to work",
      "flow.headline": "Cloud & automation.",
      "flow.intro": "Azure, Terraform, Docker and Python. I work with systems, build practical projects and document what I learn. Based in Hamburg, with a background in Information Engineering.",
      "flow.view": "Explore my projects",
      "flow.meta": "Cloud infrastructure",
      "flow.docs": "Practical projects. Clear documentation.",
      "flow.repository": "Repository overview",
      "flow.repos": "project repositories",
      "flow.tracks": "learning tracks",
      "flow.example": "ILLUSTRATIVE WORKFLOW",
      "flow.evidence": "Read the case studies for scope, checks and limitations.",
      "flow.about": "About me",
      "flow.aboutTitle": "Understand the system.\nThen make it work.",
      "flow.aboutBody": "My work connects IT operations with cloud infrastructure and automation. I like understanding the problem, building a clear solution and checking what actually works.",
      "flow.background": "BACKGROUND",
      "flow.projectsTitle": "Built to learn.\nDocumented to share.",
      "flow.projectsBody": "Explore the code, the decisions and the checks behind each project. Each case study explains its scope and limitations.",
      "flow.learnTitle": "Read. Practise.\nBuild it yourself.",
      "flow.learnBody": "Technology and language lessons, with clear explanations and exercises. Choose a track and start from the beginning.",
      "flow.python": "From your first program to Python foundations, AI concepts and practical projects.",
      "flow.c": "Variables, functions, pointers and the C you need to understand operating systems.",
      "flow.os": "Processes, scheduling, memory and the systems running beneath your programs.",
      "flow.german": "Words, grammar and practice for learning German one step at a time.",
      "flow.educationTitle": "An engineering foundation.",
      "flow.start": "Start learning →",
      "flow.openCourse": "Open the course →",
      "flow.openDesk": "Open the desk →",
      "flow.backTop": "Back to top ↑",
      "nav.learn": "Learn with Mynul",
      "nav.queue": "Projects",
      "nav.stack": "Skills",
      "nav.closed": "Experience",
      "nav.runbooks": "Education",
      "nav.escalate": "Contact",
      "learn.kicker": "German and technology",
      "learn.title": "Learn with Mynul",
      "learn.sub": "Python and AI, C, operating systems and German A1 to B1.",
      "hero.title": "Mynul Islam. Hamburg. Open to full-time work and relocation inside Germany for DevOps, cloud, IT operations and system administration.",
      "hero.place": "Based in Hamburg.",
      "hero.lede": "On the desk I run IT operations. A ticket comes in, I reproduce the fault, write a clear note for the next person, and close it only after retest. That daily work is Windows, user access and first-line support.",
      "hero.lede2": "In GitHub the same habit is DevOps and cloud: Azure networks and storage in Terraform, services in Docker, Kubernetes probes, and GitHub Actions that format, test and validate before anything is called done.",
      "hero.open": "Open to:",
      "hero.opennote": "Full-time work and relocation inside Germany",
      "hero.roles": "Job roles:",
      "role.devops": "DevOps",
      "role.cloud": "Cloud",
      "role.ops": "IT Operations",
      "role.sys": "System Administration",
      "hero.cta": "Learn with Mynul",
      "hero.projects": "Projects",
      "duty.loc": "Location",
      "duty.lang": "Languages",
      "duty.en": "English",
      "duty.de": "German",
      "duty.bn": "Bengali",
      "duty.native": "Native",
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
      "flow.open": "Offen für Neues",
      "flow.headline": "Cloud & Automatisierung.",
      "flow.intro": "Azure, Terraform, Docker und Python. Ich arbeite mit IT-Systemen, entwickle praktische Projekte und dokumentiere, was ich lerne. Mein Standort ist Hamburg, mein Hintergrund Information Engineering.",
      "flow.view": "Meine Projekte entdecken",
      "flow.meta": "Cloud-Infrastruktur",
      "flow.docs": "Praktische Projekte. Klare Dokumentation.",
      "flow.repository": "Repository-Überblick",
      "flow.repos": "Projekt-Repositories",
      "flow.tracks": "Lernbereiche",
      "flow.example": "BEISPIELABLAUF",
      "flow.evidence": "Umfang, Prüfungen und Grenzen stehen in den Fallstudien.",
      "flow.about": "Über mich",
      "flow.aboutTitle": "Das System verstehen.\nDann zum Laufen bringen.",
      "flow.aboutBody": "Meine Arbeit verbindet IT-Betrieb mit Cloud-Infrastruktur und Automatisierung. Ich möchte das Problem verstehen, eine klare Lösung entwickeln und prüfen, was tatsächlich funktioniert.",
      "flow.background": "HINTERGRUND",
      "flow.projectsTitle": "Entwickelt, um zu lernen.\nDokumentiert, um zu teilen.",
      "flow.projectsBody": "Code, Entscheidungen und Prüfungen hinter jedem Projekt. Jede Fallstudie beschreibt den Umfang und die Grenzen.",
      "flow.learnTitle": "Lesen. Üben.\nSelbst entwickeln.",
      "flow.learnBody": "Technik und Sprachen mit verständlichen Erklärungen und Übungen. Wähle einen Bereich und beginne mit den Grundlagen.",
      "flow.python": "Vom ersten Programm zu Python-Grundlagen, KI-Konzepten und praktischen Projekten.",
      "flow.c": "Variablen, Funktionen, Zeiger und die C-Grundlagen für Betriebssysteme.",
      "flow.os": "Prozesse, Scheduling, Speicher und die Systeme hinter deinen Programmen.",
      "flow.german": "Wörter, Grammatik und Übungen, um Schritt für Schritt Deutsch zu lernen.",
      "flow.educationTitle": "Eine technische Grundlage.",
      "flow.start": "Mit dem Lernen beginnen →",
      "flow.openCourse": "Kurs öffnen →",
      "flow.openDesk": "Lernbereich öffnen →",
      "flow.backTop": "Nach oben ↑",
      "nav.learn": "Lernen mit Mynul",
      "nav.queue": "Projekte",
      "nav.stack": "Skills",
      "nav.closed": "Erfahrung",
      "nav.runbooks": "Ausbildung",
      "nav.escalate": "Kontakt",
      "learn.kicker": "Deutsch und Technik",
      "learn.title": "Lernen mit Mynul",
      "learn.sub": "Python und KI, C, Betriebssysteme und Deutsch A1 bis B1.",
      "hero.title": "Mynul Islam. Hamburg. Offen für Vollzeit und Umzug innerhalb Deutschlands für DevOps, Cloud, IT-Betrieb und Systemadministration.",
      "hero.place": "In Hamburg.",
      "hero.lede": "Am Schreibtisch mache ich IT-Betrieb. Ein Ticket kommt, ich stelle die Störung nach, schreibe eine klare Notiz für die nächste Person und schließe erst nach dem Retest. Der Alltag ist Windows, Zugriffsrechte und First-Level-Support.",
      "hero.lede2": "Auf GitHub ist dieselbe Arbeitsweise DevOps und Cloud: Azure-Netze und Storage in Terraform, Dienste in Docker, Kubernetes-Probes und GitHub Actions, die formatieren, testen und validieren, bevor etwas als fertig gilt.",
      "hero.open": "Offen für:",
      "hero.opennote": "Vollzeit und Umzug innerhalb Deutschlands",
      "hero.roles": "Jobrollen:",
      "role.devops": "DevOps",
      "role.cloud": "Cloud",
      "role.ops": "IT-Betrieb",
      "role.sys": "Systemadministration",
      "hero.cta": "Lernen mit Mynul",
      "hero.projects": "Projekte",
      "duty.loc": "Ort",
      "duty.lang": "Sprachen",
      "duty.en": "Englisch",
      "duty.de": "Deutsch",
      "duty.bn": "Bengalisch",
      "duty.native": "Muttersprache",
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
    var revealSel = ".hero-grid > *, .hero-side > *, .ticket, .skill-groups > .panel, .job-card, .edu-card, .contact-card, section .section-kicker, section h2";
    document.querySelectorAll(revealSel).forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < (window.innerHeight || 800)) el.classList.add("is-in");
      });
    }, 80);
  }

})();
