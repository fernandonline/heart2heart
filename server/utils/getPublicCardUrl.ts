export function getPublicSiteOrigin(siteUrl: string): string {
  let url: URL

  try {
    url = new URL(siteUrl)
  } catch {
    throw createError({
      statusCode: 500,
      message: 'Configure NUXT_PUBLIC_SITE_URL com a URL pública da aplicação.'
    })
  }

  const isLocalDevelopment =
    process.env.NODE_ENV === 'development' && url.hostname === 'localhost' && url.protocol === 'http:'

  if (url.protocol !== 'https:' && !isLocalDevelopment) {
    throw createError({
      statusCode: 500,
      message: 'NUXT_PUBLIC_SITE_URL deve usar HTTPS fora do desenvolvimento local.'
    })
  }

  return url.origin
}

export function getPublicCardUrl(siteOrigin: string, publicId: string): string {
  return new URL(`/card/${encodeURIComponent(publicId)}`, siteOrigin).toString()
}
