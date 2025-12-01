import Overview_DGS from "./00-Overview_DGS";
import GaussianSlide from "./01-GaussianSlide";
import DGSin3Pieces from "./02-DGSin3Pieces";
import FirstPieces from "./03-FirstPieces";
import SecondPieces from "./04-SecondPieces";
import FourierTransformLink from "./05-Fourier-transform";
import PutEverythingTogether from "./06-put-everything-together";
function DGS() {
  return (
    <section>
      <Overview_DGS />
      <GaussianSlide />
      <DGSin3Pieces />
      <FirstPieces />
      <SecondPieces />
      <FourierTransformLink />
      <PutEverythingTogether />
    </section>
  );
}

export default DGS;
