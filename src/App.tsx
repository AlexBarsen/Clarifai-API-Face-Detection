import React, { useState, useEffect } from "react";
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
import { render } from "@testing-library/react";

const app = new Clarifai.App({
  apiKey: "6f6968867f3c4783ac2dd9f11db5bf79",
});

interface Props {}

interface State {
  input: string;
  imageUrl: string;
  box: Object;
  route: string;
  isSignedIn: boolean;
  user: User;
}

interface User {
  id: number | null;
  name: string;
  email: string;
  entries: number;
  joined: Date | null;
}

const initialState: State = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: null,
    name: "",
    email: "",
    entries: 0,
    joined: null,
  },
};

class App extends React.Component<Props, State> {
  constructor(props: State) {
    super(props);
    this.state = initialState;
  }

  onRouteChange = (route: string) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }

    this.setState({ route: route });
  };

  calculateFaceLocation = (data: any) => {
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

  displayFaceBox = (box: Object): void => {
    this.setState({ box: box });
  };

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response: Object) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err: Error) => console.log(err));
  };

  loadUser = (userData: User) => {
    this.setState({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        entries: userData.entries,
        joined: userData.joined,
      },
    });
  };

  render() {
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
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />{" "}
          </>
        ) : this.state.route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;

// const App = () => {
//   const [state, setState] = useState<State>({
//     input: "",
//     imageUrl: "",
//     box: {},
//     route: "signin",
//     isSignedIn: false,
//     user: {
//       id: null,
//       name: "",
//       email: "",
//       entries: 0,
//       joined: null,
//     },
//   });

//   const onRouteChange = (route: string) => {
//     if (route === "signout") {
//       setState({ ...state, isSignedIn: false });
//     } else if (route === "home") {
//       setState({ ...state, isSignedIn: true });
//     }

//     setState((prevState) => ({ ...prevState, route: route }));
//   };

//   const calculateFaceLocation = (data: any) => {
//     const face = data.outputs[0].data.regions[0].region_info.bounding_box;
//     const image: any = document.getElementById("inputImage");
//     const width = Number(image.width);
//     const height = Number(image.height);

//     return {
//       leftCol: face.left_col * width,
//       topRow: face.top_row * height,
//       rightCol: width - face.right_col * width,
//       bottomRow: height - face.bottom_row * height,
//     };
//   };

//   const displayFaceBox = (box: Object): void => {
//     setState({ ...state, box: box });
//   };

//   const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setState({ ...state, input: event.target.value });
//   };

//   const onPictureSubmit = () => {
//     const { input } = state;
//     setState({ ...state, imageUrl: input });
//     app.models
//       .predict(Clarifai.FACE_DETECT_MODEL, input)
//       .then((response: Object) => {
//         if (response) {
//           fetch("http://localhost:3000/image", {
//             method: "post",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               id: state.user.id,
//             }),
//           });
//         }
//         displayFaceBox(calculateFaceLocation(response));
//       })
//       .catch((err: Error) => console.log(err));
//   };

//   const loadUser = (userData: User) => {
//     const { id, name, email, entries, joined } = userData;

//     setState((prevState) => ({
//       ...prevState,
//       user: {
//         id: userData.id,
//         name: userData.name,
//         email: userData.email,
//         entries: userData.entries,
//         joined: userData.joined,
//       },
//     }));
//   };

//   const { isSignedIn, route, box, imageUrl, user } = state;
//   console.log(state);
//   return (
//     <div className="App">
//       <Particles
//         className="particles"
//         params={{
//           particles: {
//             number: {
//               value: 30,
//               density: {
//                 enable: true,
//                 value_area: 800,
//               },
//             },
//           },
//         }}
//       />
//       <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
//       {route === "home" ? (
//         <>
//           <Logo />
//           <Rank name={user.name} entries={user.entries} />
//           <ImageLinkForm
//             onInputChange={onInputChange}
//             onPictureSubmit={onPictureSubmit}
//           />
//           <FaceRecognition box={box} imageUrl={imageUrl} />{" "}
//         </>
//       ) : route === "signin" ? (
//         <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
//       ) : (
//         <Register loadUser={loadUser} onRouteChange={onRouteChange} />
//       )}
//     </div>
//   );
// };
