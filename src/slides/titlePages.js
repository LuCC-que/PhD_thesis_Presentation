function Title() {
  return (
    <>
      <section data-auto-animate>
        {/* Huge full-screen title */}
        <h1
          data-id="main-title"
          style={{
            fontSize: "7.5rem",
            lineHeight: 1.0,
            margin: 5,
            padding: 50,
          }}
        >
          <span>Alternative Distributions for</span>
          <br />
          <span>Learning With Errors Cryptography</span>
        </h1>

        {/* Ghost subtitle so Reveal can animate it later */}
        <div
          data-id="subtitle-block"
          style={{
            marginTop: "10rem", // start very low
            opacity: 0, // invisible first
            fontSize: "1.4rem",
            textAlign: "center",
          }}
        >
          <h3>Comprehensive Exam Part II</h3>
          <p>Presenter: Lu Chen</p>
          <p>Supervisor: Jake Doliskani</p>
        </div>
      </section>

      <section data-auto-animate>
        {/* Smaller but still dominant title */}
        <h1
          data-id="main-title"
          style={{
            fontSize: "4.2rem",
            lineHeight: 1.15,
            margin: 0,
            padding: 0,
          }}
        >
          <span>Alternative Distributions for</span>
          <br />
          <span>
            <span>LWE</span> Cryptography
          </span>
        </h1>

        {/* Subtitle moves up & becomes visible */}
        <div
          data-id="subtitle-block"
          style={{
            marginTop: "3.5rem", // moves up
            opacity: 1, // fade in
            fontSize: "1.4rem",
            textAlign: "center",
          }}
        >
          <h3>Comprehensive Exam Part II</h3>
          <p>Presenter: Lu Chen</p>
          <p>Supervisor: Jake Doliskani</p>
        </div>
      </section>
    </>
  );
}

export default Title;
