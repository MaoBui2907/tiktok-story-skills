---
name: story-deslop
description: Dùng khi người dùng muốn kiểm một script/bản nháp tiếng Việt xem có mùi văn AI không — ví dụ "bản này đọc ra AI quá", "bắt câu sáo giúp tôi", "what makes this sound AI-generated", "câu nào là câu rỗng", "chạy checker giúp tôi", "sửa cho bớt văn AI nhưng đừng đổi nội dung". Skill này kiểm ba lớp (biểu đạt, dụng bút, câu chuyện), chạy script tìm pattern AI tiếng Việt, chẩn đoán có vị trí, và chỉ sửa trong phạm vi được phép. Không dùng để viết mới nội dung hay thêm sự kiện.
---

# story-deslop — bắt văn AI tiếng Việt

Người xem không gọi tên được, nhưng họ nhận ra văn AI trong vài giây. Skill này
tìm và sửa.

## Tuyên bố về giới hạn của script

Script chỉ là **heuristic tìm chỗ đáng ngờ**. Nó không đưa ra "điểm AIGC", không
kết luận văn bản do AI viết, và **zero-hit không có nghĩa là văn người**. Một bài
viết tay hoàn toàn có thể có 0 finding và vẫn sáo; một bài AI tốt có thể có nhiều
finding vì nó dùng đúng những pattern này.

Script là công cụ chỉ chỗ để đọc lại, không phải quan toà.

## Ba lớp kiểm

### Lớp 1 — Biểu đạt

Những dấu hiệu ở tầng câu, script bắt được phần lớn:

- danh từ hoá (`việc + động từ`)
- `một cách + tính từ`
- `không chỉ … mà còn`, `không phải … mà là`
- `có thể thấy rằng`, `đáng chú ý là`
- `đóng vai trò`, `trong quá trình`, `về việc`
- câu quá dài không có dấu câu
- lạm dụng `—` và `...`

### Lớp 2 — Dụng bút

Tầng lựa chọn từ và hình ảnh, script chỉ bắt được một phần:

- sáo ngữ (`tình mẫu tử thiêng liêng`, `món quà vô giá`)
- ẩn dụ sáo (`như một dòng sông`, `tựa như bức tranh`)
- câu rỗng — đúng ngữ pháp, không thêm thông tin
- ba gạch đầu dòng đều nhau, mỗi dòng cùng độ dài
- kết bài "hành trình" / "bài học"

### Lớp 3 — Câu chuyện

Tầng nội dung, script không bắt được, phải đọc:

- nhân vật không có động cơ rõ
- biến cố xảy ra vì cần xảy ra, không vì nhân vật chọn
- payoff không trả đúng loop đã mở
- cao trào ở giữa, phần sau để trôi

## Quy trình 4 phase

### Phase 1 — Đọc và scan

1. Đọc toàn bộ bản nháp một lượt, không sửa gì.
2. Chạy script:

```sh
node skills/story-deslop/scripts/check-vi-ai-patterns.js --check <file>
```

3. Ghi lại cảm giác đọc và output script. Chưa sửa.

### Phase 2 — Chẩn đoán có vị trí

Với mỗi finding, mở đúng dòng đó và trả lời: đây là lỗi thật, hay là chỗ dùng
đúng? Nhiều finding là dương tính giả — một câu văn người có thể có `thì` và `mà`
nhưng vẫn tốt.

Ghi bảng:

| file:line | rule | lỗi thật / giữ được | lý do |
|---|---|---|---|

Chỉ những dòng "lỗi thật" mới sang phase 3.

### Phase 3 — Sửa theo quyền

Đây là phase dễ hỏng nhất. Sửa quá tay thì mất chuyện; không sửa thì mất người
xem. Bảng quyền bên dưới.

### Phase 4 — Đọc lại và chạy lại script

1. Đọc to bản đã sửa.
2. Chạy lại script, so số finding trước/sau.
3. Kiểm lớp 3 (câu chuyện) lần cuối: payoff còn đúng loop không, nhân vật còn
   động cơ không.

## Bảng quyền

| Sửa trực tiếp được | Phải xin phép |
|---|---|
| Đổi từ sáo sang từ thường | Thêm sự kiện mới |
| Cắt câu rỗng | Đổi động cơ nhân vật |
| Hạ danh từ hoá về động từ | Đổi kết (payoff) |
| Đổi bị động sang chủ động | Đổi thứ tự tiết lộ |
| Tách câu dài thành nhiều câu | Đổi nhân vật kể |
| Gộp câu vụn | Thêm hoặc bỏ cảnh |
| Cắt kết bài sáo | Đổi quan hệ giữa nhân vật |
| Bỏ `—`, `...` thừa | Đổi độ dài video mục tiêu |

Nguyên tắc: **được đổi cách nói, không được đổi chuyện**. Nếu để sửa một câu mà
phải thêm sự kiện, đó không phải lỗi biểu đạt — đó là lỗi câu chuyện, và phải
quay lại `story-core`.

## Cách đọc output script

Mỗi finding có dạng:

```
file:line:col  severity  rule  match
  → gợi ý
```

- `severity = advisory` — chỗ đáng xem lại, thường là dùng đúng.
- `severity = review_required` — cần đọc lại chắc chắn, thường là lỗi thật.

Exit code: `0` không có finding vượt ngưỡng `--fail-on`, `1` vượt ngưỡng, `2` lỗi
dùng/file.

`--fail-on` có ba mức, mặc định là `advisory`:

| Mức | Exit 1 khi nào | Dùng cho |
|---|---|---|
| `none` | Không bao giờ fail vì finding (chỉ báo cáo) | Chạy để xem, không chặn |
| `advisory` (mặc định) | Có ít nhất một finding `review_required` | Mức thường dùng: finding `advisory` chỉ để đọc, không chặn |
| `strict` | Có bất kỳ finding nào, kể cả `advisory` | Chỉ dùng khi muốn zero-tolerance |

Nghĩa là ở mức mặc định, một finding `advisory` **không** làm exit 1 — script
vẫn in ra để đọc, nhưng không chặn. Muốn chặn mọi finding thì phải dùng
`--fail-on=strict`.

## Bỏ qua có chủ đích

Script bỏ qua nội dung trong khối ```` ``` ```` và mọi dòng có
`<!-- deslop:skip -->`. Dùng khi:

- trích nguyên văn lời người khác;
- câu cố ý viết theo kiểu bị bắt (ví dụ đang phân tích một pattern);
- code, bảng, hoặc nội dung không phải lời kể.

Đừng lạm dụng `deslop:skip` để làm sạch báo cáo. Nếu phải skip quá nhiều, bản nháp
đang có vấn đề thật.

## Chạy tiếp

Sửa xong → quay lại `hook-writer` kiểm hook còn khớp nội dung sau khi sửa, và
kiểm hook không bị làm phẳng trong lúc deslop.

Chi tiết pattern: `references/ai-patterns-vi.md`, `references/empty-sentences-vi.md`,
`references/rewrite-playbook.md`.
