const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
    try {
        let tasks;

        // Si el usuario es admin, obtener todas las tareas
        if (req.user.role === "admin") {
            tasks = await Task.find().populate({
                path: "owner",
                select: "name email"
            });
        } else {
            // Si es usuario normal, solo obtener sus tareas
            tasks = await Task.find({ owner: req.user.id });
        }

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Obtener una tarea
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `No se encontró tarea con id ${req.params.id}`
            });
        }

        // Verificar si el usuario es propietario de la tarea o es admin
        if (task.owner.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "No autorizado para acceder a esta tarea"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Crear una tarea
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        // Asignar el usuario actual como propietario
        req.body.owner = req.user.id;

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Actualizar una tarea
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `No se encontró tarea con id ${req.params.id}`
            });
        }

        // Verificar si el usuario es propietario de la tarea o es admin
        if (task.owner.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "No autorizado para actualizar esta tarea"
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `No se encontró tarea con id ${req.params.id}`
            });
        }

        // Verificar si el usuario es propietario de la tarea o es admin
        if (task.owner.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "No autorizado para eliminar esta tarea"
            });
        }

        await task.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};