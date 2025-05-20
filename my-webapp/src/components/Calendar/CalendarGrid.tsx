import React from "react";
import { BaseProps, Event } from "../../types";
import CalendarDay from "./CalendarDay";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addDays,
  format,
  isSameDay,
} from "date-fns";
import { ko } from "date-fns/locale";

interface CalendarGridProps extends BaseProps {
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
  events?: Event[];
}

/**
 * 캘린더 그리드 컴포넌트
 * 달력의 날짜 그리드 표시
 */
const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  onDateClick,
  onEventClick,
  events = [],
  className = "",
  ...props
}) => {
  // date-fns를 사용하여 달력에 표시할 날짜 계산
  const getDaysInMonth = (date: Date): Date[] => {
    // 현재 월의 시작과 끝
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // 달력 시작일 (현재 월의 시작일이 속한 주의 일요일)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

    // 달력 종료일 (현재 월의 마지막일이 속한 주의 토요일)
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    // 달력에 표시할 모든 날짜 (이전 달, 현재 달, 다음 달 포함)
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  // 현재 월의 모든 날짜
  const daysInMonth = getDaysInMonth(currentDate);

  // 특정 날짜의 이벤트 필터링
  const getEventsForDate = (date: Date): Event[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return isSameDay(eventDate, date);
    });
  };

  // 주 단위로 날짜 그룹화
  const getWeeksInMonth = (days: Date[]): Date[][] => {
    const weeks: Date[][] = [];
    let week: Date[] = [];

    days.forEach((day, i) => {
      week.push(day);

      // 토요일이거나 마지막 날짜인 경우 주 배열에 추가
      if (day.getDay() === 6 || i === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return weeks;
  };

  // 날짜를 주 단위로 그룹화
  const weeksInMonth = getWeeksInMonth(daysInMonth);

  return (
    <div className={`calendar-grid ${className}`} {...props}>
      {/* 날짜 그리드 (주 단위로 렌더링) */}
      <div className="grid gap-0.5 sm:gap-1.5">
        {weeksInMonth.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
            {week.map((date, dayIndex) => {
              // 현재 월인지 여부 확인
              const isCurrentMonth = isSameMonth(date, currentDate);

              // 해당 날짜의 이벤트 필터링
              const dateEvents = getEventsForDate(date).map((event) => ({
                id: event.id,
                title: event.title,
              }));

              return (
                <CalendarDay
                  key={dayIndex}
                  date={date}
                  isCurrentMonth={isCurrentMonth}
                  events={dateEvents}
                  onClick={() => onDateClick?.(date)}
                  onEventClick={onEventClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
