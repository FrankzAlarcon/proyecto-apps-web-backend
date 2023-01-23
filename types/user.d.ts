interface User {
  id: number
  name: string
  phone: string
}

export type CreateUserDto = Omit<User, 'id'>

export type UpdateUserDto = Partial<CreateUserDto>
