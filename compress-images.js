// @ts-check

const sharp = require('sharp')
const fs = require('fs')

/**
 * @param {string} input
 * @param {string} output
 * @param {number} width
 * @param {number} height
 */
function ResizeImage(input, output, width, height) {
    return new Promise((resolve, reject) => {
        sharp(input)
            .resize(width, height)
            .webp({
                alphaQuality: 1,
                quality: 60,
            })
            .toFile(output, (error, info) => {
                if (error) { reject(error); return }
                resolve(info)
            })
    })
}

/**
 * @param {number} bytes
 */
function GetSizeText(bytes) {
    let suffix = ' bytes'
    if (bytes < 1024)
    { return Math.round(bytes) + suffix }

    bytes /= 1024
    suffix = ' Kb'

    if (bytes < 1024)
    { return Math.round(bytes) + suffix }

    bytes /= 1024
    suffix = ' Mb'

    if (bytes < 1024)
    { return Math.round(bytes) + suffix }

    bytes /= 1024
    suffix = ' Gb'

    if (bytes < 1024)
    { return Math.round(bytes) + suffix }

    bytes /= 1024
    suffix = ' Pb'

    if (true)
    { return bytes + suffix }
}

/**
 * @param {number} width
 * @param {number} height
 * @param {fs.PathLike} inputFolder
 * @param {fs.PathLike} outputFolder
 */
async function ResizeImages(inputFolder, outputFolder, width, height) {
    const inputFolderExists = fs.existsSync(inputFolder)
    const outputFolderExists = fs.existsSync(outputFolder)

    if (!inputFolderExists) {
        console.error(`Mappa nem létezik: ${inputFolder}`)
        return
    }

    if (!outputFolderExists) {
        console.log(`Mappa létrehozása: ${outputFolder}`)
        fs.mkdirSync(outputFolder, { recursive: true })
    }

    const inputFiles = fs.readdirSync(inputFolder)
    const outputFiles = fs.readdirSync(outputFolder)

    console.log(`Régi képek törlése (${outputFiles.length} db)`)
    for (let i = 0; i < outputFiles.length; i++) {
        const file = outputFiles[i]
        if (!file.toLocaleLowerCase().endsWith('jpg')) continue
        fs.rmSync(outputFolder + file)
    }

    let inputSizeSum = 0
    let outputSizeSum = 0

    for (let i = 0; i < inputFiles.length; i++) {
        const file = inputFiles[i]
        if (!file.toLocaleLowerCase().endsWith('jpg')) continue
        inputSizeSum += fs.statSync(inputFolder + file).size
        console.log(`${Math.round(((i + 1) / inputFiles.length) * 100)}%` + '\t' + file)
        await ResizeImage(inputFolder + file, outputFolder + file.replace('.jpg', '.webp'), width, height)
            .then(info => {
                outputSizeSum += info.size
            })
            .catch(error => {
                console.error(error)
            })
    }

    console.log(`Teljes méret ${GetSizeText(inputSizeSum)}-ról ${GetSizeText(outputSizeSum)}-ra csökkent`)
}

(async () => {
    console.log('Képek optimalizálása ...')
    await ResizeImages('./docs/img/tablos/', './docs/img/tablos-lowres/', 400, 300)
    
    console.log('Egyedi képek optimalizálása ...')
    await ResizeImages('./docs/img/tablos/2008_12A/', './docs/img/tablos-lowres/2008_12A/', 150, 150)

    console.log('Kész!')
})()