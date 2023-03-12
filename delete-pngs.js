const fs = require("fs")

async function ConvertImages() {
    const folder = './docs/img/tablos/'

    console.log('Folder', folder)

    const folderExists = fs.existsSync(folder)

    console.log('Folder exists', folderExists)

    if (!folderExists) {
        console.log('No folder, closing ...')
        return
    }

    const files = fs.readdirSync(folder)

    console.log('Delete .png files')
    for (let i = 0; i < files.length; i++) {
        if (files[i].toLocaleLowerCase().endsWith('png')) {
            console.log('Delete .png file' + '\t' + files[i])
            fs.rmSync(folder + files[i])
        }
    }

    console.log('Done')
}

ConvertImages()