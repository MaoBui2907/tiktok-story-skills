# Số liệu: những gì repo này cố ý không đưa vào

Repo này **không có số liệu hiệu năng nào**. Đây là quyết định, không phải thiếu
sót.

## Vì sao

Khi build, nhóm đã đọc các skill short-form phổ biến trên GitHub và thấy nhiều con
số rất cụ thể: phần trăm view-through, phần trăm người xem bỏ ở 3 giây đầu, tỉ lệ
giữa các tầng hook, ngưỡng view trung bình theo nền tảng.

Không con số nào trong đó truy được về **nguồn sơ cấp có ngày công bố** mà nhóm
đọc được trực tiếp. Chúng xuất hiện dưới dạng "theo nghiên cứu", "theo dữ liệu nội
bộ", hoặc không có dẫn nguồn. Đưa những con số đó vào một repo skill công khai là
truyền tiếp thông tin không kiểm chứng được — và người dùng skill sẽ ra quyết định
sản xuất dựa trên số bịa.

Với một repo về viết lách, điều đó không chấp nhận được. Một câu văn sai thì sửa
được; một con số sai thì người ta tin và làm theo.

## Số liệu đã thấy ở upstream nhưng KHÔNG đưa vào

| Con số (theo cách upstream trình bày) | Repo nguồn | Lý do loại |
|---|---|---|
| Tỉ lệ view-through của video short-form (các mức 70–80 phần trăm) | `iart-ai/tiktok-video-skills` | Không kiểm chứng được nguồn sơ cấp; không rõ đo trên tập video nào, nền tảng nào, thời điểm nào |
| Tỉ lệ người xem rời đi trong 3 giây đầu (khoảng một nửa) | `iart-ai/tiktok-video-skills` | Không kiểm chứng được nguồn sơ cấp; ngưỡng thay đổi theo nền tảng và thời điểm |
| "Hook layer xấp xỉ ba lần hold" | `iart-ai/tiktok-video-skills` | Không kiểm chứng được nguồn sơ cấp; không rõ đơn vị đo |
| Cách hệ thống phân phối phản ứng khi đường cong giữ người xem phẳng | `social-media-skills/skills` | Mô tả cơ chế nội bộ của nền tảng, không có tài liệu công khai kiểm chứng được |
| Ngưỡng view trung bình để được coi là "tốt" theo từng nền tảng | `social-media-skills/skills` | Ngưỡng thay đổi liên tục và phụ thuộc ngách; không có nguồn công bố |
| Benchmark tương tác theo ngành | `coreyhaines31/marketingskills` | Số liệu ngành không áp được cho storytime cá nhân; không kiểm chứng được nguồn sơ cấp |

Bảng này để chứng minh nhóm đã thấy các con số đó và **cân nhắc rồi loại**, không
phải bỏ sót.

## Cái gì được dùng thay

**Heuristic dạng mệnh lệnh**, không kèm số đo:

- "hook nằm trong giây đầu";
- "một ý tưởng một video";
- "đổi hình mỗi 2–4 giây";
- "mở loop trong 3 giây đầu, đóng ở cuối";
- "payoff chiếm ít nhất một phần năm video".

Những câu này là quy tắc nghề, được gọi rõ là **heuristic** ở mọi chỗ xuất hiện.
Chúng không nói "bao nhiêu phần trăm người xem sẽ ở lại" — chúng nói "làm thế này
thì dễ giữ người xem hơn".

## Quyết định sản phẩm, không phải số liệu nghiên cứu

Các thông số sau là **quyết định của người đặt hàng sản phẩm**, không phải kết quả
nghiên cứu:

| Thông số | Loại |
|---|---|
| Độ dài video 15–60 giây | Quyết định sản phẩm |
| Khung 9:16 | Quyết định sản phẩm |
| Caption dưới 8 từ mỗi dòng | Quy ước của repo |
| Chữ trong khoảng 80 phần trăm giữa khung | Heuristic (giao diện nền tảng thay đổi thì phải xem lại) |

Ghi rõ như vậy để người đọc không nhầm quy ước nội bộ với dữ liệu.

## Nếu sau này muốn thêm một con số

Điều kiện bắt buộc: con số phải đi kèm nguồn ngay trên dòng đó, theo dạng

```
nguồn: <tên>, <URL https://...>, công bố <ngày>, truy cập <ngày>
```

`scripts/validate.js` chặn mọi dòng có `%` mà không có cả `nguồn:` và một URL
`https://` cùng dòng. Đây là cơ chế bắt buộc, không phải lời nhắc.

Nếu không tìm được nguồn sơ cấp đọc được trực tiếp: **không đưa con số vào**.
Viết quy tắc nghề thay thế.
