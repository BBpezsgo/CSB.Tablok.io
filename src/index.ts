import { DataBase } from "./database"
import * as HTTP from './http'
import * as Utilities from './utilities'
import * as Checker from './checker'

declare global {
    interface Window {
        OpenTabloModal: (id: number) => void
        CloseTabloModal: () => void

        Database: DataBase

        DisplayOfoSuggestion: (name: string) => void

        RefreshTablos: () => void
    }
}

async function DownloadDatabase(logs: boolean) {
    // Download the raw JSON data (HTTP.GetAsync), and then process it (JSON.parse)
    const tablos: any[] = JSON.parse(await HTTP.GetAsync('./database/tablos.json'))
    const base: any = JSON.parse(await HTTP.GetAsync('./database/base.json'))
    const departments: string[] = JSON.parse(await HTTP.GetAsync('./database/departments.json'))

    return new DataBase(tablos, departments, base, logs)
}

/** Main function: this will be called when the document is loaded */
async function Main() {
    const urlPath = window.location.pathname.split('/')
    const filename = urlPath[urlPath.length-1]

    /** Database manager */
    var Database: DataBase
    try {
        // It tries to download the database from the JSON files
        Database = await DownloadDatabase(filename === 'check.html')
    } catch (error: any) {
        console.error('Failed to download the database', error)
        return
    }

    Checker.CheckDatabase(Database, filename === 'check.html')

    window.Database = Database

    if (filename === 'check.html') {
        Checker.Main(Database)
        return
    }

    // Get the container elements
    const tablosElement = Utilities.TryGetElement('tablos-container')
    const teachersElement = Utilities.TryGetElement('teachers-list')

    // If "tablosElement" exists, it deletes its content
    if (tablosElement) Utilities.ClearElement(tablosElement)

    // If "tablosElement" exists, it fills up with some content
    if (tablosElement) {
        let container: HTMLElement | null = null
        let lastYearPanel: number = 0
        for (let i = 0; i < Database.tablos.length; i++) {
            const tablo = Database.tablos[i]

            if (tablo.IsCube) {
                if (lastYearPanel === 0) {
                    tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                    container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                    lastYearPanel = tablo.FinishedAt
                } else if (tablo.FinishedAt - lastYearPanel < -3) {
                    tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                    container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                    lastYearPanel = tablo.FinishedAt
                }

                const cubeTablo = {
                    ...tablo,
                    CubeImages: {
                        'image0': tablo.Cube[0],
                        'image1': tablo.Cube[1],
                        'image2': tablo.Cube[2],
                        'image3': tablo.Cube[3],
                        'image4': tablo.Cube[4],
                        'image5': tablo.Cube[5],
                    }
                }
            
                const newElement = Utilities.Template('cube-tablo', cubeTablo)
                container?.appendChild(newElement)

                continue
            }

            if (!tablo.Image) continue
            if (!tablo.IsScanned) continue

            try {
                if (await HTTP.CheckUrl('./img/tablos-lowres/' + tablo.Image) !== 200) continue
            } catch (error) { continue }

            if (lastYearPanel === 0) {
                tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                lastYearPanel = tablo.FinishedAt
            } else if (tablo.FinishedAt - lastYearPanel < -3) {
                tablosElement.appendChild(Utilities.Template('year-panel', { year: tablo.FinishedAt }))
                container = tablosElement.appendChild(Utilities.Template('tablo-container', {}))
                lastYearPanel = tablo.FinishedAt
            }
        
            const newElement = Utilities.Template('tablo', tablo)
            container?.appendChild(newElement)
        }
        tablosElement.appendChild(Utilities.Template('no-result', { }))
    }
    // If "teachersElement" exists, it fills up with some content
    if (teachersElement)
    for (let i = 0; i < Database.teachers.length; i++) {
        const teacher = Database.teachers[i]
        teachersElement.appendChild(Utilities.Template('teacher', teacher))
    }
    (()=>{
        const names: string[] = [ ]

        for (let i = 0; i < Database.tablos.length; i++) {
            const tablo = Database.tablos[i]
            if (!tablo.Ofo) continue
            for (let j = 0; j < tablo.Ofo.length; j++)
            { if (!names.includes(tablo.Ofo[j])) names.push(tablo.Ofo[j]) }
        }
        names.sort()

        const input = document.getElementById('filter-ofo') as HTMLInputElement
        const list = document.getElementById('filter-ofo-suggestions') as HTMLElement

        if (!input) return
        if (!list) return

        function CompareOfoSuggestion(a: string, b: string) {
            const aNorm = Utilities.NormalizeString(a)
            const bNorm = Utilities.NormalizeString(b)

            if (a.startsWith(bNorm)) return 1
            if (a.includes(bNorm)) return 2
            return Utilities.LevenshteinDistance(aNorm, bNorm)
        }

        function HideSuggestions() {
            list.innerHTML = ''
            list.style.display = 'none'
        }

        function UpdateSuggestions() {
            HideSuggestions()
            const value = input.value.toLowerCase()
            const normalizedValue = Utilities.NormalizeString(value)
            if (value == '') return
            const result: string[] = []
            for (let nameOriginal of names) {
                const name = nameOriginal.toLowerCase()
                const compared = CompareOfoSuggestion(name, value)
                if (compared < 3 || (compared < 20 && result.length < 8)) {
                    result.push(nameOriginal)
                }
            }

            result.sort((a, b) => CompareOfoSuggestion(a.toLowerCase(), value) - CompareOfoSuggestion(b.toLowerCase(), value))

            for (let item of result) {
                list.style.display = 'block'
                const newItem = document.createElement('li')
                newItem.setAttribute('onclick', 'DisplayOfoSuggestion(\'' + item + '\')')
                let word = ''
                if (item.toLowerCase().startsWith(normalizedValue)) {
                    word += '<b class=selectable>' + item.substring(0, normalizedValue.length) + '</b>'
                    word += item.substring(normalizedValue.length)
                } else if (item.toLowerCase().includes(normalizedValue)) {
                    const start = item.toLowerCase().indexOf(normalizedValue)
                    word += item.substring(0, start)
                    word += '<b class=selectable>' + item.substring(start, start + normalizedValue.length) + '</b>'
                    word += item.substring(start + normalizedValue.length)
                } else {
                    word += item
                }
                newItem.innerHTML = word
                list.appendChild(newItem)
            }
        }

        input.addEventListener('keyup', UpdateSuggestions)
        input.addEventListener('blur', ()=>{setTimeout(HideSuggestions, 1000)})
        input.addEventListener('focus', UpdateSuggestions)
        window.DisplayOfoSuggestion = (name: string) => {
            input.value = name
            HideSuggestions()
        }
    })()

    let TabloTimer: null | NodeJS.Timer = null

    window.OpenTabloModal = window.OpenTabloModal || ((id) => {
        window.document.body.classList.add('tablo-showing')

        if (TabloTimer) {
            clearInterval(TabloTimer)
            TabloTimer = null
        }

        const selectedTablo = Database.tablos[id]
        if (selectedTablo.IsCube) {
            Utilities.TemplateAsync('cube-tablo-modal', selectedTablo).then(modal => {
                window.document.body.appendChild(modal)

                const cubeContainer = document.getElementById('tablo-modal')?.getElementsByClassName('cube-tablo-modal')[0] as HTMLElement | undefined
                const cube = document.getElementById('tablo-modal')?.getElementsByClassName('cube')[0] as HTMLElement | undefined
                if (!cube || !cubeContainer) return

                const CubeRotation = {
                    X: 0,
                    Y: 0,
                    Z: 0,
                }

                const FixedCubeRotations = [
                    { //
                        X: 0,
                        Y: 0,
                        Z: 0,
                    },
                    { //
                        X: 0,
                        Y: 270,
                        Z: 0,
                    },
                    { //
                        X: 0,
                        Y: 180,
                        Z: 0,
                    },
                    { //
                        X: 0,
                        Y: 90,
                        Z: 0,
                    },
                    { //
                        X: 90,
                        Y: 0,
                        Z: 0,
                    },
                    { //
                        X: 270,
                        Y: 0,
                        Z: 0,
                    },
                ]
                let SelectedSideIndex = -1

                const cubeSides = cube.getElementsByTagName('div')
                cubeSides.item(0)?.addEventListener('click', () => {
                    setTimeout(() => SelectedSideIndex = 0, 50)
                    console.log(0)
                })
                cubeSides.item(1)?.addEventListener('click', () => {
                    setTimeout(() => SelectedSideIndex = 1, 50)
                    console.log(1)
                })
                cubeSides.item(2)?.addEventListener('click', () => {
                    setTimeout(() => SelectedSideIndex = 2, 50)
                    console.log(2)
                })
                cubeSides.item(3)?.addEventListener('click', () => {
                    setTimeout(() => SelectedSideIndex = 3, 50)
                    console.log(3)
                })
                cubeSides.item(4)?.addEventListener('click', () => {
                    setTimeout(() => SelectedSideIndex = 4, 50)
                    console.log(4)
                })
                cubeSides.item(5)?.addEventListener('click', () => {
                    setTimeout(() => SelectedSideIndex = 5, 50)
                    console.log(5)
                })

                cubeContainer.addEventListener('click', () => { SelectedSideIndex = -1 })

                TabloTimer = setInterval(() => {
                    if (SelectedSideIndex === -1) {
                        CubeRotation.X = CubeRotation.X + 1
                        CubeRotation.Y = CubeRotation.Y + 1
                        CubeRotation.Z = CubeRotation.Z + 1
                    } else {
                        const DiffDeg = function(degA: number, degB: number) {
                            const mod = (a: number, n: number) => { return a - Math.floor(a / n) * n} 
                            return mod((degA - degB + 180), 360) - 180
                        }

                        CubeRotation.X = CubeRotation.X - (DiffDeg(CubeRotation.X, FixedCubeRotations[SelectedSideIndex].X) * 0.2)
                        CubeRotation.Y = CubeRotation.Y - (DiffDeg(CubeRotation.Y, FixedCubeRotations[SelectedSideIndex].Y) * 0.2)
                        CubeRotation.Z = CubeRotation.Z - (DiffDeg(CubeRotation.Z, FixedCubeRotations[SelectedSideIndex].Z) * 0.2)
                    }

                    cube.style.transform = `rotateX(${CubeRotation.X}deg) rotateY(${CubeRotation.Y}deg)  rotateZ(${CubeRotation.Z}deg)`
                }, 100)
            })
        } else {
            Utilities.TemplateAsync('tablo-modal', selectedTablo).then(modal => {
                window.document.body.appendChild(modal)
            })
        }
    })
    window.CloseTabloModal = window.CloseTabloModal || (() => {
        window.document.body.classList.remove('tablo-showing')

        if (TabloTimer) {
            clearInterval(TabloTimer)
            TabloTimer = null
        }

        const modal = Utilities.TryGetElement('tablo-modal')
        if (!modal) return
        modal.remove()
    })

    if (tablosElement) {
        setTimeout(() => {
            const tabloElements = document.querySelectorAll('.tablo') as NodeListOf<HTMLElement>
            const unloadedTablos: string[] = []
            for (let i = 0; i < tabloElements.length; i++) unloadedTablos.push(tabloElements.item(i).id)
            
            const tabloCubeElements = document.querySelectorAll('.cube-tablo') as NodeListOf<HTMLElement>
            for (let i = 0; i < tabloCubeElements.length; i++) unloadedTablos.push(tabloCubeElements.item(i).id)

            const RefreshTablos = () => {
                for (let i = 0; i < tabloElements.length; i++) {
                    const tabloElement = tabloElements.item(i)
                    if (!unloadedTablos.includes(tabloElement.id)) continue

                    const position = tabloElement.getBoundingClientRect()

                    const isVisible = (position.top >= 0 && position.bottom <= window.innerHeight) || (position.top < window.innerHeight && position.bottom >= 0)
                
                    if (isVisible) {
                        if (!tabloElement.classList.contains('tablo-unloaded')) continue
                        tabloElement.classList.remove('tablo-unloaded')
                        const tabloId = Number.parseInt(tabloElement.id.split('-')[1])
                        const tablo = Database.tablos[tabloId]
                        if (!tablo.IsCube) if (tablo.Image) tabloElement.style.backgroundImage = `url(img/tablos-lowres/${tablo.Image})`
                    } else {
                        if (tabloElement.classList.contains('tablo-unloaded')) continue
                        tabloElement.style.backgroundImage = 'url(#)'
                        tabloElement.classList.add('tablo-unloaded')
                    }
                }
                
                for (let i = 0; i < tabloCubeElements.length; i++) {
                    const tabloElement = tabloCubeElements.item(i)
                    if (!unloadedTablos.includes(tabloElement.id)) continue

                    const position = tabloElement.getBoundingClientRect()

                    const isVisible = (position.top >= 0 && position.bottom <= window.innerHeight) || (position.top < window.innerHeight && position.bottom >= 0)
                
                    if (isVisible) {
                        if (!tabloElement.classList.contains('tablo-unloaded')) continue
                        tabloElement.classList.remove('tablo-unloaded')

                        const tabloId = Number.parseInt(tabloElement.id.split('-')[1])
                        const tablo = Database.tablos[tabloId]
                        if (tablo.IsCube) {
                            const sideElements = tabloElement.getElementsByClassName('cube-side') as HTMLCollectionOf<HTMLElement>
                            for (let i = 0; i < tablo.Cube.length; i++) {
                                if (i >= sideElements.length) break
                                const sideElement = sideElements.item(i)
                                if (!sideElement) continue
                                const image = tablo.Cube[i]
                                sideElement.style.backgroundImage = `url(img/tablos-lowres/${image})`
                            }
                        }
                    } else {
                        if (tabloElement.classList.contains('tablo-unloaded')) continue
                        tabloElement.classList.add('tablo-unloaded')
                        
                        const sideElements = tabloElement.getElementsByClassName('cube-side') as HTMLCollectionOf<HTMLElement>
                        for (let i = 0; i < sideElements.length; i++) {
                            const sideElement = sideElements.item(i)
                            if (!sideElement) continue
                            sideElement.style.backgroundImage = `url(#)`
                        }
                    }
                }
            }

            window.RefreshTablos = RefreshTablos
            window.addEventListener('scroll', RefreshTablos)
            RefreshTablos()
        }, 1000)
    }
}

document.addEventListener('DOMContentLoaded', () => { Main() })
