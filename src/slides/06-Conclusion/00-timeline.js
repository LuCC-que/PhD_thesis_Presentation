// src/slides/TimelineSlide.js
import { SlideTemplate1 } from "../components/contentSlide1";

const blockStyle = {
  width: "90%",
  height: "90%",
  padding: "0rem 1rem 0rem 1rem",
  overflow: "auto",
};

const TABLE_BG = "#669bbc";
const LABEL_BG = "#003049";
const LABEL_TEXT = "#ffffff";
const SPAN_BG = "#780000"; // bar colour

const years = [2023, 2024, 2025, 2026, 2027];

const termLayout = {
  2023: ["Fall"],
  2024: ["Win", "S/S", "Fall"],
  2025: ["Win", "S/S", "Fall"],
  2026: ["Win", "S/S", "Fall"],
  2027: ["Win", "S/S", "Fall"],
};

// Flat list of all term slots in order
const terms = years.flatMap((year) =>
  termLayout[year].map((term) => ({ year, term }))
);
const totalTerms = terms.length;

// Build cells for a row with multiple labelled spans
function buildMultiSpanCells(segments) {
  // segments: [{ label, startYear, startTerm, endYear, endTerm }, ...]
  const normalized = segments
    .map((seg) => {
      const startIndex = terms.findIndex(
        (t) => t.year === seg.startYear && t.term === seg.startTerm
      );
      const endIndex = terms.findIndex(
        (t) => t.year === seg.endYear && t.term === seg.endTerm
      );
      if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        return null;
      }
      return { ...seg, startIndex, endIndex };
    })
    .filter(Boolean)
    .sort((a, b) => a.startIndex - b.startIndex);

  const cells = [];

  for (let i = 0; i < totalTerms; ) {
    const seg = normalized.find((s) => s.startIndex === i);
    if (seg) {
      const spanLength = seg.endIndex - seg.startIndex + 1;
      cells.push(
        <td
          key={`${seg.label}-${i}`}
          colSpan={spanLength}
          style={{
            backgroundColor: SPAN_BG,
            color: LABEL_TEXT,
            textAlign: "center",
            fontWeight: 600,
            borderColor: LABEL_BG,
            whiteSpace: "nowrap",
          }}
        >
          {seg.label}
        </td>
      );
      i += spanLength;
    } else {
      cells.push(
        <td
          key={`empty-${i}`}
          style={{
            backgroundColor: TABLE_BG,
            borderColor: LABEL_BG,
          }}
        ></td>
      );
      i += 1;
    }
  }

  return cells;
}

function TimelineSlide() {
  return (
    <SlideTemplate1
      title="Timeline"
      subtext={<>Project milestones and roadmap</>}
      blocks={[
        <div
          key="timeline-table"
          className="content is-size-6 has-text-left"
          style={blockStyle}
        >
          <table
            className="table is-fullwidth is-bordered is-narrow"
            style={{
              backgroundColor: TABLE_BG,
              color: LABEL_TEXT,
              borderColor: LABEL_BG,
            }}
          >
            <thead>
              {/* Row 1: Years */}
              <tr>
                <th
                  style={{
                    width: "14%",
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    textAlign: "center",
                    borderColor: LABEL_BG,
                  }}
                >
                  Activity / Term
                </th>
                {years.map((year) => (
                  <th
                    key={year}
                    colSpan={termLayout[year].length}
                    style={{
                      textAlign: "center",
                      backgroundColor: LABEL_BG,
                      color: LABEL_TEXT,
                      borderColor: LABEL_BG,
                    }}
                  >
                    {year}
                  </th>
                ))}
              </tr>

              {/* Row 2: Terms */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                  }}
                ></th>
                {terms.map((t, idx) => (
                  <th
                    key={`${t.year}-${t.term}-${idx}`}
                    style={{
                      textAlign: "center",
                      backgroundColor: LABEL_BG,
                      color: LABEL_TEXT,
                      borderColor: LABEL_BG,
                    }}
                  >
                    {t.term}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* 1) Coursework + Poster + Seminars */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  // Coursework: 2023 Fall → 2024 Win
                  {
                    label: "Coursework",
                    startYear: 2023,
                    startTerm: "Fall",
                    endYear: 2024,
                    endTerm: "Win",
                  },
                  // Poster: Fall 2024
                  {
                    label: "Poster",
                    startYear: 2024,
                    startTerm: "Fall",
                    endYear: 2024,
                    endTerm: "Fall",
                  },
                  // Seminars: Fall 2025
                  {
                    label: "Seminars",
                    startYear: 2025,
                    startTerm: "Fall",
                    endYear: 2025,
                    endTerm: "Fall",
                  },
                ])}
              </tr>

              {/* 2) Comp Exam I: 2025 Win to 2025 S/S */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  {
                    label: "Comp Exam I",
                    startYear: 2025,
                    startTerm: "Win",
                    endYear: 2025,
                    endTerm: "S/S",
                  },
                ])}
              </tr>

              {/* 3) Comp Exam II: 2025 Fall to 2026 Win */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  {
                    label: "Comp Exam II",
                    startYear: 2025,
                    startTerm: "Fall",
                    endYear: 2026,
                    endTerm: "Win",
                  },
                ])}
              </tr>

              {/* 4) LWE Research: 2024 S/S to 2025 Win, LWE Continued: 2025 Fall to 2026 Fall */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  {
                    label: "LWE Research",
                    startYear: 2024,
                    startTerm: "S/S",
                    endYear: 2025,
                    endTerm: "Win",
                  },
                  {
                    label: "LWE Continued",
                    startYear: 2025,
                    startTerm: "Fall",
                    endYear: 2026,
                    endTerm: "Fall",
                  },
                ])}
              </tr>

              {/* 5) QRTlib Development & Graduation Preparation */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  {
                    label: "QRTlib Development",
                    startYear: 2025,
                    startTerm: "Win",
                    endYear: 2025,
                    endTerm: "Fall",
                  },
                  {
                    label: "Graduation Preparation",
                    startYear: 2026,
                    startTerm: "Fall",
                    endYear: 2027,
                    endTerm: "Fall",
                  },
                ])}
              </tr>

              {/* 6) PIR + ZKP Framework: 2025 Fall to 2027 S/S */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  {
                    label: "PIR + ZKP Framework",
                    startYear: 2025,
                    startTerm: "Fall",
                    endYear: 2027,
                    endTerm: "S/S",
                  },
                ])}
              </tr>

              {/* 7) Additional Research: 2026 Win to 2027 S/S */}
              <tr>
                <th
                  style={{
                    backgroundColor: LABEL_BG,
                    color: LABEL_TEXT,
                    borderColor: LABEL_BG,
                    whiteSpace: "nowrap",
                  }}
                ></th>
                {buildMultiSpanCells([
                  {
                    label: "Additional Research",
                    startYear: 2026,
                    startTerm: "Win",
                    endYear: 2027,
                    endTerm: "S/S",
                  },
                ])}
              </tr>
            </tbody>
          </table>
        </div>,
      ]}
    />
  );
}

export default TimelineSlide;
