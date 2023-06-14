import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBlankValue, updateBlanks } from "../../features/boardSlice";
import"../../StyleSheets/BlankTile.css";


const BlankTile = ({blank, setBValue, x ,y}) => {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    const handleKeyPress = (e) => {
        //Accept only letters
        const re = /[a-zA-Z]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
        
    }
    //Set the blank value in the blanks state
    const handleSubmit = () => {
        if(input === ""){
            alert("Input cannot be blank");
        }
        else{
            let l = input.toUpperCase();
            dispatch(setBlankValue(l));
            let newBlank = {
                x: x,
                y: y,
                letter: l
            };
            dispatch(updateBlanks(newBlank));
            setBValue(l);
            blank(false);
        }
    }
    
    return (
        <>  
            <div className="overlay"></div>
            <div className="blank">
                <label className="blankLabel">Please specify the blank value:</label>
                <input className="blankInput" value={input} onInput={e => setInput(e.target.value)} onKeyPress={(e) => handleKeyPress(e)} maxLength={"1"}/>
                <input className="blankSubmit" type="submit" value="Submit" onClick={handleSubmit}/>
            </div>
        </>
    );
}
 
export default BlankTile;