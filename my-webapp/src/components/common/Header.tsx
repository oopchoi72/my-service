import React from "react";
import { BaseProps } from "../../types";

interface HeaderProps extends BaseProps {
  title?: string;
  onAddEvent?: () => void;
}

/**
 * 애플리케이션 헤더 컴포넌트
 */
const Header: React.FC<HeaderProps> = ({
  title = "일정 관리 앱",
  onAddEvent,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`flex justify-between items-center w-full ${className}`}
      {...props}
    >
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center space-x-4">
        {onAddEvent && (
          <button
            onClick={onAddEvent}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            새 일정 추가
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
