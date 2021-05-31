import './index.css';
import './App.css';
import Home from './Home';
import Board from './Board';
import Login from './components/Login';
import Register from './components/Register';
import {Route} from 'react-router-dom';
import Navbar from './Navbar';

const data = [
	{title: 'Stallions', items: ['Leslie', 'Ron', 'Ben']},
	{title: 'Ponies', items: ['Tom', 'Donna']},
	{title: 'Lions', items: ['April', 'Andy']},
];

function App() {
	return (
		<div className="App">
			<Navbar />
			<Route exact path="/" component={Home} />
			<Route
				exact
				path="/board"
				component={() => <Board data={data} />}
			/>
			<Route exact path="/login" component={Login} />
			<Route exact path="/register" component={Register} />
		</div>
	);
}

export default App;
