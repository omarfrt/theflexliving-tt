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



export const TaskContent = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 0;
    height: 90%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: pre-wrap;
    user-select: none;
`;



function TaskCard({ task,}) {
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
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
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

  return (
    <TaskCardContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $isdragging={isDragging}
    >
      <TaskContent>{task.propertyName}</TaskContent>
    </TaskCardContainer>
  );
}

export default TaskCard;
