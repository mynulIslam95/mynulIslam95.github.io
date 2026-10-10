(function (global) {
  var KEY = "de-desk-lang";
  var UI = {
    en: {
      brand: "German desk",
      explain: "Meanings in",
      langHint: "German stays German. Choose the language for the meanings.",
      homeLede: "Choose a level. Every level has the same three parts: words, stories and grammar.",
      homeCard: "The words, stories and grammar for this level.",
      wordsN: "{n} words",
      storiesN: "{n} stories",
      grammarN: "{n} chapters",
      allLevels: "All levels",
      level: "Level {lv}",
      levelLede: "Same three parts at every level: words, stories, grammar.",
      words: "Words",
      stories: "Stories",
      grammar: "Grammar",
      wordsLive: "{n} words",
      storiesNumbered: "{n} stories",
      chaptersN: "{n} chapters",
      wordsCard: "Grouped by der, die, das, verbs with every form, and the rest.",
      storiesCard: "All stories for Level {lv}, in order from 1.",
      grammarCard: "All grammar chapters for Level {lv}.",
      wordsTitle: "Level {lv} · Words",
      wordsLede: "Choose a group. {n} words in this level.",
      wordsCatLede: "{n} words{done} Capital letters and full stops do not matter.",
      wordsDone: ". {n} finished.",
      noWords: "No words in this group yet.",
      notLiveWord: "This word is not open yet.",
      copyOf: "Write it · {a} of 10",
      sentOf: "The sentence · {a} of 3",
      typeWord: "Type the German word",
      typeSent: "Type the German sentence",
      success: "Done. The word and the sentence are both finished.",
      nextWord: "Next word",
      backGroup: "Back to the list",
      notYetSee: "Not yet. Type exactly what you see.",
      check: "Check",
      allForms: "Every form of this verb",
      storiesTitle: "Level {lv} · Stories",
      storiesLede: "{n} stories in this level, numbered 1 to {n}. You can also pick a topic.",
      storiesGroupLede: "{n} stories on this topic, still in level order.",
      storyMeta: "Story {n} / {total} · Level {lv}",
      storyHelp: "Tap a German line to see what it means. Tap again to hide it.",
      hideLine: "Hide meaning",
      showFull: "Show the whole meaning",
      hideFull: "Hide the whole meaning",
      notLiveStory: "This story is not open yet.",
      grammarTitle: "Level {lv} · Grammar",
      grammarLede: "All {n} chapters for this level, in the order you learn them. You can also pick a topic.",
      grammarGroupLede: "{n} chapters on this topic.",
      chapterMeta: "Chapter {n} / {total} · Level {lv}",
      examples: "Examples",
      practice: "Try it yourself",
      practiceLede: "Fill the gap. After two wrong tries, the answer is shown.",
      questionN: "Question {a} / {b}",
      correct: "That's right. {en}",
      answerIs: "Answer: {a} — {en}",
      notYetTry: "Not yet. Have one more go.",
      notLiveGrammar: "This chapter is not open yet.",
      loading: "Loading.",
      telc: "TELC B1 exam practice",
      portfolio: "Portfolio"
    },
    bn: {
      brand: "জার্মান ডেস্ক",
      explain: "মানে",
      langHint: "জার্মান শব্দ জার্মানই থাকবে। মানেটা কোন ভাষায় দেখতে চান?",
      homeLede: "একটা লেভেল বাছুন। প্রতিটা লেভেলে একই তিনটে অংশ — শব্দ, গল্প আর ব্যাকরণ।",
      homeCard: "এই লেভেলের শব্দ, গল্প আর ব্যাকরণ এক জায়গায়।",
      wordsN: "{n}টা শব্দ",
      storiesN: "{n}টা গল্প",
      grammarN: "{n}টা অধ্যায়",
      allLevels: "সব লেভেল",
      level: "লেভেল {lv}",
      levelLede: "প্রতিটা লেভেলে একই তিনটে অংশ: শব্দ, গল্প, ব্যাকরণ।",
      words: "শব্দ",
      stories: "গল্প",
      grammar: "ব্যাকরণ",
      wordsLive: "{n}টা শব্দ",
      storiesNumbered: "{n}টা গল্প",
      chaptersN: "{n}টা অধ্যায়",
      wordsCard: "der, die, das, ক্রিয়া — আর বাকিগুলো আলাদা দলে।",
      storiesCard: "এই লেভেলের সব গল্প, ১ থেকে সাজানো।",
      grammarCard: "এই লেভেলের ব্যাকরণের সব অধ্যায়।",
      wordsTitle: "লেভেল {lv} · শব্দ",
      wordsLede: "একটা দল বাছুন। এই লেভেলে {n}টা শব্দ আছে।",
      wordsCatLede: "{n}টা শব্দ{done} বড় হাত, ছোট হাত আর দাঁড়ি মিলিয়ে দেখার দরকার নেই।",
      wordsDone: "। {n}টা শেষ করেছেন।",
      noWords: "এই দলে এখনো কোনো শব্দ নেই।",
      notLiveWord: "এই শব্দটা এখনো খোলেনি।",
      copyOf: "লিখুন · {a} / ১০",
      sentOf: "বাক্য · {a} / ৩",
      typeWord: "জার্মান শব্দটা লিখুন",
      typeSent: "জার্মান বাক্যটা লিখুন",
      success: "হয়ে গেল। শব্দ আর বাক্য — দুটোই শেষ।",
      nextWord: "পরের শব্দ",
      backGroup: "তালিকায় ফিরে যান",
      notYetSee: "এখনো হয়নি। যা দেখছেন, ঠিক সেটাই লিখুন।",
      check: "মিলিয়ে দেখুন",
      allForms: "এই ক্রিয়ার সব রূপ",
      storiesTitle: "লেভেল {lv} · গল্প",
      storiesLede: "এই লেভেলে {n}টা গল্প, ১ থেকে {n} পর্যন্ত। চাইলে একটা বিষয়ও বাছতে পারেন।",
      storiesGroupLede: "এই বিষয়ে {n}টা গল্প। লেভেলের সিরিয়ালই আছে।",
      storyMeta: "গল্প {n} / {total} · লেভেল {lv}",
      storyHelp: "জার্মান লাইনে চাপ দিলে মানেটা দেখাবে। আবার চাপ দিলে মানেটা চলে যাবে।",
      hideLine: "মানেটা সরান",
      showFull: "পুরো মানেটা দেখুন",
      hideFull: "পুরো মানেটা সরান",
      notLiveStory: "এই গল্পটা এখনো খোলেনি।",
      grammarTitle: "লেভেল {lv} · ব্যাকরণ",
      grammarLede: "এই লেভেলের {n}টা অধ্যায়, যেভাবে শেখানো হয় সেই ক্রমে। চাইলে একটা বিষয় বাছুন।",
      grammarGroupLede: "এই বিষয়ে {n}টা অধ্যায়।",
      chapterMeta: "অধ্যায় {n} / {total} · লেভেল {lv}",
      examples: "উদাহরণ",
      practice: "নিজে করে দেখুন",
      practiceLede: "খালি জায়গাটা ভরেন। দুইবার ভুল হলে উত্তরটা দেখিয়ে দেব।",
      questionN: "প্রশ্ন {a} / {b}",
      correct: "ঠিক হয়েছে। {en}",
      answerIs: "উত্তর: {a} — {en}",
      notYetTry: "এখনো না। আর একবার দেখুন।",
      notLiveGrammar: "এই অধ্যায়টা এখনো খোলেনি।",
      loading: "আসছে…",
      telc: "TELC B1 পরীক্ষার প্রস্তুতি",
      portfolio: "পোর্টফোলিও"
    }
  };

  function detect() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved && UI[saved]) return saved;
    } catch (err) {}
    var nav = String(navigator.language || navigator.userLanguage || "").toLowerCase();
    if (nav.indexOf("bn") === 0) return "bn";
    return "en";
  }

  var lang = detect();

  function fill(s, vars) {
    if (!vars) return s;
    Object.keys(vars).forEach(function (k) {
      s = s.split("{" + k + "}").join(String(vars[k]));
    });
    return s;
  }

  var api = {
    langs: [
      { id: "en", label: "English" },
      { id: "bn", label: "বাংলা" }
    ],
    get: function () { return lang; },
    t: function (key, vars) {
      var table = UI[lang] || UI.en;
      return fill(table[key] || UI.en[key] || key, vars);
    },
    help: function (en, bn) {
      if (lang === "bn" && bn) return bn;
      return en || bn || "";
    },
    cell: function (c) {
      if (!c) return "";
      if (typeof c === "string") return c;
      return api.help(c.en, c.bn);
    },
    set: function (next) {
      if (!UI[next] || next === lang) return;
      lang = next;
      try { localStorage.setItem(KEY, next); } catch (err) {}
      document.documentElement.setAttribute("data-lang", next);
      if (typeof api.onChange === "function") api.onChange();
    },
    onChange: null
  };

  document.documentElement.setAttribute("data-lang", lang);
  global.I18n = api;
})(window);
