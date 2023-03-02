import { ClassBase, Teacher } from "./database-types"

export type ClassTechnicalProcessed = ClassBase & {
    /** Year number */
    StartedAt: number
    Type: 'TECHNICAL'
    Department: string | null
    Ofo: string | null
    OfoReference: Teacher | null
    Students: string[] | null
    Groups: {
        Students: string[]
        Department: string | number
    }[] | null
}

export type ClassSimpleProcessed = ClassBase & {
    /** Year number */
    StartedAt: number
    Type: 'SCHOOL'
    Ofo: string | null
    OfoReference: Teacher | null
    Students: string[] | null
}

export type ClassProcessed = ClassSimpleProcessed | ClassTechnicalProcessed

export type TabloProcessed = ClassProcessed & {
    /** Image URL */
    Image: string | undefined
}