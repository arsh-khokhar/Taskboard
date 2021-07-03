import {Fragment, React, useState, useEffect} from 'react';
import Axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {Card, CardColumns} from 'react-bootstrap';

function Home() {
	const [auth_user, setAuthUser] = useState(false);
	const [user_boards, setUserBoards] = useState(null);

	const getBoards = async () => {
		try {
			Axios.get('http://localhost:5000/api/boards/', {
				headers: {
					'auth-user': sessionStorage.getItem('auth-user'),
					'auth-token': sessionStorage.getItem('auth-token'),
				},
			})
				.then((response) => {
					console.log('Here I am');
					setUserBoards(response.data);
					//console.log(response.data);
					//console.log(response.status);
					if (response.status === 200) {
						//console.log('setting auth user true');
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
		// console.log('this thing called');
		getBoards();
	}, []);

	useEffect(() => {
		console.log(auth_user);
	}, [auth_user]);

	useEffect(() => {
		console.log(user_boards);
	}, [user_boards]);

	return auth_user ? (
		<Fragment>
			<CardColumns>
				{user_boards.map((item, index) => {
					return (
						<Link
							to={{
								pathname: '/board',
								state: {board_id: item.board_id},
							}}
							key={index}
						>
							<Card className="text-center">
								<Card.Body>
									<Card.Title>{item.title}</Card.Title>
									<Card.Text>
										<small className="text-muted">
											Owner: {item.owner_id}
										</small>
									</Card.Text>
								</Card.Body>
							</Card>
						</Link>
					);
				})}
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
