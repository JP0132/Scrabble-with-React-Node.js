import { Link } from "react-router-dom";
import './PlayVsCompSelect.css';
import HomeButton from "../Buttons/HomeButton.js";

//Selecting the difficulty of the computer
const PlayerVsCompSelect = () => {
    document.body.style.backgroundImage = `url(${require("../../Images/freysteinn-g-jonsson-LI03w3L-PxU-unsplash.jpg").default})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.width ='100vw';
    document.body.style.height ='100vh';

    //use of Links to navigate to the correct route
    return (
        <>
            <HomeButton/>
            <div className='modeSelect'>
                <div className='logo'>
                    <img id="bit" src={`${require("../../Images/logo.png").default}`} alt="logo" />
                </div>
                <div id="homeText">
                    <span id="wel">SELECT THE COMPUTER DIFFICULTY</span><br />
                </div>
                <div className='navigation'>
                    <Link key="easy" to={`/playerVScomp/${"easy"}`}><button className='modeBtns' id="easy">Easy</button></Link>
                    <Link key="medium" to={`/playerVScomp/${"medium"}`}><button className='modeBtns' id="medium">Medium</button></Link>
                    <Link key="hard" to={`/playerVScomp/${"hard"}`}><button className='modeBtns' id="hard">Hard</button></Link>
                </div>
            </div>

        </>
      
    );
}

export default PlayerVsCompSelect;