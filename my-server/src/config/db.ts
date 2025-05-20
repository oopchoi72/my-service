import mongoose from "mongoose";
import dotenv from "dotenv";
import { initializeIndexes } from "../models/indexes";

dotenv.config();

/**
 * Connect to MongoDB and initialize database settings
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/calendar-app";
    
    // MongoDB 연결 옵션
    const options = {
      autoIndex: true, // 자동 인덱스 생성 활성화
    };
    
    // 데이터베이스 연결
    await mongoose.connect(mongoURI, options);
    console.log("MongoDB 연결 성공");
    
    // 커스텀 인덱스 초기화
    await initializeIndexes();
    console.log("MongoDB 인덱스 초기화 완료");
    
    // 연결 이벤트 리스너 설정
    mongoose.connection.on('error', err => {
      console.error('MongoDB 연결 오류:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB 연결이 끊어졌습니다. 재연결 시도 중...');
    });
    
  } catch (error) {
    console.error("MongoDB 연결 오류:", error);
    process.exit(1);
  }
};

export default connectDB;
