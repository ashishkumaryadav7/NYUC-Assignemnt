import { Router } from 'express';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, idParamSchema, listQuerySchema, updateTaskSchema } from '../validators/task.validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listQuerySchema), listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:id', validate(idParamSchema), getTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', validate(idParamSchema), deleteTask);

export default router;
