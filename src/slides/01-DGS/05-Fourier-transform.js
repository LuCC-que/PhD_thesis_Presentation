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
          className="content is-size-6 has-text-left"
          style={{
            ...FOURIER_BLOCK_STYLE,
            lineHeight: "0",
          }}
        >
          <ul className="ml-0">
            <li>
              The Gaussian and its Fourier transform trade widths: a wide
              Gaussian in one domain becomes a narrow Gaussian in the other.
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For $r > 0$, let`}
              <p>{String.raw`$$\rho_r(x) = e^{-\pi \lvert x \rvert^2 / r^2}$$`}</p>
              {String.raw`be the $n$-dimensional Gaussian.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`For a lattice $L$ and its dual $L^*$, Poisson summation relates Gaussians on both lattices:`}
              <p>{String.raw`$$\rho_r(L) = r^n \det(L^*)\, \rho_{1/r}(L^*)$$`}</p>
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              {String.raw`Equivalently, viewed as a discrete Fourier transform from $L^*$ to $L$,`}
              <p>
                {String.raw`$$\rho_{1/r}(L^*) = \frac{1}{r^n \det(L^*)}\, \rho_r(L)$$`}
              </p>
              {String.raw`so a Gaussian with width $1/r$ on $L^*$ corresponds (up to normalisation) to a Gaussian with width $r$ on $L$.`}
            </li>
            <li style={{ marginTop: "0.75rem" }}>
              Thus, a wider Gaussian on the dual lattice $L^*$ corresponds to a
              more concentrated Gaussian on the original lattice $L$.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default FourierTransformLink;

