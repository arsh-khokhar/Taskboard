import React, {Fragment, useState, useEffect} from "react";
import {Link, Redirect, useHistory} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import tbConsts from "../constants";

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
      const response = await Axios.post(tbConsts.apiEndPoints.LOGIN, {
        email: loginData.email,
        password: loginData.password
      });
      if (response.status === 200) {
        sessionStorage.setItem(tbConsts.authHeaderKeys.TOKEN, response.data);
        sessionStorage.setItem(tbConsts.authHeaderKeys.USER, email);
        sessionStorage.setItem(tbConsts.authHeaderKeys.LOGIN_BOOL, true);
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

  const loginAsDemo = async () => {
    try {
      const response = await Axios.post(tbConsts.apiEndPoints.LOGIN, {
        email: "test@email.com",
        password: "testing123"
      });
      if (response.status === 200) {
        sessionStorage.setItem(tbConsts.authHeaderKeys.TOKEN, response.data);
        sessionStorage.setItem(tbConsts.authHeaderKeys.USER, "test@email.com");
        sessionStorage.setItem(tbConsts.authHeaderKeys.LOGIN_BOOL, true);
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
    document.body.className = "logoback";
  });

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
        <Button
          href="/register"
          block
          variant="light"
          style={{marginBottom: "1rem"}}
        >
          Create an account
        </Button>
        <Form.Text
          style={{
            margin: "1rem 0 1rem 0",
            display: "inline",
            color: "lightgray"
          }}
        >
          Wanna try Taskboard?
        </Form.Text>
        <Button
          size="sm"
          variant="link"
          style={{
            display: "inline-block",
            color: "lightseagreen"
          }}
          onClick={loginAsDemo}
        >
          Login as demo user automatically
        </Button>
      </Form>
    </Fragment>
  );
}

export default Login;
