import { SlideTemplate1 } from "../components/contentSlide1";

const blockStyles = [
  // 0: Slide 1 – left block (setup)
  {
    width: "100%",
    height: "auto",
    padding: "3rem 4rem 2rem 3rem",
  },
  // 1: Slide 1 – right block (samples + matrix form)
  {
    width: "100%",
    height: "auto",
    padding: "3rem 3rem 2rem 1rem",
  },
  // 2: Slide 2 – single block
  {
    width: "100%",
    height: "auto",
    padding: "0rem 6rem 6rem 8rem",
  },
];

function LWEIntroSlides() {
  return (
    <>
      <section>
        {/* --------------------- Vertical Slide 1 --------------------- */}
        <SlideTemplate1
          title="LWE Setup & Samples"
          blocks={[
            // LEFT: setup
            <div
              key="slide1-left"
              className="content is-size-4 has-text-left"
              style={blockStyles[0]}
            >
              <ul className="ml-4">
                <li className="fragment">
                  {String.raw`Fix modulus $q$ and dimension $n$.`}
                </li>
                <li className="fragment">
                  {String.raw`Choose a secret vector $\vec{s} \in \mathbb{Z}_q^n$.`}
                </li>
                <li className="fragment">
                  {String.raw`Let $\psi_\alpha$ be a noise distribution over $\mathbb{Z}$ (e.g., a continuous Gaussian).`}
                </li>
                <li className="fragment">
                  {String.raw`For each sample, draw $\vec{a}_i \gets \mathbb{Z}_q^n$ uniformly.`}
                </li>
              </ul>
            </div>,

            // RIGHT: samples + matrix form (appears later via fragments)
            <div
              key="slide1-right"
              className="content is-size-4 has-text-left"
              style={blockStyles[1]}
            >
              <div className="mb-4">
                <p className="fragment">
                  {String.raw`For each $i = 1,\ldots,m$ define an LWE sample by`}
                </p>
                <p className="fragment">
                  {String.raw`$\langle \vec{a}_i, \vec{s} \rangle + e_i \equiv b_i \pmod{q}, \quad e_i \gets \psi_\alpha.$`}
                </p>
              </div>

              <div>
                <p className="fragment">
                  {String.raw`Stacking all samples gives the matrix form`}
                </p>
                <p className="fragment">
                  {String.raw`$\vec{b} \equiv A \vec{s} + \vec{e} \pmod{q},$`}
                </p>
                <p className="fragment">
                  {String.raw`where $A$ has rows $\vec{a}_1,\ldots,\vec{a}_m$, $\vec{b} = (b_1,\ldots,b_m)$, and $\vec{e} = (e_1,\ldots,e_m)$.`}
                </p>
              </div>
            </div>,
          ]}
        />

        {/* --------------------- Vertical Slide 2 --------------------- */}
        <SlideTemplate1
          title="The LWE Problem"
          subtext={
            <>
              {String.raw`LWE is a noisy system of linear equations over $\mathbb{Z}_q$.`}
            </>
          }
          blocks={[
            <div
              key="slide2-main"
              className="content is-size-4 has-text-left"
              style={blockStyles[2]}
            >
              <ul className="ml-4">
                <li className="fragment">
                  {String.raw`Input: matrix $A \in \mathbb{Z}_q^{m \times n}$ and vector $\vec{b} \in \mathbb{Z}_q^m$.`}
                </li>
                <li className="fragment">
                  {String.raw`Promise: $\vec{b} \equiv A \vec{s} + \vec{e} \pmod{q}$ for some secret $\vec{s}$ and small noise $\vec{e}$.`}
                </li>
                <li className="fragment">
                  {String.raw`Goal: given $(A,\vec{b})$, recover the hidden secret $\vec{s}$.`}
                </li>
                <li className="fragment">
                  {String.raw`If $\vec{e} = \vec{0}$, solving is easy linear algebra; with small noise, the problem is believed hard (via lattice reductions).`}
                </li>
              </ul>
            </div>,
          ]}
        />
      </section>
    </>
  );
}

export default LWEIntroSlides;
