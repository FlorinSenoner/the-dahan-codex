import { httpRouter } from 'convex/server'
import { api } from './_generated/api'
import { httpAction } from './_generated/server'

const http = httpRouter()

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

http.route({
  path: '/public-snapshot',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    })
  }),
})

http.route({
  path: '/public-snapshot',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url)
    const force = url.searchParams.get('force') === '1'
    const snapshot = await ctx.runQuery(api.reference.getPublicSnapshot, {})

    return new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json; charset=utf-8',
        // Public CDN/browser caching for non-force requests.
        'Cache-Control': force
          ? 'no-store'
          : 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400',
      },
    })
  }),
})

export default http
