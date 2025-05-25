import React, { useState, useEffect, useCallback } from "react";
import { BaseProps, Event } from "../../types";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import {
  addMonths,
  subMonths,
  isSameMonth,
  isSameYear,
  startOfMonth,
} from "date-fns";

interface CalendarProps extends BaseProps {
  onEventClick?: (eventId: string) => void;
  onDateClick?: (date: Date) => void;
  events?: Event[];
  maxEventsPerDay?: number;
}

/**
 * 캘린더 컴포넌트
 */
const Calendar: React.FC<CalendarProps> = ({
  onEventClick,
  onDateClick,
  events = [],
  maxEventsPerDay = 3,
  className = "",
  ...props
}) => {
  // 현재 표시할 년/월 상태
  const [currentDate, setCurrentDate] = useState<Date>(
    startOfMonth(new Date())
  );

  // 특정 월에 해당하는 이벤트만 필터링하는 함수
  const filterEventsByMonth = useCallback((date: Date, allEvents: Event[]) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    return allEvents.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return isSameMonth(eventDate, date) && isSameYear(eventDate, date);
    });
  }, []);

  // 현재 월에 해당하는 이벤트 상태
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(
    filterEventsByMonth(currentDate, events)
  );

  // 현재 월이 변경되거나 이벤트 데이터가 변경될 때마다 필터링된 이벤트 업데이트
  useEffect(() => {
    setFilteredEvents(filterEventsByMonth(currentDate, events));
  }, [currentDate, events, filterEventsByMonth]);

  // 이전 월로 이동
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // 다음 월로 이동
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(startOfMonth(new Date()));
  };

  // 날짜 직접 변경
  const handleDateChange = (date: Date) => {
    setCurrentDate(startOfMonth(date));
  };

  return (
    <div
      className={`calendar-container bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={goToToday}
        onDateChange={handleDateChange}
        className="bg-white dark:bg-gray-800 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700"
      />
      <CalendarGrid
        currentDate={currentDate}
        events={filteredEvents}
        onDateClick={onDateClick}
        onEventClick={onEventClick}
        maxEventsPerDay={maxEventsPerDay}
        className="p-1 sm:p-2"
      />
    </div>
  );
};

export default Calendar;
