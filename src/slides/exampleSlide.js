import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reset.css";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";

import { ContenSlide1 } from "./components/contentSlide1";

function ExampleSlide1() {
  return (
    <ContenSlide1
      title="Mental training VS physical training"
      subtext={
        <>
          Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua.
        </>
      }
      blocks={[
        <>
          <div
            className="content is-size-4 has-text-left"
            style={{
              width: "100%",
              height: "auto",
              padding: "0rem 2rem 2rem 6rem", // top right bottom left
            }}
          >
            <h4>Mental training</h4>
            <br />
            Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </div>
        </>,
        <>
          <div
            className="content is-size-4 has-text-left"
            style={{
              width: "100%",
              height: "auto",
              padding: "4rem 6rem 6rem 3rem", // top right bottom left
            }}
          >
            <h4>Physical training</h4>
            <br />
            Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </div>
        </>,
      ]}
    />
  );
}

export default ExampleSlide1;
