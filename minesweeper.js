const settingButton = document.querySelector(".setting-button");
const settingsOptionsContainer = document.querySelector(".settings-options-container");
const xButton = document.querySelector(".x-button");
const difficultyRadioButtons = document.querySelectorAll('input[name="difficulty"]');
const rowsTextbox = document.querySelector("#rows-textbox");
const columnsTextBox = document.querySelector("#columns-textbox");
const bombTextBox = document.querySelector("#bombs-textbox")
const boardSelector = document.querySelector(".board");
const bombLeftCounter = document.querySelector(".bomb-left-counter");
const timeTakenCounter = document.querySelector(".time-taken-counter");
const newGameButton = document.querySelector(".new-game-button");

const faceImage = document.querySelector(".face-image");
const faceButton = document.querySelector(".face-button");


let settings;
let active = true;
let flagsleft;
let time = 0;
let tiles = [];
let tilesleft;
let timerid;

//to create the tiles
function createSettings(columns,rows,bombs){
    let bomb = bombs;
    let row = rows;
    let column = columns;
    settings = {
        bombs: bomb,
        rows: row,
        columns: column,
        tile:{
            width:15,
            height:15,
            border:2
        }
    }
    return settings;
}
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
    return row * settings.columns + col;
}

function clickTile(e){
    e.preventDefault();
    if(active){
        if(!tiles[getIndex(getPos(e).columns,getPos(e).rows)].hasFlag){
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


//fills in the tiles
function createBoard(columns,rows){
    for(let k = 0; k < rows; k++){
        for(let i = 0; i < columns; i++){
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
            div.id = `${i} ${k}`;
            tiles.push(new Tile(div));

            
            //console.log(div.id);
        }               
    }
    
    boardSelector.style.width = `${(settings.tile.width * columns) + (settings.tile.border *columns* 2)}px`;
    boardSelector.style.height = `${(settings.tile.height * rows) + (settings.tile.border *rows* 2)}px`;
    
    bombLeftCounter.innerHTML = pad(flagsleft,3);
    
}

//place all the bombs
function placebomb(){
    //get random postions the place bombs
    let row = Math.floor(Math.random() * settings.rows);
    let col = Math.floor(Math.random() * settings.columns);

    if(!tiles[getIndex(col,row)].hasBomb){
        tiles[getIndex(col,row)].hasBomb = true;
        //tiles[getIndex(col,row)].tile.firstElementChild.src = "img/mine.png";
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
    if(tiles[getIndex(columns,rows)].hidden && !tiles[getIndex(columns,rows)].hasBomb){
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
    bombLeftCounter.innerHTML = pad(flagsleft,3);
}
function gameover(){
    active =false;
    faceImage.src = "img/dead face.png";
    tiles.forEach(tile => {
        
        if(!tile.hasBomb && tile.hasFlag){
            tile.tile.classList.remove("tile-hidden");
            tile.tile.classList.add("tile-visible");
            tile.tile.firstElementChild.src = "img/wrong mine.png";
        }else if(tile.hasBomb && !tile.hasFlag){
            tile.tile.classList.remove("tile-hidden");
            tile.tile.classList.add("tile-visible");
            tile.tile.firstElementChild.src = "img/mine.png";
        }
        
    });
}
function setVariables(){
    clearInterval(timerid);
    faceImage.src = "img/smiling face.png";
    active = true;
    flagsleft = settings.bombs;
    time = 0;
    tiles = [];
    tilesleft = (settings.rows * settings.columns) - settings.bombs;
    timeTakenCounter.innerHTML = pad(time,3);
    createBoard(settings.columns,settings.rows);
    timerid = setInterval(()=>{
        if(time >= 999){
            time = 999;
        }
        timeTakenCounter.innerHTML = pad(++time,3);
    },1000);
}
function checkSettingsInput(){
    let flag = true
    let rows = parseInt(rowsTextbox.value);
    let columns = parseInt(columnsTextBox.value);
    let bombs = parseInt(bombTextBox.value);
    let maxBomb = rows * columns;
    if(rowsTextbox.value.trim() === "" || columnsTextBox.value.trim() === "" || bombTextBox.value.trim() === ""){
        flag = false;
    }
    if(!(/^\d+$/.test(rowsTextbox.value)) || !(/^\d+$/.test(columnsTextBox.value)) || !(/^\d+$/.test(bombTextBox.value))){
        console.log(/^\d+$/.test(rowsTextbox.value));
        flag = false;
    }
    if(rows <= 0){
        rowsTextbox.value = "9";
        flag = false;
    }
    if (columns <= 0){
        columnsTextBox.value = "9";
        flag = false;
    }
    if (bombs <= 0){
        bombTextBox.value = "9";
        flag = false;
    }
    if(rows > 99){
        rowsTextbox.value = "99";
        flag = false;
    }
    if(columns > 99){
        columnsTextBox.value = "99";
        flag = false;
    }
    if(bombs > 999){
        bombTextBox.value = "999";
        flag = false;
    }else if(bombs >= maxBomb){
        bombTextBox.value = maxBomb - 1;
        flag = false;
    }
    return flag;
}
function setDifficulty(){
    if(difficultyRadioButtons[0].checked){
        createSettings(9,9,10);
    }else if(difficultyRadioButtons[1].checked){
        createSettings(16,16,40);
    }
    else if(difficultyRadioButtons[2].checked){
        createSettings(30,16,99);
    }
    else if(difficultyRadioButtons[3].checked){
        createSettings(parseInt(columnsTextBox.value), parseInt(rowsTextbox.value), parseInt(bombTextBox.value));
    }
}
function init(){
    tiles.forEach(tile =>{
        tile.tile.remove();
    });

    setDifficulty();
    setVariables();

    for(let i = 0; i < settings.bombs; i++){
        placebomb();
    }
}

settingButton.addEventListener("click", ()=>{
    settingsOptionsContainer.style.display = "flex";
});
xButton.addEventListener("click",() =>{
    settingsOptionsContainer.style.display = "none";
});
faceButton.addEventListener("click",()=>{
    init(); 
});
newGameButton.addEventListener("click",()=>{
    if(checkSettingsInput()){
        settingsOptionsContainer.style.display = "none";
        init();
    }
});
window.addEventListener("load",() => {
    init();
});
