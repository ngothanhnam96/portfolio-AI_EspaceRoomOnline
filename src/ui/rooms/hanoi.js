// Hà Nội — an Old Quarter attic: ochre walls, green louvred shutters open on
// Hoàn Kiếm Lake at dusk (Turtle Tower, the red Thê Húc bridge), Bát Tràng tiles.

import { books, door, glow, hot, perspectiveFloor, svgRoom } from "./kit.js";

const P = "hn";

const defs = `
  <linearGradient id="${P}-wall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e2b25a"/><stop offset="1" stop-color="#c98f3c"/>
  </linearGradient>
  <pattern id="${P}-stripes" width="38" height="38" patternUnits="userSpaceOnUse">
    <rect width="38" height="38" fill="none"/><rect width="2" height="38" fill="#fff" opacity="0.08"/>
    <circle cx="19" cy="19" r="2.2" fill="#fff" opacity="0.1"/>
  </pattern>
  <linearGradient id="${P}-sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2f2752"/><stop offset="0.5" stop-color="#b6517a"/><stop offset="1" stop-color="#f3a35c"/>
  </linearGradient>
  <linearGradient id="${P}-lake" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3f7d80"/><stop offset="1" stop-color="#173c42"/>
  </linearGradient>
  <linearGradient id="${P}-bronze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d9a55a"/><stop offset="1" stop-color="#6b4319"/>
  </linearGradient>
  <linearGradient id="${P}-shutter" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3d7d5c"/><stop offset="1" stop-color="#2c5e45"/>
  </linearGradient>
  <linearGradient id="${P}-chalk" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#34463c"/><stop offset="1" stop-color="#25322b"/>
  </linearGradient>
  <clipPath id="${P}-view"><rect x="440" y="170" width="340" height="372"/></clipPath>`;

function louvres(x, y, w, h) {
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#${P}-shutter)" stroke="#1f4532" stroke-width="4"/>`;
  for (let yy = y + 16; yy < y + h - 8; yy += 15) {
    out += `<line x1="${x + 10}" y1="${yy}" x2="${x + w - 10}" y2="${yy + 4}" stroke="#1f4532" stroke-width="3" opacity="0.7"/>`;
  }
  return out;
}

const windowView = `
  <g clip-path="url(#${P}-view)">
    <rect x="440" y="170" width="340" height="372" fill="url(#${P}-sky)"/>
    <circle cx="730" cy="222" r="15" fill="#fff4c9"/>
    <circle cx="730" cy="222" r="34" fill="#fff4c9" opacity="0.18"/>
    <path d="M440 420 Q 460 392 482 404 Q 500 380 526 398 Q 548 384 566 402 Q 600 386 630 404 Q 660 380 690 400 Q 720 388 748 404 Q 766 392 780 400 L 780 430 L 440 430 Z" fill="#26413b"/>
    <g fill="#ffd27a">${[470, 520, 575, 640, 700, 755].map((x) => `<circle cx="${x}" cy="418" r="2.6"/>`).join("")}</g>
    <rect x="440" y="426" width="340" height="120" fill="url(#${P}-lake)"/>
    <g stroke="#ffd9a0" stroke-width="2" opacity="0.45">
      <line x1="470" y1="450" x2="520" y2="450"/><line x1="560" y1="490" x2="640" y2="490"/><line x1="680" y1="470" x2="740" y2="470"/><line x1="500" y1="515" x2="560" y2="515"/>
    </g>
    <path d="M440 452 Q 488 412 548 450" fill="none" stroke="#c53a2e" stroke-width="7"/>
    <path d="M440 452 Q 488 412 548 450" fill="none" stroke="#ff8a6a" stroke-width="2" opacity="0.6" transform="translate(0 -6)"/>
    <g stroke="#c53a2e" stroke-width="2">${[456, 472, 488, 504, 520, 536].map((x) => `<line x1="${x}" y1="${438 - Math.round(16 * Math.sin(((x - 440) / 108) * Math.PI))}" x2="${x}" y2="${449 - Math.round(16 * Math.sin(((x - 440) / 108) * Math.PI))}"/>`).join("")}</g>
    <ellipse cx="640" cy="478" rx="58" ry="10" fill="#2b4a33"/>
    <path d="M610 476 Q 600 456 618 452 Q 622 440 636 446 Q 650 436 660 450 Q 676 452 668 476 Z" fill="#355b3d"/>
    <g class="tower">
      <rect x="616" y="428" width="48" height="44" fill="#ddd2b5"/>
      <rect x="624" y="406" width="32" height="22" fill="#e4dbc2"/>
      <rect x="631" y="390" width="18" height="16" fill="#ebe3cd"/>
      <path d="M612 430 L668 430 L664 424 L616 424 Z M620 408 L660 408 L656 402 L624 402 Z M628 392 L652 392 L648 386 L632 386 Z" fill="#8a6f52"/>
      <g fill="#5b4a3a">
        <path d="M624 470 v-14 a5 5 0 0 1 10 0 v14 Z"/><path d="M646 470 v-14 a5 5 0 0 1 10 0 v14 Z"/>
        <path d="M630 426 v-10 a4 4 0 0 1 8 0 v10 Z"/><path d="M642 426 v-10 a4 4 0 0 1 8 0 v10 Z"/>
        <path d="M636 404 v-8 a4 4 0 0 1 8 0 v8 Z"/>
      </g>
    </g>
    <g fill="#ddd2b5" opacity="0.35" transform="translate(0 956) scale(1 -1)">
      <rect x="616" y="428" width="48" height="44"/><rect x="624" y="406" width="32" height="22"/>
    </g>
    <g class="celebrate">
      ${[[470, 300], [520, 260], [585, 320], [700, 290], [745, 340], [650, 250], [540, 350]].map(([x, y], i) => `
        <g class="lantern" style="animation-delay:${i * 0.35}s"><circle cx="${x}" cy="${y}" r="16" fill="#ffb347" opacity="0.35"/><rect x="${x - 7}" y="${y - 9}" width="14" height="18" rx="5" fill="#ff8c2b"/><rect x="${x - 7}" y="${y - 2}" width="14" height="3" fill="#ffd27a"/></g>`).join("")}
      <circle cx="640" cy="430" r="70" fill="#ffd27a" opacity="0.35"/>
    </g>
  </g>`;

const windowFrame = `
  ${louvres(328, 150, 96, 412)}
  ${louvres(796, 150, 96, 412)}
  <rect x="424" y="154" width="372" height="404" fill="none" stroke="#2c5e45" stroke-width="18"/>
  <line x1="610" y1="160" x2="610" y2="552" stroke="#2c5e45" stroke-width="9"/>
  <line x1="430" y1="356" x2="790" y2="356" stroke="#2c5e45" stroke-width="9"/>
  <rect x="396" y="552" width="428" height="24" rx="4" fill="url(#${P}-woodlight)" filter="url(#${P}-shadow)"/>`;

const turtle = hot("turtle", "Tượng rùa đồng bên cửa sổ", `
  <ellipse cx="702" cy="551" rx="58" ry="7" fill="#000" opacity="0.25"/>
  <ellipse cx="664" cy="546" rx="11" ry="6" fill="#7c5221"/><ellipse cx="740" cy="546" rx="11" ry="6" fill="#7c5221"/>
  <ellipse cx="700" cy="530" rx="46" ry="24" fill="url(#${P}-bronze)" stroke="#5a3814" stroke-width="3"/>
  <path d="M672 526 L688 512 L712 512 L728 526 L712 540 L688 540 Z" fill="none" stroke="#5a3814" stroke-width="2.5"/>
  <path d="M688 512 L680 500 M712 512 L720 500 M688 540 L680 548 M712 540 L720 548" stroke="#5a3814" stroke-width="2"/>
  <ellipse cx="752" cy="526" rx="13" ry="10" fill="#b8843f" stroke="#5a3814" stroke-width="2.5"/>
  <circle cx="757" cy="523" r="2" fill="#2a1a08"/>
  <path d="M651 530 Q 640 534 646 540" fill="none" stroke="#7c5221" stroke-width="4"/>`, [700, 492]);

const scroll = hot("scroll", "Cuộn chiếu treo tường", `
  <path d="M210 84 L 150 114 M210 84 L 270 114" stroke="#5b3a22" stroke-width="2"/>
  <circle cx="210" cy="82" r="5" fill="#4a3020"/>
  <g filter="url(#${P}-shadow)">
    <rect x="152" y="120" width="116" height="336" fill="url(#${P}-paper)"/>
    <rect x="160" y="128" width="100" height="320" fill="none" stroke="#a83c32" stroke-width="2"/>
    <g stroke="#2b2420" stroke-linecap="round" fill="none">
      <path d="M232 150 q 6 10 -2 22 M226 162 h 16 M236 182 v 26 q -6 6 -12 2" stroke-width="5"/>
      <path d="M230 222 q 10 4 2 14 q -8 8 4 16 M222 262 h 20" stroke-width="5"/>
      <path d="M232 276 v 34 M222 290 q 10 -4 20 4" stroke-width="5"/>
      <path d="M190 156 q 8 6 0 16 M184 176 h 14 M192 186 v 24" stroke-width="4"/>
      <path d="M186 226 q 10 8 2 18 q -6 10 6 16 M182 276 h 18 M192 286 v 30" stroke-width="4"/>
    </g>
    <rect x="222" y="398" width="22" height="22" fill="#c0392b"/>
    <path d="M226 404 h14 M226 410 h14 M233 402 v16" stroke="#fff" stroke-width="1.6"/>
    <rect x="140" y="110" width="140" height="13" rx="6" fill="url(#${P}-wood)"/>
    <rect x="140" y="452" width="140" height="15" rx="7" fill="url(#${P}-wood)"/>
    <circle cx="140" cy="459" r="8" fill="#3b2414"/><circle cx="280" cy="459" r="8" fill="#3b2414"/>
  </g>`, [276, 128]);

const shelfX = 948;
const shelf = hot("shelf", "Kệ sách và bốn tấm bưu thiếp", `
  <g filter="url(#${P}-shadow)">
    <rect x="${shelfX}" y="170" width="212" height="510" rx="6" fill="url(#${P}-wood)"/>
    <rect x="${shelfX + 12}" y="182" width="188" height="486" fill="#3d2414"/>
    ${[300, 430, 560, 668].map((y) => `<rect x="${shelfX + 6}" y="${y}" width="200" height="12" fill="url(#${P}-woodlight)"/>`).join("")}
  </g>
  ${books(shelfX + 16, shelfX + 196, 300, ["#8e2f2f", "#264d73", "#d6a446", "#3e6b48", "#6a3d6e", "#c4643a"], 11)}
  ${books(shelfX + 16, shelfX + 196, 430, ["#2f4858", "#a23e48", "#e0b354", "#5a7d4f", "#7a4b94"], 23)}
  <g>
    <g transform="rotate(-6 990 520)"><rect x="966" y="488" width="46" height="66" fill="#fffaf0"/><rect x="971" y="493" width="36" height="40" fill="#c97f3a"/><path d="M989 498 v30 M976 508 h26" stroke="#7a3f12" stroke-width="3"/></g>
    <g transform="rotate(4 1040 520)"><rect x="1016" y="490" width="46" height="66" fill="#fffaf0"/><rect x="1021" y="495" width="36" height="40" fill="#b23b33"/><path d="M1025 528 l8 -12 l8 6 l8 -16 l8 22" fill="none" stroke="#ffd59a" stroke-width="2.5"/></g>
    <g transform="rotate(-3 1090 520)"><rect x="1066" y="488" width="46" height="66" fill="#fffaf0"/><rect x="1071" y="493" width="36" height="40" fill="#4f7aa3"/><path d="M1071 520 q 18 -18 36 0" fill="none" stroke="#2c2c2c" stroke-width="3"/></g>
    <g transform="rotate(7 1136 520)"><rect x="1112" y="490" width="42" height="64" fill="#fffaf0"/><rect x="1116" y="495" width="34" height="38" fill="#e4c766"/><path d="M1120 530 h26 v-16 q -13 -12 -26 0 Z" fill="#fff6d6"/></g>
  </g>
  <g fill="#cfa36a"><rect x="${shelfX + 24}" y="612" width="70" height="16" rx="3"/><rect x="${shelfX + 30}" y="596" width="58" height="16" rx="3" fill="#7b9e87"/><rect x="${shelfX + 120}" y="604" width="60" height="24" rx="6" fill="#d8c3a0"/></g>`, [1160, 176]);

const lamp = `
  <line x1="880" y1="0" x2="880" y2="118" stroke="#2b1a10" stroke-width="3"/>
  <path d="M846 150 L914 150 L898 116 L862 116 Z" fill="#f2d398"/>
  <path d="M846 150 L914 150 L898 116 L862 116 Z" fill="#000" opacity="0.15"/>
  <circle cx="880" cy="152" r="9" fill="#fff6d5"/>
  ${glow(P, 880, 170, 120, "#ffd98a", 0.45)}
  <path d="M846 150 L740 690 L1020 690 L914 150 Z" fill="#ffe7b0" opacity="0.05"/>`;

const table = `
  <ellipse cx="740" cy="812" rx="340" ry="54" fill="#8c2f2a"/>
  <ellipse cx="740" cy="812" rx="300" ry="44" fill="none" stroke="#e7b25e" stroke-width="4" stroke-dasharray="14 10"/>
  <g filter="url(#${P}-shadow)">
    <rect x="540" y="726" width="400" height="22" rx="6" fill="url(#${P}-woodlight)"/>
    <rect x="560" y="748" width="20" height="62" fill="#5d371f"/><rect x="900" y="748" width="20" height="62" fill="#5d371f"/>
  </g>
  <g transform="translate(820 690)">
    <ellipse cx="0" cy="34" rx="34" ry="6" fill="#000" opacity="0.25"/>
    <path d="M-26 32 Q -34 4 0 0 Q 34 4 26 32 Z" fill="#e9eef0"/><path d="M-26 32 Q -34 4 0 0 Q 34 4 26 32 Z" fill="#4d7ea8" opacity="0.25"/>
    <path d="M26 14 q 18 -4 20 -14" fill="none" stroke="#e9eef0" stroke-width="5"/><rect x="-6" y="-8" width="12" height="9" rx="3" fill="#cdd7dc"/>
    <path d="M-18 18 q 18 8 36 0" fill="none" stroke="#2f5f8a" stroke-width="2.5"/>
    <g transform="translate(60 18)"><path d="M-12 14 L-14 0 L14 0 L12 14 Z" fill="#e9eef0"/><path d="M-13 6 h26" stroke="#2f5f8a" stroke-width="2"/></g>
  </g>`;

const steles = hot("steles", "Hộp gỗ khóa số", `
  <g filter="url(#${P}-shadow)">
    <rect x="590" y="668" width="150" height="60" rx="6" fill="url(#${P}-wood)"/>
    <rect x="590" y="660" width="150" height="16" rx="5" fill="#8a5734"/>
    <g transform="translate(626 670)">
      <ellipse cx="0" cy="50" rx="20" ry="7" fill="#b28a5c"/>
      <rect x="-12" y="14" width="24" height="34" rx="10" fill="#d8c19a"/>
      <path d="M-6 24 h12 M-6 30 h12 M-6 36 h12" stroke="#7b5a35" stroke-width="2"/>
    </g>
    <g transform="translate(680 700)">
      <rect x="-4" y="-16" width="46" height="30" rx="5" fill="#2a1a10"/>
      <rect x="0" y="-12" width="18" height="22" rx="3" fill="url(#${P}-brass)"/><rect x="22" y="-12" width="18" height="22" rx="3" fill="url(#${P}-brass)"/>
      <text x="9" y="5" font-size="15" font-weight="700" text-anchor="middle" fill="#3a2508">?</text>
      <text x="31" y="5" font-size="15" font-weight="700" text-anchor="middle" fill="#3a2508">?</text>
    </g>
  </g>`, [740, 660]);

const menu = hot("menu", "Bảng thực đơn viết phấn", `
  <g filter="url(#${P}-shadow)">
    <path d="M118 812 L150 540 M282 812 L250 540" stroke="#5d371f" stroke-width="10" stroke-linecap="round"/>
    <rect x="100" y="526" width="200" height="236" rx="8" fill="url(#${P}-wood)"/>
    <rect x="112" y="538" width="176" height="212" rx="4" fill="url(#${P}-chalk)"/>
    <text x="200" y="574" font-size="22" font-weight="700" text-anchor="middle" fill="#f4f1e8" font-family="Segoe UI, system-ui, sans-serif">THỰC ĐƠN</text>
    <g stroke="#f4f1e8" stroke-width="3" stroke-linecap="round" opacity="0.55">
      <path d="M130 606 h70 M214 606 h50"/><path d="M130 640 h88 M232 640 h32" opacity="0.6"/>
      <path d="M130 674 h60 M204 674 h60"/><path d="M130 708 h96" opacity="0.5"/>
    </g>
    <g fill="#f4f1e8" opacity="0.18"><ellipse cx="196" cy="660" rx="64" ry="22"/></g>
    <circle cx="262" cy="720" r="14" fill="none" stroke="#ffd27a" stroke-width="3"/>
    <path d="M254 720 q 8 -12 16 0" fill="none" stroke="#ffd27a" stroke-width="2.5"/>
  </g>`, [300, 530]);

const exitDoor = door("Cánh cửa gỗ khóa chữ — lối ra", `
  <rect x="1236" y="150" width="244" height="550" fill="#3a2414"/>
  <path d="M1246 160 h224 v54 h-224 Z" fill="#2b190d"/>
  <g stroke="#c9973f" stroke-width="3" fill="none" opacity="0.8">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="1358" y1="212" x2="${1262 + i * 32}" y2="166"/>`).join("")}</g>
  <rect class="door-light" x="1254" y="216" width="208" height="484" fill="#fff3c9"/>
  <g class="door-leaf">
    <rect x="1254" y="216" width="208" height="484" fill="url(#${P}-wood)"/>
    ${[[1270, 232], [1362, 232], [1270, 380], [1362, 380], [1270, 540], [1362, 540]].map(([x, y]) => `<rect x="${x}" y="${y}" width="84" height="${y === 380 ? 144 : y === 540 ? 140 : 132}" rx="4" fill="#5c3720" stroke="#2b190d" stroke-width="4"/>`).join("")}
    <g transform="translate(1272 456)">
      <rect x="-6" y="-22" width="92" height="44" rx="8" fill="#1f130a"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 17}" y="-14" width="14" height="28" rx="3" fill="url(#${P}-brass)"/>`).join("")}
    </g>
    <circle cx="1440" cy="466" r="11" fill="url(#${P}-brass)"/>
  </g>
  <rect x="1310" y="120" width="96" height="26" rx="5" fill="#2b190d"/>
  <text x="1358" y="139" font-size="16" font-weight="700" text-anchor="middle" fill="#ffd27a" font-family="Segoe UI, system-ui, sans-serif">LỐI RA</text>`, [1358, 112]);

const clock = `
  <g transform="translate(1086 112)">
    <circle r="32" fill="url(#${P}-wood)"/><circle r="25" fill="#fbf3dc"/>
    <line x1="0" y1="0" x2="0" y2="-16" stroke="#2b1a10" stroke-width="3"/>
    <line class="clock-hand" x1="0" y1="0" x2="12" y2="6" stroke="#a83c32" stroke-width="2.5"/>
    <circle r="3" fill="#2b1a10"/>
  </g>`;

export default function hanoiRoom() {
  return svgRoom(P, "Căn gác phố cổ Hà Nội", defs, `
    <rect width="1600" height="900" fill="url(#${P}-wall)"/>
    <rect width="1600" height="700" fill="url(#${P}-stripes)"/>
    <rect width="1600" height="46" fill="url(#${P}-wood)"/>
    ${[160, 560, 960, 1360].map((x) => `<rect x="${x}" y="0" width="34" height="58" fill="#4f2e1a"/>`).join("")}
    ${perspectiveFloor({ top: 700, colors: ["#b5533a", "#9c4430"], lines: "#5e2516" })}
    <rect x="0" y="682" width="1600" height="20" fill="#5d371f"/>
    ${windowView}
    ${windowFrame}
    ${lamp}
    ${clock}
    ${scroll}
    ${shelf}
    ${table}
    ${steles}
    ${menu}
    ${turtle}
    ${exitDoor}
    <g class="motes">${[[300, 260], [520, 620], [900, 300], [1100, 560], [760, 420], [1300, 300]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff5d6" style="animation-delay:${i * 1.1}s"/>`).join("")}</g>
  `);
}
