import '../../StyleSheets/Board.css';
import Square from '../Square/Square'
import { useState, useEffect } from "react";
import Tile from '../Tile/Tile';
import BoardSquare from '../Square/BoardSquare';
import { useDispatch, useSelector } from 'react-redux';
import { BoardCoords } from '../Square/boardMap';
import { LetterData } from '../../JSONData/LetterData.json';
import BoardTile from '../Tile/BoardTile';

var setBlank;
var isBlank;

function renderSquare(squareNum, y, x, tilePositions, p, blankPositions){
    var c;
    if(p !== "*"){
        c = <BoardTile letter={p} x={x} y={y}/>
    }
    else{
        c = renderTile(x, y, tilePositions, blankPositions);
    }
    
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
  
    
    return(
        <div key={squareNum}>
            <BoardSquare x={x} y={y} sqType={type} pos={tilePositions} isBlank={setBlank} aBlank={isBlank}>{c}</BoardSquare>
        </div>
    )
}

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
            
            //console.log("AM here");
            
        }
    }
}

const Board = ({changeBlank, ifBlank}) => {
    setBlank = changeBlank;
    isBlank = ifBlank;

 
    const boardMap = [
        ['TW','B','B','DL','B','B','B','TW','B','B','B','DL','B','B','TW'],
        ['B','DW','B','B','B','TL','B','B','B','TL','B','B','B','DW','B'],
        ['B','B','DW','B','B','B','DL','B','DL','B','B','B','DW','B','B'],
        ['DL','B','B','DW','B','B','B','DL','B','B','B','DW','B','B','DL'],
        ['B','B','B','B','DW','B','B','B','B','B','DW','B','B','B','B'],
        ['B','TL','B','B','B','TL','B','B','B','TL','B','B','B','TL','B'],
        ['B','B','DL','B','B','B','DL','B','DL','B','B','B','DL','B','B'],
        ['TW','B','B','DL','B','B','B','C','B','B','B','DL','B','B','TW'],
        ['B','B','DL','B','B','B','DL','B','DL','B','B','B','DL','B','B'],
        ['B','TL','B','B','B','TL','B','B','B','TL','B','B','B','TL','B'],
        ['B','B','B','B','DW','B','B','B','B','B','DW','B','B','B','B'],
        ['DL','B','B','DW','B','B','B','DL','B','B','B','DW','B','B','DL'],
        ['B','B','DW','B','B','B','DL','B','DL','B','B','B','DW','B','B'],
        ['B','DW','B','B','B','TL','B','B','B','TL','B','B','B','DW','B'],
        ['TW','B','B','DL','B','B','B','TW','B','B','B','DL','B','B','TW']
    ];


    const tilePositions = useSelector((state) => state.square.value.tilePositions);
    const blankPositions = useSelector((state) => state.board.value.blanks);
    const dispatch = useDispatch();

    // const [tilesOnBoard, setTilesOnBoard] = useState([]);

    // useEffect(() => {
    //     setTilesOnBoard(tilePositions);
    // }, [tilePositions])

    const currentBoard = useSelector((state) => state.board.value.currentBoard);

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
