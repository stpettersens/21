import sys
import base64

with open(sys.argv[1], 'rb') as binary_file:
    encoded_string = base64.b64encode(binary_file.read())
    print(encoded_string)
