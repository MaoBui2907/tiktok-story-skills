# Fixture edge — code block và deslop:skip

File này kiểm hai đường bỏ qua. Nếu script quét sai, sẽ có finding ở đây.

## Khối code phải bị bỏ qua

```md
Có thể thấy rằng đây là câu trong khối code.
Bà không chỉ tiết kiệm mà còn rất khắt khe.
Việc dọn dẹp mất ba ngày — và tôi đã hiểu ra — rồi tôi khóc...
```

## Dòng có deslop:skip phải bị bỏ qua

<!-- deslop:skip --> Có thể thấy rằng dòng này được miễn.
<!-- deslop:skip --> Việc dọn dẹp căn nhà mất ba ngày và bà nói một cách bình thản.

## Dòng thường vẫn phải bị bắt

Có thể thấy rằng dòng này không có skip nên phải bị bắt.
