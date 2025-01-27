'use strict'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = buildBoard(gLevel.SIZE)
    console.table(gBoard)

}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false
            }

            if (i === 2 && j === 1 || i === 3 && j === 3) {
                board[i][j].isMine = true
            }
        }
    }
    return board
}

function renderBoard(board) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for(var j = 0; j < board[i].length; j++){
            var currCell = board[i][j]

            if(currCell.isMine){
                const className = `cell `
            }
        }
    }

}