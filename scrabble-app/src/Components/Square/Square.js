import { useState, useEffect } from "react";
import '../../StyleSheets/Square.css';

//Display the square
const Square = ({sqType, children}) => {
    
    
    const [squareType, setSquareType] = useState('');

    useEffect(() => {
        setSquareType(sqType)
    }, [sqType]);

    var bonus;
    if(sqType === "B"){
        bonus = "";
    }
    else if(sqType === "C"){
        bonus = "DW";
    }
    else{
        bonus = sqType;
    }
    return(
        <div>
            <div className={`square ${sqType}`}>
                {children || bonus}
            </div>
            
        </div>
    )

}

export default Square;