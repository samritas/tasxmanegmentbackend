const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Connection = require("../config/connection");

const JWT_SECRET = "your_jwt_secret_key";

// Create Task
exports.createTask = async (req, res) => {
  const { userId, title, description, deadline, priority } = req.body;

  try {
    const connection = Connection.pool; // Access the pool property of Connection object

    const createTaskQuery = `
            INSERT INTO tasks (userId, title, description, deadline, priority)
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await connection.execute(createTaskQuery, [
      userId,
      title,
      description,
      deadline,
      priority,
    ]);

    // connection.release();

    res
      .status(201)
      .json({ message: "Task created successfully", taskId: result.insertId });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const connection = Connection.pool; // Access the pool property of Connection object
    // const pool = await Connection.acquire();
    // const connection = await pool.getConnection();

    const getAllTasksQuery = `
            SELECT * FROM tasks
        `;
    const [tasks] = await connection.execute(getAllTasksQuery);

    // connection.release();

    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Sort Tasks
exports.sortTasks = async (req, res) => {
    const { sortBy } = req.query;

    try {
        const connection = await Connection.pool.getConnection();

        let query = `
            SELECT * FROM tasks
        `;

        if (sortBy === 'priority') {
            query += ` ORDER BY priority`;
        } else if (sortBy === 'deadline') {
            query += ` ORDER BY deadline`;
        }

        const [tasks] = await connection.execute(query);

        connection.release();

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error sorting tasks:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Update Task Details
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, priority } = req.body;
  // Check if taskId is provided
  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  try {
    const connection = Connection.pool;
    const query = `
            UPDATE tasks 
            SET title = ?, description = ?, deadline = ?, priority = ?
            WHERE id = ?
        `;

    await connection.execute(query, [
      title,
      description,
      deadline,
      priority,
      taskId,
    ]);
    // connection.release();

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark Task as Completed
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const connection = Connection.pool;
    const query = `
            UPDATE tasks 
            SET completed = true 
            WHERE id = ?
        `;

    await connection.execute(query, [taskId]);
    // connection.release();

    res.status(200).json({ message: "Task marked as completed" });
  } catch (err) {
    console.error("Error marking task as completed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const connection = Connection.pool;

    const query = `
            DELETE FROM tasks 
            WHERE id = ?
        `;

    await connection.execute(query, [taskId]);
    // connection.release();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
