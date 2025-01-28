'use strict'

const MINE = '💥'
const MARK = '🚩'

const NORMAL = '🙂'
const LOSE = '😤'
const WIN = '😎'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    coverdCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLives = 3

function onInit() {
    gGame.isOn = true
    gBoard = buildBoard(gLevel.SIZE)
    console.table(gBoard)

    renderBoard(gBoard)

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
            gGame.coverdCount++
        }
    }

    return board
}

function renderBoard(board) {

    var strHTML = `<table><thead>
                   <div><th>${gGame.secsPassed}</th>
                   <th colspan="2"><button onclick="onReset(this)">${NORMAL}</button></th>
                   <th>${gLives}</th></div>
                   </thead><tbody>`
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            strHTML += `<td class="cell cell${i}-${j}"`

            if (currCell.isMine) {
                const classMine = ' mine'
                strHTML += classMine
            }

            strHTML += ` onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, event, ${i}, ${j})"><span></span></td>`
        }

        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>'

    const elBoardContainer = document.querySelector('.board-container')
    elBoardContainer.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {

    if (isFirstClicked()) {
        // placeMines(gLevel.MINES)
        gBoard[2][1].isMine = true
        gBoard[3][3].isMine = true
        minesNeg(gBoard)
    }

    if (elCell.classList.contains("cellClicked")) return

    const cell = gBoard[i][j]

    if (cell.isMarked) return

    elCell.classList.add("cellClicked")
    cell.isCovered = false

    // console.table(gBoard)

    if (cell.isMine) {
        if (gLives > 1) {
            mineWithLife(elCell)
            cell.isCovered = true
            countCoverdCell()
            gLives--
        } else {
            gameOver(LOSE)

            elCell.children[0].innerText = MINE
            elCell.style = 'background-color: darkred;'

            unveilAllMines()

        }

    } else if (cell.minesAroundCount > 0) {
        elCell.children[0].innerText = cell.minesAroundCount

    } else {
        expandUncover(i, j)
    }
    countCoverdCell()
    checkGameOver()
}

function onCellMarked(elCell, ev, i, j) {
    // console.dir(ev)
    ev.preventDefault()
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    checkGameOver()
    elCell.children[0].innerText = MARK
}

function checkGameOver() {
    const mines = gLevel.MINES

    const mineMarked = gGame.markedCount
    const coverdCell = gGame.coverdCount


    if (mines === mineMarked && coverdCell - mines === 0) {
        gameOver(WIN)
    } else {
        return
    }
}

function gameOver(emoji) {

    gGame.isOn = false

    console.log('game over')
}

function expandUncover(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j > gBoard[i].length - 1) continue
            if (i === rowIdx && j === colIdx) continue

            var currPlace = gBoard[i][j]
            currPlace.isCovered = false
            var minesAroundNums = currPlace.minesAroundCount
            if (minesAroundNums === 0) minesAroundNums = ' '

            var elCell = document.querySelector(`.cell${i}-${j}`)
            elCell.classList.add("cellClicked")
            elCell.children[0].innerText = minesAroundNums
        }
    }
}

function mineWithLife(elCell) {
    elCell.children[0].innerText = MINE
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
    console.log(nonMineCells)

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

function isFirstClicked() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var elCell = document.querySelector(`.cell${i}-${j}`)
            if (elCell.classList.contains("cellClicked")) return false
        }
    }
    return true
}

function countCoverdCell() {
    var count = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isCovered) count++
        }
    }
    gGame.coverdCount = count
    console.log(gGame.coverdCount)
}

function onReset(elBtn){
    onInit()
}