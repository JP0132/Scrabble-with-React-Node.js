import {DrawTiles} from "./RackHelper";
import Tile from "../Tile/Tile";
import "../../StyleSheets/Rack.css";
import { v4 as uuidv4 } from 'uuid';
import { useDrop } from "react-dnd";
import {storeSlicer} from "../../app/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { addToPlayerRack, removeFromSwapRack } from "../../features/rackSlice";
import { removeFromSquare} from "../../features/squareSlice";
import RackBtn from '../Buttons/RackBtn';
import { setComputerRack } from "../../features/rackSlice";
import { hasCompTileDrawn, hasPlayerTileDrawn } from "../../features/gameSlice";
import GameBtn from "../Buttons/GameBtn";
import { hasPvPTileDrawn } from "../../features/pvpgameSlice";

//Display the user's rack
const Rack = ({handlePlayWord, handleRackShuffle, handleRackSwap, handleClearBoard, handlePass, tn, gameMode}) => {
    
    //Which player rack it is
    var playerNumber;
    if(gameMode == "pvp"){
        let currentStore = storeSlicer.getState();
        playerNumber = currentStore.pvpgame.value.turnPlayer;
        playerNumber = playerNumber;
    }
    else{
        playerNumber = "player";
    }
    //Set up consts
    const playerRack = useSelector((state) => state.rack.value[playerNumber+"Rack"]);
    const computerTd = useSelector((state) => state.game.value.computerDrawn);

    const dispatch = useDispatch();

    const [userRack, setuserRack] = useState([]);

    //Update the rack state
    useEffect(() => {
        setuserRack(playerRack);
    }, [playerRack]);

    //Get states from the store
    var turnNumber = useSelector((state) => state.game.value.turnNumber);
    //For computer vs player tile draw
    var playerTd = useSelector((state) => state.game.value.playerDrawn);
     //For pvp tile draw
    var pvpDrawn = useSelector((state) => state.pvpgame.value[playerNumber+"Drawn"]);
    
    //Draw new tiles for the user at the start of their turn
    useEffect(() => {
        if(gameMode == "pvp"){
            if(userRack.length < 7 && pvpDrawn == false){
                let noOfTilesNeeded = 7 - userRack.length;
                let newTiles;
                newTiles = DrawTiles(noOfTilesNeeded);
                for(let i = 0; i < newTiles.length; i++){
                    dispatch(addToPlayerRack({letter: newTiles[i], playerNumber: playerNumber+"Rack"}));
                }
                dispatch(hasPvPTileDrawn({draw: true, playerNumber: playerNumber + "Drawn"}));
            }
        }
        else{
            if(userRack.length < 7 && playerTd == false){
                let noOfTilesNeeded = 7 - userRack.length;
                let newTiles;
                newTiles = DrawTiles(noOfTilesNeeded);
                for(let i = 0; i < newTiles.length; i++){
                   dispatch(addToPlayerRack({letter: newTiles[i], playerNumber: playerNumber+"Rack"}));
                }
                dispatch(hasPlayerTileDrawn(true)); 
            }
        }  
    }, [playerTd, pvpDrawn]);

    //Game start, draw tiles for all the players
    useEffect(() => {
        if(gameMode == "pvp"){
            let currentStore = storeSlicer.getState();
            let pvp2Drawn = currentStore.pvpgame.value.player2Drawn;
            let pvp3Drawn = currentStore.pvpgame.value.player3Drawn;
            let pvp4Drawn = currentStore.pvpgame.value.player4Drawn;
            if(turnNumber == 1 &&  pvp2Drawn == false  &&  pvp3Drawn == false  &&  pvp4Drawn == false){
                let noOfPlayers = currentStore.pvpgame.value.noOfPlayers;
                for(let i = 2; i < noOfPlayers+1; i++){
                    let newPlayerRack = DrawTiles(7);
                    for(let j = 0; j < newPlayerRack.length; j++){
                        dispatch(addToPlayerRack({letter: newPlayerRack[j], playerNumber: "player"+i+"Rack"}));
                    }
                    dispatch(hasPvPTileDrawn({draw: true, playerNumber: "player"+i+"Drawn"}));
                }
            }
        }
        else{
            if(turnNumber == 1 && computerTd == false){
                let compRack = DrawTiles(7);
                dispatch(setComputerRack(compRack));
                dispatch(hasCompTileDrawn(true));
            }
        }
      
    }, []);
    
    //Drop target for the rack so tiles can be added back on
    const [{isOver}, drop] = useDrop(() => ({

        accept:"tile",
        drop: (item) => addToRack(item.letterValue, item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    //Handles the adding back to the rack
    const addToRack = (letter, id) => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        let tiles = currentStore.rack.value.tilesToSwap;
        
        //If the tiles is from the board, remove it from the board
        let found = false;
        var foundObject;

        //If from swap rack remove from swap
        let swapFound = false;
        var foundSwapObject;

        for(let i = 0; i < pos.length; i++){
            if(pos[i].id === id){
                found = true;
                foundObject = i;
            }
        }

        for(let i = 0; i < tiles.length; i++){
            if(tiles[i].id === id){
                swapFound = true;
                foundSwapObject = i;
            }
        }
        let playerNo;
        if(gameMode == "pvp"){
            playerNo = currentStore.pvpgame.value.turnPlayer;
        }
        else{
            playerNo = "player";
        }
        if(found){

            dispatch(removeFromSquare(foundObject));
            
            dispatch(addToPlayerRack({letter: letter, playerNumber: playerNo+"Rack"}));
        }
        else if(swapFound){
            dispatch(removeFromSwapRack(foundSwapObject));
            dispatch(addToPlayerRack({letter: letter, playerNumber: playerNo+"Rack"}));
        }
      
    
    }

  
    return(
        <div className="rack">
            <div ref={drop} className="rackPlace"> 
            {playerRack.map((letter, index) => {
                return <Tile key={uuidv4()} letter={letter.letter} id={letter.id} index={index}/>
            })}   
            </div>
            <div className='btnCon'>
                <RackBtn key="playBtn" handleAction={handlePlayWord} text={"PLAY"}/>
                <RackBtn key="passBtn" handleAction={handlePass} text={"PASS"}/>      
            </div>
            <div className='btnCon'>
                <GameBtn key="shuffleBtn" handleAction={handleRackShuffle} text={"Shuffle"}/>
                <GameBtn key="swapBtn" handleAction={handleRackSwap} text={"Swap"}/>
                <GameBtn key="clearBtn" handleAction={handleClearBoard} text={"Clear"}/>       
            </div>
        </div>
    );
    

   

}


export default Rack;