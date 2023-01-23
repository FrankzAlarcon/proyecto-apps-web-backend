import Joi from 'joi'

const hour = Joi.string()
const date = Joi.string()
const userId = Joi.number()
const services = Joi.array().items(Joi.number())

export const CreateAppointmentDto = Joi.object({
  hour: hour.required(),
  date: date.required(),
  userId: userId.required(),
  services: services.required()
})

export const UpdateAppointmentDto = Joi.object({
  hour,
  date,
  userId,
  services
})
