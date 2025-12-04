import { SlideTemplate1 } from "../components/contentSlide1";
const pqcTwoBlockStyles = [
  // 0: first block — classical crypto & quantum threat
  {
    width: "100%",
    height: "auto",
    padding: "4rem 4rem 2rem 4rem",
  },
  // 1: second block — lattice-based cryptography
  {
    width: "100%",
    height: "auto",
    padding: "4rem 5rem 2rem 3rem",
  },
];

function BackgroundIntro() {
  return (
    <SlideTemplate1
      title="Why Post-Quantum Cryptography?"
      subtext={
        <>
          Quantum computers break today’s public-key crypto; lattices offer
          quantum-safe alternatives.
        </>
      }
      blocks={[
        // ---------------- Block 1: classical cryptography ----------------
        <div
          key="pqc-block-0"
          className="content is-size-4 has-text-left"
          style={pqcTwoBlockStyles[0]}
        >
          <h4 className="title is-4 mb-3">Classical public-key cryptography</h4>
          <ul className="ml-4">
            <li>
              Cryptography secures messages, signatures, and blockchain
              transactions.
            </li>
            <li>
              Classical schemes (RSA, Diffie–Hellman, ECC) rely on factoring and
              discrete logarithms.
            </li>
            <li>
              Shor’s algorithm solves these problems efficiently on a large
              quantum computer.
            </li>
            <li>
              We need post-quantum schemes to stay secure in the quantum era.
            </li>
          </ul>
        </div>,

        // ---------------- Block 2: lattice-based cryptography ----------------
        <div
          key="pqc-block-1"
          className="content is-size-4 has-text-left"
          style={pqcTwoBlockStyles[1]}
        >
          <h4 className="title is-4 mb-3">Lattice-based cryptography</h4>
          <ul className="ml-4">
            <li>
              Lattice-based cryptography uses high-dimensional geometry instead
              of number theory.
            </li>
            <li>
              Core problems such as SVP and CVP are believed hard even for
              quantum computers.
            </li>
            <li>
              These assumptions support encryption, signatures, key exchange,
              and homomorphic encryption.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default BackgroundIntro;
