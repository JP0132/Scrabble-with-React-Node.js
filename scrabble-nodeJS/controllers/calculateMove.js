var fs = require('fs');
const readline = require('readline');


exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    console.log(req.body.rack);
    let rack = req.body.rack;
    let g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");

    
    res.json({
        "hello":"chris"
    })
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
    
    readLine(dict){
        console.log("hi");
        var lineReader = require('readline').createInterface({
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
          
        lineReader.on('line', function (line) {
           
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
                console.log("word", words);
    
            }
            else{
                line.split('').map(mapWord(line));
            }
        
        });


        

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



