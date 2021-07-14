import {Fragment, React, useState, useEffect, useRef} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {BiEdit, BiTrash} from "react-icons/bi";
import {FaUserFriends, FaUserCircle} from "react-icons/fa";
import {HiChevronDoubleUp, HiOutlineX} from "react-icons/hi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Image from "react-bootstrap/Image";
import Axios from "axios";
import "../App.css";
import {Button} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {Card} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import "react-bootstrap-typeahead/css/Typeahead.css";
import {Typeahead} from "react-bootstrap-typeahead";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import tbConsts from "../constants";

function Board(props) {
  const boardId = props.match.params.board_id;
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

  const priorityColors = {
    critical: "orangered",
    high: "darkorange",
    moderate: "dodgerblue",
    low: "limegreen"
  };
  const [newBoardTitle, setNewBoardTitle] = useState(null);
  const [newListTitle, setNewListTitle] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState(null);
  const [newTaskDesc, setNewTaskDesc] = useState(null);
  const [user, setUser] = useState(
    sessionStorage.getItem(tbConsts.authHeaderKeys.USER)
  );
  const listFormRef = useRef(null);
  const taskFormRef = useRef(null);
  const collabTypeAheadRef = useRef();
  const [hoveredTask, setHoveredTask] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [taskModalShow, setTaskModalShow] = useState(false);
  const [boardOwner, setBoardOwner] = useState(null);
  const [activeEditTask, setActiveEditTask] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [newCollab, setNewCollab] = useState(null);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);
  const handleTaskModalClose = () => setTaskModalShow(false);
  const handleTaskModalShow = () => setTaskModalShow(true);

  const CollabAvatar = params => {
    return (
      <OverlayTrigger
        placement="right"
        delay={{show: 0, hide: 0}}
        overlay={props => (
          <Tooltip id="button-tooltip" {...props}>
            {params.user + (params.isActiveUser ? " (You)" : "")}
          </Tooltip>
        )}
      >
        <div style={{display: "inline-block"}}>
          <Button
            disabled
            style={{
              display: "inline",
              marginTop: "-4rem",
              marginRight: "0.25rem",
              padding: "0rem",
              width: "2.5rem",
              height: "2.5rem",
              background: "transparent",
              borderColor: "transparent"
            }}
          >
            <div>
              <Image
                style={{
                  background: "black",
                  width: "2.5rem",
                  height: "2.5rem",
                  padding: "0.25rem",
                  radius: "2.5rem"
                }}
                className="border"
                src={`https://avatars.dicebear.com/api/identicon/${params.seed}.svg`}
                roundedCircle
              />
              <HiChevronDoubleUp
                size="1.5rem"
                style={{
                  margin: "0 0 -1rem -1.25rem",
                  color: "white",
                  visibility: params.isOwner ? "visible" : "hidden"
                }}
              />
            </div>
          </Button>
          <Button
            variant="light"
            style={{
              marginTop: "-2.5rem",
              marginLeft: "2rem",
              display: "flex",
              padding: "0rem",
              width: "1rem",
              height: "1rem",
              borderRadius: "1rem",
              opacity: "99%",
              visibility: params.isOwner
                ? "hidden"
                : boardOwner === user
                ? "visible"
                : "hidden"
            }}
            onClick={e => removeCollab(params.user)}
          >
            <HiOutlineX
              size="1rem"
              style={{
                color: "gray"
              }}
            />
          </Button>
        </div>
      </OverlayTrigger>
    );
  };

  const AssigneeAvatar = params => {
    return (
      <OverlayTrigger
        placement="right"
        delay={{show: 0, hide: 0}}
        overlay={props => (
          <Tooltip id="button-tooltip" {...props}>
            {params.user + (params.isActiveUser ? " (You)" : "")}
          </Tooltip>
        )}
      >
        <div style={{display: "inline-block"}}>
          <Button
            disabled
            style={{
              display: "inline",
              marginTop: "-1rem",
              marginRight: "0.25rem",
              padding: "0rem",
              width: params.size,
              height: params.size,
              background: "transparent",
              borderColor: "transparent"
            }}
          >
            <div>
              <Image
                style={{
                  background: "black",
                  width: params.size,
                  height: params.size,
                  padding: "0.25rem",
                  radius: "2.5rem"
                }}
                className="border"
                src={`https://avatars.dicebear.com/api/identicon/${params.seed}.svg`}
                roundedCircle
              />
            </div>
          </Button>
        </div>
      </OverlayTrigger>
    );
  };

  const EditTaskForm = params => {
    const [editTitle, setEditTitle] = useState(params.task.title);
    const [editDesc, setEditDesc] = useState(params.task.description);
    const [editPriority, setEditPriority] = useState(null);
    const [newAssignees, setNewAssignees] = useState([]);
    const [existingAssignees, setExistingAssignees] = useState(
      params.task.assignees
    );
    const [removedAssignees, setRemovedAssignees] = useState([]);
    const ref = useRef();
    const options = [boardOwner].concat(collabs.map(collab => collab.email));
    const assignees = existingAssignees.map(assignee => assignee.user_id);
    useEffect(() => {}, [newAssignees]);
    useEffect(() => {}, [existingAssignees]);

    const difference = options.filter(x => !assignees.includes(x));

    return (
      <Form
        onSubmit={e => {
          updateTaskTwo(
            e,
            editTitle,
            editDesc,
            newAssignees,
            removedAssignees,
            editPriority
          );
        }}
      >
        <Form.Group>
          <Form.Label> New Title </Form.Label>
          <Form.Control
            defaultValue={params.task.title}
            placeholder="Title"
            onChange={e => setEditTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>New Description</Form.Label>
          <Form.Control
            defaultValue={params.task.description}
            placeholder="Description"
            onChange={e => setEditDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group style={{marginTop: "2rem"}}>
          <div
            style={{marginTop: "0rem", marginBottom: "1rem", display: "flex"}}
          >
            <Form.Label
              style={{
                marginTop: "-0.5rem",
                marginRight: "0.5rem",
                display: "inline"
              }}
            >
              Assignees:
            </Form.Label>
            {existingAssignees.map((assignee, index, array) => {
              return (
                <div>
                  <AssigneeAvatar
                    user={assignee.user_id}
                    seed={assignee.user_id}
                    size={"2.5rem"}
                  />
                  <Button
                    variant="light"
                    style={{
                      marginTop: "-2.5rem",
                      marginLeft: "2rem",
                      display: "flex",
                      padding: "0rem",
                      width: "1rem",
                      height: "1rem",
                      borderRadius: "1rem",
                      opacity: "99%"
                    }}
                    onClick={e => {
                      array = array.filter(
                        elem => elem.user_id != assignee.user_id
                      );
                      setRemovedAssignees(
                        removedAssignees.concat([assignee.user_id])
                      );
                      setExistingAssignees(array);
                    }}
                  >
                    <HiOutlineX
                      size="1rem"
                      style={{
                        color: "gray",
                        opacity: "99%"
                      }}
                    />
                  </Button>
                </div>
              );
            })}
          </div>
          <Typeahead
            className="typeahead"
            align="left"
            id="typeahead"
            multiple
            options={difference}
            placeholder="Add an assignee"
            ref={ref}
            selected={newAssignees}
            onChange={setNewAssignees}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label> Priority: </Form.Label>
          <Form.Control
            as="select"
            onChange={e => setEditPriority(e.target.value)}
          >
            <option>None</option>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
            <option>Critical</option>
          </Form.Control>
        </Form.Group>
        <Button variant="info" style={{marginRight: "0.5rem"}} type="submit">
          Update Task
        </Button>
        <Button
          variant="secondary"
          type="reset"
          onClick={e => {
            clearFormData();
            setActiveForm({
              type: null,
              list_id: null,
              task_id: null
            });
            handleTaskModalClose();
          }}
        >
          Go back
        </Button>
      </Form>
    );
  };

  const TaskEditModal = params => {
    return (
      <Fragment>
        <Modal
          show={taskModalShow && params.task.task_id === activeEditTask}
          onHide={handleTaskModalClose}
        >
          <Modal.Header>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditTaskForm task={params.task} />
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  };

  const syncTaskMove = async () => {
    try {
      const toSend = columns;
      const response = await Axios.post(
        tbConsts.apiEndPoints.TASK_REORDER,
        toSend,
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
        tbConsts.apiEndPoints.BOARDS + "/" + boardId,
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
        setBoardTitle(response.data.title);
        setColumns(response.data.lists);
        setCollabs(response.data.collaborators);
        setAllUsers(response.data.all_users);
        setBoardOwner(response.data.owner_id);
        setLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addCollaborator = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    if (newCollab === null || newCollab === "None") {
      setActiveForm({
        type: null,
        list_id: null,
        task_id: null
      });
      return;
    }
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.BOARDS +
          `/${boardId}` +
          tbConsts.apiEndPoints.ADD_COLLAB,
        {
          user_id: newCollab
        },
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

  const removeCollab = async toRemove => {
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.BOARDS +
          `/${boardId}` +
          tbConsts.apiEndPoints.REMOVE_COLLAB,
        {
          user_id: toRemove
        },
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

  const updateBoard = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.BOARDS +
          `/${boardId}` +
          tbConsts.apiEndPoints.UPDATE,
        {
          board_title: newBoardTitle
        },
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

  const addNewTask = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    const tasks = columns[activeForm.list_id].tasks;
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.TASKS,
        {
          title: newTaskTitle,
          description: newTaskDesc,
          list_id: activeForm.list_id,
          num_elems: tasks.length
        },
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

  const updateTaskTwo = async (
    e,
    title,
    desc,
    new_assignees,
    removed_assignees,
    new_priority
  ) => {
    e.target.reset();
    var toSend = {
      task_id: activeEditTask,
      title: title,
      description: desc,
      assignees: new_assignees,
      removed_assignees: removed_assignees,
      board_id: boardId
    };
    toSend["priority"] = new_priority === "None" ? null : new_priority;
    e.preventDefault();
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.TASK_UPDATE,
        toSend,
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
    setTaskModalShow(false);
  };

  const deleteTask = async toDelete => {
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.TASK_DELETE,
        {
          task_id: toDelete
        },
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

  const addNewList = async e => {
    e.preventDefault();
    e.target.reset();
    setReload(false);
    try {
      const response = await Axios.post(
        tbConsts.apiEndPoints.LISTS,
        {board_id: boardId, title: newListTitle},
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
        tbConsts.apiEndPoints.LIST_UPDATE,
        {
          list_id: activeForm.list_id,
          title: newListTitle
        },
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
        tbConsts.apiEndPoints.LIST_DELETE,
        {
          list_id: toDelete
        },
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
            marginRight: "0rem",
            color: "white",
            display: activeForm.type === "edit_b" ? "none" : "inline"
          }}
        >
          {board_title}
        </h1>
        <Button
          variant="outline-light"
          onClick={e =>
            setActiveForm({
              type: "edit_b",
              list_id: null,
              task_id: null
            })
          }
          style={{
            borderColor: "transparent",
            color: "lightgray",
            width: "2rem",
            height: "2rem",
            padding: "0rem",
            marginTop: "-1.5rem",
            marginRight: "5rem",
            display: activeForm.type === "edit_b" ? "none" : "inline"
          }}
        >
          <BiEdit size="1.5rem" />
        </Button>
        <div
          style={{
            display: activeForm.type === "edit_b" ? "inline-block" : "none",
            background: "#222222aa",
            padding: "0.5rem",
            marginLeft: "1rem",
            borderRadius: "0.5rem"
          }}
        >
          <Form ref={listFormRef} onSubmit={updateBoard} inline>
            <Form.Group>
              <Form.Control
                style={{
                  background: "transparent",
                  color: "white"
                }}
                placeholder={board_title}
                onChange={e => setNewBoardTitle(e.target.value)}
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
        <div className="collabs">
          <CollabAvatar
            user={boardOwner}
            isOwner={true}
            isActiveUser={boardOwner === user}
            seed={boardOwner}
          />
          {collabs.map((collab, index) => {
            return (
              <CollabAvatar
                user={collab.email}
                isOwner={false}
                isActiveUser={collab.email === user}
                seed={collab.email}
              />
            );
          })}

          <Button
            variant="outline-secondary"
            style={{
              background: "#222222aa",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "2.5rem",
              marginTop: "-1.5rem",
              display: activeForm.type === "collab" ? "none" : "inline-block"
            }}
            onClick={e => {
              clearFormData();
              setActiveForm({
                type: "collab",
                list_id: null,
                task_id: null
              });
            }}
          >
            +
          </Button>
          <div
            style={{
              display: activeForm.type === "collab" ? "inline-block" : "none",
              background: "#222222aa",
              padding: "0.5rem",
              marginTop: "-1.5rem",
              marginLeft: "1rem",
              float: "right",
              borderRadius: "0.5rem"
            }}
          >
            <Form onSubmit={addCollaborator} inline>
              <Form.Group>
                <Form.Control
                  as="select"
                  style={{
                    background: "lightgray",
                    color: "black",
                    marginRight: "0.5rem"
                  }}
                  onChange={e => setNewCollab(e.target.value)}
                >
                  <option> None </option>
                  {allUsers.map((user, index) => {
                    return (
                      <option
                        disabled={
                          collabs.some(e => e.email === user.email) ||
                          user.email === boardOwner
                        }
                      >
                        {user.email}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>

              <Button variant="outline-info" type="submit">
                Add Collaborator
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
        </div>
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
                                      <div
                                        style={{
                                          marginBottom: "0.2rem",
                                          opacity: "75%",
                                          display:
                                            task.priority === null
                                              ? "none"
                                              : "block",
                                          background: "transparent",
                                          width: "5rem",
                                          height: "0.5rem",
                                          borderRadius: "0.5rem",
                                          background:
                                            priorityColors[task.priority]
                                        }}
                                      />
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
                                          onClick={e => {
                                            setActiveEditTask(task.task_id);
                                            handleTaskModalShow();
                                          }}
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
                                        <TaskEditModal task={task} />
                                      </large>
                                      <small
                                        className="text-muted"
                                        style={{
                                          display:
                                            activeForm.task_id === task.task_id
                                              ? "none"
                                              : "flex"
                                        }}
                                      >
                                        {task.description}
                                      </small>
                                      <div className="assignees">
                                        {task.assignees.map(
                                          (assignee, index) => {
                                            return (
                                              <AssigneeAvatar
                                                user={assignee.user_id}
                                                seed={assignee.user_id}
                                                size={"1.75rem"}
                                              />
                                            );
                                          }
                                        )}
                                      </div>
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
