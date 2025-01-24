import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customError";

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
}

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!password) {
    res.status(400).json({ success: false, message: "invalid credentials" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    const { password, ...userWithoutPassword } = user;

    res.status(201).json({ ...userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: "User registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password: userPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    const { password, name, ...userWithoutPassword } = user;

    res.status(200).json({
      user: {
        ...userWithoutPassword,
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
      },
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
