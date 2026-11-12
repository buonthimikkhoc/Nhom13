"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Star,
  ShoppingCart,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";
import { api } from "../../../lib/api";
import { Product, ProductVariant } from "../../../types";
import { formatVND } from "../../../lib/utils";
import { useCart } from "../../../context/CartContext";
import ProductCard from "../../../components/product/ProductCard";
import ProductReviewsSection from "../../../components/product/ProductReviewsSection";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Đảm bảo khi bấm vào xem chi tiết sản phẩm, luôn luôn hiển thị phần trên cùng trước
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [slug]);

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [loading]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.getProductBySlug(slug);
        if (res.success) {
          setProduct(res.data);
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0]);
          }
          if (res.data.images && res.data.images.length > 0) {
            setSelectedImage(res.data.images[0].url);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Đang tải thông số sản phẩm...</p>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h2>
        <Link href="/" className="text-blue-600 text-sm font-semibold hover:underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  let specsObj: Record<string, string> = {};
  if (product.specs) {
    try {
      specsObj = JSON.parse(product.specs);
    } catch (e) {}
  }

  const handleAddToCart = () => {
    addToCart(selectedVariant.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedVariant.id, quantity);
    router.push("/thanh-toan");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>/</span>
        <Link href={`/danh-muc/${product.category?.slug}`} className="hover:text-blue-600">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="relative pt-[80%] rounded-2xl bg-slate-50 border overflow-hidden">
            <img
              src={selectedImage || "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg"}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-contain p-6"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 flex-shrink-0 transition ${
                    selectedImage === img.url ? "border-blue-600 shadow-md" : "border-slate-200"
                  }`}
                >
                  <img src={img.url} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust commitments */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t text-center text-[11px] text-slate-600">
            <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-slate-800">Chính hãng 100%</span>
              <span className="text-[10px] text-slate-400">Bảo hành {product.warrantyMonths} tháng</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-800">Giao hàng miễn phí</span>
              <span className="text-[10px] text-slate-400">Đơn từ 2.000.000đ</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-slate-800">Đổi trả 30 ngày</span>
              <span className="text-[10px] text-slate-400">Nếu có lỗi phần cứng</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Variants */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand?.name}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.avgRating.toFixed(1)}</span>
                <span className="text-slate-400">({product.reviewCount} đánh giá)</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{product.shortDesc}</p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Giá khuyến mãi đặc quyền</div>
              <div className="text-3xl font-black text-red-600">
                {formatVND(selectedVariant.price)}
              </div>
              {selectedVariant.compareAtPrice && (
                <div className="text-xs text-slate-400 line-through mt-0.5">
                  Giá niêm yết: {formatVND(selectedVariant.compareAtPrice)}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedVariant.stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}>
                {selectedVariant.stock > 0 ? `Còn hàng (${selectedVariant.stock})` : "Tạm hết hàng"}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">Mã SKU: {selectedVariant.sku}</span>
            </div>
          </div>

          {/* Variants Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Chọn phiên bản / cấu hình:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    selectedVariant.id === v.id
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{v.name}</span>
                    <span className="text-xs font-extrabold text-red-600">{formatVND(v.price)}</span>
                  </div>
                  {selectedVariant.id === v.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Số lượng:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-sm font-bold text-slate-600 transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold bg-white text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-sm font-bold text-slate-600 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock <= 0}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 border border-blue-200 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleBuyNow}
                disabled={selectedVariant.stock <= 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                Mua ngay (Giao 2h)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b pb-3">Đặc Điểm Nổi Bật</h2>
          <div className="prose text-xs md:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Tech Specs Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b pb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Thông Số Kỹ Thuật
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(specsObj).map(([key, value]) => (
              <div key={key} className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">{key}</span>
                <span className="font-bold text-slate-800 text-right">{value}</span>
              </div>
            ))}
            <div className="py-2.5 flex justify-between gap-4">
              <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Bảo hành</span>
              <span className="font-bold text-blue-600">{product.warrantyMonths} Tháng chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Rating System */}
      <ProductReviewsSection
        productSlug={product.slug}
        productName={product.name}
        initialRating={product.avgRating}
        initialReviewCount={product.reviewCount}
      />

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-black text-slate-900">Sản Phẩm Cùng Phân Khúc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

