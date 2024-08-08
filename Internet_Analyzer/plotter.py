import matplotlib.pyplot as plt

y = [0]
with open('log.txt') as speeds:
    counter = 0
    for line in speeds:
        information = line.split(',')
        speed = information[1].split(' ')[1]
        y.append(float(speed))

fig, ax = plt.subplots()

ax.plot(y)

ax.set(xlabel='Iteration', ylabel='Speed(MBps)',
        title='Internet Speed')
ax.grid()

fig.savefig('speed_graph.png')
