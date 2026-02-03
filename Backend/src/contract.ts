import {ethers} from 'ethers';
import dotenv from 'dotenv';
import ContractAbi from '../ABIs/Voting.json' with { type: "json" };
dotenv.config();
const RPC_URL = process.env.RPC_URL;
const META_PRIVATE_KEY = process.env.META_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const MNEOMONICString = process.env.MNEOMONIC;

if(RPC_URL === undefined){
    throw new Error("RPC_URL is not defined")
}
if(META_PRIVATE_KEY === undefined){
    throw new Error("META_PRIVATE_KEY is not defined")
}
if(CONTRACT_ADDRESS === undefined){
    throw new Error("CONTRACT_ADDRESS is not defined");
}
if(MNEOMONICString === undefined){
    throw new Error("MNEOMONIC is not defined");
}
const MNEOMONIC = ethers.Mnemonic.fromPhrase(MNEOMONICString);

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(META_PRIVATE_KEY,provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS,ContractAbi.abi,wallet);

export const startElection = async (duration : number) => {
    const txn = await contract.startElection(duration);
    await txn.wait();
    console.log(txn);
    return txn.hash;
}

export const endElection = async () => {
    const txn = await contract.endElection();
    await txn.wait();
    return txn.hash;
}

export const results = async () => {
    const txn = await contract.results();
    await txn.wait();
    return {
         winningPartyId : Number(txn[0]),
         winningPartyName : txn[1], 
         highestVotes : Number(txn[2])
        }
}

export const resetElection = async () => {
    const txn = await contract.resetElection();
    await txn.wait();
    return txn.hash;
}

export const addParty = async (partyIndex : number,partyName : string) =>{
    const txn = await contract.addParty(partyIndex ,partyName);
    await txn.wait();
    return txn.hash;
}

export const removeParty = async (partyIndex : number) => {
    const txn = await contract.removeParty(partyIndex);
    await txn.wait();
    return txn.hash;
}

export const registerVoter = async (voterIndex : number) => {
    const hdNode = ethers.HDNodeWallet.fromMnemonic(MNEOMONIC,`m/44'/60'/0'/0/${voterIndex}`);
    const voterAddress = hdNode.address;
    const txn = await contract.registerVoter(voterAddress);
    await txn.wait();
    return txn.hash;
}

export const blockVoter = async (voterIndex : number) => {
    const hdNode = ethers.HDNodeWallet.fromMnemonic(MNEOMONIC,`m/44'/60'/0'/0/${voterIndex}`);
    const voterAddress = hdNode.address;
    const txn = await contract.blockVoter(voterAddress);
    await txn.wait();
    return txn.hash;
}

export const unblockVoter = async(voterIndex : number) => {
    const hdNode = ethers.HDNodeWallet.fromMnemonic(MNEOMONIC,`m/44'/60'/0'/0/${voterIndex}`);
    const voterAddress = hdNode.address;
    const txn = await contract.unblockVoter(voterAddress);
    await txn.wait();
    return txn.hash;
}

export const mintTokens = async(voterIndex : number) => {
    const hdNode = ethers.HDNodeWallet.fromMnemonic(MNEOMONIC,`m/44'/60'/0'/0/${voterIndex}`);
    const voterAddress = hdNode.address;
    const txn = await contract.mintTokens(voterAddress);
    await txn.wait();
    return txn.hash;
}

export const distributeTokens = async() => {
    const txn = await contract.distributeTokens();
    await txn.wait();
    return txn.hash;
}

export const vote = async (partyId : number, voterIndex : number) =>{
    const hdNode = ethers.HDNodeWallet.fromMnemonic(MNEOMONIC,`m/44'/60'/0'/0/${voterIndex}`);
    const privateKey = hdNode.privateKey;
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS,ContractAbi.abi, signer);
    const txn = await contract.vote(partyId);
    
    await txn.wait();
    return txn.hash;
}

export const getPartyStatus = async(partyIndex : number) => {
    try {
        const txn = await contract.getPartyStatus(partyIndex);
        return{
            id : Number(txn[0]),
            name : txn[1],
            voteCount : Number(txn[2]),
            exists : txn[3]
        }
    } catch (error) {
        return{
            id : 0,
            name : "",
            voteCount : 0,
            exists : false
        }
    }
    
}

export const getVoterStatus = async(voterIndex : number) => {
    const hdNode = ethers.HDNodeWallet.fromMnemonic(MNEOMONIC,`m/44'/60'/0'/0/${voterIndex}`);
    const voterAddress = hdNode.address;
    try {
        const txn = await contract.getVoterStatus(voterAddress);
        return {
            isRegistered : txn[0],
            isBlocked : txn[1],
            hasVoted : txn[2],
            allocatedTokens : Number(txn[3])
        }
    } catch (error) {
        return{
            isRegistered : false,
            isBlocked : false,
            hasVoted : false,
            allocatedTokens : 0
        }
    }
    
}

export const getTotalVotes = async() => {
    try {
        const txn = await contract.getTotalVotes();
        return Number(txn);
    } catch (error) {
        return 0;
    }
    
}

export const getTotalVoters = async () => {
    try {
        const txn = await contract.getTotalVoters();
        return Number(txn);
    } catch (error) {
        return 0;
    }
}

export const getTotalParties = async () => {
    try {
        const txn = await contract.getTotalParties();
        return Number(txn);
    } catch (error) {
        return 0;
    }

}

export const getVoterAddresses = async () => {
    try {
        const txn = await contract.getVoterAddresses();
        return txn;
    } catch (error) {
        return [];
    }
    
}