import * as Joi from 'joi';

export const configScheme = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  // PORT
  PORT: Joi.number().required(),
  //DOMAIN
  DOMAIN: Joi.string(),
  //JWT
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),

  //DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB: Joi.string().required(),
});
