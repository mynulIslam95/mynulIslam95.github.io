(function (global) {
  var KEY = "de-desk-lang";
  var UI = {
    en: {
      brand: "German desk",
      explain: "Explain in",
      homeLede: "Pick a level. Each level has the same three rooms: Words, Stories and Grammar.",
      homeCard: "Words, stories and grammar for this level.",
      wordsN: "{n} words",
      storiesN: "{n} stories",
      grammarN: "{n} grammar",
      allLevels: "All levels",
      level: "Level {lv}",
      levelLede: "Same three rooms at every level: words, stories, grammar.",
      words: "Words",
      stories: "Stories",
      grammar: "Grammar",
      wordsLive: "{n} live",
      storiesNumbered: "{n} numbered",
      chaptersN: "{n} chapters",
      wordsCard: "Grouped by der, die, das, verbs with all forms, and the rest.",
      storiesCard: "All stories for Level {lv}, in order.",
      grammarCard: "All grammar chapters for Level {lv}.",
      wordsTitle: "Level {lv} words",
      wordsLede: "Pick a category. {n} words in this level.",
      wordsCatLede: "{n} words{done} Caps and full stops do not matter.",
      wordsDone: ". {n} done.",
      noWords: "No words in this group yet",
      notLiveWord: "This word is not live yet.",
      copyOf: "Copy {a} of 10",
      sentOf: "Sentence {a} of 3",
      typeWord: "Type the word",
      typeSent: "Type the sentence",
      success: "Success. The word and the sentence are done.",
      nextWord: "Next word",
      backGroup: "Back to group",
      notYetSee: "Not yet. Type what you see.",
      check: "Check",
      allForms: "All verb forms",
      storiesTitle: "Level {lv} stories",
      storiesLede: "{n} stories, numbered 1 to {n} for this level. Filter by theme if you want.",
      storiesGroupLede: "{n} stories in this group, still in level order.",
      storyMeta: "Story {n} / {total} · Level {lv}",
      storyHelp: "Tap a German line to see its translation. Tap again to hide it.",
      hideLine: "Hide translation",
      showFull: "Show full translation",
      hideFull: "Hide full translation",
      notLiveStory: "This story is not live yet.",
      grammarTitle: "Level {lv} grammar",
      grammarLede: "All {n} chapters for this level, numbered in teaching order. Filter by topic if you want.",
      grammarGroupLede: "{n} chapters in this group.",
      chapterMeta: "Chapter {n} / {total} · Level {lv}",
      examples: "Examples",
      practice: "Practice",
      practiceLede: "Fill the blank. After two wrong tries, the answer is shown.",
      questionN: "Question {a} / {b}",
      correct: "Correct. {en}",
      answerIs: "Answer: {a} — {en}",
      notYetTry: "Not yet. One more try.",
      notLiveGrammar: "This chapter is not live yet.",
      loading: "Loading.",
      telc: "TELC B1 exam training",
      portfolio: "Portfolio"
    },
    bn: {
      brand: "জার্মান ডেস্ক",
      explain: "ব্যাখ্যা",
      homeLede: "লেভেল বেছে নিন। প্রতিটি লেভেলে একই তিনটি ঘর: শব্দ, গল্প ও ব্যাকরণ।",
      homeCard: "এই লেভেলের শব্দ, গল্প ও ব্যাকরণ।",
      wordsN: "{n} শব্দ",
      storiesN: "{n} গল্প",
      grammarN: "{n} ব্যাকরণ",
      allLevels: "সব লেভেল",
      level: "লেভেল {lv}",
      levelLede: "প্রতিটি লেভেলে একই তিনটি ঘর: শব্দ, গল্প, ব্যাকরণ।",
      words: "শব্দ",
      stories: "গল্প",
      grammar: "ব্যাকরণ",
      wordsLive: "{n} শব্দ",
      storiesNumbered: "{n} গল্প",
      chaptersN: "{n} অধ্যায়",
      wordsCard: "der, die, das, ক্রিয়া ও বাকি দল অনুযায়ী।",
      storiesCard: "লেভেল {lv}-এর সব গল্প, ক্রম অনুসারে।",
      grammarCard: "লেভেল {lv}-এর সব ব্যাকরণ অধ্যায়।",
      wordsTitle: "লেভেল {lv} শব্দ",
      wordsLede: "একটি দল বেছে নিন। এই লেভেলে {n} শব্দ।",
      wordsCatLede: "{n} শব্দ{done} বড় হাতের অক্ষর ও দাঁড়ি লাগবে না।",
      wordsDone: "। {n} শেষ।",
      noWords: "এই দলে এখনো শব্দ নেই",
      notLiveWord: "এই শব্দ এখনো খোলা নেই।",
      copyOf: "লিখুন {a} / ১০",
      sentOf: "বাক্য {a} / ৩",
      typeWord: "শব্দটা লিখুন",
      typeSent: "বাক্যটা লিখুন",
      success: "হয়েছে। শব্দ ও বাক্য দুটোই শেষ।",
      nextWord: "পরের শব্দ",
      backGroup: "দলে ফিরে যান",
      notYetSee: "এখনো না। যা দেখছেন সেটা লিখুন।",
      check: "দেখুন",
      allForms: "ক্রিয়ার সব রূপ",
      storiesTitle: "লেভেল {lv} গল্প",
      storiesLede: "এই লেভেলে {n} গল্প, ১ থেকে {n} নম্বর। চাইলে বিষয় দিয়ে ছাঁকুন।",
      storiesGroupLede: "এই দলে {n} গল্প, লেভেলের ক্রম অনুসারে।",
      storyMeta: "গল্প {n} / {total} · লেভেল {lv}",
      storyHelp: "জার্মান লাইনে ট্যাপ করলে অনুবাদ দেখাবে। আবার ট্যাপ করলে লুকবে।",
      hideLine: "অনুবাদ লুকান",
      showFull: "পুরো অনুবাদ দেখুন",
      hideFull: "পুরো অনুবাদ লুকান",
      notLiveStory: "এই গল্প এখনো খোলা নেই।",
      grammarTitle: "লেভেল {lv} ব্যাকরণ",
      grammarLede: "এই লেভেলের সব {n} অধ্যায়, শেখার ক্রমে। চাইলে বিষয় দিয়ে ছাঁকুন।",
      grammarGroupLede: "এই দলে {n} অধ্যায়।",
      chapterMeta: "অধ্যায় {n} / {total} · লেভেল {lv}",
      examples: "উদাহরণ",
      practice: "অনুশীলন",
      practiceLede: "ফাঁক ভরুন। দুইবার ভুল হলে উত্তর দেখাবে।",
      questionN: "প্রশ্ন {a} / {b}",
      correct: "সঠিক। {en}",
      answerIs: "উত্তর: {a} — {en}",
      notYetTry: "এখনো না। আর একবার চেষ্টা করুন।",
      notLiveGrammar: "এই অধ্যায় এখনো খোলা নেই।",
      loading: "লোড হচ্ছে।",
      telc: "TELC B1 পরীক্ষার অনুশীলন",
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
      { id: "en", label: "EN" },
      { id: "bn", label: "বাং" }
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
