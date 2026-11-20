import asyncio
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import AsyncMock, patch

from checker import check_service, read_plan, run_checks


class CheckPlanTests(unittest.TestCase):
    def test_keeps_good_rows_and_explains_rejections(self):
        path = Path(__file__).with_name("services.csv")
        checks, rejected = read_plan(path)
        self.assertEqual(
            checks,
            [("Customer records", "healthy"), ("Payments", "unavailable"), ("Inventory", "slow")],
        )
        self.assertEqual(
            rejected,
            [
                {"line": 5, "reason": "duplicate service"},
                {"line": 6, "reason": "expected a service and a known scenario"},
            ],
        )

    def test_rejects_a_plan_with_no_valid_rows(self):
        with TemporaryDirectory() as folder:
            path = Path(folder) / "bad.csv"
            path.write_text("service,scenario\nPayments,unknown\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "no valid checks"):
                read_plan(path)


class CheckRunnerTests(unittest.IsolatedAsyncioTestCase):
    async def test_deadline_produces_a_named_timeout(self):
        # The probe yields, so a deadline that has passed cancels it immediately.
        deadline = asyncio.get_running_loop().time() - 1
        self.assertEqual(
            await check_service("Inventory", "slow", deadline),
            {"service": "Inventory", "status": "timed_out"},
        )

    async def test_success_and_expected_failure_both_reach_the_report(self):
        results = await run_checks([("Customers", "healthy"), ("Payments", "unavailable")], 3)
        self.assertEqual(
            results,
            [
                {"service": "Customers", "status": "healthy"},
                {"service": "Payments", "status": "unavailable"},
            ],
        )

    async def test_unexpected_errors_reach_the_caller(self):
        with patch("checker.probe", new=AsyncMock(side_effect=RuntimeError("broken checker"))):
            with self.assertRaisesRegex(RuntimeError, "broken checker"):
                await check_service("Customers", "healthy", asyncio.get_running_loop().time() + 3)

    async def test_checks_can_start_before_any_finishes(self):
        started = set()
        both_started = asyncio.Event()

        async def wait_for_both(scenario):
            started.add(scenario)
            if len(started) == 2:
                both_started.set()
            await both_started.wait()

        with patch("checker.probe", new=wait_for_both):
            results = await run_checks([("Customers", "healthy"), ("Payments", "unavailable")], 3)

        self.assertEqual([result["status"] for result in results], ["healthy", "healthy"])


if __name__ == "__main__":
    unittest.main()
