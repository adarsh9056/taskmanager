const { body, param, query } = require('express-validator');

const STATUSES = ['todo', 'in-progress', 'completed'];
const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'status', 'title'];

const titleValidator = body('title')
  .trim()
  .notEmpty()
  .withMessage('Title is required.')
  .isLength({ max: 120 })
  .withMessage('Title cannot exceed 120 characters.');

const descriptionValidator = body('description')
  .optional()
  .isString()
  .withMessage('Description must be a string.')
  .isLength({ max: 500 })
  .withMessage('Description cannot exceed 500 characters.');

const statusValidator = body('status')
  .optional()
  .isIn(STATUSES)
  .withMessage('Status must be todo, in-progress, or completed.');

const dueDateValidator = body('dueDate')
  .optional({ nullable: true })
  .custom((value) => value === null || !Number.isNaN(Date.parse(value)))
  .withMessage('Due date must be a valid date.');

const createTaskValidation = [
  titleValidator,
  descriptionValidator,
  statusValidator,
  dueDateValidator
];

const updateTaskValidation = [
  param('id').isMongoId().withMessage('Task ID must be valid.'),
  body().custom((value) => {
    if (!value || Object.keys(value).length === 0) {
      throw new Error('At least one field is required to update a task.');
    }

    return true;
  }),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty.')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters.'),
  descriptionValidator,
  statusValidator,
  dueDateValidator
];

const taskIdValidation = [param('id').isMongoId().withMessage('Task ID must be valid.')];

const taskQueryValidation = [
  query('status')
    .optional()
    .isIn(STATUSES)
    .withMessage('Status filter must be todo, in-progress, or completed.'),
  query('search').optional().trim().isLength({ max: 100 }),
  query('dueFrom')
    .optional()
    .custom((value) => !Number.isNaN(Date.parse(value)))
    .withMessage('dueFrom must be a valid date.'),
  query('dueTo')
    .optional()
    .custom((value) => !Number.isNaN(Date.parse(value)))
    .withMessage('dueTo must be a valid date.'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('limit must be between 1 and 20.'),
  query('sortBy')
    .optional()
    .isIn(SORTABLE_FIELDS)
    .withMessage(`sortBy must be one of: ${SORTABLE_FIELDS.join(', ')}.`),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('order must be asc or desc.')
];

module.exports = {
  createTaskValidation,
  taskIdValidation,
  taskQueryValidation,
  updateTaskValidation
};
