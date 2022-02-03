import './Game.css';
import Board from '../Components/Board/Board';



const Game = (props) => {

    return(
        <div className='game'>
            <h1>AIECHO SCRABBLE</h1>
            <div className='centre'>
                <Board key="board"/>
            </div>
          
        </div>
    )
}

export default Game;