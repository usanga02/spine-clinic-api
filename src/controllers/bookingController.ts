import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { patientName, doctorName, date } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Explicitly return after sending a response
  }

  try {
    const booking = await prisma.booking.create({
      data: { patientName, doctorName, date: new Date(date), userId },
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Booking creation failed: " });
  }
};

export const getBookings = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Explicitly return after sending a response
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
