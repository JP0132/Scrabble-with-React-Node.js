import "../../StyleSheets/GameBtn.css"

//Game Button component
//Takes the text of the button and handles the action of the button.
const GameBtn = ({handleAction, text}) => {
    return (
        <button className="gameBtn" onClick={() => handleAction()}>{text}</button>
    );
}

export default GameBtn;