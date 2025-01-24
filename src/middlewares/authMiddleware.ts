import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

interface AuthenticatedRequest extends Request {
  userId?: number;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
