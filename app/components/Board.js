import React from 'react';
import { useDrop } from 'react-dnd';
import { ListContainer, ListTitle, ListContent } from './styles';
import Item from './Item';

const ItemType = 'ITEM';

export default function Board({ title, items, onDrop }) {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (draggedItem) => onDrop(draggedItem, title),
    });

    return (
        <ListContainer ref={drop}>
            <ListTitle>{title}</ListTitle>
            <ListContent>
                {items.map((item) => (
                    <Item key={item._id} item={item} />
                ))}
            </ListContent>
        </ListContainer>
    );
}