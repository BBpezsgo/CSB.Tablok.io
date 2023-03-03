import { Tablo, Teacher, Name, RawTypes, Class } from "./database-types"

export class DataBase {
    readonly tablos: Tablo[]
    readonly departments: string[]

    constructor(tablos: (RawTypes.Tablo|string)[], departments: string[]) {
        this.tablos = []
        this.departments = departments
        
        // This converts objects into class instances
        // for (let i = 0; i < this.teachers.length; i++) teachers[i].Name = new Name(teachers[i].Name.Surname, teachers[i].Name.Firstname)

        // Some data processing stuff
        for (let i = 0; i < tablos.length; i++)
        {
            const tablo = tablos[i]
            if (typeof tablo === 'string') continue

            let processedClass: Class
            if (tablo.Type === 'TECHNICAL' || tablo.Type === undefined) {
                processedClass = {
                    StartedAt: tablo.StartedAt ?? 0,
                    FinishedAt: tablo.FinishedAt,
                    Grade: tablo.Grade,

                    Ofo: null,
                    OfoReference: null,

                    Students: tablo.Students ?? null,
                    Groups: tablo.Groups ?? null,
                    Type: tablo.Type ? 'TECHNICAL' : 'POSSIBLY_TECHNICAL',
                    Department: tablo.Department ? tablo.Department.toString() : 'Ismeretlen',

                    Sources: tablo.Sources,
                }

                if (typeof tablo.Department === 'number') 
                { processedClass.Department = departments[tablo.Department] ?? 'Ismeretlen' }

            } else {
                processedClass = {
                    StartedAt: tablo.StartedAt ?? 0,
                    FinishedAt: tablo.FinishedAt,
                    Grade: tablo.Grade,

                    Ofo: null,
                    OfoReference: null,

                    Students: tablo.Students ?? null,
                    Type: 'SCHOOL',

                    Sources: tablo.Sources,
                }
            }

            if (tablo.Ofo) {
                if (typeof tablo.Ofo === 'string') {
                    processedClass.Ofo = [ tablo.Ofo.trim() ]
                } else if (typeof tablo.Ofo === 'number') {
                    console.warn('No teacher specified', tablo.Ofo, tablo)
                    /*
                    const ref: Teacher | null = this.GetTeacher(tablo.Ofo ?? -1)
                    if (ref) {
                        processedClass.OfoReference = ref
                        processedClass.Ofo = ref.Name.ToString()
                    }
                    */
                } else {
                    processedClass.Ofo = tablo.Ofo
                }
            }

            if (!tablo.StartedAt && tablo.Grade.Grade) {
                if (typeof tablo.Grade.Grade === 'number' && tablo.Grade.Grade >= 9) {
                    processedClass.StartedAt = tablo.FinishedAt - (tablo.Grade.Grade - 8)
                    console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${tablo.Grade.Grade - 8} = ${tablo.StartedAt}`, tablo)
                } else if (typeof tablo.Grade.Grade === 'string' && tablo.Grade.Grade.includes('/')) {
                    const n = Number.parseInt(tablo.Grade.Grade.split('/')[1])
                    processedClass.StartedAt = tablo.FinishedAt - (n - 8)
                    console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${n - 8} = ${tablo.StartedAt}`, tablo)
                }
            }
            
            const processedTablo: Tablo = {
                ...processedClass,
                Image: tablo.Image ? encodeURI(tablo.Image.trim()) : undefined,
            }
            this.tablos.push(processedTablo)
        }
        this.tablos = this.tablos.sort((a, b) => b.FinishedAt - a.FinishedAt)

        this.AssignTabloIDs()
    }

    /*
    private GetTeacher(id: number) {
        for (let i = 0; i < this.teachers.length; i++) {
            const teacher = this.teachers[i]
            if (teacher.ID === id) return teacher
        }
        return null
    }
    */

    private AssignTabloIDs() {
        for (let i = 0; i < this.tablos.length; i++) this.tablos[i].ID = i
    }
}
