import "./App.css";
import Home from "./components/Home";
import Board from "./components/Board";
import Login from "./components/Login";
import Register from "./components/Register";
import {Route} from "react-router-dom";
import Navigation from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Route exact path="/" component={Home} />{" "}
      <Route path="/board/:board_id" component={Board} />{" "}
      <Route exact path="/login" component={Login} />{" "}
      <Route exact path="/register" component={Register} />{" "}
    </div>
  );
}

export default App;
