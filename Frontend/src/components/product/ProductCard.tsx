"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Star, Shield, Cpu } from "lucide-react";
import { Product } from "../../types";
import { formatVND } from "../../lib/utils";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant?.price || 0;
  const compareAtPrice = defaultVariant?.compareAtPrice;
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  let specsObj: Record<string, string> = {};
  if (product.specs) {
    try {
      specsObj = JSON.parse(product.specs);
    } catch (e) {
      // ignore
    }
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultVariant) {
      addToCart(defaultVariant.id, 1);
    }
  };

  const thumbnail =
    product.images?.find((img) => img.isThumbnail)?.url ||
    product.images?.[0]?.url ||
    "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent && (
          <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
            -{discountPercent}%
          </span>
        )}
        <span className="bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Shield className="w-2.5 h-2.5 text-blue-400" />
          {product.warrantyMonths}T BH
        </span>
      </div>

      {/* Product Image */}
      <Link href={`/san-pham/${product.slug}`} scroll={true} className="block relative pt-[75%] overflow-hidden bg-slate-50">
        <img
          src={thumbnail}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg";
          }}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="uppercase tracking-wider font-bold text-blue-600">{product.brand?.name}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700">{product.avgRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/san-pham/${product.slug}`} scroll={true}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Tech Spec Badges (CPU, RAM, GPU) */}
          {(specsObj.cpu || specsObj.vga || specsObj.ram) && (
            <div className="flex flex-wrap gap-1 mb-3">
              {specsObj.cpu && (
                <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                  {specsObj.cpu.split("(")[0].trim()}
                </span>
              )}
              {specsObj.ram && (
                <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded">
                  {specsObj.ram.split(" ")[0]}
                </span>
              )}
              {specsObj.vga && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded">
                  {specsObj.vga.split("(")[0].trim()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-base font-extrabold text-red-600 leading-tight">
              {formatVND(price)}
            </div>
            {compareAtPrice && compareAtPrice > price && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatVND(compareAtPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            title="Thêm nhanh vào giỏ hàng"
            className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition shadow-sm group/btn"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

