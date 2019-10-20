def f(max, x):
    m = -(max - 1) / (1000000-10000)
    b = max + 1
    result = m*x+b
    print(result)

# f(100, 10000)
# f(100, 100000)
# f(100, 1000000)

for i in range(10000, 1000000, 10000):
    f(100, i)