import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";

type Run = { text: string; weight: Weight; fill: string };
type Weight = 300 | 400 | 500 | 600 | 700;
type Project = {
  title: string;
  summary?: string;
  featured?: boolean;
  image: string;
  tags: string[];
  links?: { icon: string; url: string }[];
};
type Messages = {
  hero: { subtitle: string; title: string; tagline: { text: string; strong?: boolean }[] };
  about: { label: string; title: string; statement: { text: string }[]; facts: { label: string; value: string }[] };
  projects: { title: string; heading: string; items: Project[] };
  contact: { label: string; title: string[]; links: { name: string; href: string }[] };
  readme: {
    status: string;
    stack: { label: string; title: string; groups: { label: string; items: string[] }[] };
    selectedWork: string;
    allRepositories: string;
    portfolio: string;
  };
};

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = join(ROOT, "..");
const MESSAGES = join(REPO, "messages");
const PUBLIC = join(REPO, "public");
const FONTS = join(REPO, "node_modules/geist/dist/fonts");
const SITE_URL = "https://dnowdd.com";
const DEFAULT_LOCALE = "pt-BR";
const GITHUB_URL = "https://github.com/Dnowdd";

const BG = "#0a0a0a";
const CARD = "#0d0d0d";
const LINE = "#1f1f1f";
const TEXT = "#f5f5f5";
const MUTED = "#a3a3a3";
const DIM = "#737373";
const VIOLET = "#8b5cf6";
const VIOLET_SOFT = "#a78bfa";
const AMBER = "#fbbf24";
const EASE = "0.45 0 0.55 1";

const SANS: Record<Weight, string> = {
  300: "geist-sans/Geist-Light.ttf",
  400: "geist-sans/Geist-Regular.ttf",
  500: "geist-sans/Geist-Medium.ttf",
  600: "geist-sans/Geist-SemiBold.ttf",
  700: "geist-sans/Geist-Bold.ttf",
};
const MONO: Partial<Record<Weight, string>> = {
  400: "geist-mono/GeistMono-Regular.ttf",
  500: "geist-mono/GeistMono-Medium.ttf",
};

const fontCache = new Map<string, fontkit.Font>();

function font(weight: Weight, mono: boolean) {
  const file = mono ? (MONO[weight] ?? MONO[400]!) : SANS[weight];
  let loaded = fontCache.get(file);
  if (!loaded) {
    loaded = fontkit.openSync(join(FONTS, file)) as fontkit.Font;
    fontCache.set(file, loaded);
  }
  return loaded;
}

const round = (d: string) =>
  d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function measure(text: string, size: number, weight: Weight = 400, mono = false, spacing = 0) {
  const f = font(weight, mono);
  const run = f.layout(text);
  return (run.advanceWidth * size) / f.unitsPerEm + spacing * Math.max(0, run.glyphs.length - 1);
}

function runsToPaths(runs: Run[], x: number, y: number, size: number, mono = false, spacing = 0, anchor: "start" | "middle" | "end" = "start") {
  const total =
    runs.reduce((sum, r) => sum + measure(r.text, size, r.weight, mono, spacing), 0) +
    spacing * Math.max(0, runs.length - 1);
  let cursor = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  const paths: string[] = [];
  for (const r of runs) {
    const f = font(r.weight, mono);
    const k = size / f.unitsPerEm;
    const layout = f.layout(r.text);
    let d = "";
    let pen = 0;
    layout.glyphs.forEach((glyph, i) => {
      const pos = layout.positions[i];
      const gx = cursor + (pen + pos.xOffset) * k;
      d += glyph.path.scale(k, -k).translate(gx, y - pos.yOffset * k).toSVG();
      pen += pos.xAdvance;
      cursor += spacing;
    });
    cursor += pen * k;
    if (d) paths.push(`<path fill="${r.fill}" d="${round(d)}"/>`);
  }
  return { svg: paths.join(""), width: total };
}

type TextOpts = { weight?: Weight; fill?: string; mono?: boolean; spacing?: number; anchor?: "start" | "middle" | "end"; reveal?: number };

function text(value: string, x: number, y: number, size: number, opts: TextOpts = {}) {
  const { weight = 400, fill = TEXT, mono = false, spacing = 0, anchor = "start", reveal } = opts;
  const content = mono ? value.toUpperCase() : value;
  const { svg } = runsToPaths([{ text: content, weight, fill }], x, y, size, mono, spacing, anchor);
  return group(svg, reveal);
}

const group = (content: string, reveal?: number) =>
  reveal === undefined
    ? `<g>${content}</g>`
    : `<g class="up" style="animation-delay:${reveal}s">${content}</g>`;

function wrapRuns(runs: Run[], size: number, maxWidth: number) {
  const words = runs.flatMap((r) =>
    r.text.split(/(\s+)/).filter(Boolean).map((t) => ({ ...r, text: t })),
  );
  const lines: Run[][] = [[]];
  let width = 0;
  for (const word of words) {
    const w = measure(word.text, size, word.weight);
    const isSpace = !word.text.trim();
    if (!isSpace && width + w > maxWidth && width > 0) {
      lines.push([]);
      width = 0;
    }
    if (isSpace && width === 0) continue;
    lines[lines.length - 1].push(word);
    width += w;
  }
  return lines.map((line) => {
    while (line.length && !line[line.length - 1].text.trim()) line.pop();
    return line.reduce<Run[]>((merged, r) => {
      const last = merged[merged.length - 1];
      if (last && last.weight === r.weight && last.fill === r.fill) last.text += r.text;
      else merged.push({ ...r });
      return merged;
    }, []);
  });
}

function svgDoc(w: number, h: number, body: string, title: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img">
<title>${escapeXml(title)}</title>
<style>
.up{animation:up .9s cubic-bezier(.22,1,.36,1) both}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
${body}
</svg>
`;
}

const clip = (w: number, h: number) => `<clipPath id="c"><rect width="${w}" height="${h}" rx="20"/></clipPath>`;
const border = (w: number, h: number) => `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="20" stroke="${LINE}"/>`;
const card = (w: number, h: number) => `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="20" fill="${CARD}" stroke="${LINE}"/>`;
const arrow = (x: number, y: number, size: number, color: string, opacity = 1) =>
  `<path d="M${x} ${y + size}l${size} -${size}m-${size * 0.75} 0h${size * 0.75}v${size * 0.75}" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;

function waves(w: number, h: number, { lines = 34, dur = 18, glow = true, amp = 1, seed = 0 } = {}) {
  const frames = 4;
  const paths: string[] = [];
  for (let i = 0; i < lines; i++) {
    const t = i / (lines - 1);
    const y0 = -40 + (h + 80) * t ** 1.35;
    const depth = 0.35 + 0.65 * t;
    const frameData: string[] = [];
    for (let f = 0; f <= frames; f++) {
      const ph = (2 * Math.PI * f) / frames;
      const pts: [number, number][] = [];
      for (let x = 0; x <= w + 40; x += 40) {
        const y =
          y0 +
          amp * depth * 26 * Math.sin(x / 210 + i * 0.32 + ph + seed) +
          amp * depth * 14 * Math.sin(x / 97 - i * 0.18 - ph * 2 + seed * 1.7) +
          amp * (1 - t) * 70 * Math.exp(-(((x - w * 0.85) / (w * 0.3)) ** 2));
        pts.push([x, y]);
      }
      let d = `M${pts[0][0]} ${pts[0][1].toFixed(1)}`;
      for (let p = 0; p < pts.length - 1; p++) {
        const [x1, y1] = pts[p];
        const [x2, y2] = pts[p + 1];
        d += `Q${x1} ${y1.toFixed(1)} ${((x1 + x2) / 2).toFixed(0)} ${((y1 + y2) / 2).toFixed(1)}`;
      }
      frameData.push(d);
    }
    const hot = glow && t > 0.04 && t < 0.3;
    const opacity = Math.max(hot ? 1.05 - t * 2.4 : 0.16 + 0.26 * (1 - t), 0.12);
    paths.push(
      `<path d="${frameData[0]}" stroke="${hot ? "url(#hot)" : VIOLET}" stroke-width="${hot ? 1.4 : 0.9}" opacity="${opacity.toFixed(2)}">` +
        `<animate attributeName="d" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines="${Array(frames).fill(EASE).join(";")}" values="${frameData.join(";")}"/></path>`,
    );
  }
  return `<defs>
<linearGradient id="hot" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse"><stop offset=".35" stop-color="${VIOLET}" stop-opacity="0"/><stop offset=".8" stop-color="${VIOLET_SOFT}"/><stop offset="1" stop-color="${VIOLET}" stop-opacity=".4"/></linearGradient>
<radialGradient id="vig" cx=".3" cy=".55" r=".75"><stop offset="0" stop-color="${BG}" stop-opacity=".8"/><stop offset=".55" stop-color="${BG}" stop-opacity=".2"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></radialGradient>
</defs><g>${paths.join("")}</g>`;
}

function header(m: Messages, siteLabel: string) {
  const w = 1200;
  const taglineRuns: Run[] = m.hero.tagline.map((p) => ({ text: p.text, weight: p.strong ? 500 : 300, fill: p.strong ? TEXT : MUTED }));
  const lines = wrapRuns(taglineRuns, 22, 620);
  const h = 400 + lines.length * 32;
  const tagline = lines
    .map((line, i) => group(runsToPaths(line, 96, 352 + i * 32, 22).svg, 0.35 + i * 0.07))
    .join("");
  const status = m.readme.status.toUpperCase();
  const dotX = w - 96 - measure(status, 11, 400, true, 2.4) - 14;
  const body = `<defs>${clip(w, h)}</defs>
<g clip-path="url(#c)">
<rect width="${w}" height="${h}" fill="${BG}"/>
${waves(w, h)}
<rect width="${w}" height="${h}" fill="url(#vig)"/>
${text(m.hero.subtitle, 96, 178, 44, { weight: 300, fill: MUTED, reveal: 0.05 })}
${text(m.hero.title, 90, 292, 136, { weight: 700, spacing: -3, reveal: 0.15 })}
${tagline}
<g class="up" style="animation-delay:.9s">
<circle cx="${dotX.toFixed(1)}" cy="${h - 44}" r="3.5" fill="#22c55e"><animate attributeName="opacity" values="1;.25;1" dur="2.4s" repeatCount="indefinite"/></circle>
${text(status, w - 96, h - 40, 11, { fill: DIM, mono: true, spacing: 2.4, anchor: "end" })}
${text(siteLabel, 96, h - 40, 11, { fill: DIM, mono: true, spacing: 2.4 })}
</g>
</g>
${border(w, h)}`;
  return svgDoc(w, h, body, `${m.hero.title} ${m.hero.subtitle.replace(",", "")}`);
}

function section(index: string, label: string, title: string, light: boolean) {
  const w = 1200;
  const h = 150;
  const [fg, sub] = light ? ["#0a0a0a", "#6b6b6b"] : [TEXT, DIM];
  const titleWidth = measure(title, 68, 700, false, -2.5);
  const body = `<g class="up">
${text(index, 2, 40, 13, { fill: sub, mono: true, spacing: 4 })}
<line x1="40" y1="35.5" x2="88" y2="35.5" stroke="${sub}"/>
${text(label, 104, 40, 13, { fill: sub, mono: true, spacing: 4 })}
</g>
<g class="up" style="animation-delay:.12s">
${text(title, 0, 122, 68, { weight: 700, fill: fg, spacing: -2.5 })}
<circle cx="${(titleWidth + 10).toFixed(1)}" cy="115" r="6" fill="${VIOLET}"/>
</g>`;
  return svgDoc(w, h, body, `${index} — ${label}: ${title}`);
}

function facts(m: Messages) {
  const w = 1200;
  const h = 130;
  const items = m.about.facts;
  const cw = w / items.length;
  const cells = items.map((fact, i) => {
    const x = i * cw + 32;
    let size = 22;
    while (size > 14 && measure(fact.value, size, 600, false, -0.4) > cw - 56) size -= 1;
    const sep = i ? `<line x1="${Math.round(i * cw)}.5" y1="28" x2="${Math.round(i * cw)}.5" y2="${h - 28}" stroke="${LINE}"/>` : "";
    return `${sep}<g class="up" style="animation-delay:${(0.08 * i).toFixed(2)}s">${text(fact.label, x, 54, 11, { fill: DIM, mono: true, spacing: 2.4 })}${text(fact.value, x, 90, size, { weight: 600, spacing: -0.4 })}</g>`;
  });
  return svgDoc(w, h, `${card(w, h)}${cells.join("")}`, items.map((f) => `${f.label}: ${f.value}`).join(" · "));
}

function stack(m: Messages) {
  const w = 1200;
  const rowH = 64;
  const pad = 40;
  const groups = m.readme.stack.groups;
  const h = pad * 2 + rowH * groups.length - 16;
  const rows: string[] = [];
  let n = 0;
  groups.forEach((g, r) => {
    const y = pad + r * rowH;
    rows.push(text(g.label, 40, y + 25, 11, { fill: DIM, mono: true, spacing: 2.4, reveal: 0.05 * r }));
    let x = 250;
    for (const item of g.items) {
      const cw = measure(item, 15) + 50;
      rows.push(
        `<g class="up" style="animation-delay:${(0.15 + 0.025 * n).toFixed(3)}s">` +
          `<rect x="${x.toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="40" rx="20" fill="#141414" stroke="${LINE}"/>` +
          `<circle cx="${(x + 20).toFixed(1)}" cy="${y + 20}" r="3" fill="${VIOLET}"/>` +
          `${text(item, x + 33, y + 25.5, 15, { fill: "#e5e5e5" })}</g>`,
      );
      x += cw + 10;
      n++;
    }
    if (r < groups.length - 1) rows.push(`<line x1="40" y1="${y + rowH - 8}.5" x2="${w - 40}" y2="${y + rowH - 8}.5" stroke="#161616"/>`);
  });
  return svgDoc(w, h, `${card(w, h)}${rows.join("")}`, groups.map((g) => `${g.label}: ${g.items.join(", ")}`).join(". "));
}

function wrapText(value: string, size: number, weight: Weight, maxWidth: number) {
  return wrapRuns([{ text: value, weight, fill: MUTED }], size, maxWidth).map((line) => line.map((r) => r.text).join(""));
}

function imageSize(file: string): [number, number] {
  const buf = readFileSync(file);
  if (buf.toString("ascii", 12, 16) === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (buf.toString("ascii", 12, 16) === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  if (buf.toString("ascii", 12, 16) === "VP8X") return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  return [16, 9];
}

const mimeOf = (file: string) =>
  file.endsWith(".webp") ? "image/webp" : file.endsWith(".png") ? "image/png" : "image/jpeg";

function project(p: Project, index: number, eyebrow: string) {
  const w = 580;
  const h = 520;
  const ih = 300;
  const file = join(PUBLIC, p.image);
  const [iw, ihSrc] = imageSize(file);
  const shotW = w - 80;
  const mobile = ihSrc > iw;
  const imgW = mobile ? 150 : shotW;
  const imgX = mobile ? (w - imgW) / 2 : 40;
  const imgH = (imgW * ihSrc) / iw;
  const summary = wrapText(p.summary ?? "", 15, 300, w - 64).slice(0, 3);
  let x = 32;
  const chips = p.tags.slice(0, 4).map((tag) => {
    const cw = measure(tag.toUpperCase(), 11, 400, true, 0.8) + 26;
    const chip = `<rect x="${x.toFixed(1)}" y="${h - 58}" width="${cw.toFixed(1)}" height="26" rx="13" stroke="#2a2a2a"/>${text(tag, x + 13, h - 41, 11, { fill: MUTED, mono: true, spacing: 0.8 })}`;
    x += cw + 8;
    return chip;
  });
  const data = readFileSync(file).toString("base64");
  const body = `<defs>${clip(w, h)}
<radialGradient id="glow" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="${VIOLET}" stop-opacity=".38"/><stop offset=".7" stop-color="${VIOLET}" stop-opacity=".04"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient>
<clipPath id="shot"><rect x="${imgX}" y="40" width="${imgW}" height="${ih}" rx="${mobile ? 18 : 10}"/></clipPath>
<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#ffffff" stroke-opacity=".035"/></pattern>
</defs>
<g clip-path="url(#c)">
<rect width="${w}" height="${h}" fill="${CARD}"/>
<rect width="${w}" height="${ih}" fill="#0b0b0f"/>
<rect width="${w}" height="${ih}" fill="url(#grid)"/>
<rect width="${w}" height="${ih}" fill="url(#glow)"/>
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="${EASE};${EASE}"/>
<g clip-path="url(#shot)"><image href="data:${mimeOf(file)};base64,${data}" x="${imgX}" y="40" width="${imgW}" height="${imgH.toFixed(0)}" preserveAspectRatio="xMidYMin slice"/></g>
<rect x="${imgX + 0.5}" y="40.5" width="${imgW - 1}" height="${ih}" rx="${mobile ? 18 : 10}" stroke="#ffffff" stroke-opacity=".12"/></g>
<rect y="${ih}" width="${w}" height="${h - ih}" fill="${CARD}"/>
<line x1="0" y1="${ih}.5" x2="${w}" y2="${ih}.5" stroke="${LINE}"/>
${text(`${String(index).padStart(2, "0")} · ${eyebrow}`, 32, ih + 40, 11, { fill: VIOLET_SOFT, mono: true, spacing: 2.4 })}
${text(p.title, 32, ih + 76, 28, { weight: 700, spacing: -0.8 })}
${arrow(w - 48, ih + 58, 12, DIM)}
${summary.map((line, i) => text(line, 32, ih + 106 + i * 23, 15, { weight: 300, fill: MUTED })).join("")}
${chips.join("")}
</g>
${border(w, h)}`;
  return svgDoc(w, h, body, `${p.title} — ${p.summary ?? ""}`);
}

function contact(m: Messages, email: string) {
  const w = 1200;
  const h = 360;
  const [first, second = ""] = m.contact.title;
  const secondWidth = measure(second, 84, 700, false, -2.5);
  const lx = w - 210;
  const body = `<defs>${clip(w, h)}</defs>
<g clip-path="url(#c)">
<rect width="${w}" height="${h}" fill="${BG}"/>
<g transform="translate(0 ${h}) scale(1 -1)">${waves(w, h, { lines: 22, dur: 22, glow: false, amp: 0.7, seed: 2.1 })}</g>
<rect width="${w}" height="${h}" fill="url(#vig)"/>
${text(`04 — ${m.contact.label}`, 96, 96, 12, { fill: DIM, mono: true, spacing: 4, reveal: 0 })}
${text(first, 92, 196, 84, { weight: 300, fill: MUTED, spacing: -2.5, reveal: 0.1 })}
<g class="up" style="animation-delay:.2s">
${text(second, 92, 276, 84, { weight: 700, spacing: -2.5 })}
<rect x="${(92 + secondWidth + 10).toFixed(1)}" y="266" width="34" height="8" fill="${AMBER}"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1.1s" repeatCount="indefinite"/></rect>
</g>
<g class="up" style="animation-delay:.5s">
<circle cx="${lx}" cy="170" r="70" fill="${AMBER}" opacity=".06"><animate attributeName="r" values="58;80;58" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="${lx}" cy="170" r="32" fill="${AMBER}" opacity=".1"/>
<circle cx="${lx}" cy="170" r="7" fill="${AMBER}"><animate attributeName="opacity" values="1;.55;1" dur="5s" repeatCount="indefinite"/></circle>
${text(email, lx, 284, 12, { fill: MUTED, spacing: 0.4, anchor: "middle" })}
</g>
</g>
${border(w, h)}`;
  return svgDoc(w, h, body, `${m.contact.title.join(" ")} — ${email}`);
}

function button(label: string, primary = false) {
  const size = 13;
  const spacing = 1.6;
  const w = Math.round(measure(label.toUpperCase(), size, 500, true, spacing) + 76);
  const h = 44;
  const [fill, stroke, color] = primary ? [TEXT, TEXT, BG] : [CARD, "#2a2a2a", "#e5e5e5"];
  const body = `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${h / 2 - 0.5}" fill="${fill}" stroke="${stroke}"/>
${text(label, 24, 27, size, { weight: 500, fill: color, mono: true, spacing })}
${arrow(w - 30, h / 2 - 4.5, 9, color, 0.7)}`;
  return svgDoc(w, h, body, label);
}

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function build(locale: string, outDir: string) {
  const m = JSON.parse(readFileSync(join(MESSAGES, `${locale}.json`), "utf8")) as Messages;
  const siteUrl = locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}/${locale}`;
  const siteLabel = siteUrl.replace("https://", "");
  const projectsUrl = `${siteUrl}#projetos`;
  const emailLink = m.contact.links.find((l) => l.href.startsWith("mailto:"));
  const email = emailLink?.href.replace("mailto:", "") ?? "";
  const featured = m.projects.items.filter((p) => p.featured);
  const external = m.contact.links.filter((l) => !l.href.includes("github.com"));

  rmSync(outDir, { recursive: true, force: true });
  const assets = join(outDir, "assets");
  mkdirSync(assets, { recursive: true });

  const sections = [
    { key: "about", index: "01", label: m.about.label, title: m.about.title },
    { key: "stack", index: "02", label: m.readme.stack.label, title: m.readme.stack.title },
    { key: "work", index: "03", label: m.projects.title, title: m.projects.heading },
  ];

  const files: Record<string, string> = {
    "header.svg": header(m, siteLabel),
    "facts.svg": facts(m),
    "stack.svg": stack(m),
    "contact.svg": contact(m, email),
    "btn-portfolio.svg": button(m.readme.portfolio, true),
    "btn-all-repositories.svg": button(m.readme.allRepositories),
  };
  for (const s of sections) {
    files[`section-${s.key}.svg`] = section(s.index, s.label, s.title, false);
    files[`section-${s.key}-light.svg`] = section(s.index, s.label, s.title, true);
  }
  featured.forEach((p, i) => {
    files[`project-${i + 1}.svg`] = project(p, i + 1, m.readme.selectedWork);
  });
  const linkButtons = external.map((l) => {
    const file = `btn-${slug(l.name)}.svg`;
    files[file] = button(l.name);
    const href = l.href.startsWith("/") ? `${SITE_URL}${l.href}` : l.href;
    return `  <a href="${href}"><img src="assets/${file}" alt="${escapeXml(l.name)}" /></a>`;
  });

  for (const [name, content] of Object.entries(files)) writeFileSync(join(assets, name), content);

  const sectionImg = (key: string) => {
    const s = sections.find((x) => x.key === key)!;
    return `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/section-${key}.svg" />
  <img src="assets/section-${key}-light.svg" width="100%" alt="${s.index} — ${escapeXml(s.label)}: ${escapeXml(s.title)}" />
</picture>`;
  };

  const projectCards = featured.map((p, i) => {
    const repo = p.links?.find((l) => l.icon === "Github")?.url;
    return `  <a href="${repo ?? projectsUrl}"><img src="assets/project-${i + 1}.svg" width="49%" alt="${escapeXml(`${p.title} — ${p.summary ?? ""}`)}" /></a>`;
  });
  const projectRows: string[] = [];
  for (let i = 0; i < projectCards.length; i += 2) projectRows.push(`<p>\n${projectCards.slice(i, i + 2).join("\n")}\n</p>`);

  const statement = m.about.statement.map((s) => s.text).join(" ").replace(/\s+([.,;:!?])/g, "$1");
  const tagline = m.hero.tagline.map((p) => p.text).join("");

  const readme = `<a href="${siteUrl}">
  <img src="assets/header.svg" width="100%" alt="${escapeXml(`${m.hero.title} ${m.hero.subtitle.replace(",", "")} — ${tagline}`)}" />
</a>

<br />

${sectionImg("about")}

${statement}

<img src="assets/facts.svg" width="100%" alt="${escapeXml(m.about.facts.map((f) => `${f.label}: ${f.value}`).join(" · "))}" />

<br />

${sectionImg("stack")}

<img src="assets/stack.svg" width="100%" alt="${escapeXml(m.readme.stack.groups.map((g) => `${g.label}: ${g.items.join(", ")}`).join(". "))}" />

<br />

${sectionImg("work")}

${projectRows.join("\n")}

<p align="center">
  <a href="${GITHUB_URL}?tab=repositories"><img src="assets/btn-all-repositories.svg" alt="${escapeXml(m.readme.allRepositories)}" /></a>
</p>

<br />

<a href="mailto:${email}">
  <img src="assets/contact.svg" width="100%" alt="${escapeXml(`${m.contact.title.join(" ")} — ${email}`)}" />
</a>

<p align="center">
  <a href="${siteUrl}"><img src="assets/btn-portfolio.svg" alt="${escapeXml(m.readme.portfolio)}" /></a>
${linkButtons.join("\n")}
</p>
`;
  writeFileSync(join(outDir, "README.md"), readme);
  return Object.keys(files).length;
}

async function pickLocales(available: string[]) {
  const arg = process.argv.slice(2);
  const flag = arg.findIndex((a) => a === "--lang" || a === "-l");
  const requested = flag >= 0 ? arg[flag + 1] : arg.find((a) => a.startsWith("--lang="))?.split("=")[1];
  if (arg.includes("--all") || requested === "all") return available;
  if (requested) {
    if (!available.includes(requested)) throw new Error(`Unknown language "${requested}". Available: ${available.join(", ")}`);
    return [requested];
  }
  if (!process.stdin.isTTY) throw new Error(`Pass --lang <code> or --all. Available: ${available.join(", ")}`);

  console.log("\nAvailable languages:\n");
  available.forEach((code, i) => console.log(`  ${i + 1}) ${code}${code === DEFAULT_LOCALE ? "  (default)" : ""}`));
  console.log(`  ${available.length + 1}) all\n`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`Choose a language [1-${available.length + 1}]: `)).trim();
  rl.close();
  const choice = Number(answer);
  if (choice === available.length + 1 || answer === "all") return available;
  const picked = available[choice - 1] ?? available.find((code) => code === answer);
  if (!picked) throw new Error(`Invalid choice "${answer}".`);
  return [picked];
}

async function main() {
  const available = readdirSync(MESSAGES)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort((a, b) => (a === DEFAULT_LOCALE ? -1 : b === DEFAULT_LOCALE ? 1 : a.localeCompare(b)));

  const locales = await pickLocales(available);
  for (const locale of locales) {
    const out = join(ROOT, "dist", locale);
    const count = build(locale, out);
    console.log(`✓ ${locale}: README.md + ${count} assets → ${out}`);
  }
}

main().catch((error: unknown) => {
  console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
