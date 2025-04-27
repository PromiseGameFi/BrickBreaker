import React from "react";
import "./App.css";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { inAppWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb";

function Wapp() {
  const wallets = [
    inAppWallet({
      auth: { options: ["email", "passkey", "google"] },
      chains: [defineChain(50312)],
      
    }),
   
  ];
  return (
    <div className="app-container">
        <main className="connect-screen">
          <div className="connect-container">
            <h1>Welcome to Brick Breaker</h1>
            <p>Connect your wallet to start playing</p>
            <ConnectButton
              client={client}
              wallets={wallets}
              connectButton={{
                label: "Sign In",
                style: {
                  fontSize:"0.75rem !important",
                  height: "2.5rem !important",
                }
              }}
              chain={defineChain(50312)}
              accountAbstraction={{
                chain: defineChain(50312),
                sponsorGas: true,
              }}
              
              appMetadata={{
                name: "Brick Breaker Game",
                url: window.location.origin,
              }}
            />
          </div>
        </main>
      </div>
  );
}

export default Wapp;