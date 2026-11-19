"""Lesson 034: deterministic synthetic OHLC inside/outside research.
Run: python3 lesson-034-research.py. Standard library only.
NOT real FX quotes, broker execution or evidence of profitability.
"""
import csv,math,random
from pathlib import Path
PIP=.0001
def valid(b):
 o,h,l,c=b
 if not all(math.isfinite(x) and x>0 for x in b) or h<max(o,c) or l>min(o,c):raise ValueError("invalid OHLC")
def classify(a,b):
 valid(a);valid(b)
 h1,l1=a[1:3];h2,l2=b[1:3]
 inside=h2<=h1 and l2>=l1 and (h2<h1 or l2>l1)
 outside=h2>=h1 and l2<=l1 and (h2>h1 or l2<l1)
 assert not (inside and outside)
 return "inside" if inside else "outside" if outside else "neither"
def range_stats(a,b):
 valid(a);valid(b)
 r1=(a[1]-a[2])/PIP;r2=(b[1]-b[2])/PIP
 return r1,r2,(r2/r1-1)*100 if r1 else None
def test():
 a=(1.085,1.088,1.082,1.087);b=(1.086,1.087,1.0835,1.084)
 assert classify(a,b)=="inside"
 x,y,z=range_stats(a,b)
 assert math.isclose(x,60,abs_tol=1e-8) and math.isclose(y,35,abs_tol=1e-8) and math.isclose(z,-41.6666666667,abs_tol=1e-7)
 assert classify((1.084,1.087,1.083,1.086),(1.084,1.089,1.081,1.088))=="outside"
 assert classify(a,(1.086,1.089,1.083,1.088))=="neither"
 assert classify(a,a)=="neither"
 assert classify(a,(1.085,1.088,1.083,1.087))=="inside"
 assert classify(a,(1.085,1.089,1.082,1.087))=="outside"
 z=(1.085,)*4
 assert range_stats(z,z)[2] is None
 for bad in ((1.1,1.09,1.08,1.1),(1.1,1.12,1.11,1.1),(float("nan"),1.12,1.08,1.1)):
  try:classify(bad,a)
  except ValueError:pass
  else:raise AssertionError("invalid OHLC accepted")
 p=[1.1,1.102,1.098,1.101];q=[1.1,1.098,1.102,1.101]
 assert (p[0],max(p),min(p),p[-1])==(q[0],max(q),min(q),q[-1])
 assert p.index(max(p))<p.index(min(p)) and q.index(min(q))<q.index(max(q))
 assert math.isclose(5-1.2-.2,3.6)
def main():
 test();rng=random.Random(34034);price=1.085;bars=[]
 for i in range(250):
  o=price;c=round(o+rng.randint(-15,15)*PIP,5)
  u,d=rng.randint(0,14),rng.randint(0,14)
  if i%50==0:c=o;u=d=0
  h=round(max(o,c)+u*PIP,5);l=round(min(o,c)-d*PIP,5)
  b=(o,h,l,c);valid(b);bars.append(b);price=c
 rows=[]
 for i,b in enumerate(bars):
  label=classify(bars[i-1],b) if i else "first_bar"
  prev,current,change=range_stats(bars[i-1],b) if i else (None,(b[1]-b[2])/PIP,None)
  rows.append(dict(index=i,open=b[0],high=b[1],low=b[2],close=b[3],classification=label,previous_range_pips=prev,current_range_pips=current,relative_range_change_pct=change))
 out=Path(__file__).with_name("lesson-034-synthetic.csv")
 with out.open("w",newline="",encoding="utf-8") as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
 for label in ("inside","outside","neither"):print(label,sum(r["classification"]==label for r in rows))
 print("All tests passed. 250 SYNTHETIC bars, seed=34034. No trading edge validated.")
if __name__=="__main__":main()
