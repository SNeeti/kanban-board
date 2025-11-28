const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET all tasks for logged-in user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// CREATE a new task
router.post('/', auth, async (req, res) => {
  const { title, status } = req.body;

  const task = new Task({
    title,
    status: status || 'todo',
    userId: req.userId
  });

  await task.save();
  res.json(task);
});

// UPDATE task
router.put('/:id', auth, async (req, res) => {
  const { title, status } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, status },
    { new: true }
  );

  res.json(task);
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Task deleted' });
});

module.exports = router;
