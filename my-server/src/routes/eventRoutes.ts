import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";

const router = express.Router();

router.route("/").get(getEvents).post(createEvent);

router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);

export default router;
