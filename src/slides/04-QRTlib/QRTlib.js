import Background_QRTlib from "./00-background-QRTlib";
import ClassicalGapQRT from "./01-classical-gap";
import ExistingTransformsQRT from "./02-existing-transforms";
import ContributionsStatusQRT from "./03-contributions-status";

const QRTLib = () => {
  return (
    <section>
      <Background_QRTlib />
      {/* <ClassicalGapQRT /> */}
      <ExistingTransformsQRT />
      <ContributionsStatusQRT />
    </section>
  );
};

export default QRTLib;
