import { useEffect, useState } from "react";
import { nftaddress, marketplaceaddress } from "../config";
import { ethers } from "ethers";
import NFT from "../contract-abis/NFT.json";
import Marketplace from "../contract-abis/Marketplace.json";
import Wallet from "../components/Wallet";

const Contracts = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState<boolean>(false);
  const [nftContract, setNftContract] = useState({});
  const [marketContract, setMarketContract] = useState({});
  const [signer, setSigner] = useState<any>();

  const initialiseContracts = async () => {
    if (signer != undefined) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
      const marketContract = new ethers.Contract(
        marketplaceaddress,
        Marketplace.abi,
        signer
      );
      console.log("nft: ", nftContract);
      console.log("marketplace: ", marketContract);
      setNftContract(nftContract);
      setMarketContract(marketContract);
    } else {
      console.log("connect metamask");
    }
  };

  useEffect(() => {
    initialiseContracts();
  }, [walletAddress]);

  return (
    <div className="text-white">
      test contract
      <Wallet
        setWalletAddress={setWalletAddress}
        setSigner={setSigner}
        setConnected={setConnected}
        connected={connected}
      />
    </div>
  );
};

export default Contracts;
