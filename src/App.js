import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";
import "reveal.js/dist/reset.css";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";

import Title from "./slides/titlePages";
import Introduction from "./slides/00-Introduction/introduction";
import ExampleSlide1 from "./slides/exampleSlide";
import DGS from "./slides/01-DGS/DGS";
import FirstPieces from "./slides/01-DGS/03-FirstPieces";
import Alt_Dists from "./slides/03-Alt-DISTs/Alt-Dists";
import QRTLib from "./slides/04-QRTlib/QRTlib";

function App() {
  const deckDivRef = useRef(null);
  const deckRef = useRef(null);

  useEffect(() => {
    // Avoid double init (StrictMode renders twice in dev)
    if (deckRef.current) return;

    const container = deckDivRef.current;
    if (!container) return;

    const deck = new Reveal(container, {
      hash: true,
      transition: "slide",
      slideNumber: "c/t",

      // Fixed slide size (16:9)
      width: 1280,
      height: 720,

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

    deck.initialize().catch(console.error);

    return () => {
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
        <Introduction />
        <DGS />
        <Alt_Dists />
        <QRTLib />
        {/* <ExampleSlide1 /> */}
        <section>
          <section>slide 1</section>
          <section>slide 1.2</section>
        </section>
      </div>
    </div>
  );
}

export default App;
