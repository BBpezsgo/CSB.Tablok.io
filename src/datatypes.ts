import * as Utilities from './utilities'

export type Tablo = {
    FinishedAt: number
    Grade: {
        Grade: number
        Sub: string
    }
    Type: 'SCHOOL' | 'TECHNICAL' | undefined
    Image: string | undefined
    Department: number | undefined
    Ofo: number | undefined
    Students: Name[] | undefined
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
        for (let i = 0; i < tablos.length; i++) {
            const tablo = tablos[i]
            if (tablo.Students) for (let j = 0; j < tablo.Students.length; j++) {
                tablo.Students[j] = new Name(tablo.Students[j].Firstname, tablo.Students[j].Surname)
            }
            tablos[i] = tablo
        }

        for (let i = 0; i < tablos.length; i++)
        {
            const tablo = tablos[i]
            
            this.tablos.push({
                Department: tablo.Department,
                FinishedAt: tablo.FinishedAt,
                Students: tablo.Students,
                Ofo: tablo.Ofo,
                Image: tablo.Image ? encodeURI(tablo.Image.trim()) : 'No Image',
                Grade: tablo.Grade,
                Type: tablo.Type,
                DepartmentText: departments[tablo.Department ?? -1] ?? `Unknown Department Index ${tablo.Department}`,
                OfoText: teachers[tablo.Ofo ?? -1] ? teachers[tablo.Ofo ?? -1].Name : new Name(`Unknown Teacher ID ${tablo.Ofo}`),
            })
        }
    }
}
