import "reveal.js/dist/reset.css";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";

export function SlideTemplate1({ title, subtext, blocks }) {
  return (
    <section style={{ height: "100%", width: "100%" }}>
      <div
        className="box is-flex is-flex-direction-column"
        style={{ height: "100%", padding: 0 }}
      >
        {/* TITLE AREA (~20%) */}
        <header className="is-flex" style={{ flex: 2, width: "100%" }}>
          <div
            className="is-flex is-align-items-center is-justify-content-center"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#003049",
            }}
          >
            <h1
              className="title is-size-2 mb-0 has-text-centered"
              style={{ color: "white" }}
            >
              {title}
            </h1>
          </div>
        </header>

        {/* SUBTEXT AREA (~10%) */}
        {subtext && (
          <div className="is-flex" style={{ flex: 1, width: "100%" }}>
            <div
              className="is-flex is-align-items-center is-justify-content-center"
              style={{ width: "100%", height: "100%" }}
            >
              <div
                className="content is-size-4 has-text-left"
                style={{ padding: "2rem" }}
              >
                {subtext}
              </div>
            </div>
          </div>
        )}

        {/* BODY AREA (~70%) */}
        <main className="is-flex" style={{ flex: 7, width: "100%" }}>
          <div
            className="columns is-variable is-4 is-flex-grow-1"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {blocks?.map((block, i) => (
              <div
                className="column is-flex"
                style={{ height: "100%" }}
                key={i}
              >
                <div
                  className="is-flex is-align-items-center is-justify-content-center"
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {/* Let the caller control all styles inside this container */}
                  {block}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
