import { Request, Response } from "express";
import Event from "../models/Event";
import { sendSuccess, sendError, handleValidationError } from "../utils/apiResponse";

// 월별 일정 조회
export const getEvents = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return sendError(res, "월과 연도를 쿼리 파라미터로 제공해야 합니다", 400);
    }

    const monthNum = parseInt(month as string, 10);
    const yearNum = parseInt(year as string, 10);

    // 해당 월의 시작일과 종료일 계산
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);

    const events = await Event.find({
      $or: [
        // 시작일이 해당 월 내에 있는 경우
        { startDate: { $gte: startDate, $lte: endDate } },
        // 종료일이 해당 월 내에 있는 경우
        { endDate: { $gte: startDate, $lte: endDate } },
        // 시작일이 해당 월 이전이고 종료일이 해당 월 이후인 경우 (월을 걸쳐있는 경우)
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
      ],
    }).sort({ startDate: 1 });

    return sendSuccess(res, events, 200, events.length);
  } catch (error) {
    return sendError(res, "서버 오류가 발생했습니다", 500);
  }
};

// 특정 일정 상세 조회
export const getEventById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return sendError(res, "일정을 찾을 수 없습니다", 404);
    }

    return sendSuccess(res, event);
  } catch (error) {
    return sendError(res, "서버 오류가 발생했습니다", 500);
  }
};

// 새 일정 생성
export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const event = await Event.create(req.body);
    return sendSuccess(res, event, 201);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return handleValidationError(res, error);
    }
    return sendError(res, "서버 오류가 발생했습니다", 500);
  }
};

// 일정 수정
export const updateEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return sendError(res, "일정을 찾을 수 없습니다", 404);
    }

    return sendSuccess(res, event);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return handleValidationError(res, error);
    }
    return sendError(res, "서버 오류가 발생했습니다", 500);
  }
};

// 일정 삭제
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return sendError(res, "일정을 찾을 수 없습니다", 404);
    }

    return sendSuccess(res, {});
  } catch (error) {
    return sendError(res, "서버 오류가 발생했습니다", 500);
  }
};
