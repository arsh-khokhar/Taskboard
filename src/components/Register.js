import React, {Fragment, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import Axios from 'axios';

function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const registerData = {email, password};
			Axios.post('http://localhost:5000/users/register', {
				email: registerData.email,
				password: registerData.password,
			}).then((response) => {
				console.log(response);
			});
		} catch (error) {
			console.error(error);
		}
	};

	//<Redirect to="/board" />;
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
