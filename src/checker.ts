import { DataBase } from "./database"

export function CheckDatabase(database: DataBase) {
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
    
    for (let i = 0; i < database.tablos.length; i++) {
        const tablo = database.tablos[i]
        if (!tablo.Sources)
        { console.warn('Tablo without source', tablo) }
        else {
            const verifiedSources = [ 'EMLEKKONYV', 'SCAN' ]
            for (let i = 0; i < tablo.Sources.length; i++) {
                const source = tablo.Sources[i]
                if (!verifiedSources.includes(source)) {
                    console.warn('Tablo with unverified source', tablo)
                    break
                }
            }
        }
        if (tablo.Type === 'TECHNICAL' || tablo.Type === 'POSSIBLY_TECHNICAL')
        { if (tablo.Department === 'Ismeretlen') console.warn(`Unknown department ${tablo.Department}`, tablo) }
        // if (typeof tablo.Ofo === 'number') if (database.teachers[tablo.Ofo ?? -1] === undefined)
        // { console.warn(`Unknown teacher ${tablo.Ofo}`, tablo) }
        if (!tablo.Ofo) console.warn(`Unknown teacher ${tablo.Ofo}`, tablo)
        if (!tablo.Image)
        { console.warn(`Tablo without image`, tablo) }
        if (!tablo.FinishedAt)
        { console.warn(`Tablo without finishing date`, tablo) }
        else if ((tablo.FinishedAt ?? 0) < 1950)
        { console.warn(`Tablo with finishing date before 1950`, tablo) }
        if (!tablo.StartedAt)
        { console.warn(`Tablo without starting date`, tablo) }
        else if ((tablo.StartedAt ?? 0) < 1950)
        { console.warn(`Tablo with starting date before 1950`, tablo) }
        if (tablo.Grade.Grade == -1)
        { console.warn(`Tablo without grade number`, tablo) }
        if (tablo.Grade.Grade == 0)
        { console.warn(`Tablo without grade number`, tablo) }
        if (tablo.Grade.Sub === null || tablo.Grade.Sub == "")
        { console.warn(`Tablo without sub-grade`, tablo) }
        for (let j = 0; j < database.tablos.length; j++) {
            if (i === j) continue
            const otherTablo = database.tablos[j]
            if (tablo.Image == otherTablo.Image && tablo.Image !== 'No Image' && tablo.Image)
            { console.warn('Tablo image used more than once', tablo, otherTablo) }
            if (tablo.StartedAt && tablo.StartedAt == otherTablo.StartedAt)
            {
                if (tablo.Grade.Grade && otherTablo.Grade.Grade &&
                    tablo.Grade.Sub && otherTablo.Grade.Sub &&
                    tablo.Grade.Grade == otherTablo.Grade.Grade &&
                    tablo.Grade.Sub == otherTablo.Grade.Sub) {
                    console.warn(`Tablo conflict`, tablo, otherTablo)
                }
                if (tablo.Ofo && otherTablo.Ofo) {
                        tablo.Ofo.forEach(ofo1 => {
                            otherTablo.Ofo?.forEach(ofo2 => {
                                if (ofo1.trim() === ofo2.trim()) {
                                    console.log(`Same teacher at the same time`, tablo, otherTablo)
                                }
                            })
                        })
                }
            }
        }
    }
}