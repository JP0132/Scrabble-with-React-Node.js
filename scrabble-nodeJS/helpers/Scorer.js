//Tile points
const points = {
    "A":{"points":1},
    "B":{"points":3},
    "C":{"points":3},
    "D":{"points":2},
    "E":{"points":1},
    "F":{"points":4},
    "G":{"points":2},
    "H":{"points":4},
    "I":{"points":1},
    "J":{"points":8},
    "K":{"points":5},
    "L":{"points":1},
    "M":{"points":3},
    "N":{"points":1},
    "O":{"points":1},
    "P":{"points":3},
    "Q":{"points":10},
    "R":{"points":1},
    "S":{"points":1},
    "T":{"points":1},
    "U":{"points":1},
    "V":{"points":4},
    "W":{"points":4},
    "X":{"points":8},
    "Y":{"points":4},
    "Z":{"points":10},
    "?":{"points":0},
};

//Coords for checking bonus
const BoardCoords = {
    'TW':[
        {x:0,y:0}, {x:7,y:0},{x:14,y:0},
        {x:0,y:7}, {x:14,y:7},
        {x:0,y:14}, {x:7,y:14}, {x:14,y:14}
    ],

    'DL':[
        {x:3,y:0}, {x:11,y:0},
        {x:6,y:2}, {x:8,y:2}, 
        {x:0,y:3}, {x:7,y:3}, {x:14,y:3}, 
        {x:2,y:6}, {x:6,y:6}, {x:8,y:6}, {x:12,y:6},
        {x:3,y:7},{x:11,y:7},
        {x:2,y:8}, {x:6,y:8}, {x:8,y:8}, {x:12,y:8},
        {x:0,y:11}, {x:7,y:11}, {x:14,y:11}, 
        {x:6,y:12}, {x:8,y:12},
        {x:3,y:14}, {x:11,y:14},
    ],

    'TL':[
        {x:5,y:1}, {x:9,y:1},
        {x:1,y:5}, {x:5,y:5}, {x:9,y:5}, {x:13,y:5},
        {x:1,y:9}, {x:5,y:9}, {x:9,y:9}, {x:13,y:9},
        {x:5,y:13}, {x:9,y:13},
    ],

    'DW':[
        {x:1,y:1}, {x:13,y:1},
        {x:2,y:2}, {x:12,y:2},
        {x:3,y:3}, {x:11,y:3},
        {x:4,y:4}, {x:10,y:4},
        {x:4,y:10}, {x:10,y:10},
        {x:3,y:11}, {x:11,y:11},
        {x:2,y:12}, {x:12,y:12},
        {x:1,y:13}, {x:13,y:13},
    ],
    'C':[
        {x:7,y:7},
    ]

}


module.exports = {
    //Get the score
    scorer: async function(coords, board, blanks){
        let word = coords.word;
        let direction = coords.direction;
        let start = coords.start;
        let end = coords.end;
        let x = coords.x;
        let y = coords.y;
        let blanksOnBoard = blanks;
        let blanksInWord = coords.blanks;
        var score = 0;
        let otherScore = [];
        let multiplier = 1;
        let letterBonus = 1;
        let rackCounter = 0;
        console.log(coords);

        //Check which direction
        if(direction == "R"){
            let currentX = start;
            for(let r = 0; r < word.length; r++){
                let currentSquare= board[y][currentX];
                //Add the tile point if on the board
                if(currentSquare !== "*"){
                    let checkBlanks = await checkIfBlank(blanksOnBoard, currentX, y);
                    if(!checkBlanks){
                        let tilePoints = points[currentSquare].points;
                        score += tilePoints;
                        letterBonus = 1;
                    }
                    currentX += 1;
                }
                
                //If not on the board
                else{
                    //Increment counter
                    rackCounter +=1;
                    //Check if blank
                    let checkBlanks = await checkIfBlank(blanksInWord, currentX, y);
                    //Check bonus
                    let checkBonus = await checkIfBonus(currentX, y);

                    //If word bonus multiple the multipler
                    if(checkBonus.type === "word"){
                      
                        multiplier *= checkBonus.multi;
                    }
                    //Assign the letter bonus
                    else if(checkBonus.type === "letter"){
                        letterBonus = 1;
                        letterBonus = checkBonus.multi;
                    }

            
                    //If not blank add the tile points * letter bonus
                    if(!checkBlanks){
                        let tilePoints = points[word[r]].points;
                        let b = tilePoints * letterBonus;
                        score = score + b;
                    }

                    let checkColumnWord;
                   
                    //check if other words have been formed get their score
                    if(checkBlanks){
                        checkColumnWord = await columnScore(board, blanksOnBoard, true, word[r], currentX, y, checkBonus);
                    }
                    else{
                        checkColumnWord = await columnScore(board, blanksOnBoard, false, word[r], currentX, y, checkBonus);
                    }
                    //Reset letter bonus
                    letterBonus = 1;
                    
                    //push the other  score to an array
                    otherScore.push(checkColumnWord);
                    //Move to next word
                    currentX += 1;   
                }       
            }
    
        }

        //Same concept as above but in column direction
        else{
            let currentY = start;
            for(let r = 0; r < word.length; r++){
                console.log(currentY);
                let currentSquare= board[currentY][x];
                if(currentSquare !== "*"){
                    let checkBlanks = await checkIfBlank(blanksOnBoard, x, currentY);
                   
                    if(!checkBlanks){
                        let tilePoints = points[currentSquare].points;
                        score += tilePoints;
                        letterBonus = 1;
                    }
                    currentY += 1;
                }
    
                else{
                    rackCounter +=1;
                    let checkBlanks = await checkIfBlank(blanksInWord, x, currentY);

                    let checkBonus = await checkIfBonus(x, currentY);
               
                    if(checkBonus.type === "word"){
                        multiplier *= checkBonus.multi;
                    }
                    else if(checkBonus.type === "letter"){
                        letterBonus = 1;
                        letterBonus = checkBonus.multi;
                    }


                    if(!checkBlanks){
                        let tilePoints = points[word[r]].points;
                        let b = tilePoints * letterBonus
                        score = score + b;
                    }
                    let checkRowWord;
                    if(checkBlanks){
                        checkRowWord = await rowScore(board, blanksOnBoard, true, word[r], x, currentY, checkBonus);
                    }
                    else{
                        checkRowWord = await rowScore(board, blanksOnBoard, false, word[r], x, currentY, checkBonus);
                    }
                    letterBonus = 1;
                  
                    if(checkRowWord !== 0){
                        otherScore.push(checkRowWord);
                    }

                    
                    currentY += 1;  
                }       
            }
    
        }
        
        //Multiply the score for the word scores
        score = score * multiplier;

        //Add the other scores in
        if(otherScore.length !== 0){
            otherScore.forEach((element) => {
              
                score += element;
              
            });
        }

        //If the count is 7 then all tiles have been used so extra 50 points
        if(rackCounter == 7){
            score = score + 50;
        }
        //return the score
        return score;
    },
}

//Checks if the square is a bonus or not
async function checkIfBonus(x, y){
    var sqTypeKeys = Object.keys(BoardCoords);
    let bonus = {
        type: "",
        multi: 1
    }
    for(let i = 0; i < sqTypeKeys.length; i++){
        const currentType = BoardCoords[sqTypeKeys[i]];
        for(let j = 0; j < currentType.length; j++){
            if(currentType[j].x == x && currentType[j].y == y){
                let type = sqTypeKeys[i];
                if(type === "TW"){
                    bonus.type = "word";
                    bonus.multi = 3;
                }
                else if(type === "DL"){
                    bonus.type = "letter";
                    bonus.multi = 2;
                }
                else if(type === "TL"){
                    bonus.type = "letter";
                    bonus.multi = 3;
                }
                else if(type === "DW"){
                    bonus.type = "word";
                    bonus.multi = 2;
                }
                else if(type === "C"){
                    bonus.type = "word";
                    bonus.multi = 2;
                }
                return bonus;
            }
        }
    }
    return bonus;
}

//CHecks if the tile is blank or not
async function checkIfBlank(blanks, x, y){
    if(blanks.length == 0){
        return false;
    }
    else{
        for(let i = 0; i < blanks.length; i++){
            let bl = blanks[i];
            if(bl.x == x && bl.y == y){
                return true 
            }
        }
        return false;
    }
}

//Get the other words formed on a row
//Return 0 if no scores were found
//If found add the tile point to the score and return it
async function rowScore(board, blanksOnBoard, letterIsBlank, letter, x, y, checkBonus){

    let score = 0;
    let multiplier = 1;
    let letterBonus = 1;
    if(checkBonus.type == "word"){
        multiplier *= checkBonus.multi;
    }
    else if(checkBonus.type == "letter"){
        if(!letterIsBlank){
            
            letterBonus *= checkBonus.multi;
            
        } 
    }
    
    if(x == 0 || (x !== 14 && board[y][x-1] == "*")){
        if(board[y][x+1] !== "*"){
            let row = board[y];
            if(!letterIsBlank){
                let tilePoint = points[letter].points;
                score = score + (tilePoint * letterBonus);
            
            }
            for(let i = x+1; i < row.length; i++){
                let currentSquare = row[i];
              
                if(currentSquare !== "*"){
                    let blankCheck = await checkIfBlank(blanksOnBoard, i, y);
                    if(!blankCheck){
                        let tilePoints = points[currentSquare].points;
                    
                        score += tilePoints;
                      
                       
                    }
                }
                else{
                    return score * multiplier;
                }
                
            }
            
        }
        else{
            return 0;
        }
    }
    else if(x == 14 || board[y][x+1] == "*"){
        if(board[y][x-1] !== "*"){
            let row = board[y];
            if(!letterIsBlank){
                score += ((points[letter].points) * letterBonus);
            }
            for(let i = x-1; i >= 0; i--){
                let currentSquare = row[i];
              
                if(currentSquare !== "*"){
                    let blankCheck = await checkIfBlank(blanksOnBoard, i, y);
                    if(!blankCheck){
                        let tilePoints = points[currentSquare].points;
                        score += tilePoints;
                    }
                }
                else{
                    return score * multiplier;
                }   
            }

        }
        else{
            return 0;
        }
    }

    else if(board[y][x+1] !== "*" && board[y][x-1] !== "*"){
        let row = board[y];
        if(!letterIsBlank){
            score += ((points[letter].points) * letterBonus);
        }

        for(let up = x-1; up >= 0; up--){
            let currentSquare = row[up];
          
            if(currentSquare !== "*"){
                let blankCheck = await checkIfBlank(blanksOnBoard, up, y);
             
                if(!blankCheck){
                    let tilePoints = points[currentSquare].points;
                    score += tilePoints;
                } 
            }
            else{
                break;
            }
        }

        for(let down = x+1; down < row.length; down++){
            let currentSquare = row[down];
            
            if(currentSquare !== "*"){
                let blankCheck = await checkIfBlank(blanksOnBoard, down, y);
                if(!blankCheck){
                    let tilePoints = points[currentSquare].points;
                    score += tilePoints;
                    
                } 
            }
            else{
                break;
            }

        }
        return score * multiplier;;
    }

    else{
        return 0;
    }


}

//Same as above but column search
async function columnScore(board, blanksOnBoard, letterIsBlank, letter, x, y, bonus){
 
    let score = 0;
    let multiplier = 1;
    let letterBonus = 1;
    if(bonus.type ==="word"){
        multiplier *= bonus.multi;
       
    }
    else if(bonus.type === "letter"){
        letterBonus *= bonus.multi;
       
    }

    const getColumn = (arr, n) => arr.map(x => x[n]);
    if(y == 0 || (y !== 14 && board[y-1][x] == "*")){
        if(board[y+1][x] !== "*"){
            let col = getColumn(board, x);
            if(!letterIsBlank){
                let tilePoints = points[letter].points;
                let b = tilePoints * letterBonus;
                score = score + b;
               
            }
            for(let i = y+1; i < col.length; i++){
                let currentSquare = col[i];
               
                if(currentSquare !== "*"){
                    let blankCheck = await checkIfBlank(blanksOnBoard, x, i);
                    if(!blankCheck){
                       
                        score += points[currentSquare].points;
                    
                    }
                }
                else{
                   
                    return score * multiplier;
                }
                
            }
            
        }
        else{
            return 0;
        }
    }
    else if(y == 14 || board[y+1][x] == "*"){
        if(board[y-1][x] !== "*"){
            let col = getColumn(board, x);
            if(!letterIsBlank){
                let tilePoints = points[letter].points;
         
                let b = tilePoints * letterBonus;
             
                score = score + b;
                
            }
            for(let i = y-1; i >= 0; i--){
                let currentSquare = col[i];
              
                if(currentSquare !== "*"){
                    let blankCheck = await checkIfBlank(blanksOnBoard, x, i);
                  
                    if(!blankCheck){
                      
                        score += points[currentSquare].points;
                       
                    }
                }
                else{
                
                    return score * multiplier;
                }   
            }

        }
        else{
            return 0;
        }
    }

    else if(board[y+1][x] !== "*" && board[y-1][x] !== "*"){
        let col = getColumn(board, x);
        if(!letterIsBlank){
            let tilePoints = points[letter].points;
            score += (tilePoints*letterBonus);
        }

        for(let up = y-1; up >= 0; up--){
            let currentSquare = col[up];
          
            if(currentSquare !== "*"){
                let blankCheck = await checkIfBlank(blanksOnBoard, x, up);
                if(!blankCheck){
                    score += points[currentSquare].points;
                } 
            }
            else{
                break;
            }
        }

        for(let down = y+1; down < col.length; down++){
            let currentSquare = col[down];
          
            if(currentSquare !== "*"){
                let blankCheck = await checkIfBlank(blanksOnBoard, x, down);
                if(!blankCheck){
                    score += points[currentSquare].points;
                } 
            }
            else{
                break;
            }

        }
       
        return score * multiplier;
    }

    else{
        return 0;
    }

  
    
}
