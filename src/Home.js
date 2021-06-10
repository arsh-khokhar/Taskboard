import {React, useState, useEffect} from 'react';
import Axios from 'axios';
import {Link, Redirect} from 'react-router-dom';

function Home() {
	const [auth_user, setAuthUser] = useState(false);

	const getBoards = async () => {
		try {
			Axios.get('http://localhost:5000/api/boards/', {
				headers: {
					'auth-token': sessionStorage.getItem('auth-token'),
				},
			})
				.then((response) => {
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
		<div>
			<h1> Welcome Authenticated user </h1>
		</div>
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
