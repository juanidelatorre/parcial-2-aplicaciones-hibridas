import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProjectForm = ({ onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === '') {
      setError('El título no puede quedar vacío');
      return;
    }

    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setTitle('');
        setDescription('');
        if (onProjectCreated) onProjectCreated(data);
      } else {
        setError(data.message || 'Error al crear proyecto');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Título:</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción:</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-danger mb-3">{error}</p>}
      <button type="submit" className="btn btn-primary w-100">Crear Proyecto</button>
    </form>
  );
};

export default ProjectForm;
