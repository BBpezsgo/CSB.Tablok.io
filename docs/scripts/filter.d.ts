export class DataBase {
    readonly tablos: Tablo[]
    readonly departments: string[]
    readonly base: BaseData

    private AssignTabloIDs()
}

export type BaseData = {
    Principals: Principal[]
    /** Year number */
    StartYear: number
}

export interface SchoolStatusData {
    CurrentPrincipal?: Principal
}

export interface Principal {
    Name: string | null
    From: number
    To: number | 'STILL'
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
