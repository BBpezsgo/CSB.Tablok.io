const sharp = require('sharp')
const fs = require('fs')

const WIDTH = 400
const HEIGHT = 300

/**
 * @param {string} input
 * @param {string} output
 * @param {number} width
 * @param {number} height
 */
function ResizeImage(input, output, width, height) {
    return new Promise((resolve, reject) => {
        sharp(input)
            .resize(WIDTH, HEIGHT)
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

async function ResizeImages() {
    const inputFolder = './docs/img/tablos/'
    const outputFolder = './docs/img/tablos-lowres/'

    console.log('Input folder', inputFolder)
    console.log('Output folder', outputFolder)

    const inputFolderExists = fs.existsSync(inputFolder)
    const outputFolderExists = fs.existsSync(outputFolder)

    console.log('Input folder exists', inputFolderExists)
    console.log('Output folder exists', outputFolderExists)

    if (!inputFolderExists) {
        console.log('No input folder, closing ...')
        return
    }

    if (!outputFolderExists) {
        console.log('Create', outputFolder)
        fs.mkdirSync(outputFolder, { recursive: true })
    }

    const inputFiles = fs.readdirSync(inputFolder)
    const outputFiles = fs.readdirSync(outputFolder)

    console.log('Delete old files', outputFiles.length)
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
        console.log('Resize images' + '\t' + `${Math.round(((i + 1) / inputFiles.length) * 100)}%` + '\t' + file)
        await ResizeImage(inputFolder + file, outputFolder + file, WIDTH, HEIGHT)
            .then(info => {
                outputSizeSum += info.size
            })
            .catch(error => {
                console.error(error)
            })
    }

    console.log('Total size reduced from', GetSizeText(inputSizeSum), 'to', GetSizeText(outputSizeSum), `(reduced ${Math.round((1 - (outputSizeSum / inputSizeSum)) * 100)}%)`)
}

ResizeImages()
