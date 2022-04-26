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

module.exports = {
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
    
    
        if(direction == "R"){
            let currentX = start;
            for(let r = 0; r < word.length; r++){
                let currentSquare= board[y][currentX];
                if(currentSquare !== "*"){
                    let checkBlanks = await checkIfBlank(blanksOnBoard, currentX, y);
                    if(!checkBlanks){
                        let tilePoints = points[currentSquare].points;
                        score += tilePoints;
                    }
                    currentX += 1;
                }
    
                else{
                    let checkBlanks = await checkIfBlank(blanksInWord, currentX, y);
                    if(!checkBlanks){
                        let tilePoints = points[word[r]].points;
                        score += tilePoints;
                    }
                    let checkColumnWord = await columnScore(board, blanksOnBoard, true, word[r], currentX, y);
                    score += checkColumnWord;
                    currentX += 1;   
                }       
            }
    
        }
        else{
            let currentY = start;
            for(let r = 0; r < word.length; r++){
                let currentSquare= board[currentY][x];
                if(currentSquare !== "*"){
                    let checkBlanks = await checkIfBlank(blanksOnBoard, x, currentY);
                    if(!checkBlanks){
                        let tilePoints = points[currentSquare].points;
                        score += tilePoints;
                    }
                    currentY += 1;
                }
    
                else{
                    let checkBlanks = await checkIfBlank(blanksInWord, x, currentY);
                    if(!checkBlanks){
                        let tilePoints = points[word[r]].points;
                        score += tilePoints;
                    }
                    let checkRowWord = await rowScore(board, blanksOnBoard, true, word[r], x, currentY);
                    score += checkRowWord;
                    currentY += 1;  
                }       
            }
    
        }
    
    
        return score;
    

    },
}

async function scorer2(coords, board, blanks){
    let word = coords.word;
    let direction = coords.direction;
    let start = coords.start;
    let end = coords.end;
    let x = coords.x;
    let y = coords.y;
    let blanksOnBoard = blanks;
    let blanksInWord = coords.blanks;
    var score = 0;


    if(direction == "R"){
        let currentX = start;
        for(let r = 0; r < word.length; r++){
            let currentSquare= board[y][currentX];
            if(currentSquare !== "*"){
                let checkBlanks = await checkIfBlank(blanksOnBoard, currentX, y);
                if(!checkBlanks){
                    let tilePoints = points[currentSquare].points;
                    score += tilePoints;
                }
                currentX += 1;
            }

            else{
                let checkBlanks = await checkIfBlank(blanksInWord, currentX, y);
                if(!checkBlanks){
                    let tilePoints = points[currentSquare].points;
                    score += tilePoints;
                }
                let checkColumnWord = await columnScore(board, blanksOnBoard, true, word[r], currentX, y);
                score += checkColumnWord;
                currentX += 1;   
            }       
        }

    }
    else{
        let currentY = start;
        for(let r = 0; r < word.length; r++){
            let currentSquare= board[currentY][x];
            if(currentSquare !== "*"){
                let checkBlanks = await checkIfBlank(blanksOnBoard, x, currentY);
                if(!checkBlanks){
                    let tilePoints = points[currentSquare].points;
                    score += tilePoints;
                }
                currentY += 1;
            }

            else{
                let checkBlanks = await checkIfBlank(blanksInWord, x, currentY);
                if(!checkBlanks){
                    let tilePoints = points[currentSquare].points;
                    score += tilePoints;
                }
                let checkRowWord = await rowScore(board, blanksOnBoard, true, word[r], x, currentY);
                score += checkRowWord;
                currentY += 1;  
            }       
        }

    }


    return score;

    

}

async function checkIfBlank(blanks, x, y){
    if(blanks.length == 0){
        return false;
    }
    else{
        for(let i = blanks; i < blanks.length; i++){
            let bl = blanks[i];
            if(bl.x == x && bl.y == y){
                return true 
            }
        }
        return false;
}
    }
    
async function rowScore(board, blanksOnBoard, letterIsBlank, letter, x, y){
    let score = 0;
    let multiplier = 1;
    if(x == 0 || (x !== 14 && board[y][x-1] == "*")){
        if(board[y][x+1] !== "*"){
            let row = board[y];
            if(!letterIsBlank){
                score += points[letter].points;
            }
            for(let i = x+1; i < row.length; i++){
                let currentSquare = row[i];
                if(currentSquare !== "*"){
                    let blankCheck = checkIfBlank(blanksOnBoard, i, y);
                    if(!blankCheck){
                        score += points[currentSquare].points;
                    }
                }
                else{
                    return score;
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
                score += points[letter].points;
            }
            for(let i = x-1; i >= 0; i++){
                let currentSquare = row[i];
                if(currentSquare !== "*"){
                    let blankCheck = checkIfBlank(blanksOnBoard, i, y);
                    if(!blankCheck){
                        score += points[currentSquare].points;
                    }
                }
                else{
                    return score;
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
            score += points[letter].points;
        }

        for(let up = x-1; up >= 0; up++){
            let currentSquare = row[up];
            if(currentSquare !== "*"){
                let blankCheck = checkIfBlank(blanksOnBoard, i, y);
                if(!blankCheck){
                    score += points[currentSquare].points;
                } 
            }
            else{
                break;
            }
        }

        for(let down = x+1; down < col.length; down++){
            let currentSquare = row[down];
            if(currentSquare !== "*"){
                let blankCheck = checkIfBlank(blanksOnBoard, i, y);
                if(!blankCheck){
                    score += points[currentSquare].points;
                } 
            }
            else{
                break;
            }

        }
        return score;
    }

    else{
        return 0;
    }


}
async function columnScore(board, blanksOnBoard, letterIsBlank, letter, x, y){
    let score = 0;
    let multiplier = 1;
    const getColumn = (arr, n) => arr.map(x => x[n]);
    if(y == 0 || (y !== 14 && board[y-1][x] == "*")){
        if(board[y+1][x] !== "*"){
            let col = getColumn(board, x);
            if(!letterIsBlank){
                score += points[letter].points;
            }
            for(let i = y+1; i < col.length; i++){
                let currentSquare = col[i];
                if(currentSquare !== "*"){
                    let blankCheck = checkIfBlank(blanksOnBoard, x, i);
                    if(!blankCheck){
                        score += points[currentSquare].points;
                    }
                }
                else{
                    return score;
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
                score += points[letter].points;
            }
            for(let i = y-1; i >= 0; i++){
                let currentSquare = col[i];
                if(currentSquare !== "*"){
                    let blankCheck = checkIfBlank(blanksOnBoard, x, i);
                    if(!blankCheck){
                        score += points[currentSquare].points;
                    }
                }
                else{
                    return score;
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
            score += points[letter].points;
        }

        for(let up = y-1; up >= 0; up++){
            let currentSquare = col[up];
            if(currentSquare !== "*"){
                let blankCheck = checkIfBlank(blanksOnBoard, x, i);
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
                let blankCheck = checkIfBlank(blanksOnBoard, x, i);
                if(!blankCheck){
                    score += points[currentSquare].points;
                } 
            }
            else{
                break;
            }

        }
        return score;
    }

    else{
        return 0;
    }

  
    
}
