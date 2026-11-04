const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const dataContext = () => ({ window: {} });

test('QA-001 all portfolio JavaScript files parse', () => {
  const files = fs.readdirSync(path.join(root, 'assets/js')).filter(file => file.endsWith('.js'));
  assert.ok(files.length > 0);
  for (const file of files) assert.doesNotThrow(() => new vm.Script(read(`assets/js/${file}`), { filename: file }));
});

test('QA-002 data files define valid records and unique project IDs', () => {
  const context = dataContext();
  for (const file of ['config.js', 'education.js', 'experience.js', 'skills.js', 'certifications.js', 'projects.js']) {
    vm.runInNewContext(read(`assets/js/${file}`), context, { filename: file });
  }
  assert.equal(typeof context.window.PORTFOLIO_CONFIG.name, 'string');
  for (const key of ['EDUCATION', 'EXPERIENCE', 'SKILLS', 'CERTIFICATIONS', 'PROJECTS']) assert.ok(Array.isArray(context.window[key]), `${key} must be an array`);
  const projects = context.window.PROJECTS;
  assert.ok(projects.length >= 1);
  assert.ok(projects.every(p => p.id && p.title && Array.isArray(p.technologies)));
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length, 'project IDs should be unique');
});

test('QA-003 internal navigation fragments resolve uniquely', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs should be unique');
  for (const [, fragment] of html.matchAll(/\bhref="#([^"?]+)"/g)) assert.ok(ids.includes(fragment), `Missing #${fragment}`);
});

test('QA-004 local scripts, stylesheets, and resume asset exist', () => {
  const html = read('index.html');
  for (const [, raw] of html.matchAll(/(?:src|href)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    assert.ok(fs.existsSync(path.join(root, raw)), `Missing asset ${raw}`);
  }
  const context = dataContext();
  vm.runInNewContext(read('assets/js/config.js'), context);
  assert.ok(fs.existsSync(path.join(root, context.window.PORTFOLIO_CONFIG.resumePath)));
});

test('QA-005 projects include meaningful detail and secure repository links', () => {
  const context = dataContext();
  vm.runInNewContext(read('assets/js/projects.js'), context);
  for (const p of context.window.PROJECTS) {
    assert.ok(p.problem && p.solution && p.contribution, `${p.id} should have project details`);
    if (p.repositoryUrl) assert.match(p.repositoryUrl, /^https:\/\//);
  }
  const source = read('assets/js/main.js');
  assert.match(source, /a\.rel = "noopener noreferrer"/);
  assert.match(source, /safeUrl\(p\.video\)/);
  assert.match(source, /Watch Video/);
  assert.match(source, /showVideo\(p\)/);
  assert.match(source, /player\.controls = true/);
});

test('QA-006 stat logic counts only the ten named technologies once each', () => {
  const main = read('assets/js/main.js');
  const names = ['Python', 'Django', 'JavaScript', 'HTML', 'CSS', 'SQL', 'React.js', 'Docker', 'Git & GitHub', 'REST API'];
  assert.match(main, /const coreTechnologies = \[/);
  for (const name of names) assert.ok(main.includes(`"${name}"`), `Missing stat alias group: ${name}`);
  assert.match(main, /coreTechnologies\.filter/);
});

test('QA-007 theme toggle has persisted preference and accessible state', () => {
  const source = read('assets/js/main.js');
  assert.match(source, /setupThemeToggle/);
  assert.match(source, /localStorage/);
  assert.match(read('index.html'), /id="theme-toggle"[^>]*aria-pressed="false"/);
});

test('QA-008 mobile menu has accessible expanded state and section destinations', () => {
  const html = read('index.html');
  assert.match(html, /class="menu-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="nav-links"/);
  assert.match(read('assets/js/main.js'), /aria-expanded/);
  assert.match(html, /id="nav-links"/);
});

test('QA-009 contact form is constrained and email-only on static hosting', () => {
  const html = read('index.html');
  assert.match(html, /id="contact-form"/);
  assert.match(html, /type="email"[^>]*required/);
  assert.match(read('assets/js/main.js'), /mailto:/);
  assert.match(html, /does not send or store messages/);
});

test('QA-010 data-rendered content uses text nodes, not HTML injection', () => {
  const source = read('assets/js/main.js');
  assert.match(source, /el\.textContent = text/);
  assert.doesNotMatch(source, /\.innerHTML\s*=|document\.write\s*\(|\beval\s*\(|new Function\s*\(/);
});

test('QA-011 untrusted iframe URLs are never embedded; YouTube URLs are normalized', () => {
  const source = read('assets/js/main.js');
  assert.match(source, /getTrustedVideoEmbedUrl/);
  assert.match(source, /\["youtube\.com", "www\.youtube\.com", "m\.youtube\.com"\]/);
  assert.match(source, /parsed\.protocol !== "https:"/);
  assert.match(source, /iframe\.src = embedUrl/);
  assert.doesNotMatch(source, /iframe\.src = videoUrl/);
  assert.match(source, /Open video demo ↗/);
  const helper = source.match(/const getTrustedVideoEmbedUrl = \(value\) => \{[\s\S]*?\n  \};/);
  assert.ok(helper, 'The actual video URL validator should be testable');
  const context = { URL, location: { href: 'https://portfolio.example/' }, safeUrl: value => {
    const raw = String(value || '').trim();
    if (!raw || raw.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^(https?:|mailto:)/i.test(raw)) return '';
    try { new URL(raw, 'https://portfolio.example/'); return raw; } catch { return ''; }
  } };
  const validator = vm.runInNewContext(`(${helper[0].replace('const getTrustedVideoEmbedUrl = ', '').replace(/;\s*$/, '')})`, context);
  for (const url of [
    'https://youtu.be/abcDEF12345',
    'https://www.youtube.com/watch?v=abcDEF12345',
    'https://www.youtube-nocookie.com/embed/abcDEF12345'
  ]) assert.equal(validator(url), 'https://www.youtube-nocookie.com/embed/abcDEF12345');
  for (const url of [
    'https://attacker.example/embed/abcDEF12345',
    'http://youtube.com/watch?v=abcDEF12345',
    'https://youtube.com.attacker.example/watch?v=abcDEF12345',
    'javascript:alert(1)',
    'https://youtube.com/watch?v=x'
  ]) assert.equal(validator(url), '');
});

test('QA-012 URL validation rejects active schemes and protocol-relative URLs', () => {
  const source = read('assets/js/main.js');
  assert.match(source, /raw\.startsWith\("\/\/"\)/);
  assert.match(source, /!\/\^\(https\?:\|mailto:\)/);
  assert.match(source, /new URL\(raw, location\.href\)/);
});

test('QA-013 project images and direct MP4s have safe display defaults', () => {
  const source = read('assets/js/main.js');
  assert.match(source, /img\.alt = alt/);
  assert.match(source, /img\.loading = "lazy"/);
  assert.match(source, /img\.onerror = \(\) => img\.remove\(\)/);
  assert.match(source, /v\.controls = true/);
  assert.match(source, /v\.preload = "metadata"/);
  assert.match(source, /iframe\.loading = "lazy"/);
});

test('QA-014 uploaded project videos are linked to the correct records and exist', () => {
  const context = dataContext();
  vm.runInNewContext(read('assets/js/projects.js'), context);
  assert.match(read('assets/js/main.js'), /p\.image/);
  assert.match(read('assets/js/main.js'), /p\.screenshots/);
  assert.match(read('assets/js/main.js'), /p\.video/);
  const videos = new Map(context.window.PROJECTS.map(p => [p.id, p.video]));
  assert.equal(videos.get('smartsheti-ai-smart-farming'), 'assets/videos/Smart_Sheti_web.mp4');
  assert.equal(videos.get('ai-multi-modal-trading-agent'), 'assets/videos/AITreadingAgent_web.mp4');
  for (const videoPath of videos.values()) {
    assert.ok(fs.existsSync(path.join(root, videoPath)), `Missing project video ${videoPath}`);
    assert.ok(fs.statSync(path.join(root, videoPath)).size < 100 * 1024 * 1024, `${videoPath} must fit GitHub's per-file limit`);
  }
});

test('QA-015 project image/video upload workflow is documented as repository-managed', () => {
  const readme = read('README.md');
  assert.match(readme, /assets\/images\/projects/);
  assert.match(readme, /assets\/videos/);
  assert.match(readme, /screenshots/);
  assert.match(readme, /repository|GitHub/i);
});

test('QA-016 responsive stylesheet includes mobile and tablet layout breakpoints', () => {
  const css = read('assets/css/responsive.css') + read('assets/css/responsive-polish.css');
  assert.match(css, /max-width:\s*\d+px/);
  assert.match(css, /projects-grid/);
  assert.match(css, /nav-links/);
  assert.match(css, /project-dialog|dialog-content/);
});

test('QA-017 reduced motion and keyboard-accessible project dialog are present', () => {
  const css = ['assets/css/style.css', 'assets/css/motion.css', 'assets/css/responsive.css', 'assets/css/responsive-polish.css'].map(read).join('\n');
  assert.match(css, /prefers-reduced-motion/);
  const html = read('index.html');
  assert.match(html, /<dialog[^>]*id="project-dialog"/);
  assert.match(html, /class="dialog-close"[^>]*type="button"/);
});

test('QA-018 GitHub Pages workflow uses official Pages artifact deployment permissions', () => {
  const workflow = read('.github/workflows/pages.yml');
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /actions\/upload-pages-artifact@/);
  assert.match(workflow, /actions\/deploy-pages@/);
});
