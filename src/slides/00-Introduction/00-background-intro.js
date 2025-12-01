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
          Quantum computers break classical cryptosystems; lattices offer secure
          alternatives.
        </>
      }
      blocks={[
        // ---------------- Block 1: classical cryptography ----------------
        <div
          key="pqc-block-0"
          className="content is-size-4 has-text-left"
          style={pqcTwoBlockStyles[0]}
        >
          <ul className="ml-4">
            <li>
              Cryptography protects communication, signatures, and blockchain
              interactions.
            </li>

            <li>
              Classical schemes—RSA, Diffie–Hellman, ECC—rely on factoring and
              discrete log problems.
            </li>

            <li>
              Shor’s algorithm solves these number-theoretic problems
              efficiently on a quantum computer.
            </li>

            <li>
              Post-quantum cryptography is required to remain secure in a
              quantum era.
            </li>
          </ul>
        </div>,

        // ---------------- Block 2: lattice-based cryptography ----------------
        <div
          key="pqc-block-1"
          className="content is-size-4 has-text-left"
          style={pqcTwoBlockStyles[1]}
        >
          <ul className="ml-4">
            <li>
              Lattice-based cryptography replaces number theory with
              high-dimensional geometry.
            </li>

            <li>
              Key problems include SVP and CVP, believed to be hard even for
              quantum algorithms.
            </li>

            <li>
              Lattice assumptions support encryption, digital signatures, key
              exchange, and homomorphic encryption.
            </li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default BackgroundIntro;

