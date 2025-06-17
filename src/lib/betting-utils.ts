import {
  Odds,
  AmericanOdds,
  DecimalOdds,
  FractionalOdds,
  OddsFormat,
  FormatCurrency,
  FormatOdds,
  CalculatePayout,
  ConvertOdds,
} from '@/types/betting';

/**
 * Formats credits as currency (1 credit = $0.01)
 */
export const formatCurrency: FormatCurrency = (credits: number): string => {
  const dollars = credits / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
};

/**
 * Formats credits as a simple number with "credits" suffix
 */
export const formatCredits = (credits: number): string => {
  return `${credits.toLocaleString()} credits`;
};

/**
 * Converts American odds to decimal odds
 */
export const americanToDecimal = (american: number): number => {
  if (american > 0) {
    return american / 100 + 1;
  } else {
    return 100 / Math.abs(american) + 1;
  }
};

/**
 * Converts decimal odds to American odds
 */
export const decimalToAmerican = (decimal: number): number => {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  } else {
    return Math.round(-100 / (decimal - 1));
  }
};

/**
 * Converts American odds to fractional odds
 */
export const americanToFractional = (american: number): string => {
  if (american > 0) {
    return `${american}/100`;
  } else {
    return `100/${Math.abs(american)}`;
  }
};

/**
 * Converts fractional odds to American odds
 */
export const fractionalToAmerican = (fractional: string): number => {
  const [numerator, denominator] = fractional.split('/').map(Number);
  const decimal = numerator / denominator + 1;
  return decimalToAmerican(decimal);
};

/**
 * Converts odds between different formats
 */
export const convertOdds: ConvertOdds = (
  odds: Odds,
  targetFormat: OddsFormat
): Odds => {
  if (odds.format === targetFormat) {
    return odds;
  }

  let americanValue: number;

  // First convert to American odds as intermediate
  switch (odds.format) {
    case 'american':
      americanValue = (odds as AmericanOdds).value;
      break;
    case 'decimal':
      americanValue = decimalToAmerican((odds as DecimalOdds).value);
      break;
    case 'fractional':
      americanValue = fractionalToAmerican((odds as FractionalOdds).value);
      break;
  }

  // Then convert from American to target format
  switch (targetFormat) {
    case 'american':
      return { value: americanValue, format: 'american' } as AmericanOdds;
    case 'decimal':
      return {
        value: americanToDecimal(americanValue),
        format: 'decimal',
      } as DecimalOdds;
    case 'fractional':
      return {
        value: americanToFractional(americanValue),
        format: 'fractional',
      } as FractionalOdds;
  }
};

/**
 * Formats odds for display
 */
export const formatOdds: FormatOdds = (
  odds: Odds,
  targetFormat?: OddsFormat
): string => {
  const displayOdds = targetFormat ? convertOdds(odds, targetFormat) : odds;

  switch (displayOdds.format) {
    case 'american':
      const americanOdds = displayOdds as AmericanOdds;
      return americanOdds.value > 0
        ? `+${americanOdds.value}`
        : `${americanOdds.value}`;
    case 'decimal':
      const decimalOdds = displayOdds as DecimalOdds;
      return decimalOdds.value.toFixed(2);
    case 'fractional':
      const fractionalOdds = displayOdds as FractionalOdds;
      return fractionalOdds.value;
  }
};

/**
 * Calculates potential payout from stake and odds
 */
export const calculatePayout: CalculatePayout = (
  stake: number,
  odds: Odds
): number => {
  const decimalOdds =
    odds.format === 'decimal'
      ? (odds as DecimalOdds).value
      : americanToDecimal(convertOdds(odds, 'american').value as number);

  return Math.round(stake * decimalOdds);
};

/**
 * Calculates profit (payout minus stake)
 */
export const calculateProfit = (stake: number, odds: Odds): number => {
  return calculatePayout(stake, odds) - stake;
};

/**
 * Converts odds to implied probability percentage
 */
export const oddsToImpliedProbability = (odds: Odds): number => {
  const decimalOdds =
    odds.format === 'decimal'
      ? (odds as DecimalOdds).value
      : americanToDecimal(convertOdds(odds, 'american').value as number);

  return (1 / decimalOdds) * 100;
};

/**
 * Validates stake amount
 */
export const validateStake = (
  stake: number,
  minStake: number = 1,
  maxStake: number = 100000
): { valid: boolean; error?: string } => {
  if (stake < minStake) {
    return {
      valid: false,
      error: `Minimum stake is ${formatCredits(minStake)}`,
    };
  }
  if (stake > maxStake) {
    return {
      valid: false,
      error: `Maximum stake is ${formatCredits(maxStake)}`,
    };
  }
  if (!Number.isInteger(stake)) {
    return { valid: false, error: 'Stake must be a whole number of credits' };
  }
  return { valid: true };
};

/**
 * Formats date for betting history
 */
export const formatBetDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
