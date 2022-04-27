import { storeSlicer } from '../../app/store';
import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'
import { useDrag, useDrop } from 'react-dnd';


const Tile = ({ letter, id, index, isBlank}) => {
    let currentStore = storeSlicer.getState();
    let tilebag = currentStore.tilebag.value;
    const [{ isDragging }, drag] =  useDrag(() => ({
        type:  "tile",
        item: {letterValue: letter, id: id, index: index},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    var tileData = "";
    var letterData = "";
    //const [tileData, setTile] = useState("");
    //const [letterData, setLetter] = useState("");
    // useEffect(() =>{
    //     if(isBlank){
    //         setLetter(letter);
    //         setTile("?");

    //     }
    //     else{
    //         setLetter(letter);
    //         setTile(letter);
    //     }
    //     console.log(tileData);
        
    //     //console.log("use effect", letter);
    // },[letter]);
    //const opacity = isDragging ? 0 : 1;
    //const tileCursor = isDragging ? "move" : "pointer";

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