export function Set(code: number): void
export function Reset(): void
export function Write(buffer: string | Uint8Array): void
export function EOL(): void

export const Colors = {
    'BLACK': 0,
    'RED': 1,
    'GREEN': 2,
    'YELLOW': 3,
    'BLUE': 4,
    'MAGENTA': 5,
    'CYAN': 6,
    'WHITE': 7,
}
export const Type = {
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
export const Brightness = {
    'DEFAULT': 0,
    'BRIGHT': 60,
}
