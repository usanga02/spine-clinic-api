import express from "express";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handling middleware (this should be the last middleware)
app.use(errorHandler);

export default app;
