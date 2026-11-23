# Caption và chữ trên màn hình

Hai chỗ này là mặt chữ của video. Storytime phần lớn người xem mở tiếng, nhưng
không phải tất cả — chữ phải tự đứng được.

## Caption

### Quy ước của repo

- **Dưới 8 từ mỗi dòng.** Đây là quy ước của repo này cho dễ đọc trên màn hình
  điện thoại, không phải chuẩn chính thức của nền tảng nào.
- Xuống dòng theo **nhịp nói**, không theo độ dài câu viết.
- Không viết hoa giữa dòng.
- Không dùng dấu chấm cuối dòng trừ khi hết ý.

### Ví dụ

**Sai — một dòng dài:**

> Chuyện mẹ tôi tiết kiệm tới mức tôi đã hiểu sai bà suốt mười năm trời

**Đúng — ba dòng theo nhịp:**

> Chuyện mẹ tôi tiết kiệm
> tới mức tôi hiểu sai bà
> mười năm

**Sai — xuống dòng giữa cụm từ:**

> Chuyện mẹ tôi tiết kiệm tới
> mức tôi hiểu sai bà mười năm

Dòng thứ nhất cắt giữa cụm "tới mức", đọc lên phải ngắt sai chỗ.

### Nguyên tắc xuống dòng

Xuống dòng ở chỗ người nói sẽ ngừng lấy hơi. Ba chỗ nên xuống:

1. Sau một cụm ý hoàn chỉnh.
2. Trước chỗ lật.
3. Sau chỗ lật, để câu lật đứng một mình.

### Emoji

Emoji chỉ dùng khi có việc: đánh dấu chỗ lật, hoặc thay một từ. Không trang trí.

| Dùng được | Không nên |
|---|---|
| `bà để dành cho tôi đi học 🥲` | `Chuyện cảm động lắm nha mọi người 😭😭😭` |
| `bảy năm 📅` khi cần nhấn mốc thời gian | Mỗi dòng một emoji |

Quy tắc: nếu bỏ emoji mà câu vẫn đủ nghĩa, bỏ emoji.

### Hashtag

Đặt cuối caption, 2–4 cái, viết thường, không nhồi. Xem thêm
`../tiktok-native/references/search-keywords-vi.md`.

## Chữ trên màn hình

### Quy ước

- **≤ 8 từ mỗi dòng** (cùng quy ước với caption).
- Một khung hình chỉ một khối chữ.
- Chữ phải đọc được trong **một giây**. Không đọc kịp là chữ vô nghĩa.
- Chữ đặt trong vùng an toàn: chừa dải trên và dải dưới cho giao diện TikTok.

### Cách đánh dấu chỗ lên hình

Trong production doc, ghi chữ lên hình ở cột `on-screen text` cùng dòng với shot
tương ứng. Trong file lời thoại, đánh dấu bằng ngoặc vuông:

```
[dòng 1] Suốt bảy năm tôi nghĩ mẹ tôi keo kiệt.
[dòng 2] Cho tới hôm tôi thấy cuốn sổ.
```

`[dòng 1]` / `[dòng 2]` là mốc lên hình, không phải nội dung đọc.

### Ba loại chữ trên màn hình

| Loại | Vai trò | Ví dụ |
|---|---|---|
| Chữ hook | Chốt nghĩa 3 giây đầu, hiểu được khi tắt tiếng | `Mẹ tôi giấu một cuốn sổ bảy năm` |
| Chữ dẫn | Đánh dấu mốc thời gian hoặc địa điểm | `Sài Gòn, 2003` |
| Chữ nhấn | Tách một chi tiết quan trọng khỏi lời nói | `bốn năm học phí` |

Không dùng chữ trên màn hình để chép lại toàn bộ lời nói. Chữ lặp lời nói là
lười, và làm rối màn hình.

### Ví dụ đúng/sai

| Sai | Đúng | Vì sao |
|---|---|---|
| `Mẹ tôi đã giữ một cuốn sổ tiết kiệm trong suốt bảy năm mà không cho ai biết` | `Mẹ tôi giấu một cuốn sổ bảy năm` | 15 từ → 7 từ, đọc kịp trong 1 giây |
| `sổ tiết kiệm` (chữ nhỏ, ở góc dưới) | `bốn năm học phí` (giữa khung, chữ lớn) | Chữ ở góc dưới bị UI che |
| `CHUYỆN CẢM ĐỘNG` | `cuốn sổ trong ngăn kéo` | Hoa toàn bộ + tự khen cảm xúc |

## Kiểm trước khi đăng

1. Caption: mỗi dòng dưới 8 từ, xuống dòng theo nhịp nói.
2. Caption: đọc to lên nghe như câu nói, không như tiêu đề báo.
3. Chữ trên màn hình: mỗi khung ≤ 8 từ, đọc kịp trong một giây.
4. Chữ không nằm trong dải trên/dưới bị giao diện che.
5. Tắt tiếng xem lại: hook và payoff vẫn hiểu được.
6. Không có dòng nào chỉ để trang trí.
