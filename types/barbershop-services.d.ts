interface BarbershopService {
  id: number
  name: string
  price: number
}

export type CreateBarbershopServiceDto = Omit<BarbershopService, 'id'>

export type UpdateBarbershopServiceDto = Partial<CreateBarbershopServiceDto>
