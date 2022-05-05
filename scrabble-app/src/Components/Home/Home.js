import './Home.css';
import { Link } from 'react-router-dom';

//The page shown to the users when the game is first launched
const Home = () => {

    //Changes the background to an image
    document.body.style.backgroundImage = `url(${require("../../Images/freysteinn-g-jonsson-LI03w3L-PxU-unsplash.jpg").default})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.width ='100vw';
    document.body.style.height ='100vh';
    
    //Home page
    //Links to the different sections
    return (
        <>
            <div className='darkenImage'></div>
            <div className='intro'>
                <h1 id="title">Bit Scrabble by Raven Co</h1>
            </div>
            <div className='center'>
                <div className='logo'>
                    <img id="bit" src={`${require("../../Images/logo.png").default}`} alt="logo" />
                </div>
                <div id="homeText">
                    <span id="wel">WELCOME TO BIT SCRABBLE</span><br />
                    <em id="weltext">Here you will be able to play Scrabble till you heart contents</em>
                </div>
                <div className='navigation'>
                    <Link key="link1" to="/playerVScompSelect"><button className='homeBtns' id="playervscomp">Player vs Computer</button></Link>
                    <Link key="link2" to="/playerVSplayerSelect"><button className='homeBtns' id="playervsplayer">Player vs Player</button></Link>
                    <Link key="link4" to="/instruction"><button className='homeBtns' id="instruction">Instructions</button></Link>
                </div>
            </div>
    
      
       
        </>
    );
}
 
export default Home;