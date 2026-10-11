window.C_OS_CHAPTER = {
  id: "ch08",
  drills: [
    {
      id: "p01", kind: "tf", group: "Paper vs box", title: "Not the money",
      prompt: "Is a pointer the same thing as the int it points to?",
      hint: "Paper vs box. The paper holds an address, not the int value (except by accident if you mix them).",
      accept: ["no"],
      shortWhy: "No. The pointer stores an address. The int stores the number.",
      answerCode: "int x = 5;     /* box: value 5 */\nint *p = &x;   /* paper: address of x, NOT 5 */\n/* p and x are different types of boxes */",
      answerWhy: "No. If you print p you get an address. If you print *p you get 5. Mixing them is the classic exam fail."
    },
    {
      id: "p02", kind: "fill", group: "Paper vs box", title: "Address of",
      prompt: "Which operator means 'the address of this box'? Type the character.",
      hint: "Ampersand. Same character as bitwise and, but here it is unary: &x.",
      accept: ["&"],
      shortWhy: "&x is the address of x. You write it on a paper.",
      answerCode: "int x = 5;\nint *p;\np = &x;    /* & = address-of. paper p now knows where x lives */",
      answerWhy: "&. Say 'address of' every time you type it, until it is automatic."
    },
    {
      id: "p03", kind: "fill", group: "Paper vs box", title: "Open the box",
      prompt: "If p already holds the address of x, which operator opens that box? Type the character.",
      hint: "Star. *p is the int. p is the paper.",
      accept: ["*"],
      shortWhy: "*p opens the box. That is dereference.",
      answerCode: "int x = 5;\nint *p = &x;\n*p = 9;     /* * = open the box. x is now 9 */\n/* In the declaration int *p, the * means 'this is a paper'. */",
      answerWhy: "* in a declaration means 'pointer type'. * in an expression means 'open'. Same character, two jobs."
    },
    {
      id: "p04", kind: "predict", group: "Paper vs box", title: "Read through paper",
      prompt: "What does this program print?",
      code: "#include <stdio.h>\n\nint main(void) {\n  int x = 5;\n  int *p = &x;\n  printf(\"%d\\n\", *p);\n  return 0;\n}",
      hint: "p points at x. *p is 5.",
      accept: ["5"],
      shortWhy: "*p opens x. x is 5.",
      answerCode: "int x = 5;        /* box x: 5 */\nint *p = &x;      /* paper p: address of x */\nprintf(\"%d\\n\", *p); /* open the box → 5 */\n\n/* Output:\n5\n*/",
      answerWhy: "One box. The paper only tells you where to look."
    },
    {
      id: "p05", kind: "predict", group: "Paper vs box", title: "Write through paper",
      prompt: "What does this program print?",
      code: "#include <stdio.h>\n\nint main(void) {\n  int x = 5;\n  int *p = &x;\n  *p = 9;\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "You wrote 9 into the box x using the paper. There is no second int.",
      accept: ["9"],
      shortWhy: "*p = 9 changed x. Prints 9.",
      answerCode: "int x = 5;\nint *p = &x;\n*p = 9;            /* open box x, write 9. same box. */\nprintf(\"%d\\n\", x); /* 9 */\n\n/* Output:\n9\n*/",
      answerWhy: "Writing through the pointer changes the original box. That is the whole point."
    },
    {
      id: "p06", kind: "tf", group: "Two papers, one box", title: "Copy paper",
      prompt: "If q = p and p points at x, do p and q point at the same box?",
      hint: "You copied the address, not the int.",
      accept: ["yes"],
      shortWhy: "Yes. Two papers, one box.",
      answerCode: "int x = 5;\nint *p = &x;\nint *q = p;   /* copy the ADDRESS onto a second paper */\n/* p and q both hold &x. one box. */",
      answerWhy: "Yes. This is the mutex picture: two threads, two pointer variables, one mutex object."
    },
    {
      id: "p07", kind: "predict", group: "Two papers, one box", title: "Second paper writes",
      prompt: "What does this print?",
      code: "#include <stdio.h>\n\nint main(void) {\n  int x = 1;\n  int *p = &x;\n  int *q = p;\n  *q = 7;\n  printf(\"%d\\n\", *p);\n  return 0;\n}",
      hint: "q and p are papers to the same x. *q = 7 fills x. *p reads x.",
      accept: ["7"],
      shortWhy: "One box x is 7. Both papers see it.",
      answerCode: "int x = 1;     /* box */\nint *p = &x;   /* paper 1 */\nint *q = p;    /* paper 2, same address */\n*q = 7;        /* x becomes 7 */\nprintf(\"%d\\n\", *p); /* 7 */\n\n/* Output:\n7\n*/",
      answerWhy: "Two papers, one box. If you thought 1, you treated q as a second int."
    },
    {
      id: "p08", kind: "tf", group: "Two papers, one box", title: "Second box?",
      prompt: "Does int *q = p; create a second int box with its own value?",
      hint: "It creates a second paper. The int already exists.",
      accept: ["no"],
      shortWhy: "No. Second paper. Same int.",
      answerCode: "/* int *q = p;  allocates a pointer variable q.\n   It does not allocate a new int.\n   The int is still x.\n*/",
      answerWhy: "No. Count boxes: one int named x, two pointer variables. Say the count on the exam."
    },
    {
      id: "p09", kind: "predict", group: "Why Chapter 7 was not enough", title: "bump still copy",
      prompt: "What prints?",
      code: "#include <stdio.h>\n\nvoid bump(int n) {\n  n = n + 1;\n}\n\nint main(void) {\n  int x = 4;\n  bump(x);\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "Same as Chapter 7. Copy.",
      accept: ["4"],
      shortWhy: "Copy. x stays 4.",
      answerCode: "void bump(int n) { n = n + 1; }  /* copy */\nbump(x);                         /* x still 4 */\n\n/* Output:\n4\n*/",
      answerWhy: "You must pass &x to change x. Next drill."
    },
    {
      id: "p10", kind: "predict", group: "Why Chapter 7 was not enough", title: "bump the box",
      prompt: "What prints?",
      code: "#include <stdio.h>\n\nvoid bump_box(int *p) {\n  *p = *p + 1;\n}\n\nint main(void) {\n  int x = 4;\n  bump_box(&x);\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "What goes in is the address of x. The function opens that box.",
      accept: ["5"],
      shortWhy: "Paper to x. x becomes 5.",
      answerCode: "void bump_box(int *p) {  /* in: a paper (copy of the address) */\n  *p = *p + 1;           /* open the caller's box x: 4 → 5 */\n}                        /* back: void. who waits: main */\n\nint main(void) {\n  int x = 4;\n  bump_box(&x);          /* pass ADDRESS, not 4 */\n  printf(\"%d\\n\", x);     /* 5 */\n  return 0;\n}\n\n/* Output:\n5\n*/",
      answerWhy: "The address is copied (pass by value of the pointer). The box it names is shared. That is how lock(&m) can change m."
    },
    {
      id: "p11", kind: "write", group: "Why Chapter 7 was not enough", title: "Write swap with papers",
      prompt: "Write void swap(int *a, int *b) that swaps the two ints the papers point at.",
      hint: "int t = *a; *a = *b; *b = t;",
      must: ["void swap", "int *", "*a", "*b"],
      shortWhy: "Papers in. Open both boxes. Swap the ints. Caller waited; their boxes are swapped.",
      answerCode: "void swap(int *a, int *b) {  /* in: two papers */\n  int t = *a;                /* read first box */\n  *a = *b;                   /* write first box */\n  *b = t;                    /* write second box */\n}\n/* call: swap(&x, &y);  never swap(x, y) if you want x and y to change */",
      answerWhy: "If you swap the papers a and b locally, the caller still has the same papers and the same boxes. You must swap *a and *b."
    },
    {
      id: "p12", kind: "fill", group: "Why Chapter 7 was not enough", title: "Call with address",
      prompt: "To let bump_box change x, you call bump_box(____). Fill the argument (3 characters: address of x).",
      hint: "Address-of x.",
      accept: ["&x"],
      shortWhy: "&x is the paper to x.",
      answerCode: "int x = 4;\nbump_box(&x);   /* NOT bump_box(x) */",
      answerWhy: "&x. Mutex: pthread_mutex_lock(&m) is the same shape."
    },
    {
      id: "p13", kind: "tf", group: "NULL", title: "Open NULL",
      prompt: "Is it safe to do *p when p is NULL?",
      hint: "NULL means nowhere. Opening it crashes.",
      accept: ["no"],
      shortWhy: "No. Never dereference NULL.",
      answerCode: "int *p = NULL;\n/* *p = 1;   FORBIDDEN. paper points nowhere. */\nif (p != NULL) {\n  *p = 1;    /* only then */\n}",
      answerWhy: "No. mmap failure is the same idea: do not open a bad paper."
    },
    {
      id: "p14", kind: "fill", group: "NULL", title: "The nowhere value",
      prompt: "What do we store on a paper to mean 'nowhere'? Four letters, capitals.",
      hint: "N-U-L-L.",
      accept: ["NULL"],
      shortWhy: "NULL. Test before *p.",
      answerCode: "int *p = NULL;   /* paper, nowhere */\nif (p == NULL) {\n  /* do not open */\n}",
      answerWhy: "NULL. Some functions return NULL on error. That is the failure paper."
    },
    {
      id: "p15", kind: "tf", group: "void *", title: "mmap's return type",
      prompt: "Does mmap return a void * (a paper to bytes, type not specified yet)?",
      hint: "You then assign it to int * or struct Block *.",
      accept: ["yes"],
      shortWhy: "Yes. void * then you choose the type of paper.",
      answerCode: "void *raw = mmap(...);\nif (raw == MAP_FAILED) { /* bad paper */ }\nint *p = raw;            /* now we treat bytes as ints */",
      answerWhy: "Yes. void * is still a paper. It is not an int."
    },
    {
      id: "p16", kind: "tf", group: "void *", title: "Star on void *",
      prompt: "Should you write *raw as if raw were an int* when raw is still void *?",
      hint: "Give it a real type first.",
      accept: ["no"],
      shortWhy: "No. Convert / assign to the typed pointer first.",
      answerCode: "void *raw = mmap(...);\n/* *raw = 1;     wrong picture for this course */\nint *p = raw;\n*p = 1;           /* typed paper, then open */",
      answerWhy: "No. Choose the type of box you believe is there, then open."
    },
    {
      id: "p17", kind: "tf", group: "Function pointer", title: "Name without call",
      prompt: "In signal(SIGUSR1, handler), is handler passed without calling it (no parentheses)?",
      hint: "handler() would run it now. handler is the paper to the job.",
      accept: ["yes"],
      shortWhy: "Yes. Pass the address. Do not call it there.",
      answerCode: "signal(SIGUSR1, handler);   /* paper to the function */\n/* signal(SIGUSR1, handler());  would CALL handler now — wrong */",
      answerWhy: "Yes. Function pointer: paper to code."
    },
    {
      id: "p18", kind: "tf", group: "volatile", title: "Why volatile",
      prompt: "Can a signal handler change a flag while main is looping on that flag, so main must really re-read the box?",
      hint: "That is why volatile int got.",
      accept: ["yes"],
      shortWhy: "Yes. volatile: do not assume the box is still 0.",
      answerCode: "volatile int got = 0;   /* handler may set this to 1 */\nvoid handler(int sig) { (void)sig; got = 1; }\n/* main loops: while (!got) { }  must REALLY read got */",
      answerWhy: "Yes. Hardware GPIO registers need the same idea: the box can change without your assignment."
    },
    {
      id: "p19", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "lock needs a paper",
      prompt: "Must pthread_mutex_lock receive the address of the mutex (&m), not a copy of the mutex by value, so both threads lock the same box?",
      hint: "If each thread locked a copy, the lock would be a lie.",
      accept: ["yes"],
      shortWhy: "Yes. One mutex box, papers to it. lock(&m).",
      answerCode: "pthread_mutex_t m;              /* the BOX */\npthread_mutex_lock(&m);          /* the PAPER */\n/* pthread_mutex_lock(m);  wrong shape: not the address */",
      answerWhy: "Yes. Two threads: each calls lock(&m) with papers to the SAME m. Two papers, one lock box."
    },
    {
      id: "p20", kind: "fill", group: "OS door · mutex, mmap, GPIO", title: "lock argument",
      prompt: "Fill the argument: pthread_mutex_lock(____); for a mutex named m.",
      hint: "Address of m.",
      accept: ["&m"],
      shortWhy: "&m is the paper to the mutex box.",
      answerCode: "pthread_mutex_t m;\npthread_mutex_init(&m, NULL);  /* init also wants a paper */\npthread_mutex_lock(&m);\n/* critical section */\npthread_mutex_unlock(&m);",
      answerWhy: "&m. init, lock, unlock all take a paper to the same box."
    },
    {
      id: "p21", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "Two mutex variables",
      prompt: "If thread A has mutex m1 and thread B has a different mutex m2, and each locks its own, are they still synchronising the same shared int?",
      hint: "Two lock boxes. Neither waits for the other.",
      accept: ["no"],
      shortWhy: "No. Two papers to two boxes is not a shared lock.",
      answerCode: "/* WRONG picture:\n     thread A: lock(&m1)\n     thread B: lock(&m2)\n   two boxes. the shared int is not protected.\n   RIGHT: both lock(&m) for one m both can see.\n*/",
      answerWhy: "No. Count mutex boxes. You need one. Threads hold papers to it."
    },
    {
      id: "p22", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "mmap returns a paper",
      prompt: "Does mmap return a pointer (a paper to a window of bytes), not an int counter?",
      hint: "void *, or MAP_FAILED.",
      accept: ["yes"],
      shortWhy: "Yes. The return value is a paper. You then open *p.",
      answerCode: "int *p = mmap(NULL, sizeof(int), PROT_READ | PROT_WRITE,\n              MAP_SHARED, fd, 0);\nif (p == MAP_FAILED) { /* bad paper */ }\n*p = 1;   /* write the SHARED box */",
      answerWhy: "Yes. shm_open returns an fd (int). mmap returns the paper. Do not mix the two returns."
    },
    {
      id: "p23", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "MAP_SHARED",
      prompt: "With MAP_SHARED, if process A writes *p = 7, can process B see 7 through its own paper to the same mapping?",
      hint: "Two papers, one shared box.",
      accept: ["yes"],
      shortWhy: "Yes. That is shared memory in C.",
      answerCode: "/* A: *p = 7;\n   B: reads *p  → 7\n   two processes, two pointer variables, ONE physical box\n   because MAP_SHARED.\n*/",
      answerWhy: "Yes. Private mappings would be two boxes. The flag MAP_SHARED is what makes one box."
    },
    {
      id: "p24", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "MAP_FAILED",
      prompt: "If mmap returns MAP_FAILED, should you avoid using *p?",
      hint: "Bad paper. Same family as NULL.",
      accept: ["yes"],
      shortWhy: "Yes. Test the paper before you open it.",
      answerCode: "void *raw = mmap(...);\nif (raw == MAP_FAILED) {\n  perror(\"mmap\");\n  return 1;     /* do not dereference */\n}",
      answerWhy: "Yes. Always test. Then assign to a typed pointer."
    },
    {
      id: "p25", kind: "fill", group: "OS door · mutex, mmap, GPIO", title: "Who returns the paper",
      prompt: "Which function returns the pointer to shared bytes: shm_open or mmap? Type mmap or shm_open.",
      hint: "shm_open returns a file descriptor (int). Then mmap uses that fd.",
      accept: ["mmap"],
      shortWhy: "mmap returns the paper. shm_open returns an fd.",
      answerCode: "int fd = shm_open(\"/myshm\", O_RDWR, 0600);  /* back: int fd, or -1 */\nint *p = mmap(..., fd, 0);                   /* back: paper, or MAP_FAILED */",
      answerWhy: "mmap. Mixing this with shm_open is a common lab bug: people print the fd and think it is the count."
    },
    {
      id: "p26", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "GPIO is still a paper",
      prompt: "In the GPIO lab, is the mmap result still a pointer to registers (paper vs box), not a new kind of C?",
      hint: "You write through the pointer. The box is hardware.",
      accept: ["yes"],
      shortWhy: "Yes. Same * and &. The box happens to be a register.",
      answerCode: "volatile unsigned *reg = /* mmap window */;\n*reg = value;   /* write the hardware box through the paper */",
      answerWhy: "Yes. If you copy *reg into a local int and only change the local, the pin does not move. You must write through the paper."
    },
    {
      id: "p27", kind: "tf", group: "OS door · mutex, mmap, GPIO", title: "Copy of a register",
      prompt: "If you copy a GPIO register into a local int, change the local int, and never write back through the pointer, does the pin change?",
      hint: "You edited a private box. Hardware did not see it.",
      accept: ["no"],
      shortWhy: "No. The pin follows the hardware box, not your copy.",
      answerCode: "int copy = *reg;  /* private box */\ncopy = copy | 1;  /* pin unchanged */\n*reg = copy;      /* NOW the hardware box updates */",
      answerWhy: "No. Always end with a write through the pointer if you want hardware to see it."
    },
    {
      id: "p28", kind: "predict", group: "Trace more", title: "p vs *p",
      prompt: "x is 3. p = &x. What does printf(\"%d\\n\", *p); print?",
      code: "int x = 3;\nint *p = &x;\nprintf(\"%d\\n\", *p);",
      hint: "*p opens x.",
      accept: ["3"],
      shortWhy: "3. Opening the box, not printing the address.",
      answerCode: "int x = 3;\nint *p = &x;\nprintf(\"%d\\n\", *p);  /* 3, because * opens the box */\n/* printf(\"%p\\n\", (void*)p);  would be the ADDRESS, not asked */\n\n/* Output:\n3\n*/",
      answerWhy: "If the question prints *p, it is the int. If it printed p as a pointer, it would be an address. Read the star."
    },
    {
      id: "p29", kind: "predict", group: "Trace more", title: "After two writes",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 0;\n  int *p = &x;\n  *p = *p + 2;\n  *p = *p + 2;\n  printf(\"%d\\n\", x);\n  return 0;\n}",
      hint: "Same box twice. 0+2+2.",
      accept: ["4"],
      shortWhy: "x is 4. One box, two updates.",
      answerCode: "int x = 0;\nint *p = &x;\n*p = *p + 2;   /* x = 2 */\n*p = *p + 2;   /* x = 4 */\nprintf(\"%d\\n\", x);\n\n/* Output:\n4\n*/",
      answerWhy: "This is the race picture without threads: two updates of one box. With two threads and no lock, one update can be lost. The lock protects this box."
    },
    {
      id: "p30", kind: "tf", group: "Trace more", title: "fork copies papers",
      prompt: "After fork, do parent and child each have their own copy of the pointer variable (the paper), which may still address MAP_SHARED bytes (one box)?",
      hint: "fork copies memory. Pointer values are copied. Shared mapping still names one physical box.",
      accept: ["yes"],
      shortWhy: "Yes. Two paper variables, maybe one shared box if MAP_SHARED.",
      answerCode: "int *p = mmap(..., MAP_SHARED, ...);\nfork();\n/* parent has p, child has p (copied address).\n   MAP_SHARED: same physical bytes.\n   Without share: child's writes would be private. */",
      answerWhy: "Yes. This sentence connects Chapter 7 fork to Chapter 8 papers. You will reuse it in OS shared memory."
    },
    {
      id: "p31", kind: "write", group: "Trace more", title: "Set through paper",
      prompt: "Write a function void set(int *p, int v) that writes v into the box p points at. Do not write if p is NULL.",
      hint: "if (p != NULL) *p = v;",
      must: ["void set", "int *p", "NULL", "*p"],
      shortWhy: "Test the paper, then open the box.",
      answerCode: "void set(int *p, int v) {  /* in: paper p, value v */\n  if (p == NULL) {         /* nowhere: do not open */\n    return;\n  }\n  *p = v;                  /* open the caller's box */\n}",
      answerWhy: "Always the NULL test in lab style. Then dereference."
    },
    {
      id: "p32", kind: "fill", group: "Trace more", title: "Declaration",
      prompt: "Write the declaration of a paper named p that will point at an int. Four tokens like: int * p ; (spaces optional). Use: int *p;",
      hint: "Type, star, name, semicolon.",
      accept: ["int *p;", "int* p;", "int * p;"],
      shortWhy: "int *p; paper for an int.",
      answerCode: "int *p;     /* paper, not yet aiming at a box */\np = NULL;   /* optional: start at nowhere */\np = &x;     /* now it aims at x */",
      answerWhy: "int *p; The star binds to p. Uninitialised p is garbage — do not open it."
    },
    {
      id: "p33", kind: "tf", group: "Trace more", title: "Semaphore paper",
      prompt: "Does a POSIX semaphore also get passed by address (sem_wait(&s) or a pointer from sem_open), same paper-vs-box idea as a mutex?",
      hint: "One semaphore object. Functions take a pointer.",
      accept: ["yes"],
      shortWhy: "Yes. Pointer to one semaphore box.",
      answerCode: "sem_t s;\nsem_init(&s, 1, 1);   /* paper to s. pshared=1 if processes share */\nsem_wait(&s);\nsem_post(&s);\n/* named: sem_t *ps = sem_open(\"/go\", ...); then sem_wait(ps); */",
      answerWhy: "Yes. Mutex or semaphore: never lock a copy."
    },
    {
      id: "p34", kind: "tf", group: "Trace more", title: "Hardest chapter",
      prompt: "If you only memorise the character * and never name the box, will mutex and mmap still feel like magic?",
      hint: "The course rule: name the paper, name the box, count the boxes.",
      accept: ["yes"],
      shortWhy: "Yes. Boss skill is naming the box, not counting stars.",
      answerCode: "/* For every * in a lab file, say:\n     paper name: ...\n     box name: ...\n     how many boxes: ...\n     who else has a paper: ...\n*/",
      answerWhy: "Yes. Practice until the four-line speech is automatic. Then OS pages are readable."
    },
    {
      id: "p35", kind: "predict", group: "Trace more", title: "Which box",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int x = 1, y = 2;\n  int *p = &x;\n  p = &y;\n  *p = 9;\n  printf(\"%d %d\\n\", x, y);\n  return 0;\n}",
      hint: "p moved from x to y. *p writes y. x stays 1.",
      accept: ["1 9"],
      shortWhy: "x=1, y=9. The paper changed target.",
      answerCode: "int x = 1, y = 2;\nint *p = &x;   /* paper aims at x */\np = &y;        /* paper now aims at y. x untouched */\n*p = 9;        /* y = 9 */\nprintf(\"%d %d\\n\", x, y);  /* 1 9 */\n\n/* Output:\n1 9\n*/",
      answerWhy: "Moving the paper does not move the old box. You retarget. Mutex code must not retarget to a private mutex by accident."
    },
    {
      id: "p36", kind: "write", group: "Trace more", title: "Init paper",
      prompt: "In main, declare int x = 10; and a pointer p to x, then set *p to 11. Full main that returns 0. Include stdio not required.",
      hint: "int x = 10; int *p = &x; *p = 11; return 0;",
      must: ["int x", "int *p", "&x", "*p=11"],
      shortWhy: "Box, paper, address-of, open and write.",
      answerCode: "int main(void) {\n  int x = 10;     /* box */\n  int *p = &x;    /* paper → x */\n  *p = 11;        /* box x is 11 */\n  return 0;\n}",
      answerWhy: "This is the minimum pointer program. If you can write it from nothing, Chapter 8 is starting to stick."
    }
  ]
};
