const fs = require('fs')
fs.rmSync('./docs/', { recursive: true, force: true })
const files = fs.readdirSync('./dist/')
fs.mkdirSync('./docs/')
files.forEach(file => {
    fs.copyFileSync('./dist/' + file, "./docs/" + file)
})
console.log('dist\\ => docs\\')