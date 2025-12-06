import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TaskForm from './TaskForm';
import TaskEditForm from './TaskEditForm';

function TaskList({ projectId }) {
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${projectId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setTasks(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchTasks();
    }, [token, projectId]);

    const handleTaskCreated = (newTask) => setTasks([...tasks, newTask]);
    const handleDeleteTask = async (taskId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) setTasks(tasks.filter(t => t._id !== taskId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        setEditingTask(null);
    };

    if (loading) return <p>Cargando tareas...</p>;

    return (
        <div className="mt-3">
            <h3 className="mb-3">Tareas</h3>

            <TaskForm projectId={projectId} onTaskCreated={handleTaskCreated} />

            {tasks.length === 0 ? (
                <p className="text-muted">No hay tareas para este proyecto.</p>
            ) : (
                <ul className="list-group">
                    {tasks.map(task => (
                        <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center mb-2">
                            {editingTask && editingTask._id === task._id ? (
                                <TaskEditForm
                                    task={task}
                                    onTaskUpdated={handleTaskUpdated}
                                    onCancel={() => setEditingTask(null)}
                                />
                            ) : (
                                <>
                                    <span>{task.title}</span>
                                    <div>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => setEditingTask(task)}>Editar</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task._id)}>Eliminar</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;
