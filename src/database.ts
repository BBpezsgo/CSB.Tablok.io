import { Tablo, RawTypes, Class, BaseData, SchoolStatusData, Teacher } from "./database-types"

export class DataBase {
    readonly tablos: Tablo[]
    readonly departments: string[]
    readonly base: BaseData
    readonly teachers: Teacher[]
    readonly versions: any[]

    private ProcessClass(raw: RawTypes.Class, logs: boolean = false): Class {
        let schoolStatusData: SchoolStatusData = {

        }

        let hasPrincipal = false
        for (let j = 0; j < this.base.Principals.length; j++) {
            const principal = this.base.Principals[j]
            if (!principal.To) principal.To = new Date(Date.now()).getFullYear()

            if (principal.From <= raw.FinishedAt && principal.To > raw.FinishedAt) {
                schoolStatusData.CurrentPrincipal =  this.base.Principals[j]
                hasPrincipal = true
                break
            }
        }

        if (!hasPrincipal)
        if (logs) console.warn('Year without principal', raw.FinishedAt)

        const hasDepartment = raw.Type === 'TECHNICAL' || raw.Type === undefined

        let processedClass: Class = hasDepartment ? {
            ...schoolStatusData,

            StartedAt: raw.StartedAt ?? 0,
            FinishedAt: raw.FinishedAt,
            Grade: raw.Grade,

            Ofo: null,

            Students: raw.Students ?? null,
            Groups: raw.Groups ?? null,
            Type: raw.Type ? 'TECHNICAL' : 'POSSIBLY_TECHNICAL',
            Department: raw.Department ? raw.Department.toString() : 'Ismeretlen',

            Sources: raw.Sources,

            FurtherEducation: (raw.FurtherEducation) ? this.ProcessClass(raw.FurtherEducation, logs) : undefined,
        } : {
            ...schoolStatusData,

            StartedAt: raw.StartedAt ?? 0,
            FinishedAt: raw.FinishedAt,
            Grade: raw.Grade,

            Ofo: null,

            Students: raw.Students ?? null,
            Type: 'SCHOOL',
            Department: raw.Department ? raw.Department.toString() : undefined,

            Sources: raw.Sources,
            
            FurtherEducation: (raw.FurtherEducation) ? this.ProcessClass(raw.FurtherEducation, logs) : undefined,
        }

        if (raw.Ofo) {
            if (typeof raw.Ofo === 'string') processedClass.Ofo = [ raw.Ofo.trim() ]
            else processedClass.Ofo = raw.Ofo

            for (let ofo of processedClass.Ofo) {
                if (this.GetTeacher(ofo) === -1) this.teachers.push({
                    ID: this.teachers.length,
                    Name: ofo,
                    OfoAssignment: [],
                })
            }
        }

        if (raw.FurtherEducation && processedClass.FurtherEducation) if (raw.FurtherEducation.Ofo) {
            if (typeof raw.FurtherEducation.Ofo === 'string') processedClass.FurtherEducation.Ofo = [ raw.FurtherEducation.Ofo.trim() ]
            else processedClass.FurtherEducation.Ofo = raw.FurtherEducation.Ofo

            for (let ofo of processedClass.FurtherEducation.Ofo) {
                if (this.GetTeacher(ofo) === -1) this.teachers.push({
                    ID: this.teachers.length,
                    Name: ofo,
                    OfoAssignment: [],
                })
            }
        }

        if (!raw.StartedAt && raw.Grade.Grade) {
            if (typeof raw.Grade.Grade === 'number' && raw.Grade.Grade >= 9) {
                processedClass.StartedAt = raw.FinishedAt - (raw.Grade.Grade - 8)
                if (logs) console.log(`Tablo without starting date, calculating from grade number: ${raw.FinishedAt} - ${raw.Grade.Grade - 8} = ${raw.StartedAt}`, raw)
            } else if (typeof raw.Grade.Grade === 'string' && raw.Grade.Grade.includes('/')) {
                const n = Number.parseInt(raw.Grade.Grade.split('/')[1])
                processedClass.StartedAt = raw.FinishedAt - (n - 8)
                if (logs) console.log(`Tablo without starting date, calculating from grade number: ${raw.FinishedAt} - ${n - 8} = ${raw.StartedAt}`, raw)
            }
        }
        
        return processedClass
    }

    private ProcessTablo(raw: RawTypes.Tablo, logs: boolean = false): Tablo {
        if (raw.IsCube) {
            return {
                ...this.ProcessClass(raw, logs),
                Cube: raw.Cube,
                BadQuality: raw.BadQuality,
                IsCube: true,
                IDReadable: `${raw.FinishedAt}_${raw.Grade.Grade.toString().replace('/', '-')}_${raw.Grade.Sub}`,
            }
        } else {
            return {
                ...this.ProcessClass(raw, logs),
                Image: raw.Image ? encodeURI(raw.Image.trim()) : undefined,
                BadQuality: raw.Image ? (raw.BadQuality) : undefined,
                IsCube: false,
                IDReadable: `${raw.FinishedAt}_${raw.Grade.Grade.toString().replace('/', '-')}_${raw.Grade.Sub}`,
            }
        }
    }

    constructor(tablos: (RawTypes.Tablo|string)[], departments: string[], base: BaseData, versions: any[], logs: boolean) {
        this.tablos = []
        this.departments = departments
        this.base = base
        this.teachers = []
        this.versions = []

        this.base.Principals = this.base.Principals.sort((a, b) => a.From - b.From)
        
        for (let i = 0; i < versions.length; i++) {
            const version = versions[i]
            this.versions.push(version)
        }
        try { this.versions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) }
        catch (error) { console.error(error) }

        // Some data processing stuff
        for (let i = 0; i < tablos.length; i++)
        {
            const raw = tablos[i]
            if (typeof raw === 'string') continue
            this.tablos.push(this.ProcessTablo(raw, logs))
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
            if (tablo.Ofo && tablo.StartedAt !== 0 && tablo.Grade.Grade !== 0 && tablo.Grade.Sub) {
                for (let ofo of tablo.Ofo) {
                    const ofoRef = this.GetTeacher(ofo)
                    if (ofoRef === -1) continue
                    this.teachers[ofoRef].OfoAssignment.push({
                        From: tablo.StartedAt,
                        To: tablo.FinishedAt,
                        Class: tablo.Grade,
                        TabloID: tablo.ID ?? undefined,
                        TabloReadableID: `${tablo.FinishedAt}_${tablo.Grade.Grade.toString().replace('/', '-')}_${tablo.Grade.Sub}`,
                    })
                }
            }

            if (tablo.FurtherEducation) if (tablo.FurtherEducation.Ofo && tablo.FurtherEducation.StartedAt !== 0 && tablo.FurtherEducation.Grade.Grade !== 0 && tablo.FurtherEducation.Grade.Sub) {
                for (let ofo of tablo.FurtherEducation.Ofo) {
                    const ofoRef = this.GetTeacher(ofo)
                    if (ofoRef === -1) continue
                    this.teachers[ofoRef].OfoAssignment.push({
                        From: tablo.FurtherEducation.StartedAt,
                        To: tablo.FurtherEducation.FinishedAt,
                        Class: tablo.FurtherEducation.Grade,
                    })
                }
            }
        }

        this.teachers.sort((a, b) => a.Name.replace('† ', '').localeCompare(b.Name.replace('† ', '')))
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
