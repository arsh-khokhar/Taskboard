import {Fragment, React, useState, useEffect, useRef} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {BiEdit} from "react-icons/bi";
import Axios from "axios";
import "./App.css";
import {Button} from "react-bootstrap";
import {Card} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Board(props) {
  const boardId = props.location.state.board_id;
  const [columns, setColumns] = useState(null);
  const [board_title, setBoardTitle] = useState(null);
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
  const [movedTask, setMovedTask] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);

  const syncTaskMove = async () => {
    console.log("Syncing...");
    setReload(false);
    try {
      const toSend = columns;
      Axios.post("http://localhost:5000/api/tasks/reorder", toSend, {
        headers: {
          "auth-user": sessionStorage.getItem("auth-user"),
          "auth-token": sessionStorage.getItem("auth-token")
        }
      })
        .then(response => {
          console.log(response.data);
          if (response.status === 200) {
            setReload(true);
          }
        })
        .catch(error => {
          console.error(error);
        });
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
      setMovedTask(removed);
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
      setMovedTask(removed);
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
      Axios.get("http://localhost:5000/api/boards/" + boardId, {
        headers: {
          "auth-user": sessionStorage.getItem("auth-user"),
          "auth-token": sessionStorage.getItem("auth-token")
        }
      })
        .then(response => {
          setBoardTitle(response.data.title);
          setColumns(response.data.lists);
          setLoaded(true);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addNewList = async e => {
    e.preventDefault();
    setReload(false);
    try {
      Axios.post(
        "http://localhost:5000/api/lists/",
        {board_id: boardId, title: newListTitle},
        {
          headers: {
            "auth-user": sessionStorage.getItem("auth-user"),
            "auth-token": sessionStorage.getItem("auth-token")
          }
        }
      )
        .then(response => {
          if (response.status === 200) {
            setActiveForm({
              type: null,
              list_id: null,
              task_id: null
            });
            setReload(true);
          }
        })
        .catch(error => {
          console.error(error);
        });
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
      Axios.post(
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
      )
        .then(response => {
          if (response.status === 200) {
            setActiveForm({
              type: null,
              list_id: null,
              task_id: null
            });
            setReload(true);
          }
        })
        .catch(error => {
          console.error(error);
        });
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
    clearFormData();
  }, [doReload]);

  useEffect(() => {
    syncTaskMove();
  }, [movedTask]);

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
      <h1
        style={{
          margin: "1rem",
          marginLeft: "2rem",
          color: "white"
        }}
      >
        {board_title}
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          height: "100%",
          margin: "0.75rem"
        }}
      >
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
                          <h5
                            style={{
                              margin: "0 0 1rem 0.25rem",
                              color: "white"
                            }}
                          >
                            {column.title}
                          </h5>
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
                                                : "block"
                                          }}
                                        >
                                          {task.title}
                                        </h6>
                                        <Button
                                          variant="dark"
                                          className={{
                                            "text-center": true
                                          }}
                                          onClick={e =>
                                            setActiveForm({
                                              type: "edit_t",
                                              list_id: columnId,
                                              task_id: task.task_id
                                            })
                                          }
                                          style={{
                                            float: "right",
                                            height: "1rem",
                                            background: "#00000000",
                                            border: "#00000000",
                                            marginTop: "-2rem",
                                            color: "gray",
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
                                            onSubmit={addNewTask}
                                          >
                                            <Form.Group>
                                              <Form.Control
                                                placeholder="Title"
                                                value={task.title}
                                                onChange={e =>
                                                  setNewTaskTitle(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Form.Group>
                                            <Form.Group>
                                              <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Description"
                                                value={task.description}
                                                onChange={e =>
                                                  setNewTaskDesc(e.target.value)
                                                }
                                              />
                                            </Form.Group>
                                            <Button
                                              variant="light"
                                              type="submit"
                                            >
                                              Update Task
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
                                  as="textarea"
                                  rows={3}
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
            width: "20rem",
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
