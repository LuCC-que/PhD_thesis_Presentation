import { useEffect, useRef } from "react";
import { animate } from "animejs";
import "./../../lwe.css";

function LweAnimeSlide() {
  const sectionRef = useRef(null);
  const startedRef = useRef(false);

  const runAnimation = async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const container = sectionRef.current;
    const width = container?.offsetWidth || window.innerWidth;
    const deltaX = width * 0.35; // how far things fly to the right

    // 1) emit \vec{a}_1
    await animate("#token-a1", {
      translateX: [0, deltaX],
      duration: 800,
      easing: "ease-in-out",
    }).finished;

    // 2) emit \vec{s}
    await animate("#token-s", {
      translateX: [0, deltaX + 40],
      duration: 800,
      easing: "ease-in-out",
    }).finished;

    // 3) emit e_1
    await animate("#token-e1", {
      translateX: [0, deltaX + 80],
      duration: 800,
      easing: "ease-in-out",
    }).finished;

    // 4) fade all tokens out
    await animate(".lwe-token", {
      opacity: [1, 0],
      duration: 400,
      easing: "ease-out",
    }).finished;

    // 5) reveal the assembled equation
    await animate("#eq-1", {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 600,
      easing: "ease-out",
    }).finished;
  };

  useEffect(() => {
    const fragment = document.getElementById("lwe-trigger-fragment");
    if (!fragment) return;

    const observer = new MutationObserver(() => {
      // Reveal marks shown fragments with class "visible"
      if (fragment.classList.contains("visible")) {
        runAnimation();
      }
    });

    observer.observe(fragment, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ background: "#f5f0d5", position: "relative" }}
    >
      <div className="container">
        <div className="columns is-vcentered">
          {/* LEFT: sources */}
          <div className="column is-one-quarter">
            <div className="box has-text-centered">
              {String.raw`\(\mathbb{Z}_q^n\)`}
            </div>
            <div className="box has-text-centered">
              {String.raw`\(\varphi_{\alpha}\)`}
            </div>
          </div>

          {/* RIGHT: final equation (hidden until animation) */}
          <div className="column has-text-left">
            <div id="eq-1" className="lwe-equation-line">
              {String.raw`\(\langle \vec{\mathbf{a}}_1, \vec{\mathbf{s}} \rangle + e_1 \equiv b_1 \pmod{q}\)`}
            </div>
          </div>
        </div>

        {/* MOVING TOKENS */}
        <div className="lwe-token-layer">
          <div id="token-a1" className="lwe-token">
            {String.raw`\(\vec{\mathbf{a}}_1\)`}
          </div>
          <div id="token-s" className="lwe-token">
            {String.raw`\(\vec{\mathbf{s}}\)`}
          </div>
          <div id="token-e1" className="lwe-token">
            {String.raw`\(e_1\)`}
          </div>
        </div>

        {/* Invisible fragment that Reveal will step through */}
        <span
          id="lwe-trigger-fragment"
          className="fragment"
          style={{ display: "none" }}
        ></span>
      </div>
    </section>
  );
}

export default LweAnimeSlide;
