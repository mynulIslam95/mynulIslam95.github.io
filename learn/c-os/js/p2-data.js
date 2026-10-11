window.C_OS_CHAPTER = {
  id: "p2",
  drills: [
    {
      id: "m01", kind: "tf", group: "Why this project", title: "Same process",
      prompt: "Do the two threads in twins.c live in the SAME process, sharing one struct Block?",
      hints: [
        "Thread = two workers, one shop. Process = two shops. P2 is threads.",
        "They share b.count. That is why they need one mutex box, not two."
      ],
      accept: ["yes"],
      shortWhy: "Yes. One process, two threads, one Block.",
      answerCode: "/* P2: pthread_create twice, one &b\n   P3: fork, two processes, MAP_SHARED bytes\n*/",
      answerWhy: "Yes. If you fork here without shared mapping, each child gets a private count. That is the next project."
    },
    {
      id: "m02", kind: "fill", group: "Why this project", title: "Link flag",
      prompt: "Type the gcc line: gcc twins.c -o twins -lpthread",
      hints: [
        "Chapter 10: header is not enough. The body of lock lives in libpthread.",
        "Libraries after the .c file."
      ],
      accept: ["gcc twins.c -o twins -lpthread"],
      shortWhy: "-lpthread is the medium project’s extra toolkit.",
      answerCode: "gcc twins.c -o twins -lpthread\n/* undefined reference to pthread_mutex_lock → you forgot this flag */",
      answerWhy: "Compile error unknown pthread_mutex_t → missing pthread.h. Link error undefined reference → missing -lpthread."
    },
    {
      id: "m03", kind: "write", group: "The shared object", title: "Includes",
      prompt: "Write includes for stdio.h and pthread.h.",
      hints: [
        "stdio for printf. pthread for mutex and threads.",
        "Angle brackets."
      ],
      must: ["#include <stdio.h>", "#include <pthread.h>"],
      rows: 4,
      shortWhy: "Two headers. Then still -lpthread at link.",
      answerCode: "#include <stdio.h>     /* printf */\n#include <pthread.h>   /* mutex, pthread_create, join */",
      answerWhy: "Chapter 10 checklist starts here."
    },
    {
      id: "m04", kind: "write", group: "The shared object", title: "struct Block",
      prompt: "Write struct Block { pthread_mutex_t lock; int count; };",
      hints: [
        "Chapter 9: lock NEXT TO the data it protects.",
        "Not two separate globals far apart if you can help it."
      ],
      must: ["struct Block", "pthread_mutex_t lock", "int count"],
      rows: 6,
      shortWhy: "One object: mutex + counter.",
      answerCode: "struct Block {\n  pthread_mutex_t lock;  /* the lock BOX */\n  int count;             /* the data the lock protects */\n};",
      answerWhy: "Both threads will hold a paper to this ONE object."
    },
    {
      id: "m05", kind: "write", group: "The worker", title: "worker",
      prompt: "Write void *worker(void *arg) that sets struct Block *b = arg, then for i from 0 while i < 100000: lock &b->lock, b->count++, unlock. return NULL;",
      hints: [
        "Chapter 7: pthread_create will CALL worker. You do not call worker() yourself in main except via create.",
        "Chapter 8: arg is a void * paper. Give it a type: struct Block *b = arg;",
        "lock(&b->lock) — paper to the FIELD. Never lock a copy.",
        "100000 times. i < 100000 from 0 is one hundred thousand (Ch5)."
      ],
      must: ["void *worker", "struct Block *b", "pthread_mutex_lock", "&b->lock", "b->count", "pthread_mutex_unlock", "NULL"],
      rows: 16,
      shortWhy: "The callee that both threads run. Caller (pthread) waits until the thread returns.",
      answerCode: "void *worker(void *arg) {                 /* in: paper to Block */\n  struct Block *b = arg;                  /* typed paper, same box as main's b */\n  int i;\n  for (i = 0; i < 100000; i++) {\n    pthread_mutex_lock(&b->lock);         /* who waits: this thread, if the other holds it */\n    b->count = b->count + 1;              /* one box. must be inside the lock */\n    pthread_mutex_unlock(&b->lock);\n  }\n  return NULL;                            /* back to pthread_join */\n}",
      answerWhy: "If ++ is outside the lock, both threads can read the same count and one add is lost. That is OS2 in C."
    },
    {
      id: "m06", kind: "tf", group: "The worker", title: "Who calls worker",
      prompt: "Should main call worker(&b) as a normal function instead of pthread_create, if we want TWO workers at the same time?",
      hints: [
        "A normal call: main waits, one worker, then the next. Not parallel.",
        "pthread_create starts a second path that runs worker."
      ],
      accept: ["no"],
      shortWhy: "No. Normal call is one-at-a-time. create starts a thread.",
      answerCode: "/* worker(&b);  would run 100000 adds, THEN return to main.\n   Two such calls in a row still never overlap.\n   pthread_create runs worker ON ANOTHER THREAD. */",
      answerWhy: "No. Chapter 7 waiting rule: a normal call waits. Threads are how two bodies overlap."
    },
    {
      id: "m07", kind: "write", group: "main", title: "main create join",
      prompt: "Write main: struct Block b; b.count=0; init lock; pthread_t t1,t2; create both with worker and &b; join both; printf(\"%d\\n\", b.count); return 0;",
      hints: [
        "pthread_mutex_init(&b.lock, NULL); before create.",
        "pthread_create(&t1, NULL, worker, &b); — paper to the thread id box, paper to the function, paper to Block.",
        "pthread_join(t1, NULL); main WAITS here until that thread’s worker returns.",
        "Print AFTER both joins. If you print before join, count is not finished."
      ],
      must: ["int main", "struct Block b", "pthread_mutex_init", "pthread_create", "worker", "&b", "pthread_join", "printf"],
      rows: 20,
      shortWhy: "Init, two creates, two joins, print.",
      answerCode: "int main(void) {\n  struct Block b;\n  pthread_t t1, t2;\n  b.count = 0;                            /* known value, not garbage */\n  pthread_mutex_init(&b.lock, NULL);      /* one lock box, init once */\n  pthread_create(&t1, NULL, worker, &b);  /* thread 1, paper to b */\n  pthread_create(&t2, NULL, worker, &b);  /* thread 2, SAME paper target */\n  pthread_join(t1, NULL);                 /* main waits for worker 1 */\n  pthread_join(t2, NULL);                 /* main waits for worker 2 */\n  printf(\"%d\\n\", b.count);               /* must be 200000 */\n  return 0;\n}",
      answerWhy: "&b is the whole object. &b.lock is the field. create wants the object paper because worker casts arg to Block *."
    },
    {
      id: "m08", kind: "predict", group: "main", title: "The number",
      prompt: "Each of two threads adds 100000 under the lock. What does twins print?",
      hints: [
        "100000 + 100000.",
        "With a correct lock there is no lost add."
      ],
      accept: ["200000"],
      shortWhy: "200000.",
      answerCode: "/* thread1: +1  100000 times\n   thread2: +1  100000 times\n   one box, locked → 200000\n   Output:\n200000\n*/",
      answerWhy: "If you see 13xxxx, the lock is missing or you locked two different mutexes."
    },
    {
      id: "m09", kind: "tf", group: "main", title: "Two mutexes",
      prompt: "If each thread had its own mutex, would count still be safe?",
      hints: [
        "Two lock boxes. Neither waits for the other.",
        "Chapter 8: two papers, two boxes is not a shared lock."
      ],
      accept: ["no"],
      shortWhy: "No. One mutex box. Both papers point at it.",
      answerCode: "/* WRONG: each worker inits a local mutex\n   RIGHT: both lock(&b.lock) on the same field\n*/",
      answerWhy: "No. This is the same bug as P1 copying a Process by value before kill."
    },
    {
      id: "m10", kind: "tf", group: "main", title: "Print too early",
      prompt: "If main prints b.count BEFORE pthread_join, is the printed number guaranteed to be 200000?",
      hints: [
        "Join is the wait. Before join, workers may still be adding.",
        "Chapter 7: who waits? You must call the wait (join)."
      ],
      accept: ["no"],
      shortWhy: "No. Join first, then print.",
      answerCode: "pthread_join(t1, NULL);\npthread_join(t2, NULL);\nprintf(\"%d\\n\", b.count);  /* now the adds are done */",
      answerWhy: "No. join is to threads what wait is to a child process."
    },
    {
      id: "m11", kind: "fill", group: "Full file", title: "Undefined reference",
      prompt: "Linker says undefined reference to `pthread_create`. Which flag is missing? Type -lpthread",
      hints: [
        "The header already worked. This is step 2, link.",
        "Chapter 10 exact phrase."
      ],
      accept: ["-lpthread"],
      shortWhy: "-lpthread.",
      answerCode: "gcc twins.c -o twins -lpthread",
      answerWhy: "Do not add a second #include to fix a link error."
    },
    {
      id: "m12", kind: "write", group: "Full file", title: "Assemble twins.c",
      prompt: "Assemble the full twins.c: includes, struct Block, worker, main with init/create/join/print.",
      hints: [
        "Order: includes, struct, worker, main.",
        "Both creates pass &b. Both joins before printf.",
        "Build: gcc twins.c -o twins -lpthread"
      ],
      must: ["#include <pthread.h>", "struct Block", "void *worker", "pthread_create", "pthread_join", "pthread_mutex_lock"],
      rows: 28,
      shortWhy: "The whole medium project.",
      answerCode: "#include <stdio.h>\n#include <pthread.h>\n\nstruct Block {\n  pthread_mutex_t lock;\n  int count;\n};\n\nvoid *worker(void *arg) {\n  struct Block *b = arg;\n  int i;\n  for (i = 0; i < 100000; i++) {\n    pthread_mutex_lock(&b->lock);\n    b->count = b->count + 1;\n    pthread_mutex_unlock(&b->lock);\n  }\n  return NULL;\n}\n\nint main(void) {\n  struct Block b;\n  pthread_t t1, t2;\n  b.count = 0;\n  pthread_mutex_init(&b.lock, NULL);\n  pthread_create(&t1, NULL, worker, &b);\n  pthread_create(&t2, NULL, worker, &b);\n  pthread_join(t1, NULL);\n  pthread_join(t2, NULL);\n  printf(\"%d\\n\", b.count);   /* 200000 */\n  return 0;\n}\n\n/* gcc twins.c -o twins -lpthread\n   ./twins\n*/",
      answerWhy: "Must on 200000: put it in a comment in your file or in printf’s expected output comment. The checker looks for the token 200000 so you remember the target. Next: P3, two PROCESSES and shared memory."
    }
  ]
};
