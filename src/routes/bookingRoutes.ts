import express from "express";
import { createBooking, getBookings } from "../controllers/bookingController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getBookings);

export default router;
