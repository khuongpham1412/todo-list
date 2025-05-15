// import React, { useState, useEffect } from "react";
// import Search from "./components/Search";
// import Filter from "./components/Filter";
// import TodoList from "./components/TodoList";

// const getInitialTodos = () => {
//   const saved = localStorage.getItem("todos");
//   return saved ? JSON.parse(saved) : [];
// };

// const App = () => {
//   const [allTodos, setAllTodos] = useState(getInitialTodos);
//   const [filteredTodos, setFilteredTodos] = useState(getInitialTodos);

//   useEffect(() => {
//     localStorage.setItem("todos", JSON.stringify(allTodos));
//     setFilteredTodos(allTodos);
//   }, [allTodos]);
//   function generateSixDigitNumber() {
//     return Math.floor(Math.random() * 900000) + 100000;
//   }

//   let randomNumber = generateSixDigitNumber();
//   const addTodo = (data) => {
//     const newTodo = {
//       id: randomNumber ,
//       task: data.task,
//       status: "Active",
//     };
//     setAllTodos([...allTodos, newTodo]);
//   };

//   const delTodo = (id) => {
//     const updated = allTodos.filter((todo) => todo.id !== id);
//     setAllTodos(updated);
//   };

//   const updateTodo = (e, id, newTask) => {
//     e.preventDefault();
//     const updated = allTodos.map((todo) =>
//       todo.id === id ? { ...todo, task: newTask } : todo
//     );
//     setAllTodos(updated);
//   };

//   const completeTodo = (e, id) => {
//     const updated = allTodos.map((todo) =>
//       todo.id === id
//         ? { ...todo, status: e.target.checked ? "Completed" : "Active" }
//         : todo
//     );
//     setAllTodos(updated);
//   };

//   const filterTodo = (status) => {
//     if (status === "All") {
//       setFilteredTodos(allTodos);
//     } else {
//       setFilteredTodos(allTodos.filter((todo) => todo.status === status));
//     }
//   };

//   return (
//     <div>
//       <Search addTodo={addTodo} />
//       <Filter filter_todo={filterTodo} />
//       <TodoList
//         todos={filteredTodos}
//         delTodo={delTodo}
//         update_todo={updateTodo}
//         complete_todo={completeTodo}
//       />
//     </div>
//   );
// };

// export default App;


import React, { useState, useRef, useMemo, useCallback } from "react";

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
    <li style={{
      border: "1px solid #ccc",
      padding: "8px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span style={{
          marginLeft: "8px",
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "gray" : "black"
        }}>{task.text}</span>
        <span style={{
          marginLeft: "8px",
          color: isNearDeadline ? "red" : "gray",
          fontWeight: isNearDeadline ? "bold" : "normal"
        }}>
          ({formatDistance(new Date(task.deadline))})
        </span>
      </div>
      <div>
        <button onClick={() => onEdit(task)} style={{ marginRight: "8px" }}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
});

export default function App() {
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
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Todo List</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input type="text" ref={inputRef} placeholder="Enter task..." />
        <input type="datetime-local" ref={deadlineRef} />
        <button onClick={addOrEditTask}>{editId ? "Save" : "Add"}</button>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")} style={{ marginLeft: "8px" }}>Active</button>
        <button onClick={() => setFilter("completed")} style={{ marginLeft: "8px" }}>Completed</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sortedTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleComplete}
            onEdit={startEdit}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
}
