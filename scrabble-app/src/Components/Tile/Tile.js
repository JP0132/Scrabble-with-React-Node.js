import { storeSlicer } from '../../app/store';
import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'
import { useDrag, useDrop } from 'react-dnd';

//Creates the tile
const Tile = ({ letter, id, index, isBlank}) => {
    let currentStore = storeSlicer.getState();
    let tilebag = currentStore.tilebag.value;

    //Add the dragging capability to the tile
    const [{ isDragging }, drag] =  useDrag(() => ({
        type:  "tile",
        item: {letterValue: letter, id: id, index: index},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    var tileData = "";
    var letterData = "";

    if(isBlank){
        tileData = "?";
        letterData = letter;
    }
    else{
        tileData = letter;
        letterData = letter;

    }

    return(
        <div key={id} className='tile' ref={drag} style={{opacity: isDragging ? 0 : 1 , cursor: isDragging ? "all-scroll" : "pointer"}}>
            <span className='tileLetter'>{letterData}<span className='tileNum'>{tilebag[tileData].points}</span></span>
        </div>
    )

}

export default Tile;