//import logo from './logo.svg';
import './index.css';
import './App.css';
import Home from './Home';
// import Board from './Board';
// import Card from './Card';
import Login from './components/Login';
import Register from './components/Register';
import {Route} from 'react-router-dom';
import Navbar from './Navbar';
import DragNDrop from './DragAndDrop';

const data = [
  {title: 'Stallions', items: ['Leslie', 'Ron', 'Ben']},
  {title: 'Ponies', items: ['Tom', 'Donna']},
  {title: 'Lions', items: ['April', 'Andy']},
];

function App () {
  return (
    <div className="App">
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route exact path="/board" component={() => <DragNDrop data={data} />} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      {/* <main className="flexbox">
        <Board id="board-1" className="board">
          <Card id="card-1" className="card" draggable="true">
            <p>Card one</p>
          </Card>
        </Board>

        <Board id="board-2" className="board">
          <Card id="card-2" className="card" draggable="true">
            <p>Card two</p>
          </Card>
        </Board>

      </main> */}
    </div>
  );
  return (
    <div className="App">
      <header className="App-header">
        {/* <DragAndDrop data={data} /> */}
        <Login />
      </header>
    </div>
  );
}

export default App;
