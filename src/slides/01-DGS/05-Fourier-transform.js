import { SlideTemplate1 } from "../components/contentSlide1";

const FOURIER_BLOCK_STYLE = {
  width: "100%",
  height: "auto",
  padding: "0rem 7rem 2rem 15rem",
};

function FourierTransformLink() {
  return (
    <SlideTemplate1
      title="Fourier Link Between L* and L"
      subtext={<>Wider on the dual lattice, narrower on the original lattice</>}
      blocks={[
        <div
          key="fourier-link-block"
          className="content is-size-5 has-text-left"
          style={{
            ...FOURIER_BLOCK_STYLE,
            lineHeight: "0",
          }}
        >
          <ul className="ml-0">
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For $r > 0$ and a lattice $L \subset \mathbb{R}^n$, define the Gaussian and its lattice sum:`}
              <p>
                {String.raw`$$\rho_r(x) = e^{-\pi \lvert x \rvert^2 / r^2},\quad
      \rho_r(L) = \sum_{x \in L} \rho_r(x).$$`}
              </p>
            </li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For a lattice $L$ with dual $L^*$, Poisson summation gives`}
              <p>{String.raw`$$\rho_r(L) = r^n \det(L^*)\, \rho_{1/r}(L^*).$$`}</p>
            </li>

            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Equivalently, as a discrete Fourier transform from $L^*$ to $L$,`}
              <p>
                {String.raw`$$\rho_{1/r}(L^*) = \frac{1}{r^n \det(L^*)}\, \rho_r(L),$$`}
              </p>
              {String.raw`so width $1/r$ on $L^*$ corresponds (up to normalisation) to width $r$ on $L$. A wider Gaussian on $L^*$ means a narrower one on $L$.`}
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default FourierTransformLink;
