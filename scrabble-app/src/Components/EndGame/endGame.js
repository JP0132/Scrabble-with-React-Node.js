import '../../StyleSheets/endGame.css';
import LoserDisplay from './loserDisplay';
import { v4 as uuidv4 } from 'uuid';

//Displays the winner and loser board pop up when the game ends
const EndGame = ({winner, losers, goHome}) => {
    
    let l = [];

    //Map through the object to get all the data to pass to the LoserDisplay component
    losers.map((loser) => {
        l.push(<LoserDisplay  key={uuidv4()} name={loser.name} score={loser.score}/>)
    })

    return (  
        <>  
            <div className="overlay"></div>
            <div className="endGameContainer" key={uuidv4()}>
                <div className='winnerContainer'>
                    <h1>Winner: {winner.name}</h1>
                    <h1>Final Score : {winner.score}</h1>
                </div>
                <h1 className='endGameTitle'>Losers</h1>
                <div className="loserContainer" key={uuidv4()}>
                    <table>
                        <thead></thead>
                            <tbody>
                                {l}
                            </tbody>
                    </table>  
                </div>
                <button className='endGameBtn' onClick={goHome}>Home</button>
            </div>
        </>
    );
}
 
export default EndGame;