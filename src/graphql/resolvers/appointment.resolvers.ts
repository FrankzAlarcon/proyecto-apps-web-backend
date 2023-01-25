import { CreateAppointmentDto, RefactoredAppointment } from './../../../types/appointment.d'
import { ID, JwtContext } from '../../../types'
import { AppointmentService } from '../../services/appointment.service'
import { Appointment } from '@prisma/client'
import { checkRequestOwnData, checkRoles, schemaValidation, verifyJWT } from '../validator.handler'
import { GetById } from '../../dtos/service.dto'
import { CreateAppointmentDto as JoiCreateAppointmentDto } from '../../dtos/appointmet.dto'

const appointmentService = new AppointmentService()

export const getAppointments = async (
  _: unknown,
  __: unknown,
  context: JwtContext
): Promise<RefactoredAppointment[]> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')

  const appointments = await appointmentService.getAll()
  return appointments
}

export const getAppointment = async (_: unknown, { id }: ID, context: JwtContext): Promise<RefactoredAppointment> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(GetById, id)

  const appointment = await appointmentService.getOne(Number(id))
  return appointment
}

export const getAppointmentsByUser = async (
  _: unknown,
  { id }: ID,
  context: JwtContext
): Promise<RefactoredAppointment[]> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN', 'CUSTOMER')
  checkRequestOwnData(payload, id)

  const appointments = await appointmentService.getAllByUser(Number(id))
  return appointments
}

export const createAppointment = async (
  _: unknown,
  { data }: { data: CreateAppointmentDto },
  context: JwtContext
): Promise<Appointment> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN', 'CUSTOMER')
  schemaValidation(JoiCreateAppointmentDto, data)

  const appointment = await appointmentService.create(data)
  return appointment
}
