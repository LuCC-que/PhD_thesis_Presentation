import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";
import "reveal.js/dist/reset.css";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";

import Title from "./slides/titlePages";
import TableOfContents from "./slides/tableOfContents";
import Introduction from "./slides/00-Introduction/introduction";
import DGS from "./slides/01-DGS/DGS";
import Alt_Dists from "./slides/03-Alt-DISTs/Alt-Dists";
import QRTLib from "./slides/04-QRTlib/QRTlib";
import PIR from "./slides/05-PIRs/PIR";
import Conclusion from "./slides/06-Conclusion/conclusion";

import FirstPieces from "./slides/01-DGS/03-FirstPieces";
import SecondPieces from "./slides/01-DGS/04-SecondPieces";
import FourierTransformLink from "./slides/01-DGS/05-Fourier-transform";

const BASE_SLIDE_HEIGHT = 720; // keep content sizing consistent while adapting width to the viewport

function App() {
  const deckDivRef = useRef(null);
  const deckRef = useRef(null);

  useEffect(() => {
    // Avoid double init (StrictMode renders twice in dev)
    if (deckRef.current) return;

    const container = deckDivRef.current;
    if (!container) return;

    const computeSlideSize = () => {
      const viewportHeight = window.innerHeight || BASE_SLIDE_HEIGHT;
      const viewportWidth = window.innerWidth || 1280;
      const aspectRatio = viewportWidth / Math.max(viewportHeight, 1);

      return {
        width: Math.round(BASE_SLIDE_HEIGHT * aspectRatio),
        height: BASE_SLIDE_HEIGHT,
      };
    };

    const initialSize = computeSlideSize();

    const deck = new Reveal(container, {
      hash: true,
      transition: "slide",
      slideNumber: "c/t",

      // Base slide height with responsive width (fills viewport on different aspect ratios)
      width: initialSize.width,
      height: initialSize.height,

      // No extra margin around slides
      margin: 0,

      // Use Reveal's auto-scaling/layout (default)
      disableLayout: false,

      // 🔢 KaTeX configuration (optional, but good to be explicit)
      katex: {
        // "latest" is fine; if you want to pin:
        // version: "0.16.11",
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        // You can add macros later if needed:
        // macros: {
        //   "\\LWE": "\\mathsf{LWE}",
        //   "\\Prb": "\\mathbb{P}",
        // },
      },

      // 🔌 Plugins
      plugins: [RevealMath.KaTeX],
    });

    deckRef.current = deck;

    const handleResize = () => {
      const deckInstance = deckRef.current;
      if (!deckInstance) return;
      const nextSize = computeSlideSize();
      deckInstance.configure(nextSize);
      deckInstance.layout();
    };

    deck.initialize().then(handleResize).catch(console.error);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (deckRef.current) {
        deckRef.current.destroy();
        deckRef.current = null;
      }
    };
  }, []);

  return (
    <div className="reveal" ref={deckDivRef}>
      <div className="slides">
        <Title />
        <TableOfContents />
        <Introduction />
        <DGS />
        <Alt_Dists />
        <QRTLib />
        {/* <PIR /> */}
        <Conclusion />
        <section>
          <FirstPieces />
          <SecondPieces />
          <FourierTransformLink />
        </section>
      </div>
    </div>
  );
}

export default App;
