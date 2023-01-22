import { PayloadToken } from './../../../types/auth.d';
import { Request } from "express";
import { PassportContext } from "graphql-passport";
import { ID } from "../../../types";
import { CreateBarbershopServiceDto, UpdateBarbershopServiceDto } from "../../../types/barbershop-services";
import { BarbershopServicesService } from "../../services/barbershop-service.service";
import { checkRoles, verifyJWT } from '../validator.handler';

const barbershopService = new BarbershopServicesService()

export const getServices = async () => {
  const services = await barbershopService.getAll()
  return services
}

export const getService = async (_: unknown, { id }: ID) => {
  const service = await barbershopService.getOne(Number(id))
  return service
}

export const createService = async (
  _: unknown,
  { data }: { data: CreateBarbershopServiceDto },
  context: PassportContext<PayloadToken, { session: boolean }, Request>
) => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  const service = await barbershopService.create(data)
  return service
}

export const updateService = async (_: unknown, { changes, id }: { id: number, changes: UpdateBarbershopServiceDto }) => {
  const service = await barbershopService.update(Number(id), changes)
  return service
}

export const removeService = async (_: unknown, { id }: ID) => {
  const serviceId = await barbershopService.remove(Number(id))
  return serviceId
}