
export interface PriceResult {
  area: number;
  unitPrice: number;
  subtotalRaw: number;
  subtotalFinal: number;
  tax: number;
  total: number;
  isMinimumApplied: boolean;
}

export interface PricingTier {
  maxArea: number;
  price: number;
}
