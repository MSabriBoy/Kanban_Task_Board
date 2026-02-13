import { useState, useEffect } from "react";
import "./App.css"
import Column from "./components/Column";
import { DndContext, closestCorners } from "@dnd-kit/core";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanbanTasks");
    return saved
      ? JSON.parse(saved)

      : { todo: [], progress: [], done: [] };
  });

  const [input, setInput] = useState("");

  const [priority, setPriority] = useState("Low");

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (input === "") return;

    setTasks({
      ...tasks,
      todo: [...tasks.todo,
      {
        id: Date.now(),
        text: input,
        priority: priority
      }
      ]
    });
    setInput("");
  }

  function deleteTask(column, id) {
    const updatedColumn = tasks[column].filter((task) => task.id !== id)
    setTasks({
      ...tasks,
      [column]: updatedColumn
    });
  }

  function moveTask(from, to, id) {
    const taskToMove = tasks[from].find((task) => task.id === id);
    const updatedFrom = tasks[from].filter((task) => task.id !== id);
    const updatedTo = [...tasks[to], taskToMove]

    setTasks({
      ...tasks,
      [from]: updatedFrom,
      [to]: updatedTo
    })
  }

  function updateTask(column, id, newTask) {
    const updatedColumn = tasks[column].map((tasks) =>
      tasks.id === id ? { ...tasks, text: newTask } : tasks

    );
    setTasks({
      ...tasks,
      [column]: updatedColumn
    })
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColumn = null;
    let targetColumn = null;

    for (const column in tasks) {
      if (tasks[column].some((task) => task.id === activeId)) {
        sourceColumn = column;
      }
    }

    if (tasks[overId]) {
      targetColumn = overId;
    } else {
      for (const column in tasks) {
        if (tasks[column].some((task) => task.id === overId)) {
          targetColumn = column;
        }
      }
    }

    if (!sourceColumn || !targetColumn) return;
    if (sourceColumn === targetColumn) {
      const oldIndex = tasks[sourceColumn].findIndex(task => task.id === activeId);
      const newIndex = tasks[sourceColumn].findIndex(task => task.id === overId);

      const updatedColumn = [...tasks[sourceColumn]];
      const [movedItem] = updatedColumn.splice(oldIndex, 1);
      updatedColumn.splice(newIndex, 0, movedItem);

      setTasks({
        ...tasks,
        [sourceColumn]: updatedColumn
      });

    } else {

      const taskToMove = tasks[sourceColumn].find(task => task.id === activeId);

      const updatedSource = tasks[sourceColumn].filter(task => task.id !== activeId);
      const updatedTarget = [...tasks[targetColumn], taskToMove];

      setTasks({
        ...tasks,
        [sourceColumn]: updatedSource,
        [targetColumn]: updatedTarget
      });
    }
  }

  return (
    <>
      <div className="top-bar">
        <h1 className="logo">Kanban Board</h1>

        <input
          type="search"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

      </div>
      <h1 className="section-heading">Manage Your Workflow</h1>

      <div className="input-area">
        <form
          className="input-area"
          onSubmit={(e) => {
            e.preventDefault()
            addTask()
          }}

        >
          <select value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option> </select>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter Task..." />
          <button onClick={addTask}>Add</button>
        </form>
      </div>
      <hr />
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          <Column
            title="To Do"
            columnKey="todo"
            tasks={tasks.todo.filter((task) =>
              task.text.toLowerCase().includes(search.toLowerCase())
            )}
            deleteTask={deleteTask}
            moveTask={moveTask}
            updateTask={updateTask}
          />
          <Column
            title="In Progress"
            columnKey="progress"
            tasks={tasks.progress.filter((task) =>
              task.text.toLowerCase().includes(search.toLowerCase())
            )}
            deleteTask={deleteTask}
            moveTask={moveTask}
            updateTask={updateTask}
          />
          <Column
            title="Done"
            columnKey="done"
            tasks={tasks.done.filter((task) =>
              task.text.toLowerCase().includes(search.toLowerCase())
            )}
            deleteTask={deleteTask}
            moveTask={moveTask}
            updateTask={updateTask}
          />

        </div>
      </DndContext>
      <footer className="footer">

        &copy; 2026 Kanban Board — All rights reserved.
      </footer>

    </>
  )
}

export default App
