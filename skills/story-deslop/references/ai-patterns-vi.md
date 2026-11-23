# Pattern AI tiếng Việt

Bảng theo nhóm. Mỗi pattern: dấu hiệu, tại sao đọc ra AI, cách sửa, khi nào được
giữ.

Cột "script" cho biết `check-vi-ai-patterns.js` có bắt được pattern đó không —
nhiều pattern chỉ bắt được bằng mắt, và đó là lý do skill này có 3 lớp kiểm.

## Nhóm 1 — Mở bài rỗng

| | |
|---|---|
| **Dấu hiệu** | "Có thể thấy rằng…", "Đáng chú ý là…", "Sự thật là…", "Điều đáng nói là…", "Không thể phủ nhận rằng…" |
| **Vì sao đọc ra AI** | Đây là câu dẫn của văn nghị luận. Người kể chuyện không mở đầu bằng câu dẫn — họ vào thẳng chuyện |
| **Cách sửa** | Cắt câu dẫn, giữ lại nội dung phía sau. Nếu cắt mà câu vẫn đủ nghĩa, câu dẫn đó vốn rỗng |
| **Được giữ khi** | Gần như không bao giờ. Chỉ giữ khi đang trích dẫn văn bản khác hoặc viết tiểu luận |
| **Script** | `mo-bai-rong` (`review_required`) |

## Nhóm 2 — Sáo ngữ

| | |
|---|---|
| **Dấu hiệu** | "vô cùng quan trọng", "món quà vô giá", "tình mẫu tử thiêng liêng", "trọn vẹn", "ý nghĩa sâu sắc", "trải nghiệm đáng nhớ", "lan tỏa yêu thương", "truyền cảm hứng", "mỗi chúng ta" |
| **Vì sao đọc ra AI** | Sáo ngữ là cụm đã được dùng tới mức không còn hình ảnh. Nó nói cảm xúc thay người đọc, và nó không cho biết gì cụ thể về nhân vật |
| **Cách sửa** | Thay bằng một chi tiết cụ thể: một hành động, một vật, một câu nói. Thay "mẹ tôi hy sinh vô cùng" bằng "mẹ tôi để dành từng đồng, không mua cho mình cái gì" |
| **Được giữ khi** | Nhân vật trong chuyện là người hay nói sáo (bà mối, MC đám cưới) — khi đó sáo ngữ là đặc điểm nhân vật, không phải lỗi người viết |
| **Script** | `sao-ngu` (`advisory`) |

## Nhóm 3 — Câu rỗng

| | |
|---|---|
| **Dấu hiệu** | Câu đúng ngữ pháp, không thêm thông tin: "Cuộc sống thật sự có ý nghĩa.", "Mọi thứ đều có lý do của nó.", "Đó là một trải nghiệm đáng nhớ." |
| **Vì sao đọc ra AI** | Văn AI thường đạt đủ số câu bằng cách thêm câu không có nội dung. Đọc lên thấy trơn nhưng không nhớ gì |
| **Cách sửa** | Phép thử xoá: xoá câu đó, nếu đoạn văn không mất thông tin thì xoá hẳn. Nếu thấy trống, thay bằng chi tiết cụ thể |
| **Được giữ khi** | Câu ngắn dùng để nhịp, ngay sau một câu nặng: "Bà mất. Tôi không khóc." Đây không phải câu rỗng vì nó thêm thông tin |
| **Script** | `cau-rong-lien-tiep` (`review_required`) — chỉ bắt khi có từ ba câu rỗng liền nhau |

Chi tiết và 8 ví dụ: `empty-sentences-vi.md`.

## Nhóm 4 — Danh từ hoá

| | |
|---|---|
| **Dấu hiệu** | "việc + động từ" ("việc dọn dẹp", "việc tìm thấy"), "sự + tính từ" ("sự thấu hiểu", "sự hy sinh") |
| **Vì sao đọc ra AI** | Tiếng Anh đóng gói hành động thành danh từ, tiếng Việt thì không. Câu có danh từ hoá mất người làm, nên đọc lên không ai làm gì cả |
| **Cách sửa** | Hạ về động từ và cho chủ ngữ: "việc dọn dẹp mất ba ngày" → "dọn nhà mất ba ngày" |
| **Được giữ khi** | Khi danh từ hoá đã thành thuật ngữ cố định trong ngành, ví dụ "việc làm", "sự kiện" |
| **Script** | `danh-tu-hoa-viec` (`advisory`) — chỉ bắt một danh sách động từ phổ biến, không bắt toàn bộ |

## Nhóm 5 — Đối lập khuôn

### `không chỉ … mà còn`

| | |
|---|---|
| **Dấu hiệu** | Cấu trúc xuất hiện từ hai lần trở lên trong một văn bản ngắn |
| **Vì sao đọc ra AI** | Đây là cấu trúc được dùng nhiều nhất trong văn AI tiếng Việt vì nó "nghe có vẻ đầy đủ". Dùng một lần thì ổn, dùng dày thì thành khuôn |
| **Cách sửa** | Tách hai vế thành hai câu, hoặc bỏ một vế |
| **Được giữ khi** | Đúng một lần trong video, ở chỗ cần nhấn cả hai vế ngang nhau |
| **Script** | `not-only-but-also` (`review_required`) |

### `không phải … mà là`

| | |
|---|---|
| **Dấu hiệu** | Dùng để lật một hiểu nhầm, nhưng hiểu nhầm đó không được nêu trước đó |
| **Vì sao đọc ra AI** | Cấu trúc này chỉ có giá trị khi người đọc đã có hiểu nhầm trong đầu. Dùng mà không dựng hiểu nhầm trước thì thành rỗng |
| **Cách sửa** | Nói thẳng vế đúng, hoặc dựng hiểu nhầm trước rồi mới lật |
| **Được giữ khi** | Hiểu nhầm đã được nêu rõ ngay trước đó, và cần lật dứt khoát |
| **Script** | `not-a-but-b` (`review_required`) |

## Nhóm 6 — Ẩn dụ sáo

| | |
|---|---|
| **Dấu hiệu** | "như một bức tranh", "tựa như dòng sông", "như một bài ca", "như ánh sao", "như giấc mơ" |
| **Vì sao đọc ra AI** | Ẩn dụ sáo không tạo ra hình ảnh mới, vì người đọc đã thấy nó hàng nghìn lần. Nó chiếm chỗ mà một chi tiết thật có thể đứng |
| **Cách sửa** | Thay bằng chi tiết cụ thể trong chuyện. So sánh chỉ đáng dùng khi nó nói được điều mà chi tiết thật không nói được |
| **Được giữ khi** | Nhân vật trong chuyện là người nói ẩn dụ sáo, và điều đó được dùng để khắc hoạ nhân vật |
| **Script** | `an-du-sao` (`advisory`) |

## Nhóm 7 — Kết bài "hành trình" / "bài học"

| | |
|---|---|
| **Dấu hiệu** | "Đây là một hành trình…", "bài học tôi nhận được là…", "qua câu chuyện này, tôi nhận ra rằng…", "chặng đường…" |
| **Vì sao đọc ra AI** | Kết bài kiểu này tổng kết hộ người đọc, trong khi người đọc muốn tự rút ra. Nó cũng là cách kết phổ biến nhất của văn AI vì nó "an toàn" |
| **Cách sửa** | Thay bằng một chi tiết hoặc hành động cụ thể ở hiện tại: "Cuốn sổ đó tôi vẫn giữ." |
| **Được giữ khi** | Gần như không. Kể cả video dạng bài học cũng nên kết bằng chi tiết |
| **Script** | `ket-bai-hanh-trinh` (`advisory`) — chỉ quét đoạn kết |

## Nhóm 8 — Liệt kê ba gạch đầu dòng đều nhau

| | |
|---|---|
| **Dấu hiệu** | Đúng ba dòng, mỗi dòng cùng độ dài, cùng cấu trúc ngữ pháp |
| **Vì sao đọc ra AI** | Văn AI thích bộ ba cân đối. Văn người thường có hai hoặc bốn ý, và các ý lệch nhau về độ dài |
| **Cách sửa** | Cho độ dài lệch nhau, hoặc bỏ danh sách và viết thành câu |
| **Được giữ khi** | Danh sách là nội dung thật sự có ba mục ngang hàng (ba bước làm, ba món) |
| **Script** | `liet-ke-deu` (`advisory`) |

## Nhóm 9 — Lạm dụng dấu câu

| | |
|---|---|
| **Dấu hiệu** | Nhiều `—` hoặc `...` trong cùng một đoạn |
| **Vì sao đọc ra AI** | Dấu gạch dài và dấu ba chấm được dùng để tạo nhịp khi câu không có nhịp thật. Lạm dụng làm câu văn ngắt vụn |
| **Cách sửa** | Thay bằng dấu chấm và tách câu. Giữ tối đa một dấu gạch dài cho mỗi đoạn |
| **Được giữ khi** | Câu bị ngắt giữa chừng có chủ đích, ví dụ nhân vật nói dở rồi thôi |
| **Script** | `lam-dung-dash` (`advisory`) |

## Nhóm 10 — Câu quá dài không có dấu câu

| | |
|---|---|
| **Dấu hiệu** | Một dòng dài, nhiều mệnh đề, không có dấu chấm |
| **Vì sao đọc ra AI** | Đây là dấu hiệu của văn bản được sinh ra rồi không được đọc lại. Người viết đọc to sẽ tự tách câu |
| **Cách sửa** | Tách theo nhịp nói, mỗi câu một ý |
| **Được giữ khi** | Câu dài có chủ đích để dồn cảm xúc, và cả đoạn xung quanh đã dùng câu ngắn |
| **Script** | `cau-qua-dai` (`advisory`) |

## Nhóm 11 — Không có trong script (lớp 3)

Những dấu hiệu sau phải đọc bằng mắt, script không bắt được:

- nhân vật không có động cơ rõ ràng;
- biến cố xảy ra vì cần xảy ra, không vì nhân vật chọn;
- payoff không trả đúng loop đã mở ở hook;
- cao trào ở giữa, phần sau để trôi;
- mọi nhân vật nói cùng một giọng.

Đây là lý do skill này có lớp 3 và quy trình 4 phase: script chỉ là một phần.
