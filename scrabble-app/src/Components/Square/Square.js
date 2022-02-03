import { useState, useEffect } from "react";
import '../../StyleSheets/Square.css';

const Square = (props) => {
    const [letter, setLetter] = useState('');
    const [squareType, setSquareType] = useState('B');

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

        <div id={props.coords} className={`square ${squareType}`}>
            {letter || bonus}
        </div>
    )

}

export default Square;