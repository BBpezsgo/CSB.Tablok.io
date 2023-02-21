import { DataBase } from "./database"

export function CheckDatabase(database: DataBase) {
    for (let i = 0; i < database.teachers.length; i++) {
        for (let j = 0; j < database.teachers.length; j++) {
            if (i === j) continue
            if (database.teachers[i].ID == database.teachers[j].ID)
            { console.warn('Duplicate teacher ids', database.teachers[i], database.teachers[j]) }
            if (database.teachers[i].Name.ToString() == database.teachers[j].Name.ToString())
            { console.warn('Duplicate teachers', database.teachers[i], database.teachers[j]) }
        }
    }
    
    for (let i = 0; i < database.tablos.length; i++) {
        if (database.departments[database.tablos[i].Department ?? -1] === undefined)
        { console.warn(`Unknown department ${database.tablos[i].Department}`, database.tablos[i]) }
        if (database.teachers[database.tablos[i].Ofo ?? -1] === undefined)
        { console.warn(`Unknown teacher ${database.tablos[i].Ofo}`, database.tablos[i]) }
        if (!database.tablos[i].Image)
        { console.warn(`Tablo without image`, database.tablos[i]) }
        if (!database.tablos[i].FinishedAt)
        { console.warn(`Tablo without finishing date`, database.tablos[i]) }
        else if ((database.tablos[i].FinishedAt ?? 0) < 1950)
        { console.warn(`Tablo with finishing date before 1950`, database.tablos[i]) }
        if (!database.tablos[i].StartedAt)
        { console.warn(`Tablo without starting date`, database.tablos[i]) }
        else if ((database.tablos[i].StartedAt ?? 0) < 1950)
        { console.warn(`Tablo with starting date before 1950`, database.tablos[i]) }
        if (database.tablos[i].Grade.Grade == -1)
        { console.warn(`Tablo without grade number`, database.tablos[i]) }
        if (database.tablos[i].Grade.Grade == 0)
        { console.warn(`Tablo without grade number`, database.tablos[i]) }
        if (database.tablos[i].Grade.Sub === null || database.tablos[i].Grade.Sub == "")
        { console.warn(`Tablo without sub-grade`, database.tablos[i]) }
        for (let j = 0; j < database.tablos.length; j++) {
            if (i === j) continue
            if (database.tablos[i].Image == database.tablos[j].Image && database.tablos[i].Image !== 'No Image')
            { console.warn('Tablo image used more than once', database.tablos[i], database.tablos[j]) }
            if (database.tablos[i].StartedAt && database.tablos[i].StartedAt == database.tablos[j].StartedAt)
            {
                if (database.tablos[i].Grade.Grade && database.tablos[j].Grade.Grade &&
                    database.tablos[i].Grade.Sub && database.tablos[j].Grade.Sub &&
                    database.tablos[i].Grade.Grade == database.tablos[j].Grade.Grade &&
                    database.tablos[i].Grade.Sub == database.tablos[j].Grade.Sub) {
                    console.warn(`Tablo conflict`, database.tablos[i], database.tablos[j])
                }
                if (database.tablos[i].Ofo && database.tablos[j].Ofo &&
                    database.tablos[i].Ofo == database.tablos[j].Ofo && database.tablos[i].Ofo !== -1) {
                    console.warn(`Same teacher at the same time`, database.tablos[i], database.tablos[j])
                }
            }
        }
    }
}