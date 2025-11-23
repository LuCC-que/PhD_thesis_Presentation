import { ContenSlide1 } from "../components/contentSlide1";

const blockStyles = [
  // 0: Slide 1 – only block
  {
    width: "100%",
    height: "auto",
    padding: "4rem 6rem 2rem 3rem", // top right bottom left
  },
  // 1: Slide 2 – left block (equations)
  {
    width: "100%",
    height: "auto",
    padding: "0rem 0rem 5rem 9rem",
  },
  // 2: Slide 2 – right block (text)
  {
    width: "100%",
    height: "auto",
    padding: "0rem 9rem 5rem 0rem",
  },
  // 3: Slide 3 – only block
  {
    width: "100%",
    height: "auto",
    padding: "4rem 6rem 2rem 3rem",
  },
];

function LWEIntroSlides() {
  return (
    <>
      <section>
        {/* --------------------- Vertical Slide 1 --------------------- */}
        <ContenSlide1
          title="Components of LWE"
          blocks={[
            <div
              key="slide1-block0"
              className="content is-size-4 has-text-left"
              style={blockStyles[0]}
            >
              <ol className="ml-4">
                <li className="fragment" data-fragment-index="1">
                  {String.raw`Sample $m$ random vectors 
                    $\vec{a}_1, \vec{a}_2, \ldots, \vec{a}_m \in \mathbb{Z}_q^{n}$, 
                    each drawn uniformly and independently.`}
                </li>

                <li className="fragment" data-fragment-index="2">
                  {String.raw`Choose a fixed secret vector 
                    $\vec{s} \in \mathbb{Z}_q^{n}$, which represents the hidden key to be recovered.`}
                </li>

                <li className="fragment" data-fragment-index="3">
                  {String.raw`For each vector $\vec{a}_i$, generate a small error term 
                    $e_i$ from the noise distribution $\psi_\alpha$ (typically a discrete Gaussian 
                    with standard deviation $\alpha q$).`}
                </li>

                <li className="fragment" data-fragment-index="4">
                  {String.raw`These $e_i$ values model random perturbations or “learning errors.”`}
                </li>
              </ol>
            </div>,
          ]}
        />

        {/* --------------------- Vertical Slide 2 --------------------- */}
        <ContenSlide1
          title="Constructing LWE Samples"
          subtext={
            <>
              {String.raw`Recall: $\vec{a}_i$ are uniform samples, $\vec{s}$ is the secret, $e_i$ are small noise terms, and all equations are modulo $q$.`}
            </>
          }
          blocks={[
            // LEFT BLOCK: equations
            <div
              key="slide2-block0"
              className="content is-size-4 has-text-left"
              style={blockStyles[1]}
            >
              <div className="equation-sequence" style={{ textAlign: "left" }}>
                <p className="fragment">
                  {String.raw`$\langle \vec{a}_1, \vec{s} \rangle + e_1 \equiv b_1 \pmod{q}$`}
                </p>

                <p className="fragment">
                  {String.raw`$\langle \vec{a}_2, \vec{s} \rangle + e_2 \equiv b_2 \pmod{q}$`}
                </p>

                <p className="fragment">{String.raw`$\cdots$`}</p>

                <p className="fragment">
                  {String.raw`$\langle \vec{a}_m, \vec{s} \rangle + e_m \equiv b_m \pmod{q}$`}
                </p>
              </div>
            </div>,

            // RIGHT BLOCK: explanation + matrix form
            <div
              key="slide2-block1"
              className="content is-size-4 has-text-left"
              style={blockStyles[2]}
            >
              <ul className="ml-4">
                <li className="fragment">
                  {String.raw`The public data are the pairs $(\vec{a}_i, b_i)$ for $i = 1,\ldots,m$.`}
                </li>

                <li className="fragment">
                  {String.raw`Each pair is one noisy linear equation involving the secret $\vec{s}$.`}
                </li>

                <li className="fragment">
                  {String.raw`
                        Together, they form the matrix equation:
                        \[
                            \vec{b} \equiv A\vec{s} + \vec{e} \pmod{q}.
                        \]
                  `}
                </li>

                <li className="fragment">
                  {String.raw`Here $A$ has rows $\vec{a}_i$, and $\vec{e} = (e_1,\ldots,e_m)$.`}
                </li>
              </ul>
            </div>,
          ]}
        />

        {/* --------------------- Vertical Slide 3 --------------------- */}
        <ContenSlide1
          title="The LWE Problem"
          subtext={<>The Learning With Errors (LWE) problem asks:</>}
          blocks={[
            <div
              key="slide3-block0"
              className="content is-size-4 has-text-left"
              style={blockStyles[3]}
            >
              <p>
                {String.raw`Given the matrix $A$ and the vector $\vec{b}$, recover the hidden secret vector $\vec{s}$.`}
              </p>

              <p>
                {String.raw`Without the error vector $\vec{e}$, the system is a set of linear equations over $\mathbb{Z}_q$ 
                        and can be solved efficiently using Gaussian elimination.`}
              </p>

              <p>
                {String.raw`However, the presence of small random errors makes the system inconsistent, and no efficient 
                    algorithm is known for recovering $\vec{s}$ under standard assumptions.`}
              </p>

              <p>
                {String.raw`This combination of linear structure with controlled noise is why LWE is both simple and 
                    cryptographically strong.`}
              </p>
            </div>,
          ]}
        />
      </section>
    </>
  );
}

export default LWEIntroSlides;
