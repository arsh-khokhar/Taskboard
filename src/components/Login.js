import React, {Fragment, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginSuccess, setLoginSuccess] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const history = useHistory();

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const loginData = {email, password};
			Axios.post('http://localhost:5000/api/users/login', {
				email: loginData.email,
				password: loginData.password,
			})
				.then((response) => {
					// console.log('Response received');
					// console.log(response.status);
					// console.log(response.data);
					if (response.status === 200) {
						sessionStorage.setItem('auth-token', response.data);
						setLoginSuccess(true);
					} else {
						setLoginSuccess(false);
					}
				})
				.catch((error) => {
					if (error.response.status === 400) {
						setLoginSuccess(false);
						setErrorMessage(error.response.data);
					}
				});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (loginSuccess === true) {
			history.push({
				pathname: '/',
			});
		}
	}, [loginSuccess]);

	if (loginSuccess === false) {
		return (
			<Fragment>
				<Alert variant="danger">{errorMessage}</Alert>
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

	//<Redirect to="/board" />;
}

export default Login;
