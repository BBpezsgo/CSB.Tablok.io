// #region Type definitions

export type Tablo = {
    /** Year number */
    FinishedAt: number
    /** Year number */
    StartedAt: number | undefined
    /** ie. 11 C */
    Grade: {
        /** ie. 11 */
        Grade: number | string
        /** ie. C */
        Sub: string
    }
    Type: 'SCHOOL' | 'TECHNICAL' | undefined
    /** Image URL */
    Image: string | undefined
    /** Department ID */
    Department: number | undefined
    /** Ofo ID */
    Ofo: number | undefined
    Students: Name[] | undefined
}

export type TabloProcessed = Tablo & {
    OfoReference: Name
    OfoText: string | null
    DepartmentText: string | null
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

// #endregion

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
        for (let i = 0; i < tablos.length; i++) {
            const tablo = tablos[i]
            if (tablo.Students) for (let j = 0; j < tablo.Students.length; j++) {
                tablo.Students[j] = new Name(tablo.Students[j].Firstname, tablo.Students[j].Surname)
            }
            tablos[i] = tablo
        }

        // Some data processing stuff
        for (let i = 0; i < tablos.length; i++)
        {
            const tablo = tablos[i]

            if (!tablo.StartedAt && tablo.Grade.Grade) {
                if (typeof tablo.Grade.Grade === 'number' && tablo.Grade.Grade >= 11) {
                    tablo.StartedAt = tablo.FinishedAt - tablo.Grade.Grade
                    console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${tablo.Grade.Grade} = ${tablo.StartedAt}`, tablo)
                } else if (typeof tablo.Grade.Grade === 'string' && tablo.Grade.Grade.includes('/')) {
                    const n = Number.parseInt(tablo.Grade.Grade.split('/')[1])
                    tablo.StartedAt = tablo.FinishedAt - n
                    console.log(`Tablo without starting date, calculating from grade number: ${tablo.FinishedAt} - ${n} = ${tablo.StartedAt}`, tablo)
                }
            }
            
            this.tablos.push({
                Department: tablo.Department,
                FinishedAt: tablo.FinishedAt,
                StartedAt: tablo.StartedAt,
                Students: tablo.Students,
                Ofo: tablo.Ofo,
                Image: tablo.Image ? encodeURI(tablo.Image.trim()) : 'No Image',
                Grade: tablo.Grade,
                Type: tablo.Type,
                DepartmentText: departments[tablo.Department ?? -1] ?? null,
                OfoReference: teachers[tablo.Ofo ?? -1] ? teachers[tablo.Ofo ?? -1].Name : new Name(`Unknown Teacher ID ${tablo.Ofo}`),
                OfoText: teachers[tablo.Ofo ?? -1] ? teachers[tablo.Ofo ?? -1].Name.ToString() : null,
            })
        }
        this.tablos = this.tablos.sort((a, b) => b.FinishedAt - a.FinishedAt)
    }
}
