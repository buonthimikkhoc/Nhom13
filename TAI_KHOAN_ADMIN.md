# DANH SÁCH TÀI KHOẢN HỆ THỐNG & PHÂN QUYỀN (RBAC)

Hệ thống Website Bán Thiết Bị Công Nghệ đã thiết lập cơ chế phân quyền **Role-Based Access Control (RBAC)**:
- **Tài khoản Admin**: Có toàn quyền truy cập vào Phân hệ Quản trị (`/admin`), quản lý đơn hàng theo State Machine, kiểm tra tồn kho, kích hoạt bảo hành Serial/IMEI, thêm sản phẩm mới.
- **Tài khoản User (Khách hàng)**: Chỉ có quyền mua hàng, xem giỏ hàng, tra cứu bảo hành. **Bị chặn tuyệt đối không thể truy cập vào trang Admin (`/admin`)**.

---

## 🛡️ 1. Danh Sách 3 Tài Khoản Quản Trị Viên (Admin)

| STT | Họ và Tên | Email Đăng Nhập | Mật Khẩu | Vai Trò & Nhiệm Vụ | Quyền Hạn |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Nguyễn Quốc Anh** | `admin1@techcore.vn` | `Admin@123` | **Super Admin (Tổng quản trị)** | Toàn quyền kiểm soát hệ thống, xem doanh thu, cấu hình sàn |
| **2** | **Trần Minh Tuấn** | `admin2@techcore.vn` | `Admin@456` | **Quản Trị Đơn Hàng & Kho** | Xử lý chuyển trạng thái đơn (State Machine), kiểm kê tồn kho |
| **3** | **Lê Hoàng Long** | `admin3@techcore.vn` | `Admin@789` | **Quản Trị Kỹ Thuật & Bảo Hành** | Quản lý Serial/IMEI, duyệt thông số kỹ thuật sản phẩm |

*(Lưu ý: Tài khoản dự phòng `admin@techcore.vn` / `Admin@123` cũng được kích hoạt đồng thời).*

---

## 👤 2. Danh Sách Tài Khoản Khách Hàng Thử Nghiệm (User)

| STT | Họ và Tên | Email Đăng Nhập | Mật Khẩu | Vai Trò | Quyền Hạn |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Nguyễn Văn An** | `user1@gmail.com` | `User@123` | `customer` | Mua hàng, giỏ hàng, checkout. **Bị chặn vào trang Admin** |
| **2** | **Hoàng Mai Linh** | `user2@gmail.com` | `User@123` | `customer` | Mua hàng, giỏ hàng, checkout. **Bị chặn vào trang Admin** |

---

## 🔐 3. Cơ Chế Kiểm Tra Phân Quyền (RBAC)

1. **Khi đăng nhập bằng tài khoản Admin** (`admin1@techcore.vn`, `admin2@techcore.vn`, `admin3@techcore.vn`):
   - Header sẽ xuất hiện nút **"Vào trang Admin"** hoặc tự động chuyển hướng vào [`/admin`](http://localhost:3030/admin).
   - Truy cập đầy đủ các công cụ: Bảng điều khiển KPI, Quản lý đơn hàng, Thêm sản phẩm, Quản lý kho Serial/IMEI.

2. **Khi đăng nhập bằng tài khoản User** (`user1@gmail.com`, `user2@gmail.com`):
   - Header chỉ hiển thị tên khách hàng và nút Giỏ hàng / Đăng xuất (KHÔNG có nút Admin).
   - Nếu cố tình gõ link `http://localhost:3030/admin` trên trình duyệt:
     ➔ **Hệ thống sẽ lập tức chặn lại và hiển thị màn hình cảnh báo 403 Forbidden (Không có quyền truy cập dành cho User)**.

3. **Khi chưa đăng nhập (Khách vãng lai)**:
   - Nếu truy cập vào `http://localhost:3030/admin`:
     ➔ **Hệ thống tự động chuyển hướng về trang Đăng nhập (`/dang-nhap`)**.

