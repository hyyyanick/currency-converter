export type Currency = 'EUR' | 'USD';

export interface ConversionHistory {
  realTimeRate: number;
  fixedRate: number | null;
  initialAmount: number;
  initialCurrency: Currency;
  convertedAmount: number;
  convertedCurrency: Currency;
}
