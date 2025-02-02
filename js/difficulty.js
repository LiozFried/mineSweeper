'use strict'

function onBeginner(elBtn) {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gLevel.LEVEL = '4*4'

    resetTimer()
    onInit()
}

function onIntermediate(elBtn) {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gLevel.LEVEL = '8*8'

    resetTimer()
    onInit()
}

function onExpert(elBtn) {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    gLevel.LEVEL = '12*12'

    resetTimer()
    onInit()
}