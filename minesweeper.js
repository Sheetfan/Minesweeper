let boardSelector = document.querySelector(".board");
let bombLeftCounter = document.querySelector(".bomb-left-counter");
let timeTakenCounter = document.querySelector(".time-taken-counter");
let settings = {
    bombs: 9,
    rows:10,
    columns:10,
    tile:{
        width:20,
        height:20,
        border:2
    }
    
}
let tiles = [];

//to create the tiles
function Tile(tile){
    this.hasBomb = false;
    this.numbers;
    this.tile = tile;
}

function clickTile(e){
    console.log("qwerty");
}

//fills in the tiles
function createBoard(columns,rows){
    boardSelector.addEventListener("click",clickTile);
    for(let i = 0; i < columns; i++){
        for(let k = 0; k < rows; k++){
            let div = document.createElement("div");
            div.classList.add("tile","tile-hidden");

            div.style.width = `${settings.tile.width}px`;
            div.style.height = `${settings.tile.height}px`
            boardSelector.appendChild(div);
            tiles.push(new Tile(div));
        }
    }
    // let style = getComputedStyle(query);
    // boardSelector.style.width = "100px";
    // console.log(style.width, style.borderRightWidth);
    boardSelector.style.width = `${(settings.tile.width * columns) + (settings.tile.border *columns* 2)}px`;
    boardSelector.style.height = `${(settings.tile.height * rows) + (settings.tile.border *rows* 2)}px`;
    // boardSelector.style.width = `${400}px`;
    console.log(`${(settings.tile.width * columns) + (settings.tile.border * 2)}px`);
}

function gameLoop(){
    while(true){

    }
}

window.addEventListener("load",() => {
    createBoard(settings.columns,settings.rows);
    //gameLoop();
});

