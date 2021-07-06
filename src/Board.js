import {Fragment, React, useState, useEffect, useRef} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {BiEdit, BiTrash} from "react-icons/bi";
import {FaUserFriends, FaUserCircle} from "react-icons/fa";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Image from "react-bootstrap/Image";
import Axios from "axios";
import "./App.css";
import {Button} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {Card} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

function Board(props) {
  const boardId = props.location.state.board_id;
  const [columns, setColumns] = useState(null);
  const [board_title, setBoardTitle] = useState(null);
  const [collabs, setCollabs] = useState(null);
  const [doReload, setReload] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeForm, setActiveForm] = useState({
    type: null,
    list_id: null,
    task_id: null
  });
  const [newListTitle, setNewListTitle] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState(null);
  const [newTaskDesc, setNewTaskDesc] = useState(null);
  const listFormRef = useRef(null);
  const taskFormRef = useRef(null);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  const syncTaskMove = async () => {
    try {
      const toSend = columns;
      const response = await Axios.post(
        "http://localhost:5000/api/tasks/reorder",
        toSend,
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const {source, destination} = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.tasks];

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedItems
        }
      });
    }
  };

  const getBoardContents = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:5000/api/boards/" + boardId,
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
      if (response.status === 200) {
        setBoardTitle(response.data.title);
        setColumns(response.data.lists);
        setCollabs(response.data.collaborators);
        setLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewTask = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    const tasks = columns[activeForm.list_id].tasks;
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/tasks/",
        {
          title: newTaskTitle,
          description: newTaskDesc,
          list_id: activeForm.list_id,
          num_elems: tasks.length
        },
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
      if (response.status === 200) {
        setActiveForm({
          type: null,
          list_id: null,
          task_id: null
        });
        setReload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/tasks/update",
        {
          task_id: activeForm.task_id,
          title: newTaskTitle,
          description: newTaskDesc
        },
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
      if (response.status === 200) {
        setActiveForm({
          type: null,
          list_id: null,
          task_id: null
        });
        setReload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async toDelete => {
    setReload(false);
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/tasks/delete/",
        {
          task_id: toDelete
        },
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
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

  const addNewList = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/lists/",
        {board_id: boardId, title: newListTitle},
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
      if (response.status === 200) {
        setActiveForm({
          type: null,
          list_id: null,
          task_id: null
        });
        setReload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateList = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/lists/update",
        {
          list_id: activeForm.list_id,
          title: newListTitle
        },
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      );
      if (response.status === 200) {
        setActiveForm({
          type: null,
          list_id: null,
          task_id: null
        });
        setReload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteList = async toDelete => {
    setReload(false);
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/lists/delete/",
        {
          list_id: toDelete
        },
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
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

  useEffect(() => {
    getBoardContents();
    clearFormData();
  }, []);

  useEffect(() => {
    getBoardContents();
  }, [doReload]);

  useEffect(() => {
    syncTaskMove();
  }, [columns]);

  useEffect(() => {
    clearFormData();
  }, [board_title, activeForm]);

  const clearFormData = () => {
    setNewListTitle(null);
    setNewTaskTitle(null);
    setNewTaskDesc(null);
    if (taskFormRef && taskFormRef.current) {
      taskFormRef.current.reset();
    }
    if (listFormRef && listFormRef.current) {
      listFormRef.current.reset();
    }
  };

  return loaded ? (
    <Fragment>
      <div style={{color: "white"}}>
        <h1
          style={{
            margin: "1rem",
            marginLeft: "2rem",
            marginRight: "5rem",
            color: "white",
            display: "inline"
          }}
        >
          {board_title}
        </h1>
        <OverlayTrigger
          placement="right"
          delay={{show: 0, hide: 0}}
          overlay={props => (
            <Tooltip id="button-tooltip" {...props}>
              {sessionStorage.getItem("auth-user")} (You)
            </Tooltip>
          )}
        >
          <Button
            style={{
              marginTop: "-1rem",
              padding: "0rem",
              width: "2rem",
              height: "2rem",
              background: "transparent",
              borderColor: "transparent"
            }}
          >
            <FaUserCircle size="2rem" />
          </Button>
        </OverlayTrigger>
        {collabs.map((collab, index) => {
          return (
            <OverlayTrigger
              placement="right"
              delay={{show: 250, hide: 400}}
              overlay={props => (
                <Tooltip id="button-tooltip" {...props}>
                  {collab.email}
                </Tooltip>
              )}
            >
              <Button
                style={{
                  marginTop: "-1rem",
                  padding: "0rem",
                  width: "2rem",
                  height: "2rem",
                  background: "transparent",
                  borderColor: "transparent"
                }}
              >
                <FaUserCircle size="2rem" />
              </Button>
            </OverlayTrigger>
          );
        })}
      </div>

      <div className="scrolling">
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left"
                }}
                key={columnId}
              >
                <div style={{margin: 8}}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          class="list"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#444444aa"
                              : "#222222aa"
                          }}
                        >
                          <large
                            style={{marginBottom: "1rem", display: "block"}}
                          >
                            <h4
                              style={{
                                color: "white",
                                margin: "0.5rem",
                                display:
                                  activeForm.type === "edit_l" &&
                                  activeForm.list_id === columnId
                                    ? "none"
                                    : "inline"
                              }}
                            >
                              {column.title}
                            </h4>
                            <Button
                              variant="outline-light"
                              onClick={handleModalShow}
                              style={{
                                borderColor: "transparent",
                                color: "gray",
                                width: "1.5rem",
                                height: "1.5rem",
                                padding: "0rem",
                                float: "right",
                                marginBottom: "1rem",
                                display:
                                  activeForm.type === "edit_l" &&
                                  activeForm.list_id === columnId
                                    ? "none"
                                    : "block"
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
                                <Modal.Title>Delete List?</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Deleting list would also delete all of the
                                associated tasks. Are you sure?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleModalClose}
                                >
                                  Go back
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={e => {
                                    deleteList(columnId);
                                    handleModalClose();
                                  }}
                                >
                                  Delete List
                                </Button>
                              </Modal.Footer>
                            </Modal>
                            <Button
                              variant="outline-light"
                              onClick={e =>
                                setActiveForm({
                                  type: "edit_l",
                                  list_id: columnId,
                                  task_id: null
                                })
                              }
                              style={{
                                borderColor: "transparent",
                                color: "gray",
                                width: "1.5rem",
                                height: "1.5rem",
                                padding: "0rem",
                                float: "right",
                                marginBottom: "1rem",
                                display:
                                  activeForm.type === "edit_l" &&
                                  activeForm.list_id === columnId
                                    ? "none"
                                    : "block"
                              }}
                            >
                              <BiEdit size="1.25rem" />
                            </Button>
                            <div
                              className="edit-list-form"
                              style={{
                                display:
                                  activeForm.type === "edit_l" &&
                                  activeForm.list_id === columnId
                                    ? "block"
                                    : "none"
                              }}
                            >
                              <Form ref={listFormRef} onSubmit={updateList}>
                                <Form.Group>
                                  <Form.Control
                                    style={{
                                      fontSize: "large",
                                      background: "transparent",
                                      color: "white"
                                    }}
                                    placeholder={column.title}
                                    onChange={e =>
                                      setNewListTitle(e.target.value)
                                    }
                                  />
                                </Form.Group>
                                <Button variant="outline-info" type="submit">
                                  Update
                                </Button>
                                <Button
                                  variant="outline-light"
                                  style={{
                                    marginLeft: "0.5rem"
                                  }}
                                  onClick={e => {
                                    clearFormData();
                                    setActiveForm({
                                      type: null,
                                      list_id: null,
                                      task_id: null
                                    });
                                  }}
                                  type="reset"
                                >
                                  Discard
                                </Button>
                              </Form>
                            </div>
                          </large>
                          {column.tasks.map((task, index) => {
                            return (
                              <Draggable
                                key={"" + task.task_id}
                                draggableId={"" + task.task_id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      className="card"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        border: snapshot.isDragging
                                          ? "#FF0000"
                                          : "#FFFFFF",
                                        color: "black",
                                        ...provided.draggableProps.style
                                      }}
                                      onMouseEnter={() =>
                                        setHoveredTask(task.task_id)
                                      }
                                      onMouseLeave={() => setHoveredTask(null)}
                                    >
                                      <large>
                                        <h6
                                          style={{
                                            display:
                                              activeForm.task_id ===
                                              task.task_id
                                                ? "none"
                                                : "inline"
                                          }}
                                        >
                                          {task.title}
                                        </h6>
                                        <Button
                                          variant="light"
                                          style={{
                                            color: "tomato",
                                            width: "1.5rem",
                                            height: "1.5rem",
                                            padding: "0rem",
                                            float: "right",
                                            display:
                                              hoveredTask === task.task_id &&
                                              activeForm.task_id != task.task_id
                                                ? "inline"
                                                : "none"
                                          }}
                                          onClick={e =>
                                            deleteTask(task.task_id)
                                          }
                                        >
                                          <BiTrash size="1.25rem" />
                                        </Button>
                                        <Button
                                          variant="light"
                                          onClick={e =>
                                            setActiveForm({
                                              type: "edit_t",
                                              list_id: columnId,
                                              task_id: task.task_id
                                            })
                                          }
                                          style={{
                                            color: "teal",
                                            width: "1.5rem",
                                            height: "1.5rem",
                                            padding: "0rem",
                                            float: "right",
                                            display:
                                              hoveredTask === task.task_id &&
                                              activeForm.task_id != task.task_id
                                                ? "inline"
                                                : "none"
                                          }}
                                        >
                                          <BiEdit size="1.25rem" />
                                        </Button>
                                        <div
                                          className="new-task-form"
                                          style={{
                                            display:
                                              activeForm.task_id ===
                                              task.task_id
                                                ? "block"
                                                : "none"
                                          }}
                                        >
                                          <Form
                                            ref={taskFormRef}
                                            onSubmit={updateTask}
                                          >
                                            <Form.Group>
                                              <Form.Control
                                                placeholder={task.title}
                                                isInvalid={
                                                  newTaskTitle === null ||
                                                  newTaskTitle.trim().length ===
                                                    0
                                                }
                                                onChange={e =>
                                                  setNewTaskTitle(
                                                    e.target.value
                                                  )
                                                }
                                                style={{color: "black"}}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                Task must have a title!
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                              <Form.Control
                                                placeholder={task.description}
                                                onChange={e =>
                                                  setNewTaskDesc(e.target.value)
                                                }
                                                style={{color: "black"}}
                                              />
                                            </Form.Group>
                                            <Button
                                              disabled={
                                                newTaskTitle === null ||
                                                newTaskTitle.trim().length === 0
                                              }
                                              variant="info"
                                              type="submit"
                                            >
                                              Update Task
                                            </Button>
                                            <Button
                                              variant="outline-dark"
                                              style={{
                                                marginLeft: "0.5rem"
                                              }}
                                              onClick={e => {
                                                clearFormData();
                                                setActiveForm({
                                                  type: null,
                                                  list_id: null,
                                                  task_id: null
                                                });
                                              }}
                                              type="reset"
                                            >
                                              Discard
                                            </Button>
                                          </Form>
                                        </div>
                                      </large>
                                      <small
                                        className="text-muted"
                                        style={{
                                          display:
                                            activeForm.task_id === task.task_id
                                              ? "none"
                                              : "block"
                                        }}
                                      >
                                        {task.description}
                                      </small>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          <Button
                            variant="light"
                            className={{
                              "text-center": true,
                              "board-task-button": true
                            }}
                            onClick={e =>
                              setActiveForm({
                                type: "new_t",
                                list_id: columnId,
                                task_id: null
                              })
                            }
                            style={{
                              display:
                                activeForm.type === "new_t" &&
                                activeForm.list_id === columnId
                                  ? "none"
                                  : "block"
                            }}
                          >
                            + Add another task
                          </Button>
                          <div
                            className="new-task-form"
                            style={{
                              display:
                                activeForm.type === "new_t" &&
                                activeForm.list_id === columnId
                                  ? "block"
                                  : "none"
                            }}
                          >
                            <Form ref={taskFormRef} onSubmit={addNewTask}>
                              <Form.Group>
                                <Form.Control
                                  placeholder="Title"
                                  onChange={e =>
                                    setNewTaskTitle(e.target.value)
                                  }
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Control
                                  placeholder="Description"
                                  onChange={e => setNewTaskDesc(e.target.value)}
                                />
                              </Form.Group>
                              <Button variant="light" type="submit">
                                Add Task
                              </Button>
                              <Button
                                variant="dark"
                                style={{
                                  marginLeft: "0.5rem"
                                }}
                                onClick={e => {
                                  clearFormData();
                                  setActiveForm({
                                    type: null,
                                    list_id: null,
                                    task_id: null
                                  });
                                }}
                                type="reset"
                              >
                                Discard
                              </Button>
                            </Form>
                          </div>
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
        <Button
          variant="light"
          className={{
            "text-center": true,
            "board-list-button": true
          }}
          onClick={e =>
            setActiveForm({
              type: "list",
              list_id: null,
              task_id: null
            })
          }
          style={{
            display: activeForm.type === "list" ? "none" : "block"
          }}
        >
          + Add new list
        </Button>
        <div
          className="new-task-form"
          style={{
            display: activeForm.type === "list" ? "block" : "none",
            minWidth: "20rem",
            margin: "0.5rem"
          }}
        >
          <Form ref={listFormRef} onSubmit={addNewList}>
            <Form.Group>
              <Form.Control
                placeholder="Title"
                onChange={e => setNewListTitle(e.target.value)}
              />
            </Form.Group>
            <Button variant="light" type="submit">
              Add List
            </Button>
            <Button
              variant="dark"
              style={{
                marginLeft: "0.5rem"
              }}
              onClick={e => {
                clearFormData();
                setActiveForm({
                  type: null,
                  list_id: null,
                  task_id: null
                });
              }}
              type="reset"
            >
              Discard
            </Button>
          </Form>
        </div>
      </div>
    </Fragment>
  ) : (
    <Fragment>
      <h2>Loading...</h2>
    </Fragment>
  );
}

export default Board;
