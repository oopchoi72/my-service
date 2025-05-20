import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import { validateEventData, validateMongoId, validateMonthlyQuery } from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

// 일정 목록 및 생성 라우트
router.route("/")
  .get(validateMonthlyQuery, asyncHandler(getEvents))
  .post(validateEventData, asyncHandler(createEvent));

// 특정 일정 조회, 업데이트, 삭제 라우트
router.route("/:id")
  .get(validateMongoId, asyncHandler(getEventById))
  .put(validateMongoId, validateEventData, asyncHandler(updateEvent))
  .delete(validateMongoId, asyncHandler(deleteEvent));

export default router;
