import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export const getMonthDays = (month: number, year: number) => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);

  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const formatDate = (date: Date, formatString: string = "yyyy-MM-dd") => {
  return format(date, formatString);
};

export const formatTime = (date: Date, formatString: string = "HH:mm") => {
  return format(date, formatString);
};

export const formatDateTimeForDisplay = (date: Date) => {
  return format(date, "yyyy년 MM월 dd일 HH:mm");
};

export const dateToISOString = (date: Date) => {
  return date.toISOString();
};

export const getCurrentMonth = () => {
  return new Date().getMonth() + 1; // JavaScript는 0부터 시작하므로 1을 더함
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};
