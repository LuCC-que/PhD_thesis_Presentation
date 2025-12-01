import { ContenSlide1 } from "../components/contentSlide1";

const contributionsStyles = [
  // 0: left block - main contributions
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - project status
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function ContributionsStatusQRT() {
  return (
    <ContenSlide1
      title="QRTlib Contributions and Current Status"
      subtext={<>From theory to an executable quantum library</>}
      blocks={[
        // ---------------- Left Block: contributions ----------------
        <div
          key="qrt-contributions"
          className="content is-size-6 has-text-left"
          style={{
            ...contributionsStyles[0],
            fontSize: "0.95rem",
            lineHeight: "1.35",
          }}
        >
          <h5 className="mb-3">Main Contributions</h5>
          <ul className="ml-4">
            <li>New QHT algorithm (LCU-based):</li>
            <ul className="ml-5">
              <li>Quantum Hartley transform via linear combination of unitaries (LCU)</li>
              <li>Avoids many costly conditional operations</li>
              <li>Leads to a more direct and compact QHT circuit</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>First Qiskit implementations:</li>
            <ul className="ml-5">
              <li>Full circuits for Type I-IV quantum cosine and sine transforms</li>
              <li>Complete implementation of the new QHT</li>
              <li>Ready-to-use building blocks for quantum signal and image processing</li>
            </ul>
          </ul>
        </div>,

        // ---------------- Right Block: status ----------------
        <div
          key="qrt-status"
          className="content is-size-6 has-text-left"
          style={{
            ...contributionsStyles[1],
            fontSize: "0.95rem",
            lineHeight: "1.35",
          }}
        >
          <h5 className="mb-3">Circuit Optimisations for NISQ</h5>
          <ul className="ml-4">
            <li>Efficient two's-complement construction</li>
            <li>Replace multi-controlled gates with or-tree structures</li>
            <li>Reduced gate count and circuit depth for noisy hardware</li>
          </ul>

          <h5 className="mb-3" style={{ marginTop: "1.1rem" }}>
            Project Status
          </h5>
          <ul className="ml-4">
            <li>All algorithms and circuits implemented and verified</li>
            <li style={{ marginTop: "0.75rem" }}>
              Code released as an open-source GitHub repository
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Theoretical framework and experimental evaluation completed
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Paper submitted to Quantum and under peer review
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              QRTlib forms a first unified, accessible library of quantum real
              transforms for future algorithms and applications
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default ContributionsStatusQRT;
