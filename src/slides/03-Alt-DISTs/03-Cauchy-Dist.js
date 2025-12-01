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
        <div
          key="cauchy-classical"
          className="content is-size-5 has-text-left"
          style={{ ...cauchyStyles[0], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <h5 className="mb-3">Classical Cauchy Framework</h5>
          <ul className="ml-4">
            <li>{String.raw`$u$ isotropic multivariate Cauchy.`}</li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Projection: $\langle x', u \rangle$ is 1D Cauchy (scaled).`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>Hybrid model:</li>
            <ul className="ml-5">
              <li>{String.raw`$X \sim F_{s,\Lambda+u}$ (discrete Cauchy)`}</li>
              <li>{String.raw`$Y \sim P_t$ (continuous Cauchy)`}</li>
              <li>{String.raw`$g$ = distribution of $X+Y$.`}</li>
            </ul>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For $s, t \ge \sqrt{2}\eta_\varepsilon$, we have $|g - P_{s+t}|_{L^1} \le 8\varepsilon$.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`So discrete + continuous Cauchy $\approx$ continuous Cauchy, mirroring Gaussian smoothing.`}
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: quantum issue ----------------
        <div
          key="cauchy-quantum"
          className="content is-size-5 has-text-left"
          style={{ ...cauchyStyles[1], fontSize: "1.05rem", lineHeight: "1.4" }}
        >
          <h5 className="mb-3">Quantum Squaring Issue</h5>
          <ul className="ml-4">
            <li>{String.raw`Quantum sampling: probabilities $\propto f(x)^2$ (Born rule).`}</li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Gaussian: squaring keeps a Gaussian.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Cauchy: squaring kills heavy tails, giving a different law.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Rejection sampling cannot repair the tails or envelope near 0.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>Conclusion:</li>
            <ul className="ml-5">
              <li>{String.raw`Classically: Cauchy fits a DGS-style smoothing theory.`}</li>
              <li>
                {String.raw`Quantumly: amplitude-squared sampling cannot realise true Cauchy noise.`}
              </li>
            </ul>
          </ul>
        </div>,
      ]}
    />
  );
}

export default CauchyDistSlide;

