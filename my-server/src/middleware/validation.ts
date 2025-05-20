import { Request, Response, NextFunction } from 'express';
import { isValidDate, isEndAfterStart, parseDate } from '../utils/validators';
import { sendError } from '../utils/apiResponse';

/**
 * 일정 생성 및 업데이트 데이터 검증 미들웨어
 * @route POST /api/events, PUT /api/events/:id
 */
export const validateEventData = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, startDateTime, endDateTime } = req.body;
  const errors: string[] = [];

  // 제목 검증
  if (!title) {
    errors.push('일정 제목은 필수입니다');
  } else if (typeof title !== 'string') {
    errors.push('일정 제목은 문자열이어야 합니다');
  } else if (title.trim().length < 2) {
    errors.push('제목은 최소 2자 이상이어야 합니다');
  } else if (title.length > 100) {
    errors.push('제목은 100자 이내여야 합니다');
  }

  // 설명 검증 (선택 필드)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('설명은 문자열이어야 합니다');
    } else if (description.length > 500) {
      errors.push('설명은 500자 이내여야 합니다');
    }
  }

  // 시작 일시 검증
  if (!startDateTime) {
    errors.push('시작 일시는 필수입니다');
  } else {
    const parsedStartDate = parseDate(startDateTime);
    if (!parsedStartDate) {
      errors.push('시작 일시 형식이 올바르지 않습니다');
    } else {
      // 요청 객체에 정확한 날짜 객체 저장
      req.body.startDateTime = parsedStartDate;
    }
  }

  // 종료 일시 검증 (선택 필드)
  if (endDateTime) {
    const parsedEndDate = parseDate(endDateTime);
    if (!parsedEndDate) {
      errors.push('종료 일시 형식이 올바르지 않습니다');
    } else {
      // 요청 객체에 정확한 날짜 객체 저장
      req.body.endDateTime = parsedEndDate;
      
      // 종료 일시가 시작 일시보다 뒤에 있는지 확인
      const parsedStartDate = parseDate(startDateTime);
      if (parsedStartDate && !isEndAfterStart(parsedStartDate, parsedEndDate)) {
        errors.push('종료 일시는 시작 일시보다 이후여야 합니다');
      }
    }
  }

  // 유효성 검증 오류가 있는 경우 응답
  if (errors.length > 0) {
    return sendError(res, errors, 400);
  }

  next();
};

/**
 * MongoDB ID 유효성 검증 미들웨어
 * @route GET /api/events/:id, PUT /api/events/:id, DELETE /api/events/:id
 */
export const validateMongoId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return sendError(res, '유효하지 않은 ID 형식입니다', 400);
  }
  
  next();
};

/**
 * 월별 일정 조회 검증 미들웨어
 * @route GET /api/events?month=MM&year=YYYY
 */
export const validateMonthlyQuery = (req: Request, res: Response, next: NextFunction) => {
  const { month, year } = req.query;
  
  // 쿼리 파라미터가 없거나 모두 없는 경우는 허용 (전체 조회)
  if ((!month && !year) || (month && year)) {
    return next();
  }
  
  // 두 값 중 하나만 있는 경우
  return sendError(res, '월과 연도를 모두 함께 제공해야 합니다', 400);
};