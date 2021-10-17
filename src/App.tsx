import React, { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Clarifai from "clarifai";

import "./App.css";

const app = new Clarifai.App({
  apiKey: "6f6968867f3c4783ac2dd9f11db5bf79",
});

// interface State {
//   input: string;
//   imageUrl: string;
// }

// interface Data {
//   outputs: [];
//   rawData: {};
//   status: {};
// }

const App = () => {
  const [input, setInput] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [box, setBox] = useState<Object | null>(null);
  const [route, setRoute] = useState<string>("signin");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const onRouteChange = (route: string) => {
    if (route === "signout") {
      setIsSignedIn(false);
    } else if (route === "home") {
      setIsSignedIn(true);
    }

    setRoute(route);
  };

  const calculateFaceLocation = (data: any) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image: any = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - face.right_col * width,
      bottomRow: height - face.bottom_row * height,
    };
  };

  const displayFaceBox = (box: Object): void => {
    console.log(box);
    setBox(box);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then((response: Object) =>
        displayFaceBox(calculateFaceLocation(response))
      )
      .catch((err: Error) => console.log(err));
  };

  return (
    <div className="App">
      <Particles
        className="particles"
        params={{
          particles: {
            number: {
              value: 30,
              density: {
                enable: true,
                value_area: 800,
              },
            },
          },
        }}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />{" "}
        </>
      ) : route === "signin" ? (
        <SignIn onRouteChange={onRouteChange} />
      ) : (
        <Register onRouteChange={onRouteChange} />
      )}
    </div>
  );
};

export default App;
