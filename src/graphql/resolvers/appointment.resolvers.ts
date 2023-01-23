import { CreateAppointmentDto } from './../../../types/appointment.d'
import { ID } from '../../../types'
import { AppointmentService } from '../../services/appointment.service'
import { Appointment } from '@prisma/client'

const appointmentService = new AppointmentService()

export const getAppointments = async (): Promise<Appointment[]> => {
  const appointments = await appointmentService.getAll()
  return appointments
}

export const getAppointment = async (_: unknown, { id }: ID): Promise<Appointment> => {
  const appointment = await appointmentService.getOne(Number(id))
  return appointment
}

export const createAppointment = async (_: unknown, { data }: { data: CreateAppointmentDto }): Promise<Appointment> => {
  const appointment = await appointmentService.create(data)
  return appointment
}
