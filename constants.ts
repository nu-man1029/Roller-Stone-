
import { PricingTier } from './types';

export const MINIMUM_SUBTOTAL = 115900;
export const TAX_RATE = 0.10;

// Based on the provided logic
export const PRICING_TIERS: PricingTier[] = [
  { maxArea: 11, price: 11200 },
  { maxArea: 12, price: 11100 },
  { maxArea: 14, price: 11000 },
  { maxArea: 15, price: 10900 },
  { maxArea: 16, price: 10800 },
  { maxArea: 18, price: 10700 },
  { maxArea: 19, price: 10600 },
  { maxArea: 20, price: 10500 },
  { maxArea: 22, price: 10400 },
  { maxArea: 23, price: 10300 },
  { maxArea: 25, price: 10200 },
  { maxArea: 29, price: 10100 },
  { maxArea: 31, price: 10000 },
  { maxArea: 35, price: 9900 },
  { maxArea: 39, price: 9800 },
  { maxArea: 43, price: 9700 },
  { maxArea: 47, price: 9600 },
  { maxArea: 51, price: 9500 },
  { maxArea: 55, price: 9400 },
  { maxArea: 62, price: 9400 }, // Gap coverage based on logical flow
  { maxArea: Infinity, price: 9200 },
];

export const getUnitPriceByArea = (area: number): number => {
  // If area is less than 10, typically min price applies, but we use the 10-11 tier unit price for display
  if (area < 10) return 11200; 
  
  const tier = PRICING_TIERS.find(t => area <= t.maxArea);
  return tier ? tier.price : 9200;
};
