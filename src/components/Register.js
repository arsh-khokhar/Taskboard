import React, {Fragment, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import tbConsts from "../constants";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const registerData = {email, password};
      const response = await Axios.post(tbConsts.apiEndPoints.REGISTER, {
        email: registerData.email,
        password: registerData.password
      });
      setRegisterSuccess(response.status === 200);
    } catch (error) {
      console.error(error);
      setRegisterSuccess(false);
      setErrorMessage(error.response.data);
    }
  };

  useEffect(() => {
    if (registerSuccess === true) {
      history.push({
        pathname: "/Login"
      });
    }
  }, [registerSuccess]);

  return (
    <Fragment>
      <Alert
        style={{
          visibility: registerSuccess === false ? "visible" : "hidden"
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
        <Button variant="success" type="submit" block>
          Create account
        </Button>
      </Form>
    </Fragment>
  );
}

export default Register;
