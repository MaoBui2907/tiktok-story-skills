#!/usr/bin/env node
/**
 * selftest.js — test cho check-vi-ai-patterns.js
 *
 * Node >= 22. Zero dependency.
 *
 *   node skills/story-deslop/scripts/selftest.js
 *
 * In `PASS n/n`, exit 0 khi mọi test pass; exit 1 khi có test fail.
 * Test assert cả SỐ FINDING và EXIT CODE, không chỉ "chạy không lỗi".
 */

'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HERE = __dirname;
const CHECKER = path.join(HERE, 'check-vi-ai-patterns.js');
const FIXTURES = path.join(HERE, 'fixtures');

let passed = 0;
let failed = 0;
const failures = [];

function assert(name, condition, detail) {
  if (condition) {
    passed += 1;
    process.stdout.write(`ok   ${name}\n`);
  } else {
    failed += 1;
    failures.push(name);
    process.stdout.write(`FAIL ${name}${detail ? ` — ${detail}` : ''}\n`);
  }
}

function runChecker(args) {
  const res = spawnSync(process.execPath, [CHECKER, ...args], {
    cwd: HERE,
    encoding: 'utf8',
  });
  return { code: res.status, stdout: res.stdout, stderr: res.stderr };
}

function runCheckerJson(args) {
  const res = runChecker(args);
  let json = null;
  try {
    json = JSON.parse(res.stdout);
  } catch {
    json = null;
  }
  return { ...res, json };
}

function countByRule(json, rule) {
  if (!json) return 0;
  return json.findings.filter((f) => f.rule === rule).length;
}

/* ---------- 1. fixture xau.md ---------- */

const xau = runCheckerJson(['--check', 'fixtures/xau.md', '--json']);

assert('xau.md: đọc được JSON output', xau.json !== null, xau.stdout.slice(0, 200));
assert('xau.md: exit code = 1', xau.code === 1, `nhận ${xau.code}`);
assert(
  'xau.md: bắt được >= 8 finding',
  xau.json !== null && xau.json.counts.total >= 8,
  `nhận ${xau.json ? xau.json.counts.total : 'n/a'}`,
);
assert(
  'xau.md: có ít nhất 1 finding review_required',
  xau.json !== null && xau.json.counts.review_required >= 1,
  `nhận ${xau.json ? xau.json.counts.review_required : 'n/a'}`,
);
assert(
  'xau.md: có ít nhất 6 rule khác nhau cùng bắt',
  xau.json !== null && new Set(xau.json.findings.map((f) => f.rule)).size >= 6,
  xau.json ? [...new Set(xau.json.findings.map((f) => f.rule))].join(',') : 'n/a',
);

/* Từng rule bắt buộc phải chạy được trên fixture xau.md */
const mustFire = [
  'not-only-but-also',
  'not-a-but-b',
  'mot-cach-adj',
  'danh-tu-hoa-viec',
  'mo-bai-rong',
  'dong-vai-tro',
  'hanh-chinh-dan-nhap',
  'ket-bai-hanh-trinh',
  'cau-rong-lien-tiep',
  'an-du-sao',
  'lam-dung-dash',
  'cau-qua-dai',
  'sao-ngu',
];
for (const rule of mustFire) {
  assert(`xau.md: rule "${rule}" phải bắt được`, countByRule(xau.json, rule) >= 1,
    `nhận ${countByRule(xau.json, rule)}`);
}

/* Mỗi finding phải đủ field theo contract */
if (xau.json && xau.json.findings.length > 0) {
  const f = xau.json.findings[0];
  const fields = ['file', 'line', 'col', 'rule', 'severity', 'match', 'goi_y'];
  const missing = fields.filter((k) => !(k in f));
  assert('xau.md: finding có đủ 7 field', missing.length === 0, `thiếu ${missing.join(',')}`);
  assert(
    'xau.md: severity chỉ là advisory hoặc review_required',
    xau.json.findings.every((x) => x.severity === 'advisory' || x.severity === 'review_required'),
  );
  assert(
    'xau.md: line/col là số nguyên dương',
    xau.json.findings.every((x) => Number.isInteger(x.line) && x.line > 0
      && Number.isInteger(x.col) && x.col > 0),
  );
}

/* Dòng có deslop:skip trong xau.md không được sinh finding ở đúng dòng đó */
if (xau.json) {
  const skipLine = fs
    .readFileSync(path.join(FIXTURES, 'xau.md'), 'utf8')
    .split('\n')
    .findIndex((l) => l.includes('<!-- deslop:skip -->')) + 1;
  const onSkipLine = xau.json.findings.filter((f) => f.line === skipLine);
  assert('xau.md: dòng deslop:skip không bị bắt', onSkipLine.length === 0,
    `nhận ${onSkipLine.length} finding ở dòng ${skipLine}`);
}

/* ---------- 2. fixture tot.md (chống báo động giả) ---------- */

const tot = runCheckerJson(['--check', 'fixtures/tot.md', '--json']);

assert('tot.md: đọc được JSON output', tot.json !== null);
assert(
  'tot.md: 0 finding (chống báo động giả)',
  tot.json !== null && tot.json.counts.total === 0,
  tot.json ? JSON.stringify(tot.json.findings.map((f) => `${f.line}:${f.rule}`)) : 'n/a',
);
assert('tot.md: exit code = 0', tot.code === 0, `nhận ${tot.code}`);
assert(
  'tot.md: câu "không phải … mà <nguyên nhân>" không bị bắt (chống báo động giả)',
  !fs.readFileSync(path.join(FIXTURES, 'tot.md'), 'utf8')
    .split('\n')
    .some((line, idx) => {
      if (!line.includes('Không phải tôi không muốn')) return false;
      return tot.json !== null && tot.json.findings.some((f) => f.line === idx + 1);
    }),
  'rule not-a-but-b bắt nhầm câu kể tự nhiên',
);

/* Rule not-a-but-b: chỉ bắt "mà là"/"mà còn", không bắt "mà" + nguyên nhân */
const natTmp = path.join(os.tmpdir(), `deslop-natural-${process.pid}.md`);
fs.writeFileSync(natTmp, 'Không phải tôi không muốn đi mà tại hết tiền.\n', 'utf8');
const natRun = runCheckerJson(['--check', natTmp, '--json']);
assert(
  'câu tự nhiên "không phải … mà tại …": 0 finding, exit 0',
  natRun.json !== null && natRun.json.counts.total === 0 && natRun.code === 0,
  natRun.json ? `finding=${natRun.json.counts.total} exit=${natRun.code}` : 'json hỏng',
);

fs.writeFileSync(natTmp, 'Đó không phải là sự keo kiệt mà là sự hy sinh.\n', 'utf8');
const realRun = runCheckerJson(['--check', natTmp, '--json']);
assert(
  'khuôn thật "không phải … mà là …" vẫn bị bắt (review_required, exit 1)',
  realRun.json !== null
    && realRun.json.counts.review_required === 1
    && countByRule(realRun.json, 'not-a-but-b') === 1
    && realRun.code === 1,
  realRun.json ? `rr=${realRun.json.counts.review_required} exit=${realRun.code}` : 'json hỏng',
);

fs.writeFileSync(natTmp, 'Bà không phải khó tính mà còn rất khắt khe.\n', 'utf8');
const realRun2 = runCheckerJson(['--check', natTmp, '--json']);
assert(
  'khuôn thật "không phải … mà còn …" vẫn bị bắt',
  realRun2.json !== null && countByRule(realRun2.json, 'not-a-but-b') === 1,
  realRun2.json ? `rule=${countByRule(realRun2.json, 'not-a-but-b')}` : 'json hỏng',
);
fs.rmSync(natTmp, { force: true });

/* ---------- 3. fixture edge.md (bỏ qua code block + skip) ---------- */

const edge = runCheckerJson(['--check', 'fixtures/edge.md', '--json']);

assert('edge.md: đọc được JSON output', edge.json !== null);
assert(
  'edge.md: nội dung trong khối code không bị bắt',
  edge.json !== null && edge.json.findings.every((f) => !(f.line >= 9 && f.line <= 14)),
  edge.json ? JSON.stringify(edge.json.findings.map((f) => `${f.line}:${f.rule}`)) : 'n/a',
);
assert(
  'edge.md: dòng deslop:skip không bị bắt',
  edge.json !== null && edge.json.findings.every((f) => !(f.line >= 17 && f.line <= 18)),
  edge.json ? JSON.stringify(edge.json.findings.map((f) => `${f.line}:${f.rule}`)) : 'n/a',
);
assert(
  'edge.md: dòng thường vẫn bị bắt (đúng 1 finding)',
  edge.json !== null && edge.json.counts.total === 1,
  edge.json ? `nhận ${edge.json.counts.total}` : 'n/a',
);
assert('edge.md: exit code = 1', edge.code === 1, `nhận ${edge.code}`);

/* ---------- 4. --fail-on ---------- */

const failNone = runChecker(['--check', 'fixtures/xau.md', '--fail-on=none']);
assert('--fail-on=none: exit 0 dù có finding', failNone.code === 0, `nhận ${failNone.code}`);

const failAdvisory = runChecker(['--check', 'fixtures/xau.md', '--fail-on=advisory']);
assert('--fail-on=advisory: exit 1 vì có review_required', failAdvisory.code === 1,
  `nhận ${failAdvisory.code}`);

const failStrict = runChecker(['--check', 'fixtures/xau.md', '--fail-on=strict']);
assert('--fail-on=strict: exit 1', failStrict.code === 1, `nhận ${failStrict.code}`);

const failStrictClean = runChecker(['--check', 'fixtures/tot.md', '--fail-on=strict']);
assert('--fail-on=strict trên tot.md: exit 0', failStrictClean.code === 0,
  `nhận ${failStrictClean.code}`);

const failDefault = runChecker(['--check', 'fixtures/tot.md']);
assert('mặc định --fail-on=advisory trên tot.md: exit 0', failDefault.code === 0,
  `nhận ${failDefault.code}`);

/* ---------- 5. lỗi dùng lệnh → exit 2 ---------- */

const noArgs = runChecker([]);
assert('không có tham số: exit 2', noArgs.code === 2, `nhận ${noArgs.code}`);

const badFlag = runChecker(['--check', 'fixtures/tot.md', '--fail-on=sai']);
assert('--fail-on không hợp lệ: exit 2', badFlag.code === 2, `nhận ${badFlag.code}`);

const missingFile = runChecker(['--check', 'fixtures/khong-ton-tai.md']);
assert('file không tồn tại: exit 2', missingFile.code === 2, `nhận ${missingFile.code}`);

/* ---------- 6. nhiều file cùng lúc ---------- */

const multi = runCheckerJson(['--check', 'fixtures/xau.md', 'fixtures/tot.md', '--json']);
assert(
  'nhiều file: gộp finding của cả hai',
  multi.json !== null
    && multi.json.files.length === 2
    && multi.json.counts.total === (xau.json ? xau.json.counts.total : -1),
  multi.json ? JSON.stringify(multi.json.counts) : 'n/a',
);
assert(
  'nhiều file: finding có file path đúng',
  multi.json !== null && multi.json.findings.every((f) => f.file.endsWith('xau.md')),
);

/* ---------- 7. text output có gợi ý tiếng Việt ---------- */

const textOut = runChecker(['--check', 'fixtures/xau.md']);
assert(
  'text output: có dòng gợi ý "->"',
  textOut.stdout.includes('-> '),
);
assert(
  'text output: có dòng tổng kết',
  /Tổng: \d+ finding/.test(textOut.stdout),
);
assert(
  'text output: gợi ý bằng tiếng Việt',
  /[àáảãạăâđêôơư]/u.test(textOut.stdout),
);

/* ---------- kết quả ---------- */

const total = passed + failed;
process.stdout.write('\n');
if (failed === 0) {
  process.stdout.write(`PASS ${passed}/${total}\n`);
  process.exit(0);
} else {
  process.stdout.write(`FAIL ${failed}/${total} test hỏng:\n`);
  for (const name of failures) process.stdout.write(`  - ${name}\n`);
  process.exit(1);
}
