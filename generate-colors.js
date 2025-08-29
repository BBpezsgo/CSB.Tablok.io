// @ts-check

const sharp = require('sharp')
const fs = require('fs')

/**
 * @param {string} filename
 */
async function getDominantColor(filename) {
    const pixels = await sharp(filename)
        .raw()
        .toBuffer({ resolveWithObject: true })
    /** @type {[number, number, number]} */
    const sum = [0, 0, 0]
    const channels = Math.min(3, pixels.info.channels)
    for (let i = 0; i < pixels.data.length; i += pixels.info.channels) {
        for (let j = 0; j < channels; j++) {
            sum[j] += pixels.data[i + j]
        }
    }
    for (let i = 0; i < 3; i++) {
        sum[i] = sum[i] / (pixels.data.length / channels)
    }
    const hsv = RGBtoHSV(sum)
    hsv[1] *= 1.5
    const rgb = HSVtoRGB(hsv)
    return `#${Math.round(rgb[0]).toString(16).padStart(2, '0')}${Math.round(rgb[1]).toString(16).padStart(2, '0')}${Math.round(rgb[2]).toString(16).padStart(2, '0')}`
}

/**
 * @param {[number, number, number]} color
 * @returns {[number, number, number]}
 */
function RGBtoHSV(color) {
    let r, g, b, h, s, v;
    r = color[0];
    g = color[1];
    b = color[2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    v = max;
    const delta = max - min;
    if (max != 0)
        s = delta / max;        // s
    else {
        // r = g = b = 0        // s = 0, v is undefined
        s = 0;
        h = -1;
        return [h, s, 0];
    }
    if (r === max)
        h = (g - b) / delta;      // between yellow & magenta
    else if (g === max)
        h = 2 + (b - r) / delta;  // between cyan & yellow
    else
        h = 4 + (r - g) / delta;  // between magenta & cyan
    h *= 60;                // degrees
    if (h < 0)
        h += 360;
    if (isNaN(h))
        h = 0;
    return [h, s, v];
}

/**
 * @param {[number, number, number]} color
 * @returns {[number, number, number]}
 */
function HSVtoRGB(color) {
    let i;
    let h, s, v, r, g, b;
    h = color[0];
    s = color[1];
    v = color[2];
    if (s === 0) {
        // achromatic (grey)
        r = g = b = v;
        return [r, g, b];
    }
    h /= 60;            // sector 0 to 5
    i = Math.floor(h);
    const f = h - i;          // factorial part of h
    const p = v * (1 - s);
    const q = v * (1 - s * f);
    const t = v * (1 - s * (1 - f));
    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:        // case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return [r, g, b];
}

(async () => {
    const colors = {}

    console.log('Domináns színek generálása ...')

    const tablos = /** @type {Array} */ (JSON.parse(fs.readFileSync('./docs/database/tablos.json', 'utf8')))
        .filter(v => (typeof v === 'object') && !v.IsCube && v.Image)
    for (let i = 0; i < tablos.length; i++) {
        const tablo = tablos[i]
        console.log(`${Math.round(((i + 1) / tablos.length) * 100)}%` + '\t' + tablo.Image)
        colors[tablo.Image] = await getDominantColor('./docs/img/tablos/' + tablo.Image)
    }

    console.log('Domináns színek generálása kész!')

    fs.writeFileSync('./docs/database/colors.json', JSON.stringify(colors, null, ' '))
})()
