export const generateToken = (): string => {
  const token = Date.now().toString(32) + Math.random().toString(32).split('.')[1]
  return token
}
