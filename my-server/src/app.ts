import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import eventRoutes from "./routes/eventRoutes";

const app = express();

// 미들웨어
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 라우트
app.use("/api/events", eventRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("캘린더 API 서버가 실행 중입니다.");
});

// 존재하지 않는 라우트에 대한 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "요청한 리소스를 찾을 수 없습니다.",
  });
});

export default app;
