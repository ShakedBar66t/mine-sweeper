'use strict'

const EMPTY = ' '
const MINE = '💣'
const FLAG = '🚩'
const HINT = '💡'

const SMILEY_DEFAULT = '🙂'
const SMILEY_LOSE = '🤯'
const SMILEY_WIN = '😍'


var gBoard
var gGameInterval
var gIsHintMode = false
var gTime = '0:00'

var gPlayer = {
    life: 2,
    hint: 3,
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
    // setMines(gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    renderLife()
    renderHints()
    // runTimer()
    // revealBoard()
    if (gGameInterval) stopTimer()
    renderSmiley(SMILEY_DEFAULT)
}

function onReset(){
    onInit()
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
            strHTML += `<td class=" cell-${i}-${j}" onclick="cellClicked(${i}, ${j})" oncontextmenu="onRightClick(event, ${i}, ${j})">${content}</td>`
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
    if (!gGame.isOn) onFirstClick(i, j)
    if (gIsHintMode) return revealCellNeigh(i,j)
    const cell = gBoard[i][j]
    if (cell.isShown) return
    if (cell.isMine) onMine()
    else if (cell.minesAroundCount === 0) checkNeighbors(gBoard, i, j)
    cell.isShown = true
    console.log(cell.isShown);
    renderCell(i, j)
    if (checkWin(gBoard)) return onWin()
}

function onFirstClick(i, j) {
    plantMines({ i, j }, gLevel.MINES, gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    setGameIsOn(true)
    runTimer()
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
    let content = ''
    const className = cell.isShown ? 'clicked' : ''
    console.log(className);
    if (cell.isMarked) content = FLAG
    else if (cell.isShown) {
        if (cell.isMine) content = MINE
        else content = cell.minesAroundCount
    }
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = `<td class="${className} cell-${i}-${j}" oncontextmenu="onRightClick(event, ${i},${j})" onclick="cellClicked(this, ${i}, ${j})">${content}</td>`
}

function gameOver() {
    console.log('game over');
}

function onMine() {
    gPlayer.life--
    renderLife()
    if (gPlayer.life <= 0) return onLose()
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
    stopTimer()
    gGame.isOn = false
    renderSmiley(SMILEY_LOSE)

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
            const { isMarked, isMine, isShown } = cell
            if (!isShown) {
                if (!isMine) return false
                else if (isMine && !isMarked) return false
            }
        }
    }
    return true
}

function onWin() {
    if (!gGame.isOn) return
    gGame.isOn = false
    stopTimer()
    alert('WINNER')
    renderSmiley(SMILEY_WIN)
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

function plantMines(firstClickLoc, minesAmount, board) {
    const emptyCells = getEmptyCells(board)
    for (let i = 0; i < emptyCells.length; i++) {
        const emptyCellLoc = emptyCells[i]
        if (emptyCellLoc.i === firstClickLoc.i
            && emptyCellLoc.j === firstClickLoc.j) emptyCells.splice(i, 1)
    }
    for (let i = 0; i < minesAmount; i++) {
        const randomIdX = getRandomInt(0, emptyCells.length)
        const location = emptyCells.splice(randomIdX, 1)[0]
        gBoard[location.i][location.j].isMine = true
    }
}

function setGameIsOn(isOn) {
    gGame.isOn = isOn
}

function runTimer() {
    const startTime = Date.now()
    gGameInterval = setInterval(()=> {
        const time = (Date.now() - startTime) / 1000
        renderTimer(time.toFixed(3))
    }, 100)
}

function renderTimer(time) {
    const elTimer = document.querySelector('.timer') 
        elTimer.innerText = time
}

function onSetLevel(idx) {
    gLevel = gLevel[idx]
    onInitGame()
}

function stopTimer() {
clearInterval(gGameInterval)
}

function revealAllMines(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            if (cell.isMine && !cell.isShown) cell.isShown = true
        }
    }
    renderBoard(board)
}


function renderHints() {
    const elHints = document.querySelector('.hints')
    let strHTML = ''
    for (let i = gPlayer.hint; i > 0; i--) {
        strHTML += `<button class="hint" onclick="onHint()">${HINT}</button>`
    }
    elHints.innerHTML = strHTML
}

function onHint() {
    if (gPlayer.hint <= 0) return
    gIsHintMode = gIsHintMode ? false : true
}



function revealCellNeigh(rowIdx, colIdx) {
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue
            const cell = gBoard[i][j]
            cell.isShown = true
            renderCell(i, j)
            setTimeout(() => {
                cell.isShown = false
                renderCell(i, j)
            }, 2000)
        }
    }
    gIsHintMode = false
    gPlayer.hint--
    renderHints()
}



function onRightClick(ev, i, j) {
    ev.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isShown) return
    cell.isMarked = !cell.isMarked
    console.log('isMarked from onRightClick', cell.isMarked);
    renderCell(i, j)
    if (checkWin(gBoard)) onWin()
}

function renderSmiley(str) {
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = str
}