window.C_OS_CHAPTER = {
  id: "ch01",
  drills: [
    {
      id: "a01", kind: "tf", group: "Source, compile, run", title: "Three things",
      prompt: "Is a .c file already the program the CPU runs, with no compile step?",
      hint: "The .c file is text. gcc builds a tool. Then you run the tool.",
      accept: ["no"],
      shortWhy: "No. Source is text. Compile builds the tool. Then you run.",
      answerCode: "/* hello.c  = SOURCE (text you edit)\n   gcc hello.c -o hello  = COMPILE (build the tool)\n   ./hello               = RUN (now main starts)\n*/",
      answerWhy: "No. If you edit the .c and only run an old tool, you run yesterday’s program."
    },
    {
      id: "a02", kind: "fill", group: "Source, compile, run", title: "Start name",
      prompt: "What is the function name the OS starts? One word.",
      hint: "Not the file name. The start function.",
      accept: ["main"],
      shortWhy: "The OS looks for main.",
      answerCode: "int main(void) {   /* START HERE. always this name. */\n  return 0;\n}",
      answerWhy: "main. File can be lab.c or gpio.c. The start function is still main."
    },
    {
      id: "a03", kind: "tf", group: "Source, compile, run", title: "File name vs main",
      prompt: "If the file is called lab.c, must the start function still be named main?",
      hint: "The OS does not start a function named lab.",
      accept: ["yes"],
      shortWhy: "Yes. File name is not the start name.",
      answerCode: "/* lab.c */\nint main(void) {   /* still main, not int lab(void) */\n  return 0;\n}",
      answerWhy: "Yes. Rename the file as you like. Do not rename main."
    },
    {
      id: "a04", kind: "fill", group: "Source, compile, run", title: "gcc output flag",
      prompt: "In gcc hello.c -o hello, what does -o mean? Two words: output name (or output).",
      hint: "The next word is the tool’s name.",
      accept: ["output name", "output", "output file", "the output name"],
      shortWhy: "-o sets the output (tool) name.",
      answerCode: "gcc hello.c -o hello\n/*        source   -o  tool name */",
      answerWhy: "-o hello means write the tool as hello, not as a.out."
    },
    {
      id: "a05", kind: "fill", group: "Source, compile, run", title: "Run here",
      prompt: "How do you run the tool hello in the current folder on Linux? Type ./hello",
      hint: "Dot slash, then the tool name.",
      accept: ["./hello"],
      shortWhy: "./hello runs the tool in this folder.",
      answerCode: "gcc hello.c -o hello\n./hello          /* RUN. main starts now */",
      answerWhy: "./ means this folder. Running hello.c as if it were a tool is wrong."
    },
    {
      id: "a06", kind: "tf", group: "Source, compile, run", title: "Run the text?",
      prompt: "Should you run the .c text file itself (./hello.c) as the usual way to start the program?",
      hint: "You run the compiled tool.",
      accept: ["no"],
      shortWhy: "No. Compile first, run the tool.",
      answerCode: "./hello      /* yes */\n./hello.c    /* no — that is the source text */",
      answerWhy: "No. The CPU runs the tool gcc wrote."
    },
    {
      id: "a07", kind: "tf", group: "Source, compile, run", title: "Edit then run old",
      prompt: "If you change hello.c and run ./hello without compiling again, are you running the new text?",
      hint: "The tool is a snapshot from the last successful compile.",
      accept: ["no"],
      shortWhy: "No. You must compile again after an edit.",
      answerCode: "/* 1 edit hello.c\n   2 gcc hello.c -o hello    ← required again\n   3 ./hello\n*/",
      answerWhy: "No. This is a common lab fail: ‘I changed it but the pin did the old thing.’"
    },
    {
      id: "a08", kind: "predict", group: "Order of lines", title: "A then B",
      prompt: "What prints? Two lines.",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"A\\n\");\n  printf(\"B\\n\");\n  return 0;\n}",
      hint: "main runs top to bottom. A then B.",
      accept: ["A\nB", "A B"],
      shortWhy: "A then B. Order of statements in main.",
      answerCode: "printf(\"A\\n\");  /* first */\nprintf(\"B\\n\");  /* second */\nreturn 0;        /* then stop */\n\n/* Output:\nA\nB\n*/",
      answerWhy: "Start at main. First printf, then second, then return. Not the #include line as ‘first print’."
    },
    {
      id: "a09", kind: "predict", group: "Order of lines", title: "return stops",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"A\\n\");\n  return 0;\n  printf(\"B\\n\");\n}",
      hint: "return ends main. The last printf is dead.",
      accept: ["A"],
      shortWhy: "A only. return 0 ends main. B never runs.",
      answerCode: "printf(\"A\\n\");  /* runs */\nreturn 0;        /* main ENDS. 0 goes to the OS */\nprintf(\"B\\n\");  /* dead */\n\n/* Output:\nA\n*/",
      answerWhy: "return does two jobs: send a number to the OS, and stop main."
    },
    {
      id: "a10", kind: "tf", group: "Order of lines", title: "Start at include?",
      prompt: "Does the program start by ‘running’ the #include line as the first action of main?",
      hint: "#include is for the compiler, before main ever runs.",
      accept: ["no"],
      shortWhy: "No. #include is compile-time. Run-time starts at main.",
      answerCode: "/* #include <stdio.h>  → compiler copies a header. not a run-time step.\n   int main(void) {     → THIS is where the CPU starts when you run.\n*/",
      answerWhy: "No. Mixing compile-time and run-time is Chapter 10’s cousin. Here: start = main."
    },
    {
      id: "a11", kind: "fill", group: "Order of lines", title: "Success code",
      prompt: "What integer does main usually return to mean ‘no error’? Type the number.",
      hint: "Zero.",
      accept: ["0"],
      shortWhy: "return 0 means success to the OS.",
      answerCode: "int main(void) {\n  return 0;   /* 0 = success, to the operating system */\n}",
      answerWhy: "0. Later fork returns -1 on fail. Same idea: 0 vs not 0."
    },
    {
      id: "a12", kind: "tf", group: "Order of lines", title: "Non-zero",
      prompt: "Does a non-zero return from main usually mean the program is reporting failure?",
      hint: "Shells test this. return 1 is a common fail.",
      accept: ["yes"],
      shortWhy: "Yes. Non-zero = failure by convention.",
      answerCode: "if (fd == -1) {\n  perror(\"open\");\n  return 1;   /* tell the OS: fail */\n}\nreturn 0;",
      answerWhy: "Yes. Labs return 1 after perror. That is this rule, not a special OS trick."
    },
    {
      id: "a13", kind: "tf", group: "The file’s shape", title: "Semicolon",
      prompt: "Does a statement like return 0 need a semicolon?",
      hint: "Without it gcc screams.",
      accept: ["yes"],
      shortWhy: "Yes. Semicolon ends the statement.",
      answerCode: "return 0;    /* the ; is required */\n/* return 0     compile error */",
      answerWhy: "Yes. Braces do not replace the semicolon on return."
    },
    {
      id: "a14", kind: "tf", group: "The file’s shape", title: "Two mains",
      prompt: "Can one program have two functions both named main?",
      hint: "The linker needs exactly one start point.",
      accept: ["no"],
      shortWhy: "No. One main per program.",
      answerCode: "/* file a.c and b.c both with main → link error:\n   multiple definition of `main'\n*/",
      answerWhy: "No. When you split files in Chapter 10, only one .c defines main."
    },
    {
      id: "a15", kind: "tf", group: "The file’s shape", title: "Comments run?",
      prompt: "Do comments print on the screen when you run the program?",
      hint: "The compiler throws them away.",
      accept: ["no"],
      shortWhy: "No. Comments are for humans.",
      answerCode: "printf(\"A\\n\");  // this text does not print\n/* nor does this */\n\n/* Output is only what printf sends. */",
      answerWhy: "No. If you need the user to see words, use printf (Chapter 3)."
    },
    {
      id: "a16", kind: "fill", group: "The file’s shape", title: "Line comment",
      prompt: "Which two characters start a comment to the end of the line?",
      hint: "Two slashes.",
      accept: ["//"],
      shortWhy: "// comments out the rest of that line.",
      answerCode: "return 0;  // ignored from here to end of line",
      answerWhy: "// . The other form is /* */ for a block."
    },
    {
      id: "a17", kind: "fill", group: "The file’s shape", title: "Block comment end",
      prompt: "A block comment starts with /* . How does it end? Type the two characters.",
      hint: "Star slash.",
      accept: ["*/"],
      shortWhy: "/* opens. */ closes.",
      answerCode: "/* ignored\n   still ignored */\nint main(void) { return 0; }",
      answerWhy: "*/ . Forgetting it comments out your whole main. Compile then looks insane."
    },
    {
      id: "a18", kind: "write", group: "The file’s shape", title: "Smallest main",
      prompt: "Write the smallest main that returns success: int main(void) { return 0; }",
      hint: "int main(void) { return 0; }",
      must: ["int main", "return 0"],
      shortWhy: "That is the skeleton of every lab.",
      answerCode: "int main(void) {   /* start. no arguments here */\n  return 0;         /* success to the OS. semicolon required */\n}",
      answerWhy: "You may add #include and printf later. This body is the start of every chapter after this."
    },
    {
      id: "a19", kind: "tf", group: "Compile errors vs run", title: "Error line",
      prompt: "When gcc prints an error with a line number, is that number a line in the .c source?",
      hint: "Fix the text file, then compile again.",
      accept: ["yes"],
      shortWhy: "Yes. The error points at source, not at a running process.",
      answerCode: "hello.c:4:1: error: expected ';' before 'return'\n/*         ^ line 4 of hello.c */",
      answerWhy: "Yes. Open that line. Do not reboot Linux for a missing semicolon."
    },
    {
      id: "a20", kind: "tf", group: "Compile errors vs run", title: "Failed compile",
      prompt: "If gcc fails, should you assume ./hello is your new program?",
      hint: "No new tool, or the old tool remains.",
      accept: ["no"],
      shortWhy: "No. A failed compile does not update the tool.",
      answerCode: "gcc hello.c -o hello   /* if this prints error, do not trust ./hello as new */",
      answerWhy: "No. Check that gcc printed no error. Then run."
    },
    {
      id: "a21", kind: "fill", group: "Compile errors vs run", title: "Compiler name",
      prompt: "Which command compiles C in this course? Three letters.",
      hint: "GNU C compiler.",
      accept: ["gcc"],
      shortWhy: "gcc. clang is similar; labs here say gcc.",
      answerCode: "gcc lab.c -o lab\n/* later: gcc lab.c -o lab -lpthread -lrt   (Ch10) */",
      answerWhy: "gcc. Same command for GPIO and for hello world."
    },
    {
      id: "a22", kind: "predict", group: "Compile errors vs run", title: "Order three prints",
      prompt: "What prints? Three lines: X then Y then Z.",
      code: "#include <stdio.h>\nint main(void) {\n  printf(\"X\\n\");\n  printf(\"Y\\n\");\n  printf(\"Z\\n\");\n  return 0;\n}",
      hint: "Line by line in main.",
      accept: ["X\nY\nZ", "X Y Z"],
      shortWhy: "X then Y then Z.",
      answerCode: "/* main body order = print order */\nprintf(\"X\\n\");\nprintf(\"Y\\n\");\nprintf(\"Z\\n\");\n\n/* Output:\nX\nY\nZ\n*/",
      answerWhy: "Logic in this course always starts here: which line of main runs next."
    },
    {
      id: "a23", kind: "tf", group: "OS door", title: "Labs are C files",
      prompt: "Is an OS lab still a .c file with main that you compile and run?",
      hint: "GPIO, signals, Windows: still this chapter’s shape.",
      accept: ["yes"],
      shortWhy: "Yes. Same file, compile, run. Extra headers and flags later.",
      answerCode: "gcc lab.c -o lab -lpthread -lrt\n./lab\n/* still: source → compile → run. main starts. */",
      answerWhy: "Yes. Do not wait for a new language called ‘OS C’."
    },
    {
      id: "a24", kind: "tf", group: "OS door", title: "Who calls main",
      prompt: "When you run ./hello, does the operating system call main?",
      hint: "You start the tool. The OS jumps to main. Chapter 7 will reuse this: the OS can also call a handler.",
      accept: ["yes"],
      shortWhy: "Yes. You run the tool. The OS calls main.",
      answerCode: "./hello\n/* OS loads the tool, then CALLS main.\n   main returns 0, OS sees success. */",
      answerWhy: "Yes. main is a function (Chapter 7) whose caller is the OS."
    },
    {
      id: "a25", kind: "fill", group: "OS door", title: "Include toolkit",
      prompt: "Which line copies the stdio toolkit at the top of the file? Type #include <stdio.h>",
      hint: "Hash include, angle brackets, stdio.h",
      accept: ["#include <stdio.h>"],
      shortWhy: "That line is how printf becomes a known name.",
      answerCode: "#include <stdio.h>   /* compiler copies prototypes */\nint main(void) {\n  printf(\"A\\n\");     /* now the compiler knows printf */\n  return 0;\n}",
      answerWhy: "#include <stdio.h> is compile-time. Chapter 10: missing include vs missing -l."
    },
    {
      id: "a26", kind: "write", group: "OS door", title: "Hello line",
      prompt: "Write a full small program that prints Hi and a newline, then returns 0. Use printf(\"Hi\\n\"); and include stdio.h.",
      hint: "#include <stdio.h> then main with one printf and return 0.",
      must: ["#include <stdio.h>", "int main", "printf", "return 0"],
      shortWhy: "Include, main, print, return. That is Chapter 1 complete.",
      answerCode: "#include <stdio.h>     /* toolkit for printf */\n\nint main(void) {        /* OS starts here */\n  printf(\"Hi\\n\");      /* run-time: print Hi and newline */\n  return 0;             /* success to the OS */\n}",
      answerWhy: "Order: include (compiler), main (start), printf (work), return (stop)."
    },
    {
      id: "a27", kind: "tf", group: "OS door", title: "Braces",
      prompt: "Must the body of main sit between { and }?",
      hint: "The braces are the box of statements.",
      accept: ["yes"],
      shortWhy: "Yes. Opening and closing brace.",
      answerCode: "int main(void) {\n  return 0;\n}   /* this } closes main */",
      answerWhy: "Yes. Missing } is a compile error that often points at the wrong line. Count braces."
    },
    {
      id: "a28", kind: "predict", group: "OS door", title: "Blank main",
      prompt: "A program with only return 0 in main prints nothing. What is the output? Type the word empty if nothing prints.",
      code: "int main(void) {\n  return 0;\n}",
      hint: "No printf. Success, but silence.",
      accept: ["empty", "(empty)", "nothing"],
      shortWhy: "Nothing prints. The program still ran and returned 0.",
      answerCode: "int main(void) {\n  return 0;   /* no printf → no output */\n}\n/* Output: (empty) */",
      answerWhy: "Running ≠ printing. You will use this: a lock lab can succeed with little output."
    }
  ]
};
