export namespace RawTypes {
    export interface BaseClass {
        /** ie. 11 C */
        Grade: Grade

        /** Year number */
        StartedAt?: number
        /** Year number */
        FinishedAt: number

        /** Ofo ID or name */
        Ofo?: number | string | string[]

        Sources?: string[]
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

export interface Grade {
    /** ie. 11 */
    Grade: number | string
    /** ie. C */
    Sub: string
}

export interface Principal {
    Name: string | null
    From: number
    To?: number
}

export interface SchoolStatusData {
    CurrentPrincipal?: Principal
}

export interface BaseClass extends SchoolStatusData {
    /** ie. 11 C */
    Grade: Grade

    /** Year number */
    StartedAt: number
    /** Year number */
    FinishedAt: number

    /** Ofo ID or name */
    Ofo: string[] | null
    /** Ofo name reference */
    OfoReference: Teacher | null

    Sources?: string[]
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

export type CheckedTablo = Tablo & {
    Issues: string[]
}

export type BaseData = {
    Principals: Principal[]
    /** Year number */
    StartYear: number
}