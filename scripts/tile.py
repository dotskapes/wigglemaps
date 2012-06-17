from sys import argv
from os import mkdir
import Image
import re

cols = int (argv[2])
rows = int (argv[3])

im = Image.open (argv[1])
pixels = list (im.getdata ())

xsize = int (im.size[0] / cols)
ysize = int (im.size[1] / rows)

tiles = []
for i in range (0, cols):
    tiles.append ([])
    for j in range (0, rows):
        data = []
        for k in range (0, xsize * ysize):
            data.append (None)
        tiles[i].append (data)

for i in range (0, im.size[0]):
    for j in range (0, im.size[1]):
        px = pixels[j * im.size[0] + i]
        c = int (i / xsize)
        r = int (j / ysize)
        index = (j - r * ysize) * xsize + (i - c * xsize) 
        tiles[c][(rows - 1) - r][index] = px
base = re.sub ('\.\w+$', '', argv[1])
mkdir (base)
for i in range (0, cols):
    for j in range (0, rows):
        tile = Image.new ("RGBA", (xsize, ysize))
        tile.putdata (tiles[i][j])
        tile.save (base + '/' + str (i) + '_' + str (j) + '.png') 
