import { SlideTemplate1 } from "../components/contentSlide1";

const irwinHallStyles = [
  // 0: left block - projection failure
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 2.75rem 2.5rem 3.25rem",
  },
  // 1: right block - smoothing failure
  {
    width: "100%",
    height: "auto",
    padding: "2.5rem 3.25rem 2.5rem 2.75rem",
  },
];

function IR_DistSlide() {
  return (
    <SlideTemplate1
      title="Why Irwin-Hall Fails as LWE Noise"
      subtext={<>Projection and smoothing both break down</>}
      blocks={[
        // ---------------- Left Block: projection issue ----------------
        <div
          key="irwin-projection"
          className="content is-size-5 has-text-left"
          style={{
            ...irwinHallStyles[0],
            fontSize: "1.05rem",
            lineHeight: "1.4",
          }}
        >
          <ul className="ml-4">
            <li>
              Irwin-Hall noise is defined as a sum of independent uniforms.
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`In the reduction, we need to understand $e = \langle x', h \rangle$ where $h \sim \text{continuous Uniform}$.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For Gaussians, this projection is Gaussian and fully characterised.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For Irwin-Hall, the distribution of $\langle x', h \rangle$ is not known in the literature and has no simple closed form.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Without a stable, analytic description of this projection, we cannot control the one-dimensional error seen by the LWE oracle.`}
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: smoothing issue ----------------
        <div
          key="irwin-smoothing"
          className="content is-size-5 has-text-left"
          style={{
            ...irwinHallStyles[1],
            fontSize: "1.05rem",
            lineHeight: "1.4",
          }}
        >
          <ul className="ml-4">
            <li>
              {String.raw`In the Gaussian case, adding discrete and continuous noise yields (almost) a continuous Gaussian with a larger width: $v + h \approx \text{continuous Gaussian}$.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For Irwin-Hall, there is no smoothing theorem and no proof that $v + h$, with $v$ discrete Irwin-Hall and $h$ continuous Irwin-Hall, is close to any continuous Irwin-Hall distribution.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`We cannot show that $\langle x', v \rangle + e = \langle x', v + h \rangle$ stays inside the same distribution family.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`As a result, we have no way to define a consistent LWE oracle or to link Irwin-Hall LWE to worst-case lattice problems.`}
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default IR_DistSlide;
