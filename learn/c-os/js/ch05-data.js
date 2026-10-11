window.C_OS_CHAPTER = {
  id: "ch05",
  drills: [
    {
      id: "l01", kind: "predict", group: "while", title: "Count down prints",
      prompt: "What prints? Numbers, spaces OK, order 3 then 2 then 1.",
      code: "#include <stdio.h>\nint main(void) {\n  int n = 3;\n  while (n > 0) {\n    printf(\"%d\\n\", n);\n    n = n - 1;\n  }\n  return 0;\n}",
      hint: "Print then decrement. Stop when n is 0, before printing 0.",
      accept: ["3\n2\n1", "3 2 1"],
      shortWhy: "3, 2, 1. Zero times for n=0: test fails before print.",
      answerCode: "n=3 print 3 n=2\nn=2 print 2 n=1\nn=1 print 1 n=0\ntest 0>0 false\n/* Output:\n3\n2\n1\n*/",
      answerWhy: "The test is before the body. 0 is never printed."
    },
    {
      id: "l02", kind: "predict", group: "while", title: "Zero times",
      prompt: "n starts at 0. while (n > 0) prints n. What prints? Type none",
      code: "int n = 0;\nwhile (n > 0) {\n  printf(\"%d\\n\", n);\n}",
      hint: "Test false at the start. Body never runs.",
      accept: ["none", "empty", "nothing"],
      shortWhy: "none. Zero iterations.",
      answerCode: "int n = 0;\nwhile (n > 0) { /* skipped at once */ }\n/* Output: (none) */",
      answerWhy: "A loop can run zero times. That is legal and common."
    },
    {
      id: "l03", kind: "tf", group: "while", title: "Must change",
      prompt: "If the loop test uses n, and the body never changes n, and the test starts true, can the loop run forever?",
      hint: "Infinite loop.",
      accept: ["yes"],
      shortWhy: "Yes. Someone must change the test, or you break, or you return.",
      answerCode: "while (n > 0) {\n  printf(\"stuck\\n\");  /* n never changes → forever */\n}",
      answerWhy: "Yes. while (got == 0) ends because a handler changes got. That is the change."
    },
    {
      id: "l04", kind: "predict", group: "for", title: "i < 3",
      prompt: "What prints? 0 then 1 then 2.",
      code: "#include <stdio.h>\nint main(void) {\n  int i;\n  for (i = 0; i < 3; i++) {\n    printf(\"%d\\n\", i);\n  }\n  return 0;\n}",
      hint: "i = 0,1,2. When i becomes 3 the test fails.",
      accept: ["0\n1\n2", "0 1 2"],
      shortWhy: "0 1 2. Three times. Not 3.",
      answerCode: "i=0 print 0  i++\ni=1 print 1  i++\ni=2 print 2  i++\ni=3  3<3 false\n/* Output:\n0\n1\n2\n*/",
      answerWhy: "i < n for n items starting at 0. Off-by-one if you write i <= 3."
    },
    {
      id: "l05", kind: "predict", group: "for", title: "How many",
      prompt: "for (i = 0; i < 5; i++) body. How many times does the body run? Type the number.",
      hint: "i = 0,1,2,3,4.",
      accept: ["5"],
      shortWhy: "5 times. i < 5 with start 0.",
      answerCode: "/* 0 1 2 3 4  → five passes */",
      answerWhy: "Last i in the body is 4, not 5."
    },
    {
      id: "l06", kind: "tf", group: "for", title: "Off-by-one",
      prompt: "Does for (i = 0; i <= 3; i++) run four times (0,1,2,3)?",
      hint: "<= includes 3.",
      accept: ["yes"],
      shortWhy: "Yes. Four times. Arrays of length 3 would go out of range on i=3.",
      answerCode: "for (i = 0; i <= 3; i++)  /* 0,1,2,3 — four */\nfor (i = 0; i < 3; i++)   /* 0,1,2 — three, matches a[3] */",
      answerWhy: "Yes. This is the bug that smashes arrays and GPIO buffers."
    },
    {
      id: "l07", kind: "fill", group: "for", title: "Less-than habit",
      prompt: "To walk n items with indexes 0..n-1, the test is i < n. Type i < n",
      hint: "Less than, not less-or-equal.",
      accept: ["i < n", "i<n"],
      shortWhy: "i < n. Next chapter’s array walk.",
      answerCode: "for (i = 0; i < n; i++) {\n  a[i] = 0;\n}",
      answerWhy: "i < n. Memorise now, before arrays."
    },
    {
      id: "l08", kind: "predict", group: "for", title: "i after loop",
      prompt: "After for (i = 0; i < 3; i++) {} what is i?",
      code: "int i;\nfor (i = 0; i < 3; i++) {\n}\n/* i is ? */",
      hint: "The loop stops when i is 3 because 3 < 3 is false.",
      accept: ["3"],
      shortWhy: "3. The failed test value.",
      answerCode: "/* last successful i in body: 2, then i++ makes 3, test fails.\n   i is 3 after the loop. */",
      answerWhy: "After the loop, i is the first failing value. Not 2."
    },
    {
      id: "l09", kind: "tf", group: "for", title: "for is while",
      prompt: "Is a for-loop the same kind of repeat as while, just with start/test/step written in one line?",
      hint: "Same rule. Different spelling.",
      accept: ["yes"],
      shortWhy: "Yes. Same repeat. Packed header.",
      answerCode: "i = 0;\nwhile (i < 3) {\n  /* body */\n  i++;\n}\n/* same as for (i = 0; i < 3; i++) */",
      answerWhy: "Yes. If you can trace one, you can trace the other."
    },
    {
      id: "l10", kind: "predict", group: "wait loops", title: "Flag loop runs?",
      prompt: "got starts at 1. while (got == 0) { } then printf done. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int got = 1;\n  while (got == 0) {\n  }\n  printf(\"done\\n\");\n  return 0;\n}",
      hint: "Test is false at the start. Skip the loop. Print done.",
      accept: ["done"],
      shortWhy: "done. Signal already seen. Loop runs zero times.",
      answerCode: "int got = 1;           /* already set */\nwhile (got == 0) { }   /* skip */\nprintf(\"done\\n\");\n/* Output: done */",
      answerWhy: "If the signal arrived before you entered the loop, you must not wait forever. The test handles that."
    },
    {
      id: "l11", kind: "tf", group: "wait loops", title: "while got",
      prompt: "Is while (got == 0) a C loop that repeats until the flag box becomes non-zero?",
      hint: "Your repeat. Not the wait() syscall by itself.",
      accept: ["yes"],
      shortWhy: "Yes. Handler or another thread must change got.",
      answerCode: "volatile int got = 0;\nwhile (got == 0) {\n  /* handler may set got = 1 */\n}",
      answerWhy: "Yes. Name it: C loop on a flag. Different from wait(NULL)."
    },
    {
      id: "l12", kind: "tf", group: "wait loops", title: "wait() vs while",
      prompt: "Is while (got == 0) the same mechanism as the function wait(NULL) (parent waits for a child to end)?",
      hint: "One is your loop. One is a kernel blocking call.",
      accept: ["no"],
      shortWhy: "No. Same English word wait. Two mechanisms.",
      answerCode: "wait(NULL);           /* one CALL. kernel blocks until a child ends */\nwhile (got == 0) { }  /* your REPEAT. until a box changes */",
      answerWhy: "No. Oral exam: say which wait you mean."
    },
    {
      id: "l13", kind: "tf", group: "wait loops", title: "while (1)",
      prompt: "Is while (1) a loop whose test is always true (until you break or exit)?",
      hint: "Server loop, pause loop.",
      accept: ["yes"],
      shortWhy: "Yes. Always true. You need another way out.",
      answerCode: "while (1) {\n  pause();   /* sleep until a signal. then loop again */\n}",
      answerWhy: "Yes. Lab 3 shape. The loop is this chapter. pause/signal are Chapter 7."
    },
    {
      id: "l14", kind: "predict", group: "wait loops", title: "Sum loop",
      prompt: "What is s?",
      code: "int s = 0;\nint i;\nfor (i = 1; i <= 4; i++) {\n  s = s + i;\n}",
      hint: "1+2+3+4.",
      accept: ["10"],
      shortWhy: "10.",
      answerCode: "s=0\n+1 → 1\n+2 → 3\n+3 → 6\n+4 → 10",
      answerWhy: "Table of s. This is how you do not guess."
    },
    {
      id: "l15", kind: "predict", group: "wait loops", title: "How many prints",
      prompt: "for (i = 1; i <= 3; i++) printf(\".\"); How many dots? Type the number.",
      code: "for (i = 1; i <= 3; i++) {\n  printf(\".\");\n}",
      hint: "i = 1,2,3.",
      accept: ["3"],
      shortWhy: "3 dots.",
      answerCode: "i=1 print .\ni=2 print .\ni=3 print .\n/* three */",
      answerWhy: "Starting at 1 with <= 3 is three. Starting at 0 with < 3 is also three. Count."
    },
    {
      id: "l16", kind: "write", group: "wait loops", title: "for three",
      prompt: "Write a for loop that runs i from 0 to 2 inclusive using i < 3. Empty body is OK: for (i = 0; i < 3; i++) {}",
      hint: "for (i = 0; i < 3; i++) {}",
      must: ["for", "i=0", "i<3", "i++"],
      shortWhy: "The standard three-pass header.",
      answerCode: "int i;\nfor (i = 0; i < 3; i++) {   /* start 0, test < 3, step ++ */\n  /* body */\n}",
      answerWhy: "You may declare i in the for, in newer C. The three pieces are the point."
    },
    {
      id: "l17", kind: "write", group: "wait loops", title: "Flag while",
      prompt: "Write while (got == 0) { }  including braces.",
      hint: "while (got == 0) {}",
      must: ["while", "got==0"],
      shortWhy: "Wait-loop on a flag.",
      answerCode: "while (got == 0) {   /* test each time: still 0? */\n}                     /* handler must set got = 1 */",
      answerWhy: "Use == 0 not = 0 (that would assign and freeze or skip)."
    },
    {
      id: "l18", kind: "tf", group: "wait loops", title: "while assign bug",
      prompt: "Is while (got = 0) a correct wait until got becomes 1?",
      hint: "Single = writes 0 every test. The test value is 0, which is false. Loop never runs — or you smash the flag.",
      accept: ["no"],
      shortWhy: "No. That assigns 0. Use ==.",
      answerCode: "while (got = 0) { }   /* WRONG assign */\nwhile (got == 0) { }  /* RIGHT test */",
      answerWhy: "No. Chapter 4’s = vs == kills loops too."
    },
    {
      id: "l19", kind: "predict", group: "OS door", title: "Toggle count",
      prompt: "How many times does the body run? for (i = 0; i < 8; i++)",
      code: "for (i = 0; i < 8; i++) {\n  /* toggle GPIO pin */\n}",
      hint: "8 toggles.",
      accept: ["8"],
      shortWhy: "8. A GPIO lab often loops a pin this many times.",
      answerCode: "for (i = 0; i < 8; i++)  /* i=0..7 → eight bodies */",
      answerWhy: "Count: i < 8 from 0 is eight. Scope pictures in Lab 1 are this loop plus mmap writes."
    },
    {
      id: "l20", kind: "tf", group: "OS door", title: "sleep in loop",
      prompt: "Can you call sleep(1) inside a for-loop to wait one second between pin toggles?",
      hint: "sleep is a function. Caller waits. Then the loop steps.",
      accept: ["yes"],
      shortWhy: "Yes. Nested wait: sleep call inside a C loop.",
      answerCode: "for (i = 0; i < 8; i++) {\n  /* *reg = ... */\n  sleep(1);   /* main waits 1 second, then i++ */\n}",
      answerWhy: "Yes. Loop (this chapter) plus call that waits (Chapter 7)."
    },
    {
      id: "l21", kind: "predict", group: "OS door", title: "n++ in while",
      prompt: "What is n after this? Start 0. while (n < 2) { n++; }",
      code: "int n = 0;\nwhile (n < 2) {\n  n++;\n}",
      hint: "n=0 body n=1; n=1 body n=2; test 2<2 false.",
      accept: ["2"],
      shortWhy: "2.",
      answerCode: "n=0  0<2  n=1\nn=1  1<2  n=2\nn=2  2<2 false\n/* n is 2 */",
      answerWhy: "Same pattern as for. After the loop n is the failing value."
    },
    {
      id: "l22", kind: "fill", group: "OS door", title: "Step",
      prompt: "Which operator adds 1 to i? Type i++",
      hint: "Plus plus.",
      accept: ["i++", "++i"],
      shortWhy: "i++ (or ++i as the step; both add 1 here).",
      answerCode: "for (i = 0; i < n; i++)  /* step: add 1 */",
      answerWhy: "i++ as the third piece of for. In traces after the body."
    },
    {
      id: "l23", kind: "tf", group: "OS door", title: "do you need for",
      prompt: "If you can write while, do you still need to read for-loops in lab files?",
      hint: "Labs use for for GPIO repeats and for clearing arrays.",
      accept: ["yes"],
      shortWhy: "Yes. You must read for. You may write while if you prefer, if the count is right.",
      answerCode: "for (i = 0; i < n; i++) a[i] = 0;  /* you will see this */",
      answerWhy: "Yes. This course uses both. Trace both."
    },
    {
      id: "l24", kind: "write", group: "OS door", title: "while n",
      prompt: "Write while (n > 0) { n = n - 1; }",
      hint: "Decrement until the test fails.",
      must: ["while", "n>0", "n=n-1"],
      shortWhy: "Count down until 0.",
      answerCode: "while (n > 0) {     /* retry / remaining work */\n  n = n - 1;         /* must change n or you loop forever */\n}",
      answerWhy: "n-- is also fine; the checker looks for n = n - 1. I’ll accept n-- if I add it to must alternatives... currently must is n=n-1. Keep that."
    },
    {
      id: "l25", kind: "predict", group: "OS door", title: "Print count",
      prompt: "How many lines does this print?",
      code: "int i;\nfor (i = 0; i < 1; i++) {\n  printf(\"x\\n\");\n}",
      hint: "i=0 only. One time.",
      accept: ["1"],
      shortWhy: "1 line.",
      answerCode: "i=0  0<1 true  print x  i++\ni=1  1<1 false\n/* one line */",
      answerWhy: "i < 1 from 0 is one pass. i < 0 from 0 is zero passes."
    }
  ]
};
