import '../Game.css';
import Board from '../../Components/Board/Board';
import Rack from '../../Components/Rack/Rack';
import { useEffect, useState } from 'react';
import {storeSlicer} from "../../app/store";
import { restRackState, shuffleRack } from "../../features/rackSlice";
import { useDispatch, useSelector } from 'react-redux';
import Swap from '../../Components/Buttons/Swap';
import TileBag from '../../Components/TileBag/TileBag';
import { addToPlayerRack } from "../../features/rackSlice";
import { removeFromSquare, resetPos, resetSquareState} from "../../features/squareSlice";
import { ValidateWord } from '../../Helper/ValidateWord';
import { resetBoardState, updateBoard } from '../../features/boardSlice';
import { increaseTurnNumber, resetGameState, setLosers, setWinner } from '../../features/gameSlice';
import PopUp from '../../Components/Popup.js/PopUp';
import Scoreboard from '../../Components/Scoreboard/Scoreboard';
import EndGame from '../../Components/EndGame/endGame';
import { useHistory } from 'react-router-dom';
import { changeTurnPvPPlayer, hasPvPTileDrawn, increasePlayerNumScore, restPvPState } from '../../features/pvpgameSlice';
import LastWord from '../../Components/LastWord/LastWord';
import { restTileBag } from '../../features/tilebagSlice';
import HomeButton from '../../Components/Buttons/HomeButton';


//PvP game container
const PvPGame = () => {
    //Remove the background image
    document.body.style.backgroundImage = 'none';
    var playerScoresVar = [];

    //Change the route when used
    const history =  useHistory();

    //Display the message to the user when their move is being validated
    const [isValidating, validating] = useState(false);
    const [lastWord, setLastWord] = useState("-");

    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //Setting the current player
    const [currentPlayer, setCurrentPlayer] = useState('');
    
    //Getting the turn player from redux store
    var turnPlayer = useSelector((state) => state.pvpgame.value.turnPlayer);
    var finalTileBag = useSelector((state) => state.tilebag.value.bag);


    const [winner, setGameWinner] = useState({});
    const [losers, setGameLoser] = useState([]);

    const [changingTurns, setChange] = useState(false);    


    //Use Effect hook for:
    //Setting the current player to the turn player when it changes
    useEffect(() => {
        let currentStore = storeSlicer.getState();
        let turnPlayer = currentStore.pvpgame.value.turnPlayer;
    
      
        if(turnPlayer == "player1"){
            let turnPlayerName = currentStore.pvpgame.value.player1Name;
            setCurrentPlayer(turnPlayerName);
        }
        else if(turnPlayer == "player2"){
            let turnPlayerName = currentStore.pvpgame.value.player2Name;
            setCurrentPlayer(turnPlayerName);
        }

        else if(turnPlayer == "player3"){
            let turnPlayerName = currentStore.pvpgame.value.player3Name;
            setCurrentPlayer(turnPlayerName);
        }

        else if(turnPlayer == "player4"){
            let turnPlayerName = currentStore.pvpgame.value.player4Name;
            setCurrentPlayer(turnPlayerName);
        }
    
    }, [turnPlayer]);

    //Refresh change?
    useEffect(() => {
        window.performance.getEntriesByType("navigation");
        let currentStore = storeSlicer.getState();
        let turnPlayer = currentStore.pvpgame.value.turnPlayer;
        if(turnPlayer == ""){
            history.push('/playerVSplayerSelect');
        }
    });

    //Display the swap rack tray
    const [isSwap, setSwap] = useState(false);

    //Setting a blank
    const [isBlank, setBlank] = useState(false);

    //If the game is ending display the end game component
    const [isEndGame, setEndGame] = useState(false);
    

    //Getting the current turn number
    var turnNumber = useSelector((state) => state.game.value.turnNumber);
    var board = useSelector((state) => state.board.value.currentBoard);

    //If player rack is 0, then add other players deducted points
    const addOtherDeducts = async (pos, currentScore) => {
        for(let p = 0; p < playerScoresVar.length; p++){
            if(p == pos){
                continue
            }
            currentScore  += playerScoresVar[p].playerDeductPoints;
        }
        return currentScore;
    }

    const endGame = async () => {

        let currentStore = storeSlicer.getState();
        let tileBag = currentStore.tilebag.value;
        let noOfPlayers = currentStore.pvpgame.value.noOfPlayers;

        //Sorts the positions increasing order
        const sortScores = (by, scores) => {
            return scores.sort((a,b) => (a[by] < b[by]) ? 1 : ((b[by] < a[by]) ? -1 : 0));
        }

        var playerScoresVar = [];
        for(let i = 1; i < noOfPlayers+1; i++){
            let finalPlayerScore = currentStore.pvpgame.value["player"+i+"Score"];
            let playerName = currentStore.pvpgame.value["player"+i+"Name"];
            let currentPlayerScore = currentStore.pvpgame.value["player"+i+"Score"];
            let playerRack = currentStore.rack.value["player"+i+"Rack"];
            let playerDeductPoints = 0;
            playerScoresVar.push({finalPlayerScore: finalPlayerScore, playerName: playerName, currentPlayerScore: currentPlayerScore, playerRack: playerRack, playerDeductPoints: playerDeductPoints});
        }

       
     
        for(let p = 0; p < playerScoresVar.length; p++){
            let rack = playerScoresVar[p].playerRack;
          
            for(let r = 0; r < rack.length; r++){
                let points = tileBag[rack[r].letter].points;
                playerScoresVar[p].playerDeductPoints =  playerScoresVar[p].playerDeductPoints + points;
                playerScoresVar[p].finalPlayerScore =  playerScoresVar[p].finalPlayerScore - points;
            }
        }

        for(let d = 0; d < playerScoresVar.length; d++){
            let rack = playerScoresVar[d].playerRack;
            if(rack.length == 0){
                let newScore = addOtherDeducts(d, playerScoresVar[d].finalPlayerScore);
                playerScoresVar[d].finalPlayerScore = newScore;
            } 
        }

        
        let copyScores = [...playerScoresVar];
        
        copyScores = sortScores("finalPlayerScore", copyScores);

        //Finding the winners and losers of the game
        let currentWinners = [];
        let currentLosers = [];
        currentWinners.push(copyScores[0]);
        for(let j = 1; j < copyScores.length; j++){
            if(copyScores[j].finalPlayerScore == currentWinners[0].finalPlayerScore){
                currentWinners.push(copyScores[j]);
            }
            else{
                currentLosers.push(copyScores[j]);
            }
        }


        if(currentWinners.length > 1){
            currentWinners = sortScores("currentPlayerScore", currentWinners);
        }
        //Add the winner and losers
        dispatch(setWinner({name: currentWinners[0].playerName, score: currentWinners[0].finalPlayerScore}));

        for(let i = 0; i < currentLosers.length; i++){
            dispatch(setLosers({name: currentLosers[i].playerName, score: currentLosers[i].finalPlayerScore}));
        }
        for(let k = 0; k < currentWinners.length; k++){
            if(k == 0){
                continue;
            }
            dispatch(setLosers({name: currentWinners[k].playerName, score: currentWinners[k].finalPlayerScore}));
        }
       

        currentStore = storeSlicer.getState();
        let gameWinner = {name: currentStore.game.value.winnerName, score: currentStore.game.value.winnerScore};
        let gameLoser = currentStore.game.value.losers;

        //State variables to send to the end game components
        setGameWinner(gameWinner);
        setGameLoser(gameLoser);
        
        //Display the end game component 
        setEndGame(true);
       
    }

    //Pass board changes
    const [boardChange, setBoardChange] = useState([]);

    //Dispatch actions to the store
    const dispatch = useDispatch();

    //Shuffle the player's rack when the button is clicked
    const handleRackShuffle = () => {
        let currentStore = storeSlicer.getState();
        let turnPlayerRack = currentStore.pvpgame.value.turnPlayer + "Rack";
        let tiles = currentStore.rack.value[turnPlayerRack];
        let shuffledRack = tiles
        .map(value => ({value, sort: Math.random()}))
        .sort((a, z) => a.sort - z.sort)
        .map(({ value }) => value)

        
        dispatch(shuffleRack({shuffleRack: shuffledRack, playerNumber: turnPlayerRack}));
    }

    

    //Clear the board of the tiles placed on the board back on to the rack
    const handleClearBoard = () => {
        let currentStore = storeSlicer.getState();
        let turnPlayerRack = currentStore.pvpgame.value.turnPlayer + "Rack";
        let pos = currentStore.square.value.tilePositions;
        for(let i = 0; i < pos.length; i++){
            dispatch(removeFromSquare(pos[i]));
            dispatch(addToPlayerRack({letter: pos[i].letter, playerNumber: turnPlayerRack}));
        }
        
    }

    //Pass the turn
    const handlePass = () => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        if(pos.length > 0){
            alert("Tiles in play cannot pass");
        }
        else{
            setChange(true);
            dispatch(increaseTurnNumber());
            let currentStore = storeSlicer.getState();
            let turnPlayerRack = currentStore.pvpgame.value.turnPlayer;
            let noOfPlayers = currentStore.pvpgame.value.noOfPlayers;
            if(noOfPlayers == 2){
                if(turnPlayerRack == "player1"){
                    dispatch(changeTurnPvPPlayer("player2"));
                }
                else{
                    dispatch(changeTurnPvPPlayer("player1"));
                }
                setTimeout(() => {
                    setChange(false);
                },2000); 
            }
            else if(noOfPlayers == 3){
                if(turnPlayerRack == "player1"){
                    dispatch(changeTurnPvPPlayer("player2"));
                }
                else if(turnPlayerRack == "player2"){
                    dispatch(changeTurnPvPPlayer("player3"));
    
                }
                else if(turnPlayerRack == "player3"){
                    dispatch(changeTurnPvPPlayer("player1"));
    
                }
                setTimeout(() => {
                    setChange(false);
                },2000); 

            }
            else{
                if(turnPlayerRack == "player1"){
                    dispatch(changeTurnPvPPlayer("player2"));
                }
                else if(turnPlayerRack == "player2"){
                    dispatch(changeTurnPvPPlayer("player3"));
    
                }
                else if(turnPlayerRack == "player3"){
                    dispatch(changeTurnPvPPlayer("player4"));
                }
                else{
                    dispatch(changeTurnPvPPlayer("player1"));
                }
                setTimeout(() => {
                    setChange(false);
                },2000); 
            }
            
        }
        
    }

    //Open the swap rack tray
    const handleRackSwap = () => {
        let currentStore = storeSlicer.getState();
        let tilebag = currentStore.tilebag.value.bag;
        if(tilebag < 7){
            alert("Cannot exchange tiles when less than 7 tiles remaining");
        }
        else{
            setSwap(true);
        }
        
    }
    //Cancel the swap
    const handleCancelSwap = (isSwapping=false) => {
        setSwap(false);
        if(isSwapping){
            handleClearBoard();
            dispatch(increaseTurnNumber());
            setChange(true);
            let currentStore = storeSlicer.getState();
            let turnPlayerRack = currentStore.pvpgame.value.turnPlayer;
            let noOfPlayers = currentStore.pvpgame.value.noOfPlayers;
         
            if(noOfPlayers == 2){
                if(turnPlayerRack == "player1"){
                    dispatch(changeTurnPvPPlayer("player2"));
                }
                else{
                    dispatch(changeTurnPvPPlayer("player1"));
                }
                setTimeout(() => {
                    setChange(false);
                },2000); 
            }
            else if(noOfPlayers == 3){
                if(turnPlayerRack == "player1"){
                    dispatch(changeTurnPvPPlayer("player2"));
                }
                else if(turnPlayerRack == "player2"){
                    dispatch(changeTurnPvPPlayer("player3"));
    
                }
                else if(turnPlayerRack == "player3"){
                    dispatch(changeTurnPvPPlayer("player1"));
    
                }
                setTimeout(() => {
                    setChange(false);
                },2000); 

            }
            else{
                if(turnPlayerRack == "player1"){
                    dispatch(changeTurnPvPPlayer("player2"));
                }
                else if(turnPlayerRack == "player2"){
                    dispatch(changeTurnPvPPlayer("player3"));
    
                }
                else if(turnPlayerRack == "player3"){
                    dispatch(changeTurnPvPPlayer("player4"));
                }
                else{
                    dispatch(changeTurnPvPPlayer("player1"));
                }
                setTimeout(() => {
                    setChange(false);
                },2000); 
            }
           
        }
        
    }

    
    
    //When the uses plays the word
    //Undergoes validation first if it passes then switches to the computers turn
    const handlePlayWord = async () => {
        validating(true);
        ValidateWord().then(d => {
            if(d.pass){
                let currentStore = storeSlicer.getState();
                let pos = currentStore.square.value.tilePositions;
                for(let i = 0; i < pos.length; i++){
                    let t = pos[i];
                    let x = t.x;
                    let y = t.y;
                    let l = t.letter;
                    if(l == "?"){
                        let currentStore = storeSlicer.getState();
                        let blanks = currentStore.board.value.blanks;
                        for(let i = 0; i < blanks.length; i++){
                            let bl = blanks[i];
                            if(bl.x == x && bl.y == y){
                                l = bl.letter;
                            }
                        }
                    }
                     
                    dispatch(updateBoard({x: x, y: y, letter: l}));
                }
                let turnPlayer= currentStore.pvpgame.value.turnPlayer;
                dispatch(increasePlayerNumScore({playerNumber: turnPlayer+"Score", score: d.score}));
                setLastWord(d.word);
                validating(false);
                dispatch(increaseTurnNumber());
                dispatch(resetPos());
                let tilebag = currentStore.tilebag.value.bag;
                if(tilebag === 0){
                    currentStore = storeSlicer.getState();
                    let playerRack = currentStore.rack.value[turnPlayer+"Rack"];
                    if(playerRack.length === 0){
                        endGame();
                    }
                }
                dispatch(hasPvPTileDrawn({draw: false, playerNumber: turnPlayer+"Drawn"}));
                let noOfPlayers= currentStore.pvpgame.value.noOfPlayers;
                if(noOfPlayers == 2){
                    if(turnPlayer == "player1"){
                        dispatch(changeTurnPvPPlayer("player2"));
                    }
                    else{
                        dispatch(changeTurnPvPPlayer("player1"));
                    }

                }
                else if(noOfPlayers == 3){
                    if(turnPlayer == "player1"){
                        dispatch(changeTurnPvPPlayer("player2"));
                    }
                    else if(turnPlayer == "player2"){
                        dispatch(changeTurnPvPPlayer("player3"));
        
                    }
                    else if(turnPlayer == "player3"){
                        dispatch(changeTurnPvPPlayer("player1"));
        
                    }
                }
                else{
                    if(turnPlayer == "player1"){
                        dispatch(changeTurnPvPPlayer("player2"));
                    }
                    else if(turnPlayer == "player2"){
                        dispatch(changeTurnPvPPlayer("player3"));
        
                    }
                    else if(turnPlayer == "player3"){
                        dispatch(changeTurnPvPPlayer("player4"));
                    }
                    else{
                        dispatch(changeTurnPvPPlayer("player1"));
                    }
                }
                
                currentStore = storeSlicer.getState();
                turnPlayer= currentStore.pvpgame.value.turnPlayer;
                let playerName = currentStore.pvpgame.value[turnPlayer+"Name"];
                setError(true);
                setErrorMessage("Now " + playerName + " turn"); 
                setTimeout(() => {
                    setError(false);
                },2000); 
                
            }
            else{
                setTimeout(() => {
                    validating(false);
                    setError(true);
                    setErrorMessage(d.message);   
                }, 1000); 

                setTimeout(() => {
                    setError(false);
                },3000); 
            }

        })

       
       
    }

    //Get the current player name
    const getPlayerName =  () => {
        let currentStore = storeSlicer.getState();
        let turnPlayer = currentStore.pvpgame.value.turnPlayer;
        let turnPlayerName;
        if(turnPlayer == "player1"){
            turnPlayerName = currentStore.pvpgame.value.player1Name;
        }
        else if(turnPlayer == "player2"){
            turnPlayerName = currentStore.pvpgame.value.player2Name;
        }
        if(turnPlayer == "player3"){
            turnPlayerName = currentStore.pvpgame.value.player3Name;
        }
        else if(turnPlayer == "player4"){
            turnPlayerName = currentStore.pvpgame.value.player4Name;
        }

        return turnPlayerName;
    }
    //Quit button
    const goHome = () => {
        dispatch(resetBoardState());
        dispatch(resetSquareState());
        dispatch(restRackState());
        dispatch(resetGameState());
        dispatch(restTileBag());
        dispatch(restPvPState());
        history.push('/');
        window.location.reload(); 
    }

    const showEndGame = () => {
        endGame();
    }

    return(
        <>
        { isValidating && <PopUp message={"Checking your word"}/>}
        { changingTurns && <PopUp message={"Changing Player"}/>}
        { isError && <PopUp message={errorMessage}/>}
        { isEndGame && <EndGame winner={winner} losers={losers} goHome={goHome} key={"endGamePvp"}/>}
        <div className='header'>
            <div>
                <h1 className='title'>Turn Player {getPlayerName()}</h1>
                <HomeButton/>
            </div>    
        </div>
        <div className='grid-container'>
            <div className='game noselect'>
                <Board key="board" currentBoard={boardChange} changeBlank={setBlank} ifBlank={isBlank}/>
                { isSwap &&  <Swap handleCancelSwap={handleCancelSwap}/>}
                <div className='bottomRow'>
                    <Rack key="rack" handlePlayWord={handlePlayWord} gameMode={"pvp"} handleRackShuffle={handleRackShuffle} handleRackSwap={handleRackSwap} handleClearBoard={handleClearBoard} handlePass={handlePass} tn={turnNumber}/>
                </div>
            </div>
            <div className='rightSide'> 
                <Scoreboard  key="scoreBoard"/>
                <LastWord lastWord={lastWord}/>
                <TileBag key="tilebag" tn={turnNumber}/>   
                {finalTileBag === 0 && <div className='quitBtn' onClick={showEndGame}>Out of Moves? End Game?</div>}
                <div className='quitBtn' onClick={goHome}>QUIT</div>
            </div>
        </div>
       
        </>
       
    );
}

export default PvPGame;
