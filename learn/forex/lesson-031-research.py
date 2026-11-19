"""Lesson 031: deterministic synthetic EUR/USD candles, validation and executable-cost test.
Standard library only. NOT historical quotes or a profitable trading strategy.
Run: python3 lesson-031-research.py
"""
import csv
import math
import random
import statistics
from pathlib import Path

PIP = 0.0001
RNG = random.Random(31031)
OUT = Path(__file__).with_name("lesson-031-synthetic.csv")

def candle(o, h, l, c):
    assert all(math.isfinite(x) and x > 0 for x in (o, h, l, c))
    assert h >= max(o, c) and l <= min(o, c)
    body = abs(c-o)
    upper = h-max(o,c)
    lower = min(o,c)-l
    span = h-l
    assert math.isclose(body+upper+lower, span, abs_tol=1e-12)
    return {"direction": "bullish" if c > o else "bearish" if c < o else "neutral",
            "body_pips": body/PIP, "upper_pips": upper/PIP,
            "lower_pips": lower/PIP, "range_pips": span/PIP,
            "body_ratio": body/span if span else None}

def generate(n=300):
    """Synthetic midpoint candles, deterministic pseudo-random walk; NOT market data."""
    price = 1.08000
    rows = []
    for i in range(n):
        o = price
        move = RNG.randint(-20, 20) * PIP
        c = round(o + move, 5)
        h = round(max(o,c) + RNG.randint(0,12)*PIP, 5)
        l = round(min(o,c) - RNG.randint(0,12)*PIP, 5)
        spread_pips = RNG.choice([0.8, 1.2, 2.0, 4.0])
        info = candle(o,h,l,c)
        rows.append(dict(bar=i, open=o, high=h, low=l, close=c,
                         spread_pips=spread_pips, **info))
        price = c
    return rows

def backtest(rows, cost_pips=0.2):
    """Toy next-bar LONG: bullish prior bar with body/range >= 0.6.
    Signal available only after bar close. Entry at next bar OPEN ASK,
    exit at next bar CLOSE BID; fixed half-spread each side + commission.
    Same synthetic spread applied to both boundaries of the next bar.
    No slippage, financing, gaps, rejections or order-book constraints.
    """
    trades=[]
    for i in range(1,len(rows)):
        prev, current=rows[i-1],rows[i]
        if prev["direction"]!="bullish" or (prev["body_ratio"] or 0)<0.6:
            continue
        half=current["spread_pips"]*PIP/2
        entry_ask=current["open"]+half
        exit_bid=current["close"]-half
        gross_mid=(current["close"]-current["open"])/PIP
        net=(exit_bid-entry_ask)/PIP-cost_pips
        trades.append((i, gross_mid, net))
    return trades

def main():
    rows=generate()
    with OUT.open("w", newline="", encoding="utf-8") as f:
        writer=csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    assert len(rows)==300
    assert candle(1.0800,1.0830,1.0790,1.0820)["body_pips"] == 20
    assert candle(1.0850,1.0860,1.0810,1.0820)["direction"]=="bearish"
    assert candle(1.0800,1.0800,1.0800,1.0800)["body_ratio"] is None
    try:
        candle(1.0800,1.0790,1.0780,1.0810)
        raise AssertionError("Invalid candle was accepted")
    except AssertionError as e:
        assert str(e)!="Invalid candle was accepted"
    # Cost check: 1.2-pip spread + 0.2-pip commission = 1.4-pip drag.
    fake=[dict(open=1.08, close=1.081, spread_pips=1.2),
          dict(open=1.081, close=1.082, spread_pips=1.2)]
    fake[0].update(direction="bullish",body_ratio=1)
    trade=backtest(fake)[0]
    assert math.isclose(trade[1]-trade[2],1.4,abs_tol=1e-8)
    split=int(len(rows)*0.7)
    # Chronological holdout: signal uses only the previous bar.
    train=backtest(rows[:split])
    holdout=backtest(rows[split-1:]) # include one preceding bar for boundary signal
    def report(name, trades):
        vals=[t[2] for t in trades]
        print(f"{name}: trades={len(vals)}, mean net pips={statistics.mean(vals):.3f}" if vals else f"{name}: no trades")
    report("Development (synthetic)",train)
    report("Holdout (synthetic)",holdout)
    print("All OHLC/unit/invalid-data/cost tests passed.")
    print(f"CSV: {OUT.name}; 300 synthetic bars, seed=31031.")
    print("This toy study cannot validate a real-world FX trading edge.")
if __name__=="__main__":
    main()
