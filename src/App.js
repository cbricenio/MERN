import React, { useState } from "react";
import "./App.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");

  const handleAddTodo = () => {
    if (!newTodo) return;
    setTodos([
      ...todos,
      { id: new Date().getTime(), task: newTodo, checked: false },
    ]);
    setNewTodo("");
  };
  console.log("todos", todos);
  console.log("newtodo", newTodo);

  const checkedTodosCount = todos.filter((t) => t.checked).length;
  const onCheckedChanged = (id, checked) => {
    setTodos((todos) =>
      todos.map((t) => (t.id === id ? { ...t, checked } : t))
    );
  };
  console.log("count", checkedTodosCount);
  console.log("display", selectedOption);

  const handleDropDownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="form">
      <h1 className="todoTitle">Todo List</h1>

      <div className="addTodo">
        {/* Input field for todos */}
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        {/* Add to do button */}
        <button className="btn" onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>

      <div className="clearAndSelect">
        {/* Clear all todos button */}
        <button
          className="btn"
          onClick={() => {
            setTodos([]);
          }}
        >
          Clear Todos
        </button>

        {/* Checked/Done Todos counter */}
        <p>Checked Todos Count: {checkedTodosCount}</p>

        {/* Select option for filtering done, pending and all task */}
        <select
          value={selectedOption}
          onChange={handleDropDownChange}
          className="selectView"
        >
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="todoList">
        <ul>
          {(selectedOption === "pending"
            ? todos.filter((t) => t.checked !== true)
            : selectedOption === "done"
            ? todos.filter((t) => t.checked === true)
            : todos
          ).map((todo) => (
            <li key={todo.id}>
              {/* Checkbox for done task */}
              <input
                className="listCheckbox"
                type="checkbox"
                checked={todo.checked}
                onChange={(e) => {
                  onCheckedChanged(todo.id, !todo.checked);
                }}
              />
              {todo.task}

              {/* task delete button */}
              <button
                className="deleteBtn"
                onClick={() => {
                  setTodos((todos) => todos.filter((t) => t.id !== todo.id));
                }}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
