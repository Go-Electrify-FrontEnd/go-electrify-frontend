# Tìm Trạm Sạc - Tài liệu Kỹ thuật

## Tổng quan

Trang tìm trạm sạc là một ứng dụng định vị trạm sạc xe điện kết hợp bản đồ tương tác với danh sách chi tiết các trạm. Người dùng có thể khám phá, định vị và điều hướng đến các trạm sạc trên toàn Việt Nam.

## Kiến trúc

### Cấu trúc Component

```text
find-stations/
└── page.tsx                    # Component trang chính


components/
├── station-map.tsx             # Bản đồ Mapbox tương tác
├── nearest-stations-list.tsx   # Container danh sách trạm
└── station-card.tsx            # Card thông tin trạm
```

### Tính năng chính

- **Bản đồ tương tác**: Hiển thị trạm sạc theo thời gian thực với Mapbox GL JS
- **Khám phá trạm**: Thông tin chi tiết và trạng thái trạm sạc
- **Tích hợp điều hướng**: Điều hướng trực tiếp qua Google Maps
- **Thiết kế responsive**: Thiết kế mobile-first với layout thích ứng
- **Trạng thái trạm**: Hiển thị tình trạng sẵn có của trạm

## Triển khai bản đồ

### Tích hợp Mapbox

```typescript
// Cấu hình bản đồ
const mapConfig = {
  center: [106.6297, 10.8231], // Trung tâm TP.HCM
  zoom: 12,
  style: "mapbox://styles/mapbox/standard",
  language: "vi",
};
```

### Tại sao chọn Mapbox?

- **Tiết kiệm chi phí**: Giá cạnh tranh so với Google Maps
- **API phong phú**: Tùy chỉnh và tiện ích mở rộng
- **Hiệu năng**: Tối ưu cho web và mobile
- **Hỗ trợ offline**: Khả năng cache tile
- **Địa phương hóa**: Hỗ trợ tiếng Việt

### Hệ tọa độ

- **Định dạng**: `[kinh độ, vĩ độ]` (chuẩn Mapbox)
- **Phạm vi Việt Nam**:
  - Kinh độ: 102°Đ - 110°Đ
  - Vĩ độ: 8°B - 23°B
- **Ví dụ**: `[106.6297, 10.8231]` (TP.HCM)

## Cấu trúc dữ liệu

### Interface Station

```typescript
interface StationWithDistance {
  id: number;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: "fast" | "normal" | "super_fast";
  address: string;
  available: boolean;
  available_connectors: number;
  total_connectors: number;
  distance?: number; // Khoảng cách tính bằng km
}
```

### Loại trạm sạc

- **fast**: Sạc nhanh DC tiêu chuẩn (50-150kW)
- **normal**: Sạc AC Level 2 (11-22kW)
- **super_fast**: Sạc siêu nhanh (150kW+)

## Tương tác người dùng

### Tính năng bản đồ

- **Đánh dấu trạm**: Màu sắc theo tình trạng sẵn có
  - 🟢 Xanh lá: Trạm khả dụng
  - 🔴 Đỏ: Trạm đang bận
- **Popup tương tác**: Chi tiết trạm khi click
- **Định vị**: Theo dõi vị trí người dùng với xử lý quyền
- **Toàn màn hình**: Trải nghiệm bản đồ immersive

### Card trạm sạc

- **Hành động nhanh**: Điều hướng trực tiếp đến Google Maps
- **Chỉ báo trạng thái**: Badge tình trạng sẵn có
- **Tính khoảng cách**: Sắp xếp động theo khoảng cách
- **Tích hợp liên hệ**: Khả năng gọi điện trực tiếp

### Luồng điều hướng

1. **Quyền vị trí**: Yêu cầu truy cập vị trí người dùng
2. **Tải trạm**: Lấy và hiển thị trạm gần nhất
3. **Tính khoảng cách**: Tính khoảng cách từ vị trí người dùng (coming soon\_)
4. **Sắp xếp & lọc**: Sắp xếp theo khoảng cách và tình trạng
5. **Lập kế hoạch lộ trình**: Tạo hướng dẫn Google Maps

### Thích ứng layout

- **Mobile**: Xếp chồng dọc với bản đồ full-width
- **Tablet**: Tỷ lệ cân bằng với khoảng cách điều chỉnh
- **Desktop**: Chia 70/30 (bản đồ/danh sách)
- **Tối ưu touch**: Mục tiêu touch lớn hơn và cử chỉ vuốt

## 🔧 Triển khai kỹ thuật

### Tối ưu hiệu năng

```typescript
// Cấu hình cache
fadeDuration: 300, // Chuyển tiếp mượt
antialias: true, // Chất lượng hình ảnh
```

### Xử lý lỗi

- **Hỗ trợ trình duyệt**: Kiểm tra tương thích Mapbox GL JS
- **Định vị**: Fallback graceful khi từ chối quyền
- **Vấn đề mạng**: Cache tile offline và retry logic
- **Giới hạn API**: Rate limiting và quản lý quota

### Khả năng truy cập

- **Điều hướng bàn phím**: Hỗ trợ bàn phím đầy đủ cho điều khiển bản đồ
- **Đọc màn hình**: Nhãn ARIA và semantic markup phù hợp
- **Tương phản màu**: Tuân thủ WCAG
- **Mục tiêu touch**: Mục tiêu touch tối thiểu 44px trên mobile

## 🚀 Điểm tích hợp

### Điều hướng Google Maps

```javascript
// Tạo URL
const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
```

## 🔍 Chiến lược kiểm thử

### Integration Tests

- Khởi tạo bản đồ và đặt marker
- Luồng quyền định vị
- Tạo URL điều hướng
- Xác minh layout responsive

### E2E Tests

- Hành trình người dùng hoàn chỉnh
- Tương thích cross-browser
- Test thiết bị mobile
- Benchmark hiệu năng

## Tham khảo API

### Mapbox GL JS

- **Phiên bản**: Phiên bản ổn định mới nhất
- **Tính năng sử dụng**: Markers, popups, controls, geolocation
- **Tài liệu**: [Mapbox GL JS Guides](https://docs.mapbox.com/mapbox-gl-js/guides/)

### Tích hợp Google Maps

- **Mục đích**: Điều hướng và lập lộ trình
- **Triển khai**: Tích hợp dựa trên URL (không cần API key)
- **Fallback**: Chia sẻ tọa độ trực tiếp

## Cân nhắc bảo mật

### Quản lý API Key

- **Environment Variables**: Lưu trữ token an toàn
- **Rate Limiting**: Throttling request phía client

### Quyền riêng tư dữ liệu

- **Định vị**: Yêu cầu sự đồng ý người dùng
- **Dữ liệu vị trí**: Không lưu server-side

## Checklist triển khai

- Mapbox API key đã cấu hình
- Environment variables đã thiết lập
- Domain restrictions trên boxplot
- Mobile responsiveness đã xác minh

---
