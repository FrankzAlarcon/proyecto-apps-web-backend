import { Appointment, AppointmentServices, Service, User } from '@prisma/client'

interface CompleteAppointment {
  id: number
  hour: Date
  date: Date
  userId: number
  services: number[]
}

interface AppointmentExtended extends Appointment {
  user: User
  AppointmetServices: Array<AppointmentServices & { service: Service }>
}

interface RefactoredAppointment extends Appointment {
  services: Service[]
}

export type CreateJustAppointmentDto = Omit<CompleteAppointment, 'id' | 'services'>

export type CreateAppointmentDto = Omit<CompleteAppointment, 'id'>

export type UpdateAppointmentDto = Partial<CreateAppointmentDto>
