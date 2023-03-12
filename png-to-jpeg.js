const fs = require("fs")
const pngToJpeg = require('png-to-jpeg')
 
/**
 * @param {string} input
 * @param {string} output
 * @returns {Promise<void>}
 */
function ConvertImage(input, output) {
    return new Promise((resolve, reject) => {
        const buffer = fs.readFileSync(input)

        const converter = pngToJpeg({quality: 90})
        if (typeof converter === 'function') {
            converter(buffer)
                .then(output_ => {
                    fs.writeFileSync(output.substring(0, output.length - 3) + 'jpg', output_)
                    resolve()
                })
                .catch(error => {
                    console.error(error)
                    reject(error)
                })
        } else {
            console.error('wtf')
            reject(new Error('wtf'))
        }
    })
}

async function ConvertImages() {
    const inputFolder = './docs/img/tablos/'
    const outputFolder = './docs/img/tablos-jpeg/'

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

    for (let i = 0; i < inputFiles.length; i++) {
        const file = inputFiles[i]
        if (!file.toLocaleLowerCase().endsWith('png')) continue
        console.log('Convert images' + '\t' + `${Math.round(((i + 1) / inputFiles.length) * 100)}%` + '\t' + file)
        await ConvertImage(inputFolder + file, outputFolder + file)
            .then(() => {
                
            })
            .catch(error => {
                console.error(error)
            })
    }

    console.log('Done')
}

ConvertImages()