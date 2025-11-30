import * as d3 from "d3";
import {
  BASIS_A,
  POINT_RANGE,
  DEFAULT_SCALE,
  buildLatticeIndices,
  computeDualBasis,
  computeShortestPrimitiveVectors,
  formatBasisText,
  formatCvpText,
  reduceVectorModLattice,
} from "./latticeMath";

export const COLORS = {
  defaultPoint: "#222",
  shortest1: "#ff7f0e",
  shortest2: "#9467bd",
  cvpPoint: "#2ca02c",
  cvpLine: "#2ca02c",
  dualPoint: "#e377c2",
  dualGrid: "#c5b0d5",
  dualBasis1: "#17becf",
  dualBasis2: "#bcbd22",
};

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

function createLatticeEngine(containerEl, options) {
  const {
    onBasisText,
    onDualBasisText,
    onCvpText,
    onPointSelected,
    onBackgroundClick,
    initialBasis = BASIS_A,
    initialShowPrimal = true,
    initialShowDual = false,
    initialShowShortest = true,
    initialShortestSpace = "primal", // "primal" | "dual"
    initialCvpEnabled = false,
    initialCvpRadiusFactor = 0.6,
    initialCvpSpace = "primal", // "primal" | "dual"
    initialScale = DEFAULT_SCALE,
    dualPointVariant = "hollow", // "hollow" | "solid"
    dualPointColor = null,
    showCvpResidualArrow = false,
    showFundamentalDomain = false,
    fundamentalSpace = "primal",
    showCvpOriginCircle = false,
    enableModProjection = false,
    modProjectionDivider = 1,
    onModVectorComputed = null,
  } = options;

  const latticeIndices = buildLatticeIndices(POINT_RANGE);
  const resolvedDualPointColor = dualPointColor ?? COLORS.dualPoint;

  let width = containerEl.clientWidth || 0;
  let height = containerEl.clientHeight || 0;
  let origin = { x: width / 2, y: height / 2 };
  let scale = initialScale;

  let basis = { ...initialBasis };
  let showPrimal = initialShowPrimal;
  let showDual = initialShowDual;
  let showShortest = initialShowShortest;
  let shortestSpace = initialShortestSpace;
  let cvpEnabled = initialCvpEnabled;
  let cvpRadiusFactor = initialCvpRadiusFactor;
  let cvpSpace = initialCvpSpace;
  let cvpTarget = null;
  let showOriginCircle = showCvpOriginCircle;
  let modVector = null;
  let modProjectionEnabled = enableModProjection;
  let modProjectionDiv = modProjectionDivider;
  const svg = createFullScreenSVG(containerEl);
  createArrowMarker(svg);
  const {
    grid,
    dualGrid,
    fundamental,
    lattice,
    dualLattice,
    basis: basisLayer,
    dualBasis,
    shortest,
    cvp,
    mod,
  } = createLayers(svg, [
    "grid",
    "dualGrid",
    "fundamental",
    "lattice",
    "dualLattice",
    "basis",
    "dualBasis",
    "shortest",
    "cvp",
    "mod",
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

  const dualBasisLines = dualBasis
    .selectAll("line.dual-basis-vector")
    .data(["b1", "b2"])
    .join("line")
    .attr("class", "dual-basis-vector")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "6,4")
    .attr("marker-end", "url(#arrow-head)")
    .attr("opacity", showDual ? 1 : 0);

  const dualBasisLabels = dualBasis
    .selectAll("text.dual-basis-label")
    .data(["b1*", "b2*"])
    .join("text")
    .attr("class", "dual-basis-label")
    .attr("font-size", 13)
    .attr("dy", -6)
    .attr("opacity", showDual ? 1 : 0);

  function getSpaceBasis(space) {
    return space === "dual" ? computeDualBasis(basis) : basis;
  }

  function pointToScreen(space, i, j) {
    const useBasis = getSpaceBasis(space);
    const x = i * useBasis.b1[0] + j * useBasis.b2[0];
    const y = i * useBasis.b1[1] + j * useBasis.b2[1];
    return {
      x: origin.x + x * scale,
      y: origin.y - y * scale,
    };
  }

  function vectorToScreen(vec) {
    return {
      x: origin.x + vec[0] * scale,
      y: origin.y - vec[1] * scale,
    };
  }

  function drawFundamentalDomain() {
    fundamental.selectAll("*").remove();
    if (!showFundamentalDomain) return;
    const space = fundamentalSpace === "dual" ? "dual" : "primal";
    if ((space === "dual" && !showDual) || (space === "primal" && !showPrimal)) return;

    const useBasis = getSpaceBasis(space);
    const v1 = useBasis.b1;
    const v2 = useBasis.b2;
    const pts = [
      { x: 0, y: 0 },
      { x: v1[0], y: v1[1] },
      { x: v1[0] + v2[0], y: v1[1] + v2[1] },
      { x: v2[0], y: v2[1] },
    ];

    const pointStr = pts
      .map((p) => {
        const s = vectorToScreen([p.x, p.y]);
        return `${s.x},${s.y}`;
      })
      .join(" ");

    fundamental
      .append("polygon")
      .attr("class", "fundamental-domain")
      .attr("points", pointStr)
      .attr("fill", "rgba(0,0,0,0.06)")
      .attr("stroke", "rgba(0,0,0,0.15)")
      .attr("stroke-width", 1);
  }

  function drawGrid(animated = false) {
    if (!showPrimal) {
      grid.selectAll("line").remove();
      return;
    }

    const lines = [];
    for (let j = -POINT_RANGE; j <= POINT_RANGE; j++) {
      const p1 = pointToScreen("primal", -POINT_RANGE, j);
      const p2 = pointToScreen("primal", POINT_RANGE, j);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    for (let i = -POINT_RANGE; i <= POINT_RANGE; i++) {
      const p1 = pointToScreen("primal", i, -POINT_RANGE);
      const p2 = pointToScreen("primal", i, POINT_RANGE);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }

    const lineSel = grid.selectAll("line").data(lines);
    const lineEnter = lineSel
      .enter()
      .append("line")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 0.7);

    const merged = lineSel.merge(lineEnter);

    if (animated) {
      merged
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", origin.x)
        .attr("y2", origin.y)
        .transition("intro-grid")
        .duration(800)
        .attr("x1", (d) => d.x1)
        .attr("y1", (d) => d.y1)
        .attr("x2", (d) => d.x2)
        .attr("y2", (d) => d.y2);
    } else {
      merged
        .attr("x1", (d) => d.x1)
        .attr("y1", (d) => d.y1)
        .attr("x2", (d) => d.x2)
        .attr("y2", (d) => d.y2);
    }

    lineSel.exit().remove();
  }

  function updateDualGrid(animated = false, duration = 0) {
    if (!showDual) {
      dualGrid.selectAll("line").remove();
      return;
    }

    const lines = [];
    for (let j = -POINT_RANGE; j <= POINT_RANGE; j++) {
      const p1 = pointToScreen("dual", -POINT_RANGE, j);
      const p2 = pointToScreen("dual", POINT_RANGE, j);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    for (let i = -POINT_RANGE; i <= POINT_RANGE; i++) {
      const p1 = pointToScreen("dual", i, -POINT_RANGE);
      const p2 = pointToScreen("dual", i, POINT_RANGE);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }

    const lineSel = dualGrid.selectAll("line.dual-grid-line").data(lines);
    const lineEnter = lineSel
      .enter()
      .append("line")
      .attr("class", "dual-grid-line")
      .attr("stroke", COLORS.dualGrid)
      .attr("stroke-width", 0.8)
      .attr("stroke-dasharray", "4,4");

    const merged = lineSel.merge(lineEnter);

    if (animated && duration > 0) {
      merged
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", origin.x)
        .attr("y2", origin.y)
        .transition("dual-grid")
        .duration(duration)
        .attr("x1", (d) => d.x1)
        .attr("y1", (d) => d.y1)
        .attr("x2", (d) => d.x2)
        .attr("y2", (d) => d.y2);
    } else {
      merged
        .attr("x1", (d) => d.x1)
        .attr("y1", (d) => d.y1)
        .attr("x2", (d) => d.x2)
        .attr("y2", (d) => d.y2);
    }

    lineSel.exit().remove();
  }

  function updateDualLattice(animated = false, duration = 0, fromOrigin = true) {
    const data = showDual ? latticeIndices : [];
    const color = resolvedDualPointColor;
    const pointSel = dualLattice
      .selectAll("circle.dual-point")
      .data(data, (d) => `${d.i},${d.j}`);

    pointSel.exit().remove();

    if (!showDual) return;

    const pointEnter = pointSel
      .enter()
      .append("circle")
      .attr("class", "dual-point")
      .attr("fill", dualPointVariant === "solid" ? color : "white")
      .attr("stroke", dualPointVariant === "solid" ? "none" : color)
      .attr("stroke-width", dualPointVariant === "solid" ? 0 : 1.5)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("opacity", 0.9)
      .attr("r", animated && duration > 0 ? 0 : 3)
      .attr("opacity", (d) => {
        // If variant is hollow, make overlap ring more visible
        return dualPointVariant === "hollow" ? 0.8 : 0.9;
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        const dualBasisVecs = computeDualBasis(basis);
        const x = d.i * dualBasisVecs.b1[0] + d.j * dualBasisVecs.b2[0];
        const y = d.i * dualBasisVecs.b1[1] + d.j * dualBasisVecs.b2[1];
        if (onPointSelected) {
          onPointSelected({
            type: "dual",
            i: d.i,
            j: d.j,
            x,
            y,
            basis: { b1: [...dualBasisVecs.b1], b2: [...dualBasisVecs.b2] },
          });
        }

    if (enableModProjection) {
      const modBasis = getSpaceBasis("dual");
      const shortestVectors = computeShortestPrimitiveVectors(modBasis, POINT_RANGE);
      const shortestLen = Math.sqrt(shortestVectors[0].len2);
      const halfShortest = 0.5 * shortestLen;
      const coeff1 = d.i / modProjectionDiv;
      const coeff2 = d.j / modProjectionDiv;
      const rawVec = [
        coeff1 * modBasis.b1[0] + coeff2 * modBasis.b2[0],
        coeff1 * modBasis.b1[1] + coeff2 * modBasis.b2[1],
      ];
      const distCoord = Math.hypot(rawVec[0], rawVec[1]);
      const radiusCoord = cvpRadiusFactor * halfShortest;
      if (distCoord <= radiusCoord) {
        const reduced = reduceVectorModLattice(rawVec, modBasis);
        const modVec = reduced.vec;
        modVector = { vec: modVec, screen: vectorToScreen(modVec) };
      } else {
        modVector = null;
      }
      updateModVectorDisplay();
      if (onModVectorComputed) {
        onModVectorComputed(modVector ? modVector.vec : null);
      }
    }
      });

    const merged = pointSel.merge(pointEnter);

    const setPosition = (sel) =>
      sel
        .attr("cx", (d) => pointToScreen("dual", d.i, d.j).x)
        .attr("cy", (d) => pointToScreen("dual", d.i, d.j).y)
        .attr("r", 3.2)
        .attr("fill", dualPointVariant === "solid" ? color : "white")
        .attr("stroke", dualPointVariant === "solid" ? "none" : color)
        .attr("stroke-width", dualPointVariant === "solid" ? 0 : 1.6)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");

    if (animated && duration > 0) {
      if (fromOrigin) {
        merged.attr("cx", origin.x).attr("cy", origin.y);
      }
      merged.transition("dual").duration(duration).call(setPosition);
    } else {
      setPosition(merged);
    }

    dualLattice.attr("display", showDual ? null : "none");
  }

  function updateBasisDisplay() {
    if (onBasisText) {
      onBasisText(formatBasisText(basis));
    }
    if (onDualBasisText) {
      onDualBasisText(formatBasisText(computeDualBasis(basis)));
    }
  }

  function updateDualBasisVectors(animated = false, duration = 0) {
    const dualBasisVecs = computeDualBasis(basis);

    if (!showDual) {
      dualBasisLines.attr("opacity", 0);
      dualBasisLabels.attr("opacity", 0);
      return;
    }

    const colorForIndex = (idx) =>
      idx === 0 ? COLORS.dualBasis1 : COLORS.dualBasis2;

    ["b1", "b2"].forEach((key, idx) => {
      const v = dualBasisVecs[key];
      const end = vectorToScreen(v);

      const line = dualBasisLines.filter((_, i) => i === idx);
      const label = dualBasisLabels.filter((_, i) => i === idx);

      if (animated && duration > 0) {
        line
          .attr("stroke", colorForIndex(idx))
          .attr("opacity", 1)
          .attr("x1", origin.x)
          .attr("y1", origin.y)
          .attr("x2", origin.x)
          .attr("y2", origin.y)
          .transition("dual-basis")
          .duration(duration)
          .attr("x2", end.x)
          .attr("y2", end.y);

        label
          .attr("opacity", 1)
          .attr("x", origin.x)
          .attr("y", origin.y)
          .text(idx === 0 ? "b1*" : "b2*")
          .transition("dual-basis-label")
          .duration(duration)
          .attr("x", end.x)
          .attr("y", end.y);
      } else {
        line
          .interrupt("dual-basis")
          .attr("stroke", colorForIndex(idx))
          .attr("opacity", 1)
          .attr("x1", origin.x)
          .attr("y1", origin.y)
          .attr("x2", end.x)
          .attr("y2", end.y);

        label
          .interrupt("dual-basis-label")
          .attr("opacity", 1)
          .attr("x", end.x)
          .attr("y", end.y)
          .text(idx === 0 ? "b1*" : "b2*");
      }
    });
  }

  function updateShortestVectors(animated = false, duration = 0) {
    lattice
      .selectAll("circle.lattice-point")
      .attr("fill", COLORS.defaultPoint)
      .attr("r", 3.5)
      .attr("display", showPrimal ? null : "none");

    const baseDualColor = resolvedDualPointColor;
    dualLattice
      .selectAll("circle.dual-point")
      .attr("fill", dualPointVariant === "solid" ? baseDualColor : "white")
      .attr("stroke", dualPointVariant === "solid" ? "none" : baseDualColor)
      .attr("stroke-width", dualPointVariant === "solid" ? 0 : 1.6)
      .attr("r", 3.2)
      .attr("display", showDual ? null : "none");

    if (!showShortest) {
      shortest.selectAll("*").remove();
      return;
    }

    const useSpace = shortestSpace;
    if ((useSpace === "primal" && !showPrimal) || (useSpace === "dual" && !showDual)) {
      shortest.selectAll("*").remove();
      return;
    }
    const useBasis = getSpaceBasis(useSpace);
    const shortestVectors = computeShortestPrimitiveVectors(useBasis, POINT_RANGE);
    const targetSelection =
      useSpace === "dual"
        ? dualLattice.selectAll("circle.dual-point")
        : lattice.selectAll("circle.lattice-point");

    const colorForIndex = (idx) =>
      idx === 0 ? COLORS.shortest1 : COLORS.shortest2;

    shortestVectors.forEach((v, idx) => {
      const color = colorForIndex(idx);
      const sel = targetSelection.filter((d) => d.i === v.i && d.j === v.j);
      if (animated && duration > 0) {
        sel
          .transition("highlight")
          .duration(duration)
          .attr("fill", color)
          .attr("stroke", color)
          .attr("r", 6);
      } else {
        sel.attr("fill", color).attr("stroke", color).attr("r", 6);
      }
    });

    const lineSel = shortest
      .selectAll("line.shortest-vector")
      .data(shortestVectors, (d) => `${d.i},${d.j},${useSpace}`);

    const lineEnter = lineSel
      .enter()
      .append("line")
      .attr("class", "shortest-vector")
      .attr("stroke-width", 2.5);

    const lineUpdate = lineSel.merge(lineEnter);

    const computeEnd = (d) => pointToScreen(useSpace, d.i, d.j);

    if (animated && duration > 0) {
      lineUpdate
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", origin.x)
        .attr("y2", origin.y)
        .attr("stroke", (d, idx) => colorForIndex(idx))
        .transition("highlight")
        .duration(duration)
        .attr("x2", (d) => computeEnd(d).x)
        .attr("y2", (d) => computeEnd(d).y);
    } else {
      lineUpdate
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", (d) => computeEnd(d).x)
        .attr("y2", (d) => computeEnd(d).y)
        .attr("stroke", (d, idx) => colorForIndex(idx));
    }

    lineSel.exit().remove();
  }

  function updateCVPVisualization(animated = false, duration = 0) {
    const clearBestVectors = () => {
      cvp.selectAll("line.cvp-line").remove();
      cvp.selectAll("line.cvp-xprime-arrow").remove();
      cvp.selectAll("text.cvp-xprime-label").remove();
      cvp.selectAll("text.cvp-k-label").remove();
      cvp.selectAll("circle.cvp-point").remove();
      if (!modProjectionEnabled) {
        modVector = null;
        mod.selectAll("*").remove();
      }
    };

    const useSpace = cvpSpace;
    const useBasis = getSpaceBasis(useSpace);
    const shortestVectors = computeShortestPrimitiveVectors(useBasis, POINT_RANGE);
    const shortestLen = Math.sqrt(shortestVectors[0].len2);
    const halfShortest = 0.5 * shortestLen;
    const halfShortestScreen = halfShortest * scale;

    const radius = cvpRadiusFactor * halfShortestScreen;
    const overCap = radius > halfShortestScreen;

    const spaceHidden =
      (useSpace === "primal" && !showPrimal) || (useSpace === "dual" && !showDual);

    const updateOriginCircle = () => {
      if (!showOriginCircle || spaceHidden) {
        cvp.selectAll("circle.cvp-mod-radius").remove();
        return;
      }
      const sel = cvp.selectAll("circle.cvp-mod-radius").data([radius]);
      sel
        .enter()
        .append("circle")
        .attr("class", "cvp-mod-radius")
        .attr("fill", "none")
        .attr("stroke", "#666")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "6,4")
        .merge(sel)
        .attr("cx", origin.x)
        .attr("cy", origin.y)
        .attr("r", radius);
      sel.exit().remove();
    };

    if (onCvpText) {
      onCvpText(
        formatCvpText({
          halfShortest,
          radiusFactor: cvpRadiusFactor,
          overCap,
        })
      );
    }

    updateOriginCircle();

    if (!cvpEnabled || spaceHidden) {
      cvp.selectAll("circle.cvp-radius").remove();
      cvp.selectAll("circle.cvp-center").remove();
      cvp.selectAll("line.cvp-x-arrow").remove();
      cvp.selectAll("text.cvp-x-label").remove();
      clearBestVectors();
      return;
    }

    if (!cvpTarget) {
      cvp.selectAll("circle.cvp-radius").remove();
      cvp.selectAll("circle.cvp-center").remove();
      cvp.selectAll("line.cvp-x-arrow").remove();
      cvp.selectAll("text.cvp-x-label").remove();
      clearBestVectors();
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
      circleUpdate
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", radius);
    }
    circleSel.exit().remove();

    const centerSel = cvp.selectAll("circle.cvp-center").data([cvpTarget]);
    const centerEnter = centerSel
      .enter()
      .append("circle")
      .attr("class", "cvp-center")
      .attr("fill", COLORS.cvpPoint);
    centerSel
      .merge(centerEnter)
      .attr("cx", cvpTarget.x)
      .attr("cy", cvpTarget.y)
      .attr("r", 4);
    centerSel.exit().remove();

    // Arrow from origin to target (x)
    const xArrowSel = cvp.selectAll("line.cvp-x-arrow").data([cvpTarget]);
    const xArrowEnter = xArrowSel
      .enter()
      .append("line")
      .attr("class", "cvp-x-arrow")
      .attr("stroke", COLORS.cvpPoint)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow-head)");
    xArrowSel
      .merge(xArrowEnter)
      .attr("x1", origin.x)
      .attr("y1", origin.y)
      .attr("x2", cvpTarget.x)
      .attr("y2", cvpTarget.y);
    xArrowSel.exit().remove();

    const xLabelSel = cvp.selectAll("text.cvp-x-label").data([cvpTarget]);
    const xLabelEnter = xLabelSel
      .enter()
      .append("text")
      .attr("class", "cvp-x-label")
      .attr("font-size", 13)
      .attr("fill", COLORS.cvpPoint);
    xLabelSel
      .merge(xLabelEnter)
      .attr("x", cvpTarget.x + 8)
      .attr("y", cvpTarget.y - 6)
      .text("x");
    xLabelSel.exit().remove();

    if (radius > halfShortestScreen) {
      clearBestVectors();
      return;
    }

    let best = null;
    let bestDist2 = Infinity;
    latticeIndices.forEach((p) => {
      const pos = pointToScreen(useSpace, p.i, p.j);
      const dx = pos.x - cvpTarget.x;
      const dy = pos.y - cvpTarget.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < bestDist2) {
        bestDist2 = dist2;
        best = { i: p.i, j: p.j, x: pos.x, y: pos.y };
      }
    });

    if (!best) {
      clearBestVectors();
      return;
    }

    const bestDist = Math.sqrt(bestDist2);
    if (bestDist > radius) {
      clearBestVectors();
      return;
    }

    // Arrow from K_{L*}(x) (best) to x representing x'
    // Arrow/label for x' (optional)
    if (showCvpResidualArrow) {
      const xPrimeArrowSel = cvp.selectAll("line.cvp-xprime-arrow").data([best]);
      const xPrimeArrowEnter = xPrimeArrowSel
        .enter()
        .append("line")
        .attr("class", "cvp-xprime-arrow")
        .attr("stroke", COLORS.cvpLine)
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow-head)");
      xPrimeArrowSel
        .merge(xPrimeArrowEnter)
        .attr("x1", best.x)
        .attr("y1", best.y)
        .attr("x2", cvpTarget.x)
        .attr("y2", cvpTarget.y);
      xPrimeArrowSel.exit().remove();

      const xPrimeLabelSel = cvp.selectAll("text.cvp-xprime-label").data([best]);
      const xPrimeLabelEnter = xPrimeLabelSel
        .enter()
        .append("text")
        .attr("class", "cvp-xprime-label")
        .attr("font-size", 13)
        .attr("fill", COLORS.cvpLine);
      xPrimeLabelSel
        .merge(xPrimeLabelEnter)
        .attr("x", (best.x + cvpTarget.x) / 2 + 6)
        .attr("y", (best.y + cvpTarget.y) / 2 - 6)
        .text("x'");
      xPrimeLabelSel.exit().remove();
    } else {
      cvp.selectAll("line.cvp-xprime-arrow").remove();
      cvp.selectAll("text.cvp-xprime-label").remove();
    }

    // Mark closest lattice point K_{L*}(x)
    const pointSel = cvp.selectAll("circle.cvp-point").data([best]);
    const pointEnter = pointSel
      .enter()
      .append("circle")
      .attr("class", "cvp-point")
      .attr("fill", "none")
      .attr("stroke", COLORS.cvpPoint)
      .attr("stroke-width", 2);
    pointSel
      .merge(pointEnter)
      .attr("cx", best.x)
      .attr("cy", best.y)
      .attr("r", 8);
    pointSel.exit().remove();

    const kLabelSel = cvp.selectAll("text.cvp-k-label").data([best]);
    const kLabelEnter = kLabelSel
      .enter()
      .append("text")
      .attr("class", "cvp-k-label")
      .attr("font-size", 12)
      .attr("fill", "#333");
    kLabelSel
      .merge(kLabelEnter)
      .attr("x", best.x + 8)
      .attr("y", best.y - 6)
      .text("K_{L*}(x)");
    kLabelSel.exit().remove();
  }

  function updateModVectorDisplay() {
    mod.selectAll("*").remove();
    if (!modVector) return;

    mod
      .append("line")
      .attr("class", "mod-vector")
      .attr("x1", origin.x)
      .attr("y1", origin.y)
      .attr("x2", modVector.screen.x)
      .attr("y2", modVector.screen.y)
      .attr("stroke", "#444")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow-head)");

    mod
      .append("circle")
      .attr("class", "mod-point")
      .attr("cx", modVector.screen.x)
      .attr("cy", modVector.screen.y)
      .attr("r", 5)
      .attr("fill", "#555");

    mod
      .append("text")
      .attr("class", "mod-label")
      .attr("x", modVector.screen.x + 6)
      .attr("y", modVector.screen.y - 6)
      .attr("font-size", 12)
      .attr("fill", "#333")
      .text("mod P(L*)");
  }


  function layoutStatic(animated = false) {
    width = containerEl.clientWidth || 0;
    height = containerEl.clientHeight || 0;
    origin = { x: width / 2, y: height / 2 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    lattice.attr("display", showPrimal ? null : "none");
    basisLayer.attr("display", showPrimal ? null : "none");
    grid.attr("display", showPrimal ? null : "none");

    if (showPrimal) {
      if (animated) {
        circles
          .attr("cx", origin.x)
          .attr("cy", origin.y)
          .attr("r", 0)
          .attr("opacity", 0)
          .transition("intro-points")
          .delay((d) => {
            const dist = Math.sqrt(d.i * d.i + d.j * d.j);
            return dist * 40;
          })
          .duration(600)
          .attr("cx", (d) => pointToScreen("primal", d.i, d.j).x)
          .attr("cy", (d) => pointToScreen("primal", d.i, d.j).y)
          .attr("r", 3.5)
          .attr("opacity", 0.9);
      } else {
        circles
          .interrupt("intro-points")
          .attr("cx", (d) => pointToScreen("primal", d.i, d.j).x)
          .attr("cy", (d) => pointToScreen("primal", d.i, d.j).y)
          .attr("r", 3.5)
          .attr("opacity", 0.9);
      }
    }

    drawGrid(animated);
    updateDualGrid(animated, animated ? 800 : 0);
    updateDualLattice(animated, animated ? 800 : 0, true);

    ["b1", "b2"].forEach((key, idx) => {
      const v = basis[key];
      const end = vectorToScreen(v);

      const line = basisLines.filter((d, i) => i === idx);
      const label = basisLabels.filter((d, i) => i === idx);

      if (animated) {
        line
          .attr("x1", origin.x)
          .attr("y1", origin.y)
          .attr("x2", origin.x)
          .attr("y2", origin.y)
          .attr("stroke", key === "b1" ? "#d62728" : "#1f77b4")
          .transition("intro-basis")
          .duration(800)
          .attr("x2", end.x)
          .attr("y2", end.y);

        label
          .attr("x", origin.x)
          .attr("y", origin.y)
          .text(key)
          .transition("intro-basis-label")
          .duration(800)
          .attr("x", end.x)
          .attr("y", end.y);
      } else {
        line
          .interrupt("intro-basis")
          .attr("x1", origin.x)
          .attr("y1", origin.y)
          .attr("x2", end.x)
          .attr("y2", end.y)
          .attr("stroke", key === "b1" ? "#d62728" : "#1f77b4");

        label
          .interrupt("intro-basis-label")
          .attr("x", end.x)
          .attr("y", end.y)
          .text(key);
      }
    });

    updateBasisDisplay();
    drawFundamentalDomain();
    updateDualBasisVectors(animated, animated ? 900 : 0);
    updateShortestVectors(animated, animated ? 900 : 0);
    updateCVPVisualization(false, 0);
    updateModVectorDisplay();
  }

  function applyBasis(newB1, newB2, duration = 1200) {
    basis = { b1: newB1, b2: newB2 };
    updateBasisDisplay();

    circles
      .transition("move")
      .duration(duration)
      .attr("cx", (d) => pointToScreen("primal", d.i, d.j).x)
      .attr("cy", (d) => pointToScreen("primal", d.i, d.j).y);

    drawGrid();
    updateDualGrid(true, duration);
    updateDualLattice(true, duration, true);

    ["b1", "b2"].forEach((key, idx) => {
      const v = basis[key];
      const end = vectorToScreen(v);

      basisLines
        .filter((d, i) => i === idx)
        .transition("move")
        .duration(duration)
        .attr("x1", origin.x)
        .attr("y1", origin.y)
        .attr("x2", end.x)
        .attr("y2", end.y);

      basisLabels
        .filter((_, i) => i === idx)
        .transition("move")
        .duration(duration)
        .attr("x", end.x)
        .attr("y", end.y);
    });

    updateDualBasisVectors(true, duration);
    updateShortestVectors(true, duration);
    updateCVPVisualization(false, 0);
    updateModVectorDisplay();
    drawFundamentalDomain();
  }

  // initial layout
  layoutStatic(false);

  const resizeHandler = () => layoutStatic(false);
  window.addEventListener("resize", resizeHandler);

  svg.on("click", (event) => {
    if (onBackgroundClick) {
      onBackgroundClick();
    }
    if (!cvpEnabled) return;
    const [x, y] = d3.pointer(event, svg.node());
    cvpTarget = { x, y };
    updateCVPVisualization(true, 600);
  });

  circles.on("click", (event, d) => {
    event.stopPropagation();
    const useBasis = basis;
    const x = d.i * useBasis.b1[0] + d.j * useBasis.b2[0];
    const y = d.i * useBasis.b1[1] + d.j * useBasis.b2[1];

    if (onPointSelected) {
      onPointSelected({
        type: "primal",
        i: d.i,
        j: d.j,
        x,
        y,
        basis: { b1: [...useBasis.b1], b2: [...useBasis.b2] },
      });
    }
  });

  return {
    setShowPrimal(flag) {
      showPrimal = flag;
      lattice.attr("display", flag ? null : "none");
      basisLayer.attr("display", flag ? null : "none");
      grid.attr("display", flag ? null : "none");
      drawGrid();
      drawFundamentalDomain();
      updateShortestVectors(false, 0);
      if (cvpSpace === "primal" && !flag) {
        cvp.selectAll("*").remove();
      }
    },
    setShowDual(flag) {
      showDual = flag;
      updateDualGrid(true, 600);
      updateDualLattice(true, 600, true);
      updateDualBasisVectors(true, 600);
      updateShortestVectors(false, 0);
      drawFundamentalDomain();
      if (cvpSpace === "dual" && !flag) {
        cvp.selectAll("*").remove();
      }
    },
    setShowShortest(flag) {
      showShortest = flag;
      updateShortestVectors(false, 0);
    },
    setShortestSpace(space) {
      shortestSpace = space;
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
    setCvpSpace(space) {
      cvpSpace = space;
      updateCVPVisualization(false, 0);
    },
    setShowOriginCircle(flag) {
      showOriginCircle = flag;
      updateCVPVisualization(false, 0);
    },
    setModProjection(enabled, divider = modProjectionDiv) {
      const dividerChanged = divider !== modProjectionDiv;
      modProjectionEnabled = enabled;
      modProjectionDiv = divider;
      if (!enabled || dividerChanged) {
        modVector = null;
        mod.selectAll("*").remove();
        if (onModVectorComputed) {
          onModVectorComputed(null);
        }
      }
      updateModVectorDisplay();
    },
    setScale(newScale, duration = 600) {
      scale = newScale;
      if (modVector) {
        modVector = { vec: modVector.vec, screen: vectorToScreen(modVector.vec) };
      }

      circles
        .transition("scale")
        .duration(duration)
        .attr("cx", (d) => pointToScreen("primal", d.i, d.j).x)
        .attr("cy", (d) => pointToScreen("primal", d.i, d.j).y);

      dualLattice
        .selectAll("circle.dual-point")
        .transition("scale")
        .duration(duration)
        .attr("cx", (d) => pointToScreen("dual", d.i, d.j).x)
        .attr("cy", (d) => pointToScreen("dual", d.i, d.j).y);

      ["b1", "b2"].forEach((key, idx) => {
        const v = basis[key];
        const end = vectorToScreen(v);
        basisLines
          .filter((d, i) => i === idx)
          .transition("scale")
          .duration(duration)
          .attr("x2", end.x)
          .attr("y2", end.y);

        basisLabels
          .filter((_, i) => i === idx)
          .transition("scale")
          .duration(duration)
          .attr("x", end.x)
          .attr("y", end.y);
      });

      drawGrid(false);
      updateDualGrid(false, 0);
      updateDualLattice(true, duration, false);
      updateDualBasisVectors(false, 0);
      updateShortestVectors(true, duration);
      cvpTarget = null;
      cvp.selectAll("*").remove();
      drawFundamentalDomain();
      updateCVPVisualization(false, 0);
      updateModVectorDisplay();
    },
    setModVector(vec) {
      if (!vec) {
        modVector = null;
        mod.selectAll("*").remove();
        return;
      }
      modVector = { vec: vec.slice(), screen: vectorToScreen(vec) };
      updateModVectorDisplay();
    },
    setBasis(newB1, newB2) {
      applyBasis(newB1, newB2);
    },
    relayout(animated = false) {
      layoutStatic(animated);
    },
    destroy() {
      window.removeEventListener("resize", resizeHandler);
      svg.on("click", null);
      svg.remove();
    },
  };
}

export default createLatticeEngine;
