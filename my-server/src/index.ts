import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

// 환경 변수 로드
dotenv.config();

const PORT = process.env.PORT || 5000;

// MongoDB 연결
connectDB();

// 서버 시작
const server = app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});

// 예기치 않은 오류 처리
process.on("unhandledRejection", (err: Error) => {
  console.log(`오류: ${err.message}`);
  server.close(() => process.exit(1));
});
