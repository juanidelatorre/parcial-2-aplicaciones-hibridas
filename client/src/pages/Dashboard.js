import React, { useState } from 'react';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';

function Dashboard() {
    const [updateFlag, setUpdateFlag] = useState(false);

    const handleProjectCreated = () => {
        setUpdateFlag(!updateFlag);
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center">Dashboard</h1>

            <div className="mb-5">
                <h2 className="mb-3">Crear Proyecto</h2>
                <div className="card p-4 shadow-sm">
                    <ProjectForm onProjectCreated={handleProjectCreated} />
                </div>
            </div>

            <div>
                <h2 className="mb-3">Mis Proyectos</h2>
                <ProjectList updateFlag={updateFlag} />
            </div>
        </div>
    );
}

export default Dashboard;
