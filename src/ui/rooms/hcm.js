// TP. Hồ Chí Minh — grandma's old apartment: mint walls, gạch bông tiles, a
// balcony over the sunset skyline (Landmark 81, Bitexco, the Saigon River),
// a red plastic stool, and a folding iron gate (cửa xếp) as the way out.

import { door, glow, hot, svgRoom } from "./kit.js";

const P = "sg";
const SANS = "Segoe UI, system-ui, sans-serif";

const defs = `
  <linearGradient id="${P}-wall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a9dccf"/><stop offset="1" stop-color="#83c3b4"/>
  </linearGradient>
  <linearGradient id="${P}-sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4b3a86"/><stop offset="0.45" stop-color="#e8657a"/><stop offset="1" stop-color="#ffc06b"/>
  </linearGradient>
  <linearGradient id="${P}-river" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e78f6b"/><stop offset="1" stop-color="#5a4a78"/>
  </linearGradient>
  <linearGradient id="${P}-glass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3b4b72"/><stop offset="0.55" stop-color="#5d6f9a"/><stop offset="1" stop-color="#2d3a5c"/>
  </linearGradient>
  <linearGradient id="${P}-floorfade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <pattern id="${P}-tile" width="72" height="72" patternUnits="userSpaceOnUse">
    <rect width="72" height="72" fill="#f1e6cf"/>
    <path d="M36 8 Q 46 26 36 36 Q 26 26 36 8 Z M36 64 Q 26 46 36 36 Q 46 46 36 64 Z M8 36 Q 26 26 36 36 Q 26 46 8 36 Z M64 36 Q 46 46 36 36 Q 46 26 64 36 Z" fill="#c8553d"/>
    <circle cx="36" cy="36" r="5" fill="#2a7f77"/>
    <path d="M0 0 h14 a14 14 0 0 1 -14 14 Z M72 0 v14 a14 14 0 0 1 -14 -14 Z M0 72 v-14 a14 14 0 0 1 14 14 Z M72 72 h-14 a14 14 0 0 1 14 -14 Z" fill="#2a7f77"/>
    <rect width="72" height="72" fill="none" stroke="#d8c9a8" stroke-width="2"/>
  </pattern>
  <clipPath id="${P}-view"><rect x="520" y="130" width="500" height="490"/></clipPath>`;

function windows(x, y, w, h, seed) {
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  let out = "";
  for (let yy = y + 10; yy < y + h - 8; yy += 16) {
    for (let xx = x + 6; xx < x + w - 8; xx += 12) {
      if (rand() < 0.42) out += `<rect x="${xx}" y="${yy}" width="6" height="8" fill="#ffd98a" opacity="${(0.55 + rand() * 0.45).toFixed(2)}"/>`;
    }
  }
  return out;
}

const skyline = `
  <g clip-path="url(#${P}-view)">
    <rect x="520" y="130" width="500" height="490" fill="url(#${P}-sky)"/>
    <circle cx="610" cy="470" r="46" fill="#ffd27a" opacity="0.9"/>
    <circle cx="610" cy="470" r="90" fill="#ffd27a" opacity="0.18"/>
    <g fill="#5b4880" opacity="0.6">
      <rect x="520" y="430" width="60" height="160"/><rect x="700" y="450" width="70" height="140"/><rect x="960" y="420" width="60" height="170"/>
    </g>
    <g>
      <rect x="560" y="470" width="54" height="120" fill="#3d3566"/>${windows(560, 470, 54, 120, 7)}
      <rect x="760" y="430" width="64" height="160" fill="#3a3363"/>${windows(760, 430, 64, 160, 13)}
      <rect x="975" y="460" width="45" height="130" fill="#3d3566"/>${windows(975, 460, 45, 130, 29)}
    </g>
    <g class="bitexco">
      <path d="M654 590 L 650 410 Q 652 330 676 262 Q 700 330 702 410 L 698 590 Z" fill="url(#${P}-glass)"/>
      <path d="M676 262 Q 690 330 692 410 L 690 590" fill="none" stroke="#9fb3e0" stroke-width="2" opacity="0.6"/>
      <path d="M690 372 L 730 366 Q 736 372 730 378 L 690 384 Z" fill="#3b4b72"/>
      <ellipse cx="722" cy="366" rx="16" ry="4" fill="#7d8fbf"/>
      ${windows(654, 410, 44, 170, 41)}
    </g>
    <g class="landmark">
      <rect x="868" y="300" width="64" height="290" fill="url(#${P}-glass)"/>
      <rect x="876" y="236" width="48" height="64" fill="url(#${P}-glass)"/>
      <rect x="884" y="190" width="32" height="46" fill="url(#${P}-glass)"/>
      <rect x="891" y="158" width="18" height="32" fill="url(#${P}-glass)"/>
      <line x1="900" y1="132" x2="900" y2="158" stroke="#c9d6f5" stroke-width="3"/>
      <circle cx="900" cy="134" r="3.5" fill="#ff5a5a" class="blink"/>
      <g stroke="#9fb3e0" stroke-width="2" opacity="0.5"><line x1="884" y1="300" x2="884" y2="590"/><line x1="900" y1="236" x2="900" y2="590"/><line x1="916" y1="300" x2="916" y2="590"/></g>
      ${windows(868, 320, 64, 260, 57)}
    </g>
    <rect x="520" y="588" width="500" height="40" fill="url(#${P}-river)"/>
    <g stroke="#ffe0a8" stroke-width="2" opacity="0.6"><line x1="560" y1="600" x2="620" y2="600"/><line x1="660" y1="612" x2="700" y2="612"/><line x1="860" y1="604" x2="940" y2="604"/></g>
    <path d="M780 604 h40 l-6 8 h-28 Z" fill="#2b2240"/><rect x="792" y="596" width="12" height="8" fill="#2b2240"/>
    <g class="celebrate">
      ${[[620, 220, "#ffd166"], [780, 190, "#ff6b9a"], [960, 240, "#7ae1ff"], [700, 300, "#b5ff7a"]].map(([x, y, c], i) => `
        <g class="firework" style="animation-delay:${i * 0.45}s" transform="translate(${x} ${y})">
          ${Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * Math.PI * 2; return `<line x1="${(Math.cos(a) * 10).toFixed(1)}" y1="${(Math.sin(a) * 10).toFixed(1)}" x2="${(Math.cos(a) * 34).toFixed(1)}" y2="${(Math.sin(a) * 34).toFixed(1)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`; }).join("")}
          <circle r="5" fill="#fff"/>
        </g>`).join("")}
    </g>
  </g>`;

function railing() {
  let out = `<rect x="520" y="520" width="500" height="8" fill="#2f2f3a"/><rect x="520" y="612" width="500" height="8" fill="#2f2f3a"/>`;
  for (let x = 540; x < 1020; x += 40) {
    out += `<line x1="${x}" y1="528" x2="${x}" y2="612" stroke="#2f2f3a" stroke-width="5"/>`;
    out += `<path d="M${x} 548 q 20 -12 40 0 M${x} 592 q 20 12 40 0" fill="none" stroke="#2f2f3a" stroke-width="4"/>`;
    out += `<circle cx="${x + 20}" cy="570" r="8" fill="none" stroke="#2f2f3a" stroke-width="4"/>`;
  }
  return out;
}

const balcony = `
  ${skyline}
  ${railing()}
  <rect x="502" y="112" width="536" height="526" fill="none" stroke="#f4efe2" stroke-width="22"/>
  <line x1="770" y1="120" x2="770" y2="520" stroke="#f4efe2" stroke-width="10"/>
  <rect x="490" y="632" width="560" height="18" fill="#e4dccb"/>
  <g transform="translate(470 660)">
    <path d="M-30 0 L30 0 L22 50 L-22 50 Z" fill="#c8553d"/><rect x="-34" y="-6" width="68" height="10" rx="3" fill="#a8432f"/>
    ${[[-16, -110, -0.25], [-4, -140, -0.08], [8, -126, 0.12], [20, -96, 0.3], [-26, -80, -0.45]].map(([x, h, r]) => `<path d="M${x} 0 Q ${x - 10} ${h / 2} ${x + Math.round(r * 60)} ${h} Q ${x + 10} ${h / 2} ${x + 6} 0 Z" fill="#3f8f4f" stroke="#e8d36a" stroke-width="2"/>`).join("")}
  </g>`;

const binoculars = hot("binoculars", "Ống nhòm ngoài ban công", `
  <g transform="translate(960 500) rotate(-8)">
    <ellipse cx="0" cy="26" rx="46" ry="6" fill="#000" opacity="0.25"/>
    <rect x="-38" y="-4" width="30" height="28" rx="8" fill="#22252e"/><rect x="8" y="-4" width="30" height="28" rx="8" fill="#22252e"/>
    <rect x="-8" y="2" width="16" height="14" fill="#3a3f4d"/>
    <circle cx="-23" cy="-4" r="14" fill="#2c303a"/><circle cx="23" cy="-4" r="14" fill="#2c303a"/>
    <circle cx="-23" cy="-4" r="8" fill="#7fb6d8"/><circle cx="23" cy="-4" r="8" fill="#7fb6d8"/>
    <circle cx="-26" cy="-7" r="3" fill="#fff" opacity="0.7"/><circle cx="20" cy="-7" r="3" fill="#fff" opacity="0.7"/>
  </g>`, [990, 470]);

const map = hot("map", "Bản đồ du lịch trên tường", `
  <g filter="url(#${P}-shadow)">
    <rect x="104" y="146" width="252" height="190" rx="4" fill="url(#${P}-wood)"/>
    <rect x="116" y="158" width="228" height="166" fill="#f3e6c4"/>
    <path d="M150 310 Q 170 250 210 240 Q 236 200 280 196 Q 310 186 330 172" fill="none" stroke="#6aa9c9" stroke-width="10" opacity="0.7"/>
    <path d="M128 200 h40 M140 230 h70 M210 290 h90 M250 220 h70" stroke="#d9c08e" stroke-width="5"/>
    ${[[160, 210, "#e74c3c"], [200, 270, "#e74c3c"], [250, 190, "#3498db"], [290, 250, "#e74c3c"], [312, 300, "#f1c40f"], [180, 300, "#9b59b6"], [228, 236, "#e74c3c"]].map(([x, y, c]) => `<g><line x1="${x}" y1="${y}" x2="${x + 4}" y2="${y + 12}" stroke="#555" stroke-width="2"/><circle cx="${x}" cy="${y}" r="6" fill="${c}"/></g>`).join("")}
    <text x="230" y="182" font-size="15" font-weight="700" text-anchor="middle" fill="#7a5a2c" font-family="${SANS}">SÀI GÒN</text>
  </g>`, [356, 152]);

const cabinet = `
  <g filter="url(#${P}-shadow)">
    <rect x="120" y="470" width="240" height="250" rx="6" fill="url(#${P}-woodlight)"/>
    <rect x="134" y="488" width="100" height="214" rx="4" fill="#8a5734"/><rect x="246" y="488" width="100" height="214" rx="4" fill="#8a5734"/>
    <circle cx="224" cy="596" r="5" fill="url(#${P}-brass)"/><circle cx="256" cy="596" r="5" fill="url(#${P}-brass)"/>
    <rect x="128" y="720" width="14" height="40" fill="#5d371f"/><rect x="338" y="720" width="14" height="40" fill="#5d371f"/>
  </g>`;

const radio = hot("radio", "Chiếc radio cũ", `
  <g filter="url(#${P}-shadow)">
    <rect x="152" y="380" width="176" height="92" rx="14" fill="#a0522d"/>
    <rect x="164" y="392" width="92" height="68" rx="8" fill="#e6d3a3"/>
    <g stroke="#a0522d" stroke-width="3">${[400, 410, 420, 430, 440, 450].map((y) => `<line x1="170" y1="${y}" x2="250" y2="${y}"/>`).join("")}</g>
    <rect x="266" y="394" width="52" height="22" rx="4" fill="#f7e8c0"/><line x1="282" y1="398" x2="282" y2="412" stroke="#c0392b" stroke-width="2"/>
    <circle cx="280" cy="442" r="11" fill="#5b2c16"/><circle cx="306" cy="442" r="11" fill="#5b2c16"/>
    <line x1="300" y1="380" x2="338" y2="320" stroke="#888" stroke-width="3"/><circle cx="338" cy="320" r="4" fill="#aaa"/>
    <g class="waves" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"><path d="M346 380 q 10 -12 0 -24"/><path d="M356 386 q 18 -18 0 -36"/></g>
  </g>`, [330, 380]);

const corkboard = hot("corkboard", "Bảng ghim bưu thiếp", `
  <g filter="url(#${P}-shadow)">
    <rect x="1084" y="146" width="196" height="186" rx="6" fill="url(#${P}-wood)"/>
    <rect x="1096" y="158" width="172" height="162" fill="#c99b62"/>
    <g fill="#b88a52" opacity="0.6">${[[1110, 170], [1150, 200], [1230, 180], [1200, 290], [1120, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}</g>
    <g transform="rotate(-5 1140 200)"><rect x="1110" y="172" width="62" height="58" fill="#fff"/><rect x="1115" y="177" width="52" height="38" fill="#d9a0a0"/><path d="M1126 214 v-22 l15 -10 l15 10 v22 M1141 182 v-8" fill="none" stroke="#7a2e2e" stroke-width="3"/><circle cx="1141" cy="170" r="5" fill="#e74c3c"/></g>
    <g transform="rotate(6 1226 200)"><rect x="1196" y="172" width="62" height="58" fill="#fff"/><rect x="1201" y="177" width="52" height="38" fill="#f2c27a"/><path d="M1210 214 h34 v-20 h-34 Z M1227 194 v-10" fill="none" stroke="#8a5a1e" stroke-width="3"/><circle cx="1227" cy="170" r="5" fill="#3498db"/></g>
    <g transform="rotate(4 1140 284)"><rect x="1110" y="252" width="62" height="58" fill="#fff"/><rect x="1115" y="257" width="52" height="38" fill="#a7d3a2"/><path d="M1124 294 h34 M1141 294 v-26 M1130 274 h22" fill="none" stroke="#2e6b2e" stroke-width="3"/><circle cx="1141" cy="250" r="5" fill="#f1c40f"/></g>
    <g transform="rotate(-7 1226 284)"><rect x="1196" y="252" width="62" height="58" fill="#fff"/><rect x="1201" y="257" width="52" height="38" fill="#9db3e0"/><path d="M1220 294 v-30 h14 v30 M1223 264 v-6 h8 v6" fill="none" stroke="#2c3e70" stroke-width="3"/><circle cx="1227" cy="250" r="5" fill="#9b59b6"/></g>
  </g>`, [1280, 152]);

const cart = hot("cart", "Ảnh xe đẩy ăn đêm", `
  <g filter="url(#${P}-shadow)">
    <rect x="1096" y="378" width="172" height="126" rx="4" fill="#2b2b2b"/>
    <rect x="1106" y="388" width="152" height="106" fill="#1b2340"/>
    <circle cx="1240" cy="404" r="6" fill="#ffd98a"/>
    <rect x="1128" y="432" width="104" height="38" rx="4" fill="#f4f4f4"/><rect x="1128" y="432" width="104" height="10" fill="#d63031"/>
    <path d="M1124 470 h112" stroke="#999" stroke-width="3"/>
    <circle cx="1142" cy="482" r="9" fill="#333" stroke="#777" stroke-width="2"/><circle cx="1218" cy="482" r="9" fill="#333" stroke="#777" stroke-width="2"/>
    <g fill="#e8a33d">${[1140, 1160, 1180, 1200].map((x) => `<rect x="${x}" y="448" width="14" height="10" rx="3"/>`).join("")}</g>
    <circle cx="1200" cy="420" r="18" fill="#ffd98a" opacity="0.25"/>
  </g>`, [1268, 384]);

const coffee = hot("coffee", "Ly cà phê trên bàn", `
  <g transform="translate(770 640)">
    <ellipse cx="0" cy="62" rx="40" ry="7" fill="#000" opacity="0.2"/>
    <path d="M-24 0 L-20 60 L20 60 L24 0 Z" fill="#fff" opacity="0.35" stroke="#e8e8e8" stroke-width="2"/>
    <path d="M-22 20 L-20 58 L20 58 L22 20 Z" fill="#a0612f"/>
    <path d="M-22 20 L22 20 L21 34 L-21 34 Z" fill="#e9d8b8" opacity="0.8"/>
    <g fill="#fff" opacity="0.8">${[[-10, 40], [6, 46], [-4, 50], [10, 36]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="7" rx="2"/>`).join("")}</g>
    <rect x="-20" y="-24" width="40" height="22" rx="4" fill="#c4c9cf"/><rect x="-28" y="-4" width="56" height="6" rx="3" fill="#aeb4bb"/>
    <rect x="-16" y="-30" width="32" height="7" rx="3" fill="#d4d8dc"/>
    <path class="steam" d="M-6 -36 q -8 -12 0 -24 q 8 -12 0 -24 M8 -38 q -8 -10 0 -20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <rect x="34" y="40" width="26" height="20" rx="3" fill="#f7e8c0"/><path d="M38 47 h18 M38 53 h12" stroke="#a0522d" stroke-width="2"/>
  </g>`, [800, 590]);

const table = `
  <g filter="url(#${P}-shadow)">
    <ellipse cx="770" cy="712" rx="170" ry="26" fill="#6b4226"/>
    <ellipse cx="770" cy="704" rx="170" ry="26" fill="url(#${P}-woodlight)"/>
    <rect x="760" y="724" width="20" height="90" fill="#5d371f"/>
    <ellipse cx="770" cy="816" rx="70" ry="12" fill="#4a2c18"/>
  </g>
  <g transform="translate(1010 760)" filter="url(#${P}-shadow)">
    <path d="M-44 -30 L44 -30 L52 60 L36 60 L30 6 L-30 6 L-36 60 L-52 60 Z" fill="#d63031"/>
    <ellipse cx="0" cy="-30" rx="46" ry="12" fill="#ff4d4d"/>
    <ellipse cx="0" cy="-30" rx="12" ry="4" fill="#b02020"/>
  </g>`;

const fan = `
  <line x1="800" y1="0" x2="800" y2="54" stroke="#ddd" stroke-width="6"/>
  <g class="fan" style="transform-origin: 800px 60px">
    <ellipse cx="740" cy="60" rx="64" ry="10" fill="#f2f2f2"/><ellipse cx="860" cy="60" rx="64" ry="10" fill="#e6e6e6"/>
  </g>
  <circle cx="800" cy="60" r="14" fill="#cfcfcf"/>`;

const gate = door("Cửa xếp khóa chữ — lối ra", `
  <rect x="1300" y="150" width="240" height="560" fill="#ece4d2"/>
  <rect class="door-light" x="1318" y="168" width="204" height="542" fill="#fff1c9"/>
  <rect x="1318" y="168" width="204" height="542" fill="#1c2029" class="door-dark"/>
  <g class="door-leaf door-fold">
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${1324 + i * 40} 176 l40 66 l-40 66 l40 66 l-40 66 l40 66 l-40 66 l40 66 l-40 66" stroke="#8d96a3" stroke-width="3" fill="none"/>`).join("")}
    ${Array.from({ length: 11 }, (_, i) => `<rect x="${1320 + i * 20}" y="170" width="6" height="538" rx="2" fill="#b9c1cb"/>`).join("")}
    <rect x="1318" y="166" width="204" height="10" fill="#4a515c"/><rect x="1318" y="700" width="204" height="10" fill="#4a515c"/>
    <g transform="translate(1420 440)">
      <path d="M-22 -16 v-14 a22 22 0 0 1 44 0 v14" fill="none" stroke="#b8bec6" stroke-width="7"/>
      <rect x="-38" y="-18" width="76" height="52" rx="8" fill="url(#${P}-brass)"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-33 + i * 11.5}" y="-6" width="9" height="26" rx="2" fill="#3a2508"/>`).join("")}
    </g>
  </g>
  <rect x="1292" y="142" width="256" height="16" fill="#d8ceb8"/>`, [1420, 132]);

export default function hcmRoom() {
  return svgRoom(P, "Căn hộ chung cư cũ ở Sài Gòn", defs, `
    <rect width="1600" height="900" fill="url(#${P}-wall)"/>
    <rect y="0" width="1600" height="40" fill="#f4efe2"/>
    <rect y="520" width="1600" height="180" fill="#6fb1a2"/>
    <rect y="514" width="1600" height="8" fill="#f4efe2"/>
    <rect y="700" width="1600" height="200" fill="url(#${P}-tile)"/>
    <rect y="700" width="1600" height="200" fill="url(#${P}-floorfade)"/>
    <rect y="692" width="1600" height="10" fill="#4f8a7d"/>
    ${glow(P, 770, 380, 260, "#ffb37a", 0.35)}
    ${balcony}
    ${binoculars}
    ${fan}
    ${map}
    ${cabinet}
    ${radio}
    ${corkboard}
    ${cart}
    ${table}
    ${coffee}
    ${gate}
  `);
}
