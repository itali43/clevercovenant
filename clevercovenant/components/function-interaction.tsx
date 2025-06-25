"use client";

import { useState, useEffect } from "react";
import type { AbiFunction, AbiInput } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseAbiParameter } from "viem";

interface FunctionInteractionProps {
  func: AbiFunction;
  contractAddress: string;
}

export function FunctionInteraction({
  func,
  contractAddress,
}: FunctionInteractionProps) {
  const [mounted, setMounted] = useState(false);

  // Only run hooks after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const isViewFunction =
    func.stateMutability === "view" || func.stateMutability === "pure";

  // For read functions (view/pure)
  const {
    data: readData,
    error: readError,
    isLoading: readLoading,
    refetch: readContract,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: [func],
    functionName: func.name!,
    args: func.inputs.map((input) => formatInput(input, inputs[input.name])),
    query: {
      enabled: false, // Don't auto-execute
    },
  });

  // For write functions (non-view)
  const {
    data: hash,
    error: writeError,
    isPending,
    writeContract,
  } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Don't render anything until mounted on client
  if (!mounted) return null;

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const formatInput = (input: AbiInput, value: string) => {
    if (!value) return undefined;

    try {
      // Handle common Ethereum types
      if (input.type === "address") return value;
      if (input.type === "uint256" || input.type === "int256")
        return BigInt(value);
      if (input.type === "bool") return value.toLowerCase() === "true";
      if (input.type.startsWith("bytes")) return value as `0x${string}`;
      if (input.type === "string") return value;
      if (input.type.includes("[]")) return JSON.parse(value); // Array inputs

      // For other types, try to parse as ABI parameter
      return parseAbiParameter(input.type);
    } catch (err) {
      console.error(`Error formatting input for ${input.type}:`, err);
      return value;
    }
  };

  const handleExecute = async () => {
    try {
      setError(null);
      setResult(null);

      // Validate all required inputs are present
      const missingInputs = func.inputs
        .filter((input) => !inputs[input.name])
        .map((input) => input.name);

      if (missingInputs.length > 0) {
        setError(`Missing required inputs: ${missingInputs.join(", ")}`);
        return;
      }

      if (isViewFunction) {
        const result = await readContract();
        setResult(result);
      } else {
        const args = func.inputs.map((input) =>
          formatInput(input, inputs[input.name])
        );
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: [func],
          functionName: func.name!,
          args,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error executing function");
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-navy-600">
      {/* Input Fields */}
      {func.inputs.length > 0 && (
        <div className="space-y-2">
          {func.inputs.map((input) => (
            <div key={input.name} className="flex flex-col gap-1">
              <label className="text-sm text-cyan-400 font-mono">
                {input.name} ({input.type})
              </label>
              <Input
                placeholder={`Enter ${input.type}`}
                value={inputs[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                className="bg-navy-900 border-navy-600 text-white font-mono text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {(error || readError || writeError) && (
        <Alert className="bg-red-900/20 border-red-700">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300 font-mono">
            {error ||
              readError?.message ||
              writeError?.message ||
              "Error executing function"}
          </AlertDescription>
        </Alert>
      )}

      {/* Result Display */}
      {result && (
        <Alert className="bg-green-900/20 border-green-700">
          <AlertDescription className="text-green-300 font-mono break-all">
            Result: {JSON.stringify(result)}
          </AlertDescription>
        </Alert>
      )}

      {/* Transaction Status */}
      {hash && (
        <Alert className="bg-green-900/20 border-green-700">
          <AlertDescription className="text-green-300 font-mono">
            Transaction Hash: {hash}
            {isConfirming && " (Confirming...)"}
            {isConfirmed && " (Confirmed!)"}
          </AlertDescription>
        </Alert>
      )}

      {/* Execute Button */}
      <Button
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono"
        onClick={handleExecute}
        disabled={isPending || isConfirming || readLoading}
      >
        {isPending || isConfirming || readLoading
          ? "Processing..."
          : isViewFunction
          ? "Read Contract"
          : "Execute Transaction"}
      </Button>
    </div>
  );
}
