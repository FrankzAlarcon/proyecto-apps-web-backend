import Joi from 'joi'

const name = Joi.string().min(3)
const phone = Joi.string().min(10)
const email = Joi.string().email()
const password = Joi.string().min(6)
const role = Joi.string().regex(/^(CUSTOMER|ADMIN)$/)

export const CreateAuthDto = Joi.object({
  name: name.required(),
  phone: phone.required(),
  email: email.required(),
  password: password.required(),
  role
})
