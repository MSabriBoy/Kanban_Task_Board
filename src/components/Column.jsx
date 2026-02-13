import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function Column({ title, tasks, columnKey, deleteTask, moveTask , updateTask}) {
    const{ setNodeRef } = useDroppable({
        id: columnKey,
    })

    return (
        <div ref={setNodeRef} className={`column ${columnKey}`} >

            <h1 className="column-title">{title}</h1>

            <SortableContext
            items={tasks.map((task) => task.id)}
             strategy={verticalListSortingStrategy}
            >
            <div className="task-list">
            {
                tasks.map((task) => (

                   <TaskCard 
                   key= {task.id}
                   task={task}
                   columnKey={columnKey}
                   deleteTask={deleteTask}
                   moveTask={moveTask}
                   updateTask= {updateTask}
                   />

                ))
            }
        </div>
        </SortableContext>
        </div>
    )
}

export default Column