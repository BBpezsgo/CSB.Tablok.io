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

    constructor(surname: string | string[] | null = null, firstname: string | string[] | null = null) {
        this.Surname = []
        this.Firstname = []

        if (surname) {
            if (typeof surname === 'string') {
                this.Surname = [ surname ]
            } else {
                this.Surname = surname
            }
        }
        if (firstname) {
            if (typeof firstname === 'string') {
                this.Firstname = [ firstname ]
            } else {
                this.Firstname = firstname
            }
        }
    }
    
    ToString(): string { return ((this.Surname ?? []).join(' ') + ' ' + (this.Firstname ?? []).join(' ')).trim() }
}

export class DataBase {
    readonly tablos: TabloProcessed[]
    readonly teachers: Teacher[]
    readonly departments: string[]

    constructor(tablos: Tablo[], teachers: Teacher[], departments: string[]) {
        this.tablos = []
        this.teachers = teachers
        this.departments = departments
        
        for (let i = 0; i < this.teachers.length; i++) teachers[i].Name = new Name(teachers[i].Name.Firstname, teachers[i].Name.Surname)
        for (let i = 0; i < tablos.length; i++) for (let j = 0; j < tablos[i].Students.length; j++) tablos[i].Students[j] = new Name(tablos[i].Students[j].Firstname, tablos[i].Students[j].Surname)

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
                OfoText: teachers[tablo.Ofo] ? teachers[tablo.Ofo].Name : new Name(`Unknown Teacher ID ${tablo.Ofo}`),
            })
        }
    }
}
