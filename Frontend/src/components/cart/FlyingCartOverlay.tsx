"use client";

import React, { useEffect, useState, useRef } from "react";

export interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  targetX: number;
  targetY: number;
  controlX: number;
  controlY: number;
  imageUrl: string;
  startTime: number;
  duration: number;
}

export interface FlyToCartOptions {
  startElement?: HTMLElement | null;
  event?: React.MouseEvent | MouseEvent | null;
  imageUrl?: string;
  startX?: number;
  startY?: number;
}

// Global emitter để các component có thể kích hoạt bay mọi lúc mọi nơi
const EVENT_TRIGGER_FLY = "techcore:trigger-fly-cart";

export function emitFlyToCart(options: FlyToCartOptions) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_TRIGGER_FLY, { detail: options }));
}

export default function FlyingCartOverlay() {
  const [particles, setParticles] = useState<FlyingParticle[]>([]);
  const particlesRef = useRef<FlyingParticle[]>([]);
  particlesRef.current = particles;

  const [, setFrameTick] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  // Lắng nghe sự kiện thêm vào giỏ hàng
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<FlyToCartOptions>;
      const opts = customEvent.detail || {};

      let startX = opts.startX;
      let startY = opts.startY;
      let startWidth = 140;
      let startHeight = 140;
      let detectedImageUrl = opts.imageUrl;

      // 1. Tự động truy xuất phần tử HÌNH ẢNH SẢN PHẨM (để sản phẩm bay trực tiếp từ khung hình của nó)
      let sourceImageEl: HTMLImageElement | null = null;
      if (opts.startElement) {
        if (opts.startElement instanceof HTMLImageElement) {
          sourceImageEl = opts.startElement;
        } else {
          const container =
            opts.startElement.closest(".group") ||
            opts.startElement.closest("[data-product-card]") ||
            opts.startElement.closest("article") ||
            opts.startElement.closest("div.relative") ||
            opts.startElement.parentElement;
          sourceImageEl = container?.querySelector("img") || null;
        }
      } else if (opts.event && opts.event.currentTarget) {
        const target = opts.event.currentTarget as HTMLElement;
        const container =
          target.closest(".group") ||
          target.closest("[data-product-card]") ||
          target.closest("article") ||
          target.closest("div.relative") ||
          target.parentElement;
        sourceImageEl = container?.querySelector("img") || null;
      }

      // Nếu tìm thấy hình ảnh sản phẩm, xuất phát từ tâm của chính hình ảnh sản phẩm đó
      if (sourceImageEl) {
        const imgRect = sourceImageEl.getBoundingClientRect();
        startX = imgRect.left + imgRect.width / 2;
        startY = imgRect.top + imgRect.height / 2;
        startWidth = Math.max(90, Math.min(220, imgRect.width));
        startHeight = Math.max(90, Math.min(220, imgRect.height));
        if (!detectedImageUrl && sourceImageEl.src) {
          detectedImageUrl = sourceImageEl.src;
        }
      } else if (typeof startX !== "number" || typeof startY !== "number") {
        if (opts.startElement) {
          const rect = opts.startElement.getBoundingClientRect();
          startX = rect.left + rect.width / 2;
          startY = rect.top + rect.height / 2;
        } else if (opts.event) {
          startX = opts.event.clientX;
          startY = opts.event.clientY;
        } else {
          startX = window.innerWidth / 2;
          startY = window.innerHeight * 0.5;
        }
      }

      // 2. Xác định tọa độ đích (Biểu tượng giỏ hàng trên thanh Navbar)
      const cartEl =
        document.getElementById("navbar-cart-btn") ||
        document.querySelector("[data-cart-icon='true']");
      let targetX = window.innerWidth - 55;
      let targetY = 28;

      if (cartEl) {
        const cartRect = cartEl.getBoundingClientRect();
        targetX = cartRect.left + cartRect.width / 2;
        targetY = cartRect.top + cartRect.height / 2;
      }

      // 3. Tính toán điểm uốn vòng cung parabol (Control point của đường cong Bezier)
      const dx = targetX - (startX || 0);
      const dy = targetY - (startY || 0);
      const distance = Math.hypot(dx, dy);

      // Điểm uốn nằm giữa theo trục X, và vồng cao lên trên bầu trời theo trục Y
      const controlX = (startX || 0) + dx * 0.45;
      const minPeakY = Math.min(startY || 0, targetY);
      const arcHeight = Math.max(140, Math.min(320, distance * 0.38));
      const controlY = Math.max(25, minPeakY - arcHeight);

      // Thời lượng bay: 800ms để người xem nhìn rõ hình ảnh sản phẩm uốn vòng cung
      const duration = Math.min(950, Math.max(750, distance * 0.85));

      const newParticle: FlyingParticle = {
        id: `fly-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        startX: startX || window.innerWidth / 2,
        startY: startY || window.innerHeight / 2,
        startWidth,
        startHeight,
        targetX,
        targetY,
        controlX,
        controlY,
        imageUrl:
          detectedImageUrl ||
          "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg",
        startTime: performance.now(),
        duration,
      };

      setParticles((prev) => [...prev, newParticle]);
    };

    window.addEventListener(EVENT_TRIGGER_FLY, handleTrigger);
    return () => {
      window.removeEventListener(EVENT_TRIGGER_FLY, handleTrigger);
    };
  }, []);

  // Vòng lặp animation mượt mà 60fps qua requestAnimationFrame
  useEffect(() => {
    if (particles.length === 0) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const loop = (now: number) => {
      let hasCompleted = false;
      const remaining: FlyingParticle[] = [];

      for (const p of particlesRef.current) {
        const elapsed = now - p.startTime;
        if (elapsed >= p.duration) {
          hasCompleted = true;
          // Kích hoạt hiệu ứng va chạm nảy giỏ hàng (Cart bump)
          window.dispatchEvent(new CustomEvent("techcore:cart-bump"));
        } else {
          remaining.push(p);
        }
      }

      if (hasCompleted) {
        setParticles(remaining);
      } else {
        setFrameTick((t) => t + 1);
      }

      if (remaining.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [particles.length]);

  if (particles.length === 0) return null;

  const now = performance.now();

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {particles.map((p) => {
        const elapsed = now - p.startTime;
        const rawT = Math.min(1, Math.max(0, elapsed / p.duration));

        // Hàm nới lỏng gia tốc mượt mà (Ease-in-out Cubic)
        const t =
          rawT < 0.5
            ? 4 * rawT * rawT * rawT
            : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        // Tọa độ parabol Bezier bậc 2: B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
        const oneMinusT = 1 - t;
        const currentX =
          oneMinusT * oneMinusT * p.startX +
          2 * oneMinusT * t * p.controlX +
          t * t * p.targetX;
        const currentY =
          oneMinusT * oneMinusT * p.startY +
          2 * oneMinusT * t * p.controlY +
          t * t * p.targetY;

        // Hiệu ứng quay vòng cung: xoay tròn hình ảnh sản phẩm 720 độ
        const rotation = rawT * 720;

        // Hiệu ứng thu nhỏ dần: bắt đầu 1.0 (kích thước đầy đủ của ảnh sản phẩm), bay lên cao thì thu nhỏ dần về 0.15 khi lọt vào giỏ
        const arcBulge = Math.sin(Math.PI * rawT) * 0.15;
        const scale = Math.max(0.12, 1.0 + arcBulge - rawT * 0.95);

        // Độ mờ: giữ nguyên độ nét của hình ảnh sản phẩm, mờ dần ở 10% chặng cuối
        const opacity = rawT > 0.9 ? Math.max(0, (1 - rawT) / 0.1) : 1;

        // Vệt sáng sao chổi trailing nhẹ phía sau hình ảnh sản phẩm
        const trailT = Math.max(0, rawT - 0.04);
        const trailOneMinusT = 1 - trailT;
        const trailX =
          trailOneMinusT * trailOneMinusT * p.startX +
          2 * trailOneMinusT * trailT * p.controlX +
          trailT * trailT * p.targetX;
        const trailY =
          trailOneMinusT * trailOneMinusT * p.startY +
          2 * trailOneMinusT * trailT * p.controlY +
          trailT * trailT * p.targetY;

        return (
          <React.Fragment key={p.id}>
            {/* Đốm sáng sao chổi bám theo đường bay của ảnh sản phẩm */}
            {rawT > 0.1 && rawT < 0.9 && (
              <div
                style={{
                  position: "absolute",
                  left: `${trailX}px`,
                  top: `${trailY}px`,
                  transform: "translate(-50%, -50%)",
                  width: `${40 * scale}px`,
                  height: `${40 * scale}px`,
                  borderRadius: "9999px",
                  background:
                    "radial-gradient(circle, rgba(45,153,174,0.6) 0%, rgba(188,254,254,0.3) 50%, transparent 80%)",
                  filter: "blur(3px)",
                  opacity: opacity * 0.6,
                }}
              />
            )}

            {/* HÌNH ẢNH SẢN PHẨM CHÍNH XÁC: Xuất phát trực tiếp từ ảnh trên thẻ, bay vòng cung vào giỏ */}
            <div
              style={{
                position: "absolute",
                left: `${currentX}px`,
                top: `${currentY}px`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                opacity,
                willChange: "transform, opacity",
              }}
              className="flex items-center justify-center pointer-events-none"
            >
              <div
                style={{
                  width: `${p.startWidth}px`,
                  height: `${p.startHeight}px`,
                }}
                className="relative rounded-2xl bg-white/95 p-3 shadow-2xl border-2 border-[#2D99AE] ring-4 ring-[#BCFEFE]/50 shadow-[#0C5776]/50 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={p.imageUrl}
                  alt="Hình ảnh sản phẩm bay vào giỏ hàng"
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg";
                  }}
                />
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
