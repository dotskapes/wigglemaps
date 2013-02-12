from os import listdir
from sys import argv

import re

def base_path (path):
    return re.sub ('/[^/]*$', '', path);

def include (base, buffer):
    items = re.findall ('//\s*#include\s+([\'\"])([^\n]+)(\\1)\r?\n', buffer);
    files = map (lambda x: x[1], items)
    buffers =  re.split ('//\s*#include\s+[\'\"][^\r\n]+[\'\"]\r?\n', buffer);

    results = []
    for buf, filename in zip (buffers, files):
        path = base + '/' + filename
        data = include (base_path (path),  open (path, 'r').read ())
        #buffer = re.sub (item[0], data, buffer)
        results.append (buf)
        results.append (data)
    results.append (buffers[len(buffers) - 1])
    return ''.join (results)

if __name__ == '__main__':
    if len (argv) != 3: 
        print 'Usage: python compile.py <input> <output>'
    input = open (argv[1], 'r')
    #base = base_path (argv[1]);
    base = '.'
    buffer = input.read ()
    buffer = include (base, buffer)
    output = open (argv[2], 'w')
    output.write (buffer)
    
