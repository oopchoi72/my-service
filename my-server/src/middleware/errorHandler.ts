import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from "express";
import { sendError } from "../utils/apiResponse";
import mongoose from "mongoose";

/**
 * 중앙 집중식 오류 처리 미들웨어
 * Express 앱의 마지막 미들웨어로 사용
 */
export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 요청 로그
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} 오류:`,
    err
  );

  // 몽구스 검증 오류
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    sendError(res, messages, 400);
    return;
  }

  // 몽구스 캐스팅 오류
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `유효하지 않은 ${err.path}: ${err.value}`, 400);
    return;
  }

  // Express 유효성 검사 오류
  if (err.status === 400) {
    sendError(res, err.message || "잘못된 요청", 400);
    return;
  }

  // 권한 오류 (미래 확장성)
  if (err.status === 401 || err.status === 403) {
    sendError(res, err.message || "권한이 없습니다", err.status);
    return;
  }

  // 리소스를 찾을 수 없음
  if (err.status === 404) {
    sendError(res, err.message || "리소스를 찾을 수 없습니다", 404);
    return;
  }

  // 기타 모든 오류는 500 서버 오류로 처리
  sendError(res, "서버 오류가 발생했습니다", 500);
};

/**
 * 존재하지 않는 라우트 처리 미들웨어
 */
export const notFoundHandler: RequestHandler = (
  req: Request,
  res: Response
): void => {
  sendError(res, `요청한 리소스를 찾을 수 없습니다: ${req.originalUrl}`, 404);
};

/**
 * async 핸들러 래퍼
 * Promise 오류를 Express 오류 핸들러로 전달
 */
export const asyncHandler =
  (fn: Function): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
