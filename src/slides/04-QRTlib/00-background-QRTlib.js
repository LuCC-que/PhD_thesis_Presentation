import { SlideTemplate1 } from "../components/contentSlide1";

const qrtBackgroundStyles = [
  // 0: left block - what QRTlib is
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - why it matters
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function Background_QRTlib() {
  return (
    <SlideTemplate1
      title="QRTlib: Quantum Real Transforms Library"
      subtext={<>Quantum versions of cosine, sine, and Hartley transforms</>}
      blocks={[
        // ---------------- Left Block: what QRTlib is ----------------
        <div
          key="qrtlib-what"
          className="content is-size-5 has-text-left"
          style={{ ...qrtBackgroundStyles[0], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <h5 className="mb-3">What QRTlib Is</h5>
          <ul className="ml-4">
            <li>A library of quantum real-valued transforms:</li>
            <ul className="ml-5">
              <li>quantum cosine transforms (QCT, Types I-IV)</li>
              <li>quantum sine transforms (QST, Types I-IV)</li>
              <li>quantum Hartley transform (QHT)</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>
              Goal: bring the role of DCT/DST/Hartley in classical computing
              into the quantum setting.
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Focus: efficient quantum circuits for real-valued signal
              processing and numerical algorithms.
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: why it matters ----------------
        <div
          key="qrtlib-why"
          className="content is-size-5 has-text-left"
          style={{ ...qrtBackgroundStyles[1], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <h5 className="mb-3">Why It Matters</h5>
          <ul className="ml-4">
            <li>Classically, DCT/DST/Hartley underpin:</li>
            <ul className="ml-5">
              <li>image and video compression (JPEG, MPEG)</li>
              <li>numerical PDE solvers and spectral methods</li>
              <li>real-valued signal and image processing</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>
              In quantum computing, we have the QFT but no standard, practical
              counterparts for these real transforms.
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              QRTlib aims to fill this gap and enable quantum-native versions of
              real-valued algorithms and applications.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default Background_QRTlib;

