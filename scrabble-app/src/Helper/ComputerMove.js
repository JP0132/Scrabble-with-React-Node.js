import {DrawTiles} from "../Components/Rack/RackHelper";
import GameData from "../JSONData/GameData.json";


export function MakeMove() {
    var newTiles;
    var compRack = GameData.computerRack;

    if(compRack < 7){
        let noOfTilesNeeded = 7 - compRack.length;
        newTiles = DrawTiles(noOfTilesNeeded);
        var newRack = compRack.concat(newTiles);
        GameData.playerRack = newRack;
    }
    



    // const [computerMove, setComputerMove] = useState([]);
    // useEffect(() => {
    //     fetch('http://localhost:3001/api/computerMove/').then(res => {
    //        return res.json();
    //     })
    //     .then(data => {
            

    //     })

    // }, [isComputerTurn]);
}