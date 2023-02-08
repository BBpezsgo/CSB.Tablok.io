import { DataBase } from "./datatypes"
import * as HTTP from './http'
import * as Utilities from './utilities'

async function DownloadDatabase() {
    const tablos: any[] = JSON.parse(await HTTP.GetAsync('./database/tablos.json'))
    const teachers: any[] = JSON.parse(await HTTP.GetAsync('./database/teachers.json'))
    const departments: string[] = JSON.parse(await HTTP.GetAsync('./database/departments.json'))

    return new DataBase(tablos, teachers, departments)
}

async function Main() {
    var Database: DataBase
    try {
        Database = await DownloadDatabase()
    } catch (error: any) {
        console.error('Failed to download the database', error)
        return
    }

    const tablosElement = Utilities.GetElement('tablos')
    const teachersElement = Utilities.GetElement('teachers')

    if (!tablosElement || !teachersElement) return

    for (let i = 0; i < Database.tablos.length; i++) {
        const tablo = Database.tablos[i]
        tablosElement.appendChild(Utilities.Template('tablo', tablo))
    }
    for (let i = 0; i < Database.teachers.length; i++) {
        const teacher = Database.teachers[i]
        teachersElement.appendChild(Utilities.Template('teacher', teacher))
    }

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
