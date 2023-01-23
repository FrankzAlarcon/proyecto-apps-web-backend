import { ID, JwtContext } from '../../../types'
import { CreateBarbershopServiceDto, UpdateBarbershopServiceDto } from '../../../types/barbershop-services'
import { BarbershopServicesService } from '../../services/barbershop-service.service'
import { checkRoles, schemaValidation, verifyJWT } from '../validator.handler'
import { CreateServiceDto, GetById, UpdateServiceDto } from '../../dtos/service.dto'
import { Service } from '@prisma/client'

const barbershopService = new BarbershopServicesService()

export const getServices = async (_: unknown, __: unknown, context: JwtContext): Promise<Service[]> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN', 'CUSTOMER')

  const services = await barbershopService.getAll()
  return services
}

export const getService = async (_: unknown, { id }: ID, context: JwtContext): Promise<Service> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(GetById, id)
  const service = await barbershopService.getOne(Number(id))
  return service
}

export const createService = async (
  _: unknown,
  { data }: { data: CreateBarbershopServiceDto },
  context: JwtContext
): Promise<Service> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(CreateServiceDto, data)

  const service = await barbershopService.create(data)
  return service
}

export const updateService = async (
  _: unknown,
  { changes, id }: { id: number, changes: UpdateBarbershopServiceDto },
  context: JwtContext
): Promise<Service> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(UpdateServiceDto, changes)

  const service = await barbershopService.update(Number(id), changes)
  return service
}

export const removeService = async (_: unknown, { id }: ID, context: JwtContext): Promise<number> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(GetById, id)

  const serviceId = await barbershopService.remove(Number(id))
  return serviceId
}
