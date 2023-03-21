window.HashManager = {
    UpdateHistory: function(/** @type {string} */ currentHash) {
        window.HashManager.LastHash.push(window.location.hash)
        window.location.hash = currentHash
    },
    GoBack: function(/** @type {boolean} */ heh) {
        if (window.HashManager.LastHash.length == 0) { return }
        const lastHash = window.HashManager.LastHash[window.HashManager.LastHash.length - 1]
        window.location.hash = lastHash
        window.HashManager.LastHash.pop()
    },
    InnerDocClick: false,
    LastHash: [],
    /** Browser back button was clicked */
    OnBackButton: function(/** @type {string} */ oldHash) {
        if (oldHash.startsWith('#tablo')) {
            window.CloseTabloModal()
            return
        }
    },
    RemoveHash: function() {
        window.HashManager.InnerDocClick = true
        history.pushState("", document.title, window.location.pathname + window.location.search)
    },
}

window.onhashchange = (/** @type {HashChangeEvent} */ e) => {
    const oldHash = new URL(e.oldURL).hash
    console.log('HashManager:', window.HashManager)
    console.log('Old Hash:', oldHash)
    console.log('New Hash:', new URL(e.newURL).hash)
    console.log('Hash:', window.location.hash)

    if (window.HashManager.InnerDocClick) {
        // In-page mechanism triggered the hash change
        window.HashManager.InnerDocClick = false
    } else { window.HashManager.OnBackButton(oldHash) }
}

document.onmouseover = () => { window.HashManager.InnerDocClick = true }
document.onmouseleave = () => { window.HashManager.InnerDocClick = false }
