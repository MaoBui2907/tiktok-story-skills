# Ví dụ end-to-end — story 30 giây

Một story TikTok tiếng Việt hoàn chỉnh, chạy đủ 5 skill từ đầu tới cuối. Mục đích
là để thấy mỗi skill nhận gì và giao ra gì, không phải để làm mẫu nội dung.

| Bước | File | Skill sinh ra | Thời gian đọc |
|---|---|---|---|
| 1 | `01-y-tuong.md` | `story-core` | ~3 phút |
| 2 | `02-hook.md` | `hook-writer` | ~3 phút |
| 3 | `03-script.md` | `tiktok-native` | ~5 phút |
| 4 | `04-loi-thoai-va-caption.md` | `vi-voice` | ~4 phút |
| 5 | `05-ban-nhap.md` → `05-deslop.md` | `story-deslop` | ~3 phút |

## Đọc theo thứ tự nào

Đọc từ `01` tới `05`. Mỗi file là đầu ra của một skill và đầu vào của skill sau,
nên đọc nhảy cóc sẽ khó hiểu. Riêng `05-ban-nhap.md` là bản nháp trước khi sửa —
đọc trước `05-deslop.md`.

## Ghi chú về ví dụ này

- Đây là **ví dụ mẫu**, không phải số liệu. Không có kết quả hiệu năng nào ở đây,
  và không nên đọc ví dụ này như bằng chứng rằng kỹ thuật trong repo "hiệu quả".
- Độ dài 30 giây là một lựa chọn cho ví dụ, không phải độ dài tối ưu. Repo dùng
  khung 15–60 giây theo quyết định sản phẩm.
- Chuyện trong ví dụ là chuyện hư cấu, viết cho repo này. Nhân vật và chi tiết
  không lấy từ đâu.

## Kiểm lại ví dụ

Chạy `story-deslop` trên bản nháp để so với output trong `05-deslop.md`:

```sh
node skills/story-deslop/scripts/check-vi-ai-patterns.js --check examples/01-storytime-30s/05-ban-nhap.md
```
