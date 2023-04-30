// @ts-nocheck

function GetElements() {
    return {
        year: document.getElementById('filter-year'),
        grade: {
            grade: document.getElementById('filter-grade'),
            sub: document.getElementById('filter-grade-sub'),
        },
        ofo: document.getElementById('filter-ofo'),
        student: document.getElementById('filter-student'),
    }
}

function GetElementValues() {
    return {
        /** @type {number} */
        year: document.getElementById('filter-year').valueAsNumber,
        grade: {
            /** @type {number} */
            grade: document.getElementById('filter-grade').valueAsNumber,
            /** @type {string} */
            sub: document.getElementById('filter-grade-sub').value.toUpperCase(),
        },
        /** @type {string} */
        ofo: document.getElementById('filter-ofo').value,
        /** @type {string} */
        student: document.getElementById('filter-student').value,
    }
}

/**
 * @param {string} v
 */
function NormalizeString(v) {
    return v.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function Filter(iteration = 0) {
    if (iteration >= 2) {
        if (window.RefreshTablos) window.RefreshTablos()
        return
    }

    /** @type {import('./filter').DataBase} */
    const database = window.Database

    const filters = GetElementValues()

    let haveFilter = false

    if (filters.year.toString() !== 'NaN') haveFilter = true
    if (filters.ofo.trim().length > 0) haveFilter = true
    if (filters.student.trim().length > 0) haveFilter = true
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
        element.style.display = ''
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

        if (filters.year) if (filters.year !== tablo.FinishedAt) {
            hide()
            continue
        }

        if (filters.grade.grade) if (tablo.Grade.Grade.toString() !== filters.grade.grade.toString().trim()) {
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
            if (!tablo.Ofo.join(',').toLowerCase().includes(filters.ofo.trim().toLowerCase())) {
                hide()
                continue
            }
        }

        if (filters.student && filters.student.trim().length > 0) {
            if (!tablo.Students) {
                hide()
                continue
            }
            const normalizedFilterStudent = NormalizeString(filters.student.trim().toLowerCase())
            let studentFound = false
            for (let j = 0; j < tablo.Students.length; j++) {
                const student = NormalizeString(tablo.Students[j].trim().toLowerCase())
                if (student.includes(normalizedFilterStudent)) {
                    studentFound = true
                    break
                }
            }
            if (!studentFound) {
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

function ResetFilter() {
    const elements = GetElements()

    elements.year.value = ''
    elements.grade.grade.value = ''
    elements.grade.sub.value = ''
    elements.ofo.value = ''
    elements.student.value = ''

    Filter()
}