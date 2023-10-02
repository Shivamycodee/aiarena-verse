import React,{useContext,useState,useEffect} from 'react'
import { useAccount } from "wagmi";
import {ethers, providers} from 'ethers'
import ABI from '../src/abi.json'


const walletContext = React.createContext()

const provider = new providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(
  "0x0dF00373c8Be49608111D7B886eD109336575ffE",
  ABI,
  signer
);

export default function WalletContextProvider({children}) {

  const { address, isDisconnected } = useAccount();
  
  const [deposited, setDeposited] = useState("non");
  const [tickets, setTickets] = useState("non-t");
  const [withdrawableBalance, setWithdrawableBalance] = useState("non-w");
  

  const getUserDeposit = async () => {
    try{
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
       const res = await contract.ticket(address);
       setTickets(res.toString());
      }catch(e){
        console.error("ticket 🔴",e);
      }
  };

  const getWithdrawableBalance = async () => {
    try{
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
    const amt = ethers.utils.parseEther("2");
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
    const tx = await contract.Claim(address);
    await tx.wait();
  } catch (e) {
    console.error("Claim failed: ", e);
  }
};

const Play = async (result) => {
  try {
    const tx = await contract.Play(1, result);
    await tx.wait();
  } catch (e) {
    console.error("Play failed: ", e);
  }
};


useEffect(() => {
  getUserDeposit();
  getUserTickets();
  getWithdrawableBalance();
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
        }}
      >
        {children}
      </walletContext.Provider>
    );

} 


export function useGlobalContext(){
    return useContext(walletContext)
}