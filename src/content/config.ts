import { defineCollection, z } from 'astro:content'

const placeNames = ['arbreda', 'esteva-i-cruanas'] as const

export type PlaceName = (typeof placeNames)[number]

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
    location: z.enum(placeNames).optional(),
    igPost: z
      .string()
      .url()
      .startsWith('https://www.instagram.com/p/')
      .optional(),
    performers: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),
    price: z.number().nonnegative().default(0),
    buyTicketsUrl: z.string().url().optional(),
  }),
})

export const collections = { agenda }
