import LetterData from '../../JSONData/LetterData.json';

export function DrawTiles(num) {
    let rack = [];
    if(LetterData.bag === 0){
        return rack;
    }
    for(let i = 0; i < num; i++){
        if(LetterData.bag === 0){
            return rack;
        }
        let randomLetter = LetterData.letters[Math.floor(Math.random() * LetterData.letters.length)];
       
        let noOfLetter = LetterData[randomLetter].number;
                    
        LetterData[randomLetter].number = noOfLetter - 1;
        noOfLetter = LetterData[randomLetter].number;

        if(noOfLetter == 0){
            let index = LetterData.letters.indexOf(randomLetter);
            LetterData.letters.splice(index, 1);
        }
                    
        rack.push(randomLetter);
        let currentbag = LetterData.bag;
        LetterData.bag = currentbag - 1;
        
    }
    return rack;
}

