import React, {Fragment, useState, useEffect} from "react";
import {Link, Redirect, useHistory} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const loginData = {email, password};
      const response = await Axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: loginData.email,
          password: loginData.password
        }
      );
      if (response.status === 200) {
        sessionStorage.setItem("auth-token", response.data);
        sessionStorage.setItem("auth-user", email);
        sessionStorage.setItem("isLoggedIn", true);
        setLoginSuccess(true);
        window.location.replace("/");
      } else {
        setLoginSuccess(false);
        setErrorMessage("There was an error");
      }
    } catch (error) {
      setLoginSuccess(false);
      setErrorMessage(error.response.data);
      console.error(error);
    }
  };

  useEffect(() => {
    if (loginSuccess === true) {
      history.push({
        pathname: "/"
      });
    }
  }, [loginSuccess]);

  return (
    <Fragment>
      <Alert
        style={{
          display: loginSuccess === false ? "block" : "none"
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
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" block>
          Login
        </Button>
        <Form.Text className="text-center" style={{margin: "1rem 0 1rem 0"}}>
          Not registered yet?
        </Form.Text>
        <Button href="/register" block variant="outline-light">
          Create an account
        </Button>
      </Form>
    </Fragment>
  );
}

export default Login;
