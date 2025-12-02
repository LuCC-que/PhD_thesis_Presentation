import { useEffect, useRef, useState } from "react";
import { SlideTemplate1 } from "../components/contentSlide1";
import timelinePdf from "../../assets/pdf/timeline.pdf";

const blockStyle = {
  width: "90%",
  height: "90%",
  padding: "0rem 1rem 0rem 1rem",
};

// PDF.js CDN endpoints (ESM)
const PDFJS_SRC =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs";
const PDFJS_WORKER_SRC =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

function TimelineSlide() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const renderPdf = async () => {
      try {
        const pdfjs = await import(/* webpackIgnore: true */ PDFJS_SRC);
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;

        const pdf = await pdfjs.getDocument(timelinePdf).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        // Fit to container width while rendering at device-pixel resolution; shrink a bit to leave margin
        const containerWidth =
          containerRef.current?.clientWidth || window.innerWidth || 1200;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = (containerWidth * 0.8) / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport,
        };
        await page.render(renderContext).promise;
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to render PDF.");
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SlideTemplate1
      title="Timeline"
      subtext={<>Project milestones and roadmap</>}
      blocks={[
        <div
          key="timeline-graph"
          className="content is-size-6 has-text-left"
          style={blockStyle}
          ref={containerRef}
        >
          {error ? (
            <p style={{ color: "red" }}>
              Could not load PDF: {error}. Please open the file directly.
            </p>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                border: "1px solid #ccc",
                borderRadius: "8px",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </div>,
      ]}
    />
  );
}

export default TimelineSlide;
