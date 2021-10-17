import React from "react";
import "./FaceRecognition.css";

interface Props {
  imageUrl: any;
  box: any;
}

const FaceRecognition: React.FC<Props> = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputImage"
          src={imageUrl}
          alt=""
          width="500px"
          height="auto"
        />

        {box ? (
          <div
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ) : null}
      </div>
    </div>
  );
};

export default FaceRecognition;
