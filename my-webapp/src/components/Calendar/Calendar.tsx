import React, { useState, useEffect } from "react";
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
}

/**
 * 캘린더 컴포넌트
 */
const Calendar: React.FC<CalendarProps> = ({
  onEventClick,
  onDateClick,
  events = [],
  className = "",
  ...props
}) => {
  // 현재 표시할 년/월 상태
  const [currentDate, setCurrentDate] = useState<Date>(
    startOfMonth(new Date())
  );

  // 이전 달로 이동 (date-fns 사용)
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  // 다음 달로 이동 (date-fns 사용)
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(startOfMonth(new Date()));
  };

  // 특정 날짜로 이동 (헤더의 드롭다운 선택 시 사용)
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  // 월별 이벤트 필터링 (date-fns 사용)
  const filterEventsByMonth = (date: Date, allEvents: Event[]): Event[] => {
    const monthStart = startOfMonth(date);

    return allEvents.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return (
        isSameMonth(eventDate, monthStart) && isSameYear(eventDate, monthStart)
      );
    });
  };

  // 현재 월의 이벤트
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Event[]>([]);

  // 현재 월이 변경될 때마다 이벤트 필터링
  useEffect(() => {
    const filteredEvents = filterEventsByMonth(currentDate, events);
    setCurrentMonthEvents(filteredEvents);
  }, [currentDate, events]);

  return (
    <div
      className={`calendar-container bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${className}`}
      {...props}
    >
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        onDateChange={handleDateChange}
        className="bg-white px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200"
      />

      <CalendarGrid
        currentDate={currentDate}
        events={currentMonthEvents}
        onDateClick={onDateClick}
        onEventClick={onEventClick}
        className="p-1 sm:p-2"
      />
    </div>
  );
};

export default Calendar;
