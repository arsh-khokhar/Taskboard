import React from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

function Navigation() {
	return (
		<Navbar expand="lg" variant="dark" className="navbar">
			<Navbar.Brand href="/">Taskboard</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="/">Home</Nav.Link>
					<Nav.Link href="/login">Login</Nav.Link>
					<Nav.Link href="/register">Register</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default Navigation;
