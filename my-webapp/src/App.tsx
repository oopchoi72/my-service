import React, { useState } from "react";
import Layout from "./components/common/Layout";
import Header from "./components/common/Header";
import Calendar from "./components/Calendar/Calendar";
import EventModal from "./components/EventModal/EventModal";
import { QueryErrorBoundary, RetryIndicator } from "./components/common";
import { Event } from "./types";
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
  });

  // 테스트용 이벤트 데이터
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "데모 이벤트 1",
      startDateTime: new Date().toISOString(),
      description: "테스트용 이벤트 설명입니다.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "데모 이벤트 2",
      startDateTime: new Date(
        new Date().setDate(new Date().getDate() + 2)
      ).toISOString(),
      description: "테스트용 두 번째 이벤트입니다.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // 새 일정 추가 핸들러
  const handleAddEvent = () => {
    setModalState({
      isOpen: true,
      mode: "create",
      eventId: "",
    });
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setModalState({
      isOpen: true,
      mode: "create",
      eventId: "",
    });
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (eventId: string) => {
    setModalState({
      isOpen: true,
      mode: "view",
      eventId,
    });
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
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
            <Calendar
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              className="transform transition-all hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* 이벤트 모달 */}
        <EventModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          mode={modalState.mode}
          event={events.find((e) => e.id === modalState.eventId)}
          onSave={(data) => {
            console.log("저장된 데이터:", data);
            handleCloseModal();
          }}
          onDelete={() => {
            console.log("이벤트 삭제:", modalState.eventId);
            handleCloseModal();
          }}
        />

        {/* 재시도 표시기 */}
        <RetryIndicator position="bottom" autoHide={true} hideDelay={3000} />
      </Layout>
    </QueryErrorBoundary>
  );
}

export default App;
