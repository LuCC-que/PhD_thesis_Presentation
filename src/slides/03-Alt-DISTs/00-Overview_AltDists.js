import { SlideTemplate1 } from "../components/contentSlide1";

const altDistOverviewStyles = [
  // 0: left block — core question
  {
    width: "100%",
    height: "auto",
    padding: "3rem 3rem 3rem 4rem",
  },
  // 1: right block — roadmap
  {
    width: "100%",
    height: "auto",
    padding: "3rem 4rem 3rem 3rem",
  },
];

function Overview_AltDists() {
  return (
    <SlideTemplate1
      title="Fitting Alternative Noise Distributions into DGS"
      subtext={
        <>
          Understanding which properties allow LWE oracles to behave like the
          Gaussian case
        </>
      }
      blocks={[
        // ---------------- Left Block: Core question ----------------
        <div
          key="alt-core-question"
          className="content is-size-4 has-text-left"
          style={altDistOverviewStyles[0]}
        >
          <ul className="ml-4">
            <li className="has-text-weight-semibold">
              Can we replace the Gaussian noise in LWE-based reductions with
              another distribution?
            </li>
            <li>
              The DGS framework needs noise that stays well-behaved under
              projection onto any direction.
            </li>
            <li>
              It must also remain consistent under convolution between discrete
              and continuous forms.
            </li>
            <li>
              These properties ensure the LWE oracle remains valid when applied
              to CVP reductions.
            </li>
          </ul>
        </div>,

        // ---------------- Right Block: Roadmap ----------------
        <div
          key="alt-roadmap"
          className="content is-size-4 has-text-left"
          style={altDistOverviewStyles[1]}
        >
          <ul className="ml-4">
            <li>
              Review how the Gaussian-based LWE oracle interacts with CVP.
            </li>
            <li>
              Examine two candidate replacements:
              <ul className="ml-5">
                <li>Irwin-Hall - fails analytically.</li>
                <li>Cauchy - shows promising structure.</li>
              </ul>
            </li>
            <li>
              Preview of next steps: extending smoothing ideas to Laplace and
              beyond.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default Overview_AltDists;
