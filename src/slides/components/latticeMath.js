export const POINT_RANGE = 10;
export const DEFAULT_SCALE = 160;
export const SCALE = DEFAULT_SCALE;

export const BASIS_A = { b1: [1, 0], b2: [0.4, 1] };
export const BASIS_B = { b1: [1, 0.3], b2: [-0.2, 1] };

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function buildLatticeIndices(range) {
  const indices = [];
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      indices.push({ i, j });
    }
  }
  return indices;
}

export function computeShortestPrimitiveVectors(basis, maxCoeff = POINT_RANGE) {
  const candidates = [];

  for (let i = -maxCoeff; i <= maxCoeff; i++) {
    for (let j = -maxCoeff; j <= maxCoeff; j++) {
      if (i === 0 && j === 0) continue;
      if (gcd(i, j) !== 1) continue;

      let ci = i;
      let cj = j;
      if (ci < 0 || (ci === 0 && cj < 0)) {
        ci = -ci;
        cj = -cj;
      }

      const x = ci * basis.b1[0] + cj * basis.b2[0];
      const y = ci * basis.b1[1] + cj * basis.b2[1];
      const len2 = x * x + y * y;

      candidates.push({ i: ci, j: cj, len2 });
    }
  }

  candidates.sort((a, b) => a.len2 - b.len2);

  const result = [];
  for (const v of candidates) {
    if (!result.some((w) => w.i === v.i && w.j === v.j)) {
      result.push(v);
      if (result.length === 2) break;
    }
  }
  return result;
}

export function computeDualBasis(basis) {
  const [a, b] = basis.b1;
  const [c, d] = basis.b2;
  const det = a * d - b * c;

  if (det === 0) {
    return { b1: [0, 0], b2: [0, 0] };
  }

  return {
    b1: [d / det, -b / det],
    b2: [-c / det, a / det],
  };
}

export function formatBasisText(basis) {
  const [b1x, b1y] = basis.b1;
  const [b2x, b2y] = basis.b2;
  return `b1 = (${b1x.toFixed(2)}, ${b1y.toFixed(2)}), b2 = (${b2x.toFixed(
    2
  )}, ${b2y.toFixed(2)})`;
}

export function formatCvpText({ halfShortest, radiusFactor, overCap }) {
  const d = radiusFactor * halfShortest;
  const capText = `CVP cap |v_shortest|/2 = ${halfShortest.toFixed(2)}`;
  const dText = `d = ${d.toFixed(2)} (factor ${radiusFactor.toFixed(2)})`;
  return overCap
    ? `${capText}, ${dText} -- above cap, CVP undefined`
    : `${capText}, ${dText}`;
}

export function generateNonReducedBasis() {
  const e1 = [1, 0];
  const e2 = [0, 1];
  const kMag = 2 + Math.floor(Math.random() * 4);
  const k = Math.random() < 0.5 ? kMag : -kMag;
  return { b1: e1, b2: [e2[0] + k * e1[0], e2[1] + k * e1[1]] };
}

export function reduceVectorModLattice(vec, basis) {
  const [vX, vY] = vec;
  const [b1x, b1y] = basis.b1;
  const [b2x, b2y] = basis.b2;
  const det = b1x * b2y - b1y * b2x;
  if (Math.abs(det) < 1e-9) {
    return { vec: [0, 0], coeffs: [0, 0] };
  }

  // Solve for coefficients (a, b) such that vec = a*b1 + b*b2
  const invDet = 1 / det;
  const a = invDet * (b2y * vX - b2x * vY);
  const b = invDet * (-b1y * vX + b1x * vY);

  // Wrap into [0,1) to land inside the fundamental domain
  const wrap = (t) => {
    const frac = t - Math.floor(t);
    if (Math.abs(frac - 1) < 1e-9 || Math.abs(frac) < 1e-9) return 0;
    return frac;
  };
  const aMod = wrap(a);
  const bMod = wrap(b);

  const reduced = [
    aMod * b1x + bMod * b2x,
    aMod * b1y + bMod * b2y,
  ];

  return { vec: reduced, coeffs: [aMod, bMod] };
}
