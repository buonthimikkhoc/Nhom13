# TechCore - Website Bán Thiết Bị Công Nghệ (E-commerce Core)

Dự án website thương mại điện tử chuyên thiết bị công nghệ cao cấp (Laptop Gaming, Macbook, Điện thoại, Linh kiện PC RTX/CPU, Phụ kiện Gear) được xây dựng theo tài liệu đặc tả [SPEC_website_ban_thiet_bi_cong_nghe.md](./SPEC_website_ban_thiet_bi_cong_nghe.md).

---

## 🚀 Công Nghệ Sử Dụng

- **Frontend (`apps/web`)**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide Icons (Port 3030).
- **Backend API (`apps/api`)**: Node.js + Express + TypeScript + Prisma ORM + JWT Auth + RBAC.
- **Cơ sở dữ liệu**: SQLite (sẵn sàng chuyển đổi 1 dòng sang PostgreSQL khi triển khai Production).
- **Kiến trúc**: Monorepo Workspaces chuẩn công nghiệp.

---

## 📁 Cấu Trúc Dự Án

```
├── apps/
│   ├── api/                       # Backend REST API (Port 5000)
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # Mô hình CSDL chuẩn E-commerce
│   │   │   └── seed.ts            # Dữ liệu mẫu công nghệ thực tế
│   │   └── src/
│   │       ├── modules/           # Auth, Products, Cart, Orders, Warranty, Admin
│   │       ├── middlewares/       # JWT Auth & Phân quyền RBAC
│   │       └── index.ts           # Máy chủ Express & định tuyến /api/v1
│   │
│   └── web/                       # Giao diện Khách hàng & Admin (Port 3030)
│       └── src/
│           ├── app/
│           │   ├── page.tsx               # Trang chủ (Banner, Flash Sale, Sản phẩm nổi bật)
│           │   ├── danh-muc/[slug]/       # Danh sách sản phẩm & bộ lọc giá/hãng
│           │   ├── san-pham/[slug]/       # Chi tiết máy, chọn cấu hình, thông số kỹ thuật
│           │   ├── gio-hang/              # Giỏ hàng & áp dụng voucher khuyến mãi
│           │   ├── thanh-toan/            # Đặt hàng (COD / VNPay QR)
│           │   ├── tra-cuu-bao-hanh/      # Tra cứu bảo hành điện tử theo Serial/IMEI
│           │   └── admin/                 # Admin Dashboard & State Machine đơn hàng
│           ├── components/        # Navbar, Footer, ProductCard
│           └── context/           # CartContext đồng bộ giỏ hàng
│
├── package.json                   # Root monorepo script
└── SPEC_website_ban_thiet_bi_cong_nghe.md
```

---

## 🛠️ Hướng Dẫn Chạy Dự Án

### 1. Cài đặt thư viện (nếu chưa cài)
```bash
npm install
```

### 2. Thiết lập CSDL & Khởi tạo dữ liệu mẫu (Seed Data)
```bash
npm --workspace=apps/api run db:setup
```

### 3. Khởi chạy đồng thời cả Backend API và Frontend Web
```bash
npm run dev
```

Hoặc chạy từng phân hệ riêng biệt:
- **Backend API**: `npm run dev:api` (chạy tại `http://localhost:5000`)
- **Frontend Web**: `npm run dev:web` (chạy tại `http://localhost:3030`)

---

## 🔑 Tài Khoản Thử Nghiệm

| Vai trò | Email | Mật khẩu | Quyền hạn |
| --- | --- | --- | --- |
| **Quản trị viên (Admin)** | `admin@techcore.vn` | `Admin@123` | Quản lý toàn bộ hệ thống, cập nhật trạng thái đơn hàng (State machine) |
| **Khách hàng mẫu** | `customer@gmail.com` | `123456` | Mua hàng, xem lịch sử đơn, giỏ hàng |

---

## 📦 Mã Serial/IMEI Tra Cứu Bảo Hành Mẫu

Truy cập trang `/tra-cuu-bao-hanh` và thử các mã:
- `ROG16-2024-001`: Laptop ASUS ROG Strix G16 (Đã kích hoạt bảo hành 24 tháng)
- `IMEI-354892019283741`: iPhone 16 Pro Max 256GB
- `VGA-4080S-001`: Card màn hình ASUS ROG Strix RTX 4080 SUPER 16GB

---

## 🎁 Mã Giảm Giá (Vouchers) Đã Tích Hợp

- `TECHNEW100K`: Giảm 100.000đ cho đơn từ 1.000.000đ
- `GAMING2026`: Giảm 5% (tối đa 1.500.000đ) cho đơn từ 15.000.000đ
- `FREESHIP`: Miễn phí vận chuyển toàn quốc cho đơn từ 500.000đ

