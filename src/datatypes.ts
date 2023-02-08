import * as Utilities from './utilities'

export type Tablo =
{
    Grade:
    {
        /** e.g: 10, 11, 12 */
        Grade: number
        /** e.g: A, B, C */
        Sub: string
    }
    /** e.g: 2017 */
    FinishedAt: number
    Ofo: number
    Department: number
    Students: Name[]

    ImgURL: string
}

export type TabloProcessed = Tablo & {
    OfoText: Name | null
    DepartmentText: string
}

export type Teacher = {
    ID: string
    Name: Name
}

export class Name
{
    Surname: string[]
    Firstname: string[]

    constructor() {
        this.Surname = []
        this.Firstname = []
    }
    
    ToString(): string { return (this.Surname ?? []).join(' ') + ' ' + (this.Firstname ?? []).join(' ') }
}

export class DataBase {
    readonly tablos: TabloProcessed[]
    readonly teachers: Teacher[]
    readonly departments: string[]

    constructor(tablos: Tablo[], teachers: Teacher[], departments: string[]) {
        this.tablos = []
        this.teachers = teachers
        this.departments = departments
        
        for (let i = 0; i < this.teachers.length; i++) teachers[i] = Object.assign(new Name(), teachers[i])
        for (let i = 0; i < tablos.length; i++) Utilities.AssignObjects(tablos[i].Students, () => new Name())

        for (let i = 0; i < tablos.length; i++)
        {
            const tablo: Tablo = tablos[i]
            this.tablos.push({
                Department: tablo.Department,
                FinishedAt: tablo.FinishedAt,
                Students: tablo.Students,
                Ofo: tablo.Ofo,
                ImgURL: tablo.ImgURL,
                Grade: tablo.Grade,

                DepartmentText: departments[tablo.Department] ?? `Unknown Department Index ${tablo.Department}`,
                OfoText: teachers[tablo.Ofo] ? teachers[tablo.Ofo].Name : null,
            })
        }
    }
}
