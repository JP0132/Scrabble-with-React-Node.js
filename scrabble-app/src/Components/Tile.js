import '../CSS/Tile.css';
import Letters from '../WordList/letters.json';
import { useState } from 'react';

const Tile = (props) => {
    //const letter = props.letter;
    console.log(props.letter);
    const [letter, setTile] = useState(props.letter);
    console.log(Letters[props.letter].number);

   return( 
   <div id={letter} className="tile">
       <span className='tileLetter'>{letter}<span className='tileNum'>{Letters[letter].points}</span></span>
   </div>
   );

}

export default Tile;