import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



function TaskCard({task, columnKey, deleteTask, moveTask, updateTask}){

    
    const [isEditing, setIsEditing]= useState(false);
    const [editedText, setEditedText] = useState(task.text);

const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
} = useSortable({ id: task.id });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};


    function handleSave(){
        updateTask(columnKey, task.id, editedText)
        setIsEditing(false);
    }
     let nextColumn = null;

    if (columnKey === "todo") nextColumn = "progress"
    else if (columnKey === "progress") nextColumn = "done";
return (
  <div
    ref={setNodeRef}
    style={style}
    className={`card ${task.priority.toLowerCase()}`}
  >
    {isEditing ? (
      <input
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        autoFocus
      />
    ) : (
      <span onClick={() => setIsEditing(true)}>
        {task.text}
      </span>
    )}

    <div className={`card ${task.priority.toLowerCase()}`}>
  <span
    {...listeners}
    {...attributes}
    style={{ cursor: "grab" }}
  >
    ⠿
  </span>
      {nextColumn && (
        <button onClick={() => moveTask(columnKey, nextColumn, task.id)}>
          ➡
        </button>
      )}

      <button
        className="delete-btn"
        onClick={() => deleteTask(columnKey, task.id)}
      >
        ❌
      </button>
    </div>
  </div>
);

}

export default TaskCard