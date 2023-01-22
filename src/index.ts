import { Tablo, Name } from "./datatypes"
import * as HTTP from './http'
import * as Utilities from './utilities'

async function Main() {
    const tablos: Tablo[] = JSON.parse(await HTTP.GetAsync('./database/tablos.json'))
    const teachers: Name[] = JSON.parse(await HTTP.GetAsync('./database/teachers.json'))
    const departments: string[] = JSON.parse(await HTTP.GetAsync('./database/departments.json'))

    for (let i = 0; i < teachers.length; i++)
    {
        teachers[i] = Object.assign(new Name(), teachers[i])
    }
    for (let i = 0; i < tablos.length; i++)
    {
        Utilities.AssignObjects(tablos[i].students, () => new Name())

        tablos[i].departmentText = departments[tablos[i].department]
        tablos[i].ofoText = teachers[tablos[i].ofo]
    }

    const tablosElement = Utilities.GetElement('tablos')
    const teachersElement = Utilities.GetElement('teachers')

    for (let i = 0; i < tablos.length; i++) {
        const tablo = tablos[i]
        tablosElement.appendChild(Utilities.Template('tablo', tablo))
    }
    for (let i = 0; i < teachers.length; i++) {
        const teacher = teachers[i]
        teachersElement.appendChild(Utilities.Template('teacher', teacher))
    }

    Utilities.GetElement('search').addEventListener('input', () => {
        Utilities.ClearElement(teachersElement)
        const input = Utilities.NormalizeString(Utilities.GetInputElement('search').value)
        var teachersCopy = teachers.slice()
        teachersCopy.sort((a, b) => Utilities.LevenshteinDistance(Utilities.NormalizeString(a.ToString()), input) - Utilities.LevenshteinDistance(Utilities.NormalizeString(b.ToString()), input))
        for (let i = 0; i < teachersCopy.length; i++) {
            const teacher = teachersCopy[i]
            if (!Utilities.CompareString(teacher.ToString(), input, 3, true)) { continue }
            teachersElement.appendChild(Utilities.Template('teacher', teacher))
        }
    })
}

Main()
