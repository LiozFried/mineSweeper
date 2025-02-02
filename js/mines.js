'use strict'

const MINE = '💥'
const MARK = '🚩'

function mineWithLife(elCell) {
    elCell.children[0].innerText = MINE
    gLives--
    renderLives()
    setTimeout(() => {
        elCell.classList.remove("cellClicked")
        elCell.children[0].innerText = ' '
    }, 700)
}

function unveilAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) {
                var elCell = document.querySelector(`.cell${i}-${j}`)
                // console.log(elCell)
                elCell.classList.add("cellClicked")
                elCell.children[0].innerText = MINE
            }
        }
    }
}

function minesNeg(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var minesAround = setMinesNegsCount(board, i, j)
            board[i][j].minesAroundCount = minesAround
        }
    }
}

function setMinesNegsCount(board, rowIdx, colIdx) {

    var countMinesNeg = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j > board[i].length - 1) continue
            if (i === rowIdx && j === colIdx) continue

            var currPlace = board[i][j]
            if (currPlace.isMine) countMinesNeg++
        }
    }
    return countMinesNeg
}

function placeMines(amount) {
    const nonMineCells = getNonMineCells()
    // console.log(nonMineCells)

    for (var i = 0; i < amount; i++) {
        var randIdx = getRandomInt(0, nonMineCells.length)
        var randPlace = nonMineCells.splice(randIdx, 1)[0]
        var rowIdx = randPlace.i
        var colIdx = randPlace.j

        gBoard[rowIdx][colIdx].isMine = true
    }

    console.table(gBoard)
}

function getNonMineCells() {
    const nonMineCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            const currCellLoc = { i, j }
            if (!currCell.isMine) {
                nonMineCells.push(currCellLoc)
            }
        }
    }

    return nonMineCells
}
