const Joi = require('@hapi/joi')

exports.ContractSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .messages({ 'any.required': 'Email é obrigatório!' }),
  finalAt: Joi.date()
    .required()
    .messages({ 'any.required': 'Final do contrato é obrigatório!' }),
  createdAt: Joi.date(),
  description: Joi.string()
    .required()
    .messages({ 'any.required': 'Descrição é obrigatório!' }),
  name: Joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      'string.min': 'Nome precisa ter no mínimo 5 caracteres!',
      'string.max': 'Nome precisa ter no máximo 50 caracteres!',
      'any.required': 'Nome é obrigatório!'
    })
})

exports.AdminSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .messages({ 'any.required': 'Insira um email válido' }),
  name: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.min': 'Nome precisa ter no mínimo 5 caracteres!',
      'string.max': 'Nome precisa ter no máximo 50 caracteres!',
      'any.required': 'Nome é obrigatório!'
    }),
  password: Joi.string()
    .min(5)
    .max(15)
    .required()
    .messages({
      'string.min': 'Senha precisa ter no mínimo 5 caracteres!',
      'string.max': 'Senha precisa ter no máximo 15 caracteres!',
      'any.required': 'Sua senha é obrigatória'
    })
})
