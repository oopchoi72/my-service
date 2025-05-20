import React from "react";
import { BaseProps } from "../../types";
import { isToday, isSameDay, isWeekend, isSunday, format } from "date-fns";
import EventItem from "./EventItem";

interface CalendarDayProps extends BaseProps {
  date: Date;
  isCurrentMonth: boolean;
  events?: { id: string; title: string; color?: string }[];
  onClick?: () => void;
  onEventClick?: (eventId: string) => void;
  maxVisibleEvents?: number;
}

/**
 * 캘린더 날짜 컴포넌트
 * 달력의 개별 날짜 셀
 */
const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  events = [],
  onClick,
  onEventClick,
  maxVisibleEvents = 3,
  className = "",
  ...props
}) => {
  // 날짜 클래스 계산
  const dateClasses = [
    isToday(date) ? "font-bold text-blue-700 dark:text-blue-400" : "",
    isCurrentMonth ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500",
    isSunday(date) ? "text-red-500 dark:text-red-400" : "",
    isWeekend(date) && !isSunday(date) ? "text-indigo-500 dark:text-indigo-400" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // 컨테이너 클래스 계산
  const dayClasses = [
    "day-cell p-1 sm:p-1.5 min-h-[60px] sm:min-h-24 border border-gray-200 dark:border-gray-700 rounded-sm transition-all",
    isCurrentMonth 
      ? "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
      : "bg-gray-50 dark:bg-gray-900/50",
    isToday(date) ? "border-blue-500 dark:border-blue-600 border-2 shadow-sm" : "",
    "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 표시할 이벤트 수 제한
  const visibleEvents = events.slice(0, maxVisibleEvents);
  const hiddenEventsCount = Math.max(0, events.length - maxVisibleEvents);

  return (
    <div className={dayClasses} onClick={onClick} {...props}>
      <div className="flex flex-col h-full">
        {/* 날짜 표시 */}
        <div className="text-right mb-1">
          <span
            className={`text-xs sm:text-sm inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full leading-5 sm:leading-6 text-center ${dateClasses} ${
              isToday(date) ? "bg-blue-100 dark:bg-blue-900/50" : ""
            }`}
          >
            {format(date, "d")}
          </span>
        </div>

        {/* 이벤트 목록 */}
        <div className="flex-grow overflow-y-auto max-h-12 sm:max-h-16 space-y-0.5 sm:space-y-1">
          {visibleEvents.map((event) => (
            <EventItem
              key={event.id}
              eventId={event.id}
              title={event.title}
              color={event.color}
              onClick={(eventId) => onEventClick?.(eventId)}
            />
          ))}
          
          {/* 추가 이벤트가 있는 경우 더보기 표시 */}
          {hiddenEventsCount > 0 && (
            <div 
              className="text-xs text-gray-500 dark:text-gray-400 px-1 py-0.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // 더 보기 클릭 시 날짜 클릭 이벤트를 발생시켜서 해당 날짜의 모든 이벤트를 볼 수 있도록 함
                onClick?.();
              }}
            >
              +{hiddenEventsCount}개 더보기
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;