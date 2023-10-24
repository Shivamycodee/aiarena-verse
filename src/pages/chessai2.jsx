// import { useFilePicker } from "use-file-picker";
import { FilePicker,ImagePicker } from "react-file-picker";
import React from 'react'
import "../styles/chessai2.css"


export default function Chessai2() {

  //  const { openFilePicker, filesContent, loading } = useFilePicker({
  //    accept: ".png",
  //  });



  return (
    <>
      <div className="drive-holder">
        <div className="fileUpload">
          <div id="upSection">
            <div id="upTitle">
              <p> Upload your model here... </p>
              <hr />
            </div>
            <div id="upInput">
              <img
                alt="upload"
                src="https://100dayscss.com/codepen/upload.svg"
              ></img>
              <input
                onChange={(event) => fetchFile(event)}
                id="myFile"
                name="myFile"
                type="file"
                required
              ></input>
            </div>
            <div id="upBtn">
              <button
                onClick={() => display()}
                data-label="Register"
                className="rainbow-hover"
              >
                <span className="sp">Upload 📁</span>
              </button>
            </div>
          </div>
        </div>

        <div className="fileUpload">
          <div id="upSection">
            <div id="upTitle">
              <p> Upload your model here... </p>
              <hr />
            </div>
            <div id="upInput">
              <img
                alt="upload"
                src="https://100dayscss.com/codepen/upload.svg"
              ></img>
              <input
                onChange={(event) => fetchFile(event)}
                id="myFile"
                name="myFile"
                type="file"
                required
              ></input>
            </div>
            <div id="upBtn">
              <button
                onClick={() => display()}
                data-label="Register"
                className="rainbow-hover"
              >
                <span className="sp">Upload 📁</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
