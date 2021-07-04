import {Fragment, React, useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Axios from 'axios';

const itemsFromBackend = [
	{task_id: 1, title: 'First task', description: null},
	{task_id: 2, title: 'Second task', description: null},
	{task_id: 3, title: 'Third task', description: null},
	{task_id: 4, title: 'Fourth task', description: null},
	{task_id: 5, title: 'Fifth task', description: null},
];

const columnsFromBackend = {
	1: {
		title: 'Requested',
		tasks: itemsFromBackend,
	},
	2: {
		title: 'To do',
		tasks: [],
	},
	3: {
		title: 'In Progress',
		tasks: [],
	},
	4: {
		title: 'Done',
		tasks: [],
	},
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
	const board_id = props.location.state.board_id;
	const [columns, setColumns] = useState(columnsFromBackend);
	const [board_title, setBoardTitle] = useState(null);
	const [loaded, setLoaded] = useState(false);

	const getBoardContents = async () => {
		try {
			Axios.get('http://localhost:5000/api/boards/' + board_id, {
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

	useEffect(() => {
		getBoardContents();
	}, []);

	useEffect(() => {}, [board_title]);

	return loaded ? (
		<Fragment>
			<h1>{board_title}</h1>
			<div
				style={{
					margin: 10,
					display: 'flex',
					justifyContent: 'left',
					height: '100%',
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
										alignItems: 'center',
									}}
									key={columnId}
								>
									<h2>{column.title}</h2>
									<div style={{margin: 8}}>
										<Droppable
											droppableId={columnId}
											key={columnId}
										>
											{(provided, snapshot) => {
												return (
													<div
														{...provided.droppableProps}
														ref={provided.innerRef}
														style={{
															background:
																snapshot.isDraggingOver
																	? 'lightblue'
																	: 'lightgrey',
															padding: 4,
															width: 250,
															minHeight: 500,
														}}
													>
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
																					ref={
																						provided.innerRef
																					}
																					{...provided.draggableProps}
																					{...provided.dragHandleProps}
																					style={{
																						userSelect:
																							'none',
																						padding: 16,
																						margin: '0 0 8px 0',
																						minHeight:
																							'50px',
																						backgroundColor:
																							snapshot.isDragging
																								? '#263B4A'
																								: '#456C86',
																						color: 'white',
																						...provided
																							.draggableProps
																							.style,
																					}}
																				>
																					{
																						task.title
																					}
																				</div>
																			);
																		}}
																	</Draggable>
																);
															}
														)}
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
			</div>
		</Fragment>
	) : (
		<Fragment>
			<h2>Loading...</h2>
		</Fragment>
	);
}

export default Board;
