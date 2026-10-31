"""CSV transaction report. Run: python tracker.py transactions.csv --opening 100.00"""
import argparse
import csv
import json
from decimal import Decimal, InvalidOperation
from pathlib import Path


def money_to_cents(raw: str, allow_zero: bool = False) -> int:
    text = raw.strip()
    if not text or len(text) > 30:
        raise ValueError("Invalid amount length")
    try:
        value = Decimal(text)
    except InvalidOperation as error:
        raise ValueError("Invalid decimal amount") from error
    if not value.is_finite() or value < 0 or value > Decimal("1000000"):
        raise ValueError("Amount outside allowed range")
    if value == 0 and not allow_zero:
        raise ValueError("Transaction amount must be positive")
    cents = value * 100
    if cents != cents.to_integral_value():
        raise ValueError("Fractional cents are not allowed")
    return int(cents)


def summarize_rows(rows, opening_cents: int) -> dict:
    if opening_cents < 0:
        raise ValueError("Opening balance cannot be negative")
    spent = 0
    received = 0
    accepted = 0
    seen = set()
    rejected = []
    for line, row in enumerate(rows, start=2):
        try:
            transaction_id = (row.get("id") or "").strip()
            kind = (row.get("kind") or "").strip().casefold()
            if not transaction_id or kind not in {"debit", "credit"}:
                raise ValueError("ID and debit/credit kind required")
            amount = money_to_cents(row.get("amount") or "")
            if transaction_id in seen:
                raise ValueError("Duplicate transaction ID")
        except ValueError as error:
            rejected.append({"row": line, "reason": str(error)})
            continue
        seen.add(transaction_id)
        accepted += 1
        if kind == "debit":
            spent += amount
        else:
            received += amount
    return {
        "currency": "EUR",
        "accepted": accepted,
        "spent_cents": spent,
        "received_cents": received,
        "balance_cents": opening_cents - spent + received,
        "rejected": rejected,
    }


def load_report(path: Path, opening_cents: int) -> dict:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"id", "kind", "amount"}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError("CSV headers must include id, kind, amount")
        return summarize_rows(reader, opening_cents)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a transaction report")
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--opening", default="0.00")
    args = parser.parse_args()
    try:
        report = load_report(args.csv_path, money_to_cents(args.opening, allow_zero=True))
    except (OSError, UnicodeError, csv.Error, ValueError) as error:
        parser.exit(2, f"Import failed: {error}\n")
    print(json.dumps(report, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
