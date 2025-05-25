import React from "react";
import { BaseProps } from "../../types";

interface EventItemProps extends BaseProps {
  eventId: string;
  title: string;
  color?: string;
  onClick: (eventId: string) => void;
}

/**
 * 일정 아이템 컴포넌트
 * 달력의 날짜 셀 내에 표시되는 개별 일정
 */
const EventItem: React.FC<EventItemProps> = ({
  eventId,
  title,
  color = "blue",
  onClick,
  className = "",
  ...props
}) => {
  // 색상 변형 처리
  const getColorClasses = (baseColor: string) => {
    switch (baseColor) {
      case "red":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/70";
      case "green":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/70";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-800/70";
      case "purple":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800/70";
      case "indigo":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/70";
      case "pink":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:hover:bg-pink-800/70";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/70";
    }
  };

  const colorClasses = getColorClasses(color);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (날짜 셀 클릭 이벤트 전파 방지)
    onClick(eventId);
  };

  return (
    <div
      className={`event text-xs ${colorClasses} rounded-sm px-1 sm:px-1.5 py-0.5 mb-0.5 truncate cursor-pointer transition-colors shadow-sm ${className}`}
      onClick={handleClick}
      title={title}
      {...props}
    >
      {title}
    </div>
  );
};

export default EventItem;
