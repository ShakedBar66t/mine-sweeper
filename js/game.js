'use strict'

const EMPTY = ' '
const MINE = '💣'
const NUMBER = 0

var gBoard

var cell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
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
    var gBoard = buildBoard()
    console.table(gBoard);
    renderBoard(gBoard, '.game-container')
}


function buildBoard() {
    const board = []
    for (let i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = cell
            cell.isShown = true

        }
    }
    board[1][1] = MINE
    board[2][3] = MINE

    return board
}

function renderBoard(board, selector) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = '`cell cell-${i}-${j}`'

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    var mines = []
    for (let i = board[i] - 1; i <= board[i] + 1; i++) {
        if (i <= 0 || i > board.length) return
        for (let j = board[j] - 1; j <= board[j] + 1; j++) {
            if (j <= 0 || j > board[i].length) return
            if (board[i][j].isMine) mines.push({ i: i, j: j })
        }


    }
    return mines

}
