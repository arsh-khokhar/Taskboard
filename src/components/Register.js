import React, {Fragment, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap';

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

	if (registerSuccess === true) {
		return <Redirect to="/login" />;
	}
	return (
		<Fragment>
			<Alert
				style={{
					visibility:
						registerSuccess === false ? 'visible' : 'hidden',
				}}
				variant="danger"
			>
				{errorMessage}
			</Alert>
			<Form className="creds" onSubmit={onSubmitForm}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Button variant="success" type="submit" block>
					Create account
				</Button>
			</Form>
		</Fragment>
	);
}

export default Register;
