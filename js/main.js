'use strict'

const LIVES = '💓'
const HINTS = '💡'
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
var gHints = 3
var gIsHint

function onInit() {
    gGame.isOn = true
    gIsHint = false
    gBoard = buildBoard(gLevel.SIZE)
    console.table(gBoard)

    renderBoard(gBoard)
    renderLives()
    renderHints()

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
                   <div><th class="timer">${gGame.secsPassed}</th>
                   <th colspan="2"><button onclick="onReset(this)">${NORMAL}</button></th>
                   <th>${gLevel.SIZE}</th></div>
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

    if (!gGame.isOn) return
    
    if (!gIsHint){


    }

    if (isFirstClicked()) {
        // placeMines(gLevel.MINES)
        gBoard[2][1].isMine = true
        gBoard[3][3].isMine = true
        minesNeg(gBoard)
        startTimer()
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

        } else {
            gLives--
            renderLives()
            clearInterval(gTimerInterval)
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
    if (!gGame.isOn) return
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
    var elResetBtn = document.querySelector('th button')
    elResetBtn.innerText = emoji

    clearInterval(gTimerInterval)
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

function renderLives() {
    var elLives = document.querySelector('.lives span')
    var strHTML = ''
    if (gLives === 0) {
        strHTML += 0

    } else {
        for (var i = 0; i < gLives; i++) {
            strHTML += LIVES
        }
    }

    elLives.innerText = strHTML
}

function onReset(elBtn) {
    resetTimer()
    gLives = 3
    onInit()
}

function renderHints() {
    var elHints = document.querySelector('.hints')
    var strHTML = ''
    for (var i = 0; i < gHints; i++) {
        strHTML += `<button onclick="onHints(this)">${HINTS}</button>`
    }
    elHints.innerHTML = strHTML
}

function onHints(elBtn) {
    console.log('Hint!')
    gIsHint = true
    onCellClicked()
    elBtn.style = 'background-color: yellow'
    gHints--

    //keep going from here

}