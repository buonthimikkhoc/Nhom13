"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Star,
  Settings,
  Sparkles,
  Gamepad2,
  Apple,
  Monitor,
  Flame,
  CheckCircle2,
  Headphones,
  Sliders,
  ChevronRight,
  Send,
  Boxes,
  MapPin,
  FileText,
  ShoppingCart,
  PackageCheck,
  Check,
  X,
  Layers,
  BookOpen,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatVND } from "../lib/utils";
import { api } from "../lib/api";

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [vipEmail, setVipEmail] = useState("");
  const [vipSuccess, setVipSuccess] = useState(false);
  const [nonSaleFilter, setNonSaleFilter] = useState<"all" | "hardware" | "apple" | "gear">("all");
  const [standardVisibleCount, setStandardVisibleCount] = useState<number>(6);

  // Tab Giải Pháp Trọn Gói
  const [activeSolutionTab, setActiveSolutionTab] = useState<
    "ai" | "vfx" | "gaming" | "enterprise"
  >("ai");

  // Toast Notification System
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    productName?: string;
  } | null>(null);

  const showToast = (title: string, message: string, productName?: string) => {
    setToast({ show: true, title, message, productName });
    setTimeout(() => setToast(null), 3500);
  };

  // Trạng thái PC Builder 3D Modal
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderConfig, setBuilderConfig] = useState({
    cpu: "i9-14900k",
    gpu: "rtx-4090",
    ram: "ram-64gb",
    storage: "ssd-2tb",
    motherboard: "rog-z790",
    casePsu: "lianli-1200w",
  });
  const [builderAdding, setBuilderAdding] = useState(false);

  // Trạng thái Article Reader Modal
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // Countdown timer cho Flash Deals (06:42:05)
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 5 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Thêm vào giỏ hàng (ở lại trang hiện tại, tăng số lượng trên giỏ hàng & bắn Toast)
  const handleAddToCart = async (variantId: string, name?: string) => {
    try {
      setAddingId(variantId);
      await addToCart(variantId, 1);
      setAddedId(variantId);
      showToast("Đã thêm vào giỏ hàng!", "Sản phẩm đã được đồng bộ vào giỏ hàng thành công.", name);
      setTimeout(() => setAddedId(null), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingId(null);
    }
  };

  // Mua ngay (thêm vào giỏ và chuyển thẳng sang trang thanh toán)
  const handleBuyNow = async (variantId: string) => {
    try {
      setAddingId(variantId);
      await addToCart(variantId, 1);
      router.push("/thanh-toan");
    } catch (e) {
      console.error(e);
    } finally {
      setAddingId(null);
    }
  };

  // Giữ lại handleQuickBuy cho các nút cũ
  const handleQuickBuy = handleBuyNow;

  // Dữ liệu tùy chọn cấu hình linh kiện PC Builder
  const builderOptions = {
    cpu: [
      { id: "i9-14900k", name: "Intel Core i9-14900K (24 nhân, 32 luồng, up to 6.0GHz)", price: 15490000, tdp: 253, variantId: "var-i9-14900k" },
      { id: "r7-7800x3d", name: "AMD Ryzen 7 7800X3D (8 nhân, 16 luồng, 3D V-Cache)", price: 10990000, tdp: 120, variantId: "var-i9-14900k" },
      { id: "tr-7995wx", name: "AMD Threadripper PRO 7995WX (96 nhân, 192 luồng đỉnh cao)", price: 145000000, tdp: 350, variantId: "var-4090" },
    ],
    gpu: [
      { id: "rtx-4090", name: "MSI GeForce RTX 4090 SUPRIM X 24GB GDDR6X", price: 54990000, tdp: 450, variantId: "var-4090" },
      { id: "rtx-4080s", name: "ASUS ROG Strix RTX 4080 SUPER 16GB OC Edition", price: 33490000, tdp: 320, variantId: "var-7" },
      { id: "dual-4090", name: "Dual (2x) NVIDIA RTX 4090 24GB NVLink Deep Learning", price: 108000000, tdp: 900, variantId: "var-4090" },
    ],
    ram: [
      { id: "ram-32gb", name: "32GB (2x16GB) Kingston Fury Renegade DDR5 6000MHz", price: 3490000, tdp: 15, variantId: "var-ssd-2tb" },
      { id: "ram-64gb", name: "64GB (2x32GB) Corsair Dominator Titanium DDR5 6400MHz", price: 6990000, tdp: 25, variantId: "var-ssd-2tb" },
      { id: "ram-256gb", name: "256GB (8x32GB) ECC Octa-Channel DDR5 High-Bandwidth", price: 28900000, tdp: 60, variantId: "var-ssd-2tb" },
    ],
    storage: [
      { id: "ssd-2tb", name: "SSD Samsung 990 PRO 2TB NVMe PCIe Gen 4.0 (7450 MB/s)", price: 4790000, tdp: 10, variantId: "var-ssd-2tb" },
      { id: "ssd-4tb-gen5", name: "SSD Crucial T700 4TB PCIe Gen 5.0 (12.400 MB/s)", price: 13900000, tdp: 15, variantId: "var-ssd-2tb" },
    ],
    motherboard: [
      { id: "rog-z790", name: "Mainboard ASUS ROG Maximus Z790 Dark Hero WiFi", price: 18500000, tdp: 35, variantId: "var-7" },
      { id: "msi-x670e", name: "Mainboard MSI MEG X670E ACE E-ATX", price: 19900000, tdp: 40, variantId: "var-7" },
      { id: "asrock-wrx90", name: "Mainboard ASRock WRX90 WS EVO Workstation Server", price: 29500000, tdp: 60, variantId: "var-7" },
    ],
    casePsu: [
      { id: "lianli-1200w", name: "Case Lian Li O11 Dynamic EVO + Nguồn ROG Thor 1200W Platinum II", price: 14990000, tdp: 0, variantId: "var-7" },
      { id: "corsair-1500w", name: "Case Phanteks NV7 Dual Glass + Nguồn Corsair AX1600i Titanium", price: 18990000, tdp: 0, variantId: "var-7" },
    ],
  };

  const currentCpu = builderOptions.cpu.find((c) => c.id === builderConfig.cpu) || builderOptions.cpu[0];
  const currentGpu = builderOptions.gpu.find((g) => g.id === builderConfig.gpu) || builderOptions.gpu[0];
  const currentRam = builderOptions.ram.find((r) => r.id === builderConfig.ram) || builderOptions.ram[0];
  const currentStorage = builderOptions.storage.find((s) => s.id === builderConfig.storage) || builderOptions.storage[0];
  const currentMotherboard = builderOptions.motherboard.find((m) => m.id === builderConfig.motherboard) || builderOptions.motherboard[0];
  const currentCasePsu = builderOptions.casePsu.find((cp) => cp.id === builderConfig.casePsu) || builderOptions.casePsu[0];

  const builderTotalPrice =
    currentCpu.price +
    currentGpu.price +
    currentRam.price +
    currentStorage.price +
    currentMotherboard.price +
    currentCasePsu.price;

  const builderTotalTdp =
    currentCpu.tdp +
    currentGpu.tdp +
    currentRam.tdp +
    currentStorage.tdp +
    currentMotherboard.tdp;

  // Thao tác với Builder Modal: Thêm toàn bộ vào giỏ hàng
  const handleAddBuilderToCart = async () => {
    try {
      setBuilderAdding(true);
      await addToCart(currentCpu.variantId, 1);
      await addToCart(currentGpu.variantId, 1);
      await addToCart(currentStorage.variantId, 1);
      showToast(
        "Đã thêm cấu hình PC vào giỏ hàng!",
        `Đã đồng bộ trọn bộ cấu hình tự dựng (${formatVND(builderTotalPrice)}) vào giỏ hàng của bạn.`,
        `${currentCpu.name} + ${currentGpu.name}`
      );
      setIsBuilderOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setBuilderAdding(false);
    }
  };

  const handleBuyBuilderNow = async () => {
    try {
      setBuilderAdding(true);
      await addToCart(currentCpu.variantId, 1);
      await addToCart(currentGpu.variantId, 1);
      router.push("/thanh-toan");
    } catch (e) {
      console.error(e);
    } finally {
      setBuilderAdding(false);
    }
  };

  // Dữ liệu 3 bài viết chuyên sâu TechCore Insights
  const techInsights = [
    {
      id: "art-1",
      date: "02 Tháng 11, 2026",
      category: "Đánh Giá Chuyên Sâu",
      title: "So Sánh Hiệu Năng Đồ Họa & Điện Toán Dual RTX 4090 vs NVIDIA H100",
      summary: "Phân tích chi tiết mức tiêu thụ điện năng, chi phí trên từng TFLOPS cho các doanh nghiệp vừa và nhỏ khi triển khai Local AI Server.",
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800",
      author: "TS. Nguyễn Hoàng Long - TechCore AI Architect",
      readTime: "7 phút đọc",
      fullContent: [
        "Khi triển khai hệ thống trí tuệ nhân tạo (AI/LLM) cho doanh nghiệp vừa và nhỏ, bài toán lựa chọn giữa cụm máy trạm Dual RTX 4090 24GB và máy chủ đám mây NVIDIA H100 80GB SXM5 luôn là trọng tâm đánh giá ROI.",
        "1. Hiệu năng tính toán thô (Raw Compute): NVIDIA H100 cung cấp tới 1.979 TFLOPS Tensor FP16 kèm công nghệ Transformer Engine thế hệ 4. Trong khi đó, cặp đôi Dual RTX 4090 mang lại tổng cộng 660 TFLOPS Tensor FP16. Dù H100 vượt trội về băng thông bộ nhớ HBM3 (3.35 TB/s so với 2.01 TB/s của 2x RTX 4090), Dual RTX 4090 lại có ưu thế áp đảo về bài toán chi phí.",
        "2. Chi phí đầu tư (TCO): Chi phí sở hữu cụm máy trạm TechCore NeuralForge trang bị Dual RTX 4090 chỉ dao động từ 180 - 220 triệu VNĐ, bằng 1/6 đến 1/8 chi phí mua mới một máy chủ H100 (từ 800 triệu đến hơn 1.2 tỷ VNĐ). Thời gian hoàn vốn đầu tư phần cứng tại chỗ (On-premise) chỉ mất từ 4 - 6 tháng so với thuê hạ tầng Cloud tính theo giờ.",
        "3. Kết luận: Đối với các tác vụ Fine-tuning mô hình ngôn ngữ từ 7B đến 70B tham số (sử dụng kỹ thuật QLoRA / 4-bit Quantization) hoặc chạy suy luận thời gian thực (Inference Server), Dual RTX 4090 là giải pháp tối ưu vượt trội về kinh tế và tính chủ động bảo mật dữ liệu nội bộ."
      ],
      specsComparison: [
        { metric: "VRAM Khả Dụng", rtx4090: "48 GB (2x 24GB GDDR6X)", h100: "80 GB HBM3" },
        { metric: "Băng Thông Bộ Nhớ", rtx4090: "2.016 GB/s", h100: "3.350 GB/s" },
        { metric: "Tensor TFLOPS FP16", rtx4090: "660 TFLOPS", h100: "1.979 TFLOPS" },
        { metric: "Chi Phí Đầu Tư Máy", rtx4090: "~185.000.000₫", h100: "> 950.000.000₫" },
      ],
      relatedProductSlug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
      relatedVariantId: "var-4090",
      relatedProductName: "MSI GeForce RTX 4090 SUPRIM X 24GB",
    },
    {
      id: "art-2",
      date: "28 Tháng 10, 2026",
      category: "Hướng Dẫn Kỹ Thuật",
      title: "Tối Ưu Hóa Khí Động Học & Tản Nhiệt Nước Cho CPU Intel Gen 14",
      summary: "Bí quyết duy trì nhiệt độ dưới 75 độ C khi render liên tục trong 24 giờ cho vi xử lý Core i9-14900KS ép xung tối đa.",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
      author: "Trần Minh Tuấn - Senior Hardware Engineer",
      readTime: "5 phút đọc",
      fullContent: [
        "Vi xử lý đầu bảng Intel Core i9-14900K/14900KS với 24 nhân 32 luồng có thể giải phóng công suất đỉnh vượt ngưỡng 350W ở trạng thái PL2 không giới hạn. Nếu không có giải pháp tản nhiệt và lưu thông khí động học khoa học, hiện tượng quá nhiệt Thermal Throttling sẽ giảm hiệu năng tới 25%.",
        "1. Nguyên tắc áp suất dương (Positive Pressure): Luôn duy trì số lượng quạt hút gió phía trước và mặt đáy lớn hơn hoặc bằng quạt thổi khí nóng ra nóc và mặt sau. Điều này giúp ngăn chặn hoàn toàn bụi bẩn lọt qua các khe hở và đảm bảo buồng máy luôn tràn ngập khí tươi mát.",
        "2. Khung tiếp xúc CPU Contact Frame: Thay thế ngàm giữ CPU mặc định của socket LGA1700 bằng khung nhôm CNC chuyên dụng giúp áp lực siết đều 4 góc, ngăn tình trạng cong vênh nắp IHS của CPU, hạ nhiệt độ tức thì từ 5°C đến 8°C.",
        "3. Tản nhiệt nước Custom Loop với Radiator 360/420mm dày 45mm: Sử dụng block nước bề mặt đồng mạ niken kết hợp keo tản nhiệt kim loại lỏng (Liquid Metal) dẫn nhiệt trên 73 W/mK giúp giữ xung nhịp all-core ổn định ở mức 5.7GHz suốt 72 giờ stress test."
      ],
      specsComparison: [
        { metric: "Nhiệt Độ Full-load Render", rtx4090: "68°C - 74°C (Ổn định)", h100: "95°C - 100°C (Throttle)" },
        { metric: "Xung Nhịp All-Core", rtx4090: "5.7 GHz duy trì liên tục", h100: "4.8 - 5.1 GHz bị giảm" },
        { metric: "Độ Ồn Quạt Làm Mát", rtx4090: "< 34 dBA (Êm ái)", h100: "> 52 dBA (Rất ồn)" },
      ],
      relatedProductSlug: "cpu-intel-core-i9-14900k",
      relatedVariantId: "var-i9-14900k",
      relatedProductName: "CPU Intel Core i9-14900K Box Chính Hãng",
    },
    {
      id: "art-3",
      date: "20 Tháng 10, 2026",
      category: "Tư Vấn Mua Sắm",
      title: "Tiêu Chuẩn Chọn Màn Hình Màu Chuẩn Dành Cho VFX Artist 2026",
      summary: "Tại sao tấm nền QD-OLED 4K 240Hz đang dần thay thế hoàn toàn các màn hình đồ họa truyền thống trong ngành công nghiệp hậu kỳ.",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
      author: "Trần Nam Khánh - VFX Director & Colorist",
      readTime: "6 phút đọc",
      fullContent: [
        "Trong kỷ nguyên nội dung 4K HDR và kỹ xảo điện ảnh chân thực, yêu cầu về độ chính xác màu sắc và độ tương phản của màn hình làm việc là yếu tố quyết định thành bại của mọi studio.",
        "1. Tỷ lệ tương phản vô cực và màu đen tuyệt đối: Nhờ từng điểm ảnh tự phát sáng độc lập, tấm nền QD-OLED loại bỏ hoàn toàn hiện tượng quầng sáng (blooming) vốn là nhược điểm chí mạng của màn hình Mini-LED khi kiểm duyệt các khung hình ban đêm hoặc không gian vũ trụ.",
        "2. Phủ màu 99% không gian DCI-P3 & Delta E < 1: Khả năng hiển thị màu sắc vượt trội giúp các Colorist tự tin cân chỉnh màu phim đúng với tiêu chuẩn rạp chiếu phim kỹ thuật số DCI Hollywood mà không cần màn hình kiểm âm hàng trăm triệu.",
        "3. Tần số quét 240Hz với độ trễ 0.03ms: Không chỉ phục vụ game eSports, tốc độ quét siêu cao giúp loại bỏ bóng mờ chuyển động khi kéo timeline video 60fps/120fps trong Premiere Pro hoặc DaVinci Resolve."
      ],
      specsComparison: [
        { metric: "Thời Gian Phản Hồi", rtx4090: "0.03ms GtG (Tức thì)", h100: "1ms - 5ms (IPS/Mini-LED)" },
        { metric: "Độ Chuẩn Màu Delta E", rtx4090: "ΔE < 1.0 (Calibrated)", h100: "ΔE < 2.0" },
        { metric: "Độ Sâu Màu Đen", rtx4090: "0.0005 nits (Tuyệt đối)", h100: "0.05 nits (Có quầng sáng)" },
      ],
      relatedProductSlug: "man-hinh-asus-rog-swift-oled-pg32ucdm",
      relatedVariantId: "var-mon-oled",
      relatedProductName: "Màn Hình ASUS ROG Swift OLED PG32UCDM 32 inch 4K",
    },
  ];

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vipEmail.trim()) {
      setVipSuccess(true);
      setTimeout(() => setVipSuccess(false), 4000);
      setVipEmail("");
    }
  };

  // Dữ liệu giải pháp trọn gói theo tab
  const solutionPackages = {
    ai: {
      tag: "CHUYÊN DỤNG CHO TRAINING DEEP LEARNING & LLM MODEL",
      title: "TechCore NeuralForge Workstation v4 Pro",
      desc: "Cấu hình đỉnh cao trang bị bộ vi xử lý AMD Threadripper PRO 96 nhân 192 luồng kết hợp 4x GPU NVIDIA RTX 6000 Ada Generation, giải phóng sức mạnh tính toán AI không giới hạn.",
      price: 289000000,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
      slug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
      badges: [
        { title: "Threadripper PRO 7995WX", sub: "96 nhân 192 luồng" },
        { title: "512GB ECC DDR5 Octa-Channel", sub: "Băng thông siêu tốc" },
        { title: "4x M.2 NVMe Gen5 (30.000 MB/s)", sub: "Tải dataset tức thì" },
        { title: "4x RTX 6000 Ada (192GB VRAM)", sub: "Huấn luyện mô hình lớn" },
      ],
      variantId: "var-4090",
    },
    vfx: {
      tag: "TỐI ƯU HÓA HOLLYWOOD 8K RAW & 3D UNREAL ENGINE 5",
      title: "TechCore CineRender Titan VFX Edition",
      desc: "Thiết kế dành riêng cho VFX Artist, Colorist & Studio phim điện ảnh. Trang bị Dual RTX 4090 24GB kết hợp card âm thanh DAC chuẩn audiophile và tản nhiệt buồng hơi làm mát siêu yên tĩnh.",
      price: 185000000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
      slug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
      badges: [
        { title: "Intel Core i9-14900KS", sub: "Up to 6.2GHz 32 Threads" },
        { title: "Dual RTX 4090 24GB NVLink", sub: "Khử răng cưa thời gian thực" },
        { title: "128GB DDR5 6400MHz RGB", sub: "Dựng timeline 8K mượt mà" },
        { title: "8TB Samsung 990 Pro RAID 0", sub: "Tốc độ đọc 14.800 MB/s" },
      ],
      variantId: "var-4090",
    },
    gaming: {
      tag: "FLAGSHIP ESPORTS 4K 240HZ & STREAMING 4K HDR",
      title: "TechCore Apex Dominator ROG Custom Loop",
      desc: "Dàn máy chơi game trong mơ với ống đồng tản nhiệt nước Hard-Tubing mạ chrome, quạt tản nhiệt từ tính và khung case nguyên khối nhôm phay xước gia công CNC cao cấp.",
      price: 139000000,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      slug: "vga-asus-rog-strix-geforce-rtx-4080-super-16gb",
      badges: [
        { title: "AMD Ryzen 7 7800X3D", sub: "Vua gaming 3D V-Cache" },
        { title: "ASUS ROG Strix RTX 4090 24GB", sub: "Chiến mượt Ray-Tracing" },
        { title: "Custom Watercooling Dual Rad", sub: "Nhiệt độ phòng mát mẻ" },
        { title: "Nguồn ROG Thor 1200W Platinum", sub: "Màn hình OLED đo điện áp" },
      ],
      variantId: "var-7",
    },
    enterprise: {
      tag: "MÁY CHỦ VĂN PHÒNG & LOCAL STORAGE PRIVATE CLOUD",
      title: "TechCore Enterprise Vault & Micro-Server",
      desc: "Giải pháp lưu trữ tập trung và máy chủ ảo hóa nội bộ cho doanh nghiệp vừa và nhỏ, trang bị ổ cứng chuyên dụng NAS chuẩn doanh nghiệp và 2 cổng mạng 10GbE dự phòng kép.",
      price: 95000000,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800",
      slug: "ssd-samsung-990-pro-2tb-nvme",
      badges: [
        { title: "Dual Intel Xeon Silver 4410Y", sub: "24 nhân 48 luồng máy chủ" },
        { title: "64GB ECC Registered DDR5", sub: "Tự sửa lỗi phần cứng 24/7" },
        { title: "48TB WD Red Pro Enterprise", sub: "Lưu trữ bảo mật RAID 6" },
        { title: "Dual Port 10GbE SFP+", sub: "Truyền tải mạng tốc độ cao" },
      ],
      variantId: "var-ssd-2tb",
    },
  };

  const currentPackage = solutionPackages[activeSolutionTab];

  // Tải danh mục sản phẩm thời gian thực từ API & Lắng nghe đồng bộ khi Admin cập nhật
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await api.getProducts();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCatalogProducts(res.data);
        }
      } catch (e) {}
    }
    loadCatalog();
    window.addEventListener("techcore:products-changed", loadCatalog);
    return () => window.removeEventListener("techcore:products-changed", loadCatalog);
  }, []);

  // Danh mục sản phẩm không sale lấy trực tiếp từ Catalog thời gian thực
  const standardProducts = useMemo(() => {
    if (!catalogProducts || catalogProducts.length === 0) {
      return [
        {
          id: "std-1",
          slug: "cpu-intel-core-i9-14900k",
          variantId: "var-i9-14900k",
          name: "Bộ Vi Xử Lý CPU Intel Core i9-14900K (Up to 6.0GHz)",
          specs: "24 nhân 32 luồng • Xung nhịp 6.0GHz • Socket LGA1700",
          price: 15490000,
          image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600",
          category: "hardware",
          badge: "CHÍNH HÃNG 100%",
          badgeColor: "bg-blue-600 text-white",
          warranty: "36T TechCare+",
          rating: 4.9,
        },
        {
          id: "std-2",
          slug: "apple-macbook-pro-14-m3-pro",
          variantId: "var-3",
          name: "Apple MacBook Pro 14 M3 Pro (18GB / 512GB SSD Space Black)",
          specs: "Apple M3 Pro 11-Core • 18GB Unified Memory • Liquid Retina XDR",
          price: 48990000,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
          category: "apple",
          badge: "APPLE VN/A NGUYÊN BẢN",
          badgeColor: "bg-slate-900 text-white",
          warranty: "12T Apple Care+",
          rating: 5.0,
        },
        {
          id: "std-3",
          slug: "chuot-logitech-g-pro-x-superlight-2",
          variantId: "var-gpro-white",
          name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2 (60g)",
          specs: "Trọng lượng siêu nhẹ 60g • Cảm biến HERO 2 32.000 DPI • Polling 4000Hz",
          price: 3690000,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
          category: "gear",
          badge: "ESPORTS TOURNAMENT",
          badgeColor: "bg-emerald-600 text-white",
          warranty: "24T Đổi Mới",
          rating: 5.0,
        },
        {
          id: "std-4",
          slug: "ban-phim-co-gaming-khong-day-logitech-g915-lightspeed",
          variantId: "var-8",
          name: "Bàn Phím Cơ Không Dây Logitech G915 LIGHTSPEED Wireless RGB",
          specs: "Switch GL Tactile Low-profile • Kết nối 1ms • Vỏ nhôm máy bay",
          price: 4290000,
          image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
          category: "gear",
          badge: "HI-END WIRELESS",
          badgeColor: "bg-indigo-600 text-white",
          warranty: "24T Chính Hãng",
          rating: 4.8,
        },
        {
          id: "std-5",
          slug: "iphone-16-pro-max-256gb",
          variantId: "var-5",
          name: "iPhone 16 Pro Max 256GB Chính Hãng VN/A Titan Sa Mạc",
          specs: "Chip Apple A18 Pro 3nm • Khung Titan cấp 5 • Camera 48MP Zoom 5x",
          price: 33990000,
          image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
          category: "apple",
          badge: "APPLE VN/A MỚI VỀ",
          badgeColor: "bg-amber-700 text-white",
          warranty: "12T TechCare+",
          rating: 4.9,
        },
        {
          id: "std-6",
          slug: "vga-asus-rog-strix-geforce-rtx-4080-super-16gb",
          variantId: "var-7",
          name: "Card Màn Hình ASUS ROG Strix GeForce RTX 4080 SUPER 16GB OC",
          specs: "16GB GDDR6X 256-bit • Ada Lovelace • Tản nhiệt buồng hơi Vapor Chamber",
          price: 33490000,
          image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
          category: "hardware",
          badge: "ROG FLAGSHIP GPU",
          badgeColor: "bg-blue-700 text-white",
          warranty: "36T TechCare+",
          rating: 4.9,
        },
      ];
    }

    return catalogProducts.map((p) => {
      const catSlug = p.category?.slug || "";
      let category: "hardware" | "apple" | "gear" = "hardware";
      if (catSlug.includes("apple") || catSlug.includes("dien-thoai") || p.brand?.slug === "apple") {
        category = "apple";
      } else if (
        catSlug.includes("gear") ||
        catSlug.includes("phu-kien") ||
        catSlug.includes("ban-phim") ||
        catSlug.includes("chuot") ||
        catSlug.includes("tai-nghe")
      ) {
        category = "gear";
      }

      let specsStr = p.shortDesc || "";
      if (!specsStr && p.specs) {
        try {
          const parsed = typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs;
          specsStr = Object.values(parsed).slice(0, 3).join(" • ");
        } catch (e) {}
      }

      const primaryVar = p.variants?.[0] || {};
      const price = primaryVar.price || p.price || 15000000;
      const variantId = primaryVar.id || `var-${p.slug}`;

      return {
        id: p.id,
        slug: p.slug,
        variantId,
        name: p.name,
        specs: specsStr || "Chính hãng 100% • Bảo hành TechCare+ toàn diện",
        price,
        image: p.images?.[0]?.url || p.image || "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600",
        category,
        badge:
          category === "apple"
            ? "APPLE VN/A NGUYÊN BẢN"
            : category === "gear"
            ? "ESPORTS TOURNAMENT"
            : "CHÍNH HÃNG 100%",
        badgeColor:
          category === "apple"
            ? "bg-slate-900 text-white"
            : category === "gear"
            ? "bg-emerald-600 text-white"
            : "bg-blue-600 text-white",
        warranty: category === "apple" ? "12T Apple Care+" : "36T TechCare+",
        rating: 5.0,
      };
    });
  }, [catalogProducts]);

  // Đếm số lượng sản phẩm theo từng danh mục
  const tabCounts = useMemo(() => {
    return {
      all: standardProducts.length,
      hardware: standardProducts.filter((p) => p.category === "hardware").length,
      apple: standardProducts.filter((p) => p.category === "apple").length,
      gear: standardProducts.filter((p) => p.category === "gear").length,
    };
  }, [standardProducts]);

  // Danh sách sản phẩm tiêu chuẩn sau khi lọc danh mục
  const filteredStandardProducts = useMemo(() => {
    return standardProducts.filter((p) => nonSaleFilter === "all" || p.category === nonSaleFilter);
  }, [standardProducts, nonSaleFilter]);

  // Dynamic Flash Deals từ Catalog sản phẩm thực tế
  const flashDeals = useMemo(() => {
    if (!catalogProducts || catalogProducts.length === 0) {
      return [
        {
          id: "deal-1",
          slug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
          variantId: "var-4090",
          title: "Card Màn Hình MSI GeForce RTX 4090 SUPRIM X 24GB",
          subtitle: "24GB GDDR6X • Ray Tracing Gen 3",
          price: 54990000,
          comparePrice: 64990000,
          discountBadge: "-15% OFF",
          badgeColor: "bg-red-600",
          image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
          progress: "w-4/5",
          alertText: "Đang bán chạy",
        },
        {
          id: "deal-2",
          slug: "laptop-gaming-asus-rog-strix-g16-2024",
          variantId: "var-1",
          title: "Laptop Gaming ASUS ROG Strix G16 (2024) - Core i9",
          subtitle: "Core i9-14900HX • 32GB RAM • RTX 4070",
          price: 49900000,
          comparePrice: 53990000,
          discountBadge: "TẶNG BALO ROG 2.5TR",
          badgeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
          progress: "w-3/5",
          alertText: "Chỉ còn 3 sản phẩm",
        },
        {
          id: "deal-3",
          slug: "man-hinh-asus-rog-swift-oled-pg32ucdm",
          variantId: "var-mon-oled",
          title: "Màn Hình Gaming ASUS ROG Swift OLED PG32UCDM 32\"",
          subtitle: "32 inch 4K QD-OLED • 240Hz • 0.03ms",
          price: 34500000,
          comparePrice: 42990000,
          discountBadge: "-20% GIẢM SÂU",
          badgeColor: "bg-red-600",
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
          progress: "w-5/6",
          alertText: "Còn 5 suất giảm giá",
        },
        {
          id: "deal-4",
          slug: "ssd-samsung-990-pro-2tb-nvme",
          variantId: "var-ssd-2tb",
          title: "Ổ Cứng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 NVMe M.2",
          subtitle: "Đọc 7.450 MB/s • Ghi 6.900 MB/s • V-NAND TLC",
          price: 4790000,
          comparePrice: 5390000,
          discountBadge: "CHÍNH HÃNG 100%",
          badgeColor: "bg-emerald-600",
          image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
          progress: "w-2/3",
          alertText: "Đang bán chạy",
        },
      ];
    }

    const p1 = catalogProducts.find((p) => p.slug === "vga-msi-geforce-rtx-4090-suprim-x-24gb") || catalogProducts[0];
    const p2 = catalogProducts.find((p) => p.slug === "laptop-gaming-asus-rog-strix-g16-2024") || catalogProducts[1] || p1;
    const p3 = catalogProducts.find((p) => p.slug === "man-hinh-asus-rog-swift-oled-pg32ucdm") || catalogProducts[2] || p1;
    const p4 = catalogProducts.find((p) => p.slug === "ssd-samsung-990-pro-2tb-nvme") || catalogProducts[3] || p1;

    const mapDeal = (p: any, defaultBadge: string, badgeColor: string, subtitle: string, progress: string, alertText: string) => {
      const v = p?.variants?.[0] || {};
      const price = v.price || p?.price || 10000000;
      const comparePrice = v.compareAtPrice || Math.round(price * 1.15);
      const discountPercent = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 15;
      const variantId = v.id || `var-${p?.slug || p?.id}`;
      const image = p?.images?.[0]?.url || p?.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500";
      
      return {
        id: p?.id,
        slug: p?.slug || "",
        variantId,
        title: p?.name || p?.title || "",
        subtitle,
        price,
        comparePrice,
        discountBadge: defaultBadge || `-${discountPercent}% OFF`,
        badgeColor,
        image,
        progress,
        alertText,
      };
    };

    return [
      mapDeal(p1, "-15% OFF", "bg-red-600", "24GB GDDR6X • Ray Tracing Gen 3", "w-4/5", "Đang bán chạy"),
      mapDeal(p2, "TẶNG BALO ROG 2.5TR", "bg-blue-600", "Core i9-14900HX • 32GB RAM • RTX 4070", "w-3/5", "Chỉ còn 3 sản phẩm"),
      mapDeal(p3, "-20% GIẢM SÂU", "bg-red-600", "32 inch 4K QD-OLED • 240Hz • 0.03ms", "w-5/6", "Còn 5 suất giảm giá"),
      mapDeal(p4, "CHÍNH HÃNG 100%", "bg-emerald-600", "Đọc 7.450 MB/s • Ghi 6.900 MB/s • V-NAND TLC", "w-2/3", "Đang bán chạy"),
    ];
  }, [catalogProducts]);

  return (
    <div className="w-full bg-slate-50 min-h-screen space-y-12 sm:space-y-16 pb-16">
      {/* =========================================================================
          1. HERO SECTION: KIẾN TẠO KỶ NGUYÊN ĐIỆN TOÁN AI & SHOWCASE WORKSTATION
      ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pb-16 lg:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & CTAs & Stats */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge top */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide">
                <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                <span>HỆ SINH THÁI ĐIỆN TOÁN &amp; PHẦN CỨNG THẾ HỆ MỚI</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Kiến Tạo Kỷ Nguyên <br />
                <span className="text-blue-600">Điện Toán AI</span> &amp; Phần Cứng <br />
                Siêu Hiệu Năng
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Hệ sinh thái phân phối chính hãng giải pháp máy chủ AI, Workstation chuyên nghiệp,
                linh kiện cao cấp và laptop gaming thế hệ mới nhất. Độc quyền bảo hành 1-đổi-1 trong
                30 ngày.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="#workstations"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center gap-2 active:scale-95"
                >
                  <span>Khám Phá AI Workstation 2026</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(true)}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-300 transition shadow-xs flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-blue-600 animate-spin-slow" />
                  <span>Xây Dựng Cấu Hình PC 3D</span>
                </button>
              </div>

              {/* 3 Metric Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Nhập khẩu chính ngạch</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">15 Phút</div>
                  <div className="text-xs text-slate-500 font-medium">Đổi mới tại Showroom</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">2 Giờ</div>
                  <div className="text-xs text-slate-500 font-medium">Giao hỏa tốc nội thành</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Tech Card (NeuralForge Apex Titan v5) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 p-6 text-white shadow-2xl group">
                {/* Ambient glow effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Badges on Top */}
                <div className="flex items-center justify-between text-[11px] font-bold mb-4">
                  <span className="text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/80">
                    CẤU HÌNH TỐI TÂN: WORKSTATION AI
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SẴN HÀNG TẠI SHOWROOM
                  </span>
                </div>

                {/* PC Workstation Image Showcase */}
                <Link
                  href="/san-pham/vga-msi-geforce-rtx-4090-suprim-x-24gb"
                  scroll={true}
                  className="block relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-900/60 my-2 group/card cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800"
                    alt="NeuralForge Apex Titan v5"
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 right-3 bg-blue-600/90 hover:bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-lg">
                    <span>Xem chi tiết sản phẩm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* Info Card Bar */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Link
                        href="/san-pham/vga-msi-geforce-rtx-4090-suprim-x-24gb"
                        scroll={true}
                        className="hover:text-blue-400 transition"
                      >
                        <h3 className="text-lg font-black text-white hover:text-blue-400 transition flex items-center gap-2">
                          <span>NeuralForge Apex Titan v5</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        Dual RTX 4090 24GB • Threadripper PRO 7995WX • 256GB ECC DDR5
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                        256 PFLOPS AI FP16
                      </span>
                      <span className="text-[10px] text-slate-400">256GB ECC DDR5</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đặc quyền bảo trì tận nơi &amp; Hỗ trợ kỹ thuật 24/7 trọn đời</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Trust Badges Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-100">
            {/* 1 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">100% Chính Hãng</h4>
                <p className="text-[11px] text-slate-500">Nhập khẩu chính ngạch &amp; VAT đầy đủ</p>
              </div>
            </div>

            {/* 2 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Giao Hỏa Tốc 2H</h4>
                <p className="text-[11px] text-slate-500">Miễn phí vận chuyển nội thành &amp; COD</p>
              </div>
            </div>

            {/* 3 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">TechCare+ Đổi Mới 1:1</h4>
                <p className="text-[11px] text-slate-500">Đổi mới trong 30 ngày, mượn máy sơ cua</p>
              </div>
            </div>

            {/* 4 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Thủ Đức &amp; Q1, TP. HCM</h4>
                <p className="text-[11px] text-slate-500">Trải nghiệm thực tế tại Showroom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MA TRẬN DANH MỤC GIẢI PHÁP NHANH (6 Solution Cards)
      ========================================================================= */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block mb-1">
              DANH MỤC PHÂN PHỐI CHUYÊN BIỆT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ma Trận Danh Mục Giải Pháp Nhanh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Lựa chọn nhóm sản phẩm chuyên môn hóa phục vụ nhu cầu từ gaming đỉnh cao đến điện toán doanh nghiệp
            </p>
          </div>

          <Link
            href="/danh-muc/tat-ca"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
          >
            <span>Xem tất cả danh mục phân phối</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Category Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <Link
            href="/danh-muc/linh-kien-pc"
            className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  Khuyên dùng Doanh Nghiệp
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                AI &amp; Deep Learning Clusters
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Hệ thống máy chủ tính toán chuyên sâu cho mô hình LLM, thị giác máy tính và đào tạo AI.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Xem các cụm giải pháp AI</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/danh-muc/linh-kien-pc"
            className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/60">
                  Custom Hard-Tubing
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                Flagship PC &amp; Custom Loop
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Dàn máy siêu phẩm tản nhiệt nước cá nhân hóa cho game thủ và streamer chuyên nghiệp.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Khám phá bộ sưu tập PC</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/danh-muc/laptop"
            className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Apple className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                  Chính hãng Apple VN/A
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                Apple Studio &amp; Mac Pro
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Hệ sinh thái Apple Silicon M3/M4 Max cho nhà sáng tạo nội dung, âm thanh và dựng phim 8K.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Trải nghiệm không gian Apple</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/danh-muc/man-hinh"
            className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Monitor className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Chuẩn màu 99% DCI-P3
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                Màn Hình Đồ Họa 4K, 8K &amp; OLED
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Giải pháp hiển thị chuyên sâu cho VFX Artist, colorist và game thủ esport tần số quét đến 360Hz.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Bảng thông số màn hình</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 5 */}
          <Link
            href="/danh-muc/linh-kien-pc"
            className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                  Flagship Hardware
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                Linh Kiện Sau Độc Tuyển Chọn
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Card đồ họa RTX 4090, CPU i9-14900KS, RAM DDR5 7200MHz và SSD Gen 5 tốc độ 14.000MB/s.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Kho linh kiện tuyển chọn</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 6 */}
          <Link
            href="/danh-muc/phu-kien-gaming"
            className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Custom Sound &amp; Mod
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                Gaming Gear &amp; Setup Hi-End
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Bàn phím cơ Custom gõ đầm, chuột siêu nhẹ không dây và tai nghe âm thanh vòm audiophile.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Góc setup công nghệ cao</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. FLASH DEALS CÔNG NGHỆ GIÁ SỐC (Live Countdown + 4 Product Cards)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl">
          {/* Dark Bar Header with Countdown */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                <Flame className="w-5 h-5 fill-red-400 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <span>Flash Deals Công Nghệ Giá Vàng</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Ưu đãi giới hạn chỉ còn 48h dành riêng cho các thành viên TechCore VIP Member
                </p>
              </div>
            </div>

            {/* Countdown Boxes */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">
                KẾT THÚC TRONG:
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="font-bold text-slate-400">:</span>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="font-bold text-slate-400">:</span>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* 4 Flash Deal Product Cards (Dynamic từ Catalog sản phẩm) */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {flashDeals.map((deal, idx) => (
              <div
                key={deal.variantId || idx}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition flex flex-col justify-between relative group"
              >
                <span className={`absolute top-3 left-3 ${deal.badgeColor} text-white text-[10px] font-black px-2 py-1 rounded-md z-10`}>
                  {deal.discountBadge}
                </span>
                <div>
                  <Link
                    href={`/san-pham/${deal.slug}`}
                    scroll={true}
                    className="block w-full h-44 rounded-xl overflow-hidden bg-slate-50 mb-3 cursor-pointer group/item"
                  >
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <Link href={`/san-pham/${deal.slug}`} scroll={true}>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1 hover:text-blue-600 transition">
                      {deal.title}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-slate-400 mb-2">{deal.subtitle}</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-black text-blue-600">{formatVND(deal.price)}</span>
                    {deal.comparePrice > deal.price && (
                      <span className="text-xs text-slate-400 line-through">{formatVND(deal.comparePrice)}</span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className={`bg-blue-600 h-1.5 rounded-full ${deal.progress}`} />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-red-500 font-bold">{deal.alertText}</p>
                    <Link
                      href={`/san-pham/${deal.slug}`}
                      scroll={true}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      Chi tiết &rarr;
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(deal.variantId)}
                    disabled={addingId === deal.variantId}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                    title="Thêm vào giỏ hàng"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate">{addedId === deal.variantId ? "Đã thêm ✓" : "+ Giỏ hàng"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(deal.variantId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs shadow-blue-500/25 active:scale-95"
                    title="Mua ngay"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Mua Ngay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3B. SẢN PHẨM TIÊU CHUẨN & PHẦN CỨNG CHÍNH HÃNG (GIÁ NIÊM YẾT / KHÔNG SALE)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase mb-2">
              <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>HÀNG NGUYÊN BẢN CHÍNH HÃNG • GIÁ NIÊM YẾT GỐC (NON-SALE)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Tiêu Chuẩn &amp; Phần Cứng Hãng
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Các dòng sản phẩm giữ nguyên giá niêm yết chính ngạch từ hãng, bảo chứng xuất xứ nguyên seal 100% kèm đặc quyền đổi mới trong 30 ngày.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none shrink-0">
            {[
              { key: "all", label: `Tất Cả (${tabCounts.all})` },
              { key: "hardware", label: `CPU & Card Đồ Họa (${tabCounts.hardware})` },
              { key: "apple", label: `Apple Chính Hãng (${tabCounts.apple})` },
              { key: "gear", label: `Gaming Gear (${tabCounts.gear})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setNonSaleFilter(tab.key as any);
                  setStandardVisibleCount(6);
                }}
                className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  nonSaleFilter === tab.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Non-Sale Product Cards Grid (Tự động tải thêm theo nhu cầu) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStandardProducts
            .slice(0, standardVisibleCount)
            .map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges (Non-Sale: No -% discount badge, authentic manufacturer badge) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${prod.badgeColor}`}>
                      {prod.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      {prod.warranty}
                    </span>
                  </div>

                  {/* Image */}
                  <Link
                    href={`/san-pham/${prod.slug}`}
                    scroll={true}
                    className="block w-full h-48 rounded-2xl overflow-hidden bg-slate-50 mb-3.5 cursor-pointer relative"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Xem chi tiết</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>

                  {/* Title */}
                  <Link href={`/san-pham/${prod.slug}`} scroll={true}>
                    <h3 className="text-sm font-black text-slate-900 line-clamp-2 hover:text-blue-600 transition leading-snug mb-1.5">
                      {prod.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">{prod.specs}</p>

                  {/* Price display (Giá niêm yết không sale, không gạch giá) */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      Giá niêm yết chính hãng (VAT)
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {formatVND(prod.price)}
                    </span>
                  </div>
                </div>

                {/* 2 Buttons: Thêm vào giỏ hàng + Mua ngay */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod.variantId)}
                    disabled={addingId === prod.variantId}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    title="Thêm vào giỏ hàng"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate">
                      {addedId === prod.variantId ? "Đã thêm ✓" : "+ Giỏ Hàng"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(prod.variantId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm shadow-blue-500/25 active:scale-95 cursor-pointer"
                    title="Mua ngay"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Mua Ngay</span>
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Nút Xem Thêm / Thu Gọn / Khám Phá Toàn Bộ */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          {standardVisibleCount < filteredStandardProducts.length && (
            <button
              type="button"
              onClick={() => setStandardVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs border border-blue-200 shadow-xs hover:shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Xem Thêm (+6 Sản Phẩm)</span>
              <ChevronDown className="w-4 h-4 text-blue-600" />
            </button>
          )}

          {standardVisibleCount > 6 && (
            <button
              type="button"
              onClick={() => setStandardVisibleCount(6)}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Thu Gọn</span>
              <ChevronUp className="w-4 h-4 text-slate-500" />
            </button>
          )}

          <Link
            href="/danh-muc/tat-ca"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition flex items-center gap-2 active:scale-95"
          >
            <span>Khám Phá Toàn Bộ Kho ({tabCounts.all} Sản Phẩm)</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          4. GIẢI PHÁP TRỌN GÓI THEO TỪNG NHU CẦU (Interactive Workstation Tabs)
      ========================================================================= */}
      <section id="workstations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block mb-1">
            HỆ SINH THÁI TỔ HỢP THIẾT KẾ SẴN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Giải Pháp Trọn Gói Theo Từng Nhu Cầu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tối ưu hóa sức mạnh phần cứng &amp; phần mềm đồng bộ cho hiệu suất công việc tối ưu nhất
          </p>
        </div>

        {/* 4 Interactive Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveSolutionTab("ai")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
              activeSolutionTab === "ai"
                ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            AI &amp; Machine Learning
          </button>

          <button
            type="button"
            onClick={() => setActiveSolutionTab("vfx")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
              activeSolutionTab === "vfx"
                ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Đồ họa Phim &amp; 3D Render VFX
          </button>

          <button
            type="button"
            onClick={() => setActiveSolutionTab("gaming")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
              activeSolutionTab === "gaming"
                ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Game FPS Sport &amp; Streamer
          </button>

          <button
            type="button"
            onClick={() => setActiveSolutionTab("enterprise")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
              activeSolutionTab === "enterprise"
                ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Doanh Nghiệp &amp; Studio Server
          </button>
        </div>

        {/* Featured Showcase Box for Active Tab */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Product Image */}
            <Link
              href={`/san-pham/${currentPackage.slug}`}
              scroll={true}
              className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 h-72 sm:h-80 flex items-center justify-center cursor-pointer group/ws"
            >
              <img
                src={currentPackage.image}
                alt={currentPackage.title}
                className="w-full h-full object-cover group-hover/ws:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover/ws:opacity-80 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300">
                <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Burn-in 72h</span>
                </div>
                <div className="bg-blue-600/90 text-white font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                  <span>Chi tiết &rarr;</span>
                </div>
              </div>
            </Link>

            {/* Right Spec & Price Details */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-2">
                  {currentPackage.tag}
                </span>
                <Link href={`/san-pham/${currentPackage.slug}`} scroll={true}>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight hover:text-blue-600 transition flex items-center gap-2">
                    <span>{currentPackage.title}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentPackage.desc}
                </p>
              </div>

              {/* 4 Spec Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {currentPackage.badges.map((b, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
                    <p className="text-xs font-bold text-slate-900 leading-snug">{b.title}</p>
                    <p className="text-[11px] text-slate-500">{b.sub}</p>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Giá trọn gói tham khảo</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600">
                    {formatVND(currentPackage.price)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSolutionTab === "ai") {
                        setBuilderConfig({
                          cpu: "tr-7995wx",
                          gpu: "dual-4090",
                          ram: "ram-256gb",
                          storage: "ssd-4tb-gen5",
                          motherboard: "asrock-wrx90",
                          casePsu: "corsair-1500w",
                        });
                      } else if (activeSolutionTab === "vfx") {
                        setBuilderConfig({
                          cpu: "i9-14900k",
                          gpu: "rtx-4090",
                          ram: "ram-64gb",
                          storage: "ssd-2tb",
                          motherboard: "rog-z790",
                          casePsu: "lianli-1200w",
                        });
                      } else if (activeSolutionTab === "gaming") {
                        setBuilderConfig({
                          cpu: "r7-7800x3d",
                          gpu: "rtx-4080s",
                          ram: "ram-32gb",
                          storage: "ssd-2tb",
                          motherboard: "msi-x670e",
                          casePsu: "lianli-1200w",
                        });
                      } else {
                        setBuilderConfig({
                          cpu: "tr-7995wx",
                          gpu: "rtx-4080s",
                          ram: "ram-64gb",
                          storage: "ssd-4tb-gen5",
                          motherboard: "asrock-wrx90",
                          casePsu: "corsair-1500w",
                        });
                      }
                      setIsBuilderOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl transition shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>Tùy Biến Cấu Hình</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(currentPackage.variantId, currentPackage.title)}
                    disabled={addingId === currentPackage.variantId}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl transition active:scale-95 flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                    <span>{addedId === currentPackage.variantId ? "Đã thêm ✓" : "+ Giỏ Hàng"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBuyNow(currentPackage.variantId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl transition shadow-lg shadow-blue-500/25 active:scale-95 flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Mua Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ĐẶC QUYỀN DỊCH VỤ TECHCARE & CÔNG NGHỆ ĐỘC BẢN (Dark Navy Strip)
      ========================================================================= */}
      <section id="techcare" className="bg-gradient-to-br from-[#060c1d] via-[#091530] to-[#040817] py-16 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase block mb-1">
              THE TECHCORE GUARANTEE OF EXCELLENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Đặc Quyền Dịch Vụ TechCare &amp; Công Nghệ Độc Bản
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Trải nghiệm tiêu chuẩn dịch vụ khách hàng 5 sao với chính sách bảo hành chưa từng có tại thị trường công nghệ Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">4-Shield Tamper-Proof</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Hệ thống tem niêm phong siêu bền cùng camera soi mã vạch từng linh kiện trong kiện hàng giúp đảm bảo sản phẩm nguyên seal 100% khi tới tay bạn.
                </p>
              </div>
              <Link
                href="/tra-cuu-bao-hanh"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
              >
                <span>Tìm hiểu tiêu chuẩn 4-Shield</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">TechCare 1-Đổi-1 Siêu Tốc</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Quy trình xác nhận bảo hành tại chỗ không phải chờ đợi. Luôn có linh kiện mới nguyên seal dự phòng để đổi ngay trong 15 phút tại showroom hoặc qua bưu điện hỏa tốc.
                </p>
              </div>
              <Link
                href="/tra-cuu-bao-hanh"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
              >
                <span>Xem quy trình đổi trả 1:1</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-5">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">TechCare Express Tận Nơi</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Chuyên viên kỹ thuật đến hỗ trợ kiểm tra, vệ sinh hoặc thay thế linh kiện tận văn phòng/nhà riêng của bạn hoàn toàn miễn phí trong 12 tháng đầu.
                </p>
              </div>
              <Link
                href="/tra-cuu-bao-hanh"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <span>Lịch phục vụ tại showroom</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. KHÁCH HÀNG DOANH NGHIỆP & CHUYÊN GIA TIN CẬY (3 Testimonials)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block mb-1">
              ĐỐI TÁC DOANH NGHIỆP &amp; KHÁCH HÀNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Khách Hàng Doanh Nghiệp &amp; Chuyên Gia Tin Cậy
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hơn 50.000 khách hàng cá nhân và doanh nghiệp công nghệ hàng đầu tin dùng.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Dựa trên 12.800+ đánh giá</p>
            </div>
            <div className="text-2xl font-black text-slate-900 border-l pl-3 border-slate-200">
              4.9/5.0
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-400 gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;Hệ thống 4 máy chủ GPU huấn luyện mô hình AI của chúng tôi vận hành liên tục 6 tháng qua với độ ổn định 99.99%. Dịch vụ hỗ trợ kỹ thuật của TechCore phản hồi trong vòng 5 phút là điểm cộng rất lớn.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-5 mt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                NL
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">TS. Nguyễn Hoàng Long</p>
                <p className="text-[11px] text-slate-400">Trưởng phòng R&amp;D AI Lab, Vingroup Tech</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-400 gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;Mình dựng các dự án phim điện ảnh và 3D VFX với khối lượng data rất lớn. Chiếc máy trạm do TechCore tư vấn giúp tối ưu thời gian render đi gần một nửa so với hệ thống cũ. Rất hài lòng!&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-5 mt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                TK
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Trần Nam Khánh</p>
                <p className="text-[11px] text-slate-400">Giám đốc VFX Director, Plan8 Studio</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-400 gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;Giao hàng cực nhanh, linh kiện đóng gói chống sốc 4 lớp chắc chắn. Đặc biệt là mã bảo hành điện tử quét Serial tra cứu thông tin trong tích tắc. Đã build 3 dàn máy tại đây cho công ty.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-5 mt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                VĐ
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Vũ Thành Đạt</p>
                <p className="text-[11px] text-slate-400">CTO &amp; Sáng lập, Fintech Hub Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. TECHCORE INSIGHTS & CHUYÊN SÂU CÔNG NGHỆ (3 Article Cards)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block mb-1">
              ĐIỂM TIN &amp; PHÂN TÍCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              TechCore Insights &amp; Chuyên Sâu Công Nghệ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Điểm tin công nghệ thế hệ mới, so sánh hiệu năng phần cứng và cẩm nang lựa chọn tối ưu
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedArticle(techInsights[0])}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Xem tất cả bài viết chuyên sâu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techInsights.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] text-blue-600 font-bold mb-1.5">
                    <span>{article.date}</span>
                    <span className="text-slate-400 font-normal">{article.readTime}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Đọc nghiên cứu chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. VIP NEWSLETTER SUBSCRIPTION BANNER (Blue Banner)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/30 inline-block">
                ĐẶC QUYỀN THÀNH VIÊN DOANH NGHIỆP
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Nhận Bảng Báo Giá Linh Kiện &amp; Khuyến Mãi VIP Riêng Biệt
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                Đăng ký nhận báo giá linh kiện giá sỉ và danh sách phần cứng cao cấp sắp về sớm nhất trước khi mở bán rộng rãi.
              </p>
            </div>

            <div className="lg:col-span-5">
              {vipSuccess ? (
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center text-xs font-bold text-white flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Đăng ký nhận bản tin VIP thành công!</span>
                </div>
              ) : (
                <form onSubmit={handleVipSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Nhập email của bạn..."
                    value={vipEmail}
                    onChange={(e) => setVipEmail(e.target.value)}
                    className="flex-1 bg-white text-slate-900 text-xs sm:text-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 shadow-inner font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-2xl transition shadow-md shrink-0 active:scale-95"
                  >
                    Đăng Ký VIP
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CUSTOM PC BUILDER 3D MODAL (Interactive Hardware Configurator)
      ========================================================================= */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4.5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <span>Xây Dựng Cấu Hình PC &amp; AI Workstation 3D</span>
                    <span className="text-[10px] bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded-full">
                      v2.6 Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tùy biến từng linh kiện cao cấp • Kiểm tra tương thích điện áp tự động • Đồng bộ trực tiếp vào giỏ hàng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
              {/* Left Column: 6 Component Pickers */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. CPU */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span>1. Bộ Vi Xử Lý (CPU)</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {formatVND(currentCpu.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {builderOptions.cpu.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, cpu: item.id }))}
                        className={`p-3 rounded-xl text-left border transition text-xs font-semibold flex items-center justify-between ${
                          builderConfig.cpu === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-mono text-slate-500 shrink-0 ml-2">
                          {formatVND(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. GPU */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Zap className="w-4 h-4 text-cyan-600" />
                      <span>2. Card Màn Hình (GPU / VGA)</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {formatVND(currentGpu.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {builderOptions.gpu.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, gpu: item.id }))}
                        className={`p-3 rounded-xl text-left border transition text-xs font-semibold flex items-center justify-between ${
                          builderConfig.gpu === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-mono text-slate-500 shrink-0 ml-2">
                          {formatVND(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. RAM */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Boxes className="w-4 h-4 text-purple-600" />
                      <span>3. Bộ Nhớ Trong (RAM DDR5)</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {formatVND(currentRam.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {builderOptions.ram.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, ram: item.id }))}
                        className={`p-3 rounded-xl text-left border transition text-xs font-semibold flex items-center justify-between ${
                          builderConfig.ram === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-mono text-slate-500 shrink-0 ml-2">
                          {formatVND(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. SSD */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>4. Ổ Cứng Siêu Tốc (SSD NVMe)</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {formatVND(currentStorage.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {builderOptions.storage.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, storage: item.id }))}
                        className={`p-3 rounded-xl text-left border transition text-xs font-semibold flex items-center justify-between ${
                          builderConfig.storage === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-mono text-slate-500 shrink-0 ml-2">
                          {formatVND(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Mainboard */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Sliders className="w-4 h-4 text-amber-600" />
                      <span>5. Bo Mạch Chủ (Mainboard)</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {formatVND(currentMotherboard.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {builderOptions.motherboard.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, motherboard: item.id }))}
                        className={`p-3 rounded-xl text-left border transition text-xs font-semibold flex items-center justify-between ${
                          builderConfig.motherboard === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-mono text-slate-500 shrink-0 ml-2">
                          {formatVND(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Case & Nguồn */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>6. Vỏ Case &amp; Nguồn (PSU 80 Plus)</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {formatVND(currentCasePsu.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {builderOptions.casePsu.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, casePsu: item.id }))}
                        className={`p-3 rounded-xl text-left border transition text-xs font-semibold flex items-center justify-between ${
                          builderConfig.casePsu === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-mono text-slate-500 shrink-0 ml-2">
                          {formatVND(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Summary & Compatibility & Actions */}
              <div className="lg:col-span-5 space-y-4">
                <div className="sticky top-0 p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      TỔNG GIÁ TRỊ CẤU HÌNH
                    </span>
                    <span className="text-xs font-mono bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">
                      TDP: ~{builderTotalTdp}W
                    </span>
                  </div>

                  {/* Total price display */}
                  <div>
                    <div className="text-3xl font-black text-cyan-400 font-mono">
                      {formatVND(builderTotalPrice)}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Đã bao gồm VAT, công lắp ráp trọn gói &amp; tản nhiệt cao cấp
                    </p>
                  </div>

                  {/* Compatibility Status */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>100% Linh kiện tương thích Socket &amp; Băng thông</span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <p>• Nguồn khuyến nghị: {Math.max(850, Math.round((builderTotalTdp * 1.5) / 100) * 100)}W+</p>
                      <p>• Bảo hành tận nơi: 36 tháng TechCare+ Đổi Mới 1:1</p>
                      <p>• Stress-test tải nặng: 72 giờ trước khi bàn giao</p>
                    </div>
                  </div>

                  {/* Selected Components Recap */}
                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">CPU:</span>
                      <span className="font-bold truncate max-w-[200px] text-right">{currentCpu.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">GPU:</span>
                      <span className="font-bold truncate max-w-[200px] text-right">{currentGpu.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">RAM:</span>
                      <span className="font-bold truncate max-w-[200px] text-right">{currentRam.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">SSD:</span>
                      <span className="font-bold truncate max-w-[200px] text-right">{currentStorage.name}</span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      disabled={builderAdding}
                      onClick={handleAddBuilderToCart}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/25 active:scale-98"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{builderAdding ? "Đang xử lý..." : "+ Thêm Toàn Bộ Cấu Hình Vào Giỏ"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={builderAdding}
                      onClick={handleBuyBuilderNow}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-98"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Mua Ngay Cấu Hình Này</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. INTERACTIVE ARTICLE READER MODAL (TechCore Insights Deep-Dive)
      ========================================================================= */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-2">
                  <span className="bg-blue-100 px-2.5 py-0.5 rounded-full">{selectedArticle.category}</span>
                  <span>• {selectedArticle.date}</span>
                  <span>• {selectedArticle.readTime}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Tác giả: {selectedArticle.author}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center shrink-0 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Featured Image */}
              <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedArticle.fullContent.map((paragraph: string, idx: number) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Benchmark comparison table */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <BarChart3Icon />
                  <span>Bảng Thông Số Đo Đạc Thực Nghiệm &amp; Đối Soát</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-2 font-bold">Chỉ số đo đạc</th>
                        <th className="pb-2 font-bold text-blue-600">TechCore Đề Xuất</th>
                        <th className="pb-2 font-bold text-slate-500">Giải Pháp Tiêu Chuẩn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedArticle.specsComparison.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-white/60">
                          <td className="py-2.5 font-bold text-slate-900">{row.metric}</td>
                          <td className="py-2.5 font-mono font-bold text-blue-600">{row.rtx4090}</td>
                          <td className="py-2.5 font-mono text-slate-600">{row.h100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Related product box */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                    SẢN PHẨM KHUYÊN DÙNG TRONG BÀI VIẾT
                  </span>
                  <p className="text-xs sm:text-sm font-black text-slate-900">
                    {selectedArticle.relatedProductName}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/san-pham/${selectedArticle.relatedProductSlug}`}
                    onClick={() => setSelectedArticle(null)}
                    className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
                  >
                    <span>Xem Chi Tiết</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedArticle.relatedVariantId, selectedArticle.relatedProductName);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Thêm Giỏ Hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          11. FLOATING HIGH-TECH TOAST NOTIFICATION
      ========================================================================= */}
      {toast?.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white border border-blue-500/40 shadow-2xl rounded-2xl p-4 max-w-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-white">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
              {toast.productName && (
                <p className="text-[10px] text-blue-400 font-medium truncate mt-1">
                  {toast.productName}
                </p>
              )}
              <div className="flex items-center gap-2 pt-2 mt-1">
                <Link
                  href="/gio-hang"
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Xem giỏ hàng ngay &rarr;</span>
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white transition text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon helper cho bài viết
function BarChart3Icon() {
  return (
    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
