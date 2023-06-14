import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'
import { useDrag, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { storeSlicer } from '../../app/store';

//Render already placed tiles
const BoardTile = ({ letter, id, x, y}) => {
    let currentStore = storeSlicer.getState();
    let tilebag = currentStore.tilebag.value;
    let td = "";
    let tl = "";

    const [tileData, setTile] = useState("");
    const [tileLetter, setLetter] = useState("");
    var blankTiles = useSelector((state) => state.board.value.blanks);
    
    if(blankTiles.length !== 0){
        for(let i = 0; i < blankTiles.length; i++){
            let bl = blankTiles[i];
            let blX = bl.x;
            let blY = bl.y;
            if(x === blX && y === blY){
                td = "?";
                tl = letter;
            }
        }
    }

    if(td !== "?"){
        td = letter;
        tl = letter;
    }

    return(
        <div key={id} className='tile'>
            <span className='tileLetter'>{tl}<span className='tileNum'>{tilebag[td].points}</span></span>
        </div>
    )

}

export default BoardTile;