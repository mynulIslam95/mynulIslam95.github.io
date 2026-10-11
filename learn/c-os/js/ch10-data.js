window.C_OS_CHAPTER = {
  id: "ch10",
  drills: [
    {
      id: "h01", kind: "tf", group: "What #include does", title: "Header vs body",
      prompt: "Is a header a bag of prototypes (names and types), not the machine-code body of the function?",
      hint: "Chapter 7 prototypes live in .h files. The body lives in a library.",
      accept: ["yes"],
      shortWhy: "Yes. #include tells the compiler the name. -l tells the linker where the body is.",
      answerCode: "/* pthread.h  — prototype:\n     int pthread_mutex_lock(pthread_mutex_t *mutex);\n   libpthread — the real function body\n*/",
      answerWhy: "Yes. Mixing these two layers is why people say 'lock does not work' when the program did not even build."
    },
    {
      id: "h02", kind: "fill", group: "What #include does", title: "The directive",
      prompt: "Which preprocessor directive copies a header into your file? Type it including the # (8 letters after # is wrong — type #include).",
      hint: "Hash include.",
      accept: ["#include"],
      shortWhy: "#include copies the header text before compile.",
      answerCode: "#include <stdio.h>     /* copies prototypes for printf */\n#include <pthread.h>   /* copies prototypes for mutex */",
      answerWhy: "#include. Angle brackets for system headers."
    },
    {
      id: "h03", kind: "tf", group: "What #include does", title: "stdio",
      prompt: "Do you need #include <stdio.h> to call printf in the usual way?",
      hint: "Otherwise the compiler never heard of printf (or guesses wrong).",
      accept: ["yes"],
      shortWhy: "Yes. stdio.h is the toolkit for printf.",
      answerCode: "#include <stdio.h>\nint main(void) {\n  printf(\"ok\\n\");\n  return 0;\n}",
      answerWhy: "Yes. Missing header = compile problem, not a logic problem."
    },
    {
      id: "h04", kind: "fill", group: "What #include does", title: "Mutex header",
      prompt: "Which header declares pthread_mutex_lock? Type pthread.h",
      hint: "Threads and mutexes.",
      accept: ["pthread.h", "<pthread.h>", "#include <pthread.h>"],
      shortWhy: "pthread.h. Then you still need -lpthread to link.",
      answerCode: "#include <pthread.h>   /* compile-time names:\n                           pthread_mutex_t\n                           pthread_mutex_lock */",
      answerWhy: "pthread.h for the compiler. -lpthread for the linker. Both."
    },
    {
      id: "h05", kind: "tf", group: "Compile vs link", title: "Two steps",
      prompt: "Are 'unknown name / undeclared' a compile problem (header), and 'undefined reference' a link problem (library flag)?",
      hint: "Read the error line. Those two phrases are different layers.",
      accept: ["yes"],
      shortWhy: "Yes. Header vs -l. Do not mix the fixes.",
      answerCode: "/* compile:  implicit declaration of function 'fork'\n             unknown type name 'pthread_mutex_t'\n   FIX: #include the right header\n\n   link:     undefined reference to `pthread_mutex_lock'\n   FIX: gcc ... -lpthread\n*/",
      answerWhy: "Yes. Say the layer in the oral: compile or link."
    },
    {
      id: "h06", kind: "fill", group: "Compile vs link", title: "Link flag threads",
      prompt: "Which gcc flag links libpthread? Type -lpthread",
      hint: "Dash L pthread. Library pthread.",
      accept: ["-lpthread"],
      shortWhy: "-lpthread. After your .c file on old gcc.",
      answerCode: "gcc lab.c -o lab -lpthread\n/* -lpthread = link libpthread = bodies for lock/unlock/create */",
      answerWhy: "-lpthread. Without it, headers are not enough."
    },
    {
      id: "h07", kind: "fill", group: "Compile vs link", title: "Link flag shm",
      prompt: "Which gcc flag often links shm_open on Linux? Type -lrt",
      hint: "Real-time library.",
      accept: ["-lrt"],
      shortWhy: "-lrt. If the linker still cannot find shm_open, add it.",
      answerCode: "gcc lab.c -o lab -lpthread -lrt\n/* -lrt = librt. shm_open, sometimes clock_gettime, shm_unlink */",
      answerWhy: "-lrt. Some new glibc already has shm_open in libc. If you see undefined reference, add -lrt anyway."
    },
    {
      id: "h08", kind: "tf", group: "Compile vs link", title: "printf default",
      prompt: "Does gcc usually link printf for you without -l something extra?",
      hint: "C library is default. pthread is not.",
      accept: ["yes"],
      shortWhy: "Yes. printf is in libc. Mutex is not default.",
      answerCode: "gcc hi.c -o hi          /* printf: enough */\ngcc lab.c -o lab        /* mutex: NOT enough */\ngcc lab.c -o lab -lpthread -lrt",
      answerWhy: "Yes. That is why a hello program builds and a mutex lab does not, even with the same student."
    },
    {
      id: "h09", kind: "fill", group: "Compile vs link", title: "Read the error",
      prompt: "The linker says: undefined reference to `pthread_mutex_lock`. Which flag is missing? Type -lpthread",
      hint: "The header probably worked. The body was not found.",
      accept: ["-lpthread"],
      shortWhy: "Undefined reference = add -lpthread.",
      answerCode: "/* This error is AFTER compile succeeded.\n   gcc lab.c -o lab -lpthread\n*/",
      answerWhy: "-lpthread. If it had said 'undeclared', you would include pthread.h instead."
    },
    {
      id: "h10", kind: "fill", group: "Compile vs link", title: "Undeclared",
      prompt: "The compiler says: implicit declaration of function 'fork' or 'fork' undeclared. What is missing — a header name. Type unistd.h",
      hint: "fork lives in unistd.h.",
      accept: ["unistd.h", "<unistd.h>", "#include <unistd.h>"],
      shortWhy: "unistd.h. Compile error, not -lpthread.",
      answerCode: "#include <unistd.h>   /* fork, exec, sleep, close */\npid_t r = fork();",
      answerWhy: "unistd.h. Do not add -lpthread for fork. Wrong layer."
    },
    {
      id: "h11", kind: "tf", group: "Why lock fails", title: "Lock fail compile",
      prompt: "If you call pthread_mutex_lock but you forgot #include <pthread.h>, can the build fail at compile time?",
      hint: "Unknown name.",
      accept: ["yes"],
      shortWhy: "Yes. Missing header. First item on the lock checklist.",
      answerCode: "/* missing pthread.h → unknown pthread_mutex_t / implicit lock() */\n#include <pthread.h>   /* fix step 1 */",
      answerWhy: "Yes. Then still add -lpthread. Two steps."
    },
    {
      id: "h12", kind: "tf", group: "Why lock fails", title: "Lock fail link",
      prompt: "If pthread.h is included but you compile gcc lab.c -o lab with no extra flags, can you get undefined reference to pthread_mutex_lock?",
      hint: "Body not linked.",
      accept: ["yes"],
      shortWhy: "Yes. Missing -lpthread.",
      answerCode: "gcc lab.c -o lab            /* FAIL at link for mutex */\ngcc lab.c -o lab -lpthread  /* step 2 */",
      answerWhy: "Yes. This is the most common lab 'mutex broken' that is not a race."
    },
    {
      id: "h13", kind: "tf", group: "Why lock fails", title: "Wrong layer",
      prompt: "If the program built, and then two threads still race, is the fix to add -lpthread again?",
      hint: "It already linked. Now it is Chapter 8/9: same mutex box, &m, shared struct.",
      accept: ["no"],
      shortWhy: "No. Build already worked. Now it is pointers and who shares the box.",
      answerCode: "/* built OK, still races:\n     - two mutex boxes\n     - lock by value\n     - count is a local int\n   not a missing -lpthread\n*/",
      answerWhy: "No. Chapter 10 ends when it runs. Races are 8 and 9."
    },
    {
      id: "h14", kind: "write", group: "Why lock fails", title: "Build line",
      prompt: "Write the gcc command to build lab.c into program lab with pthread and rt. One line.",
      hint: "gcc lab.c -o lab -lpthread -lrt",
      must: ["gcc", "lab.c", "-o", "lab", "-lpthread", "-lrt"],
      shortWhy: "Source, output, then the two libraries.",
      answerCode: "gcc lab.c -o lab -lpthread -lrt\n/* lab.c  = your file\n   -o lab = output name\n   -lpthread = mutex/threads bodies\n   -lrt = shm_open / POSIX rt bits on many Linux boxes */",
      answerWhy: "Libraries after the .c file. That order is the safe habit."
    },
    {
      id: "h15", kind: "tf", group: "Why shm_open fails", title: "shm compile",
      prompt: "Can a missing #include <sys/mman.h> (and often fcntl.h) make shm_open undeclared at compile time?",
      hint: "Same layer as fork without unistd.h.",
      accept: ["yes"],
      shortWhy: "Yes. Include the man-page headers first.",
      answerCode: "#include <fcntl.h>\n#include <sys/mman.h>\n#include <sys/stat.h>\nint fd = shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600);",
      answerWhy: "Yes. Undeclared = header. Then you still may need -lrt."
    },
    {
      id: "h16", kind: "tf", group: "Why shm_open fails", title: "shm link",
      prompt: "Can missing -lrt cause undefined reference to shm_open even if the headers are correct?",
      hint: "Linux linker, librt.",
      accept: ["yes"],
      shortWhy: "Yes. That is the second shm_open failure.",
      answerCode: "gcc lab.c -o lab -lpthread -lrt\n/* undefined reference to `shm_open'  → add -lrt */",
      answerWhy: "Yes. Header cannot fix a link error. Add -lrt."
    },
    {
      id: "h17", kind: "fill", group: "Why shm_open fails", title: "POSIX name",
      prompt: "A POSIX shared-memory name should look like /myshm. Type that example including the slash.",
      hint: "Leading slash.",
      accept: ["/myshm"],
      shortWhy: "/myshm not myshm.",
      answerCode: "shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600);\n/* leading slash. this is not a path on disk in the usual way. */",
      answerWhy: "/myshm. Wrong name can fail at run time even if the program built. Build vs run: still read the layer."
    },
    {
      id: "h18", kind: "tf", group: "Why shm_open fails", title: "Return type mix",
      prompt: "Does shm_open return an int file descriptor, while mmap returns the pointer?",
      hint: "Two functions, two return types. Chapter 7+8.",
      accept: ["yes"],
      shortWhy: "Yes. fd from shm_open. paper from mmap.",
      answerCode: "int fd = shm_open(\"/myshm\", O_RDWR, 0600);  /* int, or -1 */\nif (fd == -1) { perror(\"shm_open\"); }\nstruct Block *b = mmap(NULL, sizeof(struct Block),\n                       PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);\n/* b is the paper. fd is not. */",
      answerWhy: "Yes. If shm_open 'fails' in your head because you treated fd as a pointer, that is not a header bug."
    },
    {
      id: "h19", kind: "fill", group: "Why shm_open fails", title: "wait header",
      prompt: "Which header declares wait and waitpid? Type sys/wait.h",
      hint: "Not unistd.h for waitpid on the usual split.",
      accept: ["sys/wait.h", "<sys/wait.h>", "#include <sys/wait.h>"],
      shortWhy: "sys/wait.h for wait.",
      answerCode: "#include <sys/wait.h>\nwait(NULL);\nwaitpid(pid, &status, 0);",
      answerWhy: "sys/wait.h. fork is unistd.h. Two headers, two functions, both Chapter 7."
    },
    {
      id: "h20", kind: "fill", group: "Why shm_open fails", title: "signal header",
      prompt: "Which header declares signal, kill, SIGUSR1? Type signal.h",
      hint: "The word signal.",
      accept: ["signal.h", "<signal.h>", "#include <signal.h>"],
      shortWhy: "signal.h.",
      answerCode: "#include <signal.h>\nsignal(SIGUSR1, handler);\nkill(pid, SIGUSR1);",
      answerWhy: "signal.h. No extra -l for these on a normal Linux gcc, unlike pthread."
    },
    {
      id: "h21", kind: "tf", group: "A file that builds", title: "Full checklist",
      prompt: "To build a lab with mutex + shm_open, do you need the right #include lines AND gcc ... -lpthread -lrt?",
      hint: "Both layers.",
      accept: ["yes"],
      shortWhy: "Yes. Headers and libraries. Then pointers and structs for the logic.",
      answerCode: "/* file: pthread.h, sys/mman.h, fcntl.h, sys/stat.h, unistd.h, stdio.h\n   command: gcc lab.c -o lab -lpthread -lrt\n*/",
      answerWhy: "Yes. Chapter 10 is this checklist. If it still fails after that, read the exact error: still compile vs still link vs now run."
    },
    {
      id: "h22", kind: "write", group: "A file that builds", title: "Includes for mutex",
      prompt: "Write the include line for mutexes. Exactly: #include <pthread.h>",
      hint: "Angle brackets, pthread.h",
      must: ["#include", "<pthread.h>"],
      shortWhy: "That include is step 1. Step 2 is still -lpthread.",
      answerCode: "#include <pthread.h>   /* prototypes and pthread_mutex_t */\n/* not enough alone:\n   gcc lab.c -o lab -lpthread\n*/",
      answerWhy: "Exact line. Quotes \"pthread.h\" would look for a local file. Labs use angle brackets."
    },
    {
      id: "h23", kind: "tf", group: "A file that builds", title: "Your own .h",
      prompt: "If you put the prototype of bump in block.h and #include \"block.h\", is that still the same idea as Chapter 7 prototypes, just in another file?",
      hint: "You still compile/link all .c files. The header is still not the body.",
      accept: ["yes"],
      shortWhy: "Yes. Same prototype idea. Not a new language.",
      answerCode: "/* block.h */\nvoid bump(struct Block *b);   /* prototype only */\n\n/* block.c */\nvoid bump(struct Block *b) { ... }  /* body */\n\n/* gcc main.c block.c -o lab -lpthread -lrt */",
      answerWhy: "Yes. OS labs usually stay one file. If you split, you still link every .c and you still need -lpthread."
    },
    {
      id: "h24", kind: "tf", group: "A file that builds", title: "perror",
      prompt: "After shm_open returns -1, is perror(\"shm_open\") a function call (Chapter 7) declared in stdio.h, used to print why the OS refused?",
      hint: "Still a function. Header stdio.h. Helps you see permission vs name vs missing shm.",
      accept: ["yes"],
      shortWhy: "Yes. Run-time failure, not missing -l. perror tells the reason.",
      answerCode: "int fd = shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600);\nif (fd == -1) {\n  perror(\"shm_open\");  /* in: a label string. back: void-ish print.\n                           who waits: you wait until it printed. */\n  return 1;\n}",
      answerWhy: "Yes. Built but fd == -1 is a run-time layer. Do not add a second -lrt for that. Read perror."
    },
    {
      id: "h25", kind: "predict", group: "A file that builds", title: "Which layer",
      prompt: "Error text: unknown type name 'pthread_mutex_t'. Is the missing thing a header (type 1) or a library flag (type 2)? Type 1 or 2.",
      code: "/* compiler output:\n   unknown type name 'pthread_mutex_t'\n*/",
      hint: "The type name lives in pthread.h. The compiler never saw it.",
      accept: ["1"],
      shortWhy: "1 = header. #include <pthread.h>.",
      answerCode: "/* unknown type name → COMPILE → header\n   #include <pthread.h>\n   (You will still need -lpthread later, but this exact error is step 1.)\n*/",
      answerWhy: "1. Type names come from headers. Undefined reference would be 2."
    },
    {
      id: "h26", kind: "predict", group: "A file that builds", title: "Which layer 2",
      prompt: "Error text: undefined reference to `shm_open`. Type 1 (header) or 2 (library flag).",
      code: "/* linker output:\n   undefined reference to `shm_open'\n*/",
      hint: "Linker. Bodies. -lrt.",
      accept: ["2"],
      shortWhy: "2 = library. Add -lrt (after the header is already correct).",
      answerCode: "/* undefined reference → LINK → -lrt\n   gcc lab.c -o lab -lpthread -lrt\n*/",
      answerWhy: "2. If you only add another #include, the linker will say the same thing again."
    }
  ]
};
