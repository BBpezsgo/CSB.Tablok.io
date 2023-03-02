// #region Type definitions

export type Class = {
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
    /** Department ID */
    Department: number | string | undefined
    /** Ofo ID */
    Ofo: number | string | undefined
    Students: string[] | undefined
    Groups: {
        Students: string[]
        Department: number | string
    }[] | undefined
}

export type Tablo = Class & {
    /** Image URL */
    Image: string | undefined
}

export type ClassProcessed = {
    /** Year number */
    FinishedAt: number
    /** Year number */
    StartedAt: number
    /** ie. 11 C */
    Grade: {
        /** ie. 11 */
        Grade: number | string
        /** ie. C */
        Sub: string
    }
    Type: 'SCHOOL' | 'TECHNICAL' | null
    Department: string | null
    Ofo: string | null
    OfoReference: Teacher | null
    Students: string[] | null
    Groups: {
        Students: string[]
        Department: string | number
    }[] | null
}

export type TabloProcessed = ClassProcessed & {
    /** Image URL */
    Image: string | undefined
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

        // Some data processing stuff
        for (let i = 0; i < tablos.length; i++)
        {
            const tablo = tablos[i]
            let processedTablo: TabloProcessed = {
                Department: tablo.Department ? tablo.Department.toString() : null,
                StartedAt: tablo.StartedAt ?? 0,
                FinishedAt: tablo.FinishedAt,
                Ofo: null,
                Students: tablo.Students ?? null,
                Groups: tablo.Groups ?? null,
                Image: tablo.Image ? encodeURI(tablo.Image.trim()) : 'No Image',
                Type: tablo.Type ?? null,
                Grade: tablo.Grade,
                OfoReference: null,
            }

            if (tablo.Department) {
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
