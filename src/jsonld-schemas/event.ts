import type { CollectionEntry } from 'astro:content'
import type {
  MusicEvent,
  Offer,
  PerformingGroup,
  Place,
  WithContext,
} from 'schema-dts'
import { organizationSchema } from './organization'

type PlaceData = CollectionEntry<'places'>['data']
type PerformerData = CollectionEntry<'performers'>['data']

export const eventSchema = (
  event: CollectionEntry<'agenda'>['data'],
  {
    eventPageUrl,
    performers,
    place,
  }: { eventPageUrl: string; performers: PerformerData[]; place?: PlaceData },
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
    location:
      place &&
      ({
        '@type': 'Place',
        name: place.name,
        address: { '@type': 'PostalAddress', ...place.address },
        geo: { '@type': 'GeoCoordinates', ...place.geo },
        sameAs: place.sameAs,
      } satisfies Place),
    organizer: organizationSchema,
    performer:
      performers.length > 0
        ? performers.map(
            (p) =>
              ({
                '@type': 'PerformingGroup',
                name: p.name,
                sameAs: p.url,
              }) satisfies PerformingGroup,
          )
        : undefined,
    offers: {
      '@type': 'Offer',
      price: event.entry.price ?? 0,
      priceCurrency: 'EUR',
      url: event.buyTicketsUrl ?? eventPageUrl,
      validFrom: event.publicationDate.toISOString(),
      availability: 'https://schema.org/InStock',
    } satisfies Offer,
  }) as const satisfies WithContext<MusicEvent>
