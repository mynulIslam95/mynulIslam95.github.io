(function () {
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function norm(s) {
    return String(s)
      .replace(/µ/g, "u")
      .replace(/μ/g, "u")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function asTf(s) {
    var u = String(s).trim().toLowerCase();
    if (u === "true" || u === "y") return "yes";
    if (u === "false" || u === "n") return "no";
    return u;
  }

  function shortOk(box, user) {
    var u = norm(user);
    if (!u) return false;
    var accept = (box.getAttribute("data-accept") || "").split("|");
    var i;
    for (i = 0; i < accept.length; i++) {
      if (accept[i] && norm(accept[i]) === u) return true;
    }
    var need = parseInt(box.getAttribute("data-need") || "0", 10);
    var pool = (box.getAttribute("data-pool") || "").split("|");
    if (need > 0 && pool.length) {
      var n = 0;
      pool.forEach(function (tok) {
        var alts = tok.split("/");
        if (alts.some(function (a) { return a && u.indexOf(norm(a)) !== -1; })) n += 1;
      });
      return n >= need;
    }
    var must = (box.getAttribute("data-must") || "").split("|");
    if (must.length && must[0]) {
      return must.every(function (tok) { return tok && u.indexOf(norm(tok)) !== -1; });
    }
    return false;
  }

  document.querySelectorAll(".quiz").forEach(function (box) {
    var kind = box.getAttribute("data-kind") || "tf";
    var why = box.querySelector(".why");
    var tag = box.querySelector(".why .tag");
    var hintBox = box.querySelector(".quiz-hint");
    var hints = (box.getAttribute("data-hints") || "")
      .split("||")
      .map(function (h) { return h.trim(); })
      .filter(Boolean);
    var hintN = 0;

    box.querySelectorAll("[data-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var right = asTf(box.getAttribute("data-answer") || "");
        var pick = asTf(btn.getAttribute("data-pick"));
        box.querySelectorAll("[data-pick]").forEach(function (b) {
          b.classList.remove("is-pick", "is-wrong");
        });
        if (pick === right) {
          btn.classList.add("is-pick");
          if (tag) tag.textContent = "That is right.";
        } else {
          btn.classList.add("is-wrong");
          if (tag) tag.textContent = "That is wrong. Here is why.";
        }
        if (why) why.classList.add("is-on");
      });
    });

    box.addEventListener("click", function (e) {
      var act = e.target.closest("[data-act]");
      if (!act) return;
      var what = act.getAttribute("data-act");
      if (what === "hint" && hintBox && hints.length) {
        if (hintN < hints.length) hintN += 1;
        hintBox.hidden = false;
        var html = '<p class="tag">Hint ' + hintN + " / " + hints.length + "</p>";
        var i;
        for (i = 0; i < hintN; i++) html += "<p>" + esc(hints[i]) + "</p>";
        hintBox.innerHTML = html;
        act.textContent = hintN < hints.length ? "Next hint" : "Hints (all open)";
      }
      if (what === "submit" && kind === "short") {
        var inp = box.querySelector(".short-in");
        var val = inp ? inp.value : "";
        var ok = shortOk(box, val);
        if (tag) {
          tag.textContent = String(val).trim()
            ? (ok ? "That is right." : "Not yet. Hint, or open why.")
            : "Empty. Type an answer, then Submit.";
        }
        if (why) why.classList.add("is-on");
        box.classList.toggle("is-ok", ok);
        box.classList.toggle("is-bad", !ok);
      }
    });
  });
})();
