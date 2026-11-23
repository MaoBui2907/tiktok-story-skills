---
name: story-core
description: Dùng khi người dùng có một ý tưởng thô cho video TikTok storytime và cần dựng khung trước khi viết lời — ví dụ "tôi muốn kể chuyện này trong 30 giây", "ý tưởng này có đủ thành video không", "chia beat giúp tôi", "story này bị lan man quá", "chốt arc trước đã". Skill này chốt một ý duy nhất cho video, dựng arc Hook → Tension → Payoff → Loop, chia budget thời gian theo giây và chỉ ra skill nào chạy tiếp. Không dùng khi người dùng đã có script hoàn chỉnh và chỉ cần sửa hook, sửa tiếng Việt hay bắt văn AI.
---

# story-core — khung story và nhịp giữ người xem

Skill này làm một việc: biến một ý tưởng thô thành **khung** đủ chắc để viết
tiếp. Đầu ra không phải script, mà là một trang giấy có thể đưa cho người khác
viết theo.

## Khi nào dùng

Dùng ở đầu chuỗi, trước mọi skill khác. Nếu người dùng đưa script đã viết xong,
đừng chạy skill này — sang `hook-writer` hoặc `vi-voice`.

## Nguyên tắc 1: một ý một video

Mỗi video chỉ theo **một** ý. Một biến cố, một câu hỏi, một lật. Không phải
"một chủ đề" — chủ đề thì rộng, ý thì hẹp.

Phép thử: viết ý thành một câu, không dùng chữ "và". Nếu phải dùng "và" để nối
hai vế ngang nhau, đó là hai video.

| Viết sai | Viết đúng |
|---|---|
| Chuyện tôi đi khám bệnh và chuyện tôi bỏ nghề | Lần đi khám đó là lần tôi quyết định bỏ nghề |
| Mẹ tôi tiết kiệm và mẹ tôi khó tính | Mẹ tôi tiết kiệm tới mức tôi hiểu sai bà suốt mười năm |

## Nguyên tắc 2: arc bốn chặng

`Hook → Tension → Payoff → Loop`

- **Hook** — mở loop, tức là đặt ra một câu hỏi mà người xem muốn biết đáp án.
  Hook nằm trong giây đầu, và loop phải mở trước giây thứ 3.
- **Tension** — đẩy căng. Mỗi beat trả lời một phần nhỏ, đồng thời đẩy thêm một
  câu hỏi mới. Không giải thích hết ở đây.
- **Payoff** — trả đúng cái loop đã mở. Không trả loop khác, không trả nửa vời.
- **Loop** — câu chốt để người xem muốn xem lại hoặc xem video sau.

Chi tiết arc và cảnh báo về heuristic: `references/retention-arc.md`.

## Nguyên tắc 3: budget thời gian theo giây

Đây là **heuristic**, không phải số đo. Dùng như tỉ lệ để biết mình đang tiêu
thời gian vào đâu.

| Độ dài | Hook | Tension | Payoff | Loop |
|---|---|---|---|---|
| 15s | ~2s | ~8s | ~4s | ~1s |
| 30s | ~3s | ~16s | ~8s | ~3s |
| 45s | ~4s | ~25s | ~11s | ~5s |
| 60s | ~5s | ~33s | ~15s | ~7s |

Video 15–60 giây, khung 9:16 là **quyết định sản phẩm của repo**, không phải kết
quả nghiên cứu. Beat map chi tiết từng mốc giây: `references/beat-map.md`.

## Nguyên tắc 4: không dead air

Không có giây nào không làm việc. Mỗi câu phải làm ít nhất một trong ba việc:
đẩy căng, đưa thông tin mới, hoặc trả lời một phần. Câu nào không làm gì thì cắt.

Đặc biệt cấm: chào hỏi đầu video, giới thiệu bản thân dài, "trong video này mình
sẽ chia sẻ", nhắc like/share trước payoff.

## Nguyên tắc 5: mở loop sớm, đóng loop muộn

- Mở loop trong 3 giây đầu. Không giải thích trước rồi mới mở loop — người xem
  bỏ đi trong lúc mình đang dựng bối cảnh.
- Chỉ đóng loop ở cuối. Trả lời giữa video thì hết lý do xem tiếp.

## Checklist tự kiểm trước khi sang skill sau

Chạy `references/self-check.md`. Mười mục, mỗi mục trả lời có/không. Có một mục
"không" là quay lại sửa khung, đừng đẩy sang bước sau.

## Chạy tiếp thế nào

1. Khung xong → `hook-writer` (viết hook và biến thể).
2. Hook chốt → `tiktok-native` (production doc 5 cột).
3. Script xong → `vi-voice` (tiếng Việt đọc lên nghe được).
4. Bản đọc mượt → `story-deslop` (bắt văn AI, câu rỗng, sáo ngữ).
5. Sửa xong → `story-deslop` chạy lại checker, rồi quay lại `hook-writer` kiểm
   hook còn đúng nội dung không.
