const ELEMENTS = {
    'form-description': document.getElementById('feedback-form-desc'),
    'upload-spinner': document.getElementById('feedback-upload-spinner'),
    'form-upload': document.getElementById('feedback-upload-form'),
    'upload-done': document.getElementById('feedback-upload-done')
}

function Feedback() {
    const title = 'Visszajelzés'
    const desc = ELEMENTS["form-description"].value
    const spinner = ELEMENTS["upload-spinner"]

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        const state = {
            0: 'UNSENT',
            1: 'OPENED',
            2: 'HEADERS_RECEIVED',
            3: 'LOADING',
            4: 'DONE'
        }
        if (xhr.readyState == 4) {
            spinner.style.display = 'none'
        } else {
            spinner.style.display = 'block'
        }
    }
    xhr.open("POST", 'https://api.trello.com/1/cards/?idList=63ccefc1b6b3b4019949e079&token=84de6f5cbc9e3fb5df77596358352cc839e1dea58d8dbb0857919f39b6143acf&key=16160910964e82904e57646c84c9fb69&name=' + title + '&desc=' + desc, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send()
}

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    ELEMENTS["upload-done"].style.display = "block"
    ELEMENTS["form-upload"].style.display = "none"
})

function FeedbackGoBack() {
    ELEMENTS["upload-done"].style.display = "none"
    ELEMENTS["form-upload"].style.display = "block"
    ELEMENTS["form-description"].value = ''
}
