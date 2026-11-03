import { connectDB } from '@/../server/utils/mongoose';
import { User } from '@/../server/models/user';
import { Card } from '@/../server/models/card';
import { generatePublicId } from '@/../server/utils/generatePublicId';
import { getPublicCardUrl, getPublicSiteOrigin } from '@/../server/utils/getPublicCardUrl';

interface CreateCardBody {
  imageUrl: string
  title: string
  message: string
  date: Date
}

function invalidBody(): never {
  throw createError({
    statusCode: 400,
    message: 'Informe uma imagem do Cloudinary, título, mensagem e data válidos.'
  })
}

function validateCreateCardBody(body: unknown): CreateCardBody {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return invalidBody()
  }

  const input = body as Record<string, unknown>
  const imageUrl = typeof input.imageUrl === 'string' ? input.imageUrl.trim() : ''
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const message = typeof input.message === 'string' ? input.message.trim() : ''
  const dateValue = typeof input.date === 'string' ? input.date : ''

  let parsedImageUrl: URL
  try {
    parsedImageUrl = new URL(imageUrl)
  } catch {
    return invalidBody()
  }

  const date = new Date(`${dateValue}T00:00:00.000Z`)
  if (
    parsedImageUrl.protocol !== 'https:' ||
    parsedImageUrl.hostname !== 'res.cloudinary.com' ||
    imageUrl.length > 2048 ||
    !title ||
    title.length > 100 ||
    !message ||
    message.length > 5000 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateValue) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== dateValue
  ) {
    return invalidBody()
  }

  return { imageUrl, title, message, date }
}

function isPublicIdCollision(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error) || error.code !== 11000) {
    return false
  }

  return 'keyPattern' in error &&
    typeof error.keyPattern === 'object' &&
    error.keyPattern !== null &&
    'publicId' in error.keyPattern
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = validateCreateCardBody(await readBody<unknown>(event))
  const config = useRuntimeConfig(event)
  const siteOrigin = getPublicSiteOrigin(config.public.siteUrl)
  
  await connectDB()
  
  let dbUser = await User.findOne({ googleId: user.id })
  
  if (!dbUser) {
    dbUser = await User.create({
      googleId: user.id,
      email: user.email,
      name: user.name,
      urlPic: user.urlPic
    })
  }
  
  let card
  let cardUrl = ''
  for (let attempt = 0; attempt < 3; attempt++) {
    const publicId = generatePublicId()
    cardUrl = getPublicCardUrl(siteOrigin, publicId)

    try {
      card = await Card.create({
        userId: dbUser._id,
        ...body,
        publicId,
        active: true,
      })
      break
    } catch (error) {
      if (!isPublicIdCollision(error) || attempt === 2) {
        throw error
      }
    }
  }

  if (!card) {
    throw createError({
      statusCode: 500,
      message: 'Não foi possível gerar um identificador para o card.'
    })
  }
  
    return {
        success: true,
        card: {
            id: card._id,
            publicId: card.publicId,
            title: card.title,
            url: cardUrl
        }
    }
})