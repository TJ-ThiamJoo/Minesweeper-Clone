// Logic

// Bring in the data-status from CSS.
export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
};

//Create the board with tiles and mines.
export function createBoard(boardSize, numberOfMines){
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);

    for(let x = 0; x < boardSize; x++){
        const row = [];
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN; //Default tile status.

            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, {x, y})),
                get status(){
                    return this.element.dataset.status;
                },
                set status(value){
                    this.element.dataset.status = value;
                }
            };

            row.push(tile);
        }

        board.push(row);
    }

    return board;
}

// Mark the tile by right clicking.
export function markTile(tile){
    if (
        tile.status !== TILE_STATUSES.HIDDEN && 
        tile.status !== TILE_STATUSES.MARKED
    ){
        return;
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    } else {
        tile.status = TILE_STATUSES.MARKED;
    }
}

// reveal the tile by left clicking.
export function revealTile(board, tile){
    if (tile.status !== TILE_STATUSES.HIDDEN){
        return;
    } 
    
    if (tile.mine){
        tile.status = TILE_STATUSES.MINE;
        return;
    }

    tile.status = TILE_STATUSES.NUMBER;

    const adjacentTiles = nearbyTiles(board, tile);
    const mine = adjacentTiles.filter(tile => tile.mine);

    if (mine.length === 0){
        adjacentTiles.forEach(revealTile.bind(null, board));
    } else {
        tile.element.textContent = mine.length;
    }
}

// check for win condition.
export function checkWin(board){
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === TILE_STATUSES.NUMBER ||
                (tile.mine && (tile.status === TILE_STATUSES.HIDDEN ||
                    tile.status === TILE_STATUSES.MARKED))
            );
        })
    })
}

// Check for lose condition.
export function checkLose(board){
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE;
        })
    })
}

// randomly get the non-duplicate mine position.
function getMinePositions(boardSize, numberOfMines){
    const positions = [];

    while(positions.length < numberOfMines){
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        };

        if (!positions.some(positionMatch.bind(null, position))){
            positions.push(position);
            }
        }

    return positions;
}

// Match the position of random mine and the existing mine.
function positionMatch(a, b){
    return a.x === b.x && a.y === b.y;
}

function randomNumber(size){
    return Math.floor(Math.random() * size);
}

// Get all the adjacent tile.
function nearbyTiles(board, {x, y}){
    const tiles = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++){
        for (let yOffset = -1; yOffset <= 1; yOffset++){
            const tile = board[x + xOffset]?.[y + yOffset];
            if (tile) tiles.push(tile);
        }
    }

    return tiles;
}