import { Request, Response, NextFunction } from "express";
import Event from "../models/Event";
import { sendResponse, sendError } from "../utils/apiResponse";
import { parseMonthlyDateRange } from "../utils/dateUtils";

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
 * 일정 목록 조회
 * GET /api/events
 * 필터: ?month=YYYY-MM
 */
export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let query = {};

    // 월별 필터링이 있는 경우
    if (req.query.month) {
      const { startDate, endDate } = parseMonthlyDateRange(
        req.query.month as string
      );
      query = {
        start: { $lt: endDate },
        end: { $gte: startDate },
      };
    }

    const events = await Event.find(query).sort({ start: 1 });
    sendResponse(res, events);
  } catch (error) {
    next(error);
  }
};

/**
 * 특정 일정 조회
 * GET /api/events/:id
 */
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      sendError(res, "해당 ID의 일정을 찾을 수 없습니다", 404);
      return;
    }

    sendResponse(res, event);
  } catch (error) {
    next(error);
  }
};

/**
 * 새 일정 생성
 * POST /api/events
 */
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 날짜 형식 검증
    if (req.body.startDateTime) {
      const startDate = new Date(req.body.startDateTime);
      if (isNaN(startDate.getTime())) {
        sendError(res, "올바르지 않은 시작 일시 형식입니다", 400);
        return;
      }
      req.body.startDateTime = startDate;
    }

    if (req.body.endDateTime) {
      const endDate = new Date(req.body.endDateTime);
      if (isNaN(endDate.getTime())) {
        sendError(res, "올바르지 않은 종료 일시 형식입니다", 400);
        return;
      }
      req.body.endDateTime = endDate;
    }

    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    sendResponse(res, savedEvent, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * 일정 업데이트
 * PUT /api/events/:id
 */
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 날짜 형식 검증
    if (req.body.startDateTime) {
      const startDate = new Date(req.body.startDateTime);
      if (isNaN(startDate.getTime())) {
        sendError(res, "올바르지 않은 시작 일시 형식입니다", 400);
        return;
      }
      req.body.startDateTime = startDate;
    }

    if (req.body.endDateTime) {
      const endDate = new Date(req.body.endDateTime);
      if (isNaN(endDate.getTime())) {
        sendError(res, "올바르지 않은 종료 일시 형식입니다", 400);
        return;
      }
      req.body.endDateTime = endDate;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      sendError(res, "해당 ID의 일정을 찾을 수 없습니다", 404);
      return;
    }

    sendResponse(res, updatedEvent);
  } catch (error) {
    next(error);
  }
};

/**
 * 일정 삭제
 * DELETE /api/events/:id
 */
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      sendError(res, "해당 ID의 일정을 찾을 수 없습니다", 404);
      return;
    }

    sendResponse(
      res,
      {
        message: "일정이 성공적으로 삭제되었습니다",
        id: req.params.id,
      },
      200
    );
  } catch (error) {
    next(error);
  }
};
