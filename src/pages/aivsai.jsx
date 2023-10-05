import React from 'react'
import Lottie from "lottie-react";
import CommingSoon from '../assets/comming-soon.json'

function AiVsAi() {
  return (
    <>
      <Lottie
        style={{ width: "40%",margin:"auto" }}
        animationData={CommingSoon}
      />
    </>
  );
}

export default AiVsAi