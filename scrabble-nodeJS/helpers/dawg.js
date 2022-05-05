const readline = require('readline');

class DawgNode{
    constructor(id = 0){
        this.id = id;
        this.edges = {};
        this.final = false;
    }

}

//Actual Dawg
class Dawg{
    constructor (){
        this.root = new DawgNode();

        //Previous word entered into the Dawg
        this.previousWord = "";

        // List of nodes that have not been checked for duplication
        this.uncheckedNodes = [];

        // List of unique nodes that have been checked for duplication
        this.minimizedNodes = {};
    }

     // Inserts the word into the Dawg
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
        //from the node go up to a certain point
        for(let i = this.uncheckedNodes.length-1; i > downTo - 1; i--){
            //Getting set of uncheckedNodes
            var currentUnchecked = this.uncheckedNodes[i];
            
            var node = this.minimizedNodes[currentUnchecked.childNode];

            if(node){
                //replace the child with the previously encountered one
                currentUnchecked.parentNode.edges[currentUnchecked.letter] = node;
            }
            else{
                //add the state to the minimized nodes.
                this.minimizedNodes[currentUnchecked.childKey] = currentUnchecked.childNode;
            }
            this.uncheckedNodes.pop();
        }  
       
    }

    //Finds the word
    //Returns 0 if not found or false if word incomplete
    find(word){
        var node = this.root;
        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            if(!node.edges[letter]){
                return 0;
            }
            node = node.edges[letter];
        }
        return node.final;
    }

    //Return the root
    getRootNode(){
        return this.root;
    }

    //Gets the next node
    getNextNode(node, letter){
        return node.edges[letter];
    }

    //Check if the node exists
    checkIfNodeExists(node, letter){
        if(!node.edges[letter]){
            return 0;
        }
        return 1;
    }

    //Get the node of a partial word
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
    
}

module.exports = Dawg;