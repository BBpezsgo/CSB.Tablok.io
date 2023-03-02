import { TabloProcessed } from "./database-processed-types"
import { Tablo, Teacher, Name } from "./database-types"

export class DataBase {
    readonly tablos: TabloProcessed[]
    readonly teachers: Teacher[]
    readonly departments: string[]

    constructor(tablos: Tablo[], teachers: Teacher[], departments: string[]) {
        this.tablos = []
        this.teachers = teachers
        this.departments = departments
        
        // This converts objects into class instances
        for (let i = 0; i < this.teachers.length; i++) teachers[i].Name = new Name(teachers[i].Name.Firstname, teachers[i].Name.Surname)

        // Some data processing stuff
        for (let i = 0; i < tablos.length; i++)
        {
            const tablo = tablos[i]
            let processedTablo: TabloProcessed
            if (tablo.Type === 'TECHNICAL' || tablo.Type === undefined) {
                processedTablo = {
                    Department: tablo.Department ? tablo.Department.toString() : null,
                    StartedAt: tablo.StartedAt ?? 0,
                    FinishedAt: tablo.FinishedAt,
                    Ofo: null,
                    Students: tablo.Students ?? null,
                    Groups: tablo.Groups ?? null,
                    Image: tablo.Image ? encodeURI(tablo.Image.trim()) : 'No Image',
                    Type: 'TECHNICAL',
                    Grade: tablo.Grade,
                    OfoReference: null,
                }
            } else {
                processedTablo = {
                    StartedAt: tablo.StartedAt ?? 0,
                    FinishedAt: tablo.FinishedAt,
                    Ofo: null,
                    Students: tablo.Students ?? null,
                    Image: tablo.Image ? encodeURI(tablo.Image.trim()) : 'No Image',
                    Type: 'SCHOOL',
                    Grade: tablo.Grade,
                    OfoReference: null,
                }
            }

            if (processedTablo.Type === 'TECHNICAL' && tablo.Type === 'TECHNICAL') {
                if (typeof tablo.Department === 'string') {
                    processedTablo.Department = tablo.Department
                } else {
                    processedTablo.Department = departments[tablo.Department ?? -1] ?? null
                }
            }

            if (tablo.Ofo) {
                if (typeof tablo.Ofo === 'string') {
                    processedTablo.OfoReference = null
                    processedTablo.Ofo = tablo.Ofo.trim()
                } else {
                    const ref: Teacher | undefined = teachers[tablo.Ofo ?? -1]
                    if (ref) {
                        processedTablo.OfoReference = ref
                        processedTablo.Ofo = ref.Name.ToString()
                    } else {
                        processedTablo.OfoReference = null
                        processedTablo.Ofo = null
                    }
                }
            }

            if (!tablo.StartedAt && tablo.Grade.Grade) {
                if (typeof tablo.Grade.Grade === 'number' && tablo.Grade.Grade >= 9) {
                    processedTablo.StartedAt = tablo.FinishedAt - (tablo.Grade.Grade - 8)
                    console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${tablo.Grade.Grade - 8} = ${tablo.StartedAt}`, processedTablo)
                } else if (typeof tablo.Grade.Grade === 'string' && tablo.Grade.Grade.includes('/')) {
                    const n = Number.parseInt(tablo.Grade.Grade.split('/')[1])
                    processedTablo.StartedAt = tablo.FinishedAt - (n - 8)
                    console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${n - 8} = ${tablo.StartedAt}`, processedTablo)
                }
            }
            
            this.tablos.push(processedTablo)
        }
        this.tablos = this.tablos.sort((a, b) => b.FinishedAt - a.FinishedAt)
    }
}
