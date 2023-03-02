
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

export type ClassBase = {
    /** Year number */
    FinishedAt: number
    /** ie. 11 C */
    Grade: {
        /** ie. 11 */
        Grade: number | string
        /** ie. C */
        Sub: string
    }
}

export type Class = ClassSimple | ClassTechnical

export type ClassSimple = ClassBase & {
    /** Year number */
    StartedAt: number | undefined
    Type: 'SCHOOL'
    /** Ofo ID */
    Ofo: number | string | undefined
    Students: string[] | undefined
}

export type ClassTechnical = ClassBase & {
    /** Year number */
    StartedAt: number | undefined
    Type: 'TECHNICAL' | undefined
    /** Department ID */
    Department: number | string
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
