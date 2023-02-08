/** @type {NodeListOf<HTMLInputElement>} */
const allInputs = document.querySelectorAll('input[type=text]')
allInputs.forEach(input => { input.addEventListener("keydown", (e) => { if (e.keyCode == 65 && e.ctrlKey) e.target.select() }) })