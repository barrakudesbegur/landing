import type { Graph, Organization, WithContext } from 'schema-dts'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Barrakudes de Begur',
  legalName: 'Associació Juvenil Barrakudes',
  url: 'https://barrakudesbegur.org',
  logo: 'https://barrakudesbegur.org/logo-barrakudes-begur.png',
  foundingDate: '2022',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Carrer Carles de Vilademany, 6',
    addressLocality: 'Begur',
    addressRegion: 'Girona',
    postalCode: '17255',
    addressCountry: 'ES',
  },
  location: {
    '@type': 'Place',
    name: 'Begur',
  },
  email: 'barrakudesassociaciojuvenil@gmail.com',
  taxID: 'G10808830',
  sameAs: [
    'https://www.instagram.com/barrakudesbegur',
    'https://barrakudesbegur.org',
  ],
} as const satisfies WithContext<Organization>
