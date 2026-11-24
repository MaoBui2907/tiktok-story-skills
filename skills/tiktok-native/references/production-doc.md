# Production doc — bảng 5 cột

Production doc là **đầu ra bắt buộc** của `tiktok-native`. Không có bảng này thì
skill chưa xong. Người nhận bảng là editor hoặc chính người quay, và họ phải quay
được mà không cần hỏi lại.

## Template

```md
| shot | on-screen text | spoken | sound | timing |
|---|---|---|---|---|
| 1 | … | … | … | 0–3 |
```

## Quy ước

| Quy ước | Chi tiết |
|---|---|
| Mỗi dòng một shot | Không gộp hai hành động hình vào một dòng. Muốn đổi hình thì thêm dòng |
| `timing` bằng giây | Dạng `0–3`, `3–7`. Cộng lại phải đúng độ dài video |
| `on-screen text` ≤ 8 từ/dòng | Quá 8 từ thì tách dòng hoặc viết lại ngắn hơn |
| `spoken` là lời đọc thật | Không ghi "giới thiệu nhân vật". Ghi nguyên câu sẽ nói |
| `sound` phải cụ thể | `audio gốc`, tên sound, hoặc `im`. Không ghi "nhạc nhẹ" |
| Không có dòng trống | Mọi shot có đủ 5 ô. Ô không dùng thì ghi `im` / `–` |
| Tổng timing khớp | Cộng cột `timing` = độ dài mục tiêu, sai thì sửa |

## Bảng điền mẫu — story 30 giây

Chủ đề: căn nhà của mẹ và cuốn sổ tiết kiệm (ví dụ mẫu, không phải số liệu).

| shot | on-screen text | spoken | sound | timing |
|---|---|---|---|---|
| 1 | Mẹ tôi giữ một cuốn sổ bảy năm | Suốt bảy năm tôi nghĩ mẹ tôi keo kiệt, cho tới hôm tôi thấy cuốn sổ trong ngăn kéo. | audio gốc – giọng kể, không nhạc | 0–3 |
| 2 | Căn nhà cũ, một người dọn dẹp | Nhà tôi cũ, mẹ tôi lau từ sáng tới tối, mà không cho ai động vào đồ của bà. | audio gốc + tiếng chổi | 3–8 |
| 3 | Tủ quần áo, ba cái áo | Quần áo bà mặc có ba cái, vá lại tới lần thứ tư. Tôi mua áo mới thì bà bảo phí. | audio gốc | 8–13 |
| 4 | Ngăn kéo, cuốn sổ | Hôm đó mẹ đi chợ, tôi mở ngăn kéo tìm băng dính, và tôi thấy cuốn sổ. | audio gốc, nhạc nền vào rất nhỏ | 13–19 |
| 5 | Từng dòng ghi ngày và số tiền | Trong đó ghi từng ngày, từng khoản. Có một dòng ghi tên tôi, và số tiền học bốn năm đại học. | audio gốc + tiếng lật giấy | 19–22 |
| 6 | Bà tiết kiệm cho tôi, không cho mình | Bà tiết kiệm để tôi đi học. Còn tôi thì nghĩ bà keo với tôi. | im – 1 giây trước câu chốt | 22–27 |
| 7 | Tôi vẫn còn giữ cuốn sổ đó | Cuốn sổ đó tôi vẫn giữ. Bây giờ tới lượt tôi ghi. | audio gốc, không nhạc | 27–30 |

Kiểm nhanh bảng mẫu: 7 dòng, cộng timing = 30 giây, mọi dòng có đủ 5 ô, không dòng
nào quá 8 từ ở cột chữ trên màn hình.

## Lỗi hay gặp

| Lỗi | Vì sao hỏng | Sửa |
|---|---|---|
| Cột `spoken` ghi mô tả thay vì lời | Editor không biết đọc gì, phải tự viết | Chép nguyên câu sẽ đọc |
| Một dòng chứa nhiều shot | Không biết khi nào đổi hình | Tách mỗi hành động một dòng |
| Timing cộng không khớp độ dài | Lúc dựng bị thiếu hoặc thừa giây | Tính lại từ dòng cuối lên |
| `sound` trống | Lúc dựng phải đi tìm nhạc | Ghi `audio gốc` ngay từ đầu |
| Chữ trên màn hình dài cả câu | Che hình, khó đọc | Rút xuống ≤ 8 từ |
| Có dòng chỉ để chuyển cảnh | Là dead air, không làm việc gì | Cắt, dồn giây cho payoff |

## Kiểm trước khi giao

1. Đủ 5 cột, không có cột nào bỏ trống.
2. Cộng `timing` bằng độ dài mục tiêu.
3. Mỗi dòng một shot, không dòng nào mô tả hai hành động hình.
4. Mọi chữ trên màn hình ≤ 8 từ/dòng.
5. Cột `sound` ghi cụ thể ở mọi dòng.
6. Cột `spoken` đọc lên là lời tự nhiên, không phải mô tả.
7. Có ít nhất một khoảng `im` hoặc một nhịp chậm trước payoff.
