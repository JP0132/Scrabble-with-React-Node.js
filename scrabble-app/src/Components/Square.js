import '../CSS/Square.css';


const Square = (props) => {

    //Switch case to create the different bonus squares
    //Each square has a unique id which is the coordinates
    switch(props.squareType) {
        case 'B':
            return <div id={props.coords} className="square blank"></div>;
   
        case 'TW':
            return <div id={props.coords} className="square tw">TW</div>;

        case 'DW':
                return <div id={props.coords} className="square dw">DW</div>;

        case 'TL':
            return <div id={props.coords} className="square tl">TL</div>;
            
        case 'DL':
            return <div id={props.coords} className="square dl">DL</div>;
        
        case 'C':
            return <div id={props.coords} className="square star">DW</div>;

    }

}
 
export default Square;