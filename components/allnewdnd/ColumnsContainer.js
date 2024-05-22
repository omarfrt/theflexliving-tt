"use client";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import styled from "styled-components";

const ColumnContainerDiv = styled.div`
  background-color: #161C22; /* columnBackgroundColor */
  width: 350px;
  height: 500px;
  max-height: 500px;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s, transform 0.2s;
  opacity: ${(props) => (props.$isdragging ? 0.4 : 1)};
  border: ${(props) => (props.$isdragging ? '2px solid #F87171' : 'none')};
`;

const ColumnHeader = styled.div`
  background-color: #0D1117; /* mainBackgroundColor */
  font-size: 1rem;
  height: 60px;
  cursor: grab;
  border-radius: 0.375rem 0.375rem 0 0;
  padding: 0.75rem;
  font-weight: bold;
  border: 4px solid #161C22; /* columnBackgroundColor */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TaskCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #161C22; /* columnBackgroundColor */
  padding: 0.5rem;
  font-size: 0.875rem;
  border-radius: 9999px;
`;

const TaskList = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
`;



function ColumnContainer({
  column,
  tasks,
  deleteTask,
  updateTask,
}) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <ColumnContainerDiv ref={setNodeRef} style={style} $isdragging={isDragging} />;
  }

  return (
    <ColumnContainerDiv ref={setNodeRef} style={style} $isdragging={isDragging}>
      <ColumnHeader {...attributes} {...listeners} onClick={() => setEditMode(true)}>
        <div style={{display: "flex", flexDirection:"row", gap:"50px", justifyContent:"center", alignItems:"center"}}>
          <TaskCounter>{tasks.length}</TaskCounter>
          {!editMode && column.title}
        </div>
      </ColumnHeader>

      <TaskList>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </TaskList>

    </ColumnContainerDiv>
  );
}

export default ColumnContainer;