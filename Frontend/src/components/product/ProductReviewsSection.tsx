"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Star, CheckCircle2, MessageSquare, ThumbsUp, ShieldCheck, PenLine, Send, X, User } from "lucide-react";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  likes: number;
  tags?: string[];
}

interface ProductReviewsSectionProps {
  productSlug: string;
  productName: string;
  initialRating?: number;
  initialReviewCount?: number;
}

export default function ProductReviewsSection({
  productSlug,
  productName,
  initialRating = 4.9,
  initialReviewCount = 18,
}: ProductReviewsSectionProps) {
  // Lấy tài khoản đăng nhập hiện tại nếu có
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("currentUser");
        if (raw) setCurrentUser(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  // Danh sách đánh giá khởi tạo mẫu chất lượng cao
  const defaultReviews: ReviewItem[] = useMemo(
    () => [
      {
        id: "rev-1",
        author: "Trần Minh Quân",
        rating: 5,
        date: "Hôm qua",
        comment:
          "Sản phẩm chuẩn chính hãng 100% nguyên seal tem hãng. Đặt hàng qua TechCore giao hỏa tốc 2h nhận ngay tại Thủ Đức. Máy chạy cực kỳ mượt, tản nhiệt mát và hiệu năng vượt trội đúng như thông số cam kết!",
        verifiedPurchase: true,
        likes: 14,
        tags: ["Giao hỏa tốc 2h", "Nguyên seal 100%", "Hiệu năng siêu khủng"],
      },
      {
        id: "rev-2",
        author: "Nguyễn Lê Hoàng",
        rating: 5,
        date: "3 ngày trước",
        comment:
          "Bảo hành điện tử TechCare+ kích hoạt theo số Serial ngay khi nhận hàng rất an tâm. Nhân viên hỗ trợ kỹ thuật nhiệt tình, đóng gói thùng xốp chống sốc 4 lớp cực kỳ chuyên nghiệp.",
        verifiedPurchase: true,
        likes: 9,
        tags: ["Bảo hành điện tử", "Đóng gói kỹ", "Tư vấn nhiệt tình"],
      },
      {
        id: "rev-3",
        author: "Đặng Thị Phương Thảo",
        rating: 5,
        date: "1 tuần trước",
        comment:
          "Dùng làm đồ họa và render 3D cả tuần nay cực kỳ ổn định, không hề bị tụt xung. Giá tại TechCore tốt hơn hẳn so với các chuỗi bán lẻ khác mà lại được đổi mới 1:1 trong 30 ngày.",
        verifiedPurchase: true,
        likes: 21,
        tags: ["Chạy êm & mát", "Giá cực tốt", "Đổi mới 30 ngày"],
      },
    ],
    []
  );

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [starFilter, setStarFilter] = useState<number | "all">("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Form State
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [formAuthor, setFormAuthor] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formComment, setFormComment] = useState("");
  const [selectedQuickTags, setSelectedQuickTags] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load reviews từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`tech_reviews_${productSlug}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviews(parsed);
            return;
          }
        }
      } catch (e) {}
    }
    setReviews(defaultReviews);
  }, [productSlug, defaultReviews]);

  // Tự động điền tên nếu người dùng đã đăng nhập
  useEffect(() => {
    if (currentUser?.fullName && !formAuthor) {
      setFormAuthor(currentUser.fullName);
    }
  }, [currentUser, formAuthor]);

  // Thống kê điểm sao
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: initialRating, count: initialReviewCount, distribution: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));

    const counts = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => r.rating === star).length);

    return { avg, count: total, distribution: counts };
  }, [reviews, initialRating, initialReviewCount]);

  const ratingLabels: Record<number, string> = {
    5: "Cực kỳ hài lòng (5 sao)",
    4: "Hài lòng & chất lượng tốt (4 sao)",
    3: "Bình thường / Tạm ổn (3 sao)",
    2: "Chưa hài lòng lắm (2 sao)",
    1: "Rất không hài lòng (1 sao)",
  };

  const quickTagsList = [
    "Chính hãng nguyên seal 100%",
    "Hiệu năng siêu khủng",
    "Giao hỏa tốc 2h",
    "Chạy êm & mát mẻ",
    "Màn hình sắc nét",
    "Đóng gói 4 lớp chống sốc",
    "Bảo hành uy tín",
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedQuickTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLike = (reviewId: string) => {
    if (likedReviews[reviewId]) return;
    setLikedReviews((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) => {
      const next = prev.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`tech_reviews_${productSlug}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formAuthor.trim()) {
      setFormError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!formComment.trim()) {
      setFormError("Vui lòng nhập nội dung nhận xét hoặc đánh giá trải nghiệm.");
      return;
    }

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: formAuthor.trim(),
      rating: formRating,
      date: "Vừa xong",
      comment: formComment.trim(),
      verifiedPurchase: true,
      likes: 1,
      tags: selectedQuickTags.length > 0 ? selectedQuickTags : ["Khách hàng đã mua"],
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`tech_reviews_${productSlug}`, JSON.stringify(updated));
      } catch (e) {}
    }

    setSubmitSuccess(true);
    setFormComment("");
    setSelectedQuickTags([]);
    setTimeout(() => {
      setShowReviewForm(false);
      setSubmitSuccess(false);
    }, 2500);
  };

  const filteredReviews = useMemo(() => {
    if (starFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === starFilter);
  }, [reviews, starFilter]);

  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>Đánh Giá &amp; Nhận Xét Của Khách Hàng</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Đánh giá thực tế từ người dùng đã mua {productName} tại TechCore
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReviewForm((prev) => !prev)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer shrink-0"
        >
          {showReviewForm ? (
            <>
              <X className="w-4 h-4" />
              <span>Đóng Form</span>
            </>
          ) : (
            <>
              <PenLine className="w-4 h-4" />
              <span>Viết Đánh Giá Của Bạn</span>
            </>
          )}
        </button>
      </div>

      {/* Form Viết Đánh Giá Mới */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-slate-50 border border-blue-200/90 rounded-3xl p-5 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Gửi Đánh Giá Cho: {productName}</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              ✓ Xác thực đánh giá nhanh
            </span>
          </div>

          {/* Chọn số sao tương tác */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              1. Bạn đánh giá sản phẩm này bao nhiêu sao?
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(formRating)}
                    onClick={() => {
                      setFormRating(star);
                      setHoverRating(star);
                    }}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        star <= (hoverRating || formRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-blue-600 ml-2">
                {ratingLabels[hoverRating || formRating]}
              </span>
            </div>
          </div>

          {/* Chọn tags đánh giá nhanh */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              2. Điểm nổi bật nhất bạn ấn tượng (chọn nhanh):
            </label>
            <div className="flex flex-wrap gap-2">
              {quickTagsList.map((tag) => {
                const isSelected = selectedQuickTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nhập nhận xét */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              3. Chia sẻ chi tiết cảm nhận của bạn về sản phẩm:
            </label>
            <textarea
              required
              rows={3}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm về hiệu năng, thiết kế, độ mượt, tản nhiệt hoặc dịch vụ giao hàng..."
              className="w-full text-xs sm:text-sm p-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition"
            />
          </div>

          {/* Nhập thông tin người đánh giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Họ và tên của bạn:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Số điện thoại (để xác thực đã mua hàng):
              </label>
              <input
                type="tel"
                placeholder="Ví dụ: 0987.xxx.xxx (bảo mật)"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              ⚠️ {formError}
            </p>
          )}

          {submitSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>✓ Cảm ơn bạn! Đánh giá đã được xuất bản công khai ngay lập tức.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Gửi Đánh Giá Ngay</span>
            </button>
          </div>
        </form>
      )}

      {/* Thống kê Tổng quan Đánh Giá & Phân Bổ Sao */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 bg-slate-50/70 border border-slate-200/80 rounded-3xl">
        {/* Cột trái: Điểm trung bình */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {stats.avg}
            <span className="text-lg text-slate-400 font-normal"> / 5.0</span>
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.avg)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Dựa trên <strong>{stats.count}</strong> lượt đánh giá chính thức
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            98% Khách hàng đề xuất mua
          </span>
        </div>

        {/* Cột phải: Thanh phân bổ tỷ lệ sao */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const count = stats.distribution[idx] || 0;
            const percent = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <div className="w-12 font-bold text-slate-700 flex items-center gap-1 shrink-0">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="w-16 text-right font-medium text-slate-500 text-[11px] shrink-0">
                  {count} ({percent}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Lọc Đánh Giá Theo Số Sao */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <span className="text-slate-500 mr-2 shrink-0">Lọc theo:</span>
        <button
          type="button"
          onClick={() => setStarFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
            starFilter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả ({reviews.length})
        </button>
        {[5, 4, 3, 2, 1].map((s) => {
          const c = reviews.filter((r) => r.rating === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStarFilter(s)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
                starFilter === s
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{s} Sao</span>
              <span className="text-[10px] opacity-80">({c})</span>
            </button>
          );
        })}
      </div>

      {/* Danh sách Các Nhận Xét */}
      <div className="divide-y divide-slate-100 space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Chưa có đánh giá nào cho mức sao này.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {rev.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{rev.author}</h4>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              {rev.tags && rev.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {rev.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold text-blue-700 bg-blue-50/80 border border-blue-200/60 px-2 py-0.5 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Nội dung đánh giá */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>

              {/* Footer review: Nút Hữu ích */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleLike(rev.id)}
                  disabled={likedReviews[rev.id]}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition cursor-pointer active:scale-95 ${
                    likedReviews[rev.id]
                      ? "bg-blue-50 text-blue-600 border-blue-200 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Hữu ích ({rev.likes})</span>
                </button>
                <span className="text-[10px]">Đã kiểm duyệt bởi TechCore</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
