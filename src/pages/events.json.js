import { getCollection } from 'astro:content'

// The events collection as JSON — consumed by the whatsapp-bot (Kudi's
// live-agenda knowledge base layer) so event info is never duplicated.
export async function GET(context) {
  const events = await getCollection('events')
  const items = events
    .sort((a, b) => b.data.startDate - a.data.startDate)
    .slice(0, 30)
    .map((event) => ({
      title: event.data.title,
      description: event.data.description,
      startDate: event.data.startDate.toISOString(),
      endDate: event.data.endDate ? event.data.endDate.toISOString() : null,
      url: new URL(`/esdeveniments/${event.id}/`, context.site).href,
    }))
  return new Response(JSON.stringify({ events: items }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
