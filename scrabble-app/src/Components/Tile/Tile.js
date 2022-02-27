import LetterData from '../../JSONData/LetterData.json';
import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'
import { useDrag, useDrop } from 'react-dnd';




const Tile = (props) => { 
    const [{ isDragging }, drag] =  useDrag(() => ({
        type:  "tile",
        item: {letterValue: props.letter},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    const [tileData, setTile] = useState("");
    useEffect(() =>{
        setTile(props.letter);
    },[props.letter]);
    //const opacity = isDragging ? 0 : 1;
    //const tileCursor = isDragging ? "move" : "pointer";

    return(
        
        <div id={props.letter} className='tile' ref={drag} style={{opacity: isDragging ? 0 : 1 , cursor: isDragging ? "all-scroll" : "pointer"}}>
            <span className='tileLetter'>{props.letter}<span className='tileNum'>{LetterData[props.letter].points}</span></span>
        </div>
    )

}

export default Tile;