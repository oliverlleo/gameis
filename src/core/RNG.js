function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function xfnv1aHash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class RNG {
  constructor(seed = 123456789) {
    this.seed = seed >>> 0;
    this.rand = mulberry32(this.seed);
  }

  static from(seed) {
    return new RNG(seed);
  }

  static hashInts(...ints) {
    let h = 2166136261 >>> 0;
    for (const n of ints) {
      h ^= (n >>> 0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  static hashString(str) {
    return xfnv1aHash(str);
  }

  clone(offset = 0) {
    return new RNG((this.seed + (offset >>> 0)) >>> 0);
  }

  float(min = 0, max = 1) {
    return min + (max - min) * this.rand();
  }

  int(min, max) {
    return Math.floor(this.float(min, max + 1));
  }

  bool(chance = 0.5) {
    return this.rand() < chance;
  }

  pick(arr) {
    return arr[Math.floor(this.rand() * arr.length)];
  }

  weightedPick(list, weightAccessor = (x) => x.weight ?? 1) {
    const total = list.reduce((s, it) => s + weightAccessor(it), 0);
    let r = this.float(0, total);
    for (const item of list) {
      r -= weightAccessor(item);
      if (r <= 0) return item;
    }
    return list[list.length - 1];
  }

  chance(ch) {
    return this.rand() < ch;
  }
}
