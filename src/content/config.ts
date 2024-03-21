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
    updatedDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    image: z.string().optional(),
    igPost: z
      .string()
      .url()
      .startsWith('https://www.instagram.com/p/')
      .optional(),
  }),
})

export const collections = { agenda }
