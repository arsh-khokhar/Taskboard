import "./App.css";
import Home from "./Home";
import Board from "./Board";
import Login from "./components/Login";
import Register from "./components/Register";
import {Route} from "react-router-dom";
import Navigation from "./Navbar";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Route exact path="/" component={Home} />{" "}
      <Route exact path="/board" component={Board} />{" "}
      <Route exact path="/login" component={Login} />{" "}
      <Route exact path="/register" component={Register} />{" "}
    </div>
  );
}

export default App;
