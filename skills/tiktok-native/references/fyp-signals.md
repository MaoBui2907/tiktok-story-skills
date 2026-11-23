# Signal trên FYP và hành động thiết kế

File này giải thích từng signal theo cách định tính. Không có con số nào ở đây,
và đó là chủ ý: repo không có nguồn sơ cấp kiểm chứng được cho các ngưỡng hay
trọng số, nên không đưa vào. Dùng file này để biết **sửa gì trước**, không phải để
tính điểm.

## 1. Xem hết

**Nghĩa:** người xem ở lại tới giây cuối.

**Vì sao ưu tiên nhất:** đây là signal duy nhất nói rằng toàn bộ video đứng được,
không chỉ phần đầu.

**Hành động thiết kế:**
- Không để đoạn nào không làm việc. Câu nào không đẩy căng, không thêm thông tin,
  không trả lời một phần thì cắt.
- Đổi hình mỗi 2–4 giây (heuristic) để mắt có cái mới.
- Payoff phải trả đúng loop đã mở, đặt đủ gần cuối để người xem kịp tới.

**Nếu signal này yếu:** đừng sửa hook trước. Xem lại beat map và phần giữa — chỗ
rơi người xem thường ở giữa, không ở đầu.

## 2. Xem lại

**Nghĩa:** người xem quay lại video lần hai hoặc tua lại một đoạn.

**Hành động thiết kế:**
- Đặt một chi tiết dễ bỏ lỡ ở đầu: một câu chữ trên màn hình, một vật trong khung
  hình. Người xem lại lần hai để bắt nó.
- Câu chốt để dư âm, không tổng kết. Tổng kết thì hết lý do xem lại.
- Loop cuối video có thể mở một câu hỏi mà chỉ lần xem lại mới thấy liên quan.

## 3. Share

**Nghĩa:** người xem gửi video cho một người cụ thể, kèm một lý do trong đầu kiểu
"cái này giống mày".

**Hành động thiết kế:**
- Viết cho một tình huống cụ thể mà người ta nhận ra người thân. Chuyện càng cụ
  thể càng dễ được gửi.
- Đừng viết cho "mọi người". Video nói với tất cả mọi người thì không ai thấy
  mình trong đó.

## 4. Comment

**Nghĩa:** người xem muốn nói gì đó — hỏi, kể chuyện của họ, phản đối.

**Hành động thiết kế:**
- Chừa một chỗ để người xem điền vào: một câu hỏi mở ở cuối, một chi tiết dễ gây
  tranh luận nhẹ.
- Đừng hỏi "các bạn nghĩ sao" một cách chung chung. Hỏi cụ thể: "nhà bạn có ai
  giữ thói quen đó không".

## 5. Save

**Nghĩa:** người xem lưu lại vì sẽ cần dùng sau.

**Hành động thiết kế:**
- Với storytime thuần kể chuyện, save thường thấp và điều đó bình thường. Đừng
  hy sinh payoff để nhồi mẹo "lưu lại kẻo mất".
- Nếu video có phần dùng được (cách làm, danh sách), đặt phần đó thành một khối
  rõ ràng để dễ lưu.

## Cách dùng thứ tự này khi sửa video

Thứ tự signal là thứ tự **chẩn đoán**, không phải thứ tự cần tối ưu:

1. Xem hết yếu → sửa beat map và phần giữa.
2. Xem hết ổn, xem lại yếu → thêm chi tiết dễ bỏ lỡ và sửa câu chốt.
3. Share yếu → làm chuyện cụ thể hơn, bớt chung chung.
4. Comment yếu → chừa chỗ để người xem kể chuyện của họ.
5. Save yếu → chỉ sửa nếu video có phần dùng được thật.

## Điều không làm

- Không suy ra trọng số từ file này. Thứ tự ở đây là để biết sửa gì trước.
- Không đưa vào repo ngưỡng "phải đạt bao nhiêu mới lên FYP". Không có ngưỡng
  công khai kiểm chứng được, và con số tự đặt sẽ thành lời hứa sai với người dùng
  skill.
