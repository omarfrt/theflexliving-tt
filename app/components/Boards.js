"use client";
import React, { useState, useEffect, createContext  } from 'react';
import styled from 'styled-components';
import Board from './Board';

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

    const handleDrop = (draggedItem, newGroup) => {
        setProperties((prevProperties) =>
            prevProperties.map((item) =>
                item._id === draggedItem.id ? { ...item, group: newGroup } : item
            )
        );
    };

    const handleFilter = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = properties.filter(property =>
            property.propertyName.toLowerCase().includes(searchTerm)
        );
        setFilteredProperties(filtered);
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
    const cleaningsPending = filteredProperties.filter(prop => prop.group === 'Pending');
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
            <Container>
                <Board title="cleaningsRequired" items={cleaningsRequired} onDrop={handleDrop} />
                <Board title="cleaningsPending" items={cleaningsPending} onDrop={handleDrop} />
                <Board title="cleaningsDone" items={cleaningsDone} onDrop={handleDrop} />
            </Container>
        </div>
    );
}

export default Boards;