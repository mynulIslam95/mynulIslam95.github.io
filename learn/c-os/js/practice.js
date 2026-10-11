(function () {
  var KEY = "c-os-progress";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (err) {
      return {};
    }
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (err) {}
  }

  function hintList(d) {
    if (d.hints && d.hints.length) return d.hints;
    if (d.hint) return [d.hint];
    return [];
  }

  function normSpace(s) {
    return String(s).replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  }

  function stripComments(s) {
    s = String(s).replace(/\/\*[\s\S]*?\*\//g, " ");
    return s.replace(/\/\/[^\n]*/g, " ");
  }

  function normC(s) {
    return stripComments(s)
      .replace(/\s+/g, " ")
      .replace(/\s*([{}();,=*&])\s*/g, "$1")
      .trim();
  }

  function asTf(s) {
    var u = String(s).trim().toLowerCase();
    if (u === "true" || u === "y") return "yes";
    if (u === "false" || u === "n") return "no";
    return u;
  }

  function matches(drill, user) {
    var kind = drill.kind;
    if (kind === "tf") {
      var t = asTf(user);
      return (drill.accept || []).some(function (a) { return asTf(a) === t; });
    }
    if (kind === "predict" || kind === "fill") {
      var u = normSpace(user).toLowerCase();
      return (drill.accept || []).some(function (a) {
        return normSpace(a).toLowerCase() === u;
      });
    }
    if (kind === "write") {
      var u = normC(user);
      if ((drill.accept || []).some(function (a) { return normC(a) === u; })) return true;
      if (drill.must && drill.must.length) {
        return drill.must.every(function (tok) {
          return u.indexOf(normC(tok)) !== -1;
        });
      }
    }
    return false;
  }

  function githubReady() {
    var chap = window.C_OS_CHAPTER;
    if (!chap || !chap.unlockGroup) return true;
    var p = loadProgress();
    return (chap.drills || []).every(function (d) {
      if (d.group === chap.unlockGroup) return true;
      return !!p[d.id];
    });
  }

  function applyUnlock() {
    var wrap = document.querySelector("[data-unlock]");
    var gate = document.querySelector("[data-unlock-gate]");
    if (!wrap && !gate) return;
    var ok = githubReady();
    if (wrap) wrap.hidden = !ok;
    if (gate) gate.hidden = ok;
  }

  function markSolved(id) {
    var p = loadProgress();
    p[id] = true;
    saveProgress(p);
    paintScore();
    applyUnlock();
  }

  function paintScore() {
    var el = document.querySelector("[data-drill-score]");
    if (!el || !window.C_OS_CHAPTER) return;
    var chap = window.C_OS_CHAPTER;
    var drills = chap.drills || [];
    var p = loadProgress();
    var unlock = chap.unlockGroup;
    var core = drills.filter(function (d) {
      return !unlock || d.group !== unlock;
    });
    var n = 0;
    core.forEach(function (d) { if (p[d.id]) n += 1; });
    var isProj = /^p\d/.test(chap.id || "");
    el.textContent = n + " / " + core.length +
      (isProj ? " project steps submitted right" : " submitted right");
  }

  function inputHtml(d) {
    if (d.kind === "tf") {
      return '<div class="choices">' +
        '<button type="button" data-pick="yes">Yes</button>' +
        '<button type="button" data-pick="no">No</button>' +
        "</div>";
    }
    var rows = d.rows || (d.kind === "write" ? 10 : 0);
    if (d.kind === "write") {
      return '<label class="sr">Your C</label>' +
        '<textarea class="drill-in" rows="' + rows +
        '" spellcheck="false" placeholder="Write C here. Comments are allowed."></textarea>';
    }
    if (d.kind === "fill") {
      return '<label class="sr">Fill</label>' +
        '<input class="drill-in" type="text" spellcheck="false" placeholder="One word, token, command, or short line"/>';
    }
    return '<label class="sr">Output</label>' +
      '<input class="drill-in" type="text" spellcheck="false" placeholder="What prints? Type it exactly."/>';
  }

  function renderDrill(d, idx) {
    var art = document.createElement("article");
    var n = String(idx + 1).padStart(2, "0");
    art.className = "drill" + (loadProgress()[d.id] ? " is-solved" : "");
    art.id = d.id;
    art.setAttribute("data-id", d.id);
    art.setAttribute("data-hint-n", "0");
    var code = d.code ? "<pre><code>" + esc(d.code) + "</code></pre>" : "";
    var more = hintList(d).length > 1 ? " (step by step)" : "";
    art.innerHTML =
      '<p class="drill-id">' + esc(d.id) + " · " + esc(d.kind) +
        (d.title ? " · " + esc(d.title) : "") + "</p>" +
      "<h3>Step " + n + ". " + esc(d.prompt) + "</h3>" +
      (d.note ? '<p class="drill-note">' + esc(d.note) + "</p>" : "") +
      code +
      inputHtml(d) +
      '<div class="drill-actions">' +
        '<button type="button" data-act="hint">Hint' + more + "</button>" +
        '<button type="button" data-act="submit">Submit</button>' +
        '<button type="button" data-act="answer">See answer</button>' +
      "</div>" +
      '<div class="drill-hint" hidden></div>' +
      '<div class="drill-fb" hidden></div>' +
      '<div class="drill-ans" hidden>' +
        '<p class="tag">Full answer with comments</p>' +
        (d.answerCode ? "<pre><code>" + esc(d.answerCode) + "</code></pre>" : "") +
        (d.answerWhy ? "<p>" + esc(d.answerWhy) + "</p>" : "") +
      "</div>";
    bind(art, d);
    return art;
  }

  function showHint(art, d) {
    var list = hintList(d);
    if (!list.length) return;
    var shown = parseInt(art.getAttribute("data-hint-n") || "0", 10);
    if (shown < list.length) shown += 1;
    art.setAttribute("data-hint-n", String(shown));
    var box = art.querySelector(".drill-hint");
    box.hidden = false;
    var html = '<p class="tag">Hint ' + shown + " / " + list.length + "</p>";
    var i;
    for (i = 0; i < shown; i++) {
      html += "<p><strong>" + (i + 1) + ".</strong> " + esc(list[i]) + "</p>";
    }
    box.innerHTML = html;
    var btn = art.querySelector('[data-act="hint"]');
    if (btn) {
      btn.textContent = shown < list.length ? "Next hint" : "Hints (all open)";
    }
  }

  function userValue(art, d) {
    if (d.kind === "tf") {
      var b = art.querySelector("[data-pick].is-pick");
      return b ? b.getAttribute("data-pick") : "";
    }
    var inp = art.querySelector(".drill-in");
    return inp ? inp.value : "";
  }

  function showFb(art, ok, empty, d) {
    var fb = art.querySelector(".drill-fb");
    fb.hidden = false;
    if (empty) {
      fb.className = "drill-fb is-bad";
      fb.innerHTML = '<p class="tag">Empty</p><p>Pick Yes/No or type an answer, then Submit.</p>';
      return;
    }
    fb.className = "drill-fb " + (ok ? "is-ok" : "is-bad");
    if (ok) {
      fb.innerHTML = '<p class="tag">That is right.</p><p>' +
        esc(d.shortWhy || "Your answer matches. Next step.") +
        "</p>";
    } else {
      fb.innerHTML = '<p class="tag">Not yet.</p>' +
        "<p>Use Hint (step by step), try again, or See answer. The answer comments every important line.</p>";
    }
  }

  function bind(art, d) {
    art.addEventListener("click", function (e) {
      var pick = e.target.closest("[data-pick]");
      if (pick) {
        art.querySelectorAll("[data-pick]").forEach(function (b) {
          b.classList.remove("is-pick", "is-wrong");
        });
        pick.classList.add("is-pick");
        return;
      }
      var act = e.target.closest("[data-act]");
      if (!act) return;
      var what = act.getAttribute("data-act");
      if (what === "hint") showHint(art, d);
      if (what === "answer") art.querySelector(".drill-ans").hidden = false;
      if (what === "submit") {
        var val = userValue(art, d);
        if (!String(val).trim()) {
          showFb(art, false, true, d);
          return;
        }
        var ok = matches(d, val);
        var picked = art.querySelector("[data-pick].is-pick");
        if (picked) {
          picked.classList.remove("is-wrong");
          if (ok) picked.classList.add("is-pick");
          else {
            picked.classList.remove("is-pick");
            picked.classList.add("is-wrong");
          }
        }
        if (ok) {
          markSolved(d.id);
          art.classList.add("is-solved");
        }
        showFb(art, ok, false, d);
      }
    });
  }

  function mount(sel) {
    var root = document.querySelector(sel || "#drills");
    var chap = window.C_OS_CHAPTER;
    if (!root || !chap) return;
    var unlockName = chap.unlockGroup || "";
    var groups = [];
    var map = {};
    (chap.drills || []).forEach(function (d, i) {
      var g = d.group || "Practice";
      if (!map[g]) {
        map[g] = [];
        groups.push(g);
      }
      map[g].push({ d: d, i: i });
    });
    groups.forEach(function (g) {
      var locked = unlockName && g === unlockName;
      var host = root;
      if (locked) {
        var gate = document.createElement("div");
        gate.className = "gate";
        gate.setAttribute("data-unlock-gate", "1");
        gate.innerHTML =
          '<span class="tag">Locked until share.c is done</span>' +
          "<p>Submit every C step above right. This GitHub publish path then opens: init, ignore list, README, add, commit, create the repo, push. No force push. No skipped hooks. You publish <em>your</em> share.c — not this teaching site.</p>";
        root.appendChild(gate);
        var wrap = document.createElement("div");
        wrap.setAttribute("data-unlock", "1");
        wrap.hidden = true;
        root.appendChild(wrap);
        host = wrap;
      }
      var h = document.createElement("h2");
      h.textContent = g;
      host.appendChild(h);
      map[g].forEach(function (item) {
        host.appendChild(renderDrill(item.d, item.i));
      });
    });
    paintScore();
    applyUnlock();
  }

  window.COsPractice = { mount: mount };
  document.addEventListener("DOMContentLoaded", function () {
    mount("#drills");
  });
})();
