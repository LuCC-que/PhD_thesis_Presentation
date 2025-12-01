import { ContenSlide1 } from "../components/contentSlide1";

const gaussianOracleStyles = [
  // 0: left block - core expression
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - why it works
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function Recap_AltDists() {
  return (
    <ContenSlide1
      title="Gaussian LWE Oracle: Template for Reductions"
      subtext={<>Why projection and smoothing are essential</>}
      blocks={[
        // ---------------- Left Block: core expression ----------------
        <div
          key="gaussian-core-expression"
          className="content is-size-5 has-text-left"
          style={{ ...gaussianOracleStyles[0], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <ul className="ml-4">
            <li>
              {String.raw`Start from the LWE-style term $\langle x', v \rangle + e$ where`}
              <ul className="ml-5">
                <li>{String.raw`$v$: discrete sample from $L^*$`}</li>
                <li>{String.raw`$e$: continuous Gaussian noise`}</li>
              </ul>
            </li>

            <li style={{ marginTop: "1rem" }}>
              {String.raw`For Gaussians, we can write $e = \langle x', h \rangle$ for a Gaussian vector $h$.`}
            </li>

            <li style={{ marginTop: "1rem" }}>
              {String.raw`Then $\langle x', v \rangle + e = \langle x', v \rangle + \langle x', h \rangle = \langle x', v + h \rangle$.`}
            </li>

            <li style={{ marginTop: "1rem" }}>
              {String.raw`The oracle sees a clean Gaussian in the direction $x'$, which is what the reduction needs.`}
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: why it works ----------------
        <div
          key="gaussian-why-works"
          className="content is-size-5 has-text-left"
          style={{ ...gaussianOracleStyles[1], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <ol className="ml-4">
            <li>
              {String.raw`Stability under projection: the projection of a multivariate noise vector onto $x'$ must stay in the same family (up to scaling).`}
              <div className="ml-4">
                {String.raw`This keeps $\langle x', h \rangle$ analytically manageable.`}
              </div>
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Closure under convolution (smoothing): adding a discrete and a continuous version must give (almost) a continuous one of the same type.`}
              <div className="ml-4">
                {String.raw`This lets $v + h$ behave like ideal continuous noise and keeps the LWE oracle well-defined.`}
              </div>
            </li>
          </ol>
          <p style={{ marginTop: "0.9rem" }}>
            {String.raw`These two conditions are the benchmark we will use to judge Irwin-Hall and Cauchy.`}
          </p>
        </div>,
      ]}
    />
  );
}

export default Recap_AltDists;
