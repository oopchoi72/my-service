import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 나중에 구현할 페이지 컴포넌트들을 위한 플레이스홀더
const Calendar = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    월간 달력 페이지 (구현 예정)
  </div>
);
const NotFound = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    404 - 페이지를 찾을 수 없습니다
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
