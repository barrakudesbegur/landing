import { getCollection } from 'astro:content'
import { FEATURE_SARDANES } from '../consts'

// Events hidden behind feature toggles (see FEATURE_SARDANES in consts.ts).
// Once the toggle is removed, delete this file and use getCollection directly.
const HIDDEN_EVENT_IDS = FEATURE_SARDANES ? [] : ['2026-curs-sardanes']

export async function getPublicEvents() {
  const events = await getCollection('events')
  return events.filter((event) => !HIDDEN_EVENT_IDS.includes(event.id))
}
