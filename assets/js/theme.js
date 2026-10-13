(function () {
  var KEY = "mynul-theme";

  function saved() {
    try {
      var t = localStorage.getItem(KEY);
      if (t === "light" || t === "dark") return t;
    } catch (err) {}
    return null;
  }

  function prefer() {
    try {
      if (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches) return "light";
    } catch (err) {}
    return "dark";
  }

  function paint(t) {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(KEY, t);
    } catch (err) {}
    var light = t === "light";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", light ? "true" : "false");
      btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      btn.title = light ? "Dark mode" : "Light mode";
    });
  }

  function current() {
    return document.documentElement.getAttribute("data-theme") || saved() || prefer();
  }

  paint(saved() || prefer());
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    paint(current() === "light" ? "dark" : "light");
  });
  window.applyMynulTheme = function () {
    paint(current());
  };
})();
