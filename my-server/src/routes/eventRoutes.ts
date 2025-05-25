import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import {
  validateEventData,
  validateMongoId,
  validateMonthlyQuery,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

// 일정 목록 조회
router.get("/", validateMonthlyQuery, asyncHandler(getEvents));

// 일정 생성
router.post("/", validateEventData, asyncHandler(createEvent));

// 특정 일정 조회
router.get("/:id", validateMongoId, asyncHandler(getEventById));

// 특정 일정 업데이트
router.put(
  "/:id",
  validateMongoId,
  validateEventData,
  asyncHandler(updateEvent)
);

// 특정 일정 삭제
router.delete("/:id", validateMongoId, asyncHandler(deleteEvent));

export default router;
