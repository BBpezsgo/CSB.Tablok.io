// @ts-nocheck

function Filter() {
    /** @type {import('./filter').DataBase} */
    const database = window.Database

    /** @type {string} */
    const filter = document.getElementById('filter-ofo').value

    let haveFilter = false

    if (filter.trim().length > 0) haveFilter = true
    
    console.log(haveFilter)
    console.log(filter)

    for (let i = 0; i < database.teachers.length; i++) {
        const teacher = database.teachers[i]
        const element = document.getElementById('teacher-' + teacher.ID)        
        if (!element) continue
        element.style.display = 'inline-block'
        if (!haveFilter) continue

        if (filter && filter.trim().length > 0) if (!teacher.Name.toLowerCase().includes(filter.trim().toLowerCase())) {
            element.style.display = 'none'
            continue
        }
    }
}