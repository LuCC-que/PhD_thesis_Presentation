import React, { useEffect, useRef, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import * as d3 from "d3";

import { SlideTemplate1 } from "../components/contentSlide1";
import LatticeDisplay from "../components/LatticeDisplay";
import DraggablePanel from "../components/DraggablePanel";
import {
  BASIS_B,
  DEFAULT_SCALE,
  computeDualBasis,
  reduceVectorModLattice,
} from "../components/latticeMath";

const formulaLines = [
  "\\sum_{\\substack{l \\in L^*/R \\\\ \\|l\\| < d}} \\rho(l) \\lvert l \\bmod P(L^*) \\rangle",
  "\\sum_{\\substack{l \\in L^*/R \\\\ \\|l\\| < d}} \\rho(l) \\lvert l \\rangle",
  "\\sum_{\\substack{l \\in L^*/R \\\\ \\|l\\| < d}} \\rho(l) \\lvert l, l \\bmod P(L^*) \\rangle",
];

function SecondPieces() {
  const displayRef = useRef(null);
  const overlayRef = useRef(null);
  const blockRef = useRef(null);
  const displayRef2 = useRef(null);
  const overlayRef2 = useRef(null);
  const blockRef2 = useRef(null);

  const [divider, setDivider] = useState(1);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [cvpRadiusFactor, setCvpRadiusFactor] = useState(0.6);
  const [cvpEnabled, setCvpEnabled] = useState(true);
  const [showOriginCircle, setShowOriginCircle] = useState(false);
  const [modEnabled, setModEnabled] = useState(false);
  const [modI, setModI] = useState(0);
  const [modJ, setModJ] = useState(0);
  const [modResult, setModResult] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleModVectorComputed = (vec) => {
    displayRef.current?.setModVector(vec);
    displayRef2.current?.setModVector(vec);
    setModResult(vec);
  };

  const computeManualMod = () => {
    const dualBasis = computeDualBasis(BASIS_B);
    const coeff1 = modI / divider;
    const coeff2 = modJ / divider;
    const rawVec = [
      coeff1 * dualBasis.b1[0] + coeff2 * dualBasis.b2[0],
      coeff1 * dualBasis.b1[1] + coeff2 * dualBasis.b2[1],
    ];
    const reduced = reduceVectorModLattice(rawVec, dualBasis);
    setModResult(reduced.vec);
    displayRef.current?.setModVector(reduced.vec);
    displayRef2.current?.setModVector(reduced.vec);
    setSelectedPoint({ i: modI, j: modJ, type: "dualScaled" });
  };

  // animate on first mount
  useEffect(() => {
    displayRef.current?.relayout(true);
    overlayRef.current?.relayout(true);
    displayRef2.current?.relayout(true);
    overlayRef2.current?.relayout(true);
  }, []);

  // keep layout on resize
  useEffect(() => {
    if (!blockRef.current) return undefined;
    const observer = new ResizeObserver(() => {
      displayRef.current?.relayout(false);
      overlayRef.current?.relayout(false);
    });
    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!blockRef2.current) return undefined;
    const observer = new ResizeObserver(() => {
      displayRef2.current?.relayout(false);
      overlayRef2.current?.relayout(false);
    });
    observer.observe(blockRef2.current);
    return () => observer.disconnect();
  }, []);

  // animate overlay scale changes
  useEffect(() => {
    overlayRef.current?.setScale(scale / Math.max(1, divider), 600);
    overlayRef2.current?.setScale(scale / Math.max(1, divider), 600);
  }, [divider, scale]);

  const leftBlock = (
    <div
      className="content is-size-4 has-text-left"
      style={{
        width: "100%",
        padding: "1.4rem",
        borderRadius: "0.75rem",
        background: "rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.06)",
        position: "relative", // anchor for overlay
        overflow: "hidden", // avoid spill
      }}
    >
      {/* Phase 1: sum-over-cosets formulas (visible first, then fade out) */}
      <div className="fragment fade-out" data-fragment-index="1">
        {formulaLines.map((line, idx) => (
          <div key={idx} style={{ marginBottom: "0.35rem" }}>
            <BlockMath math={line} />
          </div>
        ))}
      </div>

      {/* Phase 2: Gaussian chart (fades in, overlaid on top) */}
      <div
        className="fragment fade-in"
        data-fragment-index="1"
        style={{
          position: "absolute",
          top: "1.4rem",
          left: "1.4rem",
          right: "1.4rem",
          bottom: "1.4rem",
        }}
      >
        <GaussianChartBlock />
      </div>
    </div>
  );

  const rightBlock = (
    <div
      ref={blockRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "420px",
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "white",
      }}
    >
      {/* Scaled L* / R overlay (clickable when mod is enabled) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <LatticeDisplay
          ref={overlayRef}
          basis={BASIS_B}
          showPrimal={false}
          showDual
          showShortest={false}
          shortestSpace="dual"
          cvpSpace="dual"
          cvpEnabled={false}
          cvpRadiusFactor={cvpRadiusFactor}
          scale={scale / Math.max(1, divider)}
          dualPointVariant="hollow"
          dualPointColor="#1f77b4"
          showFundamentalDomain={false}
          showCvpResidualArrow={false}
          showCvpOriginCircle={false}
          enableModProjection={modEnabled}
          modProjectionDivider={divider}
          onModVectorComputed={handleModVectorComputed}
        />
      </div>
      {/* Base dual lattice L* on top */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "auto",
          zIndex: 2,
        }}
      >
        <LatticeDisplay
          ref={displayRef}
          basis={BASIS_B}
          showPrimal={false}
          showDual
          showShortest
          shortestSpace="dual"
          cvpSpace="dual"
          cvpEnabled={cvpEnabled}
          cvpRadiusFactor={cvpRadiusFactor}
          scale={scale}
          dualPointVariant="solid"
          dualPointColor="#e377c2"
          showFundamentalDomain
          fundamentalSpace="dual"
          showCvpResidualArrow
          showCvpOriginCircle={showOriginCircle || modEnabled}
          enableModProjection={modEnabled}
          modProjectionDivider={divider}
          onPointSelected={null}
          onBackgroundClick={() => setSelectedPoint(null)}
        />
      </div>
      {selectedPoint ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "0.55rem 0.7rem",
            fontSize: "0.8rem",
            background: "rgba(255,255,255,0.97)",
            borderRadius: "0.5rem",
            border: "1px solid rgba(0,0,0,0.15)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
            maxWidth: "260px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              marginBottom: "0.2rem",
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          >
            Decomposition of dual lattice point in L*/{divider} (
            {selectedPoint.i}, {selectedPoint.j})
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            <BlockMath
              math={String.raw`
              \bigl[\,\mathbf{b}_1^*/${divider} \ \mathbf{b}_2^*/${divider}\,\bigr]
              \begin{bmatrix}
                ${selectedPoint.i} \\\\
                ${selectedPoint.j}
              \end{bmatrix}
            `}
            />
          </div>
          <div
            style={{
              marginTop: "0.1rem",
              fontSize: "0.7rem",
              color: "#666",
            }}
          >
            in the current dual basis{" "}
            <span style={{ fontFamily: "monospace" }}>(b1*, b2*)</span>
          </div>
        </div>
      ) : null}

      <DraggablePanel
        title="Dual lattice scaling"
        width={260}
        height={120}
        initialMinimized={false}
        dockX={10}
        dockY={10}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
            Scale dual lattice L* / R
          </div>
          <label
            className="checkbox is-small"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <input
              type="checkbox"
              checked={cvpEnabled}
              onChange={(e) => setCvpEnabled(e.target.checked)}
            />
            CVP
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#555", width: "60px" }}>
              R (int)
            </span>
            <input
              className="slider is-fullwidth"
              type="range"
              min="1"
              max="6"
              step="1"
              value={divider}
              onChange={(e) => setDivider(parseInt(e.target.value, 10))}
              style={{ width: "120px" }}
            />
            <span style={{ fontSize: "0.75rem", color: "#555", width: "32px" }}>
              {divider}
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            L* scaled down to L*/{divider}; animation plays as you adjust.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <label
              className="checkbox is-small"
              style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
            >
              <input
                type="checkbox"
                checked={showOriginCircle}
                onChange={(e) => setShowOriginCircle(e.target.checked)}
              />
              origin circle
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#555", width: "60px" }}>
              CVP r
            </span>
            <input
              className="slider is-fullwidth"
              type="range"
              min="0.2"
              max="1.2"
              step="0.01"
              value={cvpRadiusFactor}
              onChange={(e) => setCvpRadiusFactor(parseFloat(e.target.value))}
              style={{ width: "120px" }}
            />
            <span style={{ fontSize: "0.75rem", color: "#555", width: "42px" }}>
              {cvpRadiusFactor.toFixed(2)}
            </span>
          </div>
          <label
            className="checkbox is-small"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <input
              type="checkbox"
              checked={modEnabled}
              onChange={(e) => {
                setModEnabled(e.target.checked);
                if (!e.target.checked) {
                  setModResult(null);
                  setSelectedPoint(null);
                  displayRef.current?.setModVector(null);
                  displayRef2.current?.setModVector(null);
                }
              }}
            />
            mod P(L*)
          </label>
          {modEnabled ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "#444",
                padding: "0.4rem 0.5rem",
                border: "1px dashed rgba(0,0,0,0.2)",
                borderRadius: "0.5rem",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Manual mod P(L*) on L*/{divider}
              </div>
              <div
                style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}
              >
                <span style={{ fontSize: "0.75rem", color: "#555" }}>i, j</span>
                <input
                  type="number"
                  value={modI}
                  onChange={(e) => setModI(parseInt(e.target.value || "0", 10))}
                  style={{ width: "70px" }}
                />
                <input
                  type="number"
                  value={modJ}
                  onChange={(e) => setModJ(parseInt(e.target.value || "0", 10))}
                  style={{ width: "70px" }}
                />
                <button
                  type="button"
                  className="button is-small is-link"
                  onClick={computeManualMod}
                >
                  compute
                </button>
              </div>
              {modResult ? (
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#333",
                    lineHeight: 1.3,
                  }}
                >
                  Result in P(L*): ({modResult[0].toFixed(2)},{" "}
                  {modResult[1].toFixed(2)})
                </div>
              ) : (
                <div style={{ fontSize: "0.72rem", color: "#666" }}>
                  Enter indices of L*/{divider} then compute. Result is plotted
                  in the grey fundamental domain.
                </div>
              )}
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#555", width: "60px" }}>
              Scale
            </span>
            <input
              className="slider is-fullwidth"
              type="range"
              min="40"
              max="240"
              step="1"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value, 10))}
              style={{ width: "120px" }}
            />
            <span style={{ fontSize: "0.75rem", color: "#555", width: "42px" }}>
              {scale}
            </span>
          </div>
        </div>
      </DraggablePanel>
    </div>
  );

  function GaussianChartBlock() {
    const chartRef = useRef(null);

    useEffect(() => {
      const LAYOUT = {
        width: 600,
        height: 400,
        margin: { top: 40, right: 80, bottom: 50, left: 60 },
        legendOffset: { x: -70, y: 10 },
      };
      const DOMAIN = { x: [-5, 5], y: [0, 1], step: 0.02 };
      const GAUSSIAN_PARAMS = [
        { s: 2.0, color: "red" },
        { s: 1.0, color: "green" },
        { s: 0.5, color: "blue" },
      ];
      const AXIS = { xLabel: "‖x‖", yLabel: "ρₛ(‖x‖)" };

      const container = chartRef.current;
      if (!container) return undefined;
      d3.select(container).selectAll("*").remove();

      const { width, height, margin } = LAYOUT;
      const svg = d3
        .select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleLinear().domain(DOMAIN.x).range([0, innerWidth]);
      const yScale = d3.scaleLinear().domain(DOMAIN.y).range([innerHeight, 0]);

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));
      g.append("g").call(d3.axisLeft(yScale).ticks(5));

      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .text(AXIS.xLabel);
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .text(AXIS.yLabel);

      const xs = d3.range(DOMAIN.x[0], DOMAIN.x[1] + 0.01, DOMAIN.step);
      const line = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      GAUSSIAN_PARAMS.forEach((param, i) => {
        const data = xs.map((x) => ({
          x,
          y: Math.exp(-(x * x) / (2 * param.s * param.s)),
        }));
        const path = g
          .append("path")
          .datum(data)
          .attr("class", "gaussian-curve")
          .attr("fill", "none")
          .attr("stroke", param.color)
          .attr("stroke-width", 2)
          .attr("d", line);

        const totalLength = path.node().getTotalLength();
        path
          .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2400)
          .delay(i * 300)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      });

      const legend = g
        .append("g")
        .attr(
          "transform",
          `translate(${innerWidth + LAYOUT.legendOffset.x}, ${
            LAYOUT.legendOffset.y
          })`
        );
      GAUSSIAN_PARAMS.forEach((param, idx) => {
        const row = legend
          .append("g")
          .attr("transform", `translate(0, ${idx * 18})`);
        row
          .append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("stroke", param.color)
          .attr("stroke-width", 2);
        row
          .append("text")
          .attr("x", 25)
          .attr("y", 4)
          .attr("font-size", 11)
          .text(`s = ${param.s}`);
      });
    }, []);

    return (
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <SlideTemplate1
      title="Larger CVPs, Wider Gaussian"
      subtext="Larger CVP range in the dual lattice lets us prepare more dual lattice points and wider Gaussians."
      blocks={[leftBlock, rightBlock]}
    />
  );
}

export default SecondPieces;
