import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";

const Wallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState<Boolean>(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is present");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const connectedAddress = await signer.getAddress();
      console.log("Connected Wallet: ", connectedAddress);
      setWalletAddress(connectedAddress);
      setConnected(true);
    } else {
      alert("Please install Metamask");
    }
  };

  const disconnectWallet = async () => {
    setWalletAddress("");
    setConnected(false);
  };

  return (
    <div>
      {connected ? (
        <>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Wallet;
