import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Board from './Board';
import Login from './Login';
import {Route, Link} from 'react-router-dom';
import Navbar from './Navbar';

function App () {
  return (
    <div className="App">
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route exact path="/board" component={Board} />
      <Route exact path="/login" component={Login} />
    </div>
  );
}

export default App;
