import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import eventRoutes from "./routes/eventRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// 기본 미들웨어 구성
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 요청 본문 사이즈 한도 설정
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API 라우트
app.use("/api/events", eventRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("캘린더 API 서버가 실행 중입니다.");
});

// API 문서화 라우트 (후에 추가 가능)
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "캘린더 API",
    version: "1.0.0",
    endpoints: [
      { method: "GET", path: "/api/events", description: "일정 목록 조회" },
      { method: "GET", path: "/api/events/:id", description: "특정 일정 조회" },
      { method: "POST", path: "/api/events", description: "새 일정 생성" },
      { method: "PUT", path: "/api/events/:id", description: "일정 업데이트" },
      { method: "DELETE", path: "/api/events/:id", description: "일정 삭제" },
    ],
  });
});

// 헬스체크 엔드포인트
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 오류 처리 - 임시 주석 처리 (와일드카드 라우트 문제 가능성)
// app.use("*", notFoundHandler);

// 중앙 오류 처리
app.use(errorHandler);

export default app;
