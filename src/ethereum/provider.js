import { ethers } from "ethers";

const { ethereum } = window;
if (!ethereum) {
  console.log("You don't appear to have MM! Install MetaMask!");
} else {
  console.log("Provider detected!", ethereum);
}

ethereum.request({ method: "eth_requestAccounts" });
const provider = new ethers.providers.Web3Provider(ethereum);

export default provider;
