import { getPublicEvents } from '../lib/events'

// The events collection as JSON — consumed by the whatsapp-bot (Kudi's
// live-agenda knowledge base layer) so event info is never duplicated.
export async function GET(context) {
  const events = await getPublicEvents()
  const items = events
    .sort((a, b) => b.data.startDate - a.data.startDate)
    .slice(0, 30)
    .map((event) => ({
      title: event.data.title,
      description: event.data.description,
      startDate: event.data.startDate.toISOString(),
      endDate: event.data.endDate ? event.data.endDate.toISOString() : null,
      // true = exact date/time not confirmed yet; startDate is an estimate
      tba: event.data.tba,
      url: new URL(`/esdeveniments/${event.id}/`, context.site).href,
    }))
  return new Response(JSON.stringify({ events: items }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
