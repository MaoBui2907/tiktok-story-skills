---
name: vi-voice
description: Dùng khi người dùng cần làm lời kể tiếng Việt đọc lên nghe tự nhiên — ví dụ "script này đọc lên gượng quá", "sửa câu cho nó tự nhiên", "xuống dòng caption giúp tôi", "xưng hô thế nào cho đúng", "câu này nghe như văn dịch", "viết số tiền thành lời đọc sao", "on-screen text viết thế nào cho gọn". Skill này chỉnh nhịp câu, khẩu ngữ, xưng hô, bỏ văn dịch, chuyển số và đơn vị thành lời đọc, và gói caption với chữ trên màn hình. Không dùng để viết ý tưởng mới hay dựng khung story.
---

# vi-voice — tiếng Việt đọc lên phải nghe như người nói

Đây là skill riêng của repo, không lấy từ đâu. Story Việt viết bằng câu dịch từ
tiếng Anh thì người xem nghe ra ngay, dù nội dung tốt.

Sáu nhóm quy tắc dưới đây áp lên một script đã có. Không viết lại nội dung, không
đổi sự kiện.

## 1. Nhịp câu

Câu kể bình thường ngắn, mỗi câu một ý. Khi căng thì câu còn ngắn hơn. Câu dài
chỉ dùng khi cần dồn, và dồn thì phải có chủ đích.

| Sai | Đúng |
|---|---|
| "Khi tôi bước vào căn phòng mà tôi đã không quay lại trong suốt nhiều năm, mọi thứ dường như vẫn vậy." | "Tôi bước vào phòng. Bảy năm rồi tôi không quay lại. Mọi thứ vẫn vậy." |
| "Cô ấy nói với tôi rằng cô ấy sẽ không bao giờ quay lại nơi này thêm một lần nào nữa." | "Chị nói: 'Em không quay lại đây nữa.'" |

Chi tiết: `references/nhip-cau.md`.

## 2. Khẩu ngữ

Lời kể cần tiểu từ và từ nối của người nói: `xong`, `rồi`, `thì`, `chứ`, `ấy`,
`đấy`, `kiểu`, `mà`, `nên`, `hẳn`, `luôn`, `vậy đó`.

| Sai | Đúng |
|---|---|
| "Sau khi hoàn thành việc dọn dẹp, tôi tìm thấy cuốn sổ." | "Dọn xong thì tôi thấy cuốn sổ." |
| "Đó là lý do tại sao tôi quyết định không nói gì." | "Thế nên tôi không nói gì." |

Không lạm dụng: mỗi câu một tiểu từ là đủ. Danh sách đầy đủ + cảnh báo lạm dụng:
`references/khau-ngu.md`.

## 3. Xưng hô

Giữ **một hệ xưng hô duy nhất** trong một video. Đổi hệ giữa chừng là lỗi nặng
nhất của story tiếng Việt — người nghe mất tin ngay.

| Sai | Đúng |
|---|---|
| "Tôi về nhà, mình kể với mẹ, rồi bà bảo em cứ đi." | "Tôi về nhà, kể với mẹ, rồi bà bảo tôi cứ đi." |
| "Em ấy khóc, và chúng tôi không nói gì." | "Nó khóc. Tôi không nói gì." |

Ma trận xưng hô theo quan hệ, ảnh hưởng vùng miền: `references/xung-ho.md`.

## 4. Tránh văn dịch

Đây là nhóm quan trọng nhất. Câu dịch từ tiếng Anh có dấu hiệu rất rõ:

| Dấu hiệu | Sai | Đúng |
|---|---|---|
| Danh từ hoá | "việc dọn dẹp căn nhà mất ba ngày" | "dọn nhà mất ba ngày" |
| `một cách + tính từ` | "bà nói một cách bình thản" | "bà nói tỉnh queo" |
| Câu bị động không tác nhân | "cuốn sổ được tìm thấy trong ngăn kéo" | "tôi tìm thấy cuốn sổ trong ngăn kéo" |
| `có thể thấy rằng` | "có thể thấy rằng mẹ tôi rất tiết kiệm" | "mẹ tôi tiết kiệm lắm" |
| `đóng vai trò quan trọng` | "cuốn sổ đóng vai trò quan trọng trong câu chuyện" | "cuốn sổ là thứ duy nhất bà để lại" |
| `không chỉ … mà còn` | "bà không chỉ tiết kiệm mà còn rất khắt khe" | "bà tiết kiệm, và khắt khe nữa" |
| `về việc` / `trong quá trình` | "trong quá trình dọn dẹp, tôi nhận ra về việc mẹ vất vả" | "dọn tới nửa thì tôi hiểu mẹ vất vả thế nào" |

Bảng pattern đầy đủ + before/after: `references/tranh-van-dich.md`.
Bộ 12 cặp đúng/sai đọc kỹ: `references/vi-dung-sai.md`.

## 5. Số, đơn vị, tên riêng đọc thành lời

Lời đọc phải là thứ đọc ra được, không phải chữ viết tắt.

| Sai | Đúng |
|---|---|
| "tôi có 30tr trong tài khoản" | "tôi có ba chục triệu trong tài khoản" |
| "kết quả XN lúc 14h30" | "kết quả xét nghiệm lúc hai giờ rưỡi chiều" |
| "Sài Gòn 1975" | "Sài Gòn năm bảy lăm" |
| "TP.HCM" | "Sài Gòn" hoặc "thành phố" tuỳ ngữ cảnh |

Quy tắc: đọc to lên. Chỗ nào phải diễn giải mới đọc được là chỗ phải viết lại.

## 6. Caption và chữ trên màn hình

Caption dưới 8 từ mỗi dòng là **quy ước của repo**, không phải chuẩn nền tảng.
Xuống dòng theo nhịp nói. Không viết hoa giữa dòng.

| Sai | Đúng |
|---|---|
| `Chuyện mẹ tôi tiết kiệm tới mức tôi đã hiểu sai bà suốt mười năm trời` | `Chuyện mẹ tôi tiết kiệm`<br>`tới mức tôi hiểu sai bà`<br>`mười năm` |

Chi tiết: `references/caption-va-on-screen.md`.

## Quy trình 4 bước áp lên script có sẵn

1. **Đọc to toàn bộ script, ghi lại chỗ vấp.** Không sửa gì trong lượt này. Đánh
   dấu chỗ phải lấy hơi, chỗ nghe như đọc báo, chỗ phải đọc lại.
2. **Sửa theo sáu nhóm, từ nặng tới nhẹ.** Thứ tự: xưng hô (sai hệ là hỏng cả
   video) → văn dịch → nhịp câu → khẩu ngữ → số/đơn vị → caption.
3. **Đọc to lại toàn bộ.** Vẫn còn chỗ vấp thì sửa tiếp. Đừng chuyển bước khi
   còn vấp.
4. **Kiểm hệ xưng hô lần cuối** bằng cách đọc riêng đoạn đầu và đoạn cuối: hai
   đoạn phải cùng một hệ.

Sau bước 4, chuyển sang `story-deslop` để bắt phần văn AI còn lại.
