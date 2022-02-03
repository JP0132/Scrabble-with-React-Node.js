import "../CSS/Rack.css"
import Tile from "./Tile";
import Letters from "../WordList/letters.json";
import LetterData from '../Helper/LetterData';
import GenerateMove from "../Helper/GenerateMoves";
import GameData from "../JSONData/GameData.json"
import { useState } from "react";

const Rack = () => {
    const [currentPlayerRack, setPlayerRack] = useState(GameData.playerRack);
    var newTiles;
    if(currentPlayerRack.length < 7){
        let letterData = new LetterData();
        let noOfTilesNeeded = 7 - currentPlayerRack.length;
        newTiles = letterData.randomLetters(noOfTilesNeeded);  
        var newRack = currentPlayerRack.concat(newTiles);
        GameData.playerRack = newRack;
        setPlayerRack(newRack);
    }
   
    let rackTiles = [];
    for(let i = 0; i < currentPlayerRack.length; i++){
         rackTiles.push(<Tile key={i} letter = {currentPlayerRack[i]}/>);
    }

   
   
  
   
    
    
    // var playerRack = [];
    // console.log("Current Player",GameData.playerRack);
    // if(GameData.playerRack.length === 0){
    //     var letterData = new LetterData();
    //     playerRack = letterData.randomLetters(7);
    //     console.log("rack",playerRack);
    // }

    //var generatMove = new GenerateMove();
    //let word = generatMove.generateWords(startingRack);
    
    //console.log(word);

    // let rackLetters = [];
   

   
    // //console.log(rackTile);
    // for(let i = 0; i < playerRack.length; i++){
    //     console.log(playerRack[i])
    //     rackLetters.push(<Tile key={i} letter = {playerRack[i]}/>);
    // }
   
   
   
   
  
    return (
        <div className="rack">{rackTiles}</div>
    );
}
 
export default Rack;