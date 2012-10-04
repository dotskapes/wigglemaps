from os import listdir

manifest = [
    'base',
    'utils/jquery.hotkeys',
    'utils/jquery.mousewheel',
    'webgl-debug',
    'rAF',
    'util',
    'utils/binary',
    'vect',
    'shader-utils',
    'utils/texture',
    'camera',
    'panner',
    'events',
    'engine',
    'buffer',
    'select',
    'trapezoid',
    'range',
    'feature',
    'point',
    'polygon',
    'line',
    'grid',
    'ascii',
    'sgrid',
    'selector',
    'raster',
    'tile',
    'ows',
    'geojson',
    'shapefile',
    'range_bar',
    'slider',
    'map'
    ];

if __name__ == '__main__':
    out = open ('wigglemaps.combined.js', 'w')
    for path in manifest:
        buf = open ('js/' + path + '.js', 'r').read ()
        buf = buf.replace ('/*!', '/*')
        out.write (buf + '\n')
    out.close ()
    
