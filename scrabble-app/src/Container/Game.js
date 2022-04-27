import './Game.css';
import Board from '../Components/Board/Board';
import Rack from '../Components/Rack/Rack';
import GameBtn from '../Components/Buttons/GameBtn';
import GameData from '../JSONData/GameData.json'
import { useEffect, useState } from 'react';
import {MakeMove} from '../Helper/ComputerMove';
import {storeSlicer} from "../app/store";
import { removeTileFromComputerRack, setComputerRack, shuffleRack, updateRack } from "../features/rackSlice";
import { useDispatch, useSelector } from 'react-redux';
import Swap from '../Components/Buttons/Swap';
import TileBag from '../Components/TileBag/TileBag';
import { addToPlayerRack, removeFromSwapRack } from "../features/rackSlice";
import { removeFromSquare, resetPos} from "../features/squareSlice";
import { ValidateWord } from '../Helper/ValidateWord';
import { updateBlanks, updateBoard } from '../features/boardSlice';
import { hasPlayerTileDrawn, increaseComputerScore, increaseTurnNumber } from '../features/gameSlice';
import { DrawTiles } from '../Components/Rack/RackHelper';
import PopUp from '../Components/Popup.js/PopUp';
import Scoreboard from '../Components/Scoreboard/Scoreboard';
import BlankTile from '../Components/Tile/BlankTile';







const Game = () => {
    // To display a message to the user when it is the computer players turn
    const [isComputerTurn, setComputerTurn] = useState(false);

    //Display the message to the user when their move is being validated
    const [isValidating, validating] = useState(false);

    //Display the swap rack tray
    const [isSwap, setSwap] = useState(false);

    const [isBlank, setBlank] = useState(false);


    const [compScore, setComputerScore] = useState(0);

    //Getting the current turn number
    var turnNumber = useSelector((state) => state.game.value.turnNumber);
    var board = useSelector((state) => state.board.value.currentBoard);
    var computerRack = useSelector((state) => state.rack.value.computerRack);

    //Pass board changes
    const [boardChange, setBoardChange] = useState([]);

    //Dispatch actions to the store
    const dispatch = useDispatch();

    //Shuffle the player's rack when the button is clicked
    const handleRackShuffle = () => {
        let currentStore = storeSlicer.getState();
        let tiles = currentStore.rack.value.playerRack;
        let shuffledRack = tiles
        .map(value => ({value, sort: Math.random()}))
        .sort((a, z) => a.sort - z.sort)
        .map(({ value }) => value)
        dispatch(shuffleRack(shuffledRack));
    }

    //Clear the board of the tiles placed on the board back on to the rack
    const handleClearBoard = () => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        for(let i = 0; i < pos.length; i++){
            dispatch(removeFromSquare(pos[i]));
            dispatch(addToPlayerRack(pos[i].letter));
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
    const handleCancelSwap = () => {
        setSwap(false);
    }

    useEffect(() => {
        if(isComputerTurn){
            let currentStore = storeSlicer.getState();
            let compRack = currentStore.rack.value.computerRack;
            let b = currentStore.board.value.currentBoard;
            let blanks = currentStore.board.value.blanks;
            console.log(compRack.length);
            if(compRack.length < 7){
                console.log("Here");
                let noOfTilesNeeded = 7 - compRack.length;
                let tilesDrawn = DrawTiles(noOfTilesNeeded);
                console.log("Tiles gret", tilesDrawn);
                //let updatedRack = compRack.concat(tilesDrawn);
                //dispatch(setComputerRack(updatedRack));
                dispatch(updateRack(tilesDrawn));
            }
            currentStore = storeSlicer.getState();
            compRack = currentStore.rack.value.computerRack;
            var data = {
                "rack" : compRack,
                "board" : b,
                "blanks" : blanks 
            };

            getComputerMove(data);

        }
      
    }, [isComputerTurn])

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
                if(compMove.word !== ""){
                    dispatch(increaseComputerScore(data.score));
                    if(compMove.blanks.length !== 0){
                        for(let i = 0; i < compMove.blanks.length; i++ ){
                            dispatch(updateBlanks(compMove.blanks[i]));
                        }
                    }
                    let currentStore = storeSlicer.getState();
                    let currentBoard = currentStore.board.value.currentBoard;
                  

                    if(compMove.direction == "R"){
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
                                let blankFound = false;
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
                                //dispatch(removeTileFromComputerRack(letter));
                                dispatch(updateBoard(newTile));
                                currentY += 1;
                            }
                
                        }

                    }
                    
                }
                setComputerTurn(false);
                dispatch(increaseTurnNumber());
        })
    }
    
    
    //When the uses plays the word
    //Undergoes validation first if it passes then switches to the computers turn
    const handlePlayWord = () => {
        validating(true);
        ValidateWord().then(d =>{
            console.log(d);
           if(d){
            let currentStore = storeSlicer.getState();
            let pos = currentStore.square.value.tilePositions;
            for(let i = 0; i < pos.length; i++){
                let t = pos[i];
                //console.log(t);
                let x = t.x;
                //console.log(x);
                let y = t.y;
                let l = t.letter;
                dispatch(updateBoard({x: x, y: y, letter: l}));
            }
            validating(false);
            dispatch(increaseTurnNumber());
            dispatch(resetPos());
            dispatch(hasPlayerTileDrawn(false));
            setComputerTurn(true); 
            
        }
        else{
            validating(false);
        }
            
        });
       
    }



    //Displaying the game components to the user.
    //<> => Allows for React Fragments to return multiple divs
    //{ isBlank && <BlankTile blank={blankChange}/>}
    //<Board key="board" currentBoard={boardChange} blank={blankChange} isblank={isBlank}/>

    return(
        <>
        
        { isValidating && <PopUp message={"Checking your word"}/>}
        { isComputerTurn && <PopUp message={"AIECHO turn"}/>}
        <div className='header'>
            <h1 className='title'>AIECHO SCRABBLE</h1>
        </div>
        <div className="toprow">
            <Scoreboard  key="scoreBoardComputer" user={"computerScore"}/>
            <div className='btnCon'>
                <GameBtn key="shuffleBtn" handleAction={handleRackShuffle} text={"Shuffle"}/>
                <GameBtn key="swapBtn" handleAction={handleRackSwap} text={"Swap"}/>
                <GameBtn key="clearBtn" handleAction={handleClearBoard} text={"Clear"}/>
            </div>
            
            <Scoreboard  key="scoreBoardUser" user={"playerScore"}/>
            <TileBag key="tilebag" tn={turnNumber}/>   

        </div>
        
        <div className='game noselect'>
            <Board key="board" currentBoard={boardChange} changeBlank={setBlank} ifBlank={isBlank}/>
            { isSwap &&  <Swap handleCancelSwap={handleCancelSwap}/>}  
            <Rack key="rack" handlePlayWord={handlePlayWord} tn={turnNumber}/>
        </div>
        </>
       
    );
}

export default Game;

/*
   <div className='game'>
            <div className='centre'>
                <Board key="board" currentBoard={boardChange}/>
                <div className='row'>
                    <Rack key="rack"/>
                   
                    <div className='btnCon'>
                        <PlayBtn key="playBtn" handlePlayWord={handlePlayWord}/>
                    </div>
                </div>    
            </div>
          
        </div>

*/

/*
    { isComputerTurn && <div id="con"><div id="text">AIECHO Turn</div></div> }
        <div className='header'>
            <h1 className='title'>AIECHO SCRABBLE</h1>
        </div>
        <div className="grid-container">
        <div className='left-content'>
            <div className='btn-con'>
                <ShuffleBtn key="shuffleBtn" handleRackShuffle={handleRackShuffle}/>
            </div>
            
        </div>
        <div className="content">
        <div className='centre'>
            <Board key="board" currentBoard={boardChange}/>
            <div className='row'>
                <Rack key="rack"/> 
                <div className='btnCon'>
                    <PlayBtn key="playBtn" handlePlayWord={handlePlayWord}/>
                </div>
            </div>    
        </div>
        </div>
        <div className='right-content'>
            <ShuffleBtn key="shuffleBtn" handleRackShuffle={handleRackShuffle}/>
        </div>
        </div>

*/