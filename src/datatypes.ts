export type Tablo =
{
    grade:
    {
        /** e.g: 10, 11, 12 */
        grade: number
        /** e.g: A, B, C */
        sub: string
    }
    /** e.g: 2017 */
    finishedAt: number
    ofo: number
    department: number
    students: Name[]

    ofoText: Name | undefined
    departmentText: string | undefined
}

export class Name
{
    surname: string[]
    firstname: string[]

    constructor() {
        this.surname = []
        this.firstname = []
    }
    
    ToString(): string { return (this.surname ?? []).join(' ') + ' ' + (this.firstname ?? []).join(' ') }
}
