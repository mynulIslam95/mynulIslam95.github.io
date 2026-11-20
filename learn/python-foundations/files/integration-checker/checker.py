"""Check a simulated customer integration with a shared response deadline."""

import argparse
import asyncio
import csv
import json
import math
import sys
from pathlib import Path

FIELDS = ["service", "scenario"]
SCENARIOS = {"healthy", "unavailable", "slow"}


def read_plan(path):
    """Return valid checks and explain which CSV records were rejected."""
    checks = []
    rejected = []
    seen = set()
    with path.open(encoding="utf-8", newline="") as source:
        reader = csv.DictReader(source, strict=True)
        if reader.fieldnames != FIELDS:
            raise ValueError("expected CSV header: service,scenario")

        for row in reader:
            service = (row["service"] or "").strip()
            scenario = (row["scenario"] or "").strip().lower()
            if None in row or not service or scenario not in SCENARIOS:
                reason = "expected a service and a known scenario"
            elif service.casefold() in seen:
                reason = "duplicate service"
            else:
                seen.add(service.casefold())
                checks.append((service, scenario))
                continue

            rejected.append({"line": reader.line_num, "reason": reason})

    if not checks:
        raise ValueError("no valid checks to run")
    return checks, rejected


async def probe(scenario):
    """Simulate a provider without making a network request."""
    if scenario == "slow":
        await asyncio.sleep(10)
    else:
        await asyncio.sleep(0)
    if scenario == "unavailable":
        raise ConnectionError("provider unreachable")


async def check_service(service, scenario, deadline):
    """Give each expected failure a report row and retain the service name."""
    try:
        async with asyncio.timeout_at(deadline):
            await probe(scenario)
    except TimeoutError:
        status = "timed_out"
    except ConnectionError:
        status = "unavailable"
    else:
        status = "healthy"

    return {"service": service, "status": status}


async def run_checks(checks, budget):
    """Derive one deadline and start the independent checks together."""
    deadline = asyncio.get_running_loop().time() + budget
    return await asyncio.gather(
        *(check_service(service, scenario, deadline) for service, scenario in checks)
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path, help="CSV file listing the services")
    parser.add_argument("--budget", type=float, default=3.0, help="seconds for the service checks")
    args = parser.parse_args()
    if not math.isfinite(args.budget) or args.budget <= 0:
        parser.error("--budget must be a positive finite number")

    try:
        checks, rejected = read_plan(args.plan)
    except (OSError, UnicodeError, ValueError, csv.Error) as error:
        print(f"Could not read check plan: {error}", file=sys.stderr)
        return 2

    results = asyncio.run(run_checks(checks, args.budget))
    print(json.dumps({"checks": results, "rejected": rejected}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
