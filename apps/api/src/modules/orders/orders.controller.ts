import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { AuthRequest } from "../../middlewares/auth";

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      receiverName,
      phone,
      province,
      district,
      ward,
      street,
      paymentMethod = "cod",
      shippingMethod = "standard",
      voucherCode,
      note,
      items, // array of { variantId, quantity }
      guestEmail,
    } = req.body;

    if (!receiverName || !phone || !province || !district || !ward || !street) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Vui lòng nhập đầy đủ thông tin giao hàng." },
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: "EMPTY_CART", message: "Đơn hàng phải có ít nhất 1 sản phẩm." },
      });
    }

    // Lấy thông tin các biến thể và tính toán giá
    const variantIds = items.map((i: any) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (variants.length !== items.length) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_ITEMS", message: "Một số sản phẩm không tồn tại trong hệ thống." },
      });
    }

    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) continue;

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: {
            code: "OUT_OF_STOCK",
            message: `Sản phẩm '${variant.product.name} - ${variant.name}' không đủ tồn kho (còn ${variant.stock}).`,
          },
        });
      }

      const lineTotal = variant.price * item.quantity;
      subtotal += lineTotal;

      orderItemsData.push({
        variantId: variant.id,
        productName: `${variant.product.name} (${variant.name})`,
        sku: variant.sku,
        price: variant.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    // Xử lý mã giảm giá (Voucher)
    let discountTotal = 0;
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode, isActive: true },
      });

      if (voucher && voucher.endsAt > new Date() && subtotal >= voucher.minOrder) {
        if (voucher.type === "percent") {
          const discount = Math.round((subtotal * voucher.value) / 100);
          discountTotal = voucher.maxDiscount ? Math.min(discount, voucher.maxDiscount) : discount;
        } else {
          discountTotal = voucher.value;
        }
      }
    }

    const shippingFee = subtotal > 2000000 ? 0 : 30000; // Freeship trên 2 triệu
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingFee);

    // Sinh mã đơn hàng ngẫu nhiên: TECH-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `TECH-${dateStr}-${randomSuffix}`;

    // Tạo đơn hàng trong transaction
    const order = await prisma.$transaction(async (tx) => {
      // Giảm tồn kho
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // Xóa các sản phẩm trong giỏ hàng sau khi đặt hàng thành công
      const sessionId = (req.headers["x-session-id"] as string) || "guest-session";
      const cart = await tx.cart.findFirst({
        where: req.user?.id ? { userId: req.user.id } : { sessionId },
      });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      // Tạo Order
      const newOrder = await tx.order.create({
        data: {
          code: orderCode,
          userId: req.user?.id || null,
          guestEmail: req.user ? null : guestEmail || null,
          guestPhone: req.user ? null : phone,
          receiverName,
          phone,
          province,
          district,
          ward,
          street,
          status: "pending",
          paymentStatus: paymentMethod === "vnpay" || paymentMethod === "momo" ? "paid" : "unpaid",
          paymentMethod,
          shippingMethod,
          shippingFee,
          subtotal,
          discountTotal,
          grandTotal,
          voucherCode: voucherCode || null,
          note: note || null,
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              toStatus: "pending",
              note: "Đơn hàng mới tạo thành công.",
              changedBy: req.user?.email || "Khách hàng",
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      return newOrder;
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { code, phone } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, error: { message: "Vui lòng nhập mã đơn hàng." } });
    }

    const where: any = { code: String(code) };
    if (phone) {
      where.phone = String(phone);
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Không tìm thấy đơn hàng với thông tin đã nhập." },
      });
    }

    return res.json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { message: "Chưa đăng nhập." } });
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const { status, q, page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = String(status);
    if (q) {
      where.OR = [
        { code: { contains: String(q) } },
        { receiverName: { contains: String(q) } },
        { phone: { contains: String(q) } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { fullName: true, email: true } },
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return res.json({
      success: true,
      data: orders,
      meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { message: "Không tìm thấy đơn hàng." } });
    }

    // State machine: pending -> packing -> shipping -> completed / cancelled / returned
    const validTransitions: Record<string, string[]> = {
      pending: ["packing", "cancelled"],
      packing: ["shipping", "cancelled"],
      shipping: ["completed", "returned"],
      completed: ["returned"],
      cancelled: [],
      returned: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_TRANSITION",
          message: `Không thể chuyển trạng thái từ '${order.status}' sang '${status}'.`,
        },
      });
    }

    // If cancelled, restore stock
    if (status === "cancelled") {
      for (const item of order.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus: status === "completed" ? "paid" : order.paymentStatus,
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: status,
            note: note || `Chuyển trạng thái sang ${status}`,
            changedBy: req.user?.email || "Admin",
          },
        },
      },
      include: { items: true, statusHistory: true },
    });

    return res.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

