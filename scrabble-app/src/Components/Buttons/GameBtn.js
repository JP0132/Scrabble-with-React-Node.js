import "../../StyleSheets/GameBtn.css"
const GameBtn = ({handleAction, text}) => {
    return (
        <button className="gameBtn" onClick={() => handleAction()}>{text}</button>
    );
}

export default GameBtn;