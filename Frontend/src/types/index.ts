export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  color?: string;
  storage?: string;
  ram?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  serials?: string[];
}

export interface ProductImage {
  id: string;
  url: string;
  isThumbnail: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  description?: string;
  status: string;
  isFeatured: boolean;
  warrantyMonths: number;
  specs?: string; // JSON string
  avgRating: number;
  reviewCount: number;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
  relatedProducts?: Product[];
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: ProductVariant & {
    product: Product;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  code: string;
  receiverName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingFee: number;
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  voucherCode?: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    sku: string;
    price: number;
    quantity: number;
    lineTotal: number;
    serialNumber?: string;
  }[];
  statusHistory?: {
    id: string;
    toStatus: string;
    note?: string;
    createdAt: string;
  }[];
}

