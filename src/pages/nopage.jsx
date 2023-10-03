import React from 'react'
import Lottie from "lottie-react";
import PageNotFound from "../assets/pagenotfound.json";

function Nopage() {
  return (
    <div>
      <Lottie
        style={{ width: "80%", height: "80%" }}
        animationData={PageNotFound}
      />
    </div>
  );
}

export default Nopage