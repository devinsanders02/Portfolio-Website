// Builds assets/topo/terrain.svg — the homepage contour lines.
//
//   cd tools/terrain && npm install && node build.mjs
//
// Two sources (see config.json):
//   procedural — a stand-in mountain massif made from noise and ridges
//   dem        — a real elevation file from OpenTopography (.tif or .asc)
//
// Colours, line weight, opacity and position are NOT baked in. The SVG reads
// CSS custom properties (--topo-*) set in css/site.css, so restyling never
// needs a rebuild. Only the shape of the terrain lives here.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contours as d3contours } from 'd3-contour';

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'config.json'), 'utf8'));
const [VW, VH] = cfg.viewBox;
const [GW, GH] = cfg.grid;

// ---------------------------------------------------------------- noise ----
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(cfg.seed || 1);
const perm = new Uint8Array(512); { const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
const grad = (h, x, y) => { const g = h & 7; const u = g < 4 ? x : y, v = g < 4 ? y : x; return ((g & 1) ? -u : u) + ((g & 2) ? -2 * v : 2 * v); };
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
function perlin(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y), a = perm[X] + Y, b = perm[X + 1] + Y;
  const l1 = grad(perm[a], x, y) + u * (grad(perm[b], x - 1, y) - grad(perm[a], x, y));
  const l2 = grad(perm[a + 1], x, y - 1) + u * (grad(perm[b + 1], x - 1, y - 1) - grad(perm[a + 1], x, y - 1));
  return (l1 + v * (l2 - l1)) / 2.2;
}
const fbm = (x, y, o = 5) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { s += a * perlin(x * f, y * f); f *= 2.03; a *= 0.5; } return s; };
const ridged = (x, y, o = 5) => { let s = 0, a = 0.5, f = 1, w = 1; for (let i = 0; i < o; i++) { let n = 1 - Math.abs(perlin(x * f, y * f)); n *= n; n *= w; w = Math.min(1, n * 1.6); s += n * a; f *= 2.1; a *= 0.5; } return s; };

// distance from point to segment, for ridgelines
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay); // closed rings start and end on the same point
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const cx = ax + t * dx, cy = ay + t * dy; return Math.hypot(px - cx, py - cy);
}

// ------------------------------------------------------ procedural field ----
// Coordinates are in "frame units": x 0..1.78 (16:9), y 0..1. The massif is a
// main summit with a long saw-toothed ridge running to a higher peak off the
// top-right edge, two spur ridges falling south-west, and a cirque bowl.
function proceduralField() {
  const { peakX, peakY, scale, rotateDeg } = cfg.placement;
  const ar = VW / VH, rot = (rotateDeg || 0) * Math.PI / 180, cosR = Math.cos(rot), sinR = Math.sin(rot);
  const P = [peakX * ar, peakY];
  const ridges = [ // [ax, ay, bx, by, width, height]
    [0, 0, 0.42, -0.2, 0.07, 0.95],    // main ridge to the higher peak off-canvas
    [0, 0, -0.34, 0.24, 0.06, 0.62],   // long SW spur
    [0, 0, -0.08, 0.38, 0.05, 0.5],    // S spur
    [0.2, -0.1, 0.16, 0.24, 0.045, 0.4], // spur off the main ridge
    [0, 0, -0.38, -0.06, 0.05, 0.42],  // W shoulder
  ];
  const vals = new Float64Array(GW * GH);
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
    let x = (i / (GW - 1)) * ar, y = j / (GH - 1);
    // local coordinates around the summit, rotated + scaled
    let lx = (x - P[0]) / scale, ly = (y - P[1]) / scale;
    [lx, ly] = [lx * cosR - ly * sinR, lx * sinR + ly * cosR];
    // domain warp so ridges wander like real ones
    const wx = lx + 0.06 * fbm(lx * 3 + 11, ly * 3 + 7, 4), wy = ly + 0.06 * fbm(lx * 3 - 5, ly * 3 + 19, 4);
    let h = 0;
    // summit: a sharp cone (steep near the top, easing out lower down)
    const r = Math.hypot(wx, wy);
    h += 1.0 * Math.exp(-Math.pow(r / 0.24, 1.6));
    // higher neighbour off the top-right edge
    h += 1.1 * Math.exp(-Math.pow(Math.hypot(wx - 0.44, wy + 0.22) / 0.2, 1.35));
    // ridges: sharp-crested (|d|-based) so contours bend into Vs that point downhill
    for (const [ax, ay, bx, by, w, a] of ridges) { const d = segDist(wx, wy, ax, ay, bx, by); h += a * Math.exp(-Math.pow(d / w, 1.25)) * (0.65 + 0.35 * ridged(wx * 4, wy * 4, 3)); }
    // valleys between the spurs: Vs that point uphill
    for (const [ax, ay, bx, by, w, a] of [[-0.05, 0.1, -0.3, 0.42, 0.05, 0.22], [-0.12, -0.02, -0.46, 0.12, 0.05, 0.18], [0.12, 0.06, 0.06, 0.4, 0.045, 0.18], [0.22, 0.02, 0.36, 0.3, 0.05, 0.16]]) { const d = segDist(wx, wy, ax, ay, bx, by); h -= a * Math.exp(-d / w); }
    // cirque on the north side of the summit (a carved bowl)
    const cx = wx + 0.03, cy = wy + 0.13; h -= 0.3 * Math.exp(-((cx * cx) / (2 * 0.085 * 0.085) + (cy * cy) / (2 * 0.055 * 0.055)));
    // broad regional rise toward the upper right keeps the lower-left low
    h += 0.5 * (x / ar) + 0.32 * (1 - y);
    // erosion: ridged noise, stronger on the high ground, gives gullies and small spurs
    const hi = Math.min(1, Math.max(0, (h - 0.5) / 1.2));
    h += (0.07 + 0.2 * hi) * (ridged(wx * 5 + 3, wy * 5 - 2, 6) - 0.4);
    h += 0.035 * fbm(x * 8, y * 8, 4);
    vals[j * GW + i] = h;
  }
  return { vals, unit: null };
}

// ------------------------------------------------------------- DEM field ----
async function demField() {
  const file = path.resolve(here, cfg.demFile);
  if (!fs.existsSync(file)) throw new Error(`DEM file not found: ${file}`);
  let w, h, data, nodata = null, geo = null;
  if (/\.asc$/i.test(file)) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    const hdr = {}; let k = 0;
    for (; k < 8; k++) { const m = lines[k].trim().match(/^([a-zA-Z_]+)\s+(-?[\d.eE+-]+)$/); if (!m) break; hdr[m[1].toLowerCase()] = +m[2]; }
    w = hdr.ncols; h = hdr.nrows; nodata = hdr.nodata_value ?? null;
    data = Float64Array.from(lines.slice(k).join(' ').trim().split(/\s+/).map(Number));
  } else {
    const { fromArrayBuffer } = await import('geotiff');
    const buf = fs.readFileSync(file);
    const tiff = await fromArrayBuffer(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const img = await tiff.getImage();
    w = img.getWidth(); h = img.getHeight(); nodata = img.getGDALNoData();
    try { geo = { origin: img.getOrigin(), res: img.getResolution() }; } catch (e) { geo = null; }
    data = Float64Array.from((await img.readRasters({ samples: [0] }))[0]);
  }
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < data.length; i++) { const v = data[i]; if ((nodata !== null && v === nodata) || v < -1000) { data[i] = NaN; continue; } if (v < lo) lo = v; if (v > hi) hi = v; }

  // Georeferencing (GeoTIFF only): find the summit we asked for, not just the highest
  // pixel. Bierstadt's file also contains Mount Blue Sky, which is higher.
  let sx = 0, sy = 0, peakM = -Infinity, latDeg = cfg.dem.summitLonLat ? cfg.dem.summitLonLat[1] : 39.6;
  if (geo && cfg.dem.summitLonLat) {
    const [lon, lat] = cfg.dem.summitLonLat;
    const cx = Math.round((lon - geo.origin[0]) / geo.res[0]), cy = Math.round((lat - geo.origin[1]) / geo.res[1]);
    const R = 30; // search radius in pixels for the true local summit
    for (let y = Math.max(0, cy - R); y < Math.min(h, cy + R); y++) for (let x = Math.max(0, cx - R); x < Math.min(w, cx + R); x++) {
      const v = data[y * w + x]; if (v > peakM) { peakM = v; sx = x; sy = y; }
    }
  } else { for (let i = 0; i < data.length; i++) if (data[i] > peakM) { peakM = data[i]; sx = i % w; sy = Math.floor(i / w); } }

  // DEM pixels are square in degrees, not in metres: 1 degree of longitude is shorter.
  const xStretch = 1 / Math.cos(latDeg * Math.PI / 180); // x pixels per y pixel for equal metres
  const { peakX, peakY, rotateDeg } = cfg.placement;
  const rot = (rotateDeg || 0) * Math.PI / 180, cosR = Math.cos(rot), sinR = Math.sin(rot);
  // Largest frame (in y-pixels per grid row) that keeps the whole screen inside the file,
  // so no straight "end of data" edges appear. scale < 1 zooms in further.
  const ar = GW / GH;
  const fitH = Math.min(
    sy / peakY, (h - 1 - sy) / (1 - peakY),
    (sx / xStretch) / (peakX * ar), ((w - 1 - sx) / xStretch) / ((1 - peakX) * ar));
  const pxPerRow = (fitH / GH) * Math.min(1, cfg.placement.scale || 1);
  const vals = new Float64Array(GW * GH);
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
    let dx = (i - peakX * GW) * pxPerRow, dy = (j - peakY * GH) * pxPerRow;
    [dx, dy] = [dx * cosR - dy * sinR, dx * sinR + dy * cosR];
    const u = sx + dx * xStretch, v = sy + dy;
    const u0 = Math.floor(u), v0 = Math.floor(v), fu = u - u0, fv = v - v0;
    const at = (a, b) => data[Math.min(h - 1, Math.max(0, b)) * w + Math.min(w - 1, Math.max(0, a))];
    const val = at(u0, v0) * (1 - fu) * (1 - fv) + at(u0 + 1, v0) * fu * (1 - fv) + at(u0, v0 + 1) * (1 - fu) * fv + at(u0 + 1, v0 + 1) * fu * fv;
    vals[j * GW + i] = Number.isFinite(val) ? val : lo;
  }
  const frameKm = (GW * pxPerRow * Math.abs(geo ? geo.res[1] : 0.0000926) * 111.32).toFixed(1);
  console.log(`summit ${peakM.toFixed(1)} m at pixel ${sx},${sy}; screen covers about ${frameKm} km across`);
  return { vals, unit: 'm', summit: { m: peakM, gx: peakX * GW, gy: peakY * GH }, range: [lo, hi] };
}

// --------------------------------------------------------- path helpers ----
function chaikin(pts, iters) { for (let k = 0; k < iters; k++) { const out = []; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; out.push([0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1], [0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1]); } out.push(out[0]); pts = out; } return pts; }
function simplify(pts, tol) {
  if (pts.length < 4) return pts; const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) { const [a, b] = stack.pop(); let max = 0, idx = -1; const [ax, ay] = pts[a], [bx, by] = pts[b];
    for (let i = a + 1; i < b; i++) { const d = segDist(pts[i][0], pts[i][1], ax, ay, bx, by); if (d > max) { max = d; idx = i; } }
    if (max > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); } }
  return pts.filter((_, i) => keep[i]);
}
const f1 = n => Math.round(n * 10) / 10;

// ----------------------------------------------------------------- main ----
const field = cfg.source === 'dem' ? await demField() : proceduralField();
const { vals } = field;
let lo = Infinity, hi = -Infinity; for (const v of vals) { if (v < lo) lo = v; if (v > hi) hi = v; }

let thresholds, indexEvery;
if (cfg.source === 'dem') {
  const iv = cfg.dem.intervalMeters; indexEvery = cfg.dem.indexEvery;
  const start = Math.ceil(Math.max(cfg.dem.minElevationMeters, field.range[0]) / iv) * iv;
  thresholds = []; for (let t = start; t < hi; t += iv) thresholds.push(t);
} else {
  const c = cfg.contours; indexEvery = c.indexEvery;
  const start = lo + (hi - lo) * c.cutoff, step = (hi - start) / c.count;
  thresholds = Array.from({ length: c.count }, (_, k) => start + k * step);
}

const gen = d3contours().size([GW, GH]).smooth(true).thresholds(thresholds);
const sx = VW / (GW - 1), sy = VH / (GH - 1);
const tMin = thresholds[0], tMax = thresholds[thresholds.length - 1];
const paths = [];
let totalPts = 0;
gen(Array.from(vals)).forEach((mp, k) => {
  let d = '';
  for (const poly of mp.coordinates) for (const ring of poly) {
    // d3-contour closes rings along the grid border. Those border runs would show
    // as straight lines on the frame edge, so split each ring wherever it touches
    // the border and keep only the inner runs (open paths), like a cropped map.
    const onEdge = ([x, y]) => x <= 0.01 || y <= 0.01 || x >= GW - 1.01 || y >= GH - 1.01;
    const runs = []; let cur = [];
    const closed = !ring.some(onEdge);
    for (const p of ring) { if (onEdge(p)) { if (cur.length) { runs.push(cur); cur = []; } } else cur.push(p); }
    if (cur.length) runs.push(cur);
    for (const run of runs) {
      let pts = run.map(([x, y]) => [x * sx, y * sy]);
      if (closed) pts = chaikin(pts, cfg.contours.smoothing || 0);
      pts = simplify(pts, cfg.contours.simplify || 0.5);
      if (pts.length < 3) continue;
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      if (Math.max(...xs) - Math.min(...xs) < 6 && Math.max(...ys) - Math.min(...ys) < 6) continue; // specks
      totalPts += pts.length;
      d += 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L') + (closed ? 'Z' : '');
    }
  }
  if (!d) return;
  const t = (mp.value - tMin) / Math.max(1e-9, tMax - tMin);  // 0 = lowest drawn line, 1 = summit
  const isIndex = (k % indexEvery) === 0;
  const band = t < 0.5 ? 'lo' : 'hi';
  const m = Math.round((t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5) * 100);
  paths.push(`<path class="tp-c tp-${band}${isIndex ? ' tp-i' : ''}" style="--m:${m}%;--k:${k}" pathLength="1" d="${d}"/>`);
});

let label = '';
if (cfg.source === 'dem' && cfg.dem.summitLabelShow && field.summit) {
  const ft = Math.round(field.summit.m * 3.28084).toLocaleString('en-US');
  const x = f1(field.summit.gx * sx), y = f1(field.summit.gy * sy);
  // Summit marker: a pulsing ring + dot, and a label with a paper-coloured halo so it reads over the lines
  label = `<g class="tp-summit" transform="translate(${x} ${y})"><circle class="tp-pulse" r="7"/><circle class="tp-dot" r="5.5"/><text x="16" y="5">${cfg.dem.summitLabel.replace('{ft}', ft)}</text></g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMaxYMin slice" class="tp" data-source="${cfg.source}" aria-hidden="true" focusable="false">
<!-- Generated by tools/terrain/build.mjs (${cfg.source}). Do not edit by hand: change tools/terrain/config.json or the --topo-* variables in css/site.css. -->
<style>
.tp{fill:none;stroke-linejoin:round;stroke-linecap:round}
.tp-c{stroke-width:var(--topo-width,1.1);vector-effect:non-scaling-stroke;stroke:var(--topo-mid,#d9c4e6)}
.tp-lo{stroke:color-mix(in oklab,var(--topo-mid,#d9c4e6) var(--m),var(--topo-low,#bcd3ec))}
.tp-hi{stroke:color-mix(in oklab,var(--topo-high,#f0c8bf) var(--m),var(--topo-mid,#d9c4e6))}
.tp-i{stroke-width:calc(var(--topo-width,1.1) * var(--topo-index-weight,1.9))}
.tp-summit text{fill:var(--topo-label,#2c3e50);font:700 15px/1 Barlow,system-ui,sans-serif;letter-spacing:.16em;paint-order:stroke;stroke:var(--topo-halo,#f4f5f7);stroke-width:7px;stroke-linejoin:round}
.tp-dot{fill:var(--topo-mark,#f15b22);stroke:var(--topo-halo,#f4f5f7);stroke-width:3}
.tp-pulse{fill:none;stroke:var(--topo-mark,#f15b22);stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:tp-pulse 2.8s ease-out infinite}
@keyframes tp-pulse{from{transform:scale(1);opacity:.9}to{transform:scale(4.6);opacity:0}}
@media (prefers-reduced-motion:reduce){.tp-pulse{animation:none;opacity:0}}
</style>
${paths.join('\n')}
${label}
</svg>
`;
const out = path.resolve(here, cfg.output);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(`terrain.svg written: ${paths.length} contour levels, ${totalPts} points, ${(svg.length / 1024).toFixed(0)} KB (source: ${cfg.source})`);
