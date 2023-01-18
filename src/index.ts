import { Tablo, Tanar, Name, Szak } from "./datatypes"

function Get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                resolve(JSON.parse(req.response))
            }
        }
        req.onerror = (e) => {
            reject(e)
        }
        req.open('GET', url)
        try {
            req.send()
        } catch (error) { reject(error) }
    })
}

function CreateElement(htmlString: string): Element {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    const result = div.firstElementChild
    if (!result) { throw "wtf" }
    return result
  }

async function Main() {
    const tablos: Tablo[] = await Get('./database/tablos.json')
    const teachers: Tanar[] = await Get('./database/teachers.json')
    console.log(tablos)
    console.log(teachers)

    const tablosElement = document.getElementById('tablos')
    if (!tablosElement) { return }
    for (let i = 0; i < tablos.length; i++) {
        const tablo = tablos[i]
        tablosElement.appendChild(CreateElement(`
            <div>
                <p>Évfolyam: ${tablo.evfolyam.evfolyam}/${tablo.evfolyam.alevfolyam}</p>
                <p>Szak: ${tablo.szak}</p>
                <p>Ofő: ${tablo.ofo}</p>
                <p>Végzett: ${tablo.vegzett}-ban/ben</p>
            </div>
        `))
    }
}

Main()