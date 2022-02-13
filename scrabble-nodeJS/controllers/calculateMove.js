var fs = require('fs');


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
*/

class Gaddag{
    constructor (dict){
        fs.readFile(dict, (err, data) => loadDictionary(err, data));
    }
     
    loadDictionary(err, data){
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

    }



    
}

