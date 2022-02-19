import './Game.css';
import Board from '../Components/Board/Board';
import Rack from '../Components/Rack/Rack';
import PlayBtn from '../Components/PlayBtn/PlayBtn';
import GameData from '../JSONData/GameData.json'
import { useEffect, useState } from 'react';
import {MakeMove} from '../Helper/ComputerMove';


const Game = () => {
    const [isComputerTurn, setComputerTurn] = useState(false);
    const handlePlayWord = () => {
        GameData.turnPlayer = "computer";
        setComputerTurn(true);

        MakeMove().then(d => {
            console.log("Data here", d);
            setComputerTurn(false);
            GameData.turnNumber +=1;
            GameData.turnPlayer = "user";
        })
     
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