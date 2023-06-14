import { useEffect, useState } from "react";
import "./PlayerVsPlayerSelect.css";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeTurnPvPPlayer, setNoOfPlayers, setPlayerName } from "../../features/pvpgameSlice";
import { setGameMode } from "../../features/gameSlice";
import HomeButton from "../Buttons/HomeButton";

//Player vs Player add up to 4 players
const PlayerVsPlayerSelect = () => {
    const [player1Name, setPlayer1] = useState("");
    const [player2Name, setPlayer2] = useState("");
    const [player3Name, setPlayer3] = useState("");
    const [player4Name, setPlayer4] = useState("");

    const [extraPlayers, setExtraPlayer] = useState(2);

    document.body.style.backgroundImage = `url(${require("../../Images/freysteinn-g-jonsson-LI03w3L-PxU-unsplash.jpg").default})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.width ='100vw';
    document.body.style.height ='100vh';

    const history =  useHistory();
    const dispatch = useDispatch();

    
    //Add a new player
    const handleAdd = () => {
        if(extraPlayers !== 4){
            let num = extraPlayers + 1;
            setExtraPlayer(num);
            
        }
    }
    
    //Remove a player
    const handleRemove = () => {
        if(extraPlayers > 2){
            let num = extraPlayers - 1;
            setExtraPlayer(num);
            
        }
    }

    //On submit check if all player field are entered, if not send a alert.
    //Otherwise dispatch the data to the store
    const handleSubmit = () => {
        if(extraPlayers === 2){
            if(player1Name === "" || player2Name === ""){
                alert("All fields must be filled in");
            }
            else{
                //Add to redux
                dispatch(setPlayerName({playerNumber: "player1", playerName: player1Name}));
                dispatch(setPlayerName({playerNumber: "player2", playerName: player2Name}));
                dispatch(changeTurnPvPPlayer("player1"));
                dispatch(setGameMode("pvp"));
                dispatch(setNoOfPlayers(2));
                history.push('/playerVSplayer');  
            }
        }

        else if(extraPlayers === 3){
            if(player1Name === "" || player2Name === ""|| player3Name === ""){
                alert("All fields must be filled in");
                return;
            }
            else{
                //Add to redux
                dispatch(setPlayerName({playerNumber: "player1", playerName: player1Name}));
                dispatch(setPlayerName({playerNumber: "player2", playerName: player2Name}));
                dispatch(setPlayerName({playerNumber: "player3", playerName: player3Name}));
                dispatch(changeTurnPvPPlayer("player1"));
                dispatch(setGameMode("pvp"));
                dispatch(setNoOfPlayers(3));

                history.push('/playerVSplayer');  
            }
        }

        else if(extraPlayers === 4){
            if(player1Name === "" || player2Name === ""|| player3Name === "" || player4Name === ""){
                alert("All fields must be filled in");
                
            }
            else{
                dispatch(setPlayerName({playerNumber: "player1", playerName: player1Name}));
                dispatch(setPlayerName({playerNumber: "player2", playerName: player2Name}));
                dispatch(setPlayerName({playerNumber: "player3", playerName: player3Name}));
                dispatch(setPlayerName({playerNumber: "player4", playerName: player4Name}));
                dispatch(changeTurnPvPPlayer("player1"));
                dispatch(setGameMode("pvp"));
                dispatch(setNoOfPlayers(4));
                history.push('/playerVSplayer');
            }
        }
        
        
       
        
    }

    return (  
        <>
         <HomeButton/>
        <div className='playerSelect'>
            <div className='logo'>
                <img id="bit" src={`${require("../../Images/logo.png").default}`} alt="logo" />
            </div>
            <div id="homeText">
                <span id="wel">ENTER UP TO 4 PLAYERS AND CLICK PLAY</span>
            </div>
            <div className='navigation'>
                <label className="playerLabel">Enter Player 1 name:</label>
                <input className="enterPlayerName" value={player1Name} onInput={e => setPlayer1(e.target.value)}/>

                <label className="playerLabel">Enter Player 2 name:</label>
                <input className="enterPlayerName" value={player2Name} onInput={e => setPlayer2(e.target.value)}/>

                {(extraPlayers === 3 || extraPlayers === 4) && 
                <>
                    <label className="playerLabel">Enter Player 3 name:</label>
                    <input className="enterPlayerName" value={player3Name} onInput={e => setPlayer3(e.target.value)}/>
                </>
                }

                {(extraPlayers === 4) && 
                    <>
                        <label className="playerLabel">Enter Player 4 name:</label>
                        <input className="enterPlayerName" value={player4Name} onInput={e => setPlayer4(e.target.value)}/>
                    </>
                }   

                <div className="playerSelectCon">
                    <button className='playerSelectBtn' id="add" onClick={handleAdd}>Add Player</button>
                    <button className='playerSelectBtn' id="remove" onClick={handleRemove}>Remove Player</button>
                </div>
               
                <button className='playerSelectBtn' id="play" onClick={handleSubmit}>Play</button>
            </div>
        </div>

    </>
    );
}
 
export default PlayerVsPlayerSelect;