import '../../StyleSheets/Board.css';
import Tile from '../Tile/Tile';
import BoardSquare from '../Square/BoardSquare';
import { useDispatch, useSelector } from 'react-redux';
import { BoardCoords } from '../Square/boardMap';
import BoardTile from '../Tile/BoardTile';

//Variables to pass as prop to board square
var setBlank;
var isBlank;


/**
 * Renders the square, either as a tile or plain square
 * @param  {Number} squareNum The square number form 1 to 225
 * @param  {Number} y Y coordinate of the square
 * @param  {Number} x X coordinate of the square
 * @param  {Array}  tilePositions Positions of tiles on the board
 * @param  {Char}   boardElement Value of the element in the board
 * @param  {Array}  blankPositions Blank positions on the board
 * @return {BoardSquare}  BoardSquare component to render the square
 */
function renderSquare(squareNum, y, x, tilePositions, boardElement, blankPositions){

    //Child to pass to the Board Square if square is occupied
    var c;
    if(boardElement !== "*"){
        c = <BoardTile letter={boardElement} x={x} y={y}/>
    }
    //If not then check if need to render tile
    else{
        c = renderTile(x, y, tilePositions, blankPositions);
    }
    
    //Get the square type mapping through the board coordinates
    var type = "B";
    var sqTypeKeys = Object.keys(BoardCoords);
    for(let i = 0; i < sqTypeKeys.length; i++){
        const currentType = BoardCoords[sqTypeKeys[i]];
        for(let j = 0; j < currentType.length; j++){
            if(currentType[j].x == x && currentType[j].y == y){
                type = sqTypeKeys[i];
                break;
            }
        }
    }
  
    //Return the board square
    return(
        <div key={squareNum}>
            <BoardSquare x={x} y={y} sqType={type} pos={tilePositions} isBlank={setBlank} aBlank={isBlank}>{c}</BoardSquare>
        </div>
    )
}

//Function to check what kind of tile to render
function renderTile(x, y, tilePos, blankPositions){
    for(let i = 0; i < tilePos.length; i++){
        let currentTile = tilePos[i];
        if(currentTile.x === x && currentTile.y === y){
            if(blankPositions.length !== 0){
                for(let j = 0; j < blankPositions.length; j++){
                    let blank= blankPositions[j];
                    if(blank.x == currentTile.x && blank.y == currentTile.y){
                        return <Tile key={currentTile.id} letter={blank.letter} id={currentTile.id} index={currentTile.index} style={{position:'absolute'}} isBlank={true}/>;
                    }
                }
                return <Tile key={currentTile.id} letter={currentTile.letter} id={currentTile.id} index={currentTile.index} style={{position:'absolute'}} isBlank={false}/>;
            }
            else{
                return <Tile key={currentTile.id} letter={currentTile.letter} id={currentTile.id} index={currentTile.index} style={{position:'absolute'}} isBlank={false}/>;

            }
            
            //
            
        }
    }
}

//Board component
const Board = ({changeBlank, ifBlank}) => {
    //Setting up the props to pass to the BoardSquare
    setBlank = changeBlank;
    isBlank = ifBlank;

    //Get the tile positions on the board
    const tilePositions = useSelector((state) => state.square.value.tilePositions);
    const blankPositions = useSelector((state) => state.board.value.blanks);
    const dispatch = useDispatch();

    const currentBoard = useSelector((state) => state.board.value.currentBoard);

    //Creates the squares, inserts into a list ready for rendering
    const squares = [];
    let sqNum = 0;
    for(let i = 0; i < currentBoard.length; i++){
        for(let j = 0; j < 15; j++){
            sqNum += 1;
            let p = currentBoard[i][j];
            squares.push(renderSquare(sqNum, i, j, tilePositions, p, blankPositions));
        }
    }


    return(
        <div id="scrabble-board">{squares}</div>
    )

    
}

export default Board;
