import "../../StyleSheets/tileBag.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";




const TileBag = ({tn}) => {
    const tilebag = useSelector((state) => state.tilebag.value.bag);
    const [bag, setBag] = useState(0);

    useEffect(() => {
      setBag(tilebag);
    }, [tilebag]);

    
    return (
        <div className="tileBag">
            <div className="tileBagCounter">
                <div id="bagNum">{bag}</div>
                <div id="bagText">Tiles Left</div>
            </div>
        </div>
    );
}
 
export default TileBag;