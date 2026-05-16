/**
 * v4.0 — single source of truth for catalog stats cited in prose.
 *
 * Anywhere a page wants to say "300 services across 27 categories" — import
 * `getCatalogStats()` and interpolate. Numbers stay correct as the catalog
 * grows; no manual sync needed across docs / state-of-free-tiers / marketing.
 *
 * Computed at build time from the content collection (zero runtime cost).
 */
import { getCollection } from 'astro:content';

export interface CatalogStats {
  servicesTotal: number;
  categoriesTotal: number;
  ossCount: number;
  ccRequiredCount: number;
  tagsTotal: number;
  /** ISO date YYYY-MM */
  issueMonth: string;
  /** Issue number for the editorial masthead. Starts at 001, increments monthly. */
  issueSerial: string;
}

export async function getCatalogStats(): Promise<CatalogStats> {
  const services = await getCollection('services');
  const categories = await getCollection('categories');

  const ossCount = services.filter((s) => s.data.facets?.oss === true).length;
  const ccRequiredCount = services.filter((s) => s.data.facets?.cc_required === true).length;
  const tagsTotal = services.reduce((acc, s) => acc + (s.data.tags?.length ?? 0), 0);

  const now = new Date();
  const issueMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  // Issue serial: months since April 2026 (the launch month of opentier).
  // April 2026 = №001. May 2026 = №002. Etc.
  const launchEpoch = new Date(2026, 3, 1).getTime();
  const monthsSince = Math.max(
    0,
    Math.floor((now.getTime() - launchEpoch) / (1000 * 60 * 60 * 24 * 30.4)),
  );
  const issueSerial = String(monthsSince + 1).padStart(3, '0');

  return {
    servicesTotal: services.length,
    categoriesTotal: categories.length,
    ossCount,
    ccRequiredCount,
    tagsTotal,
    issueMonth,
    issueSerial,
  };
}
