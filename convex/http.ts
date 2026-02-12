import { httpRouter } from 'convex/server'
import { internal } from './_generated/api'
import { httpAction } from './_generated/server'

const http = httpRouter()

http.route({
  path: '/publish-callback',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const expectedSecret = process.env.PUBLISH_CALLBACK_SECRET
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')

    if (!expectedSecret || token !== expectedSecret) {
      return new Response('Unauthorized', { status: 401 })
    }

    let body: {
      requestId?: string
      requestedBy?: string
      status?: 'succeeded' | 'failed'
      runUrl?: string
      error?: string
    }

    try {
      body = await request.json()
    } catch {
      return new Response('Invalid JSON payload', { status: 400 })
    }

    if (!body.requestId || !body.status) {
      return new Response('Missing requestId or status', { status: 400 })
    }

    if (body.status !== 'succeeded' && body.status !== 'failed') {
      return new Response('Invalid status value', { status: 400 })
    }

    await ctx.runMutation(internal.publish.finalizePublishInternal, {
      requestId: body.requestId,
      requestedBy: body.requestedBy,
      status: body.status,
      runUrl: body.runUrl,
      error: body.error,
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    })
  }),
})

export default http
