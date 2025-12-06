import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProjectEditForm = ({ project, onProjectUpdated, onCancel }) => {
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (title.trim() === '') {
            setError('El título no puede quedar vacío');
            return;
        }

        setError('');

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await res.json();

            if (res.ok) {
                if (onProjectUpdated) onProjectUpdated(data);
            } else {
                setError(data.message || 'Error al actualizar proyecto');
            }
        } catch (err) {
            setError('Error de conexión');
            console.error(err);
        }


    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Título:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div>
                <label>Descripción:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <button type="submit">Actualizar Proyecto</button>
            {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}

        </form>
    );
};

export default ProjectEditForm;
