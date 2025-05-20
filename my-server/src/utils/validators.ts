/**
 * Validation utility functions for data models
 */

/**
 * Check if a date is valid
 * @param date Date to check
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Check if a date is in the future
 * @param date Date to check
 * @returns True if the date is in the future, false otherwise
 */
export const isFutureDate = (date: Date): boolean => {
  if (!isValidDate(date)) return false;
  return date > new Date();
};

/**
 * Check if an end date is after a start date
 * @param startDate The start date
 * @param endDate The end date
 * @returns True if the end date is after the start date, false otherwise
 */
export const isEndAfterStart = (startDate: Date, endDate: Date): boolean => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  return endDate > startDate;
};

/**
 * Format a date string to a Date object
 * @param dateString The date string to format
 * @returns A Date object or null if the date string is invalid
 */
export const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
};