import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TaskEditForm = ({ task, onTaskUpdated, onCancel }) => {
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState(task.title || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.trim() === '') {
            setError('El título no puede quedar vacío');
            return;
        }

        setError('');

        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
            });

            const data = await res.json();

            if (res.ok) {
                if (onTaskUpdated) onTaskUpdated(data); 
            } else {
                setError(data.message || 'Error al actualizar tarea');
            }
        } catch (err) {
            setError('Error de conexión');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Actualizar Tarea</button>
            {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
        </form>
    );
};

export default TaskEditForm;
