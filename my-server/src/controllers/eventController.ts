import { Request, Response } from "express";
import Event from "../models/Event";
import { sendSuccess, sendError, handleValidationError } from "../utils/apiResponse";
import { isValidDate } from "../utils/validators";

// 타입 정의
interface MonthlyQuery {
  month?: string;
  year?: string;
}

interface EventData {
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime?: Date;
}

/**
 * 월별 일정 조회
 * @route GET /api/events
 * @param {Object} req.query - 쿼리 파라미터
 * @param {string} req.query.month - 조회할 월 (1-12)
 * @param {string} req.query.year - 조회할 연도 (YYYY)
 * @returns {Object} 해당 월의 일정 목록
 */
export const getEvents = async (req: Request, res: Response): Promise<Response> => {
  const { month, year } = req.query as MonthlyQuery;
  
  // 1. 쿼리 파라미터 없는 경우 전체 조회
  if (!month && !year) {
    const events = await Event.find().sort({ startDateTime: 1 });
    return sendSuccess(res, events, 200, events.length);
  }
  
  // 바디데이션 미들웨어에서 처리하도록 이동
  const monthNum = parseInt(month as string, 10);
  const yearNum = parseInt(year as string, 10);
  
  // 유효한 월/년 범위 확인
  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 2000 || yearNum > 2100) {
    return sendError(res, "유효하지 않은 월 또는 연도입니다", 400);
  }

  // 해당 월의 시작일과 종료일 계산
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)); // 해당 월의 마지막 날
  
  // 시간대 이슈 디버깅을 위한 로그
  console.log(`Querying events for ${year}-${month}:`);
  console.log(`Start date: ${startDate.toISOString()}`);
  console.log(`End date: ${endDate.toISOString()}`);

  const events = await Event.find({
    $or: [
      // 시작 일시가 해당 월 내에 있는 경우
      { startDateTime: { $gte: startDate, $lte: endDate } },
      // 종료 일시가 해당 월 내에 있는 경우 (종료 일시가 있는 경우만)
      { endDateTime: { $gte: startDate, $lte: endDate } },
      // 이벤트 기간이 해당 월을 완전히 포함하는 경우
      { 
        startDateTime: { $lte: startDate },
        endDateTime: { $gte: endDate }
      },
    ],
  }).sort({ startDateTime: 1 });

  return sendSuccess(res, events, 200, events.length);
};

/**
 * 특정 일정 상세 조회
 * @route GET /api/events/:id
 * @param {string} req.params.id - 조회할 일정의 ID
 * @returns {Object} 일정 상세 정보
 */
export const getEventById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // 유효성 검사는 미들웨어로 이동함  
  const event = await Event.findById(req.params.id);

  if (!event) {
    return sendError(res, "일정을 찾을 수 없습니다", 404);
  }

  return sendSuccess(res, event);
};

/**
 * 새 일정 생성
 * @route POST /api/events
 * @param {Object} req.body - 일정 데이터
 * @param {string} req.body.title - 일정 제목
 * @param {string} req.body.startDateTime - 일정 시작 일시 (ISO 8601 형식)
 * @param {string} [req.body.endDateTime] - 일정 종료 일시 (ISO 8601 형식, 선택사항)
 * @param {string} [req.body.description] - 일정 상세 설명 (선택사항)
 * @returns {Object} 생성된 일정 정보
 */
export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // 유효성 검사는 미들웨어로 이동했으므로 간단하게 처리
  const { title, startDateTime, endDateTime, description } = req.body as EventData;
  
  // 이벤트 생성 - 미들웨어에서 이미 데이터 검증 및 변환을 수행했음
  const event = await Event.create(req.body);
  
  return sendSuccess(res, event, 201);
};

/**
 * 일정 수정
 * @route PUT /api/events/:id
 * @param {string} req.params.id - 수정할 일정의 ID
 * @param {Object} req.body - 수정할 일정 데이터
 * @returns {Object} 수정된 일정 정보
 */
export const updateEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // 일정이 존재하는지 확인
  const existingEvent = await Event.findById(req.params.id);
  if (!existingEvent) {
    return sendError(res, "일정을 찾을 수 없습니다", 404);
  }
  
  // 미들웨어에서 유효성 검사를 수행했으므로 간단하게 처리
  const { title, description, startDateTime, endDateTime } = req.body as Partial<EventData>;
  
  // 업데이트할 데이터 객체 생성
  const updateData: Partial<EventData> = {};
  
  // 제공된 필드만 업데이트
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (startDateTime !== undefined) updateData.startDateTime = new Date(startDateTime);
  if (endDateTime !== undefined) updateData.endDateTime = endDateTime ? new Date(endDateTime) : null;
  
  // 업데이트할 데이터가 없는 경우
  if (Object.keys(updateData).length === 0) {
    return sendError(res, "업데이트할 데이터가 없습니다", 400);
  }
  
  // 일정 업데이트
  const event = await Event.findByIdAndUpdate(
    req.params.id, 
    updateData, 
    {
      new: true,       // 업데이트된 문서 반환
      runValidators: true, // 모델 검증기 실행
    }
  );

  return sendSuccess(res, event);
};

/**
 * 일정 삭제
 * @route DELETE /api/events/:id
 * @param {string} req.params.id - 삭제할 일정의 ID
 * @returns {Object} 삭제 성공 여부
 */
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // 일정 존재 확인
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    return sendError(res, "일정을 찾을 수 없습니다", 404);
  }
  
  // 일정 삭제 실행
  await Event.deleteOne({ _id: req.params.id });
  
  // 삭제 확인 응답
  return sendSuccess(res, { 
    message: "일정이 성공적으로 삭제되었습니다", 
    id: req.params.id 
  }, 200);
  
  // RESTful API 권장 사항: 204 No Content
  // return res.status(204).send();
};
