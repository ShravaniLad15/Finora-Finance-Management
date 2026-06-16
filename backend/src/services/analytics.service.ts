import { DateRangePreset } from "../enums/date-range.enum";
import { getDateRange } from "../utils/date";

export const summaryAnalyticsService = async(
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date, 
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo)

}