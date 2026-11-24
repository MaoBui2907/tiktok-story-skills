# Bước 4 — Lời thoại và caption (`vi-voice`)

## Lời đọc sau khi qua `vi-voice`

```
Mẹ tôi nói "mẹ đi chợ đây" mỗi sáng. Suốt mười năm.

Bốn giờ sáng. Bà xách làn, đi ra cửa, nói đúng câu đó.

Mười năm, không ai trong nhà hỏi thêm một câu nào. Kể cả tôi.

Cho tới một hôm tôi dậy trước bà, và tôi thấy bà không đi về phía chợ.

Bà rẽ trái. Về phía bến xe. Tôi đi sau, cách một đoạn.

Bà cúi xuống, bốc từng bao hàng từ xe tải. Bốn giờ sáng. Một mình.

Sáu giờ bà mới ra chợ. Bảy giờ về, làn rau đầy.

Mười năm. Không một lần kể.

Hỏi thì bà nói: "Nói ra thì con không chịu đi học."
```

## Sáu nhóm quy tắc đã áp

### 1. Nhịp câu

Câu đều ngắn, mỗi câu một việc. Đoạn "Mười năm. Không một lần kể." là hai câu
ngắn liền nhau ở chỗ căng nhất — cố ý.

Chỗ đã sửa: câu "Cho tới một hôm tôi dậy trước bà, và tôi thấy bà không đi về phía
chợ" đọc lên dài vì mệnh đề phụ. Giữ nguyên một câu nhưng thêm dấu phẩy trước
"và" để có chỗ ngắt hơi.

### 2. Khẩu ngữ

Giữ `thì` ở câu chốt: "Hỏi thì bà nói…". Đây là từ nối tự nhiên, thay cho "khi
được hỏi". Không thêm tiểu từ nào khác — người kể trong chuyện này nói ít, thêm
`kiểu`, `ấy` sẽ lệch giọng.

### 3. Xưng hô

Một hệ duy nhất: **tôi – bà – con**.

- Người kể gọi mình là `tôi` (không phải `mình`, không phải `em`).
- Gọi mẹ là `bà` trong lời kể, nhất quán từ đầu tới cuối.
- Lời thoại của mẹ gọi người kể là `con` — đây là lời thoại, được phép khác hệ.

Kiểm: đọc đoạn 1 và đoạn cuối, cùng hệ `tôi – bà`.

### 4. Tránh văn dịch

Ba chỗ đã sửa so với bản nháp:

| Trước | Sau |
|---|---|
| "Việc mẹ tôi dậy sớm đã diễn ra trong suốt mười năm." | "Mẹ tôi nói 'mẹ đi chợ đây' mỗi sáng. Suốt mười năm." |
| "Tôi đã có thể thấy rằng bà không đi về phía chợ." | "Tôi thấy bà không đi về phía chợ." |
| "Bà rời khỏi nhà một cách lặng lẽ vào lúc bốn giờ sáng." | "Bốn giờ sáng. Bà xách làn, đi ra cửa." |

### 5. Số, đơn vị, tên riêng đọc thành lời

| Viết | Đọc |
|---|---|
| `4h sáng` | "bốn giờ sáng" |
| `10 năm` | "mười năm" |
| `6h` | "sáu giờ" |
| `7h` | "bảy giờ" |

Không có tên riêng cần đọc lại, không có đơn vị đo lường.

### 6. Caption và chữ trên màn hình

**Caption:**

```
Mẹ đi chợ mỗi sáng
mười năm, cùng một giờ
và tôi chưa một lần hỏi

#chuyengiadinh #mevacongai
```

Mỗi dòng dưới 8 từ, xuống dòng theo nhịp nói, không viết hoa giữa dòng. Hashtag 2
cái, đặt cuối.

**Chữ trên màn hình:**

| Shot | Chữ | Số từ |
|---|---|---|
| 1 | Mẹ tôi nói câu này mỗi sáng | 7 |
| 2 | Cùng một giờ, cùng một câu | 6 |
| 3 | Mười năm không ai hỏi thêm | 6 |
| 4 | Một hôm tôi dậy trước bà | 6 |
| 5 | Bà rẽ trái, về phía bến xe | 7 |
| 6 | Bà bốc hàng từ bốn giờ sáng | 7 |
| 7 | Sáu giờ bà mới ra chợ | 6 |
| 8 | Mười năm, không một lần kể | 6 |
| 9 | Vì con, bà nói vậy | 5 |

Dòng dài nhất 7 từ, vẫn dưới ngưỡng 8 từ/dòng của quy ước repo.

## Quy trình 4 bước đã chạy

1. **Đọc to bản nháp** — vấp ở câu 4 (mệnh đề phụ dài), ghi lại.
2. **Sửa theo sáu nhóm** — thứ tự: xưng hô → văn dịch → nhịp → khẩu ngữ → số →
   caption.
3. **Đọc to lại** — hết vấp.
4. **Kiểm hệ xưng hô** — đoạn đầu và đoạn cuối cùng hệ `tôi – bà`.

## Chuyển sang bước 5

Bản lời đọc trên đây được ghi lại nguyên văn vào `05-ban-nhap.md` để chạy
`story-deslop`. Giữ luôn những câu sau đó sẽ bị sửa, để thấy rõ checker bắt gì.
