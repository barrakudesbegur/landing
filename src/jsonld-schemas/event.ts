import type { CollectionEntry } from 'astro:content'
import type { MusicEvent, WithContext } from 'schema-dts'
import { organizationSchema } from './organization'

export const eventSchema = (
  event: CollectionEntry<'agenda'>['data'],
  options: { url: URL },
) =>
  ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    url: options.url.toString(),
    description: event.description,
    image: event.image
      ? new URL(event.image, options.url).toString()
      : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    location: event.location
      ? [{ '@type': 'Place', name: event.location }]
      : undefined,
    organizer: organizationSchema,
    performer: event.performers?.map((performer) => ({
      '@type': 'PerformingGroup',
      name: performer.name,
      sameAs: performer.url,
    })),
  }) as const satisfies WithContext<MusicEvent>
