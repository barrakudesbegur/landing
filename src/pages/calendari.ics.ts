import type { APIContext } from 'astro'
import { getPublicEvents } from '../lib/events'
import { buildCalendar, calendarResponse } from '../lib/ical'

// Subscribable calendar with every confirmed event. People add it once
// (webcal://barrakudesbegur.org/calendari.ics) and new events show up in
// their phone's calendar automatically.
export async function GET(context: APIContext) {
  const events = await getPublicEvents()
  const body = await buildCalendar(events, context.site!)
  return calendarResponse(body, 'barrakudes.ics')
}
