import "../../StyleSheets/RackBtn.css"

//For the button located near the rack, play and pass
const RackBtn = ({handleAction, text}) => {
    return(
        <button className="rackBtn" onClick={() => handleAction()}>{text}</button>
    )
}

export default RackBtn;