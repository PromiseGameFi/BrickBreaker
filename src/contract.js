import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./client";

export const contractAddress = "0x6A428Dd0Fea0c303933fe661dd40ecC83F9Fa305";

export const GameContract = getContract({
    client: client,
    chain: defineChain(50312),
    address: contractAddress,
})