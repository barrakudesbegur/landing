import { defineCollection, z } from 'astro:content';

const agenda = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		startDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		image: z.string().optional(),
	}),
});

export const collections = { agenda };
