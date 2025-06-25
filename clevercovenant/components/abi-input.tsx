"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AbiSchema, type Abi } from "@/lib/schemas";
import { AlertCircle, Upload } from "lucide-react";

interface AbiInputProps {
  onAbiParsed: (abi: Abi) => void;
}

export function AbiInput({ onAbiParsed }: AbiInputProps) {
  const [abiText, setAbiText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleParseAbi = async () => {
    if (!abiText.trim()) {
      setError("Please enter an ABI");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsed = JSON.parse(abiText);
      const validatedAbi = AbiSchema.parse(parsed);
      onAbiParsed(validatedAbi);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format");
      } else {
        setError("Invalid ABI format");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    const sampleAbi = `[
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "_owner", "type": "address" },
      { "name": "_spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "remaining", "type": "uint256" }],
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "owner", "type": "address" },
      { "indexed": true, "name": "spender", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  }
]
`;
    setAbiText(sampleAbi);
  };

  return (
    <Card className="bg-navy-800 border-navy-600">
      <CardHeader>
        <CardTitle className="text-white font-mono">
          Smart Contract ABI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            id="abi-textarea"
            placeholder="Paste your Smart Contract ABI here..."
            value={abiText}
            onChange={(e) => setAbiText(e.target.value)}
            className="min-h-[200px] bg-navy-900 border-navy-600 text-white font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            aria-describedby={error ? "abi-error" : "abi-help"}
            aria-invalid={error ? "true" : "false"}
          />
        </div>

        {error && (
          <Alert className="bg-red-900/20 border-red-700" role="alert">
            <AlertCircle className="h-4 w-4 text-red-400" aria-hidden="true" />
            <AlertDescription id="abi-error" className="text-red-300 font-mono">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2" role="group" aria-label="ABI actions">
          <Button
            onClick={handleParseAbi}
            disabled={isLoading}
            className="bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800"
            aria-describedby="parse-button-help"
          >
            <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
            {isLoading ? "Parsing..." : "Parse ABI"}
          </Button>
          <div id="parse-button-help" className="sr-only">
            Parse the entered ABI JSON to display contract functions
          </div>

          <Button
            onClick={handleLoadSample}
            className="bg-navy-700 hover:bg-navy-600 text-white border border-navy-600 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800"
            aria-label="Load sample ABI for demonstration"
          >
            Load Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
