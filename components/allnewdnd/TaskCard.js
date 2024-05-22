"use client"
import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";

const TaskCardContainer = styled.div`
  background-color: #0D1117; /* mainBackgroundColor */
  padding: 2.5px;
  height: 100px;
  min-height: 100px;
  display: flex;
  align-items: center;
  text-align: left;
  border-radius: 1rem;
  cursor: grab;
  position: relative;
  opacity: ${(props) => (props.$isdragging ? 0.3 : 1)};
  border: ${(props) => (props.$isdragging ? '2px solid #F87171' : 'none')};
  transition: opacity 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${(props) => (!props.$isdragging ? 'inset 0 0 0 2px #F87171' : 'none')};
  }
`;

// const TaskTextarea = styled.textarea`
//   height: 90%;
//   width: 100%;
//   resize: none;
//   border: none;
//   border-radius: 0.25rem;
//   background: transparent;
//   color: white;
//   outline: none;
// `;

const TaskContent = styled.p`
  margin: auto 0;
  height: 90%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
  user-select: none;
`;

// const DeleteButton = styled.button`
//   stroke: white;
//   position: absolute;
//   right: 16px;
//   top: 50%;
//   transform: translateY(-50%);
//   background-color: #161C22; /* columnBackgroundColor */
//   padding: 2px;
//   border-radius: 0.25rem;
//   opacity: 0.6;
//   &:hover {
//     opacity: 1;
//   }
// `;

function TaskCard({ task, deleteTask, updateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <TaskCardContainer
        ref={setNodeRef}
        style={style}
        $isdragging={isDragging}
      />
    );
  }
//this is for editing the task, uncomment if you need it
//   if (editMode) {
//     return (
//       <TaskCardContainer
//         ref={setNodeRef}
//         style={style}
//         {...attributes}
//         {...listeners}
//         $isdragging={isDragging}
//       >
//         <TaskTextarea
//           value={task.address}
//           autoFocus
//           placeholder="Task content here"
//           onBlur={toggleEditMode}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && e.shiftKey) {
//               toggleEditMode();
//             }
//           }}
//           onChange={(e) => updateTask(task.id, e.target.value)}
//         />
        
//       </TaskCardContainer>
//     );
//   }

  return (
    <TaskCardContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      $isdragging={isDragging}
    >
      <TaskContent>{task.address}</TaskContent>

      {/* this is the delete button, uncomment if you need it */} 
      {/* {mouseIsOver && (
        <DeleteButton
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <TrashIcon />
        </DeleteButton>
      )} */} 
    </TaskCardContainer>
  );
}

export default TaskCard;
