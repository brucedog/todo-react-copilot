import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => {
        setTodos(response.data);
        console.log(response.data);
  })
      .catch(error => console.error(error));
  }, []);

  const addTodo = () => {
    axios.post('http://localhost:5000/todos', { text: newTodo, date: newDate, time: newTime })
      .then(response => setTodos([...todos, response.data]))
      .catch(error => console.error(error));
    setNewTodo('');
    setNewDate('');
    setNewTime('');
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo App</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="time"
          className="form-control"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTodo}>Add Todo</button>
      </div>
      <ul className="list-group">
        {todos.map(todo => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{todo.text}</strong><br />
              <small>{todo.date} {todo.time}</small>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;