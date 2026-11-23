# tiktok-story-skills

Bộ **5 skill tiếng Việt** cho agent: viết story short-form TikTok (storytime) từ ý
tưởng → hook → script → kiểm tiếng Việt → bắt văn AI.

## Repo này giải quyết khoảng trống gì

Các skill viết story short-form đang có trên GitHub đều là **tiếng Anh hoặc tiếng
Trung**. Không có bộ skill nào dạy agent viết storytime **tiếng Việt** — nhịp câu
tiếng Việt, khẩu ngữ, xưng hô, cách tránh văn dịch, cách bắt văn AI tiếng Việt.

Đó là lý do repo này tồn tại. Nó không phải bản dịch của skill nào: toàn bộ nội
dung viết mới bằng tiếng Việt, cho tiếng Việt. Xem `NOTICE` để biết những ý tưởng
nào được tham khảo và từ đâu.

## 5 skill

| Skill | Làm gì | Khi nào dùng |
|---|---|---|
| `story-core` | Chốt một ý, dựng arc Hook → Tension → Payoff → Loop, chia budget thời gian theo giây | Có ý tưởng thô, chưa biết chia beat |
| `hook-writer` | Viết hook đúng nội dung, 5 biến thể khác archetype để test | Đã có nội dung, cần 3 giây đầu |
| `tiktok-native` | FYP, sound/trend, TikTok như search engine, production doc 5 cột | Cần bảng shot để quay |
| `vi-voice` | Nhịp câu, khẩu ngữ, xưng hô, bỏ văn dịch, số/đơn vị đọc thành lời, caption | Script đọc lên gượng, hoặc caption chưa gọn |
| `story-deslop` | Bắt văn AI tiếng Việt: pattern, câu rỗng, sáo ngữ, kết bài tổng kết | Bản nháp nghe "ra AI", cần sửa |

### Khi nào dùng cái nào

| Bạn đang có | Chạy |
|---|---|
| Một ý tưởng, chưa có gì | `story-core` |
| Khung story, chưa có hook | `hook-writer` |
| Hook + script, chưa có bảng shot | `tiktok-native` |
| Script đã có, đọc lên gượng | `vi-voice` |
| Bản nháp nghe sáo, giống văn AI | `story-deslop` |
| Script đã sửa xong, muốn kiểm lại toàn bộ | `story-core` (checklist) → `story-deslop` |

## Thứ tự chạy

```
story-core → hook-writer → tiktok-native → vi-voice → story-deslop
```

Chạy đúng thứ tự này. Lý do: mỗi skill nhận đầu ra của skill trước. Sửa hook trước
khi chốt ý là làm lại hai lần; deslop trước khi script xong là dọn dẹp nhà chưa
xây.

Sau `story-deslop`, nên quay lại `hook-writer` một lần để kiểm hook còn khớp nội
dung sau khi sửa.

## Cách cài

Cài một skill:

```sh
npx skills add MaoBui2907/tiktok-story-skills --skill story-core
```

Cài lần lượt 5 skill:

```sh
npx skills add MaoBui2907/tiktok-story-skills --skill story-core
npx skills add MaoBui2907/tiktok-story-skills --skill hook-writer
npx skills add MaoBui2907/tiktok-story-skills --skill tiktok-native
npx skills add MaoBui2907/tiktok-story-skills --skill vi-voice
npx skills add MaoBui2907/tiktok-story-skills --skill story-deslop
```

Xem danh sách skill trong repo trước khi cài:

```sh
npx skills add MaoBui2907/tiktok-story-skills --list
```

Chọn agent đích:

```sh
npx skills add MaoBui2907/tiktok-story-skills --skill story-core -a '*'
```

### Về cú pháp pin (`#` là ref, `@` là skill filter)

Có hai ký hiệu khác nhau, và chúng **không** thay thế nhau:

| Ký hiệu | Nghĩa | Dùng khi nào |
|---|---|---|
| `#<ref>` | Trỏ tới branch, tag hoặc commit | Cần cài từ một branch/tag/commit cụ thể |
| `@<skill>` | Lọc skill theo tên | Không cần — dùng `--skill <name>` thì rõ hơn |

Pin một branch (khuyến nghị khi repo chưa merge `main`):

```sh
npx skills add 'MaoBui2907/tiktok-story-skills#feat/skills-v1' --skill story-core
```

Pin một commit — phải là **SHA đủ 40 ký tự**, SHA ngắn không được:

```sh
npx skills add 'MaoBui2907/tiktok-story-skills#<sha-40-ky-tu>' --skill story-core
```

Có thể kết hợp ref và lọc skill bằng `@` đằng sau `#`:

```sh
npx skills add 'MaoBui2907/tiktok-story-skills#feat/skills-v1@story-core'
```

### Vì sao `@` không phải là pin

CLI đọc `owner/repo@X` theo hai nhánh: nếu `X` là **semver tag** (`v1.2.3`) hoặc
**SHA đủ 40 ký tự** thì `X` được dùng làm ref; mọi trường hợp khác `X` bị coi là
**tên skill cần lọc**. Hệ quả thực tế:

| Lệnh | CLI hiểu | Kết quả |
|---|---|---|
| `.../repo@v1.2.3` (repo có tag đó) | ref = `v1.2.3` | Cài được |
| `.../repo@<sha-40-ky-tu>` | ref = SHA | Cài được |
| `.../repo@bd1f3db` (SHA ngắn) | skillFilter = `bd1f3db` | `No valid skills found` |
| `.../repo@story-core` | skillFilter = `story-core` | `No valid skills found` (cài cả repo thì dùng `--skill`) |
| `.../repo@v1.0.0` khi repo **không có tag** | ref = `v1.0.0` | Clone fail |

Vì vậy: muốn pin **commit** thì dùng `#` với SHA đủ 40 ký tự; muốn pin **branch**
thì dùng `#<branch>`; muốn pin **tag** thì tạo tag trước rồi mới dùng `@v1.2.3`
hoặc `#v1.2.3`.

Repo này hiện **chưa đặt tag nào** — đừng dùng `@v1.0.0` cho tới khi có tag.

## Cách dùng với agent

Sau khi cài, skill nằm trong `.agents/skills/<name>/`. Agent đọc `SKILL.md` của
skill khớp với việc đang làm, rồi mở các file trong `references/` khi cần chi tiết.

Một lượt làm việc điển hình:

1. Đưa agent ý tưởng thô, nói rõ độ dài mục tiêu (15–60 giây).
2. Agent chạy `story-core` → ra khung.
3. Agent chạy `hook-writer` → ra 5 hook kèm payoff và rủi ro.
4. Chọn hook, agent chạy `tiktok-native` → ra production doc 5 cột.
5. Agent chạy `vi-voice` → ra lời đọc + caption.
6. Agent chạy `story-deslop` → ra bảng finding + bản sửa.

Xem ví dụ đầy đủ một lượt như vậy: [`examples/01-storytime-30s/`](examples/01-storytime-30s/README.md).

## Ví dụ

`examples/01-storytime-30s/` là một story 30 giây hoàn chỉnh, chạy đủ 5 skill, kèm
bản nháp trước deslop và output thật của checker. Đọc theo thứ tự từ `01` tới `05`.

Đây là **ví dụ mẫu**, không phải số liệu. Không có kết quả hiệu năng nào trong
repo này.

## Số liệu

Repo này **cố ý không có số liệu hiệu năng**. Không có phần trăm view-through,
không có ngưỡng drop-off, không có benchmark.

Lý do: những con số đó xuất hiện nhiều trong skill short-form trên thị trường
nhưng không truy được về nguồn sơ cấp có ngày công bố. Đưa chúng vào repo công
khai là truyền tiếp thông tin không kiểm chứng được, và người dùng skill sẽ ra
quyết định sản xuất dựa trên số bịa.

Thay vào đó repo dùng **heuristic dạng mệnh lệnh**, gọi rõ là heuristic: "hook nằm
trong giây đầu", "một ý tưởng một video", "đổi hình mỗi 2–4 giây".

Các thông số như độ dài 15–60 giây, khung 9:16, caption dưới 8 từ/dòng là **quyết
định sản phẩm**, không phải kết quả nghiên cứu.

Danh sách số liệu đã thấy ở upstream và lý do loại: [`docs/evidence.md`](docs/evidence.md).

Nếu muốn thêm một con số: phải kèm `nguồn: <tên>, <URL>, công bố <ngày>, truy cập
<ngày>` ngay trên dòng đó. `scripts/validate.js` chặn mọi dòng có `%` mà không có
nguồn.

## Kiểm repo

```sh
node scripts/validate.js
```

Kiểm 12 nhóm: layout skill, frontmatter, link chết, references, placeholder, secret,
luật số liệu, ví dụ, license/NOTICE, README, độ dài skill, đúng 5 skill.

Kiểm riêng checker tiếng Việt:

```sh
node skills/story-deslop/scripts/selftest.js
```

Chạy cả hai:

```sh
npm test
```

## Nguồn và license

Repo này phát hành theo **MIT** — xem [`LICENSE`](LICENSE).

Nội dung skill là bản viết mới bằng tiếng Việt. Không có đoạn code hay văn bản nào
của upstream được copy vào repo này; bảng ghi công repo, license và commit SHA đã
tham chiếu nằm ở [`NOTICE`](NOTICE).

## Cấu trúc

```
skills/
  story-core/       SKILL.md + references/ (retention-arc, beat-map, self-check)
  hook-writer/      SKILL.md + references/ (archetypes, truth-test, variants-matrix)
  tiktok-native/    SKILL.md + references/ (fyp-signals, sound-and-trend, search-keywords, production-doc)
  vi-voice/         SKILL.md + references/ (nhip-cau, khau-ngu, xung-ho, tranh-van-dich, caption, vi-dung-sai)
  story-deslop/     SKILL.md + references/ + scripts/check-vi-ai-patterns.js + fixtures/
examples/01-storytime-30s/
docs/evidence.md
scripts/validate.js
```
