import React, {useState, useRef, useEffect} from 'react';

function DragNDrop({data}) {
  const [list, setList] = useState (data);
  const [dragging, setDragging] = useState (false);

  useEffect (
    () => {
      setList (data);
    },
    [setList, data]
  );

  const dragItem = useRef ();
  const dragItemNode = useRef ();

  const handletDragStart = (e, item) => {
    console.log ('Starting to drag', item);

    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener ('dragend', handleDragEnd);
    dragItem.current = item;

    setTimeout (() => {
      setDragging (true);
    }, 0);
  };
  const handleDragEnter = (e, targetItem) => {
    console.log ('Entering a drag target', targetItem);
    if (dragItemNode.current !== e.target) {
      console.log ('Target is NOT the same as dragged item');
      setList (oldList => {
        let newList = JSON.parse (JSON.stringify (oldList));
        newList[targetItem.groupI].items.splice (
          targetItem.itemI,
          0,
          newList[dragItem.current.groupI].items.splice (
            dragItem.current.itemI,
            1
          )[0]
        );
        dragItem.current = targetItem;
        localStorage.setItem ('List', JSON.stringify (newList));
        return newList;
      });
    }
  };
  const handleDragEnd = e => {
    setDragging (false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener ('dragend', handleDragEnd);
    dragItemNode.current = null;
  };
  const getStyles = item => {
    if (
      dragItem.current.groupI === item.groupI &&
      dragItem.current.itemI === item.itemI
    ) {
      return 'dnd-item current';
    }
    return 'dnd-item';
  };

  if (list) {
    return (
      <div className="dnd">
        {list.map ((group, groupI) => (
          <div
            key={group.title}
            onDragEnter={
              dragging && !group.items.length
                ? e => handleDragEnter (e, {groupI, itemI: 0})
                : null
            }
            className="dnd-group"
          >
            <p>{group.title}</p>
            {group.items.map ((item, itemI) => (
              <div
                draggable
                key={item}
                onDragStart={e => handletDragStart (e, {groupI, itemI})}
                onDragEnter={
                  dragging
                    ? e => {
                        handleDragEnter (e, {groupI, itemI});
                      }
                    : null
                }
                className={dragging ? getStyles ({groupI, itemI}) : 'dnd-item'}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default DragNDrop;
