import { CreateJustAppointmentDto } from './../../types/appointment.d'
import boom from '@hapi/boom'
import { Appointment, PrismaClient } from '@prisma/client'
import { CreateAppointmentDto } from '../../types/appointment'
import { BarbershopServicesService } from './barbershop-service.service'

export class AppointmentService {
  private readonly prisma
  private readonly barbershopService

  constructor () {
    this.prisma = new PrismaClient()
    this.barbershopService = new BarbershopServicesService()
  }

  async getAll (): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        AppointmetServices: {
          include: { service: true }
        },
        user: true
      }
    })
    return appointments
  }

  async getOne (id: number): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id },
      include: {
        AppointmetServices: {
          include: { service: true }
        },
        user: true
      }
    })

    if (!appointment) {
      throw boom.notFound('Appointment not found')
    }

    return appointment
  }

  async create (data: CreateAppointmentDto): Promise<Appointment> {
    // Check that services exist
    const servicesExist = await this.barbershopService.checkIfServicesExist(data.services)

    if (!servicesExist) {
      throw boom.badRequest('Something went wrong')
    }

    // Create appointment
    const appointmentData: CreateJustAppointmentDto = {
      date: data.date,
      hour: data.hour,
      userId: data.userId
    }
    const appointment = await this.prisma.appointment.create({ data: appointmentData })

    // create the row for table servicios_appointment
    const servicesToInsert = data.services.map(service => ({ serviceId: service, appointmentId: appointment.id }))
    await this.prisma.appointmentServices.createMany({ data: servicesToInsert })

    // return a complete appointment with user, appointment data and services
    const completeAppointment = await this.getOne(appointment.id)
    return completeAppointment
  }
}
