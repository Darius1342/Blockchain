import React from "react";

const HomePage = ({ account }) => {
  return (
    <div>
      <h2>Welcome to the Voting System,</h2>
      <p>{account}</p>
    </div>
  );
};

export default HomePage;