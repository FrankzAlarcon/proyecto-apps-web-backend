interface CompleteAppointment {
  id: number;
  hour: Date;
  date: Date;
  userId: number;
  services: number[]
}

export type CreateJustAppointmentDto = Omit<CompleteAppointment, 'id' | 'services'>

export type CreateAppointmentDto = Omit<CompleteAppointment, 'id'>

export type UpdateAppointmentDto = Partial<CreateAppointmentDto>