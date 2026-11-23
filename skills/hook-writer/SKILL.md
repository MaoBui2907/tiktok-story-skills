---
name: hook-writer
description: Dùng khi người dùng đã có nội dung story và cần viết hook cho 3 giây đầu video — ví dụ "viết hook cho chuyện này", "hook này có bị bait không", "cho tôi 5 phương án hook để test", "mở bài thế nào cho người ta dừng lại", "hook với nội dung có khớp không", "first 3 seconds viết sao". Skill này viết hook đúng nội dung, kiểm hook có trả được payoff, và sinh 5 biến thể khác archetype để test có ý nghĩa. Không dùng khi chưa có khung story — chạy story-core trước.
---

# hook-writer — hook đúng nội dung, 5 biến thể để test

Hook là 3 giây quyết định video có được xem hay không. Nhưng hook sai còn tệ hơn
hook nhạt: nó kéo người xem vào rồi làm họ thất vọng, và họ rời đi kèm cảm giác
bị lừa.

## Quy trình 5 bước

### Bước 1 — Đọc nội dung, không đọc ý tưởng

Đọc bản script/nháp thật, không đọc mô tả. Ghi ra giấy ba thứ:

- nhân vật là ai, quan hệ với người kể thế nào;
- biến cố chính xảy ra cái gì;
- payoff, tức là câu trả lời mà video sẽ đưa.

Nếu chưa có đủ ba thứ này, quay lại `story-core`. Hook viết trên nội dung chưa
chốt sẽ phải viết lại.

### Bước 2 — Tìm chất liệu mạnh nhất

Trong nội dung, tìm chi tiết mạnh nhất — thứ mà nếu kể cho bạn bè nghe, họ sẽ
hỏi lại ngay. Thường là một chi tiết rất cụ thể: một con số, một câu nói, một
hành động nhỏ, một thứ bị đảo ngược.

Chất liệu mạnh không phải chi tiết gây sốc. Nó là chi tiết **có thật trong
chuyện** và **mở được câu hỏi**.

### Bước 3 — Viết hook

Hook có ba kênh, phải khớp nhau:

| Kênh | Vai trò | Kiểm thế nào |
|---|---|---|
| Hình | Cho mắt thứ để nhìn ngay giây đầu | Tắt tiếng, chỉ xem hình, có hiểu chuyện gì không |
| Chữ trên màn hình | Chốt nghĩa, đọc được khi không bật âm | Chữ có tự đứng được một mình không |
| Lời nói | Cho tai câu mở loop | Câu đầu có mở câu hỏi không |

Ba kênh nói **cùng một chuyện**. Hình một đằng, lời một nẻo là hook hỏng — người
xem không tin cái nào.

### Bước 4 — Test "payoff có trả được không"

Đây là bước loại hook bait-and-switch. Chạy `references/hook-truth-test.md`. Tóm
tắt: hook hứa gì thì cuối video phải giao đúng cái đó, không giao thứ gần giống.

### Bước 5 — Sinh 5 biến thể khác archetype

Năm biến thể dùng **năm archetype khác nhau**, không phải năm cách đặt dấu phẩy
trên cùng một câu. Xem `references/hook-variants-matrix.md` để chọn tổ hợp.

Lý do: test hook chỉ có nghĩa khi các phương án khác nhau về **cách tiếp cận**.
Năm câu cùng khuôn thì kết quả test chỉ nói được "khuôn này ổn hay không", không
nói được gì thêm.

## Định dạng đầu ra

Luôn trả về bảng này, không trả về danh sách câu rời:

| # | hook | archetype | payoff nó hứa | rủi ro |
|---|---|---|---|---|
| 1 | … | mở loop | … | … |
| 2 | … | con số cụ thể | … | … |
| 3 | … | phủ định | … | … |
| 4 | … | đối lập trong-ngoài | … | … |
| 5 | … | lời thoại giữa cuộc | … | … |

Cột `payoff nó hứa` là câu trả lời mà người xem sẽ chờ. Cột `rủi ro` là trường
hợp hook này hỏng: nội dung không trả được, hoặc trả được nhưng quá muộn.

Sau bảng: chọn một hook, viết lý do chọn bằng hai câu — dựa trên chất liệu ở bước
2, không dựa trên sở thích.

## Bảy archetype

Chi tiết đầy đủ, khuôn tiếng Việt và ví dụ: `references/hook-archetypes-vi.md`.

1. **Mở loop** — đặt câu hỏi chưa trả lời.
2. **Con số cụ thể** — con số có thật trong chuyện, gây tò mò vì nó lệch.
3. **Phủ định** — "đừng…", "không phải…", chặn một hiểu nhầm.
4. **Đối lập trong-ngoài** — vẻ ngoài một đằng, bên trong một nẻo.
5. **Lời thoại giữa cuộc** — mở bằng một câu nói, không dẫn dắt.
6. **POV ngôi thứ nhất** — "tôi" làm chủ thể, người xem đứng vào vị trí đó.
7. **Tiết lộ một nửa** — nói kết quả, giấu nguyên nhân.

## Cấm

- Hook không có trong nội dung — bịa thêm chi tiết để hook mạnh hơn.
- Hook hứa payoff không tồn tại, hoặc payoff chỉ xuất hiện nếu người xem bấm vào
  video khác.
- Năm biến thể cùng archetype.
- Hook dài quá 3 giây đọc — câu dài thì cắt, không thì đọc nhanh.
