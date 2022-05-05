import "../../StyleSheets/LastWord.css";

//Display the last word played
const LastWord = ({lastWord}) => {

    return (
        <div className="lastWordContainer">
            <h1>Last Word Played</h1>
            <p className="wordText">{lastWord}</p>
        </div>
    );
}
 
export default LastWord;