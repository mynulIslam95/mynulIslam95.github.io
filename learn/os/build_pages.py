#!/usr/bin/env python3
"""Build C2–C6 and OS1–OS9 static pages + the map + exam MCQ hall."""
from pathlib import Path

from mcq_bank import GROUPS, all_items

ROOT = Path(__file__).resolve().parent
CSS = "../css/os.css?v=5"
JS = "../js/os.js?v=3"


def esc(s):
    return (
        str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def quiz(ans, q, why):
    return f"""
      <div class="quiz" data-answer="{ans}">
        <p><strong>Practice.</strong> {q}</p>
        <div class="choices">
          <button type="button" data-pick="yes">Yes</button>
          <button type="button" data-pick="no">No</button>
        </div>
        <div class="why">
          <span class="tag"></span>
          <p>{why}</p>
        </div>
      </div>"""


def tf(n, ans, q, why):
    return f"""
      <div class="quiz" data-answer="{ans}" id="q{n}">
        <p class="q-id">Q{n:02d}</p>
        <p><strong>True or false.</strong> {q}</p>
        <div class="choices">
          <button type="button" data-pick="yes">True</button>
          <button type="button" data-pick="no">False</button>
        </div>
        <div class="why">
          <span class="tag"></span>
          <p>{why}</p>
        </div>
      </div>"""


def story(paras):
    inner = "\n".join(f"        <p>{p}</p>" for p in paras)
    return f'      <h2>Story</h2>\n      <div class="story">\n{inner}\n      </div>'


def code(src, note):
    return f"""      <pre><code>{esc(src)}</code></pre>
      <p class="line-note">{note}</p>"""


def paper(year, q, steps):
    items = "\n".join(f"          <li>{s}</li>" for s in steps)
    return f"""
      <div class="paper">
        <p class="yr">{esc(year)}</p>
        <p>{q}</p>
        <details>
          <summary>Solution steps</summary>
          <ol>
{items}
          </ol>
        </details>
      </div>"""


def need(html):
    return f'      <p class="need">{html}</p>'


def page(rel, title, desc, kicker, h1, lede, body, prev, nxt, foot, nav_on):
    nested = rel.startswith("c/") or rel.startswith("lessons/") or rel.startswith("exam/")
    css = CSS if nested else "css/os.css?v=5"
    js = JS if rel != "index.html" else None
    brand = "../index.html" if rel != "index.html" else "index.html"
    map_href = "../index.html" if rel != "index.html" else "index.html"
    c_href = "c1.html" if rel.startswith("c/") else ("c/c1.html" if rel == "index.html" else "../c/c1.html")
    os_href = "os0.html" if rel.startswith("lessons/") else ("lessons/os0.html" if rel == "index.html" else "../lessons/os0.html")
    exam_href = "mcq.html" if rel.startswith("exam/") else ("exam/mcq.html" if rel == "index.html" else "../exam/mcq.html")
    hub = "../../index.html" if rel != "index.html" else "../index.html"
    if rel == "index.html":
        css = "css/os.css?v=5"
        c_href = "c/c1.html"
        os_href = "lessons/os0.html"
        exam_href = "exam/mcq.html"
        brand = "index.html"
        map_href = "index.html"
        hub = "../index.html"
    nav_c = ' class="is-on"' if nav_on == "c" else ""
    nav_os = ' class="is-on"' if nav_on == "os" else ""
    nav_map = ' class="is-on"' if nav_on == "map" else ""
    nav_ex = ' class="is-on"' if nav_on == "exam" else ""
    script = f'  <script src="{js}"></script>\n' if js else ""
    pager = ""
    if prev or nxt:
        pager = f"""
      <div class="pager">
        <a href="{prev[0]}">{prev[1]}</a>
        <a href="{nxt[0]}">{nxt[1]}</a>
      </div>"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="{css}"/>
</head>
<body class="os">
  <a class="skip" href="#main">Skip to content</a>
  <header class="os-bar">
    <div class="wrap">
      <a class="os-brand" href="{brand}">OS · Learn</a>
      <nav class="os-nav" aria-label="OS">
        <a{nav_map} href="{map_href}">Map</a>
        <a{nav_c} href="{c_href}">C stories</a>
        <a{nav_os} href="{os_href}">OS stories</a>
        <a{nav_ex} href="{exam_href}">Exam</a>
        <a href="{hub}">Learn hub</a>
      </nav>
    </div>
  </header>
  <main id="main">
    <div class="wrap">
      <p class="kicker">{kicker}</p>
      <h1>{h1}</h1>
      <p class="lede">{lede}</p>
{body}{pager}
    </div>
  </main>
  <footer class="os-foot">
    <div class="wrap">{esc(foot)}</div>
  </footer>
{script}</body>
</html>
"""
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print("wrote", rel)


def card(href, ident, title, blurb):
    return f"""          <a class="card" href="{href}">
            <p class="id">{ident} · open</p>
            <h3>{title}</h3>
            <p>{blurb}</p>
          </a>"""


C2 = "\n".join([
    story([
        "In the shop there is a <strong>box</strong> with a name. One box is called <code>money</code>. You put 10 inside.",
        "A <strong>choice</strong>: if the box is 0, you close the shop. If it is not 0, you stay open.",
        "A <strong>repeat</strong>: you add 1 to the box, again and again, three times. The box ends at 13.",
        "The name of the box is not the money. The money is the number inside.",
    ]),
    quiz("yes", "Is <code>money</code> a box that can hold a number?",
         "Yes. In C that box is a variable. <code>int money = 10;</code> means: make a box for a whole number, put 10 in it."),
    quiz("no", "If you write a new number in the box, does the old number stay there too?",
         "No. A box holds one number at a time. The new number replaces the old one."),
    "<h2>The same story in C</h2>",
    "<p>A whole number uses <code>int</code>. <code>if</code> is the choice. <code>while</code> is the repeat. <code>printf</code> shows what is inside.</p>",
    code("""#include <stdio.h>

int main(void) {
  int money = 10;
  int n = 0;
  while (n < 3) {
    money = money + 1;
    n = n + 1;
  }
  if (money == 0) {
    printf("closed\\n");
  } else {
    printf("open, money=%d\\n", money);
  }
  return 0;
}""", "money is the box. The while loop adds 1 three times. Then if asks: is the box empty?"),
    quiz("no", "After this program, is <code>money</code> still 10?",
         "No. It started at 10. The loop added 1 three times. It is 13. The program prints open, money=13."),
    quiz("yes", "Is <code>if (money == 0)</code> the choice “is the shop empty?”",
         "Yes. Two equal signs ask: is this equal to that? One equal sign would put a number in the box."),
])

C3 = "\n".join([
    story([
        "You do not count every apple yourself. You ask a <strong>helper</strong>: “count these, come back with a number.”",
        "You give the helper two numbers: how many boxes, how many apples in each. The helper <strong>returns</strong> the total.",
        "You wait for the answer. Then you write it on the door.",
        "Later, <code>fork</code> and <code>waitpid</code> are also helpers you call. First you must see a helper in a small story.",
    ]),
    quiz("yes", "Does the helper give you back one answer?",
         "Yes. That answer is the return value. In C, <code>return total;</code> sends it back to the caller."),
    quiz("no", "Do you need to copy the helper’s whole job into every note?",
         "No. You write the helper once. You call it when you need it. That is a function."),
    "<h2>The same story in C</h2>",
    code("""#include <stdio.h>

int count_apples(int boxes, int each) {
  return boxes * each;
}

int main(void) {
  int total = count_apples(4, 5);
  printf("apples=%d\\n", total);
  return 0;
}""", "count_apples is the helper. 4 and 5 are what you give. return is the answer. main prints 20."),
    quiz("yes", "Does <code>count_apples(4, 5)</code> return 20?",
         "Yes. Four boxes, five apples each. 4 × 5 = 20. <code>total</code> holds 20."),
    quiz("no", "Is <code>main</code> the helper that counts apples?",
         "No. <code>main</code> is still “start here.” It asks the helper, then prints."),
])

C4 = "\n".join([
    story([
        "The box <code>money</code> sits on a shelf. The shelf has a number. That number is the <strong>address</strong>.",
        "You write the address on a paper. The paper is not the money. The paper only says where the box lives.",
        "Worker A and Worker B both hold a copy of that paper. They walk to the <strong>same</strong> shelf. If A puts 50 in the box, B sees 50.",
        "In C the paper is a <strong>pointer</strong>. <code>&amp;money</code> means “the address of this box.” <code>*p</code> means “open the box at this address.”",
        "You will need this for a mutex, a semaphore, and <code>mmap</code>. Without the paper, those words are magic.",
    ]),
    quiz("no", "If I copy the paper, do I get a second box of money?",
         "No. You copy the address, not the money. Two papers, one box."),
    quiz("yes", "If two workers have the same paper, and one writes 50, does the other see 50?",
         "Yes. Same shelf. That is why two threads can smash the same <code>x</code>. That is also why a lock can sit at one address both can open."),
    "<h2>The same story in C</h2>",
    code("""#include <stdio.h>

int main(void) {
  int money = 10;
  int *p = &money;
  *p = 50;
  printf("money=%d\\n", money);
  return 0;
}""", "money is the box. p is the paper. &money fills the paper. *p = 50 opens the box and writes 50. printf shows 50."),
    quiz("yes", "After <code>*p = 50</code>, is <code>money</code> 50?",
         "Yes. You did not make a second box. You opened the same box through the paper."),
    quiz("no", "Is <code>p</code> the money?",
         "No. <code>p</code> is the address. <code>*p</code> is the money inside."),
])

C5 = "\n".join([
    story([
        "The shop does not carry four loose papers. It carries <strong>one form</strong> with several fields: violins, rooms, keys.",
        "You change only violins. Rooms and keys stay as they were.",
        "Later, a music school keeps four counters on one shared form: holidays, cars, a tape, a printer. That is the same idea with a bigger form.",
        "The form has a name. Each field has a name. You write <code>shop.violins</code> to open one field.",
    ]),
    quiz("no", "If you change violins on the form, do rooms also change by themselves?",
         "No. Each field is its own box on the same paper."),
    quiz("yes", "Is one form easier to share than four loose papers?",
         "Yes. You map one block of memory. All fields travel together. That is why OS stories use a struct."),
    "<h2>The same story in C</h2>",
    code("""#include <stdio.h>

struct Shop {
  int violins;
  int rooms;
};

int main(void) {
  struct Shop s;
  s.violins = 20;
  s.rooms = 3;
  s.violins = s.violins - 1;
  printf("violins=%d rooms=%d\\n", s.violins, s.rooms);
  return 0;
}""", "struct Shop is the form. s is one filled form. s.violins is one field. Print is 19 and 3."),
    quiz("yes", "After this program, are there 19 violins and 3 rooms?",
         "Yes. You only changed violins. Rooms stayed 3."),
    quiz("no", "Is <code>struct Shop</code> a process?",
         "No. It is only a form in C. A process is a running shop. You meet that in OS1."),
])

C6 = "\n".join([
    story([
        "If you ask for a special lock, you must <strong>bring the toolkit</strong>. The first line of the note names the toolkit: <code>#include &lt;pthread.h&gt;</code>.",
        "The builder also needs a flag: <code>-pthread</code>. If you forget the flag, the builder says it does not know the lock words.",
        "POSIX semaphores often need <code>#include &lt;semaphore.h&gt;</code> and <code>-lrt</code> or <code>-pthread</code> on Linux.",
        "The toolkit is not the story. It is the bag you carry so the story can run.",
    ]),
    quiz("no", "If you write <code>pthread_create</code> but you never include the toolkit, will the builder always succeed?",
         "No. You must include the header. You must also pass <code>-pthread</code> when you call gcc."),
    quiz("yes", "Is <code>gcc shop.c -o shop -pthread</code> the builder command for a lock used by two workers?",
         "Yes. <code>-o shop</code> names the tool. <code>-pthread</code> brings the thread toolkit."),
    "<h2>The same story in C</h2>",
    "<p>You already know <code>main</code>. Here you only see the includes and the builder line. The lock story is OS3.</p>",
    code("""#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

/* gcc this.c -o this -pthread */

int main(void) {
  printf("toolkits are here\\n");
  return 0;
}""", "stdio for print. pthread for workers and the key. semaphore for tickets. Compile with -pthread."),
    quiz("no", "Does <code>#include</code> start the shop helper?",
         "No. <code>main</code> still starts the helper. Include only brings words the builder must know."),
    quiz("yes", "After C1–C6, can you read a box, a helper, an address, a form, and a toolkit line?",
         "Yes. That is enough C to open OS1. Process, lock, and mmap will add new words, still explained line by line."),
])

OS1 = "\n".join([
    need('You need <a href="../c/c1.html">C1</a>–<a href="../c/c4.html">C4</a>. A process is a running copy of a program.'),
    story([
        "A recipe on the shelf is a <strong>program</strong>. When the building starts it, it becomes a <strong>process</strong>: one running shop, with its own number (PID) and its own money box.",
        "You can <strong>copy the whole shop</strong>. That copy is <code>fork</code>. Now there are two buildings. Each has its own money. If shop A writes 5, shop B still has the old number.",
        "In the child shop, <code>fork</code> returns 0. In the parent shop, it returns the child’s PID. If it fails, it returns −1.",
        "<code>exec</code> does not copy the shop. It throws away the work inside the <strong>same</strong> PID and loads a new recipe. After the child runs <code>ls</code>, you still have two processes, not three.",
        "If the child closes and the parent never calls <code>waitpid</code>, a tiny <strong>zombie</strong> slot stays. <code>waitpid</code> frees it.",
        "Five states of one shop: New (the notebook is not ready), Ready (it wants the CPU), Running (it is on the core), Blocked (it waits for sleep, a pipe, or a ticket), Exit.",
    ]),
    quiz("no", "After <code>fork</code>, can the two shops see each other’s money box?",
         "No. Each has a copy. Threads in one shop would share. That is OS2."),
    quiz("no", "Does <code>exec</code> make a third process?",
         "No. Same PID, new program. The number of processes does not go up."),
    quiz("yes", "Does <code>waitpid</code> stop a child staying a zombie?",
         "Yes. The parent collects the exit code. The kernel can drop the tiny slot."),
    "<h2>The same story in C</h2>",
    code("""#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
  int x = 10;
  pid_t p = fork();
  if (p == 0) {
    x = 20;
    printf("child x=%d\\n", x);
    return 0;
  }
  printf("parent x=%d\\n", x);
  waitpid(p, NULL, 0);
  return 0;
}""", "x starts 10. fork copies the shop. Child sets x to 20 and prints 20. Parent still prints 10, then waitpid."),
    quiz("yes", "Does the parent print 10?",
         "Yes. The parent’s x was never set to 20. That write happened in the other shop."),
    quiz("no", "Can you tell parent from child by a global you set before <code>fork</code>?",
         "No. Both copies start with that same global. You tell them apart with the return value p. “You cannot use variables” is the wrong sentence: p is a variable."),
    "<h2>Lab 2, same shop</h2>",
    "<p>Parent prints A, child prints B, in a tight loop. You hope to see ABAB. You often see AAAA then BBBB. <code>printf</code> stores letters in a buffer. The OS sees a chunk, not each time slice. Higher <code>nice</code> means the process is nicer to others: <strong>less</strong> CPU. <code>usleep</code> puts the shop in Blocked, not Ready. A lock <strong>file</strong> can stay after a crash. <code>fcntl</code> is a lock the kernel forgets when the process dies.</p>",
    paper("SS2018 / many years · true or false",
          "After fork, can the two processes use each other’s heap? Does exec create an extra process? Can two forks make a process its own grandfather? Does a parent have at most one child?",
          [
              "Heap after fork: no. Two copies. Write false for “they can use each other’s heap.”",
              "exec: same PID, new program. Write false for “exec creates an extra process.” Write true for “after exec there are as many processes as before.”",
              "Fork only makes children, down the tree. Grandfather: false.",
              "A parent may have many children. “At most one” is false. waitpid true for zombies.",
          ]),
    paper("Lab 2 · WS2024",
          "You raise nice, both use printf, then you add usleep. Why is a lock file a bad lock?",
          [
              "Higher nice → lower priority → less CPU if both burn the CPU.",
              "printf buffers, so the screen is chunks, not time slices. Say the buffer, not “the scheduler is unfair.”",
              "usleep is Blocked, not Ready. They stop fighting for the core.",
              "A lock file can remain after a crash. fcntl is a kernel lock. F_SETLKW waits.",
          ]),
])

OS2 = "\n".join([
    need('You need <a href="os1.html">OS1</a> and <a href="../c/c4.html">C4</a>. Two workers in <strong>one</strong> shop.'),
    story([
        "A <strong>thread</strong> is a worker inside one shop. Two workers of the same shop share the money box. They see the same <code>x</code>.",
        "That is cheap talk. That is also danger. Both add 1. <code>x = x + 1</code> is three steps: read, add, write. Both can read 10. Both write 11. You wanted 12. One add is lost.",
        "“A thread’s memory is protected so no other thread can touch it” sounds safe. It is false. Threads of one process share by design.",
        "You do not need shared memory for two threads. They already live in one shop. You do not need twenty tickets. There is one box, not twenty violins.",
    ]),
    quiz("yes", "Do two threads of one process share the heap?",
         "Yes. Same shop, same boxes. Two processes after fork do not."),
    quiz("no", "If both add 1 to x a thousand times, is x always 2000 with no lock?",
         "No. A lost update can happen. You will need the key in OS3."),
    "<h2>The same story in C</h2>",
    "<p>The worker function is what each thread runs. <code>pthread_join</code> waits until that worker finishes. If <code>main</code> returns without join, the whole shop closes and both workers die early. Compile with <code>-pthread</code>.</p>",
    code("""#include <pthread.h>

int x = 0;

void *worker(void *arg) {
  int i;
  for (i = 0; i < 1000; i++) {
    x = x + 1;
  }
  return NULL;
}

int main(void) {
  pthread_t t1, t2;
  pthread_create(&t1, NULL, worker, NULL);
  pthread_create(&t2, NULL, worker, NULL);
  pthread_join(t1, NULL);
  pthread_join(t2, NULL);
  return 0;
}""", "x is global so both workers see it. If x is local inside worker, each has a private box and there is no race. join waits. This still has no key — x may not be 2000."),
    quiz("yes", "Must x be global (or heap) for both workers to share it?",
         "Yes. A local x inside worker sits on that thread’s own stack."),
    quiz("no", "If main skips join, are you sure both workers finished?",
         "No. When main returns, the process exits. Threads can die in the middle."),
    paper("SS2018 Processes and Threads · true or false",
          "“A thread’s address space is protected so no other thread can access it.”",
          [
              "Read the sentence slowly. Threads of one process share the address space.",
              "Protected from threads of another process: different story. This sentence is about other threads — it is false.",
          ]),
    paper("SS2024 primes (short)",
          "Ten workers search for a big prime. Are they threads or ten shops?",
          [
              "If they share one result box, they are threads of one process.",
              "If each is a new program with its own memory, they are processes. The paper usually wants threads plus a lock on the result (OS3).",
          ]),
])

OS3 = "\n".join([
    need('You need <a href="os2.html">OS2</a>. One key for one drawer. The worker who took the key must give it back.'),
    story([
        "The cash drawer has <strong>one key</strong>. Only the worker who holds the key may open the drawer. That key is a <strong>mutex</strong>. Mutex means: one owner.",
        "You lock, you change <code>x</code>, you unlock. If the other worker already has the key, you <strong>wait</strong>. You do not spin in front of the drawer: <code>while (!free) { }</code> burns the CPU.",
        "The stretch that touches <code>x</code> is the <strong>critical section</strong>. Critical does not mean “important for the grade.” It means this stretch must not overlap.",
        "A mutex does <strong>not</strong> stop deadlock. If A takes key 1 then key 2, and B takes key 2 then key 1, each mutex did its job and they still wait forever. Deadlock is OS5.",
    ]),
    quiz("yes", "Does a mutex have an owner?",
         "Yes. The worker who locked should unlock. A semaphore (OS4) has no owner."),
    quiz("no", "Does a mutex also prevent deadlock?",
         "No. It only says: one at a time on this key. A circle of two keys is a different problem."),
    "<h2>The same story in C</h2>",
    code("""#include <pthread.h>

int x = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void *worker(void *arg) {
  int i;
  for (i = 0; i < 1000; i++) {
    pthread_mutex_lock(&m);
    x = x + 1;
    pthread_mutex_unlock(&m);
  }
  return NULL;
}""", "m is the key, global so both lock the same key. lock, add 1, unlock. Only x = x + 1 is the critical section. &m is the paper (C4)."),
    quiz("yes", "Should the mutex be global like x?",
         "Yes. If each worker has its own mutex, they are not sharing one key."),
    quiz("no", "Is the for-loop the critical section?",
         "No. Only the lines that touch x while you hold the key. You must not hold the key for the whole 1000 if you do not need to — here we lock around each add."),
    paper("SS2018 / WS2024 · true or false",
          "“Mutexes avoid deadlocks.” Two threads add 1 to x. Why might x not be 2000?",
          [
              "Mutexes avoid deadlocks: false. A mutex is one key. Deadlock is a circle.",
              "x = x + 1 is read, add, write. Both can read 10 and both write 11. Lost update.",
              "Fix: lock, add, unlock. Then x is 2000 if you also join.",
          ]),
])

OS4 = "\n".join([
    need('You need <a href="os3.html">OS3</a> and <a href="../c/c5.html">C5</a>. Twenty tickets, not one key.'),
    story([
        "On the wall hang <strong>twenty violins</strong>. The number on the wall is a <strong>semaphore</strong>: a counter. There is no owner. Anyone may take one. Anyone may put one back.",
        "<code>sem_wait</code> takes one ticket, or waits if there are none. <code>sem_post</code> gives one back and can wake a waiter. Shop A may take. Shop B may return.",
        "If the people taking tickets are <strong>workers in one shop</strong> (threads), they already share. <code>sem_init(s, 0, 10)</code> — the 0 means only this process. That is the 2018 gallery: at most 10 visitors, 500 visitor threads.",
        "If the people taking tickets are <strong>other programs</strong>, they cannot see a global in the first program. The counter must sit in a window both can see (OS6), and the second argument of <code>sem_init</code> must be <strong>1</strong>. If you pass 0, each program has its own 20. The school thinks it has 20 violins and hands out 40.",
        "A mutex is the wrong tool here. A mutex is one key, not twenty tickets.",
    ]),
    quiz("no", "Is a mutex the right tool for 20 violins?",
         "No. One key cannot count 20. You need a counter."),
    quiz("yes", "If students are other programs, must pshared be 1?",
         "Yes. 1 means other processes may use this object. 0 means only this process."),
    "<h2>The same story in C</h2>",
    "<p>Two programs. Start the rental first, then a student. Both compile with <code>-pthread</code>. The window itself is OS6. Here you see the tickets.</p>",
    code("""/* rental — create the counter of 20, then sleep */
sem_init(s, 1, 20);
pause();   /* wait in the kernel. while(1){} burns the CPU */

/* student — five lessons */
for (i = 0; i < 5; i++) {
  sem_wait(s);   /* take a violin; Blocked if none left */
  sleep(1);      /* play */
  sem_post(s);   /* give it back */
}""", "sem_init: 1 = other programs, 20 = free violins. pause does not burn the CPU. wait takes, post returns. Student opens the page read-write because wait writes the counter."),
    quiz("no", "Is Pause20Hours 22000 seconds?",
         "No. sleep(20 * 3600) is 72000 seconds."),
    quiz("yes", "If 20 violins are out, does student 21 wait instead of spin?",
         "Yes. sem_wait blocks. That is Blocked, not a busy loop."),
    paper("SS2022 · music school (same skeleton: SS2020 holidays, SS2025 robots)",
          "A rental process owns 20 violins. Later, other programs (students) start. Five exercises: take, play, return. Never more than 20 out. No busy wait. Rental may live forever.",
          [
              "Actors: rental program + student programs. Not threads of one process.",
              "Shared thing: a counter of 20, not one key. So counting semaphore, not mutex.",
              "They cannot see the rental’s heap. Put the semaphore in shared memory (OS6). sem_init(s, 1, 20).",
              "Take = sem_wait. Return = sem_post. Rental = pause(). Student mmap must be read-write.",
              "2020/2025: four counters in one struct (C5), same skeleton.",
          ]),
    paper("SS2018 · gallery",
          "At most 10 visitors at once. 500 visitor threads of one process.",
          [
              "Same shop: threads. They already share. No shm_open required.",
              "sem_init(s, 0, 10). The 0 is pshared: only this process. 10 is the count.",
          ]),
])

OS5 = "\n".join([
    need('You need <a href="os3.html">OS3</a> and <a href="os4.html">OS4</a>. Deadlock is a circle of waiting, not “the mutex failed.”'),
    story([
        "Four cars in a crossing. Each sits in one square and needs the next. Nobody can reverse. If they wait in a circle, they stand forever. That is <strong>deadlock</strong>.",
        "Four conditions. 1. Only one may use it. 2. Hold and wait: keep what you have, ask for the next. 3. No snatch: the OS will not pull the tool out of a hand. 4. Circular wait. The first three make deadlock possible. The circle makes it exist. Remove any one of the four, and deadlock cannot stay.",
        "Jazz takes the organ then the synth. Classical takes the synth then the organ. Drive them until Jazz holds organ and waits for synth, Classical holds synth and waits for organ. That is the circle. One organ, one synth: the picture of a cycle <strong>is</strong> deadlock.",
        "If a tool has several copies, a cycle on the drawing is not enough. Someone outside might finish and give one back. Then you need the detection numbers, not only the drawing.",
        "Three jobs the OS can do. Prevention: design so one condition cannot happen (same order). Avoidance: Banker's — pretend to grant, can everyone still finish? Detection: grant freely, later find who is stuck now.",
        "Need is the future (Claim minus what you hold). That is Banker's. Request is what they want now. That is detection. Do not mix the tables. Unsafe is not “stuck this second.” Unsafe means you might get stuck later, so you deny.",
    ]),
    quiz("no", "Does a mutex prevent deadlock?",
         "No. A mutex is condition 1 (only one may use it). The circle can still form with two mutexes in opposite order."),
    quiz("no", "If both programs take organ then synth, can this circle still form?",
         "No. Same order. The circle cannot form. That is prevention."),
    quiz("no", "Is unsafe the same as deadlock now?",
         "No. Unsafe is Banker's future. Deadlock now is detection."),
    "<h2>Need versus Request, with numbers</h2>",
    "<p>Free V = (1, 0). P1 Need (1, 0), holds (0, 1). P2 Need (1, 1), holds (1, 0). P1 asks for (1, 0). Grant or deny?</p>",
    paper("Worked numbers · Banker's",
          "P1 requests (1, 0). Show every Work step.",
          [
              "Request (1,0) fits P1 Need (1,0) and fits free (1,0). Pretend: P1 now holds (1,1). Free becomes (0,0).",
              "P1 Need is now (0,0), which fits Work (0,0). Mark P1 finished. Work += (1,1) → (1,1).",
              "P2 Need (1,1) now fits. Mark P2. Everyone finished → GRANT.",
              "If after pretend nobody’s Need fits, DENY. Write every Work vector, not only the last line.",
          ]),
    paper("SS2022 jazz / SS2020 tape-printer / SS2025 robots",
          "One robot takes T then P. The other takes P then T. One of each. Four conditions, prove deadlock, one fix.",
          [
              "Name the four conditions in full sentences.",
              "Drive until A holds T and waits for P, B holds P and waits for T.",
              "Graph: arrow from process to the resource it waits for, arrow from resource to the holder. Cycle. One instance each → this cycle is deadlock.",
              "Fix: both take T then P. Do not answer “use a mutex.”",
          ]),
    paper("SS2025 · Banker's vs detection",
          "What is the difference between Need and Request? Unsafe versus deadlock?",
          [
              "Need = Claim − Allocation. Future. Banker's pretends to grant, then asks if everyone can still finish. If not: unsafe, deny.",
              "Request Q = what they want now. Detection. No pretend future. Unmarked names are deadlocked now.",
              "Do not put Need in the detection table. Do not put Q in Banker's.",
          ]),
])

OS6 = "\n".join([
    need('You need <a href="../c/c4.html">C4</a>, <a href="../c/c5.html">C5</a>, and <a href="os4.html">OS4</a>. Two shops, one window.'),
    story([
        "Two different shops need to see the <strong>same</strong> violin board. You put the board in a <strong>window</strong> both can look through. That window is shared memory.",
        "Shared memory is not a lock. It only makes the same bytes visible. You still put a mutex or a semaphore on that page.",
        "The rental creates a named page with <code>shm_open</code>, gives it a size with <code>ftruncate</code>, then <code>mmap</code> with <code>MAP_SHARED</code> so the other shop sees the writes. Then <code>sem_init(s, 1, 20)</code>.",
        "The student opens the same name, no <code>O_CREAT</code>, read-write, because <code>sem_wait</code> writes the counter. Read-only can crash.",
    ]),
    quiz("no", "Is shared memory a synchronization tool by itself?",
         "No. It only shares bytes. You still need a mutex or a semaphore on that page."),
    quiz("yes", "Must the student open the page read-write to call sem_wait?",
         "Yes. wait subtracts one. That is a write."),
    "<h2>The same story in C</h2>",
    code("""#include <fcntl.h>
#include <sys/mman.h>
#include <semaphore.h>
#include <unistd.h>

int main(void) {
  int fd = shm_open("/pool", O_CREAT | O_RDWR, 0666);
  ftruncate(fd, sizeof(sem_t));
  sem_t *s = mmap(NULL, sizeof(sem_t),
                  PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
  close(fd);
  sem_init(s, 1, 20);
  pause();
  return 0;
}""", "O_CREAT: rental goes first. ftruncate: without a size there is no room. MAP_SHARED: the student must see writes. sem_init 1,20. pause, not an empty loop."),
    code("""int main(void) {
  int fd = shm_open("/pool", O_RDWR, 0);
  sem_t *s = mmap(NULL, sizeof(sem_t),
                  PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
  close(fd);
  int i;
  for (i = 0; i < 5; i++) {
    sem_wait(s);
    sleep(1);
    sem_post(s);
  }
  return 0;
}""", "Student: no O_CREAT. O_RDWR. Same name /pool. Five take-play-return."),
    paper("SS2022 Task 1 / SS2020 travel agency",
          "Why shared memory? What if pshared is 0? Why not mmap read-only for the student?",
          [
              "Students are other programs. They do not share the rental’s heap.",
              "pshared 0: each program has its own counter of 20. Forty violins in the world.",
              "Read-only: sem_wait must write. It can crash. Open O_RDWR, PROT_READ | PROT_WRITE.",
              "Rental must not burn the CPU: pause(), not while(1){}.",
          ]),
])

OS7 = "\n".join([
    need('Lab 1. You need <a href="os1.html">OS1</a> (fork, process cost) and <a href="os6.html">OS6</a> (mmap). Raspberry Pi 5.'),
    story([
        "The job: set GPIO17 as an output, toggle it as fast as you can, <strong>two ways</strong>, measure both on a scope, and explain why the speeds differ and why the fast wave has gaps.",
        "Linux talks about <strong>line 17</strong>. That is not hole 17 on the plastic. The probe goes on <strong>physical pin 11</strong>. Ground on a GND pin. Old reports said BeagleBoard pin 136. That is wrong on this board.",
        "On Pi 5, GPIO lives on a chip named <strong>RP1</strong>, not the old BCM chip. If you mmap old addresses, you write in the wrong place.",
        "Way 1 — a script. Every high and every low: the shell copies a process (fork), that process becomes gpioset (exec), gpioset talks to the kernel, the pin changes, the process dies. Then the next edge does the whole thing again. The pin is fast. You wait on process creation. Slow square wave, hundreds of hertz. Do not make your main sentence “bash is interpreted.”",
        "Way 2 — C and mmap. Open <code>/dev/mem</code> read-write with <code>O_SYNC</code>. mmap the RP1 page once. Then write bit 17 into SET and CLEAR in a loop. You used the kernel once. After that, ordinary stores. Megahertz, with <strong>gaps</strong>. A gap is the OS taking the CPU. The pin stays at the last high or low. RP1 does not keep toggling by itself.",
        "This is memory-mapped I/O, not old x86 IN/OUT ports. mmap here is the same call as OS6, but the page is hardware, not a semaphore you made.",
    ]),
    quiz("no", "Is the probe on header hole 17?",
         "No. GPIO17 is the line. The metal hole is physical pin 11."),
    quiz("yes", "Is the Pi 5 GPIO chip RP1?",
         "Yes. Not BCM from Pi 3/4. Not pin 136."),
    quiz("no", "Are the gaps on the fast wave a crash?",
         "No. Time slices. The process was not Running. The pin froze."),
    "<h2>The same story in C</h2>",
    code("""int fd = open("/dev/mem", O_RDWR | O_SYNC);
volatile uint32_t *gpio = mmap(NULL, 4096, PROT_READ | PROT_WRITE,
                               MAP_SHARED, fd, /* RP1 base */ 0);
for (;;) {
  *set_reg = (1u << 17);  /* high — probe on pin 11 */
  *clr_reg = (1u << 17);  /* low  — chip RP1 */
}""", "volatile: do not delete stores in a loop that looks unused. Bit 17 is GPIO17. You still must use the real RP1 offsets from the lab sheet."),
    paper("Lab 1 · Pi 5",
          "Toggle GPIO17 two ways. Where is the probe? Which chip? Why is the script slower? What are the gaps?",
          [
              "Probe: physical pin 11, not hole 17. Chip: RP1.",
              "Script: fork + exec + syscalls every edge. Hundreds of hertz. Not “bash is interpreted” as the main line.",
              "C: open /dev/mem once, mmap, then stores. Megahertz.",
              "Gaps: the OS took the CPU. Memory-mapped I/O, not x86 ports. Kickoff: do not use /sys/class/gpio.",
          ]),
])

OS8 = "\n".join([
    need('Lab 3 and the network lecture. You need <a href="os1.html">OS1</a> (Blocked, fork).'),
    story([
        "A <strong>socket</strong> is an end of a talk. TCP is a connection. Lost packets are sent again. UDP is a datagram, no connection.",
        "If <strong>you</strong> are the client, you know the host and the port. You connect, write, read, close. You do not bind a famous port.",
        "If <strong>you</strong> write the server, you bind, listen, then loop on accept. accept waits until a client finishes the handshake. It gives you a new file for that client. The original socket keeps listening.",
        "If customers <strong>telnet</strong> in, and each connection should start your program: that is <strong>xinetd</strong>. xinetd already owns the port. It starts your program and gives the open connection as file 0 and 1. Your C only reads 0 and writes 1. If you write socket/bind/accept in <em>this</em> program, you answered the wrong question.",
        "Config: port, path, TCP, nowait, UNLISTED if the name is not in services. Reload with SIGHUP. Test with telnet. Wireshark: SYN, SYN-ACK, ACK.",
        "Lab 3.1: a program prints a file again and again. You edit the file. You send SIGUSR1. The signal is a bell, not the new text. The handler only sets a flag. You open the file in the main loop, not inside the handler.",
        "Lab 3.2: message queue. Empty queue: mq_receive blocks. That process is Blocked, not Ready, not spinning.",
    ]),
    quiz("no", "When xinetd starts SingleHoliday, does SingleHoliday call bind?",
         "No. xinetd already accepted. The program reads 0 and writes 1."),
    quiz("yes", "Is accept used by a server to take a client’s connection?",
         "Yes — if you write the server yourself. Not if xinetd already did it."),
    quiz("no", "Does SIGUSR1 contain the new file text?",
         "No. The file contains the text. The signal says “look again.”"),
    "<h2>The same story in C</h2>",
    code("""int main(void) {
  char buf[256];
  int n = read(0, buf, sizeof buf);
  int log = open("log.txt", O_WRONLY | O_CREAT | O_APPEND, 0666);
  write(log, buf, n);
  close(log);
  return 0;
}""", "xinetd program: no sys/socket.h. stdin is the client. You write a log. Port lives in the xinetd config."),
    code("""volatile sig_atomic_t reload = 0;
void handler(int sig) { reload = 1; }""", "Handler only sets a flag. No fopen, no printf here. Main loop sleeps, checks the flag, then reads the file."),
    paper("SS2020 / SS2025 Task 3 · telnet",
          "Customers telnet to port 6000. Each connection starts SingleHoliday. Which service? Bind? Reload? Test?",
          [
              "Service: xinetd (internet super-daemon).",
              "SingleHoliday does not call socket, bind, listen, or accept.",
              "Reload: SIGHUP / sudo service xinetd reload. That rereads config, it does not rerun your log loop.",
              "Test: telnet ip 6000. Wireshark: SYN, SYN-ACK, ACK, then data.",
          ]),
    paper("SS2024 primes · client vs global server",
          "Send the prime to a host and port. Then let the world telnet in.",
          [
              "Send to a host: you are a TCP client. socket, connect, write. No bind of a well-known port.",
              "World telnets in: xinetd, or bind/listen/accept if the paper did not say super-daemon.",
          ]),
])

OS9 = "\n".join([
    need('Lab 4. Read after <a href="os1.html">OS1</a>–<a href="os8.html">OS8</a>. Windows words for the same shop stories.'),
    story([
        "Linux <code>fork</code> copies the shop. Windows <code>CreateProcess</code> starts a <strong>named program</strong>. The child does not get a copy of the parent’s heap.",
        "<code>CreateThread</code> is two workers in one shop, like pthread. <code>WaitForSingleObject</code> on a process handle is like waitpid. Then CloseHandle.",
        "File mapping and memory mapping on Windows are the same API: CreateFileMapping plus MapViewOfFile. They are quite similar to shm_open plus mmap.",
        "A Windows mutex, semaphore, or event is a kernel object you wait on. Signaled means “ready.” WaitForSingleObject waits for one. WaitForMultipleObjects waits for the first, or for all, depending on bWaitAll. “It always waits for all” is false.",
        "Unnamed objects are for threads in one process. Another process cannot guess them. Named events: Process A CreateEvent(..., \"TriggerSeen\"). Process B OpenEvent with the same string. Lab 4 wants events (“this happened”), not a mutex around the whole pipeline.",
        "Lab 4: three processes. InputOutput sees a trigger on pin 48 and pulses pin 29. Processing does the heavy work. Control is the boss: wait for trigger, tell processing to start, wait until done, tell output to pulse. Clicking another console can boost that window. The scope jitters. That is scheduling, not a broken SetEvent. Same idea as nice on Linux.",
        "GetMessage returns FALSE after WM_QUIT. That is how the GUI loop exits. “After WM_QUIT, GetMessage returns TRUE” is false. The Windows 10 command shell is not an 8-bit MS-DOS environment.",
    ]),
    quiz("no", "Does CreateProcess copy the parent’s heap like fork?",
         "No. New process, named program, new memory. That is closer to fork then exec."),
    quiz("no", "Does WaitForMultipleObjects always wait for all objects?",
         "No. Only when bWaitAll is TRUE. If FALSE, the first signaled object is enough."),
    quiz("yes", "Can a named Windows event wake a thread in another process?",
         "Yes, because of the name (or a duplicated handle). Unnamed cannot."),
    "<h2>The same story in C</h2>",
    code("""HANDLE h = CreateEvent(NULL, FALSE, FALSE, TEXT("TriggerSeen"));
SetEvent(h);                       /* InputOutput: pin 48 arrived */
WaitForSingleObject(h, INFINITE);  /* Control waits */""", "Named event. SetEvent is “this happened.” Wait blocks, it does not spin. Processing uses other names, for example StartCalc and CalcDone."),
    paper("SS2025 · Windows bomb",
          "Linux fork is not available. Start copies of this program.",
          [
              "He wants CreateProcess in a loop, like fork making children.",
              "CreateWindow in one process is the wrong story. Almost zero marks.",
              "New address space, new handles. CloseHandle when you are done.",
          ]),
    paper("Lab 4 · 2026",
          "Three processes, named events, why the scope jitters.",
          [
              "Events: trigger seen, start calc, calc done, do output. Unique string names.",
              "Control loop: wait trigger → start processing → wait done → pulse pin 29.",
              "Hog first: cores full, pulse late. Your pipeline first: cleaner. Click a console: foreground boost. Same idea as Lab 2 nice.",
          ]),
])

def mcq_body():
    n = 0
    parts = [
        '      <p class="need">Click True or False. The explanation opens after you pick. These are the distinct year-paper items, not 146 repeats.</p>',
        '      <nav class="wings" aria-label="Topics">',
    ]
    for i, (title, _lesson, _items) in enumerate(GROUPS, 1):
        parts.append(f'        <a href="#wing-{i}">{esc(title)}</a>')
    parts.append("      </nav>")
    for i, (title, lesson, items) in enumerate(GROUPS, 1):
        parts.append(f'      <h2 id="wing-{i}">{esc(title)}</h2>')
        parts.append(f'      <p class="line-note">Story page: {esc(lesson)}</p>')
        for ans, q, why in items:
            n += 1
            parts.append(tf(n, ans, q, why))
    if n != all_items():
        raise SystemExit(f"MCQ count mismatch: built {n}, bank {all_items()}")
    return "\n".join(parts)


INDEX_BODY = f"""
      <div class="floor">
        <p class="floor-label">Floor 0 · if you never wrote C</p>
        <h2>C stories</h2>
        <div class="grid">
{card("c/c1.html", "C1", "The note for the helper", "You write a note. A builder turns it into a tool the shop can run.")}
{card("c/c2.html", "C2", "Boxes with names", "A box called money. A choice. A repeat.")}
{card("c/c3.html", "C3", "Ask a helper", "You send a job. The helper comes back with an answer.")}
{card("c/c4.html", "C4", "The address on the shelf", "The paper is not the money. Two workers, one shelf.")}
{card("c/c5.html", "C5", "One form", "Several fields on one paper. You carry one form, not four.")}
{card("c/c6.html", "C6", "The toolkit", "If you forget the toolkit, the builder does not know the word lock.")}
        </div>
      </div>

      <div class="floor">
        <p class="floor-label">Floor 1 · OS, after C4</p>
        <h2>Shop stories</h2>
        <div class="grid">
{card("lessons/os0.html", "OS0", "The building and the work", "The shop building vs the work inside. You can read this before C.")}
{card("lessons/os1.html", "OS1", "Copy the whole shop", "Two buildings. Each has its own money box. That is a process. Lab 2 lives here.")}
{card("lessons/os2.html", "OS2", "Two workers, one shop", "Same money box. Both add one. Sometimes one add is lost.")}
{card("lessons/os3.html", "OS3", "One key for the drawer", "The worker who took the key must give it back. Mutex.")}
{card("lessons/os4.html", "OS4", "Twenty violins", "A number on the wall. Not a key. Anyone may take one.")}
{card("lessons/os5.html", "OS5", "Two keys, both wait", "A has key 1. B has key 2. Nobody can move. Banker's lives here.")}
{card("lessons/os6.html", "OS6", "A window both shops can see", "The violin board sits in a shared window.")}
        </div>
      </div>

      <div class="floor">
        <p class="floor-label">Floor 2 · labs on the machine</p>
        <h2>See it on the machine</h2>
        <div class="grid">
{card("lessons/os7.html", "OS7", "GPIO on the Pi", "Pin 11, chip RP1, script vs mmap, gaps on the scope. Lab 1.")}
{card("lessons/os8.html", "OS8", "Telnet and a bell", "xinetd, SIGUSR1, empty queue. Lab 3 and the network paper.")}
{card("lessons/os9.html", "OS9", "Windows events", "CreateProcess, named events, three processes. Lab 4.")}
        </div>
      </div>

      <div class="floor">
        <p class="floor-label">Floor 3 · exam hall</p>
        <h2>Year papers as true or false</h2>
        <div class="grid">
{card("exam/mcq.html", "E1", "True or false · 56 items", "Distinct Y/N from 2018–2025. You try. Then the answer and why.")}
        </div>
      </div>
"""


def main():
    pages = [
        ("c/c2.html", "C2 · Boxes with names", "C2: variables, if, while. Shop story, yes or no, then C.",
         '<a href="../index.html">Map</a> · Floor 0 · C2', "Boxes with names",
         "A box with a name. A choice. A repeat. Then the same story in C.",
         C2, ("c1.html", "← C1"), ("c3.html", "C3 · Ask a helper →"), "C2 · boxes, if, while", "c"),
        ("c/c3.html", "C3 · Ask a helper", "C3: a function returns an answer.",
         '<a href="../index.html">Map</a> · Floor 0 · C3', "Ask a helper",
         "You send a job. The helper comes back with a number.",
         C3, ("c2.html", "← C2"), ("c4.html", "C4 · The address →"), "C3 · functions", "c"),
        ("c/c4.html", "C4 · The address on the shelf", "C4: pointers. The paper is not the money.",
         '<a href="../index.html">Map</a> · Floor 0 · C4', "The address on the shelf",
         "The paper is not the money. Two workers, one shelf. This is the hinge for OS.",
         C4, ("c3.html", "← C3"), ("c5.html", "C5 · One form →"), "C4 · pointers", "c"),
        ("c/c5.html", "C5 · One form", "C5: a struct is one form with several fields.",
         '<a href="../index.html">Map</a> · Floor 0 · C5', "One form",
         "Several fields on one paper. You carry one form, not four.",
         C5, ("c4.html", "← C4"), ("c6.html", "C6 · The toolkit →"), "C5 · struct", "c"),
        ("c/c6.html", "C6 · The toolkit", "C6: includes and -pthread.",
         '<a href="../index.html">Map</a> · Floor 0 · C6', "The toolkit",
         "If you forget the toolkit, the builder does not know the word lock.",
         C6, ("c5.html", "← C5"), ("../lessons/os0.html", "OS0 · The building →"), "C6 · includes", "c"),
        ("lessons/os1.html", "OS1 · Copy the whole shop", "OS1: process, fork, exec, zombie, Lab 2.",
         '<a href="../index.html">Map</a> · Floor 1 · OS1', "Copy the whole shop",
         "Two buildings. Each has its own money box. Then year questions with steps.",
         OS1, ("os0.html", "← OS0"), ("os2.html", "OS2 · Two workers →"), "OS1 · process, fork, Lab 2", "os"),
        ("lessons/os2.html", "OS2 · Two workers, one shop", "OS2: threads share the heap. Lost update.",
         '<a href="../index.html">Map</a> · Floor 1 · OS2', "Two workers, one shop",
         "Same money box. Both add one. Sometimes one add is lost.",
         OS2, ("os1.html", "← OS1"), ("os3.html", "OS3 · One key →"), "OS2 · threads", "os"),
        ("lessons/os3.html", "OS3 · One key for the drawer", "OS3: mutex, owner, critical section.",
         '<a href="../index.html">Map</a> · Floor 1 · OS3', "One key for the drawer",
         "The worker who took the key must give it back.",
         OS3, ("os2.html", "← OS2"), ("os4.html", "OS4 · Twenty violins →"), "OS3 · mutex", "os"),
        ("lessons/os4.html", "OS4 · Twenty violins", "OS4: counting semaphore, pshared, music school.",
         '<a href="../index.html">Map</a> · Floor 1 · OS4', "Twenty violins",
         "A number on the wall. Not a key. Anyone may take one.",
         OS4, ("os3.html", "← OS3"), ("os5.html", "OS5 · Two keys →"), "OS4 · semaphore", "os"),
        ("lessons/os5.html", "OS5 · Two keys, both wait", "OS5: deadlock, four conditions, Banker's vs detection.",
         '<a href="../index.html">Map</a> · Floor 1 · OS5', "Two keys, both wait",
         "A has key 1. B has key 2. Nobody can move.",
         OS5, ("os4.html", "← OS4"), ("os6.html", "OS6 · The window →"), "OS5 · deadlock", "os"),
        ("lessons/os6.html", "OS6 · A window both shops can see", "OS6: shm_open, mmap, MAP_SHARED.",
         '<a href="../index.html">Map</a> · Floor 1 · OS6', "A window both shops can see",
         "The violin board sits in a shared window.",
         OS6, ("os5.html", "← OS5"), ("os7.html", "OS7 · GPIO →"), "OS6 · shared memory", "os"),
        ("lessons/os7.html", "OS7 · GPIO on the Pi", "OS7: Lab 1 GPIO17, pin 11, RP1, mmap vs script.",
         '<a href="../index.html">Map</a> · Floor 2 · OS7', "GPIO on the Pi",
         "Pin 11, chip RP1, script vs mmap, gaps on the scope.",
         OS7, ("os6.html", "← OS6"), ("os8.html", "OS8 · Telnet →"), "OS7 · Lab 1 GPIO", "os"),
        ("lessons/os8.html", "OS8 · Telnet and a bell", "OS8: xinetd, SIGUSR1, message queue, Lab 3.",
         '<a href="../index.html">Map</a> · Floor 2 · OS8', "Telnet and a bell",
         "xinetd owns the port. Your program reads 0 and writes 1.",
         OS8, ("os7.html", "← OS7"), ("os9.html", "OS9 · Windows →"), "OS8 · Lab 3 network", "os"),
        ("lessons/os9.html", "OS9 · Windows events", "OS9: CreateProcess, named events, Lab 4.",
         '<a href="../index.html">Map</a> · Floor 2 · OS9', "Windows events",
         "CreateProcess, named events, three processes. Lab 4.",
         OS9, ("os8.html", "← OS8"), ("../exam/mcq.html", "Exam · True or false →"), "OS9 · Lab 4 Windows", "os"),
    ]
    for args in pages:
        page(*args)

    page(
        "exam/mcq.html",
        "True or false · OS exam hall",
        "56 distinct true-or-false items from HAW OS papers 2018 to 2025. Try first. Then the answer and why.",
        '<a href="../index.html">Map</a> · Floor 3 · E1',
        "True or false",
        "These came back every year: fork, exec, wait, kill, threads, signals, mutex, Windows. Same claim is here once. Click True or False. Then read why.",
        mcq_body(),
        ("../lessons/os9.html", "← OS9"),
        ("../index.html", "Map →"),
        "E1 · 56 distinct true or false, 2018–2025",
        "exam",
    )

    page(
        "index.html",
        "Operating systems · Learn with Mynul",
        "Operating systems from zero. Stories, then C, then practice. No C and no OS needed to start.",
        '<a href="../index.html">Learn with Mynul</a> · Technology',
        "Operating systems",
        "You do not need C. You do not need OS. Each page is a short story, then a yes or no, then a few lines of C. Year papers sit on the same page, with steps. Floor 3 is the distinct true-or-false bank from 2018 to 2025. If you never wrote a program, start at C1.",
        INDEX_BODY,
        None,
        None,
        "Mynul Islam · Hamburg · stories first, then C",
        "map",
    )


if __name__ == "__main__":
    main()
