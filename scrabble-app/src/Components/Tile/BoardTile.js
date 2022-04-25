import LetterData from '../../JSONData/LetterData.json';
import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'
import { useDrag, useDrop } from 'react-dnd';


const BoardTile = ({ letter, id}) => {
    const [tileData, setTile] = useState("");
    useEffect(() =>{
        setTile(letter);
       
    },[letter]);
    //const opacity = isDragging ? 0 : 1;
    //const tileCursor = isDragging ? "move" : "pointer";

    return(
        <div key={id} className='tile'>
            <span className='tileLetter'>{letter}<span className='tileNum'>{LetterData[letter].points}</span></span>
        </div>
    )

}

export default BoardTile;