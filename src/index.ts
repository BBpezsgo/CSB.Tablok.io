import { DataBase } from "./database"
import * as HTTP from './http'
import * as Utilities from './utilities'
import * as Checker from './checker'

declare global {
    interface Window {
        OpenTabloModal: (id: number) => void
        CloseTabloModal: () => void
        Database: DataBase
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
    const teachersElement = Utilities.TryGetElement('teachers')

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
    }
    // If "teachersElement" exists, it fills up with some content
    /*
    if (teachersElement)
    for (let i = 0; i < Database.teachers.length; i++) {
        const teacher = Database.teachers[i]
        teachersElement.appendChild(Utilities.Template('teacher', teacher))
    }
    */

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
}

document.addEventListener('DOMContentLoaded', () => { Main() })
