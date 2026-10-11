window.C_OS_CHAPTER = {
  id: "ch06",
  drills: [
    {
      id: "r01", kind: "tf", group: "Index", title: "Start at 0",
      prompt: "Is the first box of int a[4] called a[0]?",
      hint: "Zero, not one.",
      accept: ["yes"],
      shortWhy: "Yes. Index 0 is the first.",
      answerCode: "int a[4];\na[0] = 10;  /* first box */",
      answerWhy: "Yes. Last is a[3]. There is no a[4]."
    },
    {
      id: "r02", kind: "fill", group: "Index", title: "Last index",
      prompt: "For int a[4], the last legal index is? Type a[3]",
      hint: "Length minus one.",
      accept: ["a[3]", "3"],
      shortWhy: "a[3] (or 3). Not a[4].",
      answerCode: "int a[4];  /* indexes 0,1,2,3 */\na[3] = 40; /* last */\n/* a[4] = 1;  OUT OF RANGE */",
      answerWhy: "Length 4, last index 3. Off-by-one writes a[4] and can smash nearby boxes."
    },
    {
      id: "r03", kind: "tf", group: "Index", title: "a[4]",
      prompt: "Is a[4] a legal box when you declared int a[4]?",
      hint: "Four boxes: 0,1,2,3.",
      accept: ["no"],
      shortWhy: "No. Out of range.",
      answerCode: "int a[4];\n/* a[4] does not belong to this array */",
      answerWhy: "No. It may not even crash immediately. Still wrong. Labs die here."
    },
    {
      id: "r04", kind: "predict", group: "Index", title: "Read a[1]",
      prompt: "What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int a[3];\n  a[0] = 7;\n  a[1] = 8;\n  a[2] = 9;\n  printf(\"%d\\n\", a[1]);\n  return 0;\n}",
      hint: "Middle box.",
      accept: ["8"],
      shortWhy: "8.",
      answerCode: "a[0]=7 a[1]=8 a[2]=9;\nprintf(\"%d\\n\", a[1]);  /* 8 */\n/* Output:\n8\n*/",
      answerWhy: "The index selects the box. Not ‘the second number people count from 1’ as a[2]."
    },
    {
      id: "r05", kind: "predict", group: "Index", title: "Replace one",
      prompt: "What prints? Two numbers: a[0] then a[1].",
      code: "#include <stdio.h>\nint main(void) {\n  int a[2];\n  a[0] = 1;\n  a[1] = 2;\n  a[0] = 9;\n  printf(\"%d %d\\n\", a[0], a[1]);\n  return 0;\n}",
      hint: "Only a[0] was replaced.",
      accept: ["9 2"],
      shortWhy: "9 2. Other box unchanged.",
      answerCode: "a[0]=1; a[1]=2;\na[0]=9;   /* only first box */\n/* Output: 9 2 */",
      answerWhy: "Same replace rule as Chapter 2, per box."
    },
    {
      id: "r06", kind: "predict", group: "Walk", title: "Clear then one write",
      prompt: "After the loop and a[1]=5, what is a[0] a[1] a[2]? Three numbers.",
      code: "int a[3];\nint i;\nfor (i = 0; i < 3; i++) {\n  a[i] = 0;\n}\na[1] = 5;",
      hint: "All zero, then middle 5.",
      accept: ["0 5 0"],
      shortWhy: "0 5 0",
      answerCode: "for i=0,1,2: a[i]=0\nthen a[1]=5\n/* 0 5 0 */",
      answerWhy: "Loop uses i < 3. Then one index write."
    },
    {
      id: "r07", kind: "tf", group: "Walk", title: "Loop test",
      prompt: "To visit every box of a[n], should the for-test be i < n (not i <= n)?",
      hint: "i <= n hits a[n], which is out of range.",
      accept: ["yes"],
      shortWhy: "Yes. i < n. Chapter 5 habit, now required.",
      answerCode: "for (i = 0; i < n; i++) {\n  a[i] = 0;\n}",
      answerWhy: "Yes. i <= n is the smash."
    },
    {
      id: "r08", kind: "fill", group: "Walk", title: "Element syntax",
      prompt: "Box number i of array a? Type a[i]",
      hint: "Name, square brackets, index.",
      accept: ["a[i]"],
      shortWhy: "a[i]",
      answerCode: "a[i] = 0;     /* selected box */\n/* a(i)  is a function call, wrong */",
      answerWhy: "Square brackets. Round brackets would call a function named a."
    },
    {
      id: "r09", kind: "predict", group: "Walk", title: "Sum",
      prompt: "What is s?",
      code: "int a[3];\na[0]=1; a[1]=2; a[2]=3;\nint s = 0;\nint i;\nfor (i = 0; i < 3; i++) {\n  s = s + a[i];\n}",
      hint: "1+2+3.",
      accept: ["6"],
      shortWhy: "6.",
      answerCode: "s=0\n+a[0] → 1\n+a[1] → 3\n+a[2] → 6",
      answerWhy: "Loop plus index. Table of s."
    },
    {
      id: "r10", kind: "tf", group: "Strings", title: "Quotes",
      prompt: "Is \"/myshm\" a char array (a string), not a single char?",
      hint: "Double quotes. Terminator included.",
      accept: ["yes"],
      shortWhy: "Yes. Double quotes → string. Leading slash is POSIX, still a string.",
      answerCode: "char name[] = \"/myshm\";\nshm_open(name, ...);  /* paper to first char */",
      answerWhy: "Yes. 'm' would be one character. Wrong for shm_open."
    },
    {
      id: "r11", kind: "tf", group: "Strings", title: "Terminator",
      prompt: "Does a C string like \"/myshm\" include a hidden '\\0' box at the end?",
      hint: "That 0 is how %s and shm_open know to stop.",
      accept: ["yes"],
      shortWhy: "Yes. Extra box value 0.",
      answerCode: "/* / m y s h m  \\0   ← seven boxes, not six */\nchar name[] = \"/myshm\";",
      answerWhy: "Yes. If you overwrite the '\\0', printf(%s) runs off the end."
    },
    {
      id: "r12", kind: "fill", group: "Strings", title: "Name",
      prompt: "Type the POSIX shm name string as in this course, including quotes: \"/myshm\"",
      hint: "Slash, then myshm, double quotes.",
      accept: ["\"/myshm\"", "/myshm"],
      shortWhy: "\"/myshm\" with a leading slash.",
      answerCode: "shm_open(\"/myshm\", O_CREAT | O_RDWR, 0600);",
      answerWhy: "The string is this chapter. The slash rule is Chapter 10. Both required."
    },
    {
      id: "r13", kind: "tf", group: "Strings", title: "Pass the name",
      prompt: "When you write shm_open(\"/myshm\", ...), are you passing a paper to the first character of a char array?",
      hint: "The function wants const char *. The quoted string is that array.",
      accept: ["yes"],
      shortWhy: "Yes. Array name / string literal → paper to first char. Chapter 8 words, this chapter object.",
      answerCode: "shm_open(\"/myshm\", O_RDWR, 0600);\n/* argument 1: paper to '/' of that string */",
      answerWhy: "Yes. You will feel this fully with pointers. You already pass it."
    },
    {
      id: "r14", kind: "predict", group: "Strings", title: "First char",
      prompt: "char name[] = \"/myshm\"; What is name[0]? Type the character /",
      code: "char name[] = \"/myshm\";\n/* name[0] is ? */",
      hint: "First character of the string.",
      accept: ["/", "'/'"],
      shortWhy: "/  (the slash).",
      answerCode: "char name[] = \"/myshm\";\n/* name[0] == '/'  */",
      answerWhy: "Index 0 is '/'. That is why POSIX names start with slash in the first box."
    },
    {
      id: "r15", kind: "write", group: "Strings", title: "Declare array",
      prompt: "Declare int a[4]; — four int boxes.",
      hint: "int a[4];",
      must: ["int a[4]"],
      shortWhy: "Four ints, indexes 0..3.",
      answerCode: "int a[4];   /* four boxes. values garbage until you write */",
      answerWhy: "Write them before you read, same as Chapter 2. A loop of zeros is the clean start."
    },
    {
      id: "r16", kind: "write", group: "Strings", title: "Clear loop",
      prompt: "Write a for-loop that sets a[i] = 0 for i from 0 while i < 4.",
      hint: "for (i = 0; i < 4; i++) { a[i] = 0; }",
      must: ["for", "i=0", "i<4", "a[i]=0"],
      shortWhy: "Walk legal indexes only.",
      answerCode: "int i;\nfor (i = 0; i < 4; i++) {  /* i = 0,1,2,3 */\n  a[i] = 0;                /* never a[4] */\n}",
      answerWhy: "i < 4 not i <= 4."
    },
    {
      id: "r17", kind: "tf", group: "OS door", title: "pid table",
      prompt: "Can you store several child pids in pid_t kids[3]; and then kids[0] = r; after a fork?",
      hint: "Array of ints (pid_t). Same indexes.",
      accept: ["yes"],
      shortWhy: "Yes. Array of pids. Still Chapter 6 plus fork.",
      answerCode: "pid_t kids[3];\nkids[0] = fork();  /* remember: this fork still returns twice.\n                      only the parent should store in kids[0] after r>0 */",
      answerWhy: "Yes. Careful: assign in the parent branch. The array is just boxes."
    },
    {
      id: "r18", kind: "tf", group: "OS door", title: "mmap as array",
      prompt: "If mmap gives int *p to several shared ints, is p[0] the first int, same index rule as an array?",
      hint: "Pointer plus index. Same 0-based boxes.",
      accept: ["yes"],
      shortWhy: "Yes. p[i] is like a[i]. Still do not walk off the mapping.",
      answerCode: "int *p = mmap(..., n * sizeof(int), ...);\np[0] = 1;   /* first shared int */\np[1] = 2;",
      answerWhy: "Yes. Chapter 8 returns the paper. This chapter’s index uses it. Size the mmap (Ch9/10)."
    },
    {
      id: "r19", kind: "tf", group: "OS door", title: "Assign whole array",
      prompt: "Does int b[4]; b = a; copy all four ints in standard C as used here?",
      hint: "You loop, or memcpy. Arrays are not copied with = in this course.",
      accept: ["no"],
      shortWhy: "No. Copy box by box in a loop (or memcpy later).",
      answerCode: "for (i = 0; i < 4; i++) {\n  b[i] = a[i];   /* copy each box */\n}",
      answerWhy: "No. Structs can be copied with = (Chapter 9). Arrays in this picture cannot."
    },
    {
      id: "r20", kind: "predict", group: "OS door", title: "Two indexes",
      prompt: "a[0]=4; a[1]=a[0]+1; What is a[1]?",
      code: "int a[2];\na[0] = 4;\na[1] = a[0] + 1;",
      hint: "Read a[0] which is 4, write 5 into a[1].",
      accept: ["5"],
      shortWhy: "5.",
      answerCode: "a[0] = 4;\na[1] = a[0] + 1;  /* 5 */",
      answerWhy: "You can use one box to compute another. Still two boxes."
    },
    {
      id: "r21", kind: "fill", group: "OS door", title: "Length in declare",
      prompt: "How many boxes in char buf[64]; ? Type 64",
      hint: "The number in the brackets is the count of boxes, including room for '\\0' if you store a string.",
      accept: ["64"],
      shortWhy: "64 boxes. Last index 63.",
      answerCode: "char buf[64];  /* indexes 0..63 */\nbuf[0] = '\\0'; /* empty string */",
      answerWhy: "64. If you put a string in, you need a '\\0' inside those 64, not at buf[64]."
    },
    {
      id: "r22", kind: "tf", group: "OS door", title: "Ready for 7",
      prompt: "After arrays, is the next C you need for OS the function call (what goes in, what comes back, who waits)?",
      hint: "Chapter 7 is the hinge start. Then pointers.",
      accept: ["yes"],
      shortWhy: "Yes. Go to Chapter 7. Do not skip 8.",
      answerCode: "/* Ch7 functions: fork wait kill handler\n   Ch8 pointers: mutex mmap GPIO\n   Ch9 structs: lock + count\n   Ch10 headers: -lpthread -lrt */",
      answerWhy: "Yes. 1–6 are the warm-up. 7–10 are the exam hinge. Both are now open."
    },
    {
      id: "r23", kind: "write", group: "OS door", title: "String var",
      prompt: "Write char name[] = \"/myshm\";",
      hint: "char name[] = \"/myshm\";",
      must: ["char name", "/myshm"],
      shortWhy: "A named string for shm_open.",
      answerCode: "char name[] = \"/myshm\";  /* boxes + '\\0' */\nshm_open(name, O_RDWR, 0600);",
      answerWhy: "You may pass \"/myshm\" directly. A named array is easier to print and reuse."
    },
    {
      id: "r24", kind: "predict", group: "OS door", title: "Which box",
      prompt: "int a[3]={1,2,3}; printf a[0]. What prints?",
      code: "#include <stdio.h>\nint main(void) {\n  int a[3] = {1, 2, 3};\n  printf(\"%d\\n\", a[0]);\n  return 0;\n}",
      hint: "First of the list.",
      accept: ["1"],
      shortWhy: "1. Initialiser list fills from index 0.",
      answerCode: "int a[3] = {1, 2, 3};  /* a[0]=1 a[1]=2 a[2]=3 */\nprintf(\"%d\\n\", a[0]);  /* 1 */",
      answerWhy: "{1,2,3} is not a special OS thing. It fills the boxes in order."
    },
    {
      id: "r25", kind: "tf", group: "OS door", title: "Negative index",
      prompt: "Is a[-1] a legal box of a[4]?",
      hint: "Negative is before the start.",
      accept: ["no"],
      shortWhy: "No. Out of range, like a[4].",
      answerCode: "/* a[-1] is not your array. undefined. */",
      answerWhy: "No. Only 0,1,2,3."
    }
  ]
};
