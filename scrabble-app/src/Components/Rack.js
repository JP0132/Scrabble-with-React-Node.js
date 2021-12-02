import "../CSS/Rack.css"
import Tile from "./Tile";
import Letters from "../WordList/letters.json";
import LetterData from '../Helper/LetterData';
import GenerateMove from "../Helper/GenerateMoves";



//import LetterData from "../Helper/LetterData";

const Rack = () => {
    var letterData = new LetterData();
    let startingRack = letterData.randomLetters(7);
    //console.log(startingRack);

    var generatMove = new GenerateMove();
    let word = generatMove.generateWords(startingRack);
    console.log(word);

    let rackLetters = [];

    for(let i = 0; i  < startingRack.length; i++){
       let rackTile = startingRack[i];
       //console.log(rackTile);
       //rackLetters.push(<Tile letter = {rackTile}/>)
    }
   
   
  
    return (
        <div className="rack">
            

        </div>
    );
}
 
export default Rack;