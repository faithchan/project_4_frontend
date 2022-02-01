import { ethers } from "ethers";
import Web3Modal from "web3modal";

interface WalletProps {
  setWalletAddress: (a: string) => void;
  setSigner: (a: object) => void;
  setConnected: (a: boolean) => void;
  connected: boolean;
}

const Wallet = (props: WalletProps) => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is present");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const connectedAddress = await signer.getAddress();
      console.log("Connected Wallet: ", connectedAddress);
      console.log("signer: ", signer);
      props.setSigner(signer);
      props.setWalletAddress(connectedAddress);
      props.setConnected(true);
    } else {
      alert("Please install Metamask");
    }
  };

  const disconnectWallet = async () => {
    props.setWalletAddress("");
    props.setConnected(false);
  };

  return (
    <div>
      {props.connected ? (
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
