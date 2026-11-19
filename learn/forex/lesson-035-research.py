"""Lesson 035 synthetic pin-bar research. Python 3 standard library only.
Run python3 lesson-035-research.py. No real-market edge is validated.
"""
import csv,math,random
from pathlib import Path
def geometry(o,h,l,c,pip=.0001):
 if not all(math.isfinite(x) and x>0 for x in (o,h,l,c,pip)) or h<max(o,c) or l>min(o,c):raise ValueError("invalid OHLC")
 b,u,d,r=abs(c-o),h-max(o,c),min(o,c)-l,h-l
 assert math.isclose(b+u+d,r,abs_tol=1e-10)
 bull=r>0 and b/r<=.30+1e-10 and d/r>=.60-1e-10 and u/r<=.15+1e-10
 bear=r>0 and b/r<=.30+1e-10 and u/r>=.60-1e-10 and d/r<=.15+1e-10
 assert not(bull and bear)
 return dict(body_pips=b/pip,upper_pips=u/pip,lower_pips=d/pip,range_pips=r/pip,body_ratio=b/r if r else None,upper_ratio=u/r if r else None,lower_ratio=d/r if r else None,label="bullish_pin_shape" if bull else "bearish_pin_shape" if bear else "neither")
def test():
 def close(a,b):assert math.isclose(a,b,abs_tol=1e-8),(a,b)
 a=geometry(1.084,1.0843,1.080,1.0842)
 assert a["label"]=="bullish_pin_shape"
 for k,v in (("body_pips",2),("upper_pips",1),("lower_pips",40),("range_pips",43)):close(a[k],v)
 b=geometry(150.20,150.85,150.17,150.18,.01)
 assert b["label"]=="bearish_pin_shape"
 for k,v in (("body_pips",2),("upper_pips",65),("lower_pips",1),("range_pips",68)):close(b[k],v)
 assert geometry(1.080,1.085,1.079,1.084)["label"]=="neither"
 z=geometry(1.08,1.08,1.08,1.08)
 assert z["label"]=="neither" and z["body_ratio"] is None
 assert geometry(1.084,1.0843,1.0838,1.0842)["label"]=="neither"
 for bad in ((1.1,1.09,1.08,1.1),(1.1,1.12,1.11,1.1),(float("nan"),1.12,1.08,1.1)):
  try:geometry(*bad)
  except ValueError:pass
  else:raise AssertionError("invalid OHLC accepted")
 p=[1.1,1.102,1.098,1.101];q=[1.1,1.098,1.102,1.101]
 assert (p[0],max(p),min(p),p[-1])==(q[0],max(q),min(q),q[-1])
 assert p.index(max(p))<p.index(min(p)) and q.index(min(q))<q.index(max(q))
 close(5-1.2-.2,3.6)
def main():
 test();rng=random.Random(35035);price=1.085;rows=[]
 for i in range(300):
  o=price;c=round(o+rng.randint(-15,15)*.0001,5)
  u,d=rng.randint(0,16),rng.randint(0,16)
  if i%50==0:c=o;u=d=0
  h=round(max(o,c)+u*.0001,5);l=round(min(o,c)-d*.0001,5)
  rows.append(dict(bar=i,open=o,high=h,low=l,close=c,**geometry(o,h,l,c)))
  price=c
 out=Path(__file__).with_name("lesson-035-synthetic.csv")
 with out.open("w",newline="",encoding="utf-8") as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
 for label in ("bullish_pin_shape","bearish_pin_shape","neither"):print(label,sum(r["label"]==label for r in rows))
 print("All tests passed; 300 synthetic candles, seed 35035. No real-market edge validated.")
if __name__=="__main__":main()
