import {Fragment, React, useState, useEffect, useRef} from "react";
import Axios from "axios";
import {Link, Redirect, useHistory} from "react-router-dom";
import {CardDeck} from "react-bootstrap";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Home() {
  const [newBoardName, setNewBoardName] = useState(null);
  const [doReload, setReload] = useState(false);
  const [auth_user, setAuthUser] = useState(null);
  const [user_boards, setUserBoards] = useState(null);
  const [activeForm, setActiveForm] = useState(false);
  const formRef = useRef(null);
  const history = useHistory();

  const getBoards = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/api/boards/", {
        headers: {
          "auth-user": sessionStorage.getItem("auth-user"),
          "auth-token": sessionStorage.getItem("auth-token")
        }
      });
      setUserBoards(response.data);
      if (response.status === 200) {
        setAuthUser(true);
      } else {
        setAuthUser(false);
      }
    } catch (error) {
      console.error(error);
      setAuthUser(false);
    }
  };

  const addNewBoard = async e => {
    e.preventDefault();
    setReload(false);
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/boards/",
        {title: newBoardName},
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
      if (response.status === 200) {
        setActiveForm(false);
        setReload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBoards();
    if (formRef && formRef.current) {
      formRef.current.reset();
    }
  }, []);

  useEffect(() => {
    getBoards();
    if (formRef && formRef.current) {
      formRef.current.reset();
    }
  }, [doReload]);

  useEffect(() => {
    if (auth_user === false) {
      history.push({
        pathname: "/Login"
      });
    }
  }, [auth_user, user_boards]);

  if (auth_user === true) {
    return (
      <Fragment>
        <CardDeck style={{margin: "1rem"}}>
          {user_boards.map((item, index) => {
            return (
              <Link
                to={{
                  pathname: "/board",
                  state: {board_id: item.board_id}
                }}
                key={index}
                style={{textDecoration: "none"}}
              >
                <Button
                  variant="light"
                  className={{
                    "text-center": true,
                    "board-card": true
                  }}
                >
                  <h4>{item.title}</h4>
                  <small className="text-muted">Owner: {item.owner_id}</small>
                </Button>
              </Link>
            );
          })}
          <Button
            variant="light"
            className={{
              "text-center": true,
              "board-card": true
            }}
            onClick={e => setActiveForm(true)}
            style={{
              opacity: "65%",
              display: activeForm ? "none" : "block"
            }}
          >
            + Add a new board
          </Button>
          <div
            className="board-card"
            style={{
              display: activeForm ? "block" : "none",
              padding: "1rem",
              borderRadius: "0.25rem"
            }}
          >
            <Form ref={formRef} onSubmit={addNewBoard}>
              <Form.Group>
                <Form.Control
                  placeholder="Title"
                  onChange={e => setNewBoardName(e.target.value)}
                />
              </Form.Group>
              <Button variant="light" type="submit">
                Add Board
              </Button>
              <Button
                variant="dark"
                style={{
                  marginLeft: "0.5rem"
                }}
                onClick={e => {
                  setActiveForm(false);
                  formRef.current.reset();
                  setNewBoardName("");
                }}
              >
                Discard
              </Button>
            </Form>
          </div>
        </CardDeck>
      </Fragment>
    );
  } else if (auth_user === false) {
    return <Redirect to="/login" />;
  } else {
    return <p>Loading...</p>;
  }
}

export default Home;
