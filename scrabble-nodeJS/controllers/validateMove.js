//Imports
const Dawg = require('../helpers/dawg.js');
const CrossCheck = require('../helpers/CrossCheck.js');
const Scorer = require('../helpers/Scorer.js');
var fs = require('fs');


//Global variable to store the DAWG
var dawg;

//Global variable to store the board
var board;

//Global variable to store the blanks on the board
var blanks;

//Object for the word currently being played 
//Used to send to the Scorer
var wordBeingPlayed = {
    word: "",
    start:0,
    end:0,
    x: 0,
    y: 0,
    direction: "",
    blanks:[]
};

// //Safe copy
// var safeBoardCopy = 

exports.validateMove = (req, res) => {
    //Setting the global variables
    board = req.body.board;
    blanks = req.body.blanks;

    //Deep copy of the board
    let copyB = JSON.parse(JSON.stringify(req.body.board));
    
    //Directory to the text file
    let dictionaryText = "../scrabble-nodeJS/CollinsScrabbleWords(2019).txt";

    //Reading the text file
    async function readingDict(dict){
        const data = await fs.promises.readFile(dict);
        return data;
    }

    readingDict(dictionaryText).then((data) => {

        //Inserting the words into the DAWG
        let newD = new Dawg();
        const lines = data.toString().split('\r\n');
        for(let i =0; i < lines.length; i++){
            newD.insert(lines[i]);
        }
        newD.finish();

        dawg = newD;

        //Validating the word
        validateWord(req.body.positions).then(d =>{
           
            if(d){
                getScore(copyB, blanks).then(score => {
                    
                    res.json({
                        "pass": d,
                        "word": wordBeingPlayed.word,
                        "sent":"Sending Data",
                        "score": score
                    });
                    wordBeingPlayed = {
                        word: "",
                        start:0,
                        end:0,
                        x: 0,
                        y: 0,
                        direction: "",
                        blanks:[]
                    };
                });

            }
            else{
                res.json({
                    "pass": d,
                    "sent":"Sending Data"
                });
                wordBeingPlayed = {
                    word: "",
                    start:0,
                    end:0,
                    x: 0,
                    y: 0,
                    direction: "",
                    blanks:[]
                };
            }
            
            
        });
    });

}

//Get the score from the Scorer method
async function getScore(boardH, blanksOnBoard){
    let score = await Scorer.scorer(wordBeingPlayed, boardH, blanksOnBoard);
    return score;
}
//Validates the word
async function validateWord(positions){
    //Getting the positions and direction
    //Copy of the board so it can be manipulated
    let copyBoard = JSON.parse(JSON.stringify(board));
    
    wordBeingPlayed.direction = positions.direction;
    
    //Getting the actual positions
    let pos = positions.pos;

    //Will store the word
    let word = "";

    //Looping through the positions and setting the letters in the 
    //board copy
  
    for(let i = 0; i < positions.pos.length; i++){
        let x = pos[i].x;
        let y = pos[i].y;
        let l = pos[i].letter;
        
        copyBoard[y][x] = l;
    }

    

    //If the word played is in the column direction
    if(positions.direction == "C"){
        //Get the first tile played
        var firstTilePlaced = pos[0];
        
        //If the first tile placed is in the first row
        //Or the tile before the first tile placed is empty
        //Then only need to check it down direction
        if(firstTilePlaced.y == 0 || copyBoard[firstTilePlaced.y - 1][firstTilePlaced.x] == "*"){
            let found = true;
            //Get the first tile x and y coords
            let x = firstTilePlaced.x;
            let y = firstTilePlaced.y;

            //While loop to keep searching from the first tile down to an empty space
            while(found){

                if(y > 14){
                    found = false;
                    break;
                }

                if(copyBoard[y][x] !== "*"){
                    if(copyBoard[y][x] == "?"){
                       let getLetter = await checkBlanks(blanks, x, y);
                       word = word + getLetter;
                       wordBeingPlayed.blanks.push({x: x, y: y, letter: getLetter});
                    }
                    else{
                        word = word + copyBoard[y][x];
                    }
                  
                   y += 1;
               }

               else{
                   wordBeingPlayed.start = y - word.length;
                   wordBeingPlayed.end = y-1;
                   wordBeingPlayed.x = x;
                   wordBeingPlayed.y = y;
                   wordBeingPlayed.word = word;
                   found = false;
                   break;
               }
            }
        }

        else if(firstTilePlaced.y == 14 || copyBoard[firstTilePlaced.y + 1][firstTilePlaced.x] == "*"){
            let up = true;
            let x = firstTilePlaced.x;
            let currentY = firstTilePlaced.y;
            while(up){
                if(currentY < 0){
                    up = false;
                    break;
                }
                if(copyBoard[currentY][x] !== "*"){
                  
                    if(copyBoard[currentY][x] == "?"){
                         let getLetter = await checkBlanks(blanks, x, currentY);
                         word = getLetter + word;
                         wordBeingPlayed.blanks.push({x: x, y: currentY, letter: getLetter});
                    }
                    else{
                        word = copyBoard[currentY][x] + word;
                    }
                    
                    currentY = currentY - 1;
                }
                else{
                    wordBeingPlayed.start = currentY + 1;
                    wordBeingPlayed.end = currentY  + word.length;
                    wordBeingPlayed.x = x;
                    wordBeingPlayed.y = currentY;
                    wordBeingPlayed.word = word;
                    up = false;
                    break;
                }
            }
        }

        //If there is not a blank space above the first tile placed then
        //Check above it first then below
        else if(copyBoard[firstTilePlaced.y - 1][firstTilePlaced.x] !== "*"){
            //Checking up direction from first tile placed
            let up = true;
            let x = firstTilePlaced.x;
            let currentY = firstTilePlaced.y-1;
            while(up){
                if(currentY < 0){
                    up = false;
                    break;
                }
                if(copyBoard[currentY][x] !== "*"){
                
                    if(copyBoard[currentY][x] == "?"){
                        let getLetter = await checkBlanks(blanks, x, currentY);
                        word = getLetter + word;
                        wordBeingPlayed.blanks.push({x: x, y: currentY, letter: getLetter});
                    }
                    else{
                        word = copyBoard[currentY][x] + word;
                    }
                    
                    currentY = currentY - 1;
                }
                else{
                    up = false;
                    break;
                }
            }

            let down = true;
            let yDown = firstTilePlaced.y;
            while(down){
                if(yDown > 14){
                    down = false;
                    break;
                }
                if(copyBoard[yDown][x] !== "*"){
             
                    if(copyBoard[yDown][x] == "?"){
                        let getLetter = await checkBlanks(blanks, x, yDown);
                        word = word + getLetter;
                        wordBeingPlayed.blanks.push({x: x, y: yDown, letter: getLetter});
                    }
                    else{
                        word = word + copyBoard[yDown][x];
                    }
                    
                    yDown += 1;
                }
                else{
                    wordBeingPlayed.start = yDown - word.length;
                    wordBeingPlayed.end = yDown-1;
                    wordBeingPlayed.x = x;
                    wordBeingPlayed.y = yDown;
                    wordBeingPlayed.word = word;
                    down = false;
                    break;
                }
            }

        }

      
    }

    //Checking row direction
    else{
        let firstTilePlaced = pos[0];
        let lastTilePlaced = pos[pos.length - 1];
        //If the first tile placed is in the first row
        //Or the tile before the first tile placed is empty
        if(firstTilePlaced.x == 0 || copyBoard[firstTilePlaced.y][firstTilePlaced.x - 1] == "*"){
            let found = true;
            let x = firstTilePlaced.x;
            let y = firstTilePlaced.y;
            while(found){
                if(x > 14){
                    found = false;
                    break;
                }
                if(copyBoard[y][x] !== "*"){
                    if(copyBoard[y][x] == "?"){
                        let getLetter = await checkBlanks(blanks, x, y);
                        word = word + getLetter;
                        wordBeingPlayed.blanks.push({x: x, y: y, letter: getLetter});
                    }
                    else{
                        word = word + copyBoard[y][x];
                    } 
                    x += 1;
                }
                else{
                    wordBeingPlayed.start = x - word.length;
                    wordBeingPlayed.end = x-1;
                    wordBeingPlayed.x = x;
                    wordBeingPlayed.y = y;
                    wordBeingPlayed.word = word;
                    found = false;
                    break;
                }
            }
        }
        else if(firstTilePlaced.x == 14 || copyBoard[firstTilePlaced.y][firstTilePlaced.x + 1] == "*"){
            let left = true;
            let y = firstTilePlaced.y;
            let currentX = firstTilePlaced.x;
            while(left){
                if(currentX < 0){
                    left = false;
                    break;
                }
                if(copyBoard[y][currentX] !== "*" || currentX  == 0){
                   if(copyBoard[y][currentX] == "?"){
                       let getLetter = await checkBlanks(blanks, currentX, y);
                       word = getLetter + word;
                       wordBeingPlayed.blanks.push({x: currentX, y: y, letter: getLetter});
                    }
                    else{
                        word = copyBoard[y][currentX] + word;
                    }
                    currentX = currentX - 1;
                }
                else{
                    wordBeingPlayed.start = currentX + 1;
                    wordBeingPlayed.end = currentX + word.length;
                    wordBeingPlayed.x = currentX;
                    wordBeingPlayed.y = y;
                    wordBeingPlayed.word = word;
                    left = false;
                    break;
                }
            }

        }
        //If the it is not empty before the first tile placed
        else if(copyBoard[firstTilePlaced.y][firstTilePlaced.x - 1] !== "*"){
            let left = true;
            let y = firstTilePlaced.y;
            let currentX = firstTilePlaced.x-1;
            while(left){
                if(currentX < 0){
                    left = false;
                    break;
                }
                if(copyBoard[y][currentX] !== "*"){
                    
                    if(copyBoard[y][currentX] == "?"){
                        let getLetter = await checkBlanks(blanks, currentX, y);
                        word = getLetter + word;
                        wordBeingPlayed.blanks.push({x: currentX, y: y, letter: getLetter});
                    }
                    else{
                        word = copyBoard[y][currentX] + word;
                    }
                   
                    currentX = currentX - 1;
                }
                else{
                    left = false;
                    break;
                }
            }
            
            let right = true;
            let xDown = firstTilePlaced.x;
            while(right){
                if(xDown > 14){
                    right = false;
                    break;
                }
                if(copyBoard[y][xDown] !== "*"){
                    if(copyBoard[y][xDown] == "?"){
                        let getLetter = await checkBlanks(blanks, xDown, y);
                        word = word + getLetter;
                        wordBeingPlayed.blanks.push({x: xDown, y: y, letter: getLetter});
                    }
                    else{
                        word = word + copyBoard[y][xDown];
                    }
                    
                    xDown += 1;
                }
                else{
                    wordBeingPlayed.start = xDown - word.length;
                    wordBeingPlayed.end = xDown-1;
                    wordBeingPlayed.x = xDown;
                    wordBeingPlayed.y = y;
                    wordBeingPlayed.word = word;
                    right = false;
                    break;
                }
            
            }
        }
    }

    
    let checkWord = dawg.find(word);
    
    wordBeingPlayed.word = word;
    
    //If passes then do cross checks otherwise validation has failed
    if(checkWord){
        let crossCheck = await validateCrossCheck(positions);
      
        return crossCheck;
    }
    else{
        return false;
    }


}

//CHeck if the tile is a blank
async function checkBlanks(blanksOnBoard, x, y){

    if(blanksOnBoard.length !== 0 ){
        for(let i = 0; i < blanksOnBoard.length; i++){
            let bl = blanksOnBoard[i];
            if(bl.x == x && bl.y == y){
               
                return bl.letter;
            }
        }
        return "";
    }

    return "";

}

//Using the same cross check functions in computer pass the tile position
//If at least one cross check fails then return false otherwise move can be played
async function validateCrossCheck(pos){
   
    var crossCheck;
    for(let i = 0; i < pos.pos.length; i++){
        let currentTile = pos.pos[i];
        let letter = currentTile.letter;
        if(letter == "?"){
            letter = await checkBlanks(blanks, currentTile.x, currentTile.y);
        }
        
        let square = {
            x: currentTile.x,
            y: currentTile.y
        };
        
        
        if(pos.direction == "R"){
            
            
            crossCheck = await CrossCheck.rowCrossChecks(square, letter, board, dawg);
            if(!crossCheck){
                return false;
            }
        }
        else{
            
            crossCheck = await CrossCheck.columnCrossChecks(square, letter, board, dawg);
            if(!crossCheck){
                return false; 
            }
        }
    }


    return true;
}

async function getWordStartAndEnd(positions, word){
    let start = 0; 
    let end = 0;






}