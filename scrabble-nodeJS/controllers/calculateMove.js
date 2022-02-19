var fs = require('fs');
const readline = require('readline');



exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    console.log(req.body.rack);
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
            searchBoard().then(d =>{
                res.json({
                    "letters": d,
                    "hello":"chris"
                })
            });

            
          
        }, 2000) 
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
        //Check if row is empty or not
        var flag = 1;
        let blankSq = "*";
        var squarePosition = 0;
        for(let i = 0; i < currentRow.length; i++){
            if(currentRow[i] ===! blankSq){
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
            let wordFound = false;
            for(let x = squarePosition; x < currentRow.length; x++){
                if(wordFound){
                    break;
                }
                let currentSquare = currentRow[x];
                if(currentSquare ===! "*"){
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
*/

const Node =  function (key = null) {
    this.key = key;
    this.parent = null;
    this.children = {};
    this.end = false;

    //Used to get all the words from a node sub tree
    this.getWord = function(){
        let output = [];
        let node = this;

        while (node !== null) {
            output.unshift(node.key);
            node = node.parent;
        }
    }
}



class Gaddag{
    constructor (dict){
        //fs.readFile(dict, (err, data) => this.loadDictionary(err, data));
        this.root = new Node();

        //Vars to be used for gaddag implementation
        this.previousWord = '';
        this.uncheckedNodes = [];
        this.nextId = 1;
        this.minimizedNodes = {};

        //Read the dictionary text file into the data structure
        this.readLine(dict);
        
    }


    insert(word){
        //console.log("inserting", word);
        var node = this.root;
        for(let i = 0; i < word.length; i++){
            if(!node.children[word[i]]){
                node.children[word[i]] = new Node(word[i]);

                node.children[word[i]].parent = node;

            }
            node = node.children[word[i]];
            //Checking if reached the end of the word
            if(i === word.length-1){
                node.end = true;
            }
        
        }
    }

    //Finds if a prefix of a word exists or not
    find(prefix){
        let node = this.root;

        for(let i = 0; i < prefix.length; i++){
            if(node.children[prefix[i]]){
                node = node.children[prefix[i]];
            }
            else{
                return false;
            }
        }


        return true;
    }

    

    

 

    //Checks if a word exists in the "trie"
    wordExist(word){
        let node = this.root;
        //Loops through the node cnildren each time
        for(let i = 0; i < word.length; i++){
            let letter = word[i]
            if(node.children[letter]){
                node = node.children[letter];
            }
            else{
                return false;
            }

        }
        return node.end;
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
                //Code for inserting each object array
                //into the gaddag will go here


            }
            else{

                //line.split('').map(mapWord(line));
                insertingIntoGaddag(line);
            }
        
        });

        //Testing the insertion of words as a trie first
        const insertingIntoGaddag = (line) => {
            this.insert(line);
        }




    }
     




    
}



