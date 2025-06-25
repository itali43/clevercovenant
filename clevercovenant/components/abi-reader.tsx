"use client";

import { useState } from "react";
import { AbiInput } from "./abi-input";
import { ContractAddressInput } from "./contract-address-input";
import { FunctionDisplay } from "./function-display";
import { groupFunctionsByType } from "@/lib/abi-utils";
import type { Abi } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import {
  mainnet,
  sepolia,
  base,
  arbitrum,
  optimism,
  polygon,
  avalanche,
} from "wagmi/chains";

// Chain name mapping
const chainNames: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [sepolia.id]: "Sepolia",
  [base.id]: "Base",
  [arbitrum.id]: "Arbitrum",
  [optimism.id]: "Optimism",
  [polygon.id]: "Polygon",
  [avalanche.id]: "Avalanche",
};

// Chain color mapping for visual distinction
const getChainColor = (chainId: number): string => {
  switch (chainId) {
    case mainnet.id:
      return "text-blue-400 border-blue-400";
    case base.id:
      return "text-cyan-400 border-cyan-400";
    case arbitrum.id:
      return "text-blue-500 border-blue-500";
    case optimism.id:
      return "text-red-400 border-red-400";
    case polygon.id:
      return "text-purple-400 border-purple-400";
    case avalanche.id:
      return "text-red-500 border-red-500";
    default:
      return "text-gray-400 border-gray-400";
  }
};

type Mode = "parse" | "interact";

export function AbiReader() {
  const [mode, setMode] = useState<Mode>("parse");
  const [parsedAbi, setParsedAbi] = useState<Abi | null>(null);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { address, isConnected } = useAccount();
  const { connectors, connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const handleAbiParsed = (abi: Abi) => {
    setParsedAbi(abi);
  };

  const handleAddressSubmitted = (address: string) => {
    setContractAddress(address);
  };

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      setShowWalletModal(false);
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  const groupedFunctions = parsedAbi ? groupFunctionsByType(parsedAbi) : {};
  const functionTypes = Object.keys(groupedFunctions);

  // Format address for display
  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="min-h-screen bg-navy-900">
      <header className="border-b border-navy-700 bg-navy-800" role="banner">
        <div className="container mx-auto px-4 py-4">
          <div className="relative flex items-center">
            <nav role="navigation" aria-label="Main navigation">
              <ul className="flex items-center gap-8 list-none">
                <li>
                  <Button
                    variant={mode === "parse" ? "default" : "ghost"}
                    className={
                      mode === "parse"
                        ? "bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono"
                        : "text-white hover:text-cyan-400 font-mono"
                    }
                    onClick={() => setMode("parse")}
                  >
                    Parse
                  </Button>
                </li>
                <li>
                  <Button
                    variant={mode === "interact" ? "default" : "ghost"}
                    className={
                      mode === "interact"
                        ? "bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono"
                        : "text-white hover:text-cyan-400 font-mono"
                    }
                    onClick={() => setMode("interact")}
                  >
                    Interact
                  </Button>
                </li>
              </ul>
            </nav>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-mono text-white">
                📜 Clever Covenant 📜
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {isConnected && chainId && (
                <Badge
                  variant="outline"
                  className={`bg-navy-700 font-mono ${getChainColor(chainId)}`}
                >
                  {chainNames[chainId] || "Unsupported Chain"}
                </Badge>
              )}
              {isConnected ? (
                <Button
                  className="bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono font-semibold border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800"
                  onClick={() => disconnect()}
                >
                  {displayAddress}
                </Button>
              ) : (
                <Button
                  className="bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono font-semibold border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800"
                  onClick={() => setShowWalletModal(true)}
                >
                  🔗 Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showWalletModal && !isConnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-navy-800 border border-navy-600 rounded-lg shadow-lg p-6 min-w-[320px] max-w-xs">
            <h3 className="text-white font-mono text-lg mb-4">Select Wallet</h3>
            {connectError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
                {connectError.message}
              </div>
            )}
            <ul className="space-y-2">
              {connectors.map((connector) => (
                <li key={connector.id}>
                  <Button
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono font-semibold border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800"
                    onClick={() => handleConnect(connector)}
                  >
                    {connector.name}
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full bg-navy-700 hover:bg-navy-600 text-white border border-navy-600 font-mono"
              onClick={() => setShowWalletModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <main role="main" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section aria-labelledby="intro-heading">
            <div className="text-center mb-8">
              <p
                id="intro-heading"
                className="text-2xl font-mono text-white leading-relaxed"
              >
                {mode === "parse"
                  ? "Read your Contract ABI"
                  : "Interact with a Contract"}
              </p>
            </div>
          </section>

          {mode === "interact" && (
            <section aria-labelledby="contract-address-section">
              <h2 id="contract-address-section" className="sr-only">
                Contract Address Input
              </h2>
              <ContractAddressInput
                onAddressSubmitted={handleAddressSubmitted}
              />
            </section>
          )}

          <section aria-labelledby="abi-input-section">
            <h2 id="abi-input-section" className="sr-only">
              ABI Input Section
            </h2>
            <AbiInput onAbiParsed={handleAbiParsed} />
          </section>

          {parsedAbi && (
            <section aria-labelledby="parsed-functions-heading">
              <Card className="bg-navy-800 border-navy-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-mono">
                      {mode === "parse"
                        ? "Parsed Functions"
                        : "Contract Functions"}{" "}
                      ({parsedAbi.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      {functionTypes.map((type) => (
                        <Badge
                          key={type}
                          className="bg-navy-700 text-cyan-400 border-cyan-400 font-mono"
                        >
                          {type} ({groupedFunctions[type].length})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {functionTypes.length > 0 ? (
                    <Tabs defaultValue={functionTypes[0]} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-navy-700 border-navy-600">
                        {functionTypes.map((type) => (
                          <TabsTrigger
                            key={type}
                            value={type}
                            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-navy-900 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-700"
                          >
                            {type}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {functionTypes.map((type) => (
                        <TabsContent key={type} value={type} className="mt-6">
                          <div className="grid gap-4">
                            {groupedFunctions[type].map((func, index) => (
                              <FunctionDisplay
                                key={index}
                                func={func}
                                mode={mode}
                                contractAddress={
                                  mode === "interact"
                                    ? contractAddress
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="text-center py-8 text-white font-mono">
                      No functions found in the ABI
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
