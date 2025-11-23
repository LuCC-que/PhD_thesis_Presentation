import { ContenSlide1 } from "../components/contentSlide1";

function Overview_DGS() {
  return (
    <ContenSlide1
      title="Discrete Gaussian Sampling (DGS)"
      subtext={
        <>
          DGS uses a Gaussian weight to filter out long lattice vectors and keep
          the short ones.
        </>
      }
      blocks={[
        <>
          <div
            className="content is-size-4 has-text-left"
            style={{
              width: "100%",
              height: "auto",
              padding: "0rem 2rem 2rem 6rem", // top right bottom left
            }}
          >
            <h2>Intuition</h2>
            <ul>
              <li>View lattice vectors as “particles”.</li>
              <li>
                Long vectors get tiny Gaussian weight and are filtered out.
              </li>
              <li>
                Short vectors keep more weight and survive repeated sampling.
              </li>
              <li>
                In the end, mass concentrates on the shortest independent
                vectors.
              </li>
            </ul>
          </div>
        </>,
      ]}
    />
  );
}

export default Overview_DGS;
