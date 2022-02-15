var fs = require('fs');
const readline = require('readline');


exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    console.log(req.body.rack);
    let rack = req.body.rack;
    //let g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");

    const searchGaddag =  async () => {
        const result = await createGaddag();
        setTimeout(function(){
            console.log("finishedBuilding");
            console.log(result.wordExist("ZZZS"));
            res.json({
                "hello":"chris"
            })
        }, 1000)
        
    }
    
    searchGaddag();
   

    
    
}

async function createGaddag(){
    const g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    return g;
   
}





/*
Concept of GADDAG
Each word inserted n times => n representing the length of the word
Each insertion has a special symbol
Prefix is reversed
GADDAG is based on a DAWG, which is based on a TRIE
*/

const Node =  function (key) {
    this.key = key;
    this.parent = null;
    this.children = {};
    this.$ = 0;
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
        this.root = new Node(null);
        this.previousWord = '';
        this.uncheckedNodes = [];
        

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

    wordExist(word){
        let node = this.root;
        for(let i = 0; i < word.length; i++){
            if(node.children[word[i]]){
                node = node.children[word[i]];
            }
            else{
                return false;
            }

        }
        return node.end;
    }
    
    readLine(dict){
        console.log("hi");
        this.lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(dict)
        });
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
          
        this.lineReader.on('line', function (line) {
            
            const mapWord = (line) => {
                return (letter, index, arr) =>
                  words[letter].push(
                    index === 0
                    ? line
                    : line.slice(index, line.length) + '_' + arr.slice(0, index).reverse().join(''));
              };
      
            //line.split('').map(mapWord(line));
            //lines[i].split('').map(mapWord(lines[i]));
            
            if(line === "FINALLINE"){
                //console.log("A word", words["A"]);
                //console.log("word", words);
                console.log("words have been entered");
    
            }
            else{
                //line.split('').map(mapWord(line));
                insertingIntoGaddag(line);
            }
        
        });

        const insertingIntoGaddag = (line) => {
            this.insert(line);

        }


        

    }
     
    loadDictionary(line){
        console.log("h");
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
        const mapWord = (line) => {
            return (letter, index, arr) =>
              words[letter].push(
                index === 0
                ? line
                : line.slice(index, line.length) + '_' + arr.slice(0, index).reverse().join(''));
          };
  
        //line.split('').map(mapWord(line));
        //lines[i].split('').map(mapWord(lines[i]));
        
        if(line === "FINALLINE"){
            //console.log("A word", words["A"]);
            console.log("A word", words["A"]);

        }
        else{
            console.log(line.split(''));
            line.split('').map(mapWord(line));
            console.log("A word", words["A"]);

        }
        
  
        // const mapWord = (readLine) => {
        //     let letter = readLine[0];
        //     for(let i = 0; i < readline.length; i++){


        //     }
        //     words[letter].push(readLine);

        // }

        // mapWord(line);

    }



    
}



