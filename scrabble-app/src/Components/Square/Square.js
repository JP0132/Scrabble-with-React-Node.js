import { useState, useEffect } from "react";
import '../../StyleSheets/Square.css';
import { useDrop } from "react-dnd";
import Tile from "../Tile/Tile";
import GameData from '../../JSONData/GameData.json';

const Square = (props) => {
    const [letter, setLetter] = useState('');
    const [squareType, setSquareType] = useState('B');

    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        drop: (item) => addToSquare(item.letterValue),
    }))

    const addToSquare = (l) => {
        setLetter(<Tile key={Math.random()} letter = {l}/>);
        let currentRack = GameData.playerRack;
        let index = currentRack.indexOf(l);
        currentRack.splice(index, 1);
        console.log(currentRack);
        GameData.playerRack = currentRack;

    }


    useEffect(() => {
        setSquareType(props.squareType)
    }, [props.squareType]);

    var bonus;
    if(squareType === "B"){
        bonus = "";
    }
    else if(squareType === "C"){
        bonus = "DW";

    }
    else{
        bonus = squareType;
    }
    return(
        <div>
            <div ref={drop} id={props.coords} className={`square ${squareType}`}>
                {letter || bonus}
            </div>
        </div>
    )

}

export default Square;