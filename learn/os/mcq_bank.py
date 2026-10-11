"""Distinct true/false items from HAW OS papers 2018–2025.

Each item is (answer, statement, explanation).
answer is 'yes' for True, 'no' for False.
Wording is cleaned IELTS 6. Same claim is not repeated.
"""

GROUPS = [
    (
        "Process, fork, exec, wait, kill",
        "OS1",
        [
            (
                "no",
                "<code>fork()</code> gives every new process the ID of its parent.",
                "No. The child gets 0. The parent gets the child’s PID. The child reads its parent with <code>getppid()</code>.",
            ),
            (
                "no",
                "<code>fork()</code> returns the ID of the new child. That is the whole truth.",
                "No. Only the parent sees the child’s PID. The child sees 0. If <code>fork()</code> fails, the parent sees −1. The bare sentence is false.",
            ),
            (
                "no",
                "After <code>fork()</code>, parent and child can read each other’s heap.",
                "No. Each building has its own money box. The child gets a copy. A write in one heap does not show in the other. That is the point of a process versus a thread.",
            ),
            (
                "yes",
                "A child process never has two parents at the same time.",
                "Yes. One parent. If that parent dies, <code>init</code> may adopt the child. Still one parent.",
            ),
            (
                "no",
                "A parent may have only one child.",
                "No. <code>fork()</code> as often as the limit allows. Two <code>fork()</code> calls in a row already make more than one child.",
            ),
            (
                "no",
                "Two <code>fork()</code> calls in a row can make a process its own grandfather.",
                "No. <code>fork()</code> only makes children. It never points back up. You get a tree, not a loop.",
            ),
            (
                "no",
                "<code>exec()</code> starts an extra process next to the caller.",
                "No. <code>exec()</code> replaces the program in the same process. Same PID. No new building. <code>fork()</code> is the one that copies the shop.",
            ),
            (
                "yes",
                "If a parent calls <code>wait()</code> or <code>waitpid()</code> on its children, those children do not stay zombies.",
                "Yes. A zombie is an exited child whose exit code nobody collected. <code>waitpid()</code> collects it and the table entry goes away.",
            ),
            (
                "no",
                "To avoid becoming a zombie, a process should call <code>waitpid()</code> before it itself ends.",
                "No. The zombie is the dead child, not you. Your parent must wait for you. You wait for your own children.",
            ),
            (
                "no",
                "<code>kill()</code> always sends SIGUSR1.",
                "No. You pass the signal as an argument. The usual terminate signal is SIGTERM. SIGUSR1 is only one choice.",
            ),
            (
                "no",
                "<code>kill()</code> can never end your own parent.",
                "No. <code>kill(getppid(), SIGKILL)</code> is allowed if you have the right. There is no magic shield on the parent.",
            ),
            (
                "no",
                "<code>kill()</code> can only terminate a process.",
                "No. It sends a signal. That signal may stop, continue, or run a handler. Death is only the famous case.",
            ),
            (
                "yes",
                "A normal global variable cannot tell you, after <code>fork()</code>, whether you are parent or child.",
                "Yes. The global is copied as the same number in both shops. The return value of <code>fork()</code> is what differs: child PID versus 0.",
            ),
            (
                "no",
                "After <code>fork()</code> there is no variable at all that can tell parent from child.",
                "No. The return value of <code>fork()</code> is that variable. <code>if (fork() == 0)</code> is the child.",
            ),
        ],
    ),
    (
        "Threads and the CPU",
        "OS2",
        [
            (
                "no",
                "The OS protects one thread’s address space from every other thread.",
                "No. Threads of one process share the same address space. Isolation is per process, not per thread.",
            ),
            (
                "no",
                "Multithreading is useless on a machine with only one CPU.",
                "No. While one thread waits for the disk, another thread can use the core. Overlap still helps.",
            ),
            (
                "yes",
                "On a 4-core CPU, at most 4 threads can be in the RUNNING state at once.",
                "Yes. RUNNING means “on a core right now.” Extra threads are READY, waiting for a core.",
            ),
            (
                "no",
                "The OS may suspend one thread to free main memory.",
                "No. Swap for memory is a whole-process job. One thread still sits in the same address space as its siblings.",
            ),
        ],
    ),
    (
        "Signals and timers",
        "OS8",
        [
            (
                "yes",
                "A program may register a handler for SIGUSR2.",
                "Yes. SIGUSR1 and SIGUSR2 are for you. SIGKILL is the one you cannot catch.",
            ),
            (
                "yes",
                "After a <code>signal()</code> handler finishes, the program continues where it was interrupted.",
                "Yes. That is the point of a handler. A blocking call may then return EINTR, but you do not jump to <code>main()</code>.",
            ),
            (
                "no",
                "After a <code>signal()</code> handler finishes, the program continues at the start of <code>main()</code>.",
                "No. That would restart the whole program. Control goes back to the interrupted instruction.",
            ),
            (
                "no",
                "Linux delivers ordinary signals in FIFO order.",
                "No. Ordinary signals do not even queue a second copy of the same signal. There is no FIFO promise.",
            ),
            (
                "no",
                "A Linux timer can only wake you with a signal. It cannot start a thread.",
                "No. POSIX <code>timer_create</code> can fire a signal, or it can start a callback thread (SIGEV_THREAD).",
            ),
            (
                "no",
                "Linux timers always start a new thread.",
                "No. Often they only send a signal. A new thread is optional, not the default story.",
            ),
        ],
    ),
    (
        "Locks, deadlock, watchdog",
        "OS3 / OS5",
        [
            (
                "no",
                "Mutexes avoid deadlocks among threads.",
                "No. A mutex stops a race on one key. Two threads can still each hold one key and wait for the other. That is deadlock.",
            ),
            (
                "no",
                "A watchdog program prevents deadlocks.",
                "No. A watchdog notices a stall after it has already happened. The deadlock still occurred.",
            ),
            (
                "yes",
                "A watchdog should be a separate process from the thing it watches.",
                "Yes. If it lives in the same process, the same crash can kill the watcher too.",
            ),
            (
                "yes",
                "A semaphore can count something.",
                "Yes. A counting semaphore is a number: how many violins are still free.",
            ),
            (
                "no",
                "Shared memory is a synchronisation tool.",
                "No. It is a window both shops can see. It does not take turns. You still need a mutex or a semaphore beside it.",
            ),
        ],
    ),
    (
        "Pipes, files, network words",
        "OS1 / OS8",
        [
            (
                "yes",
                "Bytes in a pipe come out in FIFO order. You cannot reorder them.",
                "Yes. A pipe is a kernel queue. First byte in is first byte out.",
            ),
            (
                "yes",
                "<code>accept()</code> is how a server takes a client’s connection.",
                "Yes. The listening socket stays. <code>accept()</code> returns a new socket for that one client.",
            ),
            (
                "no",
                "File bits <code>d-r-r----</code> mean a directory full of runnable programs.",
                "No. <code>d</code> is a directory, but there is no <code>x</code>, so you cannot even enter it. Whether files inside can run is their own bits, not these.",
            ),
            (
                "yes",
                "UNIX treats many things as a file.",
                "Yes. Disk files, devices, pipes, sockets: open, read, write, close.",
            ),
            (
                "yes",
                "If an IP packet is lost, a higher layer can still repair the loss.",
                "Yes. IP does not retry. TCP above it can ACK and send again.",
            ),
        ],
    ),
    (
        "Hardware, cache, time",
        "OS0",
        [
            (
                "yes",
                "DMA reduces how much work the CPU must do for a copy.",
                "Yes. The device writes memory itself. The CPU is free for other work during the transfer.",
            ),
            (
                "no",
                "The user program controls the switch from kernel mode back to user mode.",
                "No. The kernel and the hardware do that (return from trap or interrupt). User code cannot promote itself.",
            ),
            (
                "yes",
                "Virtual memory lets a process use more memory than the machine physically has.",
                "Yes. Unused pages sit on disk. That is paging.",
            ),
            (
                "no",
                "A good cache should use the smallest possible block size.",
                "No. Tiny blocks miss more often. Block size is a trade, not “as small as you can”.",
            ),
            (
                "no",
                "Caching always makes the system slower.",
                "No. A cache is there to make the average case faster. It only hurts in rare bad patterns.",
            ),
            (
                "no",
                "A timer event executes a trap.",
                "No. A timer is an interrupt from outside, asynchronous. A trap is a synchronous event from the running instruction, like a syscall.",
            ),
            (
                "no",
                "Blocking system calls belong inside interrupt handlers.",
                "No. A handler must finish fast. Blocking there can freeze the machine. Blocking waits belong in process context.",
            ),
        ],
    ),
    (
        "Windows",
        "OS9",
        [
            (
                "no",
                "<code>WaitForMultipleObjects()</code> always waits until every object is signalled.",
                "No. Only if you pass “wait for all”. Otherwise it returns when any one object is signalled.",
            ),
            (
                "yes",
                "Windows 10 window handling is event-driven.",
                "Yes. <code>GetMessage</code> / <code>DispatchMessage</code>. The window procedure runs when a message arrives.",
            ),
            (
                "no",
                "The Windows 10 shell is an 8-bit MS-DOS environment.",
                "No. <code>cmd.exe</code> is a normal Win32 program. DOS is only old compatibility.",
            ),
            (
                "no",
                "The window callback runs again and again inside the main message loop, as the loop body.",
                "No. The loop runs again and again. For each message it calls the window procedure once, then comes back.",
            ),
            (
                "no",
                "After WM_QUIT, <code>GetMessage()</code> returns TRUE.",
                "No. It returns 0. That is how <code>while (GetMessage(...))</code> stops.",
            ),
            (
                "yes",
                "A Windows mutex is a synchronisation object.",
                "Yes. <code>CreateMutex</code> gives a waitable kernel handle. That is not the same as “mutexes stop deadlock”.",
            ),
            (
                "no",
                "Unnamed Windows sync objects are how two processes wait on each other.",
                "No. With no name, the other process cannot find the handle. Unnamed is for threads in one process, unless you duplicate the handle.",
            ),
            (
                "yes",
                "A Windows event can synchronise threads that live in different processes.",
                "Yes. Give the event a name, or duplicate the handle. Then both processes wait on the same kernel object.",
            ),
            (
                "yes",
                "In Windows, file mapping and memory mapping are almost the same call path.",
                "Yes. Both use <code>CreateFileMapping</code> and <code>MapViewOfFile</code>. Only the backing store differs.",
            ),
        ],
    ),
    (
        "What an OS is",
        "OS0 / OS1",
        [
            (
                "yes",
                "A microkernel often pays extra context switches, so it can be slower.",
                "Yes. Drivers and servers sit in user space. Each ask is an extra IPC hop.",
            ),
            (
                "no",
                "Concurrent jobs always run at the same instant.",
                "No. Concurrent means their lives overlap. On one core they take turns. Parallel means same instant.",
            ),
            (
                "yes",
                "A process is an instance of a running program.",
                "Yes. The file on disk is the program. The running copy with its own memory is the process.",
            ),
            (
                "yes",
                "The stack stores parameters and return addresses.",
                "Yes. Each call pushes a frame: where to return, and the arguments.",
            ),
            (
                "no",
                "The stack is part of the PCB.",
                "No. The PCB is the kernel’s card about the process. It may hold a pointer to the stack. The stack itself lives in the process memory.",
            ),
            (
                "no",
                "A plug-and-play OS boots faster.",
                "No. Plug-and-play spends time finding and setting devices. It is convenience, not a shorter boot.",
            ),
        ],
    ),
]


def all_items():
    n = 0
    for title, lesson, items in GROUPS:
        n += len(items)
    return n
