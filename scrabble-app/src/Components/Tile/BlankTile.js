import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBlankValue, updateBlanks } from "../../features/boardSlice";
import"../../StyleSheets/BlankTile.css";


const BlankTile = ({blank, setBValue, x ,y}) => {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    const handleKeyPress = (e) => {
        //console.log(e);
        const re = /[a-zA-Z]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
        //return (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122);
    }
    const handleSubmit = () => {
        if(input == ""){
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