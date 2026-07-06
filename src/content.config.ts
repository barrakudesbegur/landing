import { defineCollection, reference } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { z } from 'astro/zod'

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
  loader: glob({ pattern: '**/*.yml', base: './src/content/places' }),
  schema: z.object({
    name: z.string(),
    address: addressSchema,
    geo: geoSchema,
    sameAs: z.string().url(),
  }),
})

const performers = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/performers' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url().optional(),
  }),
})

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
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
    // Present when the date is not confirmed yet. startDate stays the
    // best-known estimate (used for ordering); this describes how precisely
    // the date is known, so the UI can say "12, 13 o 24 de setembre",
    // "1-8 d'abril", "Nadal", "Setmana Santa", "Data per confirmar"…
    dateEstimate: z
      .object({
        precision: z.enum([
          'probable', // startDate is the likely exact day
          'set', // one of `dates`
          'range', // between `from` and `to`
          'month', // the month of startDate
          'period', // a named period (`name`), e.g. "Setmana Santa"
          'unknown',
        ]),
        dates: z
          .array(z.string().or(z.date()).transform((val) => new Date(val)))
          .optional(),
        from: z
          .string()
          .or(z.date())
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
        to: z
          .string()
          .or(z.date())
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
        name: z.string().optional(),
      })
      .optional(),
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

export const collections = { events, places, performers }
