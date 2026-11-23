---
name: tiktok-native
description: Dùng khi người dùng cần chuyển script story thành production doc quay được cho TikTok — ví dụ "chia shot giúp tôi", "script này quay thế nào", "đặt từ khoá ở đâu để lên search", "dùng sound nào", "on-screen text viết gì", "xuất bảng shot cho editor", "video này có đúng kiểu FYP không". Skill này cho ra bảng production doc 5 cột, xử lý sound/trend, đặt từ khoá cho TikTok search và giữ chữ trong vùng an toàn 9:16. Không dùng khi còn đang chốt ý tưởng hoặc chưa có hook.
---

# tiktok-native — làm video đúng cách người ta xem TikTok

Story hay mà đóng gói sai thì không ai xem. Skill này lo phần đóng gói: cách
phân phối trên TikTok hoạt động ra sao (định tính), sound, từ khoá, và bảng
production doc mà editor quay được ngay.

## FYP là content-first

Trên TikTok, video được đưa tới người lạ trước, người theo dõi sau. Nghĩa là reach
đến từ **phản ứng của người xem với nội dung**, không từ số follower. Hệ quả thực
tế:

- Đừng dựa vào "fan mình sẽ xem". Video phải hiểu được với người chưa biết mình.
- Đừng dựa vào uy tín kênh để giữ người xem. Không có uy tín nào giữ được 3 giây.
- Mỗi video là một lần thử độc lập. Video trước tốt không bảo đảm video sau tốt.

## Thứ tự signal — định tính, không phải trọng số

Các phản ứng dưới đây quan trọng theo thứ tự này. Đây là **thứ tự định tính**, để
biết ưu tiên sửa gì trước; không phải trọng số đo được, và repo không đưa trọng số
vì không có nguồn kiểm chứng.

1. **Xem hết** — người xem ở lại tới cuối.
2. **Xem lại** — họ quay lại xem lần nữa.
3. **Share** — họ gửi cho một người cụ thể.
4. **Comment** — họ nói gì đó.
5. **Save** — họ lưu lại để dùng sau.

Chi tiết từng signal và hành động thiết kế tương ứng: `references/fyp-signals.md`.

## Sound

- Chỉ bám trend khi trend **khớp thật** với nội dung. Bám trend lệch làm video
  nghe như quảng cáo.
- Không khớp trend thì dùng audio gốc: giọng mình, tiếng hiện trường. Audio gốc
  là lựa chọn mặc định cho storytime, không phải phương án dự phòng.
- Luôn kiểm quyền dùng nhạc trước khi đăng. Xem `references/sound-and-trend.md`.

## TikTok là search engine

Người xem gõ vào ô tìm kiếm của TikTok, không chỉ lướt FYP. Vì vậy từ khoá phải
nằm trong video, không chỉ trong caption.

Đặt từ khoá ở **bốn chỗ**:

| Chỗ | Cách đặt | Ghi chú |
|---|---|---|
| Lời nói | Nói nguyên cụm từ khoá ít nhất một lần | Nói tự nhiên, không đọc như đọc danh sách |
| Chữ trên màn hình | Một lần trong video, chữ lớn | Cùng cụm với lời nói |
| Caption | Đầu caption, không nhồi hashtag | Caption đọc được như câu |
| Chữ ở 3 giây đầu | Cụm khoá hoặc biến thể gần nghĩa | Không che mặt, không quá 8 từ/dòng |

Cách chọn 3–5 cụm từ khoá tiếng Việt: `references/search-keywords-vi.md`.

## Khung 9:16 và vùng an toàn

Heuristic: giữ toàn bộ chữ trong khoảng **80 phần trăm giữa khung** theo chiều
dọc, chừa dải trên và dải dưới cho giao diện TikTok (tên tài khoản, caption, nút
tương tác). Ghi rõ đây là **heuristic**, không phải thông số chính thức của nền
tảng, và giao diện TikTok thay đổi thì phải xem lại.

Quy ước thực hành:

- Chữ trên màn hình không đặt trong dải 15 phần trăm trên và 15 phần trăm dưới.
- Chủ thể chính (mặt người) không đặt sát mép dưới — caption sẽ che.
- Xuất khung 1080×1920, không xuất vuông rồi crop.

## Đầu ra bắt buộc: production doc 5 cột

Skill này **không** kết thúc bằng lời khuyên. Nó kết thúc bằng một bảng:

| shot | on-screen text | spoken | sound | timing |
|---|---|---|---|---|

Quy ước đầy đủ + bảng điền mẫu: `references/production-doc.md`.

Tóm tắt quy ước:

- Mỗi dòng một shot. Không gộp hai hành động hình vào một dòng.
- `timing` bằng giây, dạng `0–3`, cộng lại phải bằng độ dài video.
- `on-screen text` tối đa 8 từ mỗi dòng.
- `sound` ghi cụ thể: tên sound, hoặc "audio gốc", hoặc "im".
- `spoken` là lời đọc thật, không phải mô tả.

## Chạy tiếp

Production doc xong → `vi-voice` để chỉnh lời đọc và caption → `story-deslop` để
bắt văn AI trong lời thoại và chữ trên màn hình.
