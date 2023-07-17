import React from "react";

const InfoPage = ({ account, ethBalance, web3}) => {
  return (
    <div>
      <h2>Information</h2>
      <p>ETH Balance: {web3 && web3.utils.fromWei(ethBalance.toString(), "ether")} ETH</p>
      <p>Public Key: {account}</p>
    </div>
  );
};

export default InfoPage;