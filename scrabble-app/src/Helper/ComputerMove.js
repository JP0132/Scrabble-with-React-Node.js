import {DrawTiles} from "../Components/Rack/RackHelper";
import GameData from "../JSONData/GameData.json";
import axios from "axios";


export function MakeMove() {
    var newTiles;
    var compRack = GameData.computerRack;
    var computerMove;

    if(compRack < 7){
        let noOfTilesNeeded = 7 - compRack.length;
        newTiles = DrawTiles(noOfTilesNeeded);
        var newRack = compRack.concat(newTiles);
        GameData.computerRack = newRack;
        compRack = newRack;
    }
    console.log(compRack);

    var data = {
        "rack" : compRack
    }
    fetch('http://localhost:3001/api/computerMove/',{
        method: "post",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data),
     
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log("DATA SENT", data);
        computerMove = data;
    })
}