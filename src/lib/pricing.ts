/**
 * Treatment prices: the ONLY place prices are set on the public website.
 *
 * Rules:
 * - Prices are entered in NPR exactly as confirmed by the clinic.
 * - USD is calculated automatically and always shown as "approx." so foreign
 *   patients understand it moves with the exchange rate.
 * - A treatment with no confirmed price is simply not listed. Never add an
 *   estimate here.
 *
 * To change a price: edit `nprFrom` / `nprTo` below and redeploy.
 */

/** NPR per 1 USD. Nepal Rastra Bank rate was about 150 in 2026. Review quarterly. */
export const NPR_PER_USD = 150;
export const RATE_REVIEWED = "November 2026";

export interface PriceItem {
  name: string;
  nprFrom: number;
  nprTo?: number;
  /** Shown under the price, e.g. what is included. Facts only. */
  note?: string;
  /** Links the price to a /services/<slug> page so that page shows it too. */
  serviceSlug?: string;
}

export interface PriceCategory {
  category: string;
  description: string;
  items: PriceItem[];
}

// Confirmed by clinic management. Ortho figures are the standard (non-offer)
// prices from the Tihar 2083 campaign material.
export const PRICE_LIST: PriceCategory[] = [
  {
    category: "Braces & Aligners",
    description: "Orthodontic treatment planned with our visiting orthodontist.",
    items: [
      { name: "Metal braces", nprFrom: 60000, serviceSlug: "braces", note: "Full treatment fee" },
      { name: "Ceramic braces", nprFrom: 70000, note: "Tooth-coloured brackets, full treatment fee" },
      { name: "Clear aligners", nprFrom: 150000, serviceSlug: "clear-aligners", note: "Final fee depends on case complexity" },
    ],
  },
];

const nprFmt = new Intl.NumberFormat("en-US");
const roundUsd = (n: number) => (n < 100 ? Math.round(n / 5) * 5 : Math.round(n / 10) * 10);

export function toUsd(npr: number): number {
  return roundUsd(npr / NPR_PER_USD);
}

/** "Rs. 60,000" or "Rs. 60,000 – 80,000" */
export function formatNpr(item: Pick<PriceItem, "nprFrom" | "nprTo">): string {
  return item.nprTo
    ? `Rs. ${nprFmt.format(item.nprFrom)} – ${nprFmt.format(item.nprTo)}`
    : `Rs. ${nprFmt.format(item.nprFrom)}`;
}

/** "approx. US$400" or "approx. US$400 – 530" */
export function formatUsd(item: Pick<PriceItem, "nprFrom" | "nprTo">): string {
  return item.nprTo
    ? `approx. US$${toUsd(item.nprFrom).toLocaleString("en-US")} – ${toUsd(item.nprTo).toLocaleString("en-US")}`
    : `approx. US$${toUsd(item.nprFrom).toLocaleString("en-US")}`;
}

export function priceForService(slug: string): PriceItem | undefined {
  for (const c of PRICE_LIST) {
    const hit = c.items.find((i) => i.serviceSlug === slug);
    if (hit) return hit;
  }
  return undefined;
}
