// Writes ASSETS.md (the asset checklist) from assets/manifest.js.
//   node tools/assets/checklist.mjs
// Run it again after filling in any `src` and the checklist updates itself.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/manifest.js'), 'utf8'), ctx);
const A = ctx.window.ASSETS;

const rows = Object.entries(A);
const byProject = {};
for (const [id, a] of rows) (byProject[a.project] ||= []).push([id, a]);

const status = a => a.src ? '✅ in place' : a.interim ? '🟡 interim image showing' : '⬜ needed';
const esc = s => String(s).replace(/\|/g, '\\|');
const count = (f) => rows.filter(([, a]) => f(a)).length;

let md = `# Asset checklist

Generated from \`assets/manifest.js\` by \`tools/assets/checklist.mjs\`. Don't edit by hand.

**${count(a => a.priority === 'essential' && !a.src)} essential** and **${count(a => a.priority === 'optional' && !a.src)} optional** assets still needed · ${count(a => a.src)} in place.

How to send: one file at a time is fine. Name it by its **code** (e.g. \`KDS-556-1.png\`) or just tell me the code. Any of .png, .jpg or .webp works. I convert and resize everything.

`;
for (const [proj, list] of Object.entries(byProject)) {
  md += `\n## ${proj}\n\n| | Code | Asset | What it should contain | Type | Size / shape | Where it appears | Priority |\n|---|---|---|---|---|---|---|---|\n`;
  for (const [, a] of list) {
    md += `| ${status(a)} | **${a.code}** | ${esc(a.name)} | ${esc(a.contains)} | ${a.kind} | ${esc(a.size)} (${a.ratio === '10:22' || a.free ? 'full length' : a.ratio}) | ${esc(a.where)} | ${a.priority} |\n`;
  }
}
fs.writeFileSync(path.join(root, 'ASSETS.md'), md);
fs.writeFileSync(path.join(root, 'tools/assets/checklist.json'), JSON.stringify(rows.map(([id, a]) => ({ id, ...a, status: status(a) })), null, 1));
console.log(`ASSETS.md: ${rows.length} assets, ${count(a => a.priority === 'essential' && !a.src)} essential still needed`);
