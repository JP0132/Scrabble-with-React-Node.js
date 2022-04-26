module.exports = {
    crossCheck: async function(anchor, letter, board, dawg){
        let x = anchor.x;
        let y = anchor.y;
        var word = letter;
    },


    rowCrossChecks: async function(anchor, letter, board, dawg){
        //console.log("HERE");
        let x = anchor.x;
        let y = anchor.y;
        var word = letter;
        const getColumn = (arr, n) => arr.map(x => x[n]);

        if(y == 0 || board[y-1][x] == "*"){
            if(y == 14){
                return true;
            }
            if(board[y+1][x] !== "*"){
                let currentY = y+1;
                let col = getColumn(board, x);
                for(let i = currentY; i < col.length; i++){
                    let currentPos = col[i];
                    if(currentPos !== "*"){
                        word = word + currentPos;
                    }
                    else{
                        break;
                    }
                }
                //console.log("to right ", word);
                let check = dawg.find(word);
                //console.log(check);
                if(check == 0){
                    return false;
                }
                else if(!check){
                    return false;
                }
                return true;     
            }

            else{
                return true;
            }
        }

        else if(y == 14 || board[y+1][x] == "*"){
            if(board[y-1][x] !== "*"){
                let col = getColumn(board, x);
                let currentY = y-1;
                for(let i = currentY; i >= 0; i--){
                    let currentPos = col[i];
                    if(currentPos !== "*"){
                        word = currentPos + word;
                    }
                    else{
                        break;
                    }
                }
                console.log("to left ", word)
                let check = dawg.find(word);
                console.log(check);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;     
            }

            else{
                return true;
            }

        }
        
        else if(board[y-1][x] !== "*" && board[y+1][x] !== "*"){
            let col = getColumn(board, x);
            let currentY1 = y-1;
            for(let i = currentY1; i >= 0; i--){
                let currentPos = col[i];
                if(currentPos !== "*"){
                    word = currentPos + word;
                }
                else{
                    break;
                }
            }
            let currentY2 = y+1;
            for(let j = currentY2; j < col.length; j++){
                let currentPos = col[j];
                if(currentPos !== "*"){
                    word = word + currentPos;
                }
                else{
                    break;
                }
            }

            //console.log("Both ", word);
            let check = dawg.find(word);
            //console.log(check);
            if(check == 0){
                return false
            }
            else if(!check){
                return false;
            }
            return true;     
        }
    },

    columnCrossChecks: async function(anchor, letter, board, dawg){
        let x = anchor.x;
        let y = anchor.y;
        var word = letter;
        if(x == 0 || board[y][x-1] == "*"){
            if(x == 14){
                return true;
            }
            if(board[y][x+1] !== "*"){
                let currentX = x+1;
                let row = board[y];
                for(let i = currentX; i < row.length; i++){
                    let currentPos = row[i];
                    if(currentPos !== "*"){
                        word = word + currentPos;
                    }
                    else{
                        break;
                    }
                }
                //console.log("down Col ", word);
                let check = dawg.find(word);
                //console.log(check);
                if(check == 0){
                    return false;
                }
                else if(!check){
                    return false;
                }
                return true;     
            }

            else{
                return true;
            }
        }


        else if(x == 14 || board[y][x+1] == "*"){

            if(board[y][x-1] !== "*"){
                let row = board[y];
                let currentX = x-1;
                for(let i = currentX; i >= 0; i--){
                    let currentPos = row[i];
                    if(currentPos !== "*"){
                        word = currentPos + word;
                    }
                    else{
                        break;
                    }
                }
                console.log("up col ", word);
                let check = dawg.find(word);
                console.log(check);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;     
            }

            else{
                return true;
            }
        }
        
        
        else if(board[y][x-1] !== "*" && board[y][x+1] !== "*"){
            let row = board[y];
            let currentX1 = x-1;
            for(let i = currentX1; i >= 0; i--){
                let currentPos = row[i];
                if(currentPos !== "*"){
                    word = currentPos + word;
                }
                else{
                    break;
                }
            }

            let currentX2 = x+1;
            for(let j = currentX2; j < row.length; j++){
                let currentPos = row[j];
                if(currentPos !== "*"){
                    word = word + currentPos;
                }
                else{
                    break;
                }
            }
            //console.log("Both Col ", word);
            let check = dawg.find(word);
            //console.log(check);
            if(check == 0){
                return false
            }
            else if(!check){
                return false;
            }
            return true;     
        }

    },

    
    rowCrossCheck: async function(anchor, letter, board, dawg){
        let copyBoard = [...board];
        //When checking the top row of the board
        //The square below the current square is not blank
        //Start the check
        if(anchor.y == 0 && copyBoard[anchor.y+1][anchor.x] !== "*"){
            if(copyBoard[anchor.y+1][anchor.x] !== "*"){
                let currentLetters = letter;
                let found = true;
                counter = 1;
                while(found){
                    let currentSquare = copyBoard[anchor.y+counter][anchor.x]
                    if(currentSquare !== "*"){
                        currentLetters += currentSquare;
                        counter += 1;
                    }
                    else{
                        found = false;
                        break;
                    }
                }
                
                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }
            else{
                return true;
            }
        }
        else if(anchor.y == 14){
            if(copyBoard[anchor.y-1][anchor.x] !== "*"){
                let currentLetters = letter;
                let found = true;
                counter = 1;
                while(found){
                    let currentSquare = copyBoard[anchor.y-counter][anchor.x]
                    if(currentSquare !== "*"){
                        currentLetters = currentSquare + currentLetters;
                        counter += 1;
                    }
                    else{
                        found = false;
                        break;
                    }
                }
                let check = dawg.find(currentLetters);
                
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }
            else{
                return true;
            }
        }
        else{
            if(copyBoard[anchor.y-1][anchor.x] !== "*" && copyBoard[anchor.y+1][anchor.x] !== "*"){
                let currentLetters = letter;
                let up = true;
                let down = true;
                let counter = 1
                while(up){
                    let currentSquare = copyBoard[anchor.y-counter][anchor.x]
                    if(currentSquare !== "*"){
                        currentLetters = currentSquare + currentLetters;
                        counter += 1;
                    }
                    else{
                        up = false;
                        counter = 0;
                        break;
                    }
                }

                while(down){
                    let currentSquare = copyBoard[anchor.y+counter][anchor.x]
                    if(currentSquare !== "*"){
                        currentLetters = currentLetters + currentSquare;
                        counter += 1;
                    }
                    else{
                        down = false;
                        counter = 0;
                        break;
                    }
                }

                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }
            else if(copyBoard[anchor.y-1][anchor.x] !== "*"){
                let currentLetters = letter;
                let up = true;
                let counter = 1
                while(up){
                    let currentSquare = copyBoard[anchor.y-counter][anchor.x]
                    if(currentSquare !== "*"){
                        currentLetters = currentSquare + currentLetters;
                        counter += 1;
                    }
                    else{
                        up = false;
                        counter = 0;
                        break;
                    }
                }

                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }

            else if(copyBoard[anchor.y+1][anchor.x] !== "*"){
                let currentLetters = letter;
                let down = true;
                let counter = 1
                while(down){
                    let currentSquare = copyBoard[anchor.y+counter][anchor.x]
                    if(currentSquare !== "*"){
                        currentLetters = currentLetters + currentSquare;
                        counter += 1;
                    }
                    else{
                        down = false;
                        counter = 0;
                        break;
                    }
                }

                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;

            }
            else{
                return true;
            }

        }

    },

    columnCrossCheck: async function(anchor, letter, board, dawg){
        let copyBoard = [...board];
        //When checking the top row of the board
        if(anchor.x == 0){
            //The square below the current square is not blank
            //Start the check
            if(copyBoard[anchor.y][anchor.x+1] !== "*"){
                let currentLetters = letter;
                let found = true;
                counter = 1;
                while(found){
                    let currentSquare = copyBoard[anchor.y][anchor.x+counter]
                    if(currentSquare !== "*"){
                        currentLetters += currentSquare;
                        counter += 1;
                    }
                    else{
                        found = false;
                        break;
                    }
                }
                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }
            else{
                return true;
            }
        }
        else if(anchor.x == 14){
            if(copyBoard[anchor.y][anchor.x-1] !== "*"){
                let currentLetters = letter;
                let found = true;
                counter = 1;
                while(found){
                    let currentSquare = copyBoard[anchor.y][anchor.x-counter]
                    if(currentSquare !== "*"){
                        currentLetters = currentSquare + currentLetters;
                        counter += 1;
                    }
                    else{
                        found = false;
                        break;
                    }
                }
                let check = dawg.find(currentLetters);
                
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }
            else{
                return true;
            }
        }
        else{
            if(copyBoard[anchor.y][anchor.x-1] !== "*" && copyBoard[anchor.y][anchor.x+1] !== "*"){
                let currentLetters = letter;
                let up = true;
                let down = true;
                let counter = 1
                while(up){
                    let currentSquare = copyBoard[anchor.y][anchor.x-counter]
                    if(currentSquare !== "*"){
                        currentLetters = currentSquare + currentLetters;
                        counter += 1;
                    }
                    else{
                        up = false;
                        counter = 0;
                        break;
                    }
                }

                while(down){
                    let currentSquare = copyBoard[anchor.y][anchor.x+counter]
                    if(currentSquare !== "*"){
                        currentLetters = currentLetters + currentSquare;
                        counter += 1;
                    }
                    else{
                        down = false;
                        counter = 0;
                        break;
                    }
                }

                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }
            else if(copyBoard[anchor.y][anchor.x-1] !== "*"){
                let currentLetters = letter;
                let up = true;
                let counter = 1
                while(up){
                    let currentSquare = copyBoard[anchor.y][anchor.x-counter]
                    if(currentSquare !== "*"){
                        currentLetters = currentSquare + currentLetters;
                        counter += 1;
                    }
                    else{
                        up = false;
                        counter = 0;
                        break;
                    }
                }

                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;
            }

            else if(copyBoard[anchor.y][anchor.x+1] !== "*"){
                let currentLetters = letter;
                let down = true;
                let counter = 1
                while(down){
                    let currentSquare = copyBoard[anchor.y][anchor.x+counter]
                    if(currentSquare !== "*"){
                        currentLetters = currentLetters + currentSquare;
                        counter += 1;
                    }
                    else{
                        down = false;
                        counter = 0;
                        break;
                    }
                }

                let check = dawg.find(currentLetters);
                if(check == 0){
                    return false
                }
                else if(!check){
                    return false;
                }
                return true;

            }
            else{
                return true;
            }

        }

    },

}