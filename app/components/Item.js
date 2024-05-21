import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { ItemContainer } from './styles';

const ItemType = 'ITEM';

export default function DropTarget({ children }) {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item, monitor) => {
            // Handle the drop event. The dropped item is available as the first argument.

            console.log('Dropped item:', item);
        },
    });

    return (
        <div ref={drop}>
            {children}
        </div>
    );
}