import { createUser, getUser, getUsers, removeUser, updateUser } from './user.resolvers'

export const resolvers = {
  Query: {
    // Users
    user: getUser,
    allUsers: getUsers
  },
  Mutation: {
    addUser: createUser,
    updateUser: updateUser,
    deleteUser: removeUser
  }
}