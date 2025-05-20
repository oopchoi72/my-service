import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import { createServer } from "http";

// 환경 변수 로드
dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);
const FALLBACK_PORT = PORT + 1;

// MongoDB 연결
connectDB();

// 포트 충돌 감지 및 대응 메커니즘
const startServer = (port: number, maxRetries = 3, retryCount = 0) => {
  const server = createServer(app);
  
  server.on('error', (e: NodeJS.ErrnoException) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`포트 ${port}가 이미 사용 중입니다.`);
      
      if (retryCount < maxRetries) {
        console.log(`새로운 포트 ${port + 1}로 서버 시작을 시도합니다...`);
        server.close();
        startServer(port + 1, maxRetries, retryCount + 1);
      } else {
        console.error(`최대 재시도 횟수(${maxRetries})를 초과했습니다.`);
        console.error(`다음 방법으로 문제를 해결할 수 있습니다:
1. .env 파일에서 PORT 값을 변경하세요.
2. 현재 ${port} 포트를 사용 중인 프로세스를 종료하세요.
3. docker-compose.yml 파일에서 백엔드 서비스의 포트 매핑을 변경하세요.`);
        process.exit(1);
      }
    } else {
      console.error('서버 시작 중 오류 발생:', e);
      process.exit(1);
    }
  });
  
  server.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
    console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // 예기치 않은 오류 처리
  process.on("unhandledRejection", (err: Error) => {
    console.log(`오류: ${err.message}`);
    server.close(() => process.exit(1));
  });
  
  return server;
};

// 서버 시작
const server = startServer(PORT);
