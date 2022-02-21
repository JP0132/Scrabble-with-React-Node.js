var fs = require('fs');
const readline = require('readline');



exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    console.log(req.body.rack);
    console.log(req.body.board);
    let rack = req.body.rack;
    let board = req.body.board;

    const searchGaddag =  async () => {
        const result = await createGaddag();

        setTimeout(function(){
            console.log("finishedBuilding");
            console.log(result.find("HE"));
            console.log(result.find("IGN"));
            console.log(result.wordExist("HEL"));
            console.log(result.wordExist("HELL"));
            // searchBoard(board, result, rack).then(d =>{
            //     res.json({
            //         "letters": d,
            //         "hello":"chris"
            //     })
            // });
            res.json({
                "hello":"chris"
            });
        }, 10000) 
    }
    
    searchGaddag();
    
}


async function createGaddag(){
    const g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    return g;

}

async function searchBoard(board, gaddag, rack){
    //Search Each Row
    const rowMoves = await searchAllRows(board, gaddag, rack);
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
            console.log("current", currentRow);
            let currentLetterRow = "";
            let wordFound = false;
            for(let x = squarePosition; x < currentRow.length; x++){
                if(wordFound){
                    break;
                }
                let currentSquare = currentRow[x];
                console.log(currentSquare);
                if(currentSquare !== "*"){
                    currentLetterRow += currentSquare;
                    // for(let j = x+1; j < currentRow.length; j++){
                    //     if(currentRow[j] ===! "*"){
                    //         currentLetterRow += currentRow[j];
                    //     }
               
                }
                else{
                    let checkWord = currentLetterRow;
                    for(let r = 0; r < rack.length; r++){
                        //Check the letter to the rack if match found continue
                        //searching the row
                        let test = checkWord;
                        let rackLetter = rack[r];
                        test += rackLetter;
                        console.log(test);
                        if(gaddag.find(test)){
                            checkWord = test;
                            if(gaddag.wordExist(checkWord)){
                                validWords.push(checkWord);
                                wordFound = true;
                                break;
                            }
                            currentLetterRow = checkWord;
                            break;
                            
                        }

                    }   
                }
                
            }
         
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

// const Node =  function (key = null) {
//     this.key = key;
//     this.parent = null;
//     this.children = {};
//     this.end = false;
// }



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
        for(let i = 0; i < slicedWord.length; i++){
            //creates a new node, has a new id
            //increments the id
            var currentNode = new GaddagNode(this.nextId);
            this.nextId += 1;
            //gets the value for the node
            var ltr = slicedWord[i].toUpperCase();
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
        return node.$;
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
      
         
            
            if(line === "FINALLINE"){
                console.log("Finish");
                //console.log(words);
                //Code for inserting each object array
                //into the gaddag will go here

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
            }
        
        });

        //Testing the insertion of words as a trie first
        const insertingIntoGaddag = (word) => {
            this.insert(word);
        }

        const finishBuilding = () => {
            this.finish();
        }




    }
     

    
}



