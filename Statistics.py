import pandas as pd

df = pd.DataFrame({"x":[12,15,20,22,22,23,24,25,30,32,35]})

print(df.x.mean(), df.x.median(), df.x.mode().tolist())
print(df.x.min(), df.x.max(), df.x.sum(), df.x.count())
print(df.x.var(), df.x.std(), df.x.max()-df.x.min())
print(df.x.quantile(0.25), df.x.quantile(0.75), df.x.quantile(0.75)-df.x.quantile(0.25))
print(df.x.skew(), df.x.kurt())
print(df.x.quantile([.1,.25,.5,.75,.9]))
print(df.x.describe())
