import React, { useState } from "react";
import Layout from "./components/common/Layout";
import Header from "./components/common/Header";
import Calendar from "./components/Calendar/Calendar";
import EventModal from "./components/EventModal/EventModal";
import {
  QueryErrorBoundary,
  RetryIndicator,
  Spinner,
} from "./components/common";
import { CreateEventDto, Event, UpdateEventDto } from "./types";
import { useEvents, useEventMutation } from "./hooks";
import { format } from "date-fns";
import "./App.css";

/**
 * 메인 앱 컴포넌트
 */
function App() {
  // 모달 상태 관리
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit" | "view",
    eventId: "",
    selectedDate: new Date(),
  });

  // API 연동을 위한 훅 사용
  const { events, loading: isLoadingEvents, error: eventsError } = useEvents();
  const {
    createEvent,
    updateEvent,
    deleteEvent,
    loading: isMutating,
  } = useEventMutation();

  // 새 일정 추가 핸들러
  const handleAddEvent = () => {
    setModalState({
      isOpen: true,
      mode: "create",
      eventId: "",
      selectedDate: new Date(),
    });
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setModalState({
      isOpen: true,
      mode: "create",
      eventId: "",
      selectedDate: date,
    });
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (eventId: string) => {
    setModalState({
      isOpen: true,
      mode: "view",
      eventId,
      selectedDate: new Date(),
    });
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // 이벤트 저장 핸들러
  const handleSaveEvent = async (data: CreateEventDto | UpdateEventDto) => {
    try {
      if (modalState.mode === "create") {
        // 선택된 날짜가 있으면 시작 일시에 반영
        const eventData: CreateEventDto = {
          ...(data as CreateEventDto),
          // 사용자가 시작 일시를 지정하지 않았다면 선택된 날짜 사용
          startDateTime:
            data.startDateTime ||
            format(modalState.selectedDate, "yyyy-MM-dd'T'HH:mm"),
        };
        await createEvent(eventData);
      } else if (modalState.mode === "edit" && modalState.eventId) {
        await updateEvent(modalState.eventId, data as UpdateEventDto);
      }

      handleCloseModal();
    } catch (error) {
      console.error("이벤트 저장 중 오류 발생:", error);
    }
  };

  // 이벤트 삭제 핸들러
  const handleDeleteEvent = async () => {
    try {
      if (modalState.eventId) {
        await deleteEvent(modalState.eventId);
        handleCloseModal();
      }
    } catch (error) {
      console.error("이벤트 삭제 중 오류 발생:", error);
    }
  };

  // 이벤트 수정 모드 전환 핸들러
  const handleEditEvent = () => {
    setModalState((prev) => ({
      ...prev,
      mode: "edit",
    }));
  };

  return (
    <QueryErrorBoundary>
      <Layout
        header={<Header title="일정 관리 앱" onAddEvent={handleAddEvent} />}
        footer={
          <div className="text-center text-sm text-gray-500">
            © 2025 캘린더 앱
          </div>
        }
        className="bg-gray-50"
      >
        <div className="container mx-auto py-6">
          <div className="max-w-5xl mx-auto">
            {isLoadingEvents ? (
              <div className="h-96 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : eventsError ? (
              <div className="h-96 flex items-center justify-center">
                <p className="text-red-500">
                  이벤트를 불러오는 중 오류가 발생했습니다.
                </p>
              </div>
            ) : (
              <Calendar
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                className="transform transition-all hover:scale-[1.01]"
              />
            )}
          </div>
        </div>

        {/* 이벤트 모달 */}
        <EventModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          mode={modalState.mode}
          event={events?.find((e) => e.id === modalState.eventId)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          isSaving={isMutating}
          isDeleting={isMutating}
        />

        {/* 재시도 표시기 */}
        <RetryIndicator position="bottom" autoHide={true} hideDelay={3000} />
      </Layout>
    </QueryErrorBoundary>
  );
}

export default App;
