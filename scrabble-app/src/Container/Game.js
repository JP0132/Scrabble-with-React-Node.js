import './Game.css';
import Board from '../Components/Board/Board';
import Rack from '../Components/Rack/Rack';
import GameBtn from '../Components/Buttons/GameBtn';
import { useEffect, useState } from 'react';
import {storeSlicer} from "../app/store";
import { addToComputerRack, removeTileFromComputerRack, restRackState, setComputerRack, shuffleRack, updateRack } from "../features/rackSlice";
import { useDispatch, useSelector } from 'react-redux';
import Swap from '../Components/Buttons/Swap';
import TileBag from '../Components/TileBag/TileBag';
import { addToPlayerRack, removeFromSwapRack } from "../features/rackSlice";
import { removeFromSquare, resetPos, resetSquareState} from "../features/squareSlice";
import { ValidateWord } from '../Helper/ValidateWord';
import { resetBoardState, updateBlanks, updateBoard } from '../features/boardSlice';
import { hasPlayerTileDrawn, increaseComputerScore, increasePlayerScore, increaseTurnNumber, resetGameState, setComputerDifficulty, setLosers, setWinner } from '../features/gameSlice';
import { DrawTiles } from '../Components/Rack/RackHelper';
import PopUp from '../Components/Popup.js/PopUp';
import Scoreboard from '../Components/Scoreboard/Scoreboard';
import BlankTile from '../Components/Tile/BlankTile';
import EndGame from '../Components/EndGame/endGame';
import { useHistory, useParams } from 'react-router-dom';
import { addTileToBag, restTileBag } from '../features/tilebagSlice';
import LastWord from '../Components/LastWord/LastWord';
import { Link } from 'react-router-dom';
import HomeButton from '../Components/Buttons/HomeButton';
import { restPvPState } from '../features/pvpgameSlice';



const Game = () => {
    document.body.style.backgroundImage = 'none';
    //Dispatch actions to the store
    const dispatch = useDispatch();
    const history = useHistory();

    const { difficulty } = useParams();
    dispatch(setComputerDifficulty(difficulty));

    const [lastWord, setLastWord] = useState("-");
    
    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // To display a message to the user when it is the computer players turn
    const [isComputerTurn, setComputerTurn] = useState(false);

    //Display the message to the user when their move is being validated
    const [isValidating, validating] = useState(false);

    //Display the swap rack tray
    const [isSwap, setSwap] = useState(false);

    const [isBlank, setBlank] = useState(false);

    const [compScore, setComputerScore] = useState(0);
    const [isEndGame, setEndGame] = useState(false);

    const [winner, setGameWinner] = useState({});
    const [losers, setGameLoser] = useState([]);
    

    //Getting the current turn number
    var turnNumber = useSelector((state) => state.game.value.turnNumber);
    var board = useSelector((state) => state.board.value.currentBoard);
    var computerRack = useSelector((state) => state.rack.value.computerRack);
    var playerRack = useSelector((state) => state.rack.value.playerRack);
    var finalTileBag = useSelector((state) => state.tilebag.value.bag);

    const endGame = () => {
        let currentStore = storeSlicer.getState();
        let tileBag = currentStore.tilebag.value;

        let finalComputerScore = currentStore.game.value.computerScore;
        let finalPlayerScore = currentStore.game.value.playerScore;

        let computerDeductPoints = 0;
        let playerDeductPoints = 0;

        let currentPlayerScore = currentStore.game.value.playerScore;
        let currentComputerScore = currentStore.game.value.computerScore;

        let playerRack = currentStore.rack.value.playerRack;
        
        let computerRack = currentStore.rack.value.computerRack;

        if(computerRack.length !== 0){
            for(let i = 0; i < computerRack.length; i++){
                let points = tileBag[computerRack[i]].points;
                computerDeductPoints = computerDeductPoints + points;
                finalComputerScore = finalComputerScore - points;
            }
           
        }
        if(playerRack.length !== 0){
            for(let i = 0; i < playerRack.length; i++){
                let points = tileBag[playerRack[i].letter].points;
                playerDeductPoints = playerDeductPoints + points;
                finalPlayerScore = finalPlayerScore - points;
            }
        }
        
        if(playerRack.length === 0){
            finalPlayerScore = finalPlayerScore + computerDeductPoints;
        }
        if(computerRack.length === 0){
            finalComputerScore = finalComputerScore + playerDeductPoints;
        }

        if(finalComputerScore > finalPlayerScore){
            dispatch(setWinner({name: "BIT SCRABBLE", score: finalComputerScore}));
            dispatch(setLosers({name:"Player", score: finalPlayerScore}));
        }

        else if(finalPlayerScore > finalComputerScore){
            
            dispatch(setLosers({name: "BIT SCRABBLE", score: finalComputerScore}));
            dispatch(setWinner({name:"Player", score: finalPlayerScore}));
        }

        else if(finalComputerScore === finalPlayerScore){
            if(currentComputerScore > currentPlayerScore){
                dispatch(setWinner({name: "BIT SCRABBLE", score: finalComputerScore}));
                dispatch(setLosers({name:"Player", score: finalPlayerScore}));
            }

            else if(currentPlayerScore > currentComputerScore){
                dispatch(setLosers({name: "BIT SCRABBLE", score: finalComputerScore}));
                dispatch(setWinner({name:"Player", score: finalPlayerScore}));
            }
        }

        currentStore = storeSlicer.getState();
        let gameWinner = {name: currentStore.game.value.winnerName, score: currentStore.game.value.winnerScore};
        let gameLoser = currentStore.game.value.losers;

        
        setGameWinner(gameWinner);
        setGameLoser(gameLoser);
        
        setEndGame(true);
    }


    //Pass board changes
    const [boardChange, setBoardChange] = useState([]);

   

    //Shuffle the player's rack when the button is clicked
    const handleRackShuffle = () => {
      
        let currentStore = storeSlicer.getState();
        let tiles = currentStore.rack.value.playerRack;
        let shuffledRack = tiles
        .map(value => ({value, sort: Math.random()}))
        .sort((a, z) => a.sort - z.sort)
        .map(({ value }) => value)
    
        dispatch(shuffleRack({shuffleRack: shuffledRack, playerNumber: "playerRack"}));
    }

    //Clear the board of the tiles placed on the board back on to the rack
    const handleClearBoard = () => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        for(let i = 0; i < pos.length; i++){
            dispatch(removeFromSquare(pos[i]));
            dispatch(addToPlayerRack({letter: pos[i].letter, playerNumber: "playerRack"}));
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
            dispatch(increaseTurnNumber());
            setComputerTurn(true); 
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
    const handleCancelSwap = (swappingTheTiles = false) => {
        setSwap(false);
        if(swappingTheTiles){
            handleClearBoard();
            dispatch(increaseTurnNumber());
            setComputerTurn(true); 
        }
        
    }

    //UseEffect to fetch the computer move when the isComputerTurn value changes to true
    useEffect(() => {
        if(isComputerTurn){
            let currentStore = storeSlicer.getState();
            let compRack = currentStore.rack.value.computerRack;
            
            let b = currentStore.board.value.currentBoard;
            let blanks = currentStore.board.value.blanks;
            
            //Draw the tiles
            if(compRack.length < 7){
                
                let noOfTilesNeeded = 7 - compRack.length;
                let tilesDrawn = DrawTiles(noOfTilesNeeded);
                
                dispatch(updateRack(tilesDrawn));
            }
            currentStore = storeSlicer.getState();
            compRack = currentStore.rack.value.computerRack;
            let computerDifficulty = currentStore.game.value.computerDifficulty;

            //Data to send to the node js
            var data = {
                "rack" : compRack,
                "board" : b,
                "blanks" : blanks,
                "difficulty": computerDifficulty 
            };
            
            //Make the fetch calk
            getComputerMove(data);

        }
      
    }, [isComputerTurn])

    //Get the computer move
    async function getComputerMove(dataToSend){
        await fetch('http://localhost:3001/api/computerMove/', {
            method: "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(dataToSend),
        }).then(response => {
                if(response.ok){
                    return response.json();
                }
                throw response;
        }).then(data => {
                let compMove = data.letters;
                //Add the tiles to the board
                //And update other components and states
                if(compMove.word !== ""){
                    dispatch(increaseComputerScore(data.score));
                    if(compMove.blanks.length !== 0){
                        for(let i = 0; i < compMove.blanks.length; i++ ){
                            dispatch(updateBlanks(compMove.blanks[i]));
                        }
                    }
                    let currentStore = storeSlicer.getState();
                    let currentBoard = currentStore.board.value.currentBoard;
                  

                    if(compMove.direction === "R"){
                        let row = compMove.y;
                        let currentX = compMove.start;
                        for(let i = 0; i < compMove.word.length; i++){
                            if(currentBoard[row][currentX] !== "*"){
                                currentX += 1;
                            }
                            else{
                                let letter = compMove.word[i];
                                let newTile = {
                                    x: currentX,
                                    y: row,
                                    letter: letter
                                };
                               
                                if(compMove.blanks.length !== 0){
                                    compMove.blanks.forEach((element, index, array) => {
                                        if(element.x == currentX && element.y == row){
                                            dispatch(removeTileFromComputerRack("?"));
                                        }
                                    });
                                }
                                else{
                                    dispatch(removeTileFromComputerRack(letter));
                                }
                                
                                dispatch(updateBoard(newTile));
                                currentX += 1;

                            } 
                        }
                        setLastWord(compMove.word);
                    }
                    
                    else{
                        let sq = compMove.x;
                        let currentY = compMove.start;
                        for(let i = 0; i < compMove.word.length; i++){
                            if(currentBoard[currentY][sq] !== "*"){
                                currentY += 1;
                            }
                            else{
                                let letter = compMove.word[i];
                                let newTile = {
                                    x: sq,
                                    y: currentY,
                                    letter: letter
                                };
                                if(compMove.blanks.length !== 0){
                                    compMove.blanks.forEach((element, index, array) => {
                                        if(element.x == sq && element.y == currentY){
                                            dispatch(removeTileFromComputerRack("?"));
                                        }
                                    });
                                }
                                else{
                                    dispatch(removeTileFromComputerRack(letter));
                                }
                                
                                dispatch(updateBoard(newTile));
                                currentY += 1;
                            }
                
                        }

                        setLastWord(compMove.word);

                    }
                    
                }

                //Check if the computer wants to swap tiles
                else{
                    if(data.tilesToSwap.length !== 0){
                        let currentStore = storeSlicer.getState();
                        let tilebag = currentStore.tilebag.value.bag;
                        if(tilebag >= 7){
                            let noOfTilesNeeded = data.tilesToSwap.length;
                            let newTiles = DrawTiles(noOfTilesNeeded);
                            
                            for(let i = 0; i < data.tilesToSwap.length; i++){
                                let letter = data.tilesToSwap[i];
                              
                                dispatch(removeTileFromComputerRack(letter));
                            }
                            
                            dispatch(updateRack(newTiles));
                            
                            for(let i = 0; i < data.tilesToSwap.length; i++){
                                let currentLetter = data.tilesToSwap[i];
                                dispatch(addTileToBag(currentLetter));
                            }
                            currentStore = storeSlicer.getState();
                            

                        }
                            
                    }
                      
                }
                let currentStore = storeSlicer.getState();
                let tilebag = currentStore.tilebag.value.bag;
                //End game check
                if(tilebag === 0){
                    if(computerRack.length === 0){
                        endGame();
                    }
                }
                setComputerTurn(false);
                dispatch(increaseTurnNumber());
        })
    }
    
    
    //When the uses plays the word
    //Undergoes validation first if it passes then switches to the computers turn
    const handlePlayWord = async () => {
        validating(true);
        ValidateWord().then(d =>{
            if(d.pass){
                //Add the tiles to the board
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
                setLastWord(d.word);
                dispatch(increasePlayerScore(d.score));
                validating(false);
                dispatch(increaseTurnNumber());
                dispatch(resetPos());
                let tilebag = currentStore.tilebag.value.bag;
                if(tilebag === 0){
                    if(playerRack.length === 0){
                        endGame();
                    }
                }
                dispatch(hasPlayerTileDrawn(false));
                setComputerTurn(true); 
                
            }
            //Display a message to the user why move is invalid
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
            
        });
       
    }

    const showEndGame = () => {
        endGame();
    }

  
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


    //Displaying the game components to the user.
    //<> => Allows for React Fragments to return multiple divs
    return(
        <>
        
        { isValidating && <PopUp message={"Checking your word"}/>}
        { isError && <PopUp message={errorMessage}/>}
        { isComputerTurn && <PopUp message={"AIECHO turn"}/>}
        { isEndGame && <EndGame winner={winner} losers={losers} goHome={goHome} key={"endGame"}/>}
        <div className='header'>
            <div>
                <h1 className='title'>BIT SCRABBLE</h1>
                <HomeButton/>
            </div>
            
        </div>
        <div className='grid-container'>
            <div className='game noselect'>
                <Board key="board" currentBoard={boardChange} changeBlank={setBlank} ifBlank={isBlank}/>
                { isSwap &&  <Swap handleCancelSwap={handleCancelSwap}/>}
                <div className='bottomRow'>
                    <Rack key="rack" handlePlayWord={handlePlayWord} handleRackShuffle={handleRackShuffle} handleRackSwap={handleRackSwap} handleClearBoard={handleClearBoard} handlePass={handlePass} tn={turnNumber}/>
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

export default Game;