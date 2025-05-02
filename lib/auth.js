import { compare } from 'bcryptjs';

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}