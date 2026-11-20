import unittest
from concurrent.futures import ThreadPoolExecutor

from concurrency_lab import (
    check_service,
    count_completed_checks,
    count_primes,
    one_process_count,
    ordered_checks,
    pooled_counts,
    service_report,
)


class ConcurrencyLabTests(unittest.TestCase):
    def test_count_boundaries(self):
        self.assertEqual(count_primes(2, 11), 4)
        self.assertEqual(count_primes(11, 11), 0)

    def test_process_returns_a_result_to_the_parent(self):
        self.assertEqual(one_process_count(2, 11), 4)

    def test_pool_matches_sequential_count(self):
        ranges = [(2, 5000), (5000, 10000)]
        counts = pooled_counts(ranges)
        self.assertEqual(counts, [669, 560])
        self.assertEqual(sum(counts), count_primes(2, 10000))

    def test_map_preserves_input_order(self):
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(list(pool.map(str.lower, ["B", "A"])), ["b", "a"])
        self.assertEqual(ordered_checks(["Inventory", "CRM"]), ["healthy", "healthy"])

    def test_future_propagates_worker_error(self):
        with ThreadPoolExecutor(max_workers=1) as pool:
            future = pool.submit(check_service, "Payments")
            with self.assertRaisesRegex(OSError, "service unavailable"):
                future.result()
            self.assertTrue(future.done())

    def test_report_labels_failure_and_keeps_successes(self):
        self.assertEqual(
            service_report(["Inventory", "Payments", "CRM"]),
            {"Inventory": "healthy", "Payments": "service unavailable", "CRM": "healthy"},
        )

    def test_lock_prevents_a_lost_update(self):
        self.assertEqual(count_completed_checks(False), 1)
        self.assertEqual(count_completed_checks(True), 2)


if __name__ == "__main__":
    unittest.main()
