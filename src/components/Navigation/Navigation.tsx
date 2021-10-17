import React from "react";

interface Props {
  onRouteChange: (route: string) => void;
}

const Navigation: React.FC<Props> = ({ onRouteChange }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      <p
        onClick={() => onRouteChange("signin")}
        className="f3 link dim black underline pa3 pointer"
      >
        Sign Out
      </p>
    </nav>
  );
};

export default Navigation;
