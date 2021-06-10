import {React, useState, useEffect} from 'react';
import Axios from 'axios';

function Home() {
	const [auth_user, setAuthUser] = useState(null);

	const getBoards = () => {
		try {
			Axios.get('http://localhost:5000/api/boards/', {
				headers: {
					'auth-token': sessionStorage.getItem('auth-token'),
				},
			})
				.then((response) => {
					console.log('Response received');
					console.log(response.status);
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getBoards();
	});
	return (
		<div>
			<h1> Welcome to the homepage </h1>
		</div>
	);
}

export default Home;
