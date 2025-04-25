import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";

const getInitialTodos = () => {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
};

const App = () => {
  const [allTodos, setAllTodos] = useState(getInitialTodos);
  const [filteredTodos, setFilteredTodos] = useState(getInitialTodos);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(allTodos));
    setFilteredTodos(allTodos);
  }, [allTodos]);
  function generateSixDigitNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
  }

  let randomNumber = generateSixDigitNumber();
  const addTodo = (data) => {
    const newTodo = {
      id: randomNumber ,
      task: data.task,
      status: "Active",
    };
    setAllTodos([...allTodos, newTodo]);
  };

  const delTodo = (id) => {
    const updated = allTodos.filter((todo) => todo.id !== id);
    setAllTodos(updated);
  };

  const updateTodo = (e, id, newTask) => {
    e.preventDefault();
    const updated = allTodos.map((todo) =>
      todo.id === id ? { ...todo, task: newTask } : todo
    );
    setAllTodos(updated);
  };

  const completeTodo = (e, id) => {
    const updated = allTodos.map((todo) =>
      todo.id === id
        ? { ...todo, status: e.target.checked ? "Completed" : "Active" }
        : todo
    );
    setAllTodos(updated);
  };

  const filterTodo = (status) => {
    if (status === "All") {
      setFilteredTodos(allTodos);
    } else {
      setFilteredTodos(allTodos.filter((todo) => todo.status === status));
    }
  };

  return (
    <div>
      <Search addTodo={addTodo} />
      <Filter filter_todo={filterTodo} />
      <TodoList
        todos={filteredTodos}
        delTodo={delTodo}
        update_todo={updateTodo}
        complete_todo={completeTodo}
      />
    </div>
  );
};

export default App;
