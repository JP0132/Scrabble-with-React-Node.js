import { useState, useEffect } from "react";
import '../../StyleSheets/Square.css';
import { useDrop } from "react-dnd";
import Tile from "../Tile/Tile";
import GameData from '../../JSONData/GameData.json';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updatePlayerRack } from "../../features/rack";

const Square = (props) => {
    const [letter, setLetter] = useState('');
    const [squareType, setSquareType] = useState('B');

    const dispatch = useDispatch();

    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        drop: (item) => addToSquare(item.letterValue),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addToSquare = (l) => {
        setLetter(<Tile key={Math.random()} letter = {l}/>);
        let array = [...GameData.playerRack];
        const index = array.indexOf(l);
        array.splice(index, 1);
        console.log("Letter value to be droped", l);
       
      
        
        //const index = a.indexOf(l);
        console.log("Current array",array);
        GameData.playerRack = array;
        //a.splice(index, 1);
        //console.log(a);
        dispatch(
            updatePlayerRack(
                {
                    computerRack: [],
                    playerRack: array
                }
            )
        );

        //GameData.playerRack = currentRack;
        //console.log(squareType);
       // console.log(props.coords);

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
            <div ref={drop} id={props.coords} className={`square ${squareType}`} style={{zIndex: isOver ? 1 : 0}}>
                {letter || bonus}
            </div>
        </div>
    )

}

export default Square;