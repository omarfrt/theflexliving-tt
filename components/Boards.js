"use client";
import { useState, useEffect} from "react";
import Board from "./Board";
import styled from "styled-components";
import { DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy,sortableKeyboardCoordinates } from '@dnd-kit/sortable';

 

const Container = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Boards = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({ propertyName: '', group: 'Full Property List' });
    const [activeId, setActiveId] = useState();
    useEffect(() => {
        fetch('http://localhost:5000/properties')
          .then((response) => response.json())
          .then((data) => {
             let  setCleaningsRequired = {columnId:"cleanings Required", data:data.filter(prop => prop.group === 'Exited')}
              let setCleaningsPending= {columnId:"cleanings Pending", data:data.filter(prop => prop.group === 'cleaning')}
              let setCleaningsDone= {columnId:"cleanings Done", data:data.filter(prop => prop.group === 'Full Property List')}
              setFilteredProperties([setCleaningsRequired,setCleaningsPending,setCleaningsDone,]);
              setProperties(data)
          });
      }, []);
      const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates
        })
      );
      const onDragEnd = (event) => {}
      // const handleOnDragEnd = (event) => {
      //   const { active, over } = event;
      //   if (active.id !== over.id) {
      //     setFilteredProperties((items) => {
      //       const oldIndex = items.findIndex((item) => item._id === active.id);
      //       const newIndex = items.findIndex((item) => item._id === over.id);
      //       console.log({oldIndex:oldIndex, newindex: newIndex, activeid :active.id, overid:over.id});
      //       console.log({move: arrayMove(items, oldIndex, newIndex)});
      //       return arrayMove(items, oldIndex, newIndex);
      //     });
      //   }
      // };
      const handleOnDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
          setFilteredProperties((columns) => {
            // Find the column that contains the item that was dragged
            const oldColumnIndex = columns.findIndex((column) =>
              column.data.some((item) => item._id === active.id)
            );
            const oldColumn = columns[oldColumnIndex];
      
            // Find the column that the item was dragged over
            const newColumnIndex = columns.findIndex((column) =>
              column.data.some((item) => item._id === over.id)
            );
            const newColumn = columns[newColumnIndex];
      
            // Find the old and new index in the data arrays
            const oldIndex = oldColumn.data.findIndex((item) => item._id === active.id);
            const newIndex = newColumn.data.findIndex((item) => item._id === over.id);
      
            // Create new data arrays with the items in the new order
            const oldData = arrayMove(oldColumn.data, oldIndex, newIndex);
            const newData = arrayMove(newColumn.data, oldIndex, newIndex);
      
            // Create new columns with the new data arrays
            const newOldColumn = { ...oldColumn, data: oldData };
            const newNewColumn = { ...newColumn, data: newData };
      
            // Create a new columns array with the new columns
            const newColumns = [...columns];
            newColumns[oldColumnIndex] = newOldColumn;
            newColumns[newColumnIndex] = newNewColumn;
      
            return newColumns;
          });
        }
      };
  
      const onDragOver = (event) => {
        console.log(event);
      };
      const onDragStart = (event) => {};
      const handleFilter = (event) => {
        const searchTerm = e.target.value.toLowerCase();
    setFilteredProperties(
      properties.filter((prop) => prop.propertyName.toLowerCase().includes(searchTerm))
    );
  };
  const handleNewPropertyChange = (e) => {
  };
  const handleAddProperty = (e) => {
  };
const id= ["cleanings Required", "cleanings Pending", "cleanings Done"]
  return (
    <div>
      <input type="text" placeholder="Filter properties..." onChange={handleFilter} />
      <form onSubmit={handleAddProperty}>
        <input
          type="text"
          name="propertyName"
          value={properties.propertyName}
          onChange={handleNewPropertyChange}
          placeholder="Property Name"
        />
        <button type="submit">Add Property</button>
      </form>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={handleOnDragEnd} onDragOver={onDragOver}>
        <SortableContext items={filteredProperties.map(p=>p.columnId)} strategy={verticalListSortingStrategy}>
        <Container>
           {filteredProperties.map((property) => ( 
            <Board id={property.columnId} title={property.columnId} items={property.data} onDragEnd={handleOnDragEnd} droppableId={property.data.group} />
          ))}
        </Container>
        </SortableContext>
      </DndContext>
    </div>
  );
}
export default Boards;














