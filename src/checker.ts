import { DataBase } from "./database"
import { CheckedTablo } from "./database-types"
import * as Utilities from "./utilities"
import * as HTTP from "./http"

const OFFICAL_SOURCE = 'EXCEL TABLE (NEW)'

export function CheckDatabase(database: DataBase, log: boolean) {
    /*
    for (let i = 0; i < database.teachers.length; i++) {
        for (let j = 0; j < database.teachers.length; j++) {
            if (i === j) continue
            if (database.teachers[i].ID == database.teachers[j].ID)
            { console.warn('Duplicate teacher ids', database.teachers[i], database.teachers[j]) }
            if (database.teachers[i].Name.ToString() == database.teachers[j].Name.ToString())
            { console.warn('Duplicate teachers', database.teachers[i], database.teachers[j]) }
        }
    }
    */

    const departments: Map<string, number> = new Map<string, number>()  

    for (let i = 0; i < database.tablos.length; i++) {
        let tablo: CheckedTablo = {
            ...database.tablos[i],
            Issues: []
        }
        if (!tablo.Sources) {
            if (log) console.warn('Tablo without source', tablo)
            tablo.Issues.push('No source')
        } else {
            if (!tablo.Sources.includes(OFFICAL_SOURCE)) {
                const verifiedSources = [ 'EMLEKKONYV', 'SCAN', 'EXCEL TABLE (NEW)' ]
                for (let i = 0; i < tablo.Sources.length; i++) {
                    const source = tablo.Sources[i]
                    if (!verifiedSources.includes(source)) {
                        if (log) console.warn('Tablo with unverified source', tablo)
                        tablo.Issues.push('Unverified source')
                        break
                    }
                }
            }
        }
        if (tablo.Department === 'Ismeretlen' || !tablo.Department) {
            if (log) console.warn(`Unknown department ${tablo.Department}`, tablo)
            tablo.Issues.push(`Unknown department ${tablo.Department}`)
        }
        // if (typeof tablo.Ofo === 'number') if (database.teachers[tablo.Ofo ?? -1] === undefined)
        // { console.warn(`Unknown teacher ${tablo.Ofo}`, tablo) }
        if (!tablo.Ofo) {
            if (log) console.warn(`Unknown teacher ${tablo.Ofo}`, tablo)
            tablo.Issues.push(`Unknown teacher ${tablo.Ofo}`)
        }
        if (!tablo.IsCube) { if (!tablo.Image)
        { if (log) console.warn(`Tablo without image`, tablo); tablo.Issues.push('No image') }
        else {
            if (!tablo.IsCube) if (log) HTTP.CheckUrl('./img/tablos-lowres/' + tablo.Image)
                .then(code => {
                    if (code === 200) return
                    if (!tablo.IsCube)
                    if (log) console.warn('Image does not have a low-res version', tablo.Image, 'HTTP ' + code)
                })
                .catch(error => {
                    if (!tablo.IsCube)
                    if (log) console.warn('Image does not have a low-res version', tablo.Image, error)
                })
        }}
        if (!tablo.FinishedAt)
        { if (log) console.warn(`Tablo without finishing date`, tablo); tablo.Issues.push('No finishing year') }
        else if ((tablo.FinishedAt ?? 0) < 1950)
        { if (log) console.warn(`Tablo with finishing date before 1950`, tablo); tablo.Issues.push('Finishing year is before 1950') }
        if (!tablo.StartedAt)
        { if (log) console.warn(`Tablo without starting date`, tablo) }
        else if ((tablo.StartedAt ?? 0) < 1950)
        { if (log) console.warn(`Tablo with starting date before 1950`, tablo) }
        if (tablo.Grade.Grade == -1)
        { if (log) console.warn(`Tablo without grade number`, tablo); tablo.Issues.push('No grade number') }
        if (tablo.Grade.Grade == 0)
        { if (log) console.warn(`Tablo without grade number`, tablo); tablo.Issues.push('No grade number') }
        if (tablo.Grade.Sub === null || tablo.Grade.Sub == "")
        { if (log) console.warn(`Tablo without sub-grade`, tablo); tablo.Issues.push('No sub-grade') }
        for (let j = 0; j < database.tablos.length; j++) {
            if (i === j) continue
            const otherTablo = database.tablos[j]
            if (!tablo.IsCube && !otherTablo.IsCube) if (tablo.Image == otherTablo.Image && tablo.Image !== 'No Image' && tablo.Image)
            { if (log) console.warn('Tablo image used more than once', tablo, otherTablo); tablo.Issues.push('Image used more than once') }
            if (tablo.StartedAt && tablo.StartedAt == otherTablo.StartedAt)
            {
                if (tablo.Grade.Grade && otherTablo.Grade.Grade &&
                    tablo.Grade.Sub && otherTablo.Grade.Sub &&
                    tablo.Grade.Grade == otherTablo.Grade.Grade &&
                    tablo.Grade.Sub == otherTablo.Grade.Sub) {
                        if (log) console.warn(`Tablo conflict`, tablo, otherTablo)
                    tablo.Issues.push('Conflict')
                }
                if (tablo.Ofo && otherTablo.Ofo) {
                        tablo.Ofo.forEach(ofo1 => {
                            otherTablo.Ofo?.forEach(ofo2 => {
                                if (ofo1.trim() === ofo2.trim()) {
                                    if (log) console.log(`Same teacher at the same time`, tablo, otherTablo)
                                }
                            })
                        })
                }
            }
        }
        if (tablo.Department) {
            if (departments.has(tablo.Department)) {
                departments.set(tablo.Department, (departments.get(tablo.Department) ?? 0) + 1)
            } else {
                departments.set(tablo.Department, 1)
            }
        }

        database.tablos[i] = tablo
    }

    if (log) departments.forEach((value, key) => { if (value < 10) console.log(`Department "${key}" only exists ${value} times`) })
}

export function Main(database: DataBase) {
    const tbody = Utilities.GetElement('tbody')
    let yearRow: HTMLElement|null = null
    let year: number|null = null
    for (let i = 0; i < database.tablos.length; i++) {
        const original = database.tablos[i] as CheckedTablo
        let tablo = {
            ...original,
            HasIssule: true,
            UnknownDepartment: (original.Type !== 'SCHOOL') ? (original.Department === 'Ismeretlen') : false,
            Unverified: false,
            StudentCount: 0,
            NoTeacher: false,
            OfficiallyVerified: original.Sources?.includes(OFFICAL_SOURCE) ?? false
        }

        if (tablo.Students) tablo.StudentCount = tablo.Students.length
        if (tablo.Type !== 'SCHOOL') if (tablo.Groups) {
            for (let i = 0; i < tablo.Groups.length; i++) {
                const group = tablo.Groups[i]
                tablo.StudentCount += group.Students.length
            }
        }

        for (let j = tablo.Issues.length-1; j >= 0; j--) {
            const issue = tablo.Issues[j]

            if (issue === 'Unverified source') {
                tablo.Unverified = true
                tablo.Issues.splice(j, 1)
                continue
            }

            if (issue === 'No image') {
                tablo.Issues.splice(j, 1)
                continue
            }

            if (issue === 'Unknown teacher null') {
                tablo.Issues.splice(j, 1)
                tablo.NoTeacher = true
                continue
            }

            if (issue === 'No grade number') {
                tablo.Issues.splice(j, 1)
                continue
            }

            if (issue === 'No sub-grade') {
                tablo.Issues.splice(j, 1)
                continue
            }

            if (issue.startsWith('Unknown department')) {
                tablo.Issues.splice(j, 1)
                tablo.UnknownDepartment = true
                continue
            }
        }

        tablo.HasIssule = tablo.Issues.length > 0

        if (yearRow === null || year === null) {
            year = tablo.FinishedAt
            yearRow = tbody.appendChild(Utilities.CreateElement(`<tr><th colspan=6>${year}</th></tr>`)) as HTMLElement
        }
        else if (year !== tablo.FinishedAt) {
            year = tablo.FinishedAt
            yearRow = tbody.appendChild(Utilities.CreateElement(`<tr><th colspan=6>${year}</th></tr>`)) as HTMLElement
        }

        tbody.appendChild(Utilities.Template('check/row', tablo))
    }
}