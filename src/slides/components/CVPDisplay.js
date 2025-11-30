import React from "react";

function CVPDisplay({
  cvpEnabled,
  cvpRadiusFactor,
  cvpSpace,
  cvpText,
  onRadiusChange,
  onSpaceChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        marginTop: "0.35rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            flex: 1,
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Radius</span>
          <input
            className="slider is-fullwidth"
            type="range"
            min="0"
            max="1.5"
            step="0.01"
            value={cvpRadiusFactor}
            onChange={onRadiusChange}
            style={{ width: "110px" }}
            disabled={!cvpEnabled}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: cvpEnabled ? "#333" : "#aaa",
              width: "38px",
            }}
          >
            {cvpRadiusFactor.toFixed(2)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Space</span>
          <select
            className="select is-small"
            value={cvpSpace}
            onChange={(e) => onSpaceChange?.(e.target.value)}
            disabled={!cvpEnabled}
            style={{ height: "26px", padding: "2px 6px" }}
          >
            <option value="primal">primal</option>
            <option value="dual">dual</option>
          </select>
        </div>
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color: cvpEnabled ? "#555" : "#aaa",
          lineHeight: 1.2,
          minHeight: "1.5rem",
          textAlign: "left",
        }}
      >
        {cvpText}
      </div>
    </div>
  );
}

export default CVPDisplay;
