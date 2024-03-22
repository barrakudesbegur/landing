import { defineCollection, z } from 'astro:content'

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
    location: z.string().optional(),
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
  }),
})

export const collections = { agenda }
