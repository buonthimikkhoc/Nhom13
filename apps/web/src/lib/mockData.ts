import { Product, Category, Brand } from "../types";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Laptop & MacBook",
    slug: "laptop",
    image: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg",
    children: [
      { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
      { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    ],
  },
  {
    id: "cat-2",
    name: "Điện thoại / iPhone",
    slug: "dien-thoai",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
  },
  {
    id: "cat-3",
    name: "Linh kiện PC & VGA",
    slug: "linh-kien-pc",
    image: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-zb-120br-argb-pwm-black-120mm-fan-nguoc-01.jpg",
    children: [
      { id: "cat-3-1", name: "Card màn hình (VGA)", slug: "vga-card-man-hinh" },
      { id: "cat-3-2", name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly" },
      { id: "cat-3-3", name: "RAM & Ổ cứng SSD", slug: "ram-ssd" },
    ],
  },
  {
    id: "cat-4",
    name: "Bàn phím cơ & Gear",
    slug: "phu-kien-gaming",
    image: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-atk-rs7-air-he-rgb-hotswap-rapid-trigger-magnetic-sw-01-e30d74cd-fee2-4516-9f9b-0bfae2207b21.jpg",
    children: [
      { id: "cat-4-1", name: "Bàn phím cơ", slug: "ban-phim-co" },
      { id: "cat-4-2", name: "Chuột Gaming", slug: "chuot-gaming" },
      { id: "cat-4-3", name: "Tai nghe & Âm thanh", slug: "tai-nghe-gaming" },
    ],
  },
  {
    id: "cat-5",
    name: "Màn hình máy tính",
    slug: "man-hinh",
    image: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-02.jpg",
  },
];

export const MOCK_BRANDS: Brand[] = [
  { id: "b-1", name: "Apple", slug: "apple" },
  { id: "b-2", name: "ASUS", slug: "asus" },
  { id: "b-3", name: "MSI", slug: "msi" },
  { id: "b-4", name: "Dell", slug: "dell" },
  { id: "b-5", name: "Lenovo", slug: "lenovo" },
  { id: "b-6", name: "NVIDIA", slug: "nvidia" },
  { id: "b-7", name: "Intel", slug: "intel" },
  { id: "b-8", name: "AMD", slug: "amd" },
  { id: "b-9", name: "Samsung", slug: "samsung" },
  { id: "b-10", name: "Logitech", slug: "logitech" },
  { id: "b-11", name: "Razer", slug: "razer" },
  { id: "b-12", name: "Corsair", slug: "corsair" },
];

export const MOCK_PRODUCTS: Product[] = [
  // 1. LAPTOP GAMING ASUS ROG STRIX G16
  {
    id: "prod-1",
    name: "Laptop Gaming ASUS ROG Strix G16 G614JVR (2024)",
    slug: "laptop-gaming-asus-rog-strix-g16-2024",
    shortDesc: "Intel Core i9 14900HX, RTX 4070 8GB, Màn hình 16 inch QHD+ 240Hz sắc nét.",
    description: "ASUS ROG Strix G16 2024 trang bị cấu hình hàng đầu thế giới với vi xử lý Intel Core i9 Gen 14 kết hợp card đồ họa NVIDIA GeForce RTX 4070 mang lại hiệu năng gaming và đồ họa cực đỉnh. Hệ thống tản nhiệt ROG Intelligent Cooling cùng keo tản nhiệt kim loại lỏng Conductonaut Extreme.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core i9-14900HX (24 nhân, 32 luồng, up to 5.8GHz)",
      ram: "32GB DDR5 5600MHz",
      storage: "1TB PCIe 4.0 NVMe M.2 SSD",
      vga: "NVIDIA GeForce RTX 4070 8GB GDDR6 (TGP 140W)",
      display: "16.0 inch QHD+ 240Hz, ROG Nebula Display 100% DCI-P3",
      battery: "90WHrs, sạc siêu tốc",
      weight: "2.50 Kg",
    }),
    avgRating: 5.0,
    reviewCount: 38,
    category: { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
    brand: { id: "b-2", name: "ASUS", slug: "asus" },
    images: [
      { id: "img-cat-1-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/4695c906-bb44-48da-9f54-534c4d476f33.jpg?v=1793361067517", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-1",
        productId: "prod-1",
        sku: "ROG-G16-I9-32G-1T",
        name: "Core i9 / 32GB RAM / 1TB SSD / RTX 4070 / Đen Eclipse",
        color: "Đen Eclipse",
        storage: "1TB SSD",
        ram: "32GB",
        price: 49990000,
        compareAtPrice: 53990000,
        stock: 15,
      },
      {
        id: "var-2",
        productId: "prod-1",
        sku: "ROG-G16-I7-16G-512G",
        name: "Core i7 / 16GB RAM / 512GB SSD / RTX 4060 / Xám Volt",
        color: "Xám Volt",
        storage: "512GB SSD",
        ram: "16GB",
        price: 36990000,
        compareAtPrice: 39990000,
        stock: 20,
      },
    ],
  },

  // 2. APPLE MACBOOK PRO 14 M3 PRO
  {
    id: "prod-2",
    name: "Apple MacBook Pro 14 M3 Pro (18GB / 512GB SSD)",
    slug: "apple-macbook-pro-14-m3-pro",
    shortDesc: "Chip Apple M3 Pro 11-Core CPU, 14-Core GPU, 18GB Unified Memory, Màn hình Liquid Retina XDR.",
    description: "MacBook Pro 14 inch với chip M3 Pro bứt phá tốc độ và thời lượng pin ấn tượng lên đến 18 giờ. Màu Space Black chống bám vân tay sang trọng đỉnh cao.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 12,
    specs: JSON.stringify({
      cpu: "Apple M3 Pro (11-core CPU, 14-core GPU)",
      ram: "18GB Unified Memory",
      storage: "512GB SSD",
      display: "14.2-inch Liquid Retina XDR (3024x1964) 120Hz ProMotion",
      battery: "70Wh, sạc nhanh qua cổng MagSafe 3",
      weight: "1.61 Kg",
    }),
    avgRating: 4.9,
    reviewCount: 45,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-1", name: "Apple", slug: "apple" },
    images: [
      { id: "img-var-1-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/b1f1d3c0-7494-47b0-88a3-75e9e0e49244.jpg?v=1791013829347", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-3",
        productId: "prod-2",
        sku: "MBP14-M3PRO-18-512-BLACK",
        name: "Space Black - 18GB RAM - 512GB SSD",
        color: "Đen Không Gian (Space Black)",
        storage: "512GB SSD",
        ram: "18GB",
        price: 48990000,
        compareAtPrice: 51990000,
        stock: 25,
      },
      {
        id: "var-4",
        productId: "prod-2",
        sku: "MBP14-M3PRO-36-1TB-SILVER",
        name: "Bạc Silver - 36GB RAM - 1TB SSD",
        color: "Bạc (Silver)",
        storage: "1TB SSD",
        ram: "36GB",
        price: 61990000,
        compareAtPrice: 65990000,
        stock: 8,
      },
    ],
  },

  // 3. LENOVO LEGION PRO 5 2024
  {
    id: "prod-3",
    name: "Laptop Gaming Lenovo Legion Pro 5 16IRX9 (2024)",
    slug: "laptop-gaming-lenovo-legion-pro-5-2024",
    shortDesc: "Intel Core i7-14650HX, RTX 4060 8GB, Màn hình 16 inch 2.5K 165Hz 100% sRGB.",
    description: "Dòng laptop gaming quốc dân với hệ thống tản nhiệt Legion Coldfront 5.0 danh tiếng, khung kim loại nguyên khối xám Onyx Grey bền bỉ và bàn phím Legion TrueStrike gõ siêu êm.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core i7-14650HX (16 nhân, 24 luồng, up to 5.2GHz)",
      ram: "16GB DDR5 5600MHz",
      storage: "512GB PCIe NVMe SSD",
      vga: "NVIDIA GeForce RTX 4060 8GB GDDR6 (TGP 140W)",
      display: "16 inch WQXGA (2560x1600) IPS 165Hz, G-SYNC",
      weight: "2.50 Kg",
    }),
    avgRating: 4.8,
    reviewCount: 31,
    category: { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
    brand: { id: "b-5", name: "Lenovo", slug: "lenovo" },
    images: [
      { id: "img-var-3-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-83hd0062va-01-4f5ef792-fbeb-4a40-b9fe-ddda1671c0f4.jpg?v=1784023574970", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-legion-1",
        productId: "prod-3",
        sku: "LEGION5-I7-16-512",
        name: "Core i7 / 16GB RAM / 512GB SSD / RTX 4060",
        color: "Xám Onyx Grey",
        price: 34990000,
        compareAtPrice: 37990000,
        stock: 18,
      },
    ],
  },

  // 4. IPHONE 16 PRO MAX 256GB
  {
    id: "prod-4",
    name: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
    slug: "iphone-16-pro-max-256gb",
    shortDesc: "Khung Titan sa mạc cao cấp, Chip A18 Pro hỗ trợ AI, Nút Camera Control thế hệ mới.",
    description: "iPhone 16 Pro Max sở hữu viền màn hình siêu mỏng 6.9 inch Super Retina XDR OLED, chip A18 Pro tối tân quay video 4K 120fps chuyên nghiệp chuẩn Hollywood.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 12,
    specs: JSON.stringify({
      cpu: "Apple A18 Pro 3nm (6 nhân CPU, 6 nhân GPU)",
      display: "6.9 inch Super Retina XDR 120Hz ProMotion",
      camera: "Chính 48MP, Siêu rộng 48MP, Tele 5x 12MP",
      battery: "Pin phát video liên tục đến 33 giờ",
      material: "Khung viền Titan cấp 5, Kính Ceramic Shield 2026",
    }),
    avgRating: 5.0,
    reviewCount: 82,
    category: { id: "cat-2", name: "Điện thoại / iPhone", slug: "dien-thoai" },
    brand: { id: "b-1", name: "Apple", slug: "apple" },
    images: [
      { id: "img-var-legion-1-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg?v=1790045892843", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-5",
        productId: "prod-4",
        sku: "IP16PM-256-DESERT",
        name: "Titan Sa Mạc (Desert Titanium) - 256GB",
        color: "Titan Sa Mạc",
        storage: "256GB",
        price: 33990000,
        compareAtPrice: 34990000,
        stock: 30,
      },
      {
        id: "var-6",
        productId: "prod-4",
        sku: "IP16PM-256-NATURAL",
        name: "Titan Tự Nhiên (Natural Titanium) - 256GB",
        color: "Titan Tự Nhiên",
        storage: "256GB",
        price: 33990000,
        compareAtPrice: 34990000,
        stock: 22,
      },
    ],
  },

  // 5. SAMSUNG GALAXY S24 ULTRA 5G
  {
    id: "prod-5",
    name: "Samsung Galaxy S24 Ultra 5G 12GB/512GB (Galaxy AI)",
    slug: "samsung-galaxy-s24-ultra-512gb",
    shortDesc: "Khung viền Titan sang trọng, Bút S-Pen tích hợp, Camera 200MP Zoom 100x và Galaxy AI thông minh.",
    description: "Galaxy S24 Ultra mở ra kỷ nguyên quyền năng di động với bộ công cụ Galaxy AI: Khoanh tròn để tìm kiếm, Phiên dịch trực tiếp cuộc gọi và Trợ lý chỉnh ảnh chuyên nghiệp.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 12,
    specs: JSON.stringify({
      cpu: "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      ram: "12GB LPDDR5X",
      storage: "512GB UFS 4.0",
      display: "6.8 inch Dynamic AMOLED 2X, 120Hz, Độ sáng 2600 nits, Kính Gorilla Armor chống lóa",
      camera: "200MP + 50MP + 12MP + 10MP",
      battery: "5000mAh, sạc nhanh 45W",
    }),
    avgRating: 4.9,
    reviewCount: 47,
    category: { id: "cat-2", name: "Điện thoại / iPhone", slug: "dien-thoai" },
    brand: { id: "b-9", name: "Samsung", slug: "samsung" },
    images: [
      { id: "img-var-5-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-02.jpg?v=1790045893877", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-s24-gray",
        productId: "prod-5",
        sku: "S24U-512-GRAY",
        name: "Xám Titan (Titanium Gray) - 512GB",
        color: "Xám Titan",
        storage: "512GB",
        price: 31990000,
        compareAtPrice: 34990000,
        stock: 25,
      },
    ],
  },

  // 6. CARD MÀN HÌNH ASUS ROG STRIX RTX 4080 SUPER 16GB
  {
    id: "prod-6",
    name: "Card Màn Hình ASUS ROG Strix GeForce RTX 4080 SUPER 16GB OC",
    slug: "vga-asus-rog-strix-geforce-rtx-4080-super-16gb",
    shortDesc: "16GB GDDR6X 256-bit, Kiến trúc Ada Lovelace, DLSS 3, Quạt Axial-tech làm mát đỉnh cao.",
    description: "Quái vật đồ họa gaming và Render 3D thời gian thực. Tích hợp tản nhiệt buồng hơi Vapor Chamber kim loại nguyên khối và công nghệ đèn LED Aura Sync RGB tuyệt đẹp.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      vga: "NVIDIA GeForce RTX 4080 SUPER",
      ram: "16GB GDDR6X 256-bit",
      power: "Nguồn khuyến nghị 850W (Cổng 16-pin 12VHPWR)",
      clock: "Xung nhịp tăng cường OC: 2655 MHz",
      ports: "2x HDMI 2.1a, 3x DisplayPort 1.4a",
    }),
    avgRating: 4.9,
    reviewCount: 29,
    category: { id: "cat-3-1", name: "Card màn hình (VGA)", slug: "vga-card-man-hinh" },
    brand: { id: "b-2", name: "ASUS", slug: "asus" },
    images: [
      { id: "img-var-s24-gray-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-01.jpg?v=1790045892843", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-7",
        productId: "prod-6",
        sku: "ROG-STRIX-RTX4080S-O16G",
        name: "Phiên bản OC Edition 16GB GDDR6X",
        color: "Đen Aura RGB",
        storage: "16GB VRAM",
        price: 33490000,
        compareAtPrice: 36000000,
        stock: 12,
      },
    ],
  },

  // 7. CARD MÀN HÌNH MSI RTX 4090 SUPRIM X 24GB
  {
    id: "prod-7",
    name: "Card Màn Hình MSI GeForce RTX 4090 SUPRIM X 24GB",
    slug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
    shortDesc: "Card đồ họa mạnh nhất hành tinh 24GB GDDR6X, Chơi mượt 8K Gaming & AI Model Training.",
    description: "Đỉnh cao tuyệt đối của card đồ họa tiêu dùng với 16384 nhân CUDA và bộ nhớ khổng lồ 24GB VRAM. Tản nhiệt TRI FROZR 3S với quạt TORX FAN 5.0 tối ưu luồng gió yên tĩnh tuyệt đối.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      vga: "NVIDIA GeForce RTX 4090",
      ram: "24GB GDDR6X 384-bit",
      power: "Nguồn khuyến nghị 1000W (Cổng 16-pin)",
      clock: "Extreme Performance: 2640 MHz",
      ports: "3x DisplayPort 1.4a, 1x HDMI 2.1a",
    }),
    avgRating: 5.0,
    reviewCount: 16,
    category: { id: "cat-3-1", name: "Card màn hình (VGA)", slug: "vga-card-man-hinh" },
    brand: { id: "b-3", name: "MSI", slug: "msi" },
    images: [
      { id: "img-var-7-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-xigmatek-xa-20-en46072-7a18c750-b461-4cf6-93ea-152a18c95c23.png?v=1743638042007", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-4090",
        productId: "prod-7",
        sku: "MSI-RTX4090-SUPRIMX",
        name: "MSI RTX 4090 SUPRIM X 24GB",
        color: "Bạc Ánh Kim Hợp Kim",
        price: 54990000,
        compareAtPrice: 58990000,
        stock: 6,
      },
    ],
  },

  // 8. BỘ VI XỬ LÝ INTEL CORE I9-14900K
  {
    id: "prod-8",
    name: "Bộ Vi Xử Lý CPU Intel Core i9-14900K (Up to 6.0GHz)",
    slug: "cpu-intel-core-i9-14900k",
    shortDesc: "24 nhân 32 luồng, Xung nhịp Turbo Boost đến 6.0GHz, Socket LGA1700 thế hệ mới.",
    description: "Bộ vi xử lý máy tính để bàn hàng đầu với kiến trúc lai hiệu năng cao của Intel, mang lại trải nghiệm chiến game mượt mà và khả năng dựng phim đồ họa đa luồng cực nhanh.",
    status: "active",
    isFeatured: false,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core i9-14900K",
      cores: "24 nhân (8 P-Core + 16 E-Core), 32 luồng",
      frequency: "Cơ bản 3.2GHz, Tối đa 6.0GHz",
      cache: "36MB Intel Smart Cache",
      socket: "LGA1700 (Tương thích Z790/B760)",
    }),
    avgRating: 4.9,
    reviewCount: 52,
    category: { id: "cat-3-2", name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-4090-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/12400f-tray.jpg?v=1773391294017", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-i9-14900k",
        productId: "prod-8",
        sku: "CPU-INTEL-I9-14900K",
        name: "Box Chính Hãng Nguyên Seal",
        price: 15490000,
        compareAtPrice: 16990000,
        stock: 35,
      },
    ],
  },

  // 9. BÀN PHÍM CƠ LOGITECH G915 LIGHTSPEED
  {
    id: "prod-9",
    name: "Bàn Phím Cơ Không Dây Logitech G915 LIGHTSPEED Wireless RGB",
    slug: "ban-phim-co-gaming-khong-day-logitech-g915-lightspeed",
    shortDesc: "Switch GL Tactile cấu hình thấp, kết nối LIGHTSPEED 1ms siêu tốc, pin đến 30 giờ chơi game.",
    description: "Thiết kế siêu mỏng 22mm từ hợp kim nhôm máy bay 5052 cao cấp, switch low-profile bền bỉ với độ nảy tuyệt vời và con lăn điều chỉnh âm lượng chuyên dụng.",
    status: "active",
    isFeatured: false,
    warrantyMonths: 24,
    specs: JSON.stringify({
      switch: "GL Tactile Low Profile",
      connectivity: "LIGHTSPEED 1ms, Bluetooth, Cáp Type-C",
      battery: "Lên đến 30 giờ (độ sáng 100%)",
      features: "5 phím macro G chuyên dụng, LED RGB LIGHTSYNC",
    }),
    avgRating: 4.8,
    reviewCount: 51,
    category: { id: "cat-4-1", name: "Bàn phím cơ", slug: "ban-phim-co" },
    brand: { id: "b-10", name: "Logitech", slug: "logitech" },
    images: [
      { id: "img-var-i9-14900k-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-asus-rog-falchion-ace-75-he-rog-hfx-v2x-sw-01.jpg?v=1790744867810", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-8",
        productId: "prod-9",
        sku: "LOGI-G915-TACTILE-BK",
        name: "GL Tactile Switch - Màu Đen Carbon",
        color: "Đen Carbon",
        price: 4290000,
        compareAtPrice: 5190000,
        stock: 40,
      },
    ],
  },

  // 10. CHUỘT GAMING LOGITECH G PRO X SUPERLIGHT 2
  {
    id: "prod-10",
    name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2 (60g)",
    slug: "chuot-logitech-g-pro-x-superlight-2",
    shortDesc: "Trọng lượng siêu nhẹ chỉ 60g, Cảm biến HERO 2 32.000 DPI, Tần số báo cáo 4000Hz.",
    description: "Chuột thi đấu eSports đỉnh cao của các game thủ FPS chuyên nghiệp trên toàn thế giới. Switch quang cơ LIGHTFORCE thế hệ mới cho độ phản hồi chính xác đến từng mili-giây.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      sensor: "HERO 2 (100 – 32.000 DPI)",
      weight: "60 gram",
      polling: "4000Hz (0.25ms)",
      battery: "Lên đến 95 giờ sử dụng liên tục",
    }),
    avgRating: 5.0,
    reviewCount: 64,
    category: { id: "cat-4-2", name: "Chuột Gaming", slug: "chuot-gaming" },
    brand: { id: "b-10", name: "Logitech", slug: "logitech" },
    images: [
      { id: "img-var-8-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-khong-day-asus-rog-harpe-ii-extreme-edition-20-90mp04q0-bmua00-01.jpg?v=1780915228733", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-gpro-white",
        productId: "prod-10",
        sku: "LOGI-SUPERLIGHT2-WHITE",
        name: "Trắng Ngọc Trai (White Edition)",
        color: "Trắng",
        price: 3690000,
        compareAtPrice: 4190000,
        stock: 50,
      },
      {
        id: "var-gpro-black",
        productId: "prod-10",
        sku: "LOGI-SUPERLIGHT2-BLACK",
        name: "Đen Nhám (Matte Black)",
        color: "Đen",
        price: 3690000,
        compareAtPrice: 4190000,
        stock: 45,
      },
    ],
  },

  // 11. MÀN HÌNH GAMING ASUS ROG SWIFT OLED 4K 240HZ
  {
    id: "prod-11",
    name: "Màn Hình Gaming ASUS ROG Swift OLED PG32UCDM (32 inch, 4K, 240Hz, 0.03ms)",
    slug: "man-hinh-asus-rog-swift-oled-pg32ucdm",
    shortDesc: "Tấm nền QD-OLED 4K thế hệ thứ 3, Tần số quét 240Hz, Thời gian phản hồi 0.03ms.",
    description: "Màn hình gaming OLED hoàn hảo nhất thế giới với chuẩn hiển thị 4K siêu nét, màu đen sâu tuyệt đối, chuẩn màu 99% DCI-P3 và tản nhiệt buồng hơi graphene chống lưu ảnh hiệu quả.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      size: "31.5 inch (16:9)",
      panel: "QD-OLED 4K (3840 x 2160)",
      refresh: "240Hz, 0.03ms (GtG)",
      hdr: "HDR10, DisplayHDR True Black 400",
      ports: "DisplayPort 1.4, HDMI 2.1, USB-C 90W PD",
    }),
    avgRating: 5.0,
    reviewCount: 22,
    category: { id: "cat-5", name: "Màn hình máy tính", slug: "man-hinh" },
    brand: { id: "b-2", name: "ASUS", slug: "asus" },
    images: [
      { id: "img-var-gpro-white-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/giga-asus-sata-iii-02.jpg?v=1556969521253", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-mon-oled",
        productId: "prod-11",
        sku: "ASUS-PG32UCDM",
        name: "ROG Swift OLED PG32UCDM 32 inch 4K 240Hz",
        price: 38990000,
        compareAtPrice: 42990000,
        stock: 10,
      },
    ],
  },

  // 12. Ổ CỨNG SSD SAMSUNG 990 PRO 2TB PCIE 4.0
  {
    id: "prod-12",
    name: "Ổ Cứng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 NVMe M.2 (7450 MB/s)",
    slug: "ssd-samsung-990-pro-2tb-nvme",
    shortDesc: "Tốc độ đọc tuần tự 7450 MB/s, ghi 6900 MB/s, chip nhớ V-NAND TLC và bộ nhớ đệm DRAM.",
    description: "Tối ưu hóa băng thông PCIe 4.0 đạt ngưỡng giới hạn tốc độ. Lý tưởng cho các cỗ máy chơi game hạng nặng và dựng video 4K/8K mượt mà.",
    status: "active",
    isFeatured: false,
    warrantyMonths: 60,
    specs: JSON.stringify({
      capacity: "2TB (2000GB)",
      readSpeed: "Lên đến 7.450 MB/s",
      writeSpeed: "Lên đến 6.900 MB/s",
      formFactor: "M.2 2280 NVMe 2.0",
      tbw: "1200 TBW",
    }),
    avgRating: 4.9,
    reviewCount: 39,
    category: { id: "cat-3-3", name: "RAM & Ổ cứng SSD", slug: "ram-ssd" },
    brand: { id: "b-9", name: "Samsung", slug: "samsung" },
    images: [
      { id: "img-var-mon-oled-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-laptop-acer-sd200-16gb-ddr5-5600mhz-1-1v-bl-9bwwa-414-01.jpg?v=1786070430743", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-ssd-2tb",
        productId: "prod-12",
        sku: "SAM-990PRO-2TB",
        name: "Bản Tiêu Chuẩn 2TB",
        price: 4790000,
        compareAtPrice: 5390000,
        stock: 30,
      },
    ],
  },

  // 13. LAPTOP DELL XPS 16 9640 OLED (2024 / 2026)
  {
    id: "prod-dell-1",
    name: "Laptop Dell XPS 16 9640 Core Ultra 7 155H (32GB / 1TB / RTX 4060 / 4K OLED Touch)",
    slug: "laptop-dell-xps-16-9640-oled",
    shortDesc: "Intel Core Ultra 7 155H tích hợp NPU AI, Màn hình 16.3 inch 4K+ OLED cảm ứng 120Hz, RTX 4060 8GB đồ họa cao cấp.",
    description: "Dell XPS 16 9640 tái định nghĩa chuẩn mực laptop cao cấp với viền siêu mỏng InfinityEdge, mặt kính liền mạch tích hợp bàn di chuột vô hình cảm ứng lực. Bộ vi xử lý Intel Core Ultra thế hệ mới kết hợp card đồ họa NVIDIA GeForce RTX 4060 đem lại sức mạnh sáng tạo nội dung và AI không giới hạn.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU Intel AI Boost)",
      ram: "32GB LPDDR5X 7467MHz Dual-Channel",
      storage: "1TB M.2 PCIe 4.0 NVMe SSD",
      vga: "NVIDIA GeForce RTX 4060 8GB GDDR6 (50W TGP)",
      display: "16.3 inch 4K+ (3840 x 2400) OLED Touch 120Hz, 100% DCI-P3, HDR 500, Kính Gorilla Glass 3",
      battery: "99.5WHr, sạc nhanh qua cổng Thunderbolt 4 Type-C 130W",
      weight: "2.13 Kg",
      material: "Nhôm CNC nguyên khối kết hợp bề mặt kính cường lực phủ nano",
    }),
    avgRating: 5.0,
    reviewCount: 42,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-4", name: "Dell", slug: "dell" },
    images: [
      { id: "img-var-ssd-2tb-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-01-74568f31-95d9-428d-9ad6-a6e13e0b5d99.jpg?v=1789536381847", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-dell-xps-16",
        productId: "prod-dell-1",
        sku: "DELL-XPS16-U7-32G-1T-4060",
        name: "Platinum Silver • 32GB RAM • 1TB SSD • RTX 4060 • 4K OLED",
        color: "Bạc Bạch Kim (Platinum Silver)",
        storage: "1TB SSD",
        ram: "32GB",
        price: 68990000,
        compareAtPrice: 74990000,
        stock: 18,
      },
      {
        id: "var-dell-xps-16-base",
        productId: "prod-dell-1",
        sku: "DELL-XPS16-U7-16G-512G",
        name: "Graphite Dark • 16GB RAM • 512GB SSD • Intel Arc Graphics",
        color: "Than Chì (Graphite Dark)",
        storage: "512GB SSD",
        ram: "16GB",
        price: 54990000,
        compareAtPrice: 59990000,
        stock: 12,
      },
    ],
  },

  // 14. LAPTOP GAMING DELL ALIENWARE M16 R2
  {
    id: "prod-dell-2",
    name: "Laptop Gaming Dell Alienware m16 R2 Core Ultra 9 185H (32GB / 1TB / RTX 4080 / QHD+ 240Hz)",
    slug: "laptop-gaming-dell-alienware-m16-r2",
    shortDesc: "Intel Core Ultra 9 185H, RTX 4080 12GB TGP 175W, Màn hình 16 inch QHD+ 240Hz, Tản nhiệt buồng hơi Cryo-tech độc quyền.",
    description: "Cỗ máy chiến game huyền thoại Alienware m16 R2 sở hữu thiết kế Stealth Mode thanh lịch nhưng ẩn chứa sức mạnh hủy diệt. Tản nhiệt Cryo-tech 4 quạt siêu mỏng và tản nhiệt buồng hơi buồng lạnh giữ hiệu năng máy luôn ở đỉnh cao khi chơi game 4K hoặc render đồ họa nặng.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core Ultra 9 185H (16 nhân, 22 luồng, Turbo 5.1GHz, 24MB Cache)",
      ram: "32GB DDR5 5600MHz (2x 16GB Dual Channel, nâng cấp tối đa 64GB)",
      storage: "1TB M.2 PCIe Gen 4 NVMe SSD (hỗ trợ 2 khe M.2)",
      vga: "NVIDIA GeForce RTX 4080 12GB GDDR6 (TGP 175W Max Power)",
      display: "16.0 inch QHD+ (2560 x 1600) 240Hz, 3ms, 100% sRGB, NVIDIA G-SYNC & Advanced Optimus",
      cooling: "Alienware Cryo-tech độc quyền với tản nhiệt buồng hơi Vapor Chamber & 4 quạt tản",
      battery: "90WHr với công nghệ sạc nhanh ExpressCharge",
      weight: "2.61 Kg, Màu Dark Metallic Moon siêu ngầu",
    }),
    avgRating: 4.9,
    reviewCount: 35,
    category: { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
    brand: { id: "b-4", name: "Dell", slug: "dell" },
    images: [
      { id: "img-var-dell-xps-16-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-02-61554b73-6b33-4e3b-838d-26d21dc42f98.jpg?v=1789536383337", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-dell-alienware-m16",
        productId: "prod-dell-2",
        sku: "AW-M16R2-U9-32G-1T-4080",
        name: "Dark Metallic Moon • Ultra 9 • 32GB • 1TB • RTX 4080",
        color: "Mặt Trăng Đen Kim Loại (Dark Metallic Moon)",
        storage: "1TB SSD",
        ram: "32GB",
        price: 76500000,
        compareAtPrice: 82000000,
        stock: 10,
      },
    ],
  },

  // 15. LAPTOP MÁY TRẠM DELL PRECISION 7680 WORKSTATION AI
  {
    id: "prod-dell-3",
    name: "Laptop Máy Trạm Dell Precision 7680 Core i9-13950HX (64GB CAMM / 2TB / RTX 4000 Ada 12GB)",
    slug: "laptop-dell-precision-7680-workstation",
    shortDesc: "Intel Core i9-13950HX vPro, 64GB RAM CAMM DDR5, 2TB SSD, GPU chuyên dụng NVIDIA RTX 4000 Ada 12GB đạt chuẩn ISV Certified.",
    description: "Dell Precision 7680 là máy trạm di động mạnh mẽ bậc nhất thế giới dành cho các kỹ sư AI, chuyên gia mô phỏng 3D CAD/CAM và các hãng phim điện ảnh. Trang bị chuẩn RAM CAMM mỏng nhẹ tự sửa lỗi ECC và bảo mật cấp doanh nghiệp đạt chuẩn phần cứng 4-Shield.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core i9-13950HX vPro Enterprise (24 nhân, 32 luồng, up to 5.5GHz, 36MB Cache)",
      ram: "64GB CAMM DDR5 5600MHz ECC (Công nghệ module bộ nhớ CAMM tiên phong)",
      storage: "2TB PCIe Gen 4.0 NVMe SSD Class 40 (Tốc độ đọc 7.000 MB/s)",
      vga: "NVIDIA RTX 4000 Ada Generation 12GB GDDR6 (Chứng nhận ISV Certified cho AutoCAD, Maya, SolidWorks)",
      display: "16.0 inch OLED UHD+ (3840 x 2400) 100% DCI-P3, 500 nits, chống chói, hiệu chuẩn màu sẵn",
      security: "Bảo mật vân tay SafeID, Camera IR nhận diện khuôn mặt, e-Shield Hardware Verified",
      battery: "93WHr Long Life Cycle, Adapter 180W Slim SFF",
      weight: "2.60 Kg, Khung hợp kim nhôm titan cao cấp",
    }),
    avgRating: 5.0,
    reviewCount: 28,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-4", name: "Dell", slug: "dell" },
    images: [
      { id: "img-var-dell-alienware-m16-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-tuf-gaming-16-fx610jm-tu004w-01.jpg?v=1789614151503", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-dell-precision-7680",
        productId: "prod-dell-3",
        sku: "DELL-PREC7680-I9-64G-2T-RTX4000",
        name: "Titan Grey • i9-13950HX • 64GB CAMM • 2TB SSD • RTX 4000 Ada",
        color: "Xám Titan (Titan Grey)",
        storage: "2TB SSD",
        ram: "64GB",
        price: 89900000,
        compareAtPrice: 95000000,
        stock: 8,
      },
    ],
  },

  // 16. LAPTOP DELL INSPIRON 16 PLUS 7640 (2024 / 2026)
  {
    id: "prod-dell-4",
    name: "Laptop Dell Inspiron 16 Plus 7640 Core Ultra 7 155H (16GB / 1TB / RTX 4050 / 2.5K 120Hz)",
    slug: "laptop-dell-inspiron-16-plus-7640",
    shortDesc: "Intel Core Ultra 7 155H AI Boost, 16GB LPDDR5X, 1TB SSD, RTX 4050 6GB, Màn hình 16 inch 2.5K 120Hz sắc nét.",
    description: "Dell Inspiron 16 Plus 7640 là lựa chọn hoàn hảo cho dân văn phòng cao cấp, lập trình viên và sinh viên kỹ thuật. Máy sở hữu màn hình rộng 16 inch tỉ lệ 16:10 độ phân giải 2.5K 120Hz, vỏ kim loại Ice Blue sang trọng cùng thời lượng pin bền bỉ cả ngày làm việc.",
    status: "active",
    isFeatured: false,
    warrantyMonths: 12,
    specs: JSON.stringify({
      cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU AI tích hợp, up to 4.8GHz)",
      ram: "16GB LPDDR5X 6400MHz Dual-Channel",
      storage: "1TB PCIe NVMe M.2 SSD",
      vga: "NVIDIA GeForce RTX 4050 6GB GDDR6",
      display: "16.0 inch 2.5K (2560 x 1600) 120Hz, 16:10, 100% sRGB, chống chói ComfortView Plus",
      audio: "4 loa công suất lớn với công nghệ Waves MaxxAudio Pro",
      battery: "90WHr, sạc Type-C nhanh 100W",
      weight: "2.05 Kg, Vỏ nhôm nguyên khối Ice Blue",
    }),
    avgRating: 4.8,
    reviewCount: 39,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-4", name: "Dell", slug: "dell" },
    images: [
      { id: "img-var-dell-precision-7680-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-tuf-gaming-16-fx610jm-tu004w-02.jpg?v=1789614151503", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-dell-inspiron-16",
        productId: "prod-dell-4",
        sku: "DELL-INS16P-U7-16G-1T-4050",
        name: "Ice Blue • Core Ultra 7 • 16GB • 1TB • RTX 4050",
        color: "Xanh Băng (Ice Blue)",
        storage: "1TB SSD",
        ram: "16GB",
        price: 31990000,
        compareAtPrice: 34990000,
        stock: 25,
      },
    ],
  },

  // 17. LAPTOP GAMING DELL G16 7630 (ESPORTS EDITION)
  {
    id: "prod-dell-5",
    name: "Laptop Gaming Dell G16 7630 Core i7-13650HX (16GB / 512GB / RTX 4060 8GB / QHD+ 165Hz)",
    slug: "laptop-gaming-dell-g16-7630",
    shortDesc: "Intel Core i7-13650HX, 16GB DDR5, 512GB SSD, RTX 4060 8GB 140W max công suất, Màn hình 16 inch QHD+ 165Hz G-SYNC.",
    description: "Dell G16 7630 mang gen gaming đỉnh cao thừa hưởng từ Alienware với quạt tản nhiệt kép và nút phím tắt G-Key tăng tốc làm mát tức thì. Màn hình 16 inch QHD+ 165Hz 100% sRGB kết hợp card đồ họa RTX 4060 140W giúp bạn làm chủ mọi đấu trường thể thao điện tử eSports.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core i7-13650HX (14 nhân, 20 luồng, up to 4.9GHz, 24MB Cache)",
      ram: "16GB DDR5 4800MHz (2 khe RAM nâng cấp tối đa 64GB)",
      storage: "512GB PCIe Gen 4 NVMe M.2 SSD (có thêm 1 khe mở rộng)",
      vga: "NVIDIA GeForce RTX 4060 8GB GDDR6 (TGP 140W Max Performance)",
      display: "16.0 inch QHD+ (2560 x 1600) 165Hz, 100% sRGB, NVIDIA G-SYNC & DDS",
      keyboard: "Bàn phím cơ Cherry MX RGB low-profile độ phản hồi 1ms siêu nhạy",
      cooling: "Hệ thống quạt kép công nghệ lấy cảm hứng từ Alienware + phím tắt Game Shift (F9)",
      battery: "86WHr, Adapter 330W công suất cao",
      weight: "2.70 Kg, Màu Metallic Shadow Gray",
    }),
    avgRating: 4.9,
    reviewCount: 47,
    category: { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
    brand: { id: "b-4", name: "Dell", slug: "dell" },
    images: [
      { id: "img-var-dell-inspiron-16-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-strix-g16-g614pm-ts147w-01.jpg?v=1789616369243", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-dell-g16-7630",
        productId: "prod-dell-5",
        sku: "DELL-G16-7630-I7-16G-512G-4060",
        name: "Metallic Shadow Gray • i7-13650HX • 16GB • 512GB • RTX 4060",
        color: "Xám Bóng Kim Loại (Metallic Shadow Gray)",
        storage: "512GB SSD",
        ram: "16GB",
        price: 29490000,
        compareAtPrice: 32990000,
        stock: 30,
      },
    ],
  },

  // 18. LAPTOP INTEL NUC M15 EVO (INCLINE FALLS)
  {
    id: "prod-intel-laptop-1",
    name: "Laptop Intel NUC M15 EVO Core i7-1260P (16GB / 512GB SSD / 15.6 inch Touch IPS 100% sRGB)",
    slug: "laptop-intel-nuc-m15-evo",
    shortDesc: "Chuẩn Intel EVO cao cấp, vỏ nhôm nguyên khối Anodized CNC, pin 16 giờ, 2 cổng Thunderbolt 4.",
    description: "Intel NUC M15 EVO (tên mã Incline Falls) là mẫu laptop chuẩn mực được chính Intel thiết kế và sản xuất theo tiêu chuẩn khắt khe nhất của chứng nhận Intel EVO. Thân máy chế tác từ nhôm nguyên khối cắt CNC siêu mỏng chỉ 14.9mm, màn hình cảm ứng 15.6 inch Full HD IPS chuẩn 100% sRGB, bàn rê kính mượt mà và camera IR mở khóa khuôn mặt Windows Hello tức thì.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core i7-1260P (12 nhân, 16 luồng, Turbo Boost 4.7GHz, 18MB Smart Cache)",
      ram: "16GB LPDDR5 5200MHz Dual-Channel onboard",
      storage: "512GB PCIe 4.0 NVMe M.2 SSD",
      vga: "Intel Iris Xe Graphics (96 EUs)",
      display: "15.6 inch FHD (1920 x 1080) IPS Cảm ứng đa điểm, 100% sRGB, 450 nits viền siêu mỏng",
      battery: "73WHr, sạc nhanh Type-C Thunderbolt 4 65W, thời lượng pin lên đến 16 giờ",
      connectivity: "2x Thunderbolt 4 Type-C (40Gbps), 2x USB 3.2 Gen 2, 1x HDMI 2.0b, Intel Wi-Fi 6E AX211, Bluetooth 5.2",
      weight: "1.65 Kg, Vỏ nhôm nguyên khối Anodized Shadow Grey",
    }),
    avgRating: 4.9,
    reviewCount: 36,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-dell-g16-7630-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-strix-g16-g614pm-ts147w-02.jpg?v=1789616370363", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-m15-evo",
        productId: "prod-intel-laptop-1",
        sku: "INTEL-NUC-M15-I7-16G-512G",
        name: "Shadow Grey • i7-1260P • 16GB • 512GB • Touch IPS",
        color: "Xám Bạc Kim Loại (Shadow Grey)",
        storage: "512GB SSD",
        ram: "16GB",
        price: 18990000,
        compareAtPrice: 21500000,
        stock: 25,
      },
    ],
  },

  // 19. LAPTOP GAMING INTEL NUC X15 KING COUNTY (RTX 3070 TI)
  {
    id: "prod-intel-laptop-2",
    name: "Laptop Gaming Intel NUC X15 King County Core i7-12700H (32GB DDR5 / 1TB / RTX 3070 Ti 140W / QHD 165Hz)",
    slug: "laptop-gaming-intel-nuc-x15-king-county",
    shortDesc: "Bàn phím cơ quang học Optical-Mechanical RGB, Vỏ hợp kim Magie siêu nhẹ 1.99kg, RTX 3070 Ti 140W max TGP.",
    description: "Intel NUC X15 King County là dòng laptop gaming đầu bảng do chính kỹ sư Intel phát triển dành riêng cho cộng đồng đam mê phần cứng. Khung vỏ làm từ hợp kim Magie siêu nhẹ chỉ 1.99kg nhưng chứa đựng card đồ họa cực mạnh RTX 3070 Ti 8GB chạy tối đa công suất 140W. Bàn phím cơ quang học Optical-Mechanical bấm cực nảy với LED RGB từng phím.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core i7-12700H (14 nhân, 20 luồng, up to 4.7GHz, 24MB Cache)",
      ram: "32GB DDR5 4800MHz Dual-Channel (Hỗ trợ tối đa 64GB)",
      storage: "1TB PCIe Gen 4x4 NVMe SSD (tốc độ đọc 7000 MB/s)",
      vga: "NVIDIA GeForce RTX 3070 Ti 8GB GDDR6 (TGP 140W Max công suất)",
      display: "15.6 inch QHD (2560 x 1440) 165Hz IPS, 100% sRGB, độ trễ 3ms, viền mỏng",
      keyboard: "Bàn phím cơ quang học Optical-Mechanical switch phản hồi 0.2ms, RGB per-key",
      cooling: "Hệ thống ống đồng tản nhiệt kép kích thước lớn + quạt phản lực siêu êm",
      battery: "94WHr, Adapter 230W Slim",
      weight: "1.99 Kg, Khung hợp kim Magie nguyên khối",
    }),
    avgRating: 5.0,
    reviewCount: 42,
    category: { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-m15-evo-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-zephyrus-g14-gu405ar-sy016w-01.jpg?v=1786516993527", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-x15-kc",
        productId: "prod-intel-laptop-2",
        sku: "INTEL-NUC-X15-I7-32G-1T-3070TI",
        name: "Matte Black • i7-12700H • 32GB • 1TB • RTX 3070 Ti 140W",
        color: "Đen Nhám Hợp Kim (Matte Black)",
        storage: "1TB SSD",
        ram: "32GB",
        price: 29490000,
        compareAtPrice: 34000000,
        stock: 18,
      },
    ],
  },

  // 20. LAPTOP INTEL NUC STUDIO AI WORKSTATION (CORE ULTRA 9 / RTX 4070)
  {
    id: "prod-intel-laptop-3",
    name: "Laptop Intel NUC Studio AI Workstation Core Ultra 9 185H (32GB LPDDR5X / 2TB / RTX 4070 / 3.2K Mini-LED 165Hz)",
    slug: "laptop-intel-nuc-studio-ai-workstation",
    shortDesc: "Máy trạm AI di động tối tân, NPU Intel AI Boost chuyên biệt xử lý mô hình ngôn ngữ lớn LLM và render 3D.",
    description: "Intel NUC Studio AI Workstation đại diện cho bước đột phá về điện toán trí tuệ nhân tạo. Trang bị bộ vi xử lý Intel Core Ultra 9 185H tích hợp cụm nhân AI NPU Boost thế hệ mới nhất cùng card đồ họa RTX 4070 8GB GDDR6 Studio. Màn hình Mini-LED 3.2K 165Hz với 1000 nits đỉnh sáng đạt chuẩn HDR 1000 hiển thị màu chuẩn điện ảnh.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core Ultra 9 185H (16 nhân, 22 luồng, up to 5.1GHz, NPU Intel AI Boost chuyên biệt)",
      ram: "32GB LPDDR5X 7467MHz Dual-Channel băng thông cực cao",
      storage: "2TB M.2 PCIe 4.0 NVMe SSD (Class 40 siêu bền)",
      vga: "NVIDIA GeForce RTX 4070 8GB GDDR6 (NVIDIA Studio Driver Certified)",
      display: "16.0 inch 3.2K (3200 x 2000) Mini-LED 165Hz, 1000 nits, 100% DCI-P3, HDR 1000",
      security: "Nhận diện khuôn mặt IR Camera, Khóa phần cứng e-Shield SHA-256",
      battery: "99.9WHr (Dung lượng tối đa cho phép bay), Sạc nhanh GaN 200W",
      weight: "2.10 Kg, Vỏ nhôm vũ trụ Space Grey",
    }),
    avgRating: 5.0,
    reviewCount: 19,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-x15-kc-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-zephyrus-g14-gu405ar-sy016w-02.jpg?v=1786516994480", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-studio-ai",
        productId: "prod-intel-laptop-3",
        sku: "INTEL-STUDIO-U9-32G-2T-4070",
        name: "Space Grey • Core Ultra 9 • 32GB • 2TB • RTX 4070 Studio",
        color: "Xám Vũ Trụ (Space Grey)",
        storage: "2TB SSD",
        ram: "32GB",
        price: 46990000,
        compareAtPrice: 51500000,
        stock: 10,
      },
    ],
  },

  // 21. LAPTOP INTEL EVO REFERENCE ULTRA 14 (CORE ULTRA 7 / 2.8K OLED)
  {
    id: "prod-intel-laptop-4",
    name: "Laptop Intel EVO Reference Ultra 14 Core Ultra 7 155H (16GB / 1TB / 2.8K OLED 120Hz / 1.18kg)",
    slug: "laptop-intel-evo-reference-ultra-14",
    shortDesc: "Siêu phẩm mỏng nhẹ 1.18kg, màn hình 2.8K OLED 120Hz chuẩn rạp phim, camera IR bảo mật sinh trắc học e-Shield.",
    description: "Mẫu laptop doanh nhân cao cấp định hình tiêu chuẩn Intel EVO 2026. Với trọng lượng khó tin chỉ 1.18kg trên bộ khung hợp kim Magie - Nhôm siêu bền bỉ, chiếc máy sở hữu màn hình OLED 2.8K tần số quét 120Hz siêu mịn, thời lượng pin sử dụng thực tế 18 giờ liên tục và công nghệ Intel Unison đồng bộ liền mạch với smartphone iOS & Android.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, Turbo 4.8GHz, NPU Boost)",
      ram: "16GB LPDDR5X 6400MHz Dual-Channel",
      storage: "1TB PCIe Gen4 M.2 SSD",
      vga: "Intel Arc Graphics tích hợp (8 Xe Cores)",
      display: "14.0 inch 2.8K (2880 x 1800) OLED 120Hz, 100% DCI-P3, 0.2ms, HDR True Black 600",
      battery: "75WHr, Pin dùng 18 giờ, hỗ trợ sạc nhanh qua cổng USB-C Thunderbolt 4",
      weight: "1.18 Kg, Thiết kế siêu mỏng 12.8mm",
    }),
    avgRating: 4.8,
    reviewCount: 31,
    category: { id: "cat-1-2", name: "Laptop Văn phòng & Mỏng nhẹ", slug: "laptop-van-phong" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-studio-ai-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-zephyrus-g14-gu405aw-sy029w-01.jpg?v=1786531872527", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-evo-ultra14",
        productId: "prod-intel-laptop-4",
        sku: "INTEL-EVO-U7-16G-1T-OLED",
        name: "Platinum Silver • Core Ultra 7 • 16GB • 1TB • 2.8K OLED",
        color: "Bạc Bạch Kim (Platinum Silver)",
        storage: "1TB SSD",
        ram: "16GB",
        price: 24890000,
        compareAtPrice: 27990000,
        stock: 22,
      },
    ],
  },

  // 22. LAPTOP GAMING INTEL NUC X15 ESPORTS (RTX 3060 / 240HZ)
  {
    id: "prod-intel-laptop-5",
    name: "Laptop Gaming Intel NUC X15 Core i7-11800H (16GB / 512GB / RTX 3060 6GB / FHD 240Hz 100% sRGB)",
    slug: "laptop-gaming-intel-nuc-x15-240hz",
    shortDesc: "Tần số quét 240Hz chuẩn thi đấu eSports, tản nhiệt kim loại lỏng Liquid Metal, Wi-Fi 6 AX201 siêu tốc.",
    description: "Laptop gaming thi đấu chuyên nghiệp của Intel với màn hình tần số quét khủng 240Hz siêu nhạy, triệt tiêu hoàn toàn hiện tượng bóng mờ và xé hình khi chơi CS2, Valorant hay Apex Legends. Card đồ họa RTX 3060 công suất cao cùng hệ thống tản nhiệt tối ưu giữ máy luôn mát mẻ qua hàng giờ thi đấu liên tục.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 24,
    specs: JSON.stringify({
      cpu: "Intel Core i7-11800H (8 nhân, 16 luồng, up to 4.6GHz, 24MB Smart Cache)",
      ram: "16GB DDR4 3200MHz Dual-Channel (Nâng cấp tối đa 64GB)",
      storage: "512GB NVMe PCIe 4.0 SSD (Hỗ trợ gắn thêm ổ thứ hai)",
      vga: "NVIDIA GeForce RTX 3060 6GB GDDR6 (130W Max TGP)",
      display: "15.6 inch Full HD (1920 x 1080) IPS 240Hz, 100% sRGB, độ trễ 2ms",
      cooling: "Keo tản nhiệt kim loại lỏng Liquid Metal, 4 khe thoát nhiệt",
      battery: "94WHr, Pin dùng lâu, sạc nhanh 230W",
      weight: "1.94 Kg, Vỏ kim loại siêu gọn gàng",
    }),
    avgRating: 4.8,
    reviewCount: 39,
    category: { id: "cat-1-1", name: "Laptop Gaming", slug: "laptop-gaming" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-evo-ultra14-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-zephyrus-g14-gu405aw-sy029w-02.jpg?v=1786531873727", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-x15-240hz",
        productId: "prod-intel-laptop-5",
        sku: "INTEL-NUC-X15-I7-16G-512G-240HZ",
        name: "Abyssal Black • i7-11800H • 16GB • 512GB • 240Hz",
        color: "Đen Huyền Bí (Abyssal Black)",
        storage: "512GB SSD",
        ram: "16GB",
        price: 21490000,
        compareAtPrice: 24990000,
        stock: 35,
      },
    ],
  },

  // 18. CPU INTEL CORE I9-14900KS SPECIAL EDITION
  {
    id: "prod-intel-1",
    name: "Bộ Vi Xử Lý CPU Intel Core i9-14900KS Special Edition (Up to 6.2GHz)",
    slug: "cpu-intel-core-i9-14900ks-special-edition",
    shortDesc: "Phiên bản giới hạn tuyển chọn Silicon binning cao nhất, Xung nhịp phá kỷ lục 6.2GHz, 24 nhân 32 luồng.",
    description: "Intel Core i9-14900KS là bộ vi xử lý máy tính để bàn có xung nhịp xuất xưởng cao nhất lịch sử với 6.2GHz. Được sản xuất từ những tấm wafer bán dẫn chọn lọc tinh hoa nhất (Special Edition Binning), i9-14900KS đem lại khung hình FPS cao nhất cho các game thủ eSports chuyên nghiệp và tốc độ kết xuất đồ họa đa luồng cực nhanh.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core i9-14900KS Special Edition",
      cores: "24 nhân (8 P-Core + 16 E-Core), 32 luồng",
      frequency: "Cơ bản 3.2GHz, Turbo Boost 6.0GHz, Thermal Velocity Boost 6.2GHz",
      cache: "36MB Intel Smart Cache (L3) + 32MB L2",
      socket: "LGA1700 (Tương thích Z790/B760)",
      power: "Cơ bản 150W, Turbo tối đa 320W",
      igpu: "Intel UHD Graphics 770",
    }),
    avgRating: 5.0,
    reviewCount: 31,
    category: { id: "cat-3-2", name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-x15-240hz-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/14400f-tray.jpg?v=1773391162603", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-14900ks",
        productId: "prod-intel-1",
        sku: "CPU-INTEL-I9-14900KS-SE",
        name: "Box Đặc Biệt Special Edition Nguyên Seal",
        price: 18990000,
        compareAtPrice: 21000000,
        stock: 15,
      },
    ],
  },

  // 19. CPU INTEL CORE ULTRA 9 285K ARROW LAKE
  {
    id: "prod-intel-2",
    name: "Bộ Vi Xử Lý CPU Intel Core Ultra 9 285K Arrow Lake (Up to 5.7GHz / NPU AI Boost)",
    slug: "cpu-intel-core-ultra-9-285k",
    shortDesc: "Kiến trúc Arrow Lake 3nm TSMC đột phá, 24 nhân 24 luồng, NPU 13 TOPS xử lý AI thời gian thực, Socket LGA1851.",
    description: "Intel Core Ultra 9 285K mở ra kỷ nguyên điện toán AI cho PC để bàn với tiến trình 3nm tiên tiến, tiết kiệm điện năng tới 40% so với thế hệ trước. Tích hợp nhân NPU chuyên biệt xử lý tác vụ trí tuệ nhân tạo cục bộ và kiến trúc nhân Lion Cove P-Core thế hệ mới cho hiệu năng đơn nhân vượt bậc.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core Ultra 9 285K (Arrow Lake-S)",
      cores: "24 nhân (8 Lion Cove P-Core + 16 Skymont E-Core), 24 luồng",
      frequency: "Cơ bản 3.7GHz, Turbo Boost Max 5.7GHz",
      aiNpu: "Intel AI Boost NPU 13 TOPS tích hợp",
      cache: "36MB Intel Smart Cache (L3) + 40MB L2",
      socket: "LGA1851 (Tương thích bo mạch chủ Z890 / B860)",
      memory: "Hỗ trợ DDR5 Dual-Channel 6400 MT/s natively (CUDIMM)",
      igpu: "Intel Xe-LPG Graphics 4 Xe-Cores",
    }),
    avgRating: 4.9,
    reviewCount: 26,
    category: { id: "cat-3-2", name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-14900ks-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/cpu-intel-core-i5-12400f-up-to-4-4ghz-6-cores-12-threads-18mb-2.png?v=1681810904447", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-285k",
        productId: "prod-intel-2",
        sku: "CPU-INTEL-U9-285K-BOX",
        name: "Box Chính Hãng Arrow Lake LGA1851",
        price: 17490000,
        compareAtPrice: 19500000,
        stock: 20,
      },
    ],
  },

  // 20. CPU INTEL CORE I7-14700K
  {
    id: "prod-intel-3",
    name: "Bộ Vi Xử Lý CPU Intel Core i7-14700K (Up to 5.6GHz, 20 Nhân 28 Luồng)",
    slug: "cpu-intel-core-i7-14700k",
    shortDesc: "Bổ sung thêm 4 nhân E-Core nâng tổng số 20 nhân 28 luồng, xung nhịp 5.6GHz, cân mượt mọi tác vụ đồ họa và game thủ.",
    description: "Intel Core i7-14700K là CPU đáng mua nhất thế hệ 14 nhờ được nâng cấp từ 16 lên 20 nhân (8 P-Core + 12 E-Core) và 28 luồng. Xung nhịp tối đa 5.6GHz cùng bộ nhớ đệm 33MB Smart Cache mang lại hiệu suất đa luồng vượt trội tới 17% cho các tác vụ dựng video Premiere, mô phỏng 3D Blender và livestream chuyên nghiệp.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core i7-14700K",
      cores: "20 nhân (8 P-Core + 12 E-Core), 28 luồng",
      frequency: "Cơ bản 3.4GHz, Turbo Boost 5.6GHz",
      cache: "33MB Intel Smart Cache",
      socket: "LGA1700 (Tương thích Z790/Z690/B760)",
      power: "Cơ bản 125W, Turbo tối đa 253W",
      igpu: "Intel UHD Graphics 770",
    }),
    avgRating: 4.9,
    reviewCount: 68,
    category: { id: "cat-3-2", name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-285k-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/cpu-intel-core-i5-12400f-up-to-4-4ghz-6-cores-12-threads-18mb.png?v=1681810904447", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-14700k",
        productId: "prod-intel-3",
        sku: "CPU-INTEL-I7-14700K-BOX",
        name: "Box Chính Hãng 20 Nhân 28 Luồng",
        price: 11290000,
        compareAtPrice: 12500000,
        stock: 45,
      },
    ],
  },

  // 21. CPU INTEL CORE I5-14600K
  {
    id: "prod-intel-4",
    name: "Bộ Vi Xử Lý CPU Intel Core i5-14600K (Up to 5.3GHz, 14 Nhân 20 Luồng)",
    slug: "cpu-intel-core-i5-14600k",
    shortDesc: "Vua hiệu năng trên giá thành (p/p) cho dàn máy Gaming và Streamer, 14 nhân 20 luồng, hệ số nhân Unlocked ép xung.",
    description: "Intel Core i5-14600K là mẫu vi xử lý gaming quốc dân thế hệ 14 với 14 nhân (6 P-Core + 8 E-Core) 20 luồng, xung nhịp turbo đạt 5.3GHz. Khả năng tương thích tuyệt vời với cả RAM DDR4 lẫn DDR5 giúp người dùng dễ dàng tối ưu chi phí dàn máy mà vẫn đạt tốc độ khung hình cực cao trong mọi tựa game AAA.",
    status: "active",
    isFeatured: false,
    warrantyMonths: 36,
    specs: JSON.stringify({
      cpu: "Intel Core i5-14600K",
      cores: "14 nhân (6 P-Core + 8 E-Core), 20 luồng",
      frequency: "Cơ bản 3.5GHz, Turbo Boost 5.3GHz",
      cache: "24MB Intel Smart Cache (L3) + 20MB L2",
      socket: "LGA1700",
      power: "Cơ bản 125W, Turbo 181W",
      igpu: "Intel UHD Graphics 770",
    }),
    avgRating: 4.8,
    reviewCount: 55,
    category: { id: "cat-3-2", name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-14700k-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/14400-tray.jpg?v=1773387096807", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-14600k",
        productId: "prod-intel-4",
        sku: "CPU-INTEL-I5-14600K-BOX",
        name: "Box Chính Hãng 14 Nhân 20 Luồng",
        price: 8290000,
        compareAtPrice: 9190000,
        stock: 50,
      },
    ],
  },

  // 22. CARD MÀN HÌNH INTEL ARC A770 16GB GDDR6 LIMITED EDITION
  {
    id: "prod-intel-5",
    name: "Card Màn Hình Intel Arc A770 16GB GDDR6 Limited Edition",
    slug: "vga-intel-arc-a770-limited-edition-16gb",
    shortDesc: "Card đồ họa flagship của Intel với 16GB VRAM GDDR6, mã hóa phần cứng Dual AV1 chuyên nghiệp, công nghệ nâng cấp hình ảnh Intel XeSS AI.",
    description: "Intel Arc A770 Limited Edition 16GB là chiếc card màn hình tiên phong tích hợp bộ mã hóa phần cứng AV1 thế hệ mới nhất, mang lại chất lượng stream và xuất video vượt trội cho các nhà sáng tạo nội dung. Trang bị 32 nhân Xe-core và 16GB VRAM băng thông 560 GB/s, card xử lý mượt mà các tác vụ đồ họa 3D, DaVinci Resolve và chơi game độ phân giải 1440p/4K với công nghệ nâng cấp hình ảnh bằng học máy Intel XeSS.",
    status: "active",
    isFeatured: true,
    warrantyMonths: 36,
    specs: JSON.stringify({
      gpu: "Intel Arc A770 (Kiến trúc Alchemist)",
      xeCores: "32 Xe Cores (512 XMX AI Engines, 32 Ray Tracing Units)",
      vram: "16GB GDDR6 256-bit",
      bandwidth: "560 GB/s",
      clock: "Graphics Clock 2100 MHz (OC Boost 2400 MHz)",
      codecs: "H.264, H.265 (HEVC), Dual Hardware AV1 Encode/Decode",
      ports: "3x DisplayPort 2.0 (UHBR 10), 1x HDMI 2.1",
      power: "225W (1x 8-pin + 1x 6-pin PCIe, Nguồn khuyến nghị 650W)",
    }),
    avgRating: 4.8,
    reviewCount: 37,
    category: { id: "cat-3-1", name: "Card màn hình (VGA)", slug: "vga-card-man-hinh" },
    brand: { id: "b-7", name: "Intel", slug: "intel" },
    images: [
      { id: "img-var-intel-14600k-1", url: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-xigmatek-xa-20-en46072-3-7685802c-b349-4928-af1e-eb3e2a784bfe.png?v=1743638042167", isThumbnail: true },
    ],
    variants: [
      {
        id: "var-intel-arc-a770",
        productId: "prod-intel-5",
        sku: "INTEL-ARC-A770-16G-LE",
        name: "Limited Edition 16GB GDDR6 Dual-Fan",
        color: "Đen Mờ RGB (Matte Black)",
        storage: "16GB VRAM",
        price: 9890000,
        compareAtPrice: 11500000,
        stock: 20,
      },
    ],
  },
  {
  "id": "prod-apple-3",
  "name": "Apple MacBook Pro 16 inch M3 Max (36GB Unified / 1TB SSD / Liquid Retina XDR 120Hz)",
  "slug": "apple-macbook-pro-16-m3-max",
  "shortDesc": "Chip Apple M3 Max 14 CPU 30 GPU, 36GB RAM, 1TB SSD, Màn hình 16.2 inch Liquid Retina XDR ProMotion 120Hz.",
  "description": "MacBook Pro 16 inch với chip M3 Max đem đến sức mạnh không tưởng cho các tác vụ chuyên nghiệp như mô phỏng khoa học, biên tập video 8K ProRes đa luồng và dựng hình 3D phức tạp. Thời lượng pin kỷ lục lên đến 22 giờ.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"cpu\":\"Apple M3 Max (14-core CPU, 30-core GPU, 16-core Neural Engine)\",\"ram\":\"36GB Unified Memory (Băng thông 300GB/s)\",\"storage\":\"1TB PCIe NVMe SSD\",\"display\":\"16.2 inch Liquid Retina XDR (3456 x 2234), 120Hz ProMotion, 1600 nits đỉnh HDR\",\"battery\":\"100WHr, sạc nhanh MagSafe 3 140W USB-C\",\"weight\":\"2.16 Kg, Màu Space Black (Đen Không Gian) chống bám vân tay\"}",
  "avgRating": 5,
  "reviewCount": 48,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-prod-apple-3-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/60616c58-3fe5-4e42-8c4f-8cb82ac6005a.jpg?v=1791012921020", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-mbp16-m3max",
      "productId": "prod-apple-3",
      "sku": "APPLE-MBP16-M3MAX-36G-1T",
      "name": "Space Black • M3 Max • 36GB • 1TB",
      "color": "Đen Không Gian (Space Black)",
      "storage": "1TB SSD",
      "ram": "36GB",
      "price": 89990000,
      "compareAtPrice": 94990000,
      "costPrice": 81000000,
      "stock": 15,
      "serials": [
        "MBP16-MAX-001",
        "MBP16-MAX-002"
      ]
    }
  ]
},
  {
  "id": "prod-apple-4",
  "name": "Apple MacBook Air 13 inch M3 (16GB RAM / 512GB SSD / Mỏng 11.3mm)",
  "slug": "apple-macbook-air-13-m3",
  "shortDesc": "Thiết kế siêu mỏng nhẹ chỉ 1.24kg, Chip Apple M3 8 CPU 10 GPU, Pin 18 giờ, Hỗ trợ 2 màn hình ngoài.",
  "description": "MacBook Air 13 inch M3 là chiếc laptop mỏng nhẹ hoàn hảo nhất cho công việc và học tập. Hiệu năng vượt trội trong thân máy không quạt hoàn toàn yên tĩnh, màn hình Liquid Retina 500 nits sống động.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"cpu\":\"Apple M3 (8-core CPU, 10-core GPU, 16-core Neural Engine)\",\"ram\":\"16GB Unified Memory\",\"storage\":\"512GB SSD\",\"display\":\"13.6 inch Liquid Retina (2560 x 1664) 500 nits True Tone\",\"battery\":\"Pin 18 giờ liên tục, Sạc MagSafe 3\",\"weight\":\"1.24 Kg, Vỏ nhôm tái chế 100%\"}",
  "avgRating": 4.9,
  "reviewCount": 52,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-mbp16-m3max-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/pc-i5-14600k-rtx5060-8gb.jpg?v=1791011835790", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-mba13-m3",
      "productId": "prod-apple-4",
      "sku": "APPLE-MBA13-M3-16G-512G",
      "name": "Midnight • M3 • 16GB • 512GB",
      "color": "Xanh Đen (Midnight)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 32990000,
      "compareAtPrice": 35990000,
      "costPrice": 28500000,
      "stock": 30,
      "serials": [
        "MBA13-M3-001",
        "MBA13-M3-002"
      ]
    }
  ]
},
  {
  "id": "prod-apple-5",
  "name": "Apple MacBook Air 15 inch M3 (16GB RAM / 512GB SSD / Starlight)",
  "slug": "apple-macbook-air-15-m3",
  "shortDesc": "Màn hình lớn 15.3 inch Liquid Retina, Mỏng 11.5mm, Hệ thống 6 loa âm thanh vòm Spatial Audio.",
  "description": "MacBook Air 15 inch mang đến không gian hiển thị rộng rãi cùng thời lượng pin bền bỉ trong thân máy siêu mỏng nhẹ. Trải nghiệm giải trí và làm việc đa nhiệm đỉnh cao với chip Apple M3 thế hệ mới.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"cpu\":\"Apple M3 (8-core CPU, 10-core GPU)\",\"ram\":\"16GB Unified Memory\",\"storage\":\"512GB SSD\",\"display\":\"15.3 inch Liquid Retina (2880 x 1864) 500 nits\",\"weight\":\"1.51 Kg\"}",
  "avgRating": 4.9,
  "reviewCount": 34,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-mba13-m3-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/pc-ultra7-270k-plus-rtx5070-12gb.jpg?v=1790931669590", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-mba15-m3",
      "productId": "prod-apple-5",
      "sku": "APPLE-MBA15-M3-16G-512G",
      "name": "Starlight • M3 • 16GB • 512GB",
      "color": "Ánh Sao (Starlight)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 37990000,
      "compareAtPrice": 40990000,
      "costPrice": 33000000,
      "stock": 25,
      "serials": [
        "MBA15-M3-001",
        "MBA15-M3-002"
      ]
    }
  ]
},
  {
  "id": "prod-apple-6",
  "name": "Apple MacBook Pro 14 inch M3 Standard (16GB / 512GB / Space Gray)",
  "slug": "apple-macbook-pro-14-m3-standard",
  "shortDesc": "Chip Apple M3 mạnh mẽ, Màn hình 14.2 inch Liquid Retina XDR 120Hz ProMotion, Đầy đủ cổng HDMI và thẻ SDXC.",
  "description": "MacBook Pro 14 inch cơ bản trang bị chip M3 mang lại hiệu năng đồ họa ấn tượng với công nghệ Dynamic Caching và phần cứng Ray Tracing.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"cpu\":\"Apple M3 8-core CPU, 10-core GPU\",\"ram\":\"16GB Unified Memory\",\"storage\":\"512GB SSD\",\"display\":\"14.2 inch Liquid Retina XDR 120Hz\",\"weight\":\"1.55 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 29,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-mba15-m3-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/pc-i5-14400f-rtx5060-8gb.jpg?v=1790932366867", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-mbp14-m3-std",
      "productId": "prod-apple-6",
      "sku": "APPLE-MBP14-M3-16G-512G",
      "name": "Space Gray • M3 • 16GB • 512GB",
      "color": "Xám Không Gian (Space Gray)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 43990000,
      "compareAtPrice": 46990000,
      "costPrice": 38500000,
      "stock": 20,
      "serials": [
        "MBP14-M3-01",
        "MBP14-M3-02"
      ]
    }
  ]
},
  {
  "id": "prod-apple-7",
  "name": "Điện Thoại iPhone 16 Pro 128GB Chính Hãng VN/A (Titan Tự Nhiên)",
  "slug": "dien-thoai-iphone-16-pro-128gb",
  "shortDesc": "Khung viền Titan cấp 5 siêu nhẹ, Chip A18 Pro 3nm, Nút Camera Control cảm ứng lực, Camera 48MP Fusion 5x Tele.",
  "description": "iPhone 16 Pro mang đến bước tiến vượt bậc với Apple Intelligence, thiết kế viền màn hình mỏng nhất lịch sử Apple và nút điều khiển Camera Control chuyên nghiệp.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.3 inch Super Retina XDR OLED ProMotion 120Hz, Always-On Display\",\"cpu\":\"Apple A18 Pro (6 nhân CPU, 6 nhân GPU, 16 nhân Neural Engine)\",\"camera\":\"Chính 48MP Fusion + Góc siêu rộng 48MP + Tele 12MP 5x quang học\",\"battery\":\"Lên đến 27 giờ phát video, Sạc MagSafe 25W\",\"material\":\"Khung Titan tự nhiên nhám mờ, Mặt lưng kính Ceramic Shield thế hệ mới\"}",
  "avgRating": 5,
  "reviewCount": 75,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-mbp14-m3-std-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-zephyrus-g16-gu606aw-tb121w-01.jpg?v=1786589374957", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-ip16p-128",
      "productId": "prod-apple-7",
      "sku": "IPHONE-16PRO-128GB-VN",
      "name": "Titan Tự Nhiên • 128GB",
      "color": "Titan Tự Nhiên (Natural Titanium)",
      "storage": "128GB",
      "ram": "8GB",
      "price": 28990000,
      "compareAtPrice": 30990000,
      "costPrice": 25000000,
      "stock": 45,
      "serials": [
        "IP16P-001",
        "IP16P-002"
      ]
    }
  ]
},
  {
  "id": "prod-apple-8",
  "name": "Điện Thoại iPhone 16 Plus 128GB Chính Hãng VN/A (Màn hình 6.7 inch)",
  "slug": "dien-thoai-iphone-16-plus-128gb",
  "shortDesc": "Màn hình lớn 6.7 inch Super Retina XDR, Chip Apple A18, Nút Camera Control, Thời lượng pin lên đến 27 giờ.",
  "description": "iPhone 16 Plus kết hợp hoàn hảo giữa không gian màn hình lớn và thời lượng pin dẫn đầu dòng iPhone, hỗ trợ trọn vẹn các tính năng trí tuệ nhân tạo Apple Intelligence.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.7 inch Super Retina XDR OLED, 2000 nits đỉnh sáng\",\"cpu\":\"Apple A18 3nm\",\"camera\":\"Camera kép 48MP Fusion 2x Tele + 12MP Ultra Wide Macro\",\"battery\":\"Phát video liên tục 27 giờ\",\"weight\":\"199 gram\"}",
  "avgRating": 4.8,
  "reviewCount": 41,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-ip16p-128-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/pc-i5-14400f-gtx1660-super-6gb.jpg?v=1790936734800", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-ip16plus-128",
      "productId": "prod-apple-8",
      "sku": "IPHONE-16PLUS-128GB-VN",
      "name": "Ultramarine • 128GB",
      "color": "Xanh Lưu Ly (Ultramarine)",
      "storage": "128GB",
      "ram": "8GB",
      "price": 25990000,
      "compareAtPrice": 27990000,
      "costPrice": 22500000,
      "stock": 35,
      "serials": [
        "IP16PLUS-01",
        "IP16PLUS-02"
      ]
    }
  ]
},
  {
  "id": "prod-apple-9",
  "name": "Điện Thoại iPhone 16 128GB Chính Hãng VN/A (Chip Apple A18)",
  "slug": "dien-thoai-iphone-16-128gb",
  "shortDesc": "Camera Fusion 48MP 2 trong 1, Nút Tác Vụ Action Button, Nút Camera Control chuyên nghiệp, Chip A18 3nm.",
  "description": "iPhone 16 mang đến thiết kế cụm camera dọc tinh tế, kính pha màu bền bỉ với 5 sắc màu trẻ trung cùng hiệu năng vượt trội cho trải nghiệm chiến game AAA đồ họa chân thực.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.1 inch Super Retina XDR OLED\",\"cpu\":\"Apple A18 (6-core CPU, 5-core GPU)\",\"camera\":\"Chính 48MP + Góc rộng 12MP Macro\",\"weight\":\"170 gram\"}",
  "avgRating": 4.8,
  "reviewCount": 63,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-ip16plus-128-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-zephyrus-g16-gu606aw-tb121w-02.jpg?v=1786589376323", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-ip16-128",
      "productId": "prod-apple-9",
      "sku": "IPHONE-16-128GB-VN",
      "name": "Hồng Pastel • 128GB",
      "color": "Hồng (Pink)",
      "storage": "128GB",
      "ram": "8GB",
      "price": 22490000,
      "compareAtPrice": 24490000,
      "costPrice": 19500000,
      "stock": 50,
      "serials": [
        "IP16-001",
        "IP16-002"
      ]
    }
  ]
},
  {
  "id": "prod-apple-10",
  "name": "Điện Thoại iPhone 15 Pro Max 256GB Chính Hãng VN/A (Titan Tự Nhiên)",
  "slug": "dien-thoai-iphone-15-pro-max-256gb",
  "shortDesc": "Khung viền Titan chuẩn hàng không vũ trụ, Chip A17 Pro 3nm, Cổng kết nối USB-C chuẩn 10Gbps, Camera 5x Telephoto.",
  "description": "iPhone 15 Pro Max là siêu phẩm đỉnh cao với khung titan siêu bền bỉ, ống kính telephoto tiềm vọng 5x và sức mạnh xử lý đồ họa Ray Tracing từ chip A17 Pro.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.7 inch Super Retina XDR OLED 120Hz ProMotion\",\"cpu\":\"Apple A17 Pro 3nm\",\"camera\":\"Chính 48MP + Tele 12MP 5x + Góc rộng 12MP\",\"weight\":\"221 gram\"}",
  "avgRating": 4.9,
  "reviewCount": 88,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-ip16-128-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-83hd0062va-01-4f5ef792-fbeb-4a40-b9fe-ddda1671c0f4.jpg?v=1784023574970", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-ip15pm-256",
      "productId": "prod-apple-10",
      "sku": "IPHONE-15PM-256GB-VN",
      "name": "Titan Tự Nhiên • 256GB",
      "color": "Titan Tự Nhiên (Natural Titanium)",
      "storage": "256GB",
      "ram": "8GB",
      "price": 29490000,
      "compareAtPrice": 32990000,
      "costPrice": 26000000,
      "stock": 40,
      "serials": [
        "IP15PM-001",
        "IP15PM-002"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-3",
  "name": "Laptop Samsung Galaxy Book4 Ultra Core Ultra 9 185H (32GB / 1TB / RTX 4070 / 3K AMOLED Touch 120Hz)",
  "slug": "laptop-samsung-galaxy-book4-ultra",
  "shortDesc": "Đầu bảng laptop Samsung, Màn hình Dynamic AMOLED 2X 3K cảm ứng 120Hz kính chống chói Corning DX, RTX 4070 8GB.",
  "description": "Galaxy Book4 Ultra là cỗ máy làm việc sáng tạo hàng đầu của Samsung tích hợp hệ sinh thái Galaxy Connected Experience liền mạch. Card đồ họa RTX 4070 và màn hình AMOLED siêu nét đáp ứng hoàn hảo cho thiết kế đồ họa và AI.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU Intel AI Boost)\",\"ram\":\"32GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe Gen 4 NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4070 8GB GDDR6 (80W TGP)\",\"display\":\"16.0 inch 3K (2880 x 1800) Dynamic AMOLED 2X Touch 120Hz, 120% DCI-P3, HDR 500\",\"battery\":\"76WHr, Sạc siêu nhanh 140W Type-C\",\"weight\":\"1.86 Kg, Màu Moonstone Gray nhôm nguyên khối\"}",
  "avgRating": 5,
  "reviewCount": 38,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-ip15pm-256-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-83hd0062va-02.jpg?v=1784023574970", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-gb4-ultra",
      "productId": "prod-samsung-3",
      "sku": "SAMSUNG-GB4-ULTRA-U9-32G-1T",
      "name": "Moonstone Gray • Ultra 9 • 32GB • 1TB • RTX 4070",
      "color": "Xám Đá Mặt Trăng (Moonstone Gray)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 59990000,
      "compareAtPrice": 65000000,
      "costPrice": 52000000,
      "stock": 12,
      "serials": [
        "GB4U-001",
        "GB4U-002"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-4",
  "name": "Laptop Samsung Galaxy Book4 Pro 360 Core Ultra 7 (16GB / 1TB / Màn Xoay Gập 2-trong-1 S-Pen)",
  "slug": "laptop-samsung-galaxy-book4-pro-360",
  "shortDesc": "Bản lề xoay gập 360 độ linh hoạt, Tặng kèm bút S-Pen không cần sạc, Màn hình 16 inch 3K AMOLED cảm ứng.",
  "description": "Galaxy Book4 Pro 360 biến hóa linh hoạt giữa laptop hiệu năng cao và bảng vẽ kỹ thuật số cao cấp. Bút S-Pen kèm theo cho độ trễ cực thấp để phác thảo và ghi chú tự nhiên như trên giấy.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H 16 nhân\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB SSD\",\"display\":\"16.0 inch 3K AMOLED 120Hz Touch S-Pen\",\"weight\":\"1.66 Kg\"}",
  "avgRating": 4.9,
  "reviewCount": 27,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-gb4-ultra-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkbook-16-g8-irl-21sh0097vn-01-289e4aea-4c78-4377-bfdc-47d92c161148.jpg?v=1778489306210", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-gb4-pro360",
      "productId": "prod-samsung-4",
      "sku": "SAMSUNG-GB4-PRO360-U7-16G-1T",
      "name": "Platinum Silver • Ultra 7 • 16GB • 1TB",
      "color": "Bạc Bạch Kim (Platinum Silver)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 39990000,
      "compareAtPrice": 43990000,
      "costPrice": 34500000,
      "stock": 18,
      "serials": [
        "GB4P360-01",
        "GB4P360-02"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-5",
  "name": "Laptop Samsung Galaxy Book3 Pro 14 inch Core i7-1360P (16GB / 512GB / Dynamic AMOLED 2X 120Hz)",
  "slug": "laptop-samsung-galaxy-book3-pro",
  "shortDesc": "Trọng lượng siêu nhẹ chỉ 1.17kg, Màn hình Dynamic AMOLED 2X 120Hz độ phân giải 3K, Vỏ nhôm nguyên khối.",
  "description": "Galaxy Book3 Pro 14 inch kết hợp hoàn hảo giữa độ mỏng nhẹ kinh ngạc và màn hình AMOLED chuẩn điện ảnh sắc nét hàng đầu thế giới laptop.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i7-1360P 12 nhân 16 luồng\",\"ram\":\"16GB LPDDR5\",\"storage\":\"512GB NVMe SSD\",\"display\":\"14.0 inch 3K AMOLED 120Hz\",\"weight\":\"1.17 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 31,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-gb4-pro360-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkbook-16-g8-irl-21sh0097vn-02.jpg?v=1778489306210", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-gb3-pro14",
      "productId": "prod-samsung-5",
      "sku": "SAMSUNG-GB3-PRO-I7-16G-512G",
      "name": "Graphite • i7-1360P • 16GB • 512GB",
      "color": "Xám Than (Graphite)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 26990000,
      "compareAtPrice": 29990000,
      "costPrice": 23000000,
      "stock": 22,
      "serials": [
        "GB3P-001",
        "GB3P-002"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-6",
  "name": "Điện Thoại Samsung Galaxy Z Fold6 5G 12GB/512GB (Màn Hình Gập / Galaxy AI)",
  "slug": "dien-thoai-samsung-galaxy-z-fold6",
  "shortDesc": "Bản lề kép FlexHinge siêu mỏng, Khung Armor Aluminum cường lực, Màn hình chính 7.6 inch 2600 nits, Chip Snapdragon 8 Gen 3 for Galaxy.",
  "description": "Galaxy Z Fold6 là đỉnh cao điện thoại màn hình gập với trí tuệ nhân tạo Galaxy AI toàn diện. Thiết kế vuông vức siêu mỏng nhẹ chỉ 239g mở ra không gian làm việc đa nhiệm như máy tính bảng thu nhỏ.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"Chính 7.6 inch QXGA+ Dynamic AMOLED 2X 120Hz; Phụ 6.3 inch 120Hz\",\"cpu\":\"Snapdragon 8 Gen 3 for Galaxy (4nm)\",\"ram\":\"12GB LPDDR5X\",\"storage\":\"512GB UFS 4.0\",\"camera\":\"Chính 50MP OIS + Tele 10MP 3x + Góc siêu rộng 12MP\",\"battery\":\"4400mAh, sạc nhanh 25W, kháng nước IP48\"}",
  "avgRating": 5,
  "reviewCount": 64,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-gb3-pro14-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-irl-83hd0035vn-01.jpg?v=1776932384113", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-zfold6-512",
      "productId": "prod-samsung-6",
      "sku": "SAMSUNG-ZFOLD6-512GB-VN",
      "name": "Xám Titan • 12GB/512GB",
      "color": "Xám Titan (Silver Shadow)",
      "storage": "512GB",
      "ram": "12GB",
      "price": 43990000,
      "compareAtPrice": 47990000,
      "costPrice": 38000000,
      "stock": 25,
      "serials": [
        "ZF6-001",
        "ZF6-002"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-7",
  "name": "Điện Thoại Samsung Galaxy Z Flip6 5G 12GB/256GB (Gập Vỏ Sò / FlexCam 50MP)",
  "slug": "dien-thoai-samsung-galaxy-z-flip6",
  "shortDesc": "Màn hình ngoài FlexWindow 3.4 inch, Camera nâng cấp 50MP ProVisual Engine, Buồng tản nhiệt hơi Vapor Chamber đầu tiên trên dòng Flip.",
  "description": "Galaxy Z Flip6 biểu tượng thời trang công nghệ với khả năng gập nhỏ gọn trong lòng bàn tay. Hệ thống tản nhiệt buồng hơi giúp máy luôn mát mẻ và vận hành mượt mà mọi tính năng Galaxy AI.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"Chính 6.7 inch FHD+ Dynamic AMOLED 2X 120Hz; Ngoài 3.4 inch Super AMOLED\",\"cpu\":\"Snapdragon 8 Gen 3 for Galaxy\",\"camera\":\"Kép 50MP OIS + 12MP Ultra Wide\",\"battery\":\"4000mAh\",\"weight\":\"187 gram\"}",
  "avgRating": 4.9,
  "reviewCount": 49,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-zfold6-512-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-irl-83hd0035vn-02.jpg?v=1776932385377", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-zflip6-256",
      "productId": "prod-samsung-7",
      "sku": "SAMSUNG-ZFLIP6-256GB-VN",
      "name": "Xanh Maya • 12GB/256GB",
      "color": "Xanh Maya (Blue)",
      "storage": "256GB",
      "ram": "12GB",
      "price": 24990000,
      "compareAtPrice": 28990000,
      "costPrice": 21500000,
      "stock": 30,
      "serials": [
        "ZF6-FLIP-01",
        "ZF6-FLIP-02"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-8",
  "name": "Điện Thoại Samsung Galaxy S24+ 5G 12GB/256GB (Màn 6.7 inch QHD+ 120Hz)",
  "slug": "dien-thoai-samsung-galaxy-s24-plus",
  "shortDesc": "Màn hình 6.7 inch Dynamic AMOLED 2X độ phân giải QHD+, Pin 4900mAh cực trâu, Khung viền Armor Aluminum.",
  "description": "Galaxy S24+ nâng tầm trải nghiệm với màn hình lớn độ phân giải 2K sắc nét, pin dung lượng lớn sạc nhanh 45W và trọn vẹn bộ công cụ trí tuệ nhân tạo Galaxy AI.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.7 inch QHD+ (3120 x 1440) 120Hz 2600 nits\",\"cpu\":\"Exynos 2400 10 nhân (4nm)\",\"ram\":\"12GB\",\"storage\":\"256GB\",\"camera\":\"Chính 50MP + Tele 10MP 3x + Góc rộng 12MP\",\"battery\":\"4900mAh, sạc nhanh 45W\"}",
  "avgRating": 4.8,
  "reviewCount": 38,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-zflip6-256-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-01.jpg?v=1789531206010", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-s24plus-256",
      "productId": "prod-samsung-8",
      "sku": "SAMSUNG-S24PLUS-256GB-VN",
      "name": "Tím Cobalt • 12GB/256GB",
      "color": "Tím Cobalt (Cobalt Violet)",
      "storage": "256GB",
      "ram": "12GB",
      "price": 22990000,
      "compareAtPrice": 26990000,
      "costPrice": 19800000,
      "stock": 35,
      "serials": [
        "S24P-001",
        "S24P-002"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-9",
  "name": "Điện Thoại Samsung Galaxy S24 5G 8GB/256GB (Thiết Kế Nhỏ Gọn / Galaxy AI)",
  "slug": "dien-thoai-samsung-galaxy-s24-standard",
  "shortDesc": "Kích thước nhỏ gọn 6.2 inch cầm nắm hoàn hảo, Viền siêu mỏng đều 4 cạnh, Độ sáng màn hình 2600 nits rực rỡ ngoài trời.",
  "description": "Galaxy S24 là mẫu smartphone cao cấp nhỏ gọn xuất sắc nhất với sức mạnh của Galaxy AI: Khoanh tròn để tìm kiếm Circle to Search, Phiên dịch trực tiếp cuộc gọi và Trợ lý chỉnh ảnh chuyên nghiệp.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.2 inch FHD+ Dynamic AMOLED 2X 120Hz\",\"cpu\":\"Exynos 2400 10 nhân\",\"camera\":\"50MP OIS + 10MP Tele 3x + 12MP Ultra Wide\",\"weight\":\"167 gram\"}",
  "avgRating": 4.8,
  "reviewCount": 45,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-s24plus-256-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-02.jpg?v=1789531207513", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-s24-std",
      "productId": "prod-samsung-9",
      "sku": "SAMSUNG-S24-256GB-VN",
      "name": "Vàng Amber • 8GB/256GB",
      "color": "Vàng Amber (Amber Yellow)",
      "storage": "256GB",
      "ram": "8GB",
      "price": 18490000,
      "compareAtPrice": 22990000,
      "costPrice": 15800000,
      "stock": 40,
      "serials": [
        "S24-001",
        "S24-002"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-10",
  "name": "Điện Thoại Samsung Galaxy A55 5G 8GB/128GB (Viền Kim Loại / Kháng Nước IP67)",
  "slug": "dien-thoai-samsung-galaxy-a55-5g",
  "shortDesc": "Khung viền kim loại vát phẳng sang trọng, Mặt lưng kính Gorilla Glass Victus+, Bảo mật phần cứng Samsung Knox Vault.",
  "description": "Galaxy A55 5G định chuẩn smartphone phân khúc tầm trung với camera chống rung OIS sắc nét ban đêm, pin 5000mAh dùng 2 ngày và cam kết cập nhật 4 bản Android lớn.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.6 inch Super AMOLED FHD+ 120Hz\",\"cpu\":\"Exynos 1480 GPU AMD Xclipse 530\",\"camera\":\"Chính 50MP OIS + 12MP Ultra Wide + 5MP Macro\",\"battery\":\"5000mAh, sạc nhanh 25W, chuẩn kháng nước bụi IP67\"}",
  "avgRating": 4.8,
  "reviewCount": 72,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-s24-std-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-3-21sr00a6va-01-b38842e2-5e40-4378-bc79-e8e8c448eee8.jpg?v=1776224029673", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-a55-128",
      "productId": "prod-samsung-10",
      "sku": "SAMSUNG-A55-128GB-VN",
      "name": "Xanh Iceblue • 8GB/128GB",
      "color": "Xanh Băng (Awesome Iceblue)",
      "storage": "128GB",
      "ram": "8GB",
      "price": 9490000,
      "compareAtPrice": 10490000,
      "costPrice": 7900000,
      "stock": 60,
      "serials": [
        "A55-001",
        "A55-002"
      ]
    }
  ]
},
  {
  "id": "prod-asus-4",
  "name": "Laptop Gaming ASUS ROG Zephyrus G16 OLED Core Ultra 9 (32GB / 1TB / RTX 4080 / 2.5K OLED 240Hz / 1.85kg)",
  "slug": "laptop-asus-rog-zephyrus-g16-oled",
  "shortDesc": "Vỏ nhôm CNC siêu mỏng chỉ 1.49cm, Dải đèn Slash Lighting mặt A cực chất, Màn hình ROG Nebula OLED 240Hz 0.2ms.",
  "description": "ROG Zephyrus G16 2024 tái định nghĩa laptop gaming cao cấp: vừa mỏng nhẹ tinh tế như ultrabook cao cấp (1.85kg) vừa sở hữu sức mạnh đồ họa đỉnh cao từ RTX 4080 và chip AI Core Ultra 9.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU Boost)\",\"ram\":\"32GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe 4.0 NVMe M.2 SSD\",\"vga\":\"NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP)\",\"display\":\"16.0 inch 2.5K (2560 x 1600) OLED 240Hz 0.2ms, 100% DCI-P3, G-SYNC\",\"battery\":\"90WHr, sạc nhanh Type-C 100W PD\",\"weight\":\"1.85 Kg, Màu Platinum White\"}",
  "avgRating": 5,
  "reviewCount": 44,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-a55-128-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-expertbook-p1-p1403cva-c5h16-63ws-02.jpg?v=1790045893877", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-g16-oled",
      "productId": "prod-asus-4",
      "sku": "ASUS-ZEPHYRUS-G16-U9-4080",
      "name": "Platinum White • Ultra 9 • 32GB • 1TB • RTX 4080",
      "color": "Trắng Bạch Kim (Platinum White)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 74990000,
      "compareAtPrice": 79990000,
      "costPrice": 66000000,
      "stock": 10,
      "serials": [
        "G16-001",
        "G16-002"
      ]
    }
  ]
},
  {
  "id": "prod-asus-5",
  "name": "Laptop ASUS Zenbook 14 OLED UX3405 Core Ultra 7 155H (16GB / 1TB / 3K OLED 120Hz / 1.2kg)",
  "slug": "laptop-asus-zenbook-14-oled-ux3405",
  "shortDesc": "Trọng lượng siêu nhẹ chỉ 1.2kg, Màn hình Lumina OLED 3K 120Hz chuẩn màu điện ảnh, Pin 75Wh dùng cả ngày.",
  "description": "Zenbook 14 OLED là chiếc laptop AI chuẩn mực cho doanh nhân và nhà sáng tạo. Thân máy kim loại siêu mỏng nhẹ, bàn phím ErgoSense êm ái và camera IR nhận diện khuôn mặt bảo mật tối ưu.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, 22 luồng)\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"14.0 inch 3K (2880 x 1800) OLED 120Hz 0.2ms, 100% DCI-P3\",\"weight\":\"1.20 Kg, Vỏ nhôm nguyên khối Xanh Ponder Blue\"}",
  "avgRating": 4.9,
  "reviewCount": 37,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-g16-oled-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-01-74568f31-95d9-428d-9ad6-a6e13e0b5d99.jpg?v=1789536381847", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-ux3405-u7",
      "productId": "prod-asus-5",
      "sku": "ASUS-ZENBOOK-UX3405-U7-1T",
      "name": "Ponder Blue • Ultra 7 • 16GB • 1TB",
      "color": "Xanh Trầm (Ponder Blue)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 29990000,
      "compareAtPrice": 32990000,
      "costPrice": 26000000,
      "stock": 25,
      "serials": [
        "UX3405-01",
        "UX3405-02"
      ]
    }
  ]
},
  {
  "id": "prod-asus-6",
  "name": "Laptop ASUS Zenbook Duo OLED UX8406 (2 Màn Hình Cảm Ứng 3K 120Hz / Core Ultra 9 185H / 32GB / 1TB)",
  "slug": "laptop-asus-zenbook-duo-oled-ux8406",
  "shortDesc": "Đột phá 2 màn hình 14 inch Lumina OLED 3K 120Hz, Bàn phím Bluetooth tháo rời kèm chân đế tích hợp, Chế độ làm việc đa màn hình.",
  "description": "ASUS Zenbook Duo 2024 mang lại không gian làm việc gấp đôi với 2 màn hình cảm ứng OLED tuyệt mỹ. Bàn phím từ tính tháo rời linh hoạt cho phép làm việc ở chế độ màn hình kép, chế độ sách hay chế độ máy tính để bàn.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 9 185H\",\"ram\":\"32GB LPDDR5X\",\"storage\":\"1TB PCIe 4.0 SSD\",\"display\":\"2x 14.0 inch 3K OLED 120Hz Touch, hỗ trợ bút ASUS Pen 2.0\",\"weight\":\"1.65 Kg (1.35kg khi tháo rời phím)\"}",
  "avgRating": 5,
  "reviewCount": 31,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-ux3405-u7-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-02-61554b73-6b33-4e3b-838d-26d21dc42f98.jpg?v=1789536383337", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-ux8406-duo",
      "productId": "prod-asus-6",
      "sku": "ASUS-ZENBOOK-DUO-U9-32G-1T",
      "name": "Inkwell Gray • 2x OLED 3K • Ultra 9 • 32GB",
      "color": "Xám Mực (Inkwell Gray)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 49990000,
      "compareAtPrice": 54990000,
      "costPrice": 43000000,
      "stock": 12,
      "serials": [
        "DUO-001",
        "DUO-002"
      ]
    }
  ]
},
  {
  "id": "prod-asus-7",
  "name": "Laptop Gaming ASUS ROG Strix SCAR 18 Core i9-14900HX (64GB DDR5 / 2TB SSD / RTX 4090 175W / 18 inch 240Hz)",
  "slug": "laptop-gaming-asus-rog-strix-scar-18",
  "shortDesc": "Quái vật đồ họa gaming đầu bảng, Màn hình 18 inch ROG Nebula HDR Mini-LED 2.5K 240Hz, Tản nhiệt 3 quạt với kim loại lỏng Conductonaut Extreme.",
  "description": "ROG Strix SCAR 18 là biểu tượng sức mạnh gaming tuyệt đối với CPU Core i9-14900HX 24 nhân và GPU RTX 4090 175W max công suất. Màn hình Mini-LED 18 inch sống động cùng hệ thống LED RGB rực rỡ.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz\",\"storage\":\"2TB PCIe 4.0 NVMe M.2 SSD RAID 0\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W Max TGP)\",\"display\":\"18.0 inch 2.5K (2560 x 1600) ROG Nebula HDR Mini-LED 240Hz, 1100 nits\",\"weight\":\"3.10 Kg\"}",
  "avgRating": 5,
  "reviewCount": 46,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-ux8406-duo-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-tuf-gaming-16-fx610jm-tu004w-01.jpg?v=1789614151503", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-scar18-4090",
      "productId": "prod-asus-7",
      "sku": "ASUS-ROG-SCAR18-I9-64G-4090",
      "name": "Off Black • i9-14900HX • 64GB • 2TB • RTX 4090",
      "color": "Đen Nhám (Off Black)",
      "storage": "2TB SSD",
      "ram": "64GB",
      "price": 119990000,
      "compareAtPrice": 129990000,
      "costPrice": 105000000,
      "stock": 8,
      "serials": [
        "SCAR18-01",
        "SCAR18-02"
      ]
    }
  ]
},
  {
  "id": "prod-asus-8",
  "name": "Laptop ASUS TUF Gaming A15 AMD Ryzen 7 8845HS (16GB / 512GB / RTX 4060 140W / 144Hz)",
  "slug": "laptop-asus-tuf-gaming-a15",
  "shortDesc": "Độ bền chuẩn quân đội MIL-STD-810H, Chip Ryzen 7 8845HS tích hợp nhân AI NPU, RTX 4060 140W chiến mượt game AAA.",
  "description": "ASUS TUF Gaming A15 là lựa chọn hoàn hảo cân bằng giữa độ bền bỉ chuẩn quân đội và hiệu năng chiến game mạnh mẽ với mức giá cực kỳ hấp dẫn.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"AMD Ryzen 7 8845HS (8 nhân, 16 luồng, 5.1GHz, AMD Ryzen AI)\",\"ram\":\"16GB DDR5 5600MHz\",\"storage\":\"512GB PCIe 4.0 SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB (140W TGP)\",\"display\":\"15.6 inch FHD (1920 x 1080) 144Hz G-SYNC\",\"weight\":\"2.20 Kg, Vỏ kim loại Mecha Gray\"}",
  "avgRating": 4.8,
  "reviewCount": 58,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-scar18-4090-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-tuf-gaming-16-fx610jm-tu004w-02.jpg?v=1789614151503", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-tuf-a15",
      "productId": "prod-asus-8",
      "sku": "ASUS-TUF-A15-R7-16G-4060",
      "name": "Mecha Gray • R7-8845HS • 16GB • 512GB • RTX 4060",
      "color": "Xám Kim Khí (Mecha Gray)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 27990000,
      "compareAtPrice": 30990000,
      "costPrice": 24500000,
      "stock": 35,
      "serials": [
        "TUF-001",
        "TUF-002"
      ]
    }
  ]
},
  {
  "id": "prod-asus-9",
  "name": "Điện Thoại Gaming ASUS ROG Phone 8 Pro 16GB/512GB (Snapdragon 8 Gen 3 / AniMe Vision LED / 165Hz)",
  "slug": "dien-thoai-asus-rog-phone-8-pro",
  "shortDesc": "Vua điện thoại gaming, Mặt lưng ma trận 341 đèn LED AniMe Vision tùy biến, Nút siêu âm AirTrigger, Màn hình Samsung AMOLED 165Hz.",
  "description": "ROG Phone 8 Pro lột xác với thiết kế mỏng nhẹ sang trọng, kháng nước IP68 đầu tiên trên điện thoại gaming cùng cụm camera tele 32MP chống rung gimbal 6 trục đẳng cấp.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.78 inch FHD+ Samsung E6 Flexible AMOLED 165Hz, LTPO 1-120Hz, 2500 nits\",\"cpu\":\"Snapdragon 8 Gen 3 (4nm)\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"512GB UFS 4.0\",\"camera\":\"Chính 50MP Sony IMX890 OIS Gimbal 6 trục + Tele 32MP 3x OIS + Góc rộng 13MP\",\"battery\":\"5500mAh, sạc nhanh 65W HyperCharge, sạc không dây 15W Qi\",\"gaming\":\"Nút siêu âm AirTrigger, 2 cổng USB-C, quạt tản nhiệt rời AeroActive Cooler X\"}",
  "avgRating": 5,
  "reviewCount": 51,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-tuf-a15-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-3-21sr00a6va-07.jpg?v=1776224029673", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-rog8p-512",
      "productId": "prod-asus-9",
      "sku": "ASUS-ROG8-PRO-16G-512G",
      "name": "Phantom Black • 16GB/512GB • AniMe Vision",
      "color": "Đen Bóng Đêm (Phantom Black)",
      "storage": "512GB",
      "ram": "16GB",
      "price": 29990000,
      "compareAtPrice": 33990000,
      "costPrice": 25500000,
      "stock": 20,
      "serials": [
        "ROG8-001",
        "ROG8-002"
      ]
    }
  ]
},
  {
  "id": "prod-asus-10",
  "name": "Điện Thoại ASUS Zenfone 11 Ultra 16GB/256GB (Camera Gimbal OIS 6 Trục / Pin 5500mAh)",
  "slug": "dien-thoai-asus-zenfone-11-ultra",
  "shortDesc": "Màn hình lớn 6.78 inch AMOLED 144Hz, Chip Snapdragon 8 Gen 3, Camera chống rung Gimbal 6 trục, Pin siêu trâu 5500mAh.",
  "description": "Zenfone 11 Ultra là chiếc smartphone flagship hoàn thiện của ASUS dành cho người dùng yêu thích quay video chống rung mượt mà như gimbal và thời lượng pin dẫn đầu thế giới Android.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.78 inch LTPO AMOLED 144Hz\",\"cpu\":\"Snapdragon 8 Gen 3\",\"camera\":\"Chính 50MP Gimbal OIS + 32MP Tele 3x + 13MP Ultra Wide\",\"battery\":\"5500mAh, sạc nhanh 65W\"}",
  "avgRating": 4.8,
  "reviewCount": 33,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-rog8p-512-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-6-21m7004wva-01-ebae242d-cfa9-49cb-81ec-aee6750b137a.jpg?v=1774930566137", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-zen11-256",
      "productId": "prod-asus-10",
      "sku": "ASUS-ZENFONE11-16G-256G",
      "name": "Skyline Blue • 16GB/256GB",
      "color": "Xanh Da Trời (Skyline Blue)",
      "storage": "256GB",
      "ram": "16GB",
      "price": 22490000,
      "compareAtPrice": 24990000,
      "costPrice": 19500000,
      "stock": 25,
      "serials": [
        "ZEN11-001",
        "ZEN11-002"
      ]
    }
  ]
},
  {
  "id": "prod-dell-6",
  "name": "Laptop Gaming Dell Alienware m18 R2 Core i9-14900HX (64GB / 2TB / RTX 4090 175W / 18 inch QHD+ 165Hz)",
  "slug": "laptop-dell-alienware-m18-r2",
  "shortDesc": "Quái vật Alienware màn hình khủng 18 inch, Tản nhiệt Element 31 kim loại lỏng gali-silicone, Bàn phím cơ Cherry MX RGB.",
  "description": "Alienware m18 R2 là cỗ máy thay thế máy tính để bàn (Desktop Replacement) hùng mạnh bậc nhất của Dell với thiết kế Legend 3.0 huyền thoại và khung nhôm Anodized Dark Metallic Moon siêu ngầu.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz\",\"storage\":\"2TB PCIe NVMe M.2 SSD\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)\",\"display\":\"18.0 inch QHD+ (2560 x 1600) 165Hz 3ms, 100% DCI-P3, ComfortView Plus\",\"weight\":\"4.04 Kg\"}",
  "avgRating": 5,
  "reviewCount": 35,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-zen11-256-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-6-21m7004wva-02.jpg?v=1774930566137", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-m18r2-4090",
      "productId": "prod-dell-6",
      "sku": "DELL-ALIENWARE-M18-I9-64G-4090",
      "name": "Dark Metallic Moon • i9-14900HX • 64GB • 2TB • RTX 4090",
      "color": "Mặt Trăng Kim Loại Tối (Dark Metallic Moon)",
      "storage": "2TB SSD",
      "ram": "64GB",
      "price": 114990000,
      "compareAtPrice": 125000000,
      "costPrice": 99000000,
      "stock": 6,
      "serials": [
        "M18-001",
        "M18-002"
      ]
    }
  ]
},
  {
  "id": "prod-dell-7",
  "name": "Laptop Dell XPS 14 9440 Core Ultra 7 155H (16GB / 1TB / RTX 4050 / 3.2K OLED 120Hz Touch / 1.68kg)",
  "slug": "laptop-dell-xps-14-9440-oled",
  "shortDesc": "Tuyệt tác thiết kế kính liền mạch, Màn hình 3.2K OLED InfinityEdge cảm ứng, Touchpad vô hình haptic phản hồi lực.",
  "description": "Dell XPS 14 9440 là biểu tượng thời trang và sự sang trọng. Tích hợp thanh cảm ứng chức năng điện dung, kính cường lực Gorilla Glass 3 liền khối và sức mạnh đồ họa rời RTX 4050.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, NPU AI Boost)\",\"ram\":\"16GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4050 6GB GDDR6 (30W)\",\"display\":\"14.5 inch 3.2K (3200 x 2000) OLED Touch 120Hz, 100% DCI-P3\",\"weight\":\"1.68 Kg, Nhôm CNC nguyên khối Platinum\"}",
  "avgRating": 4.9,
  "reviewCount": 29,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-m18r2-4090-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-loq-15irh11e-83y9003wvn-01.jpg?v=1791454496577", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-xps14-oled",
      "productId": "prod-dell-7",
      "sku": "DELL-XPS14-9440-U7-1T-4050",
      "name": "Platinum • Ultra 7 • 16GB • 1TB • 3.2K OLED",
      "color": "Bạch Kim (Platinum)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 54990000,
      "compareAtPrice": 59990000,
      "costPrice": 48000000,
      "stock": 14,
      "serials": [
        "XPS14-001",
        "XPS14-002"
      ]
    }
  ]
},
  {
  "id": "prod-dell-8",
  "name": "Laptop Gaming Dell Alienware x14 R2 Mỏng Nhất Thế Giới (Core i7-13620H / 16GB / 1TB / RTX 4060 / 165Hz)",
  "slug": "laptop-dell-alienware-x14-r2",
  "shortDesc": "Laptop gaming 14 inch mỏng nhất thế giới chỉ 14.5mm, Bản lề mô-men xoắn đôi độc quyền, Sạc Type-C GaN 130W.",
  "description": "Alienware x14 R2 đem lại sự tự do di chuyển tối đa cho game thủ với kích thước gọn gàng, độ mỏng ấn tượng trong khi vẫn duy trì hiệu năng chiến game đỉnh cao từ RTX 4060.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i7-13620H 10 nhân 16 luồng\",\"ram\":\"16GB LPDDR5 4800MHz\",\"storage\":\"1TB PCIe NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB (85W TGP)\",\"display\":\"14.0 inch QHD+ (2560 x 1600) 165Hz 3ms G-SYNC\",\"weight\":\"1.91 Kg, Độ mỏng 14.5mm\"}",
  "avgRating": 4.8,
  "reviewCount": 32,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-xps14-oled-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-loq-15irh11e-83y9003wvn-02.jpg?v=1791454497947", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-x14r2-4060",
      "productId": "prod-dell-8",
      "sku": "DELL-ALIENWARE-X14-I7-16G-4060",
      "name": "Lunar Silver • i7-13620H • 16GB • 1TB • RTX 4060",
      "color": "Bạc Mặt Trăng (Lunar Silver)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 44990000,
      "compareAtPrice": 48990000,
      "costPrice": 39000000,
      "stock": 16,
      "serials": [
        "X14-001",
        "X14-002"
      ]
    }
  ]
},
  {
  "id": "prod-dell-9",
  "name": "Laptop Doanh Nhân Dell Latitude 9440 2-in-1 Core i7 vPro (32GB / 1TB / QHD+ Cảm Ứng / Bàn Phím Mini-LED)",
  "slug": "laptop-dell-latitude-9440-2in1",
  "shortDesc": "Đỉnh cao laptop doanh nghiệp cao cấp, Bàn phím Mini-LED tiết kiệm 75% điện năng, Touchpad phản hồi haptic với phím tắt họp trực tuyến Zoom.",
  "description": "Dell Latitude 9440 2-in-1 thiết kế dành riêng cho các lãnh đạo doanh nghiệp và chuyên gia cấp cao. Tính năng bảo mật SafeID phần cứng, camera IR nhận diện người dùng và vỏ nhôm CNC sang trọng.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cpu\":\"Intel Core i7-1365U vPro Enterprise 10 nhân\",\"ram\":\"32GB LPDDR5x\",\"storage\":\"1TB SSD NVMe Class 35\",\"display\":\"14.0 inch QHD+ (2560 x 1600) Cảm ứng xoay gập 360 độ 500 nits\",\"weight\":\"1.53 Kg\"}",
  "avgRating": 4.9,
  "reviewCount": 22,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-x14r2-4060-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-7-21sr002gva-01-d45599ca-4a8f-4fba-83c5-cdfabf46448d.jpg?v=1791348003090", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lat9440-2in1",
      "productId": "prod-dell-9",
      "sku": "DELL-LATITUDE-9440-I7-32G-1T",
      "name": "Titan Gray • i7 vPro • 32GB • 1TB • 2-in-1 Touch",
      "color": "Xám Titan (Titan Gray)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 52990000,
      "compareAtPrice": 57990000,
      "costPrice": 46000000,
      "stock": 12,
      "serials": [
        "LAT9440-01",
        "LAT9440-02"
      ]
    }
  ]
},
  {
  "id": "prod-dell-10",
  "name": "Laptop Dell Vostro 5630 Core i7-1360P (16GB / 512GB / 16 inch FHD+ IPS / Bảo Mật Vân Tay e-Shield)",
  "slug": "laptop-dell-vostro-5630",
  "shortDesc": "Laptop văn phòng màn hình lớn 16 inch tỷ lệ 16:10, Vỏ nhôm thanh lịch, Bản lề nâng ErgoLift tản nhiệt tối ưu.",
  "description": "Dell Vostro 5630 là người bạn đồng hành tin cậy cho công việc hàng ngày với bàn phím số đầy đủ, camera Full HD chống nhiễu và chứng nhận phần cứng e-Shield bảo mật dữ liệu doanh nghiệp.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"cpu\":\"Intel Core i7-1360P (12 nhân, 16 luồng, Turbo 5.0GHz)\",\"ram\":\"16GB LPDDR5 4800MHz\",\"storage\":\"512GB M.2 PCIe NVMe SSD\",\"display\":\"16.0 inch FHD+ (1920 x 1200) chống chói 300 nits\",\"weight\":\"1.90 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 40,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-lat9440-2in1-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-7-21sr002gva-02.jpg?v=1791348003090", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-vos5630-i7",
      "productId": "prod-dell-10",
      "sku": "DELL-VOSTRO-5630-I7-16G-512G",
      "name": "Titan Gray • i7-1360P • 16GB • 512GB",
      "color": "Xám Bạc (Titan Gray)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 21990000,
      "compareAtPrice": 24490000,
      "costPrice": 18900000,
      "stock": 30,
      "serials": [
        "VOS5630-01",
        "VOS5630-02"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-2",
  "name": "Laptop Doanh Nhân Lenovo ThinkPad X1 Carbon Gen 12 Core Ultra 7 155H (32GB / 1TB / 2.8K OLED / 1.09kg)",
  "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-12",
  "shortDesc": "Biểu tượng laptop doanh nhân thế giới, Trọng lượng siêu nhẹ chỉ 1.09kg từ sợi Carbon tái chế, Màn hình 2.8K OLED 120Hz.",
  "description": "ThinkPad X1 Carbon Gen 12 nâng tầm huyền thoại với bàn phím TrackPoint công thái học huyền thoại nay bổ sung tính năng nhấn đúp mở menu nhanh, camera 8MP sắc nét và chuẩn độ bền quân đội Mỹ MIL-STD-810H.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU AI)\",\"ram\":\"32GB LPDDR5X 7500MHz\",\"storage\":\"1TB PCIe Gen4 Performance SSD\",\"display\":\"14.0 inch 2.8K (2880 x 1800) OLED 120Hz, 100% DCI-P3, HDR 500\",\"weight\":\"1.09 Kg, Khung sợi carbon và hợp kim magie\"}",
  "avgRating": 5,
  "reviewCount": 42,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-vos5630-i7-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-83hd0062va-02.jpg?v=1784023574970", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-x1c12-u7",
      "productId": "prod-lenovo-2",
      "sku": "LENOVO-X1C-GEN12-U7-32G-1T",
      "name": "Deep Black • Ultra 7 • 32GB • 1TB • 2.8K OLED",
      "color": "Đen Nhám Sợi Carbon (Deep Black)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 58990000,
      "compareAtPrice": 63990000,
      "costPrice": 51000000,
      "stock": 15,
      "serials": [
        "X1C12-001",
        "X1C12-002"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-3",
  "name": "Laptop Gaming Lenovo Legion 9i Core i9-14900HX (64GB DDR5 / 2TB / RTX 4090 175W / Tản Nhiệt Nước Tích Hợp)",
  "slug": "laptop-gaming-lenovo-legion-9i",
  "shortDesc": "Laptop gaming đầu tiên thế giới có hệ thống tản nhiệt nước tích hợp bên trong, Mặt lưng sợi carbon đúc nguyên khối độc bản.",
  "description": "Lenovo Legion 9i là đỉnh cao công nghệ laptop gaming với hệ thống tản nhiệt nước đồng phát triển cùng Cooler Master, chip AI Lenovo LA-2 tối ưu hóa khung hình thời gian thực và màn hình 3.2K Mini-LED 165Hz.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz Dual-Channel\",\"storage\":\"2TB PCIe 4.0 NVMe SSD RAID 0\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W Max TGP)\",\"display\":\"16.0 inch 3.2K (3200 x 2000) Mini-LED 165Hz 100% Adobe RGB, 1200 nits\",\"weight\":\"2.56 Kg, Nắp lưng Carbon Forged độc nhất vô nhị\"}",
  "avgRating": 5,
  "reviewCount": 37,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-x1c12-u7-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkbook-16-g8-irl-21sh0097vn-01-289e4aea-4c78-4377-bfdc-47d92c161148.jpg?v=1778489306210", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-legion9i-4090",
      "productId": "prod-lenovo-3",
      "sku": "LENOVO-LEGION-9I-I9-64G-4090",
      "name": "Carbon Forged • i9-14900HX • 64GB • 2TB • RTX 4090",
      "color": "Vân Carbon Đúc (Forged Carbon)",
      "storage": "2TB SSD",
      "ram": "64GB",
      "price": 112990000,
      "compareAtPrice": 122000000,
      "costPrice": 98000000,
      "stock": 8,
      "serials": [
        "LEGION9I-01",
        "LEGION9I-02"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-4",
  "name": "Laptop Lenovo Yoga Slim 7x Snapdragon X Elite (32GB / 1TB / 3K OLED Touch 90Hz / NPU Copilot+ 45 TOPS / 1.28kg)",
  "slug": "laptop-lenovo-yoga-slim-7x-snapdragon",
  "shortDesc": "Kỷ nguyên Copilot+ PC thế hệ mới, Chip Snapdragon X Elite 12 nhân, NPU AI 45 TOPS siêu tốc, Pin dùng 20 giờ liên tục.",
  "description": "Yoga Slim 7x là chiếc laptop Copilot+ PC mỏng nhẹ và thanh lịch hàng đầu. Trải nghiệm tốc độ xử lý AI tức thì mà không cần kết nối mạng internet, màn hình PureSight OLED 3K sống động và pin cực trâu.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Qualcomm Snapdragon X Elite (12 nhân Oryon up to 4.2GHz, NPU 45 TOPS)\",\"ram\":\"32GB LPDDR5X 8448MHz\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"14.5 inch 3K (2944 x 1840) OLED Touch 90Hz, 100% DCI-P3, 1000 nits đỉnh HDR\",\"weight\":\"1.28 Kg, Vỏ nhôm màu Cosmic Blue mỏng 12.9mm\"}",
  "avgRating": 4.9,
  "reviewCount": 31,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-legion9i-4090-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkbook-16-g8-irl-21sh0097vn-02.jpg?v=1778489306210", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-yoga7x-xelite",
      "productId": "prod-lenovo-4",
      "sku": "LENOVO-YOGA-7X-XELITE-32G-1T",
      "name": "Cosmic Blue • X Elite • 32GB • 1TB • 3K OLED",
      "color": "Xanh Vũ Trụ (Cosmic Blue)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 34990000,
      "compareAtPrice": 38990000,
      "costPrice": 30500000,
      "stock": 20,
      "serials": [
        "YOGA7X-01",
        "YOGA7X-02"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-5",
  "name": "Laptop Máy Trạm Lenovo ThinkBook 16p Gen 5 Core i9-14900HX (32GB / 1TB / RTX 4060 / 3.2K 165Hz Magic Bay)",
  "slug": "laptop-lenovo-thinkbook-16p-gen-5",
  "shortDesc": "Máy trạm di động đa năng cho creator, Khe cắm phụ kiện nam châm Magic Bay độc quyền, Màn hình 3.2K 165Hz chuẩn màu X-Rite Pantone.",
  "description": "ThinkBook 16p Gen 5 mang lại sự kết hợp tuyệt vời giữa tính thanh lịch doanh nhân và sức mạnh render đồ họa máy trạm với hệ thống mô-đun gắn nhanh Magic Bay cực kỳ tiện lợi.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX 24 nhân 32 luồng\",\"ram\":\"32GB DDR5 5600MHz\",\"storage\":\"1TB PCIe NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB GDDR6 Studio\",\"display\":\"16.0 inch 3.2K 165Hz 100% DCI-P3 430 nits\",\"weight\":\"2.20 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 26,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-yoga7x-xelite-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-irl-83hd0035vn-01.jpg?v=1776932384113", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-tb16p-i9",
      "productId": "prod-lenovo-5",
      "sku": "LENOVO-THINKBOOK-16P-I9-32G",
      "name": "Storm Grey • i9-14900HX • 32GB • 1TB • RTX 4060",
      "color": "Xám Bão (Storm Grey)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 43990000,
      "compareAtPrice": 48990000,
      "costPrice": 38000000,
      "stock": 18,
      "serials": [
        "TB16P-01",
        "TB16P-02"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-6",
  "name": "Laptop 2 Màn Hình Lenovo Yoga Book 9i (2x 13.3 inch 2.8K OLED / Core Ultra 7 155H / 16GB / 1TB)",
  "slug": "laptop-lenovo-yoga-book-9i-dual-oled",
  "shortDesc": "Đột phá sáng tạo với 2 màn hình 13.3 inch PureSight OLED 2.8K, Loa thanh xoay Bowers & Wilkins xoay 360 độ, Tặng kèm bàn phím Bluetooth và bút Stylus.",
  "description": "Yoga Book 9i mở rộng trải nghiệm sáng tạo vô hạn với 2 màn hình cảm ứng OLED xếp dọc hoặc ngang, mang đến không gian làm việc kép ở bất kỳ nơi đâu bạn đến.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB SSD\",\"display\":\"2x 13.3 inch 2.8K (2880 x 1800) OLED Touch 400 nits\",\"weight\":\"1.34 Kg\"}",
  "avgRating": 4.9,
  "reviewCount": 30,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-tb16p-i9-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-v14-g5-irl-83hd0035vn-02.jpg?v=1776932385377", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-yogabook9i",
      "productId": "prod-lenovo-6",
      "sku": "LENOVO-YOGA-BOOK-9I-U7-1T",
      "name": "Tidal Teal • 2x OLED • Ultra 7 • 16GB • 1TB",
      "color": "Xanh Ngọc Thuỷ Triều (Tidal Teal)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 49990000,
      "compareAtPrice": 54990000,
      "costPrice": 43500000,
      "stock": 14,
      "serials": [
        "YB9I-001",
        "YB9I-002"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-7",
  "name": "Điện Thoại Motorola Edge 50 Ultra by Lenovo 16GB/512GB (Mặt Lưng Gỗ Thật / Snapdragon 8s Gen 3 / 144Hz)",
  "slug": "dien-thoai-lenovo-motorola-edge-50-ultra",
  "shortDesc": "Thiết kế mặt lưng gỗ tự nhiên đạt chứng nhận FSC siêu sang, Màn hình cong viền Super HD 144Hz, Sạc siêu tốc 125W TurboPower.",
  "description": "Motorola Edge 50 Ultra (thương hiệu thuộc tập đoàn Lenovo) là siêu phẩm smartphone cao cấp với chất liệu tự nhiên gỗ thật và da thuần chay, camera tiềm vọng 64MP 3x và sạc đầy pin chỉ trong 18 phút.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.7 inch Super HD (2712 x 1220) pOLED 144Hz 2500 nits, Pantone Validated\",\"cpu\":\"Snapdragon 8s Gen 3 (4nm)\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"512GB UFS 4.0\",\"camera\":\"Chính 50MP OIS + Tele tiềm vọng 64MP 3x OIS + Góc rộng 50MP Macro\",\"battery\":\"4500mAh, sạc nhanh 125W dây, sạc không dây 50W, kháng nước IP68\"}",
  "avgRating": 4.9,
  "reviewCount": 39,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-yogabook9i-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-loq-15irh11e-83y9003xvn-01.jpg?v=1791511990270", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-edge50u",
      "productId": "prod-lenovo-7",
      "sku": "LENOVO-MOTO-EDGE50U-16G-512G",
      "name": "Nordic Wood • 16GB/512GB • Gỗ Thật",
      "color": "Gỗ Bắc Âu (Nordic Wood)",
      "storage": "512GB",
      "ram": "16GB",
      "price": 23990000,
      "compareAtPrice": 26990000,
      "costPrice": 20500000,
      "stock": 22,
      "serials": [
        "EDGE50-01",
        "EDGE50-02"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-8",
  "name": "Điện Thoại Doanh Nghiệp ThinkPhone 25 by Lenovo (Đồng Bộ ThinkPad / Sợi Carbon Aramid / MIL-STD-810H)",
  "slug": "dien-thoai-lenovo-thinkphone-25",
  "shortDesc": "Smartphone bảo mật tối cao cho doanh nghiệp, Kết nối 1 chạm Think 2 Think với laptop ThinkPad, Mặt lưng sợi Aramid siêu bền chống đạn.",
  "description": "ThinkPhone 25 by Lenovo mang trọn vẹn gen bảo mật và độ bền chuẩn ThinkPad vào smartphone. Phần cứng bảo mật Moto KeySafe độc lập và khả năng biến điện thoại thành webcam máy tính hay màn hình phụ.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"screen\":\"6.36 inch pOLED 120Hz LTPO kính Gorilla Glass 7i\",\"cpu\":\"MediaTek Dimensity 7300\",\"security\":\"ThinkShield for mobile, Chuẩn chống rơi vỡ MIL-STD-810H & IP68\",\"battery\":\"4310mAh, sạc nhanh 68W\",\"weight\":\"171 gram\"}",
  "avgRating": 4.8,
  "reviewCount": 28,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-edge50u-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-loq-15irh11e-83y9003xvn-02.jpg?v=1791511991563", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-thinkphone25",
      "productId": "prod-lenovo-8",
      "sku": "LENOVO-THINKPHONE-25-8G-256G",
      "name": "Carbon Black • 8GB/256GB • ThinkShield",
      "color": "Đen Sợi Carbon (Carbon Black)",
      "storage": "256GB",
      "ram": "8GB",
      "price": 15990000,
      "compareAtPrice": 17990000,
      "costPrice": 13500000,
      "stock": 30,
      "serials": [
        "TP25-001",
        "TP25-002"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-9",
  "name": "Điện Thoại Gaming Lenovo Legion Y90 18GB/640GB (Snapdragon 8 Gen 1 / Quạt Tản Nhiệt Đôi / SSD RAID 0)",
  "slug": "dien-thoai-lenovo-legion-y90",
  "shortDesc": "Kiến trúc tản nhiệt quạt cơ học kép Frost Blade 3.0, Ổ cứng kép UFS + SSD RAID 0 siêu tốc độ, 4 phím cảm ứng lực vai AirTrigger.",
  "description": "Lenovo Legion Y90 là chiếc điện thoại gaming hầm hố bậc nhất với hệ thống quạt gió chủ động hút khí mát giải nhiệt trực tiếp cho bo mạch chủ, mang lại FPS ổn định tuyệt đối trong các giải đấu chuyên nghiệp.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 12,
  "specs": "{\"screen\":\"6.92 inch Samsung E4 AMOLED 144Hz 720Hz touch sampling rate\",\"cpu\":\"Snapdragon 8 Gen 1\",\"ram\":\"18GB LPDDR5\",\"storage\":\"640GB (512GB UFS 3.1 + 128GB SSD)\",\"battery\":\"5600mAh, sạc đôi 68W sạc đầy 35 phút\",\"cooling\":\"Quạt tản nhiệt kép tốc độ cao + buồng hơi VC\"}",
  "avgRating": 4.8,
  "reviewCount": 35,
  "category": {
    "id": "cat-2",
    "name": "Điện thoại / iPhone",
    "slug": "dien-thoai"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-thinkphone25-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-3-21sr002lva-01.jpg?v=1784025475583", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-legiony90",
      "productId": "prod-lenovo-9",
      "sku": "LENOVO-LEGION-Y90-18G-640G",
      "name": "Titanium Gray • 18GB/640GB • Quạt Kép",
      "color": "Xám Titan (Titanium Gray)",
      "storage": "640GB",
      "ram": "18GB",
      "price": 18990000,
      "compareAtPrice": 21990000,
      "costPrice": 16000000,
      "stock": 20,
      "serials": [
        "Y90-001",
        "Y90-002"
      ]
    }
  ]
},
  {
  "id": "prod-lenovo-10",
  "name": "Máy Chơi Game Cầm Tay Lenovo Legion Go AMD Ryzen Z1 Extreme (16GB LPDDR5X / 512GB / 8.8 inch QHD+ 144Hz)",
  "slug": "may-choi-game-lenovo-legion-go",
  "shortDesc": "Màn hình cảm ứng 8.8 inch QHD+ 144Hz lớn nhất phân khúc, Tay cầm Legion TrueStrike tháo rời tích hợp chế độ chuột FPS chuột quang.",
  "description": "Lenovo Legion Go biến mọi cuộc phiêu lưu gaming PC thành di động. Màn hình 8.8 inch cực lớn, tay cầm có thể tháo rời để biến thành chuột quang bắn súng FPS chính xác đến từng milimet.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"AMD Ryzen Z1 Extreme (8 nhân, 16 luồng, RDNA 3 graphics 12 CUs)\",\"ram\":\"16GB LPDDR5X 7500MHz\",\"storage\":\"512GB PCIe 4.0 NVMe SSD\",\"display\":\"8.8 inch QHD+ (2560 x 1600) IPS 144Hz 500 nits 97% DCI-P3\",\"battery\":\"49.2WHr, sạc nhanh Super Rapid Charge 65W\",\"weight\":\"854 gram (640g thân máy)\"}",
  "avgRating": 4.9,
  "reviewCount": 47,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-legiony90-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-01.jpg?v=1789531206010", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-legiongo-z1e",
      "productId": "prod-lenovo-10",
      "sku": "LENOVO-LEGION-GO-Z1E-16G-512G",
      "name": "Shadow Black • Z1 Extreme • 16GB • 512GB",
      "color": "Đen Bóng Đêm (Shadow Black)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 18990000,
      "compareAtPrice": 20990000,
      "costPrice": 16500000,
      "stock": 35,
      "serials": [
        "LGO-001",
        "LGO-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-2",
  "name": "Laptop Gaming MSI Titan 18 HX A14V Core i9-14900HX (128GB DDR5 / 4TB SSD RAID / RTX 4090 175W / 18 inch 4K Mini-LED 120Hz)",
  "slug": "laptop-msi-titan-18-hx-a14v",
  "shortDesc": "Ông hoàng laptop gaming thế giới, Touchpad RGB Haptic liền khối đổi màu huyền ảo, Bàn phím cơ Cherry MX Ultra Low Profile, 128GB RAM DDR5.",
  "description": "MSI Titan 18 HX là tuyệt tác laptop gaming mạnh nhất lịch sử với 128GB RAM DDR5 và 4TB SSD. Màn hình 18 inch 4K Mini-LED 120Hz chuẩn rạp chiếu phim và hệ thống tản nhiệt buồng hơi cỡ đại.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, 5.8GHz)\",\"ram\":\"128GB DDR5 5600MHz (4 khe RAM)\",\"storage\":\"4TB (2x 2TB PCIe Gen 5x4 SSD RAID 0)\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP, MSI OverBoost Ultra 270W)\",\"display\":\"18.0 inch 4K (3840 x 2400) 120Hz Mini-LED, 100% DCI-P3, HDR 1000\",\"weight\":\"3.60 Kg\"}",
  "avgRating": 5,
  "reviewCount": 39,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-legiongo-z1e-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-modern-14s-ai-plus-g3mg-050vn-01-fb3d30d4-9ab2-4a61-92c6-4849dd89a997.jpg?v=1781494357427", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-titan18-4090",
      "productId": "prod-msi-2",
      "sku": "MSI-TITAN-18HX-I9-128G-4090",
      "name": "Core Black • i9-14900HX • 128GB • 4TB • RTX 4090",
      "color": "Đen Nguyên Bản (Core Black)",
      "storage": "4TB SSD",
      "ram": "128GB",
      "price": 149990000,
      "compareAtPrice": 159990000,
      "costPrice": 132000000,
      "stock": 5,
      "serials": [
        "TITAN18-01",
        "TITAN18-02"
      ]
    }
  ]
},
  {
  "id": "prod-msi-3",
  "name": "Laptop Gaming MSI Raider GE78 HX Core i9-14900HX (32GB DDR5 / 2TB / RTX 4080 / QHD+ 240Hz / Thanh LED Matrix)",
  "slug": "laptop-msi-raider-ge78-hx",
  "shortDesc": "Dải đèn LED Matrix Aurora mặt trước độc nhất, Tản nhiệt Cooler Boost 5 2 quạt 6 ống dẫn nhiệt, Hệ thống 6 loa Dynaudio đỉnh cao.",
  "description": "MSI Raider GE78 HX được thiết kế cho những game thủ yêu thích phong cách tương lai Cyberpunk với dải đèn LED ma trận rực rỡ và hiệu năng đồ họa cực khủng từ RTX 4080.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX\",\"ram\":\"32GB DDR5 5600MHz\",\"storage\":\"2TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4080 12GB (175W TGP)\",\"display\":\"17.0 inch QHD+ (2560 x 1600) 240Hz 100% DCI-P3\",\"weight\":\"3.10 Kg\"}",
  "avgRating": 4.9,
  "reviewCount": 41,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-titan18-4090-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-modern-14s-ai-plus-g3mg-050vn-02.jpg?v=1781494357427", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-raider-ge78",
      "productId": "prod-msi-3",
      "sku": "MSI-RAIDER-GE78-I9-32G-4080",
      "name": "Core Black • i9-14900HX • 32GB • 2TB • RTX 4080",
      "color": "Đen Đậm (Core Black)",
      "storage": "2TB SSD",
      "ram": "32GB",
      "price": 78990000,
      "compareAtPrice": 84990000,
      "costPrice": 69000000,
      "stock": 12,
      "serials": [
        "GE78-001",
        "GE78-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-4",
  "name": "Laptop Siêu Mỏng MSI Stealth 16 AI Studio Core Ultra 9 185H (32GB / 1TB / RTX 4070 Studio / QHD+ 240Hz / 1.99kg)",
  "slug": "laptop-msi-stealth-16-ai-studio",
  "shortDesc": "Khung vỏ hợp kim Nhôm - Magie siêu nhẹ chỉ 1.99kg và mỏng 19.9mm, Chứng nhận NVIDIA Studio Driver cho sáng tạo nội dung chuyên nghiệp.",
  "description": "MSI Stealth 16 AI Studio là sự giao thoa hoàn mỹ giữa laptop mỏng nhẹ doanh nhân và máy trạm đồ họa RTX 4070, trang bị cụm NPU Intel AI Boost tăng tốc trí tuệ nhân tạo.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, 22 luồng)\",\"ram\":\"32GB DDR5\",\"storage\":\"1TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4070 8GB GDDR6 Studio\",\"display\":\"16.0 inch QHD+ (2560 x 1600) 240Hz 100% DCI-P3\",\"weight\":\"1.99 Kg, Màu Star Blue thanh lịch\"}",
  "avgRating": 4.9,
  "reviewCount": 33,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-raider-ge78-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-crosshair-16-hx-e14wek-076vn-01.jpg?v=1782196819303", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-stealth16-u9",
      "productId": "prod-msi-4",
      "sku": "MSI-STEALTH-16-U9-32G-4070",
      "name": "Star Blue • Ultra 9 • 32GB • 1TB • RTX 4070",
      "color": "Xanh Ánh Sao (Star Blue)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 59990000,
      "compareAtPrice": 64990000,
      "costPrice": 53000000,
      "stock": 15,
      "serials": [
        "ST16-001",
        "ST16-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-5",
  "name": "Laptop Doanh Nhân MSI Prestige 16 AI Evo Core Ultra 7 155H (32GB / 1TB / 4K OLED / Pin 99.9Wh / 1.5kg)",
  "slug": "laptop-msi-prestige-16-ai-evo",
  "shortDesc": "Đạt chuẩn Intel Evo cao cấp, Pin dung lượng khủng 99.9Wh tối đa quy định hàng không, Màn hình 4K OLED siêu mịn, Vỏ nhôm 1.5kg.",
  "description": "MSI Prestige 16 AI Evo thiết kế dành cho các nhà lãnh đạo và chuyên viên với thời lượng pin kỷ lục hơn 16 giờ làm việc, màn hình 4K OLED rực rỡ và cổng kết nối Thunderbolt 4 tốc độ cao.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"32GB LPDDR5\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"16.0 inch 4K (3840 x 2400) OLED 100% DCI-P3 400 nits\",\"weight\":\"1.50 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 25,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-stealth16-u9-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-crosshair-16-hx-e14wek-076vn-02.jpg?v=1782196823137", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-pres16-u7",
      "productId": "prod-msi-5",
      "sku": "MSI-PRESTIGE-16-U7-32G-1T",
      "name": "Stellar Gray • Ultra 7 • 32GB • 1TB • 4K OLED",
      "color": "Xám Tinh Vân (Stellar Gray)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 38990000,
      "compareAtPrice": 42990000,
      "costPrice": 34000000,
      "stock": 20,
      "serials": [
        "P16-001",
        "P16-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-6",
  "name": "Laptop Gaming MSI Cyborg 15 AI Core Ultra 7 155H (16GB / 512GB / RTX 4060 / Vỏ Trong Suốt Cyberpunk)",
  "slug": "laptop-msi-cyborg-15-ai",
  "shortDesc": "Vỏ máy xuyên thấu phong cách viễn tưởng Cyberpunk độc nhất, Bàn phím WASD nổi bật neon, Hiệu năng gaming AI vượt trội.",
  "description": "MSI Cyborg 15 AI sở hữu các chi tiết vỏ trong suốt để lộ linh kiện cơ khí bên trong độc đáo, kết hợp sức mạnh RTX 4060 và chip Core Ultra 7 tối ưu cho game thủ trẻ.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"16GB DDR5 5600MHz\",\"storage\":\"512GB PCIe NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB GDDR6\",\"display\":\"15.6 inch FHD 144Hz IPS\",\"weight\":\"1.98 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 50,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-pres16-u7-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/3a0ae925-fb93-42ca-9671-8961afef66de.png?v=1773382642883", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-cyborg15-u7",
      "productId": "prod-msi-6",
      "sku": "MSI-CYBORG-15-U7-16G-4060",
      "name": "Translucent Black • Ultra 7 • 16GB • 512GB • RTX 4060",
      "color": "Đen Trong Suốt (Translucent Black)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 27490000,
      "compareAtPrice": 29990000,
      "costPrice": 24000000,
      "stock": 30,
      "serials": [
        "CY15-001",
        "CY15-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-7",
  "name": "Laptop Gaming MSI Katana 15 B13V Core i7-13620H (16GB / 1TB / RTX 4050 6GB / 144Hz)",
  "slug": "laptop-msi-katana-15-b13v",
  "shortDesc": "Cảm hứng kiếm sĩ Katana huyền thoại Nhật Bản, Bàn phím 4 vùng RGB phím số tiện lợi, RTX 4050 6GB chơi mượt Valorant, CS2.",
  "description": "MSI Katana 15 B13V là biểu tượng vũ khí sắc bén cho game thủ eSports với tản nhiệt Cooler Boost 5 mạnh mẽ và bàn phím bấm cực nảy.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i7-13620H 10 nhân 16 luồng\",\"ram\":\"16GB DDR5\",\"storage\":\"1TB SSD NVMe\",\"vga\":\"NVIDIA GeForce RTX 4050 6GB (105W)\",\"display\":\"15.6 inch FHD 144Hz IPS Level\",\"weight\":\"2.25 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 46,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-cyborg15-u7-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/62c67d65-9bc6-4619-85c7-303489cc34f2.png?v=1773382642883", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-katana15",
      "productId": "prod-msi-7",
      "sku": "MSI-KATANA-15-I7-16G-4050",
      "name": "Black • i7-13620H • 16GB • 1TB • RTX 4050",
      "color": "Đen Nhám (Black)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 24990000,
      "compareAtPrice": 27990000,
      "costPrice": 21800000,
      "stock": 35,
      "serials": [
        "KAT15-001",
        "KAT15-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-8",
  "name": "Máy Chơi Game Cầm Tay MSI Claw A1M Core Ultra 7 155H (16GB / 512GB / Màn Hình 7 inch FHD 120Hz VRR / Intel XeSS AI)",
  "slug": "may-choi-game-msi-claw-a1m",
  "shortDesc": "Máy chơi game PC cầm tay đầu tiên chạy chip Intel Core Ultra 7, Công nghệ siêu lấy mẫu Intel XeSS, Cần Analog Hall Effect chống trôi.",
  "description": "MSI Claw A1M mở ra kỷ nguyên chơi game di động mới với thiết kế công thái học ôm sát lòng bàn tay, hệ thống tản nhiệt Cooler Boost HyperFlow và pin 53Wh lớn nhất phân khúc.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, NPU AI)\",\"ram\":\"16GB LPDDR5 6400MHz\",\"storage\":\"512GB PCIe 4.0 NVMe SSD\",\"display\":\"7.0 inch FHD (1920 x 1080) IPS 120Hz VRR cảm ứng 500 nits\",\"battery\":\"53WHr, sạc Type-C 65W PD\",\"weight\":\"675 gram\"}",
  "avgRating": 4.8,
  "reviewCount": 38,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-katana15-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-raider-a16-hx-b8wh-031vn-01.jpg?v=1782189565007", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-claw",
      "productId": "prod-msi-8",
      "sku": "MSI-CLAW-A1M-U7-16G-512G",
      "name": "Black • Ultra 7 • 16GB • 512GB • 120Hz VRR",
      "color": "Đen Nhám (Black)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 18990000,
      "compareAtPrice": 21490000,
      "costPrice": 16500000,
      "stock": 25,
      "serials": [
        "CLAW-001",
        "CLAW-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-9",
  "name": "Laptop Máy Trạm Chuyên Nghiệp MSI CreatorPro X18 HX Core i9-14900HX (64GB / 2TB / NVIDIA RTX 3500 Ada 12GB)",
  "slug": "laptop-msi-creatorpro-x18-hx",
  "shortDesc": "Máy trạm di động đạt chuẩn chứng nhận ISV hàng đầu, GPU chuyên nghiệp NVIDIA RTX 3500 Ada 12GB ECC, Màn hình 18 inch 4K Mini-LED.",
  "description": "MSI CreatorPro X18 HX dành riêng cho các kỹ sư kiến trúc, thiết kế mô hình 3D SolidWorks, mô phỏng ô tô và xử lý AI với độ chính xác và tính toàn vẹn dữ liệu tuyệt đối.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX 24 nhân 32 luồng\",\"ram\":\"64GB DDR5 ECC (nâng cấp tối đa 192GB)\",\"storage\":\"2TB NVMe PCIe 5.0 SSD\",\"vga\":\"NVIDIA RTX 3500 Ada Generation 12GB GDDR6 ECC\",\"display\":\"18.0 inch 4K Mini-LED 120Hz 100% DCI-P3\",\"weight\":\"3.60 Kg\"}",
  "avgRating": 5,
  "reviewCount": 18,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-msi-claw-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-raider-a16-hx-b8wh-031vn-02.jpg?v=1782189566623", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-creatorx18",
      "productId": "prod-msi-9",
      "sku": "MSI-CREATORPRO-X18-I9-64G",
      "name": "Lunar Gray • i9-14900HX • 64GB • 2TB • RTX 3500 Ada",
      "color": "Xám Ánh Trăng (Lunar Gray)",
      "storage": "2TB SSD",
      "ram": "64GB",
      "price": 119990000,
      "compareAtPrice": 129000000,
      "costPrice": 104000000,
      "stock": 6,
      "serials": [
        "CPX18-001",
        "CPX18-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-10",
  "name": "Laptop Văn Phòng Mỏng Nhẹ MSI Modern 14 C13M Core i5-1335U (16GB / 512GB / 14 inch FHD IPS / 1.4kg)",
  "slug": "laptop-msi-modern-14-c13m",
  "shortDesc": "Laptop học tập và văn phòng nhỏ gọn 1.4kg, Vỏ nhôm thanh lịch, Bản lề mở phẳng 180 độ tính năng lật màn hình Flip-n-Share.",
  "description": "MSI Modern 14 C13M mang phong cách tối giản thời thượng, hiệu năng ổn định từ vi xử lý Intel Core thế hệ 13 và hành trình phím 1.5mm gõ cực kỳ êm ái.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i5-1335U 10 nhân 12 luồng\",\"ram\":\"16GB DDR4 onboard\",\"storage\":\"512GB M.2 NVMe SSD\",\"display\":\"14.0 inch FHD (1920 x 1080) IPS-Level 300 nits\",\"weight\":\"1.40 Kg, Màu Classic Black\"}",
  "avgRating": 4.8,
  "reviewCount": 52,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-creatorx18-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-stealth-16-ai-plus-b3wg-008vn-01.jpg?v=1778752435383", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-modern14",
      "productId": "prod-msi-10",
      "sku": "MSI-MODERN-14-I5-16G-512G",
      "name": "Classic Black • i5-1335U • 16GB • 512GB",
      "color": "Đen Cổ Điển (Classic Black)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 13990000,
      "compareAtPrice": 15490000,
      "costPrice": 11800000,
      "stock": 45,
      "serials": [
        "MOD14-001",
        "MOD14-002"
      ]
    }
  ]
},
  {
  "id": "prod-logi-3",
  "name": "Máy Chơi Game Cầm Tay Logitech G Cloud Gaming Handheld (Màn 7 inch FHD 60fps / Pin 12 Giờ / Xbox Cloud & GeForce NOW)",
  "slug": "may-choi-game-logitech-g-cloud",
  "shortDesc": "Máy chơi game đám mây cao cấp, Màn hình cảm ứng 7 inch Full HD 60Hz 450 nits, Pin siêu khủng hơn 12 giờ chơi liên tục, Trọng lượng siêu nhẹ chỉ 463g.",
  "description": "Logitech G Cloud đưa trải nghiệm chơi game AAA lên tầm cao mới thông qua công nghệ đám mây Xbox Cloud Gaming và NVIDIA GeForce NOW. Cần điều khiển và nút bấm chuẩn eSports chính xác tuyệt đối.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"screen\":\"7.0 inch IPS Full HD (1920 x 1080) 60Hz 16:9 cảm ứng 450 nits\",\"cpu\":\"Qualcomm Snapdragon 720G\",\"ram\":\"4GB LPDDR4X\",\"storage\":\"64GB UFS (hỗ trợ khe cắm thẻ nhớ microSD mở rộng)\",\"battery\":\"6000mAh, thời lượng pin liên tục hơn 12 giờ, sạc Type-C\",\"weight\":\"463 gram, Tay cầm công thái học siêu nhẹ\"}",
  "avgRating": 4.9,
  "reviewCount": 43,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-modern14-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-khong-day-asus-rog-harpe-ii-extreme-edition-20-90mp04q0-bmua00-02.jpg?v=1780915229743", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-gcloud",
      "productId": "prod-logi-3",
      "sku": "LOGI-G-CLOUD-HANDHELD-WHITE",
      "name": "Trắng Tuyết • Màn 7 inch FHD • Pin 12h",
      "color": "Trắng Tuyết (Snow White)",
      "storage": "64GB",
      "ram": "4GB",
      "price": 8490000,
      "compareAtPrice": 9490000,
      "costPrice": 6900000,
      "stock": 30,
      "serials": [
        "GCLOUD-001",
        "GCLOUD-002"
      ]
    }
  ]
},
  {
  "id": "prod-logi-4",
  "name": "Chuột Công Thái Học Không Dây Logitech MX Master 3S (Cảm Biến 8000 DPI Darkfield / Con Lăn MagSpeed Điện Từ)",
  "slug": "chuot-logitech-mx-master-3s",
  "shortDesc": "Vua chuột văn phòng công thái học, Click chuột siêu êm Quiet Clicks giảm 90% tiếng ồn, Di chuyển mượt mà trên mọi bề mặt kể cả mặt kính trong suốt.",
  "description": "Logitech MX Master 3S là trợ thủ đắc lực nhất cho các lập trình viên, designer và chuyên gia phân tích dữ liệu. Con lăn điện từ MagSpeed cuộn 1000 dòng trong 1 giây.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"sensor\":\"Darkfield độ chính xác cao 8000 DPI\",\"clicks\":\"Quiet Click siêu êm\",\"wheel\":\"MagSpeed điện từ SmartShift tự động chuyển tốc\",\"battery\":\"Pin sạc dùng 70 ngày, sạc nhanh 1 phút dùng 3 giờ\"}",
  "avgRating": 5,
  "reviewCount": 95,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-gcloud-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-gaming-razer-deathadder-essential-107-1b354d6c-b824-4d05-8f2d-510a0270b941.jpg?v=1775012211043", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-mxm3s",
      "productId": "prod-logi-4",
      "sku": "LOGI-MX-MASTER-3S-GRAPHITE",
      "name": "Graphite • 8000 DPI • MagSpeed",
      "color": "Xám Than (Graphite)",
      "price": 2490000,
      "compareAtPrice": 2890000,
      "costPrice": 1950000,
      "stock": 80,
      "serials": [
        "MX3S-001",
        "MX3S-002"
      ]
    }
  ]
},
  {
  "id": "prod-logi-5",
  "name": "Bàn Phím Cơ Không Dây Logitech MX Mechanical Mini (Switch Tactile Quiet / Kết Nối 3 Thiết Bị Easy-Switch)",
  "slug": "ban-phim-logitech-mx-mechanical-mini",
  "shortDesc": "Switch cơ học phím thấp Low Profile bấm êm ái, Đèn nền thông minh tự sáng khi tay đến gần, Kết nối đa nền tảng Windows, macOS, iPadOS.",
  "description": "Logitech MX Mechanical Mini mang lại cảm giác gõ phím cơ đầm chắc và nhanh chóng trong kích thước nhỏ gọn 75%, tối ưu hóa diện tích bàn làm việc hiện đại.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"switch\":\"Tactile Quiet cơ học low profile\",\"battery\":\"Dùng 15 ngày có đèn nền, 10 tháng tắt đèn nền\",\"connectivity\":\"Bluetooth Low Energy & Logi Bolt USB\"}",
  "avgRating": 4.9,
  "reviewCount": 60,
  "category": {
    "id": "cat-4-1",
    "name": "Bàn phím cơ",
    "slug": "ban-phim-co"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-mxm3s-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-asus-rog-falchion-ace-75-he-rog-hfx-v2x-sw-02.jpg?v=1790744869070", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-mxmech",
      "productId": "prod-logi-5",
      "sku": "LOGI-MX-MECH-MINI-TACTILE",
      "name": "Graphite • Tactile Quiet • 75% Layout",
      "color": "Xám Đen (Graphite)",
      "price": 3290000,
      "compareAtPrice": 3690000,
      "costPrice": 2650000,
      "stock": 50,
      "serials": [
        "MXMECH-01",
        "MXMECH-02"
      ]
    }
  ]
},
  {
  "id": "prod-logi-6",
  "name": "Tai Nghe Gaming Không Dây Logitech G Pro X 2 LIGHTSPEED (Màng Loa Graphene 50mm / Pin 50 Giờ)",
  "slug": "tai-nghe-logitech-g-pro-x-2-lightspeed",
  "shortDesc": "Màng loa Graphene 50mm đầu tiên trên thế giới cho âm thanh chuẩn xác đến từng tiếng bước chân, Công nghệ LIGHTSPEED 2.4GHz không độ trễ.",
  "description": "Tai nghe gaming thi đấu đỉnh cao được các game thủ eSports hàng đầu thế giới tin dùng. Micro rời 6mm công nghệ lọc âm Blue VO!CE mang lại giọng nói trong trẻo tuyệt đối.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"driver\":\"Graphene 50mm tái tạo âm thanh không biến dạng\",\"battery\":\"50 giờ chơi liên tục, cổng sạc Type-C\",\"weight\":\"345 gram, Đệm tai cao su non êm ái\"}",
  "avgRating": 5,
  "reviewCount": 54,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-mxmech-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-gaming-razer-blackshark-v2-x-7-1-surround-2.jpg?v=1775012179040", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-gprox2",
      "productId": "prod-logi-6",
      "sku": "LOGI-GPRO-X2-LIGHTSPEED-BLK",
      "name": "Đen Nhám • Màng Loa Graphene 50mm",
      "color": "Đen (Black)",
      "price": 5890000,
      "compareAtPrice": 6590000,
      "costPrice": 4800000,
      "stock": 40,
      "serials": [
        "GPX2-001",
        "GPX2-002"
      ]
    }
  ]
},
  {
  "id": "prod-logi-7",
  "name": "Webcam Chuyên Nghiệp Logitech StreamCam Full HD 60fps (Cổng Type-C / Tự Động Lấy Nét & Phơi Sáng AI)",
  "slug": "webcam-logitech-streamcam-fhd",
  "shortDesc": "Độ phân giải 1080p 60fps siêu mượt, Ống kính thủy tinh cao cấp góc rộng 78 độ, Khả năng xoay chuyển 90 độ quay video dọc TikTok, YouTube Shorts.",
  "description": "Logitech StreamCam sinh ra dành cho các nhà sáng tạo nội dung và streamer chuyên nghiệp với tính năng tự động canh khung hình AI theo khuôn mặt.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"resolution\":\"1080p / 60fps Full HD\",\"focus\":\"Tự động lấy nét và phơi sáng AI thông minh\",\"mic\":\"Micro stereo kép tích hợp màng lọc giảm tiếng ồn\"}",
  "avgRating": 4.8,
  "reviewCount": 41,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-gprox2-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-gaming-razer-blackshark-v2-x-10.jpg?v=1775012179287", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-streamcam",
      "productId": "prod-logi-7",
      "sku": "LOGI-STREAMCAM-FHD-60FPS",
      "name": "Graphite • 1080p 60fps • Type-C",
      "color": "Xám Than (Graphite)",
      "price": 3490000,
      "compareAtPrice": 3990000,
      "costPrice": 2800000,
      "stock": 35,
      "serials": [
        "STRCAM-01",
        "STRCAM-02"
      ]
    }
  ]
},
  {
  "id": "prod-logi-8",
  "name": "Micro Thu Âm Chuyên Nghiệp Logitech Yeti GX Dynamic RGB (Công Nghệ Lọc Âm Blue VO!CE / Đèn Nền LIGHTSYNC)",
  "slug": "micro-logitech-yeti-gx-rgb",
  "shortDesc": "Củ mic Dynamic định hướng supercardioid chống tạp âm bàn phím cơ, Bộ giới hạn analog Smart Audio Lock tránh vỡ tiếng khi hô hào hưng phấn.",
  "description": "Yeti GX mang chất âm phòng thu chuyên nghiệp của huyền thoại Blue Microphone vào thiết kế gaming RGB đậm chất công nghệ cho góc livestream.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"capsule\":\"Dynamic Capsule định hướng Supercardioid\",\"bitrate\":\"24-bit / 96kHz âm thanh phòng thu\",\"lighting\":\"LIGHTSYNC RGB 2 vùng phát sáng\"}",
  "avgRating": 4.9,
  "reviewCount": 36,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-streamcam-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/aeimageframe-52129255-161d1679-9314-4c5b-aef8-8fc2882ef59c.png?v=1767322813063", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-yetigx",
      "productId": "prod-logi-8",
      "sku": "LOGI-YETI-GX-RGB-MIC",
      "name": "Đen Nhám • Dynamic RGB 24-bit",
      "color": "Đen Nhám (Black)",
      "price": 3690000,
      "compareAtPrice": 4190000,
      "costPrice": 2950000,
      "stock": 30,
      "serials": [
        "YETI-001",
        "YETI-002"
      ]
    }
  ]
},
  {
  "id": "prod-logi-9",
  "name": "Tai Nghe Đàm Thoại Không Dây Cao Cấp Logitech Zone Wireless 2 (Chống Ồn Chủ Động ANC 4 Micro AI)",
  "slug": "tai-nghe-logitech-zone-wireless-2",
  "shortDesc": "Khử tiếng ồn 2 chiều Advanced Call Clarity ứng dụng trí tuệ nhân tạo, Chứng nhận Microsoft Teams và Zoom, Đệm tai thoáng khí cả ngày.",
  "description": "Logitech Zone Wireless 2 là giải pháp liên lạc cao cấp nhất cho các giám đốc và chuyên gia làm việc từ xa, lọc sạch 100% tiếng ồn xung quanh của người nói.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"anc\":\"Chống ồn chủ động lai Hybrid ANC\",\"mic\":\"4 micro khử ồn AI lọc âm người nói\",\"battery\":\"Thời gian đàm thoại 15 giờ liên tục khi bật ANC\"}",
  "avgRating": 4.8,
  "reviewCount": 24,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-yetigx-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-razer-hammerhead-v3-wired-earbuds-premium-sound-thx-12.jpg?v=1767322813373", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-zone2",
      "productId": "prod-logi-9",
      "sku": "LOGI-ZONE-WIRELESS-2-ANC",
      "name": "Graphite • Hybrid ANC • AI Mic",
      "color": "Xám Than (Graphite)",
      "price": 6990000,
      "compareAtPrice": 7790000,
      "costPrice": 5700000,
      "stock": 25,
      "serials": [
        "ZONE2-001",
        "ZONE2-002"
      ]
    }
  ]
},
  {
  "id": "prod-logi-10",
  "name": "Đèn Chiếu Sáng Livestream Logitech Litra Glow TrueSoft (Bảo Vệ Mắt / Điều Khiển Qua App G HUB)",
  "slug": "den-logitech-litra-glow-streaming",
  "shortDesc": "Công nghệ ánh sáng TrueSoft cân bằng sắc thái da tự nhiên, Bộ khuếch tán không viền chống chói mỏi mắt, Ngàm gắn màn hình đa khớp xoay 3 chiều.",
  "description": "Logitech Litra Glow mang ánh sáng studio chuyên nghiệp rực rỡ đến bàn làm việc của bạn mà hoàn toàn không gây chói mắt hay nhức mỏi qua hàng giờ livestream liên tục.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"light\":\"TrueSoft LED toàn phổ CRI 93\",\"temp\":\"Nhiệt độ màu tùy chỉnh 2700K - 6500K\",\"power\":\"Cấp nguồn trực tiếp qua cổng USB Type-C\"}",
  "avgRating": 4.8,
  "reviewCount": 37,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-10",
    "name": "Logitech",
    "slug": "logitech"
  },
  "images": [
      { "id": "img-var-zone2-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/gia-treo-tai-nghe-razer-base-station-v2-chroma-black-rc21-01510100-r3m1-c45eede8-b2bf-43cc-88b8-140271bfa348.png?v=1762914517093", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-litra",
      "productId": "prod-logi-10",
      "sku": "LOGI-LITRA-GLOW-LED-USB",
      "name": "Đen • TrueSoft CRI 93 • USB-C",
      "color": "Đen (Black)",
      "price": 1690000,
      "compareAtPrice": 1990000,
      "costPrice": 1350000,
      "stock": 45,
      "serials": [
        "LITRA-001",
        "LITRA-002"
      ]
    }
  ]
},
  {
  "id": "prod-nv-1",
  "name": "Laptop AI Workstation NVIDIA RTX Studio Reference Core i9 (64GB / 2TB / NVIDIA RTX 5000 Ada 16GB / 4K OLED)",
  "slug": "laptop-nvidia-rtx-studio-ai-titan",
  "shortDesc": "Mẫu laptop máy trạm tham chiếu chính hãng NVIDIA, Trang bị GPU chuyên nghiệp RTX 5000 Ada 16GB ECC, Màn hình 4K OLED HDR chuyên dụng cho GenAI.",
  "description": "NVIDIA RTX Studio Reference Laptop được các kỹ sư NVIDIA tối ưu hóa trực tiếp cho các mô hình ngôn ngữ lớn LLM cục bộ, khuếch đại tính toán Tensor Core và xử lý mô phỏng Omniverse thời gian thực.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz ECC\",\"storage\":\"2TB PCIe Gen 5 NVMe SSD (12000 MB/s)\",\"vga\":\"NVIDIA RTX 5000 Ada Generation Laptop GPU 16GB GDDR6 ECC (175W)\",\"display\":\"16.0 inch 4K (3840 x 2400) OLED 120Hz, 100% DCI-P3, Delta E < 1\",\"weight\":\"2.35 Kg, Vỏ nhôm nguyên khối Graphite Gray\"}",
  "avgRating": 5,
  "reviewCount": 26,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-litra-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/thinkpad-e16-gen-3-intel-ct1-03.jpg?v=1784025475583", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-nv-studio",
      "productId": "prod-nv-1",
      "sku": "NVIDIA-STUDIO-REF-I9-RTX5000",
      "name": "Graphite Gray • i9-14900HX • 64GB • 2TB • RTX 5000 Ada",
      "color": "Xám Graphite (Graphite Gray)",
      "storage": "2TB SSD",
      "ram": "64GB",
      "price": 139990000,
      "compareAtPrice": 149000000,
      "costPrice": 122000000,
      "stock": 5,
      "serials": [
        "NVST-001",
        "NVST-002"
      ]
    }
  ]
},
  {
  "id": "prod-nv-2",
  "name": "Laptop Gaming Siêu Cấp Razer Blade 16 Powered by NVIDIA RTX 4090 (i9-14900HX / 32GB / 2TB / Dual-Mode Mini-LED)",
  "slug": "laptop-razer-blade-16-nvidia-rtx4090",
  "shortDesc": "Sức mạnh đồ họa đỉnh cao từ NVIDIA RTX 4090 175W, Màn hình Mini-LED kép chuyển đổi giữa 4K 120Hz và FHD+ 240Hz, Nhôm CNC nguyên khối T6.",
  "description": "Razer Blade 16 kết hợp công nghệ siêu lấy mẫu DLSS 3.5 và tạo khung hình bằng AI của NVIDIA với màn hình Dual-Mode độc nhất thế giới, cho phép chơi game FPS ở 240Hz hoặc làm đồ họa ở chuẩn 4K siêu nét.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i9-14900HX\",\"ram\":\"32GB DDR5 5600MHz\",\"storage\":\"2TB PCIe 4.0 SSD\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)\",\"display\":\"16.0 inch Dual-Mode Mini-LED (UHD+ 120Hz / FHD+ 240Hz), 1000 nits\",\"weight\":\"2.45 Kg, Nhôm CNC Anodized chống vân tay\"}",
  "avgRating": 5,
  "reviewCount": 45,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-nv-studio-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-8-21y8002gvn-01.jpg?v=1792404704437", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-blade16-4090",
      "productId": "prod-nv-2",
      "sku": "RAZER-BLADE16-NV-RTX4090",
      "name": "Matte Black • i9-14900HX • 32GB • 2TB • RTX 4090",
      "color": "Đen Nhám (Matte Black)",
      "storage": "2TB SSD",
      "ram": "32GB",
      "price": 118990000,
      "compareAtPrice": 128000000,
      "costPrice": 104000000,
      "stock": 8,
      "serials": [
        "BLADE16-01",
        "BLADE16-02"
      ]
    }
  ]
},
  {
  "id": "prod-nv-3",
  "name": "Card Màn Hình NVIDIA GeForce RTX 4090 24GB Founders Edition (Bản Gốc Giới Hạn NVIDIA)",
  "slug": "vga-nvidia-geforce-rtx-4090-founders",
  "shortDesc": "Thiết kế quạt hút đẩy đối lưu hai chiều trứ danh của NVIDIA, 16.384 nhân CUDA, 24GB VRAM GDDR6X 384-bit siêu nhanh.",
  "description": "NVIDIA GeForce RTX 4090 Founders Edition là biểu tượng đồ họa tối cao của kiến trúc Ada Lovelace. Vỏ hợp kim đúc nguyên khối màu xám kim loại cùng khả năng render 4K/8K và AI mượt mà tuyệt đối.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"cuda\":\"16.384 CUDA Cores, 512 Tensor Cores thế hệ 4\",\"vram\":\"24GB GDDR6X 384-bit (1008 GB/s)\",\"power\":\"450W (Yêu cầu nguồn 850W+, 1x 16-pin 12VHPWR)\",\"ports\":\"3x DisplayPort 1.4a, 1x HDMI 2.1a\"}",
  "avgRating": 5,
  "reviewCount": 67,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-blade16-4090-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/m2pv-c3-01.jpg?v=1707321628403", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-4090fe",
      "productId": "prod-nv-3",
      "sku": "NVIDIA-RTX-4090-FOUNDERS-24G",
      "name": "Founders Edition • 24GB GDDR6X Nguyên Seal",
      "color": "Xám Kim Loại (Founders Gray)",
      "price": 52990000,
      "compareAtPrice": 56990000,
      "costPrice": 46000000,
      "stock": 12,
      "serials": [
        "4090FE-001",
        "4090FE-002"
      ]
    }
  ]
},
  {
  "id": "prod-nv-4",
  "name": "Card Màn Hình NVIDIA GeForce RTX 4080 SUPER 16GB Founders Edition",
  "slug": "vga-nvidia-geforce-rtx-4080-super-founders",
  "shortDesc": "10.240 nhân CUDA, 16GB VRAM GDDR6X 256-bit tốc độ 23Gbps, Tiết kiệm điện năng vượt trội, Chiến mượt game 4K Ray Tracing.",
  "description": "RTX 4080 SUPER Founders Edition nâng cấp băng thông bộ nhớ và xung nhịp xử lý, đem lại trải nghiệm chơi game 4K đỉnh cao cùng công nghệ DLSS 3 Frame Generation.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"cuda\":\"10.240 Cores, 320 Tensor Cores\",\"vram\":\"16GB GDDR6X 256-bit (736 GB/s)\",\"power\":\"320W\"}",
  "avgRating": 4.9,
  "reviewCount": 48,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-4090fe-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-pcie-nvme-to-usb-3-1-gen2-type-c-orico-m2pv-c3-aluminum-02.jpg?v=1741676575563", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-4080sfe",
      "productId": "prod-nv-4",
      "sku": "NVIDIA-RTX-4080S-FOUNDERS-16G",
      "name": "Founders Edition • 16GB GDDR6X",
      "color": "Xám Kim Loại (Founders Gray)",
      "price": 32990000,
      "compareAtPrice": 35990000,
      "costPrice": 28500000,
      "stock": 18,
      "serials": [
        "4080SFE-01",
        "4080SFE-02"
      ]
    }
  ]
},
  {
  "id": "prod-nv-5",
  "name": "Card Đồ Họa Máy Trạm Chuyên Nghiệp NVIDIA RTX 6000 Ada Generation 48GB GDDR6 ECC",
  "slug": "vga-nvidia-rtx-6000-ada-48gb",
  "shortDesc": "Đỉnh cao card đồ họa workstation, 48GB VRAM ECC tự sửa lỗi, 18.176 nhân CUDA, Tối ưu hóa cho LLM AI Training và Omniverse Enterprise.",
  "description": "NVIDIA RTX 6000 Ada Generation là vũ khí tối thượng cho các trung tâm nghiên cứu AI, xưởng phim kỹ xảo điện ảnh Hollywood và kỹ thuật mô phỏng khí động học công nghiệp.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"cuda\":\"18.176 CUDA Cores, 568 Tensor Cores thế hệ 4\",\"vram\":\"48GB GDDR6 có sửa lỗi ECC (960 GB/s)\",\"power\":\"300W Max TDP (Tản nhiệt lồng sóc Blower chuyên dụng cho rack server)\",\"interface\":\"PCIe 4.0 x16, 4x DisplayPort 1.4a\"}",
  "avgRating": 5,
  "reviewCount": 22,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-4080sfe-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-asus-rog-strix-arion-lite-to-usb-3-2-gen-2-type-c-esd-s1cl-1.png?v=1735232556230", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-rtx6000",
      "productId": "prod-nv-5",
      "sku": "NVIDIA-RTX-6000-ADA-48G",
      "name": "Box Chính Hãng • 48GB GDDR6 ECC",
      "color": "Vàng Đồng & Đen (Gold & Black)",
      "price": 198990000,
      "compareAtPrice": 215000000,
      "costPrice": 175000000,
      "stock": 5,
      "serials": [
        "RTX6000-01",
        "RTX6000-02"
      ]
    }
  ]
},
  {
  "id": "prod-nv-6",
  "name": "Card Màn Hình Chuyên Nghiệp NVIDIA RTX 4000 SFF Ada Generation 20GB GDDR6",
  "slug": "vga-nvidia-rtx-4000-ada-sff-20gb",
  "shortDesc": "Thiết kế nhỏ gọn Small Form Factor chiếm 2 khe mỏng, Công suất chỉ 70W siêu tiết kiệm điện, 20GB VRAM ECC chuyên nghiệp.",
  "description": "RTX 4000 SFF Ada đem lại hiệu năng tính toán AI và đồ họa đáng kinh ngạc trong các thùng máy nhỏ gọn mini-ITX và máy trạm nhỏ hẹp.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cuda\":\"6.144 CUDA Cores\",\"vram\":\"20GB GDDR6 ECC\",\"power\":\"70W (Không cần cấp nguồn phụ)\",\"ports\":\"4x Mini-DisplayPort 1.4a\"}",
  "avgRating": 4.8,
  "reviewCount": 19,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-rtx6000-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-asus-rog-strix-arion-lite-to-usb-3-2-gen-2-type-c-esd-s1cl-01.jpg?v=1741683964380", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-rtx4000sff",
      "productId": "prod-nv-6",
      "sku": "NVIDIA-RTX-4000-SFF-20G",
      "name": "SFF Low Profile • 20GB ECC • 70W",
      "color": "Đen Nhám (Black)",
      "price": 36990000,
      "compareAtPrice": 40990000,
      "costPrice": 32000000,
      "stock": 14,
      "serials": [
        "RTX4000S-01",
        "RTX4000S-02"
      ]
    }
  ]
},
  {
  "id": "prod-nv-7",
  "name": "Thiết Bị Giải Trí Android TV NVIDIA Shield TV Pro 4K HDR (Vi Xử Lý Tegra X1+ / AI Upscaling 4K)",
  "slug": "thiet-bi-nvidia-shield-tv-pro-4k",
  "shortDesc": "Đầu phát Android TV mạnh nhất thế giới, Nâng cấp video lên 4K bằng trí tuệ nhân tạo AI thời gian thực, Hỗ trợ Dolby Vision & Dolby Atmos.",
  "description": "NVIDIA Shield TV Pro biến phòng khách thành rạp chiếu phim tại gia đỉnh cao với khả năng giải mã âm thanh lossless Dolby TrueHD và chơi game đám mây GeForce NOW ở độ phân giải 4K 120fps.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"cpu\":\"NVIDIA Tegra X1+ với GPU NVIDIA 256 nhân\",\"ram\":\"3GB RAM, 16GB bộ nhớ trong (mở rộng USB)\",\"video\":\"4K HDR, Dolby Vision, HDR10, AI Upscaling 4K\",\"audio\":\"Dolby Atmos, DTS-X, DTS-HD MA passthrough\",\"connectivity\":\"Gigabit Ethernet, Wi-Fi AC 2x2 MIMO, 2x USB 3.0\"}",
  "avgRating": 4.9,
  "reviewCount": 62,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-rtx4000sff-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/gia-treo-tai-nghe-razer-base-station-v2-chroma-11.jpg?v=1762914517357", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-shieldtv",
      "productId": "prod-nv-7",
      "sku": "NVIDIA-SHIELD-TV-PRO-4K",
      "name": "Shield Pro • Tegra X1+ • Remote Điều Khiển",
      "color": "Đen (Black)",
      "price": 5490000,
      "compareAtPrice": 6290000,
      "costPrice": 4500000,
      "stock": 40,
      "serials": [
        "SHIELD-001",
        "SHIELD-002"
      ]
    }
  ]
},
  {
  "id": "prod-nv-8",
  "name": "Máy Chủ Tăng Tốc AI NVIDIA L40S 48GB PCIe (Kiến Trúc Ada Lovelace Xử Lý GenAI & LLM)",
  "slug": "server-gpu-nvidia-l40s-48gb",
  "shortDesc": "Card tăng tốc trung tâm dữ liệu data center toàn năng, 48GB VRAM GDDR6 ECC, Hiệu năng suy luận AI Inference nhanh gấp 5 lần thế hệ trước.",
  "description": "NVIDIA L40S là giải pháp máy chủ điện toán GPU phổ quát mạnh mẽ nhất cho các công ty khởi nghiệp AI và trung tâm dữ liệu đám mây để huấn luyện fine-tuning và chạy mô hình Generative AI 24/7.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cuda\":\"18.176 CUDA Cores, 568 Tensor Cores thế hệ 4\",\"vram\":\"48GB GDDR6 ECC (864 GB/s)\",\"power\":\"350W TDP tản nhiệt thụ động chuyên dụng cho máy chủ 2U/4U\"}",
  "avgRating": 5,
  "reviewCount": 15,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-shieldtv-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/bo-ba-fan-case-corsair-rs120-argb-120mm-pwm-black-co-9050181-ww-01.jpg?v=1792666102000", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-l40s",
      "productId": "prod-nv-8",
      "sku": "NVIDIA-L40S-PCIE-48G-SERVER",
      "name": "Enterprise Tray • 48GB ECC Passive",
      "color": "Bạc Server (Silver Server)",
      "price": 249990000,
      "compareAtPrice": 270000000,
      "costPrice": 220000000,
      "stock": 4,
      "serials": [
        "L40S-001",
        "L40S-002"
      ]
    }
  ]
},
  {
  "id": "prod-nv-9",
  "name": "Bộ Kit Nhúng AI Robot & Xe Tự Hành NVIDIA Jetson AGX Orin Developer Kit 64GB (275 TOPS AI)",
  "slug": "kit-nhung-nvidia-jetson-agx-orin-64gb",
  "shortDesc": "Siêu máy tính nhúng AI kích thước bàn tay, Sức mạnh tính toán 275 TOPS AI, Tối ưu cho robot tự hành AMR, thị giác máy tính và drone.",
  "description": "NVIDIA Jetson AGX Orin 64GB mang sức mạnh của siêu máy tính AI vào thiết bị nhúng nhỏ gọn với công suất chỉ 15W - 60W, được hỗ trợ bởi bộ phần mềm NVIDIA Isaac và Metropolis.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"ai\":\"275 TOPS tính toán suy luận AI (INT8)\",\"gpu\":\"2048 nhân NVIDIA Ampere với 64 Tensor Cores\",\"cpu\":\"12 nhân ARM Cortex-A78AE 64-bit\",\"ram\":\"64GB 256-bit LPDDR5 (204.8 GB/s)\",\"storage\":\"64GB eMMC 5.1\"}",
  "avgRating": 5,
  "reviewCount": 20,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-l40s-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/bo-ba-fan-case-corsair-rs120-argb-120mm-pwm-black-co-9050181-ww-02.jpg?v=1792666103290", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-jetson-orin",
      "productId": "prod-nv-9",
      "sku": "NVIDIA-JETSON-AGX-ORIN-64G",
      "name": "Developer Kit Nguyên Seal • 275 TOPS",
      "color": "Đen Nhôm (Black Aluminum)",
      "price": 59990000,
      "compareAtPrice": 65000000,
      "costPrice": 52000000,
      "stock": 10,
      "serials": [
        "ORIN-001",
        "ORIN-002"
      ]
    }
  ]
},
  {
  "id": "prod-nv-10",
  "name": "Card Màn Hình NVIDIA GeForce RTX 4070 Ti SUPER 16GB Founders Edition",
  "slug": "vga-nvidia-geforce-rtx-4070-ti-super-fe",
  "shortDesc": "Nâng cấp lên 16GB VRAM GDDR6X 256-bit rộng rãi, 8.448 nhân CUDA, Giải pháp tối ưu hàng đầu cho màn hình 2K 240Hz và 4K Gaming.",
  "description": "RTX 4070 Ti SUPER đem lại tỷ lệ hiệu năng trên giá thành xuất sắc với dung lượng bộ nhớ đồ họa 16GB lý tưởng cho cả chơi game AAA nặng nhất và render video 4K.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cuda\":\"8.448 CUDA Cores, 264 Tensor Cores\",\"vram\":\"16GB GDDR6X 256-bit (672 GB/s)\",\"power\":\"285W\"}",
  "avgRating": 4.9,
  "reviewCount": 42,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-6",
    "name": "NVIDIA",
    "slug": "nvidia"
  },
  "images": [
      { "id": "img-var-jetson-orin-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-20gbps-asus-tuf-gaming-a2-a2-blk-g-as-01.jpg?v=1743743002217", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-4070tisfe",
      "productId": "prod-nv-10",
      "sku": "NVIDIA-RTX-4070TI-SUPER-FE",
      "name": "Founders Edition • 16GB GDDR6X",
      "color": "Xám Kim Loại (Founders Gray)",
      "price": 24990000,
      "compareAtPrice": 27490000,
      "costPrice": 21500000,
      "stock": 22,
      "serials": [
        "4070TIS-01",
        "4070TIS-02"
      ]
    }
  ]
},
  {
  "id": "prod-samsung-laptop-4",
  "name": "Laptop Samsung Galaxy Book3 360 Core i5-1335U (16GB / 512GB / Màn AMOLED Cảm Ứng S-Pen 2-in-1)",
  "slug": "laptop-samsung-galaxy-book3-360",
  "shortDesc": "Bản lề xoay gập 360 độ, Màn hình Super AMOLED cảm ứng đa điểm hỗ trợ bút S-Pen, Trọng lượng siêu nhẹ chỉ 1.16kg.",
  "description": "Galaxy Book3 360 kết hợp giữa sự cơ động của máy tính bảng và sức mạnh của laptop mỏng nhẹ. Màn hình AMOLED sống động cho góc nhìn rộng và màu sắc rực rỡ chuẩn điện ảnh.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i5-1335U (10 nhân, 12 luồng, Turbo 4.6GHz)\",\"ram\":\"16GB LPDDR4X onboard\",\"storage\":\"512GB PCIe NVMe SSD\",\"display\":\"13.3 inch FHD Super AMOLED Touch 120% DCI-P3 kèm bút S-Pen\",\"weight\":\"1.16 Kg, Vỏ nhôm màu Graphite\"}",
  "avgRating": 4.8,
  "reviewCount": 32,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-4070tisfe-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-8-21y8002gvn-02.jpg?v=1792404705277", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-gb3-360",
      "productId": "prod-samsung-laptop-4",
      "sku": "SAMSUNG-GB3-360-I5-16G-512G",
      "name": "Graphite • i5-1335U • 16GB • 512GB • S-Pen",
      "color": "Xám Than (Graphite)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 21990000,
      "compareAtPrice": 24990000,
      "costPrice": 18500000,
      "stock": 25,
      "serials": [
        "GB3-360-01",
        "GB3-360-02"
      ]
    }
  ]
},
  {
  "id": "prod-asus-laptop-7",
  "name": "Laptop ASUS ProArt P16 Studio OLED H7606 Core Ultra 9 185H (32GB / 1TB / RTX 4070 / 4K OLED 120Hz Touch)",
  "slug": "laptop-asus-proart-p16-studio-oled",
  "shortDesc": "Máy trạm đồ họa chuyên nghiệp cho Creator, Núm xoay cơ học vật lý ASUS DialPad tích hợp trên touchpad, RTX 4070 Studio 105W.",
  "description": "ASUS ProArt P16 Studio OLED được sinh ra cho các đạo diễn hình ảnh, kiến trúc sư và nhà thiết kế 3D. Núm xoay ảo DialPad độc quyền điều khiển mượt mà trong Photoshop, Premiere và After Effects.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, NPU AI)\",\"ram\":\"32GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe Gen 4.0 NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4070 8GB GDDR6 (NVIDIA Studio Driver)\",\"display\":\"16.0 inch 4K (3840 x 2400) Lumina OLED 120Hz Touch, 100% DCI-P3, Delta E < 1\",\"weight\":\"1.85 Kg, Vỏ nhôm Nano Black chống bám bẩn\"}",
  "avgRating": 5,
  "reviewCount": 28,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-gb3-360-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-strix-g16-g614pm-ts147w-01.jpg?v=1789616369243", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-proart-p16",
      "productId": "prod-asus-laptop-7",
      "sku": "ASUS-PROART-P16-U9-32G-4070",
      "name": "Nano Black • Ultra 9 • 32GB • 1TB • RTX 4070",
      "color": "Đen Nano (Nano Black)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 64990000,
      "compareAtPrice": 69990000,
      "costPrice": 56000000,
      "stock": 10,
      "serials": [
        "PROART-001",
        "PROART-002"
      ]
    }
  ]
},
  {
  "id": "prod-asus-laptop-8",
  "name": "Laptop Doanh Nhân ASUS ExpertBook B9 OLED B9403 Core i7-1355U vPro (32GB / 1TB / Mỏng 990g)",
  "slug": "laptop-asus-expertbook-b9-oled",
  "shortDesc": "Laptop doanh nhân 14 inch OLED nhẹ nhất thế giới chỉ 990 gram, Hợp kim Magie - Liti cao cấp, Chuẩn bảo mật sinh trắc học và TPM 2.0.",
  "description": "ExpertBook B9 OLED là biểu tượng sang trọng cho các giám đốc điều hành với trọng lượng nhẹ hơn 1kg nhưng thời lượng pin bền bỉ cả ngày dài và màn hình OLED 16:10 rực rỡ.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cpu\":\"Intel Core i7-1355U vPro Enterprise 10 nhân\",\"ram\":\"32GB LPDDR5\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"14.0 inch 2.8K (2880 x 1800) OLED 90Hz, 100% DCI-P3 400 nits\",\"weight\":\"990 gram, Khung hợp kim Magie - Liti\"}",
  "avgRating": 4.9,
  "reviewCount": 30,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-proart-p16-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-asus-rog-strix-g16-g614pm-ts147w-02.jpg?v=1789616370363", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-expertbook-b9",
      "productId": "prod-asus-laptop-8",
      "sku": "ASUS-EXPERTB9-I7-32G-1T-OLED",
      "name": "Star Black • i7 vPro • 32GB • 1TB • 990g",
      "color": "Đen Ánh Sao (Star Black)",
      "storage": "1TB SSD",
      "ram": "32GB",
      "price": 45990000,
      "compareAtPrice": 49990000,
      "costPrice": 39500000,
      "stock": 15,
      "serials": [
        "EXPB9-001",
        "EXPB9-002"
      ]
    }
  ]
},
  {
  "id": "prod-msi-laptop-10",
  "name": "Laptop Gaming MSI Sword 16 HX B14V Core i7-14700HX (16GB / 1TB / RTX 4060 115W / 144Hz)",
  "slug": "laptop-msi-sword-16-hx-b14v",
  "shortDesc": "Bàn phím RGB 24 vùng rực rỡ, CPU Core i7 dòng HX hiệu năng máy bàn 20 nhân, Khung máy thiết kế góc cạnh phong cách thanh kiếm chiến binh.",
  "description": "MSI Sword 16 HX mang đến sức mạnh chiến game mượt mà với vi xử lý Intel Core i7-14700HX và card đồ họa RTX 4060, hệ thống tản nhiệt 5 ống đồng tối ưu.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i7-14700HX (20 nhân, 28 luồng, Turbo 5.5GHz)\",\"ram\":\"16GB DDR5 5600MHz\",\"storage\":\"1TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB GDDR6 (115W TGP)\",\"display\":\"16.0 inch FHD+ (1920 x 1200) 144Hz IPS\",\"weight\":\"2.30 Kg, Màu Cosmos Gray\"}",
  "avgRating": 4.8,
  "reviewCount": 35,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-expertbook-b9-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-msi-stealth-16-ai-plus-b3wg-008vn-02.jpg?v=1778752436343", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-sword16",
      "productId": "prod-msi-laptop-10",
      "sku": "MSI-SWORD-16HX-I7-16G-4060",
      "name": "Cosmos Gray • i7-14700HX • 16GB • 1TB • RTX 4060",
      "color": "Xám Vũ Trụ (Cosmos Gray)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 31990000,
      "compareAtPrice": 34990000,
      "costPrice": 27500000,
      "stock": 25,
      "serials": [
        "SWD16-001",
        "SWD16-002"
      ]
    }
  ]
},
  {
  "id": "prod-intel-laptop-6",
  "name": "Laptop Intel NUC M15 EVO Core i5-1240P (16GB / 512GB SSD / 15.6 inch Touch IPS 100% sRGB)",
  "slug": "laptop-intel-nuc-m15-evo-i5",
  "shortDesc": "Đạt chuẩn Intel EVO, Vỏ nhôm nguyên khối siêu mỏng 14.9mm, Màn hình cảm ứng 15.6 inch IPS 100% sRGB, Pin 16 giờ.",
  "description": "Phiên bản Intel Core i5 của dòng laptop chuẩn mực Intel NUC M15 EVO đem lại hiệu năng ổn định, pin cực trâu và thiết kế tinh tế với mức giá tiết kiệm.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i5-1240P 12 nhân 16 luồng\",\"ram\":\"16GB LPDDR5\",\"storage\":\"512GB NVMe PCIe 4.0 SSD\",\"display\":\"15.6 inch FHD Touch IPS 100% sRGB\",\"weight\":\"1.65 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 31,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-7",
    "name": "Intel",
    "slug": "intel"
  },
  "images": [
      { "id": "img-var-sword16-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-7-21u2006gva-01.jpg?v=1789117809290", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-intel-m15-i5",
      "productId": "prod-intel-laptop-6",
      "sku": "INTEL-NUC-M15-I5-16G-512G",
      "name": "Midnight Black • i5-1240P • 16GB • 512GB • Touch",
      "color": "Đen Bóng Đêm (Midnight Black)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 15490000,
      "compareAtPrice": 17990000,
      "costPrice": 12500000,
      "stock": 35,
      "serials": [
        "M15I5-001",
        "M15I5-002"
      ]
    }
  ]
},
  {
  "id": "prod-intel-laptop-7",
  "name": "Laptop Gaming Intel NUC X15 King County Core i7-12700H (16GB / 512GB / RTX 3060 130W / QHD 165Hz)",
  "slug": "laptop-gaming-intel-nuc-x15-3060",
  "shortDesc": "Vỏ hợp kim Magie siêu nhẹ 1.99kg, Bàn phím cơ quang học RGB per-key, Màn hình QHD 165Hz độ trễ thấp 3ms.",
  "description": "Intel NUC X15 phiên bản RTX 3060 công suất cao 130W là lựa chọn hàng đầu cho các giải đấu eSports với khung máy siêu nhẹ và bàn phím cơ quang học phản hồi 0.2ms.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i7-12700H 14 nhân\",\"ram\":\"16GB DDR5 4800MHz\",\"storage\":\"512GB PCIe 4.0 SSD\",\"vga\":\"NVIDIA GeForce RTX 3060 6GB (130W)\",\"display\":\"15.6 inch QHD 165Hz IPS\",\"weight\":\"1.99 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 38,
  "category": {
    "id": "cat-1-1",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming"
  },
  "brand": {
    "id": "b-7",
    "name": "Intel",
    "slug": "intel"
  },
  "images": [
      { "id": "img-var-intel-m15-i5-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-7-21u2006gva-02.jpg?v=1789117809290", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-intel-x15-3060",
      "productId": "prod-intel-laptop-7",
      "sku": "INTEL-NUC-X15-I7-16G-512G-3060",
      "name": "Matte Black • i7-12700H • 16GB • 512GB • RTX 3060",
      "color": "Đen Nhám (Matte Black)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 23990000,
      "compareAtPrice": 26990000,
      "costPrice": 19800000,
      "stock": 30,
      "serials": [
        "X15-3060-01",
        "X15-3060-02"
      ]
    }
  ]
},
  {
  "id": "prod-intel-laptop-8",
  "name": "Laptop Doanh Nghiệp Intel NUC P14E Core i7-1260P vPro (16GB / 512GB / 1.3kg / Bảo Mật e-Shield)",
  "slug": "laptop-intel-nuc-p14e-vpro",
  "shortDesc": "Thiết kế chuẩn mực cho văn phòng doanh nghiệp, Nền tảng bảo mật phần cứng Intel vPro Enterprise, Vỏ nhôm nguyên khối 1.3kg.",
  "description": "Intel NUC P14E vPro đem lại sự an tâm tuyệt đối cho các tổ chức và doanh nghiệp với khả năng quản lý từ xa qua mạng AMT, xác thực vân tay và camera IR mở khóa khuôn mặt.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 36,
  "specs": "{\"cpu\":\"Intel Core i7-1260P vPro Enterprise\",\"ram\":\"16GB LPDDR5\",\"storage\":\"512GB PCIe Gen4 SSD\",\"display\":\"14.0 inch FHD+ (1920 x 1200) chống chói 400 nits\",\"weight\":\"1.30 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 22,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-7",
    "name": "Intel",
    "slug": "intel"
  },
  "images": [
      { "id": "img-var-intel-x15-3060-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-7-21sys33p00-11.jpg?v=1774001647137", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-nuc-p14e",
      "productId": "prod-intel-laptop-8",
      "sku": "INTEL-NUC-P14E-I7-16G-512G",
      "name": "Dark Titanium • i7 vPro • 16GB • 512GB",
      "color": "Xám Titan (Dark Titanium)",
      "storage": "512GB SSD",
      "ram": "16GB",
      "price": 24990000,
      "compareAtPrice": 27990000,
      "costPrice": 20500000,
      "stock": 25,
      "serials": [
        "P14E-001",
        "P14E-002"
      ]
    }
  ]
},
  {
  "id": "prod-intel-laptop-9",
  "name": "Laptop 2-trong-1 Intel EVO Reference Flip 14 Touch S-Pen (Core Ultra 7 / 16GB / 1TB / 2.8K OLED)",
  "slug": "laptop-intel-evo-reference-flip-14",
  "shortDesc": "Laptop xoay gập 360 độ chuẩn Intel EVO, Màn hình 2.8K OLED cảm ứng kèm bút Stylus, NPU Intel AI Boost tăng tốc sáng tạo.",
  "description": "Mẫu laptop tham chiếu 2-trong-1 xoay gập linh hoạt do chính Intel thiết kế, tích hợp trọn vẹn sức mạnh trí tuệ nhân tạo NPU và màn hình OLED siêu nét.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB SSD\",\"display\":\"14.0 inch 2.8K OLED Touch 120Hz xoay gập 360 độ\",\"weight\":\"1.32 Kg\"}",
  "avgRating": 4.9,
  "reviewCount": 35,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-7",
    "name": "Intel",
    "slug": "intel"
  },
  "images": [
      { "id": "img-var-nuc-p14e-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-7-21sys33p00-02.jpg?v=1782457270937", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-intel-flip14",
      "productId": "prod-intel-laptop-9",
      "sku": "INTEL-EVO-FLIP14-U7-16G-1T",
      "name": "Silver Ice • Ultra 7 • 16GB • 1TB • 360 Touch",
      "color": "Bạc Băng Giá (Silver Ice)",
      "storage": "1TB SSD",
      "ram": "16GB",
      "price": 32990000,
      "compareAtPrice": 36990000,
      "costPrice": 28000000,
      "stock": 20,
      "serials": [
        "FLIP14-001",
        "FLIP14-002"
      ]
    }
  ]
},
  {
  "id": "prod-intel-laptop-10",
  "name": "Laptop Học Sinh & Sinh Viên Intel Education Classmate Pro (Core i3-1215U / 8GB / 256GB / Chống Rơi Vỡ)",
  "slug": "laptop-intel-education-classmate-pro",
  "shortDesc": "Đạt chuẩn độ bền chống va đập và chống tràn nước bàn phím, Tay cầm tiện lợi, Thời lượng pin 12 giờ cho học tập cả ngày.",
  "description": "Laptop giáo dục bền bỉ của Intel được thiết kế với viền cao su bảo vệ chống rơi từ độ cao 1m, bàn phím chống tràn và camera góc rộng lý tưởng cho học trực tuyến.",
  "status": "active",
  "isFeatured": false,
  "warrantyMonths": 24,
  "specs": "{\"cpu\":\"Intel Core i3-1215U 6 nhân 8 luồng\",\"ram\":\"8GB DDR4\",\"storage\":\"256GB NVMe SSD\",\"display\":\"14.0 inch HD chống chói viền cao su chống sốc\",\"weight\":\"1.45 Kg\"}",
  "avgRating": 4.8,
  "reviewCount": 45,
  "category": {
    "id": "cat-1-2",
    "name": "Laptop Văn phòng & Mỏng nhẹ",
    "slug": "laptop-van-phong"
  },
  "brand": {
    "id": "b-7",
    "name": "Intel",
    "slug": "intel"
  },
  "images": [
      { "id": "img-var-intel-flip14-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-x9-14-gen-1-aura-edition-21qa006fvn-01.jpg?v=1786439574100", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-classmate-pro",
      "productId": "prod-intel-laptop-10",
      "sku": "INTEL-CLASSMATE-I3-8G-256G",
      "name": "Rugged Gray • i3-1215U • 8GB • 256GB",
      "color": "Xám Chống Sốc (Rugged Gray)",
      "storage": "256GB SSD",
      "ram": "8GB",
      "price": 9990000,
      "compareAtPrice": 11500000,
      "costPrice": 7900000,
      "stock": 50,
      "serials": [
        "CLASS-001",
        "CLASS-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-comp-1",
  "name": "Bo Mạch Chủ Lenovo Legion Z790 Pro Gaming (LGA1700 / DDR5 / PCIe 5.0 / WiFi 6E)",
  "slug": "bo-mach-chu-lenovo-legion-z790-pro-gaming",
  "shortDesc": "Socket LGA1700 hỗ trợ Intel Gen 13/14, 4 khe RAM DDR5 7200+ MHz, 3 khe M.2 PCIe Gen 4x4, Tản nhiệt giáp nhôm VRM Coldfront nguyên khối.",
  "description": "Bo mạch chủ chuyên dụng trong dòng máy trạm và gaming Legion Tower của Lenovo. Tụ điện chuẩn quân đội độ bền 100.000 giờ, cấp nguồn số 16+1+1 pha VRM ổn định cho các dòng chip Intel Core i9.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"chipset\":\"Intel Z790 Express\",\"socket\":\"LGA1700 (Hỗ trợ Intel Core Gen 13 & 14)\",\"ram_slots\":\"4x DDR5 DIMM (Tối đa 192GB, 7200+ MHz OC)\",\"expansion\":\"1x PCIe 5.0 x16 bọc thép, 2x PCIe 4.0 x4\",\"storage\":\"3x M.2 NVMe PCIe 4.0, 4x SATA III 6Gb/s\",\"cooling\":\"Giáp tản nhiệt hợp kim nhôm Legion Coldfront VRM\",\"network\":\"2.5GbE LAN Intel Killer + Intel WiFi 6E Bluetooth 5.3\"}",
  "avgRating": 5,
  "reviewCount": 38,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-classmate-pro-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/giga-asus-sata-iii.jpg?v=1556969521253", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-mb-z790",
      "productId": "prod-lenovo-comp-1",
      "sku": "LNV-MB-Z790-LEGION",
      "name": "Legion Matte Black • Chipset Z790 • DDR5",
      "color": "Đen Phủ Nhám (Matte Black)",
      "storage": "3x M.2 Slots",
      "ram": "DDR5 Ready",
      "price": 6890000,
      "compareAtPrice": 7500000,
      "costPrice": 5500000,
      "stock": 25,
      "serials": [
        "LNV-MB-001",
        "LNV-MB-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-comp-2",
  "name": "Nguồn Máy Tính Lenovo Legion 850W 80 Plus Gold Full Modular (ATX 3.0 / PCIe 5.0)",
  "slug": "nguon-may-tinh-lenovo-legion-850w-gold-modular",
  "shortDesc": "Công suất thực 850W đạt chuẩn 80 PLUS Gold hiệu suất 92%, Dây cáp dẹt rời Full Modular, Hỗ trợ đầu cấp nguồn 12VHPWR cho RTX 40 Series.",
  "description": "Bộ nguồn máy tính Legion 850W được kiểm định nghiêm ngặt đạt chuẩn vận hành 24/7 dưới tải cao. Quạt FDB 135mm điều tốc thông minh cực kỳ êm ái.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 60,
  "specs": "{\"wattage\":\"850W Công suất thực liên tục\",\"efficiency\":\"80 Plus Gold (Hiệu suất chuyển đổi 92%)\",\"standard\":\"ATX 3.0 & PCIe 5.0 Ready (Cáp 16-pin 12VHPWR 450W)\",\"modular\":\"Full Modular 100% dây rời bọc lưới cao cấp\",\"fan\":\"135mm Fluid Dynamic Bearing (FDB) siêu êm, chế độ Zero RPM\",\"protection\":\"OVP, UVP, OCP, OTP, SCP, OPP chuẩn công nghiệp\"}",
  "avgRating": 4.9,
  "reviewCount": 42,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-mb-z790-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-ideapad-slim-3-14iph11-83uq003pvn-02.jpg?v=1789531207513", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-psu-850",
      "productId": "prod-lenovo-comp-2",
      "sku": "LNV-PSU-850W-GOLD",
      "name": "Legion Black • 850W • 80 Plus Gold",
      "color": "Đen Chống Nhiễu",
      "storage": "Full Modular",
      "ram": "ATX 3.0",
      "price": 3290000,
      "compareAtPrice": 3800000,
      "costPrice": 2600000,
      "stock": 40,
      "serials": [
        "LNV-PSU-001",
        "LNV-PSU-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-comp-3",
  "name": "Ổ Cứng SSD M.2 NVMe Lenovo Legion Gen 4x4 2TB (Đọc 7.400 MB/s - Ghi 6.800 MB/s)",
  "slug": "o-cung-ssd-lenovo-legion-2tb-nvme-pcie-gen4",
  "shortDesc": "Giao thức PCIe Gen 4x4 NVMe 2.0, Chip nhớ 3D TLC NAND cao cấp, Tản nhiệt nhôm tản nhiệt thụ động giảm 15°C khi chơi game nặng.",
  "description": "Ổ cứng thể rắn tốc độ cực cao dành cho các hệ thống máy trạm Legion và game thủ chuyên nghiệp. Độ bền ghi lên đến 1400 TBW và công nghệ mã hóa dữ liệu phần cứng.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 60,
  "specs": "{\"capacity\":\"2TB (2000GB) Dung lượng khả dụng\",\"interface\":\"M.2 2280 PCIe Gen 4.0 x4, NVMe 2.0\",\"read_speed\":\"Lên đến 7.400 MB/s\",\"write_speed\":\"Lên đến 6.800 MB/s\",\"endurance\":\"1.400 TBW, MTBF 1.800.000 giờ\",\"heatsink\":\"Tấm giáp hợp kim nhôm tản nhiệt nguyên khối\"}",
  "avgRating": 5,
  "reviewCount": 56,
  "category": {
    "id": "cat-3-3",
    "name": "RAM & Ổ cứng SSD",
    "slug": "ram-ssd"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-psu-850-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-3-21sr00a6va-01-b38842e2-5e40-4378-bc79-e8e8c448eee8.jpg?v=1776224029673", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-ssd-2tb",
      "productId": "prod-lenovo-comp-3",
      "sku": "LNV-SSD-2TB-GEN4",
      "name": "Black Heatsink • 2TB • PCIe 4.0 7400MB/s",
      "color": "Đen Giáp Kim Loại",
      "storage": "2TB",
      "ram": "DRAM Cache 2GB",
      "price": 3890000,
      "compareAtPrice": 4500000,
      "costPrice": 3100000,
      "stock": 50,
      "serials": [
        "LNV-SSD-001",
        "LNV-SSD-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-comp-4",
  "name": "Bộ Nhớ RAM Máy Tính Lenovo Legion DDR5 32GB (2x16GB) 6000MHz CL30 RGB",
  "slug": "ram-lenovo-legion-ddr5-32gb-6000mhz-rgb",
  "shortDesc": "Kit 2 thanh 16GB DDR5 tốc độ cao 6000MHz, Độ trễ cực thấp CL30-36-36-76, Hỗ trợ Intel XMP 3.0 & AMD EXPO một chạm.",
  "description": "Bộ nhớ RAM hiệu năng đỉnh cao của Lenovo Legion với dải đèn LED ARGB tương thích Lenovo Vantage Sync. Tấm tản nhiệt nhôm dày 2mm giải nhiệt tức thì.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"capacity\":\"32GB Kit (2x 16GB Dual Channel)\",\"type\":\"DDR5 UDIMM 288-Pin\",\"speed\":\"6000 MHz\",\"latency\":\"CL30 (30-36-36-76) tại 1.35V\",\"profile\":\"Intel XMP 3.0 & AMD EXPO Certified\",\"rgb\":\"Đèn LED ARGB 16.8 triệu màu đồng bộ Lenovo Vantage\"}",
  "avgRating": 4.9,
  "reviewCount": 31,
  "category": {
    "id": "cat-3-3",
    "name": "RAM & Ổ cứng SSD",
    "slug": "ram-ssd"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-ssd-2tb-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-laptop-acer-sd200-16gb-ddr5-5600mhz-1-1v-bl-9bwwa-414-02.jpg?v=1786070431837", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-ram-32g",
      "productId": "prod-lenovo-comp-4",
      "sku": "LNV-RAM-32G-6000",
      "name": "Kit 32GB (2x16GB) • 6000MHz • CL30 RGB",
      "color": "Titanium Black RGB",
      "storage": "32GB Kit",
      "ram": "DDR5 6000MHz",
      "price": 3190000,
      "compareAtPrice": 3650000,
      "costPrice": 2500000,
      "stock": 35,
      "serials": [
        "LNV-RAM-001",
        "LNV-RAM-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-comp-5",
  "name": "Tản Nhiệt Nước AIO CPU Lenovo Legion Coldfront Liquid 360 ARGB",
  "slug": "tan-nhiet-nuoc-cpu-lenovo-legion-coldfront-liquid-360",
  "shortDesc": "Két nước Radiator 360mm dày 27mm, 3 quạt ARGB áp suất tĩnh cao 2.89 mmH2O, Bơm nước thế hệ thứ 7 tốc độ 3.100 RPM tản nhiệt 350W TDP.",
  "description": "Hệ thống tản nhiệt nước AIO cao cấp chuẩn dòng máy tính để bàn Legion Tower 7i. Mặt pump hiển thị LED Legion RGB phát sáng sang trọng.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 60,
  "specs": "{\"radiator_size\":\"360mm nhôm nguyên khối (397 x 120 x 27 mm)\",\"fans\":\"3x 120mm PWM ARGB Fans (500 - 2.200 RPM, 75.3 CFM)\",\"pump\":\"Bơm gốm Ceramic Bearing 3.100 RPM, tuổi thọ 70.000 giờ\",\"compatibility\":\"Intel LGA1700/1851 & AMD AM5/AM4\",\"tdp_capacity\":\"Hỗ trợ tản nhiệt lên đến 350W TDP\"}",
  "avgRating": 5,
  "reviewCount": 45,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-ram-32g-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/transcend-ts500gmts425s.jpg?v=1706929252130", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-aio-360",
      "productId": "prod-lenovo-comp-5",
      "sku": "LNV-AIO-360-ARGB",
      "name": "Legion Dark Edition • Két 360mm • 3 Quạt ARGB",
      "color": "Đen Kim Loại (Legion Dark)",
      "storage": "Radiator 360mm",
      "ram": "350W TDP",
      "price": 3690000,
      "compareAtPrice": 4200000,
      "costPrice": 2900000,
      "stock": 30,
      "serials": [
        "LNV-AIO-001",
        "LNV-AIO-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-comp-6",
  "name": "Card Màn Hình Lenovo Legion GeForce RTX 4070 Ti SUPER 16GB GDDR6X Coldfront OC",
  "slug": "card-man-hinh-lenovo-legion-geforce-rtx-4070-ti-super-16gb",
  "shortDesc": "GPU NVIDIA Ada Lovelace AD103, 16GB GDDR6X 256-bit, 3 Quạt tản nhiệt 9 cánh Legion Coldfront tản nhiệt tối ưu buồng hơi Vapor Chamber.",
  "description": "Phiên bản Card đồ họa xuất xưởng của dòng gaming Legion chuyên biệt cho các cỗ máy chơi game AAA 4K và dựng hình AI. Thiết kế khung giáp kim loại chống uốn cong PCB.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"cuda_cores\":\"8.448 nhân CUDA Cores\",\"vram\":\"16GB GDDR6X 256-bit (21 Gbps, 672 GB/s)\",\"boost_clock\":\"2.655 MHz (Chế độ OC Boost)\",\"ports\":\"3x DisplayPort 1.4a, 1x HDMI 2.1a\",\"power\":\"Yêu cầu nguồn 750W (Cổng 16-pin 12VHPWR)\",\"cooling\":\"3 Quạt 100mm Legion Coldfront Vapor Chamber\"}",
  "avgRating": 5,
  "reviewCount": 39,
  "category": {
    "id": "cat-3-1",
    "name": "Card màn hình (VGA)",
    "slug": "vga-card-man-hinh"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-aio-360-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e16-gen-3-21sr00a6va-07.jpg?v=1776224029673", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-vga-4070ti",
      "productId": "prod-lenovo-comp-6",
      "sku": "LNV-VGA-4070TIS-16G",
      "name": "Legion Edition • RTX 4070 Ti Super • 16GB GDDR6X",
      "color": "Đen Xám Kim Loại",
      "storage": "16GB GDDR6X",
      "ram": "256-bit",
      "price": 23990000,
      "compareAtPrice": 26500000,
      "costPrice": 20500000,
      "stock": 15,
      "serials": [
        "LNV-VGA-001",
        "LNV-VGA-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-comp-1",
  "name": "Bo Mạch Chủ Dell Alienware Aurora Z790 Cryo-Cooling (LGA1700 / DDR5 / PCIe 5.0)",
  "slug": "bo-mach-chu-dell-alienware-aurora-z790-cryo",
  "shortDesc": "Thiết kế riêng cho hệ thống máy trạm Alienware Aurora R16, Chipset Intel Z790, Cấp nguồn số 12 pha DrMOS, Tích hợp cổng quản lý phần cứng e-Shield.",
  "description": "Bo mạch chủ máy trạm cao cấp thuộc hệ sinh thái Dell Alienware với linh kiện bán dẫn đạt chuẩn quân đội Mỹ MIL-STD-810H, hỗ trợ card đồ họa RTX 4090 kích thước lớn.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"chipset\":\"Intel Z790 Enterprise Chipset\",\"socket\":\"LGA1700 hỗ trợ Intel Core Gen 13/14 vPro\",\"ram_slots\":\"2x DDR5 DIMM (Tối đa 64GB 5600MHz XMP)\",\"expansion\":\"1x PCIe 5.0 x16, 2x PCIe 3.0 x4\",\"storage\":\"2x M.2 NVMe PCIe 4.0, 2x SATA 6Gb/s\",\"cooling\":\"Dell Cryo-Chamber thermal heatsink giáp nhôm\"}",
  "avgRating": 4.9,
  "reviewCount": 27,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-lnv-vga-4070ti-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-x9-14-gen-1-aura-edition-21qa006fvn-02.jpg?v=1786439575313", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-mb-z790",
      "productId": "prod-dell-comp-1",
      "sku": "DELL-MB-Z790-ALIEN",
      "name": "Dark Lunar • Chipset Z790 • Chuẩn Aurora",
      "color": "Dark Lunar Grey",
      "storage": "2x M.2 NVMe",
      "ram": "DDR5",
      "price": 7490000,
      "compareAtPrice": 8200000,
      "costPrice": 6000000,
      "stock": 20,
      "serials": [
        "DELL-MB-001",
        "DELL-MB-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-comp-2",
  "name": "Nguồn Máy Tính Dell Alienware 1000W 80 Plus Platinum (ATX 3.0 / PCIe 5.0 12VHPWR)",
  "slug": "nguon-may-tinh-dell-alienware-1000w-platinum",
  "shortDesc": "Công suất liên tục 1000W hiệu suất cực cao 94% Platinum, Cáp 16-pin 12VHPWR 600W nguyên bản, Tụ điện 100% Nhật Bản chịu nhiệt 105°C.",
  "description": "Bộ nguồn máy tính cao cấp chuyên dụng cho các cỗ máy đồ họa kép và hệ thống trí tuệ nhân tạo Deep Learning của Dell Alienware. Vận hành tuyệt đối im lặng với chế độ Silent Fanless dưới tải 40%.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 60,
  "specs": "{\"wattage\":\"1000W Công suất thực liên tục\",\"efficiency\":\"80 PLUS Platinum (Hiệu suất 94%)\",\"standard\":\"ATX 3.0, PCIe Gen 5.0 Native 12VHPWR 600W\",\"capacitors\":\"100% Tụ điện Nhật Bản Nichicon / Rubycon 105°C\",\"fan\":\"Quạt làm mát FDB 140mm Silent Mode\",\"protection\":\"Đầy đủ 8 chế độ bảo vệ nguồn điện cấp máy chủ\"}",
  "avgRating": 5,
  "reviewCount": 34,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-dell-mb-z790-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-zb-120br-argb-pwm-black-120mm-fan-nguoc-01.jpg?v=1754909229873", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-psu-1000",
      "productId": "prod-dell-comp-2",
      "sku": "DELL-PSU-1000W-PLAT",
      "name": "Alienware Platinum • 1000W • ATX 3.0",
      "color": "Lunar Light Grey",
      "storage": "Full Modular",
      "ram": "ATX 3.0",
      "price": 4990000,
      "compareAtPrice": 5600000,
      "costPrice": 3900000,
      "stock": 30,
      "serials": [
        "DELL-PSU-001",
        "DELL-PSU-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-comp-3",
  "name": "Tản Nhiệt Nước CPU Dell Alienware Cryo-Tech 240mm Liquid Cooler",
  "slug": "tan-nhiet-nuoc-cpu-dell-alienware-cryo-tech-240",
  "shortDesc": "Công nghệ làm mát độc quyền Cryo-Tech của Dell Alienware, Radiator 240mm kèm quạt áp suất gió cao 9 lá, Ống dẫn bọc dù chống bay hơi chất làm mát.",
  "description": "Giải pháp làm mát bằng chất lỏng chuyên biệt cho CPU Intel Core i9 và i7. Đế đồng mạ niken siêu phẳng tiếp xúc trực tiếp IHS đảm bảo nhiệt độ luôn duy trì dưới 70°C.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"radiator_size\":\"240mm nhôm cao cấp (277 x 120 x 27 mm)\",\"pump\":\"Bơm Cryo-Tech 2.800 RPM vòng bi từ tính\",\"fans\":\"2x 120mm Alienware High Static Pressure Fans\",\"compatibility\":\"Intel LGA1700 / LGA1200\",\"thermal_capacity\":\"Hỗ trợ CPU công suất lên tới 280W TDP\"}",
  "avgRating": 4.8,
  "reviewCount": 22,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-dell-psu-1000-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-t14-gen-6-21r10003va-01.jpg?v=1766397143970", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-aio-240",
      "productId": "prod-dell-comp-3",
      "sku": "DELL-CRYO-240-AIO",
      "name": "Cryo-Tech 240 • Alienware Edition",
      "color": "Dark Shadow Metallic",
      "storage": "Radiator 240mm",
      "ram": "280W TDP",
      "price": 2990000,
      "compareAtPrice": 3500000,
      "costPrice": 2300000,
      "stock": 25,
      "serials": [
        "DELL-CRYO-001",
        "DELL-CRYO-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-comp-4",
  "name": "Ổ Cứng SSD Máy Trạm Dell Enterprise Class 40 2TB PCIe NVMe M.2",
  "slug": "o-cung-ssd-dell-enterprise-class-40-2tb-pcie",
  "shortDesc": "SSD chuẩn doanh nghiệp cho dòng Dell Precision, Tốc độ đọc ghi ổn định 7.000 MB/s, Bảo vệ mất điện Power Loss Protection (PLP) cấp phần cứng.",
  "description": "Được sản xuất theo tiêu chuẩn máy trạm Dell Precision và Alienware. Tích hợp công nghệ bảo toàn dữ liệu khi cúp điện đột ngột và cảm biến nhiệt độ thông minh e-Shield.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 60,
  "specs": "{\"capacity\":\"2TB (2048GB) Chuẩn Enterprise Class 40\",\"interface\":\"M.2 2280 PCIe Gen 4x4, NVMe 1.4\",\"speed\":\"Đọc 7.000 MB/s, Ghi 6.500 MB/s\",\"reliability\":\"Tích hợp tụ chống mất điện PLP, 2.000 TBW\",\"encryption\":\"Tự mã hóa phần cứng AES-256 Opal 2.0\"}",
  "avgRating": 5,
  "reviewCount": 30,
  "category": {
    "id": "cat-3-3",
    "name": "RAM & Ổ cứng SSD",
    "slug": "ram-ssd"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-dell-aio-240-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-t14-gen-6-21r10003va-02.jpg?v=1766397144743", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-ssd-2tb",
      "productId": "prod-dell-comp-4",
      "sku": "DELL-SSD-2TB-CLASS40",
      "name": "Enterprise Class 40 • 2TB NVMe",
      "color": "Xanh Bảng Mạch Chuẩn Doanh Nghiệp",
      "storage": "2TB",
      "ram": "DRAM Cache 2GB",
      "price": 4290000,
      "compareAtPrice": 4900000,
      "costPrice": 3400000,
      "stock": 35,
      "serials": [
        "DELL-SSD-001",
        "DELL-SSD-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-comp-1",
  "name": "Bo Mạch Chủ ASUS ROG MAXIMUS Z790 DARK HERO (LGA1700 / DDR5 / PCIe 5.0 / WiFi 7)",
  "slug": "bo-mach-chu-asus-rog-maximus-z790-dark-hero",
  "shortDesc": "Socket LGA1700 hỗ trợ Intel Gen 14/13, 20+1+2 tầng công suất nguồn 90A, Màn hình Polymo Lighting ARGB, 5 khe M.2 kèm 1 khe PCIe 5.0 x4.",
  "description": "Bo mạch chủ cờ đầu của ASUS ROG trang bị chuẩn WiFi 7 siêu tốc và công nghệ ép xung thông minh AI Overclocking II, tản nhiệt VRM khổng lồ ống đồng kép.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"chipset\":\"Intel Z790 Chipset\",\"socket\":\"LGA1700\",\"ram\":\"4x DDR5 DIMM up to 8000+ MHz (OC)\",\"pcie\":\"2x PCIe 5.0 x16 SafeSlots\",\"storage\":\"1x PCIe 5.0 M.2 + 4x PCIe 4.0 M.2, 4x SATA 6Gb/s\",\"network\":\"Intel 2.5GbE + WiFi 7 siêu tốc + Bluetooth 5.4\"}",
  "avgRating": 5,
  "reviewCount": 48,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-dell-ssd-2tb-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-zb-120br-argb-pwm-black-120mm-fan-nguoc-03.jpg?v=1754909247863", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-mb-z790",
      "productId": "prod-asus-comp-1",
      "sku": "ASUS-ROG-Z790-DARK",
      "name": "Dark Hero • Z790 • DDR5 • WiFi 7",
      "color": "Dark Hero Black",
      "storage": "5x M.2 Slots",
      "ram": "DDR5 8000+ MHz",
      "price": 18990000,
      "compareAtPrice": 20500000,
      "costPrice": 15500000,
      "stock": 15,
      "serials": [
        "ASUS-MB-001",
        "ASUS-MB-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-comp-2",
  "name": "Nguồn Máy Tính ASUS ROG Thor 1200W Platinum II (Màn hình OLED / PCIe 5.0 16-pin)",
  "slug": "nguon-may-tinh-asus-rog-thor-1200w-platinum-ii",
  "shortDesc": "Công suất thực 1200W chuẩn 80 PLUS Platinum, Tích hợp màn hình OLED hiển thị công suất tiêu thụ thời gian thực, Quạt làm mát Wing-Blade 135mm chống bụi IP5X.",
  "description": "Bộ nguồn danh giá nhất phân khúc Hi-End với tấm tản nhiệt ROG Heatsink nguyên khối tăng diện tích giải nhiệt gấp đôi, chứng nhận âm học Lambda A++ yên tĩnh tuyệt đối.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 120,
  "specs": "{\"wattage\":\"1200W Công suất thực liên tục\",\"efficiency\":\"80 PLUS Platinum (92% tại 50% tải)\",\"oled\":\"Màn hình OLED hiển thị điện năng tiêu thụ Watt trực tiếp\",\"standard\":\"PCIe Gen 5.0 Ready cáp 16-pin 12VHPWR 600W\",\"fan\":\"135mm PWM quạt chống bụi IP5X, 0dB công nghệ dừng quạt\"}",
  "avgRating": 5,
  "reviewCount": 36,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-asus-mb-z790-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-laptop-teamgroup-elite-32gb-ddr5-5600mhz-1x32gb-ted532g5600c46a-s01-01.jpg?v=1792397016273", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-psu-1200",
      "productId": "prod-asus-comp-2",
      "sku": "ASUS-ROG-THOR-1200P2",
      "name": "ROG Thor II • 1200W • OLED Display",
      "color": "Titanium Silver RGB",
      "storage": "Full Modular Cáp Bọc Lưới",
      "ram": "ATX 3.0",
      "price": 9990000,
      "compareAtPrice": 11200000,
      "costPrice": 8200000,
      "stock": 20,
      "serials": [
        "ASUS-THOR-001",
        "ASUS-THOR-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-comp-3",
  "name": "Tản Nhiệt Nước CPU ASUS ROG Ryujin III 360 ARGB (Màn hình LCD 3.5 inch / Bơm Asetek Gen 8)",
  "slug": "tan-nhiet-nuoc-cpu-asus-rog-ryujin-iii-360-argb",
  "shortDesc": "Bơm Asetek thế hệ thứ 8 động cơ 3 pha, Màn hình LCD 3.5 inch 60Hz hiển thị GIF/nhiệt độ CPU/GPU, Quạt nhúng VRM làm mát bo mạch chủ.",
  "description": "Giải pháp làm mát bằng chất lỏng đỉnh cao của ASUS ROG cho phép cá nhân hóa không giới hạn giao diện màn hình LCD, đi kèm 3 quạt ARGB kết nối từ tính nối tiếp Magnetic Daisy-chain gọn gàng.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 72,
  "specs": "{\"radiator_size\":\"360mm nhôm dày (399.5 x 120 x 30 mm)\",\"pump\":\"Asetek 8th Gen 800 - 3600 RPM\",\"lcd\":\"3.5 inch Full Color 60Hz 320x240 pixels\",\"embedded_fan\":\"Quạt 60mm nhúng trong block tản VRM (5100 RPM)\",\"fans\":\"3x 120mm ROG Magnetic Daisy-Chain ARGB Fans\"}",
  "avgRating": 5,
  "reviewCount": 52,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-asus-psu-1200-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/rog-strix-1000p-gaming-13.png?v=1779681088833", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-ryujin-360",
      "productId": "prod-asus-comp-3",
      "sku": "ASUS-RYUJIN-3-360-ARGB",
      "name": "ROG Ryujin III • Radiator 360mm • LCD 3.5 inch",
      "color": "Đen Phủ Nhôm Xước",
      "storage": "Radiator 360mm",
      "ram": "Asetek 8th Gen",
      "price": 9490000,
      "compareAtPrice": 10500000,
      "costPrice": 7800000,
      "stock": 22,
      "serials": [
        "ASUS-RYUJIN-001",
        "ASUS-RYUJIN-002"
      ]
    }
  ]
},
{
  "id": "prod-msi-comp-1",
  "name": "Bo Mạch Chủ MSI MPG Z790 CARBON WIFI (LGA1700 / DDR5 / PCIe 5.0 / Audio ALC4080)",
  "slug": "bo-mach-chu-msi-mpg-z790-carbon-wifi",
  "shortDesc": "Cấp nguồn 19+1+1 pha Duet Rail Power System 105A Smart Power Stage, M.2 Shield Frozr không cần ốc vít, Dải đèn LED Mystic Light sợi carbon độc đáo.",
  "description": "Bo mạch chủ thuộc phân khúc cao cấp của MSI sở hữu lớp giáp sợi carbon cách nhiệt siêu bền, bảng mạch PCB 8 lớp bằng đồng dày 2oz đảm bảo truyền dẫn tín hiệu DDR5 7600+ MHz sạch và ổn định.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"chipset\":\"Intel Z790 Chipset\",\"socket\":\"LGA1700\",\"ram\":\"4x DDR5 DIMM (Tối đa 192GB, 7600+ MHz OC)\",\"pcie\":\"1x PCIe 5.0 x16 bọc thép Steel Armor\",\"storage\":\"1x PCIe 5.0 M.2 + 4x PCIe 4.0 M.2\",\"network\":\"Intel 2.5GbE LAN + WiFi 6E Bluetooth 5.3\"}",
  "avgRating": 4.9,
  "reviewCount": 33,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-asus-ryujin-360-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-za-120br-argb-pwm-black-120mm-fan-nguoc-01.jpg?v=1755258598980", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-mb-carbon",
      "productId": "prod-msi-comp-1",
      "sku": "MSI-MPG-Z790-CARBON",
      "name": "Carbon Black • Z790 • DDR5 • WiFi 6E",
      "color": "Đen Vân Carbon",
      "storage": "5x M.2 Slots",
      "ram": "DDR5 7600+ MHz",
      "price": 11490000,
      "compareAtPrice": 12800000,
      "costPrice": 9300000,
      "stock": 20,
      "serials": [
        "MSI-MB-001",
        "MSI-MB-002"
      ]
    }
  ]
},
{
  "id": "prod-msi-comp-2",
  "name": "Nguồn Máy Tính MSI MEG Ai1300P PCIE5 1300W 80 Plus Platinum Full Modular",
  "slug": "nguon-may-tinh-msi-meg-ai1300p-pcie5-1300w",
  "shortDesc": "Công suất cực đại 1300W chuẩn 80 PLUS Platinum, Chuẩn ATX 3.0 nguyên bản hỗ trợ quá tải xung điện 200%, Cổng mini-USB kết nối phần mềm giám sát MSI Center.",
  "description": "Bộ nguồn số thông minh MEG Ai1300P được tích hợp vi xử lý DSP bên trong theo dõi dòng điện từng miligiây. Cổng 12VHPWR cấp nguồn tối đa 600W sẵn sàng cho RTX 4090.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 120,
  "specs": "{\"wattage\":\"1300W Công suất liên tục (Peak 2600W)\",\"efficiency\":\"80 PLUS Platinum (Hiệu suất 92%)\",\"standard\":\"ATX 3.0 & PCIe 5.0 Cáp 16-pin 12VHPWR 600W\",\"smart_sensor\":\"Cảm biến số DSP đo điện áp và nhiệt độ qua USB\",\"fan\":\"120mm quạt Hydro Dynamic Bearing điều khiển thông minh\"}",
  "avgRating": 5,
  "reviewCount": 29,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-msi-mb-carbon-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-laptop-teamgroup-elite-32gb-ddr5-5600mhz-1x32gb-ted532g5600c46a-s01-02.jpg?v=1792397017533", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-psu-1300",
      "productId": "prod-msi-comp-2",
      "sku": "MSI-MEG-AI1300P",
      "name": "MEG Platinum • 1300W • Giám Sát Kỹ Thuật Số",
      "color": "Đen Vàng Titan MEG",
      "storage": "Full Modular",
      "ram": "ATX 3.0 DSP",
      "price": 8990000,
      "compareAtPrice": 10200000,
      "costPrice": 7300000,
      "stock": 25,
      "serials": [
        "MSI-PSU-001",
        "MSI-PSU-002"
      ]
    }
  ]
},
{
  "id": "prod-msi-comp-3",
  "name": "Tản Nhiệt Nước CPU MSI MAG CORELIQUID E360 ARGB",
  "slug": "tan-nhiet-nuoc-cpu-msi-mag-coreliquid-e360-argb",
  "shortDesc": "Đế đồng tiếp xúc vi kênh siêu nhỏ mở rộng diện tích giải nhiệt, Mặt bơm xoay 270 độ hiển thị nhật thực ARGB, Quạt FDB cánh vân mỏng giảm tối đa tiếng ồn.",
  "description": "Dòng tản nhiệt nước MAG E360 được nâng cấp buồng bơm tách biệt chất làm mát nóng và lạnh nhằm gia tăng tuổi thọ và giữ cho các dòng vi xử lý Intel Core i7/i9 luôn mát mẻ.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"radiator_size\":\"360mm (394 x 119.2 x 27 mm)\",\"pump_speed\":\"3000 RPM (Độ ồn chỉ 20 dBA)\",\"fans\":\"3x 120mm ARGB PWM (600 - 1800 RPM, 75.04 CFM)\",\"block_head\":\"Xoay linh hoạt 270 độ có đèn LED RGB\"}",
  "avgRating": 4.8,
  "reviewCount": 35,
  "category": {
    "id": "cat-3",
    "name": "Linh kiện PC & VGA",
    "slug": "linh-kien-pc"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-msi-psu-1300-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/nguon-may-tinh-asus-rog-strix-gaming-1000p-black-1000w-80-plus-platinum-01.jpg?v=1779698504380", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-e360",
      "productId": "prod-msi-comp-3",
      "sku": "MSI-CORELIQUID-E360",
      "name": "MAG Black • Két 360mm • 3 Quạt ARGB",
      "color": "Đen Nhám (Matte Black)",
      "storage": "Radiator 360mm",
      "ram": "300W TDP",
      "price": 3490000,
      "compareAtPrice": 3950000,
      "costPrice": 2700000,
      "stock": 30,
      "serials": [
        "MSI-E360-001",
        "MSI-E360-002"
      ]
    }
  ]
},
{
  "id": "prod-sam-comp-1",
  "name": "Ổ Cứng SSD Samsung 990 EVO Plus 2TB PCIe Gen 5.0 x2 / Gen 4.0 x4 (7250 MB/s)",
  "slug": "o-cung-ssd-samsung-990-evo-plus-2tb",
  "shortDesc": "Chuẩn giao tiếp lai PCIe 4.0 x4 và PCIe 5.0 x2 tiên tiến, Tiết kiệm điện năng hơn 73% so với thế hệ trước, Tốc độ đọc ngẫu nhiên lên đến 1.050K IOPS.",
  "description": "Phiên bản nâng cấp mới nhất của dòng SSD Samsung EVO trang bị công nghệ V-NAND thế hệ 8 và bộ điều khiển phủ niken chống quá nhiệt thông minh Dynamic Thermal Guard.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 60,
  "specs": "{\"capacity\":\"2TB (2.000GB)\",\"interface\":\"PCIe Gen 4.0 x4 / PCIe Gen 5.0 x2 NVMe 2.0\",\"read_speed\":\"Lên đến 7.250 MB/s\",\"write_speed\":\"Lên đến 6.300 MB/s\",\"endurance\":\"1.200 TBW, Bảo hành 5 năm\",\"encryption\":\"AES 256-bit Full Disk Encryption\"}",
  "avgRating": 5,
  "reviewCount": 64,
  "category": {
    "id": "cat-3-3",
    "name": "RAM & Ổ cứng SSD",
    "slug": "ram-ssd"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-msi-e360-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-laptop-acer-sd200-16gb-ddr5-5600mhz-1-1v-bl-9bwwa-414-01.jpg?v=1786070430743", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-sam-990evo-2tb",
      "productId": "prod-sam-comp-1",
      "sku": "SAM-990-EVO-PLUS-2TB",
      "name": "Samsung 990 EVO Plus • 2TB • PCIe 5.0 Hybrid",
      "color": "Đen Nhãn Kim Loại Tản Nhiệt",
      "storage": "2TB",
      "ram": "Host Memory Buffer (HMB)",
      "price": 3690000,
      "compareAtPrice": 4200000,
      "costPrice": 2900000,
      "stock": 60,
      "serials": [
        "SAM-EVO-001",
        "SAM-EVO-002"
      ]
    }
  ]
},
{
  "id": "prod-sam-comp-2",
  "name": "Bộ Nhớ RAM Máy Tính Samsung DDR5 32GB (1x32GB) 5600MHz Chuyên Dụng Ổn Định 24/7",
  "slug": "ram-samsung-ddr5-32gb-5600mhz-chinh-hang",
  "shortDesc": "Thanh đơn 32GB chuẩn DDR5 5600MHz nguyên bản Samsung hạt nhớ B-Die, Trang bị IC On-Die ECC tự động sửa lỗi dữ liệu, Điện áp cực thấp 1.1V.",
  "description": "Bộ nhớ RAM tiêu chuẩn công nghiệp được sản xuất nguyên bản bởi Samsung Semiconductor. Đây là lựa chọn tin cậy hàng đầu cho các hệ thống máy trạm và máy chủ mini.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 36,
  "specs": "{\"capacity\":\"32GB (1x 32GB Single Module)\",\"type\":\"DDR5 UDIMM 288-pin\",\"speed\":\"5600 MHz (PC5-44800)\",\"voltage\":\"1.1V\",\"ecc\":\"On-Die ECC tự động sửa lỗi bit đơn\"}",
  "avgRating": 4.9,
  "reviewCount": 41,
  "category": {
    "id": "cat-3-3",
    "name": "RAM & Ổ cứng SSD",
    "slug": "ram-ssd"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-sam-990evo-2tb-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-laptop-acer-sd200-16gb-ddr5-5600mhz-1-1v-bl-9bwwa-414-02.jpg?v=1786070431837", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-sam-ram-32g",
      "productId": "prod-sam-comp-2",
      "sku": "SAM-RAM-32G-5600",
      "name": "Samsung Original • 32GB DDR5 • 5600MHz",
      "color": "Xanh Bảng Mạch Samsung Original",
      "storage": "32GB",
      "ram": "DDR5 5600MHz",
      "price": 2490000,
      "compareAtPrice": 2890000,
      "costPrice": 1950000,
      "stock": 45,
      "serials": [
        "SAM-RAM-001",
        "SAM-RAM-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-gear-1",
  "name": "Bàn Phím Cơ Không Dây ASUS ROG Azoth 75% Custom OLED (Gasket Mount / ROG NX Snow)",
  "slug": "ban-phim-co-asus-rog-azoth-75-custom-oled",
  "shortDesc": "Màn hình OLED 2 inch kèm núm xoay đa năng 3 hướng, Đệm lót silicon 3 lớp Gasket Mount gõ cực êm, Switch cơ học bôi trơn sẵn ROG NX Snow.",
  "description": "Bàn phím cơ Custom không dây cao cấp nhất của ASUS ROG. Đi kèm bộ phụ kiện lube switch đầy đủ và 3 chế độ kết nối: ROG SpeedNova 2.4GHz không độ trễ, Bluetooth 5.1 và Type-C.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"layout\":\"75% nhỏ gọn (81 phím)\",\"screen\":\"Màn hình OLED 2 inch đen trắng tùy biến GIF & thông số hệ thống\",\"switch\":\"ROG NX Snow Linear bôi trơn Krytox sẵn từ nhà máy\",\"structure\":\"Gasket Mount với 3 lớp đệm Poron và màng silicon giảm chấn\",\"connectivity\":\"ROG SpeedNova 2.4GHz, Bluetooth 5.1, USB Type-C có dây\",\"battery\":\"Lên đến 2.000 giờ sử dụng (khi tắt màn hình OLED và đèn LED)\"}",
  "avgRating": 5,
  "reviewCount": 42,
  "category": {
    "id": "cat-4-1",
    "name": "Bàn phím cơ",
    "slug": "ban-phim-co"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-sam-ram-32g-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-asus-rog-falchion-ace-75-he-rog-hfx-v2-sw-01-b5df0054-72f6-4a9b-9fd9-eb63ed0f35bd.jpg?v=1790742573200", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-azoth",
      "productId": "prod-asus-gear-1",
      "sku": "ASUS-ROG-AZOTH-OLED",
      "name": "Gunmetal Grey • 75% • Switch ROG NX Snow",
      "color": "Xám Nòng Súng (Gunmetal)",
      "storage": "Hot-swap 5-pin",
      "ram": "Gasket Mount",
      "price": 6490000,
      "compareAtPrice": 7200000,
      "costPrice": 5200000,
      "stock": 30,
      "serials": [
        "ASUS-AZ-001",
        "ASUS-AZ-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-gear-2",
  "name": "Chuột Gaming Không Dây Siêu Nhẹ ASUS ROG Harpe Ace Aim Lab Edition (54g / 36.000 DPI)",
  "slug": "chuot-gaming-asus-rog-harpe-ace-aim-lab",
  "shortDesc": "Trọng lượng siêu nhẹ chỉ 54 gram không cần đục lỗ, Cảm biến quang học ROG AimPoint 36.000 DPI, Công nghệ kết nối ROG SpeedNova 2.4GHz.",
  "description": "Được đồng phát triển cùng các nhà vô địch eSports tại Aim Lab. Tính năng Aim Lab Settings Optimizer đo đạc phong cách ngắm bắn để tự động tinh chỉnh cấu hình chuột hoàn hảo.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"weight\":\"54 gram siêu nhẹ\",\"sensor\":\"ROG AimPoint 36.000 DPI, gia tốc 50G, tốc độ 650 IPS\",\"switch\":\"ROG Micro Switch độ bền 70 triệu lần nhấn\",\"connectivity\":\"Không dây 2.4GHz SpeedNova, Bluetooth, USB-C có dây\",\"battery\":\"Lên đến 90 giờ chơi game liên tục\"}",
  "avgRating": 4.9,
  "reviewCount": 38,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-asus-azoth-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-gaming-razer-deathadder-essential-107.jpg?v=1775012211277", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-harpe-ace",
      "productId": "prod-asus-gear-2",
      "sku": "ASUS-ROG-HARPE-ACE-54G",
      "name": "Black Edition • 54g • 36.000 DPI",
      "color": "Đen Nhám Chống Trượt",
      "storage": "Onboard Memory 5 profiles",
      "ram": "AimPoint Sensor",
      "price": 3490000,
      "compareAtPrice": 3990000,
      "costPrice": 2800000,
      "stock": 35,
      "serials": [
        "ASUS-HARPE-001",
        "ASUS-HARPE-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-gear-3",
  "name": "Tai Nghe Gaming Không Dây ASUS ROG Delta S Animate (Màn hình AniMe Matrix / Quad DAC)",
  "slug": "tai-nghe-gaming-asus-rog-delta-s-animate",
  "shortDesc": "Màn hình LED mini AniMe Matrix tùy biến hoạt ảnh trên củ tai, Chip giải mã âm thanh Hi-Fi ESS 9281 Quad DAC, Micro chống ồn AI thông minh.",
  "description": "Tai nghe gaming đỉnh cao mang lại âm trường định vị không gian 3D chi tiết cho các giải đấu bắn súng chuyên nghiệp. Đệm tai công thái học hình chữ D ôm trọn vành tai êm ái.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"driver\":\"ASUS Essence 50mm nam châm Neodymium\",\"dac\":\"ESS 9281 Pro Quad DAC độ phân giải cao Hi-Res Audio\",\"display\":\"Màn hình LED AniMe Matrix hiển thị sóng âm thanh sống động\",\"mic\":\"Microphone khử ồn thông minh ASUS AI Noise-Canceling Mic\",\"weight\":\"310 gram nhẹ nhàng\"}",
  "avgRating": 5,
  "reviewCount": 29,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-asus-harpe-ace-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-bluetooth-razer-hammerhead-v3-x-hyperspeed-01.jpg?v=1775813917593", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-delta-s",
      "productId": "prod-asus-gear-3",
      "sku": "ASUS-ROG-DELTA-S-ANIMATE",
      "name": "AniMe Matrix • ESS Quad DAC • USB-C",
      "color": "Đen Phủ Mờ Cao Cấp",
      "storage": "Hi-Res Audio Quad DAC",
      "ram": "AniMe Matrix Display",
      "price": 6890000,
      "compareAtPrice": 7800000,
      "costPrice": 5500000,
      "stock": 25,
      "serials": [
        "ASUS-DELTA-001",
        "ASUS-DELTA-002"
      ]
    }
  ]
},
{
  "id": "prod-asus-gear-4",
  "name": "Micro Thu Âm Gaming Chuyên Nghiệp ASUS ROG Carnyx USB (Màng thu Condenser 25mm 192kHz)",
  "slug": "micro-thu-am-gaming-asus-rog-carnyx-usb",
  "shortDesc": "Màng rung tụ điện chuẩn phòng thu 25mm, Tần số lấy mẫu 192kHz / 24-bit phòng thu, Tích hợp bộ lọc âm trầm High-Pass Filter và giá chống sốc kim loại.",
  "description": "Microphone cao cấp sinh ra cho các streamer và caster giải đấu. Núm điều khiển đa chức năng một chạm và công nghệ đèn nền Aura Sync RGB rực rỡ.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"capsule\":\"Màng thu tụ điện Condenser lớn 25mm\",\"bitrate\":\"192 kHz / 24-bit phòng thu âm thanh vòm\",\"pattern\":\"Cardioid đơn hướng định vị giọng nói chính xác\",\"shockmount\":\"Giá treo chống rung kim loại nguyên khối kèm màng lọc pop\",\"mute_button\":\"Cảm ứng chạm một chạm tắt tiếng nhanh với đèn LED báo hiệu\"}",
  "avgRating": 4.9,
  "reviewCount": 25,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-2",
    "name": "ASUS",
    "slug": "asus"
  },
  "images": [
      { "id": "img-var-asus-delta-s-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-bluetooth-razer-hammerhead-v3-x-hyperspeed-02.jpg?v=1775813918827", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-asus-carnyx",
      "productId": "prod-asus-gear-4",
      "sku": "ASUS-ROG-CARNYX-MIC",
      "name": "Studio Black • 192kHz/24-bit • Aura RGB",
      "color": "Đen Kim Loại Nhám",
      "storage": "25mm Condenser Capsule",
      "ram": "High-Pass Filter",
      "price": 4990000,
      "compareAtPrice": 5600000,
      "costPrice": 4000000,
      "stock": 20,
      "serials": [
        "ASUS-CARNYX-001",
        "ASUS-CARNYX-002"
      ]
    }
  ]
},
{
  "id": "prod-apple-gear-1",
  "name": "Bàn Phím Apple Magic Keyboard với Touch ID và Numeric Keypad (USB-C / Màu Đen)",
  "slug": "ban-phim-apple-magic-keyboard-touch-id-numeric-black",
  "shortDesc": "Cảm biến vân tay Touch ID mở khóa máy Mac an toàn, Bàn phím số mở rộng cho công việc tài chính kế toán, Cổng sạc Type-C dệt dù thế hệ mới.",
  "description": "Bàn phím không dây chính hãng Apple mang lại trải nghiệm gõ phím cực kỳ chính xác và êm ái. Pin sạc tích hợp sử dụng liên tục khoảng một tháng hoặc lâu hơn sau mỗi lần sạc đầy.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"security\":\"Cảm biến bảo mật vân tay Touch ID\",\"layout\":\"Full-size kèm cụm phím số Numeric Keypad\",\"connectivity\":\"Bluetooth không dây & Cổng USB-C có dây\",\"battery\":\"Pin sạc Lithium-ion tích hợp dùng hơn 1 tháng\",\"compatibility\":\"Tương thích hoàn hảo macOS và iPadOS\"}",
  "avgRating": 5,
  "reviewCount": 58,
  "category": {
    "id": "cat-4-1",
    "name": "Bàn phím cơ",
    "slug": "ban-phim-co"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-asus-carnyx-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-asus-rog-falchion-ace-75-he-rog-hfx-v2-sw-02.jpg?v=1790742573200", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-app-magic-kb",
      "productId": "prod-apple-gear-1",
      "sku": "APPLE-MAGIC-KB-TOUCHID-BLK",
      "name": "Black Magic • Touch ID • Cáp Dệt Dù USB-C",
      "color": "Đen Không Gian (Space Black)",
      "storage": "Pin sạc hơn 1 tháng",
      "ram": "Touch ID Hardware",
      "price": 4890000,
      "compareAtPrice": 5390000,
      "costPrice": 4000000,
      "stock": 40,
      "serials": [
        "APP-KB-001",
        "APP-KB-002"
      ]
    }
  ]
},
{
  "id": "prod-apple-gear-2",
  "name": "Chuột Apple Magic Mouse Bề Mặt Cảm Ứng Đa Điểm Multi-Touch (USB-C / Màu Đen)",
  "slug": "chuot-apple-magic-mouse-multi-touch-usb-c-black",
  "shortDesc": "Bề mặt kính cảm ứng Multi-Touch vuốt chuyển trang và cuộn tài liệu mượt mà, Thiết kế chân đế trượt nhẹ nhàng trên bàn làm việc, Cổng sạc USB-C hiện đại.",
  "description": "Chuột Magic Mouse không dây hỗ trợ kết nối tự động với máy Mac ngay khi bật nguồn. Trải nghiệm thao tác cảm ứng tự nhiên như màn hình di động.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"touch_surface\":\"Bề mặt Multi-Touch cảm ứng vuốt chạm toàn phần\",\"connectivity\":\"Bluetooth không dây ổn định\",\"charging\":\"Cổng sạc Type-C nhanh chóng\",\"battery\":\"Dùng liên tục khoảng 1 tháng một lần sạc\",\"weight\":\"99 gram cân đối hoàn hảo\"}",
  "avgRating": 4.8,
  "reviewCount": 46,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-app-magic-kb-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-gaming-razer-cobra-rz01-04650100-r3m1-01.jpg?v=1775012833147", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-app-magic-mouse",
      "productId": "prod-apple-gear-2",
      "sku": "APPLE-MAGIC-MOUSE-BLK",
      "name": "Space Black • Multi-Touch • USB-C",
      "color": "Đen Bóng Đậm (Black Glossy)",
      "storage": "Cảm ứng Multi-Touch",
      "ram": "Bluetooth Native",
      "price": 2690000,
      "compareAtPrice": 2990000,
      "costPrice": 2200000,
      "stock": 50,
      "serials": [
        "APP-MOUSE-001",
        "APP-MOUSE-002"
      ]
    }
  ]
},
{
  "id": "prod-apple-gear-3",
  "name": "Tai Nghe Không Dây Apple AirPods Max Cổng Sạc USB-C (Chống Ồn Chủ Động ANC / Spatial Audio)",
  "slug": "tai-nghe-khong-day-apple-airpods-max-usb-c",
  "shortDesc": "Chống ồn chủ động chuyên nghiệp ANC gấp 2 lần, Âm thanh không gian cá nhân hóa Personalized Spatial Audio với tính năng theo dõi chuyển động đầu động, Cổng sạc USB-C.",
  "description": "Tai nghe trùm tai cao cấp bậc nhất của Apple với khung viền thép không gỉ bọc lớp hoàn thiện mịn màng và đệm tai lưới đan thông khí ôm khít giảm áp lực đầu.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"driver\":\"Driver 40mm được thiết kế tùy chỉnh bởi Apple\",\"chip\":\"Chip Apple H1 trên mỗi bên củ tai\",\"anc\":\"Chống ồn chủ động ANC & Chế độ xuyên âm Transparency Mode\",\"battery\":\"Lên đến 20 giờ nghe nhạc khi bật ANC và Spatial Audio\",\"port\":\"Cổng USB-C hỗ trợ truyền dẫn âm thanh Lossless có dây\"}",
  "avgRating": 5,
  "reviewCount": 65,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-1",
    "name": "Apple",
    "slug": "apple"
  },
  "images": [
      { "id": "img-var-app-magic-mouse-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/aeimageframe-55039815.png?v=1767322832893", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-app-airpods-max",
      "productId": "prod-apple-gear-3",
      "sku": "APPLE-AIRPODS-MAX-MIDNIGHT",
      "name": "Midnight Black • USB-C • Lossless Audio",
      "color": "Đêm Xanh Thẳm (Midnight)",
      "storage": "Smart Case bảo vệ pin",
      "ram": "Apple H1 Dual Chips",
      "price": 13990000,
      "compareAtPrice": 15490000,
      "costPrice": 11500000,
      "stock": 30,
      "serials": [
        "APP-MAX-001",
        "APP-MAX-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-gear-1",
  "name": "Bàn Phím Cơ Không Dây Dell Alienware Pro Wireless Gaming Keyboard (Hot-swap / PBT)",
  "slug": "ban-phim-co-dell-alienware-pro-wireless-gaming",
  "shortDesc": "Bàn phím cơ Esports chuẩn thi đấu, Switch cơ tuyến tính Alienware Linear bôi trơn sẵn, Keycap PBT đúc hai lớp Double-shot siêu bền chống bóng phím.",
  "description": "Được thiết kế với sự tư vấn của hơn 100 game thủ chuyên nghiệp thuộc Team Liquid. Tần số phản hồi không dây 1.000Hz và thời lượng pin bền bỉ đến 72 giờ khi bật RGB.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"switch\":\"Alienware Linear Mechanical Switch bôi trơn nhà máy\",\"hot_swap\":\"Hỗ trợ thay nóng switch Hot-swap 5-pin\",\"keycaps\":\"Double-shot PBT chống phai mòn ký tự\",\"connectivity\":\"Alienware 2.4GHz Wireless, Bluetooth 5.1, USB-C\",\"battery\":\"Pin 72 giờ có đèn LED RGB, 798 giờ khi tắt LED\"}",
  "avgRating": 4.9,
  "reviewCount": 28,
  "category": {
    "id": "cat-4-1",
    "name": "Bàn phím cơ",
    "slug": "ban-phim-co"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-app-airpods-max-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-khong-day-asus-rog-azoth-96-he-lite-rog-hfx-v2-sw-01.jpg?v=1790753425797", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-alien-kb",
      "productId": "prod-dell-gear-1",
      "sku": "DELL-ALIEN-PRO-KB",
      "name": "Dark Side of the Moon • Alienware Linear Switch",
      "color": "Xám Đen Không Gian",
      "storage": "Hot-swap Switch",
      "ram": "AlienFX RGB",
      "price": 5290000,
      "compareAtPrice": 5990000,
      "costPrice": 4200000,
      "stock": 25,
      "serials": [
        "DELL-KB-001",
        "DELL-KB-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-gear-2",
  "name": "Chuột Gaming Không Dây Dell Alienware Pro Wireless Mouse (4.000Hz Polling / 26.000 DPI / 60g)",
  "slug": "chuot-gaming-dell-alienware-pro-wireless-mouse",
  "shortDesc": "Tần số quét siêu tốc 4.000Hz Wireless và 8.000Hz có dây, Trọng lượng siêu nhẹ chỉ 60g cân đối, Cảm biến quang học chính xác 26.000 DPI.",
  "description": "Chuột chơi game không dây đẳng cấp thi đấu của Dell Alienware. Chân đế 100% PTFE nguyên chất lướt mượt mà trên mọi loại bàn di chuột mà không gây ma sát.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"polling_rate\":\"4.000Hz Wireless (0.25ms độ trễ) / 8.000Hz Wired\",\"sensor\":\"Cảm biến quang học 26.000 DPI, 650 IPS, gia tốc 50G\",\"switch\":\"Alienware Optical Switch quang học bấm tức thì 70M clicks\",\"weight\":\"60 gram cân đối công thái học đối xứng\",\"battery\":\"Lên tới 120 giờ tại 1.000Hz và 32 giờ tại 4.000Hz\"}",
  "avgRating": 5,
  "reviewCount": 31,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-dell-alien-kb-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-t14s-gen-6-21qx00leva-01-2dd3fb50-d6b2-4da2-bc83-187a27fc1c6b.jpg?v=1776223169063", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-alien-mouse",
      "productId": "prod-dell-gear-2",
      "sku": "DELL-ALIEN-PRO-MOUSE",
      "name": "Alienware Pro • 4000Hz Wireless • 60g",
      "color": "Lunar Light Trắng Kim Loại",
      "storage": "Alienware Command Center",
      "ram": "Optical Switch",
      "price": 3890000,
      "compareAtPrice": 4450000,
      "costPrice": 3100000,
      "stock": 30,
      "serials": [
        "DELL-MOUSE-001",
        "DELL-MOUSE-002"
      ]
    }
  ]
},
{
  "id": "prod-dell-gear-3",
  "name": "Tai Nghe Gaming Không Dây Dell Alienware Dual-Mode Wireless Gaming Headset AW720H",
  "slug": "tai-nghe-gaming-dell-alienware-dual-mode-aw720h",
  "shortDesc": "Âm thanh vòm Dolby Atmos đa hướng, Màng loa Hi-Res 40mm chi tiết, Micro thu âm AI chống ồn dạng cần gạt thụt thò thông minh.",
  "description": "Tai nghe gaming không dây AW720H mang đến sự thoải mái suốt cả ngày dài với đệm tai mút hoạt tính bọc vải thoáng khí và dải đèn LED AlienFX 16.8 triệu màu.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"driver\":\"40mm Hi-Res Certified Neodymium Drivers\",\"audio\":\"Dolby Atmos 3D Spatial Audio Surround\",\"mic\":\"AI Noise-Canceling Microphone có cần gạt thu gọn\",\"battery\":\"Lên đến 30 giờ chơi game, sạc nhanh 15 phút chơi 6 giờ\"}",
  "avgRating": 4.8,
  "reviewCount": 20,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-4",
    "name": "Dell",
    "slug": "dell"
  },
  "images": [
      { "id": "img-var-dell-alien-mouse-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-t14s-gen-6-21qx00leva-02.jpg?v=1776223169063", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-dell-headset",
      "productId": "prod-dell-gear-3",
      "sku": "DELL-ALIEN-AW720H",
      "name": "Lunar Light • Dolby Atmos • 2.4GHz",
      "color": "Trắng Bạc Lunar Light",
      "storage": "Dolby Atmos Audio",
      "ram": "AlienFX Lighting",
      "price": 4690000,
      "compareAtPrice": 5300000,
      "costPrice": 3700000,
      "stock": 22,
      "serials": [
        "DELL-HEAD-001",
        "DELL-HEAD-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-gear-1",
  "name": "Bàn Phím Cơ Chơi Game Lenovo Legion K500 RGB Mechanical Gaming Keyboard",
  "slug": "ban-phim-co-lenovo-legion-k500-rgb",
  "shortDesc": "Switch cơ học đỏ Red Mechanical Switch bấm êm mượt, Đèn nền RGB 16.8 triệu màu theo từng phím, Kê tay rời chống mỏi cổ tay cao cấp.",
  "description": "Thiết kế tối giản và cứng cáp từ Lenovo Legion. Bề mặt nhôm phay xước chống va đập, 100% Anti-ghosting và nhận diện 104 phím cùng lúc không xung đột.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"switch\":\"Red Linear Mechanical Switch 50 triệu lần bấm\",\"key_rollover\":\"104-key rollover 100% Anti-ghosting\",\"wrist_rest\":\"Kê tay nam châm tháo rời công thái học\",\"rgb\":\"RGB 16.8 triệu màu đồng bộ Lenovo Legion Vantage\"}",
  "avgRating": 4.8,
  "reviewCount": 36,
  "category": {
    "id": "cat-4-1",
    "name": "Bàn phím cơ",
    "slug": "ban-phim-co"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-dell-headset-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-khong-day-asus-rog-azoth-96-he-lite-rog-hfx-v2-sw-02.jpg?v=1790753427070", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-k500",
      "productId": "prod-lenovo-gear-1",
      "sku": "LNV-LEGION-K500-RGB",
      "name": "Legion Iron Grey • Red Switch • Kèm Kê Tay",
      "color": "Xám Kim Loại (Iron Grey)",
      "storage": "Bề mặt hợp kim nhôm",
      "ram": "Red Switch",
      "price": 2190000,
      "compareAtPrice": 2590000,
      "costPrice": 1700000,
      "stock": 45,
      "serials": [
        "LNV-KB-001",
        "LNV-KB-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-gear-2",
  "name": "Chuột Gaming Không Dây Lenovo Legion M600s Qi Wireless Gaming Mouse (73g / Sạc Không Dây Qi)",
  "slug": "chuot-gaming-lenovo-legion-m600s-qi-wireless",
  "shortDesc": "Tích hợp công nghệ sạc không dây chuẩn Qi tiện lợi, Trọng lượng siêu nhẹ chỉ 73g, Cảm biến Pixart 3370 19.000 DPI siêu nhạy.",
  "description": "Chuột gaming không dây đẳng cấp của Lenovo Legion hỗ trợ sạc nhanh qua cổng USB-C hoặc đặt lên bàn di chuột sạc không dây Qi. Độ trễ cực thấp dưới 1ms.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"sensor\":\"Pixart PAW3370 19.000 DPI, 400 IPS, gia tốc 50G\",\"charging\":\"Hỗ trợ sạc không dây chuẩn Qi & Sạc nhanh Type-C\",\"switch\":\"Optical Micro-switches độ bền 80 triệu lần nhấn\",\"battery\":\"Lên đến 70 giờ chơi game không dây liên tục\",\"weight\":\"73 gram siêu nhẹ\"}",
  "avgRating": 4.9,
  "reviewCount": 30,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-k500-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-lenovo-thinkpad-e14-gen-6-21m7004wva-01-ebae242d-cfa9-49cb-81ec-aee6750b137a.jpg?v=1774930566137", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-m600s",
      "productId": "prod-lenovo-gear-2",
      "sku": "LNV-LEGION-M600S-QI",
      "name": "Storm Grey • Sạc Không Dây Qi • 73g",
      "color": "Xám Bão (Storm Grey)",
      "storage": "Sạc không dây Qi",
      "ram": "Pixart 3370",
      "price": 2490000,
      "compareAtPrice": 2890000,
      "costPrice": 1950000,
      "stock": 35,
      "serials": [
        "LNV-MOUSE-001",
        "LNV-MOUSE-002"
      ]
    }
  ]
},
{
  "id": "prod-lenovo-gear-3",
  "name": "Tai Nghe Chơi Game Chuyên Nghiệp Lenovo Legion H500 Pro 7.1 Surround Sound",
  "slug": "tai-nghe-gaming-lenovo-legion-h500-pro-71",
  "shortDesc": "Âm thanh vòm vòm 7.1 Surround Sound không cần cài driver, Màng loa 50mm Neodymium tái tạo dải trầm uy lực, Khung thép dẻo không gỉ chịu lực cực tốt.",
  "description": "Tai nghe gaming chuẩn phòng thi đấu của Lenovo Legion với đệm tai bọc da PU mềm mại cách âm thụ động hoàn hảo. Bộ điều khiển âm lượng và mic tích hợp trên dây.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"driver\":\"50mm Dynamic Neodymium Drivers\",\"audio\":\"Âm thanh vòm 7.1 Virtual Surround Sound\",\"mic\":\"Microphone khử ồn có thể gạt thu gọn vào trong củ tai\",\"frame\":\"Khung thép không gỉ siêu bền, đệm đầu giảm áp lực\"}",
  "avgRating": 4.7,
  "reviewCount": 24,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-5",
    "name": "Lenovo",
    "slug": "lenovo"
  },
  "images": [
      { "id": "img-var-lnv-m600s-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-khong-day-razer-blackshark-v3-x-hyperspeed-12.jpg?v=1767322833117", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-lnv-h500",
      "productId": "prod-lenovo-gear-3",
      "sku": "LNV-LEGION-H500-PRO",
      "name": "Iron Grey • 7.1 Surround • Màng Loa 50mm",
      "color": "Xám Kim Loại Legion",
      "storage": "7.1 Surround Controller",
      "ram": "50mm Neodymium",
      "price": 2290000,
      "compareAtPrice": 2690000,
      "costPrice": 1750000,
      "stock": 30,
      "serials": [
        "LNV-HEAD-001",
        "LNV-HEAD-002"
      ]
    }
  ]
},
{
  "id": "prod-msi-gear-1",
  "name": "Bàn Phím Cơ Gaming Siêu Tốc MSI Vigor GK71 Sonic Red Switch",
  "slug": "ban-phim-co-msi-vigor-gk71-sonic-red",
  "shortDesc": "Trang bị switch cơ nhẹ nhất thế giới MSI Sonic Red lực nhấn chỉ 35g, Núm xoay điều khiển âm lượng kép Dual Touch thông minh, Kê tay mút hoạt tính.",
  "description": "Bàn phím cơ cao cấp mang lại phản hồi phím siêu tốc trong các pha giao tranh căng thẳng. Mặt nhôm phay xước chuẩn hàng không và keycap trong suốt MSI ClearCaps.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"switch\":\"MSI Sonic Red siêu nhẹ (Lực nhấn 35g, hành trình 1.9mm)\",\"keycaps\":\"MSI ClearCaps trong suốt xuyên LED rực rỡ\",\"volume_knob\":\"Núm xoay âm lượng thông minh Dual Touch Volume Control\",\"wrist_rest\":\"Kê tay đệm mút hoạt tính Memory Foam êm ái\",\"rgb\":\"RGB Mystic Light từng phím độc lập\"}",
  "avgRating": 4.9,
  "reviewCount": 32,
  "category": {
    "id": "cat-4-1",
    "name": "Bàn phím cơ",
    "slug": "ban-phim-co"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-lnv-h500-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-khong-day-asus-azoth-extreme-edition-20-01.jpg?v=1780911193197", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-gk71",
      "productId": "prod-msi-gear-1",
      "sku": "MSI-VIGOR-GK71-SONIC",
      "name": "Sonic Red • Lực Nhấn 35g • ClearCaps RGB",
      "color": "Đen Phay Nhôm (Aviation Aluminum)",
      "storage": "MSI ClearCaps",
      "ram": "MSI Sonic Red",
      "price": 3290000,
      "compareAtPrice": 3790000,
      "costPrice": 2600000,
      "stock": 30,
      "serials": [
        "MSI-KB-001",
        "MSI-KB-002"
      ]
    }
  ]
},
{
  "id": "prod-msi-gear-2",
  "name": "Chuột Gaming Không Dây MSI Clutch GM51 Lightweight Wireless (26.000 DPI / 85g / Sạc Nhanh)",
  "slug": "chuot-gaming-msi-clutch-gm51-lightweight-wireless",
  "shortDesc": "Cảm biến quang học cao cấp PixArt PAW-3395 26.000 DPI, Công nghệ MSI SWIFTSPEED không dây siêu tốc 1ms, Đế sạc chuột kiêm cổng phát sóng rời tiện dụng.",
  "description": "Được thiết kế công thái học cho người thuận tay phải với các đệm cao su MSI Diamond LightGrip chống trượt tuyệt đối. Pin sạc siêu nhanh 15 phút dùng liên tục 27 giờ.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"sensor\":\"PixArt PAW-3395 26.000 DPI, 650 IPS, 50G\",\"dock\":\"Đi kèm đế sạc rời MSI Charging Dock cao cấp\",\"switch\":\"Omron cơ học 60 triệu lần nhấn\",\"connectivity\":\"MSI SwiftSpeed 2.4GHz, Bluetooth, USB có dây\",\"battery\":\"Lên đến 150 giờ dùng không dây liên tục\"}",
  "avgRating": 4.8,
  "reviewCount": 27,
  "category": {
    "id": "cat-4-2",
    "name": "Chuột Gaming",
    "slug": "chuot-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-msi-gk71-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-gaming-razer-cobra-rz01-04650100-r3m1-2.jpg?v=1775012833383", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-gm51",
      "productId": "prod-msi-gear-2",
      "sku": "MSI-CLUTCH-GM51-WL",
      "name": "Black Diamond • Kèm Đế Sạc Rời • 26.000 DPI",
      "color": "Đen Phủ Diamond LightGrip",
      "storage": "MSI Charging Dock",
      "ram": "Pixart 3395",
      "price": 2890000,
      "compareAtPrice": 3390000,
      "costPrice": 2300000,
      "stock": 35,
      "serials": [
        "MSI-MOUSE-001",
        "MSI-MOUSE-002"
      ]
    }
  ]
},
{
  "id": "prod-msi-gear-3",
  "name": "Tai Nghe Gaming Không Dây MSI Immerse GH50 Wireless (Màng Loa 40mm / Âm Trầm Rung)",
  "slug": "tai-nghe-gaming-msi-immerse-gh50-wireless",
  "shortDesc": "Công nghệ rung haptic theo nhịp điệu tiếng nổ và dải trầm trong game, Màng loa lớn 40mm âm thanh vòm sống động, Gấp gọn thông minh mang đi du đấu.",
  "description": "Tai nghe không dây chuyên nghiệp của MSI tái hiện chân thực mọi hiệu ứng cháy nổ và bước chân kẻ địch trong game FPS. Micro thu âm khử tạp âm lọc gió rõ ràng.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 24,
  "specs": "{\"driver\":\"40mm Neodymium với động cơ phản hồi rung Haptic Bass\",\"wireless\":\"Kết nối 2.4GHz độ trễ siêu thấp không giật lag\",\"foldable\":\"Khung hợp kim có thể gập gọn bỏ vào túi đựng du lịch\",\"battery\":\"Thời lượng pin lên tới 22 giờ liên tục\"}",
  "avgRating": 4.8,
  "reviewCount": 22,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-3",
    "name": "MSI",
    "slug": "msi"
  },
  "images": [
      { "id": "img-var-msi-gm51-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-razer-hammerhead-v3-x-hyperspeed-for-playstation-rz12-05620300-r3a1-01.jpg?v=1784523781633", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-msi-gh50",
      "productId": "prod-msi-gear-3",
      "sku": "MSI-IMMERSE-GH50-WL",
      "name": "Dragon Black • Rung Haptic Bass • Gập Gọn",
      "color": "Đen Rồng MSI",
      "storage": "Haptic Bass Engine",
      "ram": "2.4GHz Wireless",
      "price": 3490000,
      "compareAtPrice": 3990000,
      "costPrice": 2800000,
      "stock": 25,
      "serials": [
        "MSI-HEAD-001",
        "MSI-HEAD-002"
      ]
    }
  ]
},
{
  "id": "prod-sam-gear-1",
  "name": "Tai Nghe Không Dây Samsung Galaxy Buds3 Pro (Âm Thanh Hi-Fi 24bit / Blade Lights / Galaxy AI)",
  "slug": "tai-nghe-khong-day-samsung-galaxy-buds3-pro",
  "shortDesc": "Thiết kế góc cạnh công nghệ cao kèm dải đèn Blade Lights phát sáng, Màng loa 2 chiều độc lập loa trầm và loa bổng phẳng, Khử tiếng ồn thích ứng AI thông minh.",
  "description": "Tai nghe không dây đầu bảng của Samsung với trí tuệ nhân tạo Galaxy AI tự động tinh chỉnh âm thanh theo cấu trúc tai người dùng và tự động chuyển sang chế độ đối thoại khi bạn bắt đầu nói.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"driver\":\"Hệ thống loa kép 2-way: 10.5mm Woofer + 6.1mm Planar Tweeter\",\"audio\":\"Âm thanh chuẩn phòng thu 24-bit / 96kHz SSC Codec\",\"anc\":\"Chống ồn thích ứng thông minh Adaptive ANC & Chế độ Siren/Voice Detect\",\"battery\":\"Lên đến 30 giờ kèm hộp sạc không dây\",\"light\":\"Dải đèn Blade Lights điều khiển cử chỉ chạm vuốt cảm ứng\"}",
  "avgRating": 5,
  "reviewCount": 68,
  "category": {
    "id": "cat-4-3",
    "name": "Tai nghe & Âm thanh",
    "slug": "tai-nghe-gaming"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-msi-gh50-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-razer-hammerhead-v3-x-hyperspeed-for-playstation-rz12-05620300-r3a1-02.jpg?v=1784523783023", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-sam-buds3-pro",
      "productId": "prod-sam-gear-1",
      "sku": "SAM-BUDS3-PRO-SILVER",
      "name": "Bạc Ánh Kim (Silver) • Blade Lights • 24-bit Hi-Fi",
      "color": "Bạc Ánh Kim (Metallic Silver)",
      "storage": "Sạc không dây Qi",
      "ram": "Galaxy AI Audio",
      "price": 5490000,
      "compareAtPrice": 5990000,
      "costPrice": 4400000,
      "stock": 50,
      "serials": [
        "SAM-BUDS-001",
        "SAM-BUDS-002"
      ]
    }
  ]
},
{
  "id": "prod-sam-gear-2",
  "name": "Đế Sạc Không Dây Đa Thiết Bị Samsung Wireless Charger Trio (Sạc Cùng Lúc 3 Thiết Bị 9W)",
  "slug": "de-sac-khong-day-samsung-wireless-charger-trio",
  "shortDesc": "Sạc đồng thời 3 thiết bị (Điện thoại, Đồng hồ Galaxy Watch, Tai nghe Buds), 6 cuộn dây sạc bên trong cho phép đặt thiết bị ở bất kỳ vị trí nào.",
  "description": "Trạm sạc không dây cao cấp gọn gàng cho bàn làm việc công nghệ hiện đại. Đèn LED báo hiệu trạng thái sạc thân thiện tự giảm độ sáng vào ban đêm.",
  "status": "active",
  "isFeatured": true,
  "warrantyMonths": 12,
  "specs": "{\"coils\":\"6 cuộn cảm ứng sạc không điểm mù\",\"devices\":\"Sạc cùng lúc 3 thiết bị (Phone + Watch + Buds)\",\"output\":\"Sạc nhanh chuẩn Qi Fast Wireless Charging 9W\",\"safety\":\"Cảm biến chống quá nhiệt, chống quá áp và phát hiện vật thể lạ FOD\"}",
  "avgRating": 4.8,
  "reviewCount": 35,
  "category": {
    "id": "cat-4",
    "name": "Bàn phím cơ & Gear",
    "slug": "phu-kien-gaming"
  },
  "brand": {
    "id": "b-9",
    "name": "Samsung",
    "slug": "samsung"
  },
  "images": [
      { "id": "img-var-sam-buds3-pro-1", "url": "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ban-phim-co-khong-day-asus-azoth-extreme-edition-20-02.jpg?v=1780911194480", "isThumbnail": true }
    ],
  "variants": [
    {
      "id": "var-sam-trio-charger",
      "productId": "prod-sam-gear-2",
      "sku": "SAM-CHARGER-TRIO-BLK",
      "name": "Midnight Black • 3 Thiết Bị • Sạc Nhanh Qi",
      "color": "Đen Nhám (Matte Black)",
      "storage": "Cáp C to C kèm củ sạc 25W",
      "ram": "Fast Wireless Charging",
      "price": 1890000,
      "compareAtPrice": 2290000,
      "costPrice": 1450000,
      "stock": 40,
      "serials": [
        "SAM-TRIO-001",
        "SAM-TRIO-002"
      ]
    }
  ]
},
];
