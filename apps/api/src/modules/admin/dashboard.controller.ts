import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      completedOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: "customer" } }),
      prisma.order.findMany({
        where: { status: "completed" },
        select: { grandTotal: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: { select: { fullName: true } },
        },
      }),
    ]);

    const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.grandTotal, 0);

    return res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

