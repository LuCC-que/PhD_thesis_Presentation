import { ContenSlide1 } from "../components/contentSlide1";
import siftingImage from "../../assets/images/sifting_flower_x1.jpg";

const dgsIntroStyles = [
  // 0: text block (bullet points)
  {
    width: "100%",
    height: "auto",
    padding: "0rem 0rem 6.5rem 10rem",
  },
  // 1: image block
  {
    width: "100%",
    height: "auto",
    padding: "0rem 0rem 2rem 4rem",
  },
];

function Overview_DGS() {
  return (
    <ContenSlide1
      title="Discrete Gaussian Sampling (DGS)"
      subtext={
        <>
          DGS works like sifting flour: each round filters out long vectors and
          keeps the fine, short ones.
        </>
      }
      blocks={[
        // ----- Block 1: bullets -----
        <div
          key="dgs-text"
          className="content is-size-5 has-text-left"
          style={dgsIntroStyles[0]}
        >
          <h5>Key Points:</h5>
          <ul className="ml-4">
            <li>Finding short lattice vectors directly is difficult.</li>
            <li>
              DGS applies Gaussian weights: short vectors get higher
              probability.
            </li>
            <li>Repeated sampling suppresses long vectors.</li>
            <li>
              Samples concentrate around short, nearly independent vectors.
            </li>
            <li>Provides an approximation to SIVP.</li>
          </ul>
        </div>,

        // ----- Block 2: image -----
        <div
          key="dgs-image"
          className="content is-size-4 has-text-centered"
          style={dgsIntroStyles[1]}
        >
          <figure
            className="image is-1by1"
            style={{ margin: "0 auto", maxWidth: "50%" }}
          >
            <img src={siftingImage} alt="Sifting flour analogy" />
          </figure>
          <p className="has-text-grey-light mt-3">
            Sifting: larger parts get intercepted.
          </p>
        </div>,
      ]}
    />
  );
}

export default Overview_DGS;
