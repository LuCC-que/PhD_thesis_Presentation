import React, { useEffect, useRef, useState } from "react";
import DraggablePanel from "../components/DraggablePanel";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import LatticeDisplay from "../components/LatticeDisplay";
import CVPDisplay from "../components/CVPDisplay";
import { BASIS_A, BASIS_B, DEFAULT_SCALE, generateNonReducedBasis } from "../components/latticeMath";

function LatticeDemo() {
  const wrapperRef = useRef(null);
  const displayRef = useRef(null);

  const [basis, setBasis] = useState(BASIS_A);
  const [basisText, setBasisText] = useState("");
  const [dualBasisText, setDualBasisText] = useState("");
  const [cvpText, setCvpText] = useState("");

  const [showShortest, setShowShortest] = useState(true);
  const [shortestSpace, setShortestSpace] = useState("primal");
  const [showDual, setShowDual] = useState(false);
  const [cvpEnabled, setCvpEnabled] = useState(false);
  const [cvpSpace, setCvpSpace] = useState("primal");
  const [cvpRadiusFactor, setCvpRadiusFactor] = useState(0.6);
  const [cvpUnlockedBeyondCap, setCvpUnlockedBeyondCap] = useState(false);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const [selectedPoint, setSelectedPoint] = useState(null);

  // Relayout when the wrapper size changes
  useEffect(() => {
    if (!wrapperRef.current) return undefined;
    const el = wrapperRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (!displayRef.current) return;
        if (width > 0 && height > 0) {
          displayRef.current.relayout(false);
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play intro animation when this section enters view
  useEffect(() => {
    if (!wrapperRef.current) return undefined;
    const target = wrapperRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            displayRef.current?.relayout(true);
          }
        }
      },
      { threshold: [0.5] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleBasisA = () => {
    setBasis(BASIS_A);
    setSelectedPoint(null);
  };

  const handleBasisB = () => {
    setBasis(BASIS_B);
    setSelectedPoint(null);
  };

  const handleRandom = () => {
    const { b1, b2 } = generateNonReducedBasis();
    setBasis({ b1, b2 });
    setSelectedPoint(null);
  };

  const handleShortestToggle = (e) => {
    const flag = e.target.checked;
    setShowShortest(flag);
  };

  const handleShortestSpaceChange = (e) => {
    setShortestSpace(e.target.value);
  };

  const handleDualToggle = (e) => {
    const flag = e.target.checked;
    setShowDual(flag);
    if (!flag && selectedPoint?.type === "dual") {
      setSelectedPoint(null);
    }
  };

  const handleCvpToggle = (e) => {
    const flag = e.target.checked;
    setCvpEnabled(flag);
    setCvpUnlockedBeyondCap(false);
  };

  const handleRadiusChange = (e) => {
    let raw = parseFloat(e.target.value);
    if (!cvpUnlockedBeyondCap && raw > 1.0) {
      raw = 0.99;
      e.target.value = raw.toString();
      setCvpUnlockedBeyondCap(true);
    }
    setCvpRadiusFactor(raw);
  };

  const handleCvpSpaceChange = (space) => {
    setCvpSpace(space);
  };

  const renderPointDecomposition = () => {
    if (!selectedPoint) return null;
    const { i, j, type } = selectedPoint;
    const label1 = type === "dual" ? "\\mathbf{b}_1^*" : "\\mathbf{b}_1";
    const label2 = type === "dual" ? "\\mathbf{b}_2^*" : "\\mathbf{b}_2";

    const latex = String.raw`
      \bigl[\,${label1} \ ${label2}\,\bigr]
      \begin{bmatrix}
        ${i} \\
        ${j}
      \end{bmatrix}
    `;

    return (
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "0.55rem 0.7rem",
          fontSize: "0.8rem",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "0.5rem",
          border: "1px solid rgba(0,0,0,0.15)",
          boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          maxWidth: "260px",
        }}
      >
        <div
          style={{
            marginBottom: "0.2rem",
            fontWeight: 600,
            fontSize: "0.8rem",
          }}
        >
          Decomposition of {type === "dual" ? "dual lattice" : "lattice"} point ({i}, {j})
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          <BlockMath math={latex} />
        </div>
        <div
          style={{
            marginTop: "0.1rem",
            fontSize: "0.7rem",
            color: "#666",
          }}
        >
          in the current {type === "dual" ? "dual basis" : "basis"}&nbsp;
          <span style={{ fontFamily: "monospace" }}>
            ({type === "dual" ? "b1*, b2*" : "b1, b2"})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="lattice-demo-root"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "white",
      }}
    >
      <LatticeDisplay
        ref={displayRef}
        basis={basis}
        showPrimal
        showDual={showDual}
        showShortest={showShortest}
        shortestSpace={shortestSpace}
        cvpSpace={cvpSpace}
        cvpEnabled={cvpEnabled}
        cvpRadiusFactor={cvpRadiusFactor}
        scale={scale}
        onBasisText={setBasisText}
        onDualBasisText={setDualBasisText}
        onCvpText={setCvpText}
        onPointSelected={setSelectedPoint}
        onBackgroundClick={() => setSelectedPoint(null)}
      />

      <DraggablePanel
        title="Lattice & CVP controls"
        width={400}
        height={135}
        initialMinimized={true}
        dockX={10}
        dockY={20}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.35rem",
          }}
        >
          <button
            className="button is-small is-link"
            type="button"
            onClick={handleBasisA}
          >
            Basis A
          </button>
          <button
            className="button is-small is-link is-light"
            type="button"
            onClick={handleBasisB}
          >
            Basis B
          </button>
          <button
            className="button is-small is-info"
            type="button"
            onClick={handleRandom}
          >
            Random
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.6rem",
            marginBottom: "0.3rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <label className="checkbox is-small">
              <input
                type="checkbox"
                checked={showShortest}
                onChange={handleShortestToggle}
                style={{ marginRight: "0.25rem" }}
              />
              shortest
            </label>
            <label className="checkbox is-small">
              <input
                type="checkbox"
                checked={showDual}
                onChange={handleDualToggle}
                style={{ marginRight: "0.25rem" }}
              />
              dual lattice
            </label>
            <label className="checkbox is-small">
              <input
                type="checkbox"
                checked={cvpEnabled}
                onChange={handleCvpToggle}
                style={{ marginRight: "0.25rem" }}
              />
              CVP
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#666" }}>Shortest on</span>
            <select
              className="select is-small"
              value={shortestSpace}
              onChange={handleShortestSpaceChange}
              style={{ height: "26px", padding: "2px 6px" }}
            >
              <option value="primal">primal</option>
              <option value="dual">dual</option>
            </select>
          </div>
        </div>

        <CVPDisplay
          cvpEnabled={cvpEnabled}
          cvpRadiusFactor={cvpRadiusFactor}
          cvpSpace={cvpSpace}
          cvpText={cvpText}
        onRadiusChange={handleRadiusChange}
        onSpaceChange={handleCvpSpaceChange}
      />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "0.35rem",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Scale</span>
          <input
            className="slider is-fullwidth"
            type="range"
            min="40"
            max="240"
            step="1"
            value={scale}
            onChange={(e) => setScale(parseInt(e.target.value, 10))}
            style={{ width: "140px" }}
          />
          <span style={{ fontSize: "0.75rem", color: "#555", width: "42px" }}>
            {scale}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.5rem",
            marginTop: "0.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              color: "#333",
              maxWidth: "55%",
              lineHeight: 1.25,
            }}
          >
            <div>{basisText}</div>
            {showDual && dualBasisText && (
              <div style={{ color: "#6b2d5c", marginTop: "0.1rem" }}>
                dual {dualBasisText}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "#777",
              textAlign: "right",
              maxWidth: "45%",
              lineHeight: 1.25,
            }}
          >
            {cvpText}
          </div>
        </div>
      </DraggablePanel>

      {renderPointDecomposition()}
    </div>
  );
}

export default LatticeDemo;
