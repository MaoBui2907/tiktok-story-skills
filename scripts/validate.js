#!/usr/bin/env node
/**
 * validate.js — kiểm cấu trúc và nội dung repo tiktok-story-skills.
 *
 * Node >= 22. Zero dependency.
 *
 *   node scripts/validate.js [--json]
 *
 * Exit 0 khi mọi check pass, exit 1 khi có lỗi (in danh sách lỗi có file:line).
 * Exit 2 khi không đọc được repo.
 *
 * Chạy từ thư mục gốc repo.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const EXAMPLE_DIR = path.join(ROOT, 'examples', '01-storytime-30s');

const SKILL_NAMES = ['story-core', 'hook-writer', 'tiktok-native', 'vi-voice', 'story-deslop'];

const EXAMPLE_FILES = [
  'README.md',
  '01-y-tuong.md',
  '02-hook.md',
  '03-script.md',
  '04-loi-thoai-va-caption.md',
  '05-deslop.md',
];

const UPSTREAM = [
  { repo: 'https://github.com/iart-ai/tiktok-video-skills', sha: '88e7152fc2710fa16852d013959cfd988a8adc8b' },
  { repo: 'https://github.com/social-media-skills/skills', sha: 'f28cef2b7067ec64e79c9d85421c022c06659e03' },
  { repo: 'https://github.com/zenstory-ai/oh-story-claudecode', sha: '1d90495d9c640d574c9d26e0505d60cf0533d463' },
  { repo: 'https://github.com/coreyhaines31/marketingskills', sha: '5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1' },
];

const TRIGGER_PHRASES = ['Dùng khi', 'dùng khi', 'Use when', 'Khi người dùng'];

const PLACEHOLDER_PATTERNS = [
  { re: /\bTODO\b/g, label: 'TODO' },
  { re: /\bTBD\b/g, label: 'TBD' },
  { re: /\bFIXME\b/g, label: 'FIXME' },
  { re: /<placeholder>/gi, label: '<placeholder>' },
  { re: /\blorem\b/gi, label: 'lorem' },
];

/**
 * Pattern dò secret. Prefix được ghép từ mảnh (ví dụ ['gh','p_'].join('')) để
 * chính file validate này không tạo ra dương tính giả khi người kiểm bảo mật
 * grep toàn bộ git history tìm token. Không có token thật ở đây.
 */
const SECRET_PATTERNS = [
  { re: new RegExp(`${'gh'}p_[A-Za-z0-9]{10,}`, 'g'), label: 'GitHub classic token' },
  { re: new RegExp(`${'github'}${'_pat_'}[A-Za-z0-9_]{10,}`, 'g'), label: 'GitHub fine-grained token' },
  { re: new RegExp(`${'ma'}t_[A-Za-z0-9]{20,}`, 'g'), label: 'Multica token' },
  { re: new RegExp(`${'s'}k-[A-Za-z0-9]{20,}`, 'g'), label: 'API key dạng sk-' },
  { re: new RegExp(`${'AK'}IA[0-9A-Z]{16}`, 'g'), label: 'AWS access key' },
  { re: /-----BEGIN [A-Z ]+-----/g, label: 'private key block' },
  { re: /Authorization:\s*Bearer\s+[A-Za-z0-9._-]{20,}/g, label: 'bearer token' },
];

const errors = [];
const checks = [];

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i += 1) if (text[i] === '\n') line += 1;
  return line;
}

function addError(file, message, line) {
  errors.push({ file: typeof file === 'string' ? file : rel(file), line: line || null, message });
}

function pass(name) {
  checks.push({ name, ok: true });
}

function fail(name) {
  checks.push({ name, ok: false });
}

/* ---------- duyệt file ---------- */

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

/* ---------- frontmatter ---------- */

/**
 * Parse frontmatter tối giản: chỉ cần `name` và `description`.
 * Hỗ trợ `description: "..."`, `description: >-` block, `|` block.
 */
function parseFrontmatter(text) {
  const result = { fields: {}, bodyStart: 0, error: null };
  if (!text.startsWith('---')) {
    result.error = 'không có YAML frontmatter (file phải bắt đầu bằng "---")';
    return result;
  }
  const endIdx = text.indexOf('\n---', 3);
  if (endIdx === -1) {
    result.error = 'frontmatter không đóng bằng "---"';
    return result;
  }
  const raw = text.slice(3, endIdx).replace(/^\n/, '');
  result.bodyStart = text.indexOf('\n', endIdx + 1) + 1;

  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1];
    let value = m[2];
    if (value === '>-' || value === '>' || value === '|' || value === '|-') {
      const parts = [];
      i += 1;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        parts.push(lines[i].trim());
        i += 1;
      }
      value = parts.join(value.startsWith('|') ? '\n' : ' ');
      result.fields[key] = value.trim();
      continue;
    }
    value = value.replace(/^["']/, '').replace(/["']$/, '').trim();
    result.fields[key] = value;
    i += 1;
  }
  return result;
}

/* ---------- check 1..12 ---------- */

function checkSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    addError('skills/', 'thư mục skills/ không tồn tại');
    fail('1. layout skills/<name>/SKILL.md');
    return [];
  }

  const dirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  /* 12. đúng 5 thư mục */
  const extra = dirs.filter((d) => !SKILL_NAMES.includes(d));
  const missing = SKILL_NAMES.filter((d) => !dirs.includes(d));
  if (dirs.length !== 5 || extra.length > 0 || missing.length > 0) {
    addError('skills/', `phải có đúng 5 skill (${SKILL_NAMES.join(', ')}); hiện có: ${dirs.join(', ')}`
      + (extra.length ? `; thừa: ${extra.join(', ')}` : '')
      + (missing.length ? `; thiếu: ${missing.join(', ')}` : ''));
    fail('12. đúng 5 thư mục trong skills/');
  } else {
    pass('12. đúng 5 thư mục trong skills/');
  }

  const skills = [];
  let layoutOk = true;
  for (const name of dirs) {
    const skillFile = path.join(SKILLS_DIR, name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      addError(rel(skillFile), 'SKILL.md không tồn tại');
      layoutOk = false;
      continue;
    }
    const text = fs.readFileSync(skillFile, 'utf8');
    const fm = parseFrontmatter(text);

    /* 2. frontmatter */
    if (fm.error) {
      addError(rel(skillFile), fm.error, 1);
    } else {
      const { name: fmName, description } = fm.fields;
      if (!fmName) addError(rel(skillFile), 'frontmatter thiếu field "name"', 1);
      if (!description) addError(rel(skillFile), 'frontmatter thiếu field "description"', 1);
      if (fmName && fmName !== name) {
        addError(rel(skillFile), `name trong frontmatter ("${fmName}") khác tên thư mục ("${name}")`, 1);
      }
      if (fmName && !/^[a-z0-9-]+$/.test(fmName)) {
        addError(rel(skillFile), `name "${fmName}" không khớp ^[a-z0-9-]+$`, 1);
      }
      if (description) {
        const len = description.length;
        if (len < 60 || len > 1024) {
          addError(rel(skillFile), `description dài ${len} ký tự, phải trong khoảng 60–1024`, 1);
        }
        if (!TRIGGER_PHRASES.some((p) => description.includes(p))) {
          addError(rel(skillFile), `description thiếu cụm trigger (${TRIGGER_PHRASES.join(' / ')})`, 1);
        }
      }
      if (fm.fields.version !== undefined || fm.fields.license !== undefined) {
        addError(rel(skillFile), 'frontmatter không được có "version:" hoặc "license:"', 1);
      }
    }

    /* 3. link tương đối .md phải tồn tại */
    const body = text.slice(fm.bodyStart || 0);
    const linkRe = /\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g;
    let m;
    while ((m = linkRe.exec(body)) !== null) {
      const target = m[1];
      if (/^[a-z]+:\/\//i.test(target)) continue;
      const resolved = path.resolve(path.dirname(skillFile), target);
      if (!fs.existsSync(resolved)) {
        addError(rel(skillFile), `link chết: "${target}"`, lineOf(text, (fm.bodyStart || 0) + m.index));
      }
    }

    /* 11. SKILL.md >= 800 ký tự nội dung */
    const contentLen = body.trim().length;
    if (contentLen < 800) {
      addError(rel(skillFile), `nội dung SKILL.md chỉ ${contentLen} ký tự, cần >= 800`);
    }

    /* 4. references/ >= 2 file .md, mỗi file > 200 ký tự */
    const refDir = path.join(SKILLS_DIR, name, 'references');
    if (!fs.existsSync(refDir) || !fs.statSync(refDir).isDirectory()) {
      addError(rel(refDir), 'thiếu thư mục references/');
    } else {
      const refFiles = fs.readdirSync(refDir).filter((f) => f.endsWith('.md'));
      if (refFiles.length < 2) {
        addError(rel(refDir), `chỉ có ${refFiles.length} file .md, cần >= 2`);
      }
      for (const f of refFiles) {
        const full = path.join(refDir, f);
        const content = fs.readFileSync(full, 'utf8');
        if (content.trim().length <= 200) {
          addError(rel(full), `file references rỗng hoặc quá ngắn (${content.trim().length} ký tự, cần > 200)`);
        }
      }
    }

    skills.push({ name, skillFile, text, dir: path.join(SKILLS_DIR, name) });
  }

  if (layoutOk) pass('1. layout skills/<name>/SKILL.md');
  else fail('1. layout skills/<name>/SKILL.md');

  pass('2. frontmatter name + description + trigger');
  pass('3. link tương đối .md không chết');
  pass('4. references/ có >= 2 file .md không rỗng');
  pass('11. mỗi SKILL.md >= 800 ký tự');
  return skills;
}

function checkPlaceholders(skills) {
  const targets = filesUnder(SKILLS_DIR)
    .concat(filesUnder(path.join(ROOT, 'examples')))
    .concat(filesUnder(path.join(ROOT, 'docs')));

  for (const file of targets) {
    const text = fs.readFileSync(file, 'utf8');
    for (const { re, label } of PLACEHOLDER_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        addError(rel(file), `còn placeholder "${label}"`, lineOf(text, m.index));
      }
    }
  }
  pass('5. không có TODO/TBD/FIXME/<placeholder>/lorem');
}

function filesUnder(dir) {
  return walk(dir);
}

function checkSecrets() {
  const files = filesUnder(ROOT).filter((f) => {
    const r = rel(f);
    return !r.startsWith('.git/') && !r.startsWith('node_modules/');
  });

  let found = false;
  for (const file of files) {
    const base = path.basename(file);
    if (base === '.env' || base.startsWith('.env.')) {
      addError(rel(file), 'không được có file .env trong repo');
      found = true;
      continue;
    }
    if (/\.(pem|key|p12)$/i.test(base)) {
      addError(rel(file), `không được có file khoá (${base}) trong repo`);
      found = true;
      continue;
    }
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    if (text.includes('\0')) continue;
    for (const { re, label } of SECRET_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        addError(rel(file), `phát hiện ${label}`, lineOf(text, m.index));
        found = true;
      }
    }
  }
  if (found) fail('6. secret scan');
  else pass('6. secret scan');
}

function checkNoUnsourcedPercent(skills) {
  const groups = [
    { label: 'skills/', dir: SKILLS_DIR },
    { label: 'examples/', dir: path.join(ROOT, 'examples') },
  ];
  const percentRe = /\d+\s*%/;
  let found = false;
  for (const g of groups) {
    for (const file of filesUnder(g.dir)) {
      if (!/\.(md|js|json|yml|yaml)$/i.test(file)) continue;
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      const relPath = rel(file);
      lines.forEach((line, idx) => {
        if (!percentRe.test(line)) return;
        // Dòng trong file script (source code) không tính: đó không phải tuyên bố về nội dung.
        if (/\.(js|json|ya?ml)$/i.test(relPath)) return;
        const hasSource = /(nguồn:|Nguồn:|source:)/.test(line);
        const hasUrl = /https:\/\//.test(line);
        if (!hasSource || !hasUrl) {
          addError(relPath, `dòng có "%" nhưng thiếu "nguồn:"/"source:" + URL https://`, idx + 1);
          found = true;
        }
      });
    }
  }
  if (found) fail('7. luật số liệu (% phải có nguồn)');
  else pass('7. luật số liệu (% phải có nguồn)');
}

function checkExample() {
  if (!fs.existsSync(EXAMPLE_DIR)) {
    addError('examples/01-storytime-30s/', 'thiếu thư mục ví dụ');
    fail('8. ví dụ end-to-end đủ 6 file');
    return;
  }
  for (const name of EXAMPLE_FILES) {
    const full = path.join(EXAMPLE_DIR, name);
    if (!fs.existsSync(full)) {
      addError(rel(full), 'thiếu file trong ví dụ');
      continue;
    }
    if (name === 'README.md') continue;
    const len = fs.readFileSync(full, 'utf8').trim().length;
    if (len <= 300) {
      addError(rel(full), `file ví dụ chỉ ${len} ký tự, cần > 300`);
    }
  }
  checkExampleConsistency();
  pass('8. ví dụ end-to-end đủ 6 file và số liệu khớp giữa các file');
}

/* ---------- nhất quán số liệu trong ví dụ ---------- */

const VI_NUMBERS = {
  không: 0, một: 1, hai: 2, ba: 3, bốn: 4, tư: 4, năm: 5, sáu: 6, bảy: 7,
  tám: 8, chín: 9, mười: 10, mười: 10,
};

function readExample(name) {
  const full = path.join(EXAMPLE_DIR, name);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
}

function splitRow(line) {
  return line.split('|').slice(1, -1).map((c) => c.trim());
}

function wordsOf(text) {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

/** Đọc bảng shot của 03-script.md → { shot, onscreen, timing, start, end, line }. */
function parseShotTable(text) {
  const lines = text.split('\n');
  const shots = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;
    const cells = splitRow(line);
    if (cells.length !== 5) continue;
    if (!/^\d+$/u.test(cells[0])) continue;
    const m = cells[4].match(/^(\d+)\s*[\u2013\u2014-]\s*(\d+)$/u);
    if (!m) continue;
    shots.push({
      shot: Number(cells[0]),
      onscreen: cells[1],
      timing: cells[4],
      start: Number(m[1]),
      end: Number(m[2]),
      line: i + 1,
    });
  }
  return shots;
}

/**
 * Guard chống lớp lỗi "số trong văn xuôi lệch số trong bảng":
 * A. mốc giây trong 01/02 phải là mốc của một shot trong 03
 * B. bảng đếm chữ trong 04 phải khớp text + số đếm thật của 03
 * C. 5 hook trong 02 phải nằm trong dải 8–14 tiếng, khớp với note nếu có
 * D. số giờ trong hook phải khớp ô "N tiếng" của chính hook đó
 */
function checkExampleConsistency() {
  const script = readExample('03-script.md');
  if (!script) return;
  const shots = parseShotTable(script);
  if (shots.length === 0) {
    addError(rel(path.join(EXAMPLE_DIR, '03-script.md')), 'không đọc được bảng production doc 5 cột (cần cột timing dạng "a–b")');
    return;
  }

  /* --- A. khung thời gian liên tục và khớp tổng --- */
  const scriptRel = rel(path.join(EXAMPLE_DIR, '03-script.md'));
  let prevEnd = 0;
  for (const s of shots) {
    if (s.start !== prevEnd) {
      addError(scriptRel, `shot ${s.shot}: timing bắt đầu ở ${s.start}s nhưng shot trước kết thúc ở ${prevEnd}s`, s.line);
    }
    if (s.end <= s.start) {
      addError(scriptRel, `shot ${s.shot}: timing ${s.timing} không hợp lệ`, s.line);
    }
    prevEnd = s.end;
  }
  const total = prevEnd;
  const boundaries = new Set();
  for (const s of shots) {
    boundaries.add(s.start);
    boundaries.add(s.end);
  }

  const budgetMatch = (readExample('01-y-tuong.md') || '').match(/##\s*Budget\s+(\d+)\s*giây/u);
  if (budgetMatch && Number(budgetMatch[1]) !== total) {
    const lineNo = (readExample('01-y-tuong.md') || '').split('\n')
      .findIndex((l) => /##\s*Budget\s+\d+\s*giây/u.test(l)) + 1;
    addError(rel(path.join(EXAMPLE_DIR, '01-y-tuong.md')),
      `budget ghi ${budgetMatch[1]} giây nhưng cộng timing trong 03-script.md bằng ${total} giây`, lineNo || null);
  }

  /* --- A2. mọi mốc giây nhắc trong 01/02 phải là mốc shot --- */
  /*
   * Quét trên text đã nối dòng (thay xuống dòng bằng khoảng trắng) nhưng vẫn\.
   * giữ bản đồ offset -> số dòng, vì câu văn trong repo bị ngắt dòng giữa chừng —
   * quét từng dòng sẽ bỏ sót đúng lớp lỗi này (mốc "giây 21" nằm vắt qua 2 dòng).
   */
  const RANGE_CLAIMS = [
    /giây\s*(\d+)\s*[\u2013\u2014-]\s*(\d+)(?!\d)/giu,
    /(?<!\d)(\d+)\s*[\u2013\u2014-]\s*(\d+)\s*s\b/giu,
  ];
  /* mốc đơn: "giây 19" — không khớp khi là phần đầu của một khoảng */
  const SINGLE_CLAIM = /giây\s+(\d+)(?!\d)(?![\s]*[\u2013\u2014-])/giu;
  const boundaryList = [...boundaries].sort((x, y) => x - y).join(', ');

  for (const name of ['01-y-tuong.md', '02-hook.md']) {
    const raw = readExample(name);
    if (!raw) continue;
    const fileRel = rel(path.join(EXAMPLE_DIR, name));
    const lines = raw.split('\n');
    const flat = lines.join(' ');
    const lineAt = (offset) => {
      let acc = 0;
      for (let i = 0; i < lines.length; i += 1) {
        acc += lines[i].length + 1;
        if (offset < acc) return i + 1;
      }
      return lines.length;
    };
    const scan = (re, onMatch) => {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(flat)) !== null) {
        onMatch(m, lineAt(m.index));
        if (m.index === r.lastIndex) r.lastIndex += 1;
      }
    };

    for (const re of RANGE_CLAIMS) {
      scan(re, (m, lineNo) => {
        const a = Number(m[1]);
        const b = Number(m[2]);
        if (!boundaries.has(a) || !boundaries.has(b)) {
          addError(fileRel,
            `mốc "${m[0].replace(/\s+/gu, ' ')}": không phải ranh giới shot nào trong 03-script.md (mốc hợp lệ: ${boundaryList})`,
            lineNo);
        }
      });
    }
    scan(SINGLE_CLAIM, (m, lineNo) => {
      const n = Number(m[1]);
      if (!boundaries.has(n)) {
        addError(fileRel,
          `mốc "${m[0].replace(/\s+/gu, ' ')}": không phải ranh giới shot nào trong 03-script.md (mốc hợp lệ: ${boundaryList})`,
          lineNo);
      }
    });
  }

  /* --- A3. khai báo "N giây trên M" phải khớp payoff thật --- */
  const budgetText = readExample('01-y-tuong.md') || '';
  const payoffBudget = budgetText.match(/\|\s*Payoff\s*\|\s*(\d+)\s*[\u2013\u2014-]\s*(\d+)s/u);
  const payoffSpan = payoffBudget
    ? Number(payoffBudget[2]) - Number(payoffBudget[1])
    : null;
  budgetText.split('\n').forEach((line, idx) => {
    const m = line.match(/(\d+)\s*giây trên (\d+)/u);
    if (!m) return;
    const claimed = Number(m[1]);
    const claimedTotal = Number(m[2]);
    if (claimedTotal !== total) {
      addError(rel(path.join(EXAMPLE_DIR, '01-y-tuong.md')),
        `ghi "${m[0]}" nhưng độ dài video trong 03-script.md là ${total} giây`, idx + 1);
    }
    if (payoffSpan !== null && claimed !== payoffSpan) {
      addError(rel(path.join(EXAMPLE_DIR, '01-y-tuong.md')),
        `ghi "${m[0]}" nhưng payoff trong bảng budget là ${payoffSpan} giây`, idx + 1);
    }
  });
  /* --- B. bảng đếm chữ trong 04 phải khớp text + số đếm thật --- */
  const caption = readExample('04-loi-thoai-va-caption.md');
  if (caption) {
    const fileRel = rel(path.join(EXAMPLE_DIR, '04-loi-thoai-va-caption.md'));
    const byShot = new Map(shots.map((s) => [s.shot, s]));
    caption.split('\n').forEach((line, idx) => {
      const t = line.trim();
      if (!t.startsWith('|')) return;
      const cells = splitRow(t);
      if (cells.length !== 3 || !/^\d+$/u.test(cells[0]) || !/^\d+$/u.test(cells[2])) return;
      const shotNo = Number(cells[0]);
      const claimedText = cells[1];
      const claimedCount = Number(cells[2]);
      const s = byShot.get(shotNo);
      if (!s) {
        addError(fileRel, `bảng đếm chữ có shot ${shotNo} nhưng 03-script.md không có shot đó`, idx + 1);
        return;
      }
      if (claimedText !== s.onscreen) {
        addError(fileRel,
          `shot ${shotNo}: chữ ghi "${claimedText}" khác on-screen text trong 03-script.md ("${s.onscreen}")`, idx + 1);
        return;
      }
      const actual = wordsOf(claimedText);
      if (claimedCount !== actual) {
        addError(fileRel, `shot ${shotNo}: ghi ${claimedCount} từ nhưng đếm thật là ${actual} từ`, idx + 1);
      }
    });
  }

  /* --- B2. khai báo "Dòng dài nhất N từ (shot ...)" trong 03 --- */
  const maxClaims = script.split('\n')
    .map((line, idx) => ({ line, idx: idx + 1 }))
    .filter((x) => /Dòng dài nhất\s+\d+\s+từ/u.test(x.line));
  for (const { line, idx } of maxClaims) {
    const m = line.match(/Dòng dài nhất\s+(\d+)\s+từ\s*\(([^)]*)\)/u);
    if (!m) continue;
    const claimedMax = Number(m[1]);
    const actualCounts = shots.map((s) => ({ shot: s.shot, n: wordsOf(s.onscreen) }));
    const realMax = Math.max(...actualCounts.map((c) => c.n));
    if (claimedMax !== realMax) {
      addError(scriptRel, `ghi "dòng dài nhất ${claimedMax} từ" nhưng đếm thật là ${realMax} từ`, idx);
      continue;
    }
    const claimedShots = (m[2].match(/\d+/gu) || []).map(Number).sort((a, b) => a - b);
    const realShots = actualCounts.filter((c) => c.n === realMax).map((c) => c.shot).sort((a, b) => a - b);
    if (claimedShots.join(',') !== realShots.join(',')) {
      addError(scriptRel,
        `ghi shot dài nhất là (${claimedShots.join(', ')}) nhưng thực tế là (${realShots.join(', ')})`, idx);
    }
  }

  /* --- C. 5 hook trong 02 nằm trong dải 8–14 tiếng --- */
  const hookFile = readExample('02-hook.md');
  if (hookFile) {
    const hookRel = rel(path.join(EXAMPLE_DIR, '02-hook.md'));
    const hookRows = [];
    hookFile.split('\n').forEach((line, idx) => {
      const t = line.trim();
      if (!t.startsWith('|')) return;
      const cells = splitRow(t);
      if (cells.length < 5 || !/^\d+$/u.test(cells[0])) return;
      hookRows.push({
        n: Number(cells[0]),
        text: cells[1],
        payoff: cells[3],
        line: idx + 1,
      });
    });
    const HOK_MIN = 8;
    const HOK_MAX = 14;
    for (const h of hookRows) {
      const n = wordsOf(h.text);
      if (n < HOK_MIN || n > HOK_MAX) {
        addError(hookRel, `hook ${h.n} có ${n} tiếng, ngoài dải ${HOK_MIN}–${HOK_MAX} tiếng mà hook-variants-matrix.md buộc`, h.line);
      }
    }
    /* note khai báo dải thật, nếu có: "khoảng 8–14 tiếng đọc (11–13)" */
    hookFile.split('\n').forEach((line, idx) => {
      const m = line.match(/(\d+)\s*[\u2013\u2014-]\s*(\d+)\s*tiếng đọc\s*\((\d+)\s*[\u2013\u2014-]\s*(\d+)\)/u);
      if (!m) return;
      const counts = hookRows.map((h) => wordsOf(h.text));
      if (counts.length === 0) return;
      const realMin = Math.min(...counts);
      const realMax = Math.max(...counts);
      if (realMin < Number(m[3]) || realMax > Number(m[4])) {
        addError(hookRel,
          `ghi 5 hook trong khoảng ${m[3]}–${m[4]} tiếng nhưng đếm thật là ${realMin}–${realMax}`, idx + 1);
      }
    });

    /* --- D. số giờ trong hook phải khớp ô "N tiếng" của chính hook --- */
    for (const h of hookRows) {
      const hours = [];
      const re = /(không|một|hai|ba|bốn|tư|năm|sáu|bảy|tám|chín|mười)\s+giờ/giu;
      let m;
      while ((m = re.exec(h.text)) !== null) hours.push(VI_NUMBERS[m[1].toLowerCase()]);
      if (hours.length < 2) continue;
      const diff = Math.max(...hours) - Math.min(...hours);
      const pm = h.payoff.match(/(không|một|hai|ba|bốn|tư|năm|sáu|bảy|tám|chín|mười)\s+tiếng/giu);
      if (!pm) continue;
      const claimed = VI_NUMBERS[pm[0].split(/\s+/u)[0].toLowerCase()];
      if (claimed !== diff) {
        addError(hookRel,
          `hook ${h.n} nêu các mốc giờ lệch nhau ${diff} tiếng nhưng ô payoff ghi "${pm[0]}"`, h.line);
      }
    }

    /*
     * --- D2. câu văn "Hook N hứa: … N tiếng …" phải khớp số giờ trong hook N ---
     * Đây chính là lớp lỗi đã xảy ra: bảng đổi "hai tiếng" nhưng câu văn ngay dưới
     * vẫn giữ "ba tiếng". Không kiểm câu văn thì sửa bảng vẫn lọt.
     */
    const hoursIn = (s) => {
      const out = [];
      const re = /(không|một|hai|ba|bốn|tư|năm|sáu|bảy|tám|chín|mười)\s+giờ/giu;
      let m;
      while ((m = re.exec(s)) !== null) out.push(VI_NUMBERS[m[1].toLowerCase()]);
      return out;
    };
    hookFile.split('\n').forEach((line, idx) => {
      const bullet = line.match(/Hook\s+(\d+)\s+hứa:\s*(.+)$/u);
      if (!bullet) return;
      const n = Number(bullet[1]);
      const row = hookRows.find((h) => h.n === n);
      if (!row) return;
      const hours = hoursIn(row.text);
      if (hours.length < 2) return;
      const diff = Math.max(...hours) - Math.min(...hours);
      const tm = bullet[2].match(/(không|một|hai|ba|bốn|tư|năm|sáu|bảy|tám|chín|mười)\s+tiếng/giu);
      if (!tm) return;
      const claimed = VI_NUMBERS[tm[0].split(/\s+/u)[0].toLowerCase()];
      if (claimed !== diff) {
        addError(hookRel,
          `câu "Hook ${n} hứa" ghi "${tm[0]}" nhưng hook ${n} nêu các mốc giờ lệch nhau ${diff} tiếng`, idx + 1);
      }
    });
  }
}

function checkLicenseAndNotice() {
  const licensePath = path.join(ROOT, 'LICENSE');
  if (!fs.existsSync(licensePath)) {
    addError('LICENSE', 'không tồn tại');
  } else if (!fs.readFileSync(licensePath, 'utf8').includes('MIT License')) {
    addError('LICENSE', 'không chứa chuỗi "MIT License"');
  }

  const noticePath = path.join(ROOT, 'NOTICE');
  if (!fs.existsSync(noticePath)) {
    addError('NOTICE', 'không tồn tại');
  } else {
    const notice = fs.readFileSync(noticePath, 'utf8');
    for (const { repo } of UPSTREAM) {
      if (!notice.includes(repo)) addError('NOTICE', `thiếu repo upstream: ${repo}`);
    }
    for (const { sha } of UPSTREAM) {
      if (!notice.includes(sha)) addError('NOTICE', `thiếu SHA: ${sha}`);
    }
    const shas = notice.match(/\b[0-9a-f]{40}\b/g) || [];
    if (new Set(shas).size < 4) {
      addError('NOTICE', `chỉ tìm thấy ${new Set(shas).size} SHA 40-hex, cần 4`);
    }
  }
  pass('9. LICENSE MIT + NOTICE đủ 4 repo & 4 SHA');
}

function checkReadme() {
  const readmePath = path.join(ROOT, 'README.md');
  if (!fs.existsSync(readmePath)) {
    addError('README.md', 'không tồn tại');
    fail('10. README có lệnh cài + đủ 5 skill');
    return;
  }
  const readme = fs.readFileSync(readmePath, 'utf8');
  if (!readme.includes('npx skills add MaoBui2907/tiktok-story-skills --skill')) {
    addError('README.md', 'thiếu lệnh cài đúng dạng: npx skills add MaoBui2907/tiktok-story-skills --skill <name>');
  }
  for (const name of SKILL_NAMES) {
    if (!readme.includes(name)) addError('README.md', `không liệt kê skill "${name}"`);
  }
  pass('10. README có lệnh cài + đủ 5 skill');
}

/* ---------- main ---------- */

function main() {
  const json = process.argv.includes('--json');

  if (!fs.existsSync(SKILLS_DIR) && !fs.existsSync(path.join(ROOT, 'README.md'))) {
    process.stderr.write(`Không tìm thấy repo tại ${ROOT}\n`);
    return 2;
  }

  const skills = checkSkills();
  checkPlaceholders(skills);
  checkSecrets();
  checkNoUnsourcedPercent(skills);
  checkExample();
  checkLicenseAndNotice();
  checkReadme();

  if (json) {
    process.stdout.write(`${JSON.stringify({
      ok: errors.length === 0,
      error_count: errors.length,
      errors,
      checks,
    }, null, 2)}\n`);
    return errors.length === 0 ? 0 : 1;
  }

  if (errors.length === 0) {
    process.stdout.write('validate: OK — 12/12 nhóm check pass\n');
    for (const c of checks) process.stdout.write(`  ok  ${c.name}\n`);
    return 0;
  }

  process.stdout.write(`validate: FAIL — ${errors.length} lỗi\n\n`);
  for (const e of errors) {
    const loc = e.line ? `${e.file}:${e.line}` : e.file;
    process.stdout.write(`  ${loc} — ${e.message}\n`);
  }
  return 1;
}

process.exitCode = main();
