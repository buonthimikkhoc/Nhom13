import React from "react";
import Link from "next/link";
import { Cpu, Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw, Award, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#001C44] text-slate-300 text-sm border-t border-[#0C5776]/40">
      {/* --- Pre-Footer Commitment Strip --- */}
      <div className="border-b border-[#0C5776]/40 py-8 px-4 bg-[#001433]/70">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. TechCare Cam Kết */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#2D99AE]/15 border border-[#2D99AE]/30 text-[#BCFEFE] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs sm:text-sm">TechCare Cam Kết</h4>
              <p className="text-[11px] text-slate-400">100% linh kiện chính hãng nguyên hộp</p>
            </div>
          </div>

          {/* 2. 1 Đổi 1 Trong 30 Ngày */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0C5776]/25 border border-[#0C5776]/40 text-[#BCFEFE] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs sm:text-sm">1 Đổi 1 Trong 30 Ngày</h4>
              <p className="text-[11px] text-slate-400">Lỗi nhà sản xuất là đổi mới ngay lập tức</p>
            </div>
          </div>

          {/* 3. Authorized Partner */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#2D99AE]/15 border border-[#2D99AE]/30 text-[#BCFEFE] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs sm:text-sm">Authorized Partner</h4>
              <p className="text-[11px] text-slate-400">Đối tác chiến lược NVIDIA, ASUS, Apple</p>
            </div>
          </div>

          {/* 4. Hotline 1900 8888 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0C5776]/25 border border-[#0C5776]/40 text-[#BCFEFE] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs sm:text-sm">Hotline 1900 8888</h4>
              <p className="text-[11px] text-slate-400">Tư vấn kỹ thuật chuyên sâu 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main 4 Columns --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand & Contacts */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0C5776] via-[#2D99AE] to-[#BCFEFE] flex items-center justify-center text-white shadow-md shadow-[#0C5776]/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Tech<span className="text-[#2D99AE]">Core</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400 mb-6">
            Hệ sinh thái phân phối thiết bị công nghệ, siêu máy chủ AI Workstation, linh kiện phần cứng tuyển chọn và laptop gaming chính hãng hàng đầu Việt Nam.
          </p>
          <div className="space-y-2.5 text-xs">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> Tổng đài miễn cước:{" "}
              <a href="tel:19008888" className="text-white font-bold hover:text-blue-400">
                1900 8888
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> Email: support@techcore.vn
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Trụ sở: 12 Duy Tân, Cầu Giấy, Hà Nội
            </p>
          </div>
        </div>

        {/* Col 2: Danh Mục Sản Phẩm */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
            Danh Mục Sản Phẩm
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/danh-muc/linh-kien-pc" className="hover:text-blue-400 transition">
                AI &amp; Deep Learning Clusters
              </Link>
            </li>
            <li>
              <Link href="/danh-muc/linh-kien-pc" className="hover:text-blue-400 transition">
                Flagship PC &amp; Custom Loop
              </Link>
            </li>
            <li>
              <Link href="/danh-muc/laptop" className="hover:text-blue-400 transition">
                Apple Studio &amp; Mac Pro
              </Link>
            </li>
            <li>
              <Link href="/danh-muc/linh-kien-pc" className="hover:text-blue-400 transition">
                Màn Hình Đồ Họa 4K, 8K &amp; OLED
              </Link>
            </li>
            <li>
              <Link href="/danh-muc/linh-kien-pc" className="hover:text-blue-400 transition">
                Linh Kiện Sau Độc Tuyển Chọn
              </Link>
            </li>
            <li>
              <Link href="/danh-muc/phu-kien-gaming" className="hover:text-blue-400 transition">
                Gaming Gear &amp; Setup Hi-End
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Dịch Vụ & Hỗ Trợ */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
            Dịch Vụ &amp; Hỗ Trợ
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/tra-cuu-bao-hanh" className="text-blue-400 font-bold hover:underline">
                Tra cứu bảo hành Serial / IMEI
              </Link>
            </li>
            <li>
              <Link href="/#techcare" className="hover:text-blue-400 transition">
                Đặc quyền TechCare+ Đổi mới 1:1
              </Link>
            </li>
            <li>
              <Link href="/#workstations" className="hover:text-blue-400 transition">
                Tùy biến cấu hình AI Workstation
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition">
                Chính sách giao hỏa tốc 2H
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition">
                Hướng dẫn thanh toán &amp; Trả góp 0%
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition">
                Chính sách bảo mật thông tin TLS 1.3
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Hệ Thống Showroom */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
            Hệ Thống Showroom
          </h4>
          <div className="space-y-3.5 text-xs text-slate-400">
            <div>
              <p className="text-white font-semibold">Showroom 1 (Flagship TP.HCM):</p>
              <p>72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. HCM</p>
              <p className="text-[11px] text-blue-400">Giờ mở cửa: 08:30 - 21:30</p>
            </div>
            <div>
              <p className="text-white font-semibold">Showroom 2 (Hi-End Lab Thủ Đức):</p>
              <p>Số 10 Võ Văn Ngân, Linh Chiểu, TP. Thủ Đức</p>
              <p className="text-[11px] text-blue-400">Giờ mở cửa: 09:00 - 21:00</p>
            </div>
            <div>
              <p className="text-white font-semibold">Showroom 3 (Hà Nội):</p>
              <p>Số 12 Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội</p>
              <p className="text-[11px] text-blue-400">Giờ mở cửa: 08:30 - 21:30</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Copyright Bar --- */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 TechCore Ecosystem. All rights reserved. Doanh nghiệp phân phối thiết bị công nghệ chính hãng hàng đầu.</p>
      </div>
    </footer>
  );
}
