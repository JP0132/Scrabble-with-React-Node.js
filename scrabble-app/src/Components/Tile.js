import '../CSS/Tile.css';
import Letters from '../WordList/letters.json';

const Tile = (props) => {
   return <div id={props.letter} className="tile">
       <span className='tileLetter'>{props.letter}<span className='tileNum'>{Letters[props.letter].points}</span></span>
   </div>

}

export default Tile;