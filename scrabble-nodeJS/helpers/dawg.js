const readline = require('readline');

class DawgNode{
    constructor(id = 0){
        this.id = id;
        this.edges = {};
        this.final = false;
    }

}

//Actual gaddag
class Dawg{
    constructor (){
        this.root = new DawgNode();

        //Previous word entered into the gaddag
        this.previousWord = "";

        // List of nodes that have not been checked for duplication
        this.uncheckedNodes = [];

        // List of unique nodes that have been checked for duplication
        this.minimizedNodes = {};

        //Read the dictionary text file into the data structure
        //this.readLine(dict);
    }

     // Inserts the word into the gaddag
     insert(word){
        let commonPrefix = 0;
    
        //Selecting the smallest word length so no out of bounds error occurs
        var minWordLength = Math.min(word.length, this.previousWord.length);

        //Find where in the word the common prefix is up till in the new word
        //Used to minimise the nodes and where to insert the node
        for(let i = 0; i < minWordLength; i++){
            if(word[i] !== this.previousWord[i]){
                break;
            }
            commonPrefix +=1;
        }
        
        //Minimize the nodes
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
          
            var currentLetter = slicedWord[i];

            var currentNode = new DawgNode(this.nextId);

            this.nextId += 1;

            //adds the current node to the nodes
            node.edges[currentLetter] = currentNode;

            //adds to unchecked for minimization
            this.uncheckedNodes.push({
                parentNode: node,
                letter: currentLetter,
                childNode: currentNode
            });

            node = currentNode;
        }
   
        node.final = true;
        this.previousWord = word;

    }

    minimization(downTo){
        for(let i = this.uncheckedNodes.length-1; i > downTo - 1; i--){
            //Getting set of uncheckedNodes
            var currentUnchecked = this.uncheckedNodes[i];
            //var childKey = this.str(tuple.childNode);
            var node = this.minimizedNodes[currentUnchecked.childNode];

            if(node){
                currentUnchecked.parentNode.edges[currentUnchecked.letter] = node;
            }
            else{
                this.minimizedNodes[currentUnchecked.childKey] = currentUnchecked.childNode;
            }
            this.uncheckedNodes.pop();
        }  
       
    }

    find(word){
        var node = this.root;
        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            //console.log(letter);
            if(!node.edges[letter]){
                return 0;
            }
            node = node.edges[letter];
        }
        return node.final;
    }

    getRootNode(){
        return this.root;
    }

    getNextNode(node, letter){
        return node.edges[letter];
    }

    checkIfNodeExists(node, letter){
        if(!node.edges[letter]){
            return 0;
        }
        return 1;
    }

    getNode(word){
        var node = this.root;
        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            if(!node.edges[letter]){
                return 0;
            }
            node = node.edges[letter];
        }
        return node;

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

            if(line === "FINALLINE"){
                var wordKeys = Object.keys(words);
                for(let i = 0; i < wordKeys.length; i++){
                    const keyWordList = words[wordKeys[i]].sort();
                    for(let j = 0; j < keyWordList.length; j++){
                        insertingIntoDawg(keyWordList[j]);
                    }
                }
                finishBuilding();
            }

            else{
                words[line[0]].push(line);
            }
        });

        //Testing the insertion of words as a trie first
        const insertingIntoDawg = (word) => {
            this.insert(word);
        }

        const finishBuilding = () => {
            this.finish();
        }

    }
}

module.exports = Dawg;