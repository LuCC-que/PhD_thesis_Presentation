import BackgroundIntro from "./00-background-intro";
import LatticeDemo from "./01-latticeDemo";
import LWEIntroSlides from "./03-lweIntroSlides";
function Introduction() {
  return (
    <>
      <section>
        <BackgroundIntro />
        <section
          style={{ height: "100%", width: "100%", padding: 0, margin: 0 }}
        >
          {/* If you want only the lattice on this slide, drop BackgroundIntro here */}
          {/* <BackgroundIntro /> */}
          <LatticeDemo />
        </section>
      </section>

      <LWEIntroSlides />
    </>
  );
}

export default Introduction;
