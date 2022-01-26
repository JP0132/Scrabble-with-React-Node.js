import "../CSS/Rack.css"
import Tile from "./Tile";
import Letters from "../WordList/letters.json";
import LetterData from '../Helper/LetterData';
import GenerateMove from "../Helper/GenerateMoves";
import GameData from "../JSONData/GameData.json"



//import LetterData from "../Helper/LetterData";

const Rack = () => {
    var playerRack = [];
    if(GameData.playerRack.length === 0){
        var letterData = new LetterData();
        playerRack = letterData.randomLetters(7);
        //console.log(startingRack);

    }

    //var generatMove = new GenerateMove();
    //let word = generatMove.generateWords(startingRack);
    
    //console.log(word);

    let rackLetters = [];

   
    //console.log(rackTile);
    for(let i = 0; i < playerRack.length; i++){
        rackLetters.push(<Tile key={i} letter = {playerRack[i]}/>);
    }
   
   
   
   
  
    return (
        <div className="rack">{rackLetters}</div>
    );
}
 
export default Rack;