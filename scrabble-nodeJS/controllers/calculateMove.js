var fs = require('fs');
const readline = require('readline');


exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    console.log(req.body.rack);
    let rack = req.body.rack;
    //let g = new Gaddag("../scrabble-nodeJS/CollinsScrabbleWords(2019).txt");
    
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

class Gaddag{
    constructor (dict){
        //fs.readFile(dict, (err, data) => loadDictionary(err, data));
        readline(dict);
    }
    
    readLine(dict){
        const fileStream = fs.createReadStream(dict);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            this.loadDictionary(line);
        }

    }
     
    loadDictionary(line){
        const words = {
            "A": [],
            "B": [],
            "C": [],
            "D": [],
            "E": [],
            "F": [],
            "G": [],
            "H": [],
            "I": [],
            "J": [],
            "K": [],
            "L": [],
            "M": [],
            "N": [],
            "O": [],
            "P": [],
            "Q": [],
            "R": [],
            "S": [],
            "T": [],
            "U": [],
            "V": [],
            "W": [],
            "X": [],
            "Y": [],
            "Z": []
        };
        const mapWord = (readLine) => {
            let letter = readLine[0];
            words[letter].push(readLine);
        }

        mapWord(line);

    }



    
}



