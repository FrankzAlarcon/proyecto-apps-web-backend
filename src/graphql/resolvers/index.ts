import { createAppointment, getAppointment, getAppointments, getAppointmentsByUser } from './appointment.resolvers'
import { getAuth, getAuths, createAuth, login } from './auth.resolvers'
import { createService, removeService, updateService, getService, getServices } from './service.resolvers'
import { createUser, getUser, getUsers, removeUser, updateUser } from './user.resolvers'

export const resolvers = {
  Query: {
    // Users
    user: getUser,
    allUsers: getUsers,
    // Auth
    auth: getAuth,
    allAuths: getAuths,
    // Services
    service: getService,
    allServices: getServices,
    // Appointments
    appointment: getAppointment,
    allAppointments: getAppointments,
    allAppointmentsByUser: getAppointmentsByUser
  },
  Mutation: {
    // Users
    addUser: createUser,
    updateUser,
    deleteUser: removeUser,
    // Auth
    addAuth: createAuth,
    login,
    // Services
    addService: createService,
    updateService,
    deleteService: removeService,
    // Appointments
    addAppointment: createAppointment
  }
}
