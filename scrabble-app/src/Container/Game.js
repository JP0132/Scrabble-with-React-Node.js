import './Game.css';
import Board from '../Components/Board/Board';
import Rack from '../Components/Rack/Rack';
import PlayBtn from '../Components/PlayBtn/PlayBtn';
import GameData from '../JSONData/GameData.json'
import { useState } from 'react';


const Game = (props) => {
    const [isComputerTurn, setComputerTurn] = useState(false);
    const handlePlayWord = () => {
        GameData.turnPlayer = "computer";
        console.log(GameData.turnPlayer);
        setComputerTurn(true);
    }
    return(
        <div className='game'>
            <h1>AIECHO SCRABBLE</h1>
            { isComputerTurn && <div>My Turn</div> }
            <div className='centre'>
                <Board key="board"/>
                <div className='row'>
                    <Rack key="rack"/>
                    <div className='btnCon'>
                        <PlayBtn key="playBtn" handlePlayWord={handlePlayWord}/>
                    </div>
                </div>
                
            </div>
          
        </div>
    )
}

export default Game;