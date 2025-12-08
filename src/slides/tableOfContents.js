import { SlideTemplate1 } from "./components/contentSlide1";

const tocStyles = [
  {
    width: "100%",
    height: "auto",
    padding: "3rem 4rem 3rem 4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
];

function TableOfContents() {
  return (
    <SlideTemplate1
      title="Roadmap"
      subtext={<>What we will cover today</>}
      blocks={[
        <div
          key="toc"
          className="content is-size-2 has-text-centered"
          style={{ ...tocStyles[0], fontSize: "1.05rem" }}
        >
          <ul
            style={{ listStylePosition: "inside", paddingLeft: 0, margin: 0 }}
          >
            <li>LWE Problem and Cryptography</li>
            <li>Discrete Gaussian Sampling (DGS)</li>
            <li>Alternative Noise Distributions</li>
            <li>QRTlib: Quantum Real Transforms</li>
            <li>Conclusion</li>
          </ul>
        </div>,
      ]}
    />
  );
}

export default TableOfContents;
