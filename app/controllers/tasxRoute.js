// routes.js

const express = require('express');
const router = express.Router();
const taskController = require('./taskController');

// Create Task
router.post('/tasks', taskController.createTask);

// Get All Tasks
router.get('/tasks', taskController.getAllTasks);


// Sort Tasks
router.get('/tasks/sort', taskController.sortTasks);

// Update Task
router.put('/tasks/:taskId', taskController.updateTask);

// Mark Task as Completed
router.patch('/tasks/:taskId/complete', taskController.completeTask);

// Delete Task
router.delete('/tasks/:taskId', taskController.deleteTask);

module.exports = router;
