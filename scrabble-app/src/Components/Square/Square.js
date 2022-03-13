import { useState, useEffect, useMemo } from "react";
import '../../StyleSheets/Square.css';
import { useDrop } from "react-dnd";
import Tile from "../Tile/Tile";
import GameData from '../../JSONData/GameData.json';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actioncreators } from "../../state/action-creator/allActionsCreators";
import { memo } from "react";
import { v4 as uuidv4 } from 'uuid';
import { removeFromPlayerRack } from "../../features/rackSlice";


const Square = ({x, y, sqType, children}) => {
    
    //const [letter, setLetter] = useState('');
    const [squareType, setSquareType] = useState('');

    
    useEffect(() => {
        setSquareType(sqType)
    }, [sqType]);

    var bonus;
    if(sqType === "B"){
        bonus = "";
    }
    else if(sqType === "C"){
        bonus = "DW";
    }
    else{
        bonus = sqType;
    }
    return(
        <div>
            <div className={`square ${sqType}`}>
                {children|| bonus }
            </div>
        </div>
    )

}

export default Square;