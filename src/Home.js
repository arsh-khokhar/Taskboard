import {Fragment, React, useState, useEffect} from 'react';
import Axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {Card, CardColumns} from 'react-bootstrap';

function Home() {
	const [auth_user, setAuthUser] = useState(false);

	const getBoards = async () => {
		try {
			Axios.get('http://localhost:5000/api/boards/', {
				headers: {
					'auth-user': sessionStorage.getItem('auth-user'),
					'auth-token': sessionStorage.getItem('auth-token'),
				},
			})
				.then((response) => {
					console.log(response.data);
					console.log(response.status);
					if (response.status === 200) {
						console.log('setting auth user true');
						setAuthUser(true);
					}
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		console.log('this thing called');
		getBoards();
	}, []);

	useEffect(() => {
		console.log(auth_user);
	}, [auth_user]);

	return auth_user ? (
		<Fragment>
			<CardColumns>
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							This card has supporting text below as a natural
							lead-in to additional content.{' '}
						</Card.Text>
						<Card.Text>
							<small className="text-muted">
								Last updated 3 mins ago
							</small>
						</Card.Text>
					</Card.Body>
				</Card>
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							This card has supporting text below as a natural
							lead-in to additional content.{' '}
						</Card.Text>
						<Card.Text>
							<small className="text-muted">
								Last updated 3 mins ago
							</small>
						</Card.Text>
					</Card.Body>
				</Card>
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							This card has supporting text below as a natural
							lead-in to additional content.{' '}
						</Card.Text>
						<Card.Text>
							<small className="text-muted">
								Last updated 3 mins ago
							</small>
						</Card.Text>
					</Card.Body>
				</Card>
			</CardColumns>
		</Fragment>
	) : (
		<div>
			<h1>
				Please login{' '}
				<ul>
					<li>
						<Link to="/login">here!</Link>
					</li>
				</ul>
			</h1>
		</div>
	);
}

export default Home;
