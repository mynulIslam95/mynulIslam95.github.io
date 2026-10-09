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
    var raw = p[1] || null;
    var num = raw && /^\d+$/.test(raw) ? parseInt(raw, 10) : null;
    return { kind: p[0] || "home", raw: raw, id: num, parts: p };
  }

  function go(to) {
    location.hash = to;
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
    var s = DATA.stories;
    var g = DATA.grammar;
    var w = DATA.words;
    root.innerHTML =
      topBar() +
      "<h1>German desk</h1>" +
      '<p class="lede">One task at a time. Story 1 and chapter 1 are open. All ' + w.total + " glossary words are live.</p>" +
      '<div class="grid3 grid-home">' +
      card("#/stories", "Stories", "1 / " + s.total + " live", "180 rooms. Room 1 is open.") +
      card("#/grammar", "Grammar", "1 / " + g.total + " live", "80 chapters from the book. Chapter 1 is open.") +
      card("#/words", "Words", w.total + " / " + w.total + " live", "Type the word, then the sentence.") +
      card("#/telc", "Master TELC B1", "Exam training", "Lesen, Sprachbausteine, Hören, Schreiben and Sprechen.") +
      "</div>";
  }

  function card(href, title, k, p) {
    return (
      '<a class="card" href="' + href + '"><span class="k">' + k + "</span><h2>" + title + "</h2><p>" + p + "</p></a>"
    );
  }

  function storiesIndex() {
    var html = topBar({ href: "#/", label: "All sections" }) + "<h1>Stories</h1><p class=\"lede\">180 rooms. Only story 1 is live.</p><div class=\"list\">";
    DATA.stories.index.forEach(function (it) {
      if (it.live) {
        html += '<a class="item" href="#/stories/' + it.id + '"><span class="n">Story ' + it.id + '</span><span class="t">' + it.title_de + "</span></a>";
      } else {
        html += '<div class="item is-lock"><span class="n">Story ' + it.id + '</span><span class="t">' + it.title_de + "</span></div>";
      }
    });
    root.innerHTML = html + "</div>";
  }

  function storyView(id) {
    var s = DATA.stories.items.find(function (x) { return x.id === id; });
    if (!s) {
      root.innerHTML = topBar({ href: "#/stories", label: "Stories" }) + "<p>This story is not live yet.</p>";
      return;
    }
    var lines = s.lines && s.lines.length ? s.lines : splitPairs(s.de, s.en);
    var html =
      topBar({ href: "#/stories", label: "Stories" }) +
      '<p class="meta">Story ' + s.id + " / 180</p>" +
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

  function grammarIndex() {
    var html = topBar({ href: "#/", label: "All sections" }) + "<h1>Grammar</h1><p class=\"lede\">80 chapters. Only chapter 1 is live.</p><div class=\"list\">";
    DATA.grammar.index.forEach(function (it) {
      if (it.live) {
        html += '<a class="item" href="#/grammar/' + it.id + '"><span class="n">Chapter ' + it.id + '</span><span class="t">' + it.title_de + "</span></a>";
      } else {
        html += '<div class="item is-lock"><span class="n">Chapter ' + it.id + '</span><span class="t">' + it.title_de + "</span></div>";
      }
    });
    root.innerHTML = html + "</div>";
  }

  function grammarView(id) {
    var ch = DATA.grammar.items.find(function (x) { return x.id === id; });
    if (!ch) {
      root.innerHTML = topBar({ href: "#/grammar", label: "Grammar" }) + "<p>This chapter is not live yet.</p>";
      return;
    }
    var html =
      topBar({ href: "#/grammar", label: "Grammar" }) +
      '<p class="meta">Chapter ' + ch.id + " / 80</p>" +
      "<h1>" + ch.title_de + "</h1>" +
      '<p class="lede">' + ch.lead + "</p>";
    ch.tables.forEach(function (t) {
      html += "<table><thead><tr>" + t.headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>";
      t.rows.forEach(function (r) {
        html += "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      });
      html += "</tbody></table>";
    });
    html += '<p class="formula">' + ch.formula + "</p><h2>Examples</h2>";
    ch.examples.forEach(function (ex) {
      html += '<div class="ex"><div class="de">' + ex.de + '</div><div class="en">' + ex.en + "</div></div>";
    });
    html += '<p class="note">' + ch.note + "</p><h2>Practice</h2><p class=\"lede\">Fill the blank. After two wrong tries, the answer is shown.</p>";
    ch.drills.forEach(function (d, i) {
      html +=
        '<div class="drill" data-i="' + i + '">' +
        '<div class="progress">Question ' + (i + 1) + " / " + ch.drills.length + "</div>" +
        '<div class="prompt notranslate" lang="de" translate="no">' + d.prompt + "</div>" +
        '<div class="type-row">' +
        '<input class="field notranslate" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" translate="no" lang="de" aria-label="Answer">' +
        '<button class="btn" type="button">Check</button>' +
        "</div>" +
        '<div class="msg"></div></div>';
    });
    root.innerHTML = html;
    Array.prototype.forEach.call(root.querySelectorAll(".drill"), function (box, i) {
      var tries = 0;
      var d = ch.drills[i];
      var input = box.querySelector("input");
      var msg = box.querySelector(".msg");
      var btn = box.querySelector("button");
      function reveal(ok) {
        msg.className = "msg " + (ok ? "ok" : "bad");
        msg.textContent = ok ? "Correct. " + d.en : "Answer: " + d.answer + " — " + d.en;
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
        msg.textContent = "Not yet. One more try.";
      };
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") btn.click();
      });
    });
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

  function wordsIndex() {
    var html = topBar({ href: "#/", label: "All sections" }) +
      "<h1>Words</h1><p class=\"lede\">Pick a group. All " + DATA.words.total + " words from the Netzwerk neu glossary are open.</p><div class=\"bars\">";
    (DATA.words.categories || []).forEach(function (c) {
      var count = c.live + " / " + c.total;
      html += '<a class="bar cat" href="#/words/' + c.id + '"><span class="t notranslate" lang="de" translate="no">' + c.label + '</span><span class="e">' + count + "</span></a>";
    });
    root.innerHTML = html + "</div>";
  }

  function wordsCategory(cat) {
    var live = DATA.words.items.filter(function (w) { return w.category === cat; });
    var meta = (DATA.words.categories || []).find(function (c) { return c.id === cat; });
    var doneN = live.filter(function (w) { return isDone(w.id); }).length;
    var html = topBar({ href: "#/words", label: "Word groups" }) +
      "<h1>" + (meta ? meta.label : cat) + "</h1>" +
      '<p class="lede">' + (meta ? meta.live : live.length) + " live of " + (meta ? meta.total : 0) +
      (live.length ? ". " + doneN + " done." : "") +
      " Caps and full stops do not matter.</p><div class=\"bars\">";
    if (!live.length) {
      html += '<div class="bar is-lock"><span class="t">This group is closed for now</span></div>';
    } else {
      live.forEach(function (w) {
        html += '<a class="bar' + (isDone(w.id) ? " is-done" : "") + '" href="#/words/' + w.id + '"><span class="n">' + w.id + '</span><span class="t notranslate" lang="de" translate="no">' + w.german + '</span><span class="e">' + w.english + (isDone(w.id) ? '<span class="tick" aria-label="Done">✓</span>' : "") + "</span></a>";
      });
    }
    root.innerHTML = html + "</div>";
  }

  function wordsView(id) {
    var w = DATA.words.items.find(function (x) { return x.id === id; });
    if (!w) {
      root.innerHTML = topBar({ href: "#/words", label: "Word groups" }) + "<p>This word is not live yet.</p>";
      return;
    }
    if (wordState.n !== id) wordState = { n: id, step: "copy", copies: 0, sents: 0 };
    renderWord(w);
  }

  function renderWord(w) {
    var same = DATA.words.items.filter(function (x) { return x.category === w.category; });
    var idx = -1;
    same.forEach(function (x, i) { if (x.id === w.id) idx = i; });
    var next = idx >= 0 && idx < same.length - 1 ? same[idx + 1].id : null;
    var html = topBar({ href: "#/words/" + (w.category || "der"), label: w.category || "der" }) +
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
        (next ? '<a class="btn" href="#/words/' + next + '">Next word</a>' : '<a class="btn" href="#/words/' + (w.category || "der") + '">Back to group</a>') +
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
      renderWord(w);
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
    if (r.kind === "stories" && r.id) return storyView(r.id);
    if (r.kind === "stories") return storiesIndex();
    if (r.kind === "grammar" && r.id) return grammarView(r.id);
    if (r.kind === "grammar") return grammarIndex();
    if (r.kind === "telc") {
      if (window.Telc) return window.Telc.render(r.parts);
      return;
    }
    if (r.kind === "words" && r.id) return wordsView(r.id);
    if (r.kind === "words" && r.raw) return wordsCategory(r.raw);
    if (r.kind === "words") return wordsIndex();
    home();
  }

  fetch("data/live.json?v=7")
    .then(function (res) { return res.json(); })
    .then(function (d) {
      DATA = d;
      render();
    });
  window.addEventListener("hashchange", render);
})();
