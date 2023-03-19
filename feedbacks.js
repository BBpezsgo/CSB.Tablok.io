const Trello = require('./trello')
const RichConsole = require('./rich-console')

/**
 * @param {Date} date
 */
function StringDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${year.toString()}. ${month.toString()}. ${day.toString()}. ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

/**
 * @param {number} date
 */
function DateDifference(date) {
    const diff = new Date(Date.now() - date)
    
    if (diff.getFullYear() - 1970 > 0) return `${diff.getFullYear() - 1970} years ago`
    if (diff.getMonth() > 0) return `${diff.getMonth()} months ago`
    if (diff.getDate() > 1) return `${diff.getDate()} days ago`
    if (diff.getHours() > 1) return `${diff.getHours()} hours ago`
    if (diff.getMinutes() > 0) return `${diff.getMinutes()} minutes ago`
    return `now`
}

Trello.GetCards('63ccefc1b6b3b4019949e079')
    .then(cards => {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i]
            const dateRaw = Date.parse(card.dateLastActivity)
            const date = new Date(dateRaw)
            
            RichConsole.EOL()

            RichConsole.Set(RichConsole.Colors.MAGENTA + RichConsole.Type.FOREGROUND)
            RichConsole.Write(` === FEEDBACK ${i} === `)
            RichConsole.Reset()

            RichConsole.Write(`${DateDifference(dateRaw)} `)
            RichConsole.Set(RichConsole.Colors.BLACK + RichConsole.Type.FOREGROUND)
            RichConsole.Write(`(${StringDate(date)})`)
            RichConsole.Reset()

            RichConsole.EOL()
            RichConsole.EOL()

            RichConsole.Write(`${card.desc}`)
            
            RichConsole.EOL()
            RichConsole.EOL()

            RichConsole.Set(RichConsole.Colors.BLUE + RichConsole.Type.FOREGROUND + RichConsole.Brightness.BRIGHT)
            RichConsole.Set(RichConsole.Type.UNDERLINE)
            RichConsole.Write(card.url)
            RichConsole.Reset()
            
            RichConsole.EOL()

            RichConsole.Set(RichConsole.Colors.MAGENTA + RichConsole.Type.FOREGROUND)
            RichConsole.Write(` ================== `)
            RichConsole.Reset()

            RichConsole.EOL()
            RichConsole.EOL()
        }
    })
    .catch(console.error)
