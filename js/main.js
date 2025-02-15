'use strict'

const LIVES = '💓'
const HINTS = '💡'
const NORMAL = '🙂'
const LOSE = '😤'
const WIN = '😎'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2,
    LEVEL: '4*4'
}

var gGame = {
    isOn: false,
    coverdCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLives


function onInit() {

    gGame.isOn = true

    gLives = 3
    gGame.markedCount = 0
    gBoard = buildBoard(gLevel.SIZE)
    console.table(gBoard)

    renderBoard(gBoard)
    renderLives()
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

    var colSpanEdge = gLevel.SIZE / 4
    var colSpanMiddele = gLevel.SIZE / 2
    var strHTML = `<table><thead>
                   <div><th colspan="${colSpanEdge}" class="timer">${gGame.secsPassed}</th>
                   <th colspan="${colSpanMiddele}"><button onclick="onReset(this)">${NORMAL}</button></th>
                   <th colspan="${colSpanEdge}">${gLevel.LEVEL}</th></div>
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

    if (isFirstClicked()) {
        placeMines(gLevel.MINES, i, j)
        // gBoard[2][1].isMine = true
        // gBoard[3][3].isMine = true
        minesNeg(gBoard)
        startTimer()
    }

    if (elCell.classList.contains("cellClicked")) return

    const cell = gBoard[i][j]

    if (cell.isMarked) return

    elCell.classList.add("cellClicked")
    cell.isCovered = false

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
    console.log('gGame.coverdCount:', gGame.coverdCount)
    console.log('gGame.markedCount:', gGame.markedCount)
    console.log(gBoard)
    countCoverdCell()
    checkGameOver()
}

function onCellMarked(elCell, ev, i, j) {

    ev.preventDefault()
    if (!gGame.isOn) return
    if (!gBoard[i][j].isCovered) return

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        checkGameOver()
        elCell.children[0].innerText = MARK

    } else {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        elCell.children[0].innerText = ' '

    }
    console.log('gGame.coverdCount:', gGame.coverdCount)
    console.log('gGame.markedCount:', gGame.markedCount)
    console.log(gBoard)
}

function checkGameOver() {
    countCoverdCell()
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
            if (!currPlace.isCovered) continue
            currPlace.isCovered = false
            var minesAroundNums = currPlace.minesAroundCount
            if (minesAroundNums === 0) minesAroundNums = ' '

            var elCell = document.querySelector(`.cell${i}-${j}`)
            elCell.classList.add("cellClicked")
            elCell.children[0].innerText = minesAroundNums

            if (minesAroundNums > 0) continue
            else expandUncover(i, j)
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
