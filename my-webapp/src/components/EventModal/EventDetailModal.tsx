import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Event } from "../../types/event";
import { BaseProps } from "../../types";
import { Spinner } from "../common";

interface EventDetailModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event; // 이벤트가 없을 수도 있으므로 옵셔널로 변경
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

/**
 * 이벤트 상세 정보를 표시하는 모달 컴포넌트
 */
const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  isLoading = false,
  className = "",
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  // 모달이 열릴 때 애니메이션을 위한 상태 변경
  useEffect(() => {
    if (isOpen) {
      // 모달이 DOM에 마운트된 후 애니메이션 시작
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // ESC 키 누를 때 모달 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="event-detail-title"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-auto w-full max-w-md transform transition-all duration-300 ease-in-out ${
          showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${className}`}
        {...props}
      >
        {/* 모달 헤더 */}
        <div
          className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
          id="event-detail-title"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-purple-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {event ? event.title : "일정 상세"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 모달 컨텐츠 */}
        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" variant="primary" />
            </div>
          ) : (
            <EventDetailContent event={event} />
          )}
        </div>

        {/* 모달 푸터 - 액션 버튼 */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !event}
          >
            삭제
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !event}
          >
            수정
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 이벤트 상세 정보 컴포넌트
 */
const EventDetailContent: React.FC<{ event?: Event }> = ({ event }) => {
  /**
   * 날짜를 사용자 친화적인 형식으로 포맷팅하는 함수
   */
  const formatDate = (
    dateString: string,
    formatStr: string = "yyyy년 MM월 dd일 HH시 mm분"
  ) => {
    try {
      return format(new Date(dateString), formatStr);
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return dateString;
    }
  };

  if (!event) {
    return (
      <div className="text-center py-10 space-y-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-gray-500 dark:text-gray-400">
          이벤트 정보를 불러올 수 없습니다.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          제목
        </h4>
        <p className="text-xl font-medium text-gray-900 dark:text-white mt-1">
          {event.title}
        </p>
      </div>

      {/* 시작 시간 */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          시작 일시
        </h4>
        <div className="flex items-center space-x-2 mt-1">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-lg text-gray-900 dark:text-white">
            {formatDate(event.startDateTime)}
          </p>
        </div>
      </div>

      {/* 종료 시간 (있는 경우만) */}
      {event.endDateTime && (
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            종료 일시
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-lg text-gray-900 dark:text-white">
              {formatDate(event.endDateTime)}
            </p>
          </div>
        </div>
      )}

      {/* 설명 (있는 경우만) */}
      {event.description ? (
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            설명
          </h4>
          <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              {event.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700 py-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            설명
          </h4>
          <p className="text-gray-400 dark:text-gray-500 mt-2 italic">
            설명이 없습니다.
          </p>
        </div>
      )}

      {/* 생성 및 수정 시간 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
        <p>생성일: {formatDate(event.createdAt, "yyyy-MM-dd HH:mm")}</p>
        <p>수정일: {formatDate(event.updatedAt, "yyyy-MM-dd HH:mm")}</p>
      </div>
    </div>
  );
};

export default EventDetailModal;
