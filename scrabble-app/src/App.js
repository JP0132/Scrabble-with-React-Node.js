import './App.css';
import Board from './Components/Board';
import Rack from './Components/Rack';

function App() {
  return (
    <div className="App">
      <h1 className="appTitle">AIECHO SCRABBLE</h1>
      <div className="centre">
        <Board/>
        <Rack/>
      </div>
      
    </div>
  );
}

export default App;
