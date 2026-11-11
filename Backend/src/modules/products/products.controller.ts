import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: true,
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return res.json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return res.json({ success: true, data: brands });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, minPrice, maxPrice, q, sort, page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status: "active" };

    if (q) {
      where.OR = [
        { name: { contains: String(q) } },
        { shortDesc: { contains: String(q) } },
      ];
    }

    if (category) {
      // Find category and its children slugs
      const cat = await prisma.category.findUnique({
        where: { slug: String(category) },
        include: { children: true },
      });
      if (cat) {
        const catIds = [cat.id, ...cat.children.map((c) => c.id)];
        where.categoryId = { in: catIds };
      }
    }

    if (brand) {
      const b = await prisma.brand.findUnique({ where: { slug: String(brand) } });
      if (b) {
        where.brandId = b.id;
      }
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      // Variant price sorting can be handled or default
      orderBy = { createdAt: "desc" };
    } else if (sort === "price_desc") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "rating") {
      orderBy = { avgRating: "desc" };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: { orderBy: { isThumbnail: "desc" } },
          variants: { where: { isActive: true } },
        },
        skip,
        take: limitNum,
        orderBy,
      }),
    ]);

    // Apply price filter on in-memory or variant level if needed
    let resultProducts = products;
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice as string) : 0;
      const max = maxPrice ? parseInt(maxPrice as string) : Infinity;
      resultProducts = products.filter((p) => {
        return p.variants.some((v) => v.price >= min && v.price <= max);
      });
    }

    return res.json({
      success: true,
      data: resultProducts,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
        reviews: {
          include: { user: { select: { fullName: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Không tìm thấy sản phẩm." },
      });
    }

    // Related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "active",
      },
      include: {
        images: true,
        variants: true,
      },
      take: 4,
    });

    return res.json({
      success: true,
      data: {
        ...product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || String(q).trim() === "") {
      return res.json({ success: true, data: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        name: { contains: String(q) },
        status: "active",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: { where: { isThumbnail: true }, take: 1 },
        variants: { select: { price: true }, take: 1 },
      },
      take: 5,
    });

    return res.json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, categoryId, brandId, shortDesc, description, warrantyMonths, specs, variants, images } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        brandId,
        shortDesc,
        description,
        warrantyMonths: warrantyMonths || 12,
        specs: typeof specs === "object" ? JSON.stringify(specs) : specs,
        variants: {
          create: variants || [],
        },
        images: {
          create: images || [],
        },
      },
      include: {
        variants: true,
        images: true,
      },
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

