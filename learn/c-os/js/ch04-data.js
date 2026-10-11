window.C_OS_CHAPTER = {
  id: "ch04",
  drills: [
    {
      id: "c01", kind: "predict", group: "== vs = and branches", title: "Zero branch",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 0;\n  if (x == 0) {\n    printf(\"zero\\n\");\n  } else {\n    printf(\"not\\n\");\n  }\n  return 0;\n}",
      hint: "Test is true. if body only.",
      accept: ["zero"],
      shortWhy: "zero. else does not run.",
      answerCode: "int x = 0;\nif (x == 0) {        /* true */\n  printf(\"zero\\n\"); /* this */\n} else {\n  printf(\"not\\n\");  /* skip */\n}\n/* Output:\nzero\n*/",
      answerWhy: "One branch. Trace the test first, then only that body."
    },
    {
      id: "c02", kind: "predict", group: "== vs = and branches", title: "Else",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 2;\n  if (x == 0) {\n    printf(\"zero\\n\");\n  } else {\n    printf(\"not\\n\");\n  }\n  return 0;\n}",
      hint: "2 == 0 is false.",
      accept: ["not"],
      shortWhy: "not. else body.",
      answerCode: "if (x == 0) { /* false because x is 2 */ }\nelse { printf(\"not\\n\"); }\n/* Output:\nnot\n*/",
      answerWhy: "False test → else. Never both."
    },
    {
      id: "c03", kind: "tf", group: "== vs = and branches", title: "Both bodies?",
      prompt: "In one process, can both the if body and the else body run for the same if/else?",
      hint: "One test, one winner.",
      accept: ["no"],
      shortWhy: "No. One branch per process per test.",
      answerCode: "/* fork is two processes, each with its own test result.\n   That is not one process running both bodies. */",
      answerWhy: "No. If you saw both prints after fork, you had two processes."
    },
    {
      id: "c04", kind: "fill", group: "== vs = and branches", title: "Test equal",
      prompt: "Which operator tests equality without writing the box? Type ==",
      hint: "Two equals signs.",
      accept: ["=="],
      shortWhy: "== tests. = writes.",
      answerCode: "if (r == 0) { /* test */ }\nr = 0;         /* write */",
      answerWhy: "== . Count the characters every time you type an if."
    },
    {
      id: "c05", kind: "tf", group: "== vs = and branches", title: "if (x = 0)",
      prompt: "Does if (x = 0) test whether x was 0, without changing x?",
      hint: "Single = writes 0 into x, then the test value is 0 (false).",
      accept: ["no"],
      shortWhy: "No. It assigns. The test becomes false. x is now 0.",
      answerCode: "if (x = 0) {     /* WRONG: writes 0, test is false */\n}\nif (x == 0) {    /* RIGHT */\n}",
      answerWhy: "No. This bug hides in if (r = 0) after fork: you destroy the pid and skip the child body."
    },
    {
      id: "c06", kind: "fill", group: "== vs = and branches", title: "Not equal",
      prompt: "Operator for ‘not equal’? Type !=",
      hint: "Bang equals.",
      accept: ["!="],
      shortWhy: "!=",
      answerCode: "if (fd != -1) { /* open worked */ }",
      answerWhy: "!= . if (p != NULL) before you open a pointer."
    },
    {
      id: "c07", kind: "predict", group: "== vs = and branches", title: "After if",
      prompt: "What prints? Two lines.",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 0;\n  if (x == 0) {\n    printf(\"A\\n\");\n  }\n  printf(\"B\\n\");\n  return 0;\n}",
      hint: "A in the if. B is after the if, so it always runs.",
      accept: ["A\nB", "A B"],
      shortWhy: "A then B. B is not inside the if.",
      answerCode: "if (x == 0) {\n  printf(\"A\\n\");  /* yes */\n}\nprintf(\"B\\n\");    /* always, after the if */\n/* Output:\nA\nB\n*/",
      answerWhy: "Lines after the closing brace always run (unless you return inside the if)."
    },
    {
      id: "c08", kind: "predict", group: "== vs = and branches", title: "return in if",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int fd = -1;\n  if (fd == -1) {\n    printf(\"fail\\n\");\n    return 1;\n  }\n  printf(\"ok\\n\");\n  return 0;\n}",
      hint: "return 1 ends main. ok never prints.",
      accept: ["fail"],
      shortWhy: "fail. Then main ends with code 1.",
      answerCode: "if (fd == -1) {\n  printf(\"fail\\n\");\n  return 1;     /* main ENDS */\n}\nprintf(\"ok\\n\"); /* dead */\n/* Output:\nfail\n*/",
      answerWhy: "Error ifs in labs return. Later lines are for the success path only."
    },
    {
      id: "c09", kind: "tf", group: "== vs = and branches", title: "if (3)",
      prompt: "Is if (3) treated as true in C?",
      hint: "Non-zero is true.",
      accept: ["yes"],
      shortWhy: "Yes. Prefer a real comparison anyway.",
      answerCode: "if (3) { /* runs */ }\nif (0) { /* skipped */ }",
      answerWhy: "Yes. if (p) is ‘if p is not NULL’. if (r) is a sloppy fork test; write r == 0 / r > 0."
    },
    {
      id: "c10", kind: "tf", group: "== vs = and branches", title: "Braces",
      prompt: "Should you use { } even when the if body is one line, especially in OS labs?",
      hint: "wait() on the next line is the trap.",
      accept: ["yes"],
      shortWhy: "Yes. Braces keep wait/lock in the branch you meant.",
      answerCode: "if (r > 0) {\n  wait(NULL);   /* parent only, because braces */\n}",
      answerWhy: "Yes. Without braces, only the next statement is in the if."
    },
    {
      id: "c11", kind: "predict", group: "OS door · fork ifs", title: "Child test",
      prompt: "r is 0. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int r = 0;\n  if (r == 0) {\n    printf(\"child\\n\");\n  } else if (r > 0) {\n    printf(\"parent\\n\");\n  } else {\n    printf(\"fail\\n\");\n  }\n  return 0;\n}",
      hint: "This is the child’s value from fork.",
      accept: ["child"],
      shortWhy: "child. r == 0.",
      answerCode: "int r = 0;          /* child after fork */\nif (r == 0) {\n  printf(\"child\\n\");\n}\n/* Output:\nchild\n*/",
      answerWhy: "Memorise: 0 child, >0 parent, -1 fail. One process, one print."
    },
    {
      id: "c12", kind: "predict", group: "OS door · fork ifs", title: "Parent test",
      prompt: "r is 412. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int r = 412;\n  if (r == 0) {\n    printf(\"child\\n\");\n  } else if (r > 0) {\n    printf(\"parent\\n\");\n  } else {\n    printf(\"fail\\n\");\n  }\n  return 0;\n}",
      hint: "Positive pid → parent.",
      accept: ["parent"],
      shortWhy: "parent. r > 0.",
      answerCode: "int r = 412;  /* child's pid, in the parent */\nelse if (r > 0) printf(\"parent\\n\");\n/* Output:\nparent\n*/",
      answerWhy: "The number 412 is data. The branch is ‘positive’."
    },
    {
      id: "c13", kind: "predict", group: "OS door · fork ifs", title: "Fail test",
      prompt: "r is -1. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int r = -1;\n  if (r == 0) {\n    printf(\"child\\n\");\n  } else if (r > 0) {\n    printf(\"parent\\n\");\n  } else {\n    printf(\"fail\\n\");\n  }\n  return 0;\n}",
      hint: "-1 is not 0 and not > 0.",
      accept: ["fail"],
      shortWhy: "fail. else branch.",
      answerCode: "int r = -1;\nelse { printf(\"fail\\n\"); }\n/* Output:\nfail\n*/",
      answerWhy: "Always keep the fail branch. Silent fail looks like ‘fork did nothing’."
    },
    {
      id: "c14", kind: "tf", group: "OS door · fork ifs", title: "Two processes",
      prompt: "After a successful fork, is it true that one process takes the r==0 branch and the other takes r>0?",
      hint: "Two boxes named r, two values, two if traces.",
      accept: ["yes"],
      shortWhy: "Yes. Two processes, two tests, two bodies. Not one process both.",
      answerCode: "pid_t r = fork();\n/* child process:  r == 0  → first body\n   parent process: r > 0   → second body */",
      answerWhy: "Yes. That is why both prints can appear on the terminal."
    },
    {
      id: "c15", kind: "fill", group: "OS door · fork ifs", title: "Child condition",
      prompt: "Write the test used for the child: r == 0  (spaces optional).",
      hint: "r equals equals zero.",
      accept: ["r == 0", "r==0"],
      shortWhy: "r == 0 is the child.",
      answerCode: "if (r == 0) { /* child */ }",
      answerWhy: "Not if (r). r could be a pid (true) and you would think you were the child."
    },
    {
      id: "c16", kind: "tf", group: "OS door · fork ifs", title: "Store r",
      prompt: "If you write if (fork() == 0) without storing the return, does the parent lose the child’s pid for waitpid?",
      hint: "The pid was the return value. You did not put it in a box.",
      accept: ["yes"],
      shortWhy: "Yes. Prefer pid_t r = fork(); then if (r == 0).",
      answerCode: "pid_t r = fork();\nif (r == 0) { ... }\nelse if (r > 0) { waitpid(r, NULL, 0); }",
      answerWhy: "Yes. A box named r is Chapter 2 serving Chapter 4 and 7."
    },
    {
      id: "c17", kind: "tf", group: "Error ifs", title: "fd fail",
      prompt: "Is if (fd == -1) the usual test that shm_open/open failed?",
      hint: "-1 is the error int.",
      accept: ["yes"],
      shortWhy: "Yes. Then perror and return 1.",
      answerCode: "if (fd == -1) {\n  perror(\"shm_open\");\n  return 1;\n}",
      answerWhy: "Yes. Pointers use NULL / MAP_FAILED. Ints use -1. Same if shape."
    },
    {
      id: "c18", kind: "fill", group: "Error ifs", title: "NULL test",
      prompt: "Test that paper p is usable: p != NULL  Type that.",
      hint: "Not equal NULL.",
      accept: ["p != NULL", "p!=NULL"],
      shortWhy: "p != NULL before *p.",
      answerCode: "if (p != NULL) {\n  *p = 1;\n}",
      answerWhy: "Chapter 4 test, Chapter 8 open. Both required."
    },
    {
      id: "c19", kind: "tf", group: "Error ifs", title: "Mutex is not if",
      prompt: "To lock a mutex, should you write if (m) instead of pthread_mutex_lock(&m)?",
      hint: "Lock is a function call that waits. Not a boolean you test once.",
      accept: ["no"],
      shortWhy: "No. Call lock(&m). Do not if the mutex object.",
      answerCode: "pthread_mutex_lock(&m);   /* wait inside this CALL */\n/* if (m) {  not how locking works */",
      answerWhy: "No. Choice (this chapter) is not the same as waiting in a call (Chapter 7)."
    },
    {
      id: "c20", kind: "write", group: "Error ifs", title: "Write child if",
      prompt: "Write if (r == 0) { printf(\"c\\n\"); } including braces.",
      hint: "if (r == 0) { printf(\"c\\n\"); }",
      must: ["if", "r==0", "printf"],
      shortWhy: "The child branch as C.",
      answerCode: "if (r == 0) {          /* test: am I the child? */\n  printf(\"c\\n\");       /* only the child process prints this */\n}",
      answerWhy: "Braces. == . Print is optional in labs; the test is not."
    },
    {
      id: "c21", kind: "predict", group: "Error ifs", title: "&&",
      prompt: "x=1, y=1. if (x == 1 && y == 1) prints T else F. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 1, y = 1;\n  if (x == 1 && y == 1) printf(\"T\\n\");\n  else printf(\"F\\n\");\n  return 0;\n}",
      hint: "Both true.",
      accept: ["T"],
      shortWhy: "T. && needs both.",
      answerCode: "if (x == 1 && y == 1)  /* both true */\n  printf(\"T\\n\");\n/* Output: T */",
      answerWhy: "&& : both. || : at least one. if (r > 0 && fd != -1) is a lab line."
    },
    {
      id: "c22", kind: "predict", group: "Error ifs", title: "&& fail",
      prompt: "x=1, y=0. Same if as last. What prints, T or F?",
      code: "int x = 1, y = 0;\nif (x == 1 && y == 1) printf(\"T\\n\");\nelse printf(\"F\\n\");",
      hint: "y == 1 is false. && fails.",
      accept: ["F"],
      shortWhy: "F.",
      answerCode: "x == 1  → true\ny == 1  → false\ntrue && false → false → else → F",
      answerWhy: "One false kills &&."
    },
    {
      id: "c23", kind: "predict", group: "Error ifs", title: "flag",
      prompt: "got is 1. if (got == 1) prints yes. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int got = 1;\n  if (got == 1) printf(\"yes\\n\");\n  else printf(\"no\\n\");\n  return 0;\n}",
      hint: "Handler already set the flag.",
      accept: ["yes"],
      shortWhy: "yes. Flag is on.",
      answerCode: "int got = 1;  /* handler did got = 1 */\nif (got == 1) printf(\"yes\\n\");\n/* Output: yes */",
      answerWhy: "main’s loop will be while (got == 0) in Chapter 5. Same test, repeated."
    },
    {
      id: "c24", kind: "tf", group: "Error ifs", title: "else optional",
      prompt: "Can you write if without else?",
      hint: "If false, you just skip the body.",
      accept: ["yes"],
      shortWhy: "Yes. Error checks often have no else: if fail, return; then success path.",
      answerCode: "if (fd == -1) return 1;\n/* no else. success continues here */",
      answerWhy: "Yes. else is optional. The fork chain uses else if because the three cases split."
    },
    {
      id: "c25", kind: "write", group: "Error ifs", title: "fd check",
      prompt: "Write if (fd == -1) { return 1; }",
      hint: "Test -1, return failure.",
      must: ["if", "fd==-1", "return 1"],
      shortWhy: "Fail path after a bad fd.",
      answerCode: "if (fd == -1) {   /* open/shm_open failed */\n  return 1;        /* int 1 to the OS */\n}",
      answerWhy: "You may add perror before return. The test is the point of this chapter."
    },
    {
      id: "c26", kind: "fill", group: "Error ifs", title: "Greater",
      prompt: "Parent test: r greater than 0. Type r > 0",
      hint: "r space > space 0, spaces optional.",
      accept: ["r > 0", "r>0"],
      shortWhy: "r > 0 is parent after successful fork.",
      answerCode: "else if (r > 0) { wait(NULL); }",
      answerWhy: "r > 0, not r >= 0 (that would steal the child, because 0 >= 0)."
    }
  ]
};
