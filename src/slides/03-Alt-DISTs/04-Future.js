import { SlideTemplate1 } from "../components/contentSlide1";

const futureStyles = [
  // 0: left block - LWE implications
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - Laplace next steps
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function FutureAltDists() {
  return (
    <SlideTemplate1
      title="From Cauchy to a General Smoothing Framework"
      subtext={<>Implications for LWE oracles and the Laplace direction</>}
      blocks={[
        // ---------------- Left Block: LWE implications ----------------
        <div
          key="future-implications"
          className="content is-size-5 has-text-left"
          style={{ ...futureStyles[0], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <h5 className="mb-3">Implications for LWE Oracles</h5>
          <ul className="ml-4">
            <li>
              The Gaussian is not unique: Cauchy also supports projection
              stability and discrete + continuous smoothing.
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Any viable noise family for DGS-style reductions should satisfy:
              <ol className="ml-4" style={{ marginTop: "0.5rem" }}>
                <li>{String.raw`Projections stay in the same distribution family (up to scaling).`}</li>
                <li>{String.raw`Discrete + continuous versions smooth to an almost-continuous law.`}</li>
              </ol>
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              This provides a template for designing and analysing non-Gaussian
              LWE oracles.
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: Laplace next steps ----------------
        <div
          key="future-laplace"
          className="content is-size-5 has-text-left"
          style={{ ...futureStyles[1], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <h5 className="mb-3">Next Steps: Laplace and Metrics</h5>
          <ul className="ml-4">
            <li>Next target: Laplace distribution as noise.</li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Start again from $\langle x, v \rangle + e$ with $v$ discrete on $\Lambda$, $e$ continuous.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Compare continuous $f(x)$ and discrete $g(x)$ using:
              <ul className="ml-5">
                <li>Total variation distance</li>
                <li>Wasserstein distance</li>
              </ul>
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Goal: numerical and analytic criteria for when adding continuous
              noise makes the discrete lattice distribution statistically close
              to its continuous analogue, extending smoothing beyond Gaussian
              and Cauchy.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default FutureAltDists;

