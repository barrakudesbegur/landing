import { getEntry, type CollectionEntry } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'

type Event = CollectionEntry<'events'>

// Event dates are written as Begur wall-clock times ("2026-06-27 23:00") and
// the rest of the site displays them with the build machine's local getters,
// so we do the same here and label them as Europe/Madrid.
const TZID = 'Europe/Madrid'

// Events without an endDate get this duration so they don't show up as
// zero-length blips in people's calendars.
const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000

// Standard CET/CEST rules (EU DST: last Sunday of March / October).
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TZID}`,
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

const pad = (n: number) => String(n).padStart(2, '0')

// 20260627T230000 (local wall-clock, paired with TZID)
export const formatLocal = (date: Date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
  `T${pad(date.getHours())}${pad(date.getMinutes())}00`

// 20260612T194900Z
const formatUtc = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')

const escapeText = (text: string) =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

// RFC 5545: lines longer than 75 octets are folded with CRLF + space.
const fold = (line: string) => {
  const encoder = new TextEncoder()
  const parts: string[] = []
  let current = ''
  for (const char of line) {
    const limit = parts.length === 0 ? 75 : 74
    if (encoder.encode(current + char).length > limit) {
      parts.push(current)
      current = char
    } else {
      current += char
    }
  }
  parts.push(current)
  return parts.join('\r\n ')
}

/** Only events with a confirmed date go into calendars. */
export const isCalendarReady = (event: Event) => !event.data.dateEstimate

export const eventEnd = (event: Event) => {
  const { startDate, endDate } = event.data
  return endDate && endDate > startDate
    ? endDate
    : new Date(startDate.valueOf() + DEFAULT_DURATION_MS)
}

export async function eventLocation(event: Event) {
  const place = event.data.location
    ? (await getEntry(event.data.location))?.data
    : undefined
  if (!place) return undefined
  const { streetAddress, postalCode, addressLocality } = place.address
  return {
    text: `${place.name}, ${streetAddress}, ${postalCode} ${addressLocality}`,
    geo: place.geo,
  }
}

const eventUrl = (event: Event, site: URL) =>
  new URL(`/esdeveniments/${event.id}/`, site).href

async function vevent(event: Event, site: URL) {
  const url = eventUrl(event, site)
  const location = await eventLocation(event)
  return [
    'BEGIN:VEVENT',
    `UID:${event.id}@${site.hostname}`,
    `DTSTAMP:${formatUtc(event.data.publicationDate)}`,
    `DTSTART;TZID=${TZID}:${formatLocal(event.data.startDate)}`,
    `DTEND;TZID=${TZID}:${formatLocal(eventEnd(event))}`,
    `SUMMARY:${escapeText(event.data.title)}`,
    `DESCRIPTION:${escapeText(`${event.data.description}\n\n${url}`)}`,
    `URL:${url}`,
    ...(location
      ? [
          `LOCATION:${escapeText(location.text)}`,
          `GEO:${location.geo.latitude};${location.geo.longitude}`,
        ]
      : []),
    'END:VEVENT',
  ]
}

export async function buildCalendar(events: Event[], site: URL) {
  const vevents = await Promise.all(
    events.filter(isCalendarReady).map((event) => vevent(event, site)),
  )
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE_TITLE}//${site.hostname}//CA`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(SITE_TITLE)}`,
    `X-WR-CALDESC:${escapeText(SITE_DESCRIPTION)}`,
    `X-WR-TIMEZONE:${TZID}`,
    // Hint for subscribed calendars to check for new events twice a day
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
    ...VTIMEZONE,
    ...vevents.flat(),
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

export const calendarResponse = (body: string, filename: string) =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  })

/** "Add to Google Calendar" link for a single event. */
export async function googleCalendarUrl(event: Event, site: URL) {
  const location = await eventLocation(event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.data.title,
    dates: `${formatLocal(event.data.startDate)}/${formatLocal(eventEnd(event))}`,
    ctz: TZID,
    details: `${event.data.description}\n\n${eventUrl(event, site)}`,
    ...(location && { location: location.text }),
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
