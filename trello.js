const https = require('https')
const auth = require('./trello.auth.json')

/**
 * @param {string} listID
 */
function GetCards(listID) {
    return new Promise((resolve, reject) => {
        https.get(`https://api.trello.com/1/lists/${listID}/cards?key=${auth.key}&token=${auth.token}`, (res) => {
            var data = ''
            res.on('data', (d) => { data += d })
        
            res.on('end', () => {
                resolve(JSON.parse(data))
            })
        })
        .on('error', (e) => { reject(e) })
    })
}

module.exports = { GetCards }