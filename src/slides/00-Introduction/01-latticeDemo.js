import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const POINT_RANGE = 12;
const SCALE = 120;

const COLORS = {
  defaultPoint: "#222",
  shortest1: "#ff7f0e",
  shortest2: "#9467bd",
  cvpPoint: "#2ca02c",
  cvpLine: "#2ca02c",
};

const BASIS_A = { b1: [1, 0], b2: [0.4, 1] };
const BASIS_B = { b1: [1, 0.3], b2: [-0.2, 1] };

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function buildLatticeIndices(range) {
  const indices = [];
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      indices.push({ i, j });
    }
  }
  return indices;
}

function createFullScreenSVG(containerEl) {
  return d3
    .select(containerEl)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
}

function createArrowMarker(svg) {
  const defs = svg.append("defs");
  const marker = defs
    .append("marker")
    .attr("id", "arrow-head")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse");
  marker.append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");
}

function createLayers(svg, layerNames) {
  const layers = {};
  layerNames.forEach((name) => {
    layers[name] = svg.append("g").attr("class", name);
  });
  return layers;
}

function computeShortestPrimitiveVectors(basis, maxCoeff = POINT_RANGE) {
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

function formatBasisText(basis) {
  const [b1x, b1y] = basis.b1;
  const [b2x, b2y] = basis.b2;
  return `b1 = (${b1x.toFixed(2)}, ${b1y.toFixed(2)}), b2 = (${b2x.toFixed(
    2
  )}, ${b2y.toFixed(2)})`;
}

function formatCvpText({ halfShortest, radiusFactor, overCap }) {
  const d = radiusFactor * halfShortest;
  const capText = `CVP cap |v_shortest|/2 = ${halfShortest.toFixed(2)}`;
  const dText = `d = ${d.toFixed(2)} (factor ${radiusFactor.toFixed(2)})`;
  return overCap
    ? `${capText}, ${dText} -- above cap, CVP undefined`
    : `${capText}, ${dText}`;
}

function generateNonReducedBasis() {
  const e1 = [1, 0];
  const e2 = [0, 1];
  const kMag = 2 + Math.floor(Math.random() * 4);
  const k = Math.random() < 0.5 ? kMag : -kMag;
  return { b1: e1, b2: [e2[0] + k * e1[0], e2[1] + k * e1[1]] };
}

function createLatticeEngine(containerEl, options) {
  const {
    onBasisText,
    onCvpText,
    initialShowShortest = true,
    initialCvpEnabled = false,
    initialCvpRadiusFactor = 0.6,
  } = options;

  const latticeIndices = buildLatticeIndices(POINT_RANGE);

  let width = containerEl.clientWidth || 0;
  let height = containerEl.clientHeight || 0;
  let origin = { x: width / 2, y: height / 2 };

  let basis = { ...BASIS_A };
  let showShortest = initialShowShortest;
  let cvpEnabled = initialCvpEnabled;
  let cvpRadiusFactor = initialCvpRadiusFactor;
  let cvpTarget = null;

  const svg = createFullScreenSVG(containerEl);
  createArrowMarker(svg);
  const { grid, lattice, basis: basisLayer, shortest, cvp } = createLayers(svg, [
    "grid",
    "lattice",
    "basis",
    "shortest",
    "cvp",
  ]);

  const circles = lattice
    .selectAll("circle.lattice-point")
    .data(latticeIndices, (d) => `${d.i},${d.j}`)
    .join("circle")
    .attr("class", "lattice-point")
    .attr("r", 3.5)
    .attr("fill", COLORS.defaultPoint)
    .attr("opacity", 0.9);

  const basisLines = basisLayer
    .selectAll("line.basis-vector")
    .data(["b1", "b2"])
    .join("line")
    .attr("class", "basis-vector")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow-head)");

  const basisLabels = basisLayer
    .selectAll("text.basis-label")
    .data(["b1", "b2"])
    .join("text")
    .attr("class", "basis-label")
    .attr("font-size", 14)
    .attr("dy", -6);

  function latticeToScreen(i, j) {
    const x = i * basis.b1[0] + j * basis.b2[0];
    const y = i * basis.b1[1] + j * basis.b2[1];
    return {
      x: origin.x + x * SCALE,
      y: origin.y - y * SCALE,
    };
  }

  function basisVectorToScreen(v) {
    return {
      x: origin.x + v[0] * SCALE,
      y: origin.y - v[1] * SCALE,
    };
  }

  function drawGrid() {
    grid.selectAll("*").remove();

    const lines = [];
    for (let j = -POINT_RANGE; j <= POINT_RANGE; j++) {
      const p1 = latticeToScreen(-POINT_RANGE, j);
      const p2 = latticeToScreen(POINT_RANGE, j);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    for (let i = -POINT_RANGE; i <= POINT_RANGE; i++) {
      const p1 = latticeToScreen(i, -POINT_RANGE);
      const p2 = latticeToScreen(i, POINT_RANGE);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }

    grid
      .selectAll("line")
      .data(lines)
      .join("line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2)
      .attr("stroke", "#ddd")
      .attr("stroke-width", 0.7);
  }

  function updateBasisDisplay() {
    if (onBasisText) {
      onBasisText(formatBasisText(basis));
    }
  }

  function updateShortestVectors(animated = false, duration = 0) {
    circles.attr("fill", COLORS.defaultPoint).attr("r", 3.5);

    if (!showShortest) {
      shortest.selectAll("*").remove();
      return;
    }

    const shortestVectors = computeShortestPrimitiveVectors(basis, POINT_RANGE);
    const colorForIndex = (idx) => (idx === 0 ? COLORS.shortest1 : COLORS.shortest2);

    shortestVectors.forEach((v, idx) => {
      const color = colorForIndex(idx);
      const sel = circles.filter((d) => d.i === v.i && d.j === v.j);
      if (animated && duration > 0) {
        sel
          .transition("highlight")
          .duration(duration)
          .attr("fill", color)
          .attr("r", 6);
      } else {
        sel.attr("fill", color).attr("r", 6);
      }
    });

    const lineSel = shortest
      .selectAll("line.shortest-vector")
      .data(shortestVectors, (d) => `${d.i},${d.j}`);

    const lineEnter = lineSel
      .enter()
      .append("line")
      .attr("class", "shortest-vector")
      .attr("stroke-width", 2.5);

    const lineUpdate = lineSel.merge(lineEnter);

    if (animated && duration > 0) {
      lineUpdate
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", origin.x)
        .attr("y2", origin.y)
        .attr("stroke", (d, idx) => colorForIndex(idx))
        .transition("highlight")
        .duration(duration)
        .attr("x2", (d) => latticeToScreen(d.i, d.j).x)
        .attr("y2", (d) => latticeToScreen(d.i, d.j).y);
    } else {
      lineUpdate
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", (d) => latticeToScreen(d.i, d.j).x)
        .attr("y2", (d) => latticeToScreen(d.i, d.j).y)
        .attr("stroke", (d, idx) => colorForIndex(idx));
    }

    lineSel.exit().remove();
  }

  function updateCVPVisualization(animated = false, duration = 0) {
    const shortestVectors = computeShortestPrimitiveVectors(basis, POINT_RANGE);
    const shortestLen = Math.sqrt(shortestVectors[0].len2);
    const halfShortest = 0.5 * shortestLen;
    const halfShortestScreen = halfShortest * SCALE;

    const radius = cvpRadiusFactor * halfShortestScreen;
    const overCap = radius > halfShortestScreen;

    if (onCvpText) {
      onCvpText(
        formatCvpText({
          halfShortest,
          radiusFactor: cvpRadiusFactor,
          overCap,
        })
      );
    }

    if (!cvpEnabled || !cvpTarget) {
      cvp.selectAll("*").remove();
      return;
    }

    const circleSel = cvp.selectAll("circle.cvp-radius").data([cvpTarget]);
    const circleEnter = circleSel
      .enter()
      .append("circle")
      .attr("class", "cvp-radius")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 0)
      .attr("fill", "none")
      .attr("stroke", COLORS.cvpPoint)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4");

    const circleUpdate = circleSel.merge(circleEnter);

    if (animated && duration > 0) {
      circleUpdate
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .transition("cvp")
        .duration(duration)
        .attr("r", radius);
    } else {
      circleUpdate.attr("cx", (d) => d.x).attr("cy", (d) => d.y).attr("r", radius);
    }
    circleSel.exit().remove();

    const centerSel = cvp.selectAll("circle.cvp-center").data([cvpTarget]);
    const centerEnter = centerSel
      .enter()
      .append("circle")
      .attr("class", "cvp-center")
      .attr("fill", COLORS.cvpPoint);
    centerSel.merge(centerEnter).attr("cx", cvpTarget.x).attr("cy", cvpTarget.y).attr("r", 4);
    centerSel.exit().remove();

    if (radius > halfShortestScreen) {
      cvp.selectAll("line.cvp-line").remove();
      cvp.selectAll("circle.cvp-point").remove();
      return;
    }

    let best = null;
    let bestDist2 = Infinity;
    latticeIndices.forEach((p) => {
      const pos = latticeToScreen(p.i, p.j);
      const dx = pos.x - cvpTarget.x;
      const dy = pos.y - cvpTarget.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < bestDist2) {
        bestDist2 = dist2;
        best = { i: p.i, j: p.j, x: pos.x, y: pos.y };
      }
    });

    if (!best) {
      cvp.selectAll("line.cvp-line").remove();
      cvp.selectAll("circle.cvp-point").remove();
      return;
    }

    const bestDist = Math.sqrt(bestDist2);
    if (bestDist > radius) {
      cvp.selectAll("line.cvp-line").remove();
      cvp.selectAll("circle.cvp-point").remove();
      return;
    }

    const lineSel = cvp.selectAll("line.cvp-line").data([best]);
    const lineEnter = lineSel
      .enter()
      .append("line")
      .attr("class", "cvp-line")
      .attr("stroke", COLORS.cvpLine)
      .attr("stroke-width", 2);
    lineSel
      .merge(lineEnter)
      .attr("x1", cvpTarget.x)
      .attr("y1", cvpTarget.y)
      .attr("x2", best.x)
      .attr("y2", best.y);
    lineSel.exit().remove();

    const pointSel = cvp.selectAll("circle.cvp-point").data([best]);
    const pointEnter = pointSel
      .enter()
      .append("circle")
      .attr("class", "cvp-point")
      .attr("fill", "none")
      .attr("stroke", COLORS.cvpPoint)
      .attr("stroke-width", 2);
    pointSel.merge(pointEnter).attr("cx", best.x).attr("cy", best.y).attr("r", 8);
    pointSel.exit().remove();
  }

  function layoutStatic() {
    width = containerEl.clientWidth || 0;
    height = containerEl.clientHeight || 0;
    origin = { x: width / 2, y: height / 2 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    circles
      .attr("cx", (d) => latticeToScreen(d.i, d.j).x)
      .attr("cy", (d) => latticeToScreen(d.i, d.j).y);
    drawGrid();

    ["b1", "b2"].forEach((key, idx) => {
      const v = basis[key];
      const end = basisVectorToScreen(v);

      basisLines
        .filter((d, i) => i === idx)
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", end.x)
        .attr("y2", end.y)
        .attr("stroke", key === "b1" ? "#d62728" : "#1f77b4");

      basisLabels.filter((d, i) => i === idx).attr("x", end.x).attr("y", end.y).text(key);
    });

    updateBasisDisplay();
    updateShortestVectors(false, 0);
    updateCVPVisualization(false, 0);
  }

  function setBasis(newB1, newB2, duration = 1200) {
    basis = { b1: newB1, b2: newB2 };
    updateBasisDisplay();

    circles
      .transition("move")
      .duration(duration)
      .attr("cx", (d) => latticeToScreen(d.i, d.j).x)
      .attr("cy", (d) => latticeToScreen(d.i, d.j).y);

    drawGrid();

    ["b1", "b2"].forEach((key, idx) => {
      const v = basis[key];
      const end = basisVectorToScreen(v);

      basisLines
        .filter((d, i) => i === idx)
        .transition("move")
        .duration(duration)
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", end.x)
        .attr("y2", end.y);

      basisLabels
        .filter((d, i) => i === idx)
        .transition("move")
        .duration(duration)
        .attr("x", end.x)
        .attr("y", end.y);
    });

    updateShortestVectors(true, duration);
    updateCVPVisualization(false, 0);
  }

  layoutStatic();

  const resizeHandler = () => layoutStatic();
  window.addEventListener("resize", resizeHandler);

  svg.on("click", (event) => {
    if (!cvpEnabled) return;
    const [x, y] = d3.pointer(event, svg.node());
    cvpTarget = { x, y };
    updateCVPVisualization(true, 600);
  });

  return {
    setShowShortest(flag) {
      showShortest = flag;
      updateShortestVectors(false, 0);
    },
    setCvpEnabled(flag) {
      cvpEnabled = flag;
      if (!flag) {
        cvpTarget = null;
        cvp.selectAll("*").remove();
      }
      updateCVPVisualization(false, 0);
    },
    setCvpRadiusFactor(value) {
      cvpRadiusFactor = value;
      updateCVPVisualization(false, 0);
    },
    useBasisA() {
      setBasis(BASIS_A.b1, BASIS_A.b2);
    },
    useBasisB() {
      setBasis(BASIS_B.b1, BASIS_B.b2);
    },
    useRandomBasis() {
      const { b1, b2 } = generateNonReducedBasis();
      setBasis(b1, b2);
    },
    destroy() {
      window.removeEventListener("resize", resizeHandler);
      svg.on("click", null);
      svg.remove();
    },
  };
}

function LatticeDemo() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  const [basisText, setBasisText] = useState("");
  const [cvpText, setCvpText] = useState("");
  const [showShortest, setShowShortest] = useState(true);
  const [cvpEnabled, setCvpEnabled] = useState(false);
  const [cvpRadiusFactor, setCvpRadiusFactor] = useState(0.6);
  const [cvpUnlockedBeyondCap, setCvpUnlockedBeyondCap] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const engine = createLatticeEngine(containerRef.current, {
      onBasisText: setBasisText,
      onCvpText: setCvpText,
      initialShowShortest: showShortest,
      initialCvpEnabled: cvpEnabled,
      initialCvpRadiusFactor: cvpRadiusFactor,
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleBasisA = () => {
    engineRef.current?.useBasisA();
  };

  const handleBasisB = () => {
    engineRef.current?.useBasisB();
  };

  const handleRandom = () => {
    engineRef.current?.useRandomBasis();
  };

  const handleShortestToggle = (e) => {
    const flag = e.target.checked;
    setShowShortest(flag);
    engineRef.current?.setShowShortest(flag);
  };

  const handleCvpToggle = (e) => {
    const flag = e.target.checked;
    setCvpEnabled(flag);
    setCvpUnlockedBeyondCap(false);
    engineRef.current?.setCvpEnabled(flag);
  };

  const handleRadiusChange = (e) => {
    let raw = parseFloat(e.target.value);
    if (!cvpUnlockedBeyondCap && raw > 1.0) {
      raw = 0.99;
      e.target.value = raw.toString();
      setCvpUnlockedBeyondCap(true);
    }
    setCvpRadiusFactor(raw);
    engineRef.current?.setCvpRadiusFactor(raw);
  };

  return (
    <section style={{ height: "100%", width: "100%" }}>
      <div
        className="section"
        style={{
          height: "100%",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
      >
        <div
          className="box"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            className="is-flex is-justify-content-space-between is-align-items-center"
            style={{ marginBottom: "0.75rem", gap: "1rem" }}
          >
            <div className="field is-grouped is-grouped-multiline">
              <p className="control">
                <button className="button is-small is-link" onClick={handleBasisA}>
                  Basis A
                </button>
              </p>
              <p className="control">
                <button className="button is-small is-link is-light" onClick={handleBasisB}>
                  Basis B
                </button>
              </p>
              <p className="control">
                <button className="button is-small is-info" onClick={handleRandom}>
                  Random non-reduced
                </button>
              </p>

              <p className="control">
                <label className="checkbox is-small">
                  <input
                    type="checkbox"
                    checked={showShortest}
                    onChange={handleShortestToggle}
                    style={{ marginRight: "0.35rem" }}
                  />
                  Show shortest vectors
                </label>
              </p>

              <p className="control">
                <label className="checkbox is-small">
                  <input
                    type="checkbox"
                    checked={cvpEnabled}
                    onChange={handleCvpToggle}
                    style={{ marginRight: "0.35rem" }}
                  />
                  CVP mode (click to place target)
                </label>
              </p>

              <div className="field is-horizontal" style={{ marginLeft: "0.75rem" }}>
                <div className="field-label is-normal">
                  <label className="label is-small" style={{ fontSize: "0.8rem" }}>
                    Radius factor
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <input
                        className="slider is-fullwidth"
                        type="range"
                        min="0"
                        max="1.5"
                        step="0.01"
                        value={cvpRadiusFactor}
                        onChange={handleRadiusChange}
                        style={{ width: "120px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="is-flex is-flex-direction-column is-align-items-flex-end"
              style={{ fontSize: "0.8rem" }}
            >
              <div>{basisText}</div>
              <div className="has-text-grey">{cvpText}</div>
            </div>
          </div>

          <div
            className="box"
            style={{
              flex: 1,
              minHeight: 0,
              padding: 0,
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 0 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatticeDemo;
