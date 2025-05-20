import { Response } from 'express';

// API 응답 인터페이스
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | string[];
  count?: number;
}

/**
 * 성공 응답 유틸리티 함수
 * @param res Express Response 객체
 * @param data 응답 데이터
 * @param statusCode HTTP 상태 코드 (기본값: 200)
 * @param count 데이터 항목 수 (목록 API에서 사용)
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  count?: number
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    success: true,
    data
  };

  if (count !== undefined) {
    response.count = count;
  }

  return res.status(statusCode).json(response);
};

/**
 * 오류 응답 유틸리티 함수
 * @param res Express Response 객체
 * @param error 오류 메시지 또는 메시지 배열
 * @param statusCode HTTP 상태 코드 (기본값: 500)
 */
export const sendError = (
  res: Response,
  error: string | string[],
  statusCode: number = 500
): Response<ApiResponse<null>> => {
  return res.status(statusCode).json({
    success: false,
    error
  });
};

/**
 * Mongoose ValidationError 처리 함수
 * @param res Express Response 객체
 * @param error Mongoose ValidationError 객체
 */
export const handleValidationError = (res: Response, error: any): Response<ApiResponse<null>> => {
  const messages = Object.values(error.errors).map((val: any) => val.message);
  return sendError(res, messages, 400);
};