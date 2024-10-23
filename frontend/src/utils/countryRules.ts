// frontend/src/utils/countryRules.ts
import ukRules from './rules/ukRules';
// Future imports for other countries
// import usRules from './rules/usRules';

export interface CountryRules {
  calculateDaysAbroad: (startUtc: Date, endUtc: Date) => number;
  calculateDaysOutside: (
    holidays: any[],
    periodStart?: Date,
    periodEnd?: Date,
  ) => number;
  maxAbsentDays: number; // Maximum allowable absent days in a 12-month period
}

const countryRulesMap: { [key: string]: CountryRules } = {
  UK: ukRules,
  // US: usRules,
  // 'New Zealand': nzRules,
};

export default countryRulesMap;
