import { getCollection, type CollectionEntry } from 'astro:content'
import { FEATURE_SARDANES } from '../consts'

// Events hidden behind feature toggles (see FEATURE_SARDANES in consts.ts).
// Once the toggle is removed, delete this filtering and use getCollection directly.
const HIDDEN_EVENT_IDS = FEATURE_SARDANES ? [] : ['2026-curs-sardanes']

export async function getPublicEvents() {
  const events = await getCollection('events')
  return events.filter((event) => !HIDDEN_EVENT_IDS.includes(event.id))
}

type EventData = CollectionEntry<'events'>['data']

const monthOf = new Intl.DateTimeFormat('ca-ES', { month: 'long' })
const weekdayOf = new Intl.DateTimeFormat('ca-ES', { weekday: 'long' })

// "de setembre" / "d'abril"
const ofMonth = (date: Date) => {
  const month = monthOf.format(date)
  return /^[aeiou]/i.test(month) ? `d'${month}` : `de ${month}`
}

// Append the year only when it isn't this year: "…del 2027"
const yearSuffix = (date: Date) =>
  date.getFullYear() === new Date().getFullYear()
    ? ''
    : ` del ${date.getFullYear()}`

const capitalize = (label: string) =>
  label.charAt(0).toUpperCase() + label.slice(1)

const joinWithO = (parts: string[]) =>
  parts.length > 1
    ? `${parts.slice(0, -1).join(', ')} o ${parts[parts.length - 1]}`
    : (parts[0] ?? '')

/**
 * Human date label for an event whose date is not confirmed yet, e.g.
 * "Dissabte 19 de setembre", "12, 13 o 24 de setembre", "1-8 d'abril",
 * "Desembre", "Setmana Santa del 2027", "Data per confirmar".
 */
export function formatDateEstimate(event: EventData): string {
  const estimate = event.dateEstimate
  const start = event.startDate
  if (!estimate)
    return capitalize(
      `${start.getDate()} ${ofMonth(start)}${yearSuffix(start)}`
    )

  switch (estimate.precision) {
    case 'probable':
      return capitalize(
        `${weekdayOf.format(start)} ${start.getDate()} ${ofMonth(start)}${yearSuffix(start)}`
      )
    case 'set': {
      const dates = estimate.dates ?? []
      if (dates.length === 0) return 'Data per confirmar'
      const sameMonth = dates.every(
        (d) =>
          d.getMonth() === dates[0].getMonth() &&
          d.getFullYear() === dates[0].getFullYear()
      )
      const label = sameMonth
        ? `${joinWithO(dates.map((d) => `${d.getDate()}`))} ${ofMonth(dates[0])}`
        : joinWithO(dates.map((d) => `${d.getDate()} ${ofMonth(d)}`))
      return capitalize(`${label}${yearSuffix(dates[0])}`)
    }
    case 'range': {
      const { from, to } = estimate
      if (!from || !to) return 'Data per confirmar'
      const label =
        from.getMonth() === to.getMonth()
          ? `${from.getDate()}-${to.getDate()} ${ofMonth(from)}`
          : `${from.getDate()} ${ofMonth(from)} - ${to.getDate()} ${ofMonth(to)}`
      return capitalize(`${label}${yearSuffix(to)}`)
    }
    case 'month':
      return capitalize(`${monthOf.format(start)}${yearSuffix(start)}`)
    case 'period':
      return estimate.name
        ? `${estimate.name}${yearSuffix(start)}`
        : 'Data per confirmar'
    default:
      return 'Data per confirmar'
  }
}
