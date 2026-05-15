import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// RSS feed for the 50 most-recently-verified services. Sort by `date_verified`
// descending; fall back to `date_added` when `date_verified` is missing.
export async function GET(context) {
  const services = await getCollection('services');

  const sorted = services
    .map((service) => {
      const verified = service.data.date_verified ?? service.data.date_added;
      const pubDate = verified instanceof Date ? verified : new Date(verified);
      return { service, pubDate };
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  return rss({
    title: 'free-stack — recently verified free tiers',
    description: 'Latest free-tier verifications from free-stack. Sorted by verification date.',
    site: context.site,
    items: sorted.map(({ service, pubDate }) => ({
      title: service.data.name,
      description: service.data.summary,
      link: new URL(`/service/${service.id}`, context.site).toString(),
      pubDate,
      categories: [service.data.category],
    })),
  });
}
