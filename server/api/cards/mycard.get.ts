import { connectDB } from '@/../server/utils/mongoose';
import { User } from '@/../server/models/user';
import { Card } from '@/../server/models/card';
import { getPublicCardUrl, getPublicSiteOrigin } from '@/../server/utils/getPublicCardUrl';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const config = useRuntimeConfig(event)
  const siteOrigin = getPublicSiteOrigin(config.public.siteUrl)
  
  await connectDB()
  
  const dbUser = await User.findOne({ googleId: user.id })
  
  if (!dbUser) {
    return []
  }
  
  const cards = await Card.find({ 
    userId: dbUser._id,
    active: true 
  }).sort({ createdAt: -1 })
  
  return cards.map(card => ({
    id: card._id,
    publicId: card.publicId,
    imageUrl: card.imageUrl,
    message: card.message,
    title: card.title,
    date: card.date,
    url: getPublicCardUrl(siteOrigin, card.publicId)
  }))
})