import React,{useContext,useState,useEffect} from 'react'
import { useAccount } from "wagmi";
import {ethers, providers} from 'ethers'
import ABI from "../src/abi/ticketABI.json";
import RPSABI from "../src/abi/rpsABI.json";
import NFTAbi from '../src/abi/NFTABI.json'


const walletContext = React.createContext()

const getContract = () => {

  if(!window.ethereum) return;

  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    "0x0dF00373c8Be49608111D7B886eD109336575ffE",
    ABI,
    signer
    );  
  return contract;
}

const getRPSContract = () => {
  
    if(!window.ethereum) return;
  
    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xc8e7D019Fd4983692D4746399943AD597EF79Af2",
      RPSABI,
      signer
    );  
    return contract;
  }

export default function WalletContextProvider({children}) {

  const { address, isDisconnected } = useAccount();
  const [deposited, setDeposited] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  

  const getUserDeposit = async () => {
    try{
        const contract = getContract();
        const res = await contract.deposit(address);
        const _amt = ethers.utils.formatEther(res.toString());
        const amt = parseFloat(_amt).toFixed(2);
        setDeposited(amt);
      }catch(e){
        console.error("🔴",e);
      }
  };

  const getUserTickets = async () => {
    try{
        const contract = getContract();
       const res = await contract.ticket(address);
       setTickets(res.toString());
      }catch(e){
        console.error("ticket 🔴",e);
      }
  };

  const getWithdrawableBalance = async () => {
    try{
        const contract = getContract();
        const res = await contract.getRemovalReward(address);
        const _amt = ethers.utils.formatEther(res.toString());
        const amt = parseFloat(_amt).toFixed(2);
        setWithdrawableBalance(amt);
      }catch(e){
        console.error("with-🔴",e);
      }
  };


const Deposit = async () => {
  try {

    const contract = getContract();
    const amt = ethers.utils.parseEther("0.01");
    const tx = await contract.Deposit(amt, {
      value: amt, 
    });
    await tx.wait();
  } catch (e) {
    console.error("Deposit failed: ", e);
  }
};

const Claim = async () => {
  try {
    const contract = getContract();
    const tx = await contract.Claim(address);
    await tx.wait();
  } catch (e) {
    console.error("Claim failed: ", e);
  }
};

const Play = async (result) => {
  try {
    const contract = getContract();
    const tx = await contract.Play(1, result);
    await tx.wait();
  } catch (e) {
    console.error("Play failed: ", e);
  }
};

const getMove = async ()=>{
  try{
    const contract = getRPSContract();
    const res = await contract.Move();
    return res[1];
  }catch(e){
    console.error("getMove failed: ", e);
  }
}

const addNFT = async () => {
  try {
     const provider = new providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const contract = new ethers.Contract(
       "0x7E55a3c33953B0e9A2fD112e37a5ecf77Ce5166e",
       NFTAbi,
       signer
     );

    const tokenMetadata = {
      type: "ERC721",
      options: {
        address: "0x7E55a3c33953B0e9A2fD112e37a5ecf77Ce5166e",
        symbol: "VTX", // Replace with your NFT's symbol
        decimals: 0,
        image: "https://nftstorage.link/ipfs/bafybeifgcy4gm2q6l2ejfjarzdlcgflsmrk3lqdtht3drwjkowbbtcqkeq",
          // "http://theactivephotographer.com/wp-content/uploads/2012/07/TAP_Ad_300x300.jpg",
        tokenId: "2",
        name: "VITNIX-NFT",
        description: "just a cool space nft",
      },
    };

      try {
        // Use MetaMask's `wallet_watchAsset` method
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: tokenMetadata,
        });

        if (wasAdded) {
          console.log("NFT successfully added to MetaMask");
        } else {
          console.log("User chose not to add NFT to MetaMask");
        }
      } catch (error) {
        console.error("Error adding NFT to MetaMask", error);
      }


  
  } catch (e) {
    console.error("addNFT failed: ", e);
  }
};


useEffect(() => {
  if(window.ethereum){
    getUserDeposit();
    getUserTickets();
    getWithdrawableBalance();
  }
  }, [address]);



    return (
      <walletContext.Provider
        value={{
          address,
          isDisconnected,
          deposited,
          tickets,
          withdrawableBalance,
          Deposit,
          Claim,
          Play,
          getMove,
          addNFT,
        }}
      >
        {children}
      </walletContext.Provider>
    );

} 


export function useGlobalContext(){
    return useContext(walletContext)
}