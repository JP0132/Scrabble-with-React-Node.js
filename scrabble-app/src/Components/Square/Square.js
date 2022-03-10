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


const Square = (props) => {
    
    const [letter, setLetter] = useState('');
    const [squareType, setSquareType] = useState('B');

    const dispatch = useDispatch();

    const { addLetterToPlayerRack, removeLetterOnPlayerRack } = bindActionCreators(actioncreators, dispatch);

    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        drop: (item) => addToSquare(item.letterValue, item.id, item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addToSquare = (l, id, index) => {
        let newId = uuidv4();
        console.log(index);
        dispatch(removeFromPlayerRack(index));
        setLetter(<Tile key={newId} letter={l} id={newId}/>);
        console.log(l, id);
       
        //removeLetterOnPlayerRack(id);
        
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

export default memo(Square);