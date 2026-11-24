# Bước 5 — Deslop (`story-deslop`)

Bước này chạy trên `05-ban-nhap.md` — bản nháp thật của ví dụ, chưa qua deslop.

## Phase 1 — Chạy script

Lệnh:

```sh
node skills/story-deslop/scripts/check-vi-ai-patterns.js --check examples/01-storytime-30s/05-ban-nhap.md
```

Output nguyên từ terminal:

```
examples/01-storytime-30s/05-ban-nhap.md:15:1  advisory  hanh-chinh-dan-nhap  Trong quá trình
  -> Bỏ khung hành chính: "trong quá trình dọn dẹp" -> "dọn tới nửa thì"; "về việc bà để dành tiền" -> "bà để dành tiền".
examples/01-storytime-30s/05-ban-nhap.md:15:47  review_required  mo-bai-rong  có thể thấy rằng
  -> Cắt câu dẫn và vào thẳng nội dung. Câu dẫn rỗng làm chậm nhịp mà không thêm thông tin.
examples/01-storytime-30s/05-ban-nhap.md:16:1  advisory  sao-ngu  vô cùng quan trọng
  -> Thay sáo ngữ bằng chi tiết cụ thể hoặc bỏ hẳn. Sáo ngữ không cho người đọc biết thêm gì.
examples/01-storytime-30s/05-ban-nhap.md:27:8  review_required  not-only-but-also  không chỉ bốc hàng mà còn
  -> Tách thành hai câu hoặc bỏ vế sau. Cấu trúc "không chỉ … mà còn" bị dùng quá nhiều nên đọc ra là văn AI.
examples/01-storytime-30s/05-ban-nhap.md:33:1  advisory  sao-ngu  Tình mẫu tử thiêng liêng
  -> Thay sáo ngữ bằng chi tiết cụ thể hoặc bỏ hẳn. Sáo ngữ không cho người đọc biết thêm gì.
examples/01-storytime-30s/05-ban-nhap.md:33:37  advisory  sao-ngu  vô giá
  -> Thay sáo ngữ bằng chi tiết cụ thể hoặc bỏ hẳn. Sáo ngữ không cho người đọc biết thêm gì.
examples/01-storytime-30s/05-ban-nhap.md:33:45  advisory  ket-bai-hanh-trinh  Nhìn lại chặng đường
  -> Thay kết bài bằng một chi tiết cụ thể hoặc một hành động nhỏ. "Hành trình"/"bài học" là cách kết sáo, và nó nói hộ cảm xúc của người nghe.
examples/01-storytime-30s/05-ban-nhap.md:33:107  advisory  ket-bai-hanh-trinh  hành trình
  -> Thay kết bài bằng một chi tiết cụ thể hoặc một hành động nhỏ. "Hành trình"/"bài học" là cách kết sáo, và nó nói hộ cảm xúc của người nghe.
examples/01-storytime-30s/05-ban-nhap.md:33:135  advisory  ket-bai-hanh-trinh  bài học
  -> Thay kết bài bằng một chi tiết cụ thể hoặc một hành động nhỏ. "Hành trình"/"bài học" là cách kết sáo, và nó nói hộ cảm xúc của người nghe.

Tổng: 9 finding (2 review_required, 7 advisory). Ngưỡng fail-on=advisory.
```

Exit code: `1` (có `review_required`, ngưỡng mặc định `advisory`).

## Phase 2 — Chẩn đoán

Script bắt 9 finding, nhưng một phần vấn đề của bản nháp nằm ở tầng câu chuyện và
tầng câu dài — script không bắt được. Bảng chẩn đoán:

| file:line | rule | lỗi thật / giữ được | lý do |
|---|---|---|---|
| 15:1 | `hanh-chinh-dan-nhap` | Lỗi thật | "Trong quá trình tìm hiểu về cuộc sống của mẹ" là câu dẫn hành chính, không phải lời kể |
| 15:47 | `mo-bai-rong` | Lỗi thật | "có thể thấy rằng" — câu dẫn rỗng, cắt được mà không mất gì |
| 16:1 | `sao-ngu` | Lỗi thật | "vô cùng quan trọng" nói cảm xúc thay người nghe |
| 27:8 | `not-only-but-also` | Lỗi thật | "không chỉ … mà còn", lại còn sai sự thật: bảy giờ bà đã về, không phải "ra chợ trước bảy giờ", và câu này lặp câu ngay sau |
| 33:1 | `sao-ngu` | Lỗi thật | "Tình mẫu tử thiêng liêng" — sáo ngữ nguyên khối |
| 33:37 | `sao-ngu` | Lỗi thật | "món quà vô giá" — sáo ngữ |
| 33:45 | `ket-bai-hanh-trinh` | Lỗi thật | "Nhìn lại chặng đường" — mở đầu kết bài tổng kết |
| 33:107 | `ket-bai-hanh-trinh` | Lỗi thật | "hành trình" — kết bài kiểu tổng kết |
| 33:135 | `ket-bai-hanh-trinh` | Lỗi thật | "bài học" — nói hộ bài học người nghe vừa tự thấy |
| (không bắt) | — | Lỗi thật | Dòng 23 dài, ba mệnh đề nối bằng "và", kèm "tôi bắt đầu hiểu ra rằng" là câu rỗng |

## Phase 3 — Sửa theo bảng quyền

Chỉ sửa trong phạm vi **được sửa trực tiếp**: câu, từ sáo, câu rỗng, danh từ hoá.
Không thêm sự kiện, không đổi payoff, không đổi thứ tự tiết lộ.

### Sửa 1 — Cắt mở bài rỗng (dòng 15–17)

**Trước:**

> Trong quá trình tìm hiểu về cuộc sống của mẹ, có thể thấy rằng bà là người phụ nữ
> vô cùng quan trọng. Mẹ tôi nói "mẹ đi chợ đây" mỗi sáng, và việc đó đã diễn ra
> trong suốt mười năm.

**Sau:**

> Mẹ tôi nói "mẹ đi chợ đây" mỗi sáng. Suốt mười năm.

**Thao tác:** xoá (thao tác 1 của `rewrite-playbook.md`) + hạ danh từ hoá ("việc
đó đã diễn ra" → "suốt mười năm"). Đã xoá: câu dẫn hành chính, câu dẫn rỗng, và
sáo ngữ "vô cùng quan trọng".

### Sửa 2 — Bỏ trạng từ sáo (dòng 19)

**Trước:**

> Bốn giờ sáng. Bà rời khỏi nhà một cách lặng lẽ, xách làn, nói đúng câu đó.

**Sau:**

> Bốn giờ sáng. Bà xách làn, đi ra cửa, nói đúng câu đó.

**Thao tác:** bỏ `một cách + tính từ`; "rời khỏi nhà" → "đi ra cửa" (cụ thể hơn,
và đúng cảnh hơn).

### Sửa 3 — Tách câu dài, xoá câu rỗng (dòng 23)

**Trước:**

> Cho tới một hôm tôi dậy trước bà, và tôi thấy bà không đi về phía chợ. Bà rẽ
> trái, về phía bến xe, và tôi đi sau cách một đoạn, và tôi bắt đầu hiểu ra rằng
> có điều gì đó bà đã giấu tôi rất lâu.

**Sau:**

> Cho tới một hôm tôi dậy trước bà, và tôi thấy bà không đi về phía chợ.
>
> Bà rẽ trái. Về phía bến xe. Tôi đi sau, cách một đoạn.

**Thao tác:** tách câu + xoá câu rỗng ("tôi bắt đầu hiểu ra rằng có điều gì đó bà
đã giấu tôi rất lâu"). Câu bị xoá là câu rỗng: nó nói người kể *sắp* hiểu, trong
khi cảnh ngay sau đã cho thấy điều đó.

### Sửa 4 — Bỏ đối lập khuôn và câu lặp (dòng 27)

**Trước:**

> Mẹ tôi không chỉ bốc hàng mà còn kịp ra chợ trước bảy giờ. Sáu giờ bà mới ra chợ.
> Bảy giờ về, làn rau đầy.

**Sau:**

> Sáu giờ bà mới ra chợ. Bảy giờ về, làn rau đầy.

**Thao tác:** xoá câu `không chỉ … mà còn`. Câu này vừa là khuôn, vừa sai sự thật
(bảy giờ bà đã về), vừa lặp lại câu ngay sau.

### Sửa 5 — Cắt kết bài (dòng 33)

**Trước:**

> Tình mẫu tử thiêng liêng là món quà vô giá. Nhìn lại chặng đường mười năm đó, tôi
> nhận ra rằng đây là một hành trình dài để hiểu được bài học về lòng biết ơn.

**Sau:** (không còn câu nào — video kết ở lời thoại của mẹ)

**Thao tác:** cắt kết bài (thao tác 6). Lời thoại của mẹ ở shot 9 đã đóng loop;
thêm kết bài là nói hộ người nghe bài học họ vừa tự thấy.

## Phase 4 — Chạy lại và đọc lại

Bản sửa cuối (chính là `04-loi-thoai-va-caption.md`):

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

Lần chạy lại này chạy trên bản sửa đã ghi vào `04-loi-thoai-va-caption.md` (phần
lời đọc trong khối code). Script không quét nội dung trong khối ```` ``` ````, nên
lần chạy đó không dùng làm bằng chứng — bằng chứng là output ở Phase 1 và các chỗ
sửa ghi ở trên.

Kiểm lớp 3 (câu chuyện):

| Kiểm | Kết quả |
|---|---|
| Payoff còn trả đúng loop đã mở ở hook? | Có — hook hứa "câu nói đó che chuyện gì", payoff trả sự thật ở bến xe |
| Nhân vật còn động cơ rõ? | Có — mẹ giấu để con không nghỉ học |
| Thứ tự tiết lộ có bị đổi? | Không |
| Câu chốt còn đứng một mình không? | Có — lời thoại của mẹ là câu cuối |

## Ghi chú

Script là heuristic, không phải quan toà: nó bắt 9 finding và bỏ sót 1 lỗi thật
(dòng 23 dài, ba mệnh đề, có "tôi bắt đầu hiểu ra rằng"). Ngược lại, trên một văn
bản khác, cùng những rule đó có thể bắt được những câu hoàn toàn ổn. Vì vậy
phase 2 (chẩn đoán có vị trí) không được bỏ qua.
