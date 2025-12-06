import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProjectEditForm from './ProjectEditForm';
import TaskList from './TaskList';

function ProjectList({ updateFlag }) {
    const { token } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/projects', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error en fetchProjects:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [token, updateFlag]);

    const handleProjectUpdated = (updatedProject) => {
        setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
        setEditingProject(null);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                fetchProjects();
            }
        } catch (err) {
            console.error('Error en handleDelete:', err);
        }
    };

    if (loading) return <p>Cargando proyectos...</p>;

    return (
        <div className="container my-4">
            {projects.length === 0 ? (
                <p className="text-muted">No tenés proyectos todavía.</p>
            ) : (
                <ul className="list-group">
                    {projects.map((p) => (
                        <li key={p._id} className="list-group-item mb-2">
                            {editingProject && editingProject._id === p._id ? (
                                <ProjectEditForm
                                    project={p}
                                    onProjectUpdated={handleProjectUpdated}
                                    onCancel={() => setEditingProject(null)}
                                />
                            ) : (
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{p.title}</strong> - {p.description}
                                        <TaskList projectId={p._id} />
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => setEditingProject(p)}>Editar</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Eliminar</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
}

export default ProjectList;
