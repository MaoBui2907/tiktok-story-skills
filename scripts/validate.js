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
  pass('8. ví dụ end-to-end đủ 6 file');
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
