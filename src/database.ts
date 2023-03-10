import { Tablo, RawTypes, Class, BaseData, SchoolStatusData, Teacher } from "./database-types"

export class DataBase {
    readonly tablos: Tablo[]
    readonly departments: string[]
    readonly base: BaseData
    readonly teachers: Teacher[]

    constructor(tablos: (RawTypes.Tablo|string)[], departments: string[], base: BaseData, logs: boolean) {
        this.tablos = []
        this.departments = departments
        this.base = base
        this.teachers = []

        this.base.Principals = this.base.Principals.sort((a, b) => a.From - b.From)
        
        // This converts objects into class instances
        // for (let i = 0; i < this.teachers.length; i++) teachers[i].Name = new Name(teachers[i].Name.Surname, teachers[i].Name.Firstname)

        // Some data processing stuff
        for (let i = 0; i < tablos.length; i++)
        {
            const tablo = tablos[i]
            if (typeof tablo === 'string') continue

            let schoolStatusData: SchoolStatusData = {

            }

            let hasPrincipal = false
            for (let j = 0; j < this.base.Principals.length; j++) {
                const principal = this.base.Principals[j]
                if (!principal.To) principal.To = new Date(Date.now()).getFullYear()

                if (principal.From <= tablo.FinishedAt && principal.To > tablo.FinishedAt) {
                    schoolStatusData.CurrentPrincipal =  this.base.Principals[j]
                    hasPrincipal = true
                    break
                }
            }

            if (!hasPrincipal)
            if (logs) console.warn('Year without principal', tablo.FinishedAt)

            let processedClass: Class
            if (tablo.Type === 'TECHNICAL' || tablo.Type === undefined) {
                processedClass = {
                    ...schoolStatusData,

                    StartedAt: tablo.StartedAt ?? 0,
                    FinishedAt: tablo.FinishedAt,
                    Grade: tablo.Grade,

                    Ofo: null,

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
                    ...schoolStatusData,

                    StartedAt: tablo.StartedAt ?? 0,
                    FinishedAt: tablo.FinishedAt,
                    Grade: tablo.Grade,

                    Ofo: null,

                    Students: tablo.Students ?? null,
                    Type: 'SCHOOL',
                    Department: tablo.Department ? tablo.Department.toString() : undefined,

                    Sources: tablo.Sources,
                }
            }

            if (tablo.Ofo) {
                if (typeof tablo.Ofo === 'string') processedClass.Ofo = [ tablo.Ofo.trim() ]
                else processedClass.Ofo = tablo.Ofo

                if (processedClass.Ofo) for (let ofo of processedClass.Ofo) {
                    if (this.GetTeacher(ofo) === -1) this.teachers.push({
                        ID: this.teachers.length,
                        Name: ofo,
                        OfoAssignment: [],
                    })
                }
            }

            if (!tablo.StartedAt && tablo.Grade.Grade) {
                if (typeof tablo.Grade.Grade === 'number' && tablo.Grade.Grade >= 9) {
                    processedClass.StartedAt = tablo.FinishedAt - (tablo.Grade.Grade - 8)
                    if (logs) console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${tablo.Grade.Grade - 8} = ${tablo.StartedAt}`, tablo)
                } else if (typeof tablo.Grade.Grade === 'string' && tablo.Grade.Grade.includes('/')) {
                    const n = Number.parseInt(tablo.Grade.Grade.split('/')[1])
                    processedClass.StartedAt = tablo.FinishedAt - (n - 8)
                    if (logs) console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${n - 8} = ${tablo.StartedAt}`, tablo)
                }
            }
            
            const processedTablo: Tablo = {
                ...processedClass,
                Image: tablo.Image ? encodeURI(tablo.Image.trim()) : undefined,
                IsScanned: tablo.Image ? ((tablo.NotScanned === true) ? false : true) : undefined,
            }
            this.tablos.push(processedTablo)
        }
        this.tablos = this.tablos.sort((a, b) => {
            let result = b.FinishedAt - a.FinishedAt

            if (result === 0) {
                const subgrades = (grade: string | null) => {
                    if (!grade) return 0

                    if (grade.toUpperCase() === 'A') return 6
                    if (grade.toUpperCase() === 'B') return 5
                    if (grade.toUpperCase() === 'C') return 4
                    if (grade.toUpperCase() === 'D') return 3
                    if (grade.toUpperCase() === 'E') return 2
                    if (grade.toUpperCase() === 'F') return 1

                    return 0
                }

                const aGrade = subgrades(a.Grade.Sub)
                const bGrade = subgrades(b.Grade.Sub)

                return bGrade - aGrade
            }

            return result
        })

        this.AssignTabloIDs()

        for (let tablo of this.tablos) {
            if (!tablo.Ofo || tablo.StartedAt === 0 || tablo.Grade.Grade === 0 || !tablo.Grade.Sub) continue
            for (let ofo of tablo.Ofo) {
                const ofoRef = this.GetTeacher(ofo)
                if (ofoRef === -1) continue
                this.teachers[ofoRef].OfoAssignment.push({
                    From: tablo.StartedAt,
                    To: tablo.FinishedAt,
                    Class: tablo.Grade,
                    TabloID: tablo.ID ?? -1,
                })
            }
        }

        this.teachers.sort((a, b) => a.Name.localeCompare(b.Name))
    }

    GetTeacher(name: string) {
        for (let i = 0; i < this.teachers.length; i++)
        { if (this.teachers[i].Name.toLowerCase().trim() === name.toLowerCase().trim()) return i }
        return -1
    }

    private AssignTabloIDs() {
        for (let i = 0; i < this.tablos.length; i++) this.tablos[i].ID = i
    }
}
