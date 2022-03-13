import '../../StyleSheets/Board.css';
import Square from '../Square/Square'
import { useState, useEffect } from "react";
import Tile from '../Tile/Tile';
import BoardSquare from '../Square/BoardSquare';
import { useDispatch, useSelector } from 'react-redux';

function renderSquare(squareNum, y, x, type, tilePositions){

    let c = renderTile(x, y, tilePositions);
    return(
        <div key={squareNum}>
            <BoardSquare x={x} y={y} sqType={type} pos={tilePositions} >{c}</BoardSquare>
        </div>
    )
}

function renderTile(x, y, tilePos){
    for(let i = 0; i < tilePos.length; i++){
        let currentTile = tilePos[i];
        if(currentTile.x === x && currentTile.y === y){
            console.log("AM here");
            return <Tile key={currentTile.id} letter={currentTile.letter} id={currentTile.id} index={currentTile.index}/>
        }
    }
   
}

const Board = (props) => {
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
    const dispatch = useDispatch();

    const [tilesOnBoard, setTilesOnBoard] = useState([]);

    useEffect(() => {
        setTilesOnBoard(tilePositions);
    }, [tilePositions])

    const squares = [];
    let sqNum = 0;
    for(let i = 0; i < boardMap.length; i++){
        for(let j = 0; j < 15; j++){
            sqNum += 1;
            let sqType = boardMap[i][j];
            squares.push(renderSquare(sqNum, i, j, sqType, tilePositions));
        }
    }


    return(
        <div id="scrabble-board">{squares}</div>
    )

    
}

export default Board;
