window.C_OS_CHAPTER = {
  id: "ch02",
  drills: [
    {
      id: "v01", kind: "tf", group: "One box", title: "Replace",
      prompt: "If x is 5 and you then write x = 9, is x now 9 (the 5 is gone)?",
      hint: "Assignment replaces. It does not add a second box.",
      accept: ["yes"],
      shortWhy: "Yes. One box. New value overwrites.",
      answerCode: "int x = 5;  /* box x: 5 */\nx = 9;       /* box x: 9. 5 is gone */",
      answerWhy: "Yes. There is no history in the box unless you copy it somewhere else first."
    },
    {
      id: "v02", kind: "predict", group: "One box", title: "After two writes",
      prompt: "What is in x at the end? Type the number.",
      code: "int x = 1;\nx = 2;\nx = 3;",
      hint: "Last assignment wins.",
      accept: ["3"],
      shortWhy: "Last write: 3.",
      answerCode: "int x = 1;  /* 1 */\nx = 2;       /* 2 */\nx = 3;       /* 3 */\n/* x is 3 */",
      answerWhy: "Trace from the top. Only the last value remains."
    },
    {
      id: "v03", kind: "predict", group: "One box", title: "n = n + 1",
      prompt: "What is n after this?",
      code: "int n = 3;\nn = n + 1;",
      hint: "Read 3, add 1, write 4.",
      accept: ["4"],
      shortWhy: "4. Assignment is a command, not an algebra claim.",
      answerCode: "int n = 3;\nn = n + 1;   /* read 3, write 4 */\n/* n is 4 */",
      answerWhy: "This is how a count goes up. OS labs do this to a shared count — later with a lock."
    },
    {
      id: "v04", kind: "predict", group: "One box", title: "plusplus",
      prompt: "What is n after n++ if n started at 4?",
      code: "int n = 4;\nn++;",
      hint: "n++ adds 1 to the box.",
      accept: ["5"],
      shortWhy: "5.",
      answerCode: "int n = 4;\nn++;        /* n = n + 1 */\n/* n is 5 */",
      answerWhy: "n++ and n = n + 1 are the same for this course’s traces."
    },
    {
      id: "v05", kind: "tf", group: "One box", title: "Equals sign",
      prompt: "In C, is = the test ‘are these equal’?",
      hint: "That test is == . = writes.",
      accept: ["no"],
      shortWhy: "No. = assigns. == tests. Chapter 4.",
      answerCode: "x = 5;     /* WRITE 5 into x */\n/* x == 5  is the TEST, next chapter */",
      answerWhy: "No. If you write if (x = 0) you assign, you do not test. Learn the character count: one vs two."
    },
    {
      id: "v06", kind: "fill", group: "One box", title: "Type for counts",
      prompt: "Which type do we use for whole numbers like a count or a pid? Three letters.",
      hint: "int.",
      accept: ["int"],
      shortWhy: "int. Whole numbers.",
      answerCode: "int count = 0;\nint pid;\nint fd;",
      answerWhy: "int. pid_t is an int in a costume. Trace it as int."
    },
    {
      id: "v07", kind: "tf", group: "One box", title: "Garbage",
      prompt: "If you write int x; and never assign, is the value known and safe to print?",
      hint: "Uninitialised = garbage.",
      accept: ["no"],
      shortWhy: "No. Write a value first. Flags start at 0.",
      answerCode: "int x;          /* garbage */\nint count = 0;  /* known */",
      answerWhy: "No. Labs: volatile int got = 0; The = 0 is not decoration."
    },
    {
      id: "v08", kind: "predict", group: "Copies", title: "Copy then change",
      prompt: "What prints? Two numbers, space between.",
      code: "#include <stdio.h>\nint main(void) {\n  int a = 1;\n  int b = a;\n  b = 9;\n  printf(\"%d %d\\n\", a, b);\n  return 0;\n}",
      hint: "b is a second box. Copy of the value. a stays 1.",
      accept: ["1 9"],
      shortWhy: "a=1, b=9. Two boxes.",
      answerCode: "int a = 1;    /* box a */\nint b = a;    /* box b gets COPY of 1 */\nb = 9;        /* only b changes */\n/* Output: 1 9 */",
      answerWhy: "Two names, two boxes. Sharing one box is Chapter 8."
    },
    {
      id: "v09", kind: "tf", group: "Copies", title: "Second box",
      prompt: "Does int b = a; create a second int box?",
      hint: "Yes. It copies the number, not the identity of the box.",
      accept: ["yes"],
      shortWhy: "Yes. Second box, copied value.",
      answerCode: "int a = 1;\nint b = a;  /* new box, value 1 */",
      answerWhy: "Yes. Threads that each have their own int count are this, not shared memory."
    },
    {
      id: "v10", kind: "predict", group: "Copies", title: "Swap attempt locals",
      prompt: "After t = a; a = b; b = t; if a was 1 and b was 2, what is a then b? Two numbers.",
      code: "int a = 1, b = 2, t;\nt = a;\na = b;\nb = t;",
      hint: "Classic swap of two boxes.",
      accept: ["2 1"],
      shortWhy: "a=2, b=1. You used a third box t.",
      answerCode: "t = a;  /* t=1 */\na = b;  /* a=2 */\nb = t;  /* b=1 */\n/* a is 2, b is 1 */",
      answerWhy: "Three boxes, values moved. This is not a function yet. Chapter 7 swap-by-value will fail because it swaps copies."
    },
    {
      id: "v11", kind: "fill", group: "char", title: "Single quotes",
      prompt: "A char letter A uses which quotes? Type a letter A in the correct quotes, like 'A'.",
      hint: "Single quotes for one character.",
      accept: ["'A'"],
      shortWhy: "'A' is a char. \"A\" is a string (Chapter 6).",
      answerCode: "char c = 'A';   /* one character */\n/* char c = \"A\";  wrong type: \"A\" is a string */",
      answerWhy: "Single quotes. Double quotes wait for arrays of char."
    },
    {
      id: "v12", kind: "tf", group: "char", title: "char vs string",
      prompt: "Is 'A' the same kind of value as \"A\"?",
      hint: "One character vs a tiny array of characters.",
      accept: ["no"],
      shortWhy: "No. 'A' is char. \"A\" is a string.",
      answerCode: "char c = 'A';\n/* \"A\" is two boxes in a row: 'A' and '\\0'  — Chapter 6 */",
      answerWhy: "No. shm_open wants a string \"/myshm\", not a char."
    },
    {
      id: "v13", kind: "predict", group: "char", title: "char as number",
      prompt: "If char c = 'A'; and you know 'A' has code 65, what is c + 1 as a number?",
      code: "char c = 'A';  /* 'A' is 65 on ASCII */\n/* what is c + 1 ? */",
      hint: "65 + 1.",
      accept: ["66"],
      shortWhy: "66. char is a small int underneath.",
      answerCode: "char c = 'A';  /* 65 */\n/* c + 1 is 66, which is 'B' */",
      answerWhy: "You rarely need this in OS labs. You need to know char is not magic. It is a number."
    },
    {
      id: "v14", kind: "write", group: "Names in labs", title: "Zero flag",
      prompt: "Declare an int named got and set it to 0. One line: int got = 0;",
      hint: "int got = 0;",
      must: ["int got", "got=0"],
      shortWhy: "A flag box starting at 0. Later a handler sets it to 1.",
      answerCode: "int got = 0;   /* flag off. known value, not garbage */",
      answerWhy: "Start flags at 0. Chapter 7/8 will add volatile and a handler. The box is still this."
    },
    {
      id: "v15", kind: "write", group: "Names in labs", title: "Count",
      prompt: "Declare int count = 0;",
      hint: "Exactly that.",
      must: ["int count", "count=0"],
      shortWhy: "Counter starts at zero.",
      answerCode: "int count = 0;  /* how many times. will become b->count in Ch9 */",
      answerWhy: "Same box idea later inside a struct. Learn the name now."
    },
    {
      id: "v16", kind: "tf", group: "Names in labs", title: "pid is int",
      prompt: "Is a process id stored in an integer-like box (int / pid_t), not in a char?",
      hint: "fork returns a pid_t, traced as int.",
      accept: ["yes"],
      shortWhy: "Yes. pid is a number in an int box.",
      answerCode: "pid_t r = fork();  /* treat r as int: 0, positive, or -1 */",
      answerWhy: "Yes. You will write if (r == 0). That compares two ints (Chapter 4)."
    },
    {
      id: "v17", kind: "tf", group: "Names in labs", title: "fd is int",
      prompt: "Is a file descriptor from shm_open an int?",
      hint: "int fd = shm_open(...);  -1 on fail.",
      accept: ["yes"],
      shortWhy: "Yes. fd is an int. mmap’s return is a pointer (Chapter 8), not this.",
      answerCode: "int fd = shm_open(\"/myshm\", O_RDWR, 0600);\n/* fd is an int. -1 means fail. not a pointer. */",
      answerWhy: "Yes. Mixing fd with the mmap pointer is a later trap. Here: int box."
    },
    {
      id: "v18", kind: "predict", group: "Trace hard", title: "Three updates",
      prompt: "What is count?",
      code: "int count = 0;\ncount = count + 1;\ncount = count + 1;\ncount = count + 1;",
      hint: "Start 0, three adds.",
      accept: ["3"],
      shortWhy: "3.",
      answerCode: "count = 0;\n+1 → 1\n+1 → 2\n+1 → 3",
      answerWhy: "A loop (Chapter 5) does this many times. Two threads doing this without a lock can lose an add."
    },
    {
      id: "v19", kind: "predict", group: "Trace hard", title: "Independent boxes",
      prompt: "What prints? Two numbers.",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 2;\n  int y = 5;\n  x = x + y;\n  printf(\"%d %d\\n\", x, y);\n  return 0;\n}",
      hint: "x becomes 7. y stays 5.",
      accept: ["7 5"],
      shortWhy: "x=7, y=5. Writing x does not write y.",
      answerCode: "int x = 2, y = 5;\nx = x + y;   /* 2+5=7 into x. y untouched */\n/* Output: 7 5 */",
      answerWhy: "Name the box you write. The other box stays."
    },
    {
      id: "v20", kind: "fill", group: "Trace hard", title: "Declare",
      prompt: "Write a declaration of an int named pid with no value yet. Type: int pid;",
      hint: "Type, name, semicolon.",
      accept: ["int pid;"],
      shortWhy: "int pid; Then you assign from fork.",
      answerCode: "int pid;       /* box, no value yet */\npid = fork();  /* now a value — Ch7 */",
      answerWhy: "Declare then assign is legal. Prefer pid_t pid = fork(); in one line later."
    },
    {
      id: "v21", kind: "tf", group: "Trace hard", title: "Replace not add boxes",
      prompt: "Does x = 9; create a second variable named x?",
      hint: "Same name, same box, new value.",
      accept: ["no"],
      shortWhy: "No. Same box. New value.",
      answerCode: "int x = 1;\nx = 9;   /* still one box named x */",
      answerWhy: "No. Two boxes would need two names, or an array (Chapter 6)."
    },
    {
      id: "v22", kind: "predict", group: "OS door", title: "Flag on",
      prompt: "got starts 0. Then got = 1. What is got?",
      code: "int got = 0;\ngot = 1;",
      hint: "Flag turned on.",
      accept: ["1"],
      shortWhy: "1. That is ‘signal arrived’ in the tiny-handler picture.",
      answerCode: "int got = 0;  /* off */\ngot = 1;       /* on */\n/* later: while (!got) { }  — Ch4/Ch5 */",
      answerWhy: "A handler only does this assignment. main watches the box. Same Chapter 2 box."
    },
    {
      id: "v23", kind: "tf", group: "OS door", title: "return code is int",
      prompt: "Is the 0 in return 0 an int value sent to the OS?",
      hint: "Chapter 1 plus this chapter’s type.",
      accept: ["yes"],
      shortWhy: "Yes. main’s return type is int.",
      answerCode: "int main(void) {\n  return 0;   /* int 0 to the OS */\n}",
      answerWhy: "Yes. Types and boxes start here so Chapter 7’s return is not a surprise."
    },
    {
      id: "v24", kind: "write", group: "OS door", title: "Two ints",
      prompt: "Declare int pid = 0; and int count = 0; Two lines.",
      hint: "Two boxes, both start at 0.",
      must: ["int pid", "pid=0", "int count", "count=0"],
      shortWhy: "Two named int boxes.",
      answerCode: "int pid = 0;     /* will later hold fork's return */\nint count = 0;   /* will later live in a struct */",
      answerWhy: "You are allowed extra spaces. The checker looks for the names and the zeros."
    },
    {
      id: "v25", kind: "predict", group: "OS door", title: "Overwrite flag",
      prompt: "What is got?",
      code: "int got = 0;\ngot = 1;\ngot = 0;",
      hint: "Last write wins. Cleared again.",
      accept: ["0"],
      shortWhy: "0. You can turn a flag off again.",
      answerCode: "got = 0;\ngot = 1;   /* on */\ngot = 0;   /* off again */",
      answerWhy: "Labs sometimes clear the flag after handling the signal, so the next SIGUSR1 can be seen."
    },
    {
      id: "v26", kind: "tf", group: "OS door", title: "char for pid?",
      prompt: "Should you store a process id in a char?",
      hint: "A pid does not fit in a tiny char on real systems.",
      accept: ["no"],
      shortWhy: "No. Use int / pid_t.",
      answerCode: "pid_t r = fork();  /* int-sized */\n/* char r = fork();  wrong size, wrong type */",
      answerWhy: "No. Type must fit the value. Pids are ints."
    }
  ]
};
