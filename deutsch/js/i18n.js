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
      telc: "TELC B1",
      telcKicker: "Exam",
      telcCard: "Lesen, Hören, Schreiben, Sprechen. One paper at a time.",
      portfolio: "Portfolio"
    },
    bn: {
      brand: "জার্মান শেখার ঘর",
      explain: "অর্থ দেখো",
      langHint: "জার্মান লেখার অর্থ ইংরেজি বা বাংলায় দেখতে পারো। নিচে ভাষা বেছে নাও।",
      homeLede: "তোমার লেভেল বেছে নিয়ে শুরু করো। প্রতিটি লেভেলে শব্দ, গল্প আর ব্যাকরণ শেখার সুযোগ আছে।",
      homeCard: "এই লেভেলের শব্দ, গল্প আর ব্যাকরণ এক জায়গায়।",
      wordsN: "{n}টি শব্দ",
      storiesN: "{n}টি গল্প",
      grammarN: "{n}টি অধ্যায়",
      allLevels: "সব লেভেল",
      level: "লেভেল {lv}",
      levelLede: "নতুন শব্দ শেখো, গল্প পড়ো আর ব্যাকরণ চর্চা করো। যেটা দিয়ে শুরু করতে চাও, বেছে নাও।",
      words: "শব্দ",
      stories: "গল্প",
      grammar: "ব্যাকরণ",
      wordsLive: "{n}টি শব্দ",
      storiesNumbered: "{n}টি গল্প",
      chaptersN: "{n}টি অধ্যায়",
      wordsCard: "der, die, das আর ক্রিয়ার আলাদা তালিকা আছে। ক্রিয়ার বিভিন্ন রূপও দেখে নিতে পারো।",
      storiesCard: "লেভেল {lv}-এর গল্পগুলো শুরু থেকে পড়তে পারো। চাইলে পছন্দের বিষয়ও বেছে নিতে পারো।",
      grammarCard: "লেভেল {lv}-এর ব্যাকরণ ধাপে ধাপে শেখো। প্রতিটি অধ্যায়ে উদাহরণ আর অনুশীলন আছে।",
      wordsTitle: "লেভেল {lv} · শব্দ",
      wordsLede: "এই লেভেলে {n}টি শব্দ আছে। কোন ধরনের শব্দ শিখতে চাও, বেছে নাও।",
      wordsCatLede: "{n}টি শব্দ{done} বড় বা ছোট হাতের অক্ষর আর বাক্যের শেষের দাঁড়ি নিয়ে ভাবতে হবে না।",
      wordsDone: "। এর মধ্যে {n}টির অনুশীলন শেষ হয়েছে।",
      noWords: "এই বিভাগে এখনো কোনো শব্দ নেই।",
      notLiveWord: "এই শব্দের অনুশীলন এখনো চালু হয়নি।",
      copyOf: "শব্দটি লেখো · ১০ বারের মধ্যে {a} বার",
      sentOf: "বাক্যটি লেখো · ৩ বারের মধ্যে {a} বার",
      typeWord: "জার্মান শব্দটি এখানে লেখো",
      typeSent: "জার্মান বাক্যটি এখানে লেখো",
      success: "দারুণ! শব্দ আর বাক্য, দুটোর অনুশীলনই শেষ করেছ।",
      nextWord: "পরের শব্দ",
      backGroup: "শব্দের তালিকায় ফিরে যাও",
      notYetSee: "এখনো মেলেনি। ওপরের লেখাটা আরেকবার দেখে লিখে চেষ্টা করো।",
      check: "উত্তর মিলিয়ে দেখো",
      allForms: "এই ক্রিয়ার সব রূপ",
      storiesTitle: "লেভেল {lv} · গল্প",
      storiesLede: "এখানে {n}টি গল্প আছে। প্রথম গল্প থেকে শুরু করতে পারো, অথবা পছন্দের বিষয় বেছে নিতে পারো।",
      storiesGroupLede: "এই বিষয়ের ওপর {n}টি গল্প আছে।",
      storyMeta: "গল্প {n}/{total} · লেভেল {lv}",
      storyHelp: "কোনো জার্মান লাইনের অর্থ জানতে লাইনে চাপ দাও। আবার চাপ দিলে অর্থ আড়াল হবে।",
      hideLine: "অর্থ আড়াল করো",
      showFull: "পুরো গল্পের অর্থ দেখো",
      hideFull: "পুরো গল্পের অর্থ আড়াল করো",
      notLiveStory: "এই গল্পটি এখনো পড়ার জন্য খোলা হয়নি।",
      grammarTitle: "লেভেল {lv} · ব্যাকরণ",
      grammarLede: "এই লেভেলে {n}টি অধ্যায় আছে। শুরু থেকে পড়লে ধাপে ধাপে বুঝতে সুবিধা হবে। চাইলে নির্দিষ্ট বিষয়ও বেছে নিতে পারো।",
      grammarGroupLede: "এই বিষয়ের ওপর {n}টি অধ্যায় আছে।",
      chapterMeta: "অধ্যায় {n}/{total} · লেভেল {lv}",
      examples: "উদাহরণ",
      practice: "এবার নিজে চেষ্টা করো",
      practiceLede: "শূন্যস্থানে সঠিক উত্তর লেখো। দুবার ভুল হলে উত্তরটি দেখানো হবে।",
      questionN: "প্রশ্ন {a}/{b}",
      correct: "ঠিক হয়েছে! {en}",
      answerIs: "সঠিক উত্তর: {a}। {en}",
      notYetTry: "এখনো ঠিক হয়নি। আরেকবার চেষ্টা করো।",
      notLiveGrammar: "এই অধ্যায়টি এখনো পড়ার জন্য খোলা হয়নি।",
      loading: "একটু অপেক্ষা করো, পাতা খুলছে…",
      telc: "TELC B1",
      telcKicker: "পরীক্ষার প্রস্তুতি",
      telcCard: "পড়া, শোনা, লেখা আর কথা বলার অনুশীলন। একবারে একটি অংশ নিয়ে এগোও।",
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
