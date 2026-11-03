import { connectDB } from '@/../server/utils/mongoose'
import { Card } from '@/../server/models/card'
import { User } from '@/../server/models/user'

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const cardId = getRouterParam(event, 'id')
    if (!cardId) {
        throw createError({
            statusCode: 400,
            message: 'ID não fornecido'
        })
    }

    if (!/^[\da-f]{24}$/i.test(cardId)) {
        throw createError({
            statusCode: 400,
            message: 'ID do card inválido'
        })
    }
  
    await connectDB()
  
    const dbUser = await User.findOne({ googleId: user.id })
  
    if (!dbUser) {
        throw createError({
            statusCode: 404,
            message: 'Usuário não encontrado'
        })
    }

    const card = await Card.findById(cardId)
  
    if (!card) {
        throw createError({
            statusCode: 404,
            message: 'Card não encontrado'
        })
    }

    if (card.userId.toString() !== dbUser._id.toString()) {
        throw createError({
            statusCode: 403,
            message: 'Você não tem permissão para deletar este card'
        })
    }
    
    card.active = false
    card.deletedAt = new Date()
    await card.save()  
    return {
        success: true,
        message: 'Card deletado'
    }
})