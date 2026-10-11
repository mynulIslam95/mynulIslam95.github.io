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
      explain: "বুঝব",
      langHint: "জার্মান লেখা যেমন আছে তেমনই থাকবে। শুধু বোঝার ভাষা বদলাবে — ইংরেজি, না বাংলা।",
      homeLede: "যে লেভেলে পড়তেছেন, ওখানে যান। ভিতরে শব্দ আছে, গল্প আছে, ব্যাকরণ আছে।",
      homeCard: "এই লেভেলে যা লাগবে, সব।",
      wordsN: "{n} শব্দ",
      storiesN: "{n} গল্প",
      grammarN: "{n} চ্যাপ্টার",
      allLevels: "সব লেভেল",
      level: "লেভেল {lv}",
      levelLede: "শব্দ, গল্প, ব্যাকরণ। তিনটাই এখানে।",
      words: "শব্দ",
      stories: "গল্প",
      grammar: "ব্যাকরণ",
      wordsLive: "{n} শব্দ",
      storiesNumbered: "{n} গল্প",
      chaptersN: "{n} চ্যাপ্টার",
      wordsCard: "der আলাদা, die আলাদা, ক্রিয়া আলাদা।",
      storiesCard: "গল্পগুলো একের পর এক।",
      grammarCard: "ব্যাকরণ গোড়া থেকে।",
      wordsTitle: "লেভেল {lv} · শব্দ",
      wordsLede: "গ্রুপ ধরেন। এখানে {n} শব্দ।",
      wordsCatLede: "{n} শব্দ{done} বড় হাত আর দাঁড়ি ধরবে না।",
      wordsDone: "। {n}টা হয়ে গেছে",
      noWords: "এখানে এখন কিছু নেই।",
      notLiveWord: "এই শব্দটা এখনো না।",
      copyOf: "এইবার {a} · মোট ১০",
      sentOf: "বাক্য {a} · মোট ৩",
      typeWord: "শব্দটা লিখুন",
      typeSent: "বাক্যটা লিখুন",
      success: "হয়ে গেছে। শব্দও হয়েছে, বাক্যও হয়েছে।",
      nextWord: "পরেরটা",
      backGroup: "ফিরে যান",
      notYetSee: "মিলেনি। যা দেখতেছেন, সেইটা লিখুন।",
      check: "দেখি",
      allForms: "ক্রিয়ার রূপ",
      storiesTitle: "লেভেল {lv} · গল্প",
      storiesLede: "{n}টা গল্প, ১ থেকে শুরু। চাইলে বিষয়ও ধরতে পারেন।",
      storiesGroupLede: "এই বিষয়ে {n}টা।",
      storyMeta: "গল্প {n}/{total} · {lv}",
      storyHelp: "জার্মান লাইনে হাত দিলে মানে বের হবে। আবার দিলে চলে যাবে।",
      hideLine: "লুকান",
      showFull: "পুরোটা দেখুন",
      hideFull: "পুরোটা লুকান",
      notLiveStory: "এই গল্পটা এখনো না।",
      grammarTitle: "লেভেল {lv} · ব্যাকরণ",
      grammarLede: "{n}টা চ্যাপ্টার, গোড়া থেকে শেষ। বিষয় ধরেও যেতে পারেন।",
      grammarGroupLede: "এই বিষয়ে {n}টা।",
      chapterMeta: "চ্যাপ্টার {n}/{total} · {lv}",
      examples: "যেমন",
      practice: "একটু করুন",
      practiceLede: "ফাঁক ভরেন। দুইবার ভুল হলে উত্তর খুলে দেব।",
      questionN: "{a}/{b}",
      correct: "হ্যাঁ। {en}",
      answerIs: "উত্তর {a} — {en}",
      notYetTry: "আরেকবার।",
      notLiveGrammar: "এইটা এখনো না।",
      loading: "অপেক্ষা করুন…",
      telc: "TELC B1",
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
