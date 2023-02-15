import { DataBase, TabloProcessed } from "./database"
import * as HTTP from './http'
import * as Utilities from './utilities'

async function DownloadDatabase() {
    // Download the raw JSON data (HTTP.GetAsync), and then process it (JSON.parse)
    const tablos: any[] = JSON.parse(await HTTP.GetAsync('./database/tablos.json'))
    const teachers: any[] = JSON.parse(await HTTP.GetAsync('./database/teachers.json'))
    const departments: string[] = JSON.parse(await HTTP.GetAsync('./database/departments.json'))

    return new DataBase(tablos, teachers, departments)
}

/** Main function: this will be called when the document is loaded */
async function Main() {
    console.log('he')

    /** Database manager */
    var Database: DataBase
    try {
        // It tries to download the database from the JSON files
        Database = await DownloadDatabase()
    } catch (error: any) {
        console.error('Failed to download the database', error)
        return
    }

    // Get the container elements
    const tablosElement = Utilities.TryGetElement('tablos-container')
    const teachersElement = Utilities.TryGetElement('teachers')

    // If "tablosElement" exists, it deletes its content
    if (tablosElement) Utilities.ClearElement(tablosElement)

    // If "tablosElement" exists, it fills up with some content
    if (tablosElement) {
        tablosElement.appendChild(Utilities.Template('year-panel', { year: Database.tablos[0].FinishedAt }))
        let container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
        let lastYearPanel = Database.tablos[0].FinishedAt
        for (let i = 0; i < Database.tablos.length; i++) {
            const tablo = Database.tablos[i]

            if (tablo.FinishedAt - lastYearPanel < -3) {
                tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                lastYearPanel = tablo.FinishedAt
            }
            
            container.appendChild(Utilities.Template('tablo', tablo))
        }
    }
    // If "teachersElement" exists, it fills up with some content
    if (teachersElement)
    for (let i = 0; i < Database.teachers.length; i++) {
        const teacher = Database.teachers[i]
        teachersElement.appendChild(Utilities.Template('teacher', teacher))
    }

    // Some search tests... This will be deleted (I hope)
    if (teachersElement)
    Utilities.GetElement('search').addEventListener('input', () => {
        Utilities.ClearElement(teachersElement)
        const input = Utilities.NormalizeString(Utilities.GetInputElement('search').value)
        const teachersCopy = Database.teachers.slice()
        teachersCopy.sort((a, b) => Utilities.LevenshteinDistance(Utilities.NormalizeString(a.Name.ToString()), input) - Utilities.LevenshteinDistance(Utilities.NormalizeString(b.Name.ToString()), input))
        for (let i = 0; i < teachersCopy.length; i++) {
            const teacher = teachersCopy[i]
            if (!Utilities.CompareString(teacher.Name.ToString(), input, 3, true)) { continue }
            teachersElement.appendChild(Utilities.Template('teacher', teacher))
        }
    })
}

Main()
