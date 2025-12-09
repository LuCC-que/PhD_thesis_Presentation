import { SlideTemplate1 } from "../components/contentSlide1";

const gaussianChallengeStyles = [
  // 0: left block - Gaussian hardness
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - binomial and structured LWE
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function GaussianChallenges() {
  return (
    <SlideTemplate1
      title="Challenges with Gaussian Noise in LWE"
      subtext={<>Why practice moves away from the ideal distribution</>}
      blocks={[
        // ---------------- Left Block ----------------
        <div
          key="gaussian-hard"
          className="content is-size-5 has-text-left"
          style={{
            ...gaussianChallengeStyles[0],
            fontSize: "1.05rem",
            lineHeight: "1",
          }}
        >
          <h5 className="mb-3">Why Gaussians Are Hard in Practice</h5>
          <ul className="ml-4">
            <li>
              Discrete Gaussian is the theoretical standard: it enables
              reductions from LWE to worst–case lattice problems.
            </li>
            <li>Secure sampling must satisfy:</li>
            <ul className="ml-5">
              <li>very high statistical accuracy</li>
              <li>constant-time execution</li>
              <li>no secret-dependent table lookups</li>
            </ul>
            <li>These constraints make Gaussian samplers slow and complex.</li>
            <li>
              In some lattice signature schemes, Gaussian sampling costs more
              than $50\%$ of the total runtime.
            </li>
          </ul>
        </div>,

        // ---------------- Right Block ----------------
        <div
          key="binomial-structured"
          className="content is-size-5 has-text-left"
          style={{
            ...gaussianChallengeStyles[1],
            fontSize: "1.05rem",
            lineHeight: "1",
          }}
        >
          <h5 className="mb-3">Binomial Noise and Structured LWE</h5>
          <ul className="ml-4">
            <li>
              Practical schemes (NewHope, Kyber) use centered binomial noise
              instead of Gaussians.
            </li>
            <li>
              Security intuition: they are computationally indistinguishable
            </li>
            <li>These optimizations has deployed in RLWE and MLWE:</li>
            <ul className="ml-5">
              <li>{String.raw`use rings/modules instead of $\mathbb{Z}_q^n$`}</li>
              <li>efficient via NTT and bit-based noise</li>
            </ul>
            <li>
              Theoretical guarantees are weaker than classical LWE reductions:
            </li>
            <ul className="ml-5">
              <li>
                {String.raw`standard LWE $\rightarrow$ worst–case on general lattices`}
              </li>
              <li>
                {String.raw`RLWE / MLWE $\rightarrow$ worst–case on ideal or module lattices`}
              </li>
            </ul>
          </ul>
        </div>,
      ]}
    />
  );
}

export default GaussianChallenges;
