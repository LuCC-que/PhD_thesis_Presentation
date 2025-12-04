import { SlideTemplate1 } from "../components/contentSlide1";

const cauchyStyles = [
  // 0: left block - classical framework
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - quantum issue
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function CauchyDistSlide() {
  return (
    <SlideTemplate1
      title="Cauchy Noise: Smoothing vs Quantum Obstruction"
      subtext={<>Classically promising, quantumly problematic</>}
      blocks={[
        // ---------------- Left Block: classical framework ----------------
        // ---------------- Left Block: classical framework ----------------
        // ---------------- Left Block: classical framework ----------------
        <div
          key="cauchy-classical"
          className="content is-size-5 has-text-left"
          style={{ ...cauchyStyles[0], fontSize: "1.05rem", lineHeight: "1.2" }}
        >
          <h5 className="mb-3">Classical Cauchy Framework</h5>
          <ul className="ml-4">
            <li>{String.raw`Setup: $u$ is an isotropic multivariate Cauchy.`}</li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Projection: for any $x'$, $\langle x', u \rangle$ is 1D Cauchy with a scaled width.`}
            </li>

            <li style={{ marginTop: "0.75rem" }}>Hybrid noise model:</li>
            <ul className="ml-5">
              <li>{String.raw`$X \sim F_{s,\Lambda+u}$ (discrete Cauchy on the lattice).`}</li>
              <li>{String.raw`$Y \sim P_t$ (continuous Cauchy on $\mathbb{R}$).`}</li>
              <li>{String.raw`$g$ is the distribution of $X+Y$.`}</li>
            </ul>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Smoothing theorem (proved in our paper on Cauchy smoothing, submitted to Statistics and Probability Letters): if $s,t \ge \sqrt{2}\,\eta_\varepsilon$, then $\lVert g - P_{s+t}\rVert_{L_1} \le 8\varepsilon$.`}
            </li>
          </ul>
        </div>,
        // ---------------- Right Block: quantum issue ----------------
        // ---------------- Right Block: quantum issue ----------------
        <div
          key="cauchy-quantum"
          className="content is-size-5 has-text-left"
          style={{ ...cauchyStyles[1], fontSize: "1.05rem", lineHeight: "1.1" }}
        >
          <h5 className="mb-3">Quantum Squaring Obstruction</h5>
          <ul className="ml-4">
            <li>{String.raw`Quantum sampling uses probabilities $\propto |f(x)|^2$ (Born rule).`}</li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Gaussian: squaring keeps you inside the Gaussian family.`}
            </li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Cauchy: squaring destroys the heavy tails and changes the law.`}
            </li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Rejection tricks cannot restore true Cauchy tails or the correct shape near $0$.`}
            </li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`So: classically Cauchy fits a DGS-style smoothing theory, but quantum amplitude-squared sampling cannot realise genuine Cauchy noise.`}
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default CauchyDistSlide;
