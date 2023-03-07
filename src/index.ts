import { DataBase } from "./database"
import * as HTTP from './http'
import * as Utilities from './utilities'
import * as Checker from './checker'

declare global {
    interface Window {
        OpenTabloModal: (id: number) => void
        CloseTabloModal: () => void

        Database: DataBase

        DisplayOfoSuggestion: (name: string) => void
    }
}

async function DownloadDatabase(logs: boolean) {
    // Download the raw JSON data (HTTP.GetAsync), and then process it (JSON.parse)
    const tablos: any[] = JSON.parse(await HTTP.GetAsync('./database/tablos.json'))
    const base: any = JSON.parse(await HTTP.GetAsync('./database/base.json'))
    const departments: string[] = JSON.parse(await HTTP.GetAsync('./database/departments.json'))

    return new DataBase(tablos, departments, base, logs)
}

/** Main function: this will be called when the document is loaded */
async function Main() {
    const urlPath = window.location.pathname.split('/')
    const filename = urlPath[urlPath.length-1]

    /** Database manager */
    var Database: DataBase
    try {
        // It tries to download the database from the JSON files
        Database = await DownloadDatabase(filename === 'check.html')
    } catch (error: any) {
        console.error('Failed to download the database', error)
        return
    }

    Checker.CheckDatabase(Database, filename === 'check.html')

    window.Database = Database

    if (filename === 'check.html') {
        Checker.Main(Database)
        return
    }

    // Get the container elements
    const tablosElement = Utilities.TryGetElement('tablos-container')
    const teachersElement = Utilities.TryGetElement('teachers-list')

    // If "tablosElement" exists, it deletes its content
    if (tablosElement) Utilities.ClearElement(tablosElement)

    // If "tablosElement" exists, it fills up with some content
    if (tablosElement) {
        let container: HTMLElement | null = null
        let lastYearPanel: number = 0
        for (let i = 0; i < Database.tablos.length; i++) {
            const tablo = Database.tablos[i]
            if (!tablo.Image) continue

            if (lastYearPanel === 0) {
                tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                lastYearPanel = tablo.FinishedAt
            } else if (tablo.FinishedAt - lastYearPanel < -3) {
                tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                lastYearPanel = tablo.FinishedAt
            }
        
            const newElement = Utilities.Template('tablo', tablo)
            if (false && tablo.Image) {
                const img = new Image()
                img.onload = () => { newElement.style.height = (img.height / newElement.clientWidth) + 'px' }
                img.src = tablo.Image ?? ''
            }
            container?.appendChild(newElement)
        }
        tablosElement.appendChild(Utilities.Template('no-result', { }))
    }
    // If "teachersElement" exists, it fills up with some content
    if (teachersElement)
    for (let i = 0; i < Database.teachers.length; i++) {
        const teacher = Database.teachers[i]
        teachersElement.appendChild(Utilities.Template('teacher', teacher))
    }
    (()=>{
        const names: string[] = [ ]

        for (let i = 0; i < Database.tablos.length; i++) {
            const tablo = Database.tablos[i]
            if (!tablo.Ofo) continue
            for (let j = 0; j < tablo.Ofo.length; j++)
            { if (!names.includes(tablo.Ofo[j])) names.push(tablo.Ofo[j]) }
        }
        names.sort()

        const input = document.getElementById('filter-ofo') as HTMLInputElement
        const list = document.getElementById('filter-ofo-suggestions') as HTMLElement

        if (!input) return
        if (!list) return

        function CompareOfoSuggestion(a: string, b: string) {
            const aNorm = Utilities.NormalizeString(a)
            const bNorm = Utilities.NormalizeString(b)

            if (a.startsWith(bNorm)) return 1
            if (a.includes(bNorm)) return 2
            return Utilities.LevenshteinDistance(aNorm, bNorm)
        }

        function HideSuggestions() {
            list.innerHTML = ''
            list.style.display = 'none'
        }

        function UpdateSuggestions() {
            HideSuggestions()
            const value = input.value.toLowerCase()
            const normalizedValue = Utilities.NormalizeString(value)
            if (value == '') return
            const result: string[] = []
            for (let nameOriginal of names) {
                const name = nameOriginal.toLowerCase()
                const compared = CompareOfoSuggestion(name, value)
                if (compared < 3 || (compared < 20 && result.length < 8)) {
                    result.push(nameOriginal)
                }
            }

            result.sort((a, b) => CompareOfoSuggestion(a.toLowerCase(), value) - CompareOfoSuggestion(b.toLowerCase(), value))

            for (let item of result) {
                list.style.display = 'block'
                const newItem = document.createElement('li')
                newItem.setAttribute('onclick', 'DisplayOfoSuggestion(\'' + item + '\')')
                let word = ''
                if (item.toLowerCase().startsWith(normalizedValue)) {
                    word += '<b class=selectable>' + item.substring(0, normalizedValue.length) + '</b>'
                    word += item.substring(normalizedValue.length)
                } else if (item.toLowerCase().includes(normalizedValue)) {
                    const start = item.toLowerCase().indexOf(normalizedValue)
                    word += item.substring(0, start)
                    word += '<b class=selectable>' + item.substring(start, start + normalizedValue.length) + '</b>'
                    word += item.substring(start + normalizedValue.length)
                } else {
                    word += item
                }
                newItem.innerHTML = word
                list.appendChild(newItem)
            }
        }

        input.addEventListener('keyup', UpdateSuggestions)
        input.addEventListener('blur', ()=>{setTimeout(HideSuggestions, 1000)})
        input.addEventListener('focus', UpdateSuggestions)
        window.DisplayOfoSuggestion = (name: string) => {
            input.value = name
            HideSuggestions()
        }
    })()

    window.OpenTabloModal = window.OpenTabloModal || ((id) => {
        const selectedTablo = Database.tablos[id]
        Utilities.TemplateAsync('tablo-modal', selectedTablo).then(modal => {
            modal.classList.add('show')
            window.document.body.appendChild(modal)
        })
    })
    window.CloseTabloModal = window.CloseTabloModal || (() => {
        const modal = Utilities.TryGetElement('tablo-modal')
        if (!modal) return
        modal.remove()
    })

    if (tablosElement) {
        setTimeout(() => {
            const elements = document.querySelectorAll('.tablo') as NodeListOf<HTMLElement>
            const unloadedTablos: string[] = []
            for (let i = 0; i < elements.length; i++) unloadedTablos.push(elements.item(i).id)

            const RefreshTablos = () => {
                for (let i = 0; i < elements.length; i++) {
                    const element = elements.item(i)
                    if (!unloadedTablos.includes(element.id)) continue

                    const position = element.getBoundingClientRect()
                
                    if ((position.top >= 0                 && position.bottom <= window.innerHeight) ||
                        (position.top < window.innerHeight && position.bottom >= 0)) {
                        if (!element.classList.contains('tablo-unloaded')) continue
                        // console.log('Loading image for element', element)
                        element.classList.remove('tablo-unloaded')
                        const tabloId = Number.parseInt(element.id.split('-')[1])
                        const tablo = Database.tablos[tabloId]
                        if (tablo.Image) element.style.backgroundImage = `url(img/tablos-lowres/${tablo.Image})`
                    } else {
                        if (element.classList.contains('tablo-unloaded')) continue
                        element.style.backgroundImage = 'url(#)'
                        element.classList.add('tablo-unloaded')
                    }
                }
            }

            window.addEventListener('scroll', RefreshTablos)
            RefreshTablos()
        }, 1000)
    }
}

document.addEventListener('DOMContentLoaded', () => { Main() })
