const express = require('express');

const {
  createTask,
  deleteTask,
  getTaskById,
  getTaskStats,
  getTasks,
  updateTask
} = require('../controllers/taskController');
const protect = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validate');
const {
  createTaskValidation,
  taskIdValidation,
  taskQueryValidation,
  updateTaskValidation
} = require('../validators/taskValidator');

const router = express.Router();

router.use(protect);

router.get('/stats', getTaskStats);

router
  .route('/')
  .get(taskQueryValidation, handleValidationErrors, getTasks)
  .post(createTaskValidation, handleValidationErrors, createTask);

router
  .route('/:id')
  .get(taskIdValidation, handleValidationErrors, getTaskById)
  .patch(updateTaskValidation, handleValidationErrors, updateTask)
  .delete(taskIdValidation, handleValidationErrors, deleteTask);

module.exports = router;
