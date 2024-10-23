// src/utils/rules/ukRules.ts
import { differenceInCalendarDays, isAfter, isSameDay } from 'date-fns';
import { CountryRules } from '../countryRules';

const ukRules: CountryRules = {
  calculateDaysAbroad: (startUtc: Date, endUtc: Date): number => {
    // If the person left and returned the same day or next day, no days are counted
    if (differenceInCalendarDays(endUtc, startUtc) <= 0) {
      return 0;
    }

    // Exclude the day of departure if in the UK for part of the day
    const adjustedStart = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);

    // Exclude the day of arrival if in the UK for part of the day
    const adjustedEnd = new Date(endUtc.getTime() - 24 * 60 * 60 * 1000);

    const days = differenceInCalendarDays(adjustedEnd, adjustedStart) + 1;

    return days > 0 ? days : 0;
  },

  calculateDaysOutside: (
    holidays: any[],
    periodStart?: Date,
    periodEnd?: Date,
  ): number => {
    const now = new Date();
    const actualPeriodEnd = periodEnd || now;
    const actualPeriodStart =
      periodStart || new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    let totalDays = 0;

    holidays.forEach((holiday) => {
      const holidayStart = new Date(holiday.startDateTime.utc);
      const holidayEnd = new Date(holiday.endDateTime.utc);

      // Find the overlap between holiday and period
      const start = isAfter(holidayStart, actualPeriodStart)
        ? holidayStart
        : actualPeriodStart;
      const end = isAfter(holidayEnd, actualPeriodEnd)
        ? actualPeriodEnd
        : holidayEnd;

      if (isAfter(end, start) || isSameDay(end, start)) {
        const daysAbroad = ukRules.calculateDaysAbroad(start, end);
        totalDays += daysAbroad;
      }
    });

    return totalDays;
  },

  maxAbsentDays: 180,
};

export default ukRules;
