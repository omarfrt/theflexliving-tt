"use client";
import styled from "styled-components";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Item from "./Item";
export const ListContainer = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;

export const ListTitle = styled.h3`
  padding: 8px;
`;

export const ListContent = styled.div`
  padding: 8px;
  background-color: white;
  flex-grow: 1;
  min-height: 100px;
`;
export default function Board({ title, items,setItems }) {
  
    const onDragEnd = (event) => {
        const { active, over } = event;
        if(active.id === over.id) {
            return
        }
        setItems((items) => {
            const oldIndex = items.findIndex((item) => item._id === active.id);
            const newIndex = items.findIndex((item) => item._id === over.id);
           
            return arrayMove(items, oldIndex, newIndex);
        });
    };
    return (
        <ListContainer>
            <ListTitle>{title}</ListTitle>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>

                <SortableContext items={items.map(item => item._id)} strategy={verticalListSortingStrategy}>
                    <ListContent>
                        {items.map(item => (
                            <Item key={item._id} item={item} />
                        ))}
                    </ListContent>
                </SortableContext>
            </DndContext>
        </ListContainer>
    );
}