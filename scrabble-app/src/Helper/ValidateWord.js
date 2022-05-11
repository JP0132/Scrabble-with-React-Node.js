import {storeSlicer} from "../app/store";

// When the play button is clicked by the user this function will be called first for validation:
// Validates the tiles positions and word(s) played
export async function ValidateWord(){
    //Get the tile positions on the board
    let currentStore = storeSlicer.getState();
    let pos = currentStore.square.value.tilePositions;

    //Get the current board state
    let currentBoard = currentStore.board.value.currentBoard;

    //Current Turn number
    let turnNumber = currentStore.game.value.turnNumber;

    let blanks = currentStore.board.value.blanks;

    if(pos.length == 0){
        return {pass: false, message: "No new tiles have been placed!"};
    }

    var board1D = [].concat(...currentBoard);
    var boardSet = new Set(board1D);
  
    //The turn number is 1 or board is empty, then a tile must be touching the center tile
    if(turnNumber == 1 || boardSet.size == 1){
        
        let checkCenter = await isCenterSquareUsed(pos);
        if(!checkCenter){
            return {pass: false, message: "A tile must connect on the center!"};
        }
    } 

    //Validate the positions
    const vp = await validatePositions(pos, turnNumber);

    //Return false back to the game, tile positions are invalid
    if(vp == false){
        return  {pass: false, message: "Tile positions are invalid"};
    }

    //Otherwise, make a fetch call to the node js server to validate the word(s)
    else{
        
        var data = {
            "positions" : vp,
            "board" : currentBoard,
            "blanks": blanks
        }

        const response = await fetch('http://localhost:3001/api/validateWord',{
            method: "post",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(data),
        })

        const d = await response.json();
        if(d.pass == false){
            d.message = "Word(s) is not found!"
        }
        return d;  
    }
   

}

//If one of the tiles is on the center
async function isCenterSquareUsed(pos){
    if(pos.some(p => p.x == 7 && p.y == 7)){
        
        return true;
    }
    return false;
}

//Validating the positions
async function validatePositions(positions, turnNumber){
    let currentStore = storeSlicer.getState();
    let currentBoard = currentStore.board.value.currentBoard;

    //If only one tile has been placed
    if(positions.length == 1){
        let tilePos = positions[0];
        let x = tilePos.x;
        let y = tilePos.y;

        if(y == 0){
            if(currentBoard[y+1][x] != "*"){
                return {
                    pos: positions,
                    direction: "C"
                };
            }
        }
        
        else if(y == 14){
            if(currentBoard[y-1][x] != "*"){
                return {
                    pos: positions,
                    direction: "C"
                };
            }
        }

        else{
            if(currentBoard[y+1][x] !== "*" || currentBoard[y-1][x] !== "*"){
                return {
                    pos: positions,
                    direction: "C"
                };
            }
        }

        if(x == 0){
            if(currentBoard[y][x+1] !== "*"){
                return {
                    pos: positions,
                    direction: "R"
                };
            }
        }
        else if(x == 14){
            if(currentBoard[y][x-1] !== "*"){
                return {
                    pos: positions,
                    direction: "R"
                };
            }
        }
        else{
            if(currentBoard[y][x+1] !== "*" || currentBoard[y][x-1] !== "*"){
                return {
                    pos: positions,
                    direction: "R"
                };
            }
        }
     
        return false;
        
    }
    
    //Sorts the positions increasing order
    const sortPositions = (by, pos) => {
        return pos.sort((a,b) => (a[by] > b[by]) ? 1 : ((b[by] > a[by]) ? -1 : 0));
    }

    //Checks if the word is in a row or column
    let isX = await isXCoordSame(positions);
    let isY = await isYCoordSame(positions);

    //The word is in the column
    //All the x coords are the same
    if(isX){
        
        let copyPos = [...positions];
        //Sort the order of tiles in ascending order in terms of y coord
        copyPos = sortPositions("y", copyPos);
        
        //Check if the tiles are connecting
        let tc = areTilesConnecting(copyPos, "y");
        switch (tc) {
            case 1:
                
                var board1D = [].concat(...currentBoard);
                var boardSet = new Set(board1D);
                if(turnNumber == 1){
                    return {
                        pos: copyPos,
                        direction: "C"
                    };
                }
                else if(turnNumber > 1 && boardSet.size == 1){
                    return {
                        pos: copyPos,
                        direction: "C"
                    };
                }
                let ta = await connectingAdjacentRow(copyPos);
                if(ta){
                    return {
                        pos: copyPos,
                        direction: "C"
                    };
                }
                return ta;
            case 2:
                
                return false;
            case 3:
                

                return {
                    pos: copyPos,
                    direction: "C"
                };
            default:
                break;
        }
    }

    // Word is in a row
    else if(isY){
        
        let copyPos = [...positions];
        copyPos = sortPositions("x", copyPos);
        
        let tc = areTilesConnecting(copyPos, "x");
        switch (tc) {
            case 1:
                
                var board1D = [].concat(...currentBoard);
                var boardSet = new Set(board1D);
                if(turnNumber == 1){
                    return {
                        pos: copyPos,
                        direction: "R"
                    };
                }
                else if(turnNumber > 1 && boardSet.size == 1){
                    return {
                        pos: copyPos,
                        direction: "C"
                    };
                }
                let ta = await connectingAdjacentRow(copyPos);
                if(ta){
                    return {
                        pos: copyPos,
                        direction: "R"
                    };
                }
                return ta;
            case 2:
                
                return false;
            case 3:
                
                return {
                    pos: copyPos,
                    direction: "R"
                };
            default:
                break;
        }
       
    }

    else{
        
        return false;
    }
}





//Tiles connecting in the row
//Or are the tiles connecting from 
const areTilesConnecting = (pos, coord) => {
    //Get the current board state
    let currentStore = storeSlicer.getState();
    let currentBoard = currentStore.board.value.currentBoard;
    

    
    //First position
    
    //
    //Track if a gap was found in between the tiles placed
    var gap = false;
    for(let i = 0; i < pos.length; i++){
        //Get the next tile in the array
        var tempPos = pos[i];
        //If the y position for temp + 1 is 
        //equal to the next position than
        if(i == pos.length-1 && gap == false){
            return 1;
        }
        if(i == pos.length-1 && gap){
            return 3;
        }
        var nextPos = pos[i+1];
        

        if((tempPos[coord]+1) == nextPos[coord]){
            //If at the end of the loop and no gap has been found then return 1
            if(i == pos.length-1 && gap == false){
                return 1;
            }
        }
        //If the next position is not an increment of one
        //then a gap has been found
        //Check if there tile in between the temp and current pos
        else{ 
            //Set gap to true
            gap = true;
            //let diff = currentPos[coord] - tempPos[coord];
            let startCoord = tempPos[coord];
            //
            let endCoord = pos[i+1][coord];
            
            

            if(coord == "x"){
                let row = currentBoard[tempPos["y"]];
                
                

                for(let x = startCoord+1; x < endCoord; x++){
                    if(row[x] == '*'){
                        return 2;
                    }
                }
            }
            else if(coord == "y"){
                let xcoord = tempPos["x"];
                
                for(let y = startCoord+1; y < endCoord; y++){
                    
                    if(currentBoard[y][xcoord] == '*'){
                        return 2;
                    }
                }
            }  
        }
    } 
    return 3;
}

//If the tiles are connecting adjacent column wise
async function connectingAdjacentCol (pos, coord){
    let currentStore = storeSlicer.getState();
    let currentBoard = currentStore.board.value.currentBoard;

    for(let i = 0; i < pos.length; i++){
        let currentPos = pos[i];
        let x = currentPos.x;
        let y = currentPos.y;
        
        if(y == 0){
            if(currentBoard[y-1][x] != "*"){
                return true;
            }
        }
        
       
        else if(y !== 14){
            if(currentBoard[y+1][x] != "*"){
                return true;
            }
        }

        else{
            if(currentBoard[y+1][x] !== "*" || currentBoard[y-1][x] !== "*"){
                return true;
            }
        }

        if(x == 0){
            if(currentBoard[y][x+1] !== "*"){
                return true;
            }
        }
        else if(x == 14){
            if(currentBoard[y][x-1] !== "*"){
                return true;
            }
        }
        else{
            if(currentBoard[y][x+1] !== "*" || currentBoard[y][x-1] !== "*"){
                return true;
            }
        }
    }
    
    return false;

}


//If the tiles are connecting adjacent row wise
async function connectingAdjacentRow (pos){
    let currentStore = storeSlicer.getState();
    let currentBoard = currentStore.board.value.currentBoard;

    for(let i = 0; i < pos.length; i++){
        let currentPos = pos[i];
        let x = currentPos.x;
        let y = currentPos.y;
       
        if(x == 0){
            if(currentBoard[y][x+1] !== "*"){
                    return true;
            }
        }
    
        else if(x == 14){
            if(currentBoard[y][x-1] !== "*"){
                    return true;
            }
        }

        else{
            if(currentBoard[y][x-1] !== "*" || currentBoard[y][x+1] !== "*"){
                return true;
            }
        }

        if(y == 0){
            if(currentBoard[y+1][x] !== "*"){
                return true;
            }
        }
        else if(y == 14){
            if(currentBoard[y-1][x] !== "*"){
                return true;
            }
        }

        else{
            if(currentBoard[y+1][x] !== "*" || currentBoard[y-1][x] !== "*"){
                return true;
            }
        }
    }

    return false; 

}


async function isXCoordSame(positions){
    if(positions.length == 1){
        return true;
    }
    var temp = positions[0];
    for(let i = 1; i < positions.length; i++){
        let currentP = positions[i];
        if(temp.x !== currentP.x){
            return false;
        }
    }
    return true;
    
}

async function isYCoordSame (positions){
    if(positions.length == 1){
        return true;
    }
    var temp = positions[0];
    for(let i = 1; i < positions.length; i++){
        let currentP = positions[i];
        if(temp.y !== currentP.y){
            return false;
        }
    }
    return true;
 }




