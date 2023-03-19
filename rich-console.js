/**
 * @param {number} code
 */
function Set(code) {
    Write(`\x1b[${code}m`)
}

function Reset() {
    Set(0)
}

/**
 * @param {string | Uint8Array} buffer
 */
function Write(buffer) {
    process.stdout.write(buffer)
}

function EOL() {
    console.log()
}

const Colors = {
    'BLACK': 0,
    'RED': 1,
    'GREEN': 2,
    'YELLOW': 3,
    'BLUE': 4,
    'MAGENTA': 5,
    'CYAN': 6,
    'WHITE': 7,
}

const Type = {
    /**
     * As with faint, the color change is a PC (SCO / CGA) invention.
     */
    'BOLD': 1,
    /**
     * May be implemented as a light font weight like bold.
     */
    'DIM': 2,
    /**
     * **Not widely supported**
     * 
     * Sometimes treated as inverse or blink
     */
    'ITALIC': 3,
    /**
     * Style extensions exist for Kitty, VTE, mintty and iTerm2
     */
    'UNDERLINE': 4,
    /**
     * Sets blinking to less than 150 times per minute
     */
    'SLOW_BLINK': 5,
    /**
     * **Not widely supported**
     * 
     * MS-DOS ANSI.SYS, 150+ per minute
     */
    'RAPID_BLINK': 6,
    /**
     * **Inconsistent emulation**
     * 
     * Swap foreground and background colors
     */
    'INVERT': 7,
    /**
     * **Not widely supported**
     */
    'HIDE': 8,
    /**
     * **Not supported in `Terminal.app`**
     * 
     * Characters legible but marked as if for deletion
     */
    'STRIKE': 9,

    'FOREGROUND': 30,
    'BACKGROUND': 40,
}

const Brightness = {
    'DEFAULT': 0,
    'BRIGHT': 60,
}

module.exports = { Set, Reset, Write, EOL, Colors, Type, Brightness }