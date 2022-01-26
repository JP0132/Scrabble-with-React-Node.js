import React from 'react';
import Letters from '../WordList/letters.json';

export default class LetterData{

    randomLetters = (num) => {
        let rack = [];
        //var properties = Object.getOwnPropertyNames(Letters);
        //let letters = Letters.letters;
       
    

        //let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";
        //console.log(properties);
        for(let i = 0; i < num; i++){
            //const randIndex = properties.length * Math.random() << 0;
            let randomLetter = Letters.letters[Math.floor(Math.random() * Letters.letters.length)];
            //console.log(randIndex);
            //const randLetter = properties[randIndex];
           //console.log("rl:", randomLetter);
            //console.log("Random Letter", randomLetter);
            let noOfLetter = Letters[randomLetter].number;
            //console.log("Current:", noOfLetter);
            Letters[randomLetter].number = noOfLetter - 1;
            noOfLetter = Letters[randomLetter].number;

            if(noOfLetter == 0){
                let index = Letters.letters.indexOf(randomLetter);
                Letters.letters.splice(index, 1);
               // Letters.letters.replace(randomLetter,"");
                //letters = letters.replace(randomLetter,'');
                //letters = Letters.letters;
                //console.log("rl:", randomLetter);
                //console.log("l:", letters);
            }
            
            rack.push(randomLetter);
            //console.log("New:", noOfLetter);
            //console.log(Letters.letters);
        }
        return rack;
   

    }



}
