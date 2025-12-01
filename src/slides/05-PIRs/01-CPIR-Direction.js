import { SlideTemplate1 } from "../components/contentSlide1";

const cpirStyles = [
  // 0: left block - why CPIR
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - design + ZK
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function CPIRDirection() {
  return (
    <SlideTemplate1
      title="CPIR-Based SPV: Our Direction"
      subtext={<>Single-server privacy + future ZK proofs</>}
      blocks={[
        // ---------------- Left Block: why CPIR ----------------
        <div
          key="cpir-why"
          className="content is-size-5 has-text-left"
          style={{ ...cpirStyles[0], fontSize: "1.08rem", lineHeight: "1.00" }}
        >
          <h5 className="mb-3">Why CPIR Instead of IT-PIR</h5>
          <ul className="ml-5">
            <li>IT-PIR</li>
            <ul className="ml-5">
              <li>Needs multiple non-colluding servers.</li>
              <li>Hard to realise: a few big providers run most nodes.</li>
            </ul>
            <li>CPIR</li>
            <ul className="ml-5">
              <li>Works with one server.</li>
              <li>Privacy from cryptographic hardness (LWE / RLWE).</li>
              <li>
                Modern schemes (e.g., SimplePIR, FrodoPIR) reach near memory
                bandwidth with preprocessing.
              </li>
            </ul>
            <li>Trade-off</li>
            <ul className="ml-5">
              <li>Extra work on the server.</li>
              <li>Cost is predictable and can use hardware acceleration.</li>
            </ul>
          </ul>
        </div>,

        // ---------------- Right Block: design + ZK ----------------
        <div
          key="cpir-design-zk"
          className="content is-size-5 has-text-left"
          style={{ ...cpirStyles[1], fontSize: "1.08rem", lineHeight: "1.00" }}
        >
          <h5 className="mb-3">Planned SPV Design and ZK Layer</h5>
          <ul className="ml-4">
            <li>SPV with CPIR</li>
            <ul className="ml-5">
              <li>Client sends CPIR queries to a single full node.</li>
              <li>
                Retrieves UTXOs / transactions privately without multi-server
                trust.
              </li>
              <li>Client stays lightweight.</li>
            </ul>

            <li>Next step: ZK on top</li>
            <ul className="ml-5">
              <li>From CPIR results, client builds ZK proofs for:</li>
              <ul className="ml-5">
                <li>UTXO ownership</li>
                <li>Balance {`>=`} threshold, etc.</li>
              </ul>
              <li>
                Goal: privacy-preserving audit - private retrieval + succinct
                public proofs, no full-node storage on the client.
              </li>
            </ul>
          </ul>
        </div>,
      ]}
    />
  );
}

export default CPIRDirection;
