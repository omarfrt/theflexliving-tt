"use client";
import { useMemo, useState, useEffect } from "react";
import ColumnContainer from "./ColumnsContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import styled from "styled-components";

const BoardContainer = styled.div`
  margin: auto;
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  
`;

const ColumnsWrapper = styled.div`
  margin: auto;
  display: flex;
  gap: 1rem;
`;

const InnerWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const Wrapper= styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    justify-content: center;
    padding-top: 50px;
`;


const SearchBar= styled.input`
    width: 20%;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 16px;
    outline: none;
    margin-bottom: 20px;
`;
const defaultCols = [
  {
    id: "Exited",
    title: "Cleaning is Required",
  },
  {
    id: "Pending",
    title: "Cleaning Pending",
  },
  {
    id: "Full Property List",
    title: "Cleaning Done",
  },
];



function KanbanBoard() {
    const [search, setSearch] = useState('');
  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/properties')
    .then(response => response.json())
    .then((data) => { 
        setTasks(data)
});
}, []);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const handleSearch = (e) => {
     setSearch(e.target.value);
  };

  return (<Wrapper>
  <SearchBar type="text" placeholder="Search..." onChange={handleSearch} />
    <BoardContainer>
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <ColumnsWrapper>
        <InnerWrapper>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                // tasks={tasks.filter((task) => task.group === col.id)}
                //this way we can filter inside the full property obj in the state rather than the api
                tasks={tasks.filter((task) => task.group === col.id && (!search || JSON.stringify(task).toLowerCase().includes(search.toLowerCase())))}
              />
            ))}
          </SortableContext>
        </InnerWrapper>
      </ColumnsWrapper>

      <DragOverlay>
        {activeColumn && (
          <ColumnContainer
            column={activeColumn}
            createTask={createTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            tasks={tasks.filter((task) => task.group === activeColumn.id)}
          />
        )}
        {activeTask && (
          <TaskCard
            task={activeTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        )}
      </DragOverlay>
    </DndContext>
  </BoardContainer>
  </Wrapper>
        
  );
 
  function createTask(group) {
    const newTask= {
      id: generateId(),
      group: group,
      address: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].group != tasks[overIndex].group) {
          // Fix introduced after video recording
          tasks[activeIndex].group = tasks[overIndex].group;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].group = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
