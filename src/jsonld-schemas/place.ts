import type { Place, WithContext } from 'schema-dts'
import type { PlaceName } from '../content/config'

export const placeSchemas = {
  arbreda: {
    '@type': 'Place',
    name: "Parc de l'Arbreda, Begur",
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Carrer Carles de Vilademany, 6',
      addressLocality: 'Begur',
      addressRegion: 'Girona',
      postalCode: '17255',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.95430933790201,
      longitude: 3.2039121027189035,
    },
    sameAs: 'https://maps.app.goo.gl/GqVkuncvcwUR41JZ9',
  },
  'esteva-i-cruanas': {
    '@type': 'Place',
    name: 'Plaça Esteva i Cruañas, Begur',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Carrer Ventura Sabater, 1',
      addressLocality: 'Begur',
      addressRegion: 'Girona',
      postalCode: '17255',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.953920681270496,
      longitude: 3.2073835002635334,
    },
    sameAs: 'https://maps.app.goo.gl/3UzKTsGAgNadLK3i8',
  },
} as const satisfies Record<PlaceName, Place>
