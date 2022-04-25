import '../../StyleSheets/PopUp.css';


const PopUp = ({message}) => {
    return (
    <>  
        <div className="overlay">
        </div>
        <div className="popup">
            {message}
        </div>
    </>
      
    );
}
 
export default PopUp;