/**
 * 컴포넌트 관련 타입 정의
 */

import { BaseProps, Event, FormValues } from ".";

// 모달 타입
export type ModalType = "create" | "edit" | "view" | "delete";

// 이벤트 모달 속성
export interface EventModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  mode: ModalType;
  onSave?: (data: FormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

// 이벤트 폼 속성
export interface EventFormProps {
  event?: Event;
  mode: "create" | "edit";
  onSave?: (data: FormValues) => void;
  onCancel: () => void;
}

// 이벤트 상세 속성
export interface EventDetailsProps {
  event?: Event;
  onEdit?: () => void;
  onDelete?: () => void;
}

// 캘린더 속성
export interface CalendarProps extends BaseProps {
  onEventClick?: (eventId: string) => void;
  onDateClick?: (date: Date) => void;
  events?: Event[];
}

// 캘린더 헤더 속성
export interface CalendarHeaderProps extends BaseProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

// 캘린더 그리드 속성
export interface CalendarGridProps extends BaseProps {
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
  events?: Event[];
}

// 캘린더 날짜 셀 속성
export interface CalendarDayProps extends BaseProps {
  date: Date;
  isCurrentMonth: boolean;
  events?: Event[];
  onClick?: () => void;
  onEventClick?: (eventId: string) => void;
}
