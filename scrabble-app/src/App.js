import './App.css';
import Game from './Container/Game';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home/Home';
import PlayerVsCompSelect from './Components/Selection/PlayerVsCompSelect';
import PlayerVsPlayerSelect from './Components/Selection/PlayerVsPlayerSelect';
import PvPGame from './Container/PlayerVsPlayer/PvPGame';
import Instructions from './Components/Instructions/Instructions';

//App now uses routes to direct the user to different pages
function App() {
  return (
    <Router>
      <div className='content'>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/instruction">
            <Instructions />
          </Route>
          <Route exact path="/playerVScompSelect">
            <PlayerVsCompSelect/>
          </Route>
          <Route exact path="/playerVScomp/:difficulty">
            <DndProvider backend={HTML5Backend}>
                <Game/>
            </DndProvider>
          </Route>
          <Route exact path="/playerVSplayerSelect">
            <PlayerVsPlayerSelect/>
          </Route>
          <Route exact path="/playerVSplayer">
            <DndProvider backend={HTML5Backend}>
              <PvPGame/>
            </DndProvider>
          </Route>
      
        </Switch>
      </div>
     
    </Router>
  );
}

export default App;

