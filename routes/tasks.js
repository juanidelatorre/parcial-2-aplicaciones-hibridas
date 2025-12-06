const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task'); 

router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error al traer tareas' });
    }
});


router.get('/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;

    try {
        const tasks = await Task.find({ user: req.user.id, project: projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error al traer tareas' });
    }
});


router.post('/', authMiddleware, async (req, res) => {
    const { title, project } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Título y proyecto son obligatorios' });

    try {
        const newTask = new Task({
            title,
            project,
            user: req.user.id,
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear tarea' });
    }
});


router.put('/:id', authMiddleware, async (req, res) => {
    const { title } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

        if (task.user.toString() !== req.user.id)
            return res.status(401).json({ message: 'No autorizado' });

        task.title = title || task.title;

        const updatedTask = await task.save();
        res.json(updatedTask);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar tarea' });
    }
});



router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

        if (task.user.toString() !== req.user.id)
            return res.status(401).json({ message: 'No autorizado' });

        await task.deleteOne();
        res.json({ message: 'Tarea eliminada' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar tarea' });
    }
});


module.exports = router;
