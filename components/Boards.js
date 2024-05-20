"use client";
import { useState, useEffect, use } from "react";
import Board from "./Board";
import styled from "styled-components";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

//import { DragDropContext } from "react-beautiful-dnd"; deprecated ? 

const Container = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Boards = () => {
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({ propertyName: '', group: 'Full Property List' });
    const [filteredProperties, setFilteredProperties] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/properties')
            .then(response => response.json())
            .then(data => {
                setProperties(data);
                setFilteredProperties(data);
            });
    }, []);

    const onDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        setProperties((properties) => {
            
            const oldIndex = properties.findIndex(item => item._id === active.id);
            const newIndex = properties.findIndex(item => item._id === over.id);

            if (properties[oldIndex].group !== properties[newIndex].group) {
                // Move item to the new group
                properties[oldIndex].group = properties[newIndex].group;
            }

            return arrayMove(properties, oldIndex, newIndex);
        });
    };

    const handleFilter = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilteredProperties(
            properties.filter((prop) => prop.propertyName.toLowerCase().includes(searchTerm))
        );
    };

    const handleNewPropertyChange = (e) => {
        setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
    };

    const handleAddProperty = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProperty),
        }).then(() => {
            const newPropertiesList = [...properties, newProperty];
            setProperties(newPropertiesList);
            setFilteredProperties(newPropertiesList);
            setNewProperty({ propertyName: '', group: 'Full Property List' });
        });
    };

    const cleaningsRequired = filteredProperties.filter(prop => prop.group === 'Exited');
    const cleaningsPending = filteredProperties.filter(prop => prop.group === 'cleaning');
    const cleaningsDone = filteredProperties.filter(prop => prop.group === 'Full Property List');

    return (
        <div>
            <input type="text" placeholder="Filter properties..." onChange={handleFilter} />
            <form onSubmit={handleAddProperty}>
                <input
                    type="text"
                    name="propertyName"
                    value={newProperty.propertyName}
                    onChange={handleNewPropertyChange}
                    placeholder="Property Name"
                />
                <button type="submit">Add Property</button>
            </form>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <Container>
                    <SortableContext items={cleaningsRequired.map(item => item._id)} strategy={verticalListSortingStrategy}>
                        <Board title="Cleanings Required" items={cleaningsRequired} />
                    </SortableContext>
                    <SortableContext items={cleaningsPending.map(item => item._id)} strategy={verticalListSortingStrategy}>
                        <Board title="Cleanings Pending" items={cleaningsPending} />
                    </SortableContext>
                    <SortableContext items={cleaningsDone.map(item => item._id)} strategy={verticalListSortingStrategy}>
                        <Board title="Cleanings Done" items={cleaningsDone} />
                    </SortableContext>
                </Container>
            </DndContext>
        </div>
    );
}

export default Boards;














// const Boards = () => {
//     const [properties, setProperties] = useState([]);
//     const [newProperty, setNewProperty] = useState({ propertyName: '', group: 'Full Property List' });
//     const [filteredProperties, setFilteredProperties] = useState([]);
//     useEffect(() => {
//         fetch('http://localhost:5000/properties')
//           .then((response) => response.json())
//           .then((data) => {
//             setProperties(data);
//             setFilteredProperties(data);
//           });
//       }, []);
//       const onDragEnd = (result) => {};
//       const handleFilter = (event) => {
//         const searchTerm = e.target.value.toLowerCase();
//     setFilteredProperties(
//       properties.filter((prop) => prop.propertyName.toLowerCase().includes(searchTerm))
//     );
//   };
//   const handleNewPropertyChange = (e) => {
//     setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
//   };
//   const handleAddProperty = (e) => {
//     // e.preventDefault();
//     // fetch('http://localhost:5000/properties', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(newProperty),
//     // }).then(() => {
//     //   const newPropertiesList = [...properties, newProperty];
//     //   setProperties(newPropertiesList);
//     //   setFilteredProperties(newPropertiesList);
//     //   setNewProperty({ propertyName: '', group: 'Full Property List' });
//     // });
//   };
//   const cleaningsRequired = filteredProperties.filter(prop => prop.group === 'Exited');
//   const cleaningsPending = filteredProperties.filter(prop => prop.group === 'cleaning');
//   const cleaningsDone = filteredProperties.filter(prop => prop.group === 'Full Property List');
//   return (
//     <div>
//       <input type="text" placeholder="Filter properties..." onChange={handleFilter} />
//       <form onSubmit={handleAddProperty}>
//         <input
//           type="text"
//           name="propertyName"
//           value={properties.propertyName}
//           onChange={handleNewPropertyChange}
//           placeholder="Property Name"
//         />
//         <button type="submit">Add Property</button>
//       </form>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Container>
//           <Board title="Cleanings Required" items={cleaningsRequired} droppableId="cleaningsRequired" />
//           <Board title="Cleanings Pending" items={cleaningsPending} droppableId="cleaningsPending" />
//           <Board title="Cleanings Done" items={cleaningsDone} droppableId="cleaningsDone" />
//         </Container>
//       </DragDropContext>
//     </div>
//   );
// }