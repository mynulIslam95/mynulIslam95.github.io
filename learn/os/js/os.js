(function () {
  document.querySelectorAll(".quiz").forEach(function (box) {
    var right = (box.getAttribute("data-answer") || "").toLowerCase();
    var why = box.querySelector(".why");
    var tag = box.querySelector(".why .tag");
    box.querySelectorAll("[data-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pick = btn.getAttribute("data-pick");
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
  });
})();
