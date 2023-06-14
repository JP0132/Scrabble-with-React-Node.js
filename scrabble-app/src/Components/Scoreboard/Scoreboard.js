import "../../StyleSheets/Scoreboard.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { storeSlicer } from "../../app/store";
import ScoreRow from "./ScoreRow";

//SHow the current scores of the users
const Scoreboard = ({user}) => {
    var score = useSelector((state) => state.game.value[user]);
    var gameMode = useSelector((state) => state.game.value.gameMode);
    let scores = [];
    
    //Get each player score and name if PvP
    if(gameMode === "pvp"){
        let currentStore = storeSlicer.getState();
        let noOfPlayers = currentStore.pvpgame.value.noOfPlayers;
        for(let i = 1; i < noOfPlayers+1; i++){
            let playerScore = currentStore.pvpgame.value["player"+i+"Score"];
            let playerName = currentStore.pvpgame.value["player"+i+"Name"];
           
            let newObj = {score: playerScore, name: playerName};
            scores.push(newObj);
        
        }
    }
    //Computer vs Player
    else{
        let currentStore = storeSlicer.getState();
        let playerScore = currentStore.game.value.playerScore;
        let computerScore = currentStore.game.value.computerScore;
        let playerObj = {score: playerScore, name: "Player"};
        let computerObj = {score: computerScore, name: "BIT SCRABBLE"};
        scores.push(playerObj);
        scores.push(computerObj);
    }
    

    return ( 
        <div className="scoreBoard">
            <h1>Scoreboard</h1>
            <ScoreRow obj={scores}/>
        </div>
 );
}
 
export default Scoreboard;