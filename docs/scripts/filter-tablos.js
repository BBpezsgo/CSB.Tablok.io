// @ts-nocheck

function Filter(iteration = 0) {
    if (iteration >= 2) {
        if (window.RefreshTablos) window.RefreshTablos()
        return
    }

    /** @type {import('./filter').DataBase} */
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
            sub: document.getElementById('filter-grade-sub').value.toUpperCase(),
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
    
    let noResult = haveFilter

    const yearElements = document.getElementsByClassName('year-panel')
    for (let i = 0; i < yearElements.length; i++) {
        const element = yearElements.item(i)
        if (!element) continue
        element.style.display = ''
    }

    for (let i = 0; i < database.tablos.length; i++) {
        const tablo = database.tablos[i]
        const element = document.getElementById('tablo-' + tablo.ID)        
        if (!element) continue
        element.style.display = 'unset'
        if (!haveFilter) continue

        const hide = () => {
            element.style.display = 'none'
            const container = element.parentElement
            if (!container) return

            const prev = container.previousElementSibling
            if (!prev) return

            const childs = container.children
            for (let i = 0; i < childs.length; i++) {
                const element = childs.item(i)
                if (!element) continue
                if (element.style.display !== 'none') {
                    prev.style.display = ''
                    return
                }
            }
            prev.style.display = 'none'
        }

        if (filters.year.start > tablo.StartedAt) {
            hide()
            continue
        }

        if (filters.year.end < tablo.FinishedAt) {
            hide()
            continue
        }

        if (filters.grade.grade.toString() !== 'NaN') if (tablo.Grade.Grade.toString() !== filters.grade.grade.toString().trim()) {
            hide()
            continue
        }
        if (filters.grade.sub.trim().length > 0)  if (tablo.Grade.Sub !== filters.grade.sub.trim()) {
            hide()
            continue
        }

        if (filters.ofo && filters.ofo.trim().length > 0) {
            if (!tablo.Ofo) {
                hide()
                continue
            }
            if (!tablo.Ofo.join(', ').toString().toLowerCase().includes(filters.ofo.trim().toLowerCase())) {
                hide()
                continue
            }
        }

        noResult = false
    }

    const noResultElement = document.getElementById('no-result')
    if (noResultElement) noResultElement.style.display = noResult ? '' : 'none'

    Filter(iteration + 1)
}