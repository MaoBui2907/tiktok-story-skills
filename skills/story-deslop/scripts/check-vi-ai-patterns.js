#!/usr/bin/env node
/**
 * check-vi-ai-patterns.js — tìm dấu hiệu văn AI tiếng Việt trong file văn bản.
 *
 * Node >= 22. Zero dependency: chỉ dùng module chuẩn của Node.
 *
 * CÁCH DÙNG
 *   node check-vi-ai-patterns.js --check <file...> [--json] [--fail-on=none|advisory|strict]
 *
 *   --check <file...>  Các file cần quét (bắt buộc, ít nhất một file).
 *   --json             In kết quả dạng JSON thay vì text.
 *   --fail-on=MODE     Ngưỡng để trả exit code 1. Mặc định: advisory.
 *                        none     : không bao giờ fail vì finding (chỉ báo cáo)
 *                        advisory : fail nếu có ít nhất một finding `review_required`
 *                        strict   : fail nếu có bất kỳ finding nào (kể cả `advisory`)
 *
 * EXIT CODE
 *   0  Không có finding vượt ngưỡng `--fail-on`
 *   1  Có finding vượt ngưỡng
 *   2  Lỗi dùng lệnh hoặc lỗi đọc file
 *
 * GIỚI HẠN — ĐỌC KỸ
 *   Script này là heuristic tìm chỗ đáng ngờ, KHÔNG phải công cụ chấm điểm AIGC.
 *   Nó không kết luận văn bản do AI viết, và zero-hit KHÔNG có nghĩa là văn người.
 *   Mọi finding đều có thể là dương tính giả; người đọc phải tự quyết định.
 *
 * BỎ QUA
 *   - Toàn bộ nội dung trong khối rào ``` (fenced code block).
 *   - Mọi dòng có chuỗi <!-- deslop:skip -->.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const FENCE = '```';
const SKIP_MARK = '<!-- deslop:skip -->';

/* Ngưỡng độ dài câu coi là "quá dài": quy ước của script, không phải số đo. */
const LONG_LINE_WORDS = 40;
const SHORT_SENTENCE_WORDS = 8;
const EMPTY_RUN_MIN = 3;

/* Từ trừu tượng: dùng để nhận diện câu rỗng ngắn đứng liền nhau. */
const ABSTRACT_WORDS = [
  'cuộc sống', 'ý nghĩa', 'giá trị', 'cảm xúc', 'trải nghiệm', 'hành trình',
  'bài học', 'quan trọng', 'thật sự', 'tuyệt vời', 'trọn vẹn', 'niềm tin',
  'hạnh phúc', 'tình yêu', 'thấu hiểu', 'biết ơn', 'động lực', 'bình yên',
  'sâu sắc', 'lan tỏa', 'truyền cảm hứng', 'đáng nhớ', 'vô cùng', 'kỳ diệu',
];

const RULES = [
  {
    id: 'not-only-but-also',
    severity: 'review_required',
    kind: 'regex',
    re: /không\s+(?:chỉ|những)\s+[^.!?\n]{0,90}?\s+mà\s+còn/giu,
    goi_y: 'Tách thành hai câu hoặc bỏ vế sau. Cấu trúc "không chỉ … mà còn" bị dùng quá nhiều nên đọc ra là văn AI.',
  },
  {
    id: 'not-a-but-b',
    severity: 'review_required',
    kind: 'regex',
    /*
     * Chỉ bắt khuôn lật "không phải A **mà là** B" / "mà còn B".
     * KHÔNG bắt "không phải … mà <nguyên nhân>" — câu người Việt nói thật,
     * ví dụ "Không phải tôi không muốn đi mà tại hết tiền."
     */
    re: /không\s+phải\s+(?:là\s+)?[^.!?\n]{0,70}?\s+mà\s+(?:là|còn)\s/giu,
    goi_y: 'Nói thẳng vế đúng, hoặc tách thành hai câu. Chỉ giữ cấu trúc này khi thật sự cần lật một hiểu nhầm đã nêu trước đó.',
  },
  {
    id: 'mot-cach-adj',
    severity: 'advisory',
    kind: 'regex',
    re: /một\s+cách\s+(?:bình\s+thản|gượng\s+gạo|mạnh\s+mẽ|nhẹ\s+nhàng|chậm\s+rãi|rõ\s+ràng|tự\s+nhiên|cẩn\s+thận|tinh\s+tế|sâu\s+sắc|quyết\s+liệt|kiên\s+nhẫn|chuyên\s+nghiệp|khoa\s+học|hợp\s+lý)/giu,
    goi_y: 'Thay bằng phó từ tiếng Việt hoặc đổi hẳn động từ: "nói tỉnh queo", "cười gượng", "đóng sầm cửa".',
  },
  {
    id: 'danh-tu-hoa-viec',
    severity: 'advisory',
    kind: 'regex',
    re: /(?<!\w)việc\s+(?:dọn\s+dẹp|tìm\s+thấy|phát\s+hiện|giải\s+thích|thay\s+đổi|quyết\s+định|chờ\s+đợi|cố\s+gắng|kiểm\s+tra|chuẩn\s+bị|chấp\s+nhận|từ\s+bỏ|giấu\s+diếm|im\s+lặng|ra\s+đi|trở\s+về|nhận\s+ra|nghĩ\s+ngợi|suy\s+nghĩ|hy\s+sinh|chăm\s+sóc|nuôi\s+dạy|nói\s+chuyện|kể\s+lại)/giu,
    goi_y: 'Hạ danh từ hoá về động từ và cho ai đó làm chủ ngữ: "việc dọn dẹp mất ba ngày" -> "dọn nhà mất ba ngày".',
  },
  {
    id: 'mo-bai-rong',
    severity: 'review_required',
    kind: 'regex',
    re: /(?:có\s+thể\s+thấy\s+rằng|đáng\s+chú\s+ý\s+(?:là|rằng)|rõ\s+ràng\s+là|sự\s+thật\s+(?:là|rằng)|điều\s+đáng\s+nói\s+là|một\s+điều\s+(?:rằng|là)|không\s+thể\s+phủ\s+nhận\s+rằng)/giu,
    goi_y: 'Cắt câu dẫn và vào thẳng nội dung. Câu dẫn rỗng làm chậm nhịp mà không thêm thông tin.',
  },
  {
    id: 'dong-vai-tro',
    severity: 'advisory',
    kind: 'regex',
    re: /(?:đóng\s+vai\s+trò|mang\s+tính\s+quyết\s+định|giữ\s+vai\s+trò|mang\s+ý\s+nghĩa\s+then\s+chốt)/giu,
    goi_y: 'Nói thứ đó làm gì, cụ thể: "cuốn sổ là thứ duy nhất bà để lại".',
  },
  {
    id: 'hanh-chinh-dan-nhap',
    severity: 'advisory',
    kind: 'regex',
    re: /(?:trong\s+quá\s+trình|về\s+việc\s+(?!này|đó|ấy|đấy)|liên\s+quan\s+đến\s+việc\s+(?!này|đó|ấy|đấy))/giu,
    goi_y: 'Bỏ khung hành chính: "trong quá trình dọn dẹp" -> "dọn tới nửa thì"; "về việc bà để dành tiền" -> "bà để dành tiền".',
  },
  {
    id: 'ket-bai-hanh-trinh',
    severity: 'advisory',
    kind: 'tail',
    re: /(?:hành\s+trình|bài\s+học|bài\s+học\s+quý|nhìn\s+lại\s+chặng\s+đường|chặng\s+đường)/giu,
    goi_y: 'Thay kết bài bằng một chi tiết cụ thể hoặc một hành động nhỏ. "Hành trình"/"bài học" là cách kết sáo, và nó nói hộ cảm xúc của người nghe.',
  },
  {
    id: 'cau-rong-lien-tiep',
    severity: 'review_required',
    kind: 'empty-run',
    goi_y: 'Xoá các câu này hoặc thay bằng chi tiết cụ thể (ai, làm gì, cái gì). Câu đúng ngữ pháp nhưng không thêm thông tin thì chỉ làm loãng.',
  },
  {
    id: 'an-du-sao',
    severity: 'advisory',
    kind: 'regex',
    re: /(?:như\s+một\s+(?:bức\s+tranh|dòng\s+sông|bài\s+ca|ánh\s+sao|đóa\s+hoa|giấc\s+mơ|bản\s+nhạc)|tựa\s+như\s+(?:dòng\s+sông|bức\s+tranh|bài\s+ca|ánh\s+sáng|giấc\s+mơ)|như\s+dòng\s+sông\s+êm\s+đềm)/giu,
    goi_y: 'Thay ẩn dụ sáo bằng một chi tiết cụ thể trong chuyện: một câu thoại, một hành động, một vật.',
  },
  {
    id: 'lam-dung-dash',
    severity: 'advisory',
    kind: 'dash',
    goi_y: 'Giữ tối đa một dấu gạch dài hoặc một dấu ba chấm trong một đoạn. Lạm dụng làm câu văn ngắt vụn và đọc ra là văn máy.',
  },
  {
    id: 'sao-ngu',
    severity: 'advisory',
    kind: 'regex',
    re: /(?:vô\s+cùng\s+(?:quan\s+trọng|ý\s+nghĩa|đặc\s+biệt)|vô\s+giá|thiêng\s+liêng|trọn\s+vẹn|ý\s+nghĩa\s+sâu\s+sắc|trải\s+nghiệm\s+đáng\s+nhớ|lan\s+tỏa\s+(?:yêu\s+thương|năng\s+lượng)|truyền\s+cảm\s+hứng|mỗi\s+chúng\s+ta|không\s+thể\s+phủ\s+nhận|tình\s+mẫu\s+tử\s+thiêng\s+liêng)/giu,
    goi_y: 'Thay sáo ngữ bằng chi tiết cụ thể hoặc bỏ hẳn. Sáo ngữ không cho người đọc biết thêm gì.',
  },
  {
    id: 'cau-qua-dai',
    severity: 'advisory',
    kind: 'long-line',
    goi_y: 'Tách câu thành nhiều câu ngắn, mỗi câu một ý. Câu dài không có dấu câu thì người nghe không có chỗ để thở.',
  },
  {
    id: 'liet-ke-deu',
    severity: 'advisory',
    kind: 'even-list',
    goi_y: 'Cho các dòng trong danh sách độ dài lệch nhau, hoặc bỏ danh sách và viết thành câu. Danh sách ba dòng đều tăm tắp là dấu hiệu văn máy.',
  },
];

/* ---------- tiện ích ---------- */

function countWords(text) {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

/** Tách câu trong một dòng, trả về [{col, text}] với col là 1-based. */
function splitSentences(line) {
  const out = [];
  const re = /[^.!?]+[.!?]*/gu;
  let m;
  while ((m = re.exec(line)) !== null) {
    const text = m[0];
    if (text.trim().length === 0) continue;
    if (m.index === re.lastIndex) re.lastIndex += 1;
    out.push({ col: m.index + 1, text });
  }
  return out;
}

function hasAbstractWord(text) {
  const lower = text.toLowerCase();
  return ABSTRACT_WORDS.some((w) => lower.includes(w));
}

/** Đọc file, trả về mảng dòng (đã bỏ BOM, chuẩn hoá CRLF). */
function readLines(file) {
  let raw = fs.readFileSync(file, 'utf8');
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  return raw.replace(/\r\n?/gu, '\n').split('\n');
}

/**
 * Xác định dòng nào được quét.
 * Trả về mảng {no, text, skipped}.
 */
function analyzeSkipping(lines) {
  let inFence = false;
  return lines.map((text, idx) => {
    const trimmed = text.trim();
    const isFenceLine = trimmed.startsWith(FENCE);
    if (isFenceLine) {
      inFence = !inFence;
      return { no: idx + 1, text, skipped: true, fenceLine: true };
    }
    const skipped = inFence || text.includes(SKIP_MARK);
    return { no: idx + 1, text, skipped };
  });
}

/* ---------- luật ---------- */

function runRegexRule(rule, entry, file, findings) {
  const re = new RegExp(rule.re.source, rule.re.flags);
  let m;
  while ((m = re.exec(entry.text)) !== null) {
    findings.push({
      file,
      line: entry.no,
      col: m.index + 1,
      rule: rule.id,
      severity: rule.severity,
      match: m[0],
      goi_y: rule.goi_y,
    });
    if (m.index === re.lastIndex) re.lastIndex += 1;
  }
}

/**
 * Đoạn kết = đoạn cuối cùng của file (các dòng liền nhau, không rỗng).
 * Chỉ quét phần kết vì "hành trình"/"bài học" là pattern kết bài.
 */
function runTailRule(rule, scanned, file, findings) {
  const body = scanned.filter((e) => !e.skipped);
  let end = body.length - 1;
  while (end >= 0 && body[end].text.trim().length === 0) end -= 1;
  if (end < 0) return;
  let start = end;
  for (let i = end - 1; i >= 0; i -= 1) {
    if (body[i].text.trim().length === 0) break;
    start = i;
  }
  for (const entry of body.slice(start, end + 1)) {
    runRegexRule(rule, entry, file, findings);
  }
}

function runDashRule(rule, entry, file, findings) {
  const dashPositions = [];
  for (let i = 0; i < entry.text.length; i += 1) {
    if (entry.text[i] === '\u2014') dashPositions.push(i);
  }
  if (dashPositions.length >= 2) {
    findings.push({
      file,
      line: entry.no,
      col: dashPositions[1] + 1,
      rule: rule.id,
      severity: rule.severity,
      match: '\u2014',
      goi_y: rule.goi_y,
    });
  }
  const ellipsis = entry.text.match(/\.\.\./gu) || [];
  if (ellipsis.length >= 2) {
    findings.push({
      file,
      line: entry.no,
      col: entry.text.lastIndexOf('...') + 1,
      rule: rule.id,
      severity: rule.severity,
      match: '...',
      goi_y: rule.goi_y,
    });
  }
}

function runLongLineRule(rule, entry, file, findings) {
  if (countWords(entry.text) <= LONG_LINE_WORDS) return;
  if (/[.!?]/u.test(entry.text)) return;
  findings.push({
    file,
    line: entry.no,
    col: 1,
    rule: rule.id,
    severity: rule.severity,
    match: entry.text.trim().slice(0, 60),
    goi_y: rule.goi_y,
  });
}

function runEmptyRunRule(rule, scanned, file, findings) {
  const sentences = [];
  for (const entry of scanned) {
    if (entry.skipped) continue;
    const line = entry.text;
    if (line.trim().length === 0) continue;
    for (const s of splitSentences(line)) {
      sentences.push({
        line: entry.no,
        col: s.col,
        text: s.text.trim(),
        words: countWords(s.text),
        empty: countWords(s.text) <= SHORT_SENTENCE_WORDS && hasAbstractWord(s.text),
      });
    }
  }

  let run = [];
  const flush = () => {
    if (run.length >= EMPTY_RUN_MIN) {
      const first = run[0];
      const joined = run.map((s) => s.text).join(' ');
      findings.push({
        file,
        line: first.line,
        col: first.col,
        rule: rule.id,
        severity: rule.severity,
        match: joined.slice(0, 80),
        goi_y: rule.goi_y,
      });
    }
    run = [];
  };

  for (const s of sentences) {
    if (s.empty) {
      run.push(s);
    } else {
      flush();
    }
  }
  flush();
}

function runEvenListRule(rule, scanned, file, findings) {
  const isBullet = (t) => /^\s*(?:[-*+]\s+|\d+[.)]\s+)/u.test(t);
  let run = [];
  const flush = () => {
    if (run.length >= 3) {
      const lens = run.map((e) => countWords(e.text.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/u, '')));
      const min = Math.min(...lens);
      const max = Math.max(...lens);
      if (max - min <= 2) {
        findings.push({
          file,
          line: run[0].no,
          col: 1,
          rule: rule.id,
          severity: rule.severity,
          match: run.map((e) => e.text.trim()).join(' / ').slice(0, 80),
          goi_y: rule.goi_y,
        });
      }
    }
    run = [];
  };

  for (const entry of scanned) {
    if (entry.skipped || !isBullet(entry.text)) {
      flush();
      continue;
    }
    run.push(entry);
  }
  flush();
}

/* ---------- chạy ---------- */

function scanFile(file) {
  const findings = [];
  const scanned = analyzeSkipping(readLines(file));
  for (const rule of RULES) {
    switch (rule.kind) {
      case 'regex':
        for (const entry of scanned) {
          if (entry.skipped) continue;
          runRegexRule(rule, entry, file, findings);
        }
        break;
      case 'tail':
        runTailRule(rule, scanned, file, findings);
        break;
      case 'dash':
        for (const entry of scanned) {
          if (entry.skipped) continue;
          runDashRule(rule, entry, file, findings);
        }
        break;
      case 'long-line':
        for (const entry of scanned) {
          if (entry.skipped) continue;
          runLongLineRule(rule, entry, file, findings);
        }
        break;
      case 'empty-run':
        runEmptyRunRule(rule, scanned, file, findings);
        break;
      case 'even-list':
        runEvenListRule(rule, scanned, file, findings);
        break;
      default:
        throw new Error(`kind không hỗ trợ: ${rule.kind}`);
    }
  }
  findings.sort((a, b) => a.line - b.line || a.col - b.col || a.rule.localeCompare(b.rule));
  return findings;
}

function parseArgs(argv) {
  const opts = { files: [], json: false, failOn: 'advisory' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--check') {
      i += 1;
      while (i < argv.length && !argv[i].startsWith('--')) {
        opts.files.push(argv[i]);
        i += 1;
      }
      i -= 1;
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg.startsWith('--fail-on=')) {
      opts.failOn = arg.slice('--fail-on='.length);
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`tham số không hợp lệ: ${arg}`);
    } else {
      opts.files.push(arg);
    }
  }
  if (!['none', 'advisory', 'strict'].includes(opts.failOn)) {
    throw new Error(`--fail-on phải là none|advisory|strict (nhận: ${opts.failOn})`);
  }
  return opts;
}

function usage() {
  return [
    'Cách dùng: node check-vi-ai-patterns.js --check <file...> [--json] [--fail-on=none|advisory|strict]',
    '',
    '  --check <file...>  file cần quét (ít nhất một)',
    '  --json             in kết quả dạng JSON',
    '  --fail-on=MODE     none | advisory (mặc định) | strict',
    '',
    'Exit: 0 không vượt ngưỡng, 1 có finding vượt ngưỡng, 2 lỗi dùng/file.',
  ].join('\n');
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`${err.message}\n\n${usage()}\n`);
    return 2;
  }

  if (opts.help) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }

  if (opts.files.length === 0) {
    process.stderr.write(`Thiếu --check <file...>\n\n${usage()}\n`);
    return 2;
  }

  const findings = [];
  for (const file of opts.files) {
    const resolved = path.resolve(file);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      process.stderr.write(`Không đọc được file: ${file}\n`);
      return 2;
    }
    for (const f of scanFile(resolved)) {
      findings.push({ ...f, file: path.relative(process.cwd(), f.file) || f.file });
    }
  }

  const reviewRequired = findings.filter((f) => f.severity === 'review_required').length;
  const advisory = findings.filter((f) => f.severity === 'advisory').length;

  let failed = false;
  if (opts.failOn === 'advisory') failed = reviewRequired > 0;
  else if (opts.failOn === 'strict') failed = findings.length > 0;

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({
      tools: 'check-vi-ai-patterns',
      fail_on: opts.failOn,
      files: opts.files,
      counts: { total: findings.length, review_required: reviewRequired, advisory },
      findings,
    }, null, 2)}\n`);
  } else {
    if (findings.length === 0) {
      process.stdout.write(`Không có finding nào. Đây không phải bằng chứng văn người: script chỉ tìm pattern quen thuộc.\n`);
    } else {
      for (const f of findings) {
        process.stdout.write(`${f.file}:${f.line}:${f.col}  ${f.severity}  ${f.rule}  ${f.match.replace(/\n/gu, ' ')}\n`);
        process.stdout.write(`  -> ${f.goi_y}\n`);
      }
      process.stdout.write(`\nTổng: ${findings.length} finding (${reviewRequired} review_required, ${advisory} advisory). Ngưỡng fail-on=${opts.failOn}.\n`);
    }
  }

  return failed ? 1 : 0;
}

process.exitCode = main();
