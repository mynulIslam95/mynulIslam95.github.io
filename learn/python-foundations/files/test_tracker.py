import csv
from io import StringIO

import pytest

from tracker import load_report, money_to_cents, summarize_rows


def test_report_separates_spending_and_credits():
    rows = csv.DictReader(StringIO("id,kind,amount\nT1,debit,12.50\nT2,debit,7.25\nT3,credit,20.00\n"))
    report = summarize_rows(rows, 10000)
    assert report["spent_cents"] == 1975
    assert report["received_cents"] == 2000
    assert report["balance_cents"] == 10025


def test_bad_and_duplicate_rows_are_reported():
    rows = [
        {"id": "A", "kind": "debit", "amount": "1.00"},
        {"id": "A", "kind": "debit", "amount": "1.00"},
        {"id": "B", "kind": "debit", "amount": "NaN"},
    ]
    report = summarize_rows(rows, 0)
    assert report["accepted"] == 1
    assert report["spent_cents"] == 100
    assert [item["row"] for item in report["rejected"]] == [3, 4]


@pytest.mark.parametrize("raw", ["", "NaN", "Infinity", "-1", "1.001", "1000001", "oops"])
def test_invalid_amount(raw):
    with pytest.raises(ValueError):
        money_to_cents(raw)


def test_zero_opening_and_empty_report():
    assert money_to_cents("0", allow_zero=True) == 0
    assert summarize_rows([], 500)["balance_cents"] == 500
    with pytest.raises(ValueError):
        money_to_cents("0")


def test_load_and_missing_headers(tmp_path):
    path = tmp_path / "transactions.csv"
    path.write_text("id,kind,amount\nT1,debit,1.00\n", encoding="utf-8")
    assert load_report(path, 200)["balance_cents"] == 100
    path.write_text("id,amount\nT1,1.00\n", encoding="utf-8")
    with pytest.raises(ValueError, match="headers"):
        load_report(path, 0)
