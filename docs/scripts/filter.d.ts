export class DataBase {
    readonly tablos: Tablo[]
    readonly teachers: Teacher[]
    readonly departments: string[]

    private GetTeacher(id: number)
    private AssignTabloIDs()
}

export namespace RawTypes {
    export interface BaseClass {
        /** ie. 11 C */
        Grade: Grade

        /** Year number */
        StartedAt?: number
        /** Year number */
        FinishedAt: number

        /** Ofo ID or name */
        Ofo?: number | string
    }

    export interface SimpleClass extends BaseClass {
        Type: 'SCHOOL'
        Students?: string[]
    }

    export interface TechnicalClass extends BaseClass {
        Type?: 'TECHNICAL'
        /** Department ID */
        Department?: number | string
        Students?: string[]
        Groups?: {
            Students: string[]
            Department: number | string
        }[]
    }

    export type Class = TechnicalClass | SimpleClass

    export type Tablo = Class & {
        /** Image URL */
        Image?: string
    }
}

export interface Teacher {
    ID: number
    Name: Name
}

export class Name
{
    Surname: string[]
    Firstname: string[]
    
    ToString(): string
}

export interface Grade {
    /** ie. 11 */
    Grade: number | string
    /** ie. C */
    Sub: string
}

export interface BaseClass {
    /** ie. 11 C */
    Grade: Grade

    /** Year number */
    StartedAt: number
    /** Year number */
    FinishedAt: number

    /** Ofo ID or name */
    Ofo: string | null
    /** Ofo name reference */
    OfoReference: Teacher | null
}

export interface SimpleClass extends BaseClass {
    Type: 'SCHOOL'
    Students: string[] | null
}

export interface TechnicalClass extends BaseClass {
    Type: 'TECHNICAL' | 'POSSIBLY_TECHNICAL'
    Department: string | 'Ismeretlen'
    Students: string[] | null
    Groups: {
        Students: string[]
        Department: string | number
    }[] | null
}

export type Class = SimpleClass | TechnicalClass   

export type Tablo = Class & {
    /** Image URL */
    Image?: string
    /** Tablo index */
    ID?: number
}
