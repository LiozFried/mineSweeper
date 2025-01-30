'use strict'

var gTimerInterval

function startTimer() {
    gTimerInterval = setInterval(timer, 1000)
}

function timer() {
    gGame.secsPassed++
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gGame.secsPassed
}

function resetTimer() {
    clearInterval(gTimerInterval)
    gGame.secsPassed = 0
    gTimerInterval = null

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gGame.secsPassed
}