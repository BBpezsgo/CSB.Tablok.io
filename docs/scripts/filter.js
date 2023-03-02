// @ts-nocheck
// const { DataBase } = require("./filter")

function Filter() {
    /** @type {DataBase} */
    const database = window.Database

    const filters =  {
        year: {
            /** @type {number} */
            start: document.getElementById('filter-year-start').valueAsNumber,
            /** @type {number} */
            end: document.getElementById('filter-year-end').valueAsNumber,
        },
        grade: {
            /** @type {number} */
            grade: document.getElementById('filter-grade').valueAsNumber,
            /** @type {string} */
            sub: document.getElementById('filter-grade').value,
        },
        /** @type {string} */
        ofo: document.getElementById('filter-ofo').value,
    }

    let haveFilter = false

    if (filters.year.start !== 1986) haveFilter = true
    if (filters.year.end !== 2023) haveFilter = true
    if (filters.ofo.trim().length > 0) haveFilter = true
    if (filters.grade.grade.toString() !== 'NaN') haveFilter = true
    if (filters.grade.sub.trim().length > 0) haveFilter = true
    
    console.log(haveFilter)
    console.log(filters)

    for (let i = 0; i < database.tablos.length; i++) {
        const tablo = database.tablos[i]
        const element = document.getElementById('tablo-' + tablo.ID)        
        if (!element) continue
        element.style.display = 'unset'
        if (!haveFilter) continue

        const hide = () => { element.style.display = 'none'; console.log(element) }

        if (filters.year.start > tablo.StartedAt) {
            hide()
            continue
        }

        if (filters.year.end < tablo.FinishedAt) {
            hide()
            continue
        }

        if (filters.ofo && filters.ofo.trim().length > 0) {
            if (!tablo.Ofo) {
                hide()
                continue
            }
            if (!tablo.Ofo.toString().toLowerCase().includes(filters.ofo.trim().toLowerCase())) {
                hide()
                continue
            }
        }
    }
}