import { defineCollection, reference, z } from 'astro:content'

const addressSchema = z.object({
  streetAddress: z.string(),
  addressLocality: z.string(),
  addressRegion: z.string(),
  postalCode: z.string(),
  addressCountry: z.string(),
})

const geoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const places = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    address: addressSchema,
    geo: geoSchema,
    sameAs: z.string().url(),
  }),
})

const performers = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    url: z.string().url().optional(),
  }),
})

const agenda = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publicationDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    startDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .or(z.date())
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    image: z.string().optional(),
    location: reference('places').optional(),
    igPostId: z.string().optional(),
    performers: z.array(reference('performers')).optional(),
    schedule: z
      .object({
        details: z.array(z.string()).optional(),
        note: z.string().optional(),
      })
      .optional(),
    entry: z
      .object({
        price: z.number().nonnegative().default(0),
        details: z.array(z.string()).optional(),
        notes: z.array(z.string()).optional(),
      })
      .default({ price: 0 }),
    buyTicketsUrl: z.string().url().optional(),
  }),
})

export const collections = { agenda, places, performers }
