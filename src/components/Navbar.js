import React from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import tbConsts from "../constants";

function Navigation() {
  const history = useHistory();

  const signout = () => {
    sessionStorage.setItem(tbConsts.authHeaderKeys.TOKEN, null);
    sessionStorage.setItem(tbConsts.authHeaderKeys.USER, null);
    sessionStorage.setItem(tbConsts.authHeaderKeys.LOGIN_BOOL, null);
    window.location.replace("/");
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar">
      <Navbar.Brand href="/">
        <img
          src="/logo512.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          style={{marginRight: "0.5rem", marginTop: "0.2rem"}}
        />
        Taskboard
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link
            onClick={signout}
            style={{
              display:
                sessionStorage.getItem(tbConsts.authHeaderKeys.LOGIN_BOOL) ===
                "true"
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
                sessionStorage.getItem(tbConsts.authHeaderKeys.LOGIN_BOOL) ===
                "true"
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
                sessionStorage.getItem(tbConsts.authHeaderKeys.LOGIN_BOOL) ===
                "true"
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
