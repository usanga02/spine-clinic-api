import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    // If it's a CustomError, respond with the custom status code and message
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Handle other errors (e.g., unexpected errors)
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export default errorHandler;
