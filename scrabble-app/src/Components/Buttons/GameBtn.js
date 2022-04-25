import "../../StyleSheets/ShuffleBtn.css"
const GameBtn = ({handleAction, text}) => {
    return (
        <button id="shuffleBtn" onClick={() => handleAction()}>{text}</button>
    );
}

export default GameBtn;