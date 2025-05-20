import React from "react";
import { BaseProps, Event } from "../../types";

interface EventModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  mode: "create" | "edit" | "view";
  onSave?: (data: any) => void;
  onDelete?: () => void;
}

/**
 * 이벤트 모달 컴포넌트
 * 이벤트 보기, 생성, 수정 기능 제공
 */
const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  mode,
  onSave,
  onDelete,
  className = "",
  ...props
}) => {
  if (!isOpen) return null;

  // 모달 타이틀 결정
  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "새 일정 추가";
      case "edit":
        return "일정 수정";
      case "view":
        return "일정 상세";
      default:
        return "일정";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-md ${className}`}
        {...props}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{getModalTitle()}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        <div className="mt-4">
          {mode === "view" ? (
            <EventDetails event={event} />
          ) : (
            <EventForm
              event={event}
              mode={mode}
              onSave={onSave}
              onCancel={onClose}
            />
          )}
        </div>

        {mode === "view" && event && (
          <div className="flex justify-end mt-6 space-x-2">
            <button
              onClick={() => onDelete?.()}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              삭제
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 임시 컴포넌트 - 나중에 분리할 예정
const EventDetails: React.FC<{ event?: Event }> = ({ event }) => {
  if (!event) return <div>이벤트 정보가 없습니다.</div>;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">제목</h4>
        <p className="text-lg">{event.title}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">시작 일시</h4>
        <p>{new Date(event.startDateTime).toLocaleString("ko-KR")}</p>
      </div>

      {event.endDateTime && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">종료 일시</h4>
          <p>{new Date(event.endDateTime).toLocaleString("ko-KR")}</p>
        </div>
      )}

      {event.description && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">설명</h4>
          <p className="whitespace-pre-line">{event.description}</p>
        </div>
      )}
    </div>
  );
};

// 임시 컴포넌트 - 나중에 분리할 예정
const EventForm: React.FC<{
  event?: Event;
  mode: "create" | "edit";
  onSave?: (data: any) => void;
  onCancel: () => void;
}> = ({ event, mode, onSave, onCancel }) => {
  // 폼 구현은 다음 작업에서 진행
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-500">폼 구현 예정</p>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          취소
        </button>
        <button
          onClick={() => onSave?.({ title: "테스트" })}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default EventModal;
