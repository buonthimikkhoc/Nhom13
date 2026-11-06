import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from "./mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Helper để lấy giỏ hàng từ localStorage
function getLocalCart(): { id: string; items: any[]; total: number } {
  if (typeof window === "undefined") {
    return { id: "cart-local", items: [], total: 0 };
  }
  try {
    const raw = localStorage.getItem("tech_cart");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { id: "cart-local", items: [], total: 0 };
}

function saveLocalCart(cart: any) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("tech_cart", JSON.stringify(cart));
    } catch (e) {}
  }
}

// Helper để lấy danh sách đơn hàng đã đồng bộ từ localStorage
function getLocalOrders(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tech_orders");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  // Mặc định khởi tạo dữ liệu mẫu nếu chưa có
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("tech_orders", JSON.stringify(DEFAULT_SEED_ORDERS));
    } catch (e) {}
  }
  return DEFAULT_SEED_ORDERS;
}

function saveLocalOrders(orders: any[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("tech_orders", JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent("techcore:orders-changed", { detail: orders }));
    } catch (e) {}
  }
}

// Khởi tạo đơn hàng mẫu mặc định nếu chưa có
const DEFAULT_SEED_ORDERS = [
  {
    id: "ord-sample-1",
    code: "TECH-2026-8888",
    receiverName: "Nguyễn Văn An",
    phone: "0987654321",
    guestEmail: "an.nguyen@enterprise.vn",
    province: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng",
    street: "Tòa nhà Keangnam Landmark 72, Phạm Hùng",
    note: "Giao giờ hành chính, gọi trước 15p",
    grandTotal: 49990000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "vnpay",
    createdAt: "2026-10-28T09:30:00.000Z",
    items: [
      {
        id: "it-1",
        variantId: "var-rog-1",
        productName: "Laptop Gaming ASUS ROG Strix G16 G614JVR (2024)",
        sku: "ROG-G16-I9-32G-1T",
        quantity: 1,
        lineTotal: 49990000,
        serialNumber: "ROG16-2024-001",
      },
    ],
  },
  {
    id: "ord-sample-2",
    code: "TECH-2026-9999",
    receiverName: "Hoàng Mai Linh",
    phone: "0987654302",
    guestEmail: "mailinh.design@gmail.com",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Bến Nghé",
    street: "Tầng 15 Vincom Center, 72 Lê Thánh Tôn",
    note: "Giao tận tay trong ngày",
    grandTotal: 33990000,
    status: "packing",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-30T08:15:00.000Z",
    items: [
      {
        id: "it-2",
        variantId: "var-ip16-1",
        productName: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
        sku: "IP16PM-256-DESERT",
        quantity: 1,
        lineTotal: 33990000,
        serialNumber: "IMEI-354892019283741",
      },
    ],
  },
  {
    id: "ord-sample-3",
    code: "TECH-2026-7471",
    receiverName: "Trần Hải Đăng",
    phone: "0918234567",
    guestEmail: "dang.tran@fpt.com",
    province: "Đà Nẵng",
    district: "Hải Châu",
    ward: "Hải Châu 1",
    street: "Số 88 Bạch Đằng",
    note: "Vận chuyển xe lạnh bảo ôn CoolVan",
    grandTotal: 128500000,
    status: "shipping",
    paymentStatus: "paid",
    paymentMethod: "techpay",
    createdAt: "2026-11-04T10:20:00.000Z",
    items: [
      {
        id: "it-3",
        variantId: "var-ws-4090",
        productName: "Workstation AI Dual RTX 4090 24GB OC Enterprise",
        sku: "WS-DUAL4090-AI-128G",
        quantity: 1,
        lineTotal: 128500000,
        serialNumber: "WS4090-2026-X8",
      },
    ],
  },
  {
    id: "ord-sample-4",
    code: "TECH-2026-6210",
    receiverName: "Lê Phương Thảo",
    phone: "0977889900",
    guestEmail: "thao.le@techcare.io",
    province: "Hà Nội",
    district: "Đống Đa",
    ward: "Láng Hạ",
    street: "Số 55 Huỳnh Thúc Kháng",
    note: "Kiểm tra kỹ tem bảo hành trước khi giao",
    grandTotal: 18990000,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cod",
    createdAt: "2026-11-05T07:15:00.000Z",
    items: [
      {
        id: "it-4",
        variantId: "var-pad-pro",
        productName: "iPad Pro M4 11 inch 256GB Wi-Fi Space Black",
        sku: "IPAD-M4-11-256-BLK",
        quantity: 1,
        lineTotal: 18990000,
        serialNumber: "SN-IPAD-M4-0921",
      },
    ],
  },
  {
    id: "ord-sample-5",
    code: "TECH-2026-AI01",
    receiverName: "DeepAI Vietnam Corp",
    phone: "028.7300.9988",
    guestEmail: "enterprise@deepai.vn",
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Tăng Nhơn Phú B",
    street: "Khu Công Nghệ Cao (SHTP)",
    note: "Dự án trung tâm tính toán AI Lab",
    grandTotal: 1420000000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-15T14:00:00.000Z",
    items: [
      {
        id: "it-5",
        productName: "Cụm 4x Workstation Threadripper 7995WX & Dual RTX 4090 Loop Pro",
        sku: "AI-CLUSTER-7995WX-LOOP",
        quantity: 4,
        lineTotal: 1420000000,
        serialNumber: "SN-DEEPAI-7995-001",
      },
    ],
  },
  {
    id: "ord-sample-6",
    code: "TECH-2026-FPT8",
    receiverName: "FPT AI Research Center",
    phone: "024.7300.7300",
    guestEmail: "namtd@fpt.com.vn",
    province: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng Hậu",
    street: "Tòa nhà FPT, Phố Duy Tân",
    note: "Hợp đồng máy chủ doanh nghiệp Supermicro",
    grandTotal: 2890000000,
    status: "shipping",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-20T11:30:00.000Z",
    items: [
      {
        id: "it-6",
        productName: "Hệ thống 8 Node Supermicro GPU Server Ada L40S & InfiniBand",
        sku: "SMC-GPU-8N-L40S",
        quantity: 8,
        lineTotal: 2890000000,
        serialNumber: "SN-FPT-SMC-8N-09",
      },
    ],
  },
  {
    id: "ord-sample-7",
    code: "TECH-2026-VIN1",
    receiverName: "VinAI Robotics Lab",
    phone: "024.3974.9999",
    guestEmail: "robotics@vinai.io",
    province: "Hà Nội",
    district: "Long Biên",
    ward: "Phúc Đồng",
    street: "Vinhomes Riverside",
    note: "Cụm tính toán xe tự hành và thị giác máy",
    grandTotal: 4100000000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    createdAt: "2026-09-10T09:00:00.000Z",
    items: [
      {
        id: "it-7",
        productName: "Cụm 12x NVIDIA RTX 6000 Ada Generation Rackmount",
        sku: "VIN-RTX6000-ADA-12X",
        quantity: 12,
        lineTotal: 4100000000,
        serialNumber: "SN-VINAI-ADA-12X-01",
      },
    ],
  },
  {
    id: "ord-sample-8",
    code: "TECH-2026-VFX3",
    receiverName: "Trần Minh Quân",
    phone: "0918.999.888",
    guestEmail: "quan.tm@vfxstudio.vn",
    province: "TP. Hồ Chí Minh",
    district: "Bình Thạnh",
    ward: "Phường 22",
    street: "Vinhomes Central Park",
    note: "Máy trạm Render 3D chuyên dụng",
    grandTotal: 124500000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "techpay",
    createdAt: "2026-10-25T16:45:00.000Z",
    items: [
      {
        id: "it-8",
        productName: "Workstation Render 3D RTX 4090 OC",
        sku: "WS-RENDER-4090-OC",
        quantity: 1,
        lineTotal: 124500000,
        serialNumber: "SN-VFX-4090-032",
      },
    ],
  },
  {
    id: "ord-sample-9",
    code: "TECH-2026-DL05",
    receiverName: "Lê Tuấn Dũng",
    phone: "0978.112.333",
    guestEmail: "tuandung.ai@outlook.com",
    province: "Hà Nội",
    district: "Nam Từ Liêm",
    ward: "Mễ Trì",
    street: "Khu Đô Thị Mễ Trì",
    note: "Giao tận tay giờ hành chính",
    grandTotal: 56990000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "vnpay",
    createdAt: "2026-11-01T10:10:00.000Z",
    items: [
      {
        id: "it-9",
        productName: "Card đồ họa ASUS ROG Astral RTX 4090 24GB OC",
        sku: "ASUS-ROG-4090-ASTRAL",
        quantity: 1,
        lineTotal: 56990000,
        serialNumber: "SN-ROG-4090-098",
      },
    ],
  },
];

const DEFAULT_SEED_CUSTOMERS = [
  {
    id: "cust-01",
    code: "KH-VIP-001",
    name: "DeepAI Vietnam Corp",
    representative: "TS. Vũ Đức Trí (Giám Đốc Nghiên Cứu)",
    type: "b2b",
    email: "enterprise@deepai.vn",
    phone: "028.7300.9988",
    taxCode: "0315.889.912",
    address: "Khu Công Nghệ Cao (SHTP), TP. Thủ Đức, TP.HCM",
    hub: "Kho Landmark 81",
    vipTier: "VIP Titanium",
    vipTierCode: "titanium",
    techPoints: 142000,
    ltvAmount: 1420000000,
    ordersCount: 8,
    status: "active",
    statusText: "Hoạt động",
    joinedDate: "15/01/2025",
    primaryHardware: "Cụm 4x Workstation Threadripper 7995WX & Dual RTX 4090 Loop Pro",
    assignedEngineer: "KTV Lê Hoàng Long",
    note: "Khách hàng chiến lược phòng thí nghiệm AI Lab",
  },
  {
    id: "cust-02",
    code: "KH-VIP-002",
    name: "Nguyễn Văn An",
    representative: "Nguyễn Văn An (Kỹ sư Trưởng AI Vision)",
    type: "personal",
    email: "user1@gmail.com",
    phone: "0987.654.321",
    taxCode: "8492019481",
    address: "Tòa tháp Landmark 81, P.22, Bình Thạnh, TP.HCM",
    hub: "Kho Landmark 81",
    vipTier: "VIP Platinum",
    vipTierCode: "platinum",
    techPoints: 34250,
    ltvAmount: 342500000,
    ordersCount: 5,
    status: "active",
    statusText: "Hoạt động",
    joinedDate: "02/03/2025",
    primaryHardware: "1x Workstation AI Dual RTX 4090 OC + MacBook Pro 16\" M3 Max",
    assignedEngineer: "KTV Trần Minh Tuấn",
    note: "Thành viên VIP thân thiết chuyên dòng máy trạm",
  },
  {
    id: "cust-03",
    code: "KH-VIP-003",
    name: "FPT AI Research Center",
    representative: "PGS. TS. Trần Đình Nam",
    type: "b2b",
    email: "namtd@fpt.com.vn",
    phone: "024.7300.7300",
    taxCode: "0101.234.567",
    address: "Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội",
    hub: "Kho Keangnam HN",
    vipTier: "VIP Titanium",
    vipTierCode: "titanium",
    techPoints: 289000,
    ltvAmount: 2890000000,
    ordersCount: 14,
    status: "care",
    statusText: "Đang chăm sóc",
    joinedDate: "10/11/2024",
    primaryHardware: "Hệ thống 8 Node Supermicro GPU Server Ada L40S & InfiniBand",
    assignedEngineer: "KTV Nguyễn Quốc Anh",
    note: "Sắp tới hạn gia hạn hợp đồng bảo trì On-Site 24/7",
  },
  {
    id: "cust-04",
    code: "KH-VIP-004",
    name: "Trần Minh Quân",
    representative: "Trần Minh Quân (Creative Director)",
    type: "personal",
    email: "quan.tm@vfxstudio.vn",
    phone: "0918.999.888",
    taxCode: "8492019112",
    address: "Vinhomes Central Park, Bình Thạnh, TP.HCM",
    hub: "Kho Landmark 81",
    vipTier: "VIP Gold",
    vipTierCode: "gold",
    techPoints: 12400,
    ltvAmount: 124500000,
    ordersCount: 3,
    status: "active",
    statusText: "Hoạt động",
    joinedDate: "20/05/2025",
    primaryHardware: "Workstation Render 3D RTX 4090 OC",
    assignedEngineer: "KTV Lê Hoàng Long",
    note: "Studio đồ họa kỹ xảo điện ảnh",
  },
  {
    id: "cust-05",
    code: "KH-VIP-005",
    name: "VinAI Robotics Lab",
    representative: "ThS. Đặng Quốc Huy",
    type: "b2b",
    email: "robotics@vinai.io",
    phone: "024.3974.9999",
    taxCode: "0108.992.144",
    address: "Vinhomes Riverside, Long Biên, Hà Nội",
    hub: "Kho Keangnam HN",
    vipTier: "VIP Titanium",
    vipTierCode: "titanium",
    techPoints: 410000,
    ltvAmount: 4100000000,
    ordersCount: 18,
    status: "active",
    statusText: "Hoạt động",
    joinedDate: "18/08/2024",
    primaryHardware: "Cụm 12x NVIDIA RTX 6000 Ada Generation Rackmount",
    assignedEngineer: "KTV Nguyễn Quốc Anh",
    note: "Dự án xe tự hành và mô phỏng thị giác máy tính",
  },
  {
    id: "cust-06",
    code: "KH-VIP-006",
    name: "Lê Tuấn Dũng",
    representative: "Lê Tuấn Dũng (Kỹ sư Deep Learning)",
    type: "personal",
    email: "tuandung.ai@outlook.com",
    phone: "0978.112.333",
    taxCode: "8492019385",
    address: "Khu Đô Thị Mễ Trì, Nam Từ Liêm, Hà Nội",
    hub: "Kho Keangnam HN",
    vipTier: "VIP Gold",
    vipTierCode: "gold",
    techPoints: 5690,
    ltvAmount: 56990000,
    ordersCount: 1,
    status: "active",
    statusText: "Hoạt động",
    joinedDate: "05/09/2025",
    primaryHardware: "Card đồ họa ASUS ROG Astral RTX 4090 24GB OC",
    assignedEngineer: "KTV Hub Cầu Giấy",
    note: "Khách hàng cá nhân tự build máy trạm tại nhà",
  },
];

export const DEFAULT_SEED_ADMIN_PRODUCTS = [
  {
    id: "prod-ws-990",
    name: "Workstation AI Dual RTX 4090 OC (Liquid Loop Pro)",
    sku: "TC-WS-AI990-XL",
    slug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
    warrantyTag: "Bảo hành 36T TechCare+",
    category: "AI & Deep Learning",
    subCategory: "Custom Rig Series",
    categoryType: "workstation",
    retailPrice: 235900000,
    costPrice: 198000000,
    stockQty: 3,
    unit: "bộ",
    hub: "Kho Landmark 81",
    hubBreakdown: "LM81: 2 bộ • Keangnam: 1 bộ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-WS990-2026-X88",
    distributor: "TechCore Factory Custom Rig",
    origin: "Lắp ráp & Cân chỉnh tại TP.HCM",
    specs: {
      "Vi xử lý (CPU)": "AMD Threadripper PRO 7995WX (96C/192T, Up to 5.1GHz)",
      "Đồ họa (GPU)": "Dual NVIDIA GeForce RTX 4090 24GB NVLink",
      "Bộ nhớ RAM": "256GB ECC Registered DDR5 5600MHz (8 Kênh)",
      "Lưu trữ": "4x 2TB Gen5 NVMe RAID 0 (30.000 MB/s)",
      "Tản nhiệt": "Custom Hard-Tubing Chrome Loop 2x 480mm Rad",
      "Nguồn": "Corsair AX1600i Digital Titanium",
    },
  },
  {
    id: "prod-rog-4090",
    name: "Card đồ họa ASUS ROG Astral GeForce RTX 4090 24GB OC Edition",
    sku: "GPU-ROG-4090-OC",
    slug: "vga-asus-rog-strix-geforce-rtx-4080-super-16gb",
    warrantyTag: "Deal -5%",
    category: "GPU Hi-End",
    subCategory: "NVIDIA Ada Lovelace",
    categoryType: "gpu",
    retailPrice: 52990000,
    costPrice: 46500000,
    stockQty: 3,
    unit: "chiếc",
    hub: "Kho Keangnam HN",
    hubBreakdown: "Keangnam: 3 chiếc (Sắp hết)",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=300&q=80",
    status: "low_stock",
    statusText: "Sắp hết hàng",
    eShieldSerial: "ESH-ROG-4090-99120-VN",
    distributor: "ASUS Official VN / Synnex FPT",
    origin: "Đài Loan (Nhập khẩu chính ngạch)",
    specs: {
      "Kiến trúc GPU": "NVIDIA Ada Lovelace 4nm",
      "Bộ nhớ đồ họa": "24GB GDDR6X 384-bit (21 Gbps)",
      "Xung nhịp": "2640 MHz (OC Mode Boost Clock)",
      "Điện năng TDP": "450W (Cổng 16-pin 12VHPWR)",
      "Cổng xuất hình": "2x HDMI 2.1a, 3x DisplayPort 1.4a",
    },
  },
  {
    id: "prod-macbook-16",
    name: "Apple MacBook Pro 16\" M3 Max (36GB / 1TB SSD Space Black)",
    sku: "MCB-16-M3M-01",
    slug: "apple-macbook-pro-14-m3-pro",
    warrantyTag: "TechCare Care+ 3Y",
    category: "Apple Enterprise",
    subCategory: "Apple Silicon M3 Max",
    categoryType: "apple",
    retailPrice: 89900000,
    costPrice: 78200000,
    stockQty: 8,
    unit: "máy",
    hub: "Kho Landmark 81",
    hubBreakdown: "LM81: 4 máy • Keangnam: 4 máy",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-MCB-M3M-77192-VN",
    distributor: "Apple Việt Nam / Viettel Distribution",
    origin: "Chính hãng Apple VN/A",
    specs: {
      "Vi xử lý": "Apple M3 Max (16-core CPU, 40-core GPU)",
      "Bộ nhớ thống nhất": "36GB Unified Memory (300GB/s bandwidth)",
      "Lưu trữ SSD": "1TB PCIe NVMe SSD siêu tốc",
      "Màn hình": "16.2 inch Liquid Retina XDR 120Hz ProMotion",
    },
  },
  {
    id: "prod-tr-7995wx",
    name: "Bộ vi xử lý AMD Ryzen Threadripper PRO 7995WX (96 Cores, 192 Threads)",
    sku: "CPU-TR-7995WX",
    slug: "cpu-intel-core-i9-14900k",
    warrantyTag: "sTR5 Enterprise Socket",
    category: "Server / AI CPU",
    subCategory: "Zen 4 Architecture",
    categoryType: "cpu",
    retailPrice: 185000000,
    costPrice: 162000000,
    stockQty: 2,
    unit: "chiếc",
    hub: "Kho Keangnam HN",
    hubBreakdown: "Bảo trì dự phòng Nhà mạng: 2 chiếc",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=300&q=80",
    status: "low_stock",
    statusText: "Sắp hết hàng",
    eShieldSerial: "ESH-CPU-7995-11029-USA",
    distributor: "AMD Enterprise Synnex FPT",
    origin: "Hoa Kỳ / Malaysia",
    specs: {
      "Số nhân / Số luồng": "96 Nhân vật lý, 192 Luồng xử lý",
      "Xung nhịp": "Cơ bản 2.5GHz, Turbo Boost đến 5.1GHz",
      "Bộ nhớ đệm Cache": "384MB L3 Cache + 96MB L2 Cache",
    },
  },
  {
    id: "prod-intel-laptop-1",
    name: "Laptop Intel NUC M15 EVO Core i7-1260P (16GB / 512GB SSD / 15.6 inch Touch IPS)",
    sku: "INTEL-NUC-M15-I7",
    slug: "laptop-intel-nuc-m15-evo",
    warrantyTag: "Chuẩn Intel EVO 24T",
    category: "Laptop Doanh Nhân & Văn Phòng",
    subCategory: "Vỏ nhôm CNC Anodized",
    categoryType: "apple",
    retailPrice: 18990000,
    costPrice: 15500000,
    stockQty: 25,
    unit: "chiếc",
    hub: "Kho Landmark 81",
    hubBreakdown: "LM81: 15 chiếc • Keangnam: 10 chiếc",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-INTEL-M15-88210-USA",
    distributor: "Intel Enterprise Vietnam",
    origin: "Hoa Kỳ / Việt Nam",
    specs: {
      "Bộ vi xử lý": "Intel Core i7-1260P (12 nhân, 16 luồng)",
      "Bộ nhớ RAM": "16GB LPDDR5 5200MHz Dual-Channel",
      "Lưu trữ SSD": "512GB PCIe Gen 4.0 NVMe",
    },
  },
  {
    id: "prod-intel-laptop-2",
    name: "Laptop Gaming Intel NUC X15 King County Core i7-12700H (32GB DDR5 / 1TB / RTX 3070 Ti)",
    sku: "INTEL-NUC-X15-I7",
    slug: "laptop-gaming-intel-nuc-x15-king-county",
    warrantyTag: "Bảo hành 24T TechCare+",
    category: "Laptop Gaming & eSports",
    subCategory: "Magie Alloy Chassis",
    categoryType: "workstation",
    retailPrice: 29490000,
    costPrice: 24000000,
    stockQty: 18,
    unit: "chiếc",
    hub: "Tổng kho Tân Bình",
    hubBreakdown: "Tân Bình: 10 chiếc • LM81: 8 chiếc",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-INTEL-X15-77912-USA",
    distributor: "Intel Enterprise Vietnam",
    origin: "Hoa Kỳ / Đài Loan",
    specs: {
      "Bộ vi xử lý": "Intel Core i7-12700H (14 nhân, 20 luồng)",
      "Đồ họa VGA": "NVIDIA GeForce RTX 3070 Ti 8GB (140W)",
      "Bộ nhớ RAM": "32GB DDR5 4800MHz Dual-Channel",
    },
  },
  {
    id: "prod-intel-laptop-3",
    name: "Laptop Intel NUC Studio AI Workstation Core Ultra 9 185H (32GB / 2TB / RTX 4070 / 3.2K Mini-LED)",
    sku: "INTEL-STUDIO-U9-32G",
    slug: "laptop-intel-nuc-studio-ai-workstation",
    warrantyTag: "Bảo hành 36T TechCare+",
    category: "AI & Deep Learning",
    subCategory: "Intel AI PC Certified",
    categoryType: "workstation",
    retailPrice: 46990000,
    costPrice: 38000000,
    stockQty: 10,
    unit: "chiếc",
    hub: "Kho Landmark 81",
    hubBreakdown: "LM81: 6 chiếc • Keangnam: 4 chiếc",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-INTEL-STD-99014-USA",
    distributor: "Intel Enterprise Vietnam",
    origin: "Hoa Kỳ",
    specs: {
      "Bộ vi xử lý": "Intel Core Ultra 9 185H (NPU Intel AI Boost)",
      "Đồ họa VGA": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "Bộ nhớ RAM": "32GB LPDDR5X 7467MHz Dual-Channel",
    },
  },
  {
    id: "prod-rog-oled-32",
    name: "Màn hình ASUS ROG Swift OLED 32\" 4K 240Hz (PG32UCDM)",
    sku: "MON-ROG-32OLED-4K",
    slug: "man-hinh-asus-rog-swift-oled-pg32ucdm",
    warrantyTag: "QD-OLED Gen 3",
    category: "Màn hình & Hiển thị",
    subCategory: "Delta E < 1 Calibrated",
    categoryType: "cooling",
    retailPrice: 34500000,
    costPrice: 29100000,
    stockQty: 12,
    unit: "chiếc",
    hub: "Kho Landmark 81",
    hubBreakdown: "LM81: 8 chiếc • Keangnam: 4 chiếc",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-MON-32OLED-4041-VN",
    distributor: "ASUS Official VN",
    origin: "Chính hãng ASUS",
    specs: {
      "Kích thước": "31.5 inch QD-OLED Gen 3",
      "Độ phân giải": "4K UHD (3840 x 2160)",
      "Tần số quét": "240Hz, 0.03ms (GtG)",
    },
  },
  {
    id: "prod-corsair-1600",
    name: "Nguồn máy trạm Corsair AX1600i Digital Titanium 1600W",
    sku: "PSU-CSR-AX1600I",
    slug: "ssd-samsung-990-pro-2tb-nvme",
    warrantyTag: "80 Plus Titanium",
    category: "Linh kiện tản nhiệt & Nguồn",
    subCategory: "GaN Transistor Digital",
    categoryType: "cooling",
    retailPrice: 12500000,
    costPrice: 9800000,
    stockQty: 15,
    unit: "chiếc",
    hub: "Tổng kho Tân Bình",
    hubBreakdown: "Tân Bình: 10 chiếc • LM81: 5 chiếc",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=300&q=80",
    status: "in_stock",
    statusText: "Còn hàng",
    eShieldSerial: "ESH-PSU-AX16-88091-TW",
    distributor: "Khải Thiên KTC Distributor",
    origin: "Chính hãng Corsair",
    specs: {
      "Công suất": "1600 Watts liên tục ở 50°C",
      "Hiệu suất": "80 Plus Titanium (94% efficiency)",
      "Bảo hành": "10 năm TechCare+ 1 đổi 1",
    },
  },
  {
    id: "prod-samsung-990pro",
    name: "Ổ cứng SSD Samsung 990 PRO 4TB PCIe Gen 4.0 NVMe Heatsink",
    sku: "SSD-SAM-990PRO-4TB",
    slug: "ssd-samsung-990-pro-2tb-nvme",
    warrantyTag: "Bảo hành 5 năm 1:1",
    category: "Bộ nhớ & Lưu trữ",
    subCategory: "PCIe 4.0 V-NAND TLC",
    categoryType: "cpu",
    retailPrice: 9890000,
    costPrice: 8200000,
    stockQty: 4,
    unit: "chiếc",
    hub: "Kho Keangnam HN",
    hubBreakdown: "Keangnam: 4 chiếc (Sắp hết)",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80",
    status: "low_stock",
    statusText: "Sắp hết hàng",
    eShieldSerial: "ESH-SSD-990P-44012-KR",
    distributor: "Samsung Enterprise VN",
    origin: "Hàn Quốc",
    specs: {
      "Tốc độ đọc tuần tự": "Lên tới 7,450 MB/s",
      "Tốc độ ghi tuần tự": "Lên tới 6,900 MB/s",
      "Độ bền TBW": "2,400 TBW",
    },
  },
];

export const DEFAULT_SEED_INVENTORY = [
  {
    id: "eshield-01",
    serialNumber: "SN-TC-4090-0689-X1",
    imei: "IMEI-869201048821034",
    hashSha256: "0x8F4D...7E15",
    productName: "Card đồ họa ASUS ROG Astral GeForce RTX 4090 24GB OC",
    sku: "GPU-ROG-4090-OC",
    category: "Card đồ họa GPU",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    hubCode: "HUB-LM81",
    rackZone: "Kệ lạnh A-04 • Tầng 2 (ESD Safe)",
    temperature: "18.2°C",
    humidity: "47% RH",
    sealStatus: "sealed",
    status: "reserved",
    statusText: "Đã gán đơn #TECH-2026-8888 (Chờ xe CoolVan)",
    assignedOrder: "#TECH-2026-8888",
    customerName: "Nguyễn Văn An (VIP Platinum)",
    importDate: "20/02/2026",
    warrantyMonths: 36,
    warrantyExpiry: "20/02/2029",
    supplier: "ASUS Global Hub VN",
    mintBlock: "#BLOCK-1094821",
  },
  {
    id: "eshield-02",
    serialNumber: "SN-TC-7995WX-9912",
    imei: "N/A (Enterprise CPU)",
    hashSha256: "0x3C41...9D82",
    productName: "Bộ vi xử lý AMD Ryzen Threadripper PRO 7995WX (96 Cores, 192 Threads)",
    sku: "CPU-TR-7995WX",
    category: "Bộ vi xử lý CPU",
    hubLocation: "Kho Keangnam HN (Hà Nội)",
    hubCode: "HUB-CG",
    rackZone: "Tủ bảo mật sTR5-Vault • Ngăn B-01",
    temperature: "18.5°C",
    humidity: "49% RH",
    sealStatus: "sealed",
    status: "reserved",
    statusText: "Đã gán đơn #TECH-2026-8891 (DeepAI)",
    assignedOrder: "#TECH-2026-8891",
    customerName: "DeepAI Vietnam Corp (Titanium)",
    importDate: "22/02/2026",
    warrantyMonths: 36,
    warrantyExpiry: "22/02/2029",
    supplier: "AMD Synnex Corporation",
    mintBlock: "#BLOCK-1094895",
  },
  {
    id: "eshield-03",
    serialNumber: "SN-TC-MBP-M3M-8921",
    imei: "IMEI-354921098812301",
    hashSha256: "0x5E21...8A01",
    productName: "Apple MacBook Pro 16\" M3 Max (36GB / 1TB SSD Space Black)",
    sku: "MCB-16-M3M-01",
    category: "Apple Enterprise",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    hubCode: "HUB-LM81",
    rackZone: "Kho Apple Vault Zone C • Ngăn 08",
    temperature: "18.3°C",
    humidity: "46% RH",
    sealStatus: "sealed",
    status: "in_transit",
    statusText: "Đang trên xe CoolVan #01 (Giao hỏa tốc)",
    assignedOrder: "#TECH-2026-8889",
    customerName: "Trần Minh Quân (VIP Gold)",
    importDate: "24/02/2026",
    warrantyMonths: 36,
    warrantyExpiry: "24/02/2029",
    supplier: "Apple Authorized Hub VN",
    mintBlock: "#BLOCK-1095012",
  },
  {
    id: "eshield-04",
    serialNumber: "SN-TC-4090-0901-X2",
    imei: "IMEI-869201048821099",
    hashSha256: "0x7F90...3C44",
    productName: "Card đồ họa ASUS ROG Astral GeForce RTX 4090 24GB OC",
    sku: "GPU-ROG-4090-OC",
    category: "Card đồ họa GPU",
    hubLocation: "Kho Keangnam HN (Hà Nội)",
    hubCode: "HUB-CG",
    rackZone: "Kệ lạnh A-02 • Tầng 1",
    temperature: "18.6°C",
    humidity: "48% RH",
    sealStatus: "sealed",
    status: "in_stock",
    statusText: "Sẵn sàng xuất kho hỏa tốc",
    assignedOrder: "Chưa gán đơn",
    customerName: "Tồn kho chuẩn bị",
    importDate: "25/02/2026",
    warrantyMonths: 36,
    warrantyExpiry: "25/02/2029",
    supplier: "ASUS Global Hub VN",
    mintBlock: "#BLOCK-1095140",
  },
  {
    id: "eshield-05",
    serialNumber: "SN-TC-OLED-4K-240-01",
    imei: "N/A (Monitor S/N)",
    hashSha256: "0x1A89...7E55",
    productName: "Màn hình ASUS ROG Swift OLED 32\" 4K 240Hz (PG32UCDM)",
    sku: "MON-ROG-32OLED-4K",
    category: "Màn hình & Hiển thị",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    hubCode: "HUB-LM81",
    rackZone: "Khu vực Box lớn D-01 (Đệm khí chống va đập)",
    temperature: "18.4°C",
    humidity: "47% RH",
    sealStatus: "sealed",
    status: "in_stock",
    statusText: "Sẵn sàng xuất kho hỏa tốc",
    assignedOrder: "Chưa gán đơn",
    customerName: "Tồn kho chuẩn bị",
    importDate: "26/02/2026",
    warrantyMonths: 36,
    warrantyExpiry: "26/02/2029",
    supplier: "ASUS Display Division",
    mintBlock: "#BLOCK-1095204",
  },
  {
    id: "eshield-06",
    serialNumber: "SN-TC-AX1600I-TITAN",
    imei: "N/A (PSU Enterprise)",
    hashSha256: "0x9D11...6B77",
    productName: "Nguồn máy trạm Corsair AX1600i Digital Titanium 1600W",
    sku: "PSU-CSR-AX1600I",
    category: "Linh kiện & Nguồn",
    hubLocation: "Tổng kho Tân Bình (Kho Lạnh)",
    hubCode: "HUB-TB",
    rackZone: "Kệ phụ kiện E-03",
    temperature: "18.5°C",
    humidity: "48% RH",
    sealStatus: "sealed",
    status: "in_stock",
    statusText: "Sẵn sàng xuất kho",
    assignedOrder: "Chưa gán đơn",
    customerName: "Tồn kho chuẩn bị",
    importDate: "24/02/2026",
    warrantyMonths: 120,
    warrantyExpiry: "24/02/2036",
    supplier: "Corsair Gaming Distribution",
    mintBlock: "#BLOCK-1095288",
  },
  {
    id: "eshield-07",
    serialNumber: "SN-TC-RIG-V4-0012",
    imei: "IMEI-880192847162941",
    hashSha256: "0x4B22...1E99",
    productName: "TechCore NeuralForge Workstation v4 Pro (AI Liquid Loop)",
    sku: "WS-NF-V4-PRO",
    category: "Máy trạm AI & Creator",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    hubCode: "HUB-LM81",
    rackZone: "Khu vực Testing & Burn-in Lab 01",
    temperature: "18.1°C",
    humidity: "45% RH",
    sealStatus: "sealed",
    status: "activated",
    statusText: "Đã bàn giao & Kích hoạt bảo hành VIP",
    assignedOrder: "#TECH-2026-8800",
    customerName: "FPT AI Research Center",
    importDate: "15/02/2026",
    warrantyMonths: 36,
    warrantyExpiry: "15/02/2029",
    supplier: "TechCore Neural Lab",
    mintBlock: "#BLOCK-1093120",
  },
  {
    id: "eshield-08",
    serialNumber: "SN-TC-ROG-G16-2024",
    imei: "IMEI-354892019283741",
    hashSha256: "0x6A91...4B20",
    productName: "Laptop Gaming ASUS ROG Strix G16 G614JVR (2024)",
    sku: "ROG-G16-I9-32G-1T",
    category: "Laptop & Apple Enterprise",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    hubCode: "HUB-LM81",
    rackZone: "Kệ Laptop VIP Zone A-01",
    temperature: "18.2°C",
    humidity: "47% RH",
    sealStatus: "sealed",
    status: "reserved",
    statusText: "Đã gán đơn #TECH-2026-8888",
    assignedOrder: "#TECH-2026-8888",
    customerName: "Nguyễn Văn An",
    importDate: "18/02/2026",
    warrantyMonths: 24,
    warrantyExpiry: "18/02/2028",
    supplier: "ASUS Official VN",
    mintBlock: "#BLOCK-1093890",
  },
  {
    id: "eshield-09",
    serialNumber: "SN-TC-IP16PM-DESERT",
    imei: "IMEI-354892019283741",
    hashSha256: "0x2C88...5E11",
    productName: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
    sku: "IP16PM-256-DESERT",
    category: "Laptop & Apple Enterprise",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    hubCode: "HUB-LM81",
    rackZone: "Két sắt Apple Vault Zone S",
    temperature: "18.0°C",
    humidity: "44% RH",
    sealStatus: "sealed",
    status: "in_transit",
    statusText: "Đang trên xe CoolVan #01",
    assignedOrder: "#TECH-2026-9999",
    customerName: "Hoàng Mai Linh",
    importDate: "20/02/2026",
    warrantyMonths: 12,
    warrantyExpiry: "20/02/2027",
    supplier: "Viettel Distribution",
    mintBlock: "#BLOCK-1094120",
  },
  {
    id: "eshield-10",
    serialNumber: "SN-TC-SSD-990P-4TB",
    imei: "N/A (NVMe Heatsink)",
    hashSha256: "0x1102...3399",
    productName: "Ổ cứng SSD Samsung 990 PRO 4TB PCIe Gen 4.0 NVMe Heatsink",
    sku: "SSD-SAM-990PRO-4TB",
    category: "Server CPU & Bộ nhớ",
    hubLocation: "Kho Keangnam HN (Hà Nội)",
    hubCode: "HUB-CG",
    rackZone: "Kệ linh kiện B-03",
    temperature: "18.3°C",
    humidity: "46% RH",
    sealStatus: "sealed",
    status: "in_stock",
    statusText: "Sẵn sàng xuất kho hỏa tốc",
    assignedOrder: "Chưa gán đơn",
    customerName: "Tồn kho chuẩn bị",
    importDate: "22/02/2026",
    warrantyMonths: 60,
    warrantyExpiry: "22/02/2031",
    supplier: "Samsung Enterprise VN",
    mintBlock: "#BLOCK-1094550",
  },
];

export const DEFAULT_SEED_RMA = [
  {
    id: "rma-8888",
    code: "#RMA-2026-0812",
    datetime: "27/02/2026 • 15:10:20",
    customer: {
      name: "Nguyễn Văn An",
      tier: "VIP Platinum",
      phone: "0908.888.101",
      address: "Landmark 81, P.22, Bình Thạnh, TP.HCM",
    },
    equipment: {
      name: "Card đồ họa ASUS ROG Astral GeForce RTX 4090 24GB OC",
      sku: "GPU-ROG-4090-OC",
      originalSerial: "SN-TC-4090-0689-X1",
      purchaseDate: "12/02/2026",
      daysSincePurchase: 15,
      under30Days: true,
    },
    issueDescription: "Nhiệt độ Hotspot chạm ngưỡng 95°C khi render mô hình AI liên tục, quạt tản nhiệt quạt số 2 có tiếng kêu lạ.",
    diagnosisResult: "Lỗi cảm biến vòng bi quạt làm mát số 2 từ nhà máy. Đạt chuẩn điều kiện 1 ĐỔI 1 TRONG 30 NGÀY.",
    serviceType: "exchange_30d",
    serviceTypeText: "1 Đổi 1 Trong 30 Ngày (Mới 100%)",
    assignedTech: "KTV Trưởng Hoàng Nam",
    techPhone: "0918.456.789",
    replacementSerial: "SN-TC-4090-0901-X2 (Kho Landmark 81)",
    status: "urgent_exchange",
    statusText: "Đã duyệt đổi mới • Xe CoolVan #01 đang xuất phát",
    slaCountdown: "45 phút",
    hubLocation: "Kho Hub Landmark 81 (TP.HCM)",
    history: [
      { time: "15:10", action: "Khách hàng gửi yêu cầu qua Hotline VIP TechCare Concierge" },
      { time: "15:18", action: "Kỹ sư chẩn đoán từ xa qua telemetry và xác nhận lỗi phần cứng" },
      { time: "15:25", action: "Duyệt lệnh xuất kho linh kiện mới SN-TC-4090-0901-X2 niêm phong e-Shield" },
    ],
  },
  {
    id: "rma-8889",
    code: "#RMA-2026-0810",
    datetime: "27/02/2026 • 11:30:00",
    customer: {
      name: "DeepAI Vietnam Corp",
      tier: "Doanh Nghiệp B2B",
      phone: "0315.889.912",
      address: "Khu Công Nghệ Cao, TP. Thủ Đức, TP.HCM",
    },
    equipment: {
      name: "Cụm tản nhiệt Custom Liquid Loop Pro Workstation 7995WX",
      sku: "WS-LOOP-TR-PRO",
      originalSerial: "SN-TC-7995WX-9912",
      purchaseDate: "05/02/2026",
      daysSincePurchase: 22,
      under30Days: true,
    },
    issueDescription: "Cảm biến dòng chảy Flow-meter cảnh báo áp suất giảm 15% sau 500 giờ huấn luyện mô hình LLM.",
    diagnosisResult: "Bọt khí tích tụ tại khối bơm phụ D5, cần xả bọt và nạp bổ sung dung dịch làm mát chuyên dụng.",
    serviceType: "onsite_repair",
    serviceTypeText: "Kỹ Thuật Viên On-Site Doanh Nghiệp",
    assignedTech: "Đội On-Site Team Alpha (2 Kỹ Sư)",
    techPhone: "0902.999.888",
    replacementSerial: "Phụ tùng bảo trì lưu động #PART-COOL-88",
    status: "onsite_active",
    statusText: "Kỹ sư đang xử lý tại Datacenter khách hàng",
    slaCountdown: "Đang xử lý tại chỗ",
    hubLocation: "Kho Hub Landmark 81 (TP.HCM)",
    history: [
      { time: "11:30", action: "Hệ thống giám sát tự động kích hoạt cảnh báo lưu lượng" },
      { time: "12:00", action: "Kỹ sư TechCare On-Site có mặt tại phòng máy chủ" },
    ],
  },
  {
    id: "rma-8890",
    code: "#RMA-2026-0808",
    datetime: "26/02/2026 • 16:45:10",
    customer: {
      name: "Trần Minh Quân",
      tier: "VIP Platinum",
      phone: "0917.568.878",
      address: "Khu Đô Thị Ciputra, Tây Hồ, Hà Nội",
    },
    equipment: {
      name: "Apple MacBook Pro 16\" M3 Max 64GB Space Black",
      sku: "MCB-16-M3M-01",
      originalSerial: "SN-TC-MBP-M3M-8921",
      purchaseDate: "20/01/2026",
      daysSincePurchase: 37,
      under30Days: false,
    },
    issueDescription: "Cổng Thunderbolt 4 số 2 không nhận băng thông PCIe 40Gbps với eGPU ngoài.",
    diagnosisResult: "Lỗi vi điều khiển cổng I/O Type-C. Đang gửi trung tâm thẩm định Apple Authorized Lab.",
    serviceType: "lab_repair",
    serviceTypeText: "Bảo Hành Trung Tâm Lab (36 Tháng)",
    assignedTech: "KTV Lê Tuấn (Hub Keangnam)",
    techPhone: "0978.112.233",
    replacementSerial: "Máy dự phòng TechCare Loaner: MBP 16\" M3 Pro",
    status: "lab_inspecting",
    statusText: "Đang thẩm định tại Apple Lab • Đã cấp máy dự phòng",
    slaCountdown: "24h làm việc",
    hubLocation: "Kho Keangnam HN (Hà Nội)",
    history: [
      { time: "26/02 16:45", action: "Tiếp nhận máy tại Hub Keangnam" },
      { time: "26/02 17:15", action: "Bàn giao máy dự phòng MacBook M3 Pro để khách hàng không gián đoạn công việc" },
    ],
  },
  {
    id: "rma-8891",
    code: "#RMA-2026-0802",
    datetime: "25/02/2026 • 10:15:00",
    customer: {
      name: "Lê Tuấn Dũng",
      tier: "VIP Gold",
      phone: "0978.112.333",
      address: "Cầu Giấy, Hà Nội",
    },
    equipment: {
      name: "Màn hình ASUS ROG Swift OLED 32\" 4K 240Hz (PG32UCDM)",
      sku: "MON-ROG-32OLED-4K",
      originalSerial: "SN-TC-OLED-4K-240-01",
      purchaseDate: "18/02/2026",
      daysSincePurchase: 7,
      under30Days: true,
    },
    issueDescription: "Xuất hiện 1 điểm chết (Dead pixel) ở góc dưới bên trái panel OLED.",
    diagnosisResult: "Lỗi panel OLED chuẩn tiêu chí Zero Bright Dot của ASUS. Chấp thuận 1 ĐỔI 1 TRONG 30 NGÀY.",
    serviceType: "exchange_30d",
    serviceTypeText: "1 Đổi 1 Trong 30 Ngày (Mới 100%)",
    assignedTech: "KTV Phạm Văn Hùng",
    techPhone: "0966.777.888",
    replacementSerial: "SN-TC-OLED-4K-240-09 (Đã bàn giao)",
    status: "completed",
    statusText: "Hoàn tất đổi mới • Khách hàng đã ký nhận e-Shield",
    slaCountdown: "Đã xong (1h 15m)",
    hubLocation: "Kho Keangnam HN (Hà Nội)",
    history: [
      { time: "10:15", action: "Khách báo lỗi qua ứng dụng TechCore" },
      { time: "11:30", action: "Xe CoolVan mang màn hình mới nguyên thùng tới tận nhà đổi ngay tại chỗ" },
    ],
  },
  {
    id: "rma-8892",
    code: "#RMA-2026-0795",
    datetime: "24/02/2026 • 09:00:00",
    customer: {
      name: "VinAI Robotics Lab",
      tier: "Doanh Nghiệp B2B",
      phone: "024.3974.9999",
      address: "Vinhomes Riverside, Long Biên, Hà Nội",
    },
    equipment: {
      name: "Nguồn máy trạm Corsair AX1600i Digital Titanium 1600W",
      sku: "PSU-CSR-AX1600I",
      originalSerial: "SN-TC-AX1600I-TITAN",
      purchaseDate: "10/01/2026",
      daysSincePurchase: 45,
      under30Days: false,
    },
    issueDescription: "Quạt làm mát FDB không quay khi tải công suất vượt 1000W.",
    diagnosisResult: "Firmware Corsair iCUE điều khiển quạt bị lỗi xung đột, đã nạp lại ROM và test tải 1600W ổn định 24/24.",
    serviceType: "onsite_repair",
    serviceTypeText: "Kỹ Thuật Viên On-Site Doanh Nghiệp",
    assignedTech: "KTV Nguyễn Quốc Anh",
    techPhone: "0988.112.445",
    replacementSerial: "Không cần thay thế (Đã flash firmware)",
    status: "completed",
    statusText: "Hoàn tất xử lý tại phòng máy chủ • Khách hàng nghiệm thu",
    slaCountdown: "Đã xong (2h 10m)",
    hubLocation: "Kho Keangnam HN (Hà Nội)",
    history: [
      { time: "09:00", action: "Tiếp nhận ticket từ VinAI Engineering Team" },
      { time: "10:30", action: "Kỹ sư có mặt xử lý và nghiệm thu test tải 100%" },
    ],
  },
];

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const sessionId =
    typeof window !== "undefined"
      ? localStorage.getItem("sessionId") || "session-" + Math.random().toString(36).substring(2, 9)
      : "server-session";

  if (typeof window !== "undefined" && !localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-session-id": sessionId,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout cho kết nối nhanh

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || { message: `Lỗi kết nối máy chủ (${res.status})` },
      };
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    // Không ném lỗi làm gián đoạn UI
    return {
      success: false,
      isOffline: true,
      error: { message: "Không thể kết nối Backend API." },
    };
  }
}

export const api = {
  // Categories & Brands
  getCategories: async () => {
    const res = await fetchApi("/categories");
    if (res.success && res.data?.length > 0) return res;
    return { success: true, data: MOCK_CATEGORIES };
  },

  getBrands: async () => {
    const res = await fetchApi("/brands");
    const activeBrands = [
      { id: "b-2", name: "ASUS", slug: "asus" },
      { id: "b-1", name: "Apple", slug: "apple" },
      { id: "b-4", name: "Dell", slug: "dell" },
      { id: "b-7", name: "Intel", slug: "intel" },
      { id: "b-5", name: "Lenovo", slug: "lenovo" },
      { id: "b-10", name: "Logitech", slug: "logitech" },
      { id: "b-3", name: "MSI", slug: "msi" },
      { id: "b-6", name: "NVIDIA", slug: "nvidia" },
      { id: "b-9", name: "Samsung", slug: "samsung" },
    ];
    if (res.success && Array.isArray(res.data) && res.data.length >= 9) {
      return {
        success: true,
        data: [...res.data].sort((a: any, b: any) => a.name.localeCompare(b.name)),
      };
    }
    const backendData = (res.success && Array.isArray(res.data)) ? res.data : [];
    const bSlugs = new Set(backendData.map((b: any) => b.slug));
    const merged = [
      ...backendData,
      ...activeBrands.filter((b) => !bSlugs.has(b.slug)),
    ];
    merged.sort((a: any, b: any) => a.name.localeCompare(b.name));
    return { success: true, data: merged };
  },

  getBrandsForCategory: async (categorySlug?: string) => {
    const allBrandsRes = await api.getBrands();
    const allBrands = allBrandsRes.data || [];

    if (!categorySlug || categorySlug === "tat-ca") {
      return { success: true, data: allBrands };
    }

    if (categorySlug === "laptop") {
      // Phân hệ Laptop & Smartphone: Các thương hiệu Laptop và Điện thoại chính hãng
      // Tuyệt đối không hiển thị thương hiệu thuần phụ kiện như Logitech hay chuyên VGA rời như NVIDIA
      const laptopBrandSlugs = new Set(["apple", "asus", "dell", "intel", "lenovo", "msi", "samsung"]);
      return {
        success: true,
        data: allBrands.filter((b: any) => laptopBrandSlugs.has(b.slug)),
      };
    }

    if (categorySlug === "linh-kien-pc") {
      // Phân hệ Linh kiện PC: Các thương hiệu có linh kiện phần cứng (CPU, GPU, RAM, SSD, Bo mạch chủ, Nguồn, Tản nhiệt)
      const pcBrandSlugs = new Set(["asus", "dell", "intel", "lenovo", "msi", "nvidia", "samsung"]);
      return {
        success: true,
        data: allBrands.filter((b: any) => pcBrandSlugs.has(b.slug)),
      };
    }

    if (categorySlug === "phu-kien-gaming") {
      // Phân hệ Phụ kiện Hi-End: Bàn phím cơ, Chuột Gaming, Tai nghe, Webcam, Đế sạc không dây
      const gearBrandSlugs = new Set(["logitech", "asus", "apple", "dell", "lenovo", "msi", "samsung"]);
      return {
        success: true,
        data: allBrands.filter((b: any) => gearBrandSlugs.has(b.slug)),
      };
    }

    return { success: true, data: allBrands };
  },

  // Products
  getProducts: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetchApi(`/products?${query}`);

    // Lấy thêm sản phẩm do admin tạo mới trong localStorage
    let customProducts: any[] = [];
    if (typeof window !== "undefined") {
      try {
        customProducts = JSON.parse(localStorage.getItem("custom_products") || "[]");
      } catch (e) {}
    }

    // Nếu Backend API trả về đầy đủ sản phẩm (từ 100 sản phẩm trở lên), ưu tiên dùng trực tiếp
    if (res.success && Array.isArray(res.data) && res.data.length >= MOCK_PRODUCTS.length) {
      return res;
    }

    // Kết hợp dữ liệu từ Backend API (nếu có dữ liệu mới), Custom Products và 100+ sản phẩm MOCK_PRODUCTS
    const backendData = (res.success && Array.isArray(res.data)) ? res.data : [];
    const backendSlugs = new Set(backendData.map((p: any) => p.slug));

    let list = [
      ...backendData,
      ...customProducts.filter((p: any) => !backendSlugs.has(p.slug)),
      ...MOCK_PRODUCTS.filter((p: any) => !backendSlugs.has(p.slug)),
    ];

    // Hàm kiểm tra danh mục nghiêm ngặt: Tuyệt đối không lẫn lộn Laptop/Điện thoại với Linh kiện máy tính hay Phụ kiện
    const matchesCategory = (p: any, catSlug: string) => {
      const pCat = p.category?.slug || "";
      if (catSlug === "laptop") {
        // Phân hệ "Laptop & Smartphone": CHỈ gồm Laptop và Điện thoại di động
        // Tuyệt đối KHÔNG xuất hiện linh kiện (VGA, CPU, RAM, SSD, Mainboard, Nguồn) hay phụ kiện chuột/phím
        return (
          pCat === "laptop" ||
          pCat.startsWith("laptop-") ||
          pCat === "dien-thoai" ||
          pCat.startsWith("dien-thoai-")
        );
      }
      if (catSlug === "linh-kien-pc") {
        // Phân hệ "Linh kiện PC & VGA": CHỈ gồm Card màn hình, CPU, RAM & SSD, Bo mạch chủ, Nguồn, Tản nhiệt
        // Tuyệt đối KHÔNG xuất hiện Laptop hay Điện thoại
        return (
          pCat === "linh-kien-pc" ||
          pCat === "vga-card-man-hinh" ||
          pCat === "cpu-bo-vi-xu-ly" ||
          pCat === "ram-ssd"
        );
      }
      if (catSlug === "phu-kien-gaming") {
        // Phân hệ "Bàn phím cơ & Gear": CHỈ gồm Chuột, Bàn phím, Tai nghe, Webcam, Micro
        // Tuyệt đối KHÔNG xuất hiện Laptop hay Linh kiện PC
        return (
          pCat === "phu-kien-gaming" ||
          pCat === "ban-phim-co" ||
          pCat === "chuot-gaming" ||
          pCat === "tai-nghe-gaming"
        );
      }
      return pCat === catSlug || pCat.includes(catSlug);
    };

    // Áp dụng bộ lọc nghiêm ngặt theo danh mục: Tuyệt đối không cho sản phẩm ngoài danh mục lọt vào
    if (params?.category) {
      list = list.filter((p) => matchesCategory(p, params.category));
    }
    // Lọc theo thương hiệu đã chọn (nếu có)
    if (params?.brand) {
      list = list.filter((p) => p.brand?.slug === params.brand);
    }
    if (params?.q) {
      const q = params.q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.shortDesc?.toLowerCase().includes(q)
      );
    }
    if (params?.minPrice) {
      list = list.filter((p) => p.variants[0]?.price >= Number(params.minPrice));
    }
    if (params?.maxPrice) {
      list = list.filter((p) => p.variants[0]?.price <= Number(params.maxPrice));
    }
    if (params?.sort === "price_asc") {
      list.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price);
    } else if (params?.sort === "price_desc") {
      list.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price);
    }

    return {
      success: true,
      data: list,
      meta: { total: list.length, page: 1, limit: 20 },
    };
  },

  getProductBySlug: async (slug: string) => {
    const res = await fetchApi(`/products/${slug}`);
    if (res.success && res.data) return res;

    let customProducts: any[] = [];
    if (typeof window !== "undefined") {
      try {
        customProducts = JSON.parse(localStorage.getItem("custom_products") || "[]");
      } catch (e) {}
    }
    const all = [...customProducts, ...MOCK_PRODUCTS];
    const found = all.find((p) => p.slug === slug);

    if (found) {
      return {
        success: true,
        data: {
          ...found,
          relatedProducts: all.filter((p) => p.id !== found.id).slice(0, 4),
        },
      };
    }
    return { success: false, error: { message: "Không tìm thấy sản phẩm" } };
  },

  searchSuggest: async (q: string) => {
    if (!q || !q.trim()) return { success: true, data: [] };
    const res = await fetchApi(`/search/suggest?q=${encodeURIComponent(q)}`);
    if (res.success && res.data?.length > 0) return res;

    const term = q.toLowerCase();
    const suggestions = MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 5);
    return { success: true, data: suggestions };
  },

  createProduct: async (data: any) => {
    const res = await fetchApi("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.success && res.data) return res;

    // Lưu vào custom_products để đồng bộ ngay lập tức
    if (typeof window !== "undefined") {
      try {
        const custom = JSON.parse(localStorage.getItem("custom_products") || "[]");
        const newProd = {
          ...data,
          id: "prod-custom-" + Date.now(),
          createdAt: new Date().toISOString(),
          category: MOCK_CATEGORIES.find((c) => c.id === data.categoryId) || {
            name: "Thiết bị",
            slug: "thiet-bi",
          },
          brand: MOCK_BRANDS.find((b) => b.id === data.brandId) || { name: "Chính hãng", slug: "chinh-hang" },
        };
        custom.unshift(newProd);
        localStorage.setItem("custom_products", JSON.stringify(custom));
        return { success: true, data: newProd };
      } catch (e) {}
    }
    return { success: true, data };
  },

  // Auth: Quản lý 3 Admin & User
  login: async (credentials: any) => {
    const res = await fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      }
      return res;
    }

    // 3 TÀI KHOẢN ADMIN CHUẨN XÁC
    const adminAccounts: Record<string, { pass: string; name: string; role: string }> = {
      "admin1@techcore.vn": { pass: "Admin@123", name: "Nguyễn Quốc Anh (Super Admin)", role: "admin" },
      "admin2@techcore.vn": { pass: "Admin@456", name: "Trần Minh Tuấn (Quản trị Đơn & Kho)", role: "admin" },
      "admin3@techcore.vn": { pass: "Admin@789", name: "Lê Hoàng Long (Quản trị Kỹ thuật)", role: "admin" },
      "admin@techcore.vn": { pass: "Admin@123", name: "Quản trị viên TechCore", role: "admin" },
    };

    // TÀI KHOẢN KHÁCH HÀNG
    const userAccounts: Record<string, { pass: string; name: string; role: string }> = {
      "user1@gmail.com": { pass: "User@123", name: "Nguyễn Văn An", role: "customer" },
      "user2@gmail.com": { pass: "User@123", name: "Hoàng Mai Linh", role: "customer" },
      "customer@gmail.com": { pass: "123456", name: "Khách hàng mẫu", role: "customer" },
    };

    // Kiểm tra tài khoản tự đăng ký trong localStorage
    let registeredUsers: any[] = [];
    if (typeof window !== "undefined") {
      try {
        registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      } catch (e) {}
    }

    const regUser = registeredUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (regUser) {
      const mockToken = "user-token-" + Date.now();
      const userObj = { fullName: regUser.fullName, email: regUser.email, role: "customer" };
      if (typeof window !== "undefined") {
        localStorage.setItem("token", mockToken);
        localStorage.setItem("currentUser", JSON.stringify(userObj));
      }
      return { success: true, data: { token: mockToken, user: userObj } };
    }

    if (adminAccounts[credentials.email]) {
      const acc = adminAccounts[credentials.email];
      if (acc.pass !== credentials.password) {
        return { success: false, error: { message: "Mật khẩu không chính xác." } };
      }
      const mockToken = "mock-admin-token-" + Date.now();
      const userObj = { fullName: acc.name, email: credentials.email, role: "admin" };
      if (typeof window !== "undefined") {
        localStorage.setItem("token", mockToken);
        localStorage.setItem("currentUser", JSON.stringify(userObj));
      }
      return {
        success: true,
        data: { token: mockToken, user: userObj },
      };
    } else if (userAccounts[credentials.email]) {
      const acc = userAccounts[credentials.email];
      if (acc.pass !== credentials.password) {
        return { success: false, error: { message: "Mật khẩu không chính xác." } };
      }
      const mockToken = "mock-customer-token-" + Date.now();
      const userObj = { fullName: acc.name, email: credentials.email, role: "customer" };
      if (typeof window !== "undefined") {
        localStorage.setItem("token", mockToken);
        localStorage.setItem("currentUser", JSON.stringify(userObj));
      }
      return {
        success: true,
        data: { token: mockToken, user: userObj },
      };
    }

    return {
      success: false,
      error: { message: "Email hoặc mật khẩu không chính xác." },
    };
  },

  register: async (userData: any) => {
    const res = await fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (res.success) return res;

    if (typeof window !== "undefined") {
      try {
        const list = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        list.push(userData);
        localStorage.setItem("registeredUsers", JSON.stringify(list));
      } catch (e) {}
    }
    return { success: true, data: { user: userData } };
  },

  // Giỏ hàng đồng bộ 100% (Hoạt động cả khi Online lẫn Standalone)
  getCart: async () => {
    const res = await fetchApi("/cart");
    if (res.success && res.data) return res;

    const localCart = getLocalCart();
    return { success: true, data: localCart };
  },

  addToCart: async (variantId: string, quantity: number = 1) => {
    const res = await fetchApi("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity }),
    });
    if (res.success && res.data) {
      saveLocalCart(res.data);
      return res;
    }

    // Đồng bộ offline mượt mà không bao giờ báo lỗi máy chủ
    let customProducts: any[] = [];
    if (typeof window !== "undefined") {
      try {
        customProducts = JSON.parse(localStorage.getItem("custom_products") || "[]");
      } catch (e) {}
    }
    const allProducts = [...customProducts, ...MOCK_PRODUCTS];

    let foundProduct: any = null;
    let foundVariant: any = null;

    for (const p of allProducts) {
      const v = p.variants?.find((item: any) => item.id === variantId);
      if (v) {
        foundProduct = p;
        foundVariant = v;
        break;
      }
    }

    if (!foundVariant && allProducts[0]) {
      foundProduct = allProducts[0];
      foundVariant = allProducts[0].variants[0];
    }

    const currentCart = getLocalCart();
    const existingIndex = currentCart.items.findIndex(
      (item) => item.variantId === (foundVariant?.id || variantId)
    );

    if (existingIndex > -1) {
      currentCart.items[existingIndex].quantity += quantity;
    } else {
      currentCart.items.push({
        id: "cart-item-" + Date.now(),
        variantId: foundVariant?.id || variantId,
        quantity,
        variant: {
          id: foundVariant?.id || variantId,
          sku: foundVariant?.sku || "SKU-PROD",
          name: foundVariant?.name || foundProduct?.name || "Sản phẩm công nghệ",
          price: foundVariant?.price || 15000000,
          compareAtPrice: foundVariant?.compareAtPrice,
          product: {
            id: foundProduct?.id || "prod-default",
            name: foundProduct?.name || "Thiết bị công nghệ",
            slug: foundProduct?.slug || "thiet-bi",
            images: foundProduct?.images || [
              { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500" },
            ],
          },
        },
      });
    }

    saveLocalCart(currentCart);
    return { success: true, data: currentCart };
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const res = await fetchApi(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    if (res.success && res.data) {
      saveLocalCart(res.data);
      return res;
    }

    const cart = getLocalCart();
    const item = cart.items.find((i) => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i.id !== itemId);
      } else {
        item.quantity = quantity;
      }
    }
    saveLocalCart(cart);
    return { success: true, data: cart };
  },

  removeCartItem: async (itemId: string) => {
    const res = await fetchApi(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
    if (res.success && res.data) {
      saveLocalCart(res.data);
      return res;
    }

    const cart = getLocalCart();
    cart.items = cart.items.filter((i) => i.id !== itemId);
    saveLocalCart(cart);
    return { success: true, data: cart };
  },

  clearCart: async () => {
    try {
      await fetchApi("/cart", {
        method: "DELETE",
      });
    } catch (e) {}

    const emptyCart = { id: "cart-local", items: [], total: 0 };
    saveLocalCart(emptyCart);
    return { success: true, data: emptyCart };
  },

  // Đặt hàng & Tra cứu Đơn hàng đồng bộ với Admin
  placeOrder: async (orderData: any) => {
    const res = await fetchApi("/checkout/place-order", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    if (res.success && res.data) {
      // Lưu lại bản sao local
      const localOrders = getLocalOrders();
      localOrders.unshift(res.data);
      saveLocalOrders(localOrders);
      saveLocalCart({ id: "cart-local", items: [], total: 0 });
      return res;
    }

    // Tự động tạo mã đơn hàng chuẩn xác
    const orderCode = `TECH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const cart = getLocalCart();

    const orderItems = (cart.items.length > 0 ? cart.items : orderData.items || []).map(
      (item: any, idx: number) => ({
        id: `it-${Date.now()}-${idx}`,
        variantId: item.variantId || item.variant?.id || item.id || "var-1",
        productName: item.variant?.product?.name || item.variant?.name || item.productName || "Thiết bị công nghệ chính hãng",
        sku: item.variant?.sku || `SKU-${idx + 100}`,
        quantity: item.quantity || 1,
        lineTotal: (item.variant?.price || 15000000) * (item.quantity || 1),
        serialNumber: `SN-${Date.now()}-${idx + 1}`,
      })
    );

    const calculatedTotal = orderItems.reduce((sum: number, it: any) => sum + it.lineTotal, 0);

    const newOrder = {
      id: "ord-" + Date.now(),
      code: orderCode,
      receiverName: orderData.receiverName || "Khách hàng",
      phone: orderData.phone || "0987654321",
      guestEmail: orderData.guestEmail || "khachhang@gmail.com",
      province: orderData.province || "Hà Nội",
      district: orderData.district || "Cầu Giấy",
      ward: orderData.ward || "Dịch Vọng",
      street: orderData.street || "Số 12 Duy Tân",
      note: orderData.note || "Giao giờ hành chính",
      paymentMethod: orderData.paymentMethod || "cod",
      paymentStatus: orderData.paymentMethod === "cod" ? "pending" : "paid",
      status: "pending",
      grandTotal: calculatedTotal,
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    const localOrders = getLocalOrders();
    localOrders.unshift(newOrder);
    saveLocalOrders(localOrders);

    // Làm trống giỏ hàng sau khi đặt thành công
    saveLocalCart({ id: "cart-local", items: [], total: 0 });

    return {
      success: true,
      data: newOrder,
    };
  },

  trackOrder: async (code: string, phone?: string) => {
    const res = await fetchApi(
      `/orders/track?code=${encodeURIComponent(code)}${phone ? `&phone=${encodeURIComponent(phone)}` : ""}`
    );
    if (res.success && res.data) return res;

    const allOrders = [...getLocalOrders(), ...DEFAULT_SEED_ORDERS];
    const cleanCode = code.trim().toUpperCase();
    const found = allOrders.find(
      (o) => o.code?.toUpperCase() === cleanCode && (!phone || o.phone?.includes(phone.trim()))
    );

    if (found) {
      return { success: true, data: found };
    }
    return {
      success: false,
      error: { message: "Không tìm thấy đơn hàng với thông tin đã nhập." },
    };
  },

  // Lấy danh sách lịch sử đơn hàng của người dùng
  getMyOrders: async () => {
    const res = await fetchApi("/orders/me");
    let backendOrders: any[] = [];
    if (res.success && Array.isArray(res.data)) {
      backendOrders = res.data;
    }
    const local = getLocalOrders();
    const merged = [...local, ...backendOrders];
    const seen = new Set();
    const unique: any[] = [];
    for (const o of merged) {
      if (o && o.code && !seen.has(o.code)) {
        seen.add(o.code);
        unique.push(o);
      }
    }
    if (unique.length === 0) {
      unique.push(...DEFAULT_SEED_ORDERS);
    }
    // Lọc bỏ các đơn mà người dùng đã chọn "Xóa khỏi lịch sử"
    let hidden: string[] = [];
    if (typeof window !== "undefined") {
      try {
        hidden = JSON.parse(localStorage.getItem("deleted_order_codes") || "[]");
      } catch (e) {}
    }
    const visible = unique.filter((o) => !hidden.includes(o.id) && !hidden.includes(o.code));
    return { success: true, data: visible };
  },

  // Hủy đơn hàng (khi đơn đang ở trạng thái pending)
  cancelOrder: async (orderId: string, reason?: string) => {
    const res = await fetchApi(`/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    const local = getLocalOrders();
    const updated = local.map((o) =>
      o.id === orderId || o.code === orderId
        ? { ...o, status: "cancelled", cancelReason: reason || "Khách yêu cầu hủy đơn" }
        : o
    );
    saveLocalOrders(updated);
    return { success: true, message: "Hủy đơn hàng thành công" };
  },

  // Xóa đơn hàng khỏi lịch sử hiển thị
  deleteOrderFromHistory: async (orderId: string) => {
    const local = getLocalOrders();
    const updated = local.filter((o) => o.id !== orderId && o.code !== orderId);
    saveLocalOrders(updated);

    // Lưu mã đơn vào danh sách ẩn
    if (typeof window !== "undefined") {
      try {
        const hidden: string[] = JSON.parse(localStorage.getItem("deleted_order_codes") || "[]");
        if (!hidden.includes(orderId)) {
          hidden.push(orderId);
          localStorage.setItem("deleted_order_codes", JSON.stringify(hidden));
        }
      } catch (e) {}
    }
    return { success: true, message: "Đã xóa đơn hàng khỏi lịch sử" };
  },

  // ================= ADMIN ORDER MANAGEMENT & REALTIME SYNC =================
  getAdminOrders: async () => {
    let deletedCodes: string[] = [];
    if (typeof window !== "undefined") {
      try {
        deletedCodes = JSON.parse(localStorage.getItem("deleted_order_codes") || "[]");
      } catch (e) {}
    }

    try {
      const res = await fetchApi("/admin/orders");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const filtered = res.data.filter(
          (o: any) =>
            !deletedCodes.includes(o.id) &&
            !deletedCodes.includes(o.code) &&
            !deletedCodes.includes(`#${o.code}`)
        );
        return { success: true, data: filtered };
      }
    } catch (e) {}

    const local = getLocalOrders();
    const filtered = local.filter(
      (o: any) =>
        !deletedCodes.includes(o.id) &&
        !deletedCodes.includes(o.code) &&
        !deletedCodes.includes(`#${o.code}`)
    );
    return { success: true, data: filtered };
  },

  updateAdminOrderStatus: async (orderId: string, status: string, note?: string) => {
    try {
      await fetchApi(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      });
    } catch (e) {}

    const local = getLocalOrders();
    const updated = local.map((o) => {
      if (o.id === orderId || o.code === orderId || o.code === `#${orderId}` || o.id === `ord-${orderId}`) {
        return {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
          adminNote: note || o.adminNote,
        };
      }
      return o;
    });
    saveLocalOrders(updated);
    return { success: true, message: "Cập nhật trạng thái đơn hàng thành công" };
  },

  createAdminOrder: async (orderData: any) => {
    try {
      const res = await fetchApi("/admin/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      if (res.success && res.data) {
        const local = getLocalOrders();
        local.unshift(res.data);
        saveLocalOrders(local);
        return res;
      }
    } catch (e) {}

    const code = `TECH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: "ord-" + Date.now(),
      code,
      receiverName: orderData.receiverName || "Khách hàng Admin",
      phone: orderData.phone || "0987654321",
      guestEmail: orderData.guestEmail || "customer@techcore.vn",
      province: orderData.province || "TP. Hồ Chí Minh",
      district: orderData.district || "Quận 1",
      ward: orderData.ward || "Bến Nghé",
      street: orderData.street || "72 Lê Thánh Tôn",
      note: orderData.note || "Đơn tạo trực tiếp từ Admin",
      paymentMethod: orderData.paymentMethod || "bank_transfer",
      paymentStatus: orderData.paymentStatus || "paid",
      status: orderData.status || "packing",
      grandTotal: orderData.grandTotal || 25000000,
      createdAt: new Date().toISOString(),
      items: orderData.items || [
        {
          id: `it-${Date.now()}`,
          productName: orderData.productName || "Thiết bị Công nghệ Cao Cấp",
          sku: "SKU-ADMIN-GEN",
          quantity: 1,
          lineTotal: orderData.grandTotal || 25000000,
          serialNumber: `SN-${Date.now()}`,
        },
      ],
    };

    const local = getLocalOrders();
    local.unshift(newOrder);
    saveLocalOrders(local);

    return { success: true, data: newOrder };
  },

  deleteAdminOrder: async (orderId: string) => {
    try {
      await fetchApi(`/admin/orders/${orderId}`, { method: "DELETE" });
    } catch (e) {}

    const cleanId = orderId.replace(/^#/, "");
    const local = getLocalOrders();
    const updated = local.filter(
      (o) =>
        o.id !== orderId &&
        o.id !== cleanId &&
        o.code !== orderId &&
        o.code !== cleanId &&
        o.code !== `#${cleanId}`
    );
    saveLocalOrders(updated);

    if (typeof window !== "undefined") {
      try {
        const hidden: string[] = JSON.parse(localStorage.getItem("deleted_order_codes") || "[]");
        if (!hidden.includes(orderId)) hidden.push(orderId);
        if (!hidden.includes(cleanId)) hidden.push(cleanId);
        if (!hidden.includes(`#${cleanId}`)) hidden.push(`#${cleanId}`);
        localStorage.setItem("deleted_order_codes", JSON.stringify(hidden));
      } catch (e) {}
    }

    return { success: true, message: "Đã xóa đơn hàng thành công" };
  },

  // Tra cứu bảo hành Serial/IMEI
  lookupWarranty: async (serial: string) => {
    const res = await fetchApi(`/warranty/lookup?serial=${encodeURIComponent(serial)}`);
    if (res.success && res.data) return res;

    const cleanSerial = serial.trim().toUpperCase();

    // 1. Kiểm tra mẫu thiết bị Laptop Gaming ROG
    if (cleanSerial === "ROG16-2024-001") {
      return {
        success: true,
        data: {
          serialNumber: "ROG16-2024-001",
          status: "sold",
          isExpired: false,
          productName: "Laptop Gaming ASUS ROG Strix G16 (2024)",
          variantName: "Core i9 / 32GB RAM / 1TB SSD / RTX 4070",
          brand: "ASUS",
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
          warrantyMonths: 24,
          warrantyStart: "2026-10-15T00:00:00.000Z",
          warrantyEnd: "2028-10-15T00:00:00.000Z",
        },
      };
    }

    // 2. Mẫu Điện thoại iPhone 16 Pro Max
    if (cleanSerial === "IMEI-354892019283741") {
      return {
        success: true,
        data: {
          serialNumber: "IMEI-354892019283741",
          status: "sold",
          isExpired: false,
          productName: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
          variantName: "Titan Sa Mạc - 256GB",
          brand: "Apple",
          image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
          warrantyMonths: 12,
          warrantyStart: "2026-10-01T00:00:00.000Z",
          warrantyEnd: "2027-10-01T00:00:00.000Z",
        },
      };
    }

    // 3. Mẫu Card màn hình RTX 4080 Super
    if (cleanSerial === "VGA-4080S-001") {
      return {
        success: true,
        data: {
          serialNumber: "VGA-4080S-001",
          status: "sold",
          isExpired: false,
          productName: "Card Màn Hình ASUS ROG Strix GeForce RTX 4080 SUPER 16GB OC",
          variantName: "Phiên bản OC Edition 16GB GDDR6X",
          brand: "ASUS",
          image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
          warrantyMonths: 36,
          warrantyStart: "2026-09-01T00:00:00.000Z",
          warrantyEnd: "2029-09-01T00:00:00.000Z",
        },
      };
    }

    // Kiểm tra trong danh sách đơn hàng đã đặt
    const allOrders = [...getLocalOrders(), ...DEFAULT_SEED_ORDERS];
    for (const ord of allOrders) {
      for (const item of ord.items || []) {
        if (item.serialNumber && item.serialNumber.toUpperCase() === cleanSerial) {
          return {
            success: true,
            data: {
              serialNumber: item.serialNumber,
              status: "sold",
              isExpired: false,
              productName: item.productName,
              variantName: item.sku,
              brand: "TechCore Verified",
              image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
              warrantyMonths: 24,
              warrantyStart: ord.createdAt,
              warrantyEnd: new Date(
                new Date(ord.createdAt).getTime() + 24 * 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          };
        }
      }
    }

    return {
      success: false,
      error: { message: "Không tìm thấy thông tin bảo hành cho Serial/IMEI này trên hệ thống." },
    };
  },

  // ================= ADMIN CUSTOMER & CRM MANAGEMENT =================
  getAdminCustomers: async () => {
    let deletedIds: string[] = [];
    if (typeof window !== "undefined") {
      try {
        deletedIds = JSON.parse(localStorage.getItem("deleted_customer_ids") || "[]");
      } catch (e) {}
    }

    let local: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tech_customers");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) local = parsed;
        }
      } catch (e) {}
    }

    if (local.length === 0) {
      local = DEFAULT_SEED_CUSTOMERS;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tech_customers", JSON.stringify(DEFAULT_SEED_CUSTOMERS));
        } catch (e) {}
      }
    }

    const filtered = local.filter(
      (c: any) => !deletedIds.includes(c.id) && !deletedIds.includes(c.code)
    );
    return { success: true, data: filtered };
  },

  createAdminCustomer: async (customerData: any) => {
    const code = `KH-VIP-${Math.floor(100 + Math.random() * 900)}`;
    const newCust = {
      id: "cust-" + Date.now(),
      code,
      name: customerData.name || "Khách hàng mới",
      representative: customerData.representative || customerData.name || "Đại diện",
      type: customerData.type || "personal",
      email: customerData.email || "customer@techcore.vn",
      phone: customerData.phone || "0987654321",
      taxCode: customerData.taxCode || "84" + Math.floor(10000000 + Math.random() * 90000000),
      address: customerData.address || "Landmark 81, TP.HCM",
      hub: customerData.hub || "Kho Landmark 81",
      vipTier: customerData.vipTier || "VIP Gold",
      vipTierCode: (customerData.vipTier || "gold").toLowerCase().replace("vip ", ""),
      techPoints: customerData.techPoints || Math.floor((customerData.ltvAmount || 50000000) / 10000),
      ltvAmount: Number(customerData.ltvAmount) || 50000000,
      ordersCount: Number(customerData.ordersCount) || 1,
      status: customerData.status || "active",
      statusText:
        customerData.status === "care"
          ? "Đang chăm sóc"
          : customerData.status === "locked"
          ? "Tạm khóa"
          : "Hoạt động",
      joinedDate: new Date().toLocaleDateString("vi-VN"),
      primaryHardware: customerData.primaryHardware || "Thiết bị Công Nghệ Cao Cấp",
      assignedEngineer: customerData.assignedEngineer || "KTV TechCare Concierge",
      note: customerData.note || "Khách hàng tạo trực tiếp từ CRM Admin",
    };

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tech_customers");
        const list = raw ? JSON.parse(raw) : [...DEFAULT_SEED_CUSTOMERS];
        list.unshift(newCust);
        localStorage.setItem("tech_customers", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("techcore:customers-changed", { detail: list }));
      } catch (e) {}
    }

    return { success: true, data: newCust };
  },

  updateAdminCustomer: async (customerId: string, patch: any) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tech_customers");
        const list = raw ? JSON.parse(raw) : [...DEFAULT_SEED_CUSTOMERS];
        const updated = list.map((c: any) => {
          if (c.id === customerId || c.code === customerId) {
            return { ...c, ...patch, updatedAt: new Date().toISOString() };
          }
          return c;
        });
        localStorage.setItem("tech_customers", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("techcore:customers-changed", { detail: updated }));
      } catch (e) {}
    }
    return { success: true, message: "Cập nhật thông tin khách hàng thành công" };
  },

  deleteAdminCustomer: async (customerId: string) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tech_customers");
        const list = raw ? JSON.parse(raw) : [...DEFAULT_SEED_CUSTOMERS];
        const updated = list.filter((c: any) => c.id !== customerId && c.code !== customerId);
        localStorage.setItem("tech_customers", JSON.stringify(updated));

        const hidden: string[] = JSON.parse(localStorage.getItem("deleted_customer_ids") || "[]");
        if (!hidden.includes(customerId)) hidden.push(customerId);
        localStorage.setItem("deleted_customer_ids", JSON.stringify(hidden));

        window.dispatchEvent(new CustomEvent("techcore:customers-changed", { detail: updated }));
      } catch (e) {}
    }
    return { success: true, message: "Đã xóa khách hàng thành công" };
  },

  // ================= ADMIN PRODUCTS MANAGEMENT =================
  getAdminProducts: async () => {
    let deletedIds: string[] = [];
    if (typeof window !== "undefined") {
      try {
        deletedIds = JSON.parse(localStorage.getItem("deleted_product_ids") || "[]");
      } catch (e) {}
    }

    // Chuyển đổi toàn bộ sản phẩm thực tế từ Storefront Catalog (MOCK_PRODUCTS)
    const mappedStoreProducts = (MOCK_PRODUCTS || []).map((p: any, idx: number) => {
      let specsObj: Record<string, string> = {};
      try {
        if (typeof p.specs === "string") {
          specsObj = JSON.parse(p.specs);
        } else if (typeof p.specs === "object" && p.specs !== null) {
          specsObj = p.specs;
        }
      } catch (e) {}

      const catSlug = p.category?.slug || "";
      const catName = p.category?.name || "Thiết bị Công nghệ";

      let categoryType = "workstation";
      if (catSlug.includes("vga") || catSlug.includes("gpu")) {
        categoryType = "gpu";
      } else if (catSlug.includes("cpu") || catSlug.includes("ram") || catSlug.includes("ssd")) {
        categoryType = "cpu";
      } else if (catSlug.includes("apple") || catSlug.includes("laptop") || catSlug.includes("dien-thoai")) {
        categoryType = "apple";
      } else if (
        catSlug.includes("gear") ||
        catSlug.includes("phu-kien") ||
        catSlug.includes("man-hinh") ||
        catSlug.includes("ban-phim") ||
        catSlug.includes("chuot") ||
        catSlug.includes("tai-nghe")
      ) {
        categoryType = "cooling";
      }

      const primaryVariant = p.variants?.[0] || {};
      const retailPrice = Number(primaryVariant.price) || 29990000;
      const costPrice = primaryVariant.compareAtPrice
        ? Math.round(Number(primaryVariant.compareAtPrice) * 0.8)
        : Math.round(retailPrice * 0.82);
      const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0) || 12;

      const sku = primaryVariant.sku || `TC-${(p.slug || "PROD").toUpperCase().slice(0, 14)}`;
      const hubs = ["Kho Landmark 81", "Kho Keangnam HN", "Tổng kho Tân Bình"];
      const hub = hubs[idx % hubs.length];

      const unit =
        catSlug.includes("laptop") || catSlug.includes("dien-thoai") || catSlug.includes("man-hinh")
          ? "máy"
          : "chiếc";

      const status = totalStock <= 0 ? "out_of_stock" : totalStock <= 5 ? "low_stock" : "in_stock";
      const statusText = totalStock <= 0 ? "Hết hàng" : totalStock <= 5 ? "Sắp hết hàng" : "Còn hàng";

      const eShieldSerial =
        primaryVariant.serialNumber ||
        `ESH-${sku.replace(/[^A-Z0-9]/gi, "").slice(0, 10)}-${100 + idx}`;

      const distributor = p.brand?.name
        ? `${p.brand.name} Vietnam Official / Synnex FPT`
        : "TechCore Enterprise Official";
      const origin =
        p.brand?.slug === "apple"
          ? "Chính hãng Apple VN/A"
          : p.brand?.slug === "samsung"
          ? "Chính hãng Samsung VN"
          : "Nhập khẩu chính ngạch VAT";
      const warrantyTag = p.warrantyMonths
        ? `Bảo hành ${p.warrantyMonths}T TechCare+`
        : "Bảo hành 24T TechCare+";

      return {
        id: p.id,
        sku,
        name: p.name,
        slug: p.slug,
        warrantyTag,
        category: catName,
        subCategory: p.brand?.name ? `Thương hiệu ${p.brand.name}` : "Hàng chính hãng",
        categoryType,
        retailPrice,
        costPrice,
        stockQty: totalStock,
        unit,
        hub,
        hubBreakdown: `${hub}: ${totalStock} ${unit}`,
        image:
          p.images?.[0]?.url ||
          "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=300&q=80",
        status,
        statusText,
        eShieldSerial,
        distributor,
        origin,
        specs: specsObj,
      };
    });

    // Kết hợp toàn bộ Danh Mục Sản Phẩm (Gồm các Máy trạm AI độc quyền + 27+ sản phẩm chính thức Storefront)
    const masterSlugs = new Set(DEFAULT_SEED_ADMIN_PRODUCTS.map((p) => p.slug || p.sku));
    const combinedDefaults = [
      ...DEFAULT_SEED_ADMIN_PRODUCTS,
      ...mappedStoreProducts.filter(
        (p: any) => !masterSlugs.has(p.slug) && !masterSlugs.has(p.sku)
      ),
    ];

    let customCreated: any[] = [];
    let customEdits: Record<string, any> = {};

    if (typeof window !== "undefined") {
      try {
        customCreated = JSON.parse(localStorage.getItem("custom_products") || "[]");
      } catch (e) {}

      try {
        const editsRaw = localStorage.getItem("tech_products_edits");
        if (editsRaw) customEdits = JSON.parse(editsRaw);
      } catch (e) {}
    }

    // Kết hợp và áp dụng các chỉnh sửa tồn kho / trạng thái
    const fullList = [...customCreated, ...combinedDefaults].map((p: any) => {
      const edit = customEdits[p.id] || customEdits[p.sku];
      if (edit) {
        return { ...p, ...edit };
      }
      return p;
    });

    const filtered = fullList.filter(
      (p: any) => !deletedIds.includes(p.id) && !deletedIds.includes(p.sku)
    );
    return { success: true, data: filtered };
  },

  createAdminProduct: async (productData: any) => {
    const sku = productData.sku || `TC-${Date.now().toString().slice(-6)}`;
    const newProd = {
      id: "prod-" + Date.now(),
      sku,
      name: productData.name || "Sản phẩm công nghệ mới",
      slug: productData.slug || "vga-msi-geforce-rtx-4090-suprim-x-24gb",
      warrantyTag: productData.warrantyTag || "Bảo hành 36T TechCare+",
      category: productData.category || "AI & Deep Learning",
      subCategory: productData.subCategory || "Linh kiện bổ sung",
      categoryType: productData.categoryType || "workstation",
      retailPrice: Number(productData.retailPrice) || 50000000,
      costPrice: Number(productData.costPrice) || 40000000,
      stockQty: Number(productData.stockQty) >= 0 ? Number(productData.stockQty) : 5,
      unit: productData.unit || "chiếc",
      hub: productData.hub || "Kho Landmark 81",
      hubBreakdown: productData.hubBreakdown || `${productData.hub || "Kho Landmark 81"}: ${productData.stockQty || 5} chiếc`,
      image: productData.image || "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=300&q=80",
      status: Number(productData.stockQty) <= 0 ? "out_of_stock" : Number(productData.stockQty) <= 5 ? "low_stock" : "in_stock",
      statusText: Number(productData.stockQty) <= 0 ? "Hết hàng" : Number(productData.stockQty) <= 5 ? "Sắp hết hàng" : "Còn hàng",
      eShieldSerial: productData.eShieldSerial || `ESH-${sku}-${Date.now().toString().slice(-4)}`,
      distributor: productData.distributor || "TechCore Enterprise Official",
      origin: productData.origin || "Chính ngạch VAT",
      specs: productData.specs || {
        "Tiêu chuẩn": "Phần cứng chính ngạch",
        "Bảo hành": "36 Tháng TechCare+ Đổi mới 1:1",
      },
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("custom_products");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(newProd);
        localStorage.setItem("custom_products", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("techcore:products-changed", { detail: list }));
      } catch (e) {}
    }

    return { success: true, data: newProd };
  },

  updateAdminProduct: async (productId: string, patch: any) => {
    if (typeof window !== "undefined") {
      try {
        const editsRaw = localStorage.getItem("tech_products_edits");
        const edits = editsRaw ? JSON.parse(editsRaw) : {};
        edits[productId] = { ...(edits[productId] || {}), ...patch, updatedAt: new Date().toISOString() };
        localStorage.setItem("tech_products_edits", JSON.stringify(edits));

        window.dispatchEvent(new CustomEvent("techcore:products-changed", { detail: { productId, patch } }));
      } catch (e) {}
    }
    return { success: true, message: "Cập nhật sản phẩm thành công" };
  },

  deleteAdminProduct: async (productId: string) => {
    if (typeof window !== "undefined") {
      try {
        const hidden: string[] = JSON.parse(localStorage.getItem("deleted_product_ids") || "[]");
        if (!hidden.includes(productId)) hidden.push(productId);
        localStorage.setItem("deleted_product_ids", JSON.stringify(hidden));

        const raw = localStorage.getItem("custom_products");
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.filter((c: any) => c.id !== productId && c.sku !== productId);
          localStorage.setItem("custom_products", JSON.stringify(updated));
        }

        window.dispatchEvent(new CustomEvent("techcore:products-changed", { detail: { deletedId: productId } }));
      } catch (e) {}
    }
    return { success: true, message: "Đã xóa sản phẩm thành công" };
  },

  // ================= ADMIN INVENTORY & SERIAL/IMEI MANAGEMENT =================
  getAdminInventory: async () => {
    let deletedIds: string[] = [];
    if (typeof window !== "undefined") {
      try {
        deletedIds = JSON.parse(localStorage.getItem("deleted_inventory_ids") || "[]");
      } catch (e) {}
    }

    let customCreated: any[] = [];
    let customEdits: Record<string, any> = {};

    if (typeof window !== "undefined") {
      try {
        customCreated = JSON.parse(localStorage.getItem("custom_inventory_serials") || "[]");
      } catch (e) {}
      try {
        const editsRaw = localStorage.getItem("tech_inventory_edits");
        if (editsRaw) customEdits = JSON.parse(editsRaw);
      } catch (e) {}
    }

    const fullList = [...customCreated, ...DEFAULT_SEED_INVENTORY].map((item: any) => {
      const edit = customEdits[item.id] || customEdits[item.serialNumber];
      if (edit) {
        return { ...item, ...edit };
      }
      return item;
    });

    const filtered = fullList.filter(
      (item: any) => !deletedIds.includes(item.id) && !deletedIds.includes(item.serialNumber)
    );
    return { success: true, data: filtered };
  },

  createAdminInventory: async (serialData: any) => {
    const sn = serialData.serialNumber || `SN-TC-${Date.now().toString().slice(-6)}`;
    const newRecord = {
      id: "eshield-" + Date.now(),
      serialNumber: sn,
      imei: serialData.imei || "IMEI-" + Math.floor(100000000000000 + Math.random() * 900000000000000),
      hashSha256: "0x" + Math.random().toString(16).substring(2, 6).toUpperCase() + "..." + Math.random().toString(16).substring(2, 6).toUpperCase(),
      productName: serialData.productName || "Thiết bị phần cứng TechCore",
      sku: serialData.sku || "TC-PART-MASTER",
      category: serialData.category || "Card đồ họa GPU",
      hubLocation: serialData.hubLocation || "Kho Landmark 81 (TP.HCM)",
      hubCode: serialData.hubLocation?.includes("Keangnam") ? "HUB-CG" : serialData.hubLocation?.includes("Tân Bình") ? "HUB-TB" : "HUB-LM81",
      rackZone: serialData.rackZone || "Kệ tiêu chuẩn ESD Safe Zone A",
      temperature: "18.2°C",
      humidity: "47% RH",
      sealStatus: serialData.sealStatus || "sealed",
      status: serialData.status || "in_stock",
      statusText: serialData.status === "reserved"
        ? `Đã gán đơn ${serialData.assignedOrder || "#TECH-2026-PENDING"}`
        : serialData.status === "in_transit"
        ? "Đang trên xe CoolVan #01"
        : serialData.status === "activated"
        ? "Đã bàn giao & Kích hoạt VIP"
        : "Sẵn sàng xuất kho hỏa tốc",
      assignedOrder: serialData.assignedOrder || "Chưa gán đơn",
      customerName: serialData.customerName || "Tồn kho chuẩn bị",
      importDate: new Date().toLocaleDateString("vi-VN"),
      warrantyMonths: Number(serialData.warrantyMonths) || 36,
      warrantyExpiry: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear() + 3}`,
      supplier: serialData.supplier || "TechCore Authorized Hub VN",
      mintBlock: "#BLOCK-" + Math.floor(1090000 + Math.random() * 9999),
    };

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("custom_inventory_serials");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(newRecord);
        localStorage.setItem("custom_inventory_serials", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("techcore:inventory-changed", { detail: list }));
      } catch (e) {}
    }

    return { success: true, data: newRecord };
  },

  updateAdminInventory: async (serialId: string, patch: any) => {
    if (typeof window !== "undefined") {
      try {
        const editsRaw = localStorage.getItem("tech_inventory_edits");
        const edits = editsRaw ? JSON.parse(editsRaw) : {};
        edits[serialId] = { ...(edits[serialId] || {}), ...patch, updatedAt: new Date().toISOString() };
        localStorage.setItem("tech_inventory_edits", JSON.stringify(edits));

        window.dispatchEvent(new CustomEvent("techcore:inventory-changed", { detail: { serialId, patch } }));
      } catch (e) {}
    }
    return { success: true, message: "Cập nhật hồ sơ S/N thành công" };
  },

  deleteAdminInventory: async (serialId: string) => {
    if (typeof window !== "undefined") {
      try {
        const hidden: string[] = JSON.parse(localStorage.getItem("deleted_inventory_ids") || "[]");
        if (!hidden.includes(serialId)) hidden.push(serialId);
        localStorage.setItem("deleted_inventory_ids", JSON.stringify(hidden));

        const raw = localStorage.getItem("custom_inventory_serials");
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.filter((c: any) => c.id !== serialId && c.serialNumber !== serialId);
          localStorage.setItem("custom_inventory_serials", JSON.stringify(updated));
        }

        window.dispatchEvent(new CustomEvent("techcore:inventory-changed", { detail: { deletedId: serialId } }));
      } catch (e) {}
    }
    return { success: true, message: "Đã xóa bản ghi S/N thành công" };
  },

  // ================= ADMIN WARRANTY & RMA MANAGEMENT =================
  getAdminWarranty: async () => {
    let deletedIds: string[] = [];
    if (typeof window !== "undefined") {
      try {
        deletedIds = JSON.parse(localStorage.getItem("deleted_rma_ids") || "[]");
      } catch (e) {}
    }

    let customCreated: any[] = [];
    let customEdits: Record<string, any> = {};

    if (typeof window !== "undefined") {
      try {
        customCreated = JSON.parse(localStorage.getItem("custom_rma_tickets") || "[]");
      } catch (e) {}
      try {
        const editsRaw = localStorage.getItem("tech_rma_edits");
        if (editsRaw) customEdits = JSON.parse(editsRaw);
      } catch (e) {}
    }

    const fullList = [...customCreated, ...DEFAULT_SEED_RMA].map((item: any) => {
      const edit = customEdits[item.id] || customEdits[item.code];
      if (edit) {
        return { ...item, ...edit };
      }
      return item;
    });

    const filtered = fullList.filter(
      (item: any) => !deletedIds.includes(item.id) && !deletedIds.includes(item.code)
    );
    return { success: true, data: filtered };
  },

  createAdminWarranty: async (rmaData: any) => {
    const code = rmaData.code || `#RMA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: "rma-" + Date.now(),
      code,
      datetime: `${new Date().toLocaleDateString("vi-VN")} • ${new Date().toLocaleTimeString("vi-VN")}`,
      customer: {
        name: rmaData.customerName || "Khách hàng TechCore",
        tier: rmaData.customerTier || "VIP Gold",
        phone: rmaData.customerPhone || "0987.654.321",
        address: rmaData.customerAddress || "Quận 1, TP.HCM",
      },
      equipment: {
        name: rmaData.equipmentName || "Thiết bị phần cứng TechCore",
        sku: rmaData.equipmentSku || "TC-PART-MASTER",
        originalSerial: rmaData.serialNumber || `SN-TC-${Date.now().toString().slice(-6)}`,
        purchaseDate: rmaData.purchaseDate || new Date().toLocaleDateString("vi-VN"),
        daysSincePurchase: Number(rmaData.daysSincePurchase) || 10,
        under30Days: (Number(rmaData.daysSincePurchase) || 10) <= 30,
      },
      issueDescription: rmaData.issueDescription || "Khách hàng báo lỗi phần cứng cần hỗ trợ kỹ thuật TechCare+.",
      diagnosisResult: rmaData.diagnosisResult || "Kỹ sư đã xác thực và chấp thuận tiếp nhận xử lý.",
      serviceType: rmaData.serviceType || "exchange_30d",
      serviceTypeText:
        rmaData.serviceType === "exchange_30d"
          ? "1 Đổi 1 Trong 30 Ngày (Mới 100%)"
          : rmaData.serviceType === "onsite_repair"
          ? "Kỹ Thuật Viên On-Site Doanh Nghiệp"
          : "Bảo Hành Trung Tâm Lab (36T)",
      assignedTech: rmaData.assignedTech || "KTV Trưởng Hoàng Nam",
      techPhone: rmaData.techPhone || "0918.456.789",
      replacementSerial: rmaData.replacementSerial || "Đang chỉ định linh kiện e-Shield mới",
      status: rmaData.status || "urgent_exchange",
      statusText:
        rmaData.status === "urgent_exchange"
          ? "Đã duyệt đổi mới • Xe CoolVan đang xuất phát"
          : rmaData.status === "onsite_active"
          ? "Kỹ sư đang xử lý On-site tại chỗ"
          : rmaData.status === "lab_inspecting"
          ? "Đang thẩm định tại trung tâm Lab"
          : "Hoàn tất xử lý • Khách hàng đã ký nhận",
      slaCountdown: rmaData.status === "completed" ? "Đã xong" : "≤ 2 Giờ",
      hubLocation: rmaData.hubLocation || "Kho Hub Landmark 81 (TP.HCM)",
      history: [
        { time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }), action: "Tiếp nhận ticket bảo hành qua hệ thống" },
      ],
    };

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("custom_rma_tickets");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(newRecord);
        localStorage.setItem("custom_rma_tickets", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("techcore:warranty-changed", { detail: list }));
      } catch (e) {}
    }

    return { success: true, data: newRecord };
  },

  updateAdminWarranty: async (rmaId: string, patch: any) => {
    if (typeof window !== "undefined") {
      try {
        const editsRaw = localStorage.getItem("tech_rma_edits");
        const edits = editsRaw ? JSON.parse(editsRaw) : {};
        edits[rmaId] = { ...(edits[rmaId] || {}), ...patch, updatedAt: new Date().toISOString() };
        localStorage.setItem("tech_rma_edits", JSON.stringify(edits));

        window.dispatchEvent(new CustomEvent("techcore:warranty-changed", { detail: { rmaId, patch } }));
      } catch (e) {}
    }
    return { success: true, message: "Cập nhật phiếu RMA thành công" };
  },

  deleteAdminWarranty: async (rmaId: string) => {
    if (typeof window !== "undefined") {
      try {
        const hidden: string[] = JSON.parse(localStorage.getItem("deleted_rma_ids") || "[]");
        if (!hidden.includes(rmaId)) hidden.push(rmaId);
        localStorage.setItem("deleted_rma_ids", JSON.stringify(hidden));

        const raw = localStorage.getItem("custom_rma_tickets");
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.filter((c: any) => c.id !== rmaId && c.code !== rmaId);
          localStorage.setItem("custom_rma_tickets", JSON.stringify(updated));
        }

        window.dispatchEvent(new CustomEvent("techcore:warranty-changed", { detail: { deletedId: rmaId } }));
      } catch (e) {}
    }
    return { success: true, message: "Đã xóa phiếu RMA thành công" };
  },

  // Admin Portal Operations
  getDashboardStats: async () => {
    const res = await fetchApi("/admin/dashboard");
    if (res.success && res.data) return res;

    const allOrders = [...getLocalOrders(), ...DEFAULT_SEED_ORDERS];
    const totalRev = allOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    return {
      success: true,
      data: {
        totalRevenue: totalRev,
        totalOrders: allOrders.length,
        totalProducts: 12,
        totalCustomers: 2,
        recentOrders: allOrders.slice(0, 5),
      },
    };
  },

  updateOrderStatus: async (id: string, status: string, note?: string) => {
    return api.updateAdminOrderStatus(id, status, note);
  },
};
