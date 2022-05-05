import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { resetBoardState } from "../../features/boardSlice";
import { resetGameState } from "../../features/gameSlice";
import { restPvPState } from "../../features/pvpgameSlice";
import { restRackState } from "../../features/rackSlice";
import { resetSquareState } from "../../features/squareSlice";
import { restTileBag } from "../../features/tilebagSlice";
import "../../StyleSheets/GameBtn.css"

//Button to let the user go back to the homepage
//Dispatching actions to reset the state
const HomeButton = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const goHome = () => {
        dispatch(resetBoardState());
        dispatch(resetSquareState());
        dispatch(restRackState());
        dispatch(resetGameState());
        dispatch(restTileBag());
        dispatch(restPvPState());
        history.push('/'); 
    }

    return (
        <button className='homeBtn' onClick={goHome}>Home</button>
    );
}
 
export default HomeButton;