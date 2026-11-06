import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu khởi tạo dữ liệu mẫu (Seeding)...");

  // 1. Tạo 3 Tài khoản Admin & Các tài khoản Khách hàng (User)
  const userPasswordHash = await bcrypt.hash("User@123", 10);
  const admin1PasswordHash = await bcrypt.hash("Admin@123", 10);
  const admin2PasswordHash = await bcrypt.hash("Admin@456", 10);
  const admin3PasswordHash = await bcrypt.hash("Admin@789", 10);

  // Admin 1
  await prisma.user.upsert({
    where: { email: "admin1@techcore.vn" },
    update: { password: admin1PasswordHash, role: "admin" },
    create: {
      email: "admin1@techcore.vn",
      phone: "0909111222",
      password: admin1PasswordHash,
      fullName: "Nguyễn Quốc Anh (Super Admin)",
      role: "admin",
      status: "active",
    },
  });

  // Admin 2
  await prisma.user.upsert({
    where: { email: "admin2@techcore.vn" },
    update: { password: admin2PasswordHash, role: "admin" },
    create: {
      email: "admin2@techcore.vn",
      phone: "0909333444",
      password: admin2PasswordHash,
      fullName: "Trần Minh Tuấn (Quản trị Đơn hàng & Kho)",
      role: "admin",
      status: "active",
    },
  });

  // Admin 3
  await prisma.user.upsert({
    where: { email: "admin3@techcore.vn" },
    update: { password: admin3PasswordHash, role: "admin" },
    create: {
      email: "admin3@techcore.vn",
      phone: "0909555666",
      password: admin3PasswordHash,
      fullName: "Lê Hoàng Long (Quản trị Kỹ thuật & Bảo hành)",
      role: "admin",
      status: "active",
    },
  });

  // Giữ lại admin@techcore.vn để tương thích ngược
  await prisma.user.upsert({
    where: { email: "admin@techcore.vn" },
    update: {},
    create: {
      email: "admin@techcore.vn",
      phone: "0909123456",
      password: admin1PasswordHash,
      fullName: "Quản trị viên TechCore",
      role: "admin",
      status: "active",
    },
  });

  // Khách hàng User 1
  const customer = await prisma.user.upsert({
    where: { email: "user1@gmail.com" },
    update: {},
    create: {
      email: "user1@gmail.com",
      phone: "0987654301",
      password: userPasswordHash,
      fullName: "Nguyễn Văn An",
      role: "customer",
      status: "active",
      addresses: {
        create: {
          receiverName: "Nguyễn Văn An",
          phone: "0987654301",
          province: "Hà Nội",
          district: "Cầu Giấy",
          ward: "Dịch Vọng",
          street: "Số 12 Duy Tân",
          isDefault: true,
        },
      },
    },
  });

  // Khách hàng User 2
  await prisma.user.upsert({
    where: { email: "user2@gmail.com" },
    update: {},
    create: {
      email: "user2@gmail.com",
      phone: "0987654302",
      password: userPasswordHash,
      fullName: "Hoàng Mai Linh",
      role: "customer",
      status: "active",
    },
  });

  console.log("✅ Đã tạo 3 tài khoản Admin & các tài khoản User phân quyền RBAC.");

  // 2. Tạo Thương hiệu (Brands)
  const brandsData = [
    { name: "Apple", slug: "apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "ASUS", slug: "asus", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" },
    { name: "MSI", slug: "msi", logo: "https://upload.wikimedia.org/wikipedia/commons/0/06/MSI_Logo.svg" },
    { name: "Dell", slug: "dell", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
    { name: "Lenovo", slug: "lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg" },
    { name: "NVIDIA", slug: "nvidia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Intel", slug: "intel", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg" },
    { name: "Samsung", slug: "samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "Logitech", slug: "logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" },
  ];

  const brands: Record<string, any> = {};
  for (const b of brandsData) {
    brands[b.slug] = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }
  console.log("✅ Đã tạo 9 thương hiệu công nghệ.");

  // 3. Tạo Danh mục đa cấp (Categories)
  const rootCategories = [
    { name: "Laptop", slug: "laptop", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
    { name: "Điện thoại", slug: "dien-thoai", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
    { name: "Linh kiện PC", slug: "linh-kien-pc", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500" },
    { name: "Phụ kiện Gaming", slug: "phu-kien-gaming", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" },
    { name: "Màn hình", slug: "man-hinh", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" },
  ];

  const categories: Record<string, any> = {};
  for (const cat of rootCategories) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Danh mục con
  const subCategories = [
    { name: "Laptop Gaming", slug: "laptop-gaming", parentId: categories["laptop"].id },
    { name: "Laptop Văn phòng", slug: "laptop-van-phong", parentId: categories["laptop"].id },
    { name: "Card màn hình (VGA)", slug: "vga-card-man-hinh", parentId: categories["linh-kien-pc"].id },
    { name: "Bộ vi xử lý (CPU)", slug: "cpu-bo-vi-xu-ly", parentId: categories["linh-kien-pc"].id },
    { name: "RAM & Ổ cứng SSD", slug: "ram-ssd", parentId: categories["linh-kien-pc"].id },
    { name: "Bàn phím cơ", slug: "ban-phim-co", parentId: categories["phu-kien-gaming"].id },
    { name: "Chuột Gaming", slug: "chuot-gaming", parentId: categories["phu-kien-gaming"].id },
  ];

  for (const sub of subCategories) {
    categories[sub.slug] = await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: sub,
    });
  }
  console.log("✅ Đã tạo cấu trúc danh mục đa cấp.");

  // 4. Tạo Sản phẩm, Biến thể & Serial/IMEI
  const productsData = [
    {
      name: "Laptop Gaming ASUS ROG Strix G16 (2024)",
      slug: "laptop-gaming-asus-rog-strix-g16-2024",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["asus"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Intel Core i9 14900HX, RTX 4070 8GB, Màn hình 16 inch QHD+ 240Hz sắc nét.",
      description: "ASUS ROG Strix G16 2024 được trang bị cấu hình khủng hàng đầu thế giới với vi xử lý Intel Core i9 thế hệ 14 kết hợp card đồ họa NVIDIA GeForce RTX 4070 mang lại hiệu năng gaming và đồ họa cực đỉnh. Hệ thống tản nhiệt thông minh ROG Intelligent Cooling cùng keo tản nhiệt kim loại lỏng Conductonaut Extreme.",
      specs: JSON.stringify({
        cpu: "Intel Core i9-14900HX (24 nhân, 32 luồng, up to 5.8GHz)",
        ram: "32GB DDR5 5600MHz",
        storage: "1TB PCIe 4.0 NVMe M.2 SSD",
        vga: "NVIDIA GeForce RTX 4070 8GB GDDR6 (TGP 140W)",
        display: "16.0 inch QHD+ (2560 x 1600) 16:10, 240Hz, 3ms, ROG Nebula Display 100% DCI-P3",
        battery: "90WHrs, 4-cell Li-ion",
        weight: "2.50 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-za-120br-argb-pwm-black-120mm-fan-nguoc-03.jpg?v=1755258677830"],
      variants: [
        {
          sku: "ROG-G16-I9-32G-1T",
          name: "Core i9 / 32GB RAM / 1TB SSD / RTX 4070 / Đen Eclipse",
          color: "Đen Eclipse",
          storage: "1TB SSD",
          ram: "32GB",
          price: 49990000,
          compareAtPrice: 53990000,
          costPrice: 42000000,
          stock: 15,
          serials: ["ROG16-2024-001", "ROG16-2024-002", "ROG16-2024-003"]
        },
        {
          sku: "ROG-G16-I7-16G-512G",
          name: "Core i7 / 16GB RAM / 512GB SSD / RTX 4060 / Xám Volt",
          color: "Xám Volt",
          storage: "512GB SSD",
          ram: "16GB",
          price: 36990000,
          compareAtPrice: 39990000,
          costPrice: 31000000,
          stock: 20,
          serials: ["ROG16-2024-010", "ROG16-2024-011"]
        }
      ]
    },
    {
      name: "Apple MacBook Pro 14 M3 Pro",
      slug: "apple-macbook-pro-14-m3-pro",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["apple"].id,
      isFeatured: true,
      warrantyMonths: 12,
      shortDesc: "Chip Apple M3 Pro 11-Core CPU, 14-Core GPU, 18GB Unified Memory, Màn hình Liquid Retina XDR.",
      description: "MacBook Pro 14 inch với chip M3 Pro bứt phá tốc độ và hiệu suất năng lượng. Thiết kế Space Black thời thượng, thời lượng pin lên đến 18 giờ, màn hình hiển thị xuất sắc chuyên nghiệp nhất hiện nay.",
      specs: JSON.stringify({
        cpu: "Apple M3 Pro (11-core CPU, 14-core GPU)",
        ram: "18GB Unified Memory",
        storage: "512GB SSD",
        display: "14.2-inch Liquid Retina XDR display (3024x1964), ProMotion 120Hz",
        battery: "70Wh, sạc nhanh 70W USB-C",
        weight: "1.61 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-za-120b-argb-pwm-black-120mm-fan-xuoi-01.jpg?v=1754912223047"],
      variants: [
        {
          sku: "MBP14-M3PRO-18-512-BLACK",
          name: "Space Black - 18GB Unified - 512GB SSD",
          color: "Đen Không Gian (Space Black)",
          storage: "512GB SSD",
          ram: "18GB",
          price: 48990000,
          compareAtPrice: 51990000,
          costPrice: 43000000,
          stock: 25,
          serials: ["MBP14-M3-SN01", "MBP14-M3-SN02", "MBP14-M3-SN03"]
        },
        {
          sku: "MBP14-M3PRO-36-1TB-SILVER",
          name: "Bạc Silver - 36GB Unified - 1TB SSD",
          color: "Bạc (Silver)",
          storage: "1TB SSD",
          ram: "36GB",
          price: 61990000,
          compareAtPrice: 65990000,
          costPrice: 54000000,
          stock: 8,
          serials: ["MBP14-M3-SN08", "MBP14-M3-SN09"]
        }
      ]
    },
    {
      name: "iPhone 16 Pro Max 256GB",
      slug: "iphone-16-pro-max-256gb",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["apple"].id,
      isFeatured: true,
      warrantyMonths: 12,
      shortDesc: "Titanium sa mạc sang trọng, Chip A18 Pro mạnh mẽ bậc nhất, Nút Camera Control thế hệ mới.",
      description: "iPhone 16 Pro Max sở hữu màn hình Super Retina XDR 6.9 inch viền mỏng nhất từ trước đến nay, trang bị chip A18 Pro hỗ trợ Apple Intelligence và quay video 4K 120fps Dolby Vision đẳng cấp điện ảnh.",
      specs: JSON.stringify({
        cpu: "Apple A18 Pro (6 nhân CPU, 6 nhân GPU, 16 nhân NPU)",
        display: "6.9 inch Super Retina XDR OLED 120Hz ProMotion",
        camera: "Chính 48MP, Siêu rộng 48MP, Tele 5x 12MP",
        battery: "Pin dùng cả ngày, sạc MagSafe 25W",
        material: "Khung Titan Cấp 5, Kính Ceramic Shield thế hệ mới"
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/quat-tan-nhiet-jonsbo-za-120b-argb-pwm-black-120mm-fan-xuoi-02.jpg?v=1754912224170"],
      variants: [
        {
          sku: "IP16PM-256-DESERT",
          name: "Titan Sa Mạc - 256GB",
          color: "Titan Sa Mạc (Desert Titanium)",
          storage: "256GB",
          ram: "8GB",
          price: 33990000,
          compareAtPrice: 34990000,
          costPrice: 30000000,
          stock: 30,
          serials: ["IMEI-354892019283741", "IMEI-354892019283742", "IMEI-354892019283743"]
        },
        {
          sku: "IP16PM-256-NATURAL",
          name: "Titan Tự Nhiên - 256GB",
          color: "Titan Tự Nhiên (Natural Titanium)",
          storage: "256GB",
          ram: "8GB",
          price: 33990000,
          compareAtPrice: 34990000,
          costPrice: 30000000,
          stock: 22,
          serials: ["IMEI-354892019283750", "IMEI-354892019283751"]
        }
      ]
    },
    {
      name: "Card màn hình ASUS ROG Strix GeForce RTX 4080 SUPER 16GB",
      slug: "vga-asus-rog-strix-geforce-rtx-4080-super-16gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["asus"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "16GB GDDR6X, DLSS 3, Ray Tracing thế hệ 3, Quạt công nghệ Axial-tech kích thước lớn.",
      description: "Card đồ họa đỉnh cao với kiến trúc Ada Lovelace mới nhất từ NVIDIA. Tản nhiệt buồng hơi hơi nước Vapor Chamber cực mát cùng dải LED Aura Sync phong cách game thủ đẳng cấp.",
      specs: JSON.stringify({
        vga: "NVIDIA GeForce RTX 4080 SUPER",
        ram: "16GB GDDR6X (256-bit)",
        power: "Nguồn khuyến nghị 850W (Cổng 16-pin 12VHPWR)",
        clock: "OC mode: 2655 MHz",
        ports: "2x HDMI 2.1a, 3x DisplayPort 1.4a"
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-xigmatek-xa-20-en46072-7a18c750-b461-4cf6-93ea-152a18c95c23.png?v=1743638042007"],
      variants: [
        {
          sku: "ROG-STRIX-RTX4080S-O16G",
          name: "Phiên bản OC Edition 16GB GDDR6X",
          color: "Đen Aura RGB",
          storage: "16GB VRAM",
          price: 33490000,
          compareAtPrice: 36000000,
          costPrice: 28500000,
          stock: 12,
          serials: ["VGA-4080S-001", "VGA-4080S-002"]
        }
      ]
    },
    {
      name: "Bàn phím cơ Gaming không dây Logitech G915 LIGHTSPEED RGB",
      slug: "ban-phim-co-gaming-khong-day-logitech-g915-lightspeed",
      categoryId: categories["ban-phim-co"].id,
      brandId: brands["logitech"].id,
      isFeatured: false,
      warrantyMonths: 24,
      shortDesc: "Switch GL Tactile cấu hình thấp, kết nối LIGHTSPEED 1ms, pin đến 30 giờ chơi game liên tục.",
      description: "Logitech G915 là bước đột phá về thiết kế và kỹ thuật. Được chế tạo cẩn thận từ vật liệu cao cấp, mỏng chỉ 22mm, tích hợp công nghệ không dây chuyên nghiệp LIGHTSPEED và ánh sáng RGB LIGHTSYNC theo từng phím.",
      specs: JSON.stringify({
        switch: "GL Tactile (Low Profile)",
        connectivity: "LIGHTSPEED Wireless, Bluetooth, USB-A Wired",
        battery: "Lên đến 30 giờ (độ sáng 100%)",
        features: "5 phím G chuyên dụng, Con lăn chỉnh âm lượng cao cấp"
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-xigmatek-xa-20-en46072-3-7685802c-b349-4928-af1e-eb3e2a784bfe.png?v=1743638042167"],
      variants: [
        {
          sku: "LOGI-G915-TACTILE-BK",
          name: "GL Tactile Switch - Màu Đen Carbon",
          color: "Đen Carbon",
          price: 4290000,
          compareAtPrice: 5190000,
          costPrice: 3400000,
          stock: 40,
          serials: ["KB-G915-001", "KB-G915-002", "KB-G915-003"]
        }
      ]
    },
    {
      name: "Laptop Gaming Lenovo Legion Pro 5 16IRX9 (2024)",
      slug: "laptop-gaming-lenovo-legion-pro-5-2024",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["lenovo"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Intel Core i7-14650HX, RTX 4060 8GB, Màn hình 16 inch 2.5K 165Hz 100% sRGB.",
      description: "Dòng laptop gaming quốc dân với hệ thống tản nhiệt Legion Coldfront 5.0 danh tiếng, khung kim loại nguyên khối xám Onyx Grey bền bỉ và bàn phím Legion TrueStrike gõ siêu êm.",
      specs: JSON.stringify({
        cpu: "Intel Core i7-14650HX (16 nhân, 24 luồng, up to 5.2GHz)",
        ram: "16GB DDR5 5600MHz",
        storage: "512GB PCIe NVMe SSD",
        vga: "NVIDIA GeForce RTX 4060 8GB GDDR6 (TGP 140W)",
        display: "16 inch WQXGA (2560x1600) IPS 165Hz, G-SYNC",
        weight: "2.50 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/m2pv-c3-01.jpg?v=1707321628403"],
      variants: [
        {
          sku: "LEGION5-I7-16-512",
          name: "Core i7 / 16GB RAM / 512GB SSD / RTX 4060",
          color: "Xám Onyx Grey",
          storage: "512GB SSD",
          ram: "16GB",
          price: 34990000,
          compareAtPrice: 37990000,
          costPrice: 29000000,
          stock: 18,
          serials: ["LEGION-2024-001", "LEGION-2024-002"]
        }
      ]
    },
    {
      name: "Samsung Galaxy S24 Ultra 5G 12GB/512GB (Galaxy AI)",
      slug: "samsung-galaxy-s24-ultra-512gb",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["samsung"].id,
      isFeatured: true,
      warrantyMonths: 12,
      shortDesc: "Khung viền Titan sang trọng, Bút S-Pen tích hợp, Camera 200MP Zoom 100x và Galaxy AI thông minh.",
      description: "Galaxy S24 Ultra mở ra kỷ nguyên quyền năng di động với bộ công cụ Galaxy AI: Khoanh tròn để tìm kiếm, Phiên dịch trực tiếp cuộc gọi và Trợ lý chỉnh ảnh chuyên nghiệp.",
      specs: JSON.stringify({
        cpu: "Snapdragon 8 Gen 3 for Galaxy (4nm)",
        ram: "12GB LPDDR5X",
        storage: "512GB UFS 4.0",
        display: "6.8 inch Dynamic AMOLED 2X, 120Hz, Độ sáng 2600 nits",
        camera: "200MP + 50MP + 12MP + 10MP",
        battery: "5000mAh, sạc nhanh 45W",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-pcie-nvme-to-usb-3-1-gen2-type-c-orico-m2pv-c3-aluminum-02.jpg?v=1741676575563"],
      variants: [
        {
          sku: "S24U-512-GRAY",
          name: "Xám Titan (Titanium Gray) - 512GB",
          color: "Xám Titan",
          storage: "512GB",
          ram: "12GB",
          price: 31990000,
          compareAtPrice: 34990000,
          costPrice: 27000000,
          stock: 25,
          serials: ["IMEI-S24U-001", "IMEI-S24U-002"]
        }
      ]
    },
    {
      name: "Card Màn Hình MSI GeForce RTX 4090 SUPRIM X 24GB",
      slug: "vga-msi-geforce-rtx-4090-suprim-x-24gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["msi"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "Card đồ họa mạnh nhất hành tinh 24GB GDDR6X, Chơi mượt 8K Gaming & AI Model Training.",
      description: "Đỉnh cao tuyệt đối của card đồ họa tiêu dùng với 16384 nhân CUDA và bộ nhớ khổng lồ 24GB VRAM. Tản nhiệt TRI FROZR 3S với quạt TORX FAN 5.0 tối ưu luồng gió yên tĩnh tuyệt đối.",
      specs: JSON.stringify({
        vga: "NVIDIA GeForce RTX 4090",
        ram: "24GB GDDR6X 384-bit",
        power: "Nguồn khuyến nghị 1000W",
        clock: "Extreme Performance: 2640 MHz",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/6218-01.jpg?v=1557923326480"],
      variants: [
        {
          sku: "MSI-RTX4090-SUPRIMX",
          name: "MSI RTX 4090 SUPRIM X 24GB",
          color: "Bạc Ánh Kim Hợp Kim",
          price: 54990000,
          compareAtPrice: 58990000,
          costPrice: 48000000,
          stock: 6,
          serials: ["VGA-4090-SUPRIM-01"]
        }
      ]
    },
    {
      name: "Bộ Vi Xử Lý CPU Intel Core i9-14900K (Up to 6.0GHz)",
      slug: "cpu-intel-core-i9-14900k",
      categoryId: categories["cpu-bo-vi-xu-ly"].id,
      brandId: brands["intel"].id,
      isFeatured: false,
      warrantyMonths: 36,
      shortDesc: "24 nhân 32 luồng, Xung nhịp Turbo Boost đến 6.0GHz, Socket LGA1700 thế hệ mới.",
      description: "Bộ vi xử lý máy tính để bàn hàng đầu với kiến trúc lai hiệu năng cao của Intel, mang lại trải nghiệm chiến game mượt mà và khả năng dựng phim đồ họa đa luồng cực nhanh.",
      specs: JSON.stringify({
        cpu: "Intel Core i9-14900K",
        cores: "24 nhân (8 P-Core + 16 E-Core), 32 luồng",
        frequency: "Cơ bản 3.2GHz, Tối đa 6.0GHz",
        socket: "LGA1700",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/6218-05.jpg?v=1557923327117"],
      variants: [
        {
          sku: "CPU-INTEL-I9-14900K",
          name: "Box Chính Hãng Nguyên Seal",
          color: "Xanh Intel",
          price: 15490000,
          compareAtPrice: 16990000,
          costPrice: 13500000,
          stock: 35,
          serials: ["CPU-14900K-001", "CPU-14900K-002"]
        }
      ]
    },
    {
      name: "Bộ Vi Xử Lý CPU Intel Core i9-14900KS Special Edition (Up to 6.2GHz)",
      slug: "cpu-intel-core-i9-14900ks-special-edition",
      categoryId: categories["cpu-bo-vi-xu-ly"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "Phiên bản giới hạn tuyển chọn Silicon binning cao nhất, Xung nhịp phá kỷ lục 6.2GHz, 24 nhân 32 luồng.",
      description: "Intel Core i9-14900KS là bộ vi xử lý máy tính để bàn có xung nhịp xuất xưởng cao nhất lịch sử với 6.2GHz. Được sản xuất từ những tấm wafer bán dẫn chọn lọc tinh hoa nhất (Special Edition Binning), i9-14900KS đem lại khung hình FPS cao nhất cho các game thủ eSports chuyên nghiệp và tốc độ kết xuất đồ họa đa luồng cực nhanh.",
      specs: JSON.stringify({
        cpu: "Intel Core i9-14900KS Special Edition",
        cores: "24 nhân (8 P-Core + 16 E-Core), 32 luồng",
        frequency: "Cơ bản 3.2GHz, Turbo Boost 6.0GHz, Thermal Velocity Boost 6.2GHz",
        cache: "36MB Intel Smart Cache (L3) + 32MB L2",
        socket: "LGA1700 (Tương thích Z790/B760)",
        power: "Cơ bản 150W, Turbo tối đa 320W",
        igpu: "Intel UHD Graphics 770",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/6228us3-01.jpg?v=1558006415863"],
      variants: [
        {
          sku: "CPU-INTEL-14900KS-SP",
          name: "Box Special Edition Tuyển Chọn",
          color: "Special Edition Gold/Blue",
          price: 18990000,
          compareAtPrice: 20490000,
          costPrice: 16500000,
          stock: 12,
          serials: ["CPU-14900KS-001", "CPU-14900KS-002"]
        }
      ]
    },
    {
      name: "Bộ Vi Xử Lý CPU Intel Core Ultra 9 285K Arrow Lake (Up to 5.7GHz / NPU AI Boost)",
      slug: "cpu-intel-core-ultra-9-285k",
      categoryId: categories["cpu-bo-vi-xu-ly"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "Kiến trúc Arrow Lake 3nm mới nhất, Tích hợp nhân xử lý AI NPU chuyên dụng, Tiết kiệm điện năng vượt trội.",
      description: "Intel Core Ultra 9 285K mở ra kỷ nguyên máy tính cá nhân tích hợp trí tuệ nhân tạo (AI PC). Sử dụng tiến trình TSMC 3nm tối tân và socket LGA1851 hoàn toàn mới, vi xử lý giảm nhiệt độ hoạt động tới 15°C so với thế hệ trước trong khi cung cấp hiệu năng tính toán AI và xử lý nội dung chuyên sâu.",
      specs: JSON.stringify({
        cpu: "Intel Core Ultra 9 285K (Arrow Lake-S)",
        cores: "24 nhân (8 Lion Cove P-Core + 16 Skymont E-Core), 24 luồng",
        frequency: "P-Core Turbo 5.7GHz, E-Core Turbo 4.6GHz",
        npu: "Intel AI Boost NPU (13 TOPS chuyên biệt AI)",
        cache: "36MB Intel Smart Cache + 40MB L2",
        socket: "LGA1851 (Chipset Intel Z890)",
        process: "TSMC N3B (3nm) Compute Tile",
        ram: "DDR5-6400 MT/s Native (Hỗ trợ CUDIMM)",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/6228us3-02.jpg?v=1558006416500"],
      variants: [
        {
          sku: "CPU-INTEL-CU9-285K",
          name: "Box Chính Hãng Thế Hệ Mới",
          color: "Deep Blue Ultra",
          price: 17490000,
          compareAtPrice: 18990000,
          costPrice: 15200000,
          stock: 18,
          serials: ["CPU-285K-001", "CPU-285K-002"]
        }
      ]
    },
    {
      name: "Bộ Vi Xử Lý CPU Intel Core i7-14700K (Up to 5.6GHz, 20 Nhân 28 Luồng)",
      slug: "cpu-intel-core-i7-14700k",
      categoryId: categories["cpu-bo-vi-xu-ly"].id,
      brandId: brands["intel"].id,
      isFeatured: false,
      warrantyMonths: 36,
      shortDesc: "Bổ sung thêm 4 nhân E-Core nâng tổng số lên 20 nhân 28 luồng, Xung nhịp 5.6GHz cực mạnh cho đồ họa & game.",
      description: "Intel Core i7-14700K là bước nhảy vọt so với người tiền nhiệm khi được trang bị thêm 4 nhân hiệu quả (E-core), nâng tổng số nhân lên 20 nhân và 28 luồng. Đây là sự lựa chọn hoàn hảo cân bằng giữa chơi game 2K/4K và dựng phim Premiere, render 3D Blender.",
      specs: JSON.stringify({
        cpu: "Intel Core i7-14700K",
        cores: "20 nhân (8 P-Core + 12 E-Core), 28 luồng",
        frequency: "Cơ bản 3.4GHz, Turbo Boost Max 3.0 đến 5.6GHz",
        cache: "33MB Intel Smart Cache + 28MB L2",
        socket: "LGA1700 (Z790/B760)",
        power: "125W Base, 253W Max Turbo",
        igpu: "Intel UHD Graphics 770",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-asus-rog-strix-arion-lite-to-usb-3-2-gen-2-type-c-esd-s1cl-1.png?v=1735232556230"],
      variants: [
        {
          sku: "CPU-INTEL-I7-14700K",
          name: "Box Chính Hãng",
          color: "Xanh Intel",
          price: 11290000,
          compareAtPrice: 12490000,
          costPrice: 9800000,
          stock: 45,
          serials: ["CPU-14700K-001", "CPU-14700K-002"]
        }
      ]
    },
    {
      name: "Bộ Vi Xử Lý CPU Intel Core i5-14600K (Up to 5.3GHz, 14 Nhân 20 Luồng)",
      slug: "cpu-intel-core-i5-14600k",
      categoryId: categories["cpu-bo-vi-xu-ly"].id,
      brandId: brands["intel"].id,
      isFeatured: false,
      warrantyMonths: 36,
      shortDesc: "Vua hiệu năng trên giá thành (P/P) phân khúc Gaming & Đồ họa tầm trung cao cấp.",
      description: "Intel Core i5-14600K là bộ vi xử lý được mệnh danh là 'ông vua gaming tầm trung'. Với 14 nhân (6 P-Core và 8 E-Core) cùng xung nhịp boost 5.3GHz, CPU này sẵn sàng gánh mượt mọi tựa game AAA và phần mềm kỹ thuật mà không cần đầu tư tản nhiệt quá đắt đỏ.",
      specs: JSON.stringify({
        cpu: "Intel Core i5-14600K",
        cores: "14 nhân (6 P-Core + 8 E-Core), 20 luồng",
        frequency: "Cơ bản 3.5GHz, Turbo Boost đến 5.3GHz",
        cache: "24MB Intel Smart Cache + 20MB L2",
        socket: "LGA1700",
        power: "125W Base, 181W Turbo",
        igpu: "Intel UHD Graphics 770",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-asus-rog-strix-arion-lite-to-usb-3-2-gen-2-type-c-esd-s1cl-01.jpg?v=1741683964380"],
      variants: [
        {
          sku: "CPU-INTEL-I5-14600K",
          name: "Box Chính Hãng",
          color: "Xanh Intel",
          price: 8290000,
          compareAtPrice: 8990000,
          costPrice: 7100000,
          stock: 60,
          serials: ["CPU-14600K-001", "CPU-14600K-002"]
        }
      ]
    },
    {
      name: "Card Màn Hình Intel Arc A770 16GB GDDR6 Limited Edition",
      slug: "vga-intel-arc-a770-limited-edition-16gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["intel"].id,
      isFeatured: false,
      warrantyMonths: 36,
      shortDesc: "16GB VRAM GDDR6 256-bit, Kiến trúc Alchemist Xe-HPG, Hỗ trợ mã hóa phần cứng Dual AV1 đầu tiên thế giới.",
      description: "Intel Arc A770 16GB Limited Edition là mẫu card đồ họa cao cấp nhất trong dòng Alchemist của Intel. Với dung lượng VRAM 16GB rộng rãi cùng công nghệ siêu lấy mẫu Intel XeSS được hỗ trợ bởi AI, đây là giải pháp tối ưu hàng đầu cho các nhà sáng tạo nội dung livestream, dựng video 4K/8K và thiết kế đồ họa.",
      specs: JSON.stringify({
        gpu: "Intel Arc A770 (Alchemist ACM-G10)",
        cores: "32 Xe Cores, 32 Ray Tracing Units, 512 XMX AI Engines",
        vram: "16GB GDDR6 256-bit (Tốc độ 17.5 Gbps, Băng thông 560 GB/s)",
        clock: "Graphics Clock 2100MHz",
        interface: "PCIe 4.0 x16",
        ports: "3x DisplayPort 2.0, 1x HDMI 2.1",
        power: "225W (Yêu cầu nguồn 550W+, 1x 8-pin + 1x 6-pin)",
        encoders: "Dual Hardware AV1 Encoder/Decoder",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/bo-ba-fan-case-corsair-rs120-argb-120mm-pwm-black-co-9050181-ww-01.jpg?v=1792666102000"],
      variants: [
        {
          sku: "VGA-INTEL-ARC-A770-16G",
          name: "Bản Kỷ Niệm Limited Edition 16GB",
          color: "Matte Black RGB Stealth",
          price: 9890000,
          compareAtPrice: 10990000,
          costPrice: 8300000,
          stock: 25,
          serials: ["VGA-A770-001", "VGA-A770-002"]
        }
      ]
    },
    {
      name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2 (60g)",
      slug: "chuot-logitech-g-pro-x-superlight-2",
      categoryId: categories["chuot-gaming"].id,
      brandId: brands["logitech"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Trọng lượng siêu nhẹ chỉ 60g, Cảm biến HERO 2 32.000 DPI, Tần số báo cáo 4000Hz.",
      description: "Chuột thi đấu eSports đỉnh cao của các game thủ FPS chuyên nghiệp trên toàn thế giới. Switch quang cơ LIGHTFORCE thế hệ mới cho độ phản hồi chính xác đến từng mili-giây.",
      specs: JSON.stringify({
        sensor: "HERO 2 (100 – 32.000 DPI)",
        weight: "60 gram",
        polling: "4000Hz (0.25ms)",
        battery: "Lên đến 95 giờ",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/bo-ba-fan-case-corsair-rs120-argb-120mm-pwm-black-co-9050181-ww-02.jpg?v=1792666103290"],
      variants: [
        {
          sku: "LOGI-SUPERLIGHT2-WHITE",
          name: "Trắng Ngọc Trai (White Edition)",
          color: "Trắng",
          price: 3690000,
          compareAtPrice: 4190000,
          costPrice: 2900000,
          stock: 50,
          serials: ["MOUSE-SUPERLIGHT2-01"]
        }
      ]
    },
    {
      name: "Màn Hình Gaming ASUS ROG Swift OLED PG32UCDM (32 inch, 4K, 240Hz, 0.03ms)",
      slug: "man-hinh-asus-rog-swift-oled-pg32ucdm",
      categoryId: categories["man-hinh"].id,
      brandId: brands["asus"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "Tấm nền QD-OLED 4K thế hệ thứ 3, Tần số quét 240Hz, Thời gian phản hồi 0.03ms.",
      description: "Màn hình gaming OLED hoàn hảo nhất thế giới với chuẩn hiển thị 4K siêu nét, màu đen sâu tuyệt đối, chuẩn màu 99% DCI-P3 và tản nhiệt buồng hơi graphene chống lưu ảnh hiệu quả.",
      specs: JSON.stringify({
        size: "31.5 inch (16:9)",
        panel: "QD-OLED 4K (3840 x 2160)",
        refresh: "240Hz, 0.03ms (GtG)",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-20gbps-asus-tuf-gaming-a2-a2-blk-g-as-01.jpg?v=1743743002217"],
      variants: [
        {
          sku: "ASUS-PG32UCDM",
          name: "ROG Swift OLED PG32UCDM 32 inch 4K 240Hz",
          color: "Đen ROG",
          price: 38990000,
          compareAtPrice: 42990000,
          costPrice: 33000000,
          stock: 10,
          serials: ["MON-OLED-001"]
        }
      ]
    },
    {
      name: "Ổ Cứng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 NVMe M.2 (7450 MB/s)",
      slug: "ssd-samsung-990-pro-2tb-nvme",
      categoryId: categories["ram-ssd"].id,
      brandId: brands["samsung"].id,
      isFeatured: false,
      warrantyMonths: 60,
      shortDesc: "Tốc độ đọc tuần tự 7450 MB/s, ghi 6900 MB/s, chip nhớ V-NAND TLC và bộ nhớ đệm DRAM.",
      description: "Tối ưu hóa băng thông PCIe 4.0 đạt ngưỡng giới hạn tốc độ. Lý tưởng cho các cỗ máy chơi game hạng nặng và dựng video 4K/8K mượt mà.",
      specs: JSON.stringify({
        capacity: "2TB",
        readSpeed: "7.450 MB/s",
        writeSpeed: "6.900 MB/s",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/box-di-dong-ssd-m-2-nvme-20gbps-asus-tuf-gaming-a2-a2-blk-g-as-04.jpg?v=1743743066883"],
      variants: [
        {
          sku: "SAM-990PRO-2TB",
          name: "Bản Tiêu Chuẩn 2TB",
          color: "Đen",
          storage: "2TB",
          price: 4790000,
          compareAtPrice: 5390000,
          costPrice: 3800000,
          stock: 30,
          serials: ["SSD-990PRO-001"]
        }
      ]
    },
    // 5 Sản phẩm Laptop Dell chính hãng
    {
      name: "Laptop Dell XPS 16 9640 Core Ultra 7 155H (32GB / 1TB / RTX 4060 / 4K OLED Touch)",
      slug: "laptop-dell-xps-16-9640-oled",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["dell"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Intel Core Ultra 7 155H tích hợp NPU AI, Màn hình 16.3 inch 4K+ OLED cảm ứng 120Hz, RTX 4060 8GB đồ họa cao cấp.",
      description: "Dell XPS 16 9640 tái định nghĩa chuẩn mực laptop cao cấp với viền siêu mỏng InfinityEdge, mặt kính liền mạch tích hợp bàn di chuột vô hình cảm ứng lực. Bộ vi xử lý Intel Core Ultra thế hệ mới kết hợp card đồ họa NVIDIA GeForce RTX 4060 đem lại sức mạnh sáng tạo nội dung và AI không giới hạn.",
      specs: JSON.stringify({
        cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU Intel AI Boost)",
        ram: "32GB LPDDR5X 7467MHz Dual-Channel",
        storage: "1TB M.2 PCIe 4.0 NVMe SSD",
        vga: "NVIDIA GeForce RTX 4060 8GB GDDR6 (50W TGP)",
        display: "16.3 inch 4K+ (3840 x 2400) OLED Touch 120Hz, 100% DCI-P3, HDR 500",
        battery: "99.5WHr, Sạc nhanh Thunderbolt 4 130W",
        weight: "2.13 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-msi-mag-forge-320r-airflow-mag-forge-320r-4.jpg?v=1749402608267"],
      variants: [
        {
          sku: "DELL-XPS16-U7-32G-1T-4060",
          name: "Platinum Silver • 32GB RAM • 1TB SSD • RTX 4060 • 4K OLED",
          color: "Bạc Bạch Kim",
          storage: "1TB SSD",
          ram: "32GB",
          price: 68990000,
          compareAtPrice: 74990000,
          costPrice: 59000000,
          stock: 18,
          serials: ["DELL-XPS16-001", "DELL-XPS16-002"],
        },
      ],
    },
    {
      name: "Laptop Gaming Dell Alienware m16 R2 Core Ultra 9 185H (32GB / 1TB / RTX 4080 / QHD+ 240Hz)",
      slug: "laptop-gaming-dell-alienware-m16-r2",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["dell"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Intel Core Ultra 9 185H, RTX 4080 12GB TGP 175W, Màn hình 16 inch QHD+ 240Hz, Tản nhiệt buồng hơi Cryo-tech độc quyền.",
      description: "Cỗ máy chiến game huyền thoại Alienware m16 R2 sở hữu thiết kế Stealth Mode thanh lịch nhưng ẩn chứa sức mạnh hủy diệt. Tản nhiệt Cryo-tech 4 quạt siêu mỏng và tản nhiệt buồng hơi buồng lạnh giữ hiệu năng máy luôn ở đỉnh cao khi chơi game 4K hoặc render đồ họa nặng.",
      specs: JSON.stringify({
        cpu: "Intel Core Ultra 9 185H (16 nhân, 22 luồng, Turbo 5.1GHz, 24MB Cache)",
        ram: "32GB DDR5 5600MHz (2x 16GB Dual Channel)",
        storage: "1TB M.2 PCIe Gen 4 NVMe SSD",
        vga: "NVIDIA GeForce RTX 4080 12GB GDDR6 (TGP 175W Max Power)",
        display: "16.0 inch QHD+ (2560 x 1600) 240Hz, 3ms, G-SYNC & Advanced Optimus",
        battery: "90WHr với công nghệ sạc nhanh ExpressCharge",
        weight: "2.61 Kg, Màu Dark Metallic Moon",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-msi-mag-forge-320r-airflow-mag-forge-320r-1.jpg?v=1749402608410"],
      variants: [
        {
          sku: "AW-M16R2-U9-32G-1T-4080",
          name: "Dark Metallic Moon • Ultra 9 • 32GB • 1TB • RTX 4080",
          color: "Mặt Trăng Đen Kim Loại",
          storage: "1TB SSD",
          ram: "32GB",
          price: 76500000,
          compareAtPrice: 82000000,
          costPrice: 66000000,
          stock: 10,
          serials: ["DELL-AW-M16-01", "DELL-AW-M16-02"],
        },
      ],
    },
    {
      name: "Laptop Máy Trạm Dell Precision 7680 Core i9-13950HX (64GB CAMM / 2TB / RTX 4000 Ada 12GB)",
      slug: "laptop-dell-precision-7680-workstation",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["dell"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "Intel Core i9-13950HX vPro, 64GB RAM CAMM DDR5, 2TB SSD, GPU chuyên dụng NVIDIA RTX 4000 Ada 12GB đạt chuẩn ISV Certified.",
      description: "Dell Precision 7680 là máy trạm di động mạnh mẽ bậc nhất thế giới dành cho các kỹ sư AI, chuyên gia mô phỏng 3D CAD/CAM và các hãng phim điện ảnh. Trang bị chuẩn RAM CAMM mỏng nhẹ tự sửa lỗi ECC và bảo mật cấp doanh nghiệp đạt chuẩn phần cứng 4-Shield.",
      specs: JSON.stringify({
        cpu: "Intel Core i9-13950HX vPro Enterprise (24 nhân, 32 luồng, up to 5.5GHz)",
        ram: "64GB CAMM DDR5 5600MHz ECC",
        storage: "2TB PCIe Gen 4.0 NVMe SSD Class 40",
        vga: "NVIDIA RTX 4000 Ada Generation 12GB GDDR6 (ISV Certified)",
        display: "16.0 inch OLED UHD+ (3840 x 2400) 100% DCI-P3, 500 nits",
        battery: "93WHr, Adapter 180W Slim SFF",
        weight: "2.60 Kg, Titan Grey",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/mainboard-pc-msi-pro-h610m-e-ddr4.jpg?v=1743637392983"],
      variants: [
        {
          sku: "DELL-PREC7680-I9-64G-2T-RTX4000",
          name: "Titan Grey • i9-13950HX • 64GB CAMM • 2TB SSD • RTX 4000 Ada",
          color: "Xám Titan",
          storage: "2TB SSD",
          ram: "64GB",
          price: 89900000,
          compareAtPrice: 95000000,
          costPrice: 77000000,
          stock: 8,
          serials: ["DELL-PREC-01"],
        },
      ],
    },
    {
      name: "Laptop Dell Inspiron 16 Plus 7640 Core Ultra 7 155H (16GB / 1TB / RTX 4050 / 2.5K 120Hz)",
      slug: "laptop-dell-inspiron-16-plus-7640",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["dell"].id,
      isFeatured: false,
      warrantyMonths: 12,
      shortDesc: "Intel Core Ultra 7 155H AI Boost, 16GB LPDDR5X, 1TB SSD, RTX 4050 6GB, Màn hình 16 inch 2.5K 120Hz sắc nét.",
      description: "Dell Inspiron 16 Plus 7640 là lựa chọn hoàn hảo cho dân văn phòng cao cấp, lập trình viên và sinh viên kỹ thuật. Máy sở hữu màn hình rộng 16 inch tỉ lệ 16:10 độ phân giải 2.5K 120Hz, vỏ kim loại Ice Blue sang trọng cùng thời lượng pin bền bỉ cả ngày làm việc.",
      specs: JSON.stringify({
        cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, up to 4.8GHz)",
        ram: "16GB LPDDR5X 6400MHz Dual-Channel",
        storage: "1TB PCIe NVMe M.2 SSD",
        vga: "NVIDIA GeForce RTX 4050 6GB GDDR6",
        display: "16.0 inch 2.5K (2560 x 1600) 120Hz, 16:10, 100% sRGB",
        battery: "90WHr, Sạc Type-C nhanh 100W",
        weight: "2.05 Kg, Ice Blue",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/mainboard-pc-msi-pro-h610m-e-ddr4-4.jpg?v=1743637393137"],
      variants: [
        {
          sku: "DELL-INS16P-U7-16G-1T-4050",
          name: "Ice Blue • Core Ultra 7 • 16GB • 1TB • RTX 4050",
          color: "Xanh Băng",
          storage: "1TB SSD",
          ram: "16GB",
          price: 31990000,
          compareAtPrice: 34990000,
          costPrice: 27000000,
          stock: 25,
          serials: ["DELL-INS16-01", "DELL-INS16-02"],
        },
      ],
    },
    {
      name: "Laptop Gaming Dell G16 7630 Core i7-13650HX (16GB / 512GB / RTX 4060 8GB / QHD+ 165Hz)",
      slug: "laptop-gaming-dell-g16-7630",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["dell"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Intel Core i7-13650HX, 16GB DDR5, 512GB SSD, RTX 4060 8GB 140W max công suất, Màn hình 16 inch QHD+ 165Hz G-SYNC.",
      description: "Dell G16 7630 mang gen gaming đỉnh cao thừa hưởng từ Alienware với quạt tản nhiệt kép và nút phím tắt G-Key tăng tốc làm mát tức thì. Màn hình 16 inch QHD+ 165Hz 100% sRGB kết hợp card đồ họa RTX 4060 140W giúp bạn làm chủ mọi đấu trường thể thao điện tử eSports.",
      specs: JSON.stringify({
        cpu: "Intel Core i7-13650HX (14 nhân, 20 luồng, up to 4.9GHz)",
        ram: "16GB DDR5 4800MHz (2 khe RAM)",
        storage: "512GB PCIe Gen 4 NVMe M.2 SSD",
        vga: "NVIDIA GeForce RTX 4060 8GB GDDR6 (TGP 140W)",
        display: "16.0 inch QHD+ (2560 x 1600) 165Hz, G-SYNC",
        battery: "86WHr, Adapter 330W",
        weight: "2.70 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-montech-sky-two-argb-black-caskytwoblmt.jpg?v=1743638807653"],
      variants: [
        {
          sku: "DELL-G16-7630-I7-16G-512G-4060",
          name: "Metallic Shadow Gray • i7-13650HX • 16GB • 512GB • RTX 4060",
          color: "Xám Bóng Kim Loại",
          storage: "512GB SSD",
          ram: "16GB",
          price: 29490000,
          compareAtPrice: 32990000,
          costPrice: 24500000,
          stock: 30,
          serials: ["DELL-G16-01", "DELL-G16-02"],
        },
      ],
    },
    {
      name: "Laptop Intel NUC M15 EVO Core i7-1260P (16GB / 512GB SSD / 15.6 inch Touch IPS 100% sRGB)",
      slug: "laptop-intel-nuc-m15-evo",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Chuẩn Intel EVO cao cấp, vỏ nhôm nguyên khối Anodized CNC, pin 16 giờ, 2 cổng Thunderbolt 4.",
      description: "Intel NUC M15 EVO (tên mã Incline Falls) là mẫu laptop chuẩn mực được chính Intel thiết kế và sản xuất theo tiêu chuẩn khắt khe nhất của chứng nhận Intel EVO. Thân máy chế tác từ nhôm nguyên khối cắt CNC siêu mỏng chỉ 14.9mm, màn hình cảm ứng 15.6 inch Full HD IPS chuẩn 100% sRGB, bàn rê kính mượt mà và camera IR mở khóa khuôn mặt Windows Hello tức thì.",
      specs: JSON.stringify({
        cpu: "Intel Core i7-1260P (12 nhân, 16 luồng, Turbo 4.7GHz)",
        ram: "16GB LPDDR5 5200MHz Dual-Channel",
        storage: "512GB PCIe 4.0 NVMe M.2 SSD",
        vga: "Intel Iris Xe Graphics (96 EUs)",
        display: "15.6 inch FHD (1920 x 1080) Touch IPS 100% sRGB, 450 nits",
        battery: "73WHr, sạc Type-C Thunderbolt 4 65W",
        weight: "1.65 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-montech-sky-two-argb-black-caskytwoblmt-2.jpg?v=1743638807837"],
      variants: [
        {
          sku: "INTEL-NUC-M15-I7-16G-512G",
          name: "Shadow Grey • i7-1260P • 16GB • 512GB • Touch IPS",
          color: "Xám Bạc Kim Loại",
          storage: "512GB SSD",
          ram: "16GB",
          price: 18990000,
          compareAtPrice: 21500000,
          costPrice: 15500000,
          stock: 25,
          serials: ["INTEL-M15-01", "INTEL-M15-02"],
        },
      ],
    },
    {
      name: "Laptop Gaming Intel NUC X15 King County Core i7-12700H (32GB DDR5 / 1TB / RTX 3070 Ti 140W / QHD 165Hz)",
      slug: "laptop-gaming-intel-nuc-x15-king-county",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Bàn phím cơ quang học Optical-Mechanical RGB, Vỏ hợp kim Magie siêu nhẹ 1.99kg, RTX 3070 Ti 140W max TGP.",
      description: "Intel NUC X15 King County là dòng laptop gaming đầu bảng do chính kỹ sư Intel phát triển dành riêng cho cộng đồng đam mê phần cứng. Khung vỏ làm từ hợp kim Magie siêu nhẹ chỉ 1.99kg nhưng chứa đựng card đồ họa cực mạnh RTX 3070 Ti 8GB chạy tối đa công suất 140W. Bàn phím cơ quang học Optical-Mechanical bấm cực nảy với LED RGB từng phím.",
      specs: JSON.stringify({
        cpu: "Intel Core i7-12700H (14 nhân, 20 luồng, up to 4.7GHz)",
        ram: "32GB DDR5 4800MHz Dual-Channel",
        storage: "1TB PCIe Gen 4x4 NVMe SSD",
        vga: "NVIDIA GeForce RTX 3070 Ti 8GB GDDR6 (140W Max)",
        display: "15.6 inch QHD (2560 x 1440) 165Hz IPS, 100% sRGB",
        battery: "94WHr, Adapter 230W",
        weight: "1.99 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-montech-sky-two-gx-argb-black-caskytwogxblmt-01.jpg?v=1750925204520"],
      variants: [
        {
          sku: "INTEL-NUC-X15-I7-32G-1T-3070TI",
          name: "Matte Black • i7-12700H • 32GB • 1TB • RTX 3070 Ti 140W",
          color: "Đen Nhám Hợp Kim",
          storage: "1TB SSD",
          ram: "32GB",
          price: 29490000,
          compareAtPrice: 34000000,
          costPrice: 24000000,
          stock: 18,
          serials: ["INTEL-X15-01", "INTEL-X15-02"],
        },
      ],
    },
    {
      name: "Laptop Intel NUC Studio AI Workstation Core Ultra 9 185H (32GB LPDDR5X / 2TB / RTX 4070 / 3.2K Mini-LED 165Hz)",
      slug: "laptop-intel-nuc-studio-ai-workstation",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: "Máy trạm AI di động tối tân, NPU Intel AI Boost chuyên biệt xử lý mô hình ngôn ngữ lớn LLM và render 3D.",
      description: "Intel NUC Studio AI Workstation đại diện cho bước đột phá về điện toán trí tuệ nhân tạo. Trang bị bộ vi xử lý Intel Core Ultra 9 185H tích hợp cụm nhân AI NPU Boost thế hệ mới nhất cùng card đồ họa RTX 4070 8GB GDDR6 Studio. Màn hình Mini-LED 3.2K 165Hz với 1000 nits đỉnh sáng đạt chuẩn HDR 1000 hiển thị màu chuẩn điện ảnh.",
      specs: JSON.stringify({
        cpu: "Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU Intel AI Boost)",
        ram: "32GB LPDDR5X 7467MHz",
        storage: "2TB M.2 PCIe 4.0 NVMe SSD",
        vga: "NVIDIA GeForce RTX 4070 8GB GDDR6 Studio",
        display: "16.0 inch 3.2K Mini-LED 165Hz, 1000 nits, 100% DCI-P3, HDR 1000",
        battery: "99.9WHr, Sạc GaN 200W",
        weight: "2.10 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-montech-sky-two-gx-argb-black-caskytwogxblmt-09.jpg?v=1750925205420"],
      variants: [
        {
          sku: "INTEL-STUDIO-U9-32G-2T-4070",
          name: "Space Grey • Core Ultra 9 • 32GB • 2TB • RTX 4070 Studio",
          color: "Xám Vũ Trụ",
          storage: "2TB SSD",
          ram: "32GB",
          price: 46990000,
          compareAtPrice: 51500000,
          costPrice: 38000000,
          stock: 10,
          serials: ["INTEL-STUDIO-01", "INTEL-STUDIO-02"],
        },
      ],
    },
    {
      name: "Laptop Intel EVO Reference Ultra 14 Core Ultra 7 155H (16GB / 1TB / 2.8K OLED 120Hz / 1.18kg)",
      slug: "laptop-intel-evo-reference-ultra-14",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Siêu phẩm mỏng nhẹ 1.18kg, màn hình 2.8K OLED 120Hz chuẩn rạp phim, camera IR bảo mật sinh trắc học e-Shield.",
      description: "Mẫu laptop doanh nhân cao cấp định hình tiêu chuẩn Intel EVO 2026. Với trọng lượng khó tin chỉ 1.18kg trên bộ khung hợp kim Magie - Nhôm siêu bền bỉ, chiếc máy sở hữu màn hình OLED 2.8K tần số quét 120Hz siêu mịn, thời lượng pin sử dụng thực tế 18 giờ liên tục và công nghệ Intel Unison đồng bộ liền mạch với smartphone iOS & Android.",
      specs: JSON.stringify({
        cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, Turbo 4.8GHz)",
        ram: "16GB LPDDR5X 6400MHz",
        storage: "1TB PCIe Gen4 M.2 SSD",
        vga: "Intel Arc Graphics tích hợp",
        display: "14.0 inch 2.8K OLED 120Hz, 100% DCI-P3, HDR True Black 600",
        battery: "75WHr, Pin dùng 18 giờ",
        weight: "1.18 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-msi-mag-pano-m100r-pz-white-4.jpg?v=1743639211120"],
      variants: [
        {
          sku: "INTEL-EVO-U7-16G-1T-OLED",
          name: "Platinum Silver • Core Ultra 7 • 16GB • 1TB • 2.8K OLED",
          color: "Bạc Bạch Kim",
          storage: "1TB SSD",
          ram: "16GB",
          price: 24890000,
          compareAtPrice: 27990000,
          costPrice: 20000000,
          stock: 22,
          serials: ["INTEL-EVO-01", "INTEL-EVO-02"],
        },
      ],
    },
    {
      name: "Laptop Gaming Intel NUC X15 Core i7-11800H (16GB / 512GB / RTX 3060 6GB / FHD 240Hz 100% sRGB)",
      slug: "laptop-gaming-intel-nuc-x15-240hz",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["intel"].id,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: "Tần số quét 240Hz chuẩn thi đấu eSports, tản nhiệt kim loại lỏng Liquid Metal, Wi-Fi 6 AX201 siêu tốc.",
      description: "Laptop gaming thi đấu chuyên nghiệp của Intel với màn hình tần số quét khủng 240Hz siêu nhạy, triệt tiêu hoàn toàn hiện tượng bóng mờ và xé hình khi chơi CS2, Valorant hay Apex Legends. Card đồ họa RTX 3060 công suất cao cùng hệ thống tản nhiệt tối ưu giữ máy luôn mát mẻ qua hàng giờ thi đấu liên tục.",
      specs: JSON.stringify({
        cpu: "Intel Core i7-11800H (8 nhân, 16 luồng, up to 4.6GHz)",
        ram: "16GB DDR4 3200MHz Dual-Channel",
        storage: "512GB NVMe PCIe 4.0 SSD",
        vga: "NVIDIA GeForce RTX 3060 6GB GDDR6 (130W)",
        display: "15.6 inch Full HD (1920 x 1080) IPS 240Hz, 100% sRGB",
        battery: "94WHr, sạc nhanh 230W",
        weight: "1.94 Kg",
      }),
      images: ["https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/case-may-tinh-msi-mag-pano-m100r-pz-white-2.jpg?v=1743639211280"],
      variants: [
        {
          sku: "INTEL-NUC-X15-I7-16G-512G-240HZ",
          name: "Abyssal Black • i7-11800H • 16GB • 512GB • 240Hz",
          color: "Đen Huyền Bí",
          storage: "512GB SSD",
          ram: "16GB",
          price: 21490000,
          compareAtPrice: 24990000,
          costPrice: 17500000,
          stock: 35,
          serials: ["INTEL-X15-240-01", "INTEL-X15-240-02"],
        },
      ],
    },
    {
      "name": "Apple MacBook Pro 16 inch M3 Max (36GB Unified / 1TB SSD / Liquid Retina XDR 120Hz)",
      "slug": "apple-macbook-pro-16-m3-max",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["apple"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Chip Apple M3 Max 14 CPU 30 GPU, 36GB RAM, 1TB SSD, Màn hình 16.2 inch Liquid Retina XDR ProMotion 120Hz.",
      "description": "MacBook Pro 16 inch với chip M3 Max đem đến sức mạnh không tưởng cho các tác vụ chuyên nghiệp như mô phỏng khoa học, biên tập video 8K ProRes đa luồng và dựng hình 3D phức tạp. Thời lượng pin kỷ lục lên đến 22 giờ.",
      "specs": "{\"cpu\":\"Apple M3 Max (14-core CPU, 30-core GPU, 16-core Neural Engine)\",\"ram\":\"36GB Unified Memory (Băng thông 300GB/s)\",\"storage\":\"1TB PCIe NVMe SSD\",\"display\":\"16.2 inch Liquid Retina XDR (3456 x 2234), 120Hz ProMotion, 1600 nits đỉnh HDR\",\"battery\":\"100WHr, sạc nhanh MagSafe 3 140W USB-C\",\"weight\":\"2.16 Kg, Màu Space Black (Đen Không Gian) chống bám vân tay\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Apple MacBook Air 13 inch M3 (16GB RAM / 512GB SSD / Mỏng 11.3mm)",
      "slug": "apple-macbook-air-13-m3",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["apple"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Thiết kế siêu mỏng nhẹ chỉ 1.24kg, Chip Apple M3 8 CPU 10 GPU, Pin 18 giờ, Hỗ trợ 2 màn hình ngoài.",
      "description": "MacBook Air 13 inch M3 là chiếc laptop mỏng nhẹ hoàn hảo nhất cho công việc và học tập. Hiệu năng vượt trội trong thân máy không quạt hoàn toàn yên tĩnh, màn hình Liquid Retina 500 nits sống động.",
      "specs": "{\"cpu\":\"Apple M3 (8-core CPU, 10-core GPU, 16-core Neural Engine)\",\"ram\":\"16GB Unified Memory\",\"storage\":\"512GB SSD\",\"display\":\"13.6 inch Liquid Retina (2560 x 1664) 500 nits True Tone\",\"battery\":\"Pin 18 giờ liên tục, Sạc MagSafe 3\",\"weight\":\"1.24 Kg, Vỏ nhôm tái chế 100%\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Apple MacBook Air 15 inch M3 (16GB RAM / 512GB SSD / Starlight)",
      "slug": "apple-macbook-air-15-m3",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["apple"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Màn hình lớn 15.3 inch Liquid Retina, Mỏng 11.5mm, Hệ thống 6 loa âm thanh vòm Spatial Audio.",
      "description": "MacBook Air 15 inch mang đến không gian hiển thị rộng rãi cùng thời lượng pin bền bỉ trong thân máy siêu mỏng nhẹ. Trải nghiệm giải trí và làm việc đa nhiệm đỉnh cao với chip Apple M3 thế hệ mới.",
      "specs": "{\"cpu\":\"Apple M3 (8-core CPU, 10-core GPU)\",\"ram\":\"16GB Unified Memory\",\"storage\":\"512GB SSD\",\"display\":\"15.3 inch Liquid Retina (2880 x 1864) 500 nits\",\"weight\":\"1.51 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Apple MacBook Pro 14 inch M3 Standard (16GB / 512GB / Space Gray)",
      "slug": "apple-macbook-pro-14-m3-standard",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["apple"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Chip Apple M3 mạnh mẽ, Màn hình 14.2 inch Liquid Retina XDR 120Hz ProMotion, Đầy đủ cổng HDMI và thẻ SDXC.",
      "description": "MacBook Pro 14 inch cơ bản trang bị chip M3 mang lại hiệu năng đồ họa ấn tượng với công nghệ Dynamic Caching và phần cứng Ray Tracing.",
      "specs": "{\"cpu\":\"Apple M3 8-core CPU, 10-core GPU\",\"ram\":\"16GB Unified Memory\",\"storage\":\"512GB SSD\",\"display\":\"14.2 inch Liquid Retina XDR 120Hz\",\"weight\":\"1.55 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại iPhone 16 Pro 128GB Chính Hãng VN/A (Titan Tự Nhiên)",
      "slug": "dien-thoai-iphone-16-pro-128gb",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["apple"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Khung viền Titan cấp 5 siêu nhẹ, Chip A18 Pro 3nm, Nút Camera Control cảm ứng lực, Camera 48MP Fusion 5x Tele.",
      "description": "iPhone 16 Pro mang đến bước tiến vượt bậc với Apple Intelligence, thiết kế viền màn hình mỏng nhất lịch sử Apple và nút điều khiển Camera Control chuyên nghiệp.",
      "specs": "{\"screen\":\"6.3 inch Super Retina XDR OLED ProMotion 120Hz, Always-On Display\",\"cpu\":\"Apple A18 Pro (6 nhân CPU, 6 nhân GPU, 16 nhân Neural Engine)\",\"camera\":\"Chính 48MP Fusion + Góc siêu rộng 48MP + Tele 12MP 5x quang học\",\"battery\":\"Lên đến 27 giờ phát video, Sạc MagSafe 25W\",\"material\":\"Khung Titan tự nhiên nhám mờ, Mặt lưng kính Ceramic Shield thế hệ mới\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại iPhone 16 Plus 128GB Chính Hãng VN/A (Màn hình 6.7 inch)",
      "slug": "dien-thoai-iphone-16-plus-128gb",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["apple"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Màn hình lớn 6.7 inch Super Retina XDR, Chip Apple A18, Nút Camera Control, Thời lượng pin lên đến 27 giờ.",
      "description": "iPhone 16 Plus kết hợp hoàn hảo giữa không gian màn hình lớn và thời lượng pin dẫn đầu dòng iPhone, hỗ trợ trọn vẹn các tính năng trí tuệ nhân tạo Apple Intelligence.",
      "specs": "{\"screen\":\"6.7 inch Super Retina XDR OLED, 2000 nits đỉnh sáng\",\"cpu\":\"Apple A18 3nm\",\"camera\":\"Camera kép 48MP Fusion 2x Tele + 12MP Ultra Wide Macro\",\"battery\":\"Phát video liên tục 27 giờ\",\"weight\":\"199 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại iPhone 16 128GB Chính Hãng VN/A (Chip Apple A18)",
      "slug": "dien-thoai-iphone-16-128gb",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["apple"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Camera Fusion 48MP 2 trong 1, Nút Tác Vụ Action Button, Nút Camera Control chuyên nghiệp, Chip A18 3nm.",
      "description": "iPhone 16 mang đến thiết kế cụm camera dọc tinh tế, kính pha màu bền bỉ với 5 sắc màu trẻ trung cùng hiệu năng vượt trội cho trải nghiệm chiến game AAA đồ họa chân thực.",
      "specs": "{\"screen\":\"6.1 inch Super Retina XDR OLED\",\"cpu\":\"Apple A18 (6-core CPU, 5-core GPU)\",\"camera\":\"Chính 48MP + Góc rộng 12MP Macro\",\"weight\":\"170 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại iPhone 15 Pro Max 256GB Chính Hãng VN/A (Titan Tự Nhiên)",
      "slug": "dien-thoai-iphone-15-pro-max-256gb",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["apple"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Khung viền Titan chuẩn hàng không vũ trụ, Chip A17 Pro 3nm, Cổng kết nối USB-C chuẩn 10Gbps, Camera 5x Telephoto.",
      "description": "iPhone 15 Pro Max là siêu phẩm đỉnh cao với khung titan siêu bền bỉ, ống kính telephoto tiềm vọng 5x và sức mạnh xử lý đồ họa Ray Tracing từ chip A17 Pro.",
      "specs": "{\"screen\":\"6.7 inch Super Retina XDR OLED 120Hz ProMotion\",\"cpu\":\"Apple A17 Pro 3nm\",\"camera\":\"Chính 48MP + Tele 12MP 5x + Góc rộng 12MP\",\"weight\":\"221 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Samsung Galaxy Book4 Ultra Core Ultra 9 185H (32GB / 1TB / RTX 4070 / 3K AMOLED Touch 120Hz)",
      "slug": "laptop-samsung-galaxy-book4-ultra",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["samsung"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Đầu bảng laptop Samsung, Màn hình Dynamic AMOLED 2X 3K cảm ứng 120Hz kính chống chói Corning DX, RTX 4070 8GB.",
      "description": "Galaxy Book4 Ultra là cỗ máy làm việc sáng tạo hàng đầu của Samsung tích hợp hệ sinh thái Galaxy Connected Experience liền mạch. Card đồ họa RTX 4070 và màn hình AMOLED siêu nét đáp ứng hoàn hảo cho thiết kế đồ họa và AI.",
      "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU Intel AI Boost)\",\"ram\":\"32GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe Gen 4 NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4070 8GB GDDR6 (80W TGP)\",\"display\":\"16.0 inch 3K (2880 x 1800) Dynamic AMOLED 2X Touch 120Hz, 120% DCI-P3, HDR 500\",\"battery\":\"76WHr, Sạc siêu nhanh 140W Type-C\",\"weight\":\"1.86 Kg, Màu Moonstone Gray nhôm nguyên khối\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Samsung Galaxy Book4 Pro 360 Core Ultra 7 (16GB / 1TB / Màn Xoay Gập 2-trong-1 S-Pen)",
      "slug": "laptop-samsung-galaxy-book4-pro-360",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["samsung"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Bản lề xoay gập 360 độ linh hoạt, Tặng kèm bút S-Pen không cần sạc, Màn hình 16 inch 3K AMOLED cảm ứng.",
      "description": "Galaxy Book4 Pro 360 biến hóa linh hoạt giữa laptop hiệu năng cao và bảng vẽ kỹ thuật số cao cấp. Bút S-Pen kèm theo cho độ trễ cực thấp để phác thảo và ghi chú tự nhiên như trên giấy.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H 16 nhân\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB SSD\",\"display\":\"16.0 inch 3K AMOLED 120Hz Touch S-Pen\",\"weight\":\"1.66 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Samsung Galaxy Book3 Pro 14 inch Core i7-1360P (16GB / 512GB / Dynamic AMOLED 2X 120Hz)",
      "slug": "laptop-samsung-galaxy-book3-pro",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["samsung"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Trọng lượng siêu nhẹ chỉ 1.17kg, Màn hình Dynamic AMOLED 2X 120Hz độ phân giải 3K, Vỏ nhôm nguyên khối.",
      "description": "Galaxy Book3 Pro 14 inch kết hợp hoàn hảo giữa độ mỏng nhẹ kinh ngạc và màn hình AMOLED chuẩn điện ảnh sắc nét hàng đầu thế giới laptop.",
      "specs": "{\"cpu\":\"Intel Core i7-1360P 12 nhân 16 luồng\",\"ram\":\"16GB LPDDR5\",\"storage\":\"512GB NVMe SSD\",\"display\":\"14.0 inch 3K AMOLED 120Hz\",\"weight\":\"1.17 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Samsung Galaxy Z Fold6 5G 12GB/512GB (Màn Hình Gập / Galaxy AI)",
      "slug": "dien-thoai-samsung-galaxy-z-fold6",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["samsung"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Bản lề kép FlexHinge siêu mỏng, Khung Armor Aluminum cường lực, Màn hình chính 7.6 inch 2600 nits, Chip Snapdragon 8 Gen 3 for Galaxy.",
      "description": "Galaxy Z Fold6 là đỉnh cao điện thoại màn hình gập với trí tuệ nhân tạo Galaxy AI toàn diện. Thiết kế vuông vức siêu mỏng nhẹ chỉ 239g mở ra không gian làm việc đa nhiệm như máy tính bảng thu nhỏ.",
      "specs": "{\"screen\":\"Chính 7.6 inch QXGA+ Dynamic AMOLED 2X 120Hz; Phụ 6.3 inch 120Hz\",\"cpu\":\"Snapdragon 8 Gen 3 for Galaxy (4nm)\",\"ram\":\"12GB LPDDR5X\",\"storage\":\"512GB UFS 4.0\",\"camera\":\"Chính 50MP OIS + Tele 10MP 3x + Góc siêu rộng 12MP\",\"battery\":\"4400mAh, sạc nhanh 25W, kháng nước IP48\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Samsung Galaxy Z Flip6 5G 12GB/256GB (Gập Vỏ Sò / FlexCam 50MP)",
      "slug": "dien-thoai-samsung-galaxy-z-flip6",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["samsung"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Màn hình ngoài FlexWindow 3.4 inch, Camera nâng cấp 50MP ProVisual Engine, Buồng tản nhiệt hơi Vapor Chamber đầu tiên trên dòng Flip.",
      "description": "Galaxy Z Flip6 biểu tượng thời trang công nghệ với khả năng gập nhỏ gọn trong lòng bàn tay. Hệ thống tản nhiệt buồng hơi giúp máy luôn mát mẻ và vận hành mượt mà mọi tính năng Galaxy AI.",
      "specs": "{\"screen\":\"Chính 6.7 inch FHD+ Dynamic AMOLED 2X 120Hz; Ngoài 3.4 inch Super AMOLED\",\"cpu\":\"Snapdragon 8 Gen 3 for Galaxy\",\"camera\":\"Kép 50MP OIS + 12MP Ultra Wide\",\"battery\":\"4000mAh\",\"weight\":\"187 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Samsung Galaxy S24+ 5G 12GB/256GB (Màn 6.7 inch QHD+ 120Hz)",
      "slug": "dien-thoai-samsung-galaxy-s24-plus",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["samsung"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Màn hình 6.7 inch Dynamic AMOLED 2X độ phân giải QHD+, Pin 4900mAh cực trâu, Khung viền Armor Aluminum.",
      "description": "Galaxy S24+ nâng tầm trải nghiệm với màn hình lớn độ phân giải 2K sắc nét, pin dung lượng lớn sạc nhanh 45W và trọn vẹn bộ công cụ trí tuệ nhân tạo Galaxy AI.",
      "specs": "{\"screen\":\"6.7 inch QHD+ (3120 x 1440) 120Hz 2600 nits\",\"cpu\":\"Exynos 2400 10 nhân (4nm)\",\"ram\":\"12GB\",\"storage\":\"256GB\",\"camera\":\"Chính 50MP + Tele 10MP 3x + Góc rộng 12MP\",\"battery\":\"4900mAh, sạc nhanh 45W\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Samsung Galaxy S24 5G 8GB/256GB (Thiết Kế Nhỏ Gọn / Galaxy AI)",
      "slug": "dien-thoai-samsung-galaxy-s24-standard",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["samsung"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Kích thước nhỏ gọn 6.2 inch cầm nắm hoàn hảo, Viền siêu mỏng đều 4 cạnh, Độ sáng màn hình 2600 nits rực rỡ ngoài trời.",
      "description": "Galaxy S24 là mẫu smartphone cao cấp nhỏ gọn xuất sắc nhất với sức mạnh của Galaxy AI: Khoanh tròn để tìm kiếm Circle to Search, Phiên dịch trực tiếp cuộc gọi và Trợ lý chỉnh ảnh chuyên nghiệp.",
      "specs": "{\"screen\":\"6.2 inch FHD+ Dynamic AMOLED 2X 120Hz\",\"cpu\":\"Exynos 2400 10 nhân\",\"camera\":\"50MP OIS + 10MP Tele 3x + 12MP Ultra Wide\",\"weight\":\"167 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Samsung Galaxy A55 5G 8GB/128GB (Viền Kim Loại / Kháng Nước IP67)",
      "slug": "dien-thoai-samsung-galaxy-a55-5g",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["samsung"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Khung viền kim loại vát phẳng sang trọng, Mặt lưng kính Gorilla Glass Victus+, Bảo mật phần cứng Samsung Knox Vault.",
      "description": "Galaxy A55 5G định chuẩn smartphone phân khúc tầm trung với camera chống rung OIS sắc nét ban đêm, pin 5000mAh dùng 2 ngày và cam kết cập nhật 4 bản Android lớn.",
      "specs": "{\"screen\":\"6.6 inch Super AMOLED FHD+ 120Hz\",\"cpu\":\"Exynos 1480 GPU AMD Xclipse 530\",\"camera\":\"Chính 50MP OIS + 12MP Ultra Wide + 5MP Macro\",\"battery\":\"5000mAh, sạc nhanh 25W, chuẩn kháng nước bụi IP67\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming ASUS ROG Zephyrus G16 OLED Core Ultra 9 (32GB / 1TB / RTX 4080 / 2.5K OLED 240Hz / 1.85kg)",
      "slug": "laptop-asus-rog-zephyrus-g16-oled",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["asus"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Vỏ nhôm CNC siêu mỏng chỉ 1.49cm, Dải đèn Slash Lighting mặt A cực chất, Màn hình ROG Nebula OLED 240Hz 0.2ms.",
      "description": "ROG Zephyrus G16 2024 tái định nghĩa laptop gaming cao cấp: vừa mỏng nhẹ tinh tế như ultrabook cao cấp (1.85kg) vừa sở hữu sức mạnh đồ họa đỉnh cao từ RTX 4080 và chip AI Core Ultra 9.",
      "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU Boost)\",\"ram\":\"32GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe 4.0 NVMe M.2 SSD\",\"vga\":\"NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP)\",\"display\":\"16.0 inch 2.5K (2560 x 1600) OLED 240Hz 0.2ms, 100% DCI-P3, G-SYNC\",\"battery\":\"90WHr, sạc nhanh Type-C 100W PD\",\"weight\":\"1.85 Kg, Màu Platinum White\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop ASUS Zenbook 14 OLED UX3405 Core Ultra 7 155H (16GB / 1TB / 3K OLED 120Hz / 1.2kg)",
      "slug": "laptop-asus-zenbook-14-oled-ux3405",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["asus"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Trọng lượng siêu nhẹ chỉ 1.2kg, Màn hình Lumina OLED 3K 120Hz chuẩn màu điện ảnh, Pin 75Wh dùng cả ngày.",
      "description": "Zenbook 14 OLED là chiếc laptop AI chuẩn mực cho doanh nhân và nhà sáng tạo. Thân máy kim loại siêu mỏng nhẹ, bàn phím ErgoSense êm ái và camera IR nhận diện khuôn mặt bảo mật tối ưu.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, 22 luồng)\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"14.0 inch 3K (2880 x 1800) OLED 120Hz 0.2ms, 100% DCI-P3\",\"weight\":\"1.20 Kg, Vỏ nhôm nguyên khối Xanh Ponder Blue\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop ASUS Zenbook Duo OLED UX8406 (2 Màn Hình Cảm Ứng 3K 120Hz / Core Ultra 9 185H / 32GB / 1TB)",
      "slug": "laptop-asus-zenbook-duo-oled-ux8406",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["asus"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Đột phá 2 màn hình 14 inch Lumina OLED 3K 120Hz, Bàn phím Bluetooth tháo rời kèm chân đế tích hợp, Chế độ làm việc đa màn hình.",
      "description": "ASUS Zenbook Duo 2024 mang lại không gian làm việc gấp đôi với 2 màn hình cảm ứng OLED tuyệt mỹ. Bàn phím từ tính tháo rời linh hoạt cho phép làm việc ở chế độ màn hình kép, chế độ sách hay chế độ máy tính để bàn.",
      "specs": "{\"cpu\":\"Intel Core Ultra 9 185H\",\"ram\":\"32GB LPDDR5X\",\"storage\":\"1TB PCIe 4.0 SSD\",\"display\":\"2x 14.0 inch 3K OLED 120Hz Touch, hỗ trợ bút ASUS Pen 2.0\",\"weight\":\"1.65 Kg (1.35kg khi tháo rời phím)\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming ASUS ROG Strix SCAR 18 Core i9-14900HX (64GB DDR5 / 2TB SSD / RTX 4090 175W / 18 inch 240Hz)",
      "slug": "laptop-gaming-asus-rog-strix-scar-18",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["asus"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Quái vật đồ họa gaming đầu bảng, Màn hình 18 inch ROG Nebula HDR Mini-LED 2.5K 240Hz, Tản nhiệt 3 quạt với kim loại lỏng Conductonaut Extreme.",
      "description": "ROG Strix SCAR 18 là biểu tượng sức mạnh gaming tuyệt đối với CPU Core i9-14900HX 24 nhân và GPU RTX 4090 175W max công suất. Màn hình Mini-LED 18 inch sống động cùng hệ thống LED RGB rực rỡ.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz\",\"storage\":\"2TB PCIe 4.0 NVMe M.2 SSD RAID 0\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W Max TGP)\",\"display\":\"18.0 inch 2.5K (2560 x 1600) ROG Nebula HDR Mini-LED 240Hz, 1100 nits\",\"weight\":\"3.10 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop ASUS TUF Gaming A15 AMD Ryzen 7 8845HS (16GB / 512GB / RTX 4060 140W / 144Hz)",
      "slug": "laptop-asus-tuf-gaming-a15",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["asus"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Độ bền chuẩn quân đội MIL-STD-810H, Chip Ryzen 7 8845HS tích hợp nhân AI NPU, RTX 4060 140W chiến mượt game AAA.",
      "description": "ASUS TUF Gaming A15 là lựa chọn hoàn hảo cân bằng giữa độ bền bỉ chuẩn quân đội và hiệu năng chiến game mạnh mẽ với mức giá cực kỳ hấp dẫn.",
      "specs": "{\"cpu\":\"AMD Ryzen 7 8845HS (8 nhân, 16 luồng, 5.1GHz, AMD Ryzen AI)\",\"ram\":\"16GB DDR5 5600MHz\",\"storage\":\"512GB PCIe 4.0 SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB (140W TGP)\",\"display\":\"15.6 inch FHD (1920 x 1080) 144Hz G-SYNC\",\"weight\":\"2.20 Kg, Vỏ kim loại Mecha Gray\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Gaming ASUS ROG Phone 8 Pro 16GB/512GB (Snapdragon 8 Gen 3 / AniMe Vision LED / 165Hz)",
      "slug": "dien-thoai-asus-rog-phone-8-pro",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["asus"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Vua điện thoại gaming, Mặt lưng ma trận 341 đèn LED AniMe Vision tùy biến, Nút siêu âm AirTrigger, Màn hình Samsung AMOLED 165Hz.",
      "description": "ROG Phone 8 Pro lột xác với thiết kế mỏng nhẹ sang trọng, kháng nước IP68 đầu tiên trên điện thoại gaming cùng cụm camera tele 32MP chống rung gimbal 6 trục đẳng cấp.",
      "specs": "{\"screen\":\"6.78 inch FHD+ Samsung E6 Flexible AMOLED 165Hz, LTPO 1-120Hz, 2500 nits\",\"cpu\":\"Snapdragon 8 Gen 3 (4nm)\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"512GB UFS 4.0\",\"camera\":\"Chính 50MP Sony IMX890 OIS Gimbal 6 trục + Tele 32MP 3x OIS + Góc rộng 13MP\",\"battery\":\"5500mAh, sạc nhanh 65W HyperCharge, sạc không dây 15W Qi\",\"gaming\":\"Nút siêu âm AirTrigger, 2 cổng USB-C, quạt tản nhiệt rời AeroActive Cooler X\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại ASUS Zenfone 11 Ultra 16GB/256GB (Camera Gimbal OIS 6 Trục / Pin 5500mAh)",
      "slug": "dien-thoai-asus-zenfone-11-ultra",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["asus"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Màn hình lớn 6.78 inch AMOLED 144Hz, Chip Snapdragon 8 Gen 3, Camera chống rung Gimbal 6 trục, Pin siêu trâu 5500mAh.",
      "description": "Zenfone 11 Ultra là chiếc smartphone flagship hoàn thiện của ASUS dành cho người dùng yêu thích quay video chống rung mượt mà như gimbal và thời lượng pin dẫn đầu thế giới Android.",
      "specs": "{\"screen\":\"6.78 inch LTPO AMOLED 144Hz\",\"cpu\":\"Snapdragon 8 Gen 3\",\"camera\":\"Chính 50MP Gimbal OIS + 32MP Tele 3x + 13MP Ultra Wide\",\"battery\":\"5500mAh, sạc nhanh 65W\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming Dell Alienware m18 R2 Core i9-14900HX (64GB / 2TB / RTX 4090 175W / 18 inch QHD+ 165Hz)",
      "slug": "laptop-dell-alienware-m18-r2",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["dell"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Quái vật Alienware màn hình khủng 18 inch, Tản nhiệt Element 31 kim loại lỏng gali-silicone, Bàn phím cơ Cherry MX RGB.",
      "description": "Alienware m18 R2 là cỗ máy thay thế máy tính để bàn (Desktop Replacement) hùng mạnh bậc nhất của Dell với thiết kế Legend 3.0 huyền thoại và khung nhôm Anodized Dark Metallic Moon siêu ngầu.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz\",\"storage\":\"2TB PCIe NVMe M.2 SSD\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)\",\"display\":\"18.0 inch QHD+ (2560 x 1600) 165Hz 3ms, 100% DCI-P3, ComfortView Plus\",\"weight\":\"4.04 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Dell XPS 14 9440 Core Ultra 7 155H (16GB / 1TB / RTX 4050 / 3.2K OLED 120Hz Touch / 1.68kg)",
      "slug": "laptop-dell-xps-14-9440-oled",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["dell"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Tuyệt tác thiết kế kính liền mạch, Màn hình 3.2K OLED InfinityEdge cảm ứng, Touchpad vô hình haptic phản hồi lực.",
      "description": "Dell XPS 14 9440 là biểu tượng thời trang và sự sang trọng. Tích hợp thanh cảm ứng chức năng điện dung, kính cường lực Gorilla Glass 3 liền khối và sức mạnh đồ họa rời RTX 4050.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, NPU AI Boost)\",\"ram\":\"16GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4050 6GB GDDR6 (30W)\",\"display\":\"14.5 inch 3.2K (3200 x 2000) OLED Touch 120Hz, 100% DCI-P3\",\"weight\":\"1.68 Kg, Nhôm CNC nguyên khối Platinum\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming Dell Alienware x14 R2 Mỏng Nhất Thế Giới (Core i7-13620H / 16GB / 1TB / RTX 4060 / 165Hz)",
      "slug": "laptop-dell-alienware-x14-r2",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["dell"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Laptop gaming 14 inch mỏng nhất thế giới chỉ 14.5mm, Bản lề mô-men xoắn đôi độc quyền, Sạc Type-C GaN 130W.",
      "description": "Alienware x14 R2 đem lại sự tự do di chuyển tối đa cho game thủ với kích thước gọn gàng, độ mỏng ấn tượng trong khi vẫn duy trì hiệu năng chiến game đỉnh cao từ RTX 4060.",
      "specs": "{\"cpu\":\"Intel Core i7-13620H 10 nhân 16 luồng\",\"ram\":\"16GB LPDDR5 4800MHz\",\"storage\":\"1TB PCIe NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB (85W TGP)\",\"display\":\"14.0 inch QHD+ (2560 x 1600) 165Hz 3ms G-SYNC\",\"weight\":\"1.91 Kg, Độ mỏng 14.5mm\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Doanh Nhân Dell Latitude 9440 2-in-1 Core i7 vPro (32GB / 1TB / QHD+ Cảm Ứng / Bàn Phím Mini-LED)",
      "slug": "laptop-dell-latitude-9440-2in1",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["dell"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Đỉnh cao laptop doanh nghiệp cao cấp, Bàn phím Mini-LED tiết kiệm 75% điện năng, Touchpad phản hồi haptic với phím tắt họp trực tuyến Zoom.",
      "description": "Dell Latitude 9440 2-in-1 thiết kế dành riêng cho các lãnh đạo doanh nghiệp và chuyên gia cấp cao. Tính năng bảo mật SafeID phần cứng, camera IR nhận diện người dùng và vỏ nhôm CNC sang trọng.",
      "specs": "{\"cpu\":\"Intel Core i7-1365U vPro Enterprise 10 nhân\",\"ram\":\"32GB LPDDR5x\",\"storage\":\"1TB SSD NVMe Class 35\",\"display\":\"14.0 inch QHD+ (2560 x 1600) Cảm ứng xoay gập 360 độ 500 nits\",\"weight\":\"1.53 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Dell Vostro 5630 Core i7-1360P (16GB / 512GB / 16 inch FHD+ IPS / Bảo Mật Vân Tay e-Shield)",
      "slug": "laptop-dell-vostro-5630",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["dell"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Laptop văn phòng màn hình lớn 16 inch tỷ lệ 16:10, Vỏ nhôm thanh lịch, Bản lề nâng ErgoLift tản nhiệt tối ưu.",
      "description": "Dell Vostro 5630 là người bạn đồng hành tin cậy cho công việc hàng ngày với bàn phím số đầy đủ, camera Full HD chống nhiễu và chứng nhận phần cứng e-Shield bảo mật dữ liệu doanh nghiệp.",
      "specs": "{\"cpu\":\"Intel Core i7-1360P (12 nhân, 16 luồng, Turbo 5.0GHz)\",\"ram\":\"16GB LPDDR5 4800MHz\",\"storage\":\"512GB M.2 PCIe NVMe SSD\",\"display\":\"16.0 inch FHD+ (1920 x 1200) chống chói 300 nits\",\"weight\":\"1.90 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Doanh Nhân Lenovo ThinkPad X1 Carbon Gen 12 Core Ultra 7 155H (32GB / 1TB / 2.8K OLED / 1.09kg)",
      "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-12",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": true,
      "warrantyMonths": 36,
      "shortDesc": "Biểu tượng laptop doanh nhân thế giới, Trọng lượng siêu nhẹ chỉ 1.09kg từ sợi Carbon tái chế, Màn hình 2.8K OLED 120Hz.",
      "description": "ThinkPad X1 Carbon Gen 12 nâng tầm huyền thoại với bàn phím TrackPoint công thái học huyền thoại nay bổ sung tính năng nhấn đúp mở menu nhanh, camera 8MP sắc nét và chuẩn độ bền quân đội Mỹ MIL-STD-810H.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU AI)\",\"ram\":\"32GB LPDDR5X 7500MHz\",\"storage\":\"1TB PCIe Gen4 Performance SSD\",\"display\":\"14.0 inch 2.8K (2880 x 1800) OLED 120Hz, 100% DCI-P3, HDR 500\",\"weight\":\"1.09 Kg, Khung sợi carbon và hợp kim magie\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming Lenovo Legion 9i Core i9-14900HX (64GB DDR5 / 2TB / RTX 4090 175W / Tản Nhiệt Nước Tích Hợp)",
      "slug": "laptop-gaming-lenovo-legion-9i",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Laptop gaming đầu tiên thế giới có hệ thống tản nhiệt nước tích hợp bên trong, Mặt lưng sợi carbon đúc nguyên khối độc bản.",
      "description": "Lenovo Legion 9i là đỉnh cao công nghệ laptop gaming với hệ thống tản nhiệt nước đồng phát triển cùng Cooler Master, chip AI Lenovo LA-2 tối ưu hóa khung hình thời gian thực và màn hình 3.2K Mini-LED 165Hz.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz Dual-Channel\",\"storage\":\"2TB PCIe 4.0 NVMe SSD RAID 0\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W Max TGP)\",\"display\":\"16.0 inch 3.2K (3200 x 2000) Mini-LED 165Hz 100% Adobe RGB, 1200 nits\",\"weight\":\"2.56 Kg, Nắp lưng Carbon Forged độc nhất vô nhị\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Lenovo Yoga Slim 7x Snapdragon X Elite (32GB / 1TB / 3K OLED Touch 90Hz / NPU Copilot+ 45 TOPS / 1.28kg)",
      "slug": "laptop-lenovo-yoga-slim-7x-snapdragon",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Kỷ nguyên Copilot+ PC thế hệ mới, Chip Snapdragon X Elite 12 nhân, NPU AI 45 TOPS siêu tốc, Pin dùng 20 giờ liên tục.",
      "description": "Yoga Slim 7x là chiếc laptop Copilot+ PC mỏng nhẹ và thanh lịch hàng đầu. Trải nghiệm tốc độ xử lý AI tức thì mà không cần kết nối mạng internet, màn hình PureSight OLED 3K sống động và pin cực trâu.",
      "specs": "{\"cpu\":\"Qualcomm Snapdragon X Elite (12 nhân Oryon up to 4.2GHz, NPU 45 TOPS)\",\"ram\":\"32GB LPDDR5X 8448MHz\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"14.5 inch 3K (2944 x 1840) OLED Touch 90Hz, 100% DCI-P3, 1000 nits đỉnh HDR\",\"weight\":\"1.28 Kg, Vỏ nhôm màu Cosmic Blue mỏng 12.9mm\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Máy Trạm Lenovo ThinkBook 16p Gen 5 Core i9-14900HX (32GB / 1TB / RTX 4060 / 3.2K 165Hz Magic Bay)",
      "slug": "laptop-lenovo-thinkbook-16p-gen-5",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Máy trạm di động đa năng cho creator, Khe cắm phụ kiện nam châm Magic Bay độc quyền, Màn hình 3.2K 165Hz chuẩn màu X-Rite Pantone.",
      "description": "ThinkBook 16p Gen 5 mang lại sự kết hợp tuyệt vời giữa tính thanh lịch doanh nhân và sức mạnh render đồ họa máy trạm với hệ thống mô-đun gắn nhanh Magic Bay cực kỳ tiện lợi.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX 24 nhân 32 luồng\",\"ram\":\"32GB DDR5 5600MHz\",\"storage\":\"1TB PCIe NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB GDDR6 Studio\",\"display\":\"16.0 inch 3.2K 165Hz 100% DCI-P3 430 nits\",\"weight\":\"2.20 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop 2 Màn Hình Lenovo Yoga Book 9i (2x 13.3 inch 2.8K OLED / Core Ultra 7 155H / 16GB / 1TB)",
      "slug": "laptop-lenovo-yoga-book-9i-dual-oled",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Đột phá sáng tạo với 2 màn hình 13.3 inch PureSight OLED 2.8K, Loa thanh xoay Bowers & Wilkins xoay 360 độ, Tặng kèm bàn phím Bluetooth và bút Stylus.",
      "description": "Yoga Book 9i mở rộng trải nghiệm sáng tạo vô hạn với 2 màn hình cảm ứng OLED xếp dọc hoặc ngang, mang đến không gian làm việc kép ở bất kỳ nơi đâu bạn đến.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB SSD\",\"display\":\"2x 13.3 inch 2.8K (2880 x 1800) OLED Touch 400 nits\",\"weight\":\"1.34 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Motorola Edge 50 Ultra by Lenovo 16GB/512GB (Mặt Lưng Gỗ Thật / Snapdragon 8s Gen 3 / 144Hz)",
      "slug": "dien-thoai-lenovo-motorola-edge-50-ultra",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Thiết kế mặt lưng gỗ tự nhiên đạt chứng nhận FSC siêu sang, Màn hình cong viền Super HD 144Hz, Sạc siêu tốc 125W TurboPower.",
      "description": "Motorola Edge 50 Ultra (thương hiệu thuộc tập đoàn Lenovo) là siêu phẩm smartphone cao cấp với chất liệu tự nhiên gỗ thật và da thuần chay, camera tiềm vọng 64MP 3x và sạc đầy pin chỉ trong 18 phút.",
      "specs": "{\"screen\":\"6.7 inch Super HD (2712 x 1220) pOLED 144Hz 2500 nits, Pantone Validated\",\"cpu\":\"Snapdragon 8s Gen 3 (4nm)\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"512GB UFS 4.0\",\"camera\":\"Chính 50MP OIS + Tele tiềm vọng 64MP 3x OIS + Góc rộng 50MP Macro\",\"battery\":\"4500mAh, sạc nhanh 125W dây, sạc không dây 50W, kháng nước IP68\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Doanh Nghiệp ThinkPhone 25 by Lenovo (Đồng Bộ ThinkPad / Sợi Carbon Aramid / MIL-STD-810H)",
      "slug": "dien-thoai-lenovo-thinkphone-25",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Smartphone bảo mật tối cao cho doanh nghiệp, Kết nối 1 chạm Think 2 Think với laptop ThinkPad, Mặt lưng sợi Aramid siêu bền chống đạn.",
      "description": "ThinkPhone 25 by Lenovo mang trọn vẹn gen bảo mật và độ bền chuẩn ThinkPad vào smartphone. Phần cứng bảo mật Moto KeySafe độc lập và khả năng biến điện thoại thành webcam máy tính hay màn hình phụ.",
      "specs": "{\"screen\":\"6.36 inch pOLED 120Hz LTPO kính Gorilla Glass 7i\",\"cpu\":\"MediaTek Dimensity 7300\",\"security\":\"ThinkShield for mobile, Chuẩn chống rơi vỡ MIL-STD-810H & IP68\",\"battery\":\"4310mAh, sạc nhanh 68W\",\"weight\":\"171 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Điện Thoại Gaming Lenovo Legion Y90 18GB/640GB (Snapdragon 8 Gen 1 / Quạt Tản Nhiệt Đôi / SSD RAID 0)",
      "slug": "dien-thoai-lenovo-legion-y90",
      categoryId: categories["dien-thoai"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": false,
      "warrantyMonths": 12,
      "shortDesc": "Kiến trúc tản nhiệt quạt cơ học kép Frost Blade 3.0, Ổ cứng kép UFS + SSD RAID 0 siêu tốc độ, 4 phím cảm ứng lực vai AirTrigger.",
      "description": "Lenovo Legion Y90 là chiếc điện thoại gaming hầm hố bậc nhất với hệ thống quạt gió chủ động hút khí mát giải nhiệt trực tiếp cho bo mạch chủ, mang lại FPS ổn định tuyệt đối trong các giải đấu chuyên nghiệp.",
      "specs": "{\"screen\":\"6.92 inch Samsung E4 AMOLED 144Hz 720Hz touch sampling rate\",\"cpu\":\"Snapdragon 8 Gen 1\",\"ram\":\"18GB LPDDR5\",\"storage\":\"640GB (512GB UFS 3.1 + 128GB SSD)\",\"battery\":\"5600mAh, sạc đôi 68W sạc đầy 35 phút\",\"cooling\":\"Quạt tản nhiệt kép tốc độ cao + buồng hơi VC\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Máy Chơi Game Cầm Tay Lenovo Legion Go AMD Ryzen Z1 Extreme (16GB LPDDR5X / 512GB / 8.8 inch QHD+ 144Hz)",
      "slug": "may-choi-game-lenovo-legion-go",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["lenovo"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Màn hình cảm ứng 8.8 inch QHD+ 144Hz lớn nhất phân khúc, Tay cầm Legion TrueStrike tháo rời tích hợp chế độ chuột FPS chuột quang.",
      "description": "Lenovo Legion Go biến mọi cuộc phiêu lưu gaming PC thành di động. Màn hình 8.8 inch cực lớn, tay cầm có thể tháo rời để biến thành chuột quang bắn súng FPS chính xác đến từng milimet.",
      "specs": "{\"cpu\":\"AMD Ryzen Z1 Extreme (8 nhân, 16 luồng, RDNA 3 graphics 12 CUs)\",\"ram\":\"16GB LPDDR5X 7500MHz\",\"storage\":\"512GB PCIe 4.0 NVMe SSD\",\"display\":\"8.8 inch QHD+ (2560 x 1600) IPS 144Hz 500 nits 97% DCI-P3\",\"battery\":\"49.2WHr, sạc nhanh Super Rapid Charge 65W\",\"weight\":\"854 gram (640g thân máy)\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming MSI Titan 18 HX A14V Core i9-14900HX (128GB DDR5 / 4TB SSD RAID / RTX 4090 175W / 18 inch 4K Mini-LED 120Hz)",
      "slug": "laptop-msi-titan-18-hx-a14v",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Ông hoàng laptop gaming thế giới, Touchpad RGB Haptic liền khối đổi màu huyền ảo, Bàn phím cơ Cherry MX Ultra Low Profile, 128GB RAM DDR5.",
      "description": "MSI Titan 18 HX là tuyệt tác laptop gaming mạnh nhất lịch sử với 128GB RAM DDR5 và 4TB SSD. Màn hình 18 inch 4K Mini-LED 120Hz chuẩn rạp chiếu phim và hệ thống tản nhiệt buồng hơi cỡ đại.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, 5.8GHz)\",\"ram\":\"128GB DDR5 5600MHz (4 khe RAM)\",\"storage\":\"4TB (2x 2TB PCIe Gen 5x4 SSD RAID 0)\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP, MSI OverBoost Ultra 270W)\",\"display\":\"18.0 inch 4K (3840 x 2400) 120Hz Mini-LED, 100% DCI-P3, HDR 1000\",\"weight\":\"3.60 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming MSI Raider GE78 HX Core i9-14900HX (32GB DDR5 / 2TB / RTX 4080 / QHD+ 240Hz / Thanh LED Matrix)",
      "slug": "laptop-msi-raider-ge78-hx",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Dải đèn LED Matrix Aurora mặt trước độc nhất, Tản nhiệt Cooler Boost 5 2 quạt 6 ống dẫn nhiệt, Hệ thống 6 loa Dynaudio đỉnh cao.",
      "description": "MSI Raider GE78 HX được thiết kế cho những game thủ yêu thích phong cách tương lai Cyberpunk với dải đèn LED ma trận rực rỡ và hiệu năng đồ họa cực khủng từ RTX 4080.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX\",\"ram\":\"32GB DDR5 5600MHz\",\"storage\":\"2TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4080 12GB (175W TGP)\",\"display\":\"17.0 inch QHD+ (2560 x 1600) 240Hz 100% DCI-P3\",\"weight\":\"3.10 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Siêu Mỏng MSI Stealth 16 AI Studio Core Ultra 9 185H (32GB / 1TB / RTX 4070 Studio / QHD+ 240Hz / 1.99kg)",
      "slug": "laptop-msi-stealth-16-ai-studio",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Khung vỏ hợp kim Nhôm - Magie siêu nhẹ chỉ 1.99kg và mỏng 19.9mm, Chứng nhận NVIDIA Studio Driver cho sáng tạo nội dung chuyên nghiệp.",
      "description": "MSI Stealth 16 AI Studio là sự giao thoa hoàn mỹ giữa laptop mỏng nhẹ doanh nhân và máy trạm đồ họa RTX 4070, trang bị cụm NPU Intel AI Boost tăng tốc trí tuệ nhân tạo.",
      "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, 22 luồng)\",\"ram\":\"32GB DDR5\",\"storage\":\"1TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4070 8GB GDDR6 Studio\",\"display\":\"16.0 inch QHD+ (2560 x 1600) 240Hz 100% DCI-P3\",\"weight\":\"1.99 Kg, Màu Star Blue thanh lịch\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Doanh Nhân MSI Prestige 16 AI Evo Core Ultra 7 155H (32GB / 1TB / 4K OLED / Pin 99.9Wh / 1.5kg)",
      "slug": "laptop-msi-prestige-16-ai-evo",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["msi"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Đạt chuẩn Intel Evo cao cấp, Pin dung lượng khủng 99.9Wh tối đa quy định hàng không, Màn hình 4K OLED siêu mịn, Vỏ nhôm 1.5kg.",
      "description": "MSI Prestige 16 AI Evo thiết kế dành cho các nhà lãnh đạo và chuyên viên với thời lượng pin kỷ lục hơn 16 giờ làm việc, màn hình 4K OLED rực rỡ và cổng kết nối Thunderbolt 4 tốc độ cao.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"32GB LPDDR5\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"16.0 inch 4K (3840 x 2400) OLED 100% DCI-P3 400 nits\",\"weight\":\"1.50 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming MSI Cyborg 15 AI Core Ultra 7 155H (16GB / 512GB / RTX 4060 / Vỏ Trong Suốt Cyberpunk)",
      "slug": "laptop-msi-cyborg-15-ai",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Vỏ máy xuyên thấu phong cách viễn tưởng Cyberpunk độc nhất, Bàn phím WASD nổi bật neon, Hiệu năng gaming AI vượt trội.",
      "description": "MSI Cyborg 15 AI sở hữu các chi tiết vỏ trong suốt để lộ linh kiện cơ khí bên trong độc đáo, kết hợp sức mạnh RTX 4060 và chip Core Ultra 7 tối ưu cho game thủ trẻ.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"16GB DDR5 5600MHz\",\"storage\":\"512GB PCIe NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB GDDR6\",\"display\":\"15.6 inch FHD 144Hz IPS\",\"weight\":\"1.98 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming MSI Katana 15 B13V Core i7-13620H (16GB / 1TB / RTX 4050 6GB / 144Hz)",
      "slug": "laptop-msi-katana-15-b13v",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Cảm hứng kiếm sĩ Katana huyền thoại Nhật Bản, Bàn phím 4 vùng RGB phím số tiện lợi, RTX 4050 6GB chơi mượt Valorant, CS2.",
      "description": "MSI Katana 15 B13V là biểu tượng vũ khí sắc bén cho game thủ eSports với tản nhiệt Cooler Boost 5 mạnh mẽ và bàn phím bấm cực nảy.",
      "specs": "{\"cpu\":\"Intel Core i7-13620H 10 nhân 16 luồng\",\"ram\":\"16GB DDR5\",\"storage\":\"1TB SSD NVMe\",\"vga\":\"NVIDIA GeForce RTX 4050 6GB (105W)\",\"display\":\"15.6 inch FHD 144Hz IPS Level\",\"weight\":\"2.25 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Máy Chơi Game Cầm Tay MSI Claw A1M Core Ultra 7 155H (16GB / 512GB / Màn Hình 7 inch FHD 120Hz VRR / Intel XeSS AI)",
      "slug": "may-choi-game-msi-claw-a1m",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Máy chơi game PC cầm tay đầu tiên chạy chip Intel Core Ultra 7, Công nghệ siêu lấy mẫu Intel XeSS, Cần Analog Hall Effect chống trôi.",
      "description": "MSI Claw A1M mở ra kỷ nguyên chơi game di động mới với thiết kế công thái học ôm sát lòng bàn tay, hệ thống tản nhiệt Cooler Boost HyperFlow và pin 53Wh lớn nhất phân khúc.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H (16 nhân, NPU AI)\",\"ram\":\"16GB LPDDR5 6400MHz\",\"storage\":\"512GB PCIe 4.0 NVMe SSD\",\"display\":\"7.0 inch FHD (1920 x 1080) IPS 120Hz VRR cảm ứng 500 nits\",\"battery\":\"53WHr, sạc Type-C 65W PD\",\"weight\":\"675 gram\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Máy Trạm Chuyên Nghiệp MSI CreatorPro X18 HX Core i9-14900HX (64GB / 2TB / NVIDIA RTX 3500 Ada 12GB)",
      "slug": "laptop-msi-creatorpro-x18-hx",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["msi"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Máy trạm di động đạt chuẩn chứng nhận ISV hàng đầu, GPU chuyên nghiệp NVIDIA RTX 3500 Ada 12GB ECC, Màn hình 18 inch 4K Mini-LED.",
      "description": "MSI CreatorPro X18 HX dành riêng cho các kỹ sư kiến trúc, thiết kế mô hình 3D SolidWorks, mô phỏng ô tô và xử lý AI với độ chính xác và tính toàn vẹn dữ liệu tuyệt đối.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX 24 nhân 32 luồng\",\"ram\":\"64GB DDR5 ECC (nâng cấp tối đa 192GB)\",\"storage\":\"2TB NVMe PCIe 5.0 SSD\",\"vga\":\"NVIDIA RTX 3500 Ada Generation 12GB GDDR6 ECC\",\"display\":\"18.0 inch 4K Mini-LED 120Hz 100% DCI-P3\",\"weight\":\"3.60 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Văn Phòng Mỏng Nhẹ MSI Modern 14 C13M Core i5-1335U (16GB / 512GB / 14 inch FHD IPS / 1.4kg)",
      "slug": "laptop-msi-modern-14-c13m",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["msi"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Laptop học tập và văn phòng nhỏ gọn 1.4kg, Vỏ nhôm thanh lịch, Bản lề mở phẳng 180 độ tính năng lật màn hình Flip-n-Share.",
      "description": "MSI Modern 14 C13M mang phong cách tối giản thời thượng, hiệu năng ổn định từ vi xử lý Intel Core thế hệ 13 và hành trình phím 1.5mm gõ cực kỳ êm ái.",
      "specs": "{\"cpu\":\"Intel Core i5-1335U 10 nhân 12 luồng\",\"ram\":\"16GB DDR4 onboard\",\"storage\":\"512GB M.2 NVMe SSD\",\"display\":\"14.0 inch FHD (1920 x 1080) IPS-Level 300 nits\",\"weight\":\"1.40 Kg, Màu Classic Black\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Máy Chơi Game Cầm Tay Logitech G Cloud Gaming Handheld (Màn 7 inch FHD 60fps / Pin 12 Giờ / Xbox Cloud & GeForce NOW)",
      "slug": "may-choi-game-logitech-g-cloud",
      categoryId: categories["chuot-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Máy chơi game đám mây cao cấp, Màn hình cảm ứng 7 inch Full HD 60Hz 450 nits, Pin siêu khủng hơn 12 giờ chơi liên tục, Trọng lượng siêu nhẹ chỉ 463g.",
      "description": "Logitech G Cloud đưa trải nghiệm chơi game AAA lên tầm cao mới thông qua công nghệ đám mây Xbox Cloud Gaming và NVIDIA GeForce NOW. Cần điều khiển và nút bấm chuẩn eSports chính xác tuyệt đối.",
      "specs": "{\"screen\":\"7.0 inch IPS Full HD (1920 x 1080) 60Hz 16:9 cảm ứng 450 nits\",\"cpu\":\"Qualcomm Snapdragon 720G\",\"ram\":\"4GB LPDDR4X\",\"storage\":\"64GB UFS (hỗ trợ khe cắm thẻ nhớ microSD mở rộng)\",\"battery\":\"6000mAh, thời lượng pin liên tục hơn 12 giờ, sạc Type-C\",\"weight\":\"463 gram, Tay cầm công thái học siêu nhẹ\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Chuột Công Thái Học Không Dây Logitech MX Master 3S (Cảm Biến 8000 DPI Darkfield / Con Lăn MagSpeed Điện Từ)",
      "slug": "chuot-logitech-mx-master-3s",
      categoryId: categories["chuot-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Vua chuột văn phòng công thái học, Click chuột siêu êm Quiet Clicks giảm 90% tiếng ồn, Di chuyển mượt mà trên mọi bề mặt kể cả mặt kính trong suốt.",
      "description": "Logitech MX Master 3S là trợ thủ đắc lực nhất cho các lập trình viên, designer và chuyên gia phân tích dữ liệu. Con lăn điện từ MagSpeed cuộn 1000 dòng trong 1 giây.",
      "specs": "{\"sensor\":\"Darkfield độ chính xác cao 8000 DPI\",\"clicks\":\"Quiet Click siêu êm\",\"wheel\":\"MagSpeed điện từ SmartShift tự động chuyển tốc\",\"battery\":\"Pin sạc dùng 70 ngày, sạc nhanh 1 phút dùng 3 giờ\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Bàn Phím Cơ Không Dây Logitech MX Mechanical Mini (Switch Tactile Quiet / Kết Nối 3 Thiết Bị Easy-Switch)",
      "slug": "ban-phim-logitech-mx-mechanical-mini",
      categoryId: categories["ban-phim-co"].id,
      brandId: brands["logitech"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Switch cơ học phím thấp Low Profile bấm êm ái, Đèn nền thông minh tự sáng khi tay đến gần, Kết nối đa nền tảng Windows, macOS, iPadOS.",
      "description": "Logitech MX Mechanical Mini mang lại cảm giác gõ phím cơ đầm chắc và nhanh chóng trong kích thước nhỏ gọn 75%, tối ưu hóa diện tích bàn làm việc hiện đại.",
      "specs": "{\"switch\":\"Tactile Quiet cơ học low profile\",\"battery\":\"Dùng 15 ngày có đèn nền, 10 tháng tắt đèn nền\",\"connectivity\":\"Bluetooth Low Energy & Logi Bolt USB\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Tai Nghe Gaming Không Dây Logitech G Pro X 2 LIGHTSPEED (Màng Loa Graphene 50mm / Pin 50 Giờ)",
      "slug": "tai-nghe-logitech-g-pro-x-2-lightspeed",
      categoryId: categories["tai-nghe-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Màng loa Graphene 50mm đầu tiên trên thế giới cho âm thanh chuẩn xác đến từng tiếng bước chân, Công nghệ LIGHTSPEED 2.4GHz không độ trễ.",
      "description": "Tai nghe gaming thi đấu đỉnh cao được các game thủ eSports hàng đầu thế giới tin dùng. Micro rời 6mm công nghệ lọc âm Blue VO!CE mang lại giọng nói trong trẻo tuyệt đối.",
      "specs": "{\"driver\":\"Graphene 50mm tái tạo âm thanh không biến dạng\",\"battery\":\"50 giờ chơi liên tục, cổng sạc Type-C\",\"weight\":\"345 gram, Đệm tai cao su non êm ái\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Webcam Chuyên Nghiệp Logitech StreamCam Full HD 60fps (Cổng Type-C / Tự Động Lấy Nét & Phơi Sáng AI)",
      "slug": "webcam-logitech-streamcam-fhd",
      categoryId: categories["tai-nghe-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Độ phân giải 1080p 60fps siêu mượt, Ống kính thủy tinh cao cấp góc rộng 78 độ, Khả năng xoay chuyển 90 độ quay video dọc TikTok, YouTube Shorts.",
      "description": "Logitech StreamCam sinh ra dành cho các nhà sáng tạo nội dung và streamer chuyên nghiệp với tính năng tự động canh khung hình AI theo khuôn mặt.",
      "specs": "{\"resolution\":\"1080p / 60fps Full HD\",\"focus\":\"Tự động lấy nét và phơi sáng AI thông minh\",\"mic\":\"Micro stereo kép tích hợp màng lọc giảm tiếng ồn\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Micro Thu Âm Chuyên Nghiệp Logitech Yeti GX Dynamic RGB (Công Nghệ Lọc Âm Blue VO!CE / Đèn Nền LIGHTSYNC)",
      "slug": "micro-logitech-yeti-gx-rgb",
      categoryId: categories["tai-nghe-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Củ mic Dynamic định hướng supercardioid chống tạp âm bàn phím cơ, Bộ giới hạn analog Smart Audio Lock tránh vỡ tiếng khi hô hào hưng phấn.",
      "description": "Yeti GX mang chất âm phòng thu chuyên nghiệp của huyền thoại Blue Microphone vào thiết kế gaming RGB đậm chất công nghệ cho góc livestream.",
      "specs": "{\"capsule\":\"Dynamic Capsule định hướng Supercardioid\",\"bitrate\":\"24-bit / 96kHz âm thanh phòng thu\",\"lighting\":\"LIGHTSYNC RGB 2 vùng phát sáng\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Tai Nghe Đàm Thoại Không Dây Cao Cấp Logitech Zone Wireless 2 (Chống Ồn Chủ Động ANC 4 Micro AI)",
      "slug": "tai-nghe-logitech-zone-wireless-2",
      categoryId: categories["tai-nghe-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Khử tiếng ồn 2 chiều Advanced Call Clarity ứng dụng trí tuệ nhân tạo, Chứng nhận Microsoft Teams và Zoom, Đệm tai thoáng khí cả ngày.",
      "description": "Logitech Zone Wireless 2 là giải pháp liên lạc cao cấp nhất cho các giám đốc và chuyên gia làm việc từ xa, lọc sạch 100% tiếng ồn xung quanh của người nói.",
      "specs": "{\"anc\":\"Chống ồn chủ động lai Hybrid ANC\",\"mic\":\"4 micro khử ồn AI lọc âm người nói\",\"battery\":\"Thời gian đàm thoại 15 giờ liên tục khi bật ANC\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Đèn Chiếu Sáng Livestream Logitech Litra Glow TrueSoft (Bảo Vệ Mắt / Điều Khiển Qua App G HUB)",
      "slug": "den-logitech-litra-glow-streaming",
      categoryId: categories["tai-nghe-gaming"].id,
      brandId: brands["logitech"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Công nghệ ánh sáng TrueSoft cân bằng sắc thái da tự nhiên, Bộ khuếch tán không viền chống chói mỏi mắt, Ngàm gắn màn hình đa khớp xoay 3 chiều.",
      "description": "Logitech Litra Glow mang ánh sáng studio chuyên nghiệp rực rỡ đến bàn làm việc của bạn mà hoàn toàn không gây chói mắt hay nhức mỏi qua hàng giờ livestream liên tục.",
      "specs": "{\"light\":\"TrueSoft LED toàn phổ CRI 93\",\"temp\":\"Nhiệt độ màu tùy chỉnh 2700K - 6500K\",\"power\":\"Cấp nguồn trực tiếp qua cổng USB Type-C\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop AI Workstation NVIDIA RTX Studio Reference Core i9 (64GB / 2TB / NVIDIA RTX 5000 Ada 16GB / 4K OLED)",
      "slug": "laptop-nvidia-rtx-studio-ai-titan",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": true,
      "warrantyMonths": 36,
      "shortDesc": "Mẫu laptop máy trạm tham chiếu chính hãng NVIDIA, Trang bị GPU chuyên nghiệp RTX 5000 Ada 16GB ECC, Màn hình 4K OLED HDR chuyên dụng cho GenAI.",
      "description": "NVIDIA RTX Studio Reference Laptop được các kỹ sư NVIDIA tối ưu hóa trực tiếp cho các mô hình ngôn ngữ lớn LLM cục bộ, khuếch đại tính toán Tensor Core và xử lý mô phỏng Omniverse thời gian thực.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, 5.8GHz)\",\"ram\":\"64GB DDR5 5600MHz ECC\",\"storage\":\"2TB PCIe Gen 5 NVMe SSD (12000 MB/s)\",\"vga\":\"NVIDIA RTX 5000 Ada Generation Laptop GPU 16GB GDDR6 ECC (175W)\",\"display\":\"16.0 inch 4K (3840 x 2400) OLED 120Hz, 100% DCI-P3, Delta E < 1\",\"weight\":\"2.35 Kg, Vỏ nhôm nguyên khối Graphite Gray\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming Siêu Cấp Razer Blade 16 Powered by NVIDIA RTX 4090 (i9-14900HX / 32GB / 2TB / Dual-Mode Mini-LED)",
      "slug": "laptop-razer-blade-16-nvidia-rtx4090",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Sức mạnh đồ họa đỉnh cao từ NVIDIA RTX 4090 175W, Màn hình Mini-LED kép chuyển đổi giữa 4K 120Hz và FHD+ 240Hz, Nhôm CNC nguyên khối T6.",
      "description": "Razer Blade 16 kết hợp công nghệ siêu lấy mẫu DLSS 3.5 và tạo khung hình bằng AI của NVIDIA với màn hình Dual-Mode độc nhất thế giới, cho phép chơi game FPS ở 240Hz hoặc làm đồ họa ở chuẩn 4K siêu nét.",
      "specs": "{\"cpu\":\"Intel Core i9-14900HX\",\"ram\":\"32GB DDR5 5600MHz\",\"storage\":\"2TB PCIe 4.0 SSD\",\"vga\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)\",\"display\":\"16.0 inch Dual-Mode Mini-LED (UHD+ 120Hz / FHD+ 240Hz), 1000 nits\",\"weight\":\"2.45 Kg, Nhôm CNC Anodized chống vân tay\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Card Màn Hình NVIDIA GeForce RTX 4090 24GB Founders Edition (Bản Gốc Giới Hạn NVIDIA)",
      "slug": "vga-nvidia-geforce-rtx-4090-founders",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": true,
      "warrantyMonths": 36,
      "shortDesc": "Thiết kế quạt hút đẩy đối lưu hai chiều trứ danh của NVIDIA, 16.384 nhân CUDA, 24GB VRAM GDDR6X 384-bit siêu nhanh.",
      "description": "NVIDIA GeForce RTX 4090 Founders Edition là biểu tượng đồ họa tối cao của kiến trúc Ada Lovelace. Vỏ hợp kim đúc nguyên khối màu xám kim loại cùng khả năng render 4K/8K và AI mượt mà tuyệt đối.",
      "specs": "{\"cuda\":\"16.384 CUDA Cores, 512 Tensor Cores thế hệ 4\",\"vram\":\"24GB GDDR6X 384-bit (1008 GB/s)\",\"power\":\"450W (Yêu cầu nguồn 850W+, 1x 16-pin 12VHPWR)\",\"ports\":\"3x DisplayPort 1.4a, 1x HDMI 2.1a\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Card Màn Hình NVIDIA GeForce RTX 4080 SUPER 16GB Founders Edition",
      "slug": "vga-nvidia-geforce-rtx-4080-super-founders",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": true,
      "warrantyMonths": 36,
      "shortDesc": "10.240 nhân CUDA, 16GB VRAM GDDR6X 256-bit tốc độ 23Gbps, Tiết kiệm điện năng vượt trội, Chiến mượt game 4K Ray Tracing.",
      "description": "RTX 4080 SUPER Founders Edition nâng cấp băng thông bộ nhớ và xung nhịp xử lý, đem lại trải nghiệm chơi game 4K đỉnh cao cùng công nghệ DLSS 3 Frame Generation.",
      "specs": "{\"cuda\":\"10.240 Cores, 320 Tensor Cores\",\"vram\":\"16GB GDDR6X 256-bit (736 GB/s)\",\"power\":\"320W\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Card Đồ Họa Máy Trạm Chuyên Nghiệp NVIDIA RTX 6000 Ada Generation 48GB GDDR6 ECC",
      "slug": "vga-nvidia-rtx-6000-ada-48gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": true,
      "warrantyMonths": 36,
      "shortDesc": "Đỉnh cao card đồ họa workstation, 48GB VRAM ECC tự sửa lỗi, 18.176 nhân CUDA, Tối ưu hóa cho LLM AI Training và Omniverse Enterprise.",
      "description": "NVIDIA RTX 6000 Ada Generation là vũ khí tối thượng cho các trung tâm nghiên cứu AI, xưởng phim kỹ xảo điện ảnh Hollywood và kỹ thuật mô phỏng khí động học công nghiệp.",
      "specs": "{\"cuda\":\"18.176 CUDA Cores, 568 Tensor Cores thế hệ 4\",\"vram\":\"48GB GDDR6 có sửa lỗi ECC (960 GB/s)\",\"power\":\"300W Max TDP (Tản nhiệt lồng sóc Blower chuyên dụng cho rack server)\",\"interface\":\"PCIe 4.0 x16, 4x DisplayPort 1.4a\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Card Màn Hình Chuyên Nghiệp NVIDIA RTX 4000 SFF Ada Generation 20GB GDDR6",
      "slug": "vga-nvidia-rtx-4000-ada-sff-20gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Thiết kế nhỏ gọn Small Form Factor chiếm 2 khe mỏng, Công suất chỉ 70W siêu tiết kiệm điện, 20GB VRAM ECC chuyên nghiệp.",
      "description": "RTX 4000 SFF Ada đem lại hiệu năng tính toán AI và đồ họa đáng kinh ngạc trong các thùng máy nhỏ gọn mini-ITX và máy trạm nhỏ hẹp.",
      "specs": "{\"cuda\":\"6.144 CUDA Cores\",\"vram\":\"20GB GDDR6 ECC\",\"power\":\"70W (Không cần cấp nguồn phụ)\",\"ports\":\"4x Mini-DisplayPort 1.4a\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Thiết Bị Giải Trí Android TV NVIDIA Shield TV Pro 4K HDR (Vi Xử Lý Tegra X1+ / AI Upscaling 4K)",
      "slug": "thiet-bi-nvidia-shield-tv-pro-4k",
      categoryId: categories["tai-nghe-gaming"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": true,
      "warrantyMonths": 12,
      "shortDesc": "Đầu phát Android TV mạnh nhất thế giới, Nâng cấp video lên 4K bằng trí tuệ nhân tạo AI thời gian thực, Hỗ trợ Dolby Vision & Dolby Atmos.",
      "description": "NVIDIA Shield TV Pro biến phòng khách thành rạp chiếu phim tại gia đỉnh cao với khả năng giải mã âm thanh lossless Dolby TrueHD và chơi game đám mây GeForce NOW ở độ phân giải 4K 120fps.",
      "specs": "{\"cpu\":\"NVIDIA Tegra X1+ với GPU NVIDIA 256 nhân\",\"ram\":\"3GB RAM, 16GB bộ nhớ trong (mở rộng USB)\",\"video\":\"4K HDR, Dolby Vision, HDR10, AI Upscaling 4K\",\"audio\":\"Dolby Atmos, DTS-X, DTS-HD MA passthrough\",\"connectivity\":\"Gigabit Ethernet, Wi-Fi AC 2x2 MIMO, 2x USB 3.0\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Máy Chủ Tăng Tốc AI NVIDIA L40S 48GB PCIe (Kiến Trúc Ada Lovelace Xử Lý GenAI & LLM)",
      "slug": "server-gpu-nvidia-l40s-48gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Card tăng tốc trung tâm dữ liệu data center toàn năng, 48GB VRAM GDDR6 ECC, Hiệu năng suy luận AI Inference nhanh gấp 5 lần thế hệ trước.",
      "description": "NVIDIA L40S là giải pháp máy chủ điện toán GPU phổ quát mạnh mẽ nhất cho các công ty khởi nghiệp AI và trung tâm dữ liệu đám mây để huấn luyện fine-tuning và chạy mô hình Generative AI 24/7.",
      "specs": "{\"cuda\":\"18.176 CUDA Cores, 568 Tensor Cores thế hệ 4\",\"vram\":\"48GB GDDR6 ECC (864 GB/s)\",\"power\":\"350W TDP tản nhiệt thụ động chuyên dụng cho máy chủ 2U/4U\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Bộ Kit Nhúng AI Robot & Xe Tự Hành NVIDIA Jetson AGX Orin Developer Kit 64GB (275 TOPS AI)",
      "slug": "kit-nhung-nvidia-jetson-agx-orin-64gb",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Siêu máy tính nhúng AI kích thước bàn tay, Sức mạnh tính toán 275 TOPS AI, Tối ưu cho robot tự hành AMR, thị giác máy tính và drone.",
      "description": "NVIDIA Jetson AGX Orin 64GB mang sức mạnh của siêu máy tính AI vào thiết bị nhúng nhỏ gọn với công suất chỉ 15W - 60W, được hỗ trợ bởi bộ phần mềm NVIDIA Isaac và Metropolis.",
      "specs": "{\"ai\":\"275 TOPS tính toán suy luận AI (INT8)\",\"gpu\":\"2048 nhân NVIDIA Ampere với 64 Tensor Cores\",\"cpu\":\"12 nhân ARM Cortex-A78AE 64-bit\",\"ram\":\"64GB 256-bit LPDDR5 (204.8 GB/s)\",\"storage\":\"64GB eMMC 5.1\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Card Màn Hình NVIDIA GeForce RTX 4070 Ti SUPER 16GB Founders Edition",
      "slug": "vga-nvidia-geforce-rtx-4070-ti-super-fe",
      categoryId: categories["vga-card-man-hinh"].id,
      brandId: brands["nvidia"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Nâng cấp lên 16GB VRAM GDDR6X 256-bit rộng rãi, 8.448 nhân CUDA, Giải pháp tối ưu hàng đầu cho màn hình 2K 240Hz và 4K Gaming.",
      "description": "RTX 4070 Ti SUPER đem lại tỷ lệ hiệu năng trên giá thành xuất sắc với dung lượng bộ nhớ đồ họa 16GB lý tưởng cho cả chơi game AAA nặng nhất và render video 4K.",
      "specs": "{\"cuda\":\"8.448 CUDA Cores, 264 Tensor Cores\",\"vram\":\"16GB GDDR6X 256-bit (672 GB/s)\",\"power\":\"285W\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Samsung Galaxy Book3 360 Core i5-1335U (16GB / 512GB / Màn AMOLED Cảm Ứng S-Pen 2-in-1)",
      "slug": "laptop-samsung-galaxy-book3-360",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["samsung"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Bản lề xoay gập 360 độ, Màn hình Super AMOLED cảm ứng đa điểm hỗ trợ bút S-Pen, Trọng lượng siêu nhẹ chỉ 1.16kg.",
      "description": "Galaxy Book3 360 kết hợp giữa sự cơ động của máy tính bảng và sức mạnh của laptop mỏng nhẹ. Màn hình AMOLED sống động cho góc nhìn rộng và màu sắc rực rỡ chuẩn điện ảnh.",
      "specs": "{\"cpu\":\"Intel Core i5-1335U (10 nhân, 12 luồng, Turbo 4.6GHz)\",\"ram\":\"16GB LPDDR4X onboard\",\"storage\":\"512GB PCIe NVMe SSD\",\"display\":\"13.3 inch FHD Super AMOLED Touch 120% DCI-P3 kèm bút S-Pen\",\"weight\":\"1.16 Kg, Vỏ nhôm màu Graphite\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop ASUS ProArt P16 Studio OLED H7606 Core Ultra 9 185H (32GB / 1TB / RTX 4070 / 4K OLED 120Hz Touch)",
      "slug": "laptop-asus-proart-p16-studio-oled",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["asus"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Máy trạm đồ họa chuyên nghiệp cho Creator, Núm xoay cơ học vật lý ASUS DialPad tích hợp trên touchpad, RTX 4070 Studio 105W.",
      "description": "ASUS ProArt P16 Studio OLED được sinh ra cho các đạo diễn hình ảnh, kiến trúc sư và nhà thiết kế 3D. Núm xoay ảo DialPad độc quyền điều khiển mượt mà trong Photoshop, Premiere và After Effects.",
      "specs": "{\"cpu\":\"Intel Core Ultra 9 185H (16 nhân, NPU AI)\",\"ram\":\"32GB LPDDR5X 7467MHz\",\"storage\":\"1TB PCIe Gen 4.0 NVMe SSD\",\"vga\":\"NVIDIA GeForce RTX 4070 8GB GDDR6 (NVIDIA Studio Driver)\",\"display\":\"16.0 inch 4K (3840 x 2400) Lumina OLED 120Hz Touch, 100% DCI-P3, Delta E < 1\",\"weight\":\"1.85 Kg, Vỏ nhôm Nano Black chống bám bẩn\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Doanh Nhân ASUS ExpertBook B9 OLED B9403 Core i7-1355U vPro (32GB / 1TB / Mỏng 990g)",
      "slug": "laptop-asus-expertbook-b9-oled",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["asus"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Laptop doanh nhân 14 inch OLED nhẹ nhất thế giới chỉ 990 gram, Hợp kim Magie - Liti cao cấp, Chuẩn bảo mật sinh trắc học và TPM 2.0.",
      "description": "ExpertBook B9 OLED là biểu tượng sang trọng cho các giám đốc điều hành với trọng lượng nhẹ hơn 1kg nhưng thời lượng pin bền bỉ cả ngày dài và màn hình OLED 16:10 rực rỡ.",
      "specs": "{\"cpu\":\"Intel Core i7-1355U vPro Enterprise 10 nhân\",\"ram\":\"32GB LPDDR5\",\"storage\":\"1TB PCIe Gen4 SSD\",\"display\":\"14.0 inch 2.8K (2880 x 1800) OLED 90Hz, 100% DCI-P3 400 nits\",\"weight\":\"990 gram, Khung hợp kim Magie - Liti\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming MSI Sword 16 HX B14V Core i7-14700HX (16GB / 1TB / RTX 4060 115W / 144Hz)",
      "slug": "laptop-msi-sword-16-hx-b14v",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["msi"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Bàn phím RGB 24 vùng rực rỡ, CPU Core i7 dòng HX hiệu năng máy bàn 20 nhân, Khung máy thiết kế góc cạnh phong cách thanh kiếm chiến binh.",
      "description": "MSI Sword 16 HX mang đến sức mạnh chiến game mượt mà với vi xử lý Intel Core i7-14700HX và card đồ họa RTX 4060, hệ thống tản nhiệt 5 ống đồng tối ưu.",
      "specs": "{\"cpu\":\"Intel Core i7-14700HX (20 nhân, 28 luồng, Turbo 5.5GHz)\",\"ram\":\"16GB DDR5 5600MHz\",\"storage\":\"1TB PCIe Gen4 SSD\",\"vga\":\"NVIDIA GeForce RTX 4060 8GB GDDR6 (115W TGP)\",\"display\":\"16.0 inch FHD+ (1920 x 1200) 144Hz IPS\",\"weight\":\"2.30 Kg, Màu Cosmos Gray\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Intel NUC M15 EVO Core i5-1240P (16GB / 512GB SSD / 15.6 inch Touch IPS 100% sRGB)",
      "slug": "laptop-intel-nuc-m15-evo-i5",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Đạt chuẩn Intel EVO, Vỏ nhôm nguyên khối siêu mỏng 14.9mm, Màn hình cảm ứng 15.6 inch IPS 100% sRGB, Pin 16 giờ.",
      "description": "Phiên bản Intel Core i5 của dòng laptop chuẩn mực Intel NUC M15 EVO đem lại hiệu năng ổn định, pin cực trâu và thiết kế tinh tế với mức giá tiết kiệm.",
      "specs": "{\"cpu\":\"Intel Core i5-1240P 12 nhân 16 luồng\",\"ram\":\"16GB LPDDR5\",\"storage\":\"512GB NVMe PCIe 4.0 SSD\",\"display\":\"15.6 inch FHD Touch IPS 100% sRGB\",\"weight\":\"1.65 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Gaming Intel NUC X15 King County Core i7-12700H (16GB / 512GB / RTX 3060 130W / QHD 165Hz)",
      "slug": "laptop-gaming-intel-nuc-x15-3060",
      categoryId: categories["laptop-gaming"].id,
      brandId: brands["intel"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Vỏ hợp kim Magie siêu nhẹ 1.99kg, Bàn phím cơ quang học RGB per-key, Màn hình QHD 165Hz độ trễ thấp 3ms.",
      "description": "Intel NUC X15 phiên bản RTX 3060 công suất cao 130W là lựa chọn hàng đầu cho các giải đấu eSports với khung máy siêu nhẹ và bàn phím cơ quang học phản hồi 0.2ms.",
      "specs": "{\"cpu\":\"Intel Core i7-12700H 14 nhân\",\"ram\":\"16GB DDR5 4800MHz\",\"storage\":\"512GB PCIe 4.0 SSD\",\"vga\":\"NVIDIA GeForce RTX 3060 6GB (130W)\",\"display\":\"15.6 inch QHD 165Hz IPS\",\"weight\":\"1.99 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Doanh Nghiệp Intel NUC P14E Core i7-1260P vPro (16GB / 512GB / 1.3kg / Bảo Mật e-Shield)",
      "slug": "laptop-intel-nuc-p14e-vpro",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      "isFeatured": false,
      "warrantyMonths": 36,
      "shortDesc": "Thiết kế chuẩn mực cho văn phòng doanh nghiệp, Nền tảng bảo mật phần cứng Intel vPro Enterprise, Vỏ nhôm nguyên khối 1.3kg.",
      "description": "Intel NUC P14E vPro đem lại sự an tâm tuyệt đối cho các tổ chức và doanh nghiệp với khả năng quản lý từ xa qua mạng AMT, xác thực vân tay và camera IR mở khóa khuôn mặt.",
      "specs": "{\"cpu\":\"Intel Core i7-1260P vPro Enterprise\",\"ram\":\"16GB LPDDR5\",\"storage\":\"512GB PCIe Gen4 SSD\",\"display\":\"14.0 inch FHD+ (1920 x 1200) chống chói 400 nits\",\"weight\":\"1.30 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop 2-trong-1 Intel EVO Reference Flip 14 Touch S-Pen (Core Ultra 7 / 16GB / 1TB / 2.8K OLED)",
      "slug": "laptop-intel-evo-reference-flip-14",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      "isFeatured": true,
      "warrantyMonths": 24,
      "shortDesc": "Laptop xoay gập 360 độ chuẩn Intel EVO, Màn hình 2.8K OLED cảm ứng kèm bút Stylus, NPU Intel AI Boost tăng tốc sáng tạo.",
      "description": "Mẫu laptop tham chiếu 2-trong-1 xoay gập linh hoạt do chính Intel thiết kế, tích hợp trọn vẹn sức mạnh trí tuệ nhân tạo NPU và màn hình OLED siêu nét.",
      "specs": "{\"cpu\":\"Intel Core Ultra 7 155H\",\"ram\":\"16GB LPDDR5X\",\"storage\":\"1TB SSD\",\"display\":\"14.0 inch 2.8K OLED Touch 120Hz xoay gập 360 độ\",\"weight\":\"1.32 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
      "name": "Laptop Học Sinh & Sinh Viên Intel Education Classmate Pro (Core i3-1215U / 8GB / 256GB / Chống Rơi Vỡ)",
      "slug": "laptop-intel-education-classmate-pro",
      categoryId: categories["laptop-van-phong"].id,
      brandId: brands["intel"].id,
      "isFeatured": false,
      "warrantyMonths": 24,
      "shortDesc": "Đạt chuẩn độ bền chống va đập và chống tràn nước bàn phím, Tay cầm tiện lợi, Thời lượng pin 12 giờ cho học tập cả ngày.",
      "description": "Laptop giáo dục bền bỉ của Intel được thiết kế với viền cao su bảo vệ chống rơi từ độ cao 1m, bàn phím chống tràn và camera góc rộng lý tưởng cho học trực tuyến.",
      "specs": "{\"cpu\":\"Intel Core i3-1215U 6 nhân 8 luồng\",\"ram\":\"8GB DDR4\",\"storage\":\"256GB NVMe SSD\",\"display\":\"14.0 inch HD chống chói viền cao su chống sốc\",\"weight\":\"1.45 Kg\"}",
      "images": [
            {
                  "url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
                  "isThumbnail": true
            }
      ],
      "variants": [
            {
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
    {
      "id": "img-lnv-c1",
      "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-c2",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-c3",
      "url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-c4",
      "url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-c5",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-c6",
      "url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-c1",
      "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-c2",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-c3",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-c4",
      "url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-c1",
      "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-c2",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-c3",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-msi-c1",
      "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-msi-c2",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-msi-c3",
      "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-sam-c1",
      "url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-sam-c2",
      "url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-g1",
      "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-g2",
      "url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-g3",
      "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-asus-g4",
      "url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-app-g1",
      "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-app-g2",
      "url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-app-g3",
      "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-g1",
      "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-g2",
      "url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-dell-g3",
      "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-g1",
      "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-g2",
      "url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-lnv-g3",
      "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-msi-g1",
      "url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-msi-g2",
      "url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-msi-g3",
      "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-sam-g1",
      "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "isThumbnail": true
    }
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
    {
      "id": "img-sam-g2",
      "url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
      "isThumbnail": true
    }
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

  for (const p of productsData) {
    const { images, variants, ...prodFields } = p;
    const createdProduct = await prisma.product.upsert({
      where: { slug: prodFields.slug },
      update: {},
      create: prodFields,
    });

    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: img.url,
          isThumbnail: img.isThumbnail,
        },
      });
    }

    for (const v of variants) {
      const { serials, ...variantData } = v;
      const createdVariant = await prisma.productVariant.upsert({
        where: { sku: variantData.sku },
        update: {},
        create: {
          ...variantData,
          productId: createdProduct.id,
        },
      });

      if (serials && serials.length > 0) {
        for (const sn of serials) {
          await prisma.serialNumber.upsert({
            where: { serialNumber: sn },
            update: {},
            create: {
              variantId: createdVariant.id,
              serialNumber: sn,
              status: "in_stock",
            },
          });
        }
      }
    }
  }
  console.log("✅ Đã tạo các sản phẩm công nghệ nổi bật, biến thể & serial bảo hành.");

  // 5. Tạo Vouchers khuyến mãi
  const vouchers = [
    {
      code: "TECHNEW100K",
      type: "fixed",
      value: 100000,
      minOrder: 1000000,
      usageLimit: 200,
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      code: "GAMING2026",
      type: "percent",
      value: 5,
      maxDiscount: 1500000,
      minOrder: 15000000,
      usageLimit: 50,
      endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      code: "FREESHIP",
      type: "fixed",
      value: 40000,
      minOrder: 500000,
      usageLimit: 500,
      endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const v of vouchers) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: {},
      create: v,
    });
  }
  console.log("✅ Đã tạo các mã giảm giá mẫu (TECHNEW100K, GAMING2026, FREESHIP).");

  // 6. Tạo 1 Đơn hàng mẫu đã bán để tra cứu bảo hành (Serial: ROG16-2024-001)
  const existingOrder = await prisma.order.findUnique({ where: { code: "TECH-2026-8888" } });
  if (!existingOrder) {
    const sampleVariant = await prisma.productVariant.findFirst({
      where: { sku: "ROG-G16-I9-32G-1T" },
    });

    if (sampleVariant) {
      const order = await prisma.order.create({
        data: {
          code: "TECH-2026-8888",
          userId: customer.id,
          receiverName: "Nguyễn Văn An",
          phone: "0987654321",
          province: "Hà Nội",
          district: "Cầu Giấy",
          ward: "Dịch Vọng",
          street: "Số 12 Duy Tân",
          status: "completed",
          paymentStatus: "paid",
          paymentMethod: "vnpay",
          shippingMethod: "express",
          shippingFee: 0,
          subtotal: 49990000,
          discountTotal: 1500000,
          grandTotal: 48490000,
          voucherCode: "GAMING2026",
          note: "Giao giờ hành chính",
          items: {
            create: {
              variantId: sampleVariant.id,
              productName: "Laptop Gaming ASUS ROG Strix G16 (2024)",
              sku: sampleVariant.sku,
              price: sampleVariant.price,
              quantity: 1,
              lineTotal: sampleVariant.price,
              serialNumber: "ROG16-2024-001",
            },
          },
          statusHistory: {
            createMany: {
              data: [
                { fromStatus: null, toStatus: "pending", note: "Đơn hàng đã được tạo" },
                { fromStatus: "pending", toStatus: "packing", note: "Kho xuất hàng và dán tem bảo hành" },
                { fromStatus: "packing", toStatus: "shipping", note: "Đã bàn giao đơn vị vận chuyển" },
                { fromStatus: "shipping", toStatus: "completed", note: "Khách hàng đã nhận máy và thanh toán" },
              ],
            },
          },
        },
      });

      // Cập nhật ngày kích hoạt bảo hành cho serial này
      const today = new Date();
      const warrantyEnd = new Date(today);
      warrantyEnd.setFullYear(today.getFullYear() + 2); // 24 tháng bảo hành

      await prisma.serialNumber.updateMany({
        where: { serialNumber: "ROG16-2024-001" },
        data: {
          status: "sold",
          orderId: order.id,
          warrantyStart: today,
          warrantyEnd: warrantyEnd,
        },
      });

      console.log("✅ Đã tạo đơn hàng mẫu và kích hoạt bảo hành thành công cho serial 'ROG16-2024-001'.");
    }
  }

  console.log("✨ Khởi tạo dữ liệu mẫu thành công hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

