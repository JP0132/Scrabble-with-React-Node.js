import { storeSlicer } from '../../app/store';
import { useState, useEffect } from 'react';
import '../../StyleSheets/Tile.css'
import { useDrag, useDrop } from 'react-dnd';


const Tile = ({ letter, id, index}) => {
    let currentStore = storeSlicer.getState();
    let tilebag = currentStore.tilebag.value;
    const [{ isDragging }, drag] =  useDrag(() => ({
        type:  "tile",
        item: {letterValue: letter, id: id, index: index},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    const [tileData, setTile] = useState("");
    useEffect(() =>{
        setTile(letter);
        //console.log("use effect", letter);
    },[letter]);
    //const opacity = isDragging ? 0 : 1;
    //const tileCursor = isDragging ? "move" : "pointer";

    return(
        <div key={id} className='tile' ref={drag} style={{opacity: isDragging ? 0 : 1 , cursor: isDragging ? "all-scroll" : "pointer"}}>
            <span className='tileLetter'>{letter}<span className='tileNum'>{tilebag[letter].points}</span></span>
        </div>
    )

}

export default Tile;