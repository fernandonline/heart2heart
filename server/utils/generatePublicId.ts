import { randomBytes } from 'node:crypto'

export const generatePublicId = (): string => randomBytes(9).toString('base64url')
