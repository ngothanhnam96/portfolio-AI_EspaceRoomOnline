// Đà Nẵng — hotel room 1013 by the Hàn river at night. Through the glass the
// golden Dragon Bridge arches over the water (and breathes fire when you escape),
// with the Sơn Trà ridge and city lights beyond.

import { door, glow, hot, plant, scene, stars } from "./kit.js";

const P = "dn";
const SANS = "Segoe UI, system-ui, sans-serif";

const defs = `
  <linearGradient id="${P}-wall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#33476b"/><stop offset="1" stop-color="#202d47"/>
  </linearGradient>
  <linearGradient id="${P}-sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#070d26"/><stop offset="0.6" stop-color="#1b2a58"/><stop offset="1" stop-color="#3d3a72"/>
  </linearGradient>
  <linearGradient id="${P}-river" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1c2f5e"/><stop offset="1" stop-color="#081430"/>
  </linearGradient>
  <linearGradient id="${P}-gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#e09a1f"/>
  </linearGradient>
  <linearGradient id="${P}-marble" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8ecef"/><stop offset="1" stop-color="#9aa6b0"/>
  </linearGradient>
  <linearGradient id="${P}-veneer" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#c79b6d"/><stop offset="0.5" stop-color="#d9b083"/><stop offset="1" stop-color="#b98a5c"/>
  </linearGradient>
  <linearGradient id="${P}-flame" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff3b0"/><stop offset="0.4" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff4d1f" stop-opacity="0"/>
  </linearGradient>
  <filter id="${P}-neon" x="-20%" y="-50%" width="140%" height="200%">
    <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="${P}-carpet" width="60" height="40" patternUnits="userSpaceOnUse">
    <rect width="60" height="40" fill="#2a2f4a"/><path d="M30 4 L52 20 L30 36 L8 20 Z" fill="none" stroke="#3a4166" stroke-width="2"/>
  </pattern>
  <clipPath id="${P}-view"><rect x="180" y="0" width="1100" height="720"/></clipPath>`;

// The dragon's body: a run of arches resting on the bridge deck.
const BODY = "M470 452 C 500 452 510 380 560 380 C 610 380 620 452 660 452 C 700 452 710 372 760 372 C 810 372 820 452 860 452 C 900 452 910 386 955 386 C 1000 386 1010 452 1046 450 C 1066 448 1080 430 1072 414 C 1064 400 1046 410 1054 424";

const night = `
  <g clip-path="url(#${P}-view)">
    <rect x="180" y="0" width="1100" height="720" fill="url(#${P}-sky)"/>
    ${stars(180, 0, 1100, 340, 120, 9)}
    <circle cx="980" cy="160" r="20" fill="#f6f1d5"/><circle cx="988" cy="154" r="18" fill="#0f1a40"/>
    <path d="M840 430 Q 920 330 1000 360 Q 1050 340 1088 380 L1088 440 L 840 440 Z" fill="#141f3d"/>
    <g fill="#0f1730"><rect x="250" y="392" width="56" height="58"/><rect x="310" y="372" width="40" height="78"/><rect x="1100" y="404" width="60" height="46"/><rect x="1160" y="384" width="50" height="66"/>
      ${[[372, 400, 40, 50], [412, 380, 30, 70], [446, 410, 46, 40], [496, 370, 34, 80], [534, 398, 52, 52], [592, 386, 30, 64], [626, 404, 60, 46], [690, 376, 36, 74], [730, 396, 50, 54], [784, 384, 40, 66]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("")}
    </g>
    <g fill="#ffd98a">${Array.from({ length: 46 }, (_, i) => `<rect x="${380 + ((i * 37) % 440)}" y="${388 + ((i * 23) % 56)}" width="5" height="6" opacity="${0.4 + ((i * 7) % 6) / 10}"/>`).join("")}</g>
    <rect x="180" y="448" width="1100" height="272" fill="url(#${P}-river)"/>
    <g opacity="0.7" stroke-linecap="round">
      ${[[420, "#ffd27a"], [520, "#ff7ab6"], [610, "#ffd27a"], [700, "#7ad7ff"], [780, "#ffd27a"], [900, "#b98bff"], [990, "#ffd27a"]].map(([x, c], i) => `<line class="ripple" style="animation-delay:${i * 0.3}s" x1="${x}" y1="${490 + (i % 3) * 18}" x2="${x}" y2="${560 + (i % 2) * 40}" stroke="${c}" stroke-width="4" stroke-dasharray="6 9"/>`).join("")}
    </g>
    <g>
      <rect x="180" y="456" width="1100" height="14" fill="#2b3554"/>
      <rect x="180" y="454" width="1100" height="4" fill="#ffd98a" opacity="0.6"/>
      ${[440, 547, 727, 903, 999].map((x) => `<rect x="${x - 7}" y="470" width="14" height="60" fill="#2b3554"/>`).join("")}
      <g class="dragon" transform="translate(430 0) scale(0.9 1) translate(-384 0)">
      <path d="${BODY}" fill="none" stroke="#7a4d10" stroke-width="20" stroke-linecap="round"/>
      <path d="${BODY}" fill="none" stroke="url(#${P}-gold)" stroke-width="14" stroke-linecap="round" filter="url(#${P}-neon)"/>
      <path d="${BODY}" fill="none" stroke="#fff6c8" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>
      <g class="dragon-head" filter="url(#${P}-neon)">
        <path d="M470 452 C 448 452 440 420 448 396 C 452 380 444 366 430 360" fill="none" stroke="url(#${P}-gold)" stroke-width="14" stroke-linecap="round"/>
        <path d="M434 350 L 392 352 L 384 362 L 404 368 L 392 378 L 430 376 Q 446 372 442 356 Z" fill="url(#${P}-gold)"/>
        <path d="M432 350 L 446 330 L 440 352 M440 352 L 458 340 L 446 358" fill="none" stroke="#ffe58a" stroke-width="4" stroke-linecap="round"/>
        <circle cx="420" cy="358" r="3" fill="#7a1d00"/>
      </g>
      <g class="celebrate fire">
        <path d="M392 360 Q 340 340 300 362 Q 340 356 372 372 Q 330 380 296 410 Q 350 390 394 368 Z" fill="url(#${P}-flame)"/>
        <circle cx="372" cy="364" r="30" fill="#ffcf5a" opacity="0.6" filter="url(#${P}-soft)"/>
      </g>
      </g>
    </g>
    <g opacity="0.35" transform="translate(430 0) scale(0.9 1) translate(-384 0)">
      <path d="M470 470 C 500 470 510 540 560 540 C 610 540 620 470 660 470 C 700 470 710 548 760 548 C 810 548 820 470 860 470" fill="none" stroke="#ffd27a" stroke-width="8"/>
    </g>
  </g>`;

const windowFrame = `
  <rect x="362" y="90" width="736" height="550" fill="none" stroke="#11151f" stroke-width="16"/>
  <line x1="610" y1="96" x2="610" y2="634" stroke="#11151f" stroke-width="8"/>
  <line x1="850" y1="96" x2="850" y2="634" stroke="#11151f" stroke-width="8"/>
  <path d="M300 80 Q 330 300 312 660 L 370 660 Q 384 300 370 80 Z" fill="#e8e4f5" opacity="0.28"/>
  <path d="M330 80 Q 350 360 338 660" fill="none" stroke="#fff" stroke-width="2" opacity="0.25"/>
  <path d="M1094 80 Q 1112 320 1100 660 L 1158 660 Q 1170 320 1152 80 Z" fill="#7b2d3a"/>
  <path d="M1120 80 Q 1134 340 1124 660" fill="none" stroke="#5a1f2a" stroke-width="5"/>
  <rect x="340" y="634" width="780" height="22" fill="#d7d9de"/>
  <rect x="290" y="70" width="880" height="12" rx="4" fill="#11151f"/>`;

const brochure = hot("brochure", "Tờ rơi trên bậu cửa sổ", `
  <g transform="translate(940 588)" filter="url(#${P}-shadow)">
    <path d="M-40 46 L-36 -4 L0 -10 L4 44 Z" fill="#fefcf4"/>
    <path d="M4 44 L0 -10 L36 -2 L40 48 Z" fill="#f1ecdf"/>
    <path d="M-30 8 q 10 -14 20 -2 q 8 10 18 -4" fill="none" stroke="#e09a1f" stroke-width="4" stroke-linecap="round"/>
    <path d="M-34 4 q -10 -8 -16 4" fill="none" stroke="#ff6b2e" stroke-width="3"/>
    <path d="M10 10 h22 M10 18 h18 M10 26 h22" stroke="#9aa6b0" stroke-width="2.5"/>
    <text x="-18" y="36" font-size="11" font-weight="800" fill="#c0392b" text-anchor="middle" font-family="${SANS}">21:00</text>
  </g>`, [968, 574]);

const desk = `
  <g filter="url(#${P}-shadow)">
    <rect x="80" y="566" width="270" height="22" rx="4" fill="#d9b083"/>
    <rect x="92" y="588" width="18" height="170" fill="#8a6440"/><rect x="320" y="588" width="18" height="170" fill="#8a6440"/>
    <rect x="200" y="588" width="138" height="70" fill="#b98a5c"/><circle cx="270" cy="622" r="5" fill="#5a3a20"/>
  </g>`;

const mountains = hot("mountains", "Mô hình Ngũ Hành Sơn", `
  <g filter="url(#${P}-shadow)">
    <rect x="112" y="548" width="206" height="20" rx="4" fill="#5d4a3a"/>
    <path d="M120 548 L 146 486 L 168 548 Z" fill="url(#${P}-marble)"/>
    <path d="M150 548 L 186 456 L 222 548 Z" fill="url(#${P}-marble)"/>
    <path d="M206 548 L 236 494 L 262 548 Z" fill="url(#${P}-marble)"/>
    <path d="M244 548 L 270 470 L 298 548 Z" fill="url(#${P}-marble)"/>
    <path d="M280 548 L 296 508 L 312 548 Z" fill="url(#${P}-marble)"/>
    <g fill="#5f8f5a" opacity="0.8"><circle cx="180" cy="490" r="7"/><circle cx="196" cy="508" r="6"/><circle cx="266" cy="500" r="6"/><circle cx="232" cy="512" r="5"/></g>
    <path d="M186 456 L 176 500 M270 470 L 262 520" stroke="#fff" stroke-width="2" opacity="0.6"/>
    <rect x="200" y="530" width="20" height="14" fill="#c0392b"/><path d="M196 532 l14 -8 l14 8" fill="#8e2b20"/>
  </g>`, [312, 470]);

const plaque = hot("plaque", "Tấm biển đồng kỷ niệm", `
  <g filter="url(#${P}-shadow)">
    <rect x="104" y="196" width="210" height="136" rx="10" fill="url(#${P}-brass)"/>
    <rect x="116" y="208" width="186" height="112" rx="6" fill="none" stroke="#7e5a1e" stroke-width="2"/>
    <path d="M132 250 C 150 250 152 226 170 226 C 188 226 190 250 206 250 C 222 250 224 228 240 228 C 256 228 258 250 276 250" fill="none" stroke="#6b4a14" stroke-width="5" stroke-linecap="round"/>
    <path d="M132 250 q -10 -6 -6 -16" fill="none" stroke="#6b4a14" stroke-width="4"/>
    <g transform="translate(176 270)">
      <rect x="-4" y="-4" width="74" height="36" rx="5" fill="#3a2508"/>
      ${[0, 1, 2].map((i) => `<rect x="${i * 23}" y="0" width="19" height="28" rx="3" fill="#f5e3b5"/><text x="${i * 23 + 9.5}" y="20" font-size="15" font-weight="800" text-anchor="middle" fill="#3a2508" font-family="${SANS}">?</text>`).join("")}
    </g>
  </g>`, [314, 200]);

const sideTable = `
  <g filter="url(#${P}-shadow)">
    <rect x="1166" y="590" width="130" height="18" rx="4" fill="#d9b083"/>
    <rect x="1176" y="608" width="110" height="140" rx="4" fill="#b98a5c"/>
    <rect x="1186" y="630" width="90" height="44" rx="3" fill="#a87a4e"/><circle cx="1231" cy="652" r="4" fill="#5a3a20"/>
  </g>
  <g>
    <rect x="1250" y="520" width="8" height="70" fill="#c9973f"/>
    <path d="M1222 470 L1286 470 L1276 522 L1232 522 Z" fill="#f4e6c8"/>
    ${glow(P, 1254, 500, 90, "#ffd98a", 0.55)}
  </g>`;

const postcard = hot("postcard", "Bưu thiếp trên tủ đầu giường", `
  <g transform="translate(1200 574) rotate(-8)" filter="url(#${P}-shadow)">
    <rect x="-36" y="-26" width="72" height="50" fill="#fffaf0"/>
    <rect x="-31" y="-21" width="62" height="34" fill="#7fb7d6"/>
    <path d="M-31 13 L-31 0 Q -10 -18 10 -4 Q 22 2 31 -6 L31 13 Z" fill="#4f8a5a"/>
    <path d="M-26 -2 Q 0 -14 26 -4" fill="none" stroke="#f1c40f" stroke-width="4"/>
    <path d="M-8 -6 q -4 8 2 12 M8 -8 q 4 8 -2 12" fill="none" stroke="#9aa6b0" stroke-width="4" stroke-linecap="round"/>
  </g>`, [1236, 548]);

const frames = hot("frames", "Bốn khung ảnh treo lệch", `
  <g filter="url(#${P}-shadow)">
    ${[
      [1150, 156, -5, "#2e5c8a", "M10 52 q 30 -24 60 0"],
      [1234, 168, 6, "#1b2a58", "M8 40 h64 M20 40 v-20 M60 40 v-20 M20 22 l20 -10 l20 10"],
      [1146, 270, 4, "#3a2a5c", "M8 46 c 10 0 12 -20 22 -20 c 10 0 12 20 22 20 c 10 0 12 -18 20 -18"],
      [1232, 284, -6, "#5f8fb5", "M8 44 q 32 -18 64 0 M26 44 v10 M54 44 v10"],
    ].map(([x, y, r, bg, d]) => `
      <g transform="rotate(${r} ${x + 40} ${y + 44})">
        <rect x="${x}" y="${y}" width="80" height="88" fill="#1a1a1a"/>
        <rect x="${x + 6}" y="${y + 6}" width="68" height="76" fill="#f6f2e8"/>
        <rect x="${x + 10}" y="${y + 10}" width="60" height="60" fill="${bg}"/>
        <path d="${d}" transform="translate(${x} ${y})" fill="none" stroke="#ffd27a" stroke-width="3" stroke-linecap="round"/>
      </g>`).join("")}
  </g>`, [1316, 160]);

const tray = hot("tray", "Khay đồ ăn khuya", `
  <g filter="url(#${P}-shadow)">
    <rect x="606" y="716" width="268" height="14" rx="4" fill="#c0c6ce"/>
    <rect x="618" y="730" width="8" height="90" fill="#9aa2ad"/><rect x="854" y="730" width="8" height="90" fill="#9aa2ad"/>
    <rect x="612" y="790" width="256" height="8" rx="3" fill="#9aa2ad"/>
    <circle cx="622" cy="828" r="9" fill="#333"/><circle cx="858" cy="828" r="9" fill="#333"/>
    <path d="M640 716 Q 640 670 690 666 Q 740 670 740 716 Z" fill="#dfe4ea"/>
    <path d="M652 700 Q 662 680 690 678" fill="none" stroke="#fff" stroke-width="4" opacity="0.8"/>
    <circle cx="690" cy="662" r="6" fill="#c0c6ce"/>
    <ellipse cx="800" cy="708" rx="44" ry="12" fill="#fff"/><ellipse cx="800" cy="704" rx="36" ry="8" fill="#e8b84a"/>
    <path d="M776 700 q 10 -8 20 0 q 10 -8 20 0" fill="none" stroke="#c0392b" stroke-width="3"/>
    <g fill="#5fa85a"><circle cx="790" cy="698" r="4"/><circle cx="812" cy="700" r="4"/></g>
    <path d="M846 704 l18 -30 M852 706 l18 -30" stroke="#8a6440" stroke-width="3" stroke-linecap="round"/>
  </g>`, [760, 650]);

const doorLeaf = `
  <g class="door-leaf">
    <rect x="1328" y="152" width="192" height="558" fill="url(#${P}-veneer)"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${1340 + i * 21}" y1="156" x2="${1342 + i * 21}" y2="706" stroke="#a87a4e" stroke-width="1.5" opacity="0.5"/>`).join("")}
    <rect x="1390" y="210" width="68" height="28" rx="4" fill="#2a2a2a"/>
    <text x="1424" y="230" font-size="17" font-weight="700" text-anchor="middle" fill="#e8c06a" font-family="${SANS}">1013</text>
    <rect x="1476" y="380" width="30" height="120" rx="6" fill="#1f2430"/>
    <rect x="1480" y="388" width="22" height="30" rx="3" fill="#0b2a3a"/><circle cx="1491" cy="403" r="5" fill="#3be0a0" class="blink"/>
    ${[0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${1481 + c * 11}" y="${426 + r * 16}" width="8" height="11" rx="2" fill="#4a5162"/>`).join("")).join("")}
    <rect x="1470" y="510" width="40" height="10" rx="5" fill="#c9cdd4"/>
    <g transform="translate(1474 524)">
      <path d="M0 0 h28 v64 q -14 8 -28 0 Z" fill="#c0392b"/><circle cx="14" cy="10" r="7" fill="none" stroke="#fff" stroke-width="3"/>
      <path d="M6 30 h16 M6 38 h12 M6 46 h16" stroke="#fff" stroke-width="2.5"/>
    </g>
  </g>`;

const hotelDoor = door("Cửa phòng có khóa chữ điện tử — lối ra", `
  <rect x="1316" y="140" width="216" height="570" fill="#11151f"/>
  <rect class="door-light" x="1328" y="152" width="192" height="558" fill="#fff1c9"/>
  `, [1424, 128]);

export default function danangRoom() {
  return scene(P, "Phòng khách sạn bên sông Hàn, Đà Nẵng", defs, {
    hole: { x: 372, y: 100, w: 716, h: 530 },
    far: night,
    wall: `
      <rect x="-600" y="-500" width="2800" height="1900" fill="#283a5c"/>
      <rect x="-600" y="-500" width="2800" height="556" fill="#141b2c"/>
      <rect x="-600" y="700" width="2800" height="700" fill="url(#${P}-carpet)"/>
      <rect width="1600" height="900" fill="url(#${P}-wall)"/>
      <rect width="1600" height="56" fill="#141b2c"/>
      ${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 24}" y="56" width="16" height="644" fill="#2b3a5a" opacity="0.6"/>`).join("")}
      <rect y="700" width="1600" height="200" fill="url(#${P}-carpet)"/>
      <rect x="-600" y="692" width="2800" height="10" fill="#141b2c"/>`,
    back: `
      ${[200, 520, 1080, 1400].map((x) => `<circle cx="${x}" cy="56" r="6" fill="#fff3c9"/>${glow(P, x, 80, 70, "#ffe2a0", 0.25)}`).join("")}
      ${windowFrame}${brochure}${desk}${mountains}${plaque}${sideTable}${postcard}${frames}${hotelDoor}`,
    mid: tray,
    front: plant(70, 960, 1.3, { pot: "#3a2f4a", leaf: "#1f4a3a", vein: "#2f6a52" }),
    door: { x: 1328, y: 152, w: 192, h: 558, motion: "swing", hinge: "left", art: doorLeaf },
  });
}
