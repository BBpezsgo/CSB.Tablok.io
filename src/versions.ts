import { DataBase } from "./database"
import * as Utilities from "./utilities"

export async function Main(database: DataBase) {
    const versions = database.versions
    const container = Utilities.GetElement('versions')
    for (let i = 0; i < versions.length; i++) {
        const version = versions[i]
        container.appendChild(await Utilities.TemplateAsync('version', version))
    }
}