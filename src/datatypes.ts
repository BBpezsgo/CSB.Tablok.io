export type Tablo =
{
    evfolyam:
    {
        evfolyam: number
        alevfolyam: string
    }
    vegzett: number // Évszám
    ofo: number  // => Tanár.id
    szak: number // => Szak.id
    diakok: Name[]
}

export type Name =
{
    vezeteknev: string[]
    keresztnev: string[]
}

export type Tanar =
{
    id: number
    nev: Name
}

export type Szak =
{
    id: number
    nev: string
}
