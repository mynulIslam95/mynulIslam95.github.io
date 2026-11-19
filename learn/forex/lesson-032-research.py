"""Lesson 032: deterministic synthetic OHLC research and assertions.
Python 3 standard library only. Run: python3 lesson-032-research.py
NOT live quotes, execution simulation or evidence of trading profitability.
"""
import csv
import math
import random
from pathlib import Path

PIPS = {"EUR/USD": 0.0001, "USD/JPY": 0.01}
SEED = 32032

def geometry(o, h, l, c, pip):
    if not all(math.isfinite(x) and x > 0 for x in (o, h, l, c, pip)):
        raise ValueError("Prices and pip must be positive finite numbers")
    if h < max(o, c) or l > min(o, c):
        raise ValueError("Invalid OHLC ordering")
    body, upper, lower, span = abs(c-o), h-max(o,c), min(o,c)-l, h-l
    assert math.isclose(body+upper+lower, span, abs_tol=1e-10)
    return {"direction": "bullish" if c>o else "bearish" if c<o else "neutral",
            "body_pips":body/pip, "upper_pips":upper/pip,
            "lower_pips":lower/pip, "range_pips":span/pip,
            "body_ratio":body/span if span else None,
            "upper_ratio":upper/span if span else None,
            "lower_ratio":lower/span if span else None}

def synthetic(n=240):
    rng=random.Random(SEED)
    price=1.0840
    rows=[]
    for i in range(n):
        o=price
        move=rng.randint(-18,18)
        if i%40==0: move=0
        c=round(o+move*PIPS["EUR/USD"],5)
        up,down=rng.randint(0,12),rng.randint(0,12)
        if i%40==0: up=down=0
        h=round(max(o,c)+up*PIPS["EUR/USD"],5)
        l=round(min(o,c)-down*PIPS["EUR/USD"],5)
        rows.append({"bar":i,"open":o,"high":h,"low":l,"close":c,
                     **geometry(o,h,l,c,PIPS["EUR/USD"])})
        price=c
    return rows

def test():
    def close(a,b): assert math.isclose(a,b,abs_tol=1e-8),(a,b)
    a=geometry(1.0840,1.0870,1.0825,1.0860,PIPS["EUR/USD"])
    for k,v in [("body_pips",20),("upper_pips",10),("lower_pips",15),("range_pips",45)]:
        close(a[k],v)
    close(a["body_ratio"]+a["upper_ratio"]+a["lower_ratio"],1)
    b=geometry(150.20,150.50,149.80,150.00,PIPS["USD/JPY"])
    for k,v in [("body_pips",20),("upper_pips",30),("lower_pips",20),("range_pips",70)]:
        close(b[k],v)
    z=geometry(1.1,1.1,1.1,1.1,PIPS["EUR/USD"])
    assert z["body_ratio"] is None and z["range_pips"]==0
    neutral=geometry(1.1,1.101,1.099,1.1,PIPS["EUR/USD"])
    assert neutral["direction"]=="neutral" and neutral["range_pips"]>0
    for args in [(1.1,1.09,1.08,1.1),(1.1,1.12,1.11,1.1),(float("nan"),1.1,1.0,1.05)]:
        try: geometry(*args,PIPS["EUR/USD"])
        except ValueError: pass
        else: raise AssertionError("Invalid OHLC accepted")
    path1=[1.1000,1.1020,1.0980,1.1010]
    path2=[1.1000,1.0980,1.1020,1.1010]
    assert (path1[0],max(path1),min(path1),path1[-1])==(path2[0],max(path2),min(path2),path2[-1])
    assert path1.index(max(path1))<path1.index(min(path1))
    assert path2.index(min(path2))<path2.index(max(path2))
    close((1.10002-1.10008)/PIPS["EUR/USD"],-0.6)
    return "Reference, invalid-data, zero-range, intrabar-path and cost tests passed"

def main():
    print(test())
    rows=synthetic()
    assert len(rows)==240
    assert sum(r["range_pips"]==0 for r in rows)>=6
    for r in rows:
        if r["range_pips"]:
            assert math.isclose(r["body_ratio"]+r["upper_ratio"]+r["lower_ratio"],1,abs_tol=1e-10)
    out=Path(__file__).with_name("lesson-032-synthetic.csv")
    with out.open("w",newline="",encoding="utf-8") as f:
        writer=csv.DictWriter(f,fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Generated {len(rows)} synthetic candles: {out.name}; seed {SEED}")
    print("No real FX edge, historical price feed or executable fill is validated.")

if __name__=="__main__":
    main()
