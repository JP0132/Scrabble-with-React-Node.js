const Dawg = require('../helpers/dawg.js');
const CrossCheck = require('../helpers/CrossCheck.js');
const Scorer = require('../helpers/Scorer.js');
var fs = require('fs');

var dawg;
var longestString = {
    word:"",
    x: 0,
    y: 0,
    start:0,
    end: 0,
    direction: "",
    blanks: []
};

exports.calculateMove = (req, res) => {
    console.log("Move Generation");
    let rack = req.body.rack;
    let board = req.body.board;
    let blanksOnBoard = req.body.blanks;
    console.log("Computer rack that passed", rack);
    console.log("Board passed", req.body.board);
    dawg = new Dawg();

    let dictionaryText = "../scrabble-nodeJS/CollinsScrabbleWords(2019).txt";

    async function readingDict(dict){
        const data = await fs.promises.readFile(dict);
        return data;
    }

    readingDict(dictionaryText).then((data) => {
        let newD = new Dawg();
        const lines = data.toString().split('\r\n');
        for(let i =0; i < lines.length; i++){
            newD.insert(lines[i]);
        }
        newD.finish();

        dawg = newD;

        searchBoard(board, rack).then(d =>{
            //console.log("Data returend by search board", d);
            console.log(longestString);
            getScore(board, blanksOnBoard).then(score => {
                res.json({
                    "letters": longestString,
                    "sent":"Sending Data",
                    "score": score
                });
    
                longestString = {
                    word:"",
                    x: 0,
                    y: 0,
                    start:0,
                    end: 0,
                    direction: "",
                    blanks: []
                };

            });
           
        });
    });

}

async function getScore(board, blanksOnBoard){
    let score = await Scorer.scorer(longestString, board, blanksOnBoard);
    return score;

}
async function createDawg(){
    //const g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    const dawg = new Dawg("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    //const gaddag = new Gaddag("../scrabble-nodeJS/test.txt");
    return dawg;
}

async function searchBoard(board, rack){
    console.log("Search Board that passed", rack);
    var validWords = [];
    //Search Each Row
    for(let y = 0; y < 15; y++){
        let currentRow = board[y];
            for(let x = 0; x < 15; x++){      
                if(currentRow[x] !== "*"){
                    //Checking if the tile is an anchor
                    let anchorConfirm = await isAnchor(board, x, y);
                    //If at least one blank space has been found
                    if(anchorConfirm.up || anchorConfirm.down || anchorConfirm.left || anchorConfirm.right){
                        //Get the tiles already placed and free spaces
                        let w = await getAlreadyPlacedTilesRow(anchorConfirm.left, anchorConfirm.right,anchorConfirm.up,anchorConfirm.down,y, x, rack, board);
                    }
        
                }
            }
    }
    return validWords;
}

//For each direction that is true
//Enter the move generation to find possible moves to play
async function getAlreadyPlacedTilesRow(left, right, up, down, y, x, rack, board){
    
    //Get the free spaces to place a tile on the left of the anchor
    var freeSpacesLeft = 0;
    //Free spaces above the tile
    var freeSpacesUp = 0;

    let foundWords = [];
    let currentLetters = "";
    var blanks = [];

    //If the left of the anchor is empty
    if(left){
        //currentLetters += board[y][x];
        for(let i = x-1; i > -1; i--){
            if(board[y][i] != "*"){
                break;
            }
            freeSpacesLeft += 1;
        }
      
        let anchor = {
            x: x,
            y: y
        };

        let cross = {
            x: x-1,
            y: y
        };

        if(freeSpacesLeft !== 1){
            let found = await leftPart("",blanks, dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R", board, cross);
            foundWords.push(found);
        }
        else if(freeSpacesLeft == 1 && x == 0){
            let found = await leftPart("", blanks,dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R", board, cross);
            foundWords.push(found);
        }

        //let found = await leftPart("", dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R", board, cross);
       
        //console.log("Anchor created", anchor);
        // if(freeSpacesLeft !== 1 && x !== 1){
        //     let found = await leftPart("", dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R", board, cross);
        //     foundWords.push(found);
        // }
        // if(freeSpacesLeft == 1 && x == 1){
        //     let found = await leftPart("", dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R",board, cross);
        //     foundWords.push(found);
        // }

        
        //console.log("Anchor words been search", found);
       
    }

    //If the right of the anchor is free
    else if(right){
        currentLetters += board[y][x];
        for(let i = x-1; i >= 0; i--){
            if(board[y][i] !== "*"){
                currentLetters = board[y][i] + currentLetters;
            }
            else{
                break;
            }  
        }
        let anchor = {
            x: x+1,
            y: y
        }
        let tempNode = dawg.getNode(currentLetters);
        console.log("LETTER IN RRGJ", currentLetters, x);
        let found = await extendRight(currentLetters, blanks,tempNode, anchor, rack,"R", true, board);
        currentLetters = "";
        foundWords.push(found);
        //extendRight(currentLetters, node, square, rack); 
    }

     //If the left of the anchor is empty
     if(up){
        //currentLetters += board[y][x];
        for(let i = y-1; i > -1; i--){
            if(board[i][x] != "*"){
                break;
            }
            freeSpacesUp += 1;
        }

       
       

        let anchor = {
            x: x,
            y: y,
        };

        let cross = {
            x: x,
            y: y-1,
        }

        if(freeSpacesLeft > 1){
            let found = await leftPart("",blanks, dawg.getRootNode(), freeSpacesLeft, anchor, rack,"C", board, cross);
            foundWords.push(found);
        }

        else if(freeSpacesLeft == 1 && y == 0){
            let found = await leftPart("",blanks, dawg.getRootNode(), freeSpacesLeft, anchor, rack,"C", board, cross);
            foundWords.push(found);
        }
      
        // let found = await leftPart("", dawg.getRootNode(), freeSpacesUp, anchor, rack, "Col",board, cross);
        // foundWords.push(found);

        // if(freeSpacesUp !== 1 && y !== 1){
           
        //     let found = await leftPart("", dawg.getRootNode(), freeSpacesUp, anchor, rack, "Col",board, cross);
        //     foundWords.push(found);
        // }
        // if(freeSpacesUp == 1 && y == 1){
        //     let found = await leftPart("", dawg.getRootNode(), freeSpacesUp, anchor, rack,"Col",board, cross);
        //     foundWords.push(found);
        // }
        //console.log("Anchor created", anchor);

        //let found = await leftPart("", dawg.getRootNode(), freeSpacesUp, anchor, rack);
        //console.log("Anchor words been search", found);
        //foundWords.push(found);
    }

    //If the right of the anchor is free
    else if(down){
        currentLetters = board[y][x] + currentLetters;
        for(let i = y-1; i >= 0; i--){
            if(board[i][x] !== "*"){
                currentLetters = board[i][x] + currentLetters;
            }
            else{
                break;
            }  
        }
    
        let anchor = {
            x: x,
            y: y+1
        };

       

        let tempNode = dawg.getNode(currentLetters);
        console.log("LETTER IN RRGJ", currentLetters, y);
        let found = await extendRight(currentLetters, blanks, tempNode, anchor, rack,"C",true, board);
        currentLetters = "";
        foundWords.push(found);
        //extendRight(currentLetters, node, square, rack); 
    }
    
    return;
}

async function leftPart(partialWord, blanks, node, limit, anchor, rack, direction, board, cross){
    //console.log("Anchor", anchor);
    if(partialWord !== ""){
        let validWords = await extendRight(partialWord, blanks, node, anchor, rack, direction,false, board);
    }
    
    let a = [];
    //a.concat(validWords);
    if(limit > 0){
        if(limit == 1 && (anchor.y !== 1 || anchor.x !== 1)){
            return;
        }
        //console.log("Limit is not zero");
        for(let i = 0; i < rack.length; i++){
            
            if(rack[i] == "?"){
                console.log("Blank");
                let ascii = 65;
                var char;
                for(let j = 0; j < 26; j++){
                    char = String.fromCharCode(ascii + j);
                    let check = dawg.checkIfNodeExists(node, char);
                    if(check == 1){
                        console.log(char);
                        let crossCheck;
                        if(direction == "R"){
                            //console.log("CHECKING CROSS CHECK");
                            // console.log("Left Cross Check R");
                            // console.log("Left Anchor", anchor);
                            // console.log("Left Cross", cross);
                            crossCheck = await CrossCheck.rowCrossChecks(cross, char, board, dawg);
                    
                        }

                        else{
                            //console.log("CHECKING CROSS CHECK");
                            // console.log("Left Cross Check C");
                            // console.log("Left Anchor", anchor);
                            // console.log("Left Cross", cross);
                            crossCheck = await CrossCheck.columnCrossChecks(cross, char, board, dawg);
                        
                        } 
                        if(crossCheck){
                            let tempRack = [...rack];
                            tempRack.splice(i, 1);
                            let tempNode = dawg.getNextNode(node, char);
                            let newPartialWord = char + partialWord;
                            let newCross = {
                                x: cross.x,
                                y: cross.y
                            };
                            let blankTile = {
                                x: cross.x,
                                y: cross.y,
                                letter: char
                            };
                            let tempBlanks = [...blanks];
                            tempBlanks.push(blankTile);
                            if(direction == "C" && cross.y !== 0){
                                newCross.y = newCross.y - 1;
                            }
                            else if(direction == "R" && cross.x !== 0){
                                newCross.x = newCross.x - 1;
                            }
                            let otherWords = await leftPart(newPartialWord, tempBlanks, tempNode, limit-1, anchor, tempRack, direction, board, newCross); 
                        }
                        
                        //a.concat(otherWords);
                    }
                }
            }
            else{
                let check = dawg.checkIfNodeExists(node, rack[i]);
                if(check == 1){
                    let crossCheck;
                    if(direction == "R"){
                        //console.log("CHECKING CROSS CHECK");
                        // console.log("Left Cross Check R");
                        // console.log("Left Anchor", anchor);
                        // console.log("Left Cross", cross);
                        crossCheck = await CrossCheck.rowCrossChecks(cross, rack[i], board, dawg);
                       
                    }
                    else{
                        //console.log("CHECKING CROSS CHECK");
                        // console.log("Left Cross Check C");
                        // console.log("Left Anchor", anchor);
                        // console.log("Left Cross", cross);
                        crossCheck = await CrossCheck.columnCrossChecks(cross, rack[i], board, dawg);
                       
                    } 
                    if(crossCheck){
                        let tempRack = [...rack];
                        tempRack.splice(i, 1);
                        let tempNode = dawg.getNextNode(node, rack[i]);
                        let newPartialWord = rack[i] + partialWord;
                        let newCross = {
                            x: cross.x,
                            y: cross.y
                        }
                        if(direction == "C" && cross.y !== 0){
                            newCross.y = newCross.y - 1;
                        }
                        else if(direction == "R" && cross.x !== 0){
                            newCross.x = newCross.x - 1;
                        }
                        let otherWords = await leftPart(newPartialWord, blanks, tempNode, limit-1, anchor, tempRack, direction, board, newCross); 
                    } 
                    //a.concat(otherWords);
                }

            }
           
        }
    }
    return;
}

async function legalMove(word, squarePos, direction, blanksTiles){
    if(word.length > longestString.word.length){
       // console.log(direction);
        longestString.word = word;
        let y = squarePos.y;
        let x = squarePos.x;
        if(direction == "R"){
            let start = x - word.length;
            let end = x - 1;
            longestString.start = start;
            longestString.end = end;
            longestString.y = y;
            longestString.x = x;
            longestString.direction = direction;
            if(blanksTiles.length !== 0){
                longestString.blanks = blanksTiles;
            }
        }
        else if(direction == "C"){
            let start = y - word.length;
            let end = y - 1;
            longestString.start = start;
            longestString.end = end;
            longestString.y = y;
            longestString.x = x;
            longestString.direction = direction;
            if(blanksTiles.length !== 0){
                longestString.blanks = blanksTiles;
            }
        }
      
        return longestString;
    }
    return "";
}


async function extendRight(partialWord,blanks, node, square, rack, direction, first = false, currentBoard){
    let legalMoves = [];
    //console.log("Y", square.y);
    //console.log("X", square.x);
   
    if(currentBoard[square.y][square.x] == "*"){
        //console.log("square is blabks");
        //console.log(node);
        if(dawg.find(partialWord) && first == false){
            //console.log("Valid word",partialWord);
            let c = await legalMove(partialWord, square, direction, blanks);
            if(c !== ""){
                //console.log("Word is in");
                legalMoves.push(c);
            }
        }
        //console.log(partialWord);
        //console.log(rack.length);
        // for (let index = 0; index < rack.length; index++) {
        //     console.log("hi"); 
        // }
        for (let index = 0; index < rack.length; index++) { 
            if(rack[index] == "?"){
                let ascii = 65;
                var char;
                for(let i = 0; i < 26; i++){
                    char = String.fromCharCode(ascii + i);
            
                    let checkNode = dawg.checkIfNodeExists(node, char);
                    //console.log(node);
                    if(checkNode == 1){
                        //console.log("Pasted the check");
                        //compute the cross check here
                        //let crosscheck = await crossCheck(square, rack[index]);
                        let crossCheck;
                        if(direction == "R"){
                            //console.log("CHECKING CROSS CHECK");
                            crossCheck = await CrossCheck.rowCrossChecks(square, char, currentBoard, dawg);
                        }
                        else{
                            //console.log("CHECKING CROSS CHECK");
                            crossCheck = await CrossCheck.columnCrossChecks(square, char, currentBoard, dawg);
                        } 
                        if(crossCheck){
                            //console.log("Pasted the check 2");
                            let tempRack = [...rack];
                            tempRack.splice(index, 1);
                            let tempNode = dawg.getNextNode(node, char);
                            let blankTile = {
                                x: square.x,
                                y: square.y,
                                letter: char
                            };
                            let tempBlank = [...blanks];
                            tempBlank.push(blankTile);
                            let newPartialWord = partialWord + char;
                            let nextSquare = {
                                x: 0,
                                y: 0
                            };
                            if(direction == "R"){
                                if(square.x !== 14){
                                    nextSquare.x = square.x + 1;
                                }
                                else{
                                    return;
                                }
                                nextSquare.y = square.y;
                            }
                            if(direction == "C"){
                                nextSquare.x = square.x;
                                if(square.y !== 14){
                                    nextSquare.y = square.y + 1;
                                }
                                else{
                                    return;
                                }
                                
                            }
                            
                            let eR = await extendRight(newPartialWord, tempBlank, tempNode, nextSquare, tempRack, direction, false, currentBoard);
                            //legalMoves.concat(eR);
                        }
                    }
                }
            }
            else{
                let checkNode = dawg.checkIfNodeExists(node, rack[index]);
                //console.log(node);
                if(checkNode == 1){
                    //console.log("Pasted the check");
                    //compute the cross check here
                    //let crosscheck = await crossCheck(square, rack[index]);
                    let crossCheck;
                    if(direction == "R"){
                        //console.log("CHECKING CROSS CHECK");
                        crossCheck = await CrossCheck.rowCrossChecks(square, rack[index], currentBoard, dawg);
                    }
                    else{
                        //console.log("CHECKING CROSS CHECK");
                        crossCheck = await CrossCheck.columnCrossChecks(square, rack[index], currentBoard, dawg);
                    } 
                    if(crossCheck){
                        //console.log("Pasted the check 2");
                        let tempRack = [...rack];
                        tempRack.splice(index, 1);
                        let tempNode = dawg.getNextNode(node, rack[index]);
                        let newPartialWord = partialWord + rack[index];
                        let nextSquare = {
                            x: 0,
                            y: 0
                        };
                        if(direction == "R"){
                            if(square.x !== 14){
                                nextSquare.x = square.x + 1;
                            }
                            else{
                                return;
                            }
                            nextSquare.y = square.y;
                        }
                        if(direction == "C"){
                            nextSquare.x = square.x;
                            if(square.y !== 14){
                                nextSquare.y = square.y + 1;
                            }
                            else{
                                return;
                            }
                            
                        }
                        
                        let eR = await extendRight(newPartialWord,blanks, tempNode, nextSquare, tempRack, direction, false, currentBoard);
                        //legalMoves.concat(eR);
                    }
                }
            }
           
        }
    }
    else{
        let currentSquareLetter = currentBoard[square.y][square.x];
        let check = dawg.checkIfNodeExists(node, currentSquareLetter);
        if(check == 1){
            let tempNode = dawg.getNextNode(node, currentSquareLetter);
            let newPartialWord = partialWord + currentSquareLetter;
            let nextSquare = {
                x: 0,
                y: 0
            };
            if(direction == "R"){
                nextSquare.y = square.y
                if(square.x !== 14){
                    nextSquare.x = square.x + 1;
                }
                else{
                    return;
                }
                
            }
            if(direction == "C"){
                nextSquare.x = square.x;
                if(square.y !== 14){
                    nextSquare.y = square.y + 1;
                }
                else{
                    return;
                }

                
               
            }
            
            let r = await extendRight(newPartialWord,blanks, tempNode, nextSquare, rack, direction, false,currentBoard); 
            //legalMoves.concat(r);
        }
    }
    
    return;
}


//Checking if the tile is a anchor
//It is a anchor if at least one position up, down, right and left
//is empty hence a tile can be placed
async function isAnchor(board, x, y){
    let anchorDirection = {
        left: false,
        right: false,
        up: false,
        down: false
    }


    //If x coord is 0
    //Only check to the right of the tile on the row
    if(x == 0){
        if(board[y][x+1] == "*"){
            anchorDirection.right = true;
        }  
    }

    //If x coord is 14
    //Only check to the left of the tile on the row
    else if(x == 14){
        if(board[y][x-1] == "*"){
            anchorDirection.left = true;
        }
    }

    //Otherwise check both left and right
    else{
        if(board[y][x+1] == "*"){
            anchorDirection.right = true;
        }
        if(board[y][x-1] == "*"){
            anchorDirection.left = true;
        }
    }

    //If y coord is 0
    //Only check to the bottom of the tile in the column
    if(y == 0){
        if(board[y+1][x] == "*"){
            anchorDirection.down = true;
        }
    }

    //If y coord is 14
    //Only check to the top of the tile in the column
    else if(y == 14){
        if(board[y-1][x] == "*"){
            anchorDirection.up = true;
        }
    }

    //Otherwise
    //Check above and below the tile
    else{
        if(board[y+1][x] == "*"){
            anchorDirection.down = true;
        }
        if(board[y-1][x] == "*"){
            anchorDirection.up = true;
        }
    }
    return anchorDirection;
}






