import React, { forwardRef } from "react";
import LatticeDisplay from "./LatticeDisplay";

const DualLatticeDisplay = forwardRef(function DualLatticeDisplay(props, ref) {
  const { showShortest = true, cvpEnabled = false, ...rest } = props;
  return (
    <LatticeDisplay
      ref={ref}
      showPrimal={false}
      showDual
      showShortest={showShortest}
      shortestSpace="dual"
      cvpSpace="dual"
      cvpEnabled={cvpEnabled}
      {...rest}
    />
  );
});

export default DualLatticeDisplay;
