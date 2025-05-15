import React, { useState, useRef, useMemo, useCallback } from "react";
import TaskInput from "./components/TaskInput";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import './App.css';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const inputRef = useRef();
  const deadlineRef = useRef();

  const addOrEditTask = useCallback(() => {
    const text = inputRef.current.value.trim();
    const deadline = deadlineRef.current.value;
    if (!text || !deadline) return;

    if (editId) {
      setTasks(prev => prev.map(task =>
        task.id === editId ? { ...task, text, deadline } : task
      ));
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text,
        completed: false,
        deadline,
      };
      setTasks(prev => [newTask, ...prev]);
    }
    inputRef.current.value = "";
    deadlineRef.current.value = "";
  }, [editId]);

  const toggleComplete = useCallback((id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const startEdit = useCallback((task) => {
    setEditId(task.id);
    inputRef.current.value = task.text;
    deadlineRef.current.value = task.deadline;
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    });
  }, [tasks, filter]);

  const sortedTasks = useMemo(() => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    return [...filteredTasks].sort((a, b) => {
      const aDeadline = new Date(a.deadline);
      const bDeadline = new Date(b.deadline);
      const aUrgent = aDeadline >= now && aDeadline <= oneHourLater;
      const bUrgent = bDeadline >= now && bDeadline <= oneHourLater;

      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      return aDeadline - bDeadline;
    });
  }, [filteredTasks]);

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <TaskInput 
        inputRef={inputRef} 
        deadlineRef={deadlineRef} 
        onAddEdit={addOrEditTask} 
        editId={editId} 
      />
      <TaskFilter setFilter={setFilter} />
      <TaskList 
        tasks={sortedTasks} 
        onToggle={toggleComplete} 
        onEdit={startEdit} 
        onDelete={deleteTask} 
      />
    </div>
  );
}
