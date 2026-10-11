window.C_OS_CHAPTER = {
  id: "p3",
  unlockGroup: "Publish on GitHub",
  drills: [
    {
      id: "h01", kind: "tf", group: "Why this is hard", title: "Processes, not threads",
      prompt: "Do the two workers in share.c live in TWO processes after fork?",
      hints: [
        "P2 used pthread_create. Same process, two threads, one Block on the stack.",
        "fork copies the process. Without MAP_SHARED, each side has a private copy of the bytes."
      ],
      accept: ["yes"],
      shortWhy: "Yes. fork makes two processes. Shared bytes come from mmap MAP_SHARED.",
      answerCode: "/* P2 twins.c : pthread_create  → same process, &b on the stack is enough\n   P3 share.c : fork            → two processes, need mmap MAP_SHARED\n*/",
      answerWhy: "Yes. If you only fork and keep Block on the stack, the child’s add is invisible to the parent."
    },
    {
      id: "h02", kind: "fill", group: "Why this is hard", title: "Build line",
      prompt: "Type the compile line: gcc share.c -o share -lpthread -lrt",
      hints: [
        "Mutex body: -lpthread. shm_open body: -lrt on many lab machines.",
        "Libraries after the .c file. Chapter 10."
      ],
      accept: ["gcc share.c -o share -lpthread -lrt"],
      shortWhy: "Both libraries. Missing one → undefined reference, not a logic bug.",
      answerCode: "gcc share.c -o share -lpthread -lrt\n/* undefined pthread_mutex_lock → forgot -lpthread\n   undefined shm_open            → forgot -lrt\n*/",
      answerWhy: "Header missing = compile error unknown type. Library missing = link error undefined reference."
    },
    {
      id: "h03", kind: "write", group: "The shared object", title: "Includes",
      prompt: "Write the includes: stdio.h, unistd.h, signal.h, fcntl.h, sys/mman.h, sys/wait.h, pthread.h.",
      hints: [
        "stdio: printf, perror. unistd: fork, _exit, getppid, ftruncate, close.",
        "signal: SIGUSR1. fcntl: O_CREAT | O_RDWR. sys/mman: shm_open, mmap. sys/wait: wait. pthread: mutex.",
        "Angle brackets. One #include per line."
      ],
      must: [
        "#include <stdio.h>",
        "#include <unistd.h>",
        "#include <signal.h>",
        "#include <fcntl.h>",
        "#include <sys/mman.h>",
        "#include <sys/wait.h>",
        "#include <pthread.h>"
      ],
      rows: 10,
      shortWhy: "Seven toolkits. Then still -lpthread -lrt at link.",
      answerCode: "#include <stdio.h>     /* printf, perror */\n#include <unistd.h>    /* fork, _exit, getppid, ftruncate, close */\n#include <signal.h>    /* SIGUSR1, sigaction */\n#include <fcntl.h>     /* O_CREAT, O_RDWR */\n#include <sys/mman.h>  /* shm_open, mmap, MAP_SHARED */\n#include <sys/wait.h>  /* wait */\n#include <pthread.h>   /* mutex, PROCESS_SHARED */",
      answerWhy: "sys/stat.h is optional here if you pass 0600 as a number. Do not skip sys/mman.h."
    },
    {
      id: "h04", kind: "write", group: "The shared object", title: "struct Block",
      prompt: "Write struct Block { pthread_mutex_t lock; int count; volatile int got; };",
      hints: [
        "Chapter 9: lock next to the data it protects. count is the data. got is the signal flag.",
        "volatile on got: the handler writes it, the while-loop reads it. The compiler must not freeze the old value.",
        "got is NOT the mutex. The mutex protects count. The flag says “the child fired SIGUSR1”."
      ],
      must: ["struct Block", "pthread_mutex_t lock", "int count", "volatile int got"],
      rows: 8,
      shortWhy: "Three fields in one mapped object.",
      answerCode: "struct Block {\n  pthread_mutex_t lock;  /* process-shared lock BOX */\n  int count;             /* the data the lock protects */\n  volatile int got;      /* handler writes 1. parent while reads it */\n};",
      answerWhy: "P2 had lock+count. P3 adds got because the parent waits for a signal, not for pthread_join."
    },
    {
      id: "h05", kind: "write", group: "The shared object", title: "Global paper",
      prompt: "Write a global paper so the handler can reach the mapped bytes: struct Block *g;",
      hints: [
        "A handler only gets an int signo. It cannot take a Block * argument from you.",
        "So g is a global paper. main sets g = mmap(...). The handler writes g->got.",
        "Chapter 8: paper vs box. g is the paper. The box is the mapped bytes."
      ],
      must: ["struct Block *g"],
      rows: 4,
      shortWhy: "Handler cannot take your extra arguments. One global paper.",
      answerCode: "struct Block *g;   /* paper to mapped bytes. handler uses g->got */",
      answerWhy: "Do not put Block on the stack and hope the child shares it. The paper must point at MAP_SHARED bytes."
    },
    {
      id: "h06", kind: "write", group: "The handler", title: "on_usr1",
      prompt: "Write void on_usr1(int sig) that ignores sig and sets g->got = 1 only. No printf. No wait.",
      hints: [
        "Chapter 7: a handler is a function the OS calls. You do not call on_usr1() in main except by naming it in sigaction.",
        "Inside a handler: set a flag. Stop. No printf. No malloc. No wait. No lock if you can avoid it.",
        "(void)sig; tells the compiler you meant not to use sig."
      ],
      must: ["void on_usr1", "g->got", "1"],
      rows: 8,
      shortWhy: "Flag only. That is the whole handler.",
      answerCode: "void on_usr1(int sig) {\n  (void)sig;     /* we know the number is SIGUSR1 */\n  g->got = 1;    /* ONLY this. no printf. no wait. no lock. */\n}",
      answerWhy: "If you printf in the handler, the exam answer is wrong even if the program “looks” to work."
    },
    {
      id: "h07", kind: "write", group: "Map the bytes", title: "shm_open",
      prompt: "Write: int fd = shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600); then if (fd < 0) { perror(\"shm_open\"); return 1; }",
      hints: [
        "Chapter 6: the name is a string in quotes. Leading slash. \"/myshm\".",
        "O_CREAT makes it if missing. O_RDWR so both sides can write count and got.",
        "0600 = owner can read and write. perror then return is the honest fail path."
      ],
      must: ["shm_open", "\"/myshm\"", "O_CREAT", "O_RDWR", "perror"],
      rows: 8,
      shortWhy: "Named object. fd is a handle, not the bytes yet.",
      answerCode: "int fd;\nfd = shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600);\nif (fd < 0) {\n  perror(\"shm_open\");  /* name the failing call */\n  return 1;\n}",
      answerWhy: "shm_open is the door. mmap is the paper to the room. Do not mix them up."
    },
    {
      id: "h08", kind: "write", group: "Map the bytes", title: "ftruncate and mmap",
      prompt: "ftruncate fd to sizeof(struct Block). Then g = mmap(NULL, sizeof(struct Block), PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0); check MAP_FAILED; close(fd);",
      hints: [
        "ftruncate sets the size. New shm is size 0 until you do this.",
        "mmap: NULL = let the OS pick the address. MAP_SHARED = the child’s write is the parent’s bytes.",
        "MAP_PRIVATE would copy on write. Then parent never sees count++.",
        "close(fd) after mmap. The mapping stays. The fd is finished."
      ],
      must: ["ftruncate", "sizeof", "mmap", "PROT_READ", "PROT_WRITE", "MAP_SHARED", "MAP_FAILED", "close"],
      rows: 14,
      shortWhy: "Size the object, map it shared, drop the fd.",
      answerCode: "if (ftruncate(fd, sizeof(struct Block)) < 0) {\n  perror(\"ftruncate\");\n  return 1;\n}\ng = mmap(NULL, sizeof(struct Block),\n         PROT_READ | PROT_WRITE,\n         MAP_SHARED,   /* not MAP_PRIVATE */\n         fd, 0);\nif (g == MAP_FAILED) {\n  perror(\"mmap\");\n  return 1;\n}\nclose(fd);   /* mapping stays. fd is done. */",
      answerWhy: "Chapter 8: g is the paper. The box is the mapped Block. Two processes, one box, only if MAP_SHARED."
    },
    {
      id: "h09", kind: "tf", group: "Map the bytes", title: "MAP_PRIVATE",
      prompt: "If you used MAP_PRIVATE instead of MAP_SHARED, would the parent still see the child’s count++?",
      hints: [
        "PRIVATE = copy when someone writes. Two boxes.",
        "SHARED = one box. That is the whole point of this project."
      ],
      accept: ["no"],
      shortWhy: "No. PRIVATE gives each process its own copy after a write.",
      answerCode: "/* WRONG: mmap(..., MAP_PRIVATE, fd, 0);\n   RIGHT: mmap(..., MAP_SHARED,  fd, 0);\n*/",
      answerWhy: "No. This is the process version of P2’s “two mutexes” bug."
    },
    {
      id: "h10", kind: "write", group: "Process-shared lock", title: "mutexattr",
      prompt: "Init count and got to 0. Init a pthread_mutexattr_t, set PTHREAD_PROCESS_SHARED, then pthread_mutex_init(&g->lock, &attr);",
      hints: [
        "P2 used pthread_mutex_init(&b.lock, NULL). NULL means default = threads in ONE process.",
        "Here two processes. You must set PTHREAD_PROCESS_SHARED on the attr, then pass &attr.",
        "Init the mutex ONCE, in the parent, BEFORE fork."
      ],
      must: [
        "g->count",
        "g->got",
        "pthread_mutexattr_t",
        "pthread_mutexattr_init",
        "PTHREAD_PROCESS_SHARED",
        "pthread_mutex_init",
        "&g->lock"
      ],
      rows: 12,
      shortWhy: "Default mutex is not for two processes. Set PROCESS_SHARED first.",
      answerCode: "pthread_mutexattr_t attr;\ng->count = 0;\ng->got = 0;\npthread_mutexattr_init(&attr);\npthread_mutexattr_setpshared(&attr, PTHREAD_PROCESS_SHARED);\npthread_mutex_init(&g->lock, &attr);  /* &g->lock = paper to the FIELD */",
      answerWhy: "Init after mmap, before fork. If you init in both parent and child, you smash the lock."
    },
    {
      id: "h11", kind: "write", group: "Signal then fork", title: "sigaction",
      prompt: "Install on_usr1 for SIGUSR1 with sigaction (sa_handler = on_usr1, flags 0, sigemptyset on sa_mask).",
      hints: [
        "Chapter 7: you pass the FUNCTION NAME. You do not write on_usr1() with parens here.",
        "signal() also exists. This project uses sigaction so the install is explicit.",
        "Do this in the parent before fork so the child also has the handler if it needs it. Parent is the one who must catch SIGUSR1."
      ],
      must: ["struct sigaction", "sa_handler", "on_usr1", "sigemptyset", "sigaction", "SIGUSR1"],
      rows: 10,
      shortWhy: "Name the handler. Do not call it.",
      answerCode: "struct sigaction sa;\nsa.sa_handler = on_usr1;   /* function name, no () */\nsigemptyset(&sa.sa_mask);\nsa.sa_flags = 0;\nsigaction(SIGUSR1, &sa, NULL);",
      answerWhy: "If you write on_usr1() with parens, you CALL it now and store its return, which is void. That will not compile."
    },
    {
      id: "h12", kind: "write", group: "Signal then fork", title: "fork branches",
      prompt: "r = fork(); if r < 0 perror and return; if r == 0 child: lock &g->lock, g->count++, unlock, kill(getppid(), SIGUSR1), _exit(0);",
      hints: [
        "Chapter 4: r == 0 is the child. r > 0 is the parent (child pid). r < 0 failed.",
        "Child uses the SAME paper g. MAP_SHARED makes count++ visible.",
        "kill(getppid(), SIGUSR1) wakes the parent’s handler. Then _exit(0) — child must not run the parent’s wait loop.",
        "_exit not return, so you do not run atexit paths you did not mean."
      ],
      must: ["fork", "r == 0", "pthread_mutex_lock", "&g->lock", "g->count", "pthread_mutex_unlock", "kill", "getppid", "SIGUSR1", "_exit"],
      rows: 18,
      shortWhy: "Child adds one under the lock, signals parent, exits.",
      answerCode: "pid_t r;\nr = fork();\nif (r < 0) {\n  perror(\"fork\");\n  return 1;\n}\nif (r == 0) {\n  pthread_mutex_lock(&g->lock);\n  g->count = g->count + 1;     /* one box, mapped shared */\n  pthread_mutex_unlock(&g->lock);\n  kill(getppid(), SIGUSR1);    /* parent’s on_usr1 sets got */\n  _exit(0);                    /* child stops here */\n}",
      answerWhy: "If the child returns from main instead of _exit, it may shm_unlink while the parent still needs the name. Stop the child with _exit."
    },
    {
      id: "h13", kind: "write", group: "Parent finish", title: "Flag wait then wait()",
      prompt: "Parent: while (!g->got) { } then wait(NULL); then printf(\"%d\\n\", g->count); then shm_unlink(\"/myshm\"); return 0;",
      hints: [
        "Chapter 5: a flag loop is not wait(). The loop waits for the HANDLER. wait() waits for the CHILD to exit.",
        "Order: flag first (we know SIGUSR1 arrived), then wait(NULL) (no zombie), then print, then unlink.",
        "Print after both waits. count must be 1."
      ],
      must: ["while", "g->got", "wait", "printf", "g->count", "shm_unlink", "\"/myshm\""],
      rows: 12,
      shortWhy: "Flag, then wait(), then print 1, then unlink.",
      answerCode: "while (!g->got) {\n  /* flag wait. handler sets got. this is not wait() */\n}\nwait(NULL);                    /* reap the child. no zombie */\nprintf(\"%d\\n\", g->count);     /* 1 */\nshm_unlink(\"/myshm\");         /* drop the name */\nreturn 0;",
      answerWhy: "wait() alone does not prove the handler ran. The flag proves SIGUSR1 arrived. You still wait() so the child is reaped."
    },
    {
      id: "h14", kind: "predict", group: "Parent finish", title: "Printed number",
      prompt: "Child adds 1 under the lock. Parent prints g->count after the flag and wait(). What prints?",
      hints: [
        "One child, one add.",
        "MAP_SHARED + PROCESS_SHARED mutex → parent sees it."
      ],
      accept: ["1"],
      shortWhy: "1.",
      answerCode: "/* child: count 0 → 1 under the lock\n   parent prints after got and wait\n   Output:\n1\n*/",
      answerWhy: "If you see 0, MAP_SHARED or PROCESS_SHARED or the paper g is wrong."
    },
    {
      id: "h15", kind: "tf", group: "Parent finish", title: "printf in handler",
      prompt: "Is it correct exam C to printf inside on_usr1?",
      hints: [
        "Handler sets got only.",
        "printf is not async-signal-safe in the way the exam wants."
      ],
      accept: ["no"],
      shortWhy: "No. Flag only.",
      answerCode: "void on_usr1(int sig) {\n  (void)sig;\n  g->got = 1;   /* only */\n}",
      answerWhy: "No. The parent’s main prints after the flag loop. That is the right place for printf."
    },
    {
      id: "h16", kind: "write", group: "Full file", title: "Assemble share.c",
      prompt: "Assemble the full share.c: includes, struct Block, global g, on_usr1, main with shm_open, ftruncate, mmap MAP_SHARED, PROCESS_SHARED mutex, sigaction, fork, child add+kill+_exit, parent flag wait + wait + print + unlink.",
      hints: [
        "Order: includes, struct, g, handler, main.",
        "mmap then init mutex then sigaction then fork.",
        "Build: gcc share.c -o share -lpthread -lrt",
        "Child _exit. Parent shm_unlink after wait."
      ],
      must: [
        "shm_open",
        "mmap",
        "MAP_SHARED",
        "PTHREAD_PROCESS_SHARED",
        "on_usr1",
        "fork",
        "SIGUSR1",
        "wait",
        "shm_unlink"
      ],
      rows: 36,
      shortWhy: "The whole hard project. Next group is GitHub, now unlocked when this file’s steps are all submitted.",
      answerCode: "#include <stdio.h>\n#include <unistd.h>\n#include <signal.h>\n#include <fcntl.h>\n#include <sys/mman.h>\n#include <sys/wait.h>\n#include <pthread.h>\n\nstruct Block {\n  pthread_mutex_t lock;\n  int count;\n  volatile int got;\n};\n\nstruct Block *g;                 /* paper to mapped bytes */\n\nvoid on_usr1(int sig) {\n  (void)sig;\n  g->got = 1;                    /* ONLY this */\n}\n\nint main(void) {\n  int fd;\n  pid_t r;\n  pthread_mutexattr_t attr;\n  struct sigaction sa;\n\n  fd = shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600);\n  if (fd < 0) { perror(\"shm_open\"); return 1; }\n  if (ftruncate(fd, sizeof(struct Block)) < 0) {\n    perror(\"ftruncate\"); return 1;\n  }\n  g = mmap(NULL, sizeof(struct Block),\n           PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);\n  if (g == MAP_FAILED) { perror(\"mmap\"); return 1; }\n  close(fd);\n\n  g->count = 0;\n  g->got = 0;\n  pthread_mutexattr_init(&attr);\n  pthread_mutexattr_setpshared(&attr, PTHREAD_PROCESS_SHARED);\n  pthread_mutex_init(&g->lock, &attr);\n\n  sa.sa_handler = on_usr1;\n  sigemptyset(&sa.sa_mask);\n  sa.sa_flags = 0;\n  sigaction(SIGUSR1, &sa, NULL);\n\n  r = fork();\n  if (r < 0) { perror(\"fork\"); return 1; }\n  if (r == 0) {\n    pthread_mutex_lock(&g->lock);\n    g->count = g->count + 1;\n    pthread_mutex_unlock(&g->lock);\n    kill(getppid(), SIGUSR1);\n    _exit(0);\n  }\n\n  while (!g->got) { }\n  wait(NULL);\n  printf(\"%d\\n\", g->count);     /* 1 */\n  shm_unlink(\"/myshm\");\n  return 0;\n}\n\n/* gcc share.c -o share -lpthread -lrt\n   ./share\n*/",
      answerWhy: "This is P1’s struct table + P2’s mutex + real fork + a signal flag + named shared memory. When every C step above is submitted right, Publish on GitHub opens under this page."
    },
    {
      id: "g01", kind: "fill", group: "Publish on GitHub", title: "git init",
      prompt: "In the folder that holds share.c, type the command that starts a new git repo: git init",
      hints: [
        "You are publishing YOUR share.c folder. Not this teaching website.",
        "git init creates .git here. Run it once in that folder.",
        "Do not init inside a parent repo by accident. cd to the project folder first."
      ],
      accept: ["git init"],
      shortWhy: "git init. One repo for share.c.",
      answerCode: "cd share-c-os    /* folder that has share.c */\ngit init",
      answerWhy: "After this, git status should see share.c as untracked."
    },
    {
      id: "g02", kind: "write", group: "Publish on GitHub", title: ".gitignore",
      prompt: "Write a .gitignore that ignores the built tool share, object files *.o, and .DS_Store.",
      hints: [
        "Commit source. Do not commit the tool gcc built, or editor junk.",
        "One pattern per line: share   then   *.o   then   .DS_Store",
        "The name of the file is .gitignore"
      ],
      must: ["share", "*.o", ".DS_Store"],
      rows: 6,
      shortWhy: "Source in git. Built tool out.",
      answerCode: "share\n*.o\n.DS_Store",
      answerWhy: "If you add the binary, the repo is noisy and not useful to a reader."
    },
    {
      id: "g03", kind: "write", group: "Publish on GitHub", title: "README.md",
      prompt: "Write a short README.md: title share.c, what it does in two sentences, and the build/run lines.",
      hints: [
        "A stranger opens the GitHub page and must see how to build.",
        "Include: gcc share.c -o share -lpthread -lrt",
        "Include: ./share",
        "Say: two processes, MAP_SHARED, process-shared mutex, SIGUSR1 flag, wait."
      ],
      must: ["share.c", "-lpthread", "-lrt", "./share"],
      rows: 12,
      shortWhy: "README is how a stranger runs your project.",
      answerCode: "# share.c\n\nTwo processes, one mapped Block. Child adds 1 under a\nprocess-shared mutex, then sends SIGUSR1. Parent's handler\nsets a flag, then wait() and prints the count.\n\n## Build\n\n    gcc share.c -o share -lpthread -lrt\n    ./share\n",
      answerWhy: "Without a README, a public repo is a dump. Two sentences plus the build line is enough."
    },
    {
      id: "g04", kind: "fill", group: "Publish on GitHub", title: "git add",
      prompt: "Type the add command for the three files: git add share.c README.md .gitignore",
      hints: [
        "Add source, README, ignore list. Not the binary share.",
        "Spaces between names."
      ],
      accept: ["git add share.c README.md .gitignore"],
      shortWhy: "Three files. Not the built tool.",
      answerCode: "git add share.c README.md .gitignore\ngit status",
      answerWhy: "git add share would stage the binary if it exists and is not ignored. Ignore it first, then add."
    },
    {
      id: "g05", kind: "fill", group: "Publish on GitHub", title: "git commit",
      prompt: "Type: git commit -m \"share.c: shm mutex fork SIGUSR1\"",
      hints: [
        "One commit. Message says WHY this snapshot exists.",
        "Do not add --no-verify. Do not skip hooks.",
        "Quotes around the message."
      ],
      accept: ["git commit -m \"share.c: shm mutex fork SIGUSR1\""],
      shortWhy: "Commit with a real message. Keep hooks on.",
      answerCode: "git commit -m \"share.c: shm mutex fork SIGUSR1\"",
      answerWhy: "If the commit hook fails, fix the issue and commit again. Do not pass --no-verify."
    },
    {
      id: "g06", kind: "fill", group: "Publish on GitHub", title: "create repo",
      prompt: "Type the GitHub CLI line: gh repo create share-c-os --public --source=. --remote=origin",
      hints: [
        "You must be logged in: gh auth login (browser), once.",
        "--public because this is a study project you want to show.",
        "--source=. is this folder. --remote=origin names the remote origin.",
        "This creates the empty GitHub repo and points origin at it. It does not force-push."
      ],
      accept: ["gh repo create share-c-os --public --source=. --remote=origin"],
      shortWhy: "Create the public repo and set origin. Push is the next step.",
      answerCode: "gh auth login\ngh repo create share-c-os --public --source=. --remote=origin",
      answerWhy: "If you have no gh, the long way is: create the empty repo on github.com, then git remote add origin https://github.com/YOURUSER/share-c-os.git"
    },
    {
      id: "g07", kind: "fill", group: "Publish on GitHub", title: "push",
      prompt: "Type the first push: git push -u origin HEAD",
      hints: [
        "-u sets upstream so later you can git push.",
        "Never git push --force on this first publish.",
        "Never --no-verify. If a hook fails, fix the files."
      ],
      accept: ["git push -u origin HEAD"],
      shortWhy: "First push. No force. No skipped hooks.",
      answerCode: "git push -u origin HEAD\n/* NOT: git push --force\n   NOT: git push --no-verify\n*/",
      answerWhy: "Force-push rewrites history other people may have pulled. You do not need it for a new repo."
    },
    {
      id: "g08", kind: "tf", group: "Publish on GitHub", title: "Force push",
      prompt: "After this first publish, should you use git push --force on main to “make GitHub match”?",
      hints: [
        "A new repo does not need force.",
        "Force-push is for rewriting history. This project does not do that."
      ],
      accept: ["no"],
      shortWhy: "No. Ordinary push is enough.",
      answerCode: "git push\n/* never: git push --force\n   never: git push --no-verify\n*/",
      answerWhy: "No. If push is rejected, pull or rebase with care — do not force main because a tutorial said “make it match”."
    },
    {
      id: "g09", kind: "fill", group: "Publish on GitHub", title: "The URL",
      prompt: "Where does a stranger open it? Type this shape, replacing nothing: https://github.com/YOURUSER/share-c-os",
      hints: [
        "YOURUSER is your GitHub login. The repo name is share-c-os from gh repo create.",
        "This is YOUR project URL, not mynulIslam95.github.io."
      ],
      accept: ["https://github.com/YOURUSER/share-c-os"],
      shortWhy: "Public project page. Put YOURUSER in the browser yourself.",
      answerCode: "https://github.com/YOURUSER/share-c-os\n/* open README, share.c, then a stranger can clone and build */",
      answerWhy: "You published share.c. The teaching site stays where it is. Two different repos."
    }
  ]
};
