# QUY ĐỊNH PHÁT TRIỂN & VIẾT CODE BACKEND (LARAVEL 12)
## Kiến Trúc Chuẩn Bắt Buộc: `FormRequest → Controller → Service → API Resource`

> **LƯU Ý QUAN TRỌNG CHO TẤT CẢ DEVELOPER & AI AGENTS**:
> Bất kỳ chức năng hoặc API nào được xây dựng, mở rộng hay sửa đổi trong hệ thống Backend đều **BẮT BUỘC** phải tuân thủ nghiêm ngặt mô hình 4 tầng độc lập dưới đây. Tuyệt đối không được gộp tầng hoặc viết tắt.

---

## 1. Sơ Đồ Kiến Trúc & Luồng Dữ Liệu (Architecture Flow)

```
HTTP Request
     │
     ▼
┌─────────────────────────┐
│  1. FormRequest         │  Validate dữ liệu đầu vào, định nghĩa rules, custom error message.
│  (app/Http/Requests)    │  Tự động ném HttpResponseException (422) nếu dữ liệu không hợp lệ.
└────────────┬────────────┘
             │ (Dữ liệu đã qua kiểm duyệt: $request->validated())
             ▼
┌─────────────────────────┐
│  2. Controller (Mỏng)   │  ĐIỀU PHỐI (Orchestrator). Nhận FormRequest, chuyển payload sang Service
│  (app/Http/Controllers) │  thông qua Dependency Injection, nhận kết quả và bọc vào API Resource.
└────────────┬────────────┘
             │ (Gọi phương thức nghiệp vụ)
             ▼
┌─────────────────────────┐
│  3. Service (Dày)       │  XỬ LÝ NGHIỆP VỤ & TRUY VẤN (Business Logic).
│  (app/Services)         │  Eloquent queries, xử lý slug, tính toán, upload files, ném DomainException.
└────────────┬────────────┘
             │ (Trả về Model / Collection / Paginator / Primitive Data)
             ▼
┌─────────────────────────┐
│  4. API Resource        │  CHUẨN HÓA DỮ LIỆU ĐẦU RA (Output Transformer).
│  (app/Http/Resources)   │  Format cấu trúc JSON, ẩn trường nhạy cảm, eager load quan hệ an toàn.
└────────────┬────────────┘
             │
             ▼
JSON Response -> Frontend Next.js Client
```

---

## 2. Chi Tiết Trách Nhiệm Từng Tầng (Layer Specifications)

### Tầng 1: `FormRequest` (`app/Http/Requests/`)
- Mọi Request nhận dữ liệu (`POST`, `PUT`, `PATCH`) hoặc có tham số lọc (`GET` query parameters) đều **PHẢI** kế thừa [`App\Http\Requests\BaseFormRequest`](./app/Http/Requests/BaseFormRequest.php).
- **Trách nhiệm**:
  - Khai báo quy tắc xác thực dữ liệu trong hàm `rules(): array`.
  - Khai báo thông điệp lỗi tóm tắt trong hàm `validationErrorMessage(): string`.
  - Lớp cơ sở `BaseFormRequest` sẽ tự động chuyển lỗi validation thành định dạng JSON chuẩn của hệ thống:
    ```json
    {
      "success": false,
      "message": "Dữ liệu không hợp lệ.",
      "errors": {
        "field_name": ["Thông báo lỗi chi tiết"]
      }
    }
    ```
- **NGHIÊM CẤM**:
  - Không dùng `Validator::make()` hoặc `$request->validate()` trong Controller.
  - Không truy vấn cơ sở dữ liệu để thay đổi trạng thái trong Request.

---

### Tầng 2: `Controller` (`app/Http/Controllers/Api/`)
- Controller phải là **Controller mỏng (Skinny Controller)**.
- **Trách nhiệm**:
  - Inject Service thông qua Constructor Dependency Injection.
  - Nhận `FormRequest` tương ứng (ví dụ `StoreProductRequest $request`).
  - Lấy dữ liệu an toàn qua `$request->validated()`.
  - Chuyển tiếp vào Service: `$result = $this->productService->createProduct($request->validated());`.
  - Trả về `JsonResponse` với API Resource:
    ```php
    return response()->json([
        'success' => true,
        'message' => 'Thao tác thành công.',
        'data'    => new ProductResource($result),
    ], 200); // hoặc 201 khi tạo mới
    ```
- **NGHIÊM CẤM**:
  - Không gọi trực tiếp Eloquent (`Product::where(...)`, `Category::create(...)`, `DB::table(...)`) trong Controller.
  - Không viết logic tạo chuỗi (slug, mã hóa, upload file vật lý) trong Controller.
  - Không trả thẳng Model/Collection ra `response()->json()` mà không bọc Resource.

---

### Tầng 3: `Service` (`app/Services/`)
- Service là **Nơi tập trung 100% logic nghiệp vụ**.
- **Trách nhiệm**:
  - Thực hiện các truy vấn cơ sở dữ liệu thông qua Eloquent Models.
  - Xử lý logic như: tự động sinh slug duy nhất, gán giá trị mặc định, kiểm tra ràng buộc logic nghiệp vụ (ví dụ: không xóa danh mục nếu đang có sản phẩm con).
  - Ném `DomainException` kèm câu thông báo tiếng Việt khi vi phạm quy tắc nghiệp vụ.
  - Xử lý lưu trữ tệp tin vật lý (upload ảnh, tài liệu).
- **NGHIÊM CẤM**:
  - Không truy cập trực tiếp biến toàn cục `$_POST`, `$_GET`, `request()` trong Service. Dữ liệu phải được truyền vào dưới dạng tham số hàm (mảng `array $data` hoặc kiểu nguyên thủy).
  - Không trả về HTTP Response hoặc `response()->json()` từ Service.

---

### Tầng 4: `API Resource` (`app/Http/Resources/`)
- Mọi dữ liệu trả về cho client đều phải được format qua lớp kế thừa `Illuminate\Http\Resources\Json\JsonResource`.
- **Trách nhiệm**:
  - Chuyển đổi Model Eloquent sang mảng JSON đúng chuẩn hợp đồng với Frontend.
  - Sử dụng `$this->whenLoaded(...)` khi serialize các mối quan hệ (Eager loading) để tránh lỗi N+1 Query.
  - Đảm bảo kiểu dữ liệu nhất quán (ví dụ ép kiểu boolean `(bool) $this->is_featured`, ép kiểu số, v.v.).

---

## 3. Quy Ước Đặt Tên & Cấu Trúc Thư Mục (Naming Conventions)

| Tầng | Vị trí thư mục | Quy ước đặt tên lớp | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Request** | `app/Http/Requests/{Module}/` | `{Action}{Model}Request` | `StoreProductRequest`, `UpdateProductRequest`, `ProductFilterRequest` |
| **Controller** | `app/Http/Controllers/Api/{Admin?}/` | `{Model}{Admin?}Controller` | `ProductController`, `ProductAdminController` |
| **Service** | `app/Services/` | `{Model}Service` | `ProductService`, `CategoryService`, `QuoteRequestService` |
| **Resource** | `app/Http/Resources/` | `{Model}Resource` | `ProductResource`, `CategoryResource`, `QuoteRequestResource` |

---

## 4. Chuẩn Cấu Trúc JSON Phản Hồi (API Response Standards)

Mọi API phản hồi bắt buộc tuân theo định dạng đồng nhất để Frontend Next.js không bị crash:

### Phản hồi thành công (200 / 201)
```json
{
  "success": true,
  "message": "Thông điệp thông báo nếu có (tùy chọn)",
  "data": { ... } // hoặc [ ... ]
}
```

### Phản hồi phân trang (200)
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 54,
    "per_page": 12,
    "current_page": 1,
    "last_page": 5
  },
  "meta": { ... }
}
```

### Phản hồi lỗi Validation (422)
```json
{
  "success": false,
  "message": "Thông điệp lỗi tóm tắt.",
  "errors": {
    "field": ["Lỗi cụ thể của trường"]
  }
}
```

### Phản hồi lỗi Nghiệp Vụ / Quyền (401 / 403 / 422)
```json
{
  "success": false,
  "message": "Mô tả nguyên nhân lỗi bằng tiếng Việt chuẩn."
}
```

---

## 5. Checklist Trước Khi Commit / Pull Request (Self-Review Checklist)

Mỗi khi tạo mới hoặc sửa bất kỳ API nào, hãy kiểm tra lần lượt:
- [ ] Dữ liệu đầu vào đã có `FormRequest` kế thừa `BaseFormRequest` chưa?
- [ ] Controller có mỏng không? Có chứa truy vấn DB trực tiếp hay không?
- [ ] Logic nghiệp vụ, query và tính toán đã đặt trọn vẹn trong `Service` chưa?
- [ ] Dữ liệu trả về đã đi qua `API Resource` chưa?
- [ ] Chạy `cd backend; php artisan test` đạt 100% Pass và không có lỗi cú pháp?
