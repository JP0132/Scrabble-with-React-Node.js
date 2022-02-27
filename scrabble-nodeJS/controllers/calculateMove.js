var fs = require('fs');
const readline = require('readline');



exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    //console.log(req.body.rack);
    //console.log(req.body.board);
    let rack = req.body.rack;
    let board = req.body.board;

    const searchGaddag =  async () => {
        const result = await createGaddag();

        setTimeout(function(){
            console.log("finishedBuilding");
            //console.log(result.find("HE"));
            //console.log(result.find("OUT"));
            //console.log(result.wordExist("HEL"));
            console.log(result.wordExist("OUTS"));
            console.log(result.wordExist("OUTR"));
            searchBoard(board, result, rack).then(d =>{
                res.json({
                    "letters": d,
                    "hello":"chris"
                })
            });
            // res.json({
            //     "hello":"chris"
            // });
        }, 5000) 
    }
    
    searchGaddag();
    
}


async function createGaddag(){
    const g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    return g;

}

async function searchBoard(board, gaddag, rack){
    //Search Each Row
    let rowMoves = await searchAllRows(board, gaddag, rack);

    return rowMoves; 
}


async function searchAllRows(board, gaddag, rack){
    //Search Each Row
    var validWords = [];
    for(let row = 0; row < board.length; row++){
        let currentRow = board[row];
        //console.log(row, currentRow);
        //Check if row is empty or not
        var flag = 1;
        let blankSq = "*";
        var squarePosition = 0;
        for(let i = 0; i < currentRow.length; i++){
            if(currentRow[i] !== blankSq){
                squarePosition = i;
                flag = 0;
                break;
            }
        }
        //If row is not empty
        if(flag === 0){
            //Checking this row
            //Adding letter found on the row to list
            
            let currentLetterRow = "";
            var freeSpacesLeft = 0;
            var freeSpacesRight = 0;
         
            let startposition = 0;
            let endposition = 0;
            let sep = 0;

            var lettersOnRow = [];
        
            for(let x = 0; x < currentRow.length; x++){
                //console.log("x", x);
                
                let currentSquare = currentRow[x];
                
                //console.log(lettersOnRow);
               
                if(currentSquare !== "*"){
                  
                    if(freeSpacesRight !== 0){
                        let lset = [];
                        endposition = x-freeSpacesRight;
                        sep +=1;
                
                       
                        rightFreePos = x-1;
                        
                        lset.push(freeSpacesLeft, freeSpacesRight, currentLetterRow, startposition, endposition, row);
                        lettersOnRow.push(lset);
                        if(sep > 0){
                            freeSpacesLeft = freeSpacesRight;
                            freeSpacesRight = 0;
                        }
                        else{
                            currentLetterRow = "";
                            freeSpacesLeft = 0;
                            freeSpacesRight = 0;
                        }
                        
                    }
                    if(currentLetterRow == ""){
                        startposition = x;
                    }
                    
                
                    currentLetterRow += currentSquare;
                 
                }
                else{
                    if(currentLetterRow !== ""){
                        freeSpacesRight = freeSpacesRight + 1;

                    }
                    else{
                        leftFreePos = x;
                        freeSpacesLeft = freeSpacesLeft + 1;

                    }
                    
                }

                if(x === 14 && freeSpacesRight !== 0){
                    let lset = [];
                    endposition = x-freeSpacesRight;
                    lset.push(freeSpacesLeft, freeSpacesRight, currentLetterRow, startposition, endposition, row);
                    lettersOnRow.push(lset);
                    //console.log("current", lettersOnRow);
                }
                
            }

        

           validWords.push(lettersOnRow);
           

            
        }
    
    }
    return validWords;
}




/*
Concept of GADDAG
Each word inserted n times => n representing the length of the word
Each insertion has a special symbol
Prefix is reversed
GADDAG is based on a DAWG, which is based on a TRIE
*Using npm gaddag implementation with changes
*/




class GaddagNode{
    constructor(id = 0){
        this.id = id;
        this.edges = {};
        this.$ = 0;
    }

}



class Gaddag{
    constructor (dict){
        //fs.readFile(dict, (err, data) => this.loadDictionary(err, data));
        this.root = new GaddagNode();

        //Vars to be used for gaddag implementation
        //Previous word entered into the gaddag
        this.previousWord = "";
        this.uncheckedNodes = [];
        this.nextId = 1;
        this.minimizedNodes = {};

        //Read the dictionary text file into the data structure
        this.readLine(dict);
        
    }

    str(node){
        //checks if the end of the the node or not
        var s = node.$ ? "1" : "0";
        //Get all the object keys of the nodes
        var keys = Object.keys(node.edges);
        for(let i = 0; i < keys.length; i++){
            s+= "_" + node.edges[keys[i]] + "_" + node.edges[keys[i]].id;
        }
        return s;
    }

    minimization(nodeNum){
        //Going through the uncheckedNodes
        for(let i = this.uncheckedNodes.length-1; i > nodeNum - 1; i--){
            //Getting set of uncheckedNodes
            var tuple = this.uncheckedNodes.pop();
            var childKey = this.str(tuple.childNode);
            var node = this.minimizedNodes[childKey];

            if(node){
                tuple.parentNode.edges[tuple.letter] = node;
            }
            else{
                this.minimizedNodes[childKey] = tuple.childNode;
            }
        }
    }

   


    insert(word){
        //console.log("inserting", word);
        let commonPrefix = 0;
    

        //Selecting the smallest word length so no out of bounds error occurs
        var minWordLength = Math.min(word.length, this.previousWord.length);

        //Find where in the word the common prefix is up till in the new word
        //Usec to minimise the nodes and where to insert the node
        for(let i = 0; i < minWordLength; i++){
            if(word[i] !== this.previousWord[i]){
                break
            }
            commonPrefix +=1;
        }
        
        //mimise the nodes
        this.minimization(commonPrefix);

        //If a new node "tree" for a new letter is needed
        var node;
        if(this.uncheckedNodes.length === 0){
            node = this.root;
        } else{
            node = this.uncheckedNodes[this.uncheckedNodes.length-1].childNode;
        }



        //Adding the part of the word that is not a common prefix
        const slicedWord = word.slice(commonPrefix);
        //console.log("slicedWord", slicedWord);
        for(let i = 0; i < slicedWord.length; i++){
            //creates a new node, has a new id
            //increments the id
            var ltr = slicedWord[i];
        

            
            var currentNode = new GaddagNode(this.nextId);
            this.nextId += 1;
            //gets the value for the node
          
            
         
            //adds the current node to the nodes
            node.edges[ltr] = currentNode;
            //adds to unchecked for minimisation
            this.uncheckedNodes.push({
                parentNode: node,
                letter: ltr,
                childNode: currentNode
            });
            
            node = currentNode;
        }
        //end of the word has been reached
        //special indicator is equal to one for the node
        node.$ = 1;
        this.previousWord = word;

    }

    //Finds if the part of a word exists
    find(word){
        var node = this.root;
        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            if(!node.edges[letter]){
                return 0;
            }
            node = node.edges[letter];
        }
        return 1;
    }



    //Check if the word is in the gaddag
    wordExist(word){
        var node = this.root;
        //Loops through the node cnildren each time
        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            if(!node.edges[letter]){
                return 0;
            }
            node = node.edges[letter];
        }

        if(node.$){
            return "Y"
            
        }
        return "N";
        
    }

    finish(){
        this.minimization(0);
        this.uncheckedNodes = null;
        this.minimizedNodes = null;
        this.previousWord = null;
        this.nextId = null;
    }
    
    readLine(dict){
        console.log("Reading the dictionary");
        //Reading each line of the text file
        //Creating a inteface to read each line
        this.lineReader = readline.createInterface({
            input: require('fs').createReadStream(dict)
        });

        //Will be used to sort the words of the dictionary by letter
        const words = {
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
            F: [],
            G: [],
            H: [],
            I: [],
            J: [],
            K: [],
            L: [],
            M: [],
            N: [],
            O: [],
            P: [],
            Q: [],
            R: [],
            S: [],
            T: [],
            U: [],
            V: [],
            W: [],
            X: [],
            Y: [],
            Z: []
        };
         
        //Using the interface to read each line
        this.lineReader.on('line', function (line) {
            //console.log(line);
            //Used to sort each word into corresponding letter object arrays
            //Each word is also reversed, as required for a gaddag
            const mapWord = (line) => {
                return (letter, index, arr) =>
                  words[letter].push(
                    index === 0
                    ? line
                    : line.slice(index, line.length) + '_' + arr.slice(0, index).reverse().join(''));
            };

            const addToWords =  (line) => {
                for(let i = 0; i < line.length; i++){
                    let reverseWord = line.slice(0, i+1).split("").reverse().join('');
                    let secondPart = line.slice(i+1);
                    let wordToAdd = reverseWord +"$"+ secondPart;
                    words[wordToAdd[0]].push(wordToAdd);
                    
                }
            }

            
            
      
         
            
            if(line === "FINALLINE"){
                console.log("Finish");
                //console.log(words);
                //Code for inserting each object array
                //into the gaddag will go here

                //console.log(words);

                //Getting the word object keys
                //Keys = A, B, C...
                var wordKeys = Object.keys(words);
                for(let i = 0; i < wordKeys.length; i++){
                    const keyWordList = words[wordKeys[i]].sort();
                    for(let j = 0; j < keyWordList.length; j++){
                        insertingIntoGaddag(keyWordList[j]);
                    }
                }
                finishBuilding();
            }

            else{
                //console.log(line);
                line.split('').map(mapWord(line));
                //insertingIntoGaddag(line);
                //addToWords(line);
            }
        
        });

        //Testing the insertion of words as a trie first
        const insertingIntoGaddag = (word) => {
            //this.insert(word);
            this.insert(word);
           
        }

        const finishBuilding = () => {
            this.finish();
        }




    }
     

    
}



