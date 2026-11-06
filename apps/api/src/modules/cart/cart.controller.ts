import { Response } from "express";
import { prisma } from "../../prisma";
import { AuthRequest } from "../../middlewares/auth";

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = (req.headers["x-session-id"] as string) || "guest-session";
    const userId = req.user?.id;

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isThumbnail: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: userId ? null : sessionId,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: true },
                  },
                },
              },
            },
          },
        },
      });
    }

    return res.json({ success: true, data: cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { variantId, quantity = 1 } = req.body;
    const sessionId = (req.headers["x-session-id"] as string) || "guest-session";
    const userId = req.user?.id;

    if (!variantId) {
      return res.status(400).json({ success: false, error: { message: "variantId là bắt buộc." } });
    }

    // Check variant stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: { code: "OUT_OF_STOCK", message: "Sản phẩm tạm thời không đủ tồn kho." },
      });
    }

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: userId ? null : sessionId,
        },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    return getCart(req, res);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });
    }

    return getCart(req, res);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    return getCart(req, res);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = (req.headers["x-session-id"] as string) || "guest-session";
    const userId = req.user?.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return res.json({
      success: true,
      data: { id: cart?.id || "cart-empty", items: [], total: 0 },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

