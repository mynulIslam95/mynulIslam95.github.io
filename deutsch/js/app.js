(function () {
  var DATA = null;
  var root = document.getElementById("app");
  var wordState = { n: 1, step: "copy", copies: 0, sents: 0 };
  var DONE_KEY = "de-desk-done-words";

  function t(key, vars) {
    return I18n.t(key, vars);
  }

  function help(en, bn) {
    return I18n.help(en, bn);
  }

  function cell(c) {
    return I18n.cell(c);
  }

  function loadDone() {
    try {
      var arr = JSON.parse(localStorage.getItem(DONE_KEY) || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (err) {
      return [];
    }
  }

  function isDone(id) {
    return loadDone().indexOf(id) !== -1;
  }

  function markDone(id) {
    var ids = loadDone();
    if (ids.indexOf(id) !== -1) return;
    ids.push(id);
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(ids));
    } catch (err) {}
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/ß/g, "ss")
      .replace(/[.,!?;:…„“”"'«»]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hash() {
    var h = (location.hash || "#/").replace(/^#/, "");
    var p = h.replace(/^\/+/, "").split("/").filter(Boolean);
    var level = null;
    var rest = p;
    if (p[0] && /^(a1|a2|b1)$/i.test(p[0])) {
      level = p[0].toUpperCase();
      rest = p.slice(1);
    }
    var raw = rest[1] || null;
    var num = raw && /^\d+$/.test(raw) ? parseInt(raw, 10) : null;
    return {
      level: level,
      kind: rest[0] || (level ? "level" : "home"),
      raw: raw,
      id: num,
      parts: p
    };
  }

  function up(s) {
    return String(s || "A1").toUpperCase();
  }

  function wordsAt(level) {
    return DATA.words.items.filter(function (w) { return up(w.level) === up(level); });
  }

  function catsAt(level) {
    var items = wordsAt(level);
    return (DATA.words.categories || []).map(function (c) {
      var n = items.filter(function (w) { return w.category === c.id; }).length;
      return n ? { id: c.id, label: c.label, label_bn: c.label_bn, total: n, live: n } : null;
    }).filter(Boolean);
  }

  function byNum(a, b) {
    return (a.n || a.id) - (b.n || b.id);
  }

  function storiesAt(level) {
    return (DATA.stories.index || []).filter(function (s) { return up(s.level) === up(level); }).sort(byNum);
  }

  function storyCatsAt(level) {
    var items = storiesAt(level);
    return (DATA.stories.categories || []).map(function (c) {
      var n = items.filter(function (s) { return s.category === c.id; }).length;
      return n ? { id: c.id, label: c.label, label_bn: c.label_bn, total: n, live: n } : null;
    }).filter(Boolean);
  }

  function grammarAt(level) {
    return (DATA.grammar.index || []).filter(function (g) { return up(g.level) === up(level); }).sort(byNum);
  }

  function grammarCatsAt(level) {
    var items = grammarAt(level);
    return (DATA.grammar.categories || []).map(function (c) {
      var n = items.filter(function (g) { return g.category === c.id; }).length;
      return n ? { id: c.id, label: c.label, label_bn: c.label_bn, total: n, live: n } : null;
    }).filter(Boolean);
  }

  function levelPath(level) {
    return "#/" + String(level).toLowerCase();
  }

  function md(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function splitPairs(de, en, bn) {
    function parts(txt) {
      txt = String(txt || "").replace(/\n+/g, " ").trim();
      try {
        return txt.split(/(?<=[.!?])\s+/).filter(Boolean);
      } catch (err) {
        return txt.split(/[.!?]+\s+/).filter(Boolean);
      }
    }
    var d = parts(de);
    var e = parts(en);
    var b = parts(bn);
    var n = Math.max(d.length, e.length, b.length);
    var rows = [];
    var i;
    for (i = 0; i < n; i += 1) {
      rows.push({ de: d[i] || "", en: e[i] || "", bn: b[i] || "" });
    }
    return rows;
  }

  function catName(c, fallback) {
    if (!c) return fallback || "";
    return help(c.label, c.label_bn) || fallback || "";
  }

  function wordGloss(w) {
    return help(w.english, w.bn);
  }

  function langSwitch() {
    var html = '<div class="lang-switch" role="group" aria-label="' + t("explain") + '">';
    html += '<span class="lang-label">' + t("explain") + "</span>";
    I18n.langs.forEach(function (L) {
      html +=
        '<button type="button"' +
        (I18n.get() === L.id ? ' class="is-on"' : "") +
        ' data-lang-set="' + L.id + '">' + L.label + "</button>";
    });
    return html + "</div>";
  }

  function bindLang() {
    root.querySelectorAll("[data-lang-set]").forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        I18n.set(btn.getAttribute("data-lang-set"));
      };
    });
  }

  function topBar(crumb) {
    var extra = window.DESK_PORTFOLIO
      ? '<a class="home" href="' + window.DESK_PORTFOLIO + '">' + t("portfolio") + "</a>"
      : "";
    return (
      '<div class="top"><a class="brand" href="#/">' + t("brand") + "</a>" + extra + langSwitch() + "</div>" +
      (crumb ? '<a class="back" href="' + crumb.href + '">' + crumb.label + "</a>" : "")
    );
  }

  function home() {
    var levels = ["A1", "A2", "B1"];
    var html = topBar() +
      "<h1>" + t("brand") + "</h1>" +
      '<p class="lede">' + t("homeLede") + "</p>" +
      '<div class="grid3">';
    levels.forEach(function (lv) {
      var wn = wordsAt(lv).length;
      var sn = storiesAt(lv).length;
      var gn = grammarAt(lv).length;
      html += card(
        levelPath(lv),
        t("level", { lv: lv }),
        t("wordsN", { n: wn }) + " · " + t("storiesN", { n: sn }) + " · " + t("grammarN", { n: gn }),
        t("homeCard")
      );
    });
    html += "</div>";
    if (window.Telc) {
      html += '<p class="lede"><a href="#/telc">' + t("telc") + "</a></p>";
    }
    root.innerHTML = html;
  }

  function levelHome(level) {
    var wn = wordsAt(level).length;
    var sn = storiesAt(level).length;
    var liveStories = storiesAt(level).filter(function (s) { return s.live; }).length;
    var gn = grammarAt(level).length;
    root.innerHTML =
      topBar({ href: "#/", label: t("allLevels") }) +
      "<h1>" + t("level", { lv: level }) + "</h1>" +
      '<p class="lede">' + t("levelLede") + "</p>" +
      '<div class="grid3">' +
      card(levelPath(level) + "/words", t("words"), t("wordsLive", { n: wn }), t("wordsCard")) +
      card(levelPath(level) + "/stories", t("stories"), t("storiesNumbered", { n: liveStories }), t("storiesCard", { lv: level })) +
      card(levelPath(level) + "/grammar", t("grammar"), t("chaptersN", { n: gn }), t("grammarCard", { lv: level })) +
      "</div>";
  }

  function card(href, title, k, p) {
    return (
      '<a class="card" href="' + href + '"><span class="k">' + k + "</span><h2>" + title + "</h2><p>" + p + "</p></a>"
    );
  }

  function storyRow(level, it) {
    var href = levelPath(level) + "/stories/" + it.id;
    var n = it.n || it.id;
    var gloss = help(it.title_en, it.title_bn);
    if (it.live) {
      return '<a class="bar" href="' + href + '"><span class="n">' + n + '</span><span class="t">' + it.title_de + '</span><span class="e">' + gloss + "</span></a>";
    }
    return '<div class="bar is-lock"><span class="n">' + n + '</span><span class="t">' + it.title_de + "</span></div>";
  }

  function storiesIndex(level) {
    var list = storiesAt(level);
    var cats = storyCatsAt(level);
    var html = topBar({ href: levelPath(level), label: t("level", { lv: level }) }) +
      "<h1>" + t("storiesTitle", { lv: level }) + "</h1>" +
      '<p class="lede">' + t("storiesLede", { n: list.length }) + '</p><div class="bars">';
    cats.forEach(function (c) {
      html += '<a class="bar cat" href="' + levelPath(level) + "/stories/" + c.id + '"><span class="t">' + catName(c) + '</span><span class="e">' + c.live + "</span></a>";
    });
    html += '</div><div class="bars" style="margin-top:12px">';
    list.forEach(function (it) {
      html += storyRow(level, it);
    });
    root.innerHTML = html + "</div>";
  }

  function storiesCategory(level, cat) {
    var list = storiesAt(level).filter(function (s) { return s.category === cat; });
    var meta = (DATA.stories.categories || []).find(function (c) { return c.id === cat; });
    var html = topBar({ href: levelPath(level) + "/stories", label: t("storiesTitle", { lv: level }) }) +
      "<h1>" + catName(meta, cat) + "</h1>" +
      '<p class="lede">' + t("storiesGroupLede", { n: list.length }) + '</p><div class="bars">';
    list.forEach(function (it) {
      html += storyRow(level, it);
    });
    root.innerHTML = html + "</div>";
  }

  function storyView(id, level) {
    var s = DATA.stories.items.find(function (x) { return x.id === id; });
    var back = level ? levelPath(level) + "/stories" : "#/stories";
    if (!s) {
      root.innerHTML = topBar({ href: back, label: t("stories") }) + "<p>" + t("notLiveStory") + "</p>";
      return;
    }
    var lines = s.lines && s.lines.length ? s.lines : splitPairs(s.de, s.en, s.bn);
    var html =
      topBar({ href: back, label: t("stories") }) +
      '<p class="meta">' + t("storyMeta", { n: s.n || s.id, total: storiesAt(s.level || level).length, lv: s.level || level || "" }) + (s.theme ? " · " + s.theme : "") + "</p>" +
      "<h1>" + s.title_de + "</h1>" +
      '<p class="meta">' + help(s.title_en, s.title_bn) + "</p>" +
      '<p class="lede">' + t("storyHelp") + "</p>" +
      '<div class="story-lines" id="story-lines">';
    lines.forEach(function (ln, i) {
      html +=
        '<div class="sline' + (i === 8 ? " sline-gap" : "") + '">' +
        '<button class="sline-de notranslate" type="button" lang="de" translate="no" data-i="' + i + '" aria-expanded="false">' + md(ln.de) + "</button>" +
        '<p class="sline-en" hidden>' + md(help(ln.en, ln.bn)) +
        ' <button class="text-act sline-hide" type="button" data-i="' + i + '">' + t("hideLine") + "</button></p>" +
        "</div>";
    });
    html +=
      "</div>" +
      '<p class="full-act"><button class="text-act" type="button" id="en-btn">' + t("showFull") + "</button></p>" +
      '<div class="en" id="en-box" hidden>' + md(help(s.en, s.bn)) + "</div>";
    root.innerHTML = html;

    function setLine(i, on) {
      var btn = root.querySelector('.sline-de[data-i="' + i + '"]');
      var en = btn && btn.parentNode.querySelector(".sline-en");
      if (!btn || !en) return;
      en.hidden = !on;
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
    }

    root.querySelectorAll(".sline-de").forEach(function (btn) {
      btn.onclick = function () {
        setLine(this.getAttribute("data-i"), this.getAttribute("aria-expanded") !== "true");
      };
    });
    root.querySelectorAll(".sline-hide").forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        setLine(this.getAttribute("data-i"), false);
      };
    });
    document.getElementById("en-btn").onclick = function () {
      var box = document.getElementById("en-box");
      var on = box.hidden;
      box.hidden = !on;
      this.textContent = on ? t("hideFull") : t("showFull");
    };
  }

  function grammarRow(level, it) {
    var href = levelPath(level) + "/grammar/" + it.id;
    var n = it.n || it.id;
    return '<a class="bar" href="' + href + '"><span class="n">' + n + '</span><span class="t">' + it.title_de + '</span><span class="e">' + help(it.title_en, it.title_bn) + "</span></a>";
  }

  function grammarIndex(level) {
    var list = grammarAt(level);
    var cats = grammarCatsAt(level);
    var html = topBar({ href: levelPath(level), label: t("level", { lv: level }) }) +
      "<h1>" + t("grammarTitle", { lv: level }) + "</h1>" +
      '<p class="lede">' + t("grammarLede", { n: list.length }) + '</p><div class="bars">';
    cats.forEach(function (c) {
      html += '<a class="bar cat" href="' + levelPath(level) + "/grammar/" + c.id + '"><span class="t">' + catName(c) + '</span><span class="e">' + c.live + "</span></a>";
    });
    html += '</div><div class="bars" style="margin-top:12px">';
    list.forEach(function (it) {
      html += grammarRow(level, it);
    });
    root.innerHTML = html + "</div>";
  }

  function grammarCategory(level, cat) {
    var list = grammarAt(level).filter(function (g) { return g.category === cat; });
    var meta = (DATA.grammar.categories || []).find(function (c) { return c.id === cat; });
    var html = topBar({ href: levelPath(level) + "/grammar", label: t("grammarTitle", { lv: level }) }) +
      "<h1>" + catName(meta, cat) + "</h1>" +
      '<p class="lede">' + t("grammarGroupLede", { n: list.length }) + '</p><div class="bars">';
    list.forEach(function (it) {
      html += grammarRow(level, it);
    });
    root.innerHTML = html + "</div>";
  }

  function grammarView(id, level) {
    var ch = (DATA.grammar.items || []).find(function (x) { return x.id === id; });
    var back = level ? levelPath(level) + "/grammar" : "#/";
    if (!ch) {
      root.innerHTML = topBar({ href: back, label: t("grammar") }) + "<p>" + t("notLiveGrammar") + "</p>";
      return;
    }
    if (!level) level = up(ch.level);
    var html =
      topBar({ href: back, label: t("grammar") }) +
      '<p class="meta">' + t("chapterMeta", { n: ch.n || ch.id, total: grammarAt(ch.level || level).length, lv: ch.level || level }) + "</p>" +
      "<h1>" + ch.title_de + "</h1>" +
      '<p class="meta">' + help(ch.title_en, ch.title_bn) + "</p>" +
      (help(ch.lead, ch.lead_bn) ? '<p class="lede">' + help(ch.lead, ch.lead_bn) + "</p>" : "");
    (ch.tables || []).forEach(function (tbl) {
      html += '<table class="gtable"><thead><tr>' + (tbl.headers || []).map(function (h) { return "<th>" + md(cell(h)) + "</th>"; }).join("") + "</tr></thead><tbody>";
      (tbl.rows || []).forEach(function (r) {
        html += "<tr>" + r.map(function (c) { return "<td>" + md(cell(c)) + "</td>"; }).join("") + "</tr>";
      });
      html += "</tbody></table>";
    });
    var formula = help(ch.formula, ch.formula_bn);
    if (formula) html += '<p class="formula">' + md(formula) + "</p>";
    if (ch.examples && ch.examples.length) {
      html += "<h2>" + t("examples") + "</h2>";
      ch.examples.forEach(function (ex) {
        html += '<div class="ex"><div class="de notranslate" lang="de" translate="no">' + md(ex.de) + '</div><div class="en">' + md(help(ex.en, ex.bn)) + "</div></div>";
      });
    }
    var note = help(ch.note, ch.note_bn);
    if (note) html += '<p class="note">' + md(note) + "</p>";
    if (ch.drills && ch.drills.length) {
      html += "<h2>" + t("practice") + "</h2><p class=\"lede\">" + t("practiceLede") + "</p>";
      ch.drills.forEach(function (d, i) {
        html +=
          '<div class="drill" data-i="' + i + '">' +
          '<div class="progress">' + t("questionN", { a: i + 1, b: ch.drills.length }) + "</div>" +
          '<div class="prompt notranslate" lang="de" translate="no">' + d.prompt + "</div>" +
          '<div class="type-row">' +
          '<input class="field notranslate" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" translate="no" lang="de" aria-label="' + t("check") + '">' +
          '<button class="btn" type="button">' + t("check") + "</button>" +
          "</div>" +
          '<div class="msg"></div></div>';
      });
    }
    root.innerHTML = html;
    Array.prototype.forEach.call(root.querySelectorAll(".drill"), function (box, i) {
      var tries = 0;
      var d = ch.drills[i];
      var input = box.querySelector("input");
      var msg = box.querySelector(".msg");
      var btn = box.querySelector("button");
      function reveal(ok) {
        var gloss = help(d.en, d.bn);
        msg.className = "msg " + (ok ? "ok" : "bad");
        msg.textContent = ok ? t("correct", { en: gloss }) : t("answerIs", { a: d.answer, en: gloss });
        input.disabled = true;
        btn.disabled = true;
      }
      btn.onclick = function () {
        if (norm(input.value) === norm(d.answer)) {
          reveal(true);
          return;
        }
        tries += 1;
        if (tries >= 2) {
          reveal(false);
          return;
        }
        msg.className = "msg bad";
        msg.textContent = t("notYetTry");
      };
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") btn.click();
      });
    });
  }

  function catLabel(id) {
    var c = (DATA.words.categories || []).find(function (x) { return x.id === id; });
    return catName(c, id);
  }

  function deEn(de, gloss, n) {
    var html = (n ? '<span class="word-n">' + n + ".</span> " : "") +
      '<span class="de-text notranslate" lang="de" translate="no">' + de + "</span>";
    if (gloss) html += ' <span class="en-paren">(' + gloss + ")</span>";
    return html;
  }

  function formTable(w) {
    if (!w.forms || !w.forms.length) return "";
    var html = '<table class="vforms"><caption>' + t("allForms") + "</caption><tbody>";
    w.forms.forEach(function (row) {
      html += '<tr><th>' + row.slot + '</th><td class="notranslate" lang="de" translate="no">' + row.form + "</td></tr>";
    });
    return html + "</tbody></table>";
  }

  function typeRow(label) {
    return (
      '<div class="type-row">' +
      '<input class="field notranslate" id="ans" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" translate="no" lang="de" aria-label="' + label + '">' +
      '<button class="btn" id="go" type="button">' + t("check") + "</button>" +
      "</div>" +
      '<div class="msg" id="msg"></div>'
    );
  }

  function wordsIndex(level) {
    var cats = catsAt(level);
    var html = topBar({ href: levelPath(level), label: t("level", { lv: level }) }) +
      "<h1>" + t("wordsTitle", { lv: level }) + "</h1>" +
      '<p class="lede">' + t("wordsLede", { n: wordsAt(level).length }) + '</p><div class="bars">';
    cats.forEach(function (c) {
      html += '<a class="bar cat" href="' + levelPath(level) + "/words/" + c.id + '"><span class="t">' + catName(c) + '</span><span class="e">' + c.live + "</span></a>";
    });
    root.innerHTML = html + "</div>";
  }

  function wordsCategory(level, cat) {
    var live = wordsAt(level).filter(function (w) { return w.category === cat; });
    var meta = (DATA.words.categories || []).find(function (c) { return c.id === cat; });
    var doneN = live.filter(function (w) { return isDone(w.id); }).length;
    var html = topBar({ href: levelPath(level) + "/words", label: t("wordsTitle", { lv: level }) }) +
      "<h1>" + catName(meta, cat) + "</h1>" +
      '<p class="lede">' + t("wordsCatLede", { n: live.length, done: live.length ? t("wordsDone", { n: doneN }) : " " }) + '</p><div class="bars">';
    if (!live.length) {
      html += '<div class="bar is-lock"><span class="t">' + t("noWords") + "</span></div>";
    } else {
      live.forEach(function (w) {
        html += '<a class="bar' + (isDone(w.id) ? " is-done" : "") + '" href="' + levelPath(level) + "/words/" + w.id + '"><span class="n">' + w.id + '</span><span class="t notranslate" lang="de" translate="no">' + w.german + '</span><span class="e">' + wordGloss(w) + (isDone(w.id) ? '<span class="tick" aria-label="Done">✓</span>' : "") + "</span></a>";
      });
    }
    root.innerHTML = html + "</div>";
  }

  function wordsView(id, level) {
    var w = DATA.words.items.find(function (x) { return x.id === id; });
    var back = level ? levelPath(level) + "/words" : "#/";
    if (!w) {
      root.innerHTML = topBar({ href: back, label: t("words") }) + "<p>" + t("notLiveWord") + "</p>";
      return;
    }
    if (!level) level = up(w.level);
    if (wordState.n !== id) wordState = { n: id, step: "copy", copies: 0, sents: 0 };
    renderWord(w, level);
  }

  function renderWord(w, level) {
    var same = wordsAt(level).filter(function (x) { return x.category === w.category; });
    var idx = -1;
    same.forEach(function (x, i) { if (x.id === w.id) idx = i; });
    var next = idx >= 0 && idx < same.length - 1 ? same[idx + 1].id : null;
    var catHref = levelPath(level) + "/words/" + (w.category || "der");
    var html = topBar({ href: catHref, label: catLabel(w.category || "der") }) +
      formTable(w) +
      '<div class="drill-stack">';
    if (wordState.step === "copy") {
      html +=
        '<p class="word-big">' + deEn(w.german, wordGloss(w), w.id) + "</p>" +
        '<p class="progress">' + t("copyOf", { a: wordState.copies + 1 }) + "</p>" +
        typeRow(t("typeWord"));
    } else if (wordState.step === "sent") {
      html +=
        '<p class="prompt">' + deEn(w.sentence, help(w.sentence_en, w.sentence_bn), w.id) + "</p>" +
        '<p class="progress">' + t("sentOf", { a: wordState.sents + 1 }) + "</p>" +
        typeRow(t("typeSent"));
    } else {
      html +=
        '<p class="msg ok">' + t("success") + "</p>" +
        '<p class="prompt">' + deEn(w.sentence, help(w.sentence_en, w.sentence_bn), w.id) + "</p>" +
        '<div class="row">' +
        (next ? '<a class="btn" href="' + levelPath(level) + "/words/" + next + '">' + t("nextWord") + "</a>" : '<a class="btn" href="' + catHref + '">' + t("backGroup") + "</a>") +
        "</div>";
    }
    html += "</div>";
    root.innerHTML = html;
    bindLang();
    var ans = document.getElementById("ans");
    var goBtn = document.getElementById("go");
    if (!goBtn) return;
    function check() {
      var msg = document.getElementById("msg");
      var want = wordState.step === "copy" ? w.german : w.sentence;
      if (norm(ans.value) !== norm(want)) {
        msg.className = "msg bad";
        msg.textContent = t("notYetSee");
        return;
      }
      if (wordState.step === "copy") {
        wordState.copies += 1;
        if (wordState.copies >= 10) {
          wordState.step = "sent";
          wordState.sents = 0;
        }
      } else {
        wordState.sents += 1;
        if (wordState.sents >= 3) {
          wordState.step = "done";
          markDone(w.id);
        }
      }
      renderWord(w, level);
    }
    goBtn.onclick = check;
    ans.addEventListener("keydown", function (e) {
      if (e.key === "Enter") check();
    });
    ans.addEventListener("focus", function () {
      setTimeout(function () {
        ans.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 250);
    });
    ans.focus();
  }

  function render() {
    if (!DATA) return;
    var r = hash();
    if (r.kind === "telc" || r.parts[0] === "telc") {
      if (window.Telc) {
        window.Telc.render(r.parts);
        return;
      }
    }
    if (r.kind === "level") levelHome(r.level);
    else if (r.kind === "grammar" && r.id) grammarView(r.id, r.level);
    else if (r.kind === "grammar" && r.raw) grammarCategory(r.level || "A1", r.raw);
    else if (r.kind === "grammar") grammarIndex(r.level);
    else if (r.kind === "stories" && r.id) storyView(r.id, r.level);
    else if (r.kind === "stories" && r.raw) storiesCategory(r.level || "A1", r.raw);
    else if (r.kind === "stories") storiesIndex(r.level);
    else if (r.kind === "words" && r.id) wordsView(r.id, r.level);
    else if (r.kind === "words" && r.raw) wordsCategory(r.level || "A1", r.raw);
    else if (r.kind === "words") wordsIndex(r.level || "A1");
    else home();
    bindLang();
  }

  I18n.onChange = render;

  fetch("data/live.json?v=20")
    .then(function (res) { return res.json(); })
    .then(function (d) {
      DATA = d;
      render();
    });
  window.addEventListener("hashchange", render);
})();
