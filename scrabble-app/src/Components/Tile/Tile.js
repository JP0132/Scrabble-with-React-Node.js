import LetterData from '../../JSONData/LetterData.json';
import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'

const Tile = ({letter}) => {
    const [tileData, setTile] = useState("");
    useEffect(() =>{
        setTile(letter);
    },[letter]);

    return(
        <div id={letter} className='tile'>
            <span className='tileLetter'>{letter}<span className='tileNum'>{LetterData[letter].points}</span></span>
        </div>
    )

}

export default Tile;