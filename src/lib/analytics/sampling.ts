
import { SAMPLING_RATES } from './constants';

// Determine if an event should be sampled based on category
export const shouldSampleEvent = (category: string): boolean => {
  const rate = SAMPLING_RATES[category as keyof typeof SAMPLING_RATES] || 1.0;
  return Math.random() <= rate;
};
