import Joi from 'joi';

export const signupSchema = {
  schema: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(60).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required()
    })
  })
};

export const loginSchema = {
  schema: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required()
    })
  })
};
