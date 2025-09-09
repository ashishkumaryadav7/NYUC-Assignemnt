import Joi from 'joi';

export const createTaskSchema = {
  schema: Joi.object({
    body: Joi.object({
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().allow('').max(2000),
      status: Joi.string().valid('Pending', 'In-Progress', 'Completed').default('Pending'),
      deadline: Joi.date().optional()
    })
  })
};

export const updateTaskSchema = {
  schema: Joi.object({
    params: Joi.object({ id: Joi.string().hex().length(24).required() }),
    body: Joi.object({
      title: Joi.string().min(1).max(200),
      description: Joi.string().allow('').max(2000),
      status: Joi.string().valid('Pending', 'In-Progress', 'Completed'),
      deadline: Joi.date().allow(null)
    }).min(1)
  })
};

export const idParamSchema = {
  schema: Joi.object({
    params: Joi.object({ id: Joi.string().hex().length(24).required() })
  })
};

export const listQuerySchema = {
  schema: Joi.object({
    query: Joi.object({
      status: Joi.string().valid('Pending', 'In-Progress', 'Completed'),
      q: Joi.string().allow(''),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20)
    })
  })
};
