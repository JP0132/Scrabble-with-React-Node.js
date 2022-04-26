import "../../StyleSheets/Scoreboard.css";
import { useState } from "react";
import { useSelector } from "react-redux";


const Scoreboard = ({user}) => {
    var score = useSelector((state) => state.game.value[user]);
    

    return ( 
        <div className="scoreBoard">
            <div className="score">
                <div id="scoreNum">{score}</div>
                <div id="scoreText">{user}</div>
            </div>
        </div>
 );
}
 
export default Scoreboard;