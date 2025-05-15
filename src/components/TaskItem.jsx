import React, { useMemo, useCallback } from "react";

const TaskItem = React.memo(({ task, onToggle, onEdit, onDelete }) => {
  const isNearDeadline = useMemo(() => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    return deadline >= now && deadline <= oneHourLater;
  }, [task.deadline]);

  const formatDistance = useCallback((date) => {
    const now = new Date();
    const diff = Math.floor((date - now) / 60000);
    if (diff <= 0) return "Hết hạn";
    if (diff < 60) return `${diff} phút nữa`;
    return `${Math.floor(diff / 60)} giờ nữa`;
  }, []);

  return (
    <li className={`task-item ${isNearDeadline ? "urgent" : ""}`}>
      <div>
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => onToggle(task.id)} 
        />
        <span className={`task-text ${task.completed ? "completed" : ""}`}>
          {task.text}
        </span>
        <span className={`task-deadline ${isNearDeadline ? "urgent-text" : ""}`}>
          ({formatDistance(new Date(task.deadline))})
        </span>
      </div>
      <div>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
});

export default TaskItem;
