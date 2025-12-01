import { SlideTemplate1 } from "../components/contentSlide1";

const spvStyles = [
  // 0: left block - SPV overview
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - privacy gap
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function PrivacyLimitsSPV() {
  return (
    <SlideTemplate1
      title="Privacy Limits of Today's SPV Clients"
      subtext={<>Why current SPV is lightweight but not private</>}
      blocks={[
        // ---------------- Left Block: SPV overview ----------------
        <div
          key="spv-overview"
          className="content is-size-5 has-text-left"
          style={{ ...spvStyles[0], fontSize: "1.05rem" }}
        >
          <h6 className="mb-3">SPV in One Slide</h6>
          <ul className="ml-4">
            <li>Full node vs SPV</li>
            <ul className="ml-5">
              <li>
                Full node: ~700+ GB, full validation - too heavy for phones or
                IoT.
              </li>
              <li>
                SPV: only block headers plus on-demand transaction queries.
              </li>
            </ul>

            <li>How SPV verifies</li>
            <ul className="ml-5">
              <li>Full node returns transaction plus Merkle proof.</li>
              <li>
                SPV checks inclusion in a header without storing the chain.
              </li>
            </ul>

            <li>
              Use today: standard model for mobile wallets and embedded clients.
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: privacy gap ----------------
        <div
          key="spv-privacy-gap"
          className="content is-size-5 has-text-left"
          style={{ ...spvStyles[1], fontSize: "1.05rem" }}
        >
          <h6 className="mb-3">Privacy Leak and Method Gap</h6>
          <ul className="ml-4">
            <li>Privacy leak</li>
            <ul className="ml-5">
              <li>
                SPV queries "my addresses / my UTXOs" - full nodes learn which
                addresses belong to the user.
              </li>
              <li>
                Bloom filters (BIP-37), Tor: either weak privacy or high
                overhead.
              </li>
            </ul>

            <li>PIR and ZKP, but misaligned</li>
            <ul className="ml-5">
              <li>
                PIR-SPV: private retrieval, often multi-server IT-PIR with
                non-collusion assumptions.
              </li>
              <li>
                ZKP: strong proofs, but prover needs large local data - too
                heavy for SPV.
              </li>
            </ul>

            <li>
              Net effect: today either ZK is too heavy or PIR is too hard to
              deploy. This is the gap our CPIR-based SPV design targets.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default PrivacyLimitsSPV;
