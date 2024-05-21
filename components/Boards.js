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

//import { DragDropContext } from "react-beautiful-dnd"; deprecated ? 

const Container = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Boards = () => {
    const [properties, setProperties] = useState({});
    const [ cleaningsRequired, setCleaningsRequired ] = useState([]);
    const [ cleaningsPending, setCleaningsPending ] = useState([]);
    const [ cleaningsDone, setCleaningsDone ] = useState([]);
    const [newProperty, setNewProperty] = useState({ propertyName: '', group: 'Full Property List' });
    const [activeId, setActiveId] = useState();
    useEffect(() => {
        fetch('http://localhost:5000/properties')
          .then((response) => response.json())
          .then((data) => {
              setCleaningsRequired(data.filter(prop => prop.group === 'Exited'));
              setCleaningsPending(data.filter(prop => prop.group === 'cleaning'));
              setCleaningsDone(data.filter(prop => prop.group === 'Full Property List'));
              setProperties({cleaningsRequired: cleaningsRequired, cleaningsPending: cleaningsPending, cleaningsDone: cleaningsDone});
          });
      }, []);
      const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates
        })
      );
    
      const onDragEnd = (result) => {};
      const onDragOver = (event) => {};
      const onDragStart = (event) => {};
      const handleFilter = (event) => {
        const searchTerm = e.target.value.toLowerCase();
    setFilteredProperties(
      properties.filter((prop) => prop.propertyName.toLowerCase().includes(searchTerm))
    );
  };
  const handleNewPropertyChange = (e) => {
    // const newProperty = {  [e.target.name]: e.target.value,group: 'Full Property List' };
    // setProperties({ ...properties, ...newProperty});
  };
  const handleAddProperty = (e) => {
    // e.preventDefault();
    // fetch('http://localhost:5000/properties', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newProperty),
    // }).then(() => {
    //   const newPropertiesList = [...properties, newProperty];
    //   setProperties(newPropertiesList);
    //   setFilteredProperties(newPropertiesList);
    //   setNewProperty({ propertyName: '', group: 'Full Property List' });
    // });
  };
//   const cleaningsRequired = filteredProperties.filter(prop => prop.group === 'Exited');
//   const cleaningsPending = filteredProperties.filter(prop => prop.group === 'cleaning');
//   const cleaningsDone = filteredProperties.filter(prop => prop.group === 'Full Property List');
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
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <Container>
          <Board id="container1" title="Cleanings Required" items={cleaningsRequired} setItems={setCleaningsRequired} droppableId="cleaningsRequired" />
          <Board id="container2" title="Cleanings Pending" items={cleaningsPending} setItems={setCleaningsPending} droppableId="cleaningsPending" />
          <Board id="container3" title="Cleanings Done" items={cleaningsDone} setItems={setCleaningsDone} droppableId="cleaningsDone" />
        </Container>
      </DndContext>
    </div>
  );
}
export default Boards;














