import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const lookupWarranty = async (req: Request, res: Response) => {
  try {
    const { serial } = req.query;

    if (!serial || String(serial).trim() === "") {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Vui lòng nhập số Serial hoặc mã IMEI." },
      });
    }

    const serialRecord = await prisma.serialNumber.findUnique({
      where: { serialNumber: String(serial).trim() },
      include: {
        variant: {
          include: {
            product: {
              include: {
                brand: true,
                images: { where: { isThumbnail: true } },
              },
            },
          },
        },
      },
    });

    if (!serialRecord) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Không tìm thấy thông tin bảo hành cho Serial / IMEI này trên hệ thống.",
        },
      });
    }

    const isExpired = serialRecord.warrantyEnd ? new Date() > serialRecord.warrantyEnd : false;

    return res.json({
      success: true,
      data: {
        serialNumber: serialRecord.serialNumber,
        status: serialRecord.status,
        isExpired,
        productName: serialRecord.variant.product.name,
        variantName: serialRecord.variant.name,
        brand: serialRecord.variant.product.brand.name,
        image: serialRecord.variant.product.images[0]?.url,
        warrantyMonths: serialRecord.variant.product.warrantyMonths,
        warrantyStart: serialRecord.warrantyStart,
        warrantyEnd: serialRecord.warrantyEnd,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

