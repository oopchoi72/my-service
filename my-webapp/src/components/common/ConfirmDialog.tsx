import React, { useEffect, useRef, useState } from "react";
import { BaseProps } from "../../types";

interface ConfirmDialogProps extends BaseProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

/**
 * 사용자 확인을 요청하는 대화상자 컴포넌트
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
  isDanger = false,
  className = "",
  ...props
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  // 대화상자가 열릴 때 애니메이션을 위한 상태 변경
  useEffect(() => {
    if (isOpen) {
      // 대화상자가 DOM에 마운트된 후 애니메이션 시작
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setShowDialog(false);
    }
  }, [isOpen]);

  // ESC 키 누를 때 대화상자 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onCancel]);

  // 대화상자 내부 클릭 시 이벤트 전파 방지
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
        showDialog ? "opacity-100" : "opacity-0"
      }`}
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        ref={dialogRef}
        onClick={handleDialogClick}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out ${
          showDialog ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${className}`}
        {...props}
      >
        {/* 대화상자 헤더 */}
        <div
          className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          id="confirm-dialog-title"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        {/* 대화상자 내용 */}
        <div className="px-6 py-4">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        {/* 대화상자 푸터 - 버튼 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            } text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;