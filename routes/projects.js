const Project = require('../models/Project');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error al traer proyectos' });
    }
});


router.post('/', authMiddleware, async (req, res) => {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: 'El título es obligatorio' });

    try {
        const newProject = new Project({
            title,
            description,
            user: req.user.id,
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear proyecto' });
    }
});


router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title) return res.status(400).json({ message: 'El título es obligatorio' });

  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    project.title = title;
    project.description = description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar proyecto' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para borrar este proyecto' });
    }

    await project.deleteOne();

    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar proyecto' });
  }
});





module.exports = router;
