'use strict'

function onMode(elBtn) {
    if (elBtn.innerText === 'Dark') {
        darkMode(elBtn)
    } else {
        lightMode(elBtn)
    }
}

function darkMode(elBtn) {
    elBtn.innerText = 'Light'

    document.querySelector('body').style =
        'background-color: black; color: lightblue'
    document.querySelector('.lives').classList.toggle('dark-mode')
}

function lightMode(elBtn) {
    elBtn.innerText = 'Dark'

    document.querySelector('body').style =
        'background-color: lightgray; color: black'
    document.querySelector('.lives').classList.toggle('dark-mode')
}
