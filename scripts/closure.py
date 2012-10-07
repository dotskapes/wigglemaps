import httplib, urllib, sys

# Define the parameters for the POST request and encode them in
# a URL-safe format.

def send (buffer, mode):
    params = urllib.urlencode([
            ('js_code', buffer),
            ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
            ('language', 'ecmascript5'),
            ('output_format', 'text'),
            ('output_info', mode)
            ])
    
    # Always use the following value for the Content-type header.
    headers = { "Content-type": "application/x-www-form-urlencoded" }
    conn = httplib.HTTPConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()
    data = response.read()
    conn.close ()
    return data

if __name__ == '__main__':
    buffer = open (sys.argv[1]).read ()
    errors = send (buffer, 'errors')
    if len (errors):
        print errors
        exit (1)
    else:
        out = open ('wigglemaps.min.js', 'w')
        data = send (buffer, 'compiled_code')
        out.write (data)
        out.close ()
