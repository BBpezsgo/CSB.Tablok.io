from typing import IO
from enum import Enum

class Mode(Enum):
    NONE = 1
    STRING_ARRAY = 2
    CUSTOM = 3

Mode = Enum('Mode', ['NONE', 'STRING_ARRAY', 'CUSTOM'])

input: IO = open('in.txt', 'r', encoding='utf8')
lines = input.readlines()
input.close()

mode = Mode.STRING_ARRAY
lineBreaks = True
clearInput = True
ident = '            '
prefix = '\n        "Students": [\n'
suffix = '\n        ],'

output: IO = None
if mode != Mode.NONE: output = open('out.json', 'w', encoding='utf8')

def Error(error = 'ERROR'):
    if (output != None): output.close()
    raise BaseException(error)

if mode == Mode.STRING_ARRAY:
    output.write(prefix)
    values = ''.join(lines).strip(',').split(',')
    for i in range(len(values)):
        value = values[i].strip().replace('\r', '').replace('\n', '')
        if i == 0: output.write(ident)
        elif lineBreaks: output.write(ident)
        output.write('"' + value + '"')
        if i < len(values)-1:
            output.write(', ')
            if lineBreaks: output.write('\n')
    output.write(suffix)
elif mode == Mode.CUSTOM:
    status = 0
    currentLine = 0
    endlessSafe = 50000
    while currentLine < len(lines)-1:
        endlessSafe -= 1
        if endlessSafe <= 0: Error('Endless Loop!')
        line = lines[currentLine].strip()

        if status == 0:
            if line == '': currentLine += 1
            elif line.startswith('#') or line == 'Az iskola végzős tanulói (1990-2008)':
                status = 1
                currentLine += 1
            else: Error()
        elif status == 1:
            if line == '': currentLine += 1
            else:
                output.write('        "Grade": "')
                output.write(line)
                output.write('",\n')
                currentLine += 1
                status = 2
        elif status == 2:
            pass


if mode != Mode.NONE: output.close()

if clearInput:
    input_: IO = open('in.txt', 'w', encoding='utf8')
    input_.close()
