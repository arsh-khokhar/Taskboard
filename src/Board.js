import {Fragment, React, useState, useEffect, useRef} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Axios from 'axios';
import './App.css';
import {Button} from 'react-bootstrap';
import {Card} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';

const onDragEnd = (result, columns, setColumns) => {
	if (!result.destination) return;
	const {source, destination} = result;

	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.tasks];
		const destItems = [...destColumn.tasks];
		const [removed] = sourceItems.splice(source.index, 1);
		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				tasks: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				tasks: destItems,
			},
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
				tasks: copiedItems,
			},
		});
	}
};

function Board(props) {
	const boardId = props.location.state.board_id;
	const [columns, setColumns] = useState(null);
	const [board_title, setBoardTitle] = useState(null);
	const [doReload, setReload] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [activeForm, setActiveForm] = useState(null);
	const [newListTitle, setNewListTitle] = useState(null);
	const [newTaskTitle, setNewTaskTitle] = useState(null);
	const [newTaskDesc, setNewTaskDesc] = useState(null);
	const listFormRef = useRef(null);
	const taskFormRef = useRef(null);

	const getBoardContents = async () => {
		try {
			Axios.get('http://localhost:5000/api/boards/' + boardId, {
				headers: {
					'auth-user': sessionStorage.getItem('auth-user'),
					'auth-token': sessionStorage.getItem('auth-token'),
				},
			})
				.then((response) => {
					setBoardTitle(response.data.title);
					setColumns(response.data.lists);
					setLoaded(true);
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		} catch (error) {
			console.error(error);
		}
	};

	const addNewList = async (e) => {
		e.preventDefault();
		setReload(false);
		try {
			Axios.post(
				'http://localhost:5000/api/lists/',
				{board_id: boardId, title: newListTitle},
				{
					headers: {
						'auth-user': sessionStorage.getItem('auth-user'),
						'auth-token': sessionStorage.getItem('auth-token'),
					},
				}
			)
				.then((response) => {
					if (response.status === 200) {
						setActiveForm(false);
						setReload(true);
					}
				})
				.catch((error) => {
					console.error(error);
				});
		} catch (error) {
			console.error(error);
		}
	};

	const addNewTask = async (e) => {
		e.preventDefault();
		setReload(false);
		try {
			Axios.post(
				'http://localhost:5000/api/tasks/',
				{
					title: newTaskTitle,
					description: newTaskDesc,
					list_id: activeForm,
				},
				{
					headers: {
						'auth-user': sessionStorage.getItem('auth-user'),
						'auth-token': sessionStorage.getItem('auth-token'),
					},
				}
			)
				.then((response) => {
					if (response.status === 200) {
						setActiveForm(false);
						setReload(true);
					}
				})
				.catch((error) => {
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
					margin: '1rem',
					marginLeft: '2rem',
					color: 'white',
				}}
			>
				{board_title}
			</h1>
			<div
				style={{
					display: 'flex',
					justifyContent: 'left',
					height: '100%',
					margin: '0.75rem',
				}}
			>
				<DragDropContext
					onDragEnd={(result) =>
						onDragEnd(result, columns, setColumns)
					}
				>
					{Object.entries(columns).map(
						([columnId, column], index) => {
							return (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'left',
									}}
									key={columnId}
								>
									<div style={{margin: 8}}>
										<Droppable
											droppableId={columnId}
											key={columnId}
										>
											{(provided, snapshot) => {
												return (
													<div
														class="list"
														{...provided.droppableProps}
														ref={provided.innerRef}
														style={{
															background:
																snapshot.isDraggingOver
																	? '#444444aa'
																	: '#222222aa',
														}}
													>
														<h5
															style={{
																margin: '0 0 1rem 0.25rem',
																color: 'white',
															}}
														>
															{column.title}
														</h5>
														{column.tasks.map(
															(task, index) => {
																return (
																	<Draggable
																		key={
																			'' +
																			task.task_id
																		}
																		draggableId={
																			'' +
																			task.task_id
																		}
																		index={
																			index
																		}
																	>
																		{(
																			provided,
																			snapshot
																		) => {
																			return (
																				<div
																					className="card"
																					ref={
																						provided.innerRef
																					}
																					{...provided.draggableProps}
																					{...provided.dragHandleProps}
																					style={{
																						userSelect:
																							'none',
																						border: snapshot.isDragging
																							? '#FF0000'
																							: '#FFFFFF',
																						color: 'black',
																						...provided
																							.draggableProps
																							.style,
																					}}
																				>
																					<large>
																						{
																							task.title
																						}
																					</large>
																					<small className="text-muted">
																						{
																							task.description
																						}
																					</small>
																				</div>
																			);
																		}}
																	</Draggable>
																);
															}
														)}
														<Button
															variant="light"
															className={{
																'text-center': true,
																'board-task-button': true,
															}}
															onClick={(e) =>
																setActiveForm(
																	columnId
																)
															}
															style={{
																display:
																	activeForm ===
																	columnId
																		? 'none'
																		: 'block',
															}}
														>
															+ Add another task
														</Button>
														<div
															className="new-task-form"
															style={{
																display:
																	activeForm ===
																	columnId
																		? 'block'
																		: 'none',
															}}
														>
															<Form
																ref={
																	taskFormRef
																}
																onSubmit={
																	addNewTask
																}
															>
																<Form.Group>
																	<Form.Control
																		placeholder="Title"
																		onChange={(
																			e
																		) =>
																			setNewTaskTitle(
																				e
																					.target
																					.value
																			)
																		}
																	/>
																</Form.Group>
																<Form.Group>
																	<Form.Control
																		as="textarea"
																		rows={3}
																		placeholder="Description"
																		onChange={(
																			e
																		) =>
																			setNewTaskDesc(
																				e
																					.target
																					.value
																			)
																		}
																	/>
																</Form.Group>
																<Button
																	variant="light"
																	type="submit"
																>
																	Add Task
																</Button>
																<Button
																	variant="dark"
																	style={{
																		marginLeft:
																			'0.5rem',
																	}}
																	onClick={(
																		e
																	) =>
																		setActiveForm(
																			null
																		)
																	}
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
						}
					)}
				</DragDropContext>
				<Button
					variant="light"
					className={{
						'text-center': true,
						'board-list-button': true,
					}}
					onClick={(e) => setActiveForm('list')}
					style={{
						display: activeForm === 'list' ? 'none' : 'block',
					}}
				>
					+ Add new list
				</Button>
				<div
					className="new-task-form"
					style={{
						display: activeForm === 'list' ? 'block' : 'none',
						width: '20rem',
						margin: '0.5rem',
					}}
				>
					<Form ref={listFormRef} onSubmit={addNewList}>
						<Form.Group>
							<Form.Control
								placeholder="Title"
								onChange={(e) =>
									setNewListTitle(e.target.value)
								}
							/>
						</Form.Group>
						<Button variant="light" type="submit">
							Add List
						</Button>
						<Button
							variant="dark"
							style={{
								marginLeft: '0.5rem',
							}}
							onClick={(e) => clearFormData()}
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
