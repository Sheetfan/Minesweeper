const boardSelector = document.querySelector(".board");
const bombLeftCounter = document.querySelector(".bomb-left-counter");
const timeTakenCounter = document.querySelector(".time-taken-counter");
const faceImage = document.querySelector(".face-image");
const faceButton = document.querySelector(".face-button");
const settings = {
    bombs: 50,
    rows:15,
    columns:30,
    tile:{
        width:20,
        height:20,
        border:2
    }
    
}

let active = true;
let flagsleft = settings.bombs;
let time = 0;
let tiles = [];
let tilesleft = (settings.rows * settings.columns) - settings.bombs;
let timerid;

//to create the tiles
function Tile(tile){
    this.hasBomb = false;
    this.numbers = 0;
    this.tile = tile;
    this.hasFlag = false;
    this.hidden = true;
}

function pad(num, size) {
    let s = "000000000" + num;
    return s.substring(s.length-size);
}

function getIndex(col,row) {
    return col * settings.rows + row;
}

function clickTile(e){
    e.preventDefault();
    if(active){
        if(tiles[getIndex(getPos(e).columns,getPos(e).rows)].hasBomb){
            clearInterval(timerid);
            gameover();
        }else{
            reveal(getPos(e).columns,getPos(e).rows);
            if(tilesleft === 0){
                clearInterval(timerid);
                win();
            }
        }  
    }
}
function getPos(e){
    const columns = parseInt(e.currentTarget.id.substring(0,e.currentTarget.id.indexOf(" ")));
    const rows = parseInt(e.currentTarget.id.substring(e.currentTarget.id.indexOf(" ")+1));
    return {columns,rows};
}
function rightClick(e){
    e.preventDefault();
    if(active){
        flag(getPos(e).columns,getPos(e).rows);
    }
}
faceButton.addEventListener("click",()=>{
    init();
});

//fills in the tiles
function createBoard(columns,rows){

    for(let i = 0; i < columns; i++){
        for(let k = 0; k < rows; k++){
            const div = document.createElement("div");
            const img = document.createElement("img");
            div.classList.add("tile","tile-hidden");
            div.style.width = `${settings.tile.width}px`;
            div.style.height = `${settings.tile.height}px`;
            div.addEventListener("click",clickTile);
            div.addEventListener("contextmenu",rightClick);
            div.addEventListener("mousedown", (e)=>{
                e.preventDefault();
                if(active){
                    faceImage.src = "img/shocked face.png";
                }
                
            });
            div.addEventListener("mouseup",(e) => {
                e.preventDefault();
                if(active){
                    faceImage.src = "img/smiling face.png";
                }
                    
            });
            img.classList.add("img-tile");
            div.appendChild(img);
            boardSelector.appendChild(div);
            tiles.push(new Tile(div));

            div.id = `${i} ${k}`;
            
        }
    }
    boardSelector.style.width = `${(settings.tile.width * columns) + (settings.tile.border *columns* 2)}px`;
    boardSelector.style.height = `${(settings.tile.height * rows) + (settings.tile.border *rows* 2)}px`;
    timerid = setInterval(()=>{
        if(time >= 999){
            time = 999;
        }
        timeTakenCounter.innerHTML = pad(time++,3);
    },1000);
    bombLeftCounter.innerHTML = pad(flagsleft,3);
    
}

//place all the bombs
function placebomb(){
    //get random postions the place bombs
    let row = Math.floor(Math.random() * settings.rows);
    let col = Math.floor(Math.random() * settings.columns);

    if(!tiles[getIndex(col,row)].hasBomb){
        tiles[getIndex(col,row)].hasBomb = true;
        // tiles[getIndex(col,row)].tile.firstElementChild.src = "img/mine.png";
    }
    else{
        placebomb();
    }
}

function flag(columns,rows){
    if(tiles[getIndex(columns,rows)].hidden){
        tiles[getIndex(columns,rows)].hasFlag = !tiles[getIndex(columns,rows)].hasFlag;
        if(tiles[getIndex(columns,rows)].hasFlag){
            tiles[getIndex(columns,rows)].tile.firstElementChild.src = "img/flag.png";
            bombLeftCounter.innerHTML = pad(--flagsleft,3);
        }
        else{
            tiles[getIndex(columns,rows)].tile.firstElementChild.src = "";
            bombLeftCounter.innerHTML = pad(++flagsleft,3);
        }
    }
}

function reveal(columns,rows){
    const adjacentTiles = [
        { col: columns - 1, row: rows },
        { col: columns + 1, row: rows },
        { col: columns, row: rows - 1 },
        { col: columns, row: rows + 1 },
        { col: columns - 1, row: rows - 1 },
        { col: columns - 1, row: rows + 1 },
        { col: columns + 1, row: rows - 1 },
        { col: columns + 1, row: rows + 1 },
    ];
    
    // let hasFlag = false;
    if(tiles[getIndex(columns,rows)].hidden && !tiles[getIndex(columns,rows)].hasFlag &&!tiles[getIndex(columns,rows)].hasBomb){
        tiles[getIndex(columns,rows)].tile.classList.remove("tile-hidden");
        tiles[getIndex(columns,rows)].tile.classList.add("tile-visible");
        tiles[getIndex(columns,rows)].hidden = false;
        tilesleft--;
        for(let i = 0; i<8; i++){
            const {col,row} = adjacentTiles[i];
            if(col >= 0 && col < settings.columns && row >= 0 && row < settings.rows){
                if(tiles[getIndex(col,row)].hasBomb){
                    tiles[getIndex(columns,rows)].numbers++;
                }

            }
        }
        if(tiles[getIndex(columns,rows)].numbers > 0 ){
            tiles[getIndex(columns,rows)].tile.innerHTML = tiles[getIndex(columns,rows)].numbers;
            switch (tiles[getIndex(columns,rows)].numbers) {
                case 1:
                    tiles[getIndex(columns,rows)].tile.style.color = "blue";
                    break;
                case 2:
                    tiles[getIndex(columns,rows)].tile.style.color = "green";
                    break;
                case 3:
                    tiles[getIndex(columns,rows)].tile.style.color = "red";
                
                    break;
                case 4:
                    tiles[getIndex(columns,rows)].tile.style.color = "darkblue";
                    break;
                case 5:
                    tiles[getIndex(columns,rows)].tile.style.color = "brown";
                    break;
                case 6:
                    tiles[getIndex(columns,rows)].tile.style.color = "cadetblue";
                    break;
                case 7:
                    tiles[getIndex(columns,rows)].tile.style.color = "black";
                    break;
                case 8:
                    tiles[getIndex(columns,rows)].tile.style.color = "gray";
                    break;
            }
        }
        else{
            for(let i = 0; i<8;i++){
                const {col,row} = adjacentTiles[i];
                if(col >= 0 && col < settings.columns && row >= 0 && row < settings.rows){
                    if(tiles[getIndex(col,row)].hidden && !tiles[getIndex(col,row)].hasFlag){
                        reveal(col,row);
                    }  
                }
            }
        }
        console.log(tilesleft);
    }     
}

function win(){
    active =false;
    faceImage.src = "img/cool face.png";
    tiles.forEach(tile =>{
        if(tile.hasBomb){
            tile.tile.firstElementChild.src = "img/flag.png";
        }
    });
    flagsleft = 0;
    bombLeftCounter.innerHTML = flagsleft;
}
function gameover(){
    active =false;
    faceImage.src = "img/dead face.png";
    tiles.forEach(tile => {
        if(tile.hasBomb){
            tile.tile.classList.remove("tile-hidden");
            tile.tile.classList.add("tile-visible");
            tile.tile.firstElementChild.src = "img/mine.png";
        }
        else if(!tile.hasBomb && tile.hasFlag){
            tile.tile.classList.remove("tile-hidden");
            tile.tile.classList.add("tile-visible");
            tile.tile.firstElementChild.src = "img/wrong mine.png";
        }
        
    });
}

function init(){
    tiles.forEach(tile =>{
        tile.tile.remove();
    });
    clearInterval(timerid);
    faceImage.src = "img/smiling face.png";
    active = true;
    flagsleft = settings.bombs;
    time = 0;
    tiles = [];
    tilesleft = (settings.rows * settings.columns) - settings.bombs;
    createBoard(settings.columns,settings.rows);
    for(let i = 0; i < settings.bombs; i++){
        placebomb();
    }
    //placeNumbers();
}

window.addEventListener("load",() => {
    init();
});
