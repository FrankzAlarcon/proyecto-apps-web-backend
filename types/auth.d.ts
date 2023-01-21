type Role = "CUSTOMER" | "ADMIN"

interface CompleteAuth {
  id: number;
  name: string
  phone: string
  email: string;
  password: string;
  role: Role;
}

export type CreateAuthDto = Pick<CompleteAuth, 'email' | 'password' | 'role'>

export type CreateCompleteAuthDto = Omit<CompleteAuth, 'id'>
