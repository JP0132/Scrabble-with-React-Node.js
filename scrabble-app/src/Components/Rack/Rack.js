import { useState, useEffect } from "react";
import GameData from "../../JSONData/GameData.json";
import {DrawTiles} from "./RackHelper";
import Tile from "../Tile/Tile";
import "../../StyleSheets/Rack.css"


const Rack = () => {
    const [userRack, setUserRack] = useState(GameData.playerRack);

    useEffect(()=>{
        setUserRack(userRack);

    }, [GameData.playerRack])

    var newTiles;
    if(userRack.length < 7){
        let noOfTilesNeeded = 7 - userRack.length;
        newTiles = DrawTiles(noOfTilesNeeded);
        var newRack = userRack.concat(newTiles);
        GameData.playerRack = newRack;
    }

    let rackTiles = [];
    for(let i = 0; i < userRack.length; i++){
        rackTiles.push(<Tile key={i} letter = {userRack[i]}/>)
    }
    return(
        <div className="rack">{rackTiles}</div>
    )

    
}

export default Rack;