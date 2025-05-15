import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
