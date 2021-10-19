import React from "react";

interface Props {
  name: string;
  entries: number;
}

const Rank: React.FC<Props> = ({ name, entries }) => {
  console.log("name:", name, entries);
  return (
    <div>
      <div className="white f3">{name}, your current rank is ...</div>
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
