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

  function markSolved(id) {
    var p = loadProgress();
    p[id] = true;
    saveProgress(p);
    paintScore();
  }

  function paintScore() {
    var el = document.querySelector("[data-drill-score]");
    if (!el || !window.C_OS_CHAPTER) return;
    var drills = window.C_OS_CHAPTER.drills || [];
    var p = loadProgress();
    var n = 0;
    drills.forEach(function (d) { if (p[d.id]) n += 1; });
    el.textContent = n + " / " + drills.length + " submitted right";
  }

  function inputHtml(d) {
    if (d.kind === "tf") {
      return '<div class="choices">' +
        '<button type="button" data-pick="yes">Yes</button>' +
        '<button type="button" data-pick="no">No</button>' +
        "</div>";
    }
    if (d.kind === "write") {
      return '<label class="sr">Your C</label>' +
        '<textarea class="drill-in" rows="8" spellcheck="false" placeholder="Write C here."></textarea>';
    }
    if (d.kind === "fill") {
      return '<label class="sr">Fill</label>' +
        '<input class="drill-in" type="text" spellcheck="false" placeholder="One word, token, or short line"/>';
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
    var code = d.code ? "<pre><code>" + esc(d.code) + "</code></pre>" : "";
    art.innerHTML =
      '<p class="drill-id">' + esc(d.id) + " · " + esc(d.kind) +
        (d.title ? " · " + esc(d.title) : "") + "</p>" +
      "<h3>" + n + ". " + esc(d.prompt) + "</h3>" +
      (d.note ? '<p class="drill-note">' + esc(d.note) + "</p>" : "") +
      code +
      inputHtml(d) +
      '<div class="drill-actions">' +
        '<button type="button" data-act="hint">Hint</button>' +
        '<button type="button" data-act="submit">Submit</button>' +
        '<button type="button" data-act="answer">See answer</button>' +
      "</div>" +
      '<div class="drill-hint" hidden><p class="tag">Hint</p><p>' + esc(d.hint) + "</p></div>" +
      '<div class="drill-fb" hidden></div>' +
      '<div class="drill-ans" hidden>' +
        '<p class="tag">Answer with comments</p>' +
        (d.answerCode ? "<pre><code>" + esc(d.answerCode) + "</code></pre>" : "") +
        (d.answerWhy ? "<p>" + esc(d.answerWhy) + "</p>" : "") +
      "</div>";
    bind(art, d);
    return art;
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
        esc(d.shortWhy || "Your answer matches.") +
        "</p>";
    } else {
      fb.innerHTML = '<p class="tag">Not yet.</p>' +
        "<p>Use Hint and try again, or open See answer. The answer comments every important line.</p>";
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
      if (what === "hint") {
        art.querySelector(".drill-hint").hidden = false;
      }
      if (what === "answer") {
        art.querySelector(".drill-ans").hidden = false;
      }
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
      var h = document.createElement("h2");
      h.textContent = g;
      root.appendChild(h);
      map[g].forEach(function (item) {
        root.appendChild(renderDrill(item.d, item.i));
      });
    });
    paintScore();
  }

  window.COsPractice = { mount: mount };
  document.addEventListener("DOMContentLoaded", function () {
    mount("#drills");
  });
})();
