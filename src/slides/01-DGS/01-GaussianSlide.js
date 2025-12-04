import { useEffect, useRef } from "react";
import { SlideTemplate1 } from "../components/contentSlide1";
import * as d3 from "d3";

const LAYOUT = {
  width: 600,
  height: 400,
  margin: { top: 40, right: 80, bottom: 50, left: 60 },
  legendOffset: { x: -70, y: 10 },
};

const AXIS = {
  xLabel: "||x||",
  yLabel: "ρ_s(||x||)", // or "rho_s(||x||)" if you prefer pure ASCII
  titlePrefix: "Gaussian ρ_s(||x||) for s = ",
  yTicks: 5,
};

const DOMAIN = {
  x: [-5, 5],
  y: [0, 1],
  sampleStep: 0.02,
};

const ANIMATION = {
  duration: 2400,
  stagger: 300,
  ease: d3.easeLinear,
};

const GAUSSIAN_PARAMS = [
  { s: 2.0, color: "red" },
  { s: 1.0, color: "green" },
  { s: 0.5, color: "blue" },
];

const BLOCKS_STYLE = [
  {
    width: "100%",
    height: "auto",
    padding: "0rem 0rem 6.5rem 10rem",
  },

  {
    width: "100%",
    height: "auto",
    padding: "0rem 0rem 6.5rem 10rem",
  },
];
function gaussian(x, s) {
  return Math.exp(-(x * x) / (2 * s * s));
}

function buildSvg(container) {
  const { width, height, margin } = LAYOUT;
  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  return { svg, g, innerWidth, innerHeight };
}

function buildScales(innerWidth, innerHeight) {
  const xScale = d3.scaleLinear().domain(DOMAIN.x).range([0, innerWidth]);

  const yScale = d3.scaleLinear().domain(DOMAIN.y).range([innerHeight, 0]);

  return { xScale, yScale };
}

function drawAxes(g, scales, innerHeight) {
  const xAxis = d3.axisBottom(scales.xScale);
  const yAxis = d3.axisLeft(scales.yScale).ticks(AXIS.yTicks);

  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(xAxis);
  g.append("g").call(yAxis);
}

function drawLabels(g, innerWidth, innerHeight) {
  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .text(AXIS.xLabel);

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .text(AXIS.yLabel);

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .text(`${AXIS.titlePrefix}${GAUSSIAN_PARAMS.map((p) => p.s).join(", ")}`);
}

function drawCurves(g, scales, xs) {
  const line = d3
    .line()
    .x((d) => scales.xScale(d.x))
    .y((d) => scales.yScale(d.y));

  GAUSSIAN_PARAMS.forEach((param) => {
    const data = xs.map((x) => ({ x, y: gaussian(x, param.s) }));

    const path = g
      .append("path")
      .datum(data)
      .attr("class", "gaussian-curve")
      .attr("fill", "none")
      .attr("stroke", param.color)
      .attr("stroke-width", 2)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength);
  });
}

function drawLegend(g, innerWidth) {
  const legend = g
    .append("g")
    .attr(
      "transform",
      `translate(${innerWidth + LAYOUT.legendOffset.x}, ${
        LAYOUT.legendOffset.y
      })`
    );

  GAUSSIAN_PARAMS.forEach((param, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 18})`);

    row
      .append("line")
      .attr("x1", 0)
      .attr("x2", 20)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", param.color)
      .attr("stroke-width", 2);

    row
      .append("text")
      .attr("x", 25)
      .attr("y", 4)
      .attr("font-size", 11)
      .text(`s = ${param.s}`);
  });
}

function animateCurves(container, g) {
  const paths = g.selectAll("path.gaussian-curve");

  const run = () => {
    paths.each(function (_d, i) {
      const p = d3.select(this);
      const totalLength = this.getTotalLength();

      p.interrupt()
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(ANIMATION.duration)
        .delay(i * ANIMATION.stagger)
        .ease(ANIMATION.ease)
        .attr("stroke-dashoffset", 0);
    });
  };

  const sectionEl = container.closest("section");
  if (!sectionEl) {
    // No slide wrapper found → just run once.
    run();
    return () => {};
  }

  // If this slide is already visible when mounted, run immediately.
  if (sectionEl.classList.contains("present")) {
    run();
  }

  // Watch for class changes on the slide; Reveal toggles "present" on the active slide.
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "class") {
        if (sectionEl.classList.contains("present")) {
          run();
        }
      }
    }
  });

  observer.observe(sectionEl, { attributes: true });

  return () => {
    observer.disconnect();
  };
}

function GaussianSlide() {
  const chartRef = useRef(null);

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return undefined;

    d3.select(container).selectAll("*").remove();

    const { g, innerWidth, innerHeight } = buildSvg(container);
    const scales = buildScales(innerWidth, innerHeight);

    drawAxes(g, scales, innerHeight);
    drawLabels(g, innerWidth, innerHeight);

    const xs = d3.range(DOMAIN.x[0], DOMAIN.x[1] + 0.01, DOMAIN.sampleStep);
    drawCurves(g, scales, xs);
    drawLegend(g, innerWidth);

    const cleanupAnimation = animateCurves(container, g);
    return cleanupAnimation;
  }, []);

  return (
    <SlideTemplate1
      title="Discrete Gaussian Sampling (DGS)"
      subtext={
        <>
          {String.raw`$\rho_s(x)$ is a Gaussian weight on $\mathbb{R}^n$, and $D_{L,s}$ is the corresponding discrete Gaussian on a lattice $L$.`}
        </>
      }
      blocks={[
        // ---- Block 0: intuition bullets ----
        <div
          key="gaussian-intuition"
          className="content is-size-5 has-text-left"
          style={BLOCKS_STYLE[0]}
        >
          <h6 className="title is-4 mb-2">Discrete Gaussian on a Lattice</h6>
          <ul className="ml-4">
            <li>
              <li>
                <span>{String.raw`The Gaussian function is defined by`}</span>
                <span style={{ display: "block", marginTop: "0.25rem" }}>
                  {String.raw`$\rho_s(x) = \exp\!\big(-\|x\|^2 / 2s^2\big)$ for $x \in \mathbb{R}^n$ and $s > 0$.`}
                </span>
              </li>
            </li>
            <li>
              {String.raw`The discrete Gaussian on a lattice $L \subset \mathbb{R}^n$ is defined by`}
              {String.raw` $D_{L,s}(y) = \rho_s(y)\big/\sum_{z \in L} \rho_s(z)$ for $y \in L$.`}
            </li>
            <li>
              {String.raw`The parameter $s$ controls the width: larger $s$ spreads mass over many lattice points, while smaller $s$ concentrates mass near the origin and other short lattice vectors.`}
            </li>
          </ul>
        </div>,
        // ---- Block 1: chart ----
        <div
          key="dgs-image"
          className="content is-size-4 has-text-centered"
          style={BLOCKS_STYLE[1]}
        >
          <div
            key="gaussian-chart"
            ref={chartRef}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </div>,
      ]}
    />
  );
}

export default GaussianSlide;
