import '../CSS/Board.css';
import Square from './Square';


const Board = () => {
    //A 2D array containing each type of square their position
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

    //Array to store each square of the board
    let board = [];
    
    //Loop over the board squares to create the correpsonding square
    for(let i = 0; i < boardMap.length; i++){
        let a = boardMap[i];
        for(let j = 0; j < 15; j++){
            let val = a[j];
            //console.log(val);

            //Create the coordinates of each square
            let coords = i+","+j;
            //console.log(coords);
            //Save it to the array
            //Creating an square passing the type and coordinates
            board.push(<Square squareType = {val} coords = {coords}/>);
        }
    }


    return (
        <div id="scrabble-board">{board}</div>
    );
}
 
export default Board;
