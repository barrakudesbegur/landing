import { formatDateEstimate, getPublicEvents } from '../lib/events'

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
      // and dateLabel says what IS known ("12 o 13 de setembre", "Nadal"…)
      tba: Boolean(event.data.dateEstimate),
      dateLabel: event.data.dateEstimate
        ? formatDateEstimate(event.data)
        : null,
      url: new URL(`/esdeveniments/${event.id}/`, context.site).href,
      image: event.data.image
        ? new URL(event.data.image, context.site).href
        : null,
      instagram: event.data.igPostId
        ? `https://www.instagram.com/p/${event.data.igPostId}/`
        : null,
    }))
  return new Response(JSON.stringify({ events: items }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
