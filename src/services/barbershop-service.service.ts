import { CreateBarbershopServiceDto, UpdateBarbershopServiceDto } from './../../types/barbershop-services.d'
import boom from '@hapi/boom'
import { PrismaClient, Service } from '@prisma/client'

export class BarbershopServicesService {
  private readonly prisma

  constructor () {
    this.prisma = new PrismaClient()
  }

  async getAll (): Promise<Service[]> {
    const services = await this.prisma.service.findMany()
    return services
  }

  async getOne (id: number): Promise<Service> {
    const service = await this.prisma.service.findFirst({ where: { id } })
    if (!service) {
      throw boom.notFound('Service not found')
    }
    return service
  }

  async checkIfServicesExist (servicesIds: number[]): Promise<boolean> {
    const results = await Promise.allSettled(
      servicesIds.map(serviceId => this.prisma.service.findFirst({ where: { id: serviceId } }))
    )
    results.forEach((result) => {
      if (result.status === 'rejected') {
        return false
      }
      if (!result.value) {
        return false
      }
    })
    return true
  }

  async create (data: CreateBarbershopServiceDto): Promise<Service> {
    const service = await this.prisma.service.create({ data })
    return service
  }

  async update (id: number, changes: UpdateBarbershopServiceDto): Promise<Service> {
    const service = await this.prisma.service.findFirst({ where: { id } })
    if (!service) {
      throw boom.notFound('Service not found')
    }
    const updatedService = await this.prisma.service.update({ where: { id }, data: changes })
    return updatedService
  }

  async remove (id: number): Promise<number> {
    const service = await this.prisma.service.findFirst({ where: { id } })
    if (!service) {
      throw boom.notFound('Service not found')
    }
    const deletedService = await this.prisma.service.delete({ where: { id } })
    return deletedService.id
  }
}
