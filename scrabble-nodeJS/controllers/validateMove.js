const Dawg = require('../helpers/dawg.js');
const CrossCheck = require('../helpers/CrossCheck.js');
const readline = require('readline');
var fs = require('fs');
var dawg;
var board;

exports.validateMove = (req, res) => {
    board = req.body.board;
    let dictionaryText = "../scrabble-nodeJS/CollinsScrabbleWords(2019).txt";

    async function readingDict(dict){
        const data = await fs.promises.readFile(dict);
        return data;
    }

    readingDict(dictionaryText).then((data) => {
        let newD = new Dawg();
        const lines = data.toString().split('\r\n');
        //console.log(lines);
        for(let i =0; i < lines.length; i++){
            newD.insert(lines[i]);
        }
        newD.finish();

        dawg = newD;

        validateWord(req.body.positions, board).then(d =>{
            console.log(dawg.find("FOR"));
            res.json({
                "pass": d,
                "sent":"Sending Data"
            });
            //dawg = undefined;
            //board = undefined;
        });
    });

   
    // const searchDawg =  async () => {

    //     dawg = await createDawg();
        

    //     setTimeout(function(){
    //         //let vw = validateWord(req.body.positions, req.body.board);
    //         validateWord(req.body.positions, board).then(d =>{
    //             res.json({
    //                 "pass": d,
    //                 "sent":"Sending Data"
    //             });
    //             dawg = undefined;
    //             board = undefined;
    //         });
    //     }, 2000) 
    // }

    // searchDawg();
}

async function createDawg(){
    const dawg = new Dawg("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    return dawg;
}

async function validateWord(positions, copyBoard){
    //Getting the positions and direction
    //Copy of the board so it can be manipulated

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
        let firstTilePlaced = pos[0];
        let lastTilePlaced = pos[pos.length - 1];

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
               if(copyBoard[y][x] !== "*"){
                   word = word + copyBoard[y][x];
                   y += 1;
               }
               else{
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
                if(copyBoard[currentY][x] !== "*"){
                    word = copyBoard[currentY][x] + word;
                    currentY = currentY - 1;
                }
                else{
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
                if(copyBoard[currentY][x] !== "*"){
                    word = copyBoard[currentY][x] + word;
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
                if(copyBoard[yDown][x] !== "*"){
                    word = word + copyBoard[yDown][x];
                    yDown += 1;
                }
                else{
                    down = false;
                    break;
                }
            }

        }

        // else if(firstTilePlaced.y == 14 || board[firstTilePlaced.y + 1][firstTilePlaced.x] == "*"){
        //     let found = true;
        //     let x = firstTilePlaced.x;
        //     let y = firstTilePlaced.y;
        //     while(found){
        //        if(board[y][x] !== "*"){
        //            word = word + board[y][x];
        //            y += 1;
        //        }
        //        else{
        //            found = false;
        //            break;
        //        }
        //     }
        // }
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
               if(copyBoard[y][x] !== "*"){
                   word = word + copyBoard[y][x];
                   x += 1;
               }
               else{
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
                if(copyBoard[y][currentX] !== "*" || currentX  == 0){
                    word = copyBoard[y][currentX] + word;
                    currentX = currentX - 1;
                }
                else{
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
                if(copyBoard[y][currentX] !== "*" || currentX  == 0){
                    word = copyBoard[y][currentX] + word;
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
                if(copyBoard[y][xDown] !== "*" || xDown == 14){
                    word = word + copyBoard[y][xDown];
                    xDown += 1;
                }
                else{
                    xDown = false;
                    break;
                }
            }

        }
    }

    console.log("Word being played", word);
    let checkWord = dawg.find(word);
    console.log(checkWord);
    if(checkWord){
        let crossCheck = await validateCrossCheck(positions);
        console.log("crossceck", crossCheck);
        return crossCheck;
    }
    else{
        return false;
    }


}
async function validateCrossCheck(pos){
    var crossCheck;
    for(let i = 0; i < pos.pos.length; i++){
        let currentTile = pos.pos[i];
        let letter = currentTile.letter;
        let square = {
            x: currentTile.x,
            y: currentTile.y
        };
        if(pos.direction == "R"){
            console.log("Here");
            crossCheck = await CrossCheck.rowCrossChecks(square, letter, board, dawg);
        }
        else{
            console.log("Here2");
            crossCheck = await CrossCheck.columnCrossChecks(square, letter, board, dawg);
        }
    }

    return crossCheck;


}