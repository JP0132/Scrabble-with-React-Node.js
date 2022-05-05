import '../../StyleSheets/PopUp.css';


const PopUp = ({message}) => {
    return (
    <>  
        <div className="overlay">
        </div>
        <div className="popup">
            <h2 className='popupMessage'>{message}</h2>
        </div>
    </>
      
    );
}
 
export default PopUp;