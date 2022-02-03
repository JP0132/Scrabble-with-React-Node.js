import "../../StyleSheets/PlayBtn.css"

const PlayBtn = ({handlePlayWord}) => {
    return(
        <button className="rackBtn" id="playBtn" onClick={() => handlePlayWord()}>Play Word</button>
    )
}

export default PlayBtn;