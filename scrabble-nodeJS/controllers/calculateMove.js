const Dawg = require('../helpers/dawg.js');
const CrossCheck = require('../helpers/CrossCheck.js');
const Scorer = require('../helpers/Scorer.js');
var fs = require('fs');

//Global Variables
var dawg; //store the DAWG data structure

var bestWordToPlay = {
    word:"",
    x: 0,
    y: 0,
    start:0,
    end: 0,
    direction: "",
    blanks: [],
    lettersUsed: []
};//Store the data for the current best move

var blanksUsed;//Blanks used in the word
var wordScore = 0;//Current best score

//Heuristics used by Hard Mode
var letterHeuristics = {
    "A":{"heuristic":8},
    "B":{"heuristic":5},
    "C":{"heuristic":1},
    "D":{"heuristic":7},
    "E":{"heuristic":8},
    "F":{"heuristic":4},
    "G":{"heuristic":5},
    "H":{"heuristic":4},
    "I":{"heuristic":8},
    "J":{"heuristic":3},
    "K":{"heuristic":3},
    "L":{"heuristic":7},
    "M":{"heuristic":1},
    "N":{"heuristic":8},
    "O":{"heuristic":5},
    "P":{"heuristic":4},
    "Q":{"heuristic":1},
    "R":{"heuristic":8},
    "S":{"heuristic":9},
    "T":{"heuristic":8},
    "U":{"heuristic":1},
    "V":{"heuristic":1},
    "W":{"heuristic":1},
    "X":{"heuristic":9},
    "Y":{"heuristic":1},
    "Z":{"heuristic":9},
    "?":{"heuristic":10},
};

var mode = "";//Current difficulty of the computer

var safeBoardCopy;
//Function where the data from the React application for move generation is sent to
exports.calculateMove = (req, res) => {
    
    //Reads and saves the data being sent
    let rack = req.body.rack;
    let board = req.body.board;
    let blanksOnBoard = req.body.blanks;
    blanksUsed = req.body.blanks;
    mode = req.body.difficulty;
   
    //Reads the dictionary text file to insert all the words
    let dictionaryText = "../scrabble-nodeJS/CollinsScrabbleWords(2019).txt";

    async function readingDict(dict){
        const data = await fs.promises.readFile(dict);
        return data;
    }

    //Promise for when the dictionary text file has been read
    readingDict(dictionaryText).then((data) => {
        //Sets up the DAWG
        let newD = new Dawg();
        const lines = data.toString().split('\r\n');
        for(let i =0; i < lines.length; i++){
            newD.insert(lines[i]);
        }
        newD.finish();

        dawg = newD;

        //Begins by searching the board
        searchBoard(board, rack).then(d =>{

            //If the best word is empty then, call the swap function
            if(bestWordToPlay.word === ""){

                checkIfSwapping(rack).then(tilesToSwap => {

                    //Response to send back to  React
                    res.json({
                        "letters": bestWordToPlay,
                        "tilesToSwap": tilesToSwap
                    });

                    //Rest the variables
                    bestWordToPlay = {
                        word:"",
                        x: 0,
                        y: 0,
                        start:0,
                        end: 0,
                        direction: "",
                        blanks: [],
                        lettersUsed: []
                    };
                    wordScore = 0;
                }); 
            }

            //Get the score of the best word.
            else{
                getScore(board, blanksOnBoard).then(score => {

                    res.json({
                        "swap": false,
                        "letters": bestWordToPlay,
                        "score": score
                    });
        
                    bestWordToPlay = {
                        word:"",
                        x: 0,
                        y: 0,
                        start:0,
                        end: 0,
                        direction: "",
                        blanks: [],
                        lettersUsed: []
                    };
    
                });

            }
           
           
        });
    });

}

/**
 * Gets the score of the word
 * @param  {Array} board current board
 * @param  {Array} blanksOnBoard blanks already played
 * @return {Array} tiles that will be swapped out
 */
async function getScore(board, blanksOnBoard){
    //Calls the external function
    let score = await Scorer.scorer(bestWordToPlay, board, blanksOnBoard);
    return score;
}



/**
 * Remove the tiles that are considered bad for better chance in next turn
 * @param  {Array} rack current computer rack
 * @return {Array} tiles that will be swapped out
 */
async function checkIfSwapping(rack){
    let tilesToSwap = [];
    
    for(let i = 0; i < rack.length; i++){
        let letter = rack[i];

        //Tiles to keep
        if(letter == "?"){
            continue;
        }

        else if(
            letter == "S" || letter == "X" || letter == "Z" || letter == "R" 
            || letter == "E" || letter == "T" || letter == "A" 
            || letter == "I" || letter == "N" || letter == "S" 
            || letter == "L" || letter == "D" || letter == "O"
        ){
            continue;
        }

        //If it is not any of the tiles from above then it will swap them out
        else{
            tilesToSwap.push(letter);
        }
             
    }

    return tilesToSwap;
}



/**
 * Searches the board
 * @param  {Array} board current board
 * @param  {Array} rack current computer rack
 * @return {} No value returned, return to complete the Async and Await nature
 */
async function searchBoard(board, rack){
    
    //If the board is empty
    //Call the move generation directly, with the center square as the anchor
    var board1D = [].concat(...board);
    var boardSet = new Set(board1D);
    if(boardSet.size == 1){
      
        let anchor = {
            x: 8,
            y: 7
        };

        let cross = {
            x: 7,
            y: 7
        };

        var blanks = [];
        let firstWord = await leftPart("", blanks,dawg.getRootNode(), 7, anchor, rack,"R", board, cross);
    }

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
    return;
}



/**
 * For each direction that is true. Enter the move generation to find possible moves to play
 * @param  {Boolean} left current board
 * @param  {Boolean} right current computer rack
 * @param  {Boolean} up current computer rack
 * @param  {Boolean} down current computer rack
 * @param  {Array} board current board
 * @param  {Array} rack current computer rack
 * @param  {Number} x current x coordinate of the square
 * @param  {Number} y current y coordinate of the square
 * @return {} No value returned, return to complete the Async and Await nature
 */
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
        
        //Set up the anchor
        let anchor = {
            x: x,
            y: y
        };

        //For the cross check
        let cross = {
            x: x-1,
            y: y
        };

        //If the free spaces is more than one
        if(freeSpacesLeft !== 1){
            let found = await leftPart("",blanks, dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R", board, cross);
           
        }

        //If the free spaces is one then the value of x must be 0
        else if(freeSpacesLeft == 1 && x == 0){
            let found = await leftPart("", blanks,dawg.getRootNode(), freeSpacesLeft, anchor, rack,"R", board, cross);
            
        }

       
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
        
        let found = await extendRight(currentLetters, blanks,tempNode, anchor, rack,"R", true, board);
        currentLetters = "";
        
    }

     //If the above of the anchor is empty
     if(up){
       
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
            
        }

        else if(freeSpacesLeft == 1 && y == 0){
            let found = await leftPart("",blanks, dawg.getRootNode(), freeSpacesLeft, anchor, rack,"C", board, cross);
           
        }
      
       
    }

    //If the below of the anchor is free
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
        let found = await extendRight(currentLetters, blanks, tempNode, anchor, rack,"C",true, board);
        currentLetters = "";
    
    }
    
    return;
}

/**
 * Left part of the move generation
 * @param  {String} partialWord Current word it needs to check
 * @param  {Array} blanks Blanks in the current word
 * @param  {DAWG Node} node Current DAWG node
 * @param  {Number} limit Free spaces
 * @param  {Object} anchor Anchor positions 
 * @param  {Array} rack current rack
 * @param  {String} direction Word in the column or row
 * @param  {Array} board current board
 * @param  {Object} cross Cross check object
 * @param  {Array} lettersUsed Letters that have been used in the word
 * @return {}
 */
async function leftPart(partialWord, blanks, node, limit, anchor, rack, direction, board, cross, lettersUsed = []){

    //Sends the current word to the extend right, to add more letters and validate word
    if(partialWord !== ""){
        let validWords = await extendRight(partialWord, blanks, node, anchor, rack, direction,false, board, lettersUsed);
    }
    
    //Until the limit is zero keep adding letters from the rack
    if(limit > 0){
        //If 1 
        if(limit == 1 && (anchor.y !== 1 || anchor.x !== 1)){
            return;
        }
        
        for(let i = 0; i < rack.length; i++){
            
            if(rack[i] == "?"){
                console.log("Blank");
                let ascii = 65;
                var char;
                for(let j = 0; j < 26; j++){
                    char = String.fromCharCode(ascii + j);
                    let check = dawg.checkIfNodeExists(node, char);
                    if(check == 1){
                       
                        let crossCheck;
                        if(direction == "R"){
                          
                            crossCheck = await CrossCheck.rowCrossChecks(cross, char, board, dawg);
                    
                        }

                        else{
                          
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
                            let addedLetters = [...lettersUsed];
                            addedLetters.push("?");
                            let otherWords = await leftPart(newPartialWord, tempBlanks, tempNode, limit-1, anchor, tempRack, direction, board, newCross, addedLetters); 
                            
                        }
                        
                        
                    }
                }
            }
            else{
                let check = dawg.checkIfNodeExists(node, rack[i]);
                if(check == 1){
                    let crossCheck;
                    if(direction == "R"){
                      
                        crossCheck = await CrossCheck.rowCrossChecks(cross, rack[i], board, dawg);
                       
                    }
                    else{
                       
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
                        let addedLetters = [...lettersUsed];
                        addedLetters.push(rack[i]);
                       
                        let otherWords = await leftPart(newPartialWord, blanks, tempNode, limit-1, anchor, tempRack, direction, board, newCross, addedLetters); 
                        
                    } 
                    
                }

            }
           
        }
    }
      return;
}

//Sets the best word in the object
async function setBestWord(x, y, word, direction, blanksTiles, lettersUsed){
    bestWordToPlay.word = word;
    if(direction == "R"){
        let start = x - word.length;
        let end = x - 1;
        bestWordToPlay.start = start;
        bestWordToPlay.end = end;
        bestWordToPlay.y = y;
        bestWordToPlay.x = x;
        bestWordToPlay.direction = direction;
        bestWordToPlay.lettersUsed = lettersUsed;
        if(blanksTiles.length !== 0){
            bestWordToPlay.blanks = blanksTiles;
        }
    }
    else if(direction == "C"){
        
        let start = y - word.length;
        let end = y - 1;
        bestWordToPlay.start = start;
        bestWordToPlay.end = end;
        bestWordToPlay.y = y;
        bestWordToPlay.x = x;
        bestWordToPlay.direction = direction;
        bestWordToPlay.lettersUsed = lettersUsed;
        if(blanksTiles.length !== 0){
            bestWordToPlay.blanks = blanksTiles;
        }
    }

    return;

}

//Function to check the if the move found is the best move for the current mode.
async function legalMove(word, squarePos, direction, blanksTiles, lettersUsed, board){
    
    //Easy mode finds the word that has the most characters
    if(mode == "easy"){
        if(word.length > bestWordToPlay.word.length){
            let y = squarePos.y;
            let x = squarePos.x;
            let setting = await setBestWord(x, y, word, direction, blanksTiles, lettersUsed);
            return bestWordToPlay;
        }

        return "";
    }

    //Medium plays the highest scoring word
    else if(mode == "medium"){
        //Set up the data to be used in the Scorer
        let currentWordCoord = {
            word:"",
            x: 0,
            y: 0,
            start:0,
            end: 0,
            direction: "",
            blanks: []
        };

        currentWordCoord.word = word;
        let currentY = squarePos.y;
        let currentX = squarePos.x;

        if(direction == "R"){
            let start = currentX - word.length;
            let end = currentX - 1;
            currentWordCoord.start = start;
            currentWordCoord.end = end;
            currentWordCoord.y = currentY;
            currentWordCoord.x = currentX;
            currentWordCoord.direction = direction;
            if(blanksTiles.length !== 0){
                currentWordCoord.blanks = blanksTiles;
            }
        }

        else if(direction == "C"){
            let start = currentY - word.length;
            let end = currentY - 1;
            currentWordCoord.start = start;
            currentWordCoord.end = end;
            currentWordCoord.y = currentY;
            currentWordCoord.x = currentX;
            currentWordCoord.direction = direction;
            if(blanksTiles.length !== 0){
                currentWordCoord.blanks = blanksTiles;
            }
        }

        let currentWordScore = await Scorer.scorer(currentWordCoord, board, blanksUsed);

        //Check against current highest
        if(currentWordScore > wordScore){
            wordScore = currentWordScore;
            let y = squarePos.y;
            let x = squarePos.x;
            let setting = await setBestWord(x, y, word, direction, blanksTiles, lettersUsed);
            return bestWordToPlay;
        }
        return "";
        
    }

    //Hard also plays the highest scoring word
    //But it checks if the word has blank and makes sure to check it give 20+ points
    //If the word score is equal to the current highest, then compare the heuristics of the word
    //One with the lowest is selected
    else if(mode == "hard"){
        let currentWordCoord = {
            word:"",
            x: 0,
            y: 0,
            start:0,
            end: 0,
            direction: "",
            blanks: []
        };

        currentWordCoord.word = word;
        let currentY = squarePos.y;
        let currentX = squarePos.x;

        if(direction == "R"){
            let start = currentX - word.length;
            let end = currentX - 1;
            currentWordCoord.start = start;
            currentWordCoord.end = end;
            currentWordCoord.y = currentY;
            currentWordCoord.x = currentX;
            currentWordCoord.direction = direction;
            if(blanksTiles.length !== 0){
                currentWordCoord.blanks = blanksTiles;
            }
        }

        else if(direction == "C"){
            let start = currentY - word.length;
            let end = currentY - 1;
            currentWordCoord.start = start;
            currentWordCoord.end = end;
            currentWordCoord.y = currentY;
            currentWordCoord.x = currentX;
            currentWordCoord.direction = direction;
            if(blanksTiles.length !== 0){
                currentWordCoord.blanks = blanksTiles;
            }
        }

        console.log(currentWordCoord);
       
        let currentWordScore = await Scorer.scorer(currentWordCoord, board, blanksUsed);
        
        if(currentWordScore > wordScore){
            //If it has a blank then check to make sure the score is more than 20 or all tiles been used
            //Otherwise save it
            if(blanksTiles.length !== 0){
                if(currentWordScore > 20 || lettersUsed.length == 7){
                    wordScore = currentWordScore;
                    let y = squarePos.y;
                    let x = squarePos.x;
                    console.log("h");
                    let setting = await setBestWord(x, y, word, direction, blanksTiles, lettersUsed);
                    return bestWordToPlay;
                }
            } 
            else if(blanksTiles.length === 0){
                wordScore = currentWordScore;
                let y = squarePos.y;
                let x = squarePos.x;
                console.log("h2");
                let setting = await setBestWord(x, y, word, direction, blanksTiles, lettersUsed);
                return bestWordToPlay;
            }
        }

        //If scores are equal, compare the heuristics
        else if(currentWordScore == wordScore){
            if(currentWordCoord.blanks.length == 0 && bestWordToPlay.blanks.length == 0){
                let heuristicBestCheck = await heuristicCheck(bestWordToPlay.lettersUsed);
                let heuristicCurrentCheck = await heuristicCheck(lettersUsed);
                if(heuristicBestCheck > heuristicCurrentCheck){
                    let setting = await setBestWord(currentX, currentY, word, direction, blanksTiles, lettersUsed);
                    return bestWordToPlay;
                }
            }
            //If one of them has a blank, then select the one without the blank
            else if(currentWordCoord.blanks.length == 0 && bestWordToPlay.blanks.length == 1){ 
                let setting = await setBestWord(currentX, currentY, word, direction, blanksTiles, lettersUsed);
                return bestWordToPlay;
            }
        }
        return "";
    }
    
}

//Adds up the letter heuristics 
async function heuristicCheck(lettersUsed){
    let count = 0;
    for(let i = 0; i < lettersUsed.length; i++){
        let letter = lettersUsed[i];
        let hValue = letterHeuristics[letter];
        count = count + hValue;
    }
    return count;

}

/**
 * Left part of the move generation
 * @param  {String} partialWord Current word it needs to check
 * @param  {Array} blanks Blanks in the current word
 * @param  {DAWG Node} node Current DAWG node
 * @param  {Number} limit Free spaces
 * @param  {Object} anchor Anchor positions 
 * @param  {Array} rack current rack
 * @param  {String} direction Word in the column or row
 * @param  {boolean} first If the word is already played on the board
 * @param  {Array} board current board
 * @param  {Array} lettersUsed Letters that have been used in the word
 * @return {}
 */
async function extendRight(partialWord,blanks, node, square, rack, direction, first = false, currentBoard, lettersUsed=[]){
   
  
    //Check if the current square is unoccupied
    if(currentBoard[square.y][square.x] == "*"){
        
        //If the current word is valid
        if(dawg.find(partialWord) && first == false){
            //Send to legal move to compare to current best move
            let c = await legalMove(partialWord, square, direction, blanks, lettersUsed, currentBoard);
        }
        
        //Loop through the rack
        for (let index = 0; index < rack.length; index++) { 
            //If a blank, check each letter the blank can be
            if(rack[index] == "?"){
                let ascii = 65;
                var char;
                for(let i = 0; i < 26; i++){
                    char = String.fromCharCode(ascii + i);
            
                    let checkNode = dawg.checkIfNodeExists(node, char);
                    
                    //If if letter is valid
                    if(checkNode == 1){
                        
                        //Check the cross checks, calling correct one
                        let crossCheck;
                        if(direction == "R"){
                           
                            crossCheck = await CrossCheck.rowCrossChecks(square, char, currentBoard, dawg);
                        }
                        else{
                            
                            crossCheck = await CrossCheck.columnCrossChecks(square, char, currentBoard, dawg);
                        } 
                        //If passed cross checks
                        if(crossCheck){
                            
                            //Set up for next recursion call
                            //Pass a rack without the used tiles
                            //Getting the next node
                            //Setting up the blanks and next square
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
                            //Add to letters used
                            let addedLetters = [...lettersUsed];
                            addedLetters.push("?");
                          
                            let eR = await extendRight(newPartialWord, tempBlank, tempNode, nextSquare, tempRack, direction, false, currentBoard, addedLetters);
                            
                        }
                    }
                }
            }
            //If not a blank, same process
            else{
                if(node == undefined){
                    return;
                }
                let checkNode = dawg.checkIfNodeExists(node, rack[index]);
                
                if(checkNode == 1){
                  
                    let crossCheck;
                    if(direction == "R"){
                      
                        crossCheck = await CrossCheck.rowCrossChecks(square, rack[index], currentBoard, dawg);
                    }
                    else{
                      
                        crossCheck = await CrossCheck.columnCrossChecks(square, rack[index], currentBoard, dawg);
                    } 
                    if(crossCheck){
                      
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
                        let addedLetters = [...lettersUsed];
                        addedLetters.push(rack[index]);
    
                        let eR = await extendRight(newPartialWord,blanks, tempNode, nextSquare, tempRack, direction, false, currentBoard, addedLetters);
                        
                    }
                }
            }
           
        }
    }
    //If the square is occupied, check if the current square letter can be added to the word, if not exit this recursive call
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
            
            let r = await extendRight(newPartialWord,blanks, tempNode, nextSquare, rack, direction, false,currentBoard, lettersUsed); 
            
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






