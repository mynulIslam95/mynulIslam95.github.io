window.C_OS_CHAPTER = {
  id: "ch09",
  drills: [
    {
      id: "s01", kind: "tf", group: "Several fields, one object", title: "One object",
      prompt: "Does a struct let you keep several fields under one name as one object?",
      hint: "pid + state, or lock + count. One box with inner labels.",
      accept: ["yes"],
      shortWhy: "Yes. One object, several named fields.",
      answerCode: "struct Point {\n  int x;   /* field */\n  int y;   /* field */\n};\nstruct Point p;  /* one object */",
      answerWhy: "Yes. You mmap one object, not four separate mappings, when the fields must live together."
    },
    {
      id: "s02", kind: "fill", group: "Several fields, one object", title: "Dot",
      prompt: "If p is a struct Point object (not a pointer), which operator selects a field? Type the character.",
      hint: "Dot. p.x",
      accept: ["."],
      shortWhy: "Dot: p.x when p is the object.",
      answerCode: "struct Point p;\np.x = 2;   /* dot: object on the left, not a paper */",
      answerWhy: ". is for the object. -> is for a paper to the object."
    },
    {
      id: "s03", kind: "fill", group: "Several fields, one object", title: "Arrow",
      prompt: "If sp is a pointer to struct Point, which operator selects a field? Type the two characters.",
      hint: "Minus greater-than.",
      accept: ["->"],
      shortWhy: "Arrow: sp->x means (*sp).x",
      answerCode: "struct Point *sp = &p;\nsp->x = 2;     /* open the object, then field x */\n(*sp).x = 2;   /* same, uglier */",
      answerWhy: "-> is what mmap code uses, because you hold a pointer."
    },
    {
      id: "s04", kind: "predict", group: "Several fields, one object", title: "Dot assign",
      prompt: "What prints? Two numbers, space between.",
      code: "#include <stdio.h>\nstruct Point { int x; int y; };\nint main(void) {\n  struct Point p;\n  p.x = 2;\n  p.y = 3;\n  printf(\"%d %d\\n\", p.x, p.y);\n  return 0;\n}",
      hint: "Two fields of one object.",
      accept: ["2 3"],
      shortWhy: "p.x is 2, p.y is 3.",
      answerCode: "struct Point p;  /* one object, two inner boxes */\np.x = 2;\np.y = 3;\nprintf(\"%d %d\\n\", p.x, p.y);\n\n/* Output:\n2 3\n*/",
      answerWhy: "Fields are just named inner boxes. The object is still one."
    },
    {
      id: "s05", kind: "predict", group: "Several fields, one object", title: "Arrow write",
      prompt: "What prints?",
      code: "#include <stdio.h>\nstruct Point { int x; int y; };\nint main(void) {\n  struct Point p;\n  struct Point *sp = &p;\n  p.x = 1;\n  sp->y = 4;\n  printf(\"%d %d\\n\", p.x, p.y);\n  return 0;\n}",
      hint: "sp points at p. sp->y is p.y.",
      accept: ["1 4"],
      shortWhy: "One object: x=1 y=4.",
      answerCode: "struct Point p;\nstruct Point *sp = &p;  /* paper to the SAME object */\np.x = 1;                /* dot on the object */\nsp->y = 4;              /* arrow on the paper: writes p.y */\nprintf(\"%d %d\\n\", p.x, p.y); /* 1 4 */\n\n/* Output:\n1 4\n*/",
      answerWhy: "Dot and arrow hit the same object here. Two syntaxes, one box."
    },
    {
      id: "s06", kind: "tf", group: "Several fields, one object", title: "Copy vs share",
      prompt: "Does struct Point b = a; create a second object (a copy of the fields)?",
      hint: "Assignment copies fields. Not a second paper.",
      accept: ["yes"],
      shortWhy: "Yes. Two objects. Changing b.x does not change a.x.",
      answerCode: "struct Point a;\na.x = 1;\nstruct Point b = a;  /* copy fields into a NEW object */\nb.x = 9;             /* a.x is still 1 */",
      answerWhy: "Yes. Threads that copy the struct do not share. They must copy the pointer instead."
    },
    {
      id: "s07", kind: "tf", group: "Several fields, one object", title: "Pointer copy",
      prompt: "Does struct Point *q = &a; give you a paper to the same object a (not a second Point)?",
      hint: "Paper copy, not field copy.",
      accept: ["yes"],
      shortWhy: "Yes. q points at a. One object.",
      answerCode: "struct Point a;\nstruct Point *q = &a;  /* paper */\nq->x = 9;              /* a.x is 9 */",
      answerWhy: "Yes. Shared state in OS C is this: pointer to one struct."
    },
    {
      id: "s08", kind: "predict", group: "Several fields, one object", title: "Copy does not share",
      prompt: "What prints? Two numbers.",
      code: "#include <stdio.h>\nstruct Point { int x; int y; };\nint main(void) {\n  struct Point a;\n  a.x = 1; a.y = 1;\n  struct Point b = a;\n  b.x = 9;\n  printf(\"%d %d\\n\", a.x, b.x);\n  return 0;\n}",
      hint: "b is a copy. a.x stays 1.",
      accept: ["1 9"],
      shortWhy: "a.x=1 (original), b.x=9 (copy).",
      answerCode: "struct Point b = a;  /* second object */\nb.x = 9;             /* only b changes */\nprintf(\"%d %d\\n\", a.x, b.x);  /* 1 9 */\n\n/* Output:\n1 9\n*/",
      answerWhy: "If this were a mutex copied by value, each side would lock a different mutex. That is the bug Chapter 8 already named."
    },
    {
      id: "s09", kind: "fill", group: "Shared block: counters + a lock", title: "Field lock address",
      prompt: "If b is struct Block * and the mutex field is lock, what argument do you pass to pthread_mutex_lock? Type &b->lock",
      hint: "Paper to the field inside the object.",
      accept: ["&b->lock", "&(b->lock)"],
      shortWhy: "&b->lock is the paper to the mutex sitting inside the shared block.",
      answerCode: "struct Block {\n  pthread_mutex_t lock;\n  int count;\n};\nstruct Block *b;  /* from mmap */\npthread_mutex_lock(&b->lock);  /* paper to the FIELD */\nb->count++;\npthread_mutex_unlock(&b->lock);",
      answerWhy: "&b->lock not &b (that is the whole struct) and not b->lock without & (that would be the mutex by value)."
    },
    {
      id: "s10", kind: "tf", group: "Shared block: counters + a lock", title: "Why together",
      prompt: "Should the mutex and the counter live in the same shared struct so that whoever maps the block sees both?",
      hint: "If the lock is private to process A, B cannot lock it.",
      accept: ["yes"],
      shortWhy: "Yes. One mapping, lock + data.",
      answerCode: "struct Block {\n  pthread_mutex_t lock;  /* must be in the shared window */\n  int count;\n  int done;\n};",
      answerWhy: "Yes. That is the exam object. Size the mmap with sizeof(struct Block)."
    },
    {
      id: "s11", kind: "tf", group: "Shared block: counters + a lock", title: "sizeof",
      prompt: "Should you pass sizeof(struct Block) to ftruncate and mmap so the mutex fits, not just sizeof(int)?",
      hint: "If the window is too small you smash memory.",
      accept: ["yes"],
      shortWhy: "Yes. The window must fit the whole object.",
      answerCode: "ftruncate(fd, sizeof(struct Block));\nb = mmap(NULL, sizeof(struct Block), PROT_READ | PROT_WRITE,\n         MAP_SHARED, fd, 0);",
      answerWhy: "Yes. sizeof(int) is the classic undersize bug when you add a lock later."
    },
    {
      id: "s12", kind: "write", group: "Shared block: counters + a lock", title: "Write the struct",
      prompt: "Write struct Block { pthread_mutex_t lock; int count; }; including the word struct and the semicolon after the brace.",
      hint: "Two fields: lock then count.",
      must: ["struct Block", "pthread_mutex_t lock", "int count"],
      shortWhy: "Lock and counter in one type.",
      answerCode: "struct Block {              /* one object type */\n  pthread_mutex_t lock;     /* field: the lock box */\n  int count;                /* field: the data the lock protects */\n};",
      answerWhy: "Order of fields can vary, but both must be in the struct. You will take sizeof this type."
    },
    {
      id: "s13", kind: "write", group: "Shared block: counters + a lock", title: "Bump under lock",
      prompt: "Write void bump(struct Block *b) that locks b->lock, adds 1 to b->count, unlocks. Use pthread_mutex_lock and unlock with &b->lock.",
      hint: "lock, count++, unlock. Test b if you want; must include lock and count.",
      must: ["void bump", "struct Block *b", "pthread_mutex_lock", "&b->lock", "b->count", "pthread_mutex_unlock"],
      shortWhy: "Caller waits for bump. Inside, the thread may wait on the lock.",
      answerCode: "void bump(struct Block *b) {          /* in: paper to the shared object */\n  pthread_mutex_lock(&b->lock);       /* paper to the lock FIELD */\n  b->count = b->count + 1;            /* or b->count++ */\n  pthread_mutex_unlock(&b->lock);     /* same field */\n}\n/* who waits: caller waits for bump.\n   also: lock() may wait if another thread holds the mutex. */",
      answerWhy: "This is Chapters 7+8+9 in one function. If you omit &, you are not passing a paper to the mutex."
    },
    {
      id: "s14", kind: "tf", group: "Shared block: counters + a lock", title: "init once",
      prompt: "Should pthread_mutex_init(&b->lock, NULL) run once on the shared object before other processes lock it?",
      hint: "Init the one lock box. Not once per confused copy.",
      accept: ["yes"],
      shortWhy: "Yes. Init once, then many lock/unlock.",
      answerCode: "/* after mmap, one process (the creator) does: */\npthread_mutex_init(&b->lock, NULL);\n/* others may now lock. Do not init on every lock. */",
      answerWhy: "Yes. Double init or never init are lab bugs. The field lives in the shared struct, so everyone sees the initialised lock."
    },
    {
      id: "s15", kind: "tf", group: "Shared block: counters + a lock", title: "Pass by pointer",
      prompt: "Should thread functions take struct Block * (a paper), not struct Block by value, if they must share the lock and count?",
      hint: "By value = copy = two objects = fake lock.",
      accept: ["yes"],
      shortWhy: "Yes. Pass the paper to the one object.",
      answerCode: "void *worker(void *arg) {\n  struct Block *b = arg;  /* paper the starter passed */\n  bump(b);\n  return NULL;\n}",
      answerWhy: "Yes. pthread_create's argument is already a void * paper. Point it at the shared Block."
    },
    {
      id: "s16", kind: "predict", group: "Shared block: counters + a lock", title: "Arrow on count",
      prompt: "b points at a Block with count=0. After b->count = b->count + 1; what is b->count?",
      code: "struct Block { int count; };\nstruct Block obj;\nstruct Block *b = &obj;\nb->count = 0;\nb->count = b->count + 1;",
      hint: "One field, one increment.",
      accept: ["1"],
      shortWhy: "1.",
      answerCode: "b->count = 0;\nb->count = b->count + 1;  /* read 0, write 1 into the same field */\n/* b->count is 1 */",
      answerWhy: "Without a lock, two threads doing this can both read 0 and both write 1. Lost update. The lock field exists to prevent that. The arithmetic is still +1."
    },
    {
      id: "s17", kind: "fill", group: "Shared block: counters + a lock", title: "Arrow means",
      prompt: "b->count is the same as which longer form? Type (*b).count",
      hint: "Star then dot, parentheses needed.",
      accept: ["(*b).count"],
      shortWhy: "(*b).count. Parentheses because dot binds tight.",
      answerCode: "b->count      /* preferred */\n(*b).count    /* same: open paper b, then field count */\n/* *b.count    WRONG: would mean *(b.count) */",
      answerWhy: "(*b).count. If you write *b.count you are wrong. Use the arrow."
    },
    {
      id: "s18", kind: "tf", group: "Shared block: counters + a lock", title: "GPIO struct",
      prompt: "Can hardware registers also be modelled as a struct of fields, with a pointer from mmap, same as Block?",
      hint: "Same C. Different meaning of the box (hardware).",
      accept: ["yes"],
      shortWhy: "Yes. Struct + pointer + volatile. Same chapter.",
      answerCode: "struct GpioRegs {\n  volatile unsigned set;\n  volatile unsigned clr;\n};\nstruct GpioRegs *g = /* mmap */;\ng->set = mask;   /* write a field through the paper */",
      answerWhy: "Yes. Lab 1 is this, with the real layout from the datasheet. You are not learning a new language."
    },
    {
      id: "s19", kind: "tf", group: "Shared block: counters + a lock", title: "typedef",
      prompt: "Is typedef struct Block Block; just a shorter name for the same type?",
      hint: "No new object. Only a nickname.",
      accept: ["yes"],
      shortWhy: "Yes. Same struct. Shorter name.",
      answerCode: "typedef struct Block Block;\nBlock *b;            /* same as struct Block *b */",
      answerWhy: "Yes. Do not treat typedef as a second copy of the data."
    },
    {
      id: "s20", kind: "write", group: "Shared block: counters + a lock", title: "Three fields",
      prompt: "Write struct Block with fields pthread_mutex_t lock, int count, int done.",
      hint: "Three inner boxes, one type.",
      must: ["struct Block", "pthread_mutex_t lock", "int count", "int done"],
      shortWhy: "Lock plus two counters/flags in one shared object.",
      answerCode: "struct Block {\n  pthread_mutex_t lock;  /* who may touch the ints */\n  int count;             /* shared counter */\n  int done;              /* shared flag */\n};\n/* mmap sizeof(struct Block), then b->done and b->count under b->lock */",
      answerWhy: "All shared flags that the lock protects should sit in this object, not in a local stack variable in one process."
    },
    {
      id: "s21", kind: "tf", group: "Shared block: counters + a lock", title: "Local count",
      prompt: "If count is a local int in main, and only the mutex is in shared memory, do two processes share the counter?",
      hint: "Each process has its own stack box named count.",
      accept: ["no"],
      shortWhy: "No. The counter must be a field in the shared struct (or otherwise mapped).",
      answerCode: "/* WRONG: */\nint count = 0;            /* private */\npthread_mutex_lock(&b->lock);\ncount++;                  /* each process has its own count */\n\n/* RIGHT: */\nb->count++;               /* shared field */",
      answerWhy: "No. People lock correctly and still increment a private int. The lock protects the wrong box."
    },
    {
      id: "s22", kind: "predict", group: "Shared block: counters + a lock", title: "Two arrows one object",
      prompt: "What prints?",
      code: "#include <stdio.h>\nstruct Point { int x; int y; };\nint main(void) {\n  struct Point p = {0, 0};\n  struct Point *a = &p;\n  struct Point *b = &p;\n  a->x = 2;\n  b->y = 8;\n  printf(\"%d %d\\n\", p.x, p.y);\n  return 0;\n}",
      hint: "Two papers, one Point. Like two threads on one Block.",
      accept: ["2 8"],
      shortWhy: "One object: x=2 y=8.",
      answerCode: "struct Point *a = &p;  /* paper 1 */\nstruct Point *b = &p;  /* paper 2 — same box */\na->x = 2;\nb->y = 8;\n/* p is 2, 8 */\n\n/* Output:\n2 8\n*/",
      answerWhy: "This is two threads, one Block, without a race because they wrote different fields. Two writers on count need the lock field."
    },
    {
      id: "s23", kind: "fill", group: "Shared block: counters + a lock", title: "Who is b",
      prompt: "In the mmap line struct Block *b = mmap(...), b is a ______. One word from Chapter 8.",
      hint: "Paper.",
      accept: ["pointer", "paper"],
      shortWhy: "b is a pointer (paper) to the shared Block.",
      answerCode: "struct Block *b = mmap(...);\n/* b: paper\n   *b / b->...: the shared object (the box)\n   MAP_FAILED: bad paper */",
      answerWhy: "Pointer. Then every field is b->name. You almost never copy *b by value in this course."
    },
    {
      id: "s24", kind: "tf", group: "Shared block: counters + a lock", title: "Semaphore field",
      prompt: "Can a counting semaphore also be a field in the same shared struct next to the counters?",
      hint: "Same pattern as mutex. One object everyone maps.",
      accept: ["yes"],
      shortWhy: "Yes. sem_t go; as a field, then sem_wait(&b->go).",
      answerCode: "struct Block {\n  pthread_mutex_t lock;\n  sem_t go;       /* another field, still one object */\n  int count;\n};\nsem_wait(&b->go);  /* paper to the field */",
      answerWhy: "Yes. Mutex vs semaphore is OS theory. In C they are both fields you address with &b->field."
    }
  ]
};
