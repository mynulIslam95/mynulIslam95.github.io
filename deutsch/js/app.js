(function () {
  var DATA = null;
  var root = document.getElementById("app");
  var wordState = { n: 1, step: "copy", copies: 0, sents: 0 };
  var DONE_KEY = "de-desk-done-words";

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
      return n ? { id: c.id, label: c.label, total: n, live: n } : null;
    }).filter(Boolean);
  }

  function storiesAt(level) {
    return (DATA.stories.index || []).filter(function (s) { return up(s.level) === up(level); });
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

  function splitPairs(de, en) {
    function parts(t) {
      t = String(t || "").replace(/\n+/g, " ").trim();
      try {
        return t.split(/(?<=[.!?])\s+/).filter(Boolean);
      } catch (err) {
        return t.split(/[.!?]+\s+/).filter(Boolean);
      }
    }
    var d = parts(de);
    var e = parts(en);
    var n = Math.max(d.length, e.length);
    var rows = [];
    var i;
    for (i = 0; i < n; i += 1) {
      rows.push({ de: d[i] || "", en: e[i] || "" });
    }
    return rows;
  }

  function topBar(crumb) {
    return (
      '<div class="top"><a class="brand" href="#/">German desk</a>' +
      '<a class="home" href="../index.html">Portfolio</a></div>' +
      (crumb ? '<a class="back" href="' + crumb.href + '">' + crumb.label + "</a>" : "")
    );
  }

  function home() {
    var levels = ["A1", "A2", "B1"];
    var html = topBar() +
      "<h1>German desk</h1>" +
      '<p class="lede">Pick a level. Each level has the same two rooms: Words and Stories.</p>' +
      '<div class="grid3">';
    levels.forEach(function (lv) {
      var wn = wordsAt(lv).length;
      var sn = storiesAt(lv).length;
      html += card(levelPath(lv), "Level " + lv, wn + " words · " + sn + " stories", "Words by category, then stories for this level.");
    });
    html += "</div>";
    html += '<p class="lede"><a href="#/telc">TELC B1 exam training</a> · <a href="#/grammar">Grammar chapters</a></p>';
    root.innerHTML = html;
  }

  function levelHome(level) {
    var wn = wordsAt(level).length;
    var sn = storiesAt(level).length;
    var liveStories = storiesAt(level).filter(function (s) { return s.live; }).length;
    root.innerHTML =
      topBar({ href: "#/", label: "All levels" }) +
      "<h1>Level " + level + "</h1>" +
      '<p class="lede">Same two rooms at every level: words, then stories.</p>' +
      '<div class="grid3 grid-home">' +
      card(levelPath(level) + "/words", "Words", wn + " live", "Grouped by der, die, das, verbs and the rest.") +
      card(levelPath(level) + "/stories", "Stories", liveStories + " / " + sn + " live", "Stories for Level " + level + ".") +
      "</div>";
  }

  function card(href, title, k, p) {
    return (
      '<a class="card" href="' + href + '"><span class="k">' + k + "</span><h2>" + title + "</h2><p>" + p + "</p></a>"
    );
  }

  function storiesIndex(level) {
    var list = level ? storiesAt(level) : DATA.stories.index;
    var html = topBar({ href: level ? levelPath(level) : "#/", label: level ? "Level " + level : "All levels" }) +
      "<h1>" + (level ? "Level " + level + " stories" : "Stories") + "</h1>" +
      '<p class="lede">' + list.length + " stories in this list. Open rooms are live.</p><div class=\"list\">";
    list.forEach(function (it) {
      var href = (level ? levelPath(level) + "/stories/" : "#/stories/") + it.id;
      if (it.live) {
        html += '<a class="item" href="' + href + '"><span class="n">Story ' + it.id + '</span><span class="t">' + it.title_de + "</span></a>";
      } else {
        html += '<div class="item is-lock"><span class="n">Story ' + it.id + '</span><span class="t">' + it.title_de + "</span></div>";
      }
    });
    root.innerHTML = html + "</div>";
  }

  function storyView(id, level) {
    var s = DATA.stories.items.find(function (x) { return x.id === id; });
    var back = level ? levelPath(level) + "/stories" : "#/stories";
    if (!s) {
      root.innerHTML = topBar({ href: back, label: "Stories" }) + "<p>This story is not live yet.</p>";
      return;
    }
    var lines = s.lines && s.lines.length ? s.lines : splitPairs(s.de, s.en);
    var html =
      topBar({ href: back, label: "Stories" }) +
      '<p class="meta">Story ' + s.id + " · Level " + (s.level || level || "") + "</p>" +
      "<h1>" + s.title_de + "</h1>" +
      '<p class="meta">' + s.title_en + "</p>" +
      '<p class="lede">Tap a German line to see its English. Tap again to hide it.</p>' +
      '<div class="story-lines" id="story-lines">';
    lines.forEach(function (ln, i) {
      html +=
        '<div class="sline' + (i === 8 ? " sline-gap" : "") + '">' +
        '<button class="sline-de notranslate" type="button" lang="de" translate="no" data-i="' + i + '" aria-expanded="false">' + md(ln.de) + "</button>" +
        '<p class="sline-en" hidden>' + md(ln.en) +
        ' <button class="text-act sline-hide" type="button" data-i="' + i + '">Hide translation</button></p>' +
        "</div>";
    });
    html +=
      "</div>" +
      '<p class="full-act"><button class="text-act" type="button" id="en-btn">Show Full translation</button></p>' +
      '<div class="en" id="en-box" hidden>' + md(s.en) + "</div>";
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
      this.textContent = on ? "Hide Full translation" : "Show Full translation";
    };
  }

  function catLabel(id) {
    var c = (DATA.words.categories || []).find(function (x) { return x.id === id; });
    return c ? c.label : id;
  }

  function deEn(de, en, n) {
    var html = (n ? '<span class="word-n">' + n + ".</span> " : "") +
      '<span class="de-text notranslate" lang="de" translate="no">' + de + "</span>";
    if (en) html += ' <span class="en-paren">(' + en + ")</span>";
    return html;
  }

  function typeRow(label) {
    return (
      '<div class="type-row">' +
      '<input class="field notranslate" id="ans" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" translate="no" lang="de" aria-label="' + label + '">' +
      '<button class="btn" id="go" type="button">Check</button>' +
      "</div>" +
      '<div class="msg" id="msg"></div>'
    );
  }

  function wordsIndex(level) {
    var cats = catsAt(level);
    var html = topBar({ href: levelPath(level), label: "Level " + level }) +
      "<h1>Level " + level + " words</h1>" +
      '<p class="lede">Pick a category. ' + wordsAt(level).length + " words in this level.</p><div class=\"bars\">";
    cats.forEach(function (c) {
      html += '<a class="bar cat" href="' + levelPath(level) + "/words/" + c.id + '"><span class="t notranslate" lang="de" translate="no">' + c.label + '</span><span class="e">' + c.live + "</span></a>";
    });
    root.innerHTML = html + "</div>";
  }

  function wordsCategory(level, cat) {
    var live = wordsAt(level).filter(function (w) { return w.category === cat; });
    var meta = (DATA.words.categories || []).find(function (c) { return c.id === cat; });
    var doneN = live.filter(function (w) { return isDone(w.id); }).length;
    var html = topBar({ href: levelPath(level) + "/words", label: "Level " + level + " words" }) +
      "<h1>" + (meta ? meta.label : cat) + "</h1>" +
      '<p class="lede">' + live.length + " words" +
      (live.length ? ". " + doneN + " done." : "") +
      " Caps and full stops do not matter.</p><div class=\"bars\">";
    if (!live.length) {
      html += '<div class="bar is-lock"><span class="t">No words in this group yet</span></div>';
    } else {
      live.forEach(function (w) {
        html += '<a class="bar' + (isDone(w.id) ? " is-done" : "") + '" href="' + levelPath(level) + "/words/" + w.id + '"><span class="n">' + w.id + '</span><span class="t notranslate" lang="de" translate="no">' + w.german + '</span><span class="e">' + w.english + (isDone(w.id) ? '<span class="tick" aria-label="Done">✓</span>' : "") + "</span></a>";
      });
    }
    root.innerHTML = html + "</div>";
  }

  function wordsView(id, level) {
    var w = DATA.words.items.find(function (x) { return x.id === id; });
    var back = level ? levelPath(level) + "/words" : "#/";
    if (!w) {
      root.innerHTML = topBar({ href: back, label: "Words" }) + "<p>This word is not live yet.</p>";
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
      '<div class="drill-stack">';
    if (wordState.step === "copy") {
      html +=
        '<p class="word-big">' + deEn(w.german, w.english, w.id) + "</p>" +
        '<p class="progress">Copy ' + (wordState.copies + 1) + " of 10</p>" +
        typeRow("Type the word");
    } else if (wordState.step === "sent") {
      html +=
        '<p class="prompt">' + deEn(w.sentence, w.sentence_en, w.id) + "</p>" +
        '<p class="progress">Sentence ' + (wordState.sents + 1) + " of 3</p>" +
        typeRow("Type the sentence");
    } else {
      html +=
        '<p class="msg ok">Success. The word and the sentence are done.</p>' +
        '<p class="prompt">' + deEn(w.sentence, w.sentence_en, w.id) + "</p>" +
        '<div class="row">' +
        (next ? '<a class="btn" href="' + levelPath(level) + "/words/" + next + '">Next word</a>' : '<a class="btn" href="' + catHref + '">Back to group</a>') +
        "</div>";
    }
    html += "</div>";
    root.innerHTML = html;
    var ans = document.getElementById("ans");
    var goBtn = document.getElementById("go");
    if (!goBtn) return;
    function check() {
      var msg = document.getElementById("msg");
      var want = wordState.step === "copy" ? w.german : w.sentence;
      if (norm(ans.value) !== norm(want)) {
        msg.className = "msg bad";
        msg.textContent = "Not yet. Type what you see.";
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


  function grammarIndex() {
    var html = topBar({ href: "#/", label: "All sections" }) + "<h1>Grammar</h1><p class=\"lede\">80 chapters. Only chapter 1 is live.</p><div class=\"list\">";
    (DATA.grammar.index || []).forEach(function (it) {
      if (it.live) {
        html += '<a class="item" href="#/grammar/' + it.id + '"><span class="n">Chapter ' + it.id + '</span><span class="t">' + it.title_de + "</span></a>";
      } else {
        html += '<div class="item is-lock"><span class="n">Chapter ' + it.id + '</span><span class="t">' + it.title_de + "</span></div>";
      }
    });
    root.innerHTML = html + "</div>";
  }

  function grammarView(id) {
    var ch = (DATA.grammar.items || []).find(function (x) { return x.id === id; });
    if (!ch) {
      root.innerHTML = topBar({ href: "#/grammar", label: "Grammar" }) + "<p>This chapter is not live yet.</p>";
      return;
    }
    var html =
      topBar({ href: "#/grammar", label: "Grammar" }) +
      '<p class="meta">Chapter ' + ch.id + " / 80</p>" +
      "<h1>" + ch.title_de + "</h1>" +
      '<p class="lede">' + ch.lead + "</p>";
    (ch.tables || []).forEach(function (tb) {
      html += "<table><thead><tr>" + tb.headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>";
      tb.rows.forEach(function (r) {
        html += "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      });
      html += "</tbody></table>";
    });
    html += '<p class="formula">' + (ch.formula || "") + "</p><h2>Examples</h2>";
    (ch.examples || []).forEach(function (ex) {
      html += '<div class="ex"><div class="de">' + ex.de + '</div><div class="en">' + ex.en + "</div></div>";
    });
    html += '<p class="note">' + (ch.note || "") + "</p>";
    root.innerHTML = html;
  }

  function render() {
    if (!DATA) return;
    var r = hash();
    if (r.kind === "grammar" && r.id) return grammarView(r.id);
    if (r.kind === "grammar") return grammarIndex();
    if (r.kind === "telc" || (r.parts[0] === "telc")) {
      if (window.Telc) return window.Telc.render(r.parts);
      return;
    }
    if (r.kind === "level") return levelHome(r.level);
    if (r.kind === "stories" && r.id) return storyView(r.id, r.level);
    if (r.kind === "stories") return storiesIndex(r.level);
    if (r.kind === "words" && r.id) return wordsView(r.id, r.level);
    if (r.kind === "words" && r.raw) return wordsCategory(r.level || "A1", r.raw);
    if (r.kind === "words") return wordsIndex(r.level || "A1");
    home();
  }

  fetch("data/live.json?v=16")
    .then(function (res) { return res.json(); })
    .then(function (d) {
      DATA = d;
      render();
    });
  window.addEventListener("hashchange", render);
})();
