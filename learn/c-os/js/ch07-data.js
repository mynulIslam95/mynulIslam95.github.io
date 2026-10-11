window.C_OS_CHAPTER = {
  id: "ch07",
  drills: [
    {
      id: "f01", kind: "predict", group: "Call, arguments, return", title: "What comes back",
      prompt: "What does this program print?",
      code: "#include <stdio.h>\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main(void) {\n  printf(\"%d\\n\", add(2, 3));\n  return 0;\n}",
      hint: "2 and 3 go IN as copies. return sends one number BACK. printf prints that number.",
      accept: ["5"],
      shortWhy: "add returns 5. main waited. Then printf ran.",
      answerCode: "#include <stdio.h>\n\nint add(int a, int b) {   /* callee: two NEW boxes */\n  return a + b;           /* 2+3=5 goes BACK. add ends. */\n}\n\nint main(void) {          /* caller */\n  printf(\"%d\\n\", add(2, 3));\n  /* 1) copies 2 and 3 go IN\n     2) main WAITS here\n     3) 5 comes BACK\n     4) printf prints 5 */\n  return 0;\n}\n\n/* Output:\n5\n*/",
      answerWhy: "Arguments are copies of 2 and 3. The value that comes back is 5. main does not print until add has returned."
    },
    {
      id: "f02", kind: "tf", group: "Call, arguments, return", title: "Who waits",
      prompt: "When main calls add(2, 3), does main wait until add has returned before it runs the next line?",
      hint: "Normal C: the caller is frozen until the callee returns. fork is later, and is the exception.",
      accept: ["yes"],
      shortWhy: "The caller waits. That is the default rule.",
      answerCode: "/* main:\n     s = add(2, 3);   // main STOPS here\n     printf(\"%d\\n\", s); // this line is later\n\n   add runs fully, then return 5, THEN printf.\n   Who waits? main (the caller).\n*/",
      answerWhy: "Yes. One call, one return, the caller waits. Remember this sentence. fork will break 'one return', not this waiting picture for add."
    },
    {
      id: "f03", kind: "fill", group: "Call, arguments, return", title: "The send-back word",
      prompt: "Which one C keyword sends a value back to the caller and ends the function?",
      hint: "It is not print. Printing is a side effect. The keyword that comes BACK is shorter.",
      accept: ["return"],
      shortWhy: "return sends the value back and ends the function.",
      answerCode: "int add(int a, int b) {\n  return a + b;   /* keyword: return\n                     1) value goes BACK to caller\n                     2) function ENDS — later lines in add do not run */\n}",
      answerWhy: "The keyword is return. printf can show a number, but that number is not given to the caller unless you also return it (or the caller never needed it)."
    },
    {
      id: "f04", kind: "predict", group: "Call, arguments, return", title: "Copy, not the box",
      prompt: "What does this program print?",
      code: "#include <stdio.h>\n\nvoid bump(int n) {\n  n = n + 1;\n}\n\nint main(void) {\n  int x = 4;\n  bump(x);\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "n is a copy of 4. Changing n does not change x. Chapter 8 is how you change x.",
      accept: ["4"],
      shortWhy: "x stays 4. Only the copy was changed.",
      answerCode: "void bump(int n) {   /* n is a NEW box, copy of 4 */\n  n = n + 1;         /* n is 5. x is not this box. */\n}                    /* n is destroyed. x never saw 5. */\n\nint main(void) {\n  int x = 4;         /* caller's box */\n  bump(x);           /* what goes IN: copy of 4. main waits. */\n  printf(\"%d\\n\", x); /* x is still 4 */\n  return 0;\n}\n\n/* Output:\n4\n*/",
      answerWhy: "Pass by value. What goes in is a copy. What comes back is nothing (void). The caller's box x is unchanged."
    },
    {
      id: "f05", kind: "tf", group: "Call, arguments, return", title: "Copies",
      prompt: "In normal C, are arguments copies of the values you pass (pass by value)?",
      hint: "The callee gets new boxes. Pointers (Chapter 8) pass an address, which is still a copied address, but that is later.",
      accept: ["yes"],
      shortWhy: "Yes. Ints are copied. The callee does not receive the caller's box.",
      answerCode: "/* add(x, y) does NOT receive boxes x and y.\n   It receives copies of the numbers that were in x and y.\n   That is pass by value.\n*/",
      answerWhy: "Yes. That is why bump(x) cannot change x. You will need &x in Chapter 8 to give the address of the box."
    },
    {
      id: "f06", kind: "predict", group: "Call, arguments, return", title: "void still runs",
      prompt: "What does this program print? Write both lines, first then second.",
      code: "#include <stdio.h>\n\nvoid hello(void) {\n  printf(\"hi\\n\");\n}\n\nint main(void) {\n  hello();\n  printf(\"done\\n\");\n  return 0;\n}",
      hint: "hello returns nothing, but main still waits until hello's printf has finished.",
      accept: ["hi\ndone", "hi done"],
      shortWhy: "hi first (inside hello). done after hello returns.",
      answerCode: "void hello(void) {     /* what comes back: nothing */\n  printf(\"hi\\n\");     /* side effect while main waits */\n}\n\nint main(void) {\n  hello();             /* main WAITS. no value to store */\n  printf(\"done\\n\");    /* after hello returns */\n  return 0;\n}\n\n/* Output:\nhi\ndone\n*/",
      answerWhy: "void means no value comes back. The caller still waits. Order: hi, then done."
    },
    {
      id: "f07", kind: "tf", group: "Call, arguments, return", title: "One return value",
      prompt: "Can a C function return two ints at once with one return statement (return a, b as two values)?",
      hint: "One return, one value. Two results need a struct or two pointers later.",
      accept: ["no"],
      shortWhy: "One return sends one value. Not two ints as two results.",
      answerCode: "/* Wrong idea:  return x, y;   as \"two results\"\n   In C, the comma operator would return only y, and this is not how you send two ints.\n\n   Right for this course:\n     return one int;\n   Later: struct, or pointers to two boxes (Ch8/Ch9).\n*/",
      answerWhy: "No. One return value (or void). fork looks like two returns only because there are two processes."
    },
    {
      id: "f08", kind: "fill", group: "Call, arguments, return", title: "Nothing comes back",
      prompt: "What return type means 'nothing comes back'?",
      hint: "Four letters. The function can still print or change memory through pointers later.",
      accept: ["void"],
      shortWhy: "void: no value comes back. The caller still waits.",
      answerCode: "void hello(void) {   /* first void: nothing comes BACK\n                        void in brackets: nothing goes IN */\n  printf(\"hi\\n\");\n}",
      answerWhy: "void. Do not write int if you have no return value. Do not assign hello() to an int."
    },
    {
      id: "f09", kind: "predict", group: "Call, arguments, return", title: "Inner call first",
      prompt: "What does this program print?",
      code: "#include <stdio.h>\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main(void) {\n  printf(\"%d\\n\", add(2, add(1, 1)));\n  return 0;\n}",
      hint: "Inner add(1, 1) runs first and returns 2. Then add(2, 2).",
      accept: ["4"],
      shortWhy: "Inner call first: 1+1=2, then 2+2=4.",
      answerCode: "printf(\"%d\\n\", add(2, add(1, 1)));\n/* Step A: inner add(1, 1) — in: 1,1  back: 2. main waits.\n   Step B: outer add(2, 2) — in: 2,2  back: 4. main waits.\n   Step C: printf prints 4.\n*/\n\n/* Output:\n4\n*/",
      answerWhy: "Nested calls: innermost finishes first. Each time, the caller of that call waits."
    },
    {
      id: "f10", kind: "write", group: "Call, arguments, return", title: "Write twice",
      prompt: "Write a function twice that takes one int n and returns 2 * n. Only the function, not main.",
      hint: "int twice(int n) { ... return ... }",
      must: ["int twice", "return", "n"],
      shortWhy: "What goes in: n. What comes back: 2*n. Caller waits.",
      answerCode: "int twice(int n) {   /* what goes IN: a copy of n */\n  return 2 * n;      /* what comes BACK: double that copy */\n}                    /* who waits: whoever called twice */",
      answerWhy: "Name, argument type, return type must match. The body can be return 2 * n; or a local box first. Both are fine if 2*n comes back."
    },
    {
      id: "f11", kind: "predict", group: "Call, arguments, return", title: "Dead line after return",
      prompt: "What does this program print?",
      code: "#include <stdio.h>\n\nint f(void) {\n  return 3;\n  printf(\"no\\n\");\n}\n\nint main(void) {\n  printf(\"%d\\n\", f());\n  return 0;\n}",
      hint: "return ends f. The printf inside f never runs.",
      accept: ["3"],
      shortWhy: "return 3 ends f. \"no\" is not printed.",
      answerCode: "int f(void) {\n  return 3;          /* value 3 goes BACK. f ENDS now. */\n  printf(\"no\\n\");    /* dead. never runs */\n}\n\nint main(void) {\n  printf(\"%d\\n\", f());  /* prints 3 */\n  return 0;\n}\n\n/* Output:\n3\n*/",
      answerWhy: "return does two jobs: send back, and stop. Lines after return in that function are not used."
    },
    {
      id: "f12", kind: "tf", group: "Call, arguments, return", title: "main is a function",
      prompt: "Is main a function?",
      hint: "It has a name, it can take arguments, it returns int to the OS.",
      accept: ["yes"],
      shortWhy: "main is the start function. The OS calls it.",
      answerCode: "int main(void) {    /* function named main\n                       what goes in: nothing here (void)\n                       what comes back: 0 to the operating system\n                       who called main? the OS / startup code */\n  return 0;\n}",
      answerWhy: "Yes. You call add. The OS calls main. Same three questions: in, back, who waits (the OS waits for your process to end)."
    },
    {
      id: "f13", kind: "predict", group: "Call, arguments, return", title: "Swap fails",
      prompt: "What does this program print? Two numbers, space between them.",
      code: "#include <stdio.h>\n\nvoid swap(int a, int b) {\n  int t = a;\n  a = b;\n  b = t;\n}\n\nint main(void) {\n  int x = 1, y = 2;\n  swap(x, y);\n  printf(\"%d %d\\n\", x, y);\n  return 0;\n}",
      hint: "swap shuffled copies. x and y in main did not move.",
      accept: ["1 2"],
      shortWhy: "Copies swapped. Caller's x and y still 1 and 2.",
      answerCode: "void swap(int a, int b) {  /* copies: a=1, b=2 */\n  int t = a;\n  a = b;\n  b = t;                   /* copies are 2 and 1. then they die. */\n}\n\nint main(void) {\n  int x = 1, y = 2;\n  swap(x, y);              /* in: copies. back: void. x,y unchanged */\n  printf(\"%d %d\\n\", x, y); /* 1 2 */\n  return 0;\n}\n\n/* Output:\n1 2\n*/",
      answerWhy: "To swap the caller's boxes you must pass papers: swap(&x, &y). That is Chapter 8. Here the answer is 1 2."
    },
    {
      id: "f14", kind: "write", group: "Call, arguments, return", title: "Return the larger",
      prompt: "Write int larger(int a, int b) that returns the larger of a and b. If equal, return a.",
      hint: "if (a >= b) return a; else return b;",
      must: ["int larger", "return"],
      shortWhy: "Two ints go in. One int comes back. Caller waits.",
      answerCode: "int larger(int a, int b) {   /* in: copies of two ints */\n  if (a >= b) {\n    return a;                /* back: a. function ends. */\n  }\n  return b;                  /* back: b */\n}\n/* who waits: the caller, until one of those returns. */",
      answerWhy: "One value comes back. Two returns in the source are still one return per call — only one path runs."
    },
    {
      id: "f15", kind: "fill", group: "Call, arguments, return", title: "Name the inputs",
      prompt: "In the call add(2, 3), what are 2 and 3 called? One word.",
      hint: "Not parameters. Parameters are the names a and b in the definition.",
      accept: ["arguments", "argument", "args"],
      shortWhy: "2 and 3 are arguments. a and b are parameters.",
      answerCode: "int add(int a, int b)  /* a, b = parameters (local boxes) */\n\nadd(2, 3);             /* 2, 3 = arguments (values that go IN) */",
      answerWhy: "Arguments go in. Parameters receive the copies. Use the words on the exam if asked."
    },
    {
      id: "f16", kind: "tf", group: "Call, arguments, return", title: "Locals die",
      prompt: "After a function returns, are its local parameter boxes gone?",
      hint: "When the sheet is thrown away, a and b do not exist.",
      accept: ["yes"],
      shortWhy: "Yes. Locals die on return. Only the returned value is kept by the caller.",
      answerCode: "int add(int a, int b) {\n  int s = a + b;  /* local box s */\n  return s;       /* the NUMBER 5 is copied back.\n                     boxes a, b, s are then gone. */\n}",
      answerWhy: "Yes. That is why returning a pointer to a local box is a bug. We do not do that in this course."
    },
    {
      id: "f17", kind: "predict", group: "Call, arguments, return", title: "Two calls",
      prompt: "What does this print? Two lines.",
      code: "#include <stdio.h>\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main(void) {\n  printf(\"%d\\n\", add(1, 1));\n  printf(\"%d\\n\", add(2, 2));\n  return 0;\n}",
      hint: "Each call is separate. First wait, print, then next call.",
      accept: ["2\n4", "2 4"],
      shortWhy: "First call returns 2. Second call returns 4.",
      answerCode: "printf(\"%d\\n\", add(1, 1));  /* in 1,1 back 2. main waits. prints 2 */\nprintf(\"%d\\n\", add(2, 2));  /* in 2,2 back 4. main waits. prints 4 */\n\n/* Output:\n2\n4\n*/",
      answerWhy: "Two calls, two waits, two returns. The function can be used again. That is the point of a named job."
    },
    {
      id: "f18", kind: "tf", group: "Call, arguments, return", title: "Library call",
      prompt: "Is printf a function?",
      hint: "You did not write its body. You still call it. Arguments go in. It returns an int (count of characters), and main waits.",
      accept: ["yes"],
      shortWhy: "Yes. You call it. The C library wrote the body.",
      answerCode: "printf(\"%d\\n\", 5);\n/* what goes in: a format string, then values\n   what comes back: an int (characters written), often ignored\n   who waits: the caller, until printing is done\n   who wrote it: the C library, prototype in stdio.h  (Ch10) */",
      answerWhy: "Yes. fork, wait, kill, mmap are the same kind of thing: functions you call, someone else wrote."
    },
    {
      id: "f19", kind: "tf", group: "Who waits", title: "Next line too early?",
      prompt: "Does the line after a function call run before that function has returned?",
      hint: "Normal C: no. The next line is after the wait.",
      accept: ["no"],
      shortWhy: "No. Next line is after return.",
      answerCode: "s = add(2, 3);     /* wait here */\nprintf(\"%d\\n\", s); /* only after add returns */",
      answerWhy: "No. If you think the next line overlaps, you are thinking of threads (two workers). A normal call is one worker walking into a job and coming back."
    },
    {
      id: "f20", kind: "fill", group: "Who waits", title: "Name the waiter",
      prompt: "In s = add(2, 3); inside main, who waits? One word.",
      hint: "The function that contains the call.",
      accept: ["main", "the caller", "caller"],
      shortWhy: "main waits. main is the caller.",
      answerCode: "int main(void) {\n  int s = add(2, 3);  /* CALLER = main. main waits.\n                         CALLEE = add. add runs, then returns. */\n  return 0;\n}",
      answerWhy: "The caller waits. Here the caller is main. If add called helper, add would wait for helper."
    },
    {
      id: "f21", kind: "tf", group: "Who waits", title: "void and waiting",
      prompt: "If a function returns void, does the caller still wait until the body finishes?",
      hint: "Nothing comes back, but the jump still returns.",
      accept: ["yes"],
      shortWhy: "Yes. void is about the value, not about waiting.",
      answerCode: "hello();           /* main waits until hello's body is done */\nprintf(\"done\\n\");  /* after that */",
      answerWhy: "Yes. Waiting is about control. Return type is about the value. Do not mix them."
    },
    {
      id: "f22", kind: "tf", group: "Who waits", title: "Nested wait",
      prompt: "If main calls f, and f calls g, does main still wait until g and f have both returned?",
      hint: "Stack of sheets. g on top, then f, then main at the bottom, frozen.",
      accept: ["yes"],
      shortWhy: "Yes. main waits the whole time. f waits for g. Then f returns to main.",
      answerCode: "/* main  waits  →  f  waits  →  g runs\n   g returns    →  f continues, then returns  →  main continues\n*/",
      answerWhy: "Yes. Who waits? Everyone below the current function. That picture will help when a lock waits inside a function you called."
    },
    {
      id: "f23", kind: "write", group: "Who waits", title: "A void helper",
      prompt: "Write void show(int n) that prints n as a decimal followed by a newline. Use printf(\"%d\\n\", n);",
      hint: "void show(int n) { printf(\"%d\\n\", n); }",
      must: ["void show", "printf", "n"],
      shortWhy: "In: copy of n. Back: nothing. Caller waits until printf finished.",
      answerCode: "void show(int n) {          /* in: copy of n */\n  printf(\"%d\\n\", n);        /* work. caller is waiting */\n}                           /* back: nothing. caller continues */",
      answerWhy: "Match the types. Do not return n. The job was to print, not to send n back."
    },
    {
      id: "f24", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "fork vs add",
      prompt: "Does fork() return once, like add(), to only one caller?",
      hint: "After a successful fork there are two processes. Each gets a return value.",
      accept: ["no"],
      shortWhy: "No. Successful fork returns twice: 0 in the child, pid in the parent.",
      answerCode: "pid_t r = fork();\n/* This one line is a function CALL.\n   After success there are TWO processes, each with its own r:\n     child:  r == 0\n     parent: r == child's pid (positive)\n   Fail: only parent, r == -1, no child.\n   Unlike add: not \"one return to one caller\".\n*/",
      answerWhy: "No. That is the exception you must say in an oral exam: fork is a function, but it returns in two processes."
    },
    {
      id: "f25", kind: "fill", group: "OS door · fork, wait, kill, handler", title: "Child's return",
      prompt: "In the child process, what does fork return? Type the number.",
      hint: "Zero means 'I am the child'.",
      accept: ["0"],
      shortWhy: "Child: fork returns 0.",
      answerCode: "pid_t r = fork();\nif (r == 0) {\n  /* CHILD. what came BACK from fork: 0 */\n}",
      answerWhy: "0 in the child. Positive pid in the parent. -1 on failure. Memorise this triple."
    },
    {
      id: "f26", kind: "fill", group: "OS door · fork, wait, kill, handler", title: "Parent's return",
      prompt: "On success, what does fork return in the parent? Two words: child's pid (or just pid).",
      hint: "The parent needs a number so it can wait or kill that child.",
      accept: ["child's pid", "child pid", "pid", "the child's pid", "process id of child"],
      shortWhy: "Parent gets the child's pid (a positive number).",
      answerCode: "pid_t r = fork();\nif (r > 0) {\n  /* PARENT. what came BACK: child's pid, stored in r */\n}",
      answerWhy: "The parent gets the child's pid. That value goes IN later to waitpid or kill."
    },
    {
      id: "f27", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "fork fail",
      prompt: "If fork returns -1, did it fail, and is there no child?",
      hint: "Negative is the error return, like many Unix functions.",
      accept: ["yes"],
      shortWhy: "Yes. -1 means fail. Still one process.",
      answerCode: "pid_t r = fork();\nif (r == -1) {\n  /* what came BACK: -1\n     who waits: you waited only for the failed call\n     no second process exists */\n  perror(\"fork\");\n}",
      answerWhy: "Yes. Always test -1. Do not treat -1 as a pid."
    },
    {
      id: "f28", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "fork does not wait",
      prompt: "Does calling fork make the parent wait until the child ends?",
      hint: "fork creates. wait waits. Different functions.",
      accept: ["no"],
      shortWhy: "No. After fork both continue. wait is the function that blocks the parent.",
      answerCode: "fork();     /* does NOT wait for the child to finish */\nwait(NULL); /* THIS is the call where the parent waits */",
      answerWhy: "No. Who waits? Not because of fork. Only if you call wait/waitpid (or you join a thread, later)."
    },
    {
      id: "f29", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "wait blocks",
      prompt: "Does wait(NULL) make the parent wait until a child ends?",
      hint: "The parent is the caller of wait. The caller waits.",
      accept: ["yes"],
      shortWhy: "Yes. Parent is frozen inside wait until a child ends.",
      answerCode: "if (r > 0) {\n  wait(NULL);  /* CALLER = parent\n                  what goes IN: NULL (we skip status)\n                  what comes BACK: pid of the dead child (or -1)\n                  who waits: the parent, here, until child ends */\n}",
      answerWhy: "Yes. This is Chapter 7's waiting rule applied to an OS function. The callee is wait. It does not return until the kernel says a child has ended."
    },
    {
      id: "f30", kind: "fill", group: "OS door · fork, wait, kill, handler", title: "Who calls wait",
      prompt: "In the usual exam picture, who calls wait? One word.",
      hint: "The process that created the child.",
      accept: ["parent", "the parent"],
      shortWhy: "The parent calls wait.",
      answerCode: "/* parent: wait(NULL);\n   child:  does work, then exit/return\n   The child does not wait for the parent in this picture.\n*/",
      answerWhy: "Parent calls wait. If nobody waits, the child can become a zombie until the parent waits or dies."
    },
    {
      id: "f31", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "kill's name",
      prompt: "Does kill(pid, sig) always end the process?",
      hint: "It sends a signal. SIGUSR1 does not mean die. SIGKILL does force end.",
      accept: ["no"],
      shortWhy: "No. kill sends a signal. The signal may or may not terminate.",
      answerCode: "kill(child_pid, SIGUSR1);\n/* what goes IN: who (pid), which signal (SIGUSR1)\n   what comes BACK: 0 on send ok, -1 on fail\n   who waits: only until the send is accepted\n   does the child die? NOT from SIGUSR1 by default.\n*/",
      answerWhy: "No. The name is historical. Say 'send a signal' in the oral."
    },
    {
      id: "f32", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "What kill does",
      prompt: "Is kill a function you call to send a signal to a pid?",
      hint: "Two arguments: pid and signal number.",
      accept: ["yes"],
      shortWhy: "Yes. Function call. Arguments in, 0/-1 back.",
      answerCode: "int kill(pid_t pid, int sig);  /* prototype idea */\nkill(pid, SIGUSR1);            /* call */",
      answerWhy: "Yes. Treat it as C: in, back, who waits (only for the send)."
    },
    {
      id: "f33", kind: "fill", group: "OS door · fork, wait, kill, handler", title: "Lab signal",
      prompt: "Which signal name do the HAW labs use as a user signal? Type it like SIGUSR1.",
      hint: "User signal number one.",
      accept: ["SIGUSR1"],
      shortWhy: "SIGUSR1. You can catch it with a handler.",
      answerCode: "kill(pid, SIGUSR1);     /* send */\nsignal(SIGUSR1, handler); /* register who to call when it arrives */",
      answerWhy: "SIGUSR1. It is not SIGKILL. You may install a handler for SIGUSR1."
    },
    {
      id: "f34", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "Do not call handler",
      prompt: "In the normal exam picture, do you call handler(SIGUSR1) yourself from main as the way the signal is handled?",
      hint: "You register it. The OS calls it later.",
      accept: ["no"],
      shortWhy: "No. You pass the address to signal(). The OS calls handler later.",
      answerCode: "signal(SIGUSR1, handler);  /* NOT handler(SIGUSR1);\n                               we pass the paper to the function,\n                               we do not run it now */",
      answerWhy: "No. If you write handler(SIGUSR1) in main, you run it now, as a normal call. That is not 'when the signal arrives'."
    },
    {
      id: "f35", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "Who calls handler",
      prompt: "When the signal arrives, does the operating system call your handler function?",
      hint: "You wrote the job. You are not the caller at arrival time.",
      accept: ["yes"],
      shortWhy: "Yes. OS is the caller. Argument is the signal number.",
      answerCode: "void handler(int sig) {   /* in: signal number, from the OS\n                             back: void\n                             who waits: the process is inside this\n                             call until handler returns */\n  (void)sig;\n  got = 1;\n}",
      answerWhy: "Yes. That is why the handler must stay tiny. It is a function, with a different caller than main."
    },
    {
      id: "f36", kind: "write", group: "OS door · fork, wait, kill, handler", title: "Tiny handler",
      prompt: "Write a handler named handler that takes int sig, ignores sig, and sets a global volatile int got to 1. Include the global variable.",
      hint: "volatile int got = 0;  then void handler(int sig) { (void)sig; got = 1; }",
      must: ["volatile", "got", "void handler", "got=1"],
      shortWhy: "You write the function. You do not call it. You set a flag only.",
      answerCode: "volatile int got = 0;     /* box main will watch. volatile: really read it */\n\nvoid handler(int sig) {   /* in: sig (OS passes it)\n                             back: void\n                             who calls: the OS, not main */\n  (void)sig;              /* we do not use the number */\n  got = 1;                /* ONLY this. no printf in the strict picture */\n}",
      answerWhy: "Flag plus tiny body. Register later with signal(SIGUSR1, handler). The second argument is the function's address (a paper to the job)."
    },
    {
      id: "f37", kind: "fill", group: "OS door · fork, wait, kill, handler", title: "signal() arguments",
      prompt: "In signal(SIGUSR1, handler), the second argument is the address of your function. What do we call a variable that holds a function's address? Two words.",
      hint: "Chapter 8 will deepen this. Two words: function pointer.",
      accept: ["function pointer", "a function pointer"],
      shortWhy: "Function pointer: paper that points at a job, not at an int.",
      answerCode: "signal(SIGUSR1, handler);\n/* first argument: which signal\n   second: function pointer (paper to handler)\n   do not write handler() here — that would CALL it */",
      answerWhy: "Function pointer. Same paper idea as Chapter 8, but the box is code."
    },
    {
      id: "f38", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "wait is a function",
      prompt: "Is wait a function the parent calls?",
      hint: "Prototype, arguments, return, caller waits. Yes.",
      accept: ["yes"],
      shortWhy: "Yes. Parent calls it. Parent waits inside it.",
      answerCode: "pid_t wait(int *status);\n/* in: paper to an int, or NULL\n   back: pid, or -1\n   who waits: the caller (parent) */",
      answerWhy: "Yes. If you can say that sentence, the OS story 'parent waits for child' is just this call."
    },
    {
      id: "f39", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "Child branch",
      prompt: "If r = fork() and r == 0, is this the child?",
      hint: "Zero is the child's return value.",
      accept: ["yes"],
      shortWhy: "Yes. r == 0 is the child.",
      answerCode: "pid_t r = fork();\nif (r == 0) {\n  /* child body */\n} else if (r > 0) {\n  /* parent body */\n}",
      answerWhy: "Yes. Do not mix: if (r == 0) is child, not parent."
    },
    {
      id: "f40", kind: "tf", group: "OS door · fork, wait, kill, handler", title: "Child waits for parent?",
      prompt: "In the usual exam picture, does the child call wait so it can wait for the parent to end?",
      hint: "wait waits for a child. The parent has no parent-child wait that way.",
      accept: ["no"],
      shortWhy: "No. wait waits for a child. The parent calls it.",
      answerCode: "/* parent: fork, then wait\n   child:  work, then exit\n   wait() waits for children, not for the parent.\n*/",
      answerWhy: "No. If you invert it, you describe the wrong waiter and you will miss zombie/orphan questions later."
    }
  ]
};
