import React from 'react';
import Boards from './components/Boards';
import DndProvider from './providers/DndProvider';

const HomePage = () => {
    return (
        <DndProvider>
            <div>
                <h1>Property Management Dashboard</h1>
                <Boards />
            </div>
        </DndProvider>
    );
};

export default HomePage;