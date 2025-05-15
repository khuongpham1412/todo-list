import React from "react";

export default function TaskInput({ inputRef, deadlineRef, onAddEdit, editId }) {
  return (
    <div className="task-input">
      <input type="text" ref={inputRef} placeholder="Enter task..." />
      <input type="datetime-local" ref={deadlineRef} />
      <button style={{padding: 8}} onClick={onAddEdit}>{editId ? "Save" : "Add"}</button>
    </div>
  );
}
