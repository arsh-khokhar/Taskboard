import React from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {useHistory} from "react-router-dom";

function Navigation() {
  const history = useHistory();

  const signout = () => {
    sessionStorage.setItem("auth-token", null);
    sessionStorage.setItem("auth-user", null);
    sessionStorage.setItem("isLoggedIn", null);
    window.location.replace("/");
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar">
      <Navbar.Brand href="/">Taskboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link
            onClick={signout}
            style={{
              display:
                sessionStorage.getItem("isLoggedIn") === "true"
                  ? "inline"
                  : "none"
            }}
          >
            Sign out
          </Nav.Link>
          <Nav.Link
            href="/login"
            style={{
              display:
                sessionStorage.getItem("isLoggedIn") === "true"
                  ? "none"
                  : "inline"
            }}
          >
            Login
          </Nav.Link>
          <Nav.Link
            href="/register"
            style={{
              display:
                sessionStorage.getItem("isLoggedIn") === "true"
                  ? "none"
                  : "inline"
            }}
          >
            Register
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
