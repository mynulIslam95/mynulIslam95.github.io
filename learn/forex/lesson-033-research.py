"""Lesson 033 reproducible synthetic FX pattern lab. Python 3 standard library.
Run: python3 lesson-033-research.py. No historical quotes or validated trading edge.
"""
import csv,math,random
from pathlib import Path
PIP=.0001
def features(o,h,l,c):
    if not all(math.isfinite(x) and x>0 for x in (o,h,l,c)) or h<max(o,c) or l>min(o,c): raise ValueError("invalid OHLC")
    b,u,d,r=abs(c-o),h-max(o,c),min(o,c)-l,h-l
    assert math.isclose(b+u+d,r,abs_tol=1e-10)
    return dict(body_pips=b/PIP,upper_pips=u/PIP,lower_pips=d/PIP,range_pips=r/PIP,
      strict_doji=o==c,near_doji=r>0 and b/r<=.10+1e-10,
      hammer_shape=r>0 and b/r<=.35+1e-10 and d>=2*b-1e-10 and u/r<=.15+1e-10 and (b>0 or d/r>=.5),
      shooting_star_shape=r>0 and b/r<=.35+1e-10 and u>=2*b-1e-10 and d/r<=.15+1e-10 and (b>0 or u/r>=.5))
def engulfing(a,b):
    o1,c1=a[0],a[3];o2,c2=b[0],b[3]
    return (c1<o1 and c2>o2 and o2<=c1 and c2>=o1 and (o2<c1 or c2>o1),
            c1>o1 and c2<o2 and o2>=c1 and c2<=o1 and (o2>c1 or c2<o1))
def test():
    assert features(1.085,1.087,1.083,1.0852)["near_doji"]
    assert not features(1.085,1.087,1.083,1.0852)["strict_doji"]
    assert features(1.0845,1.0847,1.081,1.084)["hammer_shape"]
    assert features(1.082,1.086,1.0818,1.0825)["shooting_star_shape"]
    assert not features(1.0845,1.0847,1.081,1.0812)["hammer_shape"]
    z=features(1.08,1.08,1.08,1.08)
    assert not z["near_doji"] and not z["hammer_shape"] and not z["shooting_star_shape"]
    assert engulfing((1.086,1.087,1.0835,1.084),(1.0835,1.087,1.083,1.0865))==(True,False)
    assert engulfing((1.084,1.087,1.083,1.086),(1.0865,1.087,1.083,1.0835))==(False,True)
    for a in ((1.1,1.09,1.08,1.1),(1.1,1.12,1.11,1.1),(float("nan"),1.1,1.,1.05)):
        try: features(*a)
        except ValueError: pass
        else: raise AssertionError("invalid candle accepted")
    p=[1.1,1.102,1.098,1.101];q=[1.1,1.098,1.102,1.101]
    assert (p[0],max(p),min(p),p[-1])==(q[0],max(q),min(q),q[-1])
    assert p.index(max(p))<p.index(min(p)) and q.index(min(q))<q.index(max(q))
    assert math.isclose(5-1.2-.2,3.6)
def main():
    test();rng=random.Random(33033);price=1.085;bars=[]
    for i in range(300):
        o=price;c=round(o+rng.randint(-16,16)*PIP,5)
        up,down=rng.randint(0,18),rng.randint(0,18)
        if i%50==0:c,up,down=o,0,0
        h=round(max(o,c)+up*PIP,5);l=round(min(o,c)-down*PIP,5)
        bars.append((o,h,l,c));price=c
    rows=[]
    for i,(o,h,l,c) in enumerate(bars):
        bull,bear=engulfing(bars[i-1],bars[i]) if i else (False,False)
        rows.append(dict(bar=i,open=o,high=h,low=l,close=c,**features(o,h,l,c),bullish_engulfing=bull,bearish_engulfing=bear))
    out=Path(__file__).with_name("lesson-033-synthetic.csv")
    with out.open("w",newline="",encoding="utf-8") as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    for name in ("near_doji","hammer_shape","shooting_star_shape","bullish_engulfing","bearish_engulfing"):
        print(name,sum(bool(r[name]) for r in rows))
    print("Tests passed; 300 SYNTHETIC candles, seed 33033. Not evidence of trading profitability.")
if __name__=="__main__":main()
