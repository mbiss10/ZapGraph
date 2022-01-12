import { ethers } from "ethers";
import { contractAddress } from "./contractAddress.json";
import ZapGraph from "../artifacts/contracts/ZapGraph.sol/ZapGraph.json";

const address = contractAddress;
const contractPromise = new ethers.Contract(address, ZapGraph.abi);
export default contractPromise;
