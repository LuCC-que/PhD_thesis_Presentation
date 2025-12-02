import React, { useEffect, useRef, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { SlideTemplate1 } from "../components/contentSlide1";
import LatticeDisplay from "../components/LatticeDisplay";
import { BASIS_B, DEFAULT_SCALE } from "../components/latticeMath";
import DraggablePanel from "../components/DraggablePanel";

const phase1Lines = [
  String.raw`x = \kappa_{L^*}(x) + x',\quad \kappa_{L^*}(x)\in L^*`,

  String.raw`b := \langle x, v\rangle + e = \langle \kappa_{L^*}(x), v\rangle + \langle x', v\rangle + e`,
  String.raw`L^*s = \kappa_{L^*}(x),\quad La = v`,
  String.raw`b := \langle x, v\rangle + e = \langle a, s\rangle + \langle x', v\rangle + e`,

  String.raw`a \bmod p \sim \mathbb{Z}_p^n, s \bmod p \sim \mathbb{Z}_p^n`,
];

const phase2Lines = [
  String.raw`b = \langle a, s\rangle + \langle x', v\rangle + e,\quad v \leftarrow D_{L^*, r},\ e \leftarrow \Psi_{s}`,
  String.raw`\text{error}(x') := \langle x', v\rangle + e`,
  String.raw`\text{error}(x') \sim \Psi_{\beta},\quad \beta = \sqrt{(r\|x'\|)^2 + s^2}`,
  String.raw`\beta < \alpha\ \text{ means }\ \mathrm{LWE}_{p,\Psi_{\alpha}}\ \text{ oracle can decode it}`,
];

const slideTitle = "Narrower D on L → wider CVP range in L*";

const slideSubtext =
  "Narrower noise on the lattice lets us use a larger CVP radius in the dual lattice.";

function FirstPieces() {
  const displayRef = useRef(null);
  const blockRef = useRef(null);

  const [showLattice, setShowLattice] = useState(true);
  const [cvpEnabled, setCvpEnabled] = useState(true);
  const [cvpRadiusFactor, setCvpRadiusFactor] = useState(0.6);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  useEffect(() => {
    displayRef.current?.relayout(true);
  }, []);

  useEffect(() => {
    if (!blockRef.current) return undefined;
    const observer = new ResizeObserver(() => {
      displayRef.current?.relayout(false);
    });
    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, []);

  const leftBlock = (
    <div
      className="content is-size-4 has-text-left"
      style={{
        width: "100%",
        padding: "1.4rem",
        borderRadius: "0.75rem",
        background: "rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.06)",
        position: "relative", // <<< important: anchor absolute child
        overflow: "hidden", // <<< avoid anything spilling outside
      }}
    >
      {/* Phase 1: build LWE sample from CVP input (defines the height) */}
      <div className="fragment fade-out" data-fragment-index="1">
        {phase1Lines.map((line, idx) => (
          <div key={`p1-${idx}`} style={{ marginBottom: "0.3rem" }}>
            <BlockMath math={line} />
          </div>
        ))}
      </div>

      {/* Phase 2: overlays Phase 1 instead of pushing it down */}
      <div
        className="fragment fade-in"
        data-fragment-index="1"
        style={{
          position: "absolute",
          top: "1.4rem", // align with card padding
          left: "1.4rem",
          right: "1.4rem",
        }}
      >
        {phase2Lines.map((line, idx) => (
          <div key={`p2-${idx}`} style={{ marginBottom: "0.3rem" }}>
            <BlockMath math={line} />
          </div>
        ))}
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
      <LatticeDisplay
        ref={displayRef}
        basis={BASIS_B}
        showPrimal={showLattice}
        showDual
        showShortest
        shortestSpace="dual"
        cvpSpace="dual"
        cvpEnabled={cvpEnabled}
        cvpRadiusFactor={cvpRadiusFactor}
        scale={scale}
        showCvpResidualArrow
        onPointSelected={setSelectedPoint}
        onBackgroundClick={() => setSelectedPoint(null)}
      />
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
            Decomposition of{" "}
            {selectedPoint.type === "dual" ? "dual lattice" : "lattice"} point (
            {selectedPoint.i}, {selectedPoint.j})
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            <BlockMath
              math={String.raw`
              \bigl[\,${
                selectedPoint.type === "dual"
                  ? "\\mathbf{b}_1^*"
                  : "\\mathbf{b}_1"
              } \ ${
                selectedPoint.type === "dual"
                  ? "\\mathbf{b}_2^*"
                  : "\\mathbf{b}_2"
              }\,\bigr]
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
            in the current{" "}
            {selectedPoint.type === "dual" ? "dual basis" : "basis"}{" "}
            <span style={{ fontFamily: "monospace" }}>
              ({selectedPoint.type === "dual" ? "b1*, b2*" : "b1, b2"})
            </span>
          </div>
        </div>
      ) : null}
      <DraggablePanel
        title="Dual CVP playground (basis B fixed)"
        width={280}
        height={140}
        initialMinimized={false}
        dockX={10}
        dockY={10}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <label
            className="checkbox is-small"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <input
              type="checkbox"
              checked={showLattice}
              onChange={(e) => setShowLattice(e.target.checked)}
            />
            show primal lattice
          </label>
          <label
            className="checkbox is-small"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <input
              type="checkbox"
              checked={cvpEnabled}
              onChange={(e) => setCvpEnabled(e.target.checked)}
            />
            CVP on dual lattice
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: cvpEnabled ? 1 : 0.6,
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#555" }}>Radius</span>
            <input
              className="slider is-fullwidth"
              type="range"
              min="0"
              max="1.5"
              step="0.01"
              value={cvpRadiusFactor}
              onChange={(e) => setCvpRadiusFactor(parseFloat(e.target.value))}
              style={{ width: "120px" }}
              disabled={!cvpEnabled}
            />
            <span style={{ fontSize: "0.75rem", color: "#555", width: "42px" }}>
              {cvpRadiusFactor.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#555" }}>Scale</span>
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

  return (
    <SlideTemplate1
      title={slideTitle}
      subtext={slideSubtext}
      blocks={[leftBlock, rightBlock]}
    />
  );
}

export default FirstPieces;
