"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../../lib/api";
import { Product, Brand, Category } from "../../../types";
import ProductCard from "../../../components/product/ProductCard";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.slug === "tat-ca" ? undefined : (params.slug as string);
  const searchQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setSelectedBrand("");
    async function fetchBrands() {
      // Tự động phân loại thương hiệu chuẩn xác theo từng phân hệ ngành hàng
      // (Laptop & Điện thoại không hiển thị Logitech; Linh kiện PC chỉ hiển thị thương hiệu linh kiện)
      const res = await api.getBrandsForCategory(categorySlug);
      if (res.success && res.data) {
        setBrands(res.data);
      }
    }
    fetchBrands();
  }, [categorySlug]);

  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        setLoading(true);
        setCurrentPage(1);
        const queryParams: Record<string, any> = {};
        if (categorySlug) queryParams.category = categorySlug;
        if (searchQuery) queryParams.q = searchQuery;
        if (selectedBrand) queryParams.brand = selectedBrand;
        if (sort) queryParams.sort = sort;

        if (priceRange === "under-10m") queryParams.maxPrice = 10000000;
        else if (priceRange === "10m-25m") {
          queryParams.minPrice = 10000000;
          queryParams.maxPrice = 25000000;
        } else if (priceRange === "25m-40m") {
          queryParams.minPrice = 25000000;
          queryParams.maxPrice = 40000000;
        } else if (priceRange === "over-40m") queryParams.minPrice = 40000000;

        const res = await api.getProducts(queryParams);
        if (res.success) setProducts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFilteredProducts();
  }, [categorySlug, searchQuery, selectedBrand, priceRange, sort]);

  // Tính toán phân trang: Đúng 6 sản phẩm mỗi trang theo yêu cầu
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 capitalize">
            {searchQuery
              ? `Kết quả tìm kiếm cho "${searchQuery}"`
              : selectedBrand
              ? `Thương hiệu ${brands.find((b) => b.slug === selectedBrand)?.name || selectedBrand.toUpperCase()}`
              : categorySlug === "laptop"
              ? "Laptop & Smartphone Cao Cấp"
              : categorySlug
              ? `Danh mục: ${categorySlug.replace(/-/g, " ")}`
              : "Tất cả sản phẩm công nghệ"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị {products.length > 0 ? `${startIndex + 1} - ${Math.min(startIndex + ITEMS_PER_PAGE, products.length)}` : 0} trong tổng số {products.length} sản phẩm chính hãng phù hợp
            {totalPages > 1 && ` (Trang ${currentPage} / ${totalPages})`}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-3">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Bộ lọc tìm kiếm
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Thương hiệu
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                    selectedBrand === ""
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Tất cả
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(selectedBrand === b.slug ? "" : b.slug)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                      selectedBrand === b.slug
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Mức giá (VND)
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: "", label: "Tất cả mức giá" },
                  { id: "under-10m", label: "Dưới 10 triệu" },
                  { id: "10m-25m", label: "Từ 10 - 25 triệu" },
                  { id: "25m-40m", label: "Từ 25 - 40 triệu" },
                  { id: "over-40m", label: "Trên 40 triệu" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === item.id}
                      onChange={() => setPriceRange(item.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 text-sm font-medium mb-2">Không tìm thấy sản phẩm phù hợp.</p>
              <button
                onClick={() => {
                  setSelectedBrand("");
                  setPriceRange("");
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Product Grid: Đúng 6 sản phẩm mỗi trang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination Controls & Chuyển Trang Xem Tiếp */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-slate-200/80 space-y-4">
                  {/* Banner Chuyển Nhanh Xem Tiếp 6 Sản Phẩm Kế Tiếp */}
                  {currentPage < totalPages && (
                    <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 border border-blue-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                      <div className="text-xs text-slate-700">
                        Đang xem <strong className="text-blue-700 font-bold">{currentProducts.length}</strong> sản phẩm trên trang <strong className="text-blue-700 font-bold">{currentPage}</strong> / <strong className="text-slate-900">{totalPages}</strong> (còn {products.length - (startIndex + currentProducts.length)} sản phẩm chính hãng).
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-500/25 flex items-center gap-1.5 shrink-0"
                      >
                        <span>Chuyển sang xem 6 sản phẩm tiếp theo</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Thanh Phân Trang Chi Tiết Theo Số */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 font-medium">
                      Trang <strong className="text-slate-800 font-bold">{currentPage}</strong> trên {totalPages} (Tổng số {products.length} sản phẩm)
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      {/* Nút Trang Trước */}
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Trang trước</span>
                      </button>

                      {/* Các Nút Số Trang */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          totalPages <= 7 ||
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              type="button"
                              onClick={() => handlePageChange(page)}
                              className={`w-9 h-9 rounded-xl text-xs font-black transition flex items-center justify-center ${
                                currentPage === page
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={page} className="px-1 text-slate-400 text-xs">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      {/* Nút Trang Sau */}
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                      >
                        <span>Trang sau</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

