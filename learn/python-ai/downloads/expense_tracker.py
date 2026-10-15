"""Learning project: python expense_tracker.py add 3.50 coffee

python expense_tracker.py list
Stores expenses.json alongside this script. Uses integer cents for money.
"""
import argparse
import json
from decimal import Decimal, InvalidOperation
from pathlib import Path

DATA = Path(__file__).with_name('expenses.json')


def to_cents(text):
    """Reject invalid, negative or sub-cent amounts instead of silently rounding."""
    try:
        value = Decimal(text)
    except InvalidOperation as error:
        raise ValueError('Enter a number such as 3.50.') from error
    if not value.is_finite() or value <= 0:
        raise ValueError('Amount must be finite and positive.')
    cents = value * 100
    if cents != cents.to_integral_value():
        raise ValueError('Use no more than two decimal places.')
    return int(cents)


def load(path=DATA):
    if not path.exists():
        return []
    # Malformed data is reported, never silently replaced with an empty file.
    rows = json.loads(path.read_text(encoding='utf-8'))
    if not isinstance(rows, list) or any(
        not isinstance(row, dict)
        or type(row.get('cents')) is not int
        or row['cents'] <= 0
        or not isinstance(row.get('category'), str)
        for row in rows
    ):
        raise ValueError('Unexpected expense file structure.')
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    add = sub.add_parser('add')
    add.add_argument('amount')
    add.add_argument('category')
    sub.add_parser('list')
    args = parser.parse_args()
    try:
        rows = load()
        if args.command == 'add':
            category = args.category.strip()
            if not category:
                raise ValueError('Category cannot be empty.')
            rows.append({'cents': to_cents(args.amount), 'category': category})
            DATA.write_text(json.dumps(rows, indent=2), encoding='utf-8')
            print('Expense saved.')
        else:
            for row in rows:
                print(f"{row['category']}: {Decimal(row['cents']) / 100:.2f} EUR")
            total = sum(row['cents'] for row in rows)
            print(f'Total: {Decimal(total) / 100:.2f} EUR')
    except (ValueError, OSError) as error:
        parser.exit(1, f'Error: {error}\n')


if __name__ == '__main__':
    main()
