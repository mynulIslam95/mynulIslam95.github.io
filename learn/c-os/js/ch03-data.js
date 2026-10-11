window.C_OS_CHAPTER = {
  id: "ch03",
  drills: [
    {
      id: "i01", kind: "predict", group: "printf holes", title: "One int",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 5;\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "%d is a hole for the int 5. Then newline.",
      accept: ["5"],
      shortWhy: "5. The format is not printed as the letters %d.",
      answerCode: "int x = 5;\nprintf(\"%d\\n\", x);  /* hole %d filled with 5, then newline */\n/* Output:\n5\n*/",
      answerWhy: "The string \"%d\\n\" is instructions. The value after the comma is 5."
    },
    {
      id: "i02", kind: "predict", group: "printf holes", title: "Label plus number",
      prompt: "What prints? Include the word pid=",
      code: "#include <stdio.h>\nint main(void) {\n  int r = 42;\n  printf(\"pid=%d\\n\", r);\n  return 0;\n}",
      hint: "Text copied, hole filled.",
      accept: ["pid=42"],
      shortWhy: "pid=42",
      answerCode: "printf(\"pid=%d\\n\", r);  /* pid= then 42 then newline */\n/* Output:\npid=42\n*/",
      answerWhy: "This is how you print fork’s return in a lab."
    },
    {
      id: "i03", kind: "predict", group: "printf holes", title: "Two holes",
      prompt: "What prints? Two numbers, space between.",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"%d %d\\n\", 2, 7);\n  return 0;\n}",
      hint: "First hole 2, second hole 7.",
      accept: ["2 7"],
      shortWhy: "2 7",
      answerCode: "printf(\"%d %d\\n\", 2, 7);\n/* Output:\n2 7\n*/",
      answerWhy: "Order of values matches order of holes."
    },
    {
      id: "i04", kind: "tf", group: "printf holes", title: "Format is not the value",
      prompt: "Does printf(\"%d\\n\", x) print the characters %d when x is 5?",
      hint: "%d is a hole. It is replaced.",
      accept: ["no"],
      shortWhy: "No. It prints 5.",
      answerCode: "printf(\"%d\\n\", 5);  /* prints 5, not %d */",
      answerWhy: "No. If you want to print a percent sign, use %%."
    },
    {
      id: "i05", kind: "fill", group: "printf holes", title: "Int hole",
      prompt: "Which two-character hole prints an int? Type %d",
      hint: "Percent d.",
      accept: ["%d"],
      shortWhy: "%d for int: pid, count, fd.",
      answerCode: "printf(\"%d\\n\", pid);",
      answerWhy: "%d. Not %s (that is a string)."
    },
    {
      id: "i06", kind: "fill", group: "printf holes", title: "Newline",
      prompt: "Which two characters start a new line in a format string? Type \\n as you would in C source: \\n",
      hint: "Backslash n. In the answer box type \\n",
      accept: ["\\n", "\\n"],
      shortWhy: "\\n is newline.",
      answerCode: "printf(\"A\\nB\\n\");\n/* Output:\nA\nB\n*/",
      answerWhy: "\\n is one newline. Without it, the next print sticks to the same line."
    },
    {
      id: "i07", kind: "predict", group: "printf holes", title: "No newline glue",
      prompt: "What prints? One line, no space between A and B.",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"A\");\n  printf(\"B\\n\");\n  return 0;\n}",
      hint: "First print has no newline.",
      accept: ["AB"],
      shortWhy: "AB on one line.",
      answerCode: "printf(\"A\");     /* no \\n */\nprintf(\"B\\n\");   /* B then newline */\n/* Output:\nAB\n*/",
      answerWhy: "Newline is not automatic. You asked for it with \\n."
    },
    {
      id: "i08", kind: "tf", group: "printf holes", title: "Need stdio",
      prompt: "Do you need #include <stdio.h> to call printf in the usual way?",
      hint: "Chapter 1 and 10.",
      accept: ["yes"],
      shortWhy: "Yes. Header for the compiler.",
      answerCode: "#include <stdio.h>\nprintf(\"ok\\n\");",
      answerWhy: "Yes. Missing it is a compile warning/error, not a logic bug."
    },
    {
      id: "i09", kind: "tf", group: "printf holes", title: "Who waits",
      prompt: "Does main wait until printf has finished before the next line runs?",
      hint: "Normal call. Chapter 7 in miniature.",
      accept: ["yes"],
      shortWhy: "Yes. Caller waits.",
      answerCode: "printf(\"A\\n\");  /* main waits */\nprintf(\"B\\n\");  /* then this */",
      answerWhy: "Yes. Printing is a function call."
    },
    {
      id: "i10", kind: "predict", group: "printf holes", title: "After assign",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 1;\n  x = 4;\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "Print sees the box now, which is 4.",
      accept: ["4"],
      shortWhy: "4. Print after replace.",
      answerCode: "int x = 1;\nx = 4;\nprintf(\"%d\\n\", x);  /* 4 */",
      answerWhy: "Order: last assignment, then print. Not a snapshot of the first value."
    },
    {
      id: "i11", kind: "tf", group: "scanf", title: "Address",
      prompt: "Must scanf(\"%d\", &x) use the address of x so scanf can write the box?",
      hint: "It must know where the box lives.",
      accept: ["yes"],
      shortWhy: "Yes. &x is the paper. Chapter 8 names this.",
      answerCode: "int x;\nscanf(\"%d\", &x);  /* NOT scanf(\"%d\", x) */",
      answerWhy: "Yes. Forgetting & is the classic crash. You already pass a paper so another function can write your box."
    },
    {
      id: "i12", kind: "fill", group: "scanf", title: "scanf argument",
      prompt: "Fill the second argument: scanf(\"%d\", ____); for an int named x.",
      hint: "Address of x.",
      accept: ["&x"],
      shortWhy: "&x.",
      answerCode: "int x;\nscanf(\"%d\", &x);  /* paper to the box */",
      answerWhy: "&x. Same shape as bump_box(&x) in Chapter 8."
    },
    {
      id: "i13", kind: "tf", group: "scanf", title: "scanf waits",
      prompt: "Does scanf make main wait until input is available (or fails)?",
      hint: "Caller waits. Input is slower than a sum.",
      accept: ["yes"],
      shortWhy: "Yes. main is frozen in the call.",
      answerCode: "scanf(\"%d\", &x);  /* wait for a number */\nprintf(\"%d\\n\", x); /* after scanf returns */",
      answerWhy: "Yes. Waiting is not unique to waitpid. Any call can wait for work."
    },
    {
      id: "i14", kind: "tf", group: "perror", title: "perror is a call",
      prompt: "Is perror(\"shm_open\") a function you call to print why the last OS call failed?",
      hint: "stdio.h. Label plus OS reason.",
      accept: ["yes"],
      shortWhy: "Yes. After fd == -1, call perror, then return 1.",
      answerCode: "if (fd == -1) {\n  perror(\"shm_open\");  /* print reason */\n  return 1;\n}",
      answerWhy: "Yes. Built but failed at run time. Not a missing -lrt (that was compile/link)."
    },
    {
      id: "i15", kind: "write", group: "perror", title: "Print a pid",
      prompt: "Write one printf that prints pid= then an int named r then newline. Use %d.",
      hint: "printf(\"pid=%d\\n\", r);",
      must: ["printf", "pid=", "%d", "r"],
      shortWhy: "Label plus %d plus r.",
      answerCode: "printf(\"pid=%d\\n\", r);  /* in: format, then int r\n                           back: char count (often ignored)\n                           who waits: main */",
      answerWhy: "Match %d to an int. Do not pass a pointer here."
    },
    {
      id: "i16", kind: "predict", group: "OS door", title: "Print after fork-shaped ints",
      prompt: "r is 0. What does printf(\"%d\\n\", r); print?",
      code: "int r = 0;\nprintf(\"%d\\n\", r);",
      hint: "The box is 0. That is the child’s fork return in Ch7.",
      accept: ["0"],
      shortWhy: "0. Printing does not change the meaning. The box is 0.",
      answerCode: "int r = 0;           /* child side of fork, later */\nprintf(\"%d\\n\", r);   /* 0 */",
      answerWhy: "Print shows the box. if (r == 0) is Chapter 4. Same 0."
    },
    {
      id: "i17", kind: "tf", group: "OS door", title: "Print the paper?",
      prompt: "If p is a pointer to an int that holds 7, should you print the pin/count with printf(\"%d\\n\", *p) rather than printing p as %d?",
      hint: "Print the box, not the address, for a count.",
      accept: ["yes"],
      shortWhy: "Yes. *p is the int. p is the paper.",
      answerCode: "printf(\"%d\\n\", *p);  /* the shared count */\n/* printf(\"%d\\n\", p);  wrong hole for a pointer */",
      answerWhy: "Yes. GPIO/mmap: print the register value through the pointer, or you debug an address."
    },
    {
      id: "i18", kind: "predict", group: "OS door", title: "Two prints",
      prompt: "What prints? Two lines.",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"%d\\n\", 1);\n  printf(\"%d\\n\", 2);\n  return 0;\n}",
      hint: "Two calls, two lines.",
      accept: ["1\n2", "1 2"],
      shortWhy: "1 then 2.",
      answerCode: "printf(\"%d\\n\", 1);\nprintf(\"%d\\n\", 2);\n/* Output:\n1\n2\n*/",
      answerWhy: "Each \\n ends a line. Type 1 2 if the box is one line; both are accepted."
    },
    {
      id: "i19", kind: "fill", group: "OS door", title: "String hole",
      prompt: "Which hole prints a string? Type %s",
      hint: "Percent s.",
      accept: ["%s"],
      shortWhy: "%s. You will print names like /myshm rarely; you pass them to shm_open.",
      answerCode: "printf(\"%s\\n\", \"/myshm\");  /* Output: /myshm */",
      answerWhy: "%s needs a paper to characters (Chapter 6). Not %d."
    },
    {
      id: "i20", kind: "tf", group: "OS door", title: "Mismatch",
      prompt: "Is it wrong to use %d for a string (a paper to characters)?",
      hint: "Undefined behaviour. Match the hole.",
      accept: ["yes"],
      shortWhy: "Yes. Wrong hole. Match types.",
      answerCode: "printf(\"%s\\n\", \"/myshm\");  /* right */\n/* printf(\"%d\\n\", \"/myshm\");  wrong */",
      answerWhy: "Yes. The compiler may warn. The run can look insane. Match %d to int."
    },
    {
      id: "i21", kind: "write", group: "OS door", title: "Hello printf",
      prompt: "Inside main, write printf(\"ok\\n\"); only that call.",
      hint: "printf(\"ok\\n\");",
      must: ["printf", "ok"],
      shortWhy: "A call with a format and no extra holes.",
      answerCode: "printf(\"ok\\n\");  /* no %d because no extra value */",
      answerWhy: "You can print plain text with no holes. Holes only when you inject a box."
    },
    {
      id: "i22", kind: "predict", group: "OS door", title: "Literal",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"SIGUSR1\\n\");\n  return 0;\n}",
      hint: "Plain text. Not a hole.",
      accept: ["SIGUSR1"],
      shortWhy: "SIGUSR1. This only prints letters. It does not send a signal.",
      answerCode: "printf(\"SIGUSR1\\n\");\n/* Output:\nSIGUSR1\n*/\n/* kill(pid, SIGUSR1) is a different function — Ch7 */",
      answerWhy: "Printing a name does not call kill. Do not mix print with sending."
    },
    {
      id: "i23", kind: "tf", group: "OS door", title: "printf vs return",
      prompt: "Does printf send its number back to the OS as the program’s exit code?",
      hint: "printf’s return is a character count, often ignored. main’s return 0 is the exit code.",
      accept: ["no"],
      shortWhy: "No. return 0 is the exit code. printf just prints.",
      answerCode: "printf(\"%d\\n\", 5);  /* prints 5. does not make exit code 5 */\nreturn 0;            /* THIS is the exit code */",
      answerWhy: "No. Mixing print and return is a Chapter 1/3 trap."
    },
    {
      id: "i24", kind: "fill", group: "OS door", title: "perror name",
      prompt: "Which function prints an OS error after a failed call? Type perror",
      hint: "Starts with p, used next to shm_open fail.",
      accept: ["perror"],
      shortWhy: "perror.",
      answerCode: "perror(\"mmap\");  /* label mmap: then the OS text */",
      answerWhy: "perror. Include stdio.h. Call it when the return was -1 or MAP_FAILED."
    }
  ]
};
