module.exports = {

    rowCrossChecks: async function(anchor, letter, board, dawg){
     
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
               
                let check = dawg.find(word);
              
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
             
                let check = dawg.find(word);
               
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

            
            let check = dawg.find(word);
            
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
                
                let check = dawg.find(word);
              
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
                
                let check = dawg.find(word);
               
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
          
            let check = dawg.find(word);
         
            if(check == 0){
                return false
            }
            else if(!check){
                return false;
            }
            return true;     
        }

    },

}