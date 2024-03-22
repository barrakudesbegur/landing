import type { CollectionEntry } from 'astro:content'
import type { MusicEvent, WithContext } from 'schema-dts'
import { organizationSchema } from './organization'
import { placeSchemas } from './place'

export const eventSchema = (
  event: CollectionEntry<'agenda'>['data'],
  { eventPageUrl }: { eventPageUrl: string },
) =>
  ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    url: eventPageUrl,
    description: event.description,
    image: event.image
      ? new URL(event.image, eventPageUrl).toString()
      : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    location: event.location ? placeSchemas[event.location] : undefined,
    organizer: organizationSchema,
    performer: event.performers?.map((performer) => ({
      '@type': 'PerformingGroup',
      name: performer.name,
      sameAs: performer.url,
    })),
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'EUR',
      url: event?.buyTicketsUrl ?? eventPageUrl,
      validFrom: event.publicationDate.toISOString(),
      availability: 'https://schema.org/InStock',
    },
  }) as const satisfies WithContext<MusicEvent>
