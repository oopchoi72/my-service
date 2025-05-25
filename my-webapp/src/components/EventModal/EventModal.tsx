import React, { useEffect, useRef, useState } from "react";
import { BaseProps, Event, CreateEventDto, UpdateEventDto } from "../../types";
import { format } from "date-fns";
import { Spinner } from "../common";

interface EventModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  mode: "create" | "edit" | "view";
  onSave?: (data: CreateEventDto | UpdateEventDto) => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  selectedDate?: Date; // 달력에서 선택된 날짜
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
  isSaving = false,
  isDeleting = false,
  className = "",
  selectedDate,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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

  // 모달 타이틀 아이콘 결정
  const getTitleIcon = () => {
    switch (mode) {
      case "create":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4"></path>
          </svg>
        );
      case "edit":
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
        );
      case "view":
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-auto w-full max-w-md animate-scaleIn ${className}`}
        {...props}
      >
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getTitleIcon()}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getModalTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            aria-label="닫기"
            disabled={isSaving || isDeleting}
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
          {mode === "view" ? (
            <EventDetails event={event} />
          ) : (
            <EventForm
              event={event}
              mode={mode}
              onSave={onSave}
              onCancel={onClose}
              isSaving={isSaving}
              selectedDate={selectedDate}
            />
          )}
        </div>

        {/* 모달 푸터 (보기 모드에서만) */}
        {mode === "view" && event && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
            <button
              onClick={() => onDelete?.()}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center space-x-1"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              )}
              <span>{isDeleting ? "삭제 중..." : "삭제"}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center space-x-1"
              disabled={isDeleting}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>닫기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 이벤트 상세 정보 컴포넌트
const EventDetails: React.FC<{ event?: Event }> = ({ event }) => {
  if (!event)
    return (
      <div className="text-center py-6 text-gray-500">
        이벤트 정보가 없습니다.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          제목
        </h4>
        <p className="text-xl font-medium text-gray-900 dark:text-white mt-1">
          {event.title}
        </p>
      </div>

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
            {new Date(event.startDateTime).toLocaleString("ko-KR")}
          </p>
        </div>
      </div>

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
              {new Date(event.endDateTime).toLocaleString("ko-KR")}
            </p>
          </div>
        </div>
      )}

      {event.description && (
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
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
        <p>생성일: {new Date(event.createdAt).toLocaleString("ko-KR")}</p>
        <p>수정일: {new Date(event.updatedAt).toLocaleString("ko-KR")}</p>
      </div>
    </div>
  );
};

// 임시 컴포넌트 - 나중에 분리할 예정
const EventForm: React.FC<{
  event?: Event;
  mode: "create" | "edit";
  onSave?: (data: CreateEventDto | UpdateEventDto) => void;
  onCancel: () => void;
  isSaving?: boolean;
  selectedDate?: Date;
}> = ({ event, mode, onSave, onCancel, isSaving = false, selectedDate }) => {
  // 폼 상태 관리
  const [title, setTitle] = useState(event?.title || "");
  const [startDateTime, setStartDateTime] = useState(() => {
    if (event?.startDateTime) {
      // 수정 모드일 때는 기존 이벤트의 시작일시 사용
      return format(new Date(event.startDateTime), "yyyy-MM-dd'T'HH:mm");
    } else if (selectedDate) {
      // 새 일정 생성시 선택된 날짜 사용 (시간은 현재 시간으로 설정)
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(now.getHours(), now.getMinutes());
      return format(selectedDateTime, "yyyy-MM-dd'T'HH:mm");
    } else {
      // 기본값: 현재 날짜와 시간
      return format(new Date(), "yyyy-MM-dd'T'HH:mm");
    }
  });
  const [endDateTime, setEndDateTime] = useState(
    event?.endDateTime
      ? format(new Date(event.endDateTime), "yyyy-MM-dd'T'HH:mm")
      : ""
  );
  const [description, setDescription] = useState(event?.description || "");

  // 오류 상태 관리
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 필드 터치 상태 관리 (사용자가 필드와 상호작용했는지 추적)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 폼 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // ID에 따라 상태 업데이트
    switch (id) {
      case "title":
        setTitle(value);
        break;
      case "startDateTime":
        setStartDateTime(value);
        break;
      case "endDateTime":
        setEndDateTime(value);
        break;
      case "description":
        setDescription(value);
        break;
    }

    // 필드가 수정되었을 때 해당 필드 오류 메시지 지우기
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // 필드 블러 핸들러 (포커스를 잃었을 때)
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id } = e.target;

    // 필드를 터치 상태로 표시
    setTouched((prev) => ({ ...prev, [id]: true }));

    // 단일 필드 유효성 검사
    validateField(id);
  };

  // 단일 필드 유효성 검사
  const validateField = (fieldName: string) => {
    let error = "";

    switch (fieldName) {
      case "title":
        if (!title.trim()) {
          error = "제목을 입력해주세요";
        } else if (title.length > 100) {
          error = "제목은 100자를 초과할 수 없습니다";
        }
        break;

      case "startDateTime":
        if (!startDateTime) {
          error = "시작 일시를 입력해주세요";
        } else {
          const startDate = new Date(startDateTime);
          if (isNaN(startDate.getTime())) {
            error = "유효한 날짜 및 시간을 입력해주세요";
          }
        }
        break;

      case "endDateTime":
        if (endDateTime) {
          const startDate = new Date(startDateTime);
          const endDate = new Date(endDateTime);

          if (isNaN(endDate.getTime())) {
            error = "유효한 날짜 및 시간을 입력해주세요";
          } else if (endDate <= startDate) {
            error = "종료 일시는 시작 일시보다 이후여야 합니다";
          }
        }
        break;

      case "description":
        if (description && description.length > 1000) {
          error = "설명은 1000자를 초과할 수 없습니다";
        }
        break;
    }

    // 오류 상태 업데이트
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  // 폼 전체 유효성 검사
  const validateForm = () => {
    // 모든 필드 유효성 검사
    const titleValid = validateField("title");
    const startDateTimeValid = validateField("startDateTime");
    const endDateTimeValid = validateField("endDateTime");
    const descriptionValid = validateField("description");

    // 모든 필드가 유효한지 확인
    return (
      titleValid && startDateTimeValid && endDateTimeValid && descriptionValid
    );
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드를 터치 상태로 표시하여 유효성 검사 오류를 표시
    setTouched({
      title: true,
      startDateTime: true,
      endDateTime: true,
      description: true,
    });

    if (!validateForm() || isSaving) return;

    try {
      // 날짜 형식을 ISO 문자열로 변환
      const startDateObj = new Date(startDateTime);
      let endDateObj: Date | undefined = undefined;

      if (endDateTime) {
        endDateObj = new Date(endDateTime);
      }

      const formData: CreateEventDto | UpdateEventDto = {
        title,
        startDateTime: startDateObj.toISOString(), // ISO 문자열로 변환
        endDateTime: endDateObj ? endDateObj.toISOString() : undefined, // 있는 경우에만 ISO 문자열로 변환
        description: description || undefined,
      };

      onSave?.(formData);
    } catch (error) {
      console.error("이벤트 저장 중 오류 발생:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-md border ${
            touched.title && errors.title ? "border-red-300" : "border-gray-300"
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="일정 제목을 입력하세요"
          disabled={isSaving}
          required
        />
        {touched.title && errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="startDateTime"
          className="block text-sm font-medium text-gray-700"
        >
          시작 일시 <span className="text-red-500">*</span>
        </label>
        <input
          id="startDateTime"
          type="datetime-local"
          value={startDateTime}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-md border ${
            touched.startDateTime && errors.startDateTime
              ? "border-red-300"
              : "border-gray-300"
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isSaving}
          required
        />
        {touched.startDateTime && errors.startDateTime && (
          <p className="text-xs text-red-500">{errors.startDateTime}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="endDateTime"
          className="block text-sm font-medium text-gray-700"
        >
          종료 일시 (선택사항)
        </label>
        <input
          id="endDateTime"
          type="datetime-local"
          value={endDateTime}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-md border ${
            touched.endDateTime && errors.endDateTime
              ? "border-red-300"
              : "border-gray-300"
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isSaving}
        />
        {touched.endDateTime && errors.endDateTime && (
          <p className="text-xs text-red-500">{errors.endDateTime}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          설명 (선택사항)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-md border ${
            touched.description && errors.description
              ? "border-red-300"
              : "border-gray-300"
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          rows={4}
          placeholder="일정에 대한 상세 설명을 입력하세요"
          disabled={isSaving}
        />
        {touched.description && errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          disabled={isSaving}
        >
          취소
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center space-x-1">
              <Spinner size="sm" className="text-white" />
              <span>저장 중...</span>
            </div>
          ) : (
            <span>저장</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default EventModal;
