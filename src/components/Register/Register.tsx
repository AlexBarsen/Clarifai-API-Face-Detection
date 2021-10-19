import React, { useState } from "react";

interface Props {
  onRouteChange: (route: string) => void;
  loadUser: (user: User) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  entries: number;
  joined: Date;
}

interface InputValues {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC<Props> = ({ onRouteChange, loadUser }) => {
  const [inputValues, setinputValues] = useState<InputValues>({
    name: "",
    email: "",
    password: "",
  });

  const onInputChange = (event: any) => {
    const { name, value } = event.target;

    setinputValues({ ...inputValues, [name]: value });
  };

  const onSubmit = (event: any) => {
    event.preventDefault();

    fetch("http://localhost:3000/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user) {
          loadUser(user);
          onRouteChange("home");
        } else {
        }
      });
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Name
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                id="name"
                onChange={onInputChange}
              />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email"
                id="email"
                onChange={onInputChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={onInputChange}
              />
            </div>
          </fieldset>
          <div className="">
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Register"
              onClick={onSubmit}
            />
          </div>
        </form>
      </main>
    </article>
  );
};

export default Register;
