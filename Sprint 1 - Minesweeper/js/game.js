'use strict'

const EMPTY = ' '
const MINE = '💣'
const FLAG = '🚩'
const NUMBER = 0

var gBoard
var gGameInterval

var gPlayer = {
    life: 1,
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard(gLevel.SIZE)
    console.log(gBoard);
    setMines(gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    renderLife()
    startStopWatch()
    // revealBoard()
}


function buildBoard(size) {
    const board = []
    for (let i = 0; i < size; i++) {
        board[i] = []
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }


    return board
}



function renderBoard(board) {
    var content = ''
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '\n<tr>'
        for (let j = 0; j < board.length; j++) {
            const cell = board[i][j]
            if (cell.isShown) {
                if (cell.isMine) content = MINE
                else if (cell.isMarked) content = FLAG
                else content = cell.minesAroundCount
            }
            strHTML += `<td class=" cell-${i}-${j}" onclick="cellClicked(${i}, ${j})" oncontextmenu="cellMarked(${i}, ${j})">${content}</td>`
        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMines(minesCount) {
    const emptyCells = getEmptyCells()
    for (let i = 0; i < minesCount; i++) {
        const randomIdx = getRandomInt(0, emptyCells.length)
        const emptyCell = emptyCells.splice(randomIdx, 1)[0]
        gBoard[emptyCell.i][emptyCell.j].isMine = true

    }

}

function getEmptyCells() {
    const emptyCells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) continue
            if (mineCounter(board, { i, j }) === 0) board[i][j].minesAroundCount = ''
            else {
                board[i][j].minesAroundCount = mineCounter(board, { i, j })
            }
        }
    }
}

function negsReveal(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) board[i][j].isShown = true
            board[i][j].isShown = true

        }
    }
}

function mineCounter(board, pos) {
    var minesCount = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isMine) minesCount++
        }
    }
    // console.log(pos.i, pos.j, minesCount);
    return minesCount
}

function cellClicked(i, j) {
    if (!gGame.isOn) gGame.isOn = true
    console.log(i,);
    const cell = gBoard[i][j]
    if (cell.isShown) return
    if (cell.isMine) onMine()
    else if (cell.minesAroundCount === 0) checkNeighbors(gBoard, i, j)
    cell.isShown = true
    renderCell(i, j)
    if (checkWin(gBoard)) onWin()
    // checkWin()
}

function checkNeighbors(board, rowIdx, colIdx){
    if (gBoard[rowIdx][colIdx].isShown) return
    gBoard[rowIdx][colIdx].isShown = true
    for (let i = rowIdx -1; i <= rowIdx +1; i++){
        for (let j = colIdx -1; j <= rowIdx +1; j++){
            if (i < 0 || i >= board.length || j < 0 || j >= board[i].length || (i === rowIdx && j === colIdx)) continue
            const cell = board[i][j]
            if (cell.minesAroundCount === 0) checkNeighbors(board, i, j)
            else cell.isShown = true
            renderCell(i, j)
        }
    }


}

function renderCell(i, j) {
    const cell = gBoard[i][j]
    let content = 0
    if (cell.isShown) {
        if (cell.isMine) content = MINE
        else if (cell.isMarked) content = FLAG
        else content = cell.minesAroundCount
    }
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = `<td class=" ${cell.isShown ? "" : "clicked"} cell-${i}-${j}"onclick="cellClicked(this, ${i}, ${j})">${content}</td>`

}

function gameOver() {
    console.log('game over');
}

function startStopWatch() {
    clearInterval(gGameInterval)
    const startTime = Date.now()
    gGameInterval = setInterval(() => {
        const passedTime = (Date.now() - startTime) / 1000
        const elTimer = document.querySelector('.timer')
        elTimer.innerText = passedTime.toFixed(2)
    }, 100)

}

function onMine() {
    alert('MINE')
    gPlayer.life--
    renderLife()
    if (gPlayer.life <= 0) onLose()
}

function onStartGame() {

}

function renderLife() {
    const elLifeCounter = document.querySelector('.life-counter')
    elLifeCounter.innerText = gPlayer.life
}

function onLose() {
    revealBoard()
    alert('YOU LOST')
}

function revealBoard() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            let cell = gBoard[i][j]
            if (!cell.isShown) cell.isShown = true
        }
    }
    renderBoard(gBoard)
}

function checkWin(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            if (!cell.isShown) {
                if (!cell.isMine) {
                    // console.log('is not shown');
                    return false
                }
                else if (cell.isMine && !cell.isMarked) return false
            }
        }
    }
    // console.log(true);
    return true

}

function onWin() {
    alert('FUCKING WINNER')
}

function cellMarked(elCell, i, j) {
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        elCell.innerText = FLAG
    } else {
        gBoard[i][j].isMarked = false
        elCell.innerText = null
    }
}

function setDifficulty(level) {
    if (level === 1) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    }
    if (level === 2) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    }
    if (level === 3) {
        gLevel.SIZE = 12
        gLevel.MINES = 9
    }
    onInit()
}