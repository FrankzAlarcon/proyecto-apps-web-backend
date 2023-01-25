import { AppointmentExtended, CreateJustAppointmentDto, RefactoredAppointment } from './../../types/appointment.d'
import boom from '@hapi/boom'
import { Appointment, PrismaClient, Service, User } from '@prisma/client'
import { CreateAppointmentDto } from '../../types/appointment'
import { BarbershopServicesService } from './barbershop-service.service'
import moment from 'moment'

export class AppointmentService {
  private readonly prisma
  private readonly barbershopService

  constructor () {
    this.prisma = new PrismaClient()
    this.barbershopService = new BarbershopServicesService()
  }

  async getAll (): Promise<RefactoredAppointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        AppointmetServices: {
          include: { service: true }
        },
        user: true
      }
    })

    const refactoredAppointments = appointments.map(appointment => {
      return this.refactorAppointmentInfo(appointment)
    })

    return refactoredAppointments
  }

  async getAllByUser (userId: number): Promise<RefactoredAppointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { userId },
      include: {
        AppointmetServices: { include: { service: true } },
        user: true
      }
    })

    const refactoredAppointments = appointments.map(appointment => this.refactorAppointmentInfo(appointment))
    return refactoredAppointments
  }

  async getOne (id: number): Promise<RefactoredAppointment> {
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

    const refactoredAppointment = this.refactorAppointmentInfo(appointment)
    return refactoredAppointment
  }

  async create (data: CreateAppointmentDto): Promise<Appointment> {
    // Check that services exist
    const servicesExist = await this.barbershopService.checkIfServicesExist(data.services)

    if (!servicesExist) {
      throw boom.badRequest('Something went wrong')
    }

    // Create appointment
    const appointmentData: CreateJustAppointmentDto = {
      date: moment(data.date, 'YYYY-mm-DD').utc(true).toDate(),
      hour: moment(data.hour, 'HH:mm:ss').utc(true).toDate(),
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

  private refactorAppointmentInfo (appointment: AppointmentExtended): RefactoredAppointment {
    const services = appointment.AppointmetServices.map((appSer) => appSer.service)
    const refactoredAppointment: Appointment & { user: User, services: Service[] } = {
      id: appointment.id,
      date: appointment.date,
      hour: appointment.hour,
      userId: appointment.userId,
      isCompleted: appointment.isCompleted,
      user: appointment.user,
      createdAt: appointment.createdAt,
      services
    }
    return refactoredAppointment
  }
}
