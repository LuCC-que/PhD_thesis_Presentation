import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import createLatticeEngine from "./createLatticeEngine";
import { DEFAULT_SCALE } from "./latticeMath";

const LatticeDisplay = forwardRef(function LatticeDisplay(props, ref) {
  const {
    basis,
    showPrimal = true,
    showDual = false,
    showShortest = true,
    shortestSpace = "primal",
    cvpSpace = "primal",
    cvpEnabled = false,
    cvpRadiusFactor = 0.6,
    scale = DEFAULT_SCALE,
    dualPointVariant = "hollow",
    dualPointColor,
    showFundamentalDomain = false,
    fundamentalSpace = "primal",
    showCvpOriginCircle = false,
    enableModProjection = false,
    modProjectionDivider = 1,
    showCvpResidualArrow = false,
    onBasisText,
    onDualBasisText,
    onCvpText,
    onPointSelected,
    onBackgroundClick,
    onModVectorComputed,
  } = props;

  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const engine = createLatticeEngine(containerRef.current, {
      initialBasis: basis,
      initialShowPrimal: showPrimal,
      initialShowDual: showDual,
      initialShowShortest: showShortest,
      initialShortestSpace: shortestSpace,
      initialCvpEnabled: cvpEnabled,
      initialCvpRadiusFactor: cvpRadiusFactor,
      initialCvpSpace: cvpSpace,
      initialScale: scale,
      dualPointVariant,
      dualPointColor,
      showFundamentalDomain,
      fundamentalSpace,
      showCvpOriginCircle,
      enableModProjection,
      modProjectionDivider,
      onBasisText,
      onDualBasisText,
      onCvpText,
      onPointSelected,
      onBackgroundClick,
      showCvpResidualArrow,
      onModVectorComputed,
    });

    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setBasis(basis.b1, basis.b2);
  }, [basis]);

  useEffect(() => {
    engineRef.current?.setShowPrimal(showPrimal);
  }, [showPrimal]);

  useEffect(() => {
    engineRef.current?.setShowDual(showDual);
  }, [showDual]);

  useEffect(() => {
    engineRef.current?.setShowShortest(showShortest);
  }, [showShortest]);

  useEffect(() => {
    engineRef.current?.setShortestSpace(shortestSpace);
  }, [shortestSpace]);

  useEffect(() => {
    engineRef.current?.setCvpEnabled(cvpEnabled);
  }, [cvpEnabled]);

  useEffect(() => {
    engineRef.current?.setCvpRadiusFactor(cvpRadiusFactor);
  }, [cvpRadiusFactor]);

  useEffect(() => {
    engineRef.current?.setCvpSpace(cvpSpace);
  }, [cvpSpace]);

  useEffect(() => {
    engineRef.current?.setScale(scale);
  }, [scale]);

  useEffect(() => {
    engineRef.current?.setShowOriginCircle(showCvpOriginCircle);
  }, [showCvpOriginCircle]);

  useEffect(() => {
    engineRef.current?.setModProjection(enableModProjection, modProjectionDivider);
  }, [enableModProjection, modProjectionDivider]);

  useImperativeHandle(ref, () => ({
    relayout(animated = false) {
      engineRef.current?.relayout(animated);
    },
    setBasis(b1, b2) {
      engineRef.current?.setBasis(b1, b2);
    },
    setScale(newScale, duration) {
      engineRef.current?.setScale(newScale, duration);
    },
    setModVector(vec) {
      engineRef.current?.setModVector(vec);
    },
  }));

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
});

export default LatticeDisplay;
