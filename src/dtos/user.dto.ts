import Joi from 'joi'

const name = Joi.string().min(3)
const phone = Joi.string().min(10)

export const CreateUserDto = Joi.object({
  name: name.required(),
  phone: phone.required()
})

export const UpdateUserDto = Joi.object({
  name,
  phone
})
