import BackgroundIntro from "./00-background-intro";
import LatticeDemo from "./01-latticeDemo";
import LWEIntroSlides from "./03-lweIntroSlides";
function Introduction() {
  return (
    <>
      <section>
        <BackgroundIntro />
        <LatticeDemo />
      </section>
      <LWEIntroSlides />
    </>
  );
}

export default Introduction;
