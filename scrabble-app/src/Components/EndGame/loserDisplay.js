import { v4 as uuidv4 } from 'uuid';

//For the loser table in the end game pop up
const LoserDisplay = ({name, score}) => {
   
    return (
        <tr className="loserBoardRow" key={uuidv4()}>
            <td className="loserBoardRow-name">{name}</td>
            <td className="loserBoardRow-score" >{score}</td>
        </tr>
    
    );
}
 
export default LoserDisplay;