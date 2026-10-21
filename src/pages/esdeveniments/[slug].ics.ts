import type { APIContext } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getPublicEvents } from '../../lib/events'
import {
  buildCalendar,
  calendarResponse,
  isCalendarReady,
} from '../../lib/ical'

// One-off .ics per event, for the "Afegeix al calendari" button.
export async function getStaticPaths() {
  const events = await getPublicEvents()
  return events.filter(isCalendarReady).map((event) => ({
    params: { slug: event.id },
    props: { event },
  }))
}

export async function GET({ props, site }: APIContext) {
  const { event } = props as { event: CollectionEntry<'events'> }
  const body = await buildCalendar([event], site!)
  return calendarResponse(body, `${event.id}.ics`)
}
