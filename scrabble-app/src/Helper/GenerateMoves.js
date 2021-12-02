import dictionary from '../WordList/Collins Scrabble Words (2019).txt';

export default class GenerateMove{
    generateWords = (letters) => {

        var swap = (i, j) => {
            var temp = letters[i];
            letters[i] = letters[j];
            letters[j] = temp;
        }

        
        if(letters.length < 2){
            return letters;
        }
        else{
            var results = [];
            var counter = [];
            var length = letters.length;
            var i;

            for(i = 0; i < length; i++){
                counter[i] = 0;
            }

            i = 0;
            while(i < length){
                if(counter[i] < i){
                    swap(i % 2 === 1 ? counter[i] : 0, i);
                    counter[i]++;
                    i = 0;
                    let check = this.checkDictionary(letters.join(''));
                    console.log(check);
                  
                    
                }
                else{
                    counter[i] = 0;
                    i++;
                }
            }

            return results;
            
        }
        

    }

    checkDictionary = (word) => {
        
        /*
        var fs = require("fs");

        fs.readFile("src/WordList/Collins Scrabble Words (2019).txt", function(err, data){
            if(err) throw err;
            if(data.includes(word)){
                return "hi";
            }
        })
        */
    

    }

}