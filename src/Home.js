import {React, useState, useEffect} from 'react';

function Home() {
	const [auth_user, setAuthUser] = useState(null);

	const getBoards = async (e) => {
		e.preventDefault();
		try {
			Axios.get('http://localhost:5000/api/boards/')
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

	useEffect(() => {});
	return (
		<div>
			<h1> Welcome to the homepage </h1>
		</div>
	);
}

export default Home;
