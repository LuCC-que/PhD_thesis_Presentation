import { SlideTemplate1 } from "../components/contentSlide1";

const BLOCKS_STYLE = [
  // 0: first block — DGS in 3 pieces
  {
    width: "100%",
    height: "auto",
    padding: "0rem 8rem 0rem 8rem",
  },
];

function DGSin3Pieces() {
  return (
    <SlideTemplate1
      title="Three Components of the DGS Algorithm"
      subtext={
        <>
          More precisely, DGS operates through three key components that link
          sampling, CVP solving, and Gaussian narrowing.
        </>
      }
      blocks={[
        // ---- Block 0: ordered list + extra line ----
        <div
          key="dgs-three-components"
          className="content is-size-4 has-text-left"
          style={BLOCKS_STYLE[0]}
        >
          <ol className="ml-4">
            <li className="fragment">
              {String.raw`Starting from samples of $D_{L, r}$, we can construct an oracle that solves $\mathrm{CVP}_{L^*, \alpha p / \sqrt{2}r}$. Smaller $r$ produces a larger CVP range.`}
            </li>

            <li className="fragment">
              {String.raw`A larger CVP range $d$ includes more dual-lattice points within distance $d$, causing less truncation and a wider Gaussian over $L^*$.`}
            </li>

            <li className="fragment">
              {String.raw`A wider Gaussian in the dual lattice becomes a narrower Gaussian in the original lattice $L$ after Fourier transform, suppressing long vectors and preserving short ones.`}
            </li>
          </ol>

          {/* Extra line: not a bullet, but revealed as the next fragment */}
          <p className="fragment mt-4">
            {String.raw`Assuming we have an oracle for $\mathrm{LWE}_{p,\Psi_{\alpha}}$: given a matrix $A$ and a vector $\vec{b} \equiv A\vec{s} + \vec{e} \bmod p$, where $\vec{e}$ is sampled from a noise distribution $\Psi_\alpha$ of width $\alpha$, the oracle recovers the hidden secret $\vec{s}$.`}
          </p>
        </div>,
      ]}
    />
  );
}

export default DGSin3Pieces;
