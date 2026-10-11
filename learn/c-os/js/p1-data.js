window.C_OS_CHAPTER = {
  id: "p1",
  drills: [
    {
      id: "e01", kind: "tf", group: "Shape of the program", title: "One file",
      prompt: "Is this easy project one C file named desk.c with one main, that you compile then run?",
      hints: [
        "Chapter 1: source, compile, run. Do not run the .c text.",
        "The tool name can be desk. The start function is still main."
      ],
      accept: ["yes"],
      shortWhy: "Yes. gcc desk.c -o desk then ./desk.",
      answerCode: "/* desk.c  = SOURCE\n   gcc desk.c -o desk  = COMPILE\n   ./desk              = RUN, OS calls main\n*/",
      answerWhy: "Yes. Easy does not mean tiny. It means one process, no pthread flag, no shm. Still a full program."
    },
    {
      id: "e02", kind: "fill", group: "Shape of the program", title: "Build line",
      prompt: "Type the compile command for this project: gcc desk.c -o desk",
      hints: [
        "gcc, the source file, -o, the tool name.",
        "No -lpthread here. That is P2 and P3."
      ],
      accept: ["gcc desk.c -o desk"],
      shortWhy: "gcc desk.c -o desk. Chapter 1 plus Chapter 10: no extra library yet.",
      answerCode: "gcc desk.c -o desk\n./desk\n/* if gcc prints an error, fix desk.c, compile again, then run */",
      answerWhy: "This is the only build line for P1. If you add -lpthread it still works, but you do not need it."
    },
    {
      id: "e03", kind: "write", group: "Headers and the object", title: "Includes",
      prompt: "Write the two include lines this file needs: stdio.h for printf/scanf, string.h for copying a name.",
      hints: [
        "Chapter 10: #include copies prototypes. Angle brackets for system headers.",
        "stdio.h then string.h, each on its own line."
      ],
      must: ["#include <stdio.h>", "#include <string.h>"],
      rows: 4,
      shortWhy: "Those two headers. Compile layer, not -l.",
      answerCode: "#include <stdio.h>    /* printf, scanf — Ch3, Ch10 */\n#include <string.h>   /* strcpy / we may copy char by char — Ch6 */",
      answerWhy: "Missing stdio.h → undeclared printf. That is a compile error, not a logic error."
    },
    {
      id: "e04", kind: "write", group: "Headers and the object", title: "The struct",
      prompt: "Write struct Process with fields: int pid; char name[32]; int alive;",
      hints: [
        "Chapter 9: several fields, one object.",
        "name is a char array (Chapter 6), not a single char.",
        "alive is 1 running, 0 killed. Still an int (Chapter 2)."
      ],
      must: ["struct Process", "int pid", "char name[32]", "int alive"],
      rows: 8,
      shortWhy: "One object: pid + name + alive.",
      answerCode: "struct Process {     /* one fake process = one object */\n  int pid;           /* identity. we assign 1, 2, 3, ... */\n  char name[32];     /* boxes 0..31, last should hold '\\0' */\n  int alive;         /* 1 = running, 0 = killed */\n};",
      answerWhy: "This is not a real kernel process. It is a row in your table. Real fork comes in P3."
    },
    {
      id: "e05", kind: "write", group: "Headers and the object", title: "The table",
      prompt: "Declare the global table: struct Process table[16]; and int used = 0; and int next_pid = 1;",
      hints: [
        "Chapter 6: 16 boxes. Indexes 0..15.",
        "used is how many rows are filled. next_pid is the next id to give.",
        "Start used at 0 so the table is empty. Start next_pid at 1 so the first process is pid 1."
      ],
      must: ["struct Process table[16]", "int used=0", "int next_pid=1"],
      rows: 6,
      shortWhy: "Array of structs plus two counters.",
      answerCode: "struct Process table[16];  /* 16 rows. do not write table[16] */\nint used = 0;              /* how many rows are live data */\nint next_pid = 1;          /* first add gets pid 1, then 2, ... */",
      answerWhy: "Globals here keep the first project readable. P2/P3 will pass a paper to a struct instead."
    },
    {
      id: "e06", kind: "write", group: "Functions", title: "add_process",
      prompt: "Write int add_process(const char *name) that: if used >= 16 return -1; otherwise fill table[used] through a pointer, copy the name (max 31 chars + 0), set alive=1, pid=next_pid++, used++, return the pid.",
      hints: [
        "Chapter 7: what goes in is a paper to characters. What comes back is the new pid, or -1.",
        "Chapter 8: struct Process *p = &table[used]; then p->pid, p->name, p->alive.",
        "Copy with a small for-loop: for i=0; i<31 && name[i]!='\\0'; i++ p->name[i]=name[i]; then p->name[i]='\\0';",
        "Who waits: main waits until add_process returns."
      ],
      must: ["int add_process", "used", "table", "next_pid", "alive", "return"],
      rows: 18,
      shortWhy: "Fill one row through a paper. Return the pid or -1.",
      answerCode: "int add_process(const char *name) {  /* in: paper to the name string */\n  int i;\n  struct Process *p;\n  if (used >= 16) {                  /* table full */\n    return -1;                       /* back: fail */\n  }\n  p = &table[used];                  /* paper to the NEXT free row */\n  p->pid = next_pid;                 /* write the id into the row */\n  next_pid = next_pid + 1;           /* replace the counter */\n  for (i = 0; i < 31 && name[i] != '\\0'; i++) {\n    p->name[i] = name[i];            /* copy char boxes */\n  }\n  p->name[i] = '\\0';                 /* terminator — Ch6 */\n  p->alive = 1;\n  used = used + 1;\n  return p->pid;                     /* back: the id we just gave */\n}",
      answerWhy: "If you copy with strcpy, that is also fine if you included string.h. The pointer p is two papers, one row: main’s table and add_process share that box."
    },
    {
      id: "e07", kind: "write", group: "Functions", title: "list_processes",
      prompt: "Write void list_processes(void) that loops i from 0 while i < used and prints pid, name, alive for each row using a pointer p = &table[i]; and printf(\"%d %s %d\\n\", p->pid, p->name, p->alive);",
      hints: [
        "void: nothing comes back. main still waits.",
        "for (i = 0; i < used; i++) — not i <= used (that would walk off).",
        "Arrow because p is a paper (Ch8+Ch9)."
      ],
      must: ["void list_processes", "for", "i<used", "p->pid"],
      rows: 14,
      shortWhy: "Walk filled rows only. Print through a paper.",
      answerCode: "void list_processes(void) {          /* in: nothing. back: nothing */\n  int i;\n  for (i = 0; i < used; i++) {       /* Ch5 + Ch6: filled indexes only */\n    struct Process *p = &table[i];   /* paper to this row */\n    printf(\"%d %s %d\\n\", p->pid, p->name, p->alive);\n  }\n}",
      answerWhy: "If used is 0, the loop runs zero times. Empty table prints nothing. That is correct."
    },
    {
      id: "e08", kind: "write", group: "Functions", title: "find_process",
      prompt: "Write struct Process *find_process(int pid) that returns a paper to the matching row, or NULL if not found.",
      hints: [
        "Return type is a pointer. Chapter 8: paper or nowhere.",
        "Loop i < used. If table[i].pid == pid return &table[i];",
        "After the loop, return NULL. Do not return a paper to garbage."
      ],
      must: ["struct Process *find_process", "NULL", "return"],
      rows: 14,
      shortWhy: "Paper to the row, or NULL.",
      answerCode: "struct Process *find_process(int pid) {  /* in: the id. back: paper or NULL */\n  int i;\n  for (i = 0; i < used; i++) {\n    if (table[i].pid == pid) {           /* == test, do not assign */\n      return &table[i];                  /* paper to THAT box */\n    }\n  }\n  return NULL;                           /* nowhere. caller must test */\n}",
      answerWhy: "kill_process will call this. If you skip NULL, the next star will crash."
    },
    {
      id: "e09", kind: "write", group: "Functions", title: "kill_process",
      prompt: "Write int kill_process(int pid) that finds the row, if NULL return -1, else set alive to 0 and return 0. Do not remove the row from the array.",
      hints: [
        "This is a fake kill. We mark the box. We do not call the kill() syscall (that is P3).",
        "struct Process *p = find_process(pid); then if (p == NULL) return -1;",
        "p->alive = 0; return 0;"
      ],
      must: ["int kill_process", "find_process", "NULL", "alive"],
      rows: 12,
      shortWhy: "Mark alive=0. Return 0 or -1.",
      answerCode: "int kill_process(int pid) {\n  struct Process *p = find_process(pid);  /* paper or NULL */\n  if (p == NULL) {\n    return -1;                            /* no such pid */\n  }\n  p->alive = 0;                           /* same box as the table row */\n  return 0;                               /* success */\n}",
      answerWhy: "Two papers, one box: find returned &table[i], kill writes alive on that row. list will still show it, with alive 0."
    },
    {
      id: "e10", kind: "write", group: "Menu and main", title: "main loop",
      prompt: "Write int main(void) with a while (1) menu: print \"1 add  2 list  3 kill  4 quit\\n\", scanf cmd, then if 1 scanf name and add, if 2 list, if 3 scanf pid and kill, if 4 return 0. Use char name[32]; int cmd, pid;",
      hints: [
        "Chapter 5: while (1) until return 0 inside cmd==4.",
        "scanf(\"%d\", &cmd) — the & is Chapter 3/8. For the name: scanf(\"%31s\", name); the array name is already a paper to the first char.",
        "if (cmd == 1) { ... } else if (cmd == 2) ... Use == not =.",
        "On add, printf(\"pid=%d\\n\", add_process(name));"
      ],
      must: ["int main", "while", "scanf", "add_process", "list_processes", "kill_process", "return 0"],
      rows: 22,
      shortWhy: "Menu loop. Four commands. &cmd for scanf of the int.",
      answerCode: "int main(void) {                 /* OS starts here — Ch1 */\n  int cmd;\n  int pid;\n  char name[32];\n  while (1) {                    /* until we return */\n    printf(\"1 add  2 list  3 kill  4 quit\\n\");\n    if (scanf(\"%d\", &cmd) != 1) {  /* paper to cmd */\n      return 1;\n    }\n    if (cmd == 1) {\n      if (scanf(\"%31s\", name) != 1) return 1;\n      printf(\"pid=%d\\n\", add_process(name));\n    } else if (cmd == 2) {\n      list_processes();\n    } else if (cmd == 3) {\n      if (scanf(\"%d\", &pid) != 1) return 1;\n      if (kill_process(pid) == -1) {\n        printf(\"no\\n\");\n      }\n    } else if (cmd == 4) {\n      return 0;                  /* success to the OS */\n    }\n  }\n}",
      answerWhy: "scanf for an int needs &. scanf for name[32] does not need &name — the array is already a paper. That pair is Chapters 6 and 8 in one menu."
    },
    {
      id: "e11", kind: "predict", group: "Menu and main", title: "Trace add then list",
      prompt: "used starts 0. add_process(\"init\") then add_process(\"bash\"). list prints two lines. What is the first number on the first line (the first pid)?",
      hints: [
        "next_pid starts at 1. First add takes 1 and then next_pid becomes 2.",
        "list prints pid, name, alive. First pid is 1."
      ],
      accept: ["1"],
      shortWhy: "First pid is 1.",
      answerCode: "next_pid = 1;\nadd_process(\"init\");  /* pid 1, next_pid=2, used=1 */\nadd_process(\"bash\");  /* pid 2, next_pid=3, used=2 */\nlist →\n1 init 1\n2 bash 1",
      answerWhy: "Trace the two counters. Do not guess 0. We started next_pid at 1 on purpose, like a human pid table."
    },
    {
      id: "e12", kind: "predict", group: "Menu and main", title: "After fake kill",
      prompt: "After those two adds, kill_process(1). list first line alive field (third number) is?",
      hints: [
        "kill sets alive to 0. It does not delete the row.",
        "First line: pid 1, name init, alive 0."
      ],
      accept: ["0"],
      shortWhy: "0. The row stays. alive is off.",
      answerCode: "kill_process(1);  /* find pid 1, p->alive = 0 */\nlist first line: 1 init 0",
      answerWhy: "A real OS would reap a zombie later. This easy project only marks the flag. That is Chapter 2 on a struct field."
    },
    {
      id: "e13", kind: "tf", group: "Menu and main", title: "Two papers",
      prompt: "When kill_process does p->alive = 0, is that the same box as table[i].alive?",
      hints: [
        "find returned &table[i]. p holds that address.",
        "Two papers (p and the table name plus index), one box."
      ],
      accept: ["yes"],
      shortWhy: "Yes. That is Chapter 8 inside this project.",
      answerCode: "p = &table[i];   /* copy the ADDRESS onto paper p */\np->alive = 0;    /* open that box. table[i].alive is 0 */",
      answerWhy: "If you had copied the struct by value, kill would mark a copy and list would still show alive 1. We pass a paper on purpose."
    },
    {
      id: "e14", kind: "tf", group: "Full file", title: "Not real fork",
      prompt: "Does add_process call fork() in this easy project?",
      hints: [
        "Easy: fake table. Medium: real threads. Hard: real fork + shm.",
        "We only fill a struct row."
      ],
      accept: ["no"],
      shortWhy: "No. Fake rows. P3 calls fork.",
      answerCode: "/* P1: table[i] = a row we invented\n   P3: fork() makes a real child process\n*/",
      answerWhy: "No. If you insert fork here you jumped to hard. Finish the menu first."
    },
    {
      id: "e15", kind: "write", group: "Full file", title: "Assemble desk.c",
      prompt: "Assemble the full file: includes, struct, table, the four functions, main. Must contain add_process, list_processes, find_process, kill_process, and main.",
      hints: [
        "Order: includes, struct, globals, functions, main. main last, or add prototypes.",
        "You already wrote each piece. Paste them in order. One main only.",
        "Compile in your head: gcc desk.c -o desk — if a name is unknown, you forgot a header or a function is below main without a prototype."
      ],
      must: ["#include <stdio.h>", "struct Process", "add_process", "list_processes", "find_process", "kill_process", "int main"],
      rows: 28,
      shortWhy: "The whole easy project in one file.",
      answerCode: "#include <stdio.h>\n#include <string.h>\n\nstruct Process {\n  int pid;\n  char name[32];\n  int alive;\n};\n\nstruct Process table[16];\nint used = 0;\nint next_pid = 1;\n\nint add_process(const char *name) {\n  int i;\n  struct Process *p;\n  if (used >= 16) return -1;\n  p = &table[used];\n  p->pid = next_pid;\n  next_pid = next_pid + 1;\n  for (i = 0; i < 31 && name[i] != '\\0'; i++) p->name[i] = name[i];\n  p->name[i] = '\\0';\n  p->alive = 1;\n  used = used + 1;\n  return p->pid;\n}\n\nvoid list_processes(void) {\n  int i;\n  for (i = 0; i < used; i++) {\n    struct Process *p = &table[i];\n    printf(\"%d %s %d\\n\", p->pid, p->name, p->alive);\n  }\n}\n\nstruct Process *find_process(int pid) {\n  int i;\n  for (i = 0; i < used; i++) {\n    if (table[i].pid == pid) return &table[i];\n  }\n  return NULL;\n}\n\nint kill_process(int pid) {\n  struct Process *p = find_process(pid);\n  if (p == NULL) return -1;\n  p->alive = 0;\n  return 0;\n}\n\nint main(void) {\n  int cmd, pid;\n  char name[32];\n  while (1) {\n    printf(\"1 add  2 list  3 kill  4 quit\\n\");\n    if (scanf(\"%d\", &cmd) != 1) return 1;\n    if (cmd == 1) {\n      if (scanf(\"%31s\", name) != 1) return 1;\n      printf(\"pid=%d\\n\", add_process(name));\n    } else if (cmd == 2) {\n      list_processes();\n    } else if (cmd == 3) {\n      if (scanf(\"%d\", &pid) != 1) return 1;\n      if (kill_process(pid) == -1) printf(\"no\\n\");\n    } else if (cmd == 4) {\n      return 0;\n    }\n  }\n}\n\n/* gcc desk.c -o desk\n   ./desk\n*/",
      answerWhy: "This is P1 complete. Save it as desk.c, compile, run. Then open P2. P2 uses a real mutex. P3 uses a real second process."
    }
  ]
};
