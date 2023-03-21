export namespace RawTypes {
    export interface BaseClass {
        /** ie. 11 C */
        Grade: Grade

        /** Year number */
        StartedAt?: number
        /** Year number */
        FinishedAt: number

        /** Ofo(s) name */
        Ofo?: string | string[]

        Sources?: string[]

        FurtherEducation?: Class
    }

    export interface SimpleClass extends BaseClass {
        Type: 'SCHOOL'
        Department?: string
        Students?: string[]
    }

    export interface TechnicalClass extends BaseClass {
        Type?: 'TECHNICAL'
        /** Department ID */
        Department?: string
        Students?: string[]
        Groups?: {
            Students: string[]
            Department: string
        }[]
    }

    export type Class = TechnicalClass | SimpleClass

    export type BasicTablo = { /** Image URL */ Image?: string; IsCube: undefined }
    export type CubeTablo = { /** Cube image URLs */ Cube: string[]; IsCube: true }

    export type Tablo =
        Class &
        (BasicTablo | CubeTablo)
        & { NotScanned?: true }
}

export interface Teacher {
    ID: number
    Name: string
    OfoAssignment: {
        /** Year */
        From: number
        /** Year */
        To: number
        Class: Grade
        TabloID?: number
        TabloReadableID?: string
    }[]
}

/*
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
*/

export interface Grade {
    /** ie. 12 or 2/14 */
    Grade: number | string
    /** ie. C */
    Sub: string | null
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

    /** Ofos */
    Ofo: string[] | null

    Sources?: string[]

    FurtherEducation?: Class
}

export interface SimpleClass extends BaseClass {
    Type: 'SCHOOL'
    Department?: string
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

export type BasicTablo = {/** Image URL */ Image?: string; IsCube: false }
export type CubeTablo = {/** Cube image URLs */ Cube: string[]; IsCube: true }

export type Tablo = Class & (BasicTablo | CubeTablo) & {
    /** Tablo index */
    ID?: number
    IsScanned?: boolean

    /** YEAR_GRADE_SUBGRADE */
    IDReadable: string
}

export type CheckedTablo = Tablo & {
    Issues: string[]
}

export type BaseData = {
    Principals: Principal[]
    /** Year number */
    StartYear: number
}