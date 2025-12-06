import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TaskForm = ({ projectId, onTaskCreated }) => {
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.trim() === '') {
            setError('El título no puede quedar vacío');
            return;
        }

        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, project: projectId }),
            });

            const data = await res.json();

            if (res.ok) {
                setTitle('');
                if (onTaskCreated) onTaskCreated(data);
            } else {
                setError(data.message || 'Error al crear la tarea');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex align-items-center mb-3">
            <input
                type="text"
                className="form-control me-2"
                placeholder="Nueva tarea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-success">Agregar</button>
            {error && <p className="mt-2 text-danger">{error}</p>}
        </form>
    );
};

export default TaskForm;
