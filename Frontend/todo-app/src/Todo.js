import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Todo() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/todos')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const todo = { title, description, completed };
        axios.post('http://localhost:8000/todos', todo)
            .then(response => {
                setTodos([...todos, response.data]);
                setTitle('');
                setDescription('');
                setCompleted(false);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleUpdate = (todo) => {
        axios.put(`http://localhost:8000/todos/${todo.id}`, todo)
            .then(response => {
                setTodos(todos.map((t) => t.id === todo.id ? response.data : t));
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDelete = (todoId) => {
        axios.delete(`http://localhost:8000/todos/${todoId}`)
            .then(response => {
                setTodos(todos.filter((todo) => todo.id !== todoId));
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Todo List</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
                <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
                <input type="checkbox" checked={completed} onChange={(event) => setCompleted(event.target.checked)} />
                <button type="submit">Create Todo</button>
            </form>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input type="checkbox" checked={todo.completed} onChange={(event) => handleUpdate({ ...todo, completed: event.target.checked })} />
                        <span>{todo.title}</span>
                        <span>{todo.description}</span>
                        <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;