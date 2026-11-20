"""Run with Python 3.11+ as a script."""
import multiprocessing as mp
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
from math import isqrt
from queue import Empty
from threading import Barrier, Lock
from time import sleep


def is_prime(number):
    if number < 2:
        return False
    return all(number % divisor != 0 for divisor in range(2, isqrt(number) + 1))


def count_primes(start, stop):
    return sum(is_prime(number) for number in range(start, stop))


def send_count(start, stop, results):
    # Send a value to the parent because the processes have separate memory.
    results.put(count_primes(start, stop))


def one_process_count(start, stop):
    ctx = mp.get_context("spawn")
    results = ctx.Queue()
    worker = ctx.Process(target=send_count, args=(start, stop, results))
    try:
        worker.start()
        try:
            # Read before joining. The worker may be waiting for space in the pipe.
            result = results.get(timeout=10)
        except Empty as error:
            raise TimeoutError("The worker did not send a result.") from error

        worker.join(timeout=10)
        if worker.exitcode != 0:
            raise RuntimeError(f"Worker did not exit cleanly: {worker.exitcode}")
        return result
    finally:
        if worker.pid is not None and worker.is_alive():
            worker.kill()
            worker.join()
        worker.close()
        results.close()


def pooled_counts(ranges):
    # Reuse two workers and keep the counts in the order the jobs were submitted.
    with ProcessPoolExecutor(max_workers=2, mp_context=mp.get_context("spawn")) as pool:
        futures = [pool.submit(count_primes, start, stop) for start, stop in ranges]
        return [future.result() for future in futures]


def check_service(name):
    sleep(0.02)  # Simulated I/O wait. No network request is made.
    if name == "Payments":
        raise OSError("service unavailable")
    return "healthy"


def ordered_checks(names):
    with ThreadPoolExecutor(max_workers=2) as pool:
        return list(pool.map(check_service, names))


def service_report(names):
    report = {}
    with ThreadPoolExecutor(max_workers=2) as pool:
        jobs = {pool.submit(check_service, name): name for name in names}
        for future in as_completed(jobs):
            name = jobs[future]
            try:
                report[name] = future.result()
            except OSError as error:
                report[name] = str(error)
    return report


def count_completed_checks(protect_update):
    total = 0
    both_have_read = Barrier(2)
    lock = Lock()

    def update():
        nonlocal total
        if protect_update:
            with lock:
                total += 1
        else:
            before = total
            # Force both threads to read 0 before either writes.
            both_have_read.wait(timeout=5)
            total = before + 1

    with ThreadPoolExecutor(max_workers=2) as pool:
        jobs = [pool.submit(update) for _ in range(2)]
        for job in jobs:
            job.result()
    return total


def main():
    ranges = [(2, 5000), (5000, 10000)]
    print("Sequential:", count_primes(2, 10000))
    print("One process:", one_process_count(2, 10000))
    counts = pooled_counts(ranges)
    print("Process pool:", counts, "Total:", sum(counts))
    print("Ordered:", ordered_checks(["Inventory", "CRM"]))
    for name, status in sorted(service_report(["Inventory", "Payments", "CRM"]).items()):
        print(f"{name}: {status}")
    print("Counter without lock:", count_completed_checks(False))
    print("Counter with lock:", count_completed_checks(True))


if __name__ == "__main__":
    main()
