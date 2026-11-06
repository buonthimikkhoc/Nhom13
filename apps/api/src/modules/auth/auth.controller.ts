import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma";
import { AuthRequest } from "../../middlewares/auth";

const JWT_SECRET = process.env.JWT_SECRET || "tech-ecommerce-secret-key-2026";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Vui lòng điền đầy đủ email, mật khẩu và họ tên." },
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(phone ? [{ phone }] : [])] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: "USER_EXISTS", message: "Email hoặc số điện thoại đã được đăng ký." },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: "customer",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: error.message },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Vui lòng nhập email và mật khẩu." },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Tài khoản hoặc mật khẩu không chính xác." },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Tài khoản hoặc mật khẩu không chính xác." },
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: error.message },
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Chưa đăng nhập." } });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatar: true,
        role: true,
        addresses: true,
        createdAt: true,
      },
    });

    return res.json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: error.message } });
  }
};

