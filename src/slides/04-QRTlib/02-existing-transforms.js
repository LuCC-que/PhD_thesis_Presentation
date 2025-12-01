import { SlideTemplate1 } from "../components/contentSlide1";

const existingTransformsStyles = [
  // 0: left block - prior work
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - limitations
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function ExistingTransformsQRT() {
  return (
    <SlideTemplate1
      title="Existing Quantum Real Transforms"
      subtext={<>What's known and what is still missing</>}
      blocks={[
        // ---------------- Left Block: prior work ----------------
        <div
          key="qrt-prior-work"
          className="content is-size-5 has-text-left"
          style={{
            ...existingTransformsStyles[0],
            fontSize: "1.05rem",
            lineHeight: "1.4",
          }}
        >
          <h5 className="mb-3">Prior Work</h5>
          <ul className="ml-4">
            <li>Klappenecker and Rotteler:</li>
            <ul className="ml-5">
              <li>Defined quantum cosine, sine, and Hartley transforms</li>
              <li>Gave formal circuit constructions</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>Follow-up research:</li>
            <ul className="ml-5">
              <li>Applied these transforms in quantum signal processing</li>
              <li>Improved circuits, especially for the quantum Hartley transform (QHT)</li>
              <li>Used recursive and self-similar structures to lower gate counts</li>
            </ul>
          </ul>
        </div>,

        // ---------------- Right Block: limitations ----------------
        <div
          key="qrt-limitations"
          className="content is-size-5 has-text-left"
          style={{
            ...existingTransformsStyles[1],
            fontSize: "1.05rem",
            lineHeight: "1.4",
          }}
        >
          <h5 className="mb-3">Key Limitations Before QRTlib</h5>
          <ul className="ml-4">
            <li>No open-source, executable implementations:</li>
            <ul className="ml-5">
              <li>No full Qiskit library for QCT/QST/QHT</li>
              <li>Hard for others to test, reuse, or benchmark</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>Heavy multi-controlled operations:</li>
            <ul className="ml-5">
              <li>Circuits rely on large multi-controlled gates</li>
              <li>High depth and noise sensitivity</li>
              <li>Impractical for near-term (NISQ) hardware</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>
              Result: useful theory, but no accessible, hardware-aware library. QRTlib addresses this gap.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default ExistingTransformsQRT;

