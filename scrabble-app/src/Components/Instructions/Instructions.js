import HomeButton from "../Buttons/HomeButton";
import "./Instruction.css";

//Display the instructions to the user
const Instructions = () => {
    

    return (
        <>
        <div>
            <HomeButton/>
        </div>
       
        <h1 id="instructTitle">Instructions</h1>
        <div className="instructionContainer">
            <div>
                <h1 className="sectionTitle">Intro</h1>
                <p>To start the game pick the mode you want to play, solo against a computer or against a friend on your computer</p>
            </div>
            <div>
                <h1>Player vs Computer</h1>
                <p>Select the difficulty of the computer. You will always go first against the computer.</p>
                <p>On your screen you will see your rack and the board. On the right side you will see the score board, number of tiles left and last word played.</p>
                <p>To play the game, simply click on the tile you want add to the board and drag it to the square.<br/>
                When going first, the word must cross through the center tile, only then it considered a valid play.<br/>
                When forming a word, tiles placed but be in either one row or column.</p>

                <h1>Player vs Player</h1>
                <p>Select number of players, up to four can be added. Enter the names. The order of the turn is in increasing order, decide the order for yourselves</p>
                <p>You will see the same screen as Player vs Computer</p>
                <p>Move the tiles form the rack onto the board forming the word. Once done click play to see your score and it will move onto the next player.</p>
                <p>Only the turn player will be able to see their rack.</p>

                <h1>Game Play</h1>
                
                <h2>Tile Exchange</h2>
                <p>Using the Swap button, you will be able to exchange your tiles. Do this by dragging the tile on to the swap rack.
                <br/>Bear in mind that once exchanged you will miss you turn to play word hence receiving a score of 0. <br/>Also if there are less then 7 tiles in the rack you will not be able to exchange</p>
                <h2>Scoring</h2>
                <p>Scoring is done by adding up the tile points. Blank tiles are worth 0 points. <br/>You can receive bonus points if the square a tile is being played on is a bonus square.</p>
                <ul>
                    <li>TW = Triple Word Score</li>
                    <li>DW = Double Word Score</li>
                    <li>TL = Triple Letter Score</li>
                    <li>DL = Double Letter Score</li>
                </ul>
                <p>If you use up all 7 tiles from your rack in a single turn then you receive an additional 50 score</p>
               
                <h2>End Game</h2>
                <p>To end the game, a button will appear once the tile bag reaches 0. Decide for yourselves if no more plays can be made or once a player uses their entire rack the game ends.</p>
                <p>Players with tiles remaining on the rack will have points deducted and those deducted points are added to the player who used all of their tiles.</p>
                
            </div>
        </div>
    
        </>
    );
}
 
export default Instructions;