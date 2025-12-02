import { SlideTemplate1 } from "../components/contentSlide1";

const classicalGapStyles = [
  // 0: left block - classical background
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - quantum perspective
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function ClassicalGapQRT() {
  return (
    <SlideTemplate1
      title="From Classical Real Transforms to a Quantum Gap"
      subtext={<>DCT, DST, Hartley vs QFT</>}
      blocks={[
        // ---------------- Left Block: classical background ----------------
        <div
          key="classical-background"
          className="content is-size-5 has-text-left"
          style={{
            ...classicalGapStyles[0],
            fontSize: "1.05rem",
            lineHeight: "1",
          }}
        >
          <h5 className="mb-3">Classical Background</h5>
          <ul className="ml-4">
            <li>Discrete Cosine Transform (DCT)</li>
            <ul className="ml-5">
              <li>Concentrates signal energy into few coefficients</li>
              <li>Core of JPEG / MPEG and many compression schemes</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>
              Discrete Sine Transform (DST)
            </li>
            <ul className="ml-5">
              <li>Used in solving PDEs and spectral methods</li>
              <li>Natural for sine-type boundary conditions</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>Hartley Transform</li>
            <ul className="ml-5">
              <li>Real-valued alternative to the DFT</li>
              <li>Avoids complex arithmetic in signal and image processing</li>
            </ul>
          </ul>
        </div>,

        // ---------------- Right Block: quantum perspective ----------------
        <div
          key="quantum-perspective"
          className="content is-size-5 has-text-left"
          style={{
            ...classicalGapStyles[1],
            fontSize: "1.05rem",
            lineHeight: "1",
          }}
        >
          <h5 className="mb-3">Quantum Perspective</h5>
          <ul className="ml-4">
            <li>In quantum computing:</li>
            <ul className="ml-5">
              <li>Quantum Fourier Transform (QFT) is well studied</li>
              <li>Powers Shor's algorithm and phase estimation</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>But:</li>
            <ul className="ml-5">
              <li>
                Quantum real transforms (QCT, QST, QHT) are far less developed
              </li>
              <li>No widely adopted, efficient implementations</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>
              This gap motivates QRTlib: bringing real-valued transform tools to
              the quantum circuit model.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default ClassicalGapQRT;
