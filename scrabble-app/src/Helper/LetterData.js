import React from 'react';
import Letters from '../WordList/letters.json';

export default class LetterData{

    randomLetters = (num) => {
        let rack = [];
        //var properties = Object.getOwnPropertyNames(Letters);
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";
        //console.log(properties);
        for(let i = 0; i < num; i++){
            //const randIndex = properties.length * Math.random() << 0;
            let randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
            //console.log(randIndex);
            //const randLetter = properties[randIndex];
           //console.log("rl:", randomLetter);
            let noOfLetter = Letters[randomLetter].number;
            console.log("Current:", noOfLetter);
            Letters[randomLetter].number = noOfLetter - 1;
            noOfLetter = Letters[randomLetter].number;

            if(noOfLetter == 0){
                letters = letters.replace(randomLetter,'');
                //console.log("rl:", randomLetter);
                //console.log("l:", letters);
            }
            
            rack.push(randomLetter);
            console.log("New:", noOfLetter);
        }
        return rack;
   

    }



}
