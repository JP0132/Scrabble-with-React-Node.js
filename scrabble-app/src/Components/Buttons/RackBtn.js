import "../../StyleSheets/RackBtn.css"

const RackBtn = ({handleAction, text}) => {
    return(
        <button className="rackBtn" onClick={() => handleAction()}>{text}</button>
    )
}

export default RackBtn;