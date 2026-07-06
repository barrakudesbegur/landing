import rss from '@astrojs/rss'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'
import { getPublicEvents } from '../lib/events'

export async function GET(context) {
  const events = await getPublicEvents()
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: events.map((event) => ({
      ...event.data,
      pubDate: event.data.publicationDate,
      link: `/esdeveniments/${event.id}/`,
    })),
  })
}
