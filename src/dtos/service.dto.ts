import Joi from 'joi'

const id = Joi.number().integer()
const name = Joi.string().min(3)
const price = Joi.number().min(0.99)

export const CreateServiceDto = Joi.object({
  name: name.required(),
  price: price.required()
})

export const UpdateServiceDto = Joi.object({
  name,
  price
})

export const GetById = id
