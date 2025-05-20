import React from "react";
import { BaseProps } from "../../types";

interface SpinnerProps extends BaseProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "light";
  fullScreen?: boolean;
}

/**
 * 로딩 상태를 표시하는 스피너 컴포넌트
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
  className = "",
  ...props
}) => {
  // 크기별 클래스
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  // 색상 변형별 클래스
  const variantClasses = {
    primary: "border-t-blue-500",
    secondary: "border-t-purple-500",
    light: "border-t-white",
  };

  // 전체 화면 모드일 경우 추가 클래스
  const fullScreenClasses = fullScreen
    ? "fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50"
    : "";

  return (
    <div className={`${fullScreenClasses} ${className}`} {...props}>
      <div
        className={`rounded-full border-gray-300 ${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
