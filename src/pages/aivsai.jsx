import React from 'react'
import Lottie from "lottie-react";
import CommingSoon from '../assets/comming-soon.json'

function AiVsAi() {
  return (
    <>
      <Lottie
        style={{ 
        width: "min(100%, 800px)",
        margin:"auto" 
      }}
        animationData={CommingSoon}
      />
    </>
  );
}

export default AiVsAi