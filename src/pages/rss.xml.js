import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'

export async function get(context) {
  const events = await getCollection('agenda')
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: events.map((event) => ({
      ...event.data,
      pubDate: event.data.publicationDate,
      link: `/agenda/${event.slug}/`,
    })),
  })
}
