"use client";
//BUGGED !!!

import React, { useState, useEffect, use } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Container from "./container";
import { Item } from "./sortable_item";

const wrapperStyle = {
  display: "flex",
  flexDirection: "row",
 
};

const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  }
};


//bug to fix - can't drag into empty container
export default function Dnd() {
    const [items, setItems] = useState({root: [], container1: [], container2: []});
    useEffect(() => {
        fetch('http://localhost:5000/properties')
        .then(response => response.json())
        .then((data) => { 
            const setCleaningsRequired = data.filter(prop => prop.group === 'Exited')
            const setCleaningsDone = data.filter(prop => prop.group === 'Full Property List')
            setItems({
                root: setCleaningsRequired,
                container1: [{
                    "_id": "662328543345cda786692dfdd",
                    "address": "13 Nettleden Avenue Wembley HA96DP",
                    "rentalCost": {
                      "April:2024": "585.714"
                    },
                    "propertyName": "0B HA R - 6 Nettleden Avenue",
                    "tag": "0B HA R",
                    "contractStartDate": "2023-05-15",
                    "contractEndDate": "2024-04-05",
                    "directCost": {
                      "April:2024": "655.190"
                    },
                    "group": "Pending",
                    "city": "London",
                    "fixedCost": 7.142857142857143,
                    "__v": 0,
                    "id": "60000f3",
                  },],
                container2: setCleaningsDone,
              });
    });
    }, []);

//   const [activeId, setActiveId] = useState();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <div style={wrapperStyle}>
      <DndContext
        announcements={defaultAnnouncements}
        sensors={sensors}
        collisionDetection={closestCorners}
        // onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
       
        <Container id="root" items={items.root} />
        <Container id="container1" items={items.container1} />
        <Container id="container2" items={items.container2} />
        {/* <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay> */}
      </DndContext>
    </div>
  );

  function findContainer(id) {
    if (id in items) {
        
      return id;
    }
    
    return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
  }

  function handleDragStart(event) {
    const { active } = event;
    const { _id } = active;

    setActiveId(_id);
  }

  function handleDragOver(event) {
    const { active, over  } = event;
    const { id } = active;
    const { id: overId } = over;
    console.log(active, over);
    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
console.log(activeContainer, overContainer);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = items[activeContainer].findIndex(obj => obj.id === active.id);
      const overIndex = items[overContainer].findIndex(obj => obj.id === overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 


        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id)
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
  }



  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;
   
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
       
      return;
    }
    
    const activeIndex = items[activeContainer].findIndex(obj => obj.id === active.id);
    const overIndex = items[overContainer].findIndex(obj => obj.id === overId);
    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
     
    }
    

    // setActiveId(null);
  }
}
