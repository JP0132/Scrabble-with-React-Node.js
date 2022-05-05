import { v4 as uuidv4 } from 'uuid';

//Accepting data from the Scoreboard, mapping through it to get the name and score in a table 
const ScoreRow = ({obj}) => {
    return (
        <>
            <table>
                <thead>
                </thead>
                <tbody>
                    {obj.map((player) => (
                        <tr className="scoreboard-row" key={uuidv4()}>
                            <td className="scoreboard-name">{player.name}</td>
                            <td className="scoreboard-score" >{player.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
 
export default ScoreRow;