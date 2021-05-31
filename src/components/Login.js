import React, {Fragment, useState} from 'react';
import {Redirect} from 'react-router-dom';
import Axios from 'axios';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	Axios.defaults.withCredentials = true;

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const loginData = {email, password};
			console.log('Sending loginData');
			Axios.post('http://localhost:5000/api/users/login', {
				email: loginData.email,
				password: loginData.password,
			}).then((response) => {
				console.log(response.data);
			});
		} catch (error) {
			console.error(error);
		}
	};

	const useEffect =
		(() => {
			Axios.get(
				'https://localhost:5000/api/users/login'.then((response) => {
					console.log(response);
				})
			);
		},
		[]);
	//<Redirect to="/board" />;
	return (
		<Fragment>
			<h1 className="text-center">Login</h1>
			<form onSubmit={onSubmitForm}>
				<input
					type="text"
					value={email}
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="text"
					value={password}
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button>Submit</button>
			</form>
		</Fragment>
	);
}

export default Login;
