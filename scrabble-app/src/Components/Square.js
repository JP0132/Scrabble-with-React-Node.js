import '../CSS/Square.css';


const Square = (props) => {

    switch(props.squareType) {
        case 'B':
            return <div className="square blank"></div>;
   
        case 'TW':
            return <div className="square tw">TW</div>;

        case 'DW':
                return <div className="square dw">DW</div>;

        case 'TL':
            return <div className="square tl">TL</div>;
            
        case 'DL':
            return <div className="square dl">DL</div>;
        
        case 'C':
            return <div className="square star">DW</div>;

    }

}
 
export default Square;