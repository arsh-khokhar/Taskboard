import React, {Fragment, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';

function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [registerSuccess, setRegisterSuccess] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const registerData = {email, password};
			Axios.post('http://localhost:5000/api/users/register', {
				email: registerData.email,
				password: registerData.password,
			})
				.then((response) => {
					console.log('Response received');
					console.log(response.status);
					console.log(response.data);
					if (response.status === 200) {
						setRegisterSuccess(true);
					} else {
						setRegisterSuccess(false);
					}
				})
				.catch((error) => {
					if (error.response.status === 400) {
						setRegisterSuccess(false);
						setErrorMessage(error.response.data);
					}
				});
		} catch (error) {
			console.error(error);
		}
	};
	{
		/* <Redirect to="/board" />; */
	}
	if (registerSuccess === false) {
		return (
			<Fragment>
				<Alert variant="danger">{errorMessage}</Alert>
				<h1 className="text-center">Register</h1>
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
	if (registerSuccess === true) {
		return <Redirect to="/login" />;
	}
	return (
		<Fragment>
			<h1 className="text-center">Register</h1>
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

export default Register;
