import {Fragment, React, useState, useEffect, useRef} from "react";
import Axios from "axios";
import {Link, Redirect, useHistory} from "react-router-dom";
import {CardDeck} from "react-bootstrap";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {BiTrash} from "react-icons/bi";
import Modal from "react-bootstrap/Modal";
import tbConsts from "../constants";

function Home() {
  const [newBoardName, setNewBoardName] = useState(null);
  const [doReload, setReload] = useState(false);
  const [auth_user, setAuthUser] = useState(null);
  const [user_boards, setUserBoards] = useState(null);
  const [activeForm, setActiveForm] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

  const handleModalClose = () => {
    setModalShow(false);
    setBoardToDelete(null);
  };

  const handleModalShow = board_id => {
    setModalShow(true);
    setBoardToDelete(board_id);
  };

  const formRef = useRef(null);
  const history = useHistory();

  const getBoards = async () => {
    try {
      const response = await Axios.get(tbConsts.apiEndPoints.BOARDS, {
        headers: {
          [tbConsts.authHeaderKeys.USER]: sessionStorage.getItem(
            tbConsts.authHeaderKeys.USER
          ),
          [tbConsts.authHeaderKeys.TOKEN]: sessionStorage.getItem(
            tbConsts.authHeaderKeys.TOKEN
          )
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

  const deleteBoard = async toDelete => {
    if (!toDelete) return;
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.BOARD_DELETE + `/${toDelete}`,
        {},
        {
          headers: {
            [tbConsts.authHeaderKeys.USER]: sessionStorage.getItem(
              tbConsts.authHeaderKeys.USER
            ),
            [tbConsts.authHeaderKeys.TOKEN]: sessionStorage.getItem(
              tbConsts.authHeaderKeys.TOKEN
            )
          }
        }
      );
      if (response.status === 200) {
        setReload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewBoard = async e => {
    e.preventDefault();
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.BOARDS,
        {title: newBoardName},
        {
          headers: {
            [tbConsts.authHeaderKeys.USER]: sessionStorage.getItem(
              tbConsts.authHeaderKeys.USER
            ),
            [tbConsts.authHeaderKeys.TOKEN]: sessionStorage.getItem(
              tbConsts.authHeaderKeys.TOKEN
            )
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
        pathname: "/login"
      });
    }
  }, [auth_user, user_boards]);

  if (auth_user === true) {
    return (
      <Fragment>
        <h4 class="text-center" style={{color: "white"}}>
          Welcome, {sessionStorage.getItem(tbConsts.authHeaderKeys.USER)}!
        </h4>
        <CardDeck style={{margin: "1rem"}}>
          {user_boards.map((item, index) => {
            return (
              <div>
                <Link
                  to={{
                    pathname: "/board/" + item.board_id
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
                <Button
                  variant="light"
                  onClick={e => handleModalShow(item.board_id)}
                  className={{
                    "text-center": true,
                    "board-delete-button": true
                  }}
                  style={{
                    borderColor: "transparent",
                    color: "tomato"
                  }}
                >
                  <BiTrash size="1.25rem" />
                </Button>
                <Modal
                  show={modalShow}
                  onHide={handleModalClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header>
                    <Modal.Title>Delete Board?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Deleting a board would also delete all of the associated
                    tasks and lists. Are you sure?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                      Go back
                    </Button>
                    <Button
                      variant="danger"
                      onClick={e => {
                        deleteBoard(boardToDelete);
                        handleModalClose();
                      }}
                    >
                      Delete Board
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
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
