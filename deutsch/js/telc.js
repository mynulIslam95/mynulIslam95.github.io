(function () {
  var KEY = "de-desk-telc";
  var cache = {};
  var mode = "learn";
  var rec = null;
  var recChunks = [];
  var recUrl = "";
  var recTimer = null;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function state() {
    var s = load();
    if (!s.mode) s.mode = "learn";
    if (!s.done) s.done = {};
    if (!s.write) s.write = "";
    if (!s.exam) s.exam = null;
    if (!s.next) s.next = { href: "#/telc/lesen/demo", label: "Lesen · Foundation 01", mins: 7 };
    return s;
  }
  function patch(fn) {
    var s = state();
    fn(s);
    save(s);
    return s;
  }
  function esc(t) {
    return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function get(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    return fetch(path).then(function (r) { return r.json(); }).then(function (d) {
      cache[path] = d;
      return d;
    });
  }

  function shell(title, inner, exitHref) {
    return (
      '<a class="back shell-exit" href="' + (exitHref || "#/telc") + '">Exit</a>' +
      '<p class="meta">' + esc(title) + "</p>" +
      inner
    );
  }

  function modesBar(area) {
    return (
      '<div class="modes" role="tablist" aria-label="Mode">' +
      ["learn", "practice", "exam"].map(function (m) {
        var lab = m.charAt(0).toUpperCase() + m.slice(1);
        return '<button type="button" data-mode="' + m + '" class="' + (mode === m ? "is-on" : "") + '">' + lab + "</button>";
      }).join("") +
      "</div>"
    );
  }

  function bindModes() {
    document.querySelectorAll(".modes button").forEach(function (b) {
      b.onclick = function () {
        mode = this.getAttribute("data-mode");
        patch(function (s) { s.mode = mode; });
        render(location.hash.replace(/^#\/?/, "").split("/").filter(Boolean));
      };
    });
  }

  function lockBar(label) {
    return '<div class="bar is-lock"><span class="t">' + esc(label) + '</span><span class="e">Later</span></div>';
  }
  function liveBar(href, n, t) {
    return '<a class="bar" href="' + href + '"><span class="n">' + esc(n) + '</span><span class="t">' + esc(t) + "</span></a>";
  }

  function home(root) {
    var s = state();
    mode = s.mode || "learn";
    var html =
      '<div class="top"><a class="brand" href="#/">German desk</a><a class="home" href="../index.html">Portfolio</a></div>' +
      '<a class="back" href="#/">All sections</a>' +
      "<h1>Master TELC B1</h1>" +
      '<p class="lede">Train for the exam one step at a time.</p>' +
      '<p class="telc-note">Independent practice material. Not affiliated with or endorsed by telc gGmbH.</p>';
    if (!s.seen) {
      html +=
        '<div class="telc-continue"><span class="k">Start here</span><h2>Take a short orientation</h2>' +
        "<p>Choose an exam area, or open the demo mock.</p>" +
        '<div class="row"><a class="btn" href="#/telc/lesen">Lesen</a><a class="btn ghost" href="#/telc/mock/demo">Demo exam</a></div></div>';
    } else {
      html +=
        '<a class="telc-continue" href="' + s.next.href + '"><span class="k">Continue</span><h2>Your next training</h2>' +
        "<p>" + esc(s.next.label) + " · ~" + s.next.mins + " min</p></a>";
    }
    html += '<p class="area-h">Exam areas</p><div class="bars">';
    ["lesen", "sprachbausteine", "hoeren", "schreiben", "sprechen"].forEach(function (id, i) {
      var titles = ["Lesen", "Sprachbausteine", "Hören", "Schreiben", "Sprechen"];
      html += liveBar("#/telc/" + id, String(i + 1), titles[i]);
    });
    html +=
      '</div><p class="area-h">Full mock exams</p><div class="bars">' +
      liveBar("#/telc/mock", "M", "Mock exams") +
      '</div><p class="area-h">Progress</p><div class="bars">' +
      liveBar("#/telc/progress", "P", "Progress") +
      "</div>";
    root.innerHTML = html;
    patch(function (st) { st.seen = true; });
  }

  function areaLanding(root, id) {
    var s = state();
    mode = s.mode || "learn";
    var maps = {
      lesen: {
        title: "Lesen",
        groups: [
          { h: "Skill training", items: [
            ["01", "Main idea", "#/telc/lesen/demo"],
            ["02", "Headlines"], ["03", "Keywords"], ["04", "Synonyms"], ["05", "Paraphrases"],
            ["06", "Negatives"], ["07", "Dates & numbers"], ["08", "Finding details"],
            ["09", "Matching situations"], ["10", "TELC traps"]
          ]},
          { h: "Exam-part training", items: [["T1", "Teil 1"], ["T2", "Teil 2"], ["T3", "Teil 3"]] },
          { h: "Tests", items: [["M", "Model tests"], ["F", "Final simulations"]] }
        ]
      },
      sprachbausteine: {
        title: "Sprachbausteine",
        groups: [
          { h: "Master topics", items: [
            ["01", "Cases"], ["02", "Articles"], ["03", "Prepositions", "#/telc/sprachbausteine/demo"],
            ["04", "Verb + preposition"], ["05", "Conjunctions"], ["06", "Word order"],
            ["07", "Pronouns"], ["08", "Adjective endings"], ["09", "Verb forms"],
            ["10", "Modal verbs"], ["11", "Relative clauses"], ["12", "Infinitive + zu"],
            ["13", "Time expressions"], ["14", "Linking words"], ["15", "Fixed expressions"]
          ]},
          { h: "Targeted practice", items: [["T1", "Teil 1"], ["T2", "Teil 2"], ["M", "Model tests"], ["F", "Final simulations"]] }
        ]
      },
      hoeren: {
        title: "Hören",
        groups: [
          { h: "Listening foundation", items: [
            ["01", "Numbers"], ["02", "Prices"], ["03", "Time", "#/telc/hoeren/check"],
            ["04", "Dates"], ["05", "Phone numbers"], ["06", "Addresses"], ["07", "Announcements"],
            ["08", "Appointments"], ["09", "Directions"], ["10", "Opinions"], ["11", "Agreement"],
            ["12", "Disagreement"], ["13", "Negation"], ["14", "Changes"], ["15", "Key information"]
          ]},
          { h: "Exam-part training", items: [["T1", "Teil 1"], ["T2", "Teil 2"], ["T3", "Teil 3"], ["M", "Model tests"], ["F", "Final simulations"]] }
        ]
      },
      schreiben: {
        title: "Schreiben",
        groups: [
          { h: "Writing master course", items: [
            ["01", "Greeting"], ["02", "Opening"], ["03", "Asking for information", "#/telc/schreiben/demo"],
            ["04", "Giving information"], ["05", "Giving a reason"], ["06", "Apologising"],
            ["07", "Making a request"], ["08", "Making a suggestion"], ["09", "Accepting"],
            ["10", "Refusing politely"], ["11", "Complaining"], ["12", "Inviting"],
            ["13", "Thanking"], ["14", "Connecting sentences"], ["15", "Closing"]
          ]},
          { h: "Practice", items: [["G", "Guided writing"], ["I", "Independent writing"], ["M", "Model tasks"], ["F", "Final simulations"]] }
        ]
      },
      sprechen: {
        title: "Sprechen",
        groups: [
          { h: "Checks", items: [["Mic", "Microphone check", "#/telc/sprechen/mic"]] },
          { h: "Parts", items: [
            ["T1", "Teil 1 · Einander kennenlernen", "#/telc/sprechen/demo"],
            ["T2", "Teil 2 · Über ein Thema sprechen"],
            ["T3", "Teil 3 · Gemeinsam etwas planen"]
          ]},
          { h: "Tools", items: [["P", "Useful phrases"], ["M", "Model tests"], ["F", "Final simulations"]] }
        ]
      }
    };
    var spec = maps[id];
    var html =
      '<div class="top"><a class="brand" href="#/">German desk</a><a class="home" href="../index.html">Portfolio</a></div>' +
      '<a class="back" href="#/telc">Master TELC B1</a>' +
      "<h1>" + spec.title + "</h1>" +
      modesBar(id) +
      '<p class="locked-hint">Only the first live demo is open. The rest stay closed until content is added.</p>';
    spec.groups.forEach(function (g) {
      html += '<p class="area-h">' + g.h + '</p><div class="bars">';
      g.items.forEach(function (it) {
        html += it[2] ? liveBar(it[2], it[0], it[1]) : lockBar(it[0] + " · " + it[1]);
      });
      html += "</div>";
    });
    root.innerHTML = html;
    bindModes();
  }

  function choices(list, picked) {
    return list.map(function (c, i) {
      return '<button class="choice' + (picked === i ? " is-on" : "") + '" type="button" data-i="' + i + '">' + esc(c) + "</button>";
    }).join("");
  }

  function lesenTask(root) {
    get("telc/data/lesen/demo.json").then(function (d) {
      var picked = null;
      var tries = 0;
      function draw(msg, showEv) {
        var pass = d.passage;
        if (showEv && mode !== "exam") {
          pass = pass.replace(d.evidence, "<mark>" + esc(d.evidence) + "</mark>");
        } else {
          pass = esc(pass);
        }
        root.innerHTML = shell(
          "Lesen · " + cap(mode),
          modesBar() +
            '<p class="progress">Question 1 / 1</p><div class="meter" aria-hidden="true"><span style="width:100%"></span></div>' +
            '<div class="passage">' + pass + "</div>" +
            '<p class="prompt">' + esc(d.question) + "</p>" +
            '<div id="ch">' + choices(d.choices, picked) + "</div>" +
            '<div class="row"><button class="btn" type="button" id="go">Check</button></div>' +
            '<div class="msg" id="msg">' + (msg || "") + "</div>" +
            (showEv && mode !== "exam" ? '<p class="en-paren">' + esc(d.explain) + "</p>" : ""),
          "#/telc/lesen"
        );
        bindModes();
        root.querySelectorAll(".choice").forEach(function (b) {
          b.onclick = function () {
            picked = parseInt(this.getAttribute("data-i"), 10);
            draw(msg, showEv);
          };
        });
        document.getElementById("go").onclick = function () {
          if (mode === "exam") {
            document.getElementById("msg").textContent = "Saved. Answers are not checked in exam mode.";
            mark("lesen");
            return;
          }
          if (picked == null) {
            document.getElementById("msg").textContent = "Choose an answer.";
            return;
          }
          tries += 1;
          if (picked === d.answer) {
            mark("lesen");
            draw('<span class="ok">Correct.</span>', true);
          } else if (mode === "learn" && tries < 2) {
            draw('<span class="bad">Not yet. One more try.</span>', false);
          } else {
            draw('<span class="bad">Answer: ' + esc(d.choices[d.answer]) + "</span>", true);
          }
        };
      }
      draw("", false);
    });
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function mark(area) {
    patch(function (s) {
      s.done[area] = true;
      s.next = { href: "#/telc/" + area, label: area + " · next", mins: 7 };
    });
  }

  function sbTask(root) {
    get("telc/data/sprachbausteine/demo.json").then(function (d) {
      var picked = null;
      var tries = 0;
      function draw(msg, reveal) {
        root.innerHTML = shell(
          "Sprachbausteine · " + cap(mode),
          modesBar() +
            '<p class="progress">Question 1 / 1</p>' +
            '<p class="prompt notranslate" lang="de">' + esc(d.prompt) + "</p>" +
            '<div>' + choices(d.choices, picked) + "</div>" +
            '<div class="row"><button class="btn" type="button" id="go">Check</button></div>' +
            '<div class="msg" id="msg">' + (msg || "") + "</div>" +
            (reveal && mode !== "exam" ? "<p>" + esc(d.rule) + "<br>" + esc(d.example) + "</p>" : ""),
          "#/telc/sprachbausteine"
        );
        bindModes();
        root.querySelectorAll(".choice").forEach(function (b) {
          b.onclick = function () {
            picked = parseInt(this.getAttribute("data-i"), 10);
            draw(msg, reveal);
          };
        });
        document.getElementById("go").onclick = function () {
          if (mode === "exam") {
            document.getElementById("msg").textContent = "Saved. Answers are not checked in exam mode.";
            mark("sprachbausteine");
            return;
          }
          if (picked == null) return;
          tries += 1;
          if (picked === d.answer) {
            mark("sprachbausteine");
            draw('<span class="ok">Correct.</span>', true);
          } else if (mode === "learn" && tries < 2) {
            draw('<span class="bad">Not yet. One more try.</span>', false);
          } else {
            draw('<span class="bad">Answer: ' + esc(d.choices[d.answer]) + "</span>", true);
          }
        };
      }
      draw("", false);
    });
  }

  function beep() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    o.start();
    o.stop(ctx.currentTime + 0.35);
  }

  function hoerenTask(root, needCheck) {
    if (needCheck) {
      root.innerHTML = shell(
        "Hören · Audio check",
        "<h1>Audio check</h1><p class=\"lede\">Volume on. Headphones if you have them. Quiet room.</p>" +
          '<div class="row"><button class="btn" type="button" id="beep">Play test sound</button></div>' +
          '<p class="lede">Can you hear it?</p>' +
          '<div class="row"><a class="btn" href="#/telc/hoeren/demo">Yes, continue</a></div>',
        "#/telc/hoeren"
      );
      document.getElementById("beep").onclick = beep;
      return;
    }
    get("telc/data/hoeren/demo.json").then(function (d) {
      var picked = null;
      var heard = false;
      function draw(after) {
        var extra = "";
        if (after && mode !== "exam") {
          extra =
            '<p class="passage">' + esc(d.transcript) + "</p>" +
            (mode === "learn" ? '<p class="en-paren">' + esc(d.en) + "</p>" : "") +
            "<p>Key words: " + d.vocab.map(esc).join(", ") + "</p>";
        }
        root.innerHTML = shell(
          "Hören · " + cap(mode),
          modesBar() +
            '<p class="progress">Question 1 / 1</p>' +
            '<div class="row"><button class="btn" type="button" id="play">Play</button></div>' +
            '<p class="prompt">' + esc(d.question) + "</p>" +
            choices(d.choices, picked) +
            '<div class="row"><button class="btn" type="button" id="go">Submit</button></div>' +
            '<div class="msg" id="msg"></div>' + extra,
          "#/telc/hoeren"
        );
        bindModes();
        document.getElementById("play").onclick = function () {
          if (mode === "exam" && heard) return;
          heard = true;
          beep();
        };
        root.querySelectorAll(".choice").forEach(function (b) {
          b.onclick = function () {
            picked = parseInt(this.getAttribute("data-i"), 10);
            draw(after);
          };
        });
        document.getElementById("go").onclick = function () {
          if (mode === "exam") {
            document.getElementById("msg").textContent = "Saved.";
            mark("hoeren");
            return;
          }
          if (picked === d.answer) {
            mark("hoeren");
            draw(true);
            document.getElementById("msg").innerHTML = '<span class="ok">Correct.</span>';
          } else {
            draw(true);
            document.getElementById("msg").innerHTML = '<span class="bad">Answer: ' + esc(d.choices[d.answer]) + "</span>";
          }
        };
      }
      draw(false);
    });
  }

  function writeTask(root) {
    get("telc/data/schreiben/demo.json").then(function (d) {
      var s = state();
      var text = s.write || "";
      var showModel = false;
      function draw() {
        var words = text.trim() ? text.trim().split(/\s+/).length : 0;
        root.innerHTML = shell(
          "Schreiben · " + cap(mode),
          modesBar() +
            "<p>" + esc(d.situation) + "</p>" +
            "<ul>" + d.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
            '<textarea class="area" id="w" aria-label="Your letter">' + esc(text) + "</textarea>" +
            '<p class="progress">' + words + " words</p>" +
            '<div class="row"><button class="btn" type="button" id="go">Submit</button></div>' +
            (showModel && mode !== "exam" ? '<p class="passage">' + esc(d.model).replace(/\n/g, "<br>") + "</p>" : ""),
          "#/telc/schreiben"
        );
        bindModes();
        var box = document.getElementById("w");
        box.oninput = function () {
          text = box.value;
          patch(function (st) { st.write = text; });
          document.querySelector(".progress").textContent = (text.trim() ? text.trim().split(/\s+/).length : 0) + " words";
        };
        document.getElementById("go").onclick = function () {
          mark("schreiben");
          showModel = mode !== "exam";
          draw();
        };
      }
      draw();
    });
  }

  function stopRec() {
    if (rec && rec.state !== "inactive") rec.stop();
    if (recTimer) clearInterval(recTimer);
    recTimer = null;
  }

  function micPage(root) {
    var level = 0;
    root.innerHTML = shell(
      "Sprechen · Microphone",
      "<h1>Microphone check</h1><p class=\"lede\">Say: Guten Tag. Ich lerne Deutsch.</p>" +
        '<div class="row"><button class="btn" type="button" id="en">Enable microphone</button></div>' +
        '<p>Input level</p><div class="level"><span id="lv"></span></div>' +
        '<div class="row"><button class="btn ghost" type="button" id="play" disabled>Play my recording</button>' +
        '<button class="btn" type="button" id="ok" disabled>Microphone works</button></div>' +
        '<p class="msg" id="msg"></p><p class="telc-note">Your practice recording stays on this device.</p>',
      "#/telc/sprechen"
    );
    var msg = document.getElementById("msg");
    document.getElementById("en").onclick = function () {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        msg.textContent = "Recording is unavailable. You can still use timed speaking practice.";
        document.getElementById("ok").disabled = false;
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        recChunks = [];
        rec = new MediaRecorder(stream);
        rec.ondataavailable = function (e) { if (e.data.size) recChunks.push(e.data); };
        rec.onstop = function () {
          if (recUrl) URL.revokeObjectURL(recUrl);
          recUrl = URL.createObjectURL(new Blob(recChunks, { type: rec.mimeType || "audio/webm" }));
          document.getElementById("play").disabled = false;
          document.getElementById("ok").disabled = false;
          stream.getTracks().forEach(function (t) { t.stop(); });
        };
        rec.start();
        var n = 0;
        recTimer = setInterval(function () {
          n += 1;
          document.getElementById("lv").style.width = Math.min(100, 20 + (n % 8) * 10) + "%";
          if (n >= 8) stopRec();
        }, 250);
        msg.textContent = "Recording…";
      }).catch(function () {
        msg.textContent = "Microphone permission denied. You can still use timed speaking practice.";
        document.getElementById("ok").disabled = false;
      });
    };
    document.getElementById("play").onclick = function () {
      if (recUrl) new Audio(recUrl).play();
    };
    document.getElementById("ok").onclick = function () {
      location.hash = "#/telc/sprechen/demo";
    };
  }

  function speakTask(root) {
    get("telc/data/sprechen/demo.json").then(function (d) {
      var i = 0;
      var stuck = 0;
      function draw() {
        var p = d.prompts[i];
        root.innerHTML = shell(
          "Sprechen · Teil 1 · " + cap(mode),
          modesBar() +
            '<p class="progress">Prompt ' + (i + 1) + " / " + d.prompts.length + "</p>" +
            '<p class="prompt notranslate" lang="de">' + esc(p.de) + "</p>" +
            (mode === "learn" ? '<p class="en-paren">(' + esc(p.en) + ")</p>" : "") +
            '<p><span class="mic-dot"></span>Your turn</p>' +
            '<div class="row"><button class="btn" type="button" id="rec">Record</button>' +
            '<button class="btn ghost" type="button" id="next">Next</button>' +
            (mode !== "exam" ? '<button class="btn ghost" type="button" id="stuck">I\'m stuck</button>' : "") +
            "</div>" +
            '<p class="msg" id="hint"></p>' +
            '<p class="telc-note">Your practice recording stays on this device.</p>',
          "#/telc/sprechen"
        );
        bindModes();
        document.getElementById("rec").onclick = function () {
          document.getElementById("hint").textContent = navigator.mediaDevices ? "Speak now. Tap Next when you finish." : "Recording is unavailable. Use the timer and speak aloud.";
        };
        document.getElementById("next").onclick = function () {
          if (i < d.prompts.length - 1) {
            i += 1;
            stuck = 0;
            draw();
          } else {
            mark("sprechen");
            document.getElementById("hint").innerHTML = '<span class="ok">Teil 1 complete.</span>';
          }
        };
        var st = document.getElementById("stuck");
        if (st) {
          st.onclick = function () {
            if (stuck < d.rescue.length) {
              document.getElementById("hint").textContent = d.rescue[stuck];
              stuck += 1;
            }
          };
        }
      }
      draw();
    });
  }

  function remain(exam) {
    return Math.max(0, exam.endsAt - Date.now());
  }
  function fmt(ms) {
    var s = Math.ceil(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function mockHome(root) {
    var s = state();
    var html =
      '<div class="top"><a class="brand" href="#/">German desk</a><a class="home" href="../index.html">Portfolio</a></div>' +
      '<a class="back" href="#/telc">Master TELC B1</a>' +
      "<h1>Full mock exams</h1><div class=\"bars\">";
    var i;
    for (i = 1; i <= 30; i += 1) {
      if (i === 1) {
        var st = "Not started";
        if (s.exam && s.exam.status === "running") st = "In progress";
        if (s.exam && s.exam.status === "done") st = "Completed";
        if (s.exam && s.exam.status === "expired") st = "Time expired";
        html += '<a class="bar" href="#/telc/mock/demo"><span class="n">01</span><span class="t">Demo exam</span><span class="e">' + st + "</span></a>";
      } else {
        html += '<div class="bar is-lock"><span class="n">' + (i < 10 ? "0" + i : i) + '</span><span class="t">Exam ' + i + '</span><span class="e">Content coming later</span></div>';
      }
    }
    root.innerHTML = html + "</div>";
  }

  function mockGate(root) {
    var s = state();
    if (s.exam && s.exam.status === "running" && remain(s.exam) > 0) {
      location.hash = "#/telc/mock/demo/run";
      return;
    }
    if (s.exam && s.exam.status === "running" && remain(s.exam) <= 0) {
      patch(function (st) { st.exam.status = "expired"; });
    }
    root.innerHTML =
      '<a class="back" href="#/telc/mock">Exit</a>' +
      '<div class="telc-gate"><p class="k">TELC B1 · Mock exam</p><h1>Exam mode</h1>' +
      "<p>This is a timed simulation. Once you start, the timer cannot be paused. Refreshing will not reset it. Hints and translations are off.</p>" +
      "<p>Duration: 3 minutes (demo).</p>" +
      '<label class="check-row"><input id="ok" type="checkbox"> I understand the exam rules</label>' +
      '<button class="btn" type="button" id="go" disabled>Start exam</button></div>';
    var box = document.getElementById("ok");
    var go = document.getElementById("go");
    box.onchange = function () { go.disabled = !box.checked; };
    go.onclick = function () {
      var now = Date.now();
      patch(function (st) {
        st.exam = {
          attemptId: String(now),
          examId: "demo",
          startedAt: now,
          endsAt: now + 180000,
          status: "running",
          section: 0,
          answers: {}
        };
      });
      location.hash = "#/telc/mock/demo/run";
    };
  }

  function mockRun(root) {
    var s = state();
    if (!s.exam || s.exam.status !== "running") {
      location.hash = "#/telc/mock/demo";
      return;
    }
    if (remain(s.exam) <= 0) {
      patch(function (st) { st.exam.status = "expired"; });
      location.hash = "#/telc/mock/demo/review";
      return;
    }
    function paint() {
      var ex = state().exam;
      var left = remain(ex);
      if (left <= 0) {
        patch(function (st) { st.exam.status = "expired"; });
        location.hash = "#/telc/mock/demo/review";
        return;
      }
      var clock = document.getElementById("clock");
      if (clock) clock.textContent = fmt(left);
    }
    root.innerHTML = shell(
      "Demo exam",
      '<p class="clock" id="clock">' + fmt(remain(s.exam)) + "</p>" +
        "<p>Section " + (s.exam.section + 1) + " of 2. Answer, then continue. Leaving this page does not pause the clock.</p>" +
        '<div class="row"><button class="btn" type="button" id="next">Next section</button>' +
        '<button class="btn ghost" type="button" id="end">End exam</button></div>',
      "#/telc/mock"
    );
    var tick = setInterval(paint, 500);
    function stop() { clearInterval(tick); }
    document.getElementById("next").onclick = function () {
      stop();
      var ex = state().exam;
      if (ex.section < 1) {
        patch(function (st) { st.exam.section += 1; });
        mockRun(root);
      } else {
        patch(function (st) { st.exam.status = "done"; });
        location.hash = "#/telc/mock/demo/review";
      }
    };
    document.getElementById("end").onclick = function () {
      if (!window.confirm("You still have time remaining. Submitting now will end this attempt.")) return;
      stop();
      patch(function (st) { st.exam.status = "done"; });
      location.hash = "#/telc/mock/demo/review";
    };
  }

  function mockReview(root) {
    var s = state();
    var st = s.exam ? s.exam.status : "none";
    root.innerHTML = shell(
      "Demo exam · Review",
      "<h1>Demo exam</h1><p>" + (st === "expired" ? "Time expired" : "Completed") + "</p>" +
        "<p>Objective results</p><ul>" +
        "<li>Lesen — completed</li><li>Sprachbausteine — completed</li>" +
        "<li>Hören — not in this demo</li><li>Writing — not in this demo</li><li>Speaking — not in this demo</li>" +
        "</ul><p class=\"telc-note\">No official TELC score is given.</p>" +
        '<div class="row"><a class="btn" href="#/telc/mock">Back to mocks</a></div>',
      "#/telc/mock"
    );
  }

  function progress(root) {
    var s = state();
    var keys = ["lesen", "sprachbausteine", "hoeren", "schreiben", "sprechen"];
    var html =
      '<div class="top"><a class="brand" href="#/">German desk</a><a class="home" href="../index.html">Portfolio</a></div>' +
      '<a class="back" href="#/telc">Master TELC B1</a>' +
      "<h1>Progress</h1><div class=\"bars\">";
    keys.forEach(function (k) {
      html += '<div class="bar' + (s.done[k] ? " is-done" : "") + '"><span class="t">' + k + '</span><span class="e">' + (s.done[k] ? "✓" : "Not started") + "</span></div>";
    });
    html += "</div>";
    if (s.exam) html += "<p>Last mock: " + esc(s.exam.status) + "</p>";
    root.innerHTML = html;
  }

  function render(parts) {
    var root = document.getElementById("app");
    if (!root) return;
    mode = state().mode || "learn";
    var a = parts[1] || "";
    var b = parts[2] || "";
    var c = parts[3] || "";
    if (!a) return home(root);
    if (a === "progress") return progress(root);
    if (a === "mock" && b === "demo" && c === "run") return mockRun(root);
    if (a === "mock" && b === "demo" && c === "review") return mockReview(root);
    if (a === "mock" && b === "demo") return mockGate(root);
    if (a === "mock") return mockHome(root);
    if (a === "lesen" && b === "demo") return lesenTask(root);
    if (a === "sprachbausteine" && b === "demo") return sbTask(root);
    if (a === "hoeren" && b === "demo") return hoerenTask(root, false);
    if (a === "hoeren" && b === "check") return hoerenTask(root, true);
    if (a === "schreiben" && b === "demo") return writeTask(root);
    if (a === "sprechen" && b === "mic") return micPage(root);
    if (a === "sprechen" && b === "demo") return speakTask(root);
    if (["lesen", "sprachbausteine", "hoeren", "schreiben", "sprechen"].indexOf(a) !== -1) {
      if (a === "hoeren") {
        /* landing still shown; demo is via check first from landing live bar */
      }
      return areaLanding(root, a);
    }
    home(root);
  }

  window.Telc = { render: render };
})();
