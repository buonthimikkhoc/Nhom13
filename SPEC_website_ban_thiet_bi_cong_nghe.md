# SPEC LẬP TRÌNH: Website bán thiết bị công nghệ (E-commerce Core)

> Tài liệu đặc tả dùng để code. Dựa trên "Danh sách chức năng website bán thiết bị công nghệ".
> Các mục đánh dấu **[ĐỀ XUẤT]** là gợi ý, có thể đổi theo stack bạn chọn.

---

## 1. Tổng quan

- **Loại dự án:** Website thương mại điện tử chuyên thiết bị công nghệ (điện thoại, laptop, linh kiện PC, phụ kiện, thiết bị mạng).
- **Thị trường:** Việt Nam (VND, COD, VNPay/MoMo/ZaloPay, GHN/GHTK/Viettel Post).
- **3 khối chính:** Phân hệ khách hàng (Frontend), Phân hệ quản trị (Admin), Chức năng hệ thống (phi giao diện).
- **Chiến lược:** làm theo 3 giai đoạn MVP → Mở rộng → Nâng cao (xem mục 11).

## 2. Công nghệ đề xuất [ĐỀ XUẤT]

| Lớp | Lựa chọn | Ghi chú |
| --- | --- | --- |
| Frontend | Next.js (React) + TypeScript + Tailwind CSS | SSR/SSG tốt cho SEO |
| Backend | Node.js (NestJS hoặc Express) + TypeScript | REST API |
| Database | PostgreSQL | Quan hệ chặt (đơn hàng, kho) |
| ORM | Prisma hoặc TypeORM | |
| Cache | Redis | Cache, session, rate limit, giỏ hàng |
| Lưu ảnh | S3 / Cloudinary + CDN | Tối ưu ảnh, lazy loading |
| Tìm kiếm | PostgreSQL full-text → sau nâng lên Meilisearch/Elasticsearch | Autocomplete |
| Auth | JWT (access + refresh) + OAuth2 (Google, Facebook) | |
| Email/SMS | SMTP/SendGrid, eSMS/Twilio | OTP, xác nhận đơn |
| Triển khai | Docker + Nginx | CI/CD GitHub Actions |

> Nếu bạn dùng stack khác (Laravel, .NET, Django...), giữ nguyên phần **mô hình dữ liệu, API, luật nghiệp vụ** bên dưới.

## 3. Kiến trúc & cấu trúc thư mục [ĐỀ XUẤT]

```
project/
├── apps/
│   ├── web/                  # Next.js - giao diện khách hàng
│   ├── admin/                # Next.js/React - trang quản trị
│   └── api/                  # Backend REST API
│       └── src/
│           ├── modules/
│           │   ├── auth/
│           │   ├── users/
│           │   ├── products/
│           │   ├── categories/
│           │   ├── brands/
│           │   ├── inventory/
│           │   ├── cart/
│           │   ├── orders/
│           │   ├── payments/
│           │   ├── shipping/
│           │   ├── promotions/
│           │   ├── reviews/
│           │   ├── content/      # blog, banner, trang tĩnh
│           │   ├── warranty/
│           │   ├── reports/
│           │   └── settings/
│           ├── common/           # guards, filters, interceptors, utils
│           └── config/
├── packages/
│   └── shared/               # types, validators dùng chung
├── docker-compose.yml
└── README.md
```

## 4. Vai trò & phân quyền

| Vai trò | Quyền chính |
| --- | --- |
| **Khách (guest)** | Duyệt, tìm kiếm, giỏ hàng, guest checkout, tra cứu bảo hành |
| **Khách hàng (customer)** | Toàn bộ quyền guest + hồ sơ, địa chỉ, lịch sử đơn, wishlist, đánh giá |
| **Admin** | Toàn quyền, cấu hình hệ thống, quản lý nhân viên |
| **Kế toán** | Xem đơn, hoá đơn, hoàn tiền, báo cáo doanh thu/lợi nhuận |
| **Kho** | Tồn kho, phiếu nhập/xuất, nhà cung cấp, serial/IMEI, đóng gói |
| **CSKH** | Đơn hàng, đổi trả, khách hàng, đánh giá/hỏi đáp, chat |

Triển khai bằng **RBAC**: bảng `roles`, `permissions`, `role_permissions`; guard kiểm tra quyền trên từng endpoint.

---

## 5. Phân hệ khách hàng (Frontend)

### 5.1 Tài khoản & xác thực
- [ ] Đăng ký / đăng nhập bằng email hoặc số điện thoại
- [ ] Đăng nhập Google, Facebook (OAuth2)
- [ ] Quên mật khẩu, đổi mật khẩu
- [ ] Xác thực OTP / email
- [ ] Hồ sơ cá nhân (họ tên, SĐT, ngày sinh, avatar)
- [ ] Sổ địa chỉ giao hàng (nhiều địa chỉ, đặt mặc định)
- [ ] Lịch sử đơn hàng, theo dõi trạng thái đơn

### 5.2 Duyệt & tìm kiếm sản phẩm
- [ ] Trang chủ: banner, sản phẩm nổi bật, khuyến mãi, hàng mới về
- [ ] Danh mục đa cấp (điện thoại, laptop, linh kiện PC, phụ kiện, thiết bị mạng...)
- [ ] Tìm kiếm từ khoá + gợi ý tự động (autocomplete)
- [ ] Bộ lọc nâng cao: giá, thương hiệu, RAM, CPU, dung lượng, màn hình...
- [ ] Sắp xếp: giá, mới nhất, bán chạy, đánh giá
- [ ] Phân trang / infinite scroll

### 5.3 Chi tiết sản phẩm
- [ ] Hình ảnh / video, thông số kỹ thuật, mô tả
- [ ] Biến thể (màu, dung lượng, cấu hình) — mỗi biến thể có **giá và tồn kho riêng**
- [ ] Đánh giá, bình luận, hỏi đáp
- [ ] Sản phẩm liên quan, sản phẩm đã xem
- [ ] So sánh sản phẩm (tối đa 3–4 món)
- [ ] Thông tin bảo hành, chính sách đổi trả

### 5.4 Giỏ hàng & thanh toán
- [ ] Thêm / sửa / xoá sản phẩm; lưu giỏ hàng khi đăng nhập (đồng bộ DB)
- [ ] Áp dụng mã giảm giá, voucher
- [ ] Chọn địa chỉ, phương thức vận chuyển, tính phí ship
- [ ] Thanh toán: COD, chuyển khoản, VNPay, MoMo, ZaloPay, thẻ, trả góp
- [ ] Guest checkout (mua không cần đăng ký)
- [ ] Email / SMS xác nhận đơn hàng

### 5.5 Tiện ích khác
- [ ] Wishlist
- [ ] Chat hỗ trợ, form liên hệ
- [ ] Tin tức / blog công nghệ
- [ ] Tra cứu bảo hành theo serial/IMEI

### 5.6 Danh sách trang (routes frontend)

| Route | Trang |
| --- | --- |
| `/` | Trang chủ |
| `/danh-muc/[slug]` | Danh sách sản phẩm theo danh mục (có lọc, sắp xếp) |
| `/tim-kiem?q=` | Kết quả tìm kiếm |
| `/san-pham/[slug]` | Chi tiết sản phẩm |
| `/so-sanh` | So sánh sản phẩm |
| `/gio-hang` | Giỏ hàng |
| `/thanh-toan` | Checkout |
| `/dat-hang-thanh-cong/[orderCode]` | Kết quả đặt hàng |
| `/tai-khoan` | Hồ sơ |
| `/tai-khoan/don-hang` | Lịch sử đơn |
| `/tai-khoan/don-hang/[orderCode]` | Chi tiết + theo dõi đơn |
| `/tai-khoan/dia-chi` | Sổ địa chỉ |
| `/tai-khoan/yeu-thich` | Wishlist |
| `/dang-nhap`, `/dang-ky`, `/quen-mat-khau` | Xác thực |
| `/tin-tuc`, `/tin-tuc/[slug]` | Blog |
| `/tra-cuu-bao-hanh` | Tra cứu bảo hành |
| `/lien-he` | Liên hệ |
| `/chinh-sach/[slug]` | Trang tĩnh (đổi trả, bảo hành, bảo mật...) |

---

## 6. Phân hệ quản trị (Admin)

### 6.1 Quản lý sản phẩm
- [ ] CRUD sản phẩm, danh mục, thương hiệu, thuộc tính, biến thể
- [ ] Thông số kỹ thuật theo từng loại thiết bị (template thuộc tính theo danh mục)
- [ ] Nhập / xuất hàng loạt Excel/CSV
- [ ] Quản lý hình ảnh, SEO từng sản phẩm (title, description, slug)

### 6.2 Quản lý kho
- [ ] Tồn kho theo biến thể, cảnh báo sắp hết hàng
- [ ] Phiếu nhập / xuất kho, lịch sử biến động
- [ ] Quản lý nhà cung cấp
- [ ] Quản lý serial/IMEI (tuỳ chọn)

### 6.3 Quản lý đơn hàng
- [ ] Danh sách, lọc, tìm kiếm đơn
- [ ] Cập nhật trạng thái (xem state machine mục 8.1)
- [ ] In hoá đơn, phiếu giao hàng
- [ ] Xử lý đổi trả, hoàn tiền

### 6.4 Quản lý khách hàng
- [ ] Danh sách, chi tiết, lịch sử mua hàng
- [ ] Phân nhóm khách hàng, khoá / mở tài khoản

### 6.5 Marketing & khuyến mãi
- [ ] Mã giảm giá, flash sale, combo, quà tặng kèm
- [ ] Banner, popup
- [ ] Bài viết, trang tĩnh
- [ ] Email marketing cơ bản

### 6.6 Báo cáo & thống kê
- [ ] Dashboard: doanh thu, số đơn, khách mới
- [ ] Báo cáo sản phẩm bán chạy, tồn kho, lợi nhuận
- [ ] Xuất báo cáo Excel/PDF

### 6.7 Phân quyền & hệ thống
- [ ] Quản lý nhân viên, vai trò (Admin, Kế toán, Kho, CSKH)
- [ ] Nhật ký hoạt động (audit log)
- [ ] Cấu hình website, phí vận chuyển, thuế, phương thức thanh toán

---

## 7. Mô hình dữ liệu (đề xuất)

> Quy ước: mọi bảng có `id`, `created_at`, `updated_at`. Tiền lưu dạng số nguyên VND (`BIGINT`).

### Người dùng & phân quyền
- `users` (id, email, phone, password_hash, full_name, avatar, birthday, status[active/locked], customer_group_id, email_verified_at, phone_verified_at)
- `oauth_accounts` (user_id, provider, provider_user_id)
- `addresses` (user_id, receiver_name, phone, province, district, ward, street, is_default)
- `staff` / dùng chung `users` + `roles`
- `roles`, `permissions`, `role_permissions`, `user_roles`
- `customer_groups` (name, discount_percent)
- `otp_codes` (target, code_hash, purpose, expires_at, used_at)
- `audit_logs` (user_id, action, entity, entity_id, before, after, ip, created_at)

### Danh mục sản phẩm
- `categories` (id, parent_id, name, slug, image, sort_order, is_active) — **cây đa cấp**
- `brands` (name, slug, logo)
- `attributes` (id, name, code, type[text/number/select], unit, is_filterable) — vd: RAM, CPU, dung lượng, màn hình
- `category_attributes` (category_id, attribute_id) — template thông số theo loại thiết bị
- `products` (id, category_id, brand_id, name, slug, short_desc, description, status, is_featured, warranty_months, seo_title, seo_description, avg_rating, review_count)
- `product_images` (product_id, variant_id?, url, type[image/video], sort_order)
- `product_attribute_values` (product_id, attribute_id, value)
- `product_variants` (id, product_id, sku, name, option_values JSON [màu, dung lượng, cấu hình], price, compare_at_price, cost_price, is_active)

### Kho
- `suppliers` (name, contact, phone, email, address)
- `inventory` (variant_id, quantity, reserved_quantity, low_stock_threshold)
- `stock_movements` (variant_id, type[in/out/adjust/reserve/release/return], quantity, ref_type, ref_id, note, created_by)
- `stock_receipts` / `stock_receipt_items` (phiếu nhập/xuất)
- `serial_numbers` (variant_id, serial_or_imei, status[in_stock/sold/returned], order_item_id, receipt_item_id, warranty_start, warranty_end)

### Giỏ hàng & đơn hàng
- `carts` (user_id?, session_id?), `cart_items` (cart_id, variant_id, quantity)
- `orders` (id, code, user_id?, guest_email, guest_phone, status, payment_status, payment_method, shipping_method, shipping_fee, subtotal, discount_total, tax_total, grand_total, voucher_code, shipping_address JSON snapshot, note, cancel_reason)
- `order_items` (order_id, variant_id, product_name_snapshot, sku, price_snapshot, quantity, line_total)
- `order_status_history` (order_id, from_status, to_status, note, changed_by, created_at)
- `payments` (order_id, method, provider_txn_id, amount, status, raw_response JSON, paid_at)
- `shipments` (order_id, carrier[GHN/GHTK/ViettelPost], tracking_code, fee, status, raw_response)
- `returns` (order_id, order_item_id, reason, status, refund_amount, refund_method, handled_by)

### Khuyến mãi
- `vouchers` (code, type[percent/fixed/free_ship], value, max_discount, min_order, usage_limit, usage_per_user, starts_at, ends_at, applies_to JSON)
- `voucher_usages` (voucher_id, user_id, order_id)
- `flash_sales` / `flash_sale_items` (variant_id, sale_price, quantity_limit, sold, starts_at, ends_at)
- `combos` / `combo_items`, `gift_rules`

### Nội dung & tương tác
- `reviews` (product_id, user_id, order_item_id, rating 1-5, content, images, status[pending/approved/hidden])
- `questions` / `answers` (hỏi đáp sản phẩm)
- `wishlists` (user_id, product_id)
- `posts` (title, slug, content, thumbnail, status, published_at), `pages` (trang tĩnh)
- `banners` (image, link, position, sort_order, starts_at, ends_at), `popups`
- `contact_messages`, `chat_conversations`, `chat_messages`
- `settings` (key, value JSON) — cấu hình site, thuế, phí ship, bật/tắt phương thức thanh toán
- `shipping_rates` (province/zone, weight_from, weight_to, fee)

### Chỉ mục quan trọng
- `products(slug)` unique, `product_variants(sku)` unique, `orders(code)` unique
- `products(category_id, brand_id, status)`, full-text index trên `products(name)`
- `stock_movements(variant_id, created_at)`

---

## 8. Luật nghiệp vụ quan trọng

### 8.1 Trạng thái đơn hàng (state machine)

```
chờ xác nhận ──► đóng gói ──► giao hàng ──► hoàn tất
      │              │             │             │
      └──► hủy ◄─────┘             └──► hoàn trả ◄┘
```

| Từ | Sang được |
| --- | --- |
| `pending` (chờ xác nhận) | `packing`, `cancelled` |
| `packing` (đóng gói) | `shipping`, `cancelled` |
| `shipping` (giao hàng) | `completed`, `returned` |
| `completed` | `returned` (trong thời hạn đổi trả) |
| `cancelled`, `returned` | — (trạng thái cuối) |

- Mọi chuyển trạng thái ghi vào `order_status_history` + `audit_logs`.
- Chỉ role được phép (Kho: đóng gói/giao; CSKH/Admin: huỷ/hoàn trả).

### 8.2 Tồn kho
- Khi **đặt hàng**: tăng `reserved_quantity` (giữ hàng), không trừ `quantity`.
- Khi **giao hàng/xuất kho**: trừ `quantity` và `reserved_quantity`.
- Khi **huỷ đơn**: giải phóng `reserved_quantity`.
- Khi **hoàn trả**: cộng lại `quantity` (nếu hàng đạt), ghi `stock_movements`.
- Số có thể bán = `quantity - reserved_quantity`.
- **Dùng transaction + khoá hàng (SELECT ... FOR UPDATE)** để chống bán quá số lượng khi nhiều người mua cùng lúc.
- Gửi cảnh báo khi `quantity <= low_stock_threshold`.

### 8.3 Giá & khuyến mãi
- Giá tính theo **biến thể**; ưu tiên: flash sale đang hiệu lực > giá thường.
- Thứ tự tính: subtotal → trừ voucher/combo → cộng phí ship → cộng thuế → `grand_total`.
- Voucher kiểm tra: còn hạn, đủ `min_order`, chưa vượt `usage_limit`/`usage_per_user`, đúng đối tượng áp dụng.
- **Lưu snapshot** tên/giá/địa chỉ vào đơn; không phụ thuộc dữ liệu sản phẩm thay đổi sau này.

### 8.4 Thanh toán
- COD: `payment_status = unpaid` đến khi giao thành công.
- Cổng online (VNPay/MoMo/ZaloPay): tạo `payments` ở trạng thái `pending` → redirect → **xử lý IPN/webhook** để xác nhận (không tin kết quả từ redirect của client). Xác thực chữ ký, xử lý idempotent.
- Chuyển khoản: Admin/Kế toán xác nhận thủ công (hoặc đối soát tự động giai đoạn sau).
- Thanh toán thất bại/hết hạn → tự huỷ giữ hàng sau X phút (job nền).

### 8.5 Guest checkout
- Bắt buộc email hoặc SĐT; tạo đơn gắn `guest_email/guest_phone`.
- Cho tra cứu đơn bằng mã đơn + SĐT/email (có OTP hoặc token).
- Nếu sau đó đăng ký cùng email/SĐT → gộp đơn cũ vào tài khoản.

### 8.6 Giỏ hàng
- Chưa đăng nhập: lưu theo `session_id` (cookie/Redis).
- Đăng nhập: **merge** giỏ session vào giỏ user.
- Kiểm tra tồn kho & giá lại khi vào checkout.

### 8.7 Bảo hành & serial/IMEI
- Khi xuất kho/giao hàng, gán serial/IMEI cho `order_items`; tính `warranty_end = ngày giao + warranty_months`.
- Tra cứu công khai: nhập serial/IMEI → trả sản phẩm, ngày kích hoạt, hạn bảo hành (không lộ thông tin cá nhân).

### 8.8 Đánh giá
- Chỉ khách **đã mua** (đơn hoàn tất) mới được đánh giá có nhãn "Đã mua hàng"; duyệt trước khi hiển thị (tuỳ cấu hình).

---

## 9. API (REST) — đề xuất

Prefix: `/api/v1`. Phản hồi chuẩn:

```json
{ "success": true, "data": {}, "meta": { "page": 1, "limit": 20, "total": 100 } }
{ "success": false, "error": { "code": "OUT_OF_STOCK", "message": "..." } }
```

### Auth & tài khoản
| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/refresh` | Làm mới token |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/auth/google`, `/auth/facebook` | OAuth |
| POST | `/auth/forgot-password`, `/auth/reset-password` | Quên/đặt lại MK |
| POST | `/auth/otp/send`, `/auth/otp/verify` | OTP |
| POST | `/auth/change-password` | Đổi mật khẩu |
| GET/PATCH | `/me` | Hồ sơ |
| GET/POST/PATCH/DELETE | `/me/addresses` | Sổ địa chỉ |
| GET | `/me/orders`, `/me/orders/:code` | Lịch sử/chi tiết đơn |
| GET/POST/DELETE | `/me/wishlist` | Yêu thích |

### Sản phẩm (public)
| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/categories` | Cây danh mục |
| GET | `/products` | Danh sách: `?category=&brand=&minPrice=&maxPrice=&attrs[ram]=16GB&sort=&page=&limit=` |
| GET | `/products/:slug` | Chi tiết (kèm biến thể, thông số) |
| GET | `/products/:slug/related` | Liên quan |
| GET | `/search?q=` | Tìm kiếm |
| GET | `/search/suggest?q=` | Autocomplete |
| GET | `/filters?category=` | Các bộ lọc khả dụng |
| POST | `/compare` | Lấy dữ liệu so sánh (ids[]) |
| GET/POST | `/products/:id/reviews` | Đánh giá |
| GET/POST | `/products/:id/questions` | Hỏi đáp |
| GET | `/warranty/lookup?serial=` | Tra cứu bảo hành |

### Giỏ hàng & đặt hàng
| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/cart` | Xem giỏ |
| POST | `/cart/items` | Thêm |
| PATCH/DELETE | `/cart/items/:id` | Sửa/xoá |
| POST | `/cart/voucher` | Áp mã |
| POST | `/checkout/shipping-fee` | Tính phí ship |
| POST | `/checkout/place-order` | Đặt hàng (user/guest) |
| POST | `/payments/:method/create` | Tạo giao dịch online |
| GET | `/payments/:method/return` | Return URL |
| POST | `/payments/:method/ipn` | Webhook/IPN |
| GET | `/orders/track?code=&phone=` | Tra cứu đơn (guest) |

### Admin (`/admin/...`, yêu cầu quyền)
- `products`, `variants`, `categories`, `brands`, `attributes` — CRUD
- `products/import`, `products/export` — Excel/CSV
- `inventory`, `stock-receipts`, `stock-movements`, `suppliers`, `serials`
- `orders` (list/filter), `orders/:id/status`, `orders/:id/invoice`, `orders/:id/shipping-label`, `returns`, `refunds`
- `customers`, `customers/:id/lock`, `customer-groups`
- `vouchers`, `flash-sales`, `combos`, `banners`, `popups`, `posts`, `pages`, `email-campaigns`
- `reports/revenue`, `reports/best-sellers`, `reports/inventory`, `reports/profit`, `reports/export`
- `staff`, `roles`, `permissions`, `audit-logs`, `settings`

---

## 10. Yêu cầu phi chức năng (hệ thống)

### Bảo mật
- [ ] Băm mật khẩu bằng bcrypt/argon2
- [ ] HTTPS toàn site, HSTS
- [ ] Chống XSS (sanitize/escape), CSRF (token/SameSite cookie), SQL Injection (ORM/parameterized query)
- [ ] Rate limiting (đặc biệt: login, OTP, tạo đơn, tìm kiếm)
- [ ] Validate input ở backend (zod/class-validator), giới hạn upload (loại file, dung lượng)
- [ ] Không log dữ liệu nhạy cảm (mật khẩu, thẻ); secrets đặt trong biến môi trường

### Hiệu năng
- [ ] Cache (Redis) cho danh mục, trang chủ, kết quả lọc phổ biến
- [ ] CDN cho ảnh/static; ảnh WebP/AVIF, nhiều kích thước
- [ ] Lazy loading ảnh, code splitting
- [ ] Index DB hợp lý, tránh N+1 query
- [ ] Mục tiêu: LCP < 2.5s, API p95 < 500ms (tham khảo)

### SEO
- [ ] URL thân thiện (slug), canonical
- [ ] `sitemap.xml`, `robots.txt`
- [ ] Meta tags + Open Graph từng trang
- [ ] Schema markup: `Product`, `Offer`, `AggregateRating`, `BreadcrumbList`

### Khác
- [ ] Responsive mobile/tablet/desktop (thiết kế mobile-first)
- [ ] Tích hợp: cổng thanh toán, vận chuyển (GHN, GHTK, Viettel Post), email/SMS, Google Analytics
- [ ] Sao lưu & phục hồi dữ liệu (backup DB hằng ngày, thử restore định kỳ)
- [ ] Đa ngôn ngữ/tiền tệ (tuỳ chọn) — dùng i18n ngay từ đầu nếu có kế hoạch
- [ ] Logging, giám sát lỗi (Sentry), health check endpoint

---

## 11. Lộ trình theo giai đoạn

### Giai đoạn 1 — MVP
**Mục tiêu:** bán được hàng end-to-end.
- [ ] Khởi tạo dự án, DB, CI cơ bản, Docker
- [ ] Đăng ký / đăng nhập
- [ ] Danh mục, danh sách & chi tiết sản phẩm (có biến thể)
- [ ] Giỏ hàng
- [ ] Thanh toán **COD + 1 cổng online** (VNPay *hoặc* MoMo)
- [ ] Admin: quản lý sản phẩm, đơn hàng, kho cơ bản
- [ ] Email xác nhận đơn
- [ ] Responsive + SEO cơ bản

### Giai đoạn 2 — Mở rộng
- [ ] Mã giảm giá / voucher
- [ ] Đánh giá, hỏi đáp
- [ ] Wishlist, so sánh sản phẩm
- [ ] Bộ lọc nâng cao, autocomplete
- [ ] Báo cáo & dashboard
- [ ] Phân quyền nhân viên (RBAC), audit log
- [ ] Guest checkout, đổi trả/hoàn tiền
- [ ] Blog, banner, trang tĩnh

### Giai đoạn 3 — Nâng cao
- [ ] Trả góp
- [ ] Chat realtime (WebSocket)
- [ ] Gợi ý sản phẩm bằng AI
- [ ] Tích hợp vận chuyển tự động (tạo vận đơn, webhook trạng thái)
- [ ] Flash sale, combo, quà tặng kèm, email marketing
- [ ] Quản lý serial/IMEI + tra cứu bảo hành
- [ ] App mobile

---

## 12. Thứ tự code gợi ý (checklist)

1. [ ] Setup repo, môi trường, lint/format, Docker Compose (DB + Redis)
2. [ ] Schema DB + migration + seed (danh mục, thương hiệu, vài sản phẩm mẫu)
3. [ ] Module `auth` + `users` + RBAC guard
4. [ ] Module `categories`, `brands`, `attributes`
5. [ ] Module `products` + `variants` + upload ảnh
6. [ ] Module `inventory` (reserve/release/deduct trong transaction)
7. [ ] Frontend: layout, trang chủ, danh mục, chi tiết sản phẩm
8. [ ] Module `cart` + merge giỏ khi đăng nhập
9. [ ] Module `orders` + state machine + `order_status_history`
10. [ ] Module `payments` (COD → VNPay/MoMo + IPN)
11. [ ] Frontend: giỏ hàng, checkout, trang kết quả, lịch sử đơn
12. [ ] Admin: sản phẩm, kho, đơn hàng
13. [ ] Email/SMS thông báo
14. [ ] Test (unit cho tính giá/tồn kho/voucher; e2e cho luồng đặt hàng), deploy MVP
15. [ ] Chuyển sang giai đoạn 2, 3

## 13. Tiêu chí hoàn thành (Definition of Done)

- Có validate input + xử lý lỗi thống nhất.
- Có test cho logic quan trọng (giá, voucher, tồn kho, chuyển trạng thái).
- Phân quyền được kiểm tra ở backend, không chỉ ẩn nút ở UI.
- Không bán quá tồn kho khi đặt hàng đồng thời.
- Webhook thanh toán idempotent, kiểm tra chữ ký.
- Trang public có SEO cơ bản và dùng tốt trên mobile.
