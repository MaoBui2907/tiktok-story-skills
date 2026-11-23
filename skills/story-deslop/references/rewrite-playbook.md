# Rewrite playbook — sáu thao tác sửa

Sáu thao tác dưới đây là toàn bộ những gì được phép làm trong phase 3 của
`story-deslop`. Tất cả đều **đổi cách nói**, không đổi chuyện.

## 1. Xoá

Thao tác mạnh nhất và hay bị bỏ qua nhất. Áp dụng cho: câu rỗng, câu lặp, câu tự
khen cảm xúc, câu dẫn rỗng.

**Trước:**

> Sự thật là tôi đã không về nhà bảy năm. Đó là một khoảng thời gian dài. Tôi
> không nghĩ mình sẽ quay lại.

**Sau:**

> Bảy năm tôi không về. Tôi không nghĩ mình sẽ quay lại.

Đã xoá: câu dẫn ("sự thật là"), câu rỗng ("một khoảng thời gian dài").

**Cách kiểm:** xoá rồi đọc lại. Chặt hơn thì giữ, rối hơn thì khôi phục.

## 2. Hạ danh từ hoá về động từ

**Trước:**

> Việc phát hiện ra cuốn sổ đã khiến tôi thay đổi cách nhìn về mẹ.

**Sau:**

> Tôi mở ngăn kéo và thấy cuốn sổ. Từ hôm đó tôi nhìn mẹ khác đi.

Ba việc xảy ra cùng lúc: danh từ hoá thành động từ, câu dài thành hai câu, và
người kể thành chủ ngữ.

## 3. Đổi bị động sang chủ động

**Trước:**

> Cuốn sổ đã được bà giấu trong ngăn kéo. Nó đã được tìm thấy bởi tôi.

**Sau:**

> Bà giấu cuốn sổ trong ngăn kéo. Tôi tìm thấy nó.

**Cảnh báo:** không phải câu bị động nào cũng sai. Đôi khi giấu tác nhân là chủ
đích: "Cuốn sổ đã bị lấy đi." — câu này mạnh vì người kể không biết ai lấy. Giữ
khi việc giấu tác nhân có nghĩa.

## 4. Thay sáo ngữ bằng chi tiết

Đây là thao tác khó nhất, và nó là thao tác duy nhất làm văn tốt lên thay vì chỉ
sạch lên.

**Trước:**

> Mẹ tôi đã hy sinh vô cùng lớn lao cho tôi.

**Sau:**

> Mẹ tôi mặc ba cái áo trong bảy năm. Cái áo tôi mua cho bà hồi Tết vẫn còn
> nguyên nếp gấp.

Cùng một ý. Câu sau cho người nghe thấy, và tự hiểu "hy sinh" là gì.

**Quy tắc:** chi tiết thay thế phải là chi tiết **có thật trong chuyện**. Nếu
không có chi tiết thật, việc này không phải lỗi dụng bút mà là lỗi câu chuyện —
phải quay lại `story-core`, không được bịa.

## 5. Gộp câu vụn

Ngược với thao tác tách câu. Khi deslop, dễ tạo ra nhiều câu quá ngắn liên tiếp
đọc lên ngắt vụn.

**Trước:**

> Tôi mở cửa. Tôi thấy bà. Bà ngồi. Bà cầm túi. Túi nilon. Tôi biết. Có chuyện.

**Sau:**

> Tôi mở cửa, thấy mẹ ngồi ở bậc thềm. Tay bà cầm cái túi nilon. Tôi biết ngay
> là có chuyện.

**Nguyên tắc:** mỗi câu cần đủ một hình ảnh. Bốn từ trở xuống, không có ai làm
gì, thì gộp lại.

## 6. Cắt kết bài

**Trước:**

> Qua câu chuyện này, tôi nhận ra rằng tình cảm gia đình là điều quý giá nhất.
> Đây là một hành trình dài để tôi hiểu được bài học về lòng biết ơn.

**Sau:**

> Cuốn sổ đó tôi vẫn giữ. Bây giờ tới lượt tôi ghi.

Xoá toàn bộ phần tổng kết, thay bằng một hành động cụ thể ở hiện tại. Người nghe
tự rút ra bài học — và bài học họ rút ra thường mạnh hơn bài học được nói hộ.

## Thứ tự áp dụng

1. **Xoá trước** — đơn giản nhất, và giảm được nhiều finding nhất.
2. **Hạ danh từ hoá** — làm lộ chủ thể, giúp các bước sau dễ.
3. **Đổi bị động sang chủ động** — cùng lý do.
4. **Thay sáo ngữ bằng chi tiết** — bước làm văn tốt lên, cần đọc kỹ.
5. **Gộp câu vụn** — dọn hậu quả của bước 1 và 2.
6. **Cắt kết bài** — làm cuối, vì cắt kết bài có thể làm lộ ra phần trước cần sửa.

Sau bước 6, chạy lại script và đọc to lần cuối.

## Điều không được làm

| Không làm | Vì sao |
|---|---|
| Thêm sự kiện mới để câu hay hơn | Đó là viết lại chuyện, phải xin phép |
| Đổi động cơ nhân vật cho hợp lý hơn | Đổi chuyện, không phải đổi cách nói |
| Đổi kết để mạnh hơn | Payoff thuộc phạm vi `story-core` |
| Đổi thứ tự tiết lộ | Ảnh hưởng tới loop, phải xin phép |
| Làm mất chi tiết cụ thể để câu gọn hơn | Chi tiết cụ thể là thứ làm story tốt |

## Ghi lại để so sánh

Mỗi lần sửa, ghi lại before/after cho những chỗ đáng kể. Không cần ghi mọi câu,
nhưng ghi những chỗ:

- thay sáo ngữ bằng chi tiết mới;
- cắt hẳn một đoạn;
- sửa một chỗ mà người khác sẽ tranh luận.

Bản ghi này là thứ để người viết khác hiểu vì sao bản nháp đổi như vậy.
