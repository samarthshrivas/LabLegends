import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = join(process.cwd(), "public", "icons");
const SIZES = [192, 512];

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, checksum]);
}

function insideRoundedRect(x, y, size) {
  const radius = size * 0.22;
  const left = radius;
  const top = radius;
  const right = size - radius;
  const bottom = size - radius;
  const cx = Math.min(Math.max(x, left), right);
  const cy = Math.min(Math.max(y, top), bottom);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function pixel(size, x, y) {
  if (!insideRoundedRect(x, y, size)) return [0, 0, 0, 0];

  const nx = x / size;
  const ny = y / size;
  const circleDx = nx - 0.5;
  const circleDy = ny - 0.42;
  const inCircle = circleDx * circleDx + circleDy * circleDy <= 0.2 * 0.2;
  const inVerticalBar = nx >= 0.42 && nx <= 0.5 && ny >= 0.38 && ny <= 0.68;
  const inHorizontalBar = nx >= 0.42 && nx <= 0.7 && ny >= 0.6 && ny <= 0.68;

  if (inVerticalBar || inHorizontalBar) return [248, 250, 252, 255];
  if (inCircle) return [34, 211, 238, 255];
  return [11, 16, 32, 255];
}

function encodePng(size) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * stride;
    raw[rowStart] = 0;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a] = pixel(size, x, y);
      const offset = rowStart + 1 + x * 4;
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const size of SIZES) {
  const path = join(OUTPUT_DIR, `icon-${size}.png`);
  writeFileSync(path, encodePng(size));
  console.log(`Generated ${path}`);
}
